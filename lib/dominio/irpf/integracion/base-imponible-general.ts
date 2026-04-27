import Decimal from "decimal.js"

import type { RendimientoNetoCapitalInmobiliario } from "../rendimientos/rendimientos-capital-inmobiliario"
import type { RendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"

export const calcularBaseImponibleGeneral = ({
  reduccionRendimientosTrabajo,
  rendimientoCapitalInmobiliario,
  rendimientoTrabajo,
}: {
  readonly reduccionRendimientosTrabajo?: Decimal
  readonly rendimientoCapitalInmobiliario?: RendimientoNetoCapitalInmobiliario
  readonly rendimientoTrabajo: RendimientoNetoTrabajo
}): Decimal =>
  Decimal.max(
    0,
    rendimientoTrabajo.rendimientoNeto.minus(reduccionRendimientosTrabajo ?? 0)
  ).plus(rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0)
