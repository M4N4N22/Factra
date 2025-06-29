"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateInvoice } from "@/hooks/useFactra"; // ✅ your hook
import { parseEther } from "viem"; // ✅ for BTC to wei conversion

export const CreateInvoiceForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    dueDate: "",
    referenceId: "",
    receiverAddress: "",
    description: "",
  });

  const { create, isPending, isSuccess } = useCreateInvoice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const amountInBTC = parseFloat(formData.amount || "0");
      const amountInWei = parseEther(amountInBTC.toString());
      const dueDateUnix = Math.floor(new Date(formData.dueDate).getTime() / 1000);

      await create(amountInWei, dueDateUnix); // ✅ Call the smart contract

      toast.success("Invoice creation submitted!", {
        description: "Your invoice is now live on-chain.",
      });

      setFormData({
        amount: "",
        dueDate: "",
        referenceId: "",
        receiverAddress: "",
        description: "",
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
          Tokenize your Bitcoin invoice for early liquidity access
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium">
                Invoice Amount (BTC)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.00000001"
                placeholder="0.5"
                value={formData.amount}
                onChange={handleChange}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Payment Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-2"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="referenceId" className="text-sm font-medium">
              Invoice Reference ID
            </Label>
            <Input
              id="referenceId"
              name="referenceId"
              placeholder="INV-2024-001"
              value={formData.referenceId}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="receiverAddress" className="text-sm font-medium">
              Receiver Bitcoin Address
            </Label>
            <Input
              id="receiverAddress"
              name="receiverAddress"
              placeholder="bc1q..."
              value={formData.receiverAddress}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the invoice..."
              value={formData.description}
              onChange={handleChange}
              className="mt-2"
              rows={3}
            />
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
              <p className="text-green-500 text-sm pt-2">✅ Invoice created successfully</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
