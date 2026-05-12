"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { BasketCard } from "@/components/BasketCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useBaskets } from "@/hooks/useBasket";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("return");
  const query = useMemo(() => `?search=${search}&category=${category}&sortBy=${sortBy}`, [search, category, sortBy]);
  const { baskets, loading } = useBaskets(query);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><h1 className="text-3xl font-black">Marketplace</h1><p className="mt-1 text-gray-600">Browse live and demo on-chain index products.</p></div>
        <div className="grid gap-2 md:grid-cols-[260px_160px_160px]">
          <div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={18} /><input className="field pl-10" placeholder="Search baskets" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <input className="field" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <select className="field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="return">Top return</option><option value="rating">Rating</option><option value="new">Newest</option></select>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? <LoadingSpinner /> : baskets.map((basket) => <BasketCard key={basket._id} basket={basket} />)}
      </div>
    </div>
  );
}
