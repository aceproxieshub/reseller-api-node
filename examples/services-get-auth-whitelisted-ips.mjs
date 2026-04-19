import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const whitelistedIps = await client.services.getAuthWhitelistedIps(
  "your-service-code",
);

console.log(whitelistedIps);
