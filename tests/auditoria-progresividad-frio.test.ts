import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  AuditoriaProgresividadFrio,
  auditarProgresividadFrio,
  construirPuntosAuditoriaAnioAjustado,
  type EntradaAuditoriaProgresividadFrio,
} from "../lib/dominio/auditoria/auditoria-progresividad-frio"

describe("auditarProgresividadFrio", () => {
  it.effect(
    "expone la auditoria de progresividad en frio como servicio Effect",
    () =>
      Effect.gen(function* () {
        const entrada = entradaAuditoriaBasica()
        const auditoria = yield* AuditoriaProgresividadFrio

        const resultado = yield* auditoria.auditar(entrada, {
          modo: "compatible-legacy",
        })

        expect(resultado._tag).toBe("ResultadoAuditoriaProgresividadFrio")
        expect(resultado.auditoria.puntos).toHaveLength(4)
      }).pipe(Effect.provide(AuditoriaProgresividadFrio.layer))
  )

  it.effect("orquesta una auditoria por rango salarial del perfil legacy", () =>
    Effect.gen(function* () {
      const entrada = entradaAuditoriaBasica()

      const resultado = yield* auditarProgresividadFrio(entrada, {
        modo: "compatible-legacy",
      })

      expect(resultado._tag).toBe("ResultadoAuditoriaProgresividadFrio")
      expect(resultado.perfil).toBe("legacy-progresividad-frio")
      expect(resultado.modo).toBe("compatible-legacy")
      expect(
        resultado.auditoria.puntos.map(
          (punto) => punto.salarioBrutoAnualCentimos
        )
      ).toEqual([1_500_000, 1_600_000, 1_657_600, 1_700_000])
      expect(resultado.auditoria.hallazgos.length).toBeGreaterThan(0)
    })
  )

  it.effect(
    "recalcula la liquidacion anual al cambiar de comunidad autonoma",
    () =>
      Effect.gen(function* () {
        const entrada = {
          ...entradaAuditoriaBasica(),
          salarioBrutoAnualMinimoCentimos: 3_000_000,
          salarioBrutoAnualMaximoCentimos: 3_000_000,
          anioReferencia: 2025,
        } as const

        const simulada = yield* auditarProgresividadFrio(
          { ...entrada, comunidadAutonoma: "simulada-estatal" },
          { modo: "compatible-legacy" }
        )
        const madrid = yield* auditarProgresividadFrio(
          { ...entrada, comunidadAutonoma: "madrid" },
          { modo: "compatible-legacy" }
        )

        expect(
          simulada.auditoria.puntos[0]?.comparacion.referencia.irpfFinalCentimos
        ).not.toBe(
          madrid.auditoria.puntos[0]?.comparacion.referencia.irpfFinalCentimos
        )
      })
  )

  it.effect(
    "calcula una serie anual ajustada equivalente a la rama comparada completa",
    () =>
      Effect.gen(function* () {
        const entrada = entradaAuditoriaBasica()
        const resultado = yield* auditarProgresividadFrio(entrada, {
          modo: "compatible-legacy",
        })
        const puntosAnio = yield* construirPuntosAuditoriaAnioAjustado({
          salarioBrutoAnualMinimoCentimos:
            entrada.salarioBrutoAnualMinimoCentimos,
          salarioBrutoAnualMaximoCentimos:
            entrada.salarioBrutoAnualMaximoCentimos,
          pasoCentimos: entrada.pasoCentimos,
          anio: entrada.anioComparado,
          anioReferencia: entrada.anioReferencia,
        })

        expect(
          puntosAnio.map((punto) => punto.tipoEfectivoIrpfComparado)
        ).toEqual(
          resultado.auditoria.puntos.map(
            (punto) => punto.tipoEfectivoIrpfComparado
          )
        )
        expect(
          puntosAnio.map(
            (punto) => punto.comparacion.comparado.ajustado.irpfFinalCentimos
          )
        ).toEqual(
          resultado.auditoria.puntos.map(
            (punto) => punto.comparacion.comparado.ajustado.irpfFinalCentimos
          )
        )
      })
  )

  it.effect(
    "conserva la cuota anual que necesita el grafico marginal en la joroba de 2025",
    () =>
      Effect.gen(function* () {
        const puntos = yield* construirPuntosAuditoriaAnioAjustado({
          salarioBrutoAnualMinimoCentimos: 1_860_000,
          salarioBrutoAnualMaximoCentimos: 1_870_000,
          pasoCentimos: 10_000,
          anio: 2025,
          anioReferencia: 2025,
          comunidadAutonoma: "simulada-estatal",
        })
        const punto18600 = puntos[0]?.comparacion.referencia
        const punto18700 = puntos[1]?.comparacion.referencia

        expect(punto18600?.irpfFinalCentimos).toBeLessThan(
          punto18600?.irpfCuotaTrasDeduccionSmiCentimos ?? 0
        )
        expect(
          ((punto18700?.irpfCuotaTrasDeduccionSmiCentimos ?? 0) -
            (punto18600?.irpfCuotaTrasDeduccionSmiCentimos ?? 0)) /
            10_000
        ).toBeCloseTo(0.617, 2)
      })
  )

  it.effect(
    "inserta puntos normativos para no esconder el umbral de declaracion en la web",
    () =>
      Effect.gen(function* () {
        const resultado = yield* auditarProgresividadFrio(
          {
            ...entradaAuditoriaBasica(),
            salarioBrutoAnualMinimoCentimos: 2_100_000,
            salarioBrutoAnualMaximoCentimos: 2_300_000,
            pasoCentimos: 100_000,
            anioComparado: 2025,
            anioReferencia: 2025,
          },
          { modo: "compatible-legacy" }
        )

        expect(
          resultado.auditoria.puntos.map(
            (punto) => punto.salarioBrutoAnualCentimos
          )
        ).toContain(2_200_100)
      })
  )
})

const entradaAuditoriaBasica = (): EntradaAuditoriaProgresividadFrio => ({
  perfil: "legacy-progresividad-frio",
  salarioBrutoAnualMinimoCentimos: 1_500_000,
  salarioBrutoAnualMaximoCentimos: 1_700_000,
  pasoCentimos: 100_000,
  anioComparado: 2019,
  anioReferencia: 2025,
})
