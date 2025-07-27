"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { FACTRA_ADDRESS } from "@/lib/constants/factra";
import { formatEther } from "viem";
import { RawInvoice } from "../DashboardStats";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props = {
  onSelectInvoice: (invoice: RawInvoice) => void;
};

export default function FundedInvoices({ onSelectInvoice }: Props) {
  const [funded, setFunded] = useState<RawInvoice[]>([]);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const client = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
    const fetchFunded = async () => {
      if (!client) return;

      try {
        const count = (await client.readContract({
          address: FACTRA_ADDRESS,
          abi: FACTRA_ABI,
          functionName: "getInvoiceCount",
        })) as bigint;

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

        const fundedOnly = invoices.filter((inv) => Number(inv[5]) === 1); // status === funded
        setFunded(fundedOnly);
      } catch (err) {
        console.error("Error loading funded invoices:", err);
      }
    };

    fetchFunded();
  }, [client]);

  const filteredInvoices = showMineOnly
    ? funded.filter((inv) => inv[1].toLowerCase() === address?.toLowerCase())
    : funded;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recently Funded Invoices</h2>
        <Button
          variant="outline"
          onClick={() => setShowMineOnly((prev) => !prev)}
        >
          {showMineOnly ? "Show All Funded" : "Show Only Funded By You"}
        </Button>
      </div>

      {!filteredInvoices.length ? (
        <Card>
          <CardContent className="text-muted-foreground text-center py-8">
            {showMineOnly
              ? "You haven't funded any invoices yet."
              : "No invoices have been funded yet."}
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Invoice Amount</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Amount Funded</TableHead>

              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv, i) => {
              const amount = BigInt(inv[3]);
              const discount = BigInt(inv[9]);
              const paidByFunder = amount - (amount * discount) / 100n;
              const receivedByFunder = amount;

              return (
                <TableRow
                  key={i}
                  onClick={() => onSelectInvoice(inv)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>#{Number(inv[0])}</TableCell>
                  <TableCell title={inv[1]}>
                    <code>
                      {inv[1].slice(0, 6)}...{inv[1].slice(-4)}
                    </code>
                  </TableCell>
                  <TableCell>{formatEther(amount)} BTC</TableCell>
                  <TableCell>{discount.toString()}%</TableCell>
                  <TableCell>{formatEther(paidByFunder)} BTC</TableCell>

                  <TableCell>
                    {new Date(Number(inv[4]) * 1000).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
