# SSI Strategy Factory

SSI Strategy Factory is a full-stack hackathon build for creating, browsing, subscribing to, and rebalancing token index baskets on Arbitrum Sepolia.

## Apps

- Root app: Next.js 14, TypeScript, Tailwind, ethers, wagmi, recharts.
- `backend`: Express.js, MongoDB, Mongoose, JWT wallet auth, SoSoValue and SoDEX service adapters.
- `contracts`: Solidity contracts for basket registry, vault deposits, rebalance execution, and fee distribution.

## Quick Start

```bash
npm install
npm --prefix backend run seed
npm --prefix backend run dev
npm run dev
npm --prefix contracts test
```

Copy each `.env.example` file before running against real services.

## Current Scope

The repo includes all requested product surfaces and production integration seams. Real SoSoValue, SoDEX, MongoDB Atlas, deployer wallet, and Arbitrum Sepolia keys must be supplied through environment variables before live deployment.

## Verification

```bash
npm --prefix backend run build
npm run build
npm --prefix contracts test
```

## Deployment

- Vercel uses `vercel.json` and deploys the root Next.js app.
- Render uses `render.yaml` and deploys the `backend` API.
- Contracts deploy with `npm --prefix contracts run deploy:sepolia` after `contracts/.env` is filled.

## Arbitrum Sepolia Contracts

- BasketRegistry: `0x9A1EF6E5EFAE3c63dC41D2c7678B43889108C1d3`
- BasketVault: `0x2CB9ED6e8332b5124cB0f8E55A8428E52a9D6770`
- RebalanceEngine: `0xfa41C917D719e0B0FbFB842E1865122AE8490D1b`
- FeeDistribution: `0x8FFA1990441530691EB7380A88a7d061F6Ddd2B4`
