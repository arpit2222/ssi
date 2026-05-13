# Setup

## Prerequisites

- Node.js 20+
- MongoDB Atlas connection string
- Arbitrum Sepolia RPC URL
- Test deployer private key with Sepolia ETH
- SoSoValue and SoDEX API credentials

## Install

```bash
npm install
```

## Backend

```bash
cp backend/.env.example backend/.env
npm --prefix backend run dev
```

## Frontend

```bash
cp .env.local.example .env.local
npm run dev
```

## Contracts

```bash
cp contracts/.env.example contracts/.env
npm --prefix contracts run compile
npm --prefix contracts run deploy:sepolia
```

## SoDEX Trading

SoDEX signed writes require:

```env
SODEX_API_URL=https://testnet-gw.sodex.dev/api/v1/spot
SODEX_API_KEY=default
SODEX_ACCOUNT_ADDRESS=0x79601AC98F844aD09b485F739D3C478C5b131A10
SODEX_ACCOUNT_ID=56898
SODEX_ENABLE_TRADING=false
PRIVATE_KEY=your_test_wallet_private_key
```

Set `SODEX_ENABLE_TRADING=true` only when you want the backend to submit real SoDEX testnet orders. With it disabled, the backend still builds and records signed-order payloads but does not submit them.
