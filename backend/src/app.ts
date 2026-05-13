import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { basketRouter } from "./routes/basket.js";
import { subscriptionRouter } from "./routes/subscription.js";
import { rebalanceRouter } from "./routes/rebalance.js";
import { reviewRouter } from "./routes/reviews.js";
import { analyticsRouter } from "./routes/analytics.js";
import { marketplaceRouter } from "./routes/marketplace.js";
import { adminRouter } from "./routes/admin.js";
import { sosoValueRouter } from "./routes/sosovalue.js";
import { sodexRouter } from "./routes/sodex.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 180 }));

app.get("/health", (_req, res) => res.json({ ok: true, service: "ssi-strategy-factory" }));
app.use("/api/auth", authRouter);
app.use("/api/basket", basketRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/rebalance", rebalanceRouter);
app.use("/api/review", reviewRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/sosovalue", sosoValueRouter);
app.use("/api/sodex", sodexRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);
