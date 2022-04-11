import { expect } from "chai";
import { ethers } from "hardhat";

import {
  WavePortal__factory as WavePortalFactoryType,
  WavePortal,
  // eslint-disable-next-line node/no-missing-import
} from "../typechain";

describe("Wave Portal test suit", function () {
  let WavePortalFactory: WavePortalFactoryType;
  let wavePortal: WavePortal;

  beforeEach(async () => {
    WavePortalFactory = await ethers.getContractFactory("WavePortal");
    wavePortal = await WavePortalFactory.deploy({
      value: ethers.utils.parseEther("0.1"),
    });
  });

  describe("Deployment", () => {
    it("Should deploy the contract with 0.1 ethers", async () => {
      const contractBalance = await ethers.provider.getBalance(
        wavePortal.address
      );

      expect(ethers.utils.formatEther(contractBalance)).to.equal("0.1");
    });

    it("Should have any wave when deployed", async () => {
      expect((await wavePortal.getTotalWaves()).toString()).to.equal("0");
    });
  });

  describe("Transactions", () => {
    it("Should create a new wave", async () => {
      await wavePortal.wave("Hello");

      const waves = await wavePortal.getWaves();

      expect(waves.length).to.equal(1);

      expect((await wavePortal.getTotalWaves()).toString()).to.equal("1");
    });

    it("Should not create a new wave when the sender try to wave twice in a row now without waiting 15 min", async () => {
      await wavePortal.wave("Hello");

      expect((await wavePortal.getTotalWaves()).toString()).to.equal("1");

      await expect(wavePortal.wave("Hello")).to.be.revertedWith("Wait 15m");
    });
  });
});
