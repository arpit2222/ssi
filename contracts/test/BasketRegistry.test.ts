import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasketRegistry", () => {
  it("creates and updates baskets", async () => {
    const Registry = await ethers.getContractFactory("BasketRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();

    const hash = ethers.keccak256(ethers.toUtf8Bytes("ETH:50,BTC:50"));
    await expect(registry.createBasket("ipfs://basket", hash, 100, 1_000))
      .to.emit(registry, "BasketCreated")
      .withArgs(1, await (await ethers.getSigners())[0].getAddress(), "ipfs://basket", hash);

    await registry.updateBasket(1, "ipfs://basket-v2", hash, true);
    const basket = await registry.baskets(1);
    expect(basket.metadataURI).to.equal("ipfs://basket-v2");
  });
});
