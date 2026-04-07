import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  baseUrl: process.env.ACEPROXIES_BASE_URL,
  token: process.env.ACEPROXIES_TOKEN,
});

const health = await client.health.check();

console.log(health);
