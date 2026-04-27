import type Decimal from "decimal.js"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type { FamiliarFiscal } from "../caso-fiscal-anual"

export const obtenerMinimoAscendientes = (
  ascendientes: ReadonlyArray<FamiliarFiscal>
): Decimal =>
  ascendientes.reduce((total, ascendiente) => {
    const minimoPorEdad =
      ascendiente.edad > 65 ||
      ascendiente.discapacidad._tag !== "SinDiscapacidad"
        ? crearImporteMonetario(1150)
        : IMPORTE_CERO
    const incrementoMayor75 =
      ascendiente.edad > 75 ? crearImporteMonetario(1400) : IMPORTE_CERO

    return total.plus(minimoPorEdad).plus(incrementoMayor75)
  }, IMPORTE_CERO)
