import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  basketId: { type: Schema.Types.ObjectId, ref: "Basket", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 1000 }
}, { timestamps: true });

ReviewSchema.index({ basketId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
