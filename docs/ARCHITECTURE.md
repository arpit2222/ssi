# Architecture

```mermaid
flowchart LR
  User[Wallet user] --> Frontend[Next.js app]
  Frontend --> Backend[Express API]
  Backend --> Mongo[(MongoDB Atlas)]
  Backend --> SoSo[SoSoValue API]
  Backend --> SoDEX[SoDEX API]
  Frontend --> RPC[Arbitrum Sepolia RPC]
  Backend --> RPC
  RPC --> Contracts[Registry, Vault, Rebalance, Fees]
```

The frontend signs login messages and stores the JWT in localStorage. The backend verifies signatures, persists user and product data, and coordinates optional on-chain operations. Contracts hold the authoritative on-chain basket, vault, rebalance, and fee state.
