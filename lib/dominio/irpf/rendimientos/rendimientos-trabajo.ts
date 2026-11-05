import { DecimalMonetario as Decimal } from "../../dinero/decimal-monetario"
import { Array as EffectArray } from "effect"

import { calcularDesgloseCotizacionesPerfilUniforme } from "../../laboral/cotizaciones-perfil-uniforme"
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
  cotizacionTrabajador,
}: {
  readonly anio: AnioFiscal
  readonly rendimientoIntegro: Decimal
  readonly cotizacionTrabajador?: Decimal
}): RendimientoNetoTrabajo => {
  const integro = new Decimal(rendimientoIntegro)
  const cotizacionAplicada =
    cotizacionTrabajador ??
    calcularDesgloseCotizacionesPerfilUniforme({
      anio,
      salarioBrutoAnual: integro,
    }).cotizacionTrabajador
  const rendimientoPrevioNeto = integro.minus(cotizacionAplicada)
  const gastosDeducibles = GASTOS_FIJOS_IRPF_LEGACY[anio]

  return {
    rendimientoIntegro: integro,
    cotizacionTrabajador: cotizacionAplicada,
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
  EffectArray.reduce(rendimientos, crearImporte(0), (total, rendimiento) =>
    total.plus(crearImporte(rendimiento.importeIntegroCentimos))
  )
