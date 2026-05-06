import Decimal from "decimal.js"

export const redondearHalfUp = (valor: Decimal, decimales: number): Decimal =>
  valor.toDecimalPlaces(decimales, Decimal.ROUND_HALF_UP)

export const truncarDecimal = (valor: Decimal, decimales: number): Decimal =>
  valor.toDecimalPlaces(decimales, Decimal.ROUND_DOWN)
