import { Router } from "express";
import {
  currencies,
  currencyNews,
  etfHistorical,
  etfMetrics,
  featuredNews,
  tokenInsight
} from "../controllers/sosoValueController.js";

export const sosoValueRouter = Router();

sosoValueRouter.get("/currencies", currencies);
sosoValueRouter.get("/insight/:symbol", tokenInsight);
sosoValueRouter.get("/news", featuredNews);
sosoValueRouter.get("/news/:symbol", currencyNews);
sosoValueRouter.get("/etf/:type/metrics", etfMetrics);
sosoValueRouter.get("/etf/:type/historical-inflow", etfHistorical);
