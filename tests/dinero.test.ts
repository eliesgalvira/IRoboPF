import { describe, expect, it } from "@effect/vitest"

import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
  redondearImporteLiquidado,
  truncarImporteMonetario,
} from "../lib/dominio/dinero/importe-monetario"
import { redondearHalfEvenTabularLegacy } from "../lib/dominio/dinero/redondeo"

describe("importe monetario", () => {
  it("convierte entre centimos y euros sin perder precision decimal", () => {
    expect(centimosAEuros(12_345).toString()).toBe("123.45")
    expect(eurosACentimos(crearImporteMonetario("123.455"))).toBe(12_346)
  })

  it("liquida dinero con half-up en la frontera de centimos", () => {
    expect(redondearImporteLiquidado(crearImporteMonetario("1.005")).toString()).toBe(
      "1.01"
    )
    expect(redondearImporteLiquidado(crearImporteMonetario("1.004")).toString()).toBe(
      "1"
    )
  })

  it("trunca dinero solo cuando la regla de dominio lo pide explicitamente", () => {
    expect(truncarImporteMonetario(crearImporteMonetario("1.999"), 2).toString()).toBe(
      "1.99"
    )
  })

  it("mantiene half-even solo para artefactos tabulares legacy observables", () => {
    expect(redondearHalfEvenTabularLegacy(crearImporteMonetario("2.5"), 0).toNumber()).toBe(2)
    expect(redondearHalfEvenTabularLegacy(crearImporteMonetario("3.5"), 0).toNumber()).toBe(4)
  })
})
