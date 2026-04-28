import { Context, Effect, Layer } from "effect"

import {
  compararAjustadoPorIpc,
  type DesgloseLiquidado,
} from "../../domain/progresividad"
import type { AnioFiscal } from "../normativa/anio-fiscal"

export interface EntradaCalculoSalarioLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

// Este adaptador conserva el contrato observable del perfil legacy mientras el
// calculo se va moviendo desde `lib/domain/progresividad.ts` por partes.
const calcularSalarioLegacyImpl = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacy"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const calculo = yield* compararAjustadoPorIpc({
    salarioBrutoAnualReferenciaCentimos: entrada.salarioBrutoAnualCentimos,
    anioComparado: entrada.anio,
    anioReferencia: entrada.anio,
  })

  return calculo.referencia
})

export class CompatibilidadSalarioLegacy extends Context.Service<
  CompatibilidadSalarioLegacy,
  {
    readonly calcular: (
      entrada: EntradaCalculoSalarioLegacy
    ) => Effect.Effect<DesgloseLiquidado>
  }
>()("@irobopf/dominio/compatibilidadLegacy/CompatibilidadSalarioLegacy") {
  static readonly layer = Layer.succeed(CompatibilidadSalarioLegacy, {
    calcular: calcularSalarioLegacyImpl,
  })
}

const calcularSalarioLegacyDesdeServicio = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacyDesdeServicio"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const compatibilidad = yield* CompatibilidadSalarioLegacy

  return yield* compatibilidad.calcular(entrada)
})

export const calcularSalarioLegacy = (
  entrada: EntradaCalculoSalarioLegacy
): Effect.Effect<DesgloseLiquidado> =>
  calcularSalarioLegacyDesdeServicio(entrada).pipe(
    Effect.provide(CompatibilidadSalarioLegacy.layer)
  )
