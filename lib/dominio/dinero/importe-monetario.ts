import Decimal from "decimal.js"
import { Context, Effect, Layer } from "effect"

import { redondearHalfUp, truncarDecimal } from "./redondeo"

export type ImporteMonetario = Decimal

export const crearImporteMonetario = (valor: Decimal.Value): ImporteMonetario =>
  new Decimal(valor)

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
  redondearImporteLiquidado(euros).mul(100).toNumber()

export const truncarImporteMonetario = (
  euros: ImporteMonetario,
  decimales: number
): ImporteMonetario => truncarDecimal(euros, decimales)

export interface ServicioPoliticaMonetaria {
  readonly centimosAEuros: (centimos: number) => Effect.Effect<ImporteMonetario>
  readonly eurosACentimos: (euros: ImporteMonetario) => Effect.Effect<number>
  readonly redondearImporteLiquidado: (
    euros: ImporteMonetario
  ) => Effect.Effect<ImporteMonetario>
  readonly importeLiquidadoACentimos: (
    euros: ImporteMonetario
  ) => Effect.Effect<number>
}

export class PoliticaMonetaria extends Context.Service<
  PoliticaMonetaria,
  ServicioPoliticaMonetaria
>()("irobopf/lib/dominio/dinero/importe-monetario/PoliticaMonetaria") {
  static readonly layer = Layer.succeed(PoliticaMonetaria, {
    centimosAEuros: Effect.fn("PoliticaMonetaria.centimosAEuros")(function* (
      centimos: number
    ) {
      return centimosAEuros(centimos)
    }),
    eurosACentimos: Effect.fn("PoliticaMonetaria.eurosACentimos")(function* (
      euros: ImporteMonetario
    ) {
      return eurosACentimos(euros)
    }),
    redondearImporteLiquidado: Effect.fn(
      "PoliticaMonetaria.redondearImporteLiquidado"
    )(function* (euros: ImporteMonetario) {
      return redondearImporteLiquidado(euros)
    }),
    importeLiquidadoACentimos: Effect.fn(
      "PoliticaMonetaria.importeLiquidadoACentimos"
    )(function* (euros: ImporteMonetario) {
      return eurosACentimos(euros)
    }),
  })
}
