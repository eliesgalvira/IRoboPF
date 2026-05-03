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
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
  2024, 2025,
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
        anio: 2025,
        salarioBrutoAnualCentimos: 3_000_000,
      })

      expect(resultado.irpfFinalCentimos).toBe(492_780)
    }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer))
  )

  it.effect(
    "reproduce el desglose salarial del caso fiscal simplificado legacy",
    () =>
      Effect.gen(function* () {
        const resultado = yield* calcularSalarioLegacy({
          anio: 2025,
          salarioBrutoAnualCentimos: 3_000_000,
        })

        expect(resultado).toEqual({
          salarioBrutoAnualCentimos: 3_000_000,
          cotizacionEmpresarialCentimos: 962_100,
          costeLaboralCentimos: 3_962_100,
          cotizacionTrabajadorCentimos: 194_400,
          irpfFinalCentimos: 492_780,
          salarioNetoAnualCentimos: 2_312_820,
        })
      })
  )

  it.effect(
    "distingue el umbral visible de IRPF final entre 2025 y la referencia tecnica 2026",
    () =>
      Effect.gen(function* () {
        const salarioBrutoAnualCentimos = 1_700_000
        const resultado2025 = yield* calcularSalarioLegacy({
          anio: 2025,
          salarioBrutoAnualCentimos,
          comunidadAutonoma: "simulada-estatal",
        })
        const resultado2026 = yield* calcularSalarioLegacy({
          anio: 2026,
          salarioBrutoAnualCentimos,
          comunidadAutonoma: "simulada-estatal",
        })

        expect(resultado2025.irpfFinalCentimos).toBe(29_154)
        expect(resultado2026.irpfFinalCentimos).toBe(0)
      })
  )

  it.effect(
    "aplica el perfil pareja con hijos al limite de retencion tecnico 2026",
    () =>
      Effect.gen(function* () {
        const salarioBrutoAnualCentimos = 1_800_000
        const soltero = yield* calcularSalarioLegacy({
          anio: 2026,
          salarioBrutoAnualCentimos,
          comunidadAutonoma: "simulada-estatal",
        })
        const parejaConHijos = yield* calcularSalarioLegacy({
          anio: 2026,
          salarioBrutoAnualCentimos,
          comunidadAutonoma: "simulada-estatal",
          perfilAuditoria: "pareja_con_hijos",
        })

        expect(soltero.irpfFinalCentimos).toBeGreaterThan(0)
        expect(parejaConHijos.irpfFinalCentimos).toBe(0)
      })
  )

  it.effect(
    "mantiene los casos 2012-2025 de la fixture usando la conciliacion del simulador legacy",
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
    "mantiene la compatibilidad 2012-2025 contra puntos representativos del detalle anual canonico",
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
    "mantiene la compatibilidad 2012-2025 euro a euro contra el detalle anual canonico",
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
    1_400_000
  )
})
