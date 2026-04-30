import Decimal from "decimal.js"

import { redondearHalfUp } from "./redondeo"

export const porcentajeCompatibleLegacy = (
  tipo: Decimal,
  decimales: number
): number => Number(redondearHalfUp(tipo.mul(100), decimales).toString())
