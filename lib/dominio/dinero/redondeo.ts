import Decimal from "decimal.js"

export const redondearHalfUp = (valor: Decimal, decimales: number): Decimal =>
  valor.toDecimalPlaces(decimales, Decimal.ROUND_HALF_UP)

export const truncarDecimal = (valor: Decimal, decimales: number): Decimal =>
  valor.toDecimalPlaces(decimales, Decimal.ROUND_DOWN)

/** HALF_UP exacto para cocientes: entero escalado, sin aproximar primero la división. */
export function redondearRacionalHalfUp(n: bigint, d: bigint, decimales = 0): bigint {
  if (d <= 0n || !Number.isSafeInteger(decimales) || decimales < 0 || decimales > 80)
    throw new RangeError("Divisor o escala monetaria inválidos")
  const signo = n < 0n ? -1n : 1n
  const absoluto = (n < 0n ? -n : n) * 10n ** BigInt(decimales)
  return signo * ((2n * absoluto + d) / (2n * d))
}
