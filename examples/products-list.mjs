import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const products = await client.products.list();

console.log(products[0]);
