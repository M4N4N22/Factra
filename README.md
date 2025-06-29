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

## 🏗️ Folder Structure

