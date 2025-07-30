// components/FundInvoiceModal.tsx
"use client";

import { useFundInvoice } from "@/hooks/useFactra";
import { formatEther } from "viem";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FundInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: number;
  amount: string;
  payNowAmount: bigint;
}

export const FundInvoiceModal = ({
  open,
  onClose,
  invoiceId,
  amount,
  payNowAmount,
}: FundInvoiceModalProps) => {
  const { fund, isPending } = useFundInvoice();

  const handleConfirm = async () => {
    try {
      await fund(invoiceId, payNowAmount.toString());
      toast.success("Invoice funded successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Funding failed", {
        description: "Check your wallet or network.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Invoice Funding</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div>
            <span className="text-foreground font-medium">You’ll Pay Now:</span>{" "}
            {formatEther(payNowAmount)} BTC
          </div>
          <div>
            <span className="text-foreground font-medium">You’ll Receive:</span>{" "}
            {amount} BTC
          </div>
        </div>

        <p className="text-sm mt-4">
          By confirming, you agree to fund this invoice and receive the full
          amount at maturity.
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Funding..." : "Confirm & Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
