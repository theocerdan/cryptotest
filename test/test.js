const { expect } = require("chai");

describe("Token contract", function () {
    it("Can transfer token and check the balance", async function () {
        const [owner, toto] = await ethers.getSigners();

        const hardhatToken = await ethers.deployContract("Token");

        expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
        expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

        await hardhatToken.transfer(toto.address, 500_000);

        expect(await hardhatToken.balanceOf(owner.address)).to.equal(500_000);
        expect(await hardhatToken.balanceOf(toto.address)).to.equal(500_000);
    });

    it("Can transfer token and check the balance", async function () {
        const [owner, toto] = await ethers.getSigners();

        const hardhatToken = await ethers.deployContract("Token");

        expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
        expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

        await hardhatToken.transfer(toto.address, 500_000);

        expect(await hardhatToken.balanceOf(owner.address)).to.equal(500_000);
        expect(await hardhatToken.balanceOf(toto.address)).to.equal(500_000);
    });
});