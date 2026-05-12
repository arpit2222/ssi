import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const [deployer] = await ethers.getSigners();
  const usdc = process.env.USDC_ADDRESS;
  const platformWallet = process.env.PLATFORM_WALLET || deployer.address;

  if (!usdc) {
    throw new Error("USDC_ADDRESS is required");
  }

  const Registry = await ethers.getContractFactory("BasketRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const Vault = await ethers.getContractFactory("BasketVault");
  const vault = await Vault.deploy(usdc, await registry.getAddress());
  await vault.waitForDeployment();

  const Engine = await ethers.getContractFactory("RebalanceEngine");
  const engine = await Engine.deploy(await registry.getAddress());
  await engine.waitForDeployment();

  const Fees = await ethers.getContractFactory("FeeDistribution");
  const fees = await Fees.deploy(usdc, platformWallet);
  await fees.waitForDeployment();

  await registry.setOperator(await engine.getAddress(), true);

  console.log("BasketRegistry:", await registry.getAddress());
  console.log("BasketVault:", await vault.getAddress());
  console.log("RebalanceEngine:", await engine.getAddress());
  console.log("FeeDistribution:", await fees.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
