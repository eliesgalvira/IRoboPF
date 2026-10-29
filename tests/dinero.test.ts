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

import {
  mensualizarCentimosPresentacionLegacy,
  redondearNumpy,
  redondearPython,
} from "../lib/dominio/compatibilidad-legacy/aritmetica-tabular"

it("separa round binary de half-up monetario, también con signo", () => {
  for (const signo of [-1, 1]) {
    expect(redondearNumpy(signo * 30 * 0.0635)).toBe(signo * 1.9)
    expect(redondearPython(signo * 30 * 0.0635)).toBe(signo * 1.91)
    expect(redondearPython(signo * 2.675)).toBe(signo * 2.67)
    expect(redondearNumpy(signo * 2.675)).toBe(signo * 2.68)
    expect(
      redondearImporteLiquidado(
        crearImporteMonetario(signo).mul("1.905")
      ).toNumber()
    ).toBe(signo * 1.91)
    expect(redondearPython(signo * 2.5, 0)).toBe(signo * 2)
  }
})

it("convierte el entero redondeado una vez al regresar a binary64", () => {
  expect(redondearPython(56294995342131.5, 3)).toBe(56294995342131.5)
  expect(redondearPython(-56294995342131.5, 3)).toBe(-56294995342131.5)
})

it("declara el empate mensual de presentación legacy, sin atribuirle norma fiscal", () => {
  expect(mensualizarCentimosPresentacionLegacy(18)).toBe(2)
  expect(mensualizarCentimosPresentacionLegacy(-18)).toBe(-1)
  expect(redondearNumpy(0.059 / 12)).toBe(0)
  expect(mensualizarCentimosPresentacionLegacy(6)).toBe(1)
})

import { porcentajeCompatibleLegacy } from "../lib/dominio/dinero/porcentaje"

it("caracteriza half-up de porcentajes existente sin atribuir half-even al helper", () => {
  expect(porcentajeCompatibleLegacy(crearImporteMonetario("0.01005"), 2)).toBe(
    1.01
  )
  expect(porcentajeCompatibleLegacy(crearImporteMonetario("-0.01005"), 2)).toBe(
    -1.01
  )
})
