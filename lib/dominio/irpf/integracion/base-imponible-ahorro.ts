import { DecimalMonetario as Decimal } from "../../dinero/decimal-monetario"

import type { GananciasPatrimonialesCalculadas } from "../rendimientos/ganancias-perdidas-patrimoniales"

export const calcularBaseImponibleAhorro = ({
  gananciasPatrimoniales,
}: {
  readonly gananciasPatrimoniales: GananciasPatrimonialesCalculadas
}): Decimal => Decimal.max(0, gananciasPatrimoniales.gananciaSujetaAhorro)
