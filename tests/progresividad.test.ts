import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  auditarRangoSalarial,
  calcularPerdidaAcumulada,
  compararAjustadoPorIpc,
  configuracionControlSalario,
} from "../lib/domain/progresividad"

describe("compararAjustadoPorIpc", () => {
  it("define los controles de salario acordados", () => {
    expect(configuracionControlSalario.preciso.maximoCentimos).toBe(99_999_999)
    expect(configuracionControlSalario.preciso.decimales).toBe(2)
    expect(configuracionControlSalario.rapido.minimoCentimos).toBe(1_000_000)
    expect(configuracionControlSalario.rapido.maximoCentimos).toBe(10_000_000)
    expect(configuracionControlSalario.rapido.pasoCentimos).toBe(100_000)
    expect(configuracionControlSalario.valorPorDefectoCentimos).toBe(1_800_000)
  })

  it.effect(
    "compara un salario de 2026 contra 2019 con euros ajustados por IPC",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 1_800_000,
          anioComparado: 2019,
          anioReferencia: 2026,
        })

        expect(comparacion.referencia.salarioNetoAnualCentimos).toBe(1_620_618)
        expect(comparacion.comparado.ajustado.salarioNetoAnualCentimos).toBe(
          1_669_141
        )
        expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
          48_522
        )
        expect(comparacion.comparado.salarioBrutoNominalAnualCentimos).toBe(
          1_430_607
        )
      })
  )

  it.effect(
    "acumula la perdida de poder adquisitivo neto entre el año comparado y el de referencia",
    () =>
      Effect.gen(function* () {
        const perdidaAcumulada = yield* calcularPerdidaAcumulada({
          salarioBrutoAnualReferenciaCentimos: 1_800_000,
          anioComparado: 2019,
          anioReferencia: 2026,
        })

        expect(
          perdidaAcumulada.puntos.map((punto) => punto.anioComparado)
        ).toEqual([2019, 2020, 2021, 2022, 2023, 2024, 2025])
        expect(
          perdidaAcumulada.puntos.map(
            (punto) => punto.diferenciaPoderAdquisitivoNetoAnualCentimos
          )
        ).toEqual([48_522, 52_328, 5_867, -32_678, 936, 12_461, -1_031])
        expect(perdidaAcumulada.totalCentimos).toBe(86_405)
      })
  )

  it.effect("coincide con el ejemplo legacy de 30k contra 2012", () =>
    Effect.gen(function* () {
      const comparacion = yield* compararAjustadoPorIpc({
        salarioBrutoAnualReferenciaCentimos: 3_000_000,
        anioComparado: 2012,
        anioReferencia: 2026,
      })

      expect(comparacion.comparado.salarioBrutoNominalAnualCentimos).toBe(
        2_291_644
      )
      expect(comparacion.comparado.ajustado.cotizacionTrabajadorCentimos).toBe(
        190_500
      )
      expect(comparacion.comparado.ajustado.irpfFinalCentimos).toBe(450_107)
      expect(comparacion.comparado.ajustado.salarioNetoAnualCentimos).toBe(
        2_359_393
      )
      expect(comparacion.referencia.cotizacionTrabajadorCentimos).toBe(195_000)
      expect(comparacion.referencia.irpfFinalCentimos).toBe(492_600)
      expect(comparacion.referencia.salarioNetoAnualCentimos).toBe(2_312_400)
      expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
        46_993
      )
    })
  )

  it.effect(
    "coincide con la ruta transitoria de reduccion del trabajo de 2018",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 1_800_000,
          anioComparado: 2018,
          anioReferencia: 2026,
        })

        expect(comparacion.comparado.salarioBrutoNominalAnualCentimos).toBe(
          1_419_253
        )
        expect(
          comparacion.comparado.ajustado.cotizacionTrabajadorCentimos
        ).toBe(114_300)
        expect(comparacion.comparado.ajustado.irpfFinalCentimos).toBe(58_343)
        expect(comparacion.comparado.ajustado.salarioNetoAnualCentimos).toBe(
          1_627_357
        )
        expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
          6_738
        )
      })
  )

  it.effect(
    "coincide con la ruta legacy de cotizacion de solidaridad de 2025 para salarios altos",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 10_000_000,
          anioComparado: 2025,
          anioReferencia: 2026,
        })

        expect(comparacion.referencia.cotizacionEmpresarialCentimos).toBe(
          2_009_366
        )
        expect(comparacion.referencia.cotizacionTrabajadorCentimos).toBe(
          406_158
        )
        expect(comparacion.referencia.irpfFinalCentimos).toBe(3_211_929)
        expect(comparacion.comparado.salarioBrutoNominalAnualCentimos).toBe(
          9_708_738
        )
        expect(
          comparacion.comparado.ajustado.cotizacionEmpresarialCentimos
        ).toBe(1_979_686)
        expect(
          comparacion.comparado.ajustado.cotizacionTrabajadorCentimos
        ).toBe(399_942)
        expect(comparacion.comparado.ajustado.irpfFinalCentimos).toBe(3_181_567)
        expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
          36_578
        )
      })
  )

  it.effect(
    "mantiene salarios bajos en rango porque el IRPF historico aun puede aplicar",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 1_500_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })

        expect(comparacion.comparado.ajustado.irpfFinalCentimos).toBe(16_675)
        expect(comparacion.referencia.irpfFinalCentimos).toBe(0)
        expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
          -14_425
        )
      })
  )

  it.effect(
    "coincide con la ruta legacy de deduccion SMI alrededor del umbral de 2025",
    () =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: 1_700_000,
          anioComparado: 2025,
          anioReferencia: 2026,
        })

        expect(comparacion.referencia.irpfFinalCentimos).toBe(0)
        expect(comparacion.comparado.salarioBrutoNominalAnualCentimos).toBe(
          1_650_485
        )
        expect(comparacion.comparado.ajustado.irpfFinalCentimos).toBe(0)
        expect(comparacion.comparado.ajustado.salarioNetoAnualCentimos).toBe(
          1_589_840
        )
        expect(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos).toBe(
          340
        )
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
})
