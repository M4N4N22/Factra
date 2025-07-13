"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicClient } from "wagmi";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { FACTRA_ADDRESS } from "@/lib/constants/factra";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";


type RawInvoice = [
  bigint,        // id
  string,        // issuer
  string,        // buyer
  bigint,        // amount
  bigint,        // dueDate
  number,        // status (enum)
  string,        // businessName
  string,        // sector
  number,        // rating
  number         // discountRate
];


export const DashboardStats = () => {
  const [stats, setStats] = useState({
    outstandingCount: 0,
    outstandingTotal: "0",
    purchasedCount: 0,
    investedTotal: "0",
    expectedPayout: "0",
  });

  const { address } = useAccount();

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const client = usePublicClient();

  useEffect(() => {
    const fetchStats = async () => {
      if (!client) return;

      try {
        const count = await client.readContract({
          address: FACTRA_ADDRESS,
          abi: FACTRA_ABI,
          functionName: "getInvoiceCount",
        }) as bigint;
        

        let outstandingTotal = 0n;
        let investedTotal = 0n;
        let expectedPayout = 0n;
        let outstandingCount = 0;
        let purchasedCount = 0;

        const now = Math.floor(Date.now() / 1000);

        const invoices = await Promise.all(
          Array.from({ length: Number(count) }, (_, i) =>
            client.readContract({
              address: FACTRA_ADDRESS,
              abi: FACTRA_ABI,
              functionName: "getInvoice",
              args: [BigInt(i + 1)],
            }) as Promise<RawInvoice>
          )
        );
        

        for (const inv of invoices) {
          const [ amount, dueDate, status, , , , discountRate] = inv;
          const amountBn = BigInt(amount);
          const payout = amountBn + (amountBn * BigInt(discountRate)) / 100n;

          switch (Number(status)) {
            case 0: // Created (outstanding)
              outstandingCount++;
              outstandingTotal += amountBn;
              break;
            case 1: // Funded (purchased)
              purchasedCount++;
              investedTotal += amountBn;
              if (Number(dueDate) < now + 30 * 86400) {
                expectedPayout += payout;
              }
              break;
            default:
              break;
          }
        }

        setStats({
          outstandingCount,
          outstandingTotal: formatEther(outstandingTotal),
          purchasedCount,
          investedTotal: formatEther(investedTotal),
          expectedPayout: formatEther(expectedPayout),
        });
      } catch (err) {
        console.error("❌ Error loading dashboard stats:", err);
      }
    };

    fetchStats();
  }, [client]);

  const cardStats = [
    {
      title: "Outstanding Invoices",
      value: stats.outstandingCount,
      subtext: `${Number(stats.outstandingTotal).toFixed(4)} BTC`,
      trend: "", // Optional: add comparison logic
    },
    {
      title: "Purchased Invoices",
      value: stats.purchasedCount,
      subtext: `${Number(stats.investedTotal).toFixed(4)} BTC invested`,
      trend: "",
    },
    {
      title: "Available Balance",
      value: isBalanceLoading
        ? "Loading..."
        : `${balanceData?.formatted || "0.0000"} ${balanceData?.symbol || ""}`,
      subtext: isBalanceLoading
        ? ""
        : `≈ $${(Number(balanceData?.formatted || "0") * 27000).toFixed(2)}`, // mock BTC price
      trend: "",
    },
    
    {
      title: "Expected Payouts",
      value: `${Number(stats.expectedPayout).toFixed(4)} BTC`,
      subtext: "Next 30 days",
      trend: "",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardStats.map((stat, index) => (
        <Card key={index} className="gradient-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stat.subtext}
            </p>
            {stat.trend && (
              <p className="text-xs text-primary-foreground bg-primary font-semibold w-fit px-4 p-1 rounded-full mt-2">
                {stat.trend}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
