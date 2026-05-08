// Tests are Effect entry points, so they provide the service layer directly.
// @effect-diagnostics effect/strictEffectProvide:off
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
  PoliticaMonetaria,
  redondearImporteLiquidado,
  truncarImporteMonetario,
} from "../lib/dominio/dinero/importe-monetario"

describe("importe monetario", () => {
  it.effect("expone la politica monetaria como servicio Effect", () =>
    Effect.gen(function* () {
      const politica = yield* PoliticaMonetaria

      const redondeado = yield* politica.redondearImporteLiquidado(
        crearImporteMonetario("1.005")
      )
      const centimos = yield* politica.importeLiquidadoACentimos(
        crearImporteMonetario("123.455")
      )

      expect(redondeado.toString()).toBe("1.01")
      expect(centimos).toBe(12_346)
    }).pipe(Effect.provide(PoliticaMonetaria.layer))
  )

  it("convierte entre centimos y euros sin perder precision decimal", () => {
    expect(centimosAEuros(12_345).toString()).toBe("123.45")
    expect(eurosACentimos(crearImporteMonetario("123.455"))).toBe(12_346)
  })

  it("liquida dinero con half-up en la frontera de centimos", () => {
    expect(
      redondearImporteLiquidado(crearImporteMonetario("1.005")).toString()
    ).toBe("1.01")
    expect(
      redondearImporteLiquidado(crearImporteMonetario("1.004")).toString()
    ).toBe("1")
  })

  it("trunca dinero solo cuando la regla de dominio lo pide explicitamente", () => {
    expect(
      truncarImporteMonetario(crearImporteMonetario("1.999"), 2).toString()
    ).toBe("1.99")
  })
})
