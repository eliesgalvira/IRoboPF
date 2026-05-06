import { describe, expect, it } from "vitest"

import {
  formatearPorcentaje,
  formatearPuntosPorcentuales,
  porcentaje,
} from "../lib/formato"

describe("formato", () => {
  it("formatea porcentajes con dos decimales y redondeo half-up", () => {
    expect(formatearPorcentaje("0.017145")).toBe("1,71%")
    expect(formatearPorcentaje("0.01715")).toBe("1,72%")
    expect(porcentaje.format("0.02")).toBe("2,00%")
  })

  it("formatea puntos porcentuales con dos decimales y redondeo half-up", () => {
    expect(formatearPuntosPorcentuales("33.335")).toBe("33,34%")
    expect(formatearPuntosPorcentuales(100)).toBe("100,00%")
  })
})
