"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Rocket, Trash2 } from "lucide-react";
import { createBasket } from "@/hooks/useBasket";

const starter = [{ symbol: "ETH", weight: 40 }, { symbol: "ARB", weight: 30 }, { symbol: "LINK", weight: 30 }];

export function BasketBuilder() {
  const router = useRouter();
  const [assets, setAssets] = useState(starter);
  const [form, setForm] = useState({ name: "Arbitrum Conviction Index", category: "Layer 2", thesis: "A diversified strategy for Arbitrum ecosystem beta with liquidity and sentiment-aware weights.", managementFee: 1.5, performanceFee: 15 });
  const [saving, setSaving] = useState(false);
  const total = assets.reduce((sum, asset) => sum + Number(asset.weight), 0);

  async function publish() {
    setSaving(true);
    const { basketId } = await createBasket({
      name: form.name,
      category: form.category,
      thesis: form.thesis,
      composition: assets.map((asset) => ({ ...asset, weight: Number(asset.weight) })),
      fees: { managementFee: Number(form.managementFee), performanceFee: Number(form.performanceFee), copyFee: 0.5 },
      rebalanceSchedule: "monthly"
    });
    router.push(`/basket/${basketId}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="surface space-y-5 p-5">
        <input className="field text-xl font-black" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <textarea className="field min-h-28" value={form.thesis} onChange={(e) => setForm({ ...form, thesis: e.target.value })} />
        <div className="space-y-3">
          {assets.map((asset, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_40px] gap-3">
              <input className="field font-bold uppercase" value={asset.symbol} onChange={(e) => setAssets(assets.map((a, i) => i === index ? { ...a, symbol: e.target.value.toUpperCase() } : a))} />
              <input className="field" type="number" value={asset.weight} onChange={(e) => setAssets(assets.map((a, i) => i === index ? { ...a, weight: Number(e.target.value) } : a))} />
              <button className="btn btn-secondary px-0" onClick={() => setAssets(assets.filter((_, i) => i !== index))}><Trash2 size={16} /></button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => setAssets([...assets, { symbol: "UNI", weight: 0 }])}><Plus size={16} /> Asset</button>
        </div>
      </div>
      <aside className="surface h-fit space-y-4 p-5">
        <h2 className="text-lg font-black">Publish Preview</h2>
        <div className={total === 100 ? "text-accent" : "text-risk"}>Total weight: {total}%</div>
        <label className="block text-sm font-bold">Management fee<input className="field mt-1" type="number" value={form.managementFee} onChange={(e) => setForm({ ...form, managementFee: Number(e.target.value) })} /></label>
        <label className="block text-sm font-bold">Performance fee<input className="field mt-1" type="number" value={form.performanceFee} onChange={(e) => setForm({ ...form, performanceFee: Number(e.target.value) })} /></label>
        <button disabled={saving || total !== 100} className="btn btn-primary w-full disabled:opacity-50" onClick={publish}><Rocket size={17} /> {saving ? "Publishing" : "Publish"}</button>
      </aside>
    </div>
  );
}
