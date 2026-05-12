"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types";
import { api } from "@/lib/api";
import { connectAndLogin } from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ssi_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me").then(({ data }) => setUser(data.user)).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login: async () => setUser(await connectAndLogin()),
    logout: () => {
      localStorage.removeItem("ssi_token");
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
