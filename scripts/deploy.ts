import { ethers } from "hardhat";
import { InvoiceNFT__factory, Factra__factory } from "../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  // 1. Deploy InvoiceNFT
  const invoiceNFT = await new InvoiceNFT__factory(deployer).deploy("Factra Invoice NFT", "FINV");
  await invoiceNFT.waitForDeployment();
  const invoiceNFTAddress = await invoiceNFT.getAddress();
  console.log("✅ Deployed InvoiceNFT at:", invoiceNFTAddress);

  // 2. Deploy Factra linked to InvoiceNFT
  const factra = await new Factra__factory(deployer).deploy(invoiceNFTAddress);
  await factra.waitForDeployment();
  const factraAddress = await factra.getAddress();
  console.log("✅ Deployed Factra at:", factraAddress);

  // 3. Link them together
  const tx = await invoiceNFT.setFactraContract(factraAddress);
  await tx.wait();
  console.log(`🔗 Linked InvoiceNFT to Factra at ${factraAddress}`);

  console.log("\n🚀 Deployment complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
