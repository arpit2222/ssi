import mongoose, { Schema } from "mongoose";

const WeightSchema = new Schema({ symbol: String, weight: Number }, { _id: false });
const TradeSchema = new Schema({
  symbol: String,
  marketSymbol: String,
  action: { type: String, enum: ["BUY", "SELL"] },
  amount: Number,
  price: Number,
  slippage: Number,
  status: String,
  reason: String,
  order: Schema.Types.Mixed,
  response: Schema.Types.Mixed
}, { _id: false });

const RebalanceSchema = new Schema({
  basketId: { type: Schema.Types.ObjectId, ref: "Basket", required: true, index: true },
  previousWeights: [WeightSchema],
  newWeights: [WeightSchema],
  trades: [TradeSchema],
  txHash: String,
  feesCollected: { type: Number, default: 0 },
  feeDistribution: {
    creator: { type: Number, default: 0 },
    platform: { type: Number, default: 0 }
  },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }
}, { timestamps: true });

export const Rebalance = mongoose.model("Rebalance", RebalanceSchema);
