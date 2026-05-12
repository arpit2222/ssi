export type CompositionAsset = {
  symbol: string;
  weight: number;
  sentiment?: number;
  price?: number;
};

export type Basket = {
  _id: string;
  creatorId?: { walletAddress: string; username?: string } | string;
  name: string;
  thesis: string;
  description?: string;
  category: string;
  composition: CompositionAsset[];
  fees: { managementFee: number; performanceFee: number; copyFee?: number };
  metrics: {
    aum: number;
    followers: number;
    rating: number;
    return1W: number;
    return1M: number;
    return3M: number;
    return1Y: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  rebalanceSchedule: string;
  lastRebalance?: string;
  nextRebalance?: string;
  status: "active" | "paused";
  onChainId?: string;
};

export type User = {
  _id: string;
  walletAddress: string;
  username?: string;
  bio?: string;
  stats?: Record<string, number>;
};

export type PerformancePoint = {
  date: string;
  price: number;
  aum: number;
  dailyReturn: number;
  cumulativeReturn: number;
};
