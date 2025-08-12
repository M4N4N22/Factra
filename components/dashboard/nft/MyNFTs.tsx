"use client";

import {  useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface NFTData {
    tokenId: string;
    name?: string;
    description?: string;
    image?: string;
  }

export function MyNFTs() {
  const { isConnected } = useAccount();
  const [loading] = useState(false);

  const nfts: NFTData[] = []; 

  if (!isConnected) {
    return (
      <p className="text-muted-foreground">
        Connect your wallet to view your NFTs.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading your NFTs...</span>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <p className="flex justify-center items-center py-8">
        Your NFTs will be displayed here soon once our off-chain database is ready.
      </p>
    );
  }

  // Future: Once DB ready, map nfts here
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((nft) => (
        <Card key={nft.tokenId}>
          <CardHeader>
            <CardTitle>{nft.name || `Invoice NFT #${nft.tokenId}`}</CardTitle>
          </CardHeader>
          <CardContent>
            {nft.image && (
              <Image
                width={300}
                src={nft.image}
                alt={nft.name || ""}
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            )}
            <p className="text-sm text-muted-foreground">
              {nft.description || "No description available"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
