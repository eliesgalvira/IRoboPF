import type Decimal from "decimal.js"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type { FamiliarFiscal } from "../caso-fiscal-anual"

const MINIMOS_POR_ORDEN = [
  crearImporteMonetario(2400),
  crearImporteMonetario(2700),
  crearImporteMonetario(4000),
] as const

const MINIMO_CUARTO_Y_SIGUIENTES = crearImporteMonetario(4500)
const INCREMENTO_MENOR_TRES_ANOS = crearImporteMonetario(2800)

const minimoPorOrden = (indice: number): Decimal =>
  MINIMOS_POR_ORDEN[indice] ?? MINIMO_CUARTO_Y_SIGUIENTES

export const obtenerMinimoDescendientes = (
  descendientes: ReadonlyArray<FamiliarFiscal>
): Decimal =>
  descendientes
    .toSorted((a, b) => b.edad - a.edad)
    .reduce((total, descendiente, indice) => {
      const incrementoMenorTres =
        descendiente.edad < 3 ? INCREMENTO_MENOR_TRES_ANOS : IMPORTE_CERO

      return total.plus(minimoPorOrden(indice)).plus(incrementoMenorTres)
    }, IMPORTE_CERO)
