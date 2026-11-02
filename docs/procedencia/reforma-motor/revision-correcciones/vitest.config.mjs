import { defineConfig } from "vitest/config"
export default defineConfig({
  test: {
    include: [
      "docs/procedencia/reforma-motor/revision-correcciones/*.test.mjs",
    ],
  },
})
