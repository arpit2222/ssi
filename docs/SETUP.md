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
