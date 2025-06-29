'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FACTRA_CONTRACT_ADDRESS, FACTRA_ABI } from '@/lib/constants/factra';
import { parseEther } from 'viem';
import { useEffect } from 'react';

export function useCreateInvoice() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const create = (amount: bigint, dueDate: number) => {
    writeContract({
      address: FACTRA_CONTRACT_ADDRESS,
      abi: FACTRA_ABI,
      functionName: 'createInvoice',
      args: [amount, BigInt(dueDate)],
    });
  };

  return { create, isPending, isLoading, isSuccess };
}

export function useFundInvoice() {
    const { writeContractAsync, data: hash, isPending } = useWriteContract();
    const { isSuccess, isLoading } = useWaitForTransactionReceipt({ hash });
  
    const fund = async (invoiceId: number, amount: string) => {
      const amountInWei = parseEther(amount);
  
      await writeContractAsync({
        address: FACTRA_CONTRACT_ADDRESS,
        abi: FACTRA_ABI,
        functionName: "fundInvoice",
        args: [invoiceId],
        value: amountInWei,
      });
    };
  
    return { fund, isPending, isSuccess, isLoading };
  }

export function useMarkAsPaid() {
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const markPaid = (id: number) => {
    writeContract({
      address: FACTRA_CONTRACT_ADDRESS,
      abi: FACTRA_ABI,
      functionName: 'markAsPaid',
      args: [id],
    });
  };

  return { markPaid, isPending, isLoading, isSuccess };
}
