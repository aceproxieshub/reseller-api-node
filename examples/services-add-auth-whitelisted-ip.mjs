import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  baseUrl: process.env.ACEPROXIES_BASE_URL,
  token: process.env.ACEPROXIES_TOKEN,
});

const whitelistedIp = await client.services.addAuthWhitelistedIp(
  "your-service-code",
  {
    ip: "203.0.113.10",
  },
);

console.log(whitelistedIp);
