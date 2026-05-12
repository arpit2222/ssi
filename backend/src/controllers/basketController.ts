import type { Request, Response } from "express";
import { Basket } from "../models/Basket.js";
import { Review } from "../models/Review.js";
import { Rebalance } from "../models/Rebalance.js";
import { createBasket, listBaskets } from "../services/basketService.js";

export async function create(req: Request, res: Response) {
  const basket = await createBasket(req.auth!.userId, req.body);
  res.status(201).json({ basketId: basket._id, basket, onChainId: basket.onChainId, txHash: basket.txHash });
}

export async function copy(req: Request, res: Response) {
  const source = await Basket.findById(req.params.id).lean();
  if (!source) return res.status(404).json({ error: "Basket not found" });
  const basket = await createBasket(req.auth!.userId, {
    name: `${source.name} Copy`,
    thesis: source.thesis,
    description: source.description,
    category: source.category,
    composition: source.composition,
    fees: source.fees,
    rebalanceSchedule: source.rebalanceSchedule
  });
  basket.copiedFrom = source._id as any;
  await basket.save();
  res.status(201).json({ basket });
}

export async function get(req: Request, res: Response) {
  const [basket, reviews, rebalanceHistory] = await Promise.all([
    Basket.findById(req.params.id).populate("creatorId", "walletAddress username bio profileImage").lean(),
    Review.find({ basketId: req.params.id }).populate("userId", "walletAddress username").sort({ createdAt: -1 }).limit(20).lean(),
    Rebalance.find({ basketId: req.params.id }).sort({ createdAt: -1 }).limit(20).lean()
  ]);
  if (!basket) return res.status(404).json({ error: "Basket not found" });
  res.json({ basket, reviews, rebalanceHistory, metrics: basket.metrics });
}

export async function list(req: Request, res: Response) {
  res.json(await listBaskets(req.query));
}

export async function update(req: Request, res: Response) {
  const basket = await Basket.findOneAndUpdate({ _id: req.params.id, creatorId: req.auth!.userId }, req.body, { new: true });
  if (!basket) return res.status(404).json({ error: "Basket not found or unauthorized" });
  res.json({ basket });
}

export async function remove(req: Request, res: Response) {
  const basket = await Basket.findOneAndUpdate({ _id: req.params.id, creatorId: req.auth!.userId }, { status: "paused" }, { new: true });
  if (!basket) return res.status(404).json({ error: "Basket not found or unauthorized" });
  res.json({ success: true });
}
