# 🏭 SSI Strategy Factory
**"The Shopify for On-Chain Index Products"**

![SSI Strategy Factory Pitch Deck](/public/SSI_Strategy_Factory_Pitch.pptx) *(Download our Pitch Deck from the `/public` folder or the Homepage)*

SSI Strategy Factory is a full-stack, decentralized platform allowing expert traders to create, monetize, and auto-rebalance crypto index funds in under 5 minutes without writing a single line of code.

Built for the **SoSoValue Buildathon**, our platform leverages the SoSoValue API for AI-driven sentiment analysis, and the SoDEX spot exchange for fully automated on-chain rebalancing execution.

---

## 🏆 Key Features

- **No-Code Basket Builder:** Traders input a thesis (e.g. "AI tokens"), and our engine uses the **SoSoValue API** to fetch live sentiment data, automatically recommending the optimal tokens and weights.
- **Creator Monetization:** Creators set Management and Performance fees, taking home **85%** of the recurring revenue.
- **Non-Custodial Vaults:** Followers invest seamlessly by depositing USDC directly into our secure smart contracts deployed on **Arbitrum Sepolia**. We never hold user funds.
- **SoDEX Auto-Rebalancing Engine:** Our Express backend calculates base-token weights, signs an EIP-712 transaction, and executes real market-buy spot trades automatically on the **SoDEX Testnet**.

---

## 🔗 Live Smart Contracts (Arbitrum Sepolia)

Our complete suite of non-custodial smart contracts is deployed and verified on the Arbitrum Sepolia testnet:

| Contract | Address |
|---|---|
| **BasketRegistry** | [`0x9A1EF6E5EFAE3c63dC41D2c7678B43889108C1d3`](https://sepolia.arbiscan.io/address/0x9A1EF6E5EFAE3c63dC41D2c7678B43889108C1d3) |
| **BasketVault** | [`0x2CB9ED6e8332b5124cB0f8E55A8428E52a9D6770`](https://sepolia.arbiscan.io/address/0x2CB9ED6e8332b5124cB0f8E55A8428E52a9D6770) |
| **RebalanceEngine** | [`0xfa41C917D719e0B0FbFB842E1865122AE8490D1b`](https://sepolia.arbiscan.io/address/0xfa41C917D719e0B0FbFB842E1865122AE8490D1b) |
| **FeeDistribution** | [`0x8FFA1990441530691EB7380A88a7d061F6Ddd2B4`](https://sepolia.arbiscan.io/address/0x8FFA1990441530691EB7380A88a7d061F6Ddd2B4) |

---

## 🏗 System Architecture

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, `wagmi`, `ethers`, `recharts`
- **Backend:** Express.js, MongoDB Atlas, Mongoose, JWT Wallet Auth
- **Blockchain:** Solidity, Hardhat, Arbitrum Sepolia
- **Integrations:**
  - **SoSoValue API:** Token analytics, market sentiment parsing, and charting data.
  - **SoDEX Spot API:** Real-time testnet execution (`https://testnet-gw.sodex.dev/api/v1/spot`).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install all dependencies
npm install

# 2. Seed the MongoDB database with demo baskets
npm --prefix backend run seed

# 3. Start the Express backend (localhost:5000)
npm --prefix backend run dev

# 4. Start the Next.js frontend (localhost:3000)
npm run dev

# 5. Run the Smart Contract test suite
npm --prefix contracts test
```

> **Note:** Copy the `.env.example` files to `.env` and `.env.local` in their respective directories before running. You will need a MongoDB Atlas URI, a SoSoValue API Key, and a Wallet Private Key for SoDEX signing.

---

## 🌍 Deployment
- **Frontend (Vercel):** Deploys the root Next.js application using `vercel.json`.
- **Backend (Render):** Auto-deploys the Express API using the `render.yaml` Blueprint.
- **Contracts (Arbitrum):** `npm --prefix contracts run deploy:sepolia`

*Built for the DeFi Revolution.*
