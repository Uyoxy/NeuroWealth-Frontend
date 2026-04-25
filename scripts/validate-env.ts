import { validateEnv } from "../lib/env";

try {
  validateEnv();
  console.log("All environment variables valid ✅");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}