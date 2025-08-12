"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";
import { FACTRA_CONTRACT_ADDRESS } from "@/lib/contract";
import { FACTRA_ABI } from "@/lib/abi/factra";
import { parseEther } from "viem";

export function useCreateInvoice() {
  const {
    writeContract,
    data: hash,
    status: writeStatus,
    error,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
    query: {
      enabled: !!hash, // only run if we actually have a hash
    },
  });

  const create = (
    amount: bigint,
    dueDate: number,
    businessName: string,
    sector: string,
    rating: number,
    discountRate: number,
    metadataURI: string
  ) => {
    console.log("🔧 [STEP 1] Preparing to create invoice");
    console.log({
      amount: amount.toString(),
      dueDate,
      businessName,
      sector,
      rating,
      discountRate,
      metadataURI,
    });

    try {
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
          metadataURI,
        ],
      });

      console.log("🚀 [STEP 2] Transaction submitted to wallet");
    } catch (err) {
      console.error("❌ [ERROR] writeContract threw an error before sending:", err);
    }
  };

  // Track changes in write status
  useEffect(() => {
    console.log("📝 writeStatus changed:", writeStatus);
  }, [writeStatus]);

  // Track when we get a transaction hash
  useEffect(() => {
    if (hash) console.log("🔗 [STEP 3] Got transaction hash:", hash);
  }, [hash]);

  // Track when we start waiting for confirmation
  useEffect(() => {
    if (isLoading) console.log("⏳ [STEP 4] Waiting for transaction confirmation...");
  }, [isLoading]);

  // Track when transaction confirms
  useEffect(() => {
    if (isSuccess) console.log("✅ [STEP 5] Transaction confirmed successfully!");
  }, [isSuccess]);

  // Track any error
  useEffect(() => {
    if (error) console.error("❌ [ERROR] Transaction failed:", error);
  }, [error]);

  return {
    create,
    isPending: writeStatus === "pending",
    isLoading,
    isSuccess,
    hash,
    error,
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

  const fund = async (invoiceId: number, discountedAmount: string) => {
    try {
      const valueInWei = BigInt(discountedAmount);
      console.log("[Funding Invoice]");
      console.log("Invoice ID:", invoiceId);
      console.log("Discounted Amount (in Wei):", valueInWei.toString());

      await writeContract({
        address: FACTRA_CONTRACT_ADDRESS,
        abi: FACTRA_ABI,
        functionName: "fundInvoice",
        args: [invoiceId],
        value: valueInWei,
      });
    } catch (err) {
      console.error("[Fund Invoice Error]", err);
    }
  };

  return {
    fund,
    isPending: writeStatus === "pending",
    isSuccess,
    isLoading,
    hash,
    error, // useful for UI-level error handling
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
