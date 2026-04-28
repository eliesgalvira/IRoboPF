import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  AuditoriaProgresividadFrio,
  auditarProgresividadFrio,
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
        expect(resultado.auditoria.puntos).toHaveLength(3)
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
      ).toEqual([1_500_000, 1_600_000, 1_700_000])
      expect(resultado.auditoria.hallazgos.length).toBeGreaterThan(0)
    })
  )
})

const entradaAuditoriaBasica = (): EntradaAuditoriaProgresividadFrio => ({
  perfil: "legacy-progresividad-frio",
  salarioBrutoAnualMinimoCentimos: 1_500_000,
  salarioBrutoAnualMaximoCentimos: 1_700_000,
  pasoCentimos: 100_000,
  anioComparado: 2019,
  anioReferencia: 2026,
})
