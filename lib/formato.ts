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

export const porcentaje = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

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
