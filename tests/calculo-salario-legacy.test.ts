import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { calcularSalarioLegacy } from "../lib/dominio/compatibilidad-legacy/calculo-salario-legacy"

describe("calcularSalarioLegacy", () => {
  it.effect("reproduce el desglose salarial del caso fiscal simplificado legacy", () =>
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
})
