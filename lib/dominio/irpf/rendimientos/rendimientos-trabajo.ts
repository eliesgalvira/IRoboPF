import Decimal from "decimal.js"

import { calcularCotizacionesSocialesLegacy } from "../../laboral/cotizaciones-sociales"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { GASTOS_FIJOS_IRPF_LEGACY } from "../../normativa/datos/irpf-estatal-2012-2026"
import type { RendimientoTrabajo } from "../caso-fiscal-anual"

export interface RendimientoNetoTrabajo {
  readonly rendimientoIntegro: Decimal
  readonly cotizacionTrabajador: Decimal
  readonly rendimientoPrevioNeto: Decimal
  readonly gastosDeducibles: Decimal
  readonly rendimientoNeto: Decimal
}

export const calcularRendimientoNetoTrabajo = ({
  anio,
  rendimientoIntegro,
}: {
  readonly anio: AnioFiscal
  readonly rendimientoIntegro: Decimal
}): RendimientoNetoTrabajo => {
  const cotizaciones = calcularCotizacionesSocialesLegacy({
    anio,
    salarioBrutoAnual: rendimientoIntegro,
  })
  const rendimientoPrevioNeto = rendimientoIntegro.minus(
    cotizaciones.cotizacionTrabajador
  )
  const gastosDeducibles = GASTOS_FIJOS_IRPF_LEGACY[anio]

  return {
    rendimientoIntegro,
    cotizacionTrabajador: cotizaciones.cotizacionTrabajador,
    rendimientoPrevioNeto,
    gastosDeducibles,
    rendimientoNeto: Decimal.max(
      0,
      rendimientoPrevioNeto.minus(gastosDeducibles)
    ),
  }
}

export const sumarRendimientosTrabajo = (
  rendimientos: ReadonlyArray<RendimientoTrabajo>,
  crearImporte: (centimos: number) => Decimal
): Decimal =>
  rendimientos.reduce(
    (total, rendimiento) =>
      total.plus(crearImporte(rendimiento.importeIntegroCentimos)),
    crearImporte(0)
  )
