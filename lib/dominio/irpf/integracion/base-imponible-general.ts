import type Decimal from "decimal.js"

import type { RendimientoNetoCapitalInmobiliario } from "../rendimientos/rendimientos-capital-inmobiliario"
import type { RendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"

export const calcularBaseImponibleGeneral = ({
  rendimientoCapitalInmobiliario,
  rendimientoTrabajo,
}: {
  readonly rendimientoCapitalInmobiliario?: RendimientoNetoCapitalInmobiliario
  readonly rendimientoTrabajo: RendimientoNetoTrabajo
}): Decimal =>
  rendimientoTrabajo.rendimientoNeto.plus(
    rendimientoCapitalInmobiliario?.rendimientoNeto ?? 0
  )
