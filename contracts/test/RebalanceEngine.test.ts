import { expect } from "chai";
import { ethers } from "hardhat";

describe("RebalanceEngine", () => {
  it("emits rebalance lifecycle events for creator", async () => {
    const Registry = await ethers.getContractFactory("BasketRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    await registry.createBasket("ipfs://basket", ethers.keccak256(ethers.toUtf8Bytes("x")), 100, 1_000);

    const Engine = await ethers.getContractFactory("RebalanceEngine");
    const engine = await Engine.deploy(await registry.getAddress());
    await engine.waitForDeployment();

    const target = ethers.keccak256(ethers.toUtf8Bytes("new weights"));
    await expect(engine.startRebalance(1, target)).to.emit(engine, "RebalanceStarted");
    await expect(engine.completeRebalance(1, target, 42)).to.emit(engine, "RebalanceCompleted");
  });
});
