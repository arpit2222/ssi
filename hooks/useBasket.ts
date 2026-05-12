"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Basket } from "@/types";

export function useBaskets(query = "") {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    api.get(`/basket${query}`).then(({ data }) => setBaskets(data.baskets)).finally(() => setLoading(false));
  }, [query]);
  return { baskets, loading };
}

export async function createBasket(payload: unknown) {
  const { data } = await api.post("/basket/create", payload);
  return data;
}
