import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const services = await client.services.list();

console.log(services);
