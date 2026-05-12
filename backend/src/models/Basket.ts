import mongoose, { Schema } from "mongoose";

const CompositionSchema = new Schema({
  symbol: { type: String, required: true },
  weight: { type: Number, required: true },
  sentiment: { type: Number, default: 0 },
  price: { type: Number, default: 0 }
}, { _id: false });

const BasketSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, index: "text" },
  thesis: { type: String, required: true },
  description: String,
  category: { type: String, required: true, index: true },
  composition: [CompositionSchema],
  fees: {
    managementFee: { type: Number, default: 0 },
    performanceFee: { type: Number, default: 0 },
    copyFee: { type: Number, default: 0 }
  },
  metrics: {
    aum: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    return1W: { type: Number, default: 0 },
    return1M: { type: Number, default: 0 },
    return3M: { type: Number, default: 0 },
    return1Y: { type: Number, default: 0 },
    volatility: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 }
  },
  rebalanceSchedule: { type: String, default: "monthly" },
  lastRebalance: Date,
  nextRebalance: Date,
  status: { type: String, enum: ["active", "paused"], default: "active", index: true },
  onChainId: String,
  txHash: String,
  copiedFrom: { type: Schema.Types.ObjectId, ref: "Basket" }
}, { timestamps: true });

BasketSchema.index({ name: "text", thesis: "text", category: "text" });

export const Basket = mongoose.model("Basket", BasketSchema);
