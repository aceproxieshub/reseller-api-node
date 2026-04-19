import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const prolongation = await client.services.requestProlongation(
  "your-service-code",
  {
    durationId: "duration-id",
    quantity: 1,
  },
);

console.log(prolongation);
