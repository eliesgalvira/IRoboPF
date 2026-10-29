import { defineConfig } from "vitest/config"
export default defineConfig({
  test: { include: ["tests/procedencia-inventario.test.mjs"], maxWorkers: 1 },
})
