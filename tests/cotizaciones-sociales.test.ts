// Tests are Effect entry points, so they provide the service layer directly.
// @effect-diagnostics effect/strictEffectProvide:off
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { crearImporteMonetario } from "../lib/dominio/dinero/importe-monetario"
import {
  calcularCotizacionesSocialesLegacy,
  CotizacionesSociales,
} from "../lib/dominio/laboral/cotizaciones-sociales"

describe("calcularCotizacionesSocialesLegacy", () => {
  it.effect("expone las cotizaciones sociales como servicio Effect", () =>
    Effect.gen(function* () {
      const cotizaciones = yield* CotizacionesSociales

      const desglose = yield* cotizaciones.desglosarLegacy({
        salarioBrutoAnual: crearImporteMonetario(100_000),
        anio: 2026,
      })

      expect(desglose.cotizacionEmpresarial.toDecimalPlaces(2).toString()).toBe(
        "20093.66"
      )
      expect(desglose.solidaridadTrabajador.toDecimalPlaces(2).toString()).toBe(
        "82.65"
      )
    }).pipe(Effect.provide(CotizacionesSociales.layer))
  )

  it("calcula cotizaciones bajo la base máxima sin solidaridad", () => {
    const cotizaciones = calcularCotizacionesSocialesLegacy({
      salarioBrutoAnual: crearImporteMonetario(30_000),
      anio: 2026,
    })

    expect(cotizaciones.cotizacionEmpresarial.toString()).toBe("9645")
    expect(cotizaciones.cotizacionTrabajador.toString()).toBe("1950")
  })

  it("aplica base máxima, MEI y solidaridad legacy para salarios altos", () => {
    const cotizaciones = calcularCotizacionesSocialesLegacy({
      salarioBrutoAnual: crearImporteMonetario(100_000),
      anio: 2026,
    })

    expect(
      cotizaciones.cotizacionEmpresarial.toDecimalPlaces(2).toString()
    ).toBe("20093.66")
    expect(
      cotizaciones.cotizacionTrabajador.toDecimalPlaces(2).toString()
    ).toBe("4061.58")
  })
})
