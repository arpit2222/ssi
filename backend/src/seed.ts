import { connectDatabase } from "./config/database.js";
import { Basket } from "./models/Basket.js";
import { User } from "./models/User.js";
import { seedPerformance } from "./services/basketService.js";

const demos = [
  ["AI Infra Leaders", "AI", [["RNDR", 35], ["LINK", 25], ["ETH", 40]], 18.4],
  ["L2 Momentum", "Layer 2", [["ARB", 45], ["ETH", 35], ["LINK", 20]], 12.1],
  ["DeFi Blue Chips", "DeFi", [["UNI", 35], ["AAVE", 35], ["ETH", 30]], 9.7],
  ["RWA Yield Stack", "RWA", [["ONDO", 45], ["PENDLE", 30], ["ETH", 25]], 22.3],
  ["Solana Beta", "High Beta", [["SOL", 55], ["RNDR", 25], ["LINK", 20]], 26.9],
  ["BTC Defensive", "Defensive", [["BTC", 70], ["ETH", 20], ["AAVE", 10]], 8.2],
  ["ETH Ecosystem", "Ecosystem", [["ETH", 55], ["ARB", 25], ["UNI", 20]], 11.5],
  ["Liquid Staking", "Yield", [["ETH", 60], ["PENDLE", 25], ["AAVE", 15]], 14.8],
  ["Crypto Macro Barbell", "Macro", [["BTC", 45], ["ETH", 35], ["ONDO", 20]], 10.4],
  ["Onchain Cashflow", "Fees", [["AAVE", 30], ["UNI", 30], ["LINK", 20], ["ETH", 20]], 13.6]
] as const;

async function main() {
  await connectDatabase();
  const creator = await User.findOneAndUpdate(
    { walletAddress: "0x000000000000000000000000000000000000dEaD".toLowerCase() },
    { walletAddress: "0x000000000000000000000000000000000000dEaD".toLowerCase(), username: "ssi_demo" },
    { upsert: true, new: true }
  );

  for (const [name, category, parts, return1M] of demos) {
    const exists = await Basket.findOne({ name });
    if (exists) continue;
    const basket = await Basket.create({
      creatorId: creator._id,
      name,
      category,
      thesis: `${name} captures a systematic on-chain index thesis using sentiment, liquidity, and risk constraints.`,
      description: `Pre-loaded demo basket for ${category} exposure.`,
      composition: parts.map(([symbol, weight]) => ({ symbol, weight, sentiment: 70, price: 1 })),
      fees: { managementFee: 1.5, performanceFee: 15, copyFee: 0.5 },
      metrics: {
        aum: Math.round(25_000 + Math.random() * 175_000),
        followers: Math.round(20 + Math.random() * 500),
        rating: Number((4 + Math.random()).toFixed(1)),
        return1W: Number((return1M / 4).toFixed(1)),
        return1M,
        return3M: Number((return1M * 2.4).toFixed(1)),
        return1Y: Number((return1M * 5.3).toFixed(1)),
        volatility: Number((18 + Math.random() * 22).toFixed(1)),
        sharpeRatio: Number((0.9 + Math.random() * 1.7).toFixed(2)),
        maxDrawdown: Number((-5 - Math.random() * 18).toFixed(1))
      },
      rebalanceSchedule: "monthly",
      nextRebalance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    await seedPerformance(String(basket._id), basket.metrics?.aum || 10_000);
  }
  console.log("Seeded demo baskets");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
