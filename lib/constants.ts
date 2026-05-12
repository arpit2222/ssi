export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 421614);
export const ARBITRUM_SEPOLIA = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: "Arbitrum Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc"],
  blockExplorerUrls: ["https://sepolia.arbiscan.io"]
};
