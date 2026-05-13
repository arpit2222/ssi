import Link from "next/link";
import { ArrowRight, BarChart3, Boxes, ShieldCheck, Download } from "lucide-react";
import { BasketCard } from "@/components/BasketCard";
import { API_URL } from "@/lib/constants";
import type { Basket } from "@/types";

async function getFeatured(): Promise<Basket[]> {
  try {
    const res = await fetch(`${API_URL}/api/marketplace/trending`, { cache: "no-store" });
    return (await res.json()).baskets || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await getFeatured();
  return (
    <div>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink md:text-6xl">Shopify for On-Chain Index Products</h1>
            <p className="mt-5 max-w-2xl text-lg text-gray-600">Turn your trading thesis into an investable index fund in 5 minutes. Earn up to 85% recurring revenue from followers with automated SoDEX rebalancing on Arbitrum Sepolia.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create-basket" className="btn btn-primary">Create Basket <ArrowRight size={18} /></Link>
              <Link href="/marketplace" className="btn btn-secondary">Browse Marketplace</Link>
            </div>
          </div>
          <div className="surface p-5">
            <div className="grid gap-3">
              {[["Total Addressable Market", "$500B+"], ["Creator Revenue Share", "85%"], ["Rebalance Execution", "Automated SoDEX"]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-lg bg-panel p-4">
                  <span className="text-gray-500">{k}</span><span className="text-xl font-black">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[["Connect", "Wallet-only auth with signed messages.", ShieldCheck], ["Build", "No-code allocations with sentiment data.", Boxes], ["Track", "Charts, reviews, subscriptions, fees.", BarChart3]].map(([title, body, Icon]: any) => (
            <div key={title} className="surface p-5"><Icon className="text-accent" /><h2 className="mt-3 font-black">{title}</h2><p className="mt-1 text-sm text-gray-600">{body}</p></div>
          ))}
        </div>
        <h2 className="mt-12 text-2xl font-black">Featured Baskets</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((basket) => <BasketCard key={basket._id} basket={basket} />)}
          {!featured.length && <div className="surface p-5 text-gray-500">Run backend seed to load the 10 demo baskets.</div>}
        </div>
        </div>
        <div className="mt-20 border-t border-line pt-14 pb-10 text-center">
          <h2 className="text-3xl font-black text-ink">Ready to see the full vision?</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Download our official Buildathon pitch deck to explore the $500B+ market opportunity, business model, and go-to-market strategy for the Shopify of On-Chain Indices.</p>
          <a href="/SSI_Strategy_Factory_Pitch.pptx" download className="btn btn-secondary mx-auto mt-6 inline-flex items-center gap-2 border-accent text-accent hover:bg-accent hover:text-white">
            <Download size={18} />
            Download Pitch Deck (.pptx)
          </a>
        </div>
      </section>
    </div>
  );
}
