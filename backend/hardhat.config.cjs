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
      url: "https://eth-sepolia.g.alchemy.com/v2/bMJ0G0Bh3Lc746InmC6RuQPf3HNLIkQ5",
      accounts: ["1792b2aa6bd088ff6c7acefb11d9e9fa0677587c3b7b89087f6e4f52fd2abc92"],
    },
  },
};
