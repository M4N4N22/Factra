import { useCreateInvoice } from "./useFactra"; 
import { parseEther } from "viem";

export function useCreateInvoiceNFT() {
  const { create, isPending, isSuccess, hash } = useCreateInvoice();

  const createInvoiceNFT = async (metadataURI: string, formData: any) => {
    const amountInWei = parseEther(formData.amount || "0");
    const dueDateUnix = Math.floor(
      new Date(formData.dueDate).getTime() / 1000
    );
    const rating = Math.round(parseFloat(formData.rating || "0") * 10);
    const discountRate = parseInt(formData.discountRate || "0");

    await create(
      amountInWei,
      dueDateUnix,
      formData.businessName,
      formData.sector,
      rating,
      discountRate,
      metadataURI 
    );
  };

  return { createInvoiceNFT, isPending, isSuccess, hash,isLoading: isPending || isSuccess, error: null };
}
