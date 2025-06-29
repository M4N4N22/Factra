# 🧾 Factra — B2B Invoice Financing on Bitcoin via Citrea zkRollup

**Factra** brings **real-world B2B invoice financing** to the **DeFi ecosystem**, built directly on Bitcoin using **Citrea zkRollup**. It enables businesses to tokenize invoices, get early liquidity, and allows investors to fund them with yield — fully on-chain, gas-efficient, and censorship-resistant.

> 🚀 Built for WaveHack · Powered by Citrea zkRollup

---

## ⚡️ Why Factra?

- 💸 **Bridges TradFi and DeFi**: B2B financing is a trillion-dollar off-chain market — Factra brings it to Bitcoin.
- 🧾 **Invoice-as-a-Token**: Each invoice is tokenized and represents real-world receivables.
- 💰 **Earn Yield on Invoices**: Fund invoices and earn yield on your BTC, trustlessly.
- 🛡️ **Built on Bitcoin (Citrea)**: Uses zkRollup to offer smart contract capabilities over Bitcoin's security.

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Smart Contracts | Solidity (`Factra.sol`) |
| Chain | [Citrea Testnet](https://explorer.testnet.citrea.xyz) |
| Frontend | Next.js 14 (App Router) |
| Wallet & Web3 | Wagmi v1 + RainbowKit + Ethers.js v6 |
| UI | ShadCN (Tailwind-based) |
| Dev Tools | Hardhat + Typechain |
| Infra | Citrea RPC + Testnet Faucet |

---

## 🧠 How It Works

1. **Invoice Issuer** creates an invoice by providing:
   - Amount (in BTC)
   - Due date
   - Reference ID
   - Description

2. **Invoice is tokenized on-chain** (via smart contract).

3. **Investor/Funder** browses live invoices on the marketplace and funds any invoice of choice.

4. **Payment is sent to issuer**, and investor receives a yield once the invoice is paid.

5. All data is **immutable**, visible on-chain on Citrea’s explorer.

---

## 📂 Project Structure

```
factra/
├── app/ # Next.js App Router structure
│ ├── layout.tsx
│ └── page.tsx
├── components/ # Reusable UI components
│ └── dashboard/
├── hooks/ # Wagmi + contract interaction hooks
├── lib/ # utils like wagmi.ts, config.ts
├── contracts/
│ └── Factra.sol # Core smart contract
├── scripts/
│ └── deploy.ts # Hardhat deployment script
├── .env # Contains PRIVATE_KEY
├── hardhat.config.ts # Network config (Citrea RPC + Chain ID)
└── tsconfig.hardhat.json # Hardhat-specific TS config
└── README.md              # You're reading it!
```

---

## 🔗 Citrea Integration

### ✅ Citrea zkRollup used for:

| Functionality | Integration |
|---------------|-------------|
| Smart contract deployment | ✅ Deployed `Factra.sol` on Citrea |
| Invoice creation | ✅ Calls `createInvoice()` via Wagmi/Ethers |
| Invoice funding | ✅ Calls `fundInvoice()` using wallet |
| Viewing txs | ✅ Explorer: [explorer.testnet.citrea.xyz](https://explorer.testnet.citrea.xyz) |

---

### Citrea RPC Details:

```ts
networks: {
  citrea: {
    url: "https://rpc.testnet.citrea.xyz",
    chainId: 61774,
    accounts: [process.env.PRIVATE_KEY],
  }
}
```
---
### Run Locally:

run_locally:
  steps:
    - step: Clone and Install
      shell: bash
      commands:
        - git clone https://github.com/yourname/factra.git
        - cd factra
        - pnpm install

    - step: Setup Environment
      files:
        - path: .env
          content: |
            PRIVATE_KEY=your-testnet-private-key
      note: Get cBTC from [Citrea Faucet](https://faucet.testnet.citrea.xyz)

    - step: Deploy Smart Contract
      shell: bash
      commands:
        - npx hardhat compile --tsconfig tsconfig.hardhat.json
        - npx hardhat run scripts/deploy.ts --network citrea --tsconfig tsconfig.hardhat.json

    - step: Start Frontend
      shell: bash
      commands:
        - pnpm dev

future_improvements:
  - Integrate ERC-721 tokenization of invoices
  - Add credit scoring and oracle-based risk rating
  - Fully on-chain invoice validation
  - Supabase/Postgres database for invoice indexing
  - Auto payment collection (via `markAsPaid`)
  - Mainnet support post Citrea mainnet launch

authors:
  - name: Manan
    role: Fullstack + Smart Contracts
    notes: Hackathon project built for WaveHack using Citrea zkRollup
