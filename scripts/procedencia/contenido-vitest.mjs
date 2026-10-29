import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("../../", import.meta.url)) },
  },
  test: {
    include: ["tests/procedencia-contenido.test.tsx"],
    maxWorkers: 1,
    testTimeout: 60000,
  },
})
