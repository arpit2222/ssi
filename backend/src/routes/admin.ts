import { Router } from "express";
import { Basket } from "../models/Basket.js";
import { User } from "../models/User.js";

export const adminRouter = Router();
adminRouter.get("/stats", async (_req, res) => {
  const [users, baskets, tvl] = await Promise.all([
    User.countDocuments(),
    Basket.countDocuments(),
    Basket.aggregate([{ $group: { _id: null, tvl: { $sum: "$metrics.aum" } } }])
  ]);
  res.json({ users, baskets, tvl: tvl[0]?.tvl || 0 });
});
