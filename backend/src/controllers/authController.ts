import type { Request, Response } from "express";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

export async function login(req: Request, res: Response) {
  const { message, signature, walletAddress } = req.body;
  if (!message || !signature || !walletAddress) return res.status(400).json({ error: "Missing auth payload" });
  const recovered = ethers.verifyMessage(message, signature);
  if (recovered.toLowerCase() !== walletAddress.toLowerCase()) return res.status(401).json({ error: "Invalid signature" });

  const normalized = walletAddress.toLowerCase();
  const user = await User.findOneAndUpdate(
    { walletAddress: normalized },
    { $setOnInsert: { walletAddress: normalized, username: `ssi_${normalized.slice(2, 8)}` } },
    { upsert: true, new: true }
  );
  const token = jwt.sign({ userId: user._id, walletAddress: normalized }, env.jwtSecret, { expiresIn: "7d" });
  res.json({ token, user });
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.auth!.userId);
  res.json({ user });
}
