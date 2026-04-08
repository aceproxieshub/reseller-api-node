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
- `services.getProxyList(code)`
- `services.getBandwidth(code)`
- `services.get(code)`
- `services.list()`

## Installation

```bash
npm install aceproxies-reseller-api
```

or

```bash
yarn add aceproxies-reseller-api
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
- `examples/services-get-proxy-list.mjs`
- `examples/services-get-bandwidth.mjs`
- `examples/services-get.mjs`
- `examples/services-list.mjs`

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
