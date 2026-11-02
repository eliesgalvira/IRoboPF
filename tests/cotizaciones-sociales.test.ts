import { CotizacionesSociales } from "../lib/dominio/laboral/cotizaciones-sociales"
// Tests are Effect entry points, so they provide the service layer directly.
// @effect-diagnostics effect/strictEffectProvide:off
import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { crearImporteMonetario } from "../lib/dominio/dinero/importe-monetario"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"

describe("calcularDesgloseCotizacionesPerfilUniforme", () => {
  it.effect("expone las cotizaciones sociales como servicio Effect", () =>
    Effect.gen(function* () {
      const cotizaciones = yield* CotizacionesSociales

      const desglose = yield* cotizaciones.desglosar({
        salarioBrutoAnual: crearImporteMonetario(100_000),
        anio: 2026,
      })

      expect(desglose.cotizacionEmpresarial.toDecimalPlaces(2).toString()).toBe(
        "20093.62"
      )
      expect(desglose.solidaridadTrabajador.toDecimalPlaces(2).toString()).toBe(
        "82.68"
      )
    }).pipe(Effect.provide(CotizacionesSociales.layer))
  )

  it("calcula cotizaciones bajo la base máxima sin solidaridad", () => {
    const cotizaciones = calcularDesgloseCotizacionesPerfilUniforme({
      salarioBrutoAnual: crearImporteMonetario(30_000),
      anio: 2026,
    })

    expect(cotizaciones.cotizacionEmpresarial.toString()).toBe("9645")
    expect(cotizaciones.cotizacionTrabajador.toString()).toBe("1950")
  })

  it("aplica base máxima, MEI y solidaridad por pagador para salarios altos", () => {
    const cotizaciones = calcularDesgloseCotizacionesPerfilUniforme({
      salarioBrutoAnual: crearImporteMonetario(100_000),
      anio: 2026,
    })

    expect(
      cotizaciones.cotizacionEmpresarial.toDecimalPlaces(2).toString()
    ).toBe("20093.62")
    expect(
      cotizaciones.cotizacionTrabajador.toDecimalPlaces(2).toString()
    ).toBe("4061.61")
  })
})
