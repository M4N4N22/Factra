import { ethers } from "hardhat";

async function main() {
  const Factra = await ethers.getContractFactory("Factra");
  const factra = await Factra.deploy();

  await factra.waitForDeployment();

  console.log("✅ Deployed Factra at:", await factra.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
