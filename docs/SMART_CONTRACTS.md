# Smart Contracts

## BasketRegistry

Registers baskets, tracks creators, metadata URI, follower count, status, and composition hash.

## BasketVault

Accepts ERC-20 deposits per basket, mints accounting shares, and handles withdrawals.

## RebalanceEngine

Stores target weight hashes, emits rebalance lifecycle events, and authorizes basket creators or operators.

## FeeDistribution

Accrues management and performance fees, splits platform and creator shares, and releases funds.

## Arbitrum Sepolia Deployment

- BasketRegistry: `0x9A1EF6E5EFAE3c63dC41D2c7678B43889108C1d3`
- BasketVault: `0x2CB9ED6e8332b5124cB0f8E55A8428E52a9D6770`
- RebalanceEngine: `0xfa41C917D719e0B0FbFB842E1865122AE8490D1b`
- FeeDistribution: `0x8FFA1990441530691EB7380A88a7d061F6Ddd2B4`
- Asset: Circle USDC on Arbitrum Sepolia, `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d`
- Platform wallet: `0x79601AC98F844aD09b485F739D3C478C5b131A10`
