import type Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { MINIMO_PERSONAL_IRPF_LEGACY } from "../../normativa/datos/irpf-estatal-2012-2026"

export const obtenerMinimoContribuyente = ({
  anio,
  edad,
}: {
  readonly anio: AnioFiscal
  readonly edad: number
}): Decimal => {
  const minimoBase = MINIMO_PERSONAL_IRPF_LEGACY[anio]
  const incrementoMayor65 =
    edad >= 65 ? crearImporteMonetario(1150) : minimoBase.mul(0)
  const incrementoMayor75 =
    edad > 75 ? crearImporteMonetario(1400) : minimoBase.mul(0)

  return minimoBase.plus(incrementoMayor65).plus(incrementoMayor75)
}
