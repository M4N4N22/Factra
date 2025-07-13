// SPDX-License-Identifier: MIT
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateInvoice } from "@/hooks/useFactra";
import { parseEther } from "viem";

export const CreateInvoiceForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    dueDate: "",
    businessName: "",
    sector: "",
    rating: "",
    discountRate: "",
  });

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

  return (
    <Card className="gradient-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Create New Invoice</CardTitle>
        <p className="text-muted-foreground">
          Tokenize your Bitcoin invoice for early liquidity access.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="amount">Invoice Amount (BTC)</Label>
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
              <Label htmlFor="dueDate">Payment Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessName">Business Name</Label>
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
            <Label htmlFor="sector">Business Sector</Label>
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
              <Label htmlFor="rating">Credit Rating (0.0–5.0)</Label>
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
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
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
            {isSuccess && (
              <p className="text-green-500 text-sm pt-2">
                ✅ Invoice created successfully
              </p>
            )}

            {isSuccess && hash && (
              <div className="mt-4 p-4 border rounded-lg bg-green-100 text-green-800 text-sm">
                ✅ Invoice created successfully!
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
      </CardContent>
    </Card>
  );
};
