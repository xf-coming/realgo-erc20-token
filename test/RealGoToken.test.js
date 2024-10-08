const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let simpleToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const SimpleToken = await ethers.getContractFactory("SimpleToken");
    simpleToken = await SimpleToken.deploy(1000);
    await simpleToken.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await simpleToken.totalSupply();
      const ownerBalance = await simpleToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(totalSupply);
    });
  });

  describe("Minting", function () {
    it("Should mint new tokens to an address", async function () {
      const addr1BalanceBefore = await simpleToken.balanceOf(addr1.address);
      await simpleToken.mint(addr1.address, 100);
      const addr1BalanceAfter = await simpleToken.balanceOf(addr1.address);
      expect(addr1BalanceAfter).to.equal(addr1BalanceBefore.add(100));
    });
  });

  describe("Transferring", function () {
    it("Should transfer tokens between accounts", async function () {
      await simpleToken.transfer(addr1.address, 100);
      const addr1Balance = await simpleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(simpleToken.connect(addr1).transfer(addr2.address, 1)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});