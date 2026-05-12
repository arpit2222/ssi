import { BrowserProvider, Contract } from "ethers";

export function getBrowserProvider() {
  if (typeof window === "undefined" || !(window as any).ethereum) return null;
  return new BrowserProvider((window as any).ethereum);
}

export async function getContract(address: string, abi: any[]) {
  const provider = getBrowserProvider();
  if (!provider) throw new Error("Wallet not connected");
  return new Contract(address, abi, await provider.getSigner());
}
