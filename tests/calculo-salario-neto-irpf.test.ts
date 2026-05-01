import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularSalarioNetoEIrpf,
  PerfilProgresividadFrioLegacy,
  type EntradaCalculoSalarioNetoIrpf,
} from "../lib/dominio/compatibilidad-legacy/perfil-progresividad-frio-legacy"

describe("calcularSalarioNetoEIrpf", () => {
  it.effect("expone la fachada del perfil legacy como servicio Effect", () =>
    Effect.gen(function* () {
      const perfil = yield* PerfilProgresividadFrioLegacy
      const entrada = entradaPerfilLegacy()

      const resultado = yield* perfil.calcular(entrada, {
        modo: "compatible-legacy",
      })

      expect(resultado._tag).toBe("ResultadoCalculoSalarioNetoIrpf")
      expect(resultado.desglose.irpfFinalCentimos).toBe(492_780)
    }).pipe(Effect.provide(PerfilProgresividadFrioLegacy.layer))
  )

  it.effect("calcula el desglose legacy mediante una fachada publica", () =>
    Effect.gen(function* () {
      const entrada = entradaPerfilLegacy()

      const resultado = yield* calcularSalarioNetoEIrpf(entrada, {
        modo: "compatible-legacy",
      })

      expect(resultado).toEqual({
        _tag: "ResultadoCalculoSalarioNetoIrpf",
        perfil: "legacy-progresividad-frio",
        modo: "compatible-legacy",
        anio: 2025,
        desglose: {
          salarioBrutoAnualCentimos: 3_000_000,
          cotizacionEmpresarialCentimos: 962_100,
          costeLaboralCentimos: 3_962_100,
          cotizacionTrabajadorCentimos: 194_400,
          irpfFinalCentimos: 492_780,
          salarioNetoAnualCentimos: 2_312_820,
        },
      })
    })
  )
})

const entradaPerfilLegacy = (): EntradaCalculoSalarioNetoIrpf => ({
  perfil: "legacy-progresividad-frio",
  anio: 2025,
  salarioBrutoAnualCentimos: 3_000_000,
})
