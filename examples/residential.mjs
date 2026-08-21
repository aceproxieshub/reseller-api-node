import "dotenv/config";
import { RotationInterval, createClient } from "../dist/index.js";

const client = createClient({ token: process.env.ACEPROXIES_TOKEN });
const residential = client.services.residential;
const code = process.env.ACEPROXIES_SERVICE_CODE;

console.log(await residential.countries());
console.log(await residential.rotationIntervals());
console.log(await residential.proxyRequests(code));

// Mutating example:
// const created = await residential.createProxyRequest(code, {
//   countryId: 1,
//   proxyCount: 1,
//   rotationInterval: RotationInterval.All,
// });
// console.log(await residential.getProxyList(code, created.id));
// console.log(await residential.deleteProxyRequest(code, created.id));
