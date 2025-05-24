import { betterAuth } from "better-auth";
import { apiKey } from "better-auth/plugins";
import pg from "pg";
const { Pool } = pg;

export const auth = betterAuth({
  baseURL: process.env.BASE_URL,
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    freshAge: 0,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [apiKey()],
});
