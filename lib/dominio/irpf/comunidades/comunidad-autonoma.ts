import type Decimal from "decimal.js"
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
import {
  obtenerEscalaAutonomicaIrpf2020,
  TRAMOS_IRPF_ESTATAL_GENERAL_2020,
} from "../../normativa/datos/irpf-autonomico-2020"
import {
  obtenerEscalaAutonomicaIrpf2019,
  TRAMOS_IRPF_ESTATAL_GENERAL_2019,
} from "../../normativa/datos/irpf-autonomico-2019"
import {
  obtenerEscalaAutonomicaIrpf2018,
  TRAMOS_IRPF_ESTATAL_GENERAL_2018,
} from "../../normativa/datos/irpf-autonomico-2018"
import {
  obtenerEscalaAutonomicaIrpf2017,
  TRAMOS_IRPF_ESTATAL_GENERAL_2017,
} from "../../normativa/datos/irpf-autonomico-2017"
import {
  obtenerEscalaAutonomicaIrpf2016,
  TRAMOS_IRPF_ESTATAL_GENERAL_2016,
} from "../../normativa/datos/irpf-autonomico-2016"
import {
  obtenerEscalaAutonomicaIrpf2015,
  TRAMOS_IRPF_ESTATAL_GENERAL_2015,
} from "../../normativa/datos/irpf-autonomico-2015"
import {
  obtenerEscalaAutonomicaIrpf2014,
  TRAMOS_IRPF_ESTATAL_GENERAL_2014,
} from "../../normativa/datos/irpf-autonomico-2014"
import {
  obtenerEscalaAutonomicaIrpf2013,
  TRAMOS_IRPF_ESTATAL_GENERAL_2013,
} from "../../normativa/datos/irpf-autonomico-2013"
import {
  obtenerEscalaAutonomicaIrpf2012,
  TRAMOS_IRPF_ESTATAL_GENERAL_2012,
} from "../../normativa/datos/irpf-autonomico-2012"
import { obtenerEscalaAutonomicaIrpf2021 } from "../../normativa/datos/irpf-autonomico-2021"
import { obtenerEscalaAutonomicaIrpf2022 } from "../../normativa/datos/irpf-autonomico-2022"
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
import {
  MINIMOS_ESTATALES_2022,
  obtenerMinimosAutonomicosIrpf2022,
} from "../../normativa/datos/minimos-autonomicos-2022"
import {
  MINIMOS_ESTATALES_2021,
  obtenerMinimosAutonomicosIrpf2021,
} from "../../normativa/datos/minimos-autonomicos-2021"
import {
  MINIMOS_ESTATALES_2020,
  obtenerMinimosAutonomicosIrpf2020,
} from "../../normativa/datos/minimos-autonomicos-2020"
import {
  MINIMOS_ESTATALES_2019,
  obtenerMinimosAutonomicosIrpf2019,
} from "../../normativa/datos/minimos-autonomicos-2019"
import {
  MINIMOS_ESTATALES_2018,
  obtenerMinimosAutonomicosIrpf2018,
} from "../../normativa/datos/minimos-autonomicos-2018"
import {
  MINIMOS_ESTATALES_2017,
  obtenerMinimosAutonomicosIrpf2017,
} from "../../normativa/datos/minimos-autonomicos-2017"
import {
  MINIMOS_ESTATALES_2016,
  obtenerMinimosAutonomicosIrpf2016,
} from "../../normativa/datos/minimos-autonomicos-2016"
import {
  MINIMOS_ESTATALES_2015,
  obtenerMinimosAutonomicosIrpf2015,
} from "../../normativa/datos/minimos-autonomicos-2015"
import {
  MINIMOS_ESTATALES_2014,
  obtenerMinimosAutonomicosIrpf2014,
} from "../../normativa/datos/minimos-autonomicos-2014"
import {
  MINIMOS_ESTATALES_2013,
  obtenerMinimosAutonomicosIrpf2013,
} from "../../normativa/datos/minimos-autonomicos-2013"
import {
  MINIMOS_ESTATALES_2012,
  obtenerMinimosAutonomicosIrpf2012,
} from "../../normativa/datos/minimos-autonomicos-2012"
import type { ComunidadAutonoma } from "../caso-fiscal-anual"

export interface EntradaParametrosComunidadAutonoma {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly baseLiquidableGeneral?: Decimal | undefined
  readonly fechaFallecimiento?: Date | undefined
}

