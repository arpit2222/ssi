import { Router } from "express";
import { accountState, quote, symbols, testOrder } from "../controllers/sodexController.js";
import { requireAuth } from "../middleware/auth.js";

export const sodexRouter = Router();

sodexRouter.get("/symbols", symbols);
sodexRouter.get("/account", accountState);
sodexRouter.get("/quote/:symbol", quote);
sodexRouter.post("/test-order", requireAuth, testOrder);
