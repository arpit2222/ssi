"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BasketCard } from "@/components/BasketCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";
import type { Basket } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => {
    api.get("/basket?limit=6").then(({ data }) => setBaskets(data.baskets));
    api.get("/subscription/my").then(({ data }) => setSubs(data.subscriptions)).catch(() => setSubs([]));
  }, []);
  const tvl = baskets.reduce((sum, b) => sum + (b.metrics?.aum || 0), 0);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-black">Dashboard</h1><p className="mt-1 text-gray-600">{user?.walletAddress || "Connect wallet to personalize this view."}</p></div>
        <Link href="/create-basket" className="btn btn-primary">New Basket</Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="Visible AUM" value={money(tvl)} />
        <Stat label="Created Baskets" value={user?.stats?.basketsCreated || baskets.length} />
        <Stat label="Subscriptions" value={subs.length} />
      </div>
      <h2 className="mt-8 text-xl font-black">Created and Discoverable Baskets</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{baskets.map((basket) => <BasketCard key={basket._id} basket={basket} />)}</div>
      <h2 className="mt-8 text-xl font-black">My Subscriptions</h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-panel"><tr><th className="p-3">Basket</th><th className="p-3">Invested</th><th className="p-3">Current</th><th className="p-3">Gain</th></tr></thead>
          <tbody>{subs.map((sub) => <tr key={sub._id} className="border-t border-line"><td className="p-3">{sub.basketId?.name}</td><td className="p-3">{money(sub.investmentAmount)}</td><td className="p-3">{money(sub.currentValue)}</td><td className="p-3">{money(sub.unrealizedGain)}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="surface p-5"><div className="text-sm text-gray-500">{label}</div><div className="mt-2 text-2xl font-black">{value}</div></div>;
}
