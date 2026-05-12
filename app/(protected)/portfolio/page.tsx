"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";

const colors = ["#0f766e", "#2563eb", "#9333ea", "#ea580c", "#475569"];

export default function PortfolioPage() {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => { api.get("/subscription/my").then(({ data }) => setSubs(data.subscriptions)).catch(() => setSubs([])); }, []);
  const total = subs.reduce((sum, sub) => sum + (sub.currentValue || 0), 0);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Portfolio</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="surface p-5">
          <div className="text-gray-500">Total value</div>
          <div className="text-3xl font-black">{money(total)}</div>
          <div className="mt-5 h-64">
            <ResponsiveContainer><PieChart><Pie data={subs} dataKey="currentValue" nameKey="basketId.name" outerRadius={90}>{subs.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </div>
        </div>
        <div className="surface overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-panel"><tr><th className="p-3">Basket</th><th className="p-3">Shares</th><th className="p-3">Value</th><th className="p-3">Fees</th></tr></thead>
            <tbody>{subs.map((sub) => <tr key={sub._id} className="border-t border-line"><td className="p-3 font-bold">{sub.basketId?.name}</td><td className="p-3">{sub.shares}</td><td className="p-3">{money(sub.currentValue)}</td><td className="p-3">{money(sub.feesAccumulated)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
