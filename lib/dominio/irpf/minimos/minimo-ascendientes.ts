import type Decimal from "decimal.js"
import { Array as EffectArray } from "effect"

import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import {
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import type { FamiliarFiscal } from "../caso-fiscal-anual"

export const obtenerMinimoAscendientes = (
  ascendientes: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad > 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? minimos.ascendientes.mayor65OConDiscapacidad
        : IMPORTE_CERO
    const incrementoMayor75 =
      ascendiente.edad > 75
        ? minimos.ascendientes.adicionalMayor75
        : IMPORTE_CERO

    return total.plus(minimoPorEdad).plus(incrementoMayor75)
  })
