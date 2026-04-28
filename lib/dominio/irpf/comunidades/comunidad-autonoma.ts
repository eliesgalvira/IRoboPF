import type { AnioFiscal } from "../../normativa/anio-fiscal"
import type { FichaDeduccionAutonomica } from "../../normativa/datos/deducciones-autonomicas-2025"
import {
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
  CATALOGO_DEDUCCIONES_AUTONOMICAS_2025,
} from "../../normativa/datos/deducciones-autonomicas-2025"
import {
  obtenerEscalaAutonomicaIrpf2025,
  type EscalaAutonomicaIrpf2025,
} from "../../normativa/datos/irpf-autonomico-2025"
import { MINIMOS_AUTONOMICOS_2025_SOPORTADOS } from "../../normativa/datos/minimos-autonomicos-2025"
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
  readonly escalaAutonomica: EscalaAutonomicaIrpf2025
  readonly deduccionesAutonomicasSoportadas: ReadonlyArray<FichaDeduccionAutonomica>
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
  if (anio !== 2025) {
    return {
      _tag: "ComunidadAutonomaNoSoportada",
      comunidadAutonoma,
      anio,
      motivo: `Escalas autonomicas del anio ${anio} aun no implementadas`,
      fuenteReconocida:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/8-cumplimentacion-irpf/8_4-cuota-integra/8_4_3-gravamen-base-liquidable-general/8_4_3_2-cuota-integra-autonomica.html",
    }
  }

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio,
    minimoAutonomicoIgualEstatal:
      MINIMOS_AUTONOMICOS_2025_SOPORTADOS.valor.includes(comunidadAutonoma),
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma),
    deduccionesAutonomicasSoportadas:
      comunidadAutonoma === "simulada-estatal"
        ? []
        : deduccionesImplementadasPorComunidad(comunidadAutonoma),
  }
}

const deduccionesImplementadasPorComunidad = (
  comunidadAutonoma: ComunidadAutonoma
): ReadonlyArray<FichaDeduccionAutonomica> => {
  if (comunidadAutonoma === "simulada-estatal") {
    return []
  }

  const catalogo =
    CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor[comunidadAutonoma]
  if (!catalogo) {
    return []
  }

  const codigosCatalogados = new Set(
    catalogo.deducciones.map(
      (deduccion: FichaDeduccionAutonomica) => deduccion.codigo
    )
  )

  return DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.filter(
    (deduccion) => codigosCatalogados.has(deduccion.codigo)
  )
}
