import { BrowserProvider } from "ethers";
import { api } from "./api";
import { ARBITRUM_SEPOLIA } from "./constants";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectAndLogin() {
  if (!window.ethereum) throw new Error("MetaMask or another injected wallet is required");
  const provider = new BrowserProvider(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ARBITRUM_SEPOLIA.chainId }] });
  } catch {
    await window.ethereum.request({ method: "wallet_addEthereumChain", params: [ARBITRUM_SEPOLIA] });
  }
  const signer = await provider.getSigner();
  const walletAddress = await signer.getAddress();
  const message = `Sign in to SSI Strategy Factory\nWallet: ${walletAddress}\nNonce: ${Date.now()}`;
  const signature = await signer.signMessage(message);
  const { data } = await api.post("/auth/login", { message, signature, walletAddress });
  localStorage.setItem("ssi_token", data.token);
  return data.user;
}
