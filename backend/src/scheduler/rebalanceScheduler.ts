import cron from "node-cron";
import { Basket } from "../models/Basket.js";
import { executeRebalance } from "../services/rebalanceService.js";
import { logger } from "../utils/logger.js";

export function startRebalanceScheduler() {
  cron.schedule("0 2 1 * *", async () => {
    const due = await Basket.find({ status: "active", rebalanceSchedule: "monthly", nextRebalance: { $lte: new Date() } }).limit(25);
    for (const basket of due) {
      try {
        await executeRebalance(String(basket._id));
      } catch (error) {
        logger.error("Scheduled rebalance failed", basket._id, error);
      }
    }
  });
}
