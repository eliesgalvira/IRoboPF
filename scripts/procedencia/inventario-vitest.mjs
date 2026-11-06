import { defineConfig } from "vitest/config"
export default defineConfig({
  test: {
    include: ["tests/procedencia-inventario.test.mjs"],
    maxWorkers: 1,
    // Los corpus se procesan en hijos acotados; el worker sólo coordina y prueba fixtures.
    execArgv: ["--max-old-space-size=768", "--expose-gc"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    teardownTimeout: 10_000,
  },
})
