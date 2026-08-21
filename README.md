# Aceproxies Reseller API for Node.js

The official typed client for the Aceproxies reseller API. It ships ESM JavaScript and TypeScript declarations, uses the Node.js `fetch` implementation, and validates API responses before returning them to application code.

## Requirements

Node.js 18 or newer. The package is installable with npm or Yarn and has no runtime dependencies.

## Installation

```bash
npm install aceproxieshub/reseller-api-node
```

```bash
yarn add aceproxieshub/reseller-api-node
```

## Getting started

```ts
import { createClient } from "aceproxies-reseller-api";

const client = createClient({ token: process.env.ACEPROXIES_TOKEN! });
const health = await client.health.getHealth();
const balance = await client.balance.getBalance();

console.log(health.status, balance.balance, balance.currency);
```

`baseUrl`, an alternative `fetch` implementation, and a positive `timeoutMs` can also be supplied. The timeout defaults to 30 seconds per attempt.

## Resources

- `client.getApiVersion()`
- `client.health.getHealth()` and `client.balance.getBalance()`
- `client.orders.list()`, `find()`, and `create()`
- `client.products.list()` and `types()`
- `client.services.list()`, `find()`, `getBandwidth()`, `getCredentials()`, `updateCredentials()`, `getWhitelistedIps()`, `addWhitelistedIp()`, `deleteWhitelistedIp()`, `getIpReplacements()`, `createIpReplacement()`, `getAvailableIpReplacements()`, `getIpReplacementCount()`, `getIpReplacementLocations()`, `getProlongations()`, `createProlongation()`, `getProxyList()`, and `update()`
- `client.services.residential.countries()`, `rotationIntervals()`, `proxyRequests()`, `findProxyRequest()`, `createProxyRequest()`, `deleteProxyRequest()`, and `getProxyList()`

Orders and services accept `{ page, limit }` pagination options. Lookup methods named `find`, plus service bandwidth and credential lookup, return `null` for HTTP 404.

## Retry and error policy

Read-only GET requests are attempted up to three times after transport failures, HTTP 429, and HTTP 5xx. Retries use bounded exponential jitter and honor `Retry-After` up to 30 seconds. Mutating requests are never automatically retried.

- `ValidationError` is thrown before transport for invalid public inputs.
- `ApiError` exposes the HTTP status, optional API error code, and raw response body.
- `TransportError` represents an exhausted fetch or timeout failure and preserves its cause.
- `InvalidResponseError` represents malformed JSON or an incompatible successful response.

Error bodies and responses can contain service or proxy credentials. Do not log them indiscriminately.

## Development

This repository uses [just](https://github.com/casey/just) to standardize local development commands.

List available tasks:

```bash
just -l
```

Common workflows:

```bash
just install
just test
just build
```
