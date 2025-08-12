import React, { forwardRef, useMemo } from "react";

interface InvoiceImagePreviewProps {
  amount: string; // total invoice amount (BTC)
  dueDate: string;
  businessName: string;
  sector: string;
  rating: string;
  discountRate: string; // percentage// pass from parent
}

const randomBgColors = [
  "#FF9FF3",
  "#FDCB6E",
  "#00CEC9",
  "#6C5CE7",
  "#FAB1A0",
  "#55EFC4",
  "#A29BFE",
  "#FFEAA7",
  "#81ECEC",
  "#FF7675",
];

const InvoiceImagePreview = forwardRef<
  HTMLDivElement,
  InvoiceImagePreviewProps
>(({ amount, dueDate, businessName, sector, rating, discountRate }, ref) => {
  const bgColor = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * randomBgColors.length);
    return randomBgColors[randomIndex];
  }, []);

  const metrics = useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    const discountNum = parseFloat(discountRate) || 0;

    // Amount seller gets after discount
    const fundedAmount = (amountNum * (1 - discountNum / 100)).toFixed(6);

    // Investor profit at maturity
    const profit = (amountNum - parseFloat(fundedAmount)).toFixed(6);

    // Days to maturity
    const maturityDate = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.max(
      0,
      Math.ceil(
        (maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // APY calculation (simple annualized based on discount rate)
    const apy =
      diffDays > 0
        ? ((discountNum / 100) * (365 / diffDays) * 100).toFixed(2)
        : "0.00";
    const returnPercent =
      fundedAmount && parseFloat(fundedAmount) !== 0
        ? ((parseFloat(profit) / parseFloat(fundedAmount)) * 100).toFixed(2)
        : "0.00";

    return {
      diffDays,
      apy,
      fundedAmount,
      profit,
      maturityAmount: amountNum.toFixed(4),
      returnPercent, // full amount investor receives
    };
  }, [amount, discountRate, dueDate]);
  

  return (
    <div
      ref={ref}
      className="w-[420px] rounded-2xl overflow-hidden font-sans shadow-2xl bg-gradient-to-b from-zinc-100 via-white to-zinc-200 p-3"
    >
      {/* Header */}
      <div className="px-5 py-2 text-zinc-950 flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-1 ">FACTRA</h1>
        <p className="text-xs font-medium text-gray-600">
          Secured by Bitcoin • Powered by Citrea
        </p>{" "}
      </div>

      {/* Top Artwork with Overlay */}
      <div
        className="relative w-full aspect-auto flex items-end justify-center rounded-2xl overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Overlay Bar */}
        <div className="absolute bg-gradient-to-b from-transparent via-black/30 to-black/50  backdrop-blur-sm  bottom-0  left-0 right-0 rounded-b-2xl  text-white p-6 z-10 flex justify-between items-center">
          {/* Left side: Funding & Returns */}
          <div className="flex flex-col">
            <div className="text-zinc-200 text-xs">
              <span className="text-base text-zinc-100 font-semibold">
                {metrics.fundedAmount} BTC
              </span>{" "}
              Fund Now
            </div>
            <div className="text-zinc-200 text-xs">
              <span className="text-xl text-primary font-bold">
                {metrics.profit} BTC
              </span>{" "}
              Returns
            </div>
          </div>

          {/* Right side: APY & Returns % */}
          <div className="flex flex-col text-right">
            <div className="text-zinc-200 text-xs">
              <span className="text-base text-zinc-100 font-semibold">
                {metrics.apy}
              </span>{" "}
              % APY
            </div>
            <div className="text-zinc-200 text-xs">
              <span className="text-xl text-primary font-bold">
                {metrics.returnPercent}
              </span>{" "}
              % ROI
            </div>
          </div>
        </div>

        {/* Big "F" */}
        <span className="text-[200px] font-extrabold text-black/50 select-none z-0">
          F
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 text-zinc-950">
        {/* Business Info */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-500 mb-1">
            Business Name
          </div>
          <div className="text-lg font-bold">{businessName}</div>
        </div>

        {/* Sector & Rating */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Sector
            </div>
            <div className="font-semibold">{sector}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Credit Rating
            </div>
            <div className="font-semibold">{rating}</div>
          </div>
        </div>

        {/* Due Date & Discount Rate */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Due Date
            </div>
            <div className="font-semibold">{dueDate}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Discount Rate
            </div>
            <div className="font-semibold">{discountRate}%</div>
          </div>
        </div>

        {/* Amount + Funded Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Invoice Amount
            </div>
            <div className="text-xl font-extrabold text-zinc-800">
              {" "}
              {amount} BTC
            </div>
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-gray-500 mb-1">
              Amount After Discount
            </div>
            <div className="text-xl font-extrabold ">
              {metrics.fundedAmount} BTC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceImagePreview.displayName = "InvoiceImagePreview";

export default InvoiceImagePreview;
