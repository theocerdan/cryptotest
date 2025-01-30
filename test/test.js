const { expect } = require("chai");
const {
    constants,
} = require('@openzeppelin/test-helpers');

describe("Token contract", function () {

    let hardhatToken;
    let owner, toto;

    before(async () => {
        [owner, toto] = await ethers.getSigners();
    })

    beforeEach(async() => {
        hardhatToken = await ethers.deployContract("Token");
    })

    describe("transfer()", async () => {
        it("Can transfer token", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

            await hardhatToken.transfer(toto.address, 500_000);

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(500_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(500_000);
        });

        it("Cannot transfer token because not enough token", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

            await expect(hardhatToken.transfer(toto.address, 1_500_000)).to.be.revertedWith("Not enough tokens");
        });

        it("Transfer emit event", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

            await expect(hardhatToken.transfer(toto.address, 500_000))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, toto.address, 500_000);
        });

    })
    describe("balanceOf()", () => {
        it("Can check the balance", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(1_000_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(0);

            await hardhatToken.transfer(toto.address, 500_000);

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(500_000);
            expect(await hardhatToken.balanceOf(toto.address)).to.equal(500_000);
        });

        it("Can check the balance of address(0)", async function () {
            expect(await hardhatToken.totalSupply()).to.equal(1_000_000);

            expect(await hardhatToken.balanceOf(constants.ZERO_ADDRESS)).to.equal(0);
        });
    });

    describe('misc', () => {
        it("Check the total supply", async function () {
            expect(await hardhatToken.totalSupply()).to.equal(1_000_000);
        });
    });

});

describe("NFT", function () {
    it("Can mint new token", async function () {
        const [owner, toto] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        expect(await myNft.balanceOf(owner.address)).to.equal(1);
        expect(await myNft.ownerOf(0)).to.equal(owner.address);
    });

    it("Mint token will increase the counter", async function () {
        const [owner, toto] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        expect(await myNft._tokenIdCounter()).to.equal(1);
    });

    it("Can transfer token", async function () {
        const [owner, toto] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        await myNft.transferFrom(owner.address, toto.address, 0);

        //check old owner
        expect(await myNft.balanceOf(owner.address)).to.not.equal(1);
        expect(await myNft.ownerOf(0)).to.not.equal(owner.address);

        //check new owner
        expect(await myNft.balanceOf(toto.address)).to.equal(1);
        expect(await myNft.ownerOf(0)).to.equal(toto.address);
    });

    it("Check owner", async function () {
        const [owner, toto] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        expect(await myNft.ownerOf(0)).to.equal(owner.address);
    });

    it("Allow operator to transfer", async function () {
        const [owner, toto, tata] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        await myNft.approve(toto.address, 0);

        await myNft.connect(toto).transferFrom(owner.address, tata.address, 0)

        expect(await myNft.ownerOf(0)).to.equal(tata.address);
        expect(await myNft.getApproved(0)).to.equal(constants.ZERO_ADDRESS);
    });

    it("Check operator", async function () {
        const [owner, toto, tata] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint();

        await myNft.approve(toto.address, 0);

        expect(await myNft.getApproved(0)).to.equal(toto.address);
    });


    it("Allow operator (All) to transfer", async function () {
        const [owner, operator, tata] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint(); // 0
        await myNft.mint(); // 1
        await myNft.mint(); // 2

        await myNft.setApprovalForAll(operator.address, true);

        expect(await myNft.isApprovedForAll(owner.address, operator.address)).to.equal(true);

        await myNft.connect(operator).transferFrom(owner.address, tata.address, 1);
        await myNft.connect(operator).transferFrom(owner.address, tata.address, 2);

        expect(await myNft.balanceOf(tata.address)).to.equal(2);
    });

    it("Check operator (All) ", async function () {
        const [owner, operator, tata] = await ethers.getSigners();

        const myNft = await ethers.deployContract("MyNFT");

        await myNft.mint(); // 0
        await myNft.mint(); // 1
        await myNft.mint(); // 2

        await myNft.setApprovalForAll(operator.address, true);

        expect(await myNft.isApprovedForAll(owner.address, operator.address)).to.equal(true);
    });

});