import { Effect } from "effect"

import type { DesgloseLiquidado } from "../../domain/progresividad"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import { calcularSalarioLegacy } from "./calculo-salario-legacy"

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

export const calcularSalarioNetoEIrpf = Effect.fn(
  "compatibilidadLegacy.calcularSalarioNetoEIrpf"
)(function* (
  entrada: EntradaCalculoSalarioNetoIrpf,
  contexto: ContextoCalculo
) {
  const desglose = yield* calcularSalarioLegacy({
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
