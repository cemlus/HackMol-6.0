require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.18",
    settings:{
      viaIR: true,
      optimizer:{
        enabled: true,
        runs:200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.envPROVIDER_URL,
      accounts: [process.env.WALLET],
    },
  },
};
