import { describe, expect, it } from "vitest"

import { ticksSalarioEuros } from "../lib/auditoria-graficos"

describe("ticksSalarioEuros", () => {
  it("espacia el rango por defecto cada 10k con etiquetas equidistantes", () => {
    expect(
      ticksSalarioEuros({
        minimoEuros: 15_000,
        maximoEuros: 100_000,
      })
    ).toEqual([
      20_000, 30_000, 40_000, 50_000, 60_000, 70_000, 80_000, 90_000,
      100_000,
    ])
  })

  it("usa más detalle equidistante cuando el rango elegido es más estrecho", () => {
    expect(
      ticksSalarioEuros({
        minimoEuros: 22_000,
        maximoEuros: 42_000,
      })
    ).toEqual([25_000, 30_000, 35_000, 40_000])
  })
})
