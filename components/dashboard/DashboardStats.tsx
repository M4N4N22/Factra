"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicClient } from "wagmi";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { FACTRA_ADDRESS } from "@/lib/constants/factra";
import { formatEther } from "viem";
import { useAccount, useBalance } from "wagmi";

export type RawInvoice = [
  bigint, // id
  string, // issuer
  string, // buyer
  bigint, // amount
  bigint, // dueDate
  number, // status (enum)
  string, // businessName
  string, // sector
  number, // rating
  number // discountRate
];

export const DashboardStats = () => {
  const [btcUsdPrice, setBtcUsdPrice] = useState<number | null>(null);

  useEffect(() => {
    // fetch live BTC price in USD
    fetch("https://blockchain.info/ticker")
      .then((res) => res.json())
      .then((data) => {
        if (data.USD?.last) setBtcUsdPrice(data.USD.last);
      })
      .catch((err) => console.error("Error fetching BTC price:", err));
  }, []);
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
        const count = (await client.readContract({
          address: FACTRA_ADDRESS,
          abi: FACTRA_ABI,
          functionName: "getInvoiceCount",
        })) as bigint;

        console.log("📊 Total invoices found:", count);

        let outstandingTotal = 0n;
        let investedTotal = 0n;
        let expectedPayout = 0n;
        let outstandingCount = 0;
        let purchasedCount = 0;

        const now = Math.floor(Date.now() / 1000);

        const invoices = await Promise.all(
          Array.from(
            { length: Number(count) },
            (_, i) =>
              client.readContract({
                address: FACTRA_ADDRESS,
                abi: FACTRA_ABI,
                functionName: "getInvoice",
                args: [BigInt(i + 1)],
              }) as Promise<RawInvoice>
          )
        );

        console.log("📄 Fetched invoices:", invoices.length);

        for (const [index, inv] of invoices.entries()) {
          const [
            _id, // 0: BigInt
            _issuer, // 1: string (address)
            _buyer, // 2: string (address)
            amount, // 3: BigInt
            dueDate, // 4: BigInt (timestamp)
            status, // 5: enum (number)
            _businessName, // 6: string
            _sector, // 7: string
            _rating, // 8: number (uint8)
            discountRate, // 9: number (uint8)
          ] = inv;

          console.log(`🧾 Invoice #${index + 1}:`, {
            amount,
            dueDate,
            status,
            discountRate,
          });

          let amountBn: bigint;
          let discountBn: bigint;

          try {
            amountBn = BigInt(amount);
            discountBn = BigInt(discountRate);
          } catch (_err) {
            console.warn(
              `⚠️ Skipping invoice #${index + 1} due to invalid bigint values`,
              {
                amount,
                discountRate,
              }
            );
            continue;
          }

          const payout = amountBn;

          switch (Number(status)) {
            case 0: // Created (outstanding)
              outstandingCount++;
              outstandingTotal += amountBn;
              break;
            case 1: {
              const funder = inv[1]; // or whichever index represents funder address

              if (funder.toLowerCase() === address?.toLowerCase()) {
                purchasedCount++;
                investedTotal += amountBn;

                if (Number(dueDate) < now + 30 * 86400) {
                  expectedPayout += payout;
                }
              }
              break;
            }
          }
        }

        console.log("✅ Final Stats:", {
          outstandingCount,
          outstandingTotal: formatEther(outstandingTotal),
          purchasedCount,
          investedTotal: formatEther(investedTotal),
          expectedPayout: formatEther(expectedPayout),
        });

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
  }, [client,address]);
  const rawBalance = balanceData?.value ?? 0n;
  const formattedBTC = parseFloat(formatEther(rawBalance)).toFixed(8);
  const formattedUSD = btcUsdPrice
    ? (parseFloat(formattedBTC) * btcUsdPrice).toFixed(2)
    : undefined;

  const cardStats = [
    {
      title: "Created Invoices",
      value: stats.outstandingCount,
      subtext: `${Number(stats.outstandingTotal).toFixed(4)} BTC`,
      trend: "", // Optional: add comparison logic
    },
    {
      title: "Funded Invoices",
      value: stats.purchasedCount,
      subtext: `${Number(stats.investedTotal).toFixed(4)} BTC invested`,
      trend: "",
    },
    {
      title: "Available Balance",
      value: isBalanceLoading
        ? "Loading..."
        : `${formattedBTC} ${balanceData?.symbol || "BTC"}`,
      subtext:
        isBalanceLoading || !formattedUSD ? "" : `≈ $${formattedUSD} USD`,
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
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className=" text-muted-foreground">
          A snapshot of your invoices, performance metrics, and marketplace
          activity. Stay on top of your operations at a glance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardStats.map((stat, index) => (
          <Card key={index} className="">
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
    </>
  );
};
