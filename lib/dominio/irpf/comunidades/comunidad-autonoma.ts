import type { AnioFiscal } from "../../normativa/anio-fiscal"
import type { ComunidadAutonoma } from "../caso-fiscal-anual"

export interface EntradaParametrosComunidadAutonoma {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
}

export interface ParametrosComunidadAutonoma {
  readonly _tag: "ParametrosComunidadAutonoma"
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly anio: AnioFiscal
  readonly minimoAutonomicoIgualEstatal: boolean
  readonly escalaAutonomicaIgualEstatal: boolean
  readonly deduccionesAutonomicasSoportadas: ReadonlyArray<never>
}

export const obtenerParametrosComunidadAutonoma = ({
  anio,
  comunidadAutonoma,
}: EntradaParametrosComunidadAutonoma): ParametrosComunidadAutonoma => ({
  _tag: "ParametrosComunidadAutonoma",
  comunidadAutonoma,
  anio,
  minimoAutonomicoIgualEstatal: true,
  escalaAutonomicaIgualEstatal: true,
  deduccionesAutonomicasSoportadas: [],
})
