import type Decimal from "decimal.js"
import { Array as EffectArray, Context, Effect, Layer, Match } from "effect"

import {
  IMPORTE_CERO,
  crearImporteMonetario,
} from "../dinero/importe-monetario"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import { BASE_MAXIMA_COTIZACION_LEGACY } from "../normativa/datos/seguridad-social-2012-2026"

type LadoCotizacion = "empresarial" | "trabajador"

interface TiposCotizacion {
  readonly empresarial: Decimal
  readonly trabajador: Decimal
}

type PoliticaSolidaridad =
  | {
      readonly _tag: "SinSolidaridad"
    }
  | {
      readonly _tag: "ConSolidaridad"
      readonly tipoPrimerExceso: Decimal
      readonly tipoSegundoExceso: Decimal
      readonly tipoExcesoRestante: Decimal
    }

interface ParametrosCotizacionLegacy {
  readonly baseMaxima: Decimal
  readonly tiposSeguridadSocial: Readonly<Record<string, TiposCotizacion>>
  readonly mei: TiposCotizacion
  readonly solidaridad: PoliticaSolidaridad
}

interface BaseCotizacion {
  readonly baseOrdinaria: Decimal
  readonly excesoBase: Decimal
}

export interface TotalesCotizacionesSociales {
  readonly cotizacionEmpresarial: Decimal
  readonly cotizacionTrabajador: Decimal
}

export interface DesgloseCotizacionesSociales {
  readonly baseOrdinaria: Decimal
  readonly excesoBase: Decimal
  readonly cotizacionEmpresarial: Decimal
  readonly cotizacionTrabajador: Decimal
  readonly cotizacionEmpresarialOrdinaria: Decimal
  readonly cotizacionTrabajadorOrdinaria: Decimal
  readonly meiEmpresarial: Decimal
  readonly meiTrabajador: Decimal
  readonly solidaridadEmpresarial: Decimal
  readonly solidaridadTrabajador: Decimal
}

export interface EntradaCotizacionesSocialesLegacy {
  readonly salarioBrutoAnual: Decimal
  readonly anio: AnioFiscal
}

// Glosario de MEI, base maxima y cuota de solidaridad:
// docs/glosario-fiscal-motor.md
export const TIPOS_SEGURIDAD_SOCIAL_LEGACY = {
  comunes: {
    empresarial: crearImporteMonetario("0.236"),
    trabajador: crearImporteMonetario("0.047"),
  },
  desempleo: {
    empresarial: crearImporteMonetario("0.055"),
    trabajador: crearImporteMonetario("0.0155"),
  },
  fogasa: {
    empresarial: crearImporteMonetario("0.002"),
    trabajador: IMPORTE_CERO,
  },
  fp: {
    empresarial: crearImporteMonetario("0.006"),
    trabajador: crearImporteMonetario("0.001"),
  },
  atep: {
    empresarial: crearImporteMonetario("0.015"),
    trabajador: IMPORTE_CERO,
  },
} satisfies ParametrosCotizacionLegacy["tiposSeguridadSocial"]

const SIN_SOLIDARIDAD = {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad

const minimo = (a: Decimal, b: Decimal) => {
  if (a.lessThan(b)) {
    return a
  }
  return b
}

const maximo = (a: Decimal, b: Decimal) => {
  if (a.greaterThan(b)) {
    return a
  }
  return b
}

const tipoCotizacionPorLado = (
  tipos: TiposCotizacion,
  lado: LadoCotizacion
) => {
  return Match.value(lado).pipe(
    Match.when("empresarial", () => tipos.empresarial),
    Match.when("trabajador", () => tipos.trabajador),
    Match.exhaustive
  )
}

export const sumarTipoCotizacionLegacy = (
  parametros: ParametrosCotizacionLegacy,
  lado: LadoCotizacion
) =>
  EffectArray.reduce(
    Object.values(parametros.tiposSeguridadSocial),
    IMPORTE_CERO,
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado))
  )

const obtenerTiposMei = (anio: AnioFiscal): TiposCotizacion =>
  Match.value(anio).pipe(
    Match.when(2023, () => ({
      empresarial: crearImporteMonetario("0.005"),
      trabajador: crearImporteMonetario("0.001"),
    })),
    Match.when(2024, () => ({
      empresarial: crearImporteMonetario("0.0058"),
      trabajador: crearImporteMonetario("0.0012"),
    })),
    Match.when(2025, () => ({
      empresarial: crearImporteMonetario("0.0067"),
      trabajador: crearImporteMonetario("0.0013"),
    })),
    Match.when(
      (anio) => anio >= 2026,
      () => ({
        empresarial: crearImporteMonetario("0.0075"),
        trabajador: crearImporteMonetario("0.0015"),
      })
    ),
    Match.orElse(() => ({
      empresarial: IMPORTE_CERO,
      trabajador: IMPORTE_CERO,
    }))
  )

const obtenerPoliticaSolidaridad = (anio: AnioFiscal): PoliticaSolidaridad =>
  Match.value(anio).pipe(
    Match.withReturnType<PoliticaSolidaridad>(),
    Match.when(2025, () => ({
      _tag: "ConSolidaridad",
      tipoPrimerExceso: crearImporteMonetario("0.0092"),
      tipoSegundoExceso: crearImporteMonetario("0.0100"),
      tipoExcesoRestante: crearImporteMonetario("0.0117"),
    })),
    Match.when(
      (anio) => anio >= 2026,
      () => ({
        _tag: "ConSolidaridad",
        tipoPrimerExceso: crearImporteMonetario("0.0115"),
        tipoSegundoExceso: crearImporteMonetario("0.0125"),
        tipoExcesoRestante: crearImporteMonetario("0.0146"),
      })
    ),
    Match.orElse(() => SIN_SOLIDARIDAD)
  )

