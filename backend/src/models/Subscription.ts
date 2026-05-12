import mongoose, { Schema } from "mongoose";

const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  basketId: { type: Schema.Types.ObjectId, ref: "Basket", required: true, index: true },
  investmentAmount: { type: Number, required: true },
  shares: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  unrealizedGain: { type: Number, default: 0 },
  feesAccumulated: { type: Number, default: 0 },
  txHash: String,
  status: { type: String, enum: ["active", "withdrawn"], default: "active" }
}, { timestamps: true });

SubscriptionSchema.index({ userId: 1, basketId: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
