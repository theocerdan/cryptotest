require("@nomicfoundation/hardhat-toolbox");

const { vars } = require("hardhat/config");

const ALCHEMY_URL = vars.get("ALCHEMY_URL");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `${ALCHEMY_URL}`,
      accounts: [`${PRIVATE_KEY}`],
    },
  },
};
