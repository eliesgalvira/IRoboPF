import { describe, expect, it } from "@effect/vitest"

import { crearImporteMonetario } from "../lib/dominio/dinero/importe-monetario"
import { calcularCotizacionesSocialesLegacy } from "../lib/dominio/laboral/cotizaciones-sociales"

describe("calcularCotizacionesSocialesLegacy", () => {
  it("calcula cotizaciones bajo la base maxima sin solidaridad", () => {
    const cotizaciones = calcularCotizacionesSocialesLegacy({
      salarioBrutoAnual: crearImporteMonetario(30_000),
      anio: 2026,
    })

    expect(cotizaciones.cotizacionEmpresarial.toString()).toBe("9645")
    expect(cotizaciones.cotizacionTrabajador.toString()).toBe("1950")
  })

  it("aplica base maxima, MEI y solidaridad legacy para salarios altos", () => {
    const cotizaciones = calcularCotizacionesSocialesLegacy({
      salarioBrutoAnual: crearImporteMonetario(100_000),
      anio: 2026,
    })

    expect(cotizaciones.cotizacionEmpresarial.toDecimalPlaces(2).toString()).toBe(
      "20093.66"
    )
    expect(cotizaciones.cotizacionTrabajador.toDecimalPlaces(2).toString()).toBe(
      "4061.58"
    )
  })
})
