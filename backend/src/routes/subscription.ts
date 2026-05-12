import { Router } from "express";
import { getSubscription, mine, subscribe, unsubscribe } from "../controllers/subscriptionController.js";
import { requireAuth } from "../middleware/auth.js";

export const subscriptionRouter = Router();
subscriptionRouter.post("/:basketId", requireAuth, subscribe);
subscriptionRouter.get("/my", requireAuth, mine);
subscriptionRouter.get("/:id", getSubscription);
subscriptionRouter.delete("/:id", requireAuth, unsubscribe);
