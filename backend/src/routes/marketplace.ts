import { Router } from "express";
import { recommended, topPerformers, trending } from "../controllers/marketplaceController.js";
import { requireAuth } from "../middleware/auth.js";

export const marketplaceRouter = Router();
marketplaceRouter.get("/trending", trending);
marketplaceRouter.get("/top-performers", topPerformers);
marketplaceRouter.get("/recommended", requireAuth, recommended);
