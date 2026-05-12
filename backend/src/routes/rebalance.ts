import { Router } from "express";
import { history, run } from "../controllers/rebalanceController.js";
import { requireAuth } from "../middleware/auth.js";

export const rebalanceRouter = Router();
rebalanceRouter.post("/:basketId", requireAuth, run);
rebalanceRouter.get("/:basketId", history);
