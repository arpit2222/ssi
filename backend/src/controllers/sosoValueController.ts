import type { Request, Response } from "express";
import {
  findCurrencyBySymbol,
  getCurrentEtfDataMetrics,
  getEtfHistoricalInflowChart,
  getFeaturedNews,
  getFeaturedNewsByCurrency,
  getListedCurrencies,
  getTokenInsight
} from "../services/sosoValueService.js";

export async function currencies(_req: Request, res: Response) {
  res.json({ currencies: await getListedCurrencies() });
}

export async function tokenInsight(req: Request, res: Response) {
  res.json({ insight: await getTokenInsight(req.params.symbol) });
}

export async function featuredNews(req: Request, res: Response) {
  const data = await getFeaturedNews({
    pageNum: Number(req.query.pageNum || 1),
    pageSize: Number(req.query.pageSize || 10),
    categoryList: req.query.categoryList ? String(req.query.categoryList) : undefined
  });
  res.json(data);
}

export async function currencyNews(req: Request, res: Response) {
  const currency = req.params.symbol ? await findCurrencyBySymbol(req.params.symbol) : undefined;
  const data = await getFeaturedNewsByCurrency({
    currencyId: currency?.id || (req.query.currencyId ? String(req.query.currencyId) : undefined),
    pageNum: Number(req.query.pageNum || 1),
    pageSize: Number(req.query.pageSize || 10),
    categoryList: req.query.categoryList ? String(req.query.categoryList) : undefined
  });
  res.json({ currency, ...data });
}

export async function etfMetrics(req: Request, res: Response) {
  const type = req.params.type === "us-eth-spot" ? "us-eth-spot" : "us-btc-spot";
  res.json({ type, data: await getCurrentEtfDataMetrics(type) });
}

export async function etfHistorical(req: Request, res: Response) {
  const type = req.params.type === "us-eth-spot" ? "us-eth-spot" : "us-btc-spot";
  res.json({ type, data: await getEtfHistoricalInflowChart(type) });
}
