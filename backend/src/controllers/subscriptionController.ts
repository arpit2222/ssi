import type { Request, Response } from "express";
import { Basket } from "../models/Basket.js";
import { Subscription } from "../models/Subscription.js";
import { User } from "../models/User.js";

export async function subscribe(req: Request, res: Response) {
  const amount = Number(req.body.investmentAmount);
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid investment amount" });
  const basket = await Basket.findById(req.params.basketId);
  if (!basket) return res.status(404).json({ error: "Basket not found" });

  const subscription = await Subscription.findOneAndUpdate(
    { userId: req.auth!.userId, basketId: basket._id },
    { $inc: { investmentAmount: amount, shares: amount, currentValue: amount }, $set: { status: "active" } },
    { upsert: true, new: true }
  );
  await Basket.findByIdAndUpdate(basket._id, { $inc: { "metrics.aum": amount, "metrics.followers": 1 } });
  await User.findByIdAndUpdate(req.auth!.userId, { $inc: { "stats.basketsSubscribed": 1 } });
  res.status(201).json({ subscriptionId: subscription._id, subscription, txHash: subscription.txHash });
}

export async function mine(req: Request, res: Response) {
  const subscriptions = await Subscription.find({ userId: req.auth!.userId }).populate("basketId").sort({ updatedAt: -1 }).lean();
  res.json({ subscriptions });
}

export async function getSubscription(req: Request, res: Response) {
  const subscription = await Subscription.findById(req.params.id).populate("basketId").lean();
  if (!subscription) return res.status(404).json({ error: "Subscription not found" });
  res.json({ subscription });
}

export async function unsubscribe(req: Request, res: Response) {
  const subscription = await Subscription.findOneAndUpdate({ _id: req.params.id, userId: req.auth!.userId }, { status: "withdrawn" }, { new: true });
  if (!subscription) return res.status(404).json({ error: "Subscription not found" });
  res.json({ success: true });
}
