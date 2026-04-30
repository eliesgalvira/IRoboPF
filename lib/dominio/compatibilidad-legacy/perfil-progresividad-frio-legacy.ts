import { Context, Effect, Layer } from "effect"

import type { DesgloseLiquidado } from "./progresividad-frio"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import { CompatibilidadSalarioLegacy } from "./calculo-salario-legacy"

export type PerfilCalculoLegacy = Extract<
  PerfilCalculo,
  "legacy-progresividad-frio"
>

export interface EntradaCalculoSalarioNetoIrpf {
  readonly perfil: PerfilCalculoLegacy
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

export interface ContextoCalculo {
  readonly modo: ModoCalculo
}

export interface ResultadoCalculoSalarioNetoIrpf {
  readonly _tag: "ResultadoCalculoSalarioNetoIrpf"
  readonly perfil: PerfilCalculoLegacy
  readonly modo: ModoCalculo
  readonly anio: AnioFiscal
  readonly desglose: DesgloseLiquidado
}

const construirCalcularSalarioNetoEIrpf = ({
  compatibilidadSalarioLegacy,
}: {
  readonly compatibilidadSalarioLegacy: CompatibilidadSalarioLegacy["Service"]
}) =>
  Effect.fn("compatibilidadLegacy.calcularSalarioNetoEIrpf")(function* (
    entrada: EntradaCalculoSalarioNetoIrpf,
    contexto: ContextoCalculo
  ) {
    const desglose = yield* compatibilidadSalarioLegacy.calcular({
      anio: entrada.anio,
      salarioBrutoAnualCentimos: entrada.salarioBrutoAnualCentimos,
    })

    return {
      _tag: "ResultadoCalculoSalarioNetoIrpf",
      perfil: entrada.perfil,
      modo: contexto.modo,
      anio: entrada.anio,
      desglose,
    } satisfies ResultadoCalculoSalarioNetoIrpf
  })

export class PerfilProgresividadFrioLegacy extends Context.Service<
  PerfilProgresividadFrioLegacy,
  {
    readonly calcular: (
      entrada: EntradaCalculoSalarioNetoIrpf,
      contexto: ContextoCalculo
    ) => Effect.Effect<ResultadoCalculoSalarioNetoIrpf>
  }
>()("@irobopf/dominio/compatibilidadLegacy/PerfilProgresividadFrioLegacy") {
  static readonly layer = Layer.effect(
    PerfilProgresividadFrioLegacy,
    Effect.gen(function* () {
      const compatibilidadSalarioLegacy = yield* CompatibilidadSalarioLegacy

      return {
        calcular: construirCalcularSalarioNetoEIrpf({
          compatibilidadSalarioLegacy,
        }),
      }
    })
  ).pipe(Layer.provideMerge(CompatibilidadSalarioLegacy.layer))
}

const calcularSalarioNetoEIrpfDesdeServicio = Effect.fn(
  "compatibilidadLegacy.calcularSalarioNetoEIrpfDesdeServicio"
)(function* (
  entrada: EntradaCalculoSalarioNetoIrpf,
  contexto: ContextoCalculo
) {
  const perfil = yield* PerfilProgresividadFrioLegacy

  return yield* perfil.calcular(entrada, contexto)
})

export const calcularSalarioNetoEIrpf = (
  entrada: EntradaCalculoSalarioNetoIrpf,
  contexto: ContextoCalculo
): Effect.Effect<ResultadoCalculoSalarioNetoIrpf> =>
  calcularSalarioNetoEIrpfDesdeServicio(entrada, contexto).pipe(
    Effect.provide(PerfilProgresividadFrioLegacy.layer)
  )
