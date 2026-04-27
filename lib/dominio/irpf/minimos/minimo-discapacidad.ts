import type Decimal from "decimal.js"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../../dinero/importe-monetario"
import type {
  DiscapacidadFiscal,
  FamiliarFiscal,
  SituacionFamiliarIndividual,
} from "../caso-fiscal-anual"

const MINIMO_DISCAPACIDAD_33_A_64 = crearImporteMonetario(3000)
const INCREMENTO_ASISTENCIA = crearImporteMonetario(3000)
const MINIMO_DISCAPACIDAD_65_O_MAS = crearImporteMonetario(9000)

const obtenerMinimoPorDiscapacidad = (
  discapacidad: DiscapacidadFiscal
): Decimal => {
  switch (discapacidad._tag) {
    case "SinDiscapacidad":
      return IMPORTE_CERO
    case "Discapacidad33a64":
      return discapacidad.necesitaAyudaOMovilidadReducida
        ? MINIMO_DISCAPACIDAD_33_A_64.plus(INCREMENTO_ASISTENCIA)
        : MINIMO_DISCAPACIDAD_33_A_64
    case "Discapacidad65OMas":
      return MINIMO_DISCAPACIDAD_65_O_MAS.plus(INCREMENTO_ASISTENCIA)
  }
}

export const obtenerMinimoDiscapacidadContribuyente = (
  situacionFamiliar: SituacionFamiliarIndividual
): Decimal => obtenerMinimoPorDiscapacidad(situacionFamiliar.discapacidad)

export const obtenerMinimoDiscapacidadFamiliares = (
  familiares: ReadonlyArray<FamiliarFiscal>
): Decimal =>
  familiares.reduce(
    (total, familiar) =>
      total.plus(obtenerMinimoPorDiscapacidad(familiar.discapacidad)),
    IMPORTE_CERO
  )
