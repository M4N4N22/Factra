import { useState } from "react";
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

interface MarketplaceInvoice {
  id: string;
  tokenId: string;
  amount: number;
  discountRate: number;
  maturityDays: number;
  business: string;
  rating: number;
  sector: string;
  yield: number;
}

export const InvoiceMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("yield");
  const [filterSector, setFilterSector] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<MarketplaceInvoice | null>(null);

  const openModal = (invoice: MarketplaceInvoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedInvoice(null);
  };

  const invoices: MarketplaceInvoice[] = [
    {
      id: "1",
      tokenId: "TKN-001",
      amount: 0.5,
      discountRate: 8.5,
      maturityDays: 30,
      business: "TechCorp Ltd",
      rating: 4.2,
      sector: "Technology",
      yield: 10.2,
    },
    {
      id: "2",
      tokenId: "TKN-002",
      amount: 1.2,
      discountRate: 6.0,
      maturityDays: 45,
      business: "Manufacturing Co",
      rating: 4.8,
      sector: "Manufacturing",
      yield: 7.8,
    },
    {
      id: "3",
      tokenId: "TKN-003",
      amount: 0.3,
      discountRate: 12.0,
      maturityDays: 15,
      business: "Retail Solutions",
      rating: 3.9,
      sector: "Retail",
      yield: 18.5,
    },
  ];

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
                      <strong>Rating:</strong> ⭐ {invoice.rating}
                    </span>
                    <span>
                      <strong>Maturity:</strong> {invoice.maturityDays} days
                    </span>
                    <span>
                      <strong>Discount:</strong> {invoice.discountRate}%
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-muted-foreground">
                    Token ID: {invoice.tokenId}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      You&apos;ll receive
                    </div>
                    <div className="font-semibold text-foreground">
                      {(invoice.amount * (1 + invoice.yield / 100)).toFixed(4)}{" "}
                      BTC
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
          amount={String(selectedInvoice.amount)}
        />
      )}
    </div>
  );
};
