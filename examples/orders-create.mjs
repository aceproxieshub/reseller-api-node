import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const order = await client.orders.create({
  items: [
    {
      productId: "f2c0f477-f3fa-4a60-af67-811cff1fdc72",
      durationId: "8f96443d-40ff-40f4-8d09-9932229cecc3",
      quantity: 1,
      options: {
        proxyType: "http",
        authType: "combined",
        locations: ["7fa46e3d-a7d1-4cf9-b3c3-6761f2bcf479"],
      },
      addons: [],
    },
  ],
});

console.log(order);
