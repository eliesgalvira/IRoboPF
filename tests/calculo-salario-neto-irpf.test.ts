import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularSalarioNetoEIrpf,
  type EntradaCalculoSalarioNetoIrpf,
} from "../lib/dominio/compatibilidad-legacy/perfil-progresividad-frio-legacy"

describe("calcularSalarioNetoEIrpf", () => {
  it.effect("calcula el desglose legacy mediante una fachada publica", () =>
    Effect.gen(function* () {
      const entrada = {
        perfil: "legacy-progresividad-frio",
        anio: 2026,
        salarioBrutoAnualCentimos: 3_000_000,
      } satisfies EntradaCalculoSalarioNetoIrpf

      const resultado = yield* calcularSalarioNetoEIrpf(entrada, {
        modo: "compatible-legacy",
      })

      expect(resultado).toEqual({
        _tag: "ResultadoCalculoSalarioNetoIrpf",
        perfil: "legacy-progresividad-frio",
        modo: "compatible-legacy",
        anio: 2026,
        desglose: {
          salarioBrutoAnualCentimos: 3_000_000,
          cotizacionEmpresarialCentimos: 964_500,
          costeLaboralCentimos: 3_964_500,
          cotizacionTrabajadorCentimos: 195_000,
          irpfFinalCentimos: 492_600,
          salarioNetoAnualCentimos: 2_312_400,
        },
      })
    })
  )
})
