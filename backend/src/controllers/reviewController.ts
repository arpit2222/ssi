import type { Request, Response } from "express";
import { Basket } from "../models/Basket.js";
import { Review } from "../models/Review.js";

export async function createReview(req: Request, res: Response) {
  const rating = Number(req.body.rating);
  if (rating < 1 || rating > 5) return res.status(400).json({ error: "Rating must be 1-5" });
  const review = await Review.findOneAndUpdate(
    { basketId: req.params.basketId, userId: req.auth!.userId },
    { rating, comment: req.body.comment || "" },
    { upsert: true, new: true }
  );
  const aggregate = await Review.aggregate([
    { $match: { basketId: review.basketId } },
    { $group: { _id: "$basketId", average: { $avg: "$rating" } } }
  ]);
  await Basket.findByIdAndUpdate(req.params.basketId, { "metrics.rating": Number((aggregate[0]?.average || rating).toFixed(2)) });
  res.status(201).json({ review });
}

export async function listReviews(req: Request, res: Response) {
  const reviews = await Review.find({ basketId: req.params.basketId }).populate("userId", "walletAddress username").sort({ createdAt: -1 }).lean();
  const averageRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  res.json({ reviews, averageRating });
}
