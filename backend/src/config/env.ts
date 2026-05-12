import dotenv from "dotenv";

dotenv.config();

export const env = {
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ssi-factory",
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev_only_change_me",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  sosoValueApiKey: process.env.SOSOVALUE_API_KEY || "",
  sosoValueApiUrl: process.env.SOSOVALUE_API_URL || "https://openapi.sosovalue.com",
  sodexApiKey: process.env.SODEX_API_KEY || "",
  sodexApiUrl: process.env.SODEX_API_URL || "https://api.sodex.com",
  arbitrumRpcUrl: process.env.ARBITRUM_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
  privateKey: process.env.PRIVATE_KEY || "",
  platformWallet: process.env.PLATFORM_WALLET || "",
  basketRegistryAddress: process.env.BASKET_REGISTRY_ADDRESS || "",
  basketVaultAddress: process.env.BASKET_VAULT_ADDRESS || "",
  rebalanceEngineAddress: process.env.REBALANCE_ENGINE_ADDRESS || "",
  feeDistributionAddress: process.env.FEE_DISTRIBUTION_ADDRESS || "",
  enableCron: process.env.ENABLE_CRON === "true"
};
