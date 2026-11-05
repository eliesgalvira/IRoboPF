import { DecimalMonetario as Decimal } from "../../dinero/decimal-monetario"

import type { RendimientoNetoCapitalInmobiliario } from "../rendimientos/rendimientos-capital-inmobiliario"
import type { RendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"

/** Composición compartida: art20 no crea un rendimiento neto negativo. */
export const integrarTrabajoReducido = (neto: Decimal, reduccion: Decimal): Decimal =>
  Decimal.max(0, new Decimal(neto).minus(reduccion))

export const calcularBaseImponibleGeneral = ({
  gananciaPatrimonialGeneral,
  reduccionRendimientosTrabajo,
  rendimientoCapitalInmobiliario,
  rendimientoTrabajo,
}: {
  readonly gananciaPatrimonialGeneral?: Decimal
  readonly reduccionRendimientosTrabajo?: Decimal
  readonly rendimientoCapitalInmobiliario?: RendimientoNetoCapitalInmobiliario
  readonly rendimientoTrabajo: RendimientoNetoTrabajo
}): Decimal =>
  integrarTrabajoReducido(rendimientoTrabajo.rendimientoNeto, reduccionRendimientosTrabajo ?? new Decimal(0))
    .plus(rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0)
    .plus(gananciaPatrimonialGeneral ?? 0)
