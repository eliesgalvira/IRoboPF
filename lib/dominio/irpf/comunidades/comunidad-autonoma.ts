import type { AnioFiscal } from "../../normativa/anio-fiscal"
import { DEDUCCIONES_AUTONOMICAS_2025_SOPORTADAS } from "../../normativa/datos/deducciones-autonomicas-2025"
import { MINIMOS_AUTONOMICOS_2025_SOPORTADOS } from "../../normativa/datos/minimos-autonomicos-2025"
import type { ComunidadAutonoma } from "../caso-fiscal-anual"

export interface EntradaParametrosComunidadAutonoma {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
}

export interface ParametrosComunidadAutonoma {
  readonly _tag: "ParametrosComunidadAutonoma"
  readonly comunidadAutonoma: "simulada-estatal"
  readonly anio: AnioFiscal
  readonly minimoAutonomicoIgualEstatal: boolean
  readonly escalaAutonomicaIgualEstatal: boolean
  readonly deduccionesAutonomicasSoportadas: ReadonlyArray<never>
}

export interface ComunidadAutonomaNoSoportada {
  readonly _tag: "ComunidadAutonomaNoSoportada"
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly anio: AnioFiscal
  readonly motivo: string
  readonly fuenteReconocida: string
}

export type ResultadoParametrosComunidadAutonoma =
  | ParametrosComunidadAutonoma
  | ComunidadAutonomaNoSoportada

export const obtenerParametrosComunidadAutonoma = ({
  anio,
  comunidadAutonoma,
}: EntradaParametrosComunidadAutonoma): ResultadoParametrosComunidadAutonoma => {
  if (comunidadAutonoma !== "simulada-estatal") {
    return {
      _tag: "ComunidadAutonomaNoSoportada",
      comunidadAutonoma,
      anio,
      motivo: `Comunidad autonoma ${comunidadAutonoma} aun no implementada`,
      fuenteReconocida:
        "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
    }
  }

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio,
    minimoAutonomicoIgualEstatal:
      MINIMOS_AUTONOMICOS_2025_SOPORTADOS.valor.includes(comunidadAutonoma),
    escalaAutonomicaIgualEstatal: true,
    deduccionesAutonomicasSoportadas:
      DEDUCCIONES_AUTONOMICAS_2025_SOPORTADAS.valor,
  }
}
