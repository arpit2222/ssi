import { Router } from "express";
import { compare, getAnalytics } from "../controllers/analyticsController.js";

export const analyticsRouter = Router();
analyticsRouter.get("/:basketId/compare/:vs", compare);
analyticsRouter.get("/:basketId", getAnalytics);
