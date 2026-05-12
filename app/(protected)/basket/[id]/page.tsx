import { SubscribePanel } from "./subscribe-panel";
import { PerformanceChart } from "@/components/PerformanceChart";
import { RebalanceHistory } from "@/components/RebalanceHistory";
import { ReviewSection } from "@/components/ReviewSection";
import { API_URL } from "@/lib/constants";
import { money, pct } from "@/lib/utils";

async function load(id: string) {
  const [detail, analytics] = await Promise.all([
    fetch(`${API_URL}/api/basket/${id}`, { cache: "no-store" }).then((r) => r.json()),
    fetch(`${API_URL}/api/analytics/${id}`, { cache: "no-store" }).then((r) => r.json()).catch(() => ({ performance: [] }))
  ]);
  return { ...detail, analytics };
}

export default async function BasketDetailPage({ params }: { params: { id: string } }) {
  const { basket, reviews, rebalanceHistory, analytics } = await load(params.id);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="surface p-6">
            <div className="text-sm font-bold uppercase text-accent">{basket.category}</div>
            <h1 className="mt-1 text-3xl font-black">{basket.name}</h1>
            <p className="mt-3 text-gray-600">{basket.thesis}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Metric label="AUM" value={money(basket.metrics.aum)} />
              <Metric label="1M Return" value={pct(basket.metrics.return1M)} />
              <Metric label="Sharpe" value={basket.metrics.sharpeRatio} />
              <Metric label="Max DD" value={pct(basket.metrics.maxDrawdown)} />
            </div>
          </div>
          <div className="surface p-5"><h2 className="text-xl font-black">Performance</h2><PerformanceChart data={analytics.performance || []} /></div>
          <div className="surface p-5"><h2 className="mb-4 text-xl font-black">Rebalance History</h2><RebalanceHistory items={rebalanceHistory || []} /></div>
          <div className="surface p-5"><h2 className="mb-4 text-xl font-black">Reviews</h2><ReviewSection basketId={basket._id} reviews={reviews || []} /></div>
        </section>
        <SubscribePanel basket={basket} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg bg-panel p-3"><div className="text-xs text-gray-500">{label}</div><div className="mt-1 text-lg font-black">{value}</div></div>;
}
