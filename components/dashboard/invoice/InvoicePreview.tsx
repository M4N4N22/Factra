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

  // Calculate yield
  let calculatedYield: string | null = null;
  if (discountRate && dueDate) {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysToDue = timeDiff / (1000 * 60 * 60 * 24);
    const discount = parseFloat(discountRate);

    if (daysToDue > 0 && !isNaN(discount)) {
      const yieldAnnualized = ((discount / daysToDue) * 365).toFixed(2);
      calculatedYield = `${yieldAnnualized}% p.a.`;
    }
  }

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
