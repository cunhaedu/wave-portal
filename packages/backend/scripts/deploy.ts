import { ethers } from "hardhat";

async function main() {
  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();

  await waveContract.deployed();

  console.log("WavePortal deployed to:", waveContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
