import kanel from 'kanel';
const { processDatabase } = kanel;
import kysely from 'kanel-kysely';
const { makeKyselyHook, kyselyCamelCaseHook, kyselyTypeFilter } = kysely;

const config = {
  connection: process.env.DATABASE_URL,

  preDeleteOutputFolder: true,
  outputPath: "./src/db/schemas",

  preRenderHooks: [makeKyselyHook(), kyselyCamelCaseHook],
  typeFilter: kyselyTypeFilter,
};

async function run() {
  await processDatabase(config);
}

await run();
