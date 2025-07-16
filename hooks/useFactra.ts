"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

import { FACTRA_CONTRACT_ADDRESS } from "@/lib/contract";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { parseEther } from "viem";

// ⬇️ Create Invoice Hook
export function useCreateInvoice() {
  const {
    writeContract,
    data: hash,
    status: writeStatus,
    error,
  } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const create = (
    amount: bigint,
    dueDate: number,
    businessName: string,
    sector: string,
    rating: number,
    discountRate: number
  ) => {
    writeContract({
      address: FACTRA_CONTRACT_ADDRESS,
      abi: FACTRA_ABI,
      functionName: "createInvoice",
      args: [
        amount,
        BigInt(dueDate),
        businessName,
        sector,
        rating,
        discountRate,
      ],
    });
  };

  return {
    create,
    isPending: writeStatus === "pending",
    isLoading,
    isSuccess,
    hash,
  };
}

// ⬇️ Fund Invoice Hook
export function useFundInvoice() {
  const {
    writeContract,
    data: hash,
    status: writeStatus,
    error,
  } = useWriteContract();
  const { isSuccess, isLoading } = useWaitForTransactionReceipt({ hash });

  const fund = async (invoiceId: number, amount: string) => {
    const amountInWei = parseEther(amount);

    await writeContract({
      address: FACTRA_CONTRACT_ADDRESS,
      abi: FACTRA_ABI,
      functionName: "fundInvoice",
      args: [invoiceId],
      value: amountInWei,
    });
  };

  return {
    fund,
    isPending: writeStatus === "pending",
    isSuccess,
    isLoading,
    hash,
  };
}

// ⬇️ Mark as Paid Hook
export function useMarkAsPaid() {
  const {
    writeContract,
    data: hash,
    status: writeStatus,
    error,
  } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const markPaid = (id: number) => {
    writeContract({
      address: FACTRA_CONTRACT_ADDRESS,
      abi: FACTRA_ABI,
      functionName: "markAsPaid",
      args: [id],
    });
  };

  return {
    markPaid,
    isPending: writeStatus === "pending",
    isLoading,
    isSuccess,
    hash,
  };
}
