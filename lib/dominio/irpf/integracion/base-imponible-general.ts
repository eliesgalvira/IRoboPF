import Decimal from "decimal.js"

import type { RendimientoNetoCapitalInmobiliario } from "../rendimientos/rendimientos-capital-inmobiliario"
import type { RendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"

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
  Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  )
    .plus(rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0)
    .plus(gananciaPatrimonialGeneral ?? 0)
