import { describe, expect, it } from "@effect/vitest"

import {
  UMBRALES_RETENCION_NOMINA_POR_ANIO,
  umbralRetencionTrabajoEuros,
} from "../lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"

describe("datos de retenciones de trabajo", () => {
  it("modela situacion 1 sin descendientes como combinacion inexistente", () => {
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2026,
        numeroDescendientes: 0,
        situacionFamiliar: "situacion1",
      })
    ).toBeNull()
  })

  it("devuelve el vector anual de situacion 2 con dos descendientes al cierre del año", () => {
    const esperado = [
      [2012, 16_952],
      [2013, 16_952],
      [2014, 16_952],
      [2015, 17_138],
      [2016, 17_138],
      [2017, 17_138],
      [2018, 17_492],
      [2019, 17_634],
      [2020, 17_634],
      [2021, 17_634],
      [2022, 17_634],
      [2023, 19_241],
      [2024, 19_262],
      [2025, 19_262],
      [2026, 19_262],
    ] as const satisfies ReadonlyArray<readonly [AnioFiscal, number]>

    expect(
      esperado.map(([anio]) =>
        umbralRetencionTrabajoEuros({
          anio,
          numeroDescendientes: 2,
          situacionFamiliar: "situacion2",
        })
      )
    ).toEqual(esperado.map(([, umbral]) => umbral))
  })

  it("resuelve los cambios intra-anuales de 2018, 2023 y 2024", () => {
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2018,
        fecha: "2018-07-04",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(17_138)
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2018,
        fecha: "2018-07-05",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(17_492)
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2023,
        fecha: "2023-01-31",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(17_634)
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2023,
        fecha: "2023-02-01",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(19_241)
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2024,
        fecha: "2024-02-07",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(19_241)
    expect(
      umbralRetencionTrabajoEuros({
        anio: 2024,
        fecha: "2024-02-08",
        numeroDescendientes: 2,
        situacionFamiliar: "situacion2",
      })
    ).toBe(19_262)
  })

  it("expone los periodos normativos por año", () => {
    expect(UMBRALES_RETENCION_NOMINA_POR_ANIO[2018]).toHaveLength(2)
    expect(UMBRALES_RETENCION_NOMINA_POR_ANIO[2023]).toHaveLength(2)
    expect(UMBRALES_RETENCION_NOMINA_POR_ANIO[2024]).toHaveLength(2)
    expect(UMBRALES_RETENCION_NOMINA_POR_ANIO[2026]).toHaveLength(1)
  })
})
