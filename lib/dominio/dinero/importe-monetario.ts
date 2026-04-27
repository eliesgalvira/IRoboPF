import Decimal from "decimal.js"

import { redondearHalfUp, truncarDecimal } from "./redondeo"

export type ImporteMonetario = Decimal

export const crearImporteMonetario = (
  valor: Decimal.Value
): ImporteMonetario => new Decimal(valor)

// Constantes Decimal compartidas para evitar mezclar literales `number` en
// acumuladores monetarios y para expresar identidades aritmeticas de dominio.
export const IMPORTE_CERO = crearImporteMonetario(0)
export const IMPORTE_UNO = crearImporteMonetario(1)

export const centimosAEuros = (centimos: number): ImporteMonetario =>
  crearImporteMonetario(centimos).div(100)

export const redondearImporteLiquidado = (
  euros: ImporteMonetario
): ImporteMonetario => redondearHalfUp(euros, 2)

export const eurosACentimos = (euros: ImporteMonetario): number =>
  redondearHalfUp(euros.mul(100), 0).toNumber()

export const truncarImporteMonetario = (
  euros: ImporteMonetario,
  decimales: number
): ImporteMonetario => truncarDecimal(euros, decimales)
