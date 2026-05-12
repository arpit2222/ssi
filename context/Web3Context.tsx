"use client";

import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";

const Web3Context = createContext({ walletAddress: "" });

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const value = useMemo(() => ({ walletAddress: user?.walletAddress || "" }), [user]);
  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  return useContext(Web3Context);
}
