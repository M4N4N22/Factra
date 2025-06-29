// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Factra {
    uint256 public invoiceCounter;

    enum InvoiceStatus { Created, Funded, Paid }

    struct Invoice {
        uint256 id;
        address payable issuer;
        address payable buyer;
        uint256 amount;     // in wei
        uint256 dueDate;
        InvoiceStatus status;
    }

    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(uint256 indexed id, address indexed issuer, uint256 amount, uint256 dueDate);
    event InvoiceFunded(uint256 indexed id, address indexed buyer, uint256 amount);
    event InvoicePaid(uint256 indexed id);

    function createInvoice(uint256 amount, uint256 dueDate) external {
        invoiceCounter++;
        invoices[invoiceCounter] = Invoice({
            id: invoiceCounter,
            issuer: payable(msg.sender),
            buyer: payable(address(0)),
            amount: amount,
            dueDate: dueDate,
            status: InvoiceStatus.Created
        });

        emit InvoiceCreated(invoiceCounter, msg.sender, amount, dueDate);
    }

    function fundInvoice(uint256 id) external payable {
        Invoice storage inv = invoices[id];
        require(inv.status == InvoiceStatus.Created, "Already funded or invalid");
        require(msg.value == inv.amount, "Incorrect funding amount");

        inv.buyer = payable(msg.sender);
        inv.status = InvoiceStatus.Funded;

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
}
