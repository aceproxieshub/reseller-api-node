import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({ token: process.env.ACEPROXIES_TOKEN });
const code = process.env.ACEPROXIES_SERVICE_CODE;

console.log(await client.services.getIpReplacements(code));
console.log(await client.services.getAvailableIpReplacements(code));
console.log(await client.services.getIpReplacementCount(code));
console.log(await client.services.getIpReplacementLocations(code));

// Creating a replacement consumes quota:
// console.log(await client.services.createIpReplacement(code, { locations: [] }));
