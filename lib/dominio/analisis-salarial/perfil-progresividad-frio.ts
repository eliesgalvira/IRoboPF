import { Context, Effect, Layer } from "effect"

import type { DesgloseLiquidado } from "./progresividad-frio"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import { CalculoSalario } from "./calculo-salario"
import type { LiquidarIrpfAnualError } from "../irpf/liquidacion/liquidar-irpf-anual"

export type PerfilCalculoAnalitico = Extract<
  PerfilCalculo,
  "analisis-progresividad-frio"
>

export interface EntradaCalculoSalarioNetoIrpf {
  readonly perfil: PerfilCalculoAnalitico
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

export interface ContextoCalculo {
  readonly modo: ModoCalculo
}

export interface ResultadoCalculoSalarioNetoIrpf {
  readonly _tag: "ResultadoCalculoSalarioNetoIrpf"
  readonly perfil: PerfilCalculoAnalitico
  readonly modo: ModoCalculo
  readonly anio: AnioFiscal
  readonly desglose: DesgloseLiquidado
}

const construirCalcularSalarioNetoEIrpf = ({
  calculoSalario,
}: {
  readonly calculoSalario: CalculoSalario["Service"]
}) =>
  Effect.fn("compatibilidadLegacy.calcularSalarioNetoEIrpf")(function* (
    entrada: EntradaCalculoSalarioNetoIrpf,
    contexto: ContextoCalculo
  ) {
    const desglose = yield* calculoSalario.calcular({
      anio: entrada.anio,
      salarioBrutoAnualCentimos: entrada.salarioBrutoAnualCentimos,
      modo: contexto.modo,
    })

    return {
      _tag: "ResultadoCalculoSalarioNetoIrpf",
      perfil: entrada.perfil,
      modo: contexto.modo,
      anio: entrada.anio,
      desglose,
    } satisfies ResultadoCalculoSalarioNetoIrpf
  })

export class PerfilProgresividadFrio extends Context.Service<
  PerfilProgresividadFrio,
  {
    readonly calcular: (
      entrada: EntradaCalculoSalarioNetoIrpf,
      contexto: ContextoCalculo
    ) => Effect.Effect<ResultadoCalculoSalarioNetoIrpf, LiquidarIrpfAnualError>
  }
>()(
  "irobopf/lib/dominio/analisis-salarial/perfil-progresividad-frio/PerfilProgresividadFrio"
) {
  static readonly layer = Layer.effect(
    PerfilProgresividadFrio,
    Effect.gen(function* () {
      const calculoSalario = yield* CalculoSalario

      return {
        calcular: construirCalcularSalarioNetoEIrpf({
          calculoSalario,
        }),
      }
    })
  ).pipe(Layer.provideMerge(CalculoSalario.layer))
}

const calcularSalarioNetoEIrpfDesdeServicio = Effect.fn(
  "compatibilidadLegacy.calcularSalarioNetoEIrpfDesdeServicio"
)(function* (
  entrada: EntradaCalculoSalarioNetoIrpf,
  contexto: ContextoCalculo
) {
  const perfil = yield* PerfilProgresividadFrio

  return yield* perfil.calcular(entrada, contexto)
})

export const calcularSalarioNetoEIrpf = (
  entrada: EntradaCalculoSalarioNetoIrpf,
  contexto: ContextoCalculo
): Effect.Effect<ResultadoCalculoSalarioNetoIrpf, LiquidarIrpfAnualError> =>
  // @effect-diagnostics-next-line effect/strictEffectProvide:off
  calcularSalarioNetoEIrpfDesdeServicio(entrada, contexto).pipe(
    Effect.provide(PerfilProgresividadFrio.layer)
  )
