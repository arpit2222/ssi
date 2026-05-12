import type { Request, Response } from "express";
import { Basket } from "../models/Basket.js";

export async function trending(_req: Request, res: Response) {
  const baskets = await Basket.find({ status: "active" }).sort({ "metrics.followers": -1, "metrics.aum": -1 }).limit(10).lean();
  res.json({ baskets });
}

export async function topPerformers(_req: Request, res: Response) {
  const baskets = await Basket.find({ status: "active" }).sort({ "metrics.return1M": -1 }).limit(10).lean();
  res.json({ baskets });
}

export async function recommended(req: Request, res: Response) {
  const baskets = await Basket.find({ status: "active", creatorId: { $ne: req.auth!.userId } }).sort({ "metrics.rating": -1, "metrics.aum": -1 }).limit(10).lean();
  res.json({ baskets });
}
