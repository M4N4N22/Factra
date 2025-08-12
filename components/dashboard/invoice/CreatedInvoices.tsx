"use client";

import { useEffect, useState } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { FACTRA_ADDRESS } from "@/lib/constants/factra";
import { formatEther } from "viem";
import { RawInvoice } from "../DashboardStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  onSelectInvoice: (invoice: RawInvoice) => void;
};

// Define status label mapping
const statusMap: Record<number, { label: string; color: string }> = {
  0: {
    label: "Unfunded",
    color: "text-yellow-900 bg-yellow-200 px-4 py-2 rounded-full",
  },
  1: {
    label: "Funded",
    color: "text-green-900 bg-green-200 px-4 py-2 rounded-full",
  },
  2: { label: "Settled", color: "text-blue-400" },
  3: { label: "Expired", color: "text-red-400" },
};

export default function CreatedInvoices({ onSelectInvoice }: Props) {
  const [created, setCreated] = useState<RawInvoice[]>([]);
  const client = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
    const fetchCreated = async () => {
      if (!client || !address) return;

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

        const filtered = invoices.filter(
          (inv) => inv[1].toLowerCase() === address.toLowerCase()
        );
        setCreated(filtered);
      } catch (err) {
        console.error("Error loading created invoices:", err);
      }
    };

    fetchCreated();
  }, [client,address]);

  if (!created.length)
    return <p className="text-muted-foreground bg-card p-6 rounded-xl text-center">You haven&apos;t created any invoices yet.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
         
          <TableHead>Invoice Amount</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {created.map((inv, i) => {
          const statusCode = Number(inv[5]);
          const statusInfo = statusMap[statusCode] || {
            label: "Unknown",
            color: "text-gray-400",
          };

          return (
            <TableRow
              key={i}
              onClick={() => onSelectInvoice(inv)}
              className="cursor-pointer hover:bg-muted"
            >
              <TableCell>#{Number(inv[0])}</TableCell>
            

              <TableCell>{formatEther(inv[3])} BTC</TableCell>
              <TableCell>{BigInt(inv[9]).toString()}%</TableCell>
              <TableCell>
                {new Date(Number(inv[4]) * 1000).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className={`${statusInfo.color} font-medium`}>
                  {statusInfo.label}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
