"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Web3Provider } from "@/context/Web3Context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Web3Provider>{children}</Web3Provider>
    </AuthProvider>
  );
}
