// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./InvoiceNFT.sol";

/**
 * @title Factra
 * @notice Core invoice factoring logic:
 * - createInvoice: stores invoice and mints NFT to issuer
 * - fundInvoice: buyer pays discounted amount, funds forwarded to issuer, NFT transfers issuer->buyer
 * - listInvoiceForSale / cancelListing / buyListedInvoice: resale marketplace primitives
 * - markAsPaid: buyer marks paid, NFT burned
 */
contract Factra is ReentrancyGuard {
    uint256 public invoiceCounter;
    InvoiceNFT public invoiceNFT; // NFT contract instance

    enum InvoiceStatus {
        Created,
        Funded,
        Paid
    }

    struct Invoice {
        uint256 id;
        address payable issuer;
        address payable buyer;
        uint256 amount; // in wei (or satoshi-equivalent unit for your L2)
        uint256 dueDate;
        InvoiceStatus status;
        string businessName;
        string sector;
        uint8 rating; // out of 5 (or 0-100 scaled)
        uint8 discountRate; // percentage
    }

    // Optional marketplace listing (price in native token)
    mapping(uint256 => uint256) public listingPrice; // invoiceId => price (0 = not listed)

    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed id,
        address indexed issuer,
        uint256 amount,
        uint256 dueDate,
        string businessName,
        string sector,
        uint8 rating,
        uint8 discountRate,
        uint256 tokenId
    );
    event InvoiceFunded(
        uint256 indexed id,
        address indexed buyer,
        uint256 amount,
        uint256 tokenId
    );
    event InvoiceListed(uint256 indexed id, address indexed seller, uint256 price);
    event InvoiceSaleCancelled(uint256 indexed id, address indexed seller);
    event InvoiceResold(uint256 indexed id, address indexed oldBuyer, address indexed newBuyer, uint256 price, uint256 tokenId);
    event InvoicePaid(uint256 indexed id);

    constructor(address _invoiceNFT) {
        require(_invoiceNFT != address(0), "Invalid InvoiceNFT address");
        invoiceNFT = InvoiceNFT(_invoiceNFT);
    }

    /**
     * @notice Create an invoice and mint an NFT to the issuer.
     * tokenURI should point to the invoice metadata JSON (IPFS/Arweave).
     */
    function createInvoice(
        uint256 amount,
        uint256 dueDate,
        string memory businessName,
        string memory sector,
        uint8 rating,
        uint8 discountRate,
        string memory tokenURI
    ) external returns (uint256) {
        require(amount > 0, "Amount must be > 0");
        require(dueDate > block.timestamp, "Due date must be in future");

        invoiceCounter++;
        uint256 id = invoiceCounter;

        invoices[id] = Invoice({
            id: id,
            issuer: payable(msg.sender),
            buyer: payable(address(0)),
            amount: amount,
            dueDate: dueDate,
            status: InvoiceStatus.Created,
            businessName: businessName,
            sector: sector,
            rating: rating,
            discountRate: discountRate
        });

        // Mint NFT to seller (issuer). invoiceNFT must have factraContract set to this contract.
        uint256 tokenId = invoiceNFT.mintInvoice(msg.sender, id, tokenURI);

        emit InvoiceCreated(id, msg.sender, amount, dueDate, businessName, sector, rating, discountRate, tokenId);
        return id;
    }

    /**
     * @notice Fund an invoice by paying the discounted amount. NFT is transferred issuer -> buyer.
     * For BTC-native platform you'll wire the BTC escrow mechanism; here it's modeled as native value (msg.value).
     */
    function fundInvoice(uint256 id) external payable nonReentrant {
        Invoice storage inv = invoices[id];
        require(inv.status == InvoiceStatus.Created, "Already funded or invalid");

        // Calculate discounted amount
        uint256 discountedAmount = inv.amount - ((inv.amount * inv.discountRate) / 100);
        require(msg.value == discountedAmount, "Incorrect discounted funding amount");

        // CHECKS -> EFFECTS
        address payable seller = inv.issuer;
        inv.buyer = payable(msg.sender);
        inv.status = InvoiceStatus.Funded;

        // INTERACTIONS: forward funds to issuer using .call
        (bool sent, ) = seller.call{value: msg.value}("");
        require(sent, "Failed to transfer funds to issuer");

        // Transfer the invoice NFT from issuer -> buyer so buyer owns the payment right
        uint256 tokenId = invoiceNFT.tokenOfInvoice(id);
        if (tokenId != 0) {
            invoiceNFT.transferInvoiceTo(tokenId, seller, msg.sender);
        }

        emit InvoiceFunded(id, msg.sender, msg.value, tokenId);
    }

    /**
     * @notice List a funded invoice for sale at `price`. Only current buyer may list.
     */
    function listInvoiceForSale(uint256 id, uint256 price) external {
        Invoice storage inv = invoices[id];
        require(inv.status == InvoiceStatus.Funded, "Invoice not funded");
        require(inv.buyer == msg.sender, "Only buyer can list");
        require(price > 0, "Price must be > 0");

        listingPrice[id] = price;
        emit InvoiceListed(id, msg.sender, price);
    }

    /**
     * @notice Cancel a listing. Only current buyer may cancel.
     */
    function cancelListing(uint256 id) external {
        Invoice storage inv = invoices[id];
        require(inv.status == InvoiceStatus.Funded, "Invoice not funded");
        require(inv.buyer == msg.sender, "Only buyer can cancel");

        listingPrice[id] = 0;
        emit InvoiceSaleCancelled(id, msg.sender);
    }

    /**
     * @notice Buy a listed invoice. Payable function that transfers ETH to current buyer and NFT -> new buyer.
     * Price must match listingPrice[id].
     */
    function buyListedInvoice(uint256 id) external payable nonReentrant {
        Invoice storage inv = invoices[id];
        require(inv.status == InvoiceStatus.Funded, "Invoice not funded");

        uint256 price = listingPrice[id];
        require(price > 0, "Invoice not listed");
        require(msg.value == price, "Incorrect payment amount");

        address payable currentBuyer = inv.buyer;
        address payable newBuyer = payable(msg.sender);

        uint256 tokenId = invoiceNFT.tokenOfInvoice(id);
        require(tokenId != 0, "NFT not found");

        // EFFECTS: update buyer & clear listing before external calls
        inv.buyer = newBuyer;
        listingPrice[id] = 0;

        // INTERACTIONS: transfer payment to previous buyer
        (bool sent, ) = currentBuyer.call{value: msg.value}("");
        require(sent, "Failed to transfer payment to seller");

        // Transfer NFT ownership via InvoiceNFT helper
        invoiceNFT.transferInvoiceTo(tokenId, currentBuyer, newBuyer);

        emit InvoiceResold(id, currentBuyer, newBuyer, price, tokenId);
    }

    /**
     * @notice Mark invoice as paid. Only buyer can call.
     * Burns the NFT so it cannot be claimed again.
     */
    function markAsPaid(uint256 id) external nonReentrant {
        Invoice storage inv = invoices[id];
        require(msg.sender == inv.buyer, "Only buyer can mark paid");
        require(inv.status == InvoiceStatus.Funded, "Invoice not funded");

        inv.status = InvoiceStatus.Paid;

        // Burn NFT (if exists)
        uint256 tokenId = invoiceNFT.tokenOfInvoice(id);
        if (tokenId != 0) {
            invoiceNFT.burnInvoice(tokenId);
        }

        emit InvoicePaid(id);
    }

    /* ---------- View helpers ---------- */

    function getInvoice(uint256 id)
        external
        view
        returns (
            uint256,
            address,
            address,
            uint256,
            uint256,
            InvoiceStatus,
            string memory,
            string memory,
            uint8,
            uint8
        )
    {
        Invoice memory inv = invoices[id];
        return (
            inv.id,
            inv.issuer,
            inv.buyer,
            inv.amount,
            inv.dueDate,
            inv.status,
            inv.businessName,
            inv.sector,
            inv.rating,
            inv.discountRate
        );
    }

    function getInvoiceCount() external view returns (uint256) {
        return invoiceCounter;
    }
}
