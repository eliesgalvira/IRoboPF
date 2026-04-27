import type Decimal from "decimal.js"

import type { RendimientoCapitalInmobiliario } from "../caso-fiscal-anual"

export interface RendimientoNetoCapitalInmobiliario {
  readonly rendimientoIntegro: Decimal
  readonly rendimientoNeto: Decimal
}

export const sumarRendimientosCapitalInmobiliario = (
  rendimientos: ReadonlyArray<RendimientoCapitalInmobiliario>,
  convertirCentimosAEuros: (centimos: number) => Decimal
): Decimal =>
  rendimientos.reduce(
    (total, rendimiento) =>
      total.plus(convertirCentimosAEuros(rendimiento.importeIntegroCentimos)),
    convertirCentimosAEuros(0)
  )

/**
 * Primer caso soportado del rendimiento de capital inmobiliario.
 *
 * El Manual de Renta separa este rendimiento de los rendimientos del trabajo,
 * pero la interfaz experta necesita producir una liquidacion trazable desde el
 * primer momento. Hasta incorporar gastos deducibles, amortizaciones y
 * reducciones especificas del inmueble, esta regla integra el rendimiento
 * integro declarado como rendimiento neto simplificado dentro de la base
 * general. No debe confundirse con la liquidacion completa del alquiler.
 */
export const calcularRendimientoNetoCapitalInmobiliarioSimplificado = ({
  rendimientoIntegro,
}: {
  readonly rendimientoIntegro: Decimal
}): RendimientoNetoCapitalInmobiliario => ({
  rendimientoIntegro,
  rendimientoNeto: rendimientoIntegro,
})
