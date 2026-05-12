import axios from "axios";
import { env } from "../config/env.js";

export type TradeQuote = {
  symbol: string;
  action: "BUY" | "SELL";
  amount: number;
  price: number;
  slippage: number;
  executable: boolean;
};

export async function quoteTrade(symbol: string, action: "BUY" | "SELL", amount: number): Promise<TradeQuote> {
  if (!env.sodexApiKey) {
    return { symbol, action, amount, price: amount, slippage: 0.35, executable: true };
  }

  const res = await axios.post(`${env.sodexApiUrl}/v1/quote`, { symbol, action, amount }, {
    headers: { Authorization: `Bearer ${env.sodexApiKey}` },
    timeout: 10_000
  });
  return {
    symbol,
    action,
    amount,
    price: Number(res.data.price),
    slippage: Number(res.data.slippage),
    executable: Boolean(res.data.executable)
  };
}

export async function submitSwap(quote: TradeQuote) {
  if (!env.sodexApiKey) {
    return { txHash: `simulated-${Date.now()}`, status: "completed" };
  }
  const res = await axios.post(`${env.sodexApiUrl}/v1/swap`, quote, {
    headers: { Authorization: `Bearer ${env.sodexApiKey}` },
    timeout: 20_000
  });
  return res.data;
}
