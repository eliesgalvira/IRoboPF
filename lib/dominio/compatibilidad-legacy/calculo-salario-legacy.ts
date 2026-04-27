import { Effect } from "effect"

import { compararAjustadoPorIpc } from "../../domain/progresividad"
import type { AnioFiscal } from "../normativa/anio-fiscal"

export interface EntradaCalculoSalarioLegacy {
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}

// Este adaptador conserva el contrato observable del perfil legacy mientras el
// calculo se va moviendo desde `lib/domain/progresividad.ts` por vertical slices.
export const calcularSalarioLegacy = Effect.fn(
  "compatibilidadLegacy.calcularSalarioLegacy"
)(function* (entrada: EntradaCalculoSalarioLegacy) {
  const calculo = yield* compararAjustadoPorIpc({
    salarioBrutoAnualReferenciaCentimos: entrada.salarioBrutoAnualCentimos,
    anioComparado: entrada.anio,
    anioReferencia: entrada.anio,
  })

  return calculo.referencia
})
