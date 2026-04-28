import type Decimal from "decimal.js"

import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import {
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"

export const obtenerMinimoContribuyente = ({
  anio,
  edad,
  minimos = MINIMOS_ESTATALES_2025,
}: {
  readonly anio: AnioFiscal
  readonly edad: number
  readonly minimos?: MinimosPersonalesFamiliaresIrpf
}): Decimal => {
  void anio
  const minimoBase = minimos.contribuyente.general
  const incrementoMayor65 =
    edad >= 65 ? minimos.contribuyente.adicionalMayor65 : IMPORTE_CERO
  const incrementoMayor75 =
    edad > 75 ? minimos.contribuyente.adicionalMayor75 : IMPORTE_CERO

  return minimoBase.plus(incrementoMayor65).plus(incrementoMayor75)
}
