import { ethers } from "hardhat";

async function main() {
  const registryAddress = process.env.BASKET_REGISTRY_ADDRESS;
  if (!registryAddress) throw new Error("BASKET_REGISTRY_ADDRESS is required");

  const registry = await ethers.getContractAt("BasketRegistry", registryAddress);
  const tx = await registry.createBasket(
    "ipfs://demo-ai-infra",
    ethers.keccak256(ethers.toUtf8Bytes("AI:40,RWA:35,DEFI:25")),
    150,
    1_500
  );
  await tx.wait();
  console.log("Seeded demo basket");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
