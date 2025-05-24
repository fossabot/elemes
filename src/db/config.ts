import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import Database from "./schemas/Database";
const { Pool } = pg;

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
});

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
