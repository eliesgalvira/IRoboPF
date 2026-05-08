// Script entry point: Node file-system APIs are the execution boundary.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { writeFile } from "node:fs/promises"

import { Effect, Formatter } from "effect"

import {
  aniosFiscalesLegacy,
  compararAjustadoPorIpc,
  construirTablaDetalleAnualCompatible,
  type AnioFiscal,
  type DesgloseLiquidado,
  type ValorCeldaCompatible,
} from "../lib/dominio/compatibilidad-legacy/progresividad-frio"

interface CasoCaracterizacionLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
  readonly desglose: DesgloseLiquidado
  readonly comparativaIpcContra2026: {
    readonly salarioBrutoNominalAnualCentimos: number
    readonly factorIpc: string
    readonly diferenciaPoderAdquisitivoNetoAnualCentimos: number
    readonly diferenciaPoderAdquisitivoNetoMensualCentimos: number
    readonly ajustado: DesgloseLiquidado
  }
  readonly filaDetalleAnualCompatible: ReadonlyArray<ValorCeldaCompatible>
}

interface FixtureCaracterizacionLegacy {
  readonly schemaVersion: 1
  readonly source: string
  readonly generatedBy: string
  readonly anioReferenciaIpc: 2026
  readonly casos: ReadonlyArray<CasoCaracterizacionLegacy>
}

const BASES_MAXIMAS_LEGACY: Readonly<Record<AnioFiscal, number>> = {
  2012: 3_915_000,
  2013: 4_110_840,
  2014: 4_316_400,
  2015: 4_327_200,
  2016: 4_370_400,
  2017: 4_501_440,
  2018: 4_501_440,
  2019: 4_884_120,
  2020: 4_884_120,
  2021: 4_884_120,
  2022: 4_967_280,
  2023: 5_394_600,
  2024: 5_664_600,
  2025: 5_891_400,
  2026: 6_121_440,
}

const salariosBaseCentimos = [
  0, 1_500_000, 1_657_600, 1_709_400, 1_827_600, 2_000_000, 3_000_000,
  6_000_000, 10_000_000, 30_000_000,
] as const

const salariosCaracterizacion = (anio: AnioFiscal): ReadonlyArray<number> =>
  [...salariosBaseCentimos, BASES_MAXIMAS_LEGACY[anio]].sort((a, b) => a - b)

const primeraFila = (
  filas: Iterable<ReadonlyArray<ValorCeldaCompatible>>
): ReadonlyArray<ValorCeldaCompatible> => {
  for (const fila of filas) {
    return fila
  }

  throw new Error("La tabla compatible no contiene filas")
}

const construirCaso = Effect.fn("fixtures.legacyCaracterizacion.construirCaso")(
  function* (anio: AnioFiscal, salarioBrutoAnualCentimos: number) {
    const calculoUnitario = yield* compararAjustadoPorIpc({
      salarioBrutoAnualReferenciaCentimos: salarioBrutoAnualCentimos,
      anioComparado: anio,
      anioReferencia: anio,
    })
    const comparativaIpc = yield* compararAjustadoPorIpc({
      salarioBrutoAnualReferenciaCentimos: salarioBrutoAnualCentimos,
      anioComparado: anio,
      anioReferencia: 2026,
    })
    const salarioBrutoEuros = salarioBrutoAnualCentimos / 100
    const filaDetalleAnualCompatible = primeraFila(
      construirTablaDetalleAnualCompatible(anio, {
        salarioMinimoEuros: salarioBrutoEuros,
        salarioMaximoEuros: salarioBrutoEuros,
        pasoEuros: 1,
      }).filas
    )

    return {
      anio,
      salarioBrutoAnualCentimos,
      desglose: calculoUnitario.referencia,
      comparativaIpcContra2026: {
        salarioBrutoNominalAnualCentimos:
          comparativaIpc.comparado.salarioBrutoNominalAnualCentimos,
        factorIpc: comparativaIpc.factorIpc,
        diferenciaPoderAdquisitivoNetoAnualCentimos:
          comparativaIpc.diferenciaPoderAdquisitivoNetoAnualCentimos,
        diferenciaPoderAdquisitivoNetoMensualCentimos:
          comparativaIpc.diferenciaPoderAdquisitivoNetoMensualCentimos,
        ajustado: comparativaIpc.comparado.ajustado,
      },
      filaDetalleAnualCompatible,
    } satisfies CasoCaracterizacionLegacy
  }
)

const construirFixture = Effect.fn(
  "fixtures.legacyCaracterizacion.construirFixture"
)(function* () {
  const casos = yield* Effect.forEach(aniosFiscalesLegacy, (anio) =>
    Effect.forEach(salariosCaracterizacion(anio), (salario) =>
      construirCaso(anio, salario)
    )
  )

  return {
    schemaVersion: 1,
    source:
      "lib/dominio/compatibilidad-legacy/progresividad-frio.ts tras refactor",
    generatedBy: "scripts/generar-fixture-caracterizacion-legacy.ts",
    anioReferenciaIpc: 2026,
    casos: casos.flat(),
  } satisfies FixtureCaracterizacionLegacy
})

const programa = Effect.gen(function* () {
  const fixture = yield* construirFixture()
  yield* Effect.promise(() =>
    writeFile(
      "tests/fixtures/caracterizacion-legacy.json",
      `${Formatter.formatJson(fixture, { space: 2 })}\n`
    )
  )
})

Effect.runPromise(programa)
