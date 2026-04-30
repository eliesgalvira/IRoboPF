import { Context, Effect, Layer, Match, Option } from "effect"

import type { AnioFiscal } from "../../normativa/anio-fiscal"
import type {
  DeduccionAutonomicaCatalogada,
  FichaDeduccionAutonomica,
} from "../../normativa/datos/deducciones-autonomicas-2025"
import {
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
  CATALOGO_DEDUCCIONES_AUTONOMICAS_2025,
  obtenerDeduccionAutonomicaCatalogada,
} from "../../normativa/datos/deducciones-autonomicas-2025"
import {
  obtenerEscalaAutonomicaIrpf2025,
  TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  type EscalaAutonomicaIrpf2025,
} from "../../normativa/datos/irpf-autonomico-2025"
import { obtenerEscalaAutonomicaIrpf2023 } from "../../normativa/datos/irpf-autonomico-2023"
import { obtenerEscalaAutonomicaIrpf2024 } from "../../normativa/datos/irpf-autonomico-2024"
import type { TramosIrpf } from "../../normativa/datos/irpf-estatal-2012-2026"
import {
  MINIMOS_ESTATALES_2025,
  obtenerMinimosAutonomicosIrpf2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
import {
  MINIMOS_ESTATALES_2024,
  obtenerMinimosAutonomicosIrpf2024,
} from "../../normativa/datos/minimos-autonomicos-2024"
import {
  MINIMOS_ESTATALES_2023,
  obtenerMinimosAutonomicosIrpf2023,
} from "../../normativa/datos/minimos-autonomicos-2023"
import type { ComunidadAutonoma } from "../caso-fiscal-anual"

export interface EntradaParametrosComunidadAutonoma {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}

export interface ParametrosComunidadAutonoma {
  readonly _tag: "ParametrosComunidadAutonoma"
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly anio: AnioFiscal
  readonly minimoAutonomicoIgualEstatal: boolean
  readonly escalaAutonomicaIgualEstatal: boolean
  readonly escalaAutonomica: EscalaAutonomicaIrpf2025
  readonly minimosAutonomicos: MinimosPersonalesFamiliaresIrpf
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

const resolverParametrosComunidadAutonoma2024 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2024(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2024,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2024,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2024(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2023 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: Pick<
  EntradaParametrosComunidadAutonoma,
  "comunidadAutonoma" | "fechaFallecimiento"
>): ParametrosComunidadAutonoma => {
  const minimosAutonomicos = obtenerMinimosAutonomicosIrpf2023({
    comunidadAutonoma,
    fechaFallecimiento,
  })

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2023,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2023,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2023({
      comunidadAutonoma,
      fechaFallecimiento,
    }),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2025 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2025(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2025,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2025,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas:
      deduccionesImplementadasPorComunidad(comunidadAutonoma),
  }
}

export const obtenerParametrosComunidadAutonoma = ({
  anio,
  comunidadAutonoma,
  fechaFallecimiento,
}: EntradaParametrosComunidadAutonoma): ResultadoParametrosComunidadAutonoma =>
  Match.value(anio).pipe(
    Match.when(2023, () =>
      resolverParametrosComunidadAutonoma2023({
        comunidadAutonoma,
        fechaFallecimiento,
      })
    ),
    Match.when(2024, () =>
      resolverParametrosComunidadAutonoma2024(comunidadAutonoma)
    ),
    Match.when(2025, () =>
      resolverParametrosComunidadAutonoma2025(comunidadAutonoma)
    ),
    Match.orElse(
      (anio) =>
        ({
          _tag: "ComunidadAutonomaNoSoportada",
          comunidadAutonoma,
          anio,
          motivo: `Escalas autonomicas del anio ${anio} aun no implementadas`,
          fuenteReconocida:
            "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/8-cumplimentacion-irpf/8_4-cuota-integra/8_4_3-gravamen-base-liquidable-general/8_4_3_2-cuota-integra-autonomica.html",
        }) satisfies ComunidadAutonomaNoSoportada
    )
  )

const deduccionesImplementadasPorComunidad = (
  comunidadAutonoma: ComunidadAutonoma
): ReadonlyArray<FichaDeduccionAutonomica> =>
  Match.value(comunidadAutonoma).pipe(
    Match.when("simulada-estatal", () => []),
    Match.orElse((comunidadAutonoma) =>
      Match.value(
        CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor[comunidadAutonoma]
      ).pipe(
        Match.when(Match.undefined, () => []),
        Match.orElse((catalogo) => {
          const codigosCatalogados = new Set(
            catalogo.deducciones.map(
              (deduccion: FichaDeduccionAutonomica) => deduccion.codigo
            )
          )

          return DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.filter(
            (deduccion) => codigosCatalogados.has(deduccion.codigo)
          )
        })
      )
    )
  )

export interface ServicioParametrosNormativosIrpf {
  readonly minimosEstatales2025: MinimosPersonalesFamiliaresIrpf
  readonly tramosIrpfEstatalGeneral2025: TramosIrpf
  readonly obtenerParametrosComunidadAutonoma: (
    entrada: EntradaParametrosComunidadAutonoma
  ) => Effect.Effect<ResultadoParametrosComunidadAutonoma>
  readonly obtenerDeduccionAutonomicaCatalogada: (
    codigo: string
  ) => Effect.Effect<Option.Option<DeduccionAutonomicaCatalogada>>
}

export class ParametrosNormativosIrpf extends Context.Service<
  ParametrosNormativosIrpf,
  ServicioParametrosNormativosIrpf
>()("@irobopf/dominio/normativa/ParametrosNormativosIrpf") {
  static readonly layer = Layer.succeed(ParametrosNormativosIrpf, {
    minimosEstatales2025: MINIMOS_ESTATALES_2025,
    tramosIrpfEstatalGeneral2025: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
    obtenerParametrosComunidadAutonoma: Effect.fn(
      "ParametrosNormativosIrpf.obtenerParametrosComunidadAutonoma"
    )(function* (entrada: EntradaParametrosComunidadAutonoma) {
      return obtenerParametrosComunidadAutonoma(entrada)
    }),
    obtenerDeduccionAutonomicaCatalogada: Effect.fn(
      "ParametrosNormativosIrpf.obtenerDeduccionAutonomicaCatalogada"
    )(function* (codigo: string) {
      return obtenerDeduccionAutonomicaCatalogada(codigo)
    }),
  })
}
