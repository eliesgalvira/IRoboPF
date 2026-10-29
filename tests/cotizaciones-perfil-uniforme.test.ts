import { describe, expect, it } from "@effect/vitest"
import Decimal from "decimal.js"

import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"
import { calcularDesgloseCotizacionesSocialesLegacy } from "../lib/dominio/laboral/cotizaciones-sociales"

describe("cotizaciones analíticas de doce mensualidades uniformes", () => {
  it.each([
    ["50000", "45276.9", "14216.9466", "2875.08315"],
    ["45240", "45108.4", "14164.0376", "2864.3834"],
  ])(
    "2018: aplica por mes el cambio de agosto, salario %s",
    (salario, base, empresa, trabajador) => {
      const r = calcularDesgloseCotizacionesPerfilUniforme({
        anio: 2018,
        salarioBrutoAnual: new Decimal(salario),
      })
      expect(r.baseOrdinaria.toString()).toBe(base)
      expect(r.cotizacionEmpresarial.toString()).toBe(empresa)
      expect(r.cotizacionTrabajador.toString()).toBe(trabajador)
    }
  )

  it("2025: usa tipos de solidaridad por pagador publicados", () => {
    const r = calcularDesgloseCotizacionesPerfilUniforme({
      anio: 2025,
      salarioBrutoAnual: new Decimal("64805.40"),
    })
    expect(r.solidaridadEmpresarial.toString()).toBe("45.36378")
    expect(r.solidaridadTrabajador.toString()).toBe("8.8371")
  })

  it("2026: usa tipos de solidaridad por pagador publicados", () => {
    const r = calcularDesgloseCotizacionesPerfilUniforme({
      anio: 2026,
      salarioBrutoAnual: new Decimal("67335.84"),
    })
    expect(r.solidaridadEmpresarial.toString()).toBe("58.765824")
    expect(r.solidaridadTrabajador.toString()).toBe("11.630736")
  })

  // Expectativas Decimal de la contrarrevisión, antes de este evaluador.
  it.each([
    [2025, "58914.01", "0.000077", "0.000015"],
    [2025, "88371", "240.95826", "48.89862"],
    [2025, "100000", "354.92246", "70.99372"],
    [2026, "61214.41", "0.000096", "0.000019"],
    [2026, "91821.6", "313.417728", "63.050832"],
    [2026, "100000", "413.194208", "82.678992"],
  ] as const)(
    "%s, salario %s: distingue fronteras y los tres tramos",
    (anio, salario, empresa, trabajador) => {
      const r = calcularDesgloseCotizacionesPerfilUniforme({
        anio,
        salarioBrutoAnual: new Decimal(salario),
      })
      expect(r.solidaridadEmpresarial.toString()).toBe(empresa)
      expect(r.solidaridadTrabajador.toString()).toBe(trabajador)
    }
  )

  it("mantiene los resultados del contrato legacy", () => {
    const r = calcularDesgloseCotizacionesSocialesLegacy({
      anio: 2018,
      salarioBrutoAnual: new Decimal("50000"),
    })
    expect(r.baseOrdinaria.toString()).toBe("45014.4")
    const s = calcularDesgloseCotizacionesSocialesLegacy({
      anio: 2025,
      salarioBrutoAnual: new Decimal("64805.40"),
    })
    expect(s.solidaridadEmpresarial.toString()).toBe("45.1674")
    expect(s.solidaridadTrabajador.toString()).toBe("9.03348")
  })
})
