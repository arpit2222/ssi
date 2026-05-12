import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  walletAddress: { type: String, required: true, unique: true, lowercase: true, index: true },
  username: { type: String, unique: true, sparse: true },
  profileImage: String,
  bio: String,
  stats: {
    basketsCreated: { type: Number, default: 0 },
    basketsSubscribed: { type: Number, default: 0 },
    totalAUMManaged: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
