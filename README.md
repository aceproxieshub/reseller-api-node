# aceproxies-reseller-api

TypeScript API client for the Aceproxies reseller API. The package ships compiled ESM JavaScript and type declarations for Node.js `>=18`.

## Installation

```bash
npm install aceproxies-reseller-api
# or
yarn add aceproxies-reseller-api
```

## Usage

```ts
import { createClient } from "aceproxies-reseller-api";

const client = createClient({
  baseUrl: "https://your-api-host.example",
  token: "your-reseller-token",
});

const health = await client.health.check();

console.log(health.status);
```

## Development

```bash
just install
just test
just build
```
