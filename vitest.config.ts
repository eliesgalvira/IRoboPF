import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 30_000,
    teardownTimeout: 10_000,
    maxWorkers: 1,
    include: ["tests/**/*.test.{ts,mjs}"],
    exclude: ["tests/corpus-local/**"],
  },
})
