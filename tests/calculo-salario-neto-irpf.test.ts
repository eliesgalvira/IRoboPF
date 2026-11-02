// Tests are Effect entry points, so they provide the service layer directly.
// @effect-diagnostics effect/strictEffectProvide:off
import { expect, it } from "@effect/vitest"
import { Effect } from "effect"

import { calcularSalarioNetoEIrpf } from "../lib/dominio/analisis-salarial/perfil-progresividad-frio"

it.effect("EMI-01 propaga el modo canónico hasta cotizaciones y neto", () =>
  Effect.gen(function* () {
    const r = yield* calcularSalarioNetoEIrpf(
      {
        perfil: "analisis-progresividad-frio",
        anio: 2018,
        salarioBrutoAnualCentimos: 6000000,
      },
      { modo: "canonico" }
    )
    expect(r.desglose.cotizacionTrabajadorCentimos).toBe(287508)
    expect(r.desglose.irpfFinalCentimos).toBe(1504322)
    expect(r.desglose.salarioNetoAnualCentimos).toBe(4208170)
  })
)
