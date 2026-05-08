import type Decimal from "decimal.js"
import { Array as EffectArray, Match } from "effect"

import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import {
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import type { FamiliarFiscal } from "../caso-fiscal-anual"

const minimoPorOrden = (
  indice: number,
  minimos: MinimosPersonalesFamiliaresIrpf
): Decimal =>
  Match.value(indice).pipe(
    Match.when(0, () => minimos.descendientes.primero),
    Match.when(1, () => minimos.descendientes.segundo),
    Match.when(2, () => minimos.descendientes.tercero),
    Match.orElse(() => minimos.descendientes.cuartoYSiguientes)
  )

export const obtenerMinimoDescendientes = (
  descendientes: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  EffectArray.reduce(
    descendientes.toSorted((a, b) => b.edad - a.edad),
    IMPORTE_CERO,
    (total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3
          ? minimos.descendientes.adicionalMenorTres
          : IMPORTE_CERO

      return total
        .plus(minimoPorOrden(indice, minimos))
        .plus(incrementoMenorTres)
    }
  )
