// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InvoiceNFT
 * @notice ERC721 wrapper for on-chain invoice tokenization used by Factra.
 * - Only the configured Factra contract can mint/burn/force-transfer tokens.
 * - Stores a mapping from tokenId -> invoiceId so the off-chain DB can reconcile.
 * - Uses tokenURI for metadata (to store JSON on IPFS/Arweave).
 */
contract InvoiceNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds; // simple counter

    // Address of the Factra contract allowed to mint/burn/force-transfer
    address public factraContract;

    // Mapping tokenId -> invoiceId (invoiceId is the Factra invoiceCounter id)
    mapping(uint256 => uint256) public tokenToInvoice;
    mapping(uint256 => uint256) public invoiceToToken; // reverse mapping (0 if not minted)

    event InvoiceTokenMinted(uint256 indexed tokenId, uint256 indexed invoiceId, address indexed to, string tokenURI);
    event InvoiceTokenBurned(uint256 indexed tokenId, uint256 indexed invoiceId);
    event InvoiceTokenTransferredByFactra(uint256 indexed tokenId, address indexed from, address indexed to);
    event FactraContractUpdated(address indexed oldAddr, address indexed newAddr);

    modifier onlyFactra() {
        require(msg.sender == factraContract, "Only Factra contract can call");
        _;
    }

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) Ownable(msg.sender) {}

    /**
     * @notice Set the Factra contract address (onlyOwner)
     */
    function setFactraContract(address _factra) external onlyOwner {
        emit FactraContractUpdated(factraContract, _factra);
        factraContract = _factra;
    }

    /**
     * @notice Mint a new Invoice NFT. Callable only by Factra.
     * @param to recipient (usually the seller/issuer)
     * @param invoiceId the Factra invoice id
     * @param uri token metadata URI (ipfs://...)
     */
    function mintInvoice(address to, uint256 invoiceId, string calldata uri) external onlyFactra returns (uint256) {
        require(invoiceId != 0, "invoiceId cannot be 0");
        require(invoiceToToken[invoiceId] == 0, "Invoice already tokenized");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);

        tokenToInvoice[newTokenId] = invoiceId;
        invoiceToToken[invoiceId] = newTokenId;

        emit InvoiceTokenMinted(newTokenId, invoiceId, to, uri);
        return newTokenId;
    }

    /**
     * @notice Burn an Invoice NFT. Callable only by Factra (e.g. when paid/settled).
     */
    function burnInvoice(uint256 tokenId) external onlyFactra {
        uint256 invoiceId = tokenToInvoice[tokenId];
        require(invoiceId != 0, "TokenId not linked to invoice");

        // Clear mappings
        delete invoiceToToken[invoiceId];
        delete tokenToInvoice[tokenId];

        _burn(tokenId);
        emit InvoiceTokenBurned(tokenId, invoiceId);
    }

    /**
     * @notice Force-transfer a token from `from` -> `to`. Callable only by Factra.
     * This lets the Factra contract implement the funding flow (issuer -> buyer transfer)
     * and resale flow without requiring on-chain approvals from the owner.
     */
    function transferInvoiceTo(uint256 tokenId, address from, address to) external onlyFactra {
        // ownerOf will revert for non-existent token, covering existence check
        require(ownerOf(tokenId) == from, "From is not token owner");
        require(to != address(0), "Invalid recipient");

        // Internal _transfer bypasses approval checks (only callable from contract)
        _transfer(from, to, tokenId);

        emit InvoiceTokenTransferredByFactra(tokenId, from, to);
    }

    /**
     * @notice Helper view: returns the tokenId for an invoice (0 if none)
     */
    function tokenOfInvoice(uint256 invoiceId) external view returns (uint256) {
        return invoiceToToken[invoiceId];
    }
}
