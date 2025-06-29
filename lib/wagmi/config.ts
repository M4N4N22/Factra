// lib/wagmi/config.ts
import { http } from "viem";
import { defineChain } from "viem/utils";
import { createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import type { Chain } from "viem/chains";

export const citrea = defineChain({
  id: 5115,
  name: "Citrea Testnet",
  network: "citrea",
  nativeCurrency: {
    name: "Bitcoin",
    symbol: "BTC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.citrea.xyz"],
    },
    public: {
      http: ["https://rpc.testnet.citrea.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Citrea Explorer",
      url: "https://explorer.testnet.citrea.xyz",
    },
  },
  testnet: true,
});

export const chains: [Chain, ...Chain[]] = [citrea]; // 👈 export chains

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ projectId: "4f5debd278149b12b8dbfe62a53aa9e0" }),
  ],
  transports: {
    [citrea.id]: http(),
  },
});
