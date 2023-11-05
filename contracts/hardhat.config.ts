import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//npx hardhat run ./scripts/deploy.ts --network ganache
//BorrowYourCar deployed to 0x11597685C408BC73c2472D91D3EbCb0f8665409c
const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '025cada30538960ad218942d2dc165b60ba52b64d6ad8b3b351924ba0bab9936'
      ]
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};

export default config;
