import { createClient } from "../dist/index.js";

const client = createClient({
  baseUrl: process.env.ACEPROXIES_BASE_URL ?? "https://your-api-host.example",
  token: process.env.ACEPROXIES_TOKEN,
});

const health = await client.health.check();

console.log(health);
