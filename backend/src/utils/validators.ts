import { z } from "zod";

export const objectIdParam = z.string().min(12);

export const compositionSchema = z.array(z.object({
  symbol: z.string().min(2).max(12).transform((s) => s.toUpperCase()),
  weight: z.number().min(0).max(100),
  sentiment: z.number().min(-100).max(100).optional(),
  price: z.number().nonnegative().optional()
})).min(1).refine((items) => Math.round(items.reduce((sum, item) => sum + item.weight, 0)) === 100, {
  message: "weights must sum to 100"
});

export const createBasketSchema = z.object({
  name: z.string().min(3).max(80),
  thesis: z.string().min(10).max(1200),
  description: z.string().max(2000).optional(),
  category: z.string().min(2).max(40),
  composition: compositionSchema,
  fees: z.object({
    managementFee: z.number().min(0).max(10),
    performanceFee: z.number().min(0).max(50),
    copyFee: z.number().min(0).max(10).optional().default(0)
  }),
  rebalanceSchedule: z.enum(["daily", "weekly", "monthly"]).default("monthly")
});
