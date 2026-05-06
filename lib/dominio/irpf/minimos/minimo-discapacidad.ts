import type Decimal from "decimal.js"
import { Array as EffectArray, Match } from "effect"

import { IMPORTE_CERO } from "../../dinero/importe-monetario"
import {
  MINIMOS_ESTATALES_2025,
  type MinimoDiscapacidadIrpf,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import type {
  DiscapacidadFiscal,
  FamiliarFiscal,
  SituacionFamiliarIndividual,
} from "../caso-fiscal-anual"

const obtenerMinimoPorDiscapacidad = (
  discapacidad: DiscapacidadFiscal,
  minimos: MinimoDiscapacidadIrpf
): Decimal => {
  return Match.valueTags(discapacidad, {
    SinDiscapacidad: () => IMPORTE_CERO,
    Discapacidad33a64: ({ necesitaAyudaOMovilidadReducida }) =>
      necesitaAyudaOMovilidadReducida
        ? minimos.grado33Hasta65.plus(minimos.gastosAsistencia)
        : minimos.grado33Hasta65,
    Discapacidad65OMas: () =>
      minimos.grado65OMas.plus(minimos.gastosAsistencia),
  })
}

export const obtenerMinimoDiscapacidadContribuyente = (
  situacionFamiliar: SituacionFamiliarIndividual,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  obtenerMinimoPorDiscapacidad(
    situacionFamiliar.discapacidad,
    minimos.discapacidad.contribuyente
  )

export const obtenerMinimoDiscapacidadFamiliares = (
  familiares: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  EffectArray.reduce(familiares, IMPORTE_CERO, (total, familiar) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        familiar.discapacidad,
        minimos.discapacidad.descendiente
      )
    )
  )

export const obtenerMinimoDiscapacidadAscendientes = (
  ascendientes: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  EffectArray.reduce(ascendientes, IMPORTE_CERO, (total, ascendiente) =>
    total.plus(
      obtenerMinimoPorDiscapacidad(
        ascendiente.discapacidad,
        minimos.discapacidad.ascendiente
      )
    )
  )
