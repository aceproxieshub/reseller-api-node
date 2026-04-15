import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const prolongations = await client.services.getProlongations("your-service-code");

console.log(prolongations);
