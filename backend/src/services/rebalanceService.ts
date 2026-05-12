import { Basket } from "../models/Basket.js";
import { Rebalance } from "../models/Rebalance.js";
import { quoteTrade, submitSwap } from "./sodexService.js";
import { recordRebalanceOnChain } from "./blockchainService.js";

export async function executeRebalance(basketId: string) {
  const basket = await Basket.findById(basketId);
  if (!basket) throw Object.assign(new Error("Basket not found"), { status: 404 });

  const previousWeights = basket.composition.map((asset: any) => ({ symbol: asset.symbol, weight: asset.weight }));
  const newWeights = previousWeights.map((asset: any, index: number) => ({
    symbol: asset.symbol,
    weight: Number(Math.max(1, asset.weight + (index % 2 === 0 ? 1 : -1)).toFixed(2))
  }));
  const total = newWeights.reduce((sum: number, asset: any) => sum + asset.weight, 0);
  newWeights.forEach((asset: any) => { asset.weight = Number(((asset.weight / total) * 100).toFixed(2)); });

  const trades = await Promise.all(newWeights.map((asset: any) => quoteTrade(asset.symbol, asset.weight > 20 ? "BUY" : "SELL", asset.weight * 100)));
  await Promise.all(trades.map(submitSwap));
  const feesCollected = Number(((basket.metrics?.aum || 0) * ((basket.fees?.managementFee || 0) / 100) / 12).toFixed(2));
  const chain = await recordRebalanceOnChain(basket.onChainId || undefined, newWeights, feesCollected);

  basket.composition = basket.composition.map((asset: any) => ({
    ...(asset.toObject?.() || asset),
    weight: newWeights.find((next: any) => next.symbol === asset.symbol)?.weight || asset.weight
  })) as any;
  basket.lastRebalance = new Date();
  basket.nextRebalance = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await basket.save();

  return Rebalance.create({
    basketId,
    previousWeights,
    newWeights,
    trades,
    txHash: chain.txHash,
    feesCollected,
    feeDistribution: { creator: feesCollected * 0.8, platform: feesCollected * 0.2 },
    status: "completed"
  });
}
