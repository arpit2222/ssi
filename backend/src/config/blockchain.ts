import { ethers } from "ethers";
import { env } from "./env.js";

export const provider = new ethers.JsonRpcProvider(env.arbitrumRpcUrl);
export const signer = env.privateKey ? new ethers.Wallet(env.privateKey, provider) : undefined;
