// SPDX-License-Identifier: MIT
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateInvoice } from "@/hooks/useFactra";
import { parseEther } from "viem";
import { Calendar } from "../ui/calendar";
import { format, addDays } from "date-fns";
import { PreviewInvoice } from "./invoice/InvoicePreview";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Calendar as CalendarIcon, Info } from "lucide-react";

export const CreateInvoiceForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    dueDate: "",
    businessName: "",
    sector: "",
    rating: "",
    discountRate: "",
  });

  const today = new Date();
  const minAllowedDate = addDays(today, 1);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    minAllowedDate
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dueDate: minAllowedDate.toISOString().split("T")[0],
    }));
  }, []);

  const { create, isPending, isSuccess, hash } = useCreateInvoice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const amountInWei = parseEther(formData.amount || "0");
      const dueDateUnix = Math.floor(
        new Date(formData.dueDate).getTime() / 1000
      );
      const rating = Math.round(parseFloat(formData.rating || "0") * 10); // e.g. 4.2 -> 42
      const discountRate = parseInt(formData.discountRate || "0");

      await create(
        amountInWei,
        dueDateUnix,
        formData.businessName,
        formData.sector,
        rating,
        discountRate
      );

      toast.success("Invoice creation submitted!", {
        description: "Your invoice is now live on-chain.",
      });

      setFormData({
        amount: "",
        dueDate: "",
        businessName: "",
        sector: "",
        rating: "",
        discountRate: "",
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to create invoice.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDateChange = (date: Date | undefined) => {
    if (date && date >= minAllowedDate) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        dueDate: date.toISOString().split("T")[0],
      }));
    } else if (date) {
      toast.warning("Please select a date at least 1 day from today.");
    }
  };

  const InfoBubble = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 ml-1 mt-0.5 text-muted-foreground cursor-pointer flex" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-center mx-auto">
      <Card className="gradient-card max-w-2xl ">
        <CardHeader>
          <CardTitle className="text-xl">Create New Invoice</CardTitle>
          <p className="text-muted-foreground">
            Tokenize your Bitcoin invoice for early liquidity access.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="amount" className="flex items-center">
                  Invoice Amount (BTC)
                  <InfoBubble content="The total value of the invoice in Bitcoin (BTC). This is the amount owed to your business." />
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.00000001"
                  placeholder="0.5"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate" className="flex items-center">
                  Payment Due Date
                  <InfoBubble content="The date by which the invoice must be paid. Determines invoice maturity." />
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!selectedDate}
                      className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      autoFocus
                      disabled={{ before: minAllowedDate }}
                    />
                  </PopoverContent>
                </Popover>

                {selectedDate && (
                  <p className="text-sm text-muted-foreground hidden">
                    Selected: {format(selectedDate, "yyyy-MM-dd")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="businessName" className="flex items-center">
                Business Name
                <InfoBubble content="The legal name of the company issuing the invoice." />
              </Label>
              <Input
                id="businessName"
                name="businessName"
                placeholder="Acme Corp"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="sector" className="flex items-center">
                Business Sector
                <InfoBubble content="Industry your business operates in (e.g., Retail, Technology, Logistics)." />
              </Label>
              <Input
                id="sector"
                name="sector"
                placeholder="Retail, Tech, etc."
                value={formData.sector}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="rating" className="flex items-center">
                  Credit Rating (0.0–5.0)
                  <InfoBubble content="Your business's creditworthiness score. A higher score reflects lower risk." />
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  max="5"
                  placeholder="4.2"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="discountRate" className="flex items-center">
                  Discount Rate (%)
                  <InfoBubble content="The percentage discount you're offering to investors for early payment. Higher rate = more investor yield." />
                </Label>
                <Input
                  id="discountRate"
                  name="discountRate"
                  type="number"
                  step="0.1"
                  placeholder="8"
                  value={formData.discountRate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-primary font-bold hover:bg-primary/90"
              >
                {isPending ? "Creating..." : "Tokenize Invoice"}
              </Button>
      
              {isSuccess && hash && (
                <div className="mt-4 p-4 rounded-lg bg-card border font-semibold text-lg">
                  Invoice created successfully!
                  <br />
                  Tx Hash:{" "}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(hash);
                      toast("Transaction hash copied to clipboard");
                    }}
                    className="underline font-mono text-xs break-all"
                  >
                    {hash}
                  </button>
                </div>
              )}
            </div>
          </form>
          {/* Invoice Preview */}
        </CardContent>
      </Card>
      <div className="w-full md:w-[320px]">
        <PreviewInvoice data={formData} />
      </div>
    </div>
  );
};
