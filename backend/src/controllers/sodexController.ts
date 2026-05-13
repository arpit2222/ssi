import type { Request, Response } from "express";
import { getSodexAccountState, getSodexSymbols, placeMarketBuyOrder, quoteTrade } from "../services/sodexService.js";

export async function symbols(_req: Request, res: Response) {
  res.json({ symbols: await getSodexSymbols() });
}

export async function accountState(_req: Request, res: Response) {
  res.json({ state: await getSodexAccountState() });
}

export async function quote(req: Request, res: Response) {
  const symbol = String(req.query.symbol || req.params.symbol || "BTC");
  const action = String(req.query.action || "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY";
  const amount = Number(req.query.amount || 5);
  res.json({ quote: await quoteTrade(symbol, action, amount) });
}

export async function testOrder(req: Request, res: Response) {
  const symbol = String(req.body.symbol || "TESTBTC");
  const amount = Number(req.body.amount || 5);
  const tradeQuote = await quoteTrade(symbol, "BUY", amount);
  const result = await placeMarketBuyOrder(tradeQuote);
  res.status(result.status === "submitted" ? 201 : 200).json({ quote: tradeQuote, result });
}
