"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { api } from "@/lib/api";
import { rebalanceBasket } from "@/hooks/useRebalance";
import type { Basket } from "@/types";

export function SubscribePanel({ basket }: { basket: Basket }) {
  const [amount, setAmount] = useState(500);
  const [status, setStatus] = useState("");
  async function subscribe() {
    setStatus("Subscribing");
    await api.post(`/subscription/${basket._id}`, { investmentAmount: amount });
    setStatus("Subscribed");
  }
  async function rebalance() {
    setStatus("Rebalancing");
    await rebalanceBasket(basket._id);
    setStatus("Rebalanced");
  }
  return (
    <aside className="surface h-fit space-y-4 p-5">
      <h2 className="text-lg font-black">Invest</h2>
      <div className="space-y-2">
        {basket.composition.map((asset) => (
          <div key={asset.symbol} className="flex justify-between rounded-lg bg-panel p-3 text-sm"><span className="font-bold">{asset.symbol}</span><span>{asset.weight}% · sentiment {asset.sentiment || 0}</span></div>
        ))}
      </div>
      <input className="field" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button className="btn btn-primary w-full" onClick={subscribe}>Subscribe with test USDC</button>
      <button className="btn btn-secondary w-full" onClick={rebalance}><RefreshCcw size={17} /> Manual Rebalance</button>
      {status && <div className="rounded-lg bg-panel p-3 text-sm font-bold">{status}</div>}
    </aside>
  );
}
