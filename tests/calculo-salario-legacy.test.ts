import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import fixture from "./fixtures/caracterizacion-legacy.json"
import {
  calcularSalarioLegacy,
  CompatibilidadSalarioLegacy,
  type ServicioCompatibilidadSalarioLegacy,
} from "../lib/dominio/compatibilidad-legacy/calculo-salario-legacy"
import { construirTablaDetalleAnualCompatible } from "../lib/dominio/compatibilidad-legacy/progresividad-frio"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

const EJECUTAR_VALIDACION_LIQUIDACION_LEGACY_COMPLETA =
  process.env.IROBOPF_VALIDACION_LIQUIDACION_LEGACY_COMPLETA === "1"
const ANIOS_CON_LIQUIDACION_LEGACY = [
  2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
] as const satisfies ReadonlyArray<AnioFiscal>

describe("calcularSalarioLegacy", () => {
  const centimosDesdeCeldaEuros = (valor: unknown): number =>
    Math.round(Number(valor) * 100)

  const esperarFilaCompatible = ({
    anio,
    compatibilidad,
    fila,
    indice,
  }: {
    readonly anio: AnioFiscal
    readonly compatibilidad: ServicioCompatibilidadSalarioLegacy
    readonly fila: ReadonlyArray<unknown>
    readonly indice: Record<string, number>
  }) =>
    Effect.gen(function* () {
      const salarioBrutoEuros = Number(fila[indice["Salario Bruto"]])
      const resultado = yield* compatibilidad.calcular({
        anio,
        salarioBrutoAnualCentimos: salarioBrutoEuros * 100,
      })

      expect(resultado).toEqual({
        salarioBrutoAnualCentimos: salarioBrutoEuros * 100,
        cotizacionEmpresarialCentimos: centimosDesdeCeldaEuros(
          fila[indice["Cot. Soc. Empresa"]]
        ),
        costeLaboralCentimos: centimosDesdeCeldaEuros(
          fila[indice["Coste Laboral"]]
        ),
        cotizacionTrabajadorCentimos: centimosDesdeCeldaEuros(
          fila[indice["Cot. Soc. Trab."]]
        ),
        irpfFinalCentimos: centimosDesdeCeldaEuros(fila[indice["IRPF Final"]]),
        salarioNetoAnualCentimos: centimosDesdeCeldaEuros(
          fila[indice["Salario Neto"]]
        ),
      })
    })

  it.effect("expone el adaptador salarial legacy como servicio Effect", () =>
    Effect.gen(function* () {
      const compatibilidad = yield* CompatibilidadSalarioLegacy

      const resultado = yield* compatibilidad.calcular({
        anio: 2026,
        salarioBrutoAnualCentimos: 3_000_000,
      })

      expect(resultado.irpfFinalCentimos).toBe(492_600)
    }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer))
  )

  it.effect(
    "reproduce el desglose salarial del caso fiscal simplificado legacy",
    () =>
      Effect.gen(function* () {
        const resultado = yield* calcularSalarioLegacy({
          anio: 2026,
          salarioBrutoAnualCentimos: 3_000_000,
        })

        expect(resultado).toEqual({
          salarioBrutoAnualCentimos: 3_000_000,
          cotizacionEmpresarialCentimos: 964_500,
          costeLaboralCentimos: 3_964_500,
          cotizacionTrabajadorCentimos: 195_000,
          irpfFinalCentimos: 492_600,
          salarioNetoAnualCentimos: 2_312_400,
        })
      })
  )

  it.effect(
    "mantiene los casos 2017-2025 de la fixture usando la conciliacion del simulador legacy",
    () =>
      Effect.gen(function* () {
        const casosConLiquidacionNueva = fixture.casos.filter((caso) =>
          ANIOS_CON_LIQUIDACION_LEGACY.some((anio) => anio === caso.anio)
        )

        for (const caso of casosConLiquidacionNueva) {
          const resultado = yield* calcularSalarioLegacy({
            anio: caso.anio as AnioFiscal,
            salarioBrutoAnualCentimos: caso.salarioBrutoAnualCentimos,
          })

          expect(resultado).toEqual(caso.desglose)
        }
      })
  )

  it.effect(
    "mantiene la compatibilidad 2017-2025 contra puntos representativos del detalle anual canonico",
    () =>
      Effect.gen(function* () {
        const compatibilidad = yield* CompatibilidadSalarioLegacy
        for (const anio of ANIOS_CON_LIQUIDACION_LEGACY) {
          const tabla = construirTablaDetalleAnualCompatible(anio, {
            salarioMinimoEuros: 0,
            salarioMaximoEuros: 100_000,
            pasoEuros: 1_000,
          })
          const indice = Object.fromEntries(
            tabla.cabeceras.map((cabecera, posicion) => [cabecera, posicion])
          )

          for (const fila of tabla.filas) {
            yield* esperarFilaCompatible({
              anio,
              compatibilidad,
              fila,
              indice,
            })
          }
        }
      }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer)),
    120_000
  )

  const pruebaCompleta = EJECUTAR_VALIDACION_LIQUIDACION_LEGACY_COMPLETA
    ? it.effect
    : it.effect.skip

  pruebaCompleta(
    "mantiene la compatibilidad 2017-2025 euro a euro contra el detalle anual canonico",
    () =>
      Effect.gen(function* () {
        const compatibilidad = yield* CompatibilidadSalarioLegacy
        for (const anio of ANIOS_CON_LIQUIDACION_LEGACY) {
          const tabla = construirTablaDetalleAnualCompatible(anio, {
            salarioMinimoEuros: 0,
            salarioMaximoEuros: 100_000,
            pasoEuros: 1,
          })
          const indice = Object.fromEntries(
            tabla.cabeceras.map((cabecera, posicion) => [cabecera, posicion])
          )

          for (const fila of tabla.filas) {
            yield* esperarFilaCompatible({
              anio,
              compatibilidad,
              fila,
              indice,
            })
          }
        }
      }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer)),
    900_000
  )
})
