import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const bandwidth = await client.services.getBandwidth("your-service-code");

console.log(bandwidth);
