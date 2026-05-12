import axios, { AxiosError } from "axios";
import { env } from "../config/env.js";

export type SosoCurrency = {
  id: string;
  fullName: string;
  name: string;
};

export type SosoNewsItem = {
  id: string;
  sourceLink?: string;
  releaseTime?: number;
  author?: string;
  category?: number;
  matchedCurrencies?: SosoCurrency[];
  tags?: string[];
  multilanguageContent?: Array<{ language: string; title?: string; content?: string }>;
  quoteInfo?: {
    impressionCount?: number;
    likeCount?: number;
    replyCount?: number;
    retweetCount?: number;
  };
};

export type TokenInsight = {
  symbol: string;
  sentiment: number;
  price: number;
  newsScore: number;
  newsCount: number;
  currencyId?: string;
  latestNews: Array<{ id: string; title: string; releaseTime?: number; sourceLink?: string }>;
  source: "sosovalue" | "local-fallback";
};

type SosoEnvelope<T> = {
  code: number;
  msg: string | null;
  traceId?: string;
  data: T;
};

const fallbackPrices: Record<string, number> = {
  ETH: 3100,
  BTC: 64000,
  SOL: 145,
  ARB: 1.1,
  LINK: 16,
  UNI: 8.4,
  AAVE: 95,
  RNDR: 8.2,
  ONDO: 0.95,
  PENDLE: 5.8
};

const categoryWeights: Record<number, number> = {
  1: 1,
  2: 1.15,
  3: 1.1,
  4: 1.2,
  5: 0.9,
  6: 1,
  7: 0.85,
  9: 1.35,
  10: 1.25
};

const cache = new Map<string, { expiresAt: number; value: unknown }>();

function getCached<T>(key: string): T | undefined {
  const item = cache.get(key);
  if (!item || item.expiresAt < Date.now()) return undefined;
  return item.value as T;
}

function setCached<T>(key: string, value: T, ttlMs = 60_000) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

function sosoClient() {
  return axios.create({
    baseURL: env.sosoValueApiUrl,
    timeout: 12_000,
    headers: {
      "Content-Type": "application/json",
      "x-soso-api-key": env.sosoValueApiKey
    }
  });
}

function assertConfigured() {
  if (!env.sosoValueApiKey) {
    const error = new Error("SOSOVALUE_API_KEY is not configured");
    Object.assign(error, { status: 503 });
    throw error;
  }
}

async function requestSoso<T>(method: "GET" | "POST", path: string, options: { params?: unknown; data?: unknown } = {}) {
  assertConfigured();
  try {
    const res = await sosoClient().request<SosoEnvelope<T>>({
      method,
      url: path,
      params: options.params,
      data: options.data
    });
    if (res.data.code !== 0) {
      const error = new Error(res.data.msg || `SoSoValue API error on ${path}`);
      Object.assign(error, { status: 502, traceId: res.data.traceId });
      throw error;
    }
    return res.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    if (axiosError.response) {
      const status = axiosError.response.status === 429 ? 429 : 502;
      const wrapped = new Error(axiosError.response.data?.msg || axiosError.response.data?.message || "SoSoValue request failed");
      Object.assign(wrapped, { status, upstreamStatus: axiosError.response.status });
      throw wrapped;
    }
    throw error;
  }
}

function fallbackInsight(symbol: string): TokenInsight {
  return {
    symbol,
    sentiment: Math.round((symbol.charCodeAt(0) % 40) + 45),
    price: fallbackPrices[symbol] || 1,
    newsScore: 70,
    newsCount: 0,
    latestNews: [],
    source: "local-fallback"
  };
}

function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

function getEnglishTitle(item: SosoNewsItem) {
  const content = item.multilanguageContent?.find((entry) => entry.language === "en") || item.multilanguageContent?.[0];
  return content?.title || content?.content?.replace(/<[^>]+>/g, "").slice(0, 120) || "SoSoValue news item";
}

