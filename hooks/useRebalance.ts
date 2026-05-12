"use client";

import { api } from "@/lib/api";

export async function rebalanceBasket(basketId: string) {
  const { data } = await api.post(`/rebalance/${basketId}`);
  return data;
}
