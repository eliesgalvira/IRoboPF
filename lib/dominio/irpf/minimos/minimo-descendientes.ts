import type Decimal from "decimal.js"

import {
  IMPORTE_CERO,
} from "../../dinero/importe-monetario"
import {
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import type { FamiliarFiscal } from "../caso-fiscal-anual"

const minimoPorOrden = (
  indice: number,
  minimos: MinimosPersonalesFamiliaresIrpf
): Decimal => {
  switch (indice) {
    case 0:
      return minimos.descendientes.primero
    case 1:
      return minimos.descendientes.segundo
    case 2:
      return minimos.descendientes.tercero
    default:
      return minimos.descendientes.cuartoYSiguientes
  }
}

export const obtenerMinimoDescendientes = (
  descendientes: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  descendientes
    .toSorted((a, b) => b.edad - a.edad)
    .reduce((total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
          : IMPORTE_CERO

      return total
        .plus(minimoPorOrden(indice, minimos))
        .plus(incrementoMenorTres)
    }, IMPORTE_CERO)
