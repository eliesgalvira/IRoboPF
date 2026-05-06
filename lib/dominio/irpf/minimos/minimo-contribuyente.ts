import type Decimal from "decimal.js"
import { Match } from "effect"

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
  const incrementoMayor65 = Match.value(edad).pipe(
    Match.when(
      (edad) => edad >= 65,
      () => minimos.contribuyente.adicionalMayor65
    ),
    Match.orElse(() => IMPORTE_CERO)
  )
  const incrementoMayor75 = Match.value(edad).pipe(
    Match.when(
      (edad) => edad > 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

  return minimoBase.plus(incrementoMayor65).plus(incrementoMayor75)
}
