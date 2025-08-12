import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InvoicePreviewProps = {
  data: {
    amount: string;
    dueDate: string;
    businessName: string;
    sector: string;
    rating: string;
    discountRate: string;
  };
};

export const PreviewInvoice: React.FC<InvoicePreviewProps> = ({ data }) => {
  const { amount, dueDate, businessName, sector, rating, discountRate } = data;

  const formattedAmount = amount
    ? `${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      })} BTC`
    : "—";

  const formattedDiscountRate = discountRate ? `${discountRate}%` : "—";
  const formattedDueDate = dueDate ? new Date(dueDate).toDateString() : "—";

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center">
      <span className="text-foreground font-medium">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="text-lg">Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="Amount" value={formattedAmount} />
        <InfoRow label="Due Date" value={formattedDueDate} />
        <InfoRow label="Business Name" value={businessName || "—"} />
        <InfoRow label="Sector" value={sector || "—"} />
        <InfoRow
          label="Credit Rating"
          value={rating ? parseFloat(rating).toFixed(1) : "—"}
        />

        <InfoRow label="Discount Rate" value={formattedDiscountRate} />
        {/*<InfoRow label="Implied Yield" value={calculatedYield || "—"} />*/}
      </CardContent>
    </Card>
  );
};
