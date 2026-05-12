import { BasketCard } from "@/components/BasketCard";
import { API_URL } from "@/lib/constants";
import { shortAddress } from "@/lib/utils";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const baskets = await fetch(`${API_URL}/api/basket?limit=6`, { cache: "no-store" }).then((r) => r.json()).then((d) => d.baskets).catch(() => []);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <section className="surface p-6">
        <div className="text-sm font-bold uppercase text-accent">Creator</div>
        <h1 className="mt-1 text-3xl font-black">{params.username}</h1>
        <p className="mt-2 text-gray-600">{shortAddress(baskets[0]?.creatorId?.walletAddress)} · Strategy creator profile</p>
        <button className="btn btn-secondary mt-4">Follow</button>
      </section>
      <h2 className="mt-8 text-xl font-black">Baskets</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{baskets.map((basket: any) => <BasketCard key={basket._id} basket={basket} />)}</div>
    </div>
  );
}
