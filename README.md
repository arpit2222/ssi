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
