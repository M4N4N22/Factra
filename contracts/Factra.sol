// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "hardhat/console.sol";


contract Factra {
    uint256 public invoiceCounter;

    enum InvoiceStatus {
        Created,
        Funded,
        Paid
    }

    struct Invoice {
        uint256 id;
        address payable issuer;
        address payable buyer;
        uint256 amount; // in wei
        uint256 dueDate;
        InvoiceStatus status;
        string businessName;
        string sector;
        uint8 rating; // out of 5, e.g. 42 = 4.2
        uint8 discountRate; // in percentage, e.g. 8 = 8%
    }

    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed id,
        address indexed issuer,
        uint256 amount,
        uint256 dueDate,
        string businessName,
        string sector,
        uint8 rating,
        uint8 discountRate
    );
    event InvoiceFunded(
        uint256 indexed id,
        address indexed buyer,
        uint256 amount
    );
    event InvoicePaid(uint256 indexed id);

    function createInvoice(
        uint256 amount,
        uint256 dueDate,
        string memory businessName,
        string memory sector,
        uint8 rating,
        uint8 discountRate
    ) external {
        invoiceCounter++;

        invoices[invoiceCounter] = Invoice({
            id: invoiceCounter,
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

        emit InvoiceCreated(
            invoiceCounter,
            msg.sender,
            amount,
            dueDate,
            businessName,
            sector,
            rating,
            discountRate
        );
    }

    function fundInvoice(uint256 id) external payable {
        Invoice storage inv = invoices[id];
        require(
            inv.status == InvoiceStatus.Created,
            "Already funded or invalid"
        );

        // Calculate discounted amount
        uint256 discountedAmount = inv.amount -
            ((inv.amount * inv.discountRate) / 100);

        require(
            msg.value == discountedAmount,
            "Incorrect discounted funding amount"
        );

        inv.buyer = payable(msg.sender);
        inv.status = InvoiceStatus.Funded;

        // Transfer discounted amount to issuer
        inv.issuer.transfer(msg.value);

        emit InvoiceFunded(id, msg.sender, msg.value);
    }

    function markAsPaid(uint256 id) external {
        Invoice storage inv = invoices[id];
        require(msg.sender == inv.buyer, "Only buyer can mark paid");
        require(inv.status == InvoiceStatus.Funded, "Invoice not funded");

        inv.status = InvoiceStatus.Paid;

        emit InvoicePaid(id);
    }

    function getInvoice(
        uint256 id
    )
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
