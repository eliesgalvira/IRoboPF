import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import fixture from "./fixtures/caracterizacion-legacy.json"
import {
  compararAjustadoPorIpc,
  compararPasadoAjustadoPorIpc,
  construirTablaDetalleAnualCompatible,
  type AnioFiscal,
  type ValorCeldaCompatible,
} from "../lib/dominio/compatibilidad-legacy/progresividad-frio"

const primeraFila = (
  filas: Iterable<ReadonlyArray<ValorCeldaCompatible>>
): ReadonlyArray<ValorCeldaCompatible> => {
  for (const fila of filas) {
    return fila
  }

  throw new Error("La tabla compatible no contiene filas")
}

describe("perfil legacy de progresividad en frio", () => {
  it.effect(
    "mantiene la matriz de caracterizacion del calculo unitario, IPC y exportacion compatible",
    () =>
      Effect.gen(function* () {
        for (const caso of fixture.casos) {
          const anio = caso.anio as AnioFiscal
          const calculoUnitario = yield* compararAjustadoPorIpc({
            salarioBrutoAnualReferenciaCentimos: caso.salarioBrutoAnualCentimos,
            anioComparado: anio,
            anioReferencia: anio,
          })
          const comparativaIpc = yield* compararAjustadoPorIpc({
            salarioBrutoAnualReferenciaCentimos: caso.salarioBrutoAnualCentimos,
            anioComparado: anio,
            anioReferencia: fixture.anioReferenciaIpc as AnioFiscal,
          })
          const salarioBrutoEuros = caso.salarioBrutoAnualCentimos / 100
          const filaDetalleAnualCompatible = primeraFila(
            construirTablaDetalleAnualCompatible(anio, {
              salarioMinimoEuros: salarioBrutoEuros,
              salarioMaximoEuros: salarioBrutoEuros,
              pasoEuros: 1,
            }).filas
          )

          expect(calculoUnitario.referencia).toEqual(caso.desglose)
          expect({
            salarioBrutoNominalAnualCentimos:
              comparativaIpc.comparado.salarioBrutoNominalAnualCentimos,
            factorIpc: comparativaIpc.factorIpc,
            diferenciaPoderAdquisitivoNetoAnualCentimos:
              comparativaIpc.diferenciaPoderAdquisitivoNetoAnualCentimos,
            diferenciaPoderAdquisitivoNetoMensualCentimos:
              comparativaIpc.diferenciaPoderAdquisitivoNetoMensualCentimos,
            ajustado: comparativaIpc.comparado.ajustado,
          }).toEqual(caso.comparativaIpcContra2026)
          expect(filaDetalleAnualCompatible).toEqual(
            caso.filaDetalleAnualCompatible
          )
        }
      })
  )

  it.effect(
    "permite fijar el salario nominal en un año pasado y comparar 2026 contra ese año",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararPasadoAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 3_000_000,
          anioComparado: 2026,
          anioReferencia: 2025,
        })

        expect(comparacion.anioReferencia).toBe(2025)
        expect(comparacion.anioComparado).toBe(2026)
        expect(comparacion.referencia.salarioBrutoAnualCentimos).toBe(3_000_000)
        expect(
          comparacion.comparado.salarioBrutoNominalAnualCentimos
        ).toBeGreaterThan(3_000_000)
        expect(comparacion.comparado.ajustado.salarioBrutoAnualCentimos).toBe(
          3_000_000
        )
      })
  )
})
