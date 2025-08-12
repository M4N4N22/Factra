import { uploadFileToPinata, uploadJSONToPinata } from "@/utils/pinata";

export function useUploadToIPFS() {
  const uploadInvoiceNFT = async (imageBlob: Blob, metadata: any) => {
    // Upload image
    const imageURI = await uploadFileToPinata(imageBlob);

    // Upload metadata JSON
    const metadataWithImage = {
      ...metadata,
      image: imageURI,
    };
    const metadataURI = await uploadJSONToPinata(metadataWithImage);

    return { imageURI, metadataURI };
  };

  return { uploadInvoiceNFT };
}
