import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config(); // ✅ Required to read .env values

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    citrea: {
      url: "https://rpc.testnet.citrea.xyz",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 5115,
    },
  },
};

export default config;
