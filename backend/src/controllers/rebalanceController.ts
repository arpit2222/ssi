import type { Request, Response } from "express";
import { Basket } from "../models/Basket.js";
import { Rebalance } from "../models/Rebalance.js";
import { executeRebalance } from "../services/rebalanceService.js";

export async function run(req: Request, res: Response) {
  const basket = await Basket.findById(req.params.basketId);
  if (!basket) return res.status(404).json({ error: "Basket not found" });
  if (String(basket.creatorId) !== req.auth!.userId) return res.status(403).json({ error: "Creator only" });
  const rebalance = await executeRebalance(req.params.basketId);
  res.status(201).json({ txHash: rebalance.txHash, trades: rebalance.trades, feesCollected: rebalance.feesCollected, rebalance });
}

export async function history(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const offset = Number(req.query.offset || 0);
  const [items, total] = await Promise.all([
    Rebalance.find({ basketId: req.params.basketId }).sort({ createdAt: -1 }).skip(offset).limit(limit).lean(),
    Rebalance.countDocuments({ basketId: req.params.basketId })
  ]);
  res.json({ history: items, pagination: { limit, offset, total } });
}
