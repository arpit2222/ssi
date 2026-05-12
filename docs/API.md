# API

Base path: `/api`

## Auth

- `POST /auth/login` with `{ message, signature, walletAddress }`
- `GET /auth/me`

## Baskets

- `POST /basket/create`
- `POST /basket/:id/copy`
- `GET /basket/:id`
- `GET /basket`
- `PUT /basket/:id`
- `DELETE /basket/:id`

## Subscriptions

- `POST /subscription/:basketId`
- `GET /subscription/my`
- `GET /subscription/:id`
- `DELETE /subscription/:id`

## Rebalance

- `POST /rebalance/:basketId`
- `GET /rebalance/:basketId`

## Reviews

- `POST /review/:basketId`
- `GET /review/:basketId`

## Analytics

- `GET /analytics/:basketId`
- `GET /analytics/:basketId/compare/:vs`

## Marketplace

- `GET /marketplace/trending`
- `GET /marketplace/top-performers`
- `GET /marketplace/recommended`

## SoSoValue

Backed by the documented SoSoValue OpenAPI using the `x-soso-api-key` header.

- `GET /sosovalue/currencies`
- `GET /sosovalue/insight/:symbol`
- `GET /sosovalue/news?pageNum=1&pageSize=10&categoryList=1,2`
- `GET /sosovalue/news/:symbol?pageNum=1&pageSize=10`
- `GET /sosovalue/etf/us-btc-spot/metrics`
- `GET /sosovalue/etf/us-btc-spot/historical-inflow`
- `GET /sosovalue/etf/us-eth-spot/metrics`
- `GET /sosovalue/etf/us-eth-spot/historical-inflow`