function deriveNewsScore(news: SosoNewsItem[]) {
  if (!news.length) return 50;
  const rawScore = news.slice(0, 20).reduce((sum, item) => {
    const quote = item.quoteInfo || {};
    const engagement =
      Math.log10(1 + Number(quote.impressionCount || 0)) * 4 +
      Math.log10(1 + Number(quote.likeCount || 0)) * 8 +
      Math.log10(1 + Number(quote.retweetCount || 0)) * 6 +
      Math.log10(1 + Number(quote.replyCount || 0)) * 5;
    const categoryBoost = categoryWeights[Number(item.category)] || 1;
    return sum + Math.min(100, 45 + engagement * categoryBoost);
  }, 0) / Math.min(news.length, 20);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export async function getListedCurrencies() {
  const cached = getCached<SosoCurrency[]>("soso:currencies");
  if (cached) return cached;

  const data = await requestSoso<Array<{ id?: string; currencyId?: string; fullName: string; name?: string; currencyName?: string }>>(
    "POST",
    "/openapi/v1/data/default/coin/list",
    { data: {} }
  );
  const currencies = data.map((item) => ({
    id: String(item.id || item.currencyId),
    fullName: item.fullName,
    name: String(item.name || item.currencyName || "").toUpperCase()
  }));
  return setCached("soso:currencies", currencies, 10 * 60_000);
}

export async function findCurrencyBySymbol(symbol: string) {
  const normalized = normalizeSymbol(symbol);
  const currencies = await getListedCurrencies();
  return currencies.find((currency) => currency.name.toUpperCase() === normalized);
}

export async function getFeaturedNews(params: { pageNum?: number; pageSize?: number; categoryList?: string } = {}) {
  const pageNum = params.pageNum || 1;
  const pageSize = Math.min(params.pageSize || 10, 100);
  const categoryList = params.categoryList || "1,2,3,4,5,6,7,9,10";
  return requestSoso<{ pageNum: string; pageSize: string; totalPages: string; total: string; list: SosoNewsItem[] }>(
    "GET",
    "/api/v1/news/featured",
    { params: { pageNum, pageSize, categoryList } }
  );
}

export async function getFeaturedNewsByCurrency(params: {
  currencyId?: string;
  pageNum?: number;
  pageSize?: number;
  categoryList?: string;
}) {
  const pageNum = params.pageNum || 1;
  const pageSize = Math.min(params.pageSize || 10, 100);
  const categoryList = params.categoryList || "1,2,3,4,5,6,7,9,10";
  return requestSoso<{ pageNum: string; pageSize: string; totalPages: string; total: string; list: SosoNewsItem[] }>(
    "GET",
    "/api/v1/news/featured/currency",
    { params: { currencyId: params.currencyId, pageNum, pageSize, categoryList } }
  );
}

export async function getEtfHistoricalInflowChart(type: "us-btc-spot" | "us-eth-spot") {
  return requestSoso<{ list: Array<Record<string, number | string>> }>(
    "POST",
    "/openapi/v2/etf/historicalInflowChart",
    { data: { type } }
  );
}

export async function getCurrentEtfDataMetrics(type: "us-btc-spot" | "us-eth-spot") {
  return requestSoso<Record<string, unknown>>(
    "POST",
    "/openapi/v2/etf/currentEtfDataMetrics",
    { data: { type } }
  );
}

export async function getTokenInsight(symbol: string): Promise<TokenInsight> {
  const normalized = normalizeSymbol(symbol);
  if (!env.sosoValueApiKey) return fallbackInsight(normalized);

  const cacheKey = `soso:insight:${normalized}`;
  const cached = getCached<TokenInsight>(cacheKey);
  if (cached) return cached;

  const currency = await findCurrencyBySymbol(normalized);
  if (!currency) return setCached(cacheKey, fallbackInsight(normalized), 5 * 60_000);

  const news = await getFeaturedNewsByCurrency({ currencyId: currency.id, pageNum: 1, pageSize: 20 });
  const list = news.list || [];
  const newsScore = deriveNewsScore(list);
  const insight: TokenInsight = {
    symbol: normalized,
    sentiment: newsScore,
    price: fallbackPrices[normalized] || 1,
    newsScore,
    newsCount: Number(news.total || list.length || 0),
    currencyId: currency.id,
    latestNews: list.slice(0, 5).map((item) => ({
      id: item.id,
      title: getEnglishTitle(item),
      releaseTime: item.releaseTime,
      sourceLink: item.sourceLink
    })),
    source: "sosovalue"
  };
  return setCached(cacheKey, insight, 2 * 60_000);
}

export async function enrichComposition<T extends { symbol: string; weight: number }>(composition: T[]) {
  return Promise.all(composition.map(async (asset) => ({ ...asset, ...(await getTokenInsight(asset.symbol)) })));
}
