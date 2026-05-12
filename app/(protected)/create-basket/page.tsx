import { BasketBuilder } from "@/components/BasketBuilder";

export default function CreateBasketPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-black">Create Basket</h1>
      <p className="mt-1 text-gray-600">Set thesis, weights, fees, and publish to the marketplace.</p>
      <div className="mt-6"><BasketBuilder /></div>
    </div>
  );
}
