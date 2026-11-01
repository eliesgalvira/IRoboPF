import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("../../", import.meta.url)) } },
  test: { include: ["tests/corpus-local/*.test.{ts,tsx}"], maxWorkers: 1, testTimeout: 300000 },
})
