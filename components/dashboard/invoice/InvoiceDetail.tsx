// components/dashboard/invoice/InvoiceDetail.tsx

import React from "react";
import { RawInvoice } from "../DashboardStats";
import { truncateMiddle } from "@/lib/utils";
import { formatEther } from "viem";

type InvoiceDetailProps = {
  invoice: RawInvoice | null;
};

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice }) => {
  if (!invoice) {
    return (
      <div className="p-6 text-muted-foreground bg-card/50 rounded-xl text-center min-h-48 items-center justify-center flex">
        Select an invoice to view details
      </div>
    );
  }

  const [
    id,
    issuer,
    buyer,
    amount,
    dueDate,
    status,
    businessName,
    sector,
    rating,
    discountRate,
  ] = invoice;
  console.log("Invoice Detail:", invoice);
  const isFunded = status === 1;
  const formattedDate = new Date(Number(dueDate) * 1000).toLocaleDateString();

  return (
    <div className="p-6  bg-card rounded-xl min-w-[200px] space-y-12 shadow-lg ">
      <div className="flex justify-between items-enter">
        <h2 className="text-lg font-semibold">Invoice Details</h2>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs">Invoice ID</p>
          <p className="text-center">#{id}</p>
        </div>
      </div>

      {/* Issuer & Buyer */}
      <div className="flex  font-medium text-muted-foreground justify-start">
        <div className="w-1/2">
          <p className="uppercase text-xs text-muted-foreground">Issuer</p>
          <p className="truncate">{truncateMiddle(issuer)}</p>
        </div>

        <div className="">
          <p className="uppercase text-xs text-muted-foreground">Buyer</p>
          <p className="truncate">{truncateMiddle(buyer)}</p>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm bg-muted/50 p-6 rounded-xl">
        <div>
          <p className="text-muted-foreground text-xs">Due Date</p>
          <p>{formattedDate}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Sector</p>
          <p>{sector}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Business</p>
          <p>{businessName}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Amount</p>
          <p>{formatEther(invoice[3])} BTC</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Discount</p>
          <p>{discountRate}%</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Rating</p>
          <p>{(Number(rating) / 10).toFixed(1)}</p>
        </div>
      </div>

      {/* Status */}
      <div className="pt-4">
        <span
          className={`inline-block px-4 py-2 text-center rounded-full font-medium w-full ${
            isFunded
              ? "text-green-900 bg-green-200  rounded-full"
              : "bg-yellow-200 text-yellow-900"
          }`}
        >
          {isFunded ? "Funded" : "Unfunded"}
        </span>
      </div>
    </div>
  );
};
