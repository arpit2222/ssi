import Link from "next/link";
import { ArrowUpRight, Star, Users } from "lucide-react";
import type { Basket } from "@/types";
import { money, pct } from "@/lib/utils";

export function BasketCard({ basket }: { basket: Basket }) {
  return (
    <Link href={`/basket/${basket._id}`} className="surface block p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-accent">{basket.category}</div>
          <h3 className="mt-1 text-lg font-black text-ink">{basket.name}</h3>
        </div>
        <ArrowUpRight size={18} className="text-gray-400" />
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-gray-600">{basket.thesis}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {basket.composition.slice(0, 4).map((asset) => (
          <span key={asset.symbol} className="rounded-md bg-panel px-2 py-1 text-xs font-bold text-gray-700">
            {asset.symbol} {asset.weight}%
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div><div className="text-gray-500">AUM</div><div className="font-black">{money(basket.metrics?.aum)}</div></div>
        <div><div className="text-gray-500">1M</div><div className="font-black text-accent">{pct(basket.metrics?.return1M)}</div></div>
        <div><div className="text-gray-500">Rating</div><div className="flex items-center gap-1 font-black"><Star size={14} />{basket.metrics?.rating || 0}</div></div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs text-gray-500">
        <Users size={14} /> {basket.metrics?.followers || 0} subscribers
      </div>
    </Link>
  );
}
