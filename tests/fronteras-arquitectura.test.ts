// Architecture test harness reads local source files directly.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"

import { describe, expect, it } from "@effect/vitest"

const archivosProducto = [
  "components/simulador.tsx",
  "components/auditoria.tsx",
  "lib/export/auditoria-excel.ts",
] as const

describe("fronteras de arquitectura", () => {
  it("evita imports de UI y exportacion hacia el modulo legacy interno de progresividad", () => {
    for (const archivo of archivosProducto) {
      const contenido = readFileSync(archivo, "utf8")

      expect(contenido).not.toContain("lib/domain/progresividad")
      expect(contenido).not.toContain("../domain/progresividad")
    }
  })
})
