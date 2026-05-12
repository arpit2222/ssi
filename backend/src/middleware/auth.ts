import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export type AuthPayload = {
  userId: string;
  walletAddress: string;
};

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });

  try {
    req.auth = jwt.verify(header.slice(7), env.jwtSecret) as AuthPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
