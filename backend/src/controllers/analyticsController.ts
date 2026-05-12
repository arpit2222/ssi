import type { Request, Response } from "express";
import { Rebalance } from "../models/Rebalance.js";
import { getBasketAnalytics } from "../services/analyticsService.js";

export async function getAnalytics(req: Request, res: Response) {
  const analytics = await getBasketAnalytics(req.params.basketId);
  const rebalanceHistory = await Rebalance.find({ basketId: req.params.basketId }).sort({ createdAt: -1 }).limit(20).lean();
  res.json({ ...analytics, rebalanceHistory });
}

export async function compare(req: Request, res: Response) {
  const [left, right] = await Promise.all([getBasketAnalytics(req.params.basketId), getBasketAnalytics(req.params.vs)]);
  const leftReturn = left.performance.at(-1)?.cumulativeReturn || 0;
  const rightReturn = right.performance.at(-1)?.cumulativeReturn || 0;
  res.json({ comparison: { left: left.metrics, right: right.metrics }, outperformance: Number((leftReturn - rightReturn).toFixed(2)) });
}
