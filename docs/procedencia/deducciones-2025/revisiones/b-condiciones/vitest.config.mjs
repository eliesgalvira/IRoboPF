import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [
      "docs/procedencia/deducciones-2025/revisiones/b-condiciones/casos.test.ts",
    ],
    maxWorkers: 1,
  },
})
