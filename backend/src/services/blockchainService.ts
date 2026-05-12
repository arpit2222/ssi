import { ethers } from "ethers";
import { env } from "../config/env.js";
import { signer } from "../config/blockchain.js";

const registryAbi = [
  "function createBasket(string metadataURI, bytes32 compositionHash, uint16 managementFeeBps, uint16 performanceFeeBps) returns (uint256)",
  "function updateBasket(uint256 basketId, string metadataURI, bytes32 compositionHash, bool active)"
];

const engineAbi = [
  "function startRebalance(uint256 basketId, bytes32 targetHash)",
  "function completeRebalance(uint256 basketId, bytes32 executionHash, uint256 feeAmount)"
];

export function hashComposition(composition: unknown) {
  return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(composition)));
}

export async function registerBasketOnChain(params: {
  metadataURI: string;
  composition: unknown;
  managementFee: number;
  performanceFee: number;
}) {
  if (!signer || !env.basketRegistryAddress) return { onChainId: undefined, txHash: undefined };
  const contract = new ethers.Contract(env.basketRegistryAddress, registryAbi, signer);
  const tx = await contract.createBasket(
    params.metadataURI,
    hashComposition(params.composition),
    Math.round(params.managementFee * 100),
    Math.round(params.performanceFee * 100)
  );
  const receipt = await tx.wait();
  return { onChainId: undefined, txHash: receipt.hash as string };
}

export async function recordRebalanceOnChain(onChainId: string | undefined, composition: unknown, feeAmount: number) {
  if (!signer || !env.rebalanceEngineAddress || !onChainId) return { txHash: undefined };
  const contract = new ethers.Contract(env.rebalanceEngineAddress, engineAbi, signer);
  const targetHash = hashComposition(composition);
  const tx = await contract.startRebalance(BigInt(onChainId), targetHash);
  await tx.wait();
  const done = await contract.completeRebalance(BigInt(onChainId), targetHash, BigInt(Math.round(feeAmount)));
  const receipt = await done.wait();
  return { txHash: receipt.hash as string };
}
