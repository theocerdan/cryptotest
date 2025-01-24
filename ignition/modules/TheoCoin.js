const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TheoModule = buildModule("TheoCoin", (m) => {
    const token = m.contract("TheoCoin", ["TheoCoin", "TC", 100]);

    return { token };
});

module.exports = TheoModule;