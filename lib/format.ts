export const money = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const integerMoney = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export const percent = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const centsToEuros = (cents: number) => cents / 100
export const eurosToCents = (euros: number) => Math.round(euros * 100)
export const formatCents = (cents: number) => money.format(centsToEuros(cents))
export const formatIntegerCents = (cents: number) =>
  integerMoney.format(centsToEuros(cents))
export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export type FiscalYear =
  | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019
  | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 2026

export const COMPARABLE_YEARS: ReadonlyArray<FiscalYear> = [
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
]
