import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  baseUrl: process.env.ACEPROXIES_BASE_URL,
  token: process.env.ACEPROXIES_TOKEN,
});

await client.services.update("your-service-code", {
  auth: {
    method: "ip",
  },
});

console.log("Service auth method updated.");
