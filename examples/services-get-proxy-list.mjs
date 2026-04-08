import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const proxies = await client.services.getProxyList("your-service-code");

console.log(proxies);
