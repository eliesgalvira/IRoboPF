import Decimal from "decimal.js"

import type { GananciasPatrimonialesCalculadas } from "../rendimientos/ganancias-perdidas-patrimoniales"

export const calcularBaseImponibleAhorro = ({
  gananciasPatrimoniales,
}: {
  readonly gananciasPatrimoniales: GananciasPatrimonialesCalculadas
}): Decimal => Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro)
