import Decimal from "decimal.js"

export const dinero = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const dineroEntero = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const redondearPorcentajeHalfUp = (valor: Decimal.Value): Decimal => {
  const redondeado = new Decimal(valor).toDecimalPlaces(
    2,
    Decimal.ROUND_HALF_UP
  )

  return redondeado.isZero() ? new Decimal(0) : redondeado
}

const formatearDecimalEspanol = (valor: Decimal): string =>
  valor.toFixed(2).replace(".", ",")

export const formatearPorcentaje = (proporcion: Decimal.Value): string =>
  `${formatearDecimalEspanol(
    redondearPorcentajeHalfUp(new Decimal(proporcion).mul(100))
  )}%`

export const formatearPuntosPorcentuales = (
  puntosPorcentuales: Decimal.Value
): string =>
  `${formatearDecimalEspanol(redondearPorcentajeHalfUp(puntosPorcentuales))}%`

export const porcentaje = {
  format: formatearPorcentaje,
} as const

export const centimosAEuros = (centimos: number) => centimos / 100
export const eurosACentimos = (euros: number) => Math.round(euros * 100)
export const formatearCentimos = (centimos: number) =>
  dinero.format(centimosAEuros(centimos))
export const formatearCentimosEnteros = (centimos: number) =>
  dineroEntero.format(centimosAEuros(centimos))
export const limitar = (valor: number, minimo: number, maximo: number) =>
  Math.min(maximo, Math.max(minimo, valor))

export type AnioFiscal =
  | 2012
  | 2013
  | 2014
  | 2015
  | 2016
  | 2017
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026

export const ANIOS_COMPARABLES: ReadonlyArray<AnioFiscal> = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  2025,
]
