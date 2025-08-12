import { useRef } from "react";
import { toPng } from "html-to-image";

export function useGenerateInvoiceImage() {
  const previewRef = useRef<HTMLDivElement>(null);

  const generateImage = async (): Promise<Blob> => {
    if (!previewRef.current) throw new Error("Preview ref not found");

    const dataUrl = await toPng(previewRef.current);
    const res = await fetch(dataUrl);
    return await res.blob();
  };

  return { previewRef, generateImage };
}