export interface ParametrosComunidadAutonoma {
  readonly _tag: "ParametrosComunidadAutonoma"
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly anio: AnioFiscal
  readonly minimoAutonomicoIgualEstatal: boolean
  readonly escalaAutonomicaIgualEstatal: boolean
  readonly escalaEstatalGeneral: TramosIrpf
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

const resolverParametrosComunidadAutonoma2012 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2012(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2012,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2012,
    escalaAutonomicaIgualEstatal: false,
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2012,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2012(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2013 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2013(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2013,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2013,
    escalaAutonomicaIgualEstatal: false,
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2013,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2013(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2014 = ({
  baseLiquidableGeneral,
  comunidadAutonoma,
}: Pick<
  EntradaParametrosComunidadAutonoma,
  "baseLiquidableGeneral" | "comunidadAutonoma"
>): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2014(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2014,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2014,
    escalaAutonomicaIgualEstatal: false,
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2014,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2014({
      baseLiquidableGeneral,
      comunidadAutonoma,
    }),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2015 = ({
  baseLiquidableGeneral,
  comunidadAutonoma,
  fechaFallecimiento,
}: Pick<
  EntradaParametrosComunidadAutonoma,
  "baseLiquidableGeneral" | "comunidadAutonoma" | "fechaFallecimiento"
>): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2015(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2015,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2015,
    escalaAutonomicaIgualEstatal: false,
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2015,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2015({
      baseLiquidableGeneral,
      comunidadAutonoma,
      fechaFallecimiento,
    }),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2016 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2016(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2016,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2016,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2016,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2016(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2017 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2017(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2017,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2017,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2017,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2017(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2018 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2018(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2018,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2018,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2018,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2018(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2019 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2019(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2019,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2019,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2019,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2019(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2020 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2020(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2020,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2020,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2020,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2020(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2021 = (
  comunidadAutonoma: ComunidadAutonoma
): ParametrosComunidadAutonoma => {
  const minimosAutonomicos =
    obtenerMinimosAutonomicosIrpf2021(comunidadAutonoma)

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2021,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2021,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2021(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

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
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
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
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2023({
      comunidadAutonoma,
      fechaFallecimiento,
    }),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas: [],
  }
}

const resolverParametrosComunidadAutonoma2022 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: Pick<
  EntradaParametrosComunidadAutonoma,
  "comunidadAutonoma" | "fechaFallecimiento"
>): ParametrosComunidadAutonoma => {
  const minimosAutonomicos = obtenerMinimosAutonomicosIrpf2022({
    comunidadAutonoma,
    fechaFallecimiento,
  })

  return {
    _tag: "ParametrosComunidadAutonoma",
    comunidadAutonoma,
    anio: 2022,
    minimoAutonomicoIgualEstatal: minimosAutonomicos === MINIMOS_ESTATALES_2022,
    escalaAutonomicaIgualEstatal: comunidadAutonoma === "simulada-estatal",
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2022({
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
    escalaEstatalGeneral: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
    escalaAutonomica: obtenerEscalaAutonomicaIrpf2025(comunidadAutonoma),
    minimosAutonomicos,
    deduccionesAutonomicasSoportadas:
      deduccionesImplementadasPorComunidad(comunidadAutonoma),
  }
}

export const obtenerParametrosComunidadAutonoma = ({
  anio,
  baseLiquidableGeneral,
  comunidadAutonoma,
  fechaFallecimiento,
}: EntradaParametrosComunidadAutonoma): ResultadoParametrosComunidadAutonoma =>
  Match.value(anio).pipe(
    Match.when(2012, () =>
      resolverParametrosComunidadAutonoma2012(comunidadAutonoma)
    ),
    Match.when(2013, () =>
      resolverParametrosComunidadAutonoma2013(comunidadAutonoma)
    ),
    Match.when(2014, () =>
      resolverParametrosComunidadAutonoma2014({
        baseLiquidableGeneral,
        comunidadAutonoma,
      })
    ),
    Match.when(2015, () =>
      resolverParametrosComunidadAutonoma2015({
        baseLiquidableGeneral,
        comunidadAutonoma,
        fechaFallecimiento,
      })
    ),
    Match.when(2016, () =>
      resolverParametrosComunidadAutonoma2016(comunidadAutonoma)
    ),
    Match.when(2017, () =>
      resolverParametrosComunidadAutonoma2017(comunidadAutonoma)
    ),
    Match.when(2018, () =>
      resolverParametrosComunidadAutonoma2018(comunidadAutonoma)
    ),
    Match.when(2019, () =>
      resolverParametrosComunidadAutonoma2019(comunidadAutonoma)
    ),
    Match.when(2020, () =>
      resolverParametrosComunidadAutonoma2020(comunidadAutonoma)
    ),
    Match.when(2021, () =>
      resolverParametrosComunidadAutonoma2021(comunidadAutonoma)
    ),
    Match.when(2022, () =>
      resolverParametrosComunidadAutonoma2022({
        comunidadAutonoma,
        fechaFallecimiento,
      })
    ),
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
