"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FundInvoiceModal } from "@/components/dashboard/FundInvoiceModal";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { FACTRA_ABI } from "@/lib/abi/factra"; // You need to generate this via Typechain or copy manually
import { FACTRA_ADDRESS } from "@/lib/constants/factra"; // your deployed address here

interface MarketplaceInvoice {
  id: string;
  issuer: string;
  tokenId: string;
  amount: number;
  discountRate: number;
  maturityDays: number;
  business: string;
  rating: number;
  sector: string;
  yield: number;
}

type RawInvoice = [
  string, // id
  string, // issuer
  string, // buyer
  bigint, // amount
  number, // dueDate (unix timestamp)
  number, // status
  string, // businessName
  string, // sector
  number, // rating
  number // discountRate
];

export const InvoiceMarketplace = () => {
  const [invoices, setInvoices] = useState<MarketplaceInvoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("yield");
  const [filterSector, setFilterSector] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<MarketplaceInvoice | null>(null);

  const client = usePublicClient();

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!client) {
        console.log("🚫 No public client found.");
        return;
      }

      try {
        const count = await client.readContract({
          address: FACTRA_ADDRESS,
          abi: FACTRA_ABI,
          functionName: "getInvoiceCount",
        });

        console.log("📦 Invoice count:", count);

        if (Number(count) === 0) {
          console.log("⚠️ No invoices found on-chain.");
          return;
        }

        const promises = Array.from({ length: Number(count) }, (_, i) =>
          client.readContract({
            address: FACTRA_ADDRESS,
            abi: FACTRA_ABI,
            functionName: "getInvoice",
            args: [BigInt(i + 1)],
          })
        );

        const raw = await Promise.all(promises);

        console.log("📥 Raw invoice data:", raw);

        const now = Math.floor(Date.now() / 1000);

        const processed: MarketplaceInvoice[] = (raw as RawInvoice[])
          .map((r: RawInvoice, index: number) => {
            const [
              id,
              issuer,
              _buyer,
              amount,
              dueDate,
              status,
              businessName,
              sector,
              rating,
              discountRate,
            ] = r;

            console.log(`🧾 Invoice ${index + 1}:`, {
              id,
              status,
              issuer,
              amount: amount.toString(),
              businessName,
              sector,
              rating,
              discountRate,
              dueDate: Number(dueDate),
            });

            if (Number(status) !== 0) {
              console.log(`⛔ Invoice ${id} skipped: not in "Created" status`);
              return null;
            }

            const maturityDays = Math.max(
              1,
              Math.floor((Number(dueDate) - now) / 86400)
            );

            const discount = Number(discountRate);
            const yieldEst =
              maturityDays > 0 ? discount / (maturityDays / 365) : 0;

            return {
              id: id.toString(),
              issuer: issuer.toString(),
              amount: parseFloat(formatEther(amount)),
              discountRate: discount,
              maturityDays,
              business: businessName,
              rating: Number(rating) / 10,
              sector,
              yield: parseFloat(yieldEst.toFixed(2)),
            };
          })
          .filter((inv): inv is MarketplaceInvoice => inv !== null);

        console.log("✅ Processed invoices:", processed);

        setInvoices(processed);
      } catch (err) {
        console.error("❌ Error fetching invoices:", err);
      }
    };

    fetchInvoices();
  }, [client]);

  const openModal = (invoice: MarketplaceInvoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedInvoice(null);
  };

  const filteredInvoices = invoices
    .filter(
      (invoice) =>
        invoice.business.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterSector === "all" ||
          invoice.sector.toLowerCase() === filterSector)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "yield":
          return b.yield - a.yield;
        case "amount":
          return b.amount - a.amount;
        case "maturity":
          return a.maturityDays - b.maturityDays;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yield">Yield %</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="maturity">Maturity</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterSector} onValueChange={setFilterSector}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <Card
            key={invoice.id}
            className="gradient-card hover:border-primary/30 transition-colors cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xl font-semibold">
                      {invoice.amount} BTC
                    </span>
                    <Badge className="bg-primary/50 dark:bg-primary/20 dark:text-primary  text-primary-foreground">
                      {invoice.yield}% APY
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {invoice.sector}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                      <strong>Business:</strong> {invoice.business}
                    </span>
                    <span>
                      <strong>Rating:</strong> {invoice.rating} ⭐
                    </span>
                    <span>
                      <strong>Maturity:</strong> {invoice.maturityDays} days
                    </span>
                    <span>
                      <strong>Discount:</strong> {invoice.discountRate}%
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Issued by: {invoice.issuer}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 rounded-lg px-4 py-3">
                  <div className="space-y-1 text-sm">
                    <div className="text-muted-foreground">
                      Pay Now (after discount)
                    </div>
                    <div className="font-medium text-foreground">
                      {(
                        invoice.amount *
                        (1 - invoice.discountRate / 100)
                      ).toFixed(8)}{" "}
                      BTC
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-right">
                    <div className="text-muted-foreground">
                      Receive at Maturity
                    </div>
                    <div className="font-medium text-foreground">
                      {Number(invoice.amount).toFixed(8)} BTC
                    </div>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => openModal(invoice)}
                  >
                    Fund Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedInvoice && (
  <FundInvoiceModal
    open={modalOpen}
    onClose={closeModal}
    invoiceId={Number(selectedInvoice.id)}
    amount={String(selectedInvoice.amount)} // Full invoice amount
    payNowAmount={(
      selectedInvoice.amount * (1 - selectedInvoice.discountRate / 100)
    ).toFixed(8)} // Discounted amount (funding value)
  />
)}

    </div>
  );
};
