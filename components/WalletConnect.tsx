"use client";

import { LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { shortAddress } from "@/lib/utils";

export function WalletConnect() {
  const { user, login, logout, loading } = useAuth();
  if (loading) return <button className="btn btn-secondary">Loading</button>;
  if (user) {
    return (
      <button className="btn btn-secondary" onClick={logout} title="Disconnect wallet">
        <LogOut size={18} />
        {shortAddress(user.walletAddress)}
      </button>
    );
  }
  return (
    <button className="btn btn-primary" onClick={login} title="Connect wallet">
      <Wallet size={18} />
      Connect
    </button>
  );
}
