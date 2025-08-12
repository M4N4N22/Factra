export async function uploadFileToPinata(file: Blob) {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });
  
    if (!res.ok) throw new Error("Failed to upload file to Pinata");
    const data = await res.json();
    return `ipfs://${data.IpfsHash}`;
  }
  
  export async function uploadJSONToPinata(json: any) {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify(json),
    });
  
    if (!res.ok) throw new Error("Failed to upload JSON to Pinata");
    const data = await res.json();
    return `ipfs://${data.IpfsHash}`;
  }
  