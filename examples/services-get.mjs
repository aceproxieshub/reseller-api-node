import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const service = await client.services.get("0E93D2EU352A-080426");

console.log(service);
