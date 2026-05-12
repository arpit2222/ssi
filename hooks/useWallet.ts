"use client";

import { useAuth } from "@/context/AuthContext";

export function useWallet() {
  return useAuth();
}
