import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import fixture from "./fixtures/caracterizacion-legacy.json"
import {
  calcularSalarioLegacy,
  CompatibilidadSalarioLegacy,
} from "../lib/dominio/compatibilidad-legacy/calculo-salario-legacy"
import { construirTablaDetalleAnualCompatible } from "../lib/dominio/compatibilidad-legacy/progresividad-frio"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

describe("calcularSalarioLegacy", () => {
  const centimosDesdeCeldaEuros = (valor: unknown): number =>
    Math.round(Number(valor) * 100)

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
    "mantiene los casos 2025 de la fixture usando la conciliacion del simulador legacy",
    () =>
      Effect.gen(function* () {
        const casos2025 = fixture.casos.filter((caso) => caso.anio === 2025)

        for (const caso of casos2025) {
          const resultado = yield* calcularSalarioLegacy({
            anio: caso.anio as AnioFiscal,
            salarioBrutoAnualCentimos: caso.salarioBrutoAnualCentimos,
          })

          expect(resultado).toEqual(caso.desglose)
        }
      })
  )

  it.effect(
    "mantiene la compatibilidad 2025 euro a euro contra el detalle anual canonico",
    () =>
      Effect.gen(function* () {
        const compatibilidad = yield* CompatibilidadSalarioLegacy
        const tabla2025 = construirTablaDetalleAnualCompatible(2025, {
          salarioMinimoEuros: 0,
          salarioMaximoEuros: 100_000,
          pasoEuros: 1,
        })
        const indice = Object.fromEntries(
          tabla2025.cabeceras.map((cabecera, posicion) => [cabecera, posicion])
        )

        for (const fila of tabla2025.filas) {
          const salarioBrutoEuros = Number(fila[indice["Salario Bruto"]])
          const resultado = yield* compatibilidad.calcular({
            anio: 2025,
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
            irpfFinalCentimos: centimosDesdeCeldaEuros(
              fila[indice["IRPF Final"]]
            ),
            salarioNetoAnualCentimos: centimosDesdeCeldaEuros(
              fila[indice["Salario Neto"]]
            ),
          })
        }
      }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer)),
    120_000
  )
})
