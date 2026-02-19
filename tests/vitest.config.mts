import path from "node:path";
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

const migrationsPath = path.join(__dirname, "..", "migrations");

export default defineWorkersConfig({
  esbuild: {
    target: "esnext",
  },
  test: {
    setupFiles: ["./tests/apply-migrations.ts"],
    poolOptions: {
      workers: {
        singleWorker: true,
        wrangler: {
          configPath: "../wrangler.jsonc",
        },
        miniflare: {
          compatibilityFlags: ["experimental", "nodejs_compat"],
          bindings: {},
        },
      },
    },
  },
});
