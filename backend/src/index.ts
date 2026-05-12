import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { startRebalanceScheduler } from "./scheduler/rebalanceScheduler.js";

async function main() {
  await connectDatabase();
  if (env.enableCron) startRebalanceScheduler();
  app.listen(env.port, () => console.log(`API listening on :${env.port}`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
