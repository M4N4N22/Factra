// components/FundInvoiceModal.tsx
"use client";

import { useFundInvoice } from "@/hooks/useFactra";
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
}

export const FundInvoiceModal = ({
  open,
  onClose,
  invoiceId,
  amount,
}: FundInvoiceModalProps) => {
  const { fund, isPending } = useFundInvoice();

  const handleConfirm = async () => {
    try {
      await fund(invoiceId, amount);
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
        <p>
          You’re about to fund <strong>{amount} BTC</strong> for invoice #
          {invoiceId}. Continue?
        </p>
        <DialogFooter>
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
