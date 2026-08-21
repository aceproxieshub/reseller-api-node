import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const credentials = await client.services.getCredentials("your-service-code");

console.log(credentials);
