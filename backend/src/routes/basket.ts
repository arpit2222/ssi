import { Router } from "express";
import { copy, create, get, list, remove, update } from "../controllers/basketController.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validation.js";
import { createBasketSchema } from "../utils/validators.js";

export const basketRouter = Router();
basketRouter.post("/create", requireAuth, validateBody(createBasketSchema), create);
basketRouter.post("/:id/copy", requireAuth, copy);
basketRouter.get("/:id", get);
basketRouter.get("/", list);
basketRouter.put("/:id", requireAuth, update);
basketRouter.delete("/:id", requireAuth, remove);
