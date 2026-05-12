import { Basket } from "../models/Basket.js";
import { Performance } from "../models/Performance.js";
import { User } from "../models/User.js";
import { enrichComposition } from "./sosoValueService.js";
import { registerBasketOnChain } from "./blockchainService.js";

export async function createBasket(userId: string, input: any) {
  const composition = await enrichComposition(input.composition);
  const basket = await Basket.create({
    ...input,
    creatorId: userId,
    composition,
    description: input.description || input.thesis,
    nextRebalance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  const chain = await registerBasketOnChain({
    metadataURI: `ssi://basket/${basket._id}`,
    composition,
    managementFee: input.fees.managementFee,
    performanceFee: input.fees.performanceFee
  });
  basket.onChainId = chain.onChainId;
  basket.txHash = chain.txHash;
  await basket.save();
  await User.findByIdAndUpdate(userId, { $inc: { "stats.basketsCreated": 1 } });

  await seedPerformance(String(basket._id), basket.metrics?.aum || 10_000);
  return basket;
}

export async function seedPerformance(basketId: string, aum: number) {
  const docs = Array.from({ length: 30 }).map((_, index) => {
    const dailyReturn = Math.sin(index / 4) * 1.2 + 0.18;
    return {
      basketId,
      date: new Date(Date.now() - (29 - index) * 24 * 60 * 60 * 1000),
      price: Number((100 + index * 0.7 + Math.sin(index) * 2).toFixed(2)),
      aum,
      dailyReturn: Number(dailyReturn.toFixed(2)),
      cumulativeReturn: Number((index * 0.35 + Math.sin(index / 3) * 2).toFixed(2))
    };
  });
  await Performance.insertMany(docs, { ordered: false }).catch(() => undefined);
}

export async function listBaskets(query: any) {
  const filter: any = { status: "active" };
  if (query.category) filter.category = query.category;
  if (query.minRating) filter["metrics.rating"] = { $gte: Number(query.minRating) };
  if (query.search) filter.$text = { $search: query.search };
  const sort: any = query.sortBy === "return" ? { "metrics.return1M": -1 } : query.sortBy === "rating" ? { "metrics.rating": -1 } : { createdAt: -1 };
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Number(query.limit || 12), 50);
  const [baskets, total] = await Promise.all([
    Basket.find(filter).populate("creatorId", "walletAddress username").sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Basket.countDocuments(filter)
  ]);
  return { baskets, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}
