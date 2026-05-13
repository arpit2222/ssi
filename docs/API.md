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

## SoDEX

Backed by the documented SoDEX testnet spot API. Read routes are public. Order placement requires wallet auth and backend signing credentials.

- `GET /sodex/symbols`
- `GET /sodex/account`
- `GET /sodex/quote/:symbol?action=BUY&amount=5`
- `POST /sodex/test-order` with `{ "symbol": "TESTBTC", "amount": 5 }`
