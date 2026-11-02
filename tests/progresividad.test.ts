import { describe, expect, it } from "@effect/vitest"
import { Effect } from "effect"

import {
  auditarRangoSalarial,
  configuracionControlSalario,
  configuracionRangoAuditoria,
} from "../lib/dominio/analisis-salarial/progresividad-frio"

describe("compararAjustadoPorIpc", () => {
  it("define los controles de salario acordados", () => {
    expect(configuracionControlSalario.preciso.maximoCentimos).toBe(99_999_999)
    expect(configuracionControlSalario.preciso.decimales).toBe(2)
    expect(configuracionControlSalario.rapido.minimoCentimos).toBe(1_000_000)
    expect(configuracionControlSalario.rapido.maximoCentimos).toBe(10_000_000)
    expect(configuracionControlSalario.rapido.pasoCentimos).toBe(100_000)
    expect(configuracionControlSalario.valorPorDefectoCentimos).toBe(1_800_000)
    expect(configuracionRangoAuditoria.pasoCentimos).toBe(10_000)
  })

  it.effect(
    "incluye el primer euro obligado a declarar aunque el paso sea de 1.000 euros",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 2_100_000,
          salarioBrutoAnualMaximoCentimos: 2_300_000,
          pasoCentimos: 100_000,
          anioComparado: 2019,
          anioReferencia: 2026,
        })

        expect(
          auditoria.puntos.map((punto) => punto.salarioBrutoAnualCentimos)
        ).toContain(2_200_100)
      })
  )

  it.effect(
    "construye un rango de auditoria con hallazgos para exploracion pedagogica",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 1_000_000,
          salarioBrutoAnualMaximoCentimos: 2_000_000,
          pasoCentimos: 500_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })

        expect(auditoria.puntos).toHaveLength(3)
        expect(auditoria.hallazgos.length).toBeGreaterThanOrEqual(2)
        expect(
          auditoria.hallazgos.some((hallazgo) =>
            hallazgo.titulo.includes("poder adquisitivo")
          )
        ).toBe(true)
      })
  )

  it.effect("construye el rango de auditoria en saltos de 100 euros", () =>
    Effect.gen(function* () {
      const auditoria = yield* auditarRangoSalarial({
        salarioBrutoAnualMinimoCentimos: 1_500_000,
        salarioBrutoAnualMaximoCentimos: 1_530_000,
        pasoCentimos: 10_000,
        anioComparado: 2019,
        anioReferencia: 2026,
      })

      expect(
        auditoria.puntos.map((punto) => punto.salarioBrutoAnualCentimos / 100)
      ).toEqual([15_000, 15_100, 15_200, 15_300])
    })
  )
})
