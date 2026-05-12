import { Performance } from "../models/Performance.js";

export function calculateMetrics(points: Array<{ dailyReturn: number; cumulativeReturn: number }>) {
  if (!points.length) return { sharpeRatio: 0, maxDrawdown: 0, volatility: 0 };
  const returns = points.map((p) => p.dailyReturn / 100);
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - avg) ** 2, 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(365) * 100;
  const sharpeRatio = volatility === 0 ? 0 : (avg * 365 * 100) / volatility;
  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const point of points) {
    peak = Math.max(peak, point.cumulativeReturn);
    maxDrawdown = Math.min(maxDrawdown, point.cumulativeReturn - peak);
  }
  return {
    sharpeRatio: Number(sharpeRatio.toFixed(2)),
    maxDrawdown: Number(maxDrawdown.toFixed(2)),
    volatility: Number(volatility.toFixed(2))
  };
}

export async function getBasketAnalytics(basketId: string) {
  const performance = await Performance.find({ basketId }).sort({ date: 1 }).lean();
  return { performance, metrics: calculateMetrics(performance) };
}
