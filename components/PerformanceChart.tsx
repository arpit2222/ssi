"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PerformancePoint } from "@/types";

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="return" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip />
          <Area type="monotone" dataKey="cumulativeReturn" stroke="#0f766e" fill="url(#return)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
