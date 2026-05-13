"use client";

import { useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { RefreshCcw } from "lucide-react";
import { api } from "@/lib/api";
import { rebalanceBasket } from "@/hooks/useRebalance";
import type { Basket } from "@/types";
import { ARBITRUM_SEPOLIA, BASKET_VAULT_ADDRESS, USDC_ADDRESS } from "@/lib/constants";

const erc20Abi = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

const vaultAbi = [
  "function deposit(uint256 basketId, uint256 amount) returns (uint256)"
];

export function SubscribePanel({ basket }: { basket: Basket }) {
  const [amount, setAmount] = useState(500);
  const [status, setStatus] = useState("");
  async function subscribe() {
    if (!(window as any).ethereum) throw new Error("Wallet is required");
    if (!BASKET_VAULT_ADDRESS) throw new Error("Basket vault address is not configured");
    setStatus("Preparing wallet");
    const provider = new BrowserProvider((window as any).ethereum);
    await (window as any).ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARBITRUM_SEPOLIA.chainId }] });
    const signer = await provider.getSigner();
    const owner = await signer.getAddress();
    const value = parseUnits(String(amount), 6);
    const usdc = new Contract(USDC_ADDRESS, erc20Abi, signer);
    const vault = new Contract(BASKET_VAULT_ADDRESS, vaultAbi, signer);
    const allowance = await usdc.allowance(owner, BASKET_VAULT_ADDRESS);
    if (allowance < value) {
      setStatus("Approving USDC");
      await (await usdc.approve(BASKET_VAULT_ADDRESS, value)).wait();
    }
    if (!basket.onChainId) {
      setStatus("No on-chain basket id yet; recording off-chain subscription");
    } else {
      setStatus("Depositing on-chain");
      await (await vault.deposit(BigInt(basket.onChainId), value)).wait();
    }
    setStatus("Recording subscription");
    await api.post(`/subscription/${basket._id}`, { investmentAmount: amount });
    setStatus(basket.onChainId ? "Subscribed on-chain" : "Subscribed off-chain");
  }
  async function rebalance() {
    setStatus("Rebalancing");
    await rebalanceBasket(basket._id);
    setStatus("Rebalanced");
  }
  return (
    <aside className="surface h-fit space-y-4 p-5">
      <h2 className="text-lg font-black">Invest</h2>
      <div className="space-y-2">
        {basket.composition.map((asset) => (
          <div key={asset.symbol} className="flex justify-between rounded-lg bg-panel p-3 text-sm"><span className="font-bold">{asset.symbol}</span><span>{asset.weight}% · sentiment {asset.sentiment || 0}</span></div>
        ))}
      </div>
      <input className="field" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <button className="btn btn-primary w-full" onClick={subscribe}>Subscribe with test USDC</button>
      <button className="btn btn-secondary w-full" onClick={rebalance}><RefreshCcw size={17} /> Manual Rebalance</button>
      {status && <div className="rounded-lg bg-panel p-3 text-sm font-bold">{status}</div>}
    </aside>
  );
}