export const obtenerParametrosCotizacionLegacy = (
  anio: AnioFiscal
): ParametrosCotizacionLegacy => ({
  baseMaxima: BASE_MAXIMA_COTIZACION_LEGACY[anio],
  tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL_LEGACY,
  mei: obtenerTiposMei(anio),
  solidaridad: obtenerPoliticaSolidaridad(anio),
})

const baseCotizacionPara = (
  bruto: Decimal,
  parametros: ParametrosCotizacionLegacy
): BaseCotizacion => ({
  baseOrdinaria: minimo(bruto, parametros.baseMaxima),
  excesoBase: maximo(IMPORTE_CERO, bruto.minus(parametros.baseMaxima)),
})

const calcularTotalSolidaridad = (
  baseCotizacion: BaseCotizacion,
  parametros: ParametrosCotizacionLegacy
) => {
  if (parametros.solidaridad._tag === "SinSolidaridad") {
    return IMPORTE_CERO
  }

  if (baseCotizacion.excesoBase.lte(0)) {
    return IMPORTE_CERO
  }

  const limitePrimerTramo = parametros.baseMaxima.mul("0.10")
  const limiteSegundoTramo = parametros.baseMaxima.mul("0.50")
  const excesoPrimerTramo = minimo(baseCotizacion.excesoBase, limitePrimerTramo)
  const excesoSegundoTramo = minimo(
    maximo(IMPORTE_CERO, baseCotizacion.excesoBase.minus(limitePrimerTramo)),
    limiteSegundoTramo.minus(limitePrimerTramo)
  )
  const excesoRestante = maximo(
    IMPORTE_CERO,
    baseCotizacion.excesoBase.minus(limiteSegundoTramo)
  )

  return excesoPrimerTramo
    .mul(parametros.solidaridad.tipoPrimerExceso)
    .plus(excesoSegundoTramo.mul(parametros.solidaridad.tipoSegundoExceso))
    .plus(excesoRestante.mul(parametros.solidaridad.tipoExcesoRestante))
}

const repartirCotizacionSolidaridad = (
  totalSolidaridad: Decimal
): TotalesCotizacionesSociales => ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
})

const sumarCotizacionesSociales = (
  izquierda: TotalesCotizacionesSociales,
  derecha: TotalesCotizacionesSociales
): TotalesCotizacionesSociales => ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ),
})

export const calcularCotizacionesSocialesLegacy = ({
  salarioBrutoAnual,
  anio,
}: EntradaCotizacionesSocialesLegacy): TotalesCotizacionesSociales => {
  const desglose = calcularDesgloseCotizacionesSocialesLegacy({
    salarioBrutoAnual,
    anio,
  })

  return {
    cotizacionEmpresarial: desglose.cotizacionEmpresarial,
    cotizacionTrabajador: desglose.cotizacionTrabajador,
  }
}

export const calcularDesgloseCotizacionesSocialesLegacy = ({
  salarioBrutoAnual,
  anio,
}: EntradaCotizacionesSocialesLegacy): DesgloseCotizacionesSociales => {
  const parametros = obtenerParametrosCotizacionLegacy(anio)
  const baseCotizacion = baseCotizacionPara(salarioBrutoAnual, parametros)
  const cotizacionesOrdinarias = {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "empresarial")
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacionLegacy(parametros, "trabajador")
    ),
  }
  const cotizacionesMei = {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.empresarial
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mul(
      parametros.mei.trabajador
    ),
  }
  const cotizacionesSolidaridad = repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  )
  const cotizacionesTotales = sumarCotizacionesSociales(
    sumarCotizacionesSociales(cotizacionesOrdinarias, cotizacionesMei),
    cotizacionesSolidaridad
  )

  return {
    baseOrdinaria: baseCotizacion.baseOrdinaria,
    excesoBase: baseCotizacion.excesoBase,
    cotizacionEmpresarial: cotizacionesTotales.cotizacionEmpresarial,
    cotizacionTrabajador: cotizacionesTotales.cotizacionTrabajador,
    cotizacionEmpresarialOrdinaria:
      cotizacionesOrdinarias.cotizacionEmpresarial,
    cotizacionTrabajadorOrdinaria: cotizacionesOrdinarias.cotizacionTrabajador,
    meiEmpresarial: cotizacionesMei.cotizacionEmpresarial,
    meiTrabajador: cotizacionesMei.cotizacionTrabajador,
    solidaridadEmpresarial: cotizacionesSolidaridad.cotizacionEmpresarial,
    solidaridadTrabajador: cotizacionesSolidaridad.cotizacionTrabajador,
  }
}

export interface ServicioCotizacionesSociales {
  readonly calcularLegacy: (
    entrada: EntradaCotizacionesSocialesLegacy
  ) => Effect.Effect<TotalesCotizacionesSociales>
  readonly desglosarLegacy: (
    entrada: EntradaCotizacionesSocialesLegacy
  ) => Effect.Effect<DesgloseCotizacionesSociales>
}

export class CotizacionesSociales extends Context.Service<
  CotizacionesSociales,
  ServicioCotizacionesSociales
>()("@irobopf/dominio/laboral/CotizacionesSociales") {
  static readonly layer = Layer.succeed(CotizacionesSociales, {
    calcularLegacy: Effect.fn("CotizacionesSociales.calcularLegacy")(function* (
      entrada: EntradaCotizacionesSocialesLegacy
    ) {
      return calcularCotizacionesSocialesLegacy(entrada)
    }),
    desglosarLegacy: Effect.fn("CotizacionesSociales.desglosarLegacy")(
      function* (entrada: EntradaCotizacionesSocialesLegacy) {
        return calcularDesgloseCotizacionesSocialesLegacy(entrada)
      }
    ),
  })
}
