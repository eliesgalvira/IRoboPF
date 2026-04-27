import Decimal from "decimal.js"

import { redondearHalfEvenTabularLegacy } from "./redondeo"

// El Excel legacy usa half-even en porcentajes y rotulos tabulares. No es una
// regla monetaria y no debe usarse para liquidar importes.
export const porcentajeCompatibleLegacy = (
  tipo: Decimal,
  decimales: number
): number =>
  Number(redondearHalfEvenTabularLegacy(tipo.mul(100), decimales).toString())
