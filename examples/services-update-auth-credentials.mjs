import "dotenv/config";
import { createClient } from "../dist/index.js";

const client = createClient({
  token: process.env.ACEPROXIES_TOKEN,
});

const credentials = await client.services.updateCredentials(
  "your-service-code",
  {
    username: "new-username",
    password: "new-password",
  },
);

console.log(credentials);
