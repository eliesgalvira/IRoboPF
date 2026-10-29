import type Decimal from "decimal.js"
import { Match } from "effect"

import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { MINIMOS_ESTATALES_2012 } from "../../normativa/datos/minimos-autonomicos-2012"
import { MINIMOS_ESTATALES_2013 } from "../../normativa/datos/minimos-autonomicos-2013"
import { MINIMOS_ESTATALES_2014 } from "../../normativa/datos/minimos-autonomicos-2014"
import {
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"

const minimosEstatalesDelAnio = (anio: AnioFiscal) =>
  Match.value(anio).pipe(
    Match.when(2012, () => MINIMOS_ESTATALES_2012),
    Match.when(2013, () => MINIMOS_ESTATALES_2013),
    Match.when(2014, () => MINIMOS_ESTATALES_2014),
    Match.orElse(() => MINIMOS_ESTATALES_2025)
  )

export const obtenerMinimoContribuyente = ({
  anio,
  edad,
  minimos = minimosEstatalesDelAnio(anio),
}: {
  readonly anio: AnioFiscal
  readonly edad: number
  readonly minimos?: MinimosPersonalesFamiliaresIrpf
}): Decimal => {
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
      (edad) => edad >= 75,
      () => minimos.contribuyente.adicionalMayor75
    ),
    Match.orElse(() => IMPORTE_CERO)
  )

  return minimoBase.plus(incrementoMayor65).plus(incrementoMayor75)
}
