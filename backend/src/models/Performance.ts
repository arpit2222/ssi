import mongoose, { Schema } from "mongoose";

const PerformanceSchema = new Schema({
  basketId: { type: Schema.Types.ObjectId, ref: "Basket", required: true, index: true },
  date: { type: Date, required: true, index: true },
  price: { type: Number, required: true },
  aum: { type: Number, default: 0 },
  dailyReturn: { type: Number, default: 0 },
  cumulativeReturn: { type: Number, default: 0 }
}, { timestamps: true });

PerformanceSchema.index({ basketId: 1, date: 1 }, { unique: true });

export const Performance = mongoose.model("Performance", PerformanceSchema);
