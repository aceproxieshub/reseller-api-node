import "dotenv/config";
import { createClient, ProductType } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const services = await client.services.list({
  page: 1,
  limit: 20,
  type: ProductType.DedicatedProxy,
});

console.log(services);
