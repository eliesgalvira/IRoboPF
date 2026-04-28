import type Decimal from "decimal.js"

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
  switch (discapacidad._tag) {
    case "SinDiscapacidad":
      return IMPORTE_CERO
    case "Discapacidad33a64":
      return discapacidad.necesitaAyudaOMovilidadReducida
        ? minimos.grado33Hasta65.plus(minimos.gastosAsistencia)
        : minimos.grado33Hasta65
    case "Discapacidad65OMas":
      return minimos.grado65OMas.plus(minimos.gastosAsistencia)
  }
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
  familiares.reduce(
    (total, familiar) =>
      total.plus(
        obtenerMinimoPorDiscapacidad(
          familiar.discapacidad,
          minimos.discapacidad.descendiente
        )
      ),
    IMPORTE_CERO
  )

export const obtenerMinimoDiscapacidadAscendientes = (
  ascendientes: ReadonlyArray<FamiliarFiscal>,
  minimos: MinimosPersonalesFamiliaresIrpf = MINIMOS_ESTATALES_2025
): Decimal =>
  ascendientes.reduce(
    (total, ascendiente) =>
      total.plus(
        obtenerMinimoPorDiscapacidad(
          ascendiente.discapacidad,
          minimos.discapacidad.ascendiente
        )
      ),
    IMPORTE_CERO
  )
