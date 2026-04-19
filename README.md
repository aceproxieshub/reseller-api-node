# Aceproxies Reseller API

Official TypeScript client for the Aceproxies reseller API. The package ships ESM JavaScript and type declarations for Node.js `>=18`.

## Overview

This client provides a typed interface for integrating with the Aceproxies reseller platform from Node.js applications and modern frontend stacks that rely on server-side API access.

Currently available resources include:

- `health.check()`
- `balance.get()`
- `orders.get(id)`
- `orders.list()`
- `orders.create()`
- `products.list()`
- `products.getTypes()`
- `services.getAuthCredentials(code)`
- `services.getAuthWhitelistedIps(code)`
- `services.addAuthWhitelistedIp(code, payload)`
- `services.deleteAuthWhitelistedIp(code, ip)`
- `services.requestProlongation(code, payload)`
- `services.updateAuthCredentials(code, payload)`
- `services.update(code, payload)`
- `services.getProxyList(code)`
- `services.getBandwidth(code)`
- `services.getProlongations(code)`
- `services.get(code)`
- `services.list()`
- `version.get()`

## Installation

```bash
npm install aceproxieshub/reseller-api-node
```

or

```bash
yarn add aceproxieshub/reseller-api-node
```

## Quick Start

```ts
import { createClient } from "aceproxies-reseller-api";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const health = await client.health.check();

console.log(health.status);
```

`baseUrl` is optional and defaults to the Aceproxies reseller API host.

## Examples

Example scripts are available in the [examples](./examples) directory:

- `examples/health-check.mjs`
- `examples/balance-get.mjs`
- `examples/orders-list.mjs`
- `examples/orders-get.mjs`
- `examples/orders-create.mjs`
- `examples/products-list.mjs`
- `examples/products-get-types.mjs`
- `examples/services-get-auth-credentials.mjs`
- `examples/services-get-auth-whitelisted-ips.mjs`
- `examples/services-add-auth-whitelisted-ip.mjs`
- `examples/services-delete-auth-whitelisted-ip.mjs`
- `examples/services-request-prolongation.mjs`
- `examples/services-update-auth-credentials.mjs`
- `examples/services-update.mjs`
- `examples/services-get-proxy-list.mjs`
- `examples/services-get-bandwidth.mjs`
- `examples/services-get-prolongations.mjs`
- `examples/services-get.mjs`
- `examples/services-list.mjs`
- `examples/version-get.mjs`

To run an example locally:

1. Copy `.env.dist` to `.env`
2. Set `ACEPROXIES_TOKEN`
3. Run the example script

```bash
node examples/health-check.mjs
```

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
