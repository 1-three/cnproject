import { expect } from "chai";
import { ethers } from "hardhat";
import { BillingSystem } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BillingSystem", function () {
  let billingSystem: BillingSystem;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const BillingSystem = await ethers.getContractFactory("BillingSystem");
    billingSystem = await BillingSystem.deploy();
  });

  describe("Meter Registration", function () {
    it("Should register a new meter", async function () {
      await billingSystem.registerMeter(user1.address, "electricity", ethers.parseEther("0.001"));
      
      const meter = await billingSystem.meters(1);
      expect(meter.user).to.equal(user1.address);
      expect(meter.meterType).to.equal("electricity");
      expect(meter.rate).to.equal(ethers.parseEther("0.001"));
      expect(meter.active).to.be.true;
    });

    it("Should emit MeterRegistered event", async function () {
      await expect(billingSystem.registerMeter(user1.address, "water", ethers.parseEther("0.002")))
        .to.emit(billingSystem, "MeterRegistered")
        .withArgs(1, user1.address, "water");
    });

    it("Should fail if not called by owner", async function () {
      await expect(
        billingSystem.connect(user1).registerMeter(user2.address, "gas", ethers.parseEther("0.003"))
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Bill Generation", function () {
    beforeEach(async function () {
      await billingSystem.registerMeter(user1.address, "electricity", ethers.parseEther("0.001"));
    });

    it("Should generate a bill", async function () {
      await billingSystem.generateBill(1, 100);
      
      const bills = await billingSystem.getMeterBills(1);
      expect(bills.length).to.equal(1);
      expect(bills[0].reading).to.equal(100);
      expect(bills[0].amount).to.equal(ethers.parseEther("0.1")); // 100 * 0.001
      expect(bills[0].paid).to.be.false;
    });

    it("Should emit BillGenerated event", async function () {
      await expect(billingSystem.generateBill(1, 100))
        .to.emit(billingSystem, "BillGenerated")
        .withArgs(1, 1, ethers.parseEther("0.1"));
    });

    it("Should fail if meter is not active", async function () {
      await billingSystem.toggleMeterStatus(1);
      await expect(billingSystem.generateBill(1, 100)).to.be.revertedWith("Meter is not active");
    });
  });

  describe("Bill Payment", function () {
    beforeEach(async function () {
      await billingSystem.registerMeter(user1.address, "electricity", ethers.parseEther("0.001"));
      await billingSystem.generateBill(1, 100);
    });

    it("Should pay a bill", async function () {
      await billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.1") });
      
      const bills = await billingSystem.getMeterBills(1);
      expect(bills[0].paid).to.be.true;
    });

    it("Should emit BillPaid event", async function () {
      await expect(
        billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.1") })
      )
        .to.emit(billingSystem, "BillPaid")
        .withArgs(1, 1, user1.address);
    });

    it("Should fail if payment amount is insufficient", async function () {
      await expect(
        billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail if bill is already paid", async function () {
      await billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.1") });
      
      await expect(
        billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Bill already paid");
    });

    it("Should return excess payment", async function () {
      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      const tx = await billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.15") });
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(user1.address);
      
      // User should have spent 0.1 ETH (bill amount) + gas fees
      expect(initialBalance - finalBalance).to.be.closeTo(
        ethers.parseEther("0.1") + gasUsed,
        ethers.parseEther("0.0001") // Small margin for rounding errors
      );
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await billingSystem.registerMeter(user1.address, "electricity", ethers.parseEther("0.001"));
    });

    it("Should update meter rate", async function () {
      await billingSystem.updateMeterRate(1, ethers.parseEther("0.002"));
      
      const meter = await billingSystem.meters(1);
      expect(meter.rate).to.equal(ethers.parseEther("0.002"));
    });

    it("Should toggle meter status", async function () {
      await billingSystem.toggleMeterStatus(1);
      
      let meter = await billingSystem.meters(1);
      expect(meter.active).to.be.false;
      
      await billingSystem.toggleMeterStatus(1);
      
      meter = await billingSystem.meters(1);
      expect(meter.active).to.be.true;
    });

    it("Should withdraw funds", async function () {
      // Generate and pay a bill
      await billingSystem.generateBill(1, 100);
      await billingSystem.connect(user1).payBill(1, 0, { value: ethers.parseEther("0.1") });
      
      const initialBalance = await ethers.provider.getBalance(owner.address);
      
      const tx = await billingSystem.withdrawFunds();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(owner.address);
      
      // Owner should have received 0.1 ETH minus gas fees
      expect(finalBalance).to.be.closeTo(
        initialBalance + ethers.parseEther("0.1") - gasUsed,
        ethers.parseEther("0.0001") // Small margin for rounding errors
      );
    });
  });
});