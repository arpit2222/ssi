import Link from "next/link";
import { Factory } from "lucide-react";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-black text-ink">
          <Factory className="text-accent" size={24} />
          SSI Strategy Factory
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-gray-600 md:flex">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/create-basket">Create</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/portfolio">Portfolio</Link>
        </nav>
        <WalletConnect />
      </div>
    </header>
  );
}
