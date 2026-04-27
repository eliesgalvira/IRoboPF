import type Decimal from "decimal.js"

import type { RendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"

export const calcularBaseImponibleGeneral = ({
  rendimientoTrabajo,
}: {
  readonly rendimientoTrabajo: RendimientoNetoTrabajo
}): Decimal => rendimientoTrabajo.rendimientoNeto
