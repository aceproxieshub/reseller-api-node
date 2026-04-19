import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

await client.services.deleteAuthWhitelistedIp(
  "your-service-code",
  "203.0.113.10",
);

console.log("Whitelisted IP deleted");
