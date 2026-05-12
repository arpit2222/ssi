import { Router } from "express";
import { createReview, listReviews } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

export const reviewRouter = Router();
reviewRouter.post("/:basketId", requireAuth, createReview);
reviewRouter.get("/:basketId", listReviews);
