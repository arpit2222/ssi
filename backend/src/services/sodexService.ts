import axios from "axios";
import { ethers } from "ethers";
import { env } from "../config/env.js";

export type TradeQuote = {
  symbol: string;
  marketSymbol?: string;
  symbolID?: number;
  action: "BUY" | "SELL";
  amount: number;
  price: number;
  slippage: number;
  executable: boolean;
  reason?: string;
};

export type SodexOrderResult = {
  txHash?: string;
  status: "completed" | "submitted" | "skipped" | "simulated";
  order?: unknown;
  response?: unknown;
  reason?: string;
};

type SodexEnvelope<T> = {
  code: number;
  msg?: string;
  data: T;
};

type SodexSymbol = {
  id: number;
  name: string;
  displayName: string;
  baseCoin: string;
  quoteCoin: string;
  minNotional: string;
  status: string;
};

type BatchNewOrderItem = {
  symbolID: number;
  clOrdID: string;
  side: 1 | 2;
  type: 2;
  timeInForce: 3;
  price?: string;
  quantity?: string;
  funds?: string;
};

type BatchNewOrderRequest = {
  accountID: number;
  orders: BatchNewOrderItem[];
};

const SYMBOL_ALIASES: Record<string, string> = {
  BTC: "vBTC_vUSDC",
  ETH: "vETH_vUSDC",
  SOL: "vSOL_vUSDC",
  LINK: "vLINK_vUSDC",
  UNI: "vUNI_vUSDC",
  AAVE: "vAAVE_vUSDC",
  TESTBTC: "TESTBTC_vUSDC"
};

let cachedSymbols: { expiresAt: number; symbols: SodexSymbol[] } | undefined;
let lastNonce = 0;

function client() {
  return axios.create({
    baseURL: env.sodexApiUrl,
    timeout: 15_000,
    headers: { Accept: "application/json", "Content-Type": "application/json" }
  });
}

function nextNonce() {
  const now = Date.now();
  lastNonce = Math.max(now, lastNonce + 1);
  return lastNonce;
}

function stableAmount(value: number, decimals = 6) {
  return Number(value).toFixed(decimals).replace(/\.?0+$/, "");
}

async function requestSodex<T>(path: string, params?: Record<string, string | number>) {
  const res = await client().get<SodexEnvelope<T>>(path, { params });
  if (res.data.code !== 0) throw Object.assign(new Error(res.data.msg || "SoDEX request failed"), { status: 502 });
  return res.data.data;
}

async function signedSodexRequest<T>(method: "post" | "delete", path: string, actionType: string, body: unknown) {
  if (!env.privateKey || !env.sodexApiKey) {
    throw Object.assign(new Error("SoDEX signing credentials are not configured"), { status: 503 });
  }

  const nonce = nextNonce();
  const payload = { type: actionType, params: body };
  const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(payload)));
  const wallet = new ethers.Wallet(env.privateKey);
  const signature = await wallet.signTypedData(
    {
      name: "spot",
      version: "1",
      chainId: 138565,
      verifyingContract: "0x0000000000000000000000000000000000000000"
    },
    {
      ExchangeAction: [
        { name: "payloadHash", type: "bytes32" },
        { name: "nonce", type: "uint64" }
      ]
    },
    { payloadHash, nonce }
  );
  const signatureBytes = ethers.getBytes(signature);
  if (signatureBytes[64] >= 27) signatureBytes[64] -= 27;
  const typedSignature = `0x01${ethers.hexlify(signatureBytes).slice(2)}`;
  const res = await client().request<SodexEnvelope<T>>({
    method,
    url: path,
    data: body,
    headers: {
      "X-API-Key": env.sodexApiKey,
      "X-API-Sign": typedSignature,
      "X-API-Nonce": String(nonce)
    }
  });
  if (res.data.code !== 0) throw Object.assign(new Error(res.data.msg || "SoDEX signed request failed"), { status: 502, response: res.data });
  return res.data.data;
}

export async function getSodexSymbols() {
  if (cachedSymbols && cachedSymbols.expiresAt > Date.now()) return cachedSymbols.symbols;
  const symbols = await requestSodex<SodexSymbol[]>("/markets/symbols");
  cachedSymbols = { symbols, expiresAt: Date.now() + 10 * 60_000 };
  return symbols;
}

export async function getSodexAccountState(user = env.sodexAccountAddress) {
  if (!user) throw Object.assign(new Error("SODEX_ACCOUNT_ADDRESS is not configured"), { status: 503 });
  return requestSodex(`/accounts/${user}/state`);
}

export async function findSodexMarket(symbol: string) {
  const target = SYMBOL_ALIASES[symbol.toUpperCase()] || `v${symbol.toUpperCase()}_vUSDC`;
  const symbols = await getSodexSymbols();
  return symbols.find((item) => item.name === target && item.status === "TRADING");
}

export async function quoteTrade(symbol: string, action: "BUY" | "SELL", amount: number): Promise<TradeQuote> {
  const market = await findSodexMarket(symbol);
  if (!market) {
    return { symbol, action, amount, price: amount, slippage: 0, executable: false, reason: "SoDEX market not supported" };
  }
  if (action === "SELL") {
    return {
      symbol,
      marketSymbol: market.name,
      symbolID: market.id,
      action,
      amount,
      price: amount,
      slippage: 0,
      executable: false,
      reason: "Market sells require exact base-token quantity accounting"
    };
  }
  const minNotional = Number(market.minNotional || 5);
  const funds = Math.max(amount, minNotional);
  return {
    symbol,
    marketSymbol: market.name,
    symbolID: market.id,
    action,
    amount: funds,
    price: funds,
    slippage: 0.1,
    executable: true
  };
}

export async function placeMarketBuyOrder(quote: TradeQuote): Promise<SodexOrderResult> {
  if (!quote.executable || !quote.symbolID) return { status: "skipped", reason: quote.reason || "Quote is not executable" };
  const accountID = Number(env.sodexAccountId);
  if (!accountID) return { status: "skipped", reason: "SODEX_ACCOUNT_ID is not configured" };

  const order: BatchNewOrderItem = {
    symbolID: quote.symbolID,
    clOrdID: `ssi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.slice(0, 36),
    side: 1,
    type: 2,
    timeInForce: 3,
    funds: stableAmount(quote.amount)
  };
  const body: BatchNewOrderRequest = { accountID, orders: [order] };

  if (!env.sodexEnableTrading) {
    return { status: "simulated", order, reason: "SODEX_ENABLE_TRADING is false" };
  }

  const response = await signedSodexRequest("post", "/trade/orders/batch", "batchNewOrder", body);
  return { status: "submitted", order, response };
}

export async function submitSwap(quote: TradeQuote): Promise<SodexOrderResult> {
  if (quote.action !== "BUY") return { status: "skipped", reason: quote.reason || "Only market buys are enabled" };
  return placeMarketBuyOrder(quote);
}
