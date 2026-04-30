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
import type { TramosIrpf } from "../../normativa/datos/irpf-estatal-2012-2026"
import {
  MINIMOS_ESTATALES_2025,
  obtenerMinimosAutonomicosIrpf2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "../../normativa/datos/minimos-autonomicos-2025"
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

export const obtenerParametrosComunidadAutonoma = ({
  anio,
  comunidadAutonoma,
}: EntradaParametrosComunidadAutonoma): ResultadoParametrosComunidadAutonoma =>
  Match.value(anio).pipe(
    Match.when(2025, () => {
      const minimosAutonomicos =
        obtenerMinimosAutonomicosIrpf2025(comunidadAutonoma)

      return {
        _tag: "ParametrosComunidadAutonoma",
        comunidadAutonoma,
        anio,
        minimoAutonomicoIgualEstatal:
          minimosAutonomicos === MINIMOS_ESTATALES_2025,
        escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
        escalaAutonomica: obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma),
        minimosAutonomicos,
        deduccionesAutonomicasSoportadas:
          deduccionesImplementadasPorComunidad(comunidadAutonoma),
      } satisfies ParametrosComunidadAutonoma
    }),
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
