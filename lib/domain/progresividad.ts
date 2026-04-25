import Decimal from "decimal.js"
import { Effect } from "effect"

export type AnioFiscal =
  | 2012
  | 2013
  | 2014
  | 2015
  | 2016
  | 2017
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026

export interface EntradaComparacionAjustadaPorIpc {
  readonly salarioBrutoAnualReferenciaCentimos: number
  readonly anioComparado: AnioFiscal
  readonly anioReferencia: AnioFiscal
}

export interface DesgloseLiquidado {
  readonly salarioBrutoAnualCentimos: number
  readonly cotizacionEmpresarialCentimos: number
  readonly costeLaboralCentimos: number
  readonly cotizacionTrabajadorCentimos: number
  readonly irpfFinalCentimos: number
  readonly salarioNetoAnualCentimos: number
}

export interface ComparacionAjustadaPorIpc {
  readonly anioReferencia: AnioFiscal
  readonly anioComparado: AnioFiscal
  readonly factorIpc: string
  readonly referencia: DesgloseLiquidado
  readonly comparado: {
    readonly salarioBrutoNominalAnualCentimos: number
    readonly ajustado: DesgloseLiquidado
  }
  readonly diferenciaPoderAdquisitivoNetoAnualCentimos: number
  readonly diferenciaPoderAdquisitivoNetoMensualCentimos: number
}

export interface EntradaAuditoriaRangoSalarial {
  readonly salarioBrutoAnualMinimoCentimos: number
  readonly salarioBrutoAnualMaximoCentimos: number
  readonly pasoCentimos: number
  readonly anioComparado: AnioFiscal
  readonly anioReferencia: AnioFiscal
}

export interface PuntoAuditoriaRangoSalarial {
  readonly salarioBrutoAnualCentimos: number
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly tipoCargaActual: number
  readonly tipoCargaComparada: number
  readonly tipoCunaLaboralActual: number
  readonly tipoCunaLaboralComparada: number
}

export interface HallazgoAuditoria {
  readonly titulo: string
  readonly descripcion: string
  readonly salarioBrutoAnualCentimos: number
  readonly severidad: "perdida" | "ganancia" | "info"
}

export interface AuditoriaRangoSalarial {
  readonly anioComparado: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly salarioBrutoAnualMinimoCentimos: number
  readonly salarioBrutoAnualMaximoCentimos: number
  readonly pasoCentimos: number
  readonly puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>
  readonly hallazgos: ReadonlyArray<HallazgoAuditoria>
}

export const configuracionControlSalario = {
  valorPorDefectoCentimos: 1_800_000,
  preciso: {
    minimoCentimos: 0,
    maximoCentimos: 99_999_999,
    decimales: 2,
    maximoDigitosEnteros: 6,
  },
  rapido: {
    minimoCentimos: 1_000_000,
    maximoCentimos: 10_000_000,
    pasoCentimos: 100_000,
  },
} as const

export const configuracionRangoAuditoria = {
  minimoPorDefectoCentimos: 1_000_000,
  maximoPorDefectoCentimos: 6_000_000,
  minimoCentimos: 1_000_000,
  maximoCentimos: 10_000_000,
  pasoCentimos: 500_000,
} as const

const decimal = (valor: string | number) => new Decimal(valor)
const CERO = decimal(0)
const UNO = decimal(1)

type LadoCotizacion = "empresarial" | "trabajador"
type TramoIrpf = readonly [limite: Decimal, tipo: Decimal]
type TramosIrpf = ReadonlyArray<TramoIrpf>
type PoliticaMonetaria = (valor: Decimal) => Decimal

interface TiposCotizacion {
  readonly empresarial: Decimal
  readonly trabajador: Decimal
}

interface Parametros {
  readonly baseMaxima: Decimal
  readonly tiposSeguridadSocial: Readonly<Record<string, TiposCotizacion>>
  readonly mei: TiposCotizacion
  readonly solidaridad: PoliticaSolidaridad
  readonly minimoPersonalIrpf: Decimal
  readonly minimoExentoRetencion: Decimal
  readonly gastosFijos: Decimal
  readonly tramosIrpf: TramosIrpf
  readonly reduccionTrabajo: PoliticaMonetaria
  readonly deduccionSmi: PoliticaMonetaria
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

interface BaseCotizacion {
  readonly baseOrdinaria: Decimal
  readonly excesoBase: Decimal
}

interface CotizacionesSociales {
  readonly cotizacionEmpresarial: Decimal
  readonly cotizacionTrabajador: Decimal
}

interface CalculoIrpf {
  readonly rendimientoPrevioNeto: Decimal
  readonly reduccionTrabajo: Decimal
  readonly rendimientoNeto: Decimal
  readonly baseImponible: Decimal
  readonly cuotaIntegra: Decimal
  readonly cuotaMinimoPersonal: Decimal
  readonly cuotaTeorica: Decimal
  readonly deduccionSmi: Decimal
  readonly cuotaTrasSmi: Decimal
  readonly limiteRetencion: Decimal
  readonly irpfFinal: Decimal
}

interface DesgloseEuros {
  readonly salarioBrutoAnual: Decimal
  readonly cotizacionEmpresarial: Decimal
  readonly costeLaboral: Decimal
  readonly cotizacionTrabajador: Decimal
  readonly irpfFinal: Decimal
  readonly salarioNetoAnual: Decimal
}

interface EstadoCuota {
  readonly limiteAnterior: Decimal
  readonly cuota: Decimal
}

const IPC_ANUAL_DICIEMBRE: Readonly<Record<number, Decimal>> = {
  2013: decimal("0.003"),
  2014: decimal("-0.010"),
  2015: decimal("0.000"),
  2016: decimal("0.016"),
  2017: decimal("0.011"),
  2018: decimal("0.012"),
  2019: decimal("0.008"),
  2020: decimal("-0.005"),
  2021: decimal("0.065"),
  2022: decimal("0.057"),
  2023: decimal("0.031"),
  2024: decimal("0.028"),
  2025: decimal("0.029"),
  2026: decimal("0.030"),
}

const BASE_MAXIMA: Readonly<Record<AnioFiscal, Decimal>> = {
  2012: decimal("39150.0"),
  2013: decimal("41108.4"),
  2014: decimal("43164.0"),
  2015: decimal("43272.0"),
  2016: decimal("43704.0"),
  2017: decimal("45014.4"),
  2018: decimal("45014.4"),
  2019: decimal("48841.2"),
  2020: decimal("48841.2"),
  2021: decimal("48841.2"),
  2022: decimal("49672.8"),
  2023: decimal("53946.0"),
  2024: decimal("56646.0"),
  2025: decimal("58914.0"),
  2026: decimal("61214.4"),
}

const MINIMO_EXENTO_RETENCION: Readonly<Record<AnioFiscal, Decimal>> = {
  2012: decimal(11162),
  2013: decimal(11162),
  2014: decimal(11162),
  2015: decimal(12000),
  2016: decimal(12000),
  2017: decimal(12000),
  2018: decimal(12643),
  2019: decimal(14000),
  2020: decimal(14000),
  2021: decimal(14000),
  2022: decimal(14000),
  2023: decimal(15000),
  2024: decimal(15876),
  2025: decimal(15876),
  2026: decimal(15876),
}

const TIPOS_SEGURIDAD_SOCIAL = {
  comunes: {
    empresarial: decimal("0.236"),
    trabajador: decimal("0.047"),
  },
  desempleo: {
    empresarial: decimal("0.055"),
    trabajador: decimal("0.0155"),
  },
  fogasa: {
    empresarial: decimal("0.002"),
    trabajador: CERO,
  },
  fp: {
    empresarial: decimal("0.006"),
    trabajador: decimal("0.001"),
  },
  atep: {
    empresarial: decimal("0.015"),
    trabajador: CERO,
  },
} satisfies Parametros["tiposSeguridadSocial"]

const TRAMOS_IRPF_HASTA_2014: TramosIrpf = [
  [decimal(17707), decimal("0.2475")],
  [decimal(33007), decimal("0.30")],
  [decimal(53407), decimal("0.40")],
  [decimal(120000), decimal("0.47")],
  [decimal(175000), decimal("0.49")],
  [decimal(300000), decimal("0.51")],
  [decimal(Infinity), decimal("0.52")],
]

const TRAMOS_IRPF_2015: TramosIrpf = [
  [decimal(12450), decimal("0.195")],
  [decimal(20200), decimal("0.245")],
  [decimal(34000), decimal("0.305")],
  [decimal(60000), decimal("0.38")],
  [decimal(Infinity), decimal("0.46")],
]

const TRAMOS_IRPF_2016_A_2020: TramosIrpf = [
  [decimal(12450), decimal("0.19")],
  [decimal(20200), decimal("0.24")],
  [decimal(35200), decimal("0.30")],
  [decimal(60000), decimal("0.37")],
  [decimal(Infinity), decimal("0.45")],
]

const TRAMOS_IRPF_DESDE_2021: TramosIrpf = [
  [decimal(12450), decimal("0.19")],
  [decimal(20200), decimal("0.24")],
  [decimal(35200), decimal("0.30")],
  [decimal(60000), decimal("0.37")],
  [decimal(300000), decimal("0.45")],
  [decimal(Infinity), decimal("0.47")],
]

const SIN_SOLIDARIDAD = {
  _tag: "SinSolidaridad",
} as const satisfies PoliticaSolidaridad

const centimosAEuros = (centimos: number) => decimal(centimos).div(100)

const eurosACentimos = (euros: Decimal) =>
  euros.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_EVEN).toNumber()

const redondearDinero = (euros: Decimal) =>
  euros.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)

const min = (a: Decimal, b: Decimal) => {
  if (a.lessThan(b)) {
    return a
  }
  return b
}

const max = (a: Decimal, b: Decimal) => {
  if (a.greaterThan(b)) {
    return a
  }
  return b
}

const ipcAnualConocido = (anio: number) => {
  const tipo = IPC_ANUAL_DICIEMBRE[anio]
  if (tipo === undefined) {
    return CERO
  }
  return tipo
}

const rangoNumerico = (inicio: number, fin: number): ReadonlyArray<number> => {
  if (inicio > fin) {
    return []
  }

  return globalThis.Array.from(
    { length: fin - inicio + 1 },
    (_, index) => inicio + index
  )
}

const factorIpc = (anioBase: AnioFiscal, anioReferencia: AnioFiscal) => {
  const anios = rangoNumerico(anioBase + 1, anioReferencia)
  return anios.reduce(
    (factor, anio) => factor.mul(UNO.plus(ipcAnualConocido(anio))),
    UNO
  )
}

const reduccionTrabajoHasta2014 = (rendimientoPrevioNeto: Decimal) => {
  if (rendimientoPrevioNeto.lte(9180)) {
    return decimal(4080)
  }

  if (rendimientoPrevioNeto.lte(13260)) {
    return decimal(4080).minus(
      decimal("0.35").mul(rendimientoPrevioNeto.minus(9180))
    )
  }

  return decimal(2652)
}

const reduccionTrabajo2015A2017 = (rendimientoPrevioNeto: Decimal) => {
  if (rendimientoPrevioNeto.lte(11250)) {
    return decimal(3700)
  }

  if (rendimientoPrevioNeto.lte(14450)) {
    return decimal(3700).minus(
      decimal("1.15625").mul(rendimientoPrevioNeto.minus(11250))
    )
  }

  return CERO
}

const reduccionTrabajo2019A2022 = (rendimientoPrevioNeto: Decimal) => {
  if (rendimientoPrevioNeto.lte(13115)) {
    return decimal(5565)
  }

  if (rendimientoPrevioNeto.lte(16825)) {
    return max(
      CERO,
      decimal(5565).minus(
        decimal("1.5").mul(rendimientoPrevioNeto.minus(13115))
      )
    )
  }

  return CERO
}

const reduccionTrabajo2018 = (rendimientoPrevioNeto: Decimal) => {
  const reduccionPreTransitoria = reduccionTrabajo2015A2017(
    rendimientoPrevioNeto
  )
  const reduccionPostTransitoria = reduccionTrabajo2019A2022(
    rendimientoPrevioNeto
  )
  return reduccionPreTransitoria.div(2).plus(reduccionPostTransitoria.div(2))
}

const reduccionTrabajo2023 = (rendimientoPrevioNeto: Decimal) => {
  if (rendimientoPrevioNeto.lte("14047.50")) {
    return decimal(6498)
  }

  if (rendimientoPrevioNeto.lte("19747.50")) {
    return max(
      CERO,
      decimal(6498).minus(
        decimal("1.14").mul(rendimientoPrevioNeto.minus("14047.50"))
      )
    )
  }

  return CERO
}

const reduccionTrabajoDesde2024 = (rendimientoPrevioNeto: Decimal) => {
  if (rendimientoPrevioNeto.lte(14852)) {
    return decimal(7302)
  }

  if (rendimientoPrevioNeto.lte("17673.52")) {
    return decimal(7302).minus(
      decimal("1.75").mul(rendimientoPrevioNeto.minus(14852))
    )
  }

  if (rendimientoPrevioNeto.lte("19747.50")) {
    return decimal("2364.34").minus(
      decimal("1.14").mul(rendimientoPrevioNeto.minus("17673.52"))
    )
  }

  return CERO
}

const obtenerReduccionTrabajo = (anio: AnioFiscal): PoliticaMonetaria => {
  if (anio <= 2014) {
    return reduccionTrabajoHasta2014
  }

  if (anio <= 2017) {
    return reduccionTrabajo2015A2017
  }

  if (anio === 2018) {
    return reduccionTrabajo2018
  }

  if (anio <= 2022) {
    return reduccionTrabajo2019A2022
  }

  if (anio === 2023) {
    return reduccionTrabajo2023
  }

  return reduccionTrabajoDesde2024
}

const obtenerTiposMei = (anio: AnioFiscal): TiposCotizacion => {
  if (anio === 2023) {
    return {
      empresarial: decimal("0.005"),
      trabajador: decimal("0.001"),
    }
  }

  if (anio === 2024) {
    return {
      empresarial: decimal("0.0058"),
      trabajador: decimal("0.0012"),
    }
  }

  if (anio === 2025) {
    return {
      empresarial: decimal("0.0067"),
      trabajador: decimal("0.0013"),
    }
  }

  if (anio >= 2026) {
    return {
      empresarial: decimal("0.0075"),
      trabajador: decimal("0.0015"),
    }
  }

  return {
    empresarial: CERO,
    trabajador: CERO,
  }
}

const obtenerPoliticaSolidaridad = (anio: AnioFiscal): PoliticaSolidaridad => {
  if (anio === 2025) {
    return {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: decimal("0.0092"),
      tipoSegundoExceso: decimal("0.0100"),
      tipoExcesoRestante: decimal("0.0117"),
    }
  }

  if (anio >= 2026) {
    return {
      _tag: "ConSolidaridad",
      tipoPrimerExceso: decimal("0.0115"),
      tipoSegundoExceso: decimal("0.0125"),
      tipoExcesoRestante: decimal("0.0146"),
    }
  }

  return SIN_SOLIDARIDAD
}

const obtenerTramosIrpf = (anio: AnioFiscal): TramosIrpf => {
  if (anio <= 2014) {
    return TRAMOS_IRPF_HASTA_2014
  }

  if (anio === 2015) {
    return TRAMOS_IRPF_2015
  }

  if (anio <= 2020) {
    return TRAMOS_IRPF_2016_A_2020
  }

  return TRAMOS_IRPF_DESDE_2021
}

const obtenerMinimoPersonalIrpf = (anio: AnioFiscal) => {
  if (anio <= 2014) {
    return decimal(5151)
  }
  return decimal(5550)
}

const obtenerGastosFijos = (anio: AnioFiscal) => {
  if (anio <= 2014) {
    return CERO
  }
  return decimal(2000)
}

const deduccionSmi2026 = (bruto: Decimal) => {
  if (bruto.lte(17094)) {
    return decimal("590.89")
  }

  return max(
    CERO,
    decimal("590.89").minus(decimal("0.20").mul(bruto.minus(17094)))
  )
}

const deduccionSmi2025 = (bruto: Decimal) => {
  if (bruto.lte(16576)) {
    return decimal(340)
  }

  if (bruto.lte(18276)) {
    return max(
      CERO,
      decimal(340).minus(decimal("0.20").mul(bruto.minus(16576)))
    )
  }

  return CERO
}

const sinDeduccionSmi = () => CERO

const obtenerDeduccionSmi = (anio: AnioFiscal): PoliticaMonetaria => {
  if (anio === 2026) {
    return deduccionSmi2026
  }

  if (anio === 2025) {
    return deduccionSmi2025
  }

  return sinDeduccionSmi
}

const obtenerParametros = (anio: AnioFiscal): Parametros => {
  return {
    baseMaxima: BASE_MAXIMA[anio],
    tiposSeguridadSocial: TIPOS_SEGURIDAD_SOCIAL,
    mei: obtenerTiposMei(anio),
    solidaridad: obtenerPoliticaSolidaridad(anio),
    minimoPersonalIrpf: obtenerMinimoPersonalIrpf(anio),
    minimoExentoRetencion: MINIMO_EXENTO_RETENCION[anio],
    gastosFijos: obtenerGastosFijos(anio),
    tramosIrpf: obtenerTramosIrpf(anio),
    reduccionTrabajo: obtenerReduccionTrabajo(anio),
    deduccionSmi: obtenerDeduccionSmi(anio),
  }
}

const sumarTipoCotizacion = (parametros: Parametros, lado: LadoCotizacion) =>
  Object.values(parametros.tiposSeguridadSocial).reduce(
    (suma, tipos) => suma.plus(tipoCotizacionPorLado(tipos, lado)),
    CERO
  )

const tipoCotizacionPorLado = (
  tipos: TiposCotizacion,
  lado: LadoCotizacion
) => {
  if (lado === "empresarial") {
    return tipos.empresarial
  }

  return tipos.trabajador
}

const baseCotizacionPara = (
  bruto: Decimal,
  parametros: Parametros
): BaseCotizacion => ({
  baseOrdinaria: min(bruto, parametros.baseMaxima),
  excesoBase: max(CERO, bruto.minus(parametros.baseMaxima)),
})

const calcularTotalSolidaridad = (
  baseCotizacion: BaseCotizacion,
  parametros: Parametros
) => {
  if (parametros.solidaridad._tag === "SinSolidaridad") {
    return CERO
  }

  if (baseCotizacion.excesoBase.lte(0)) {
    return CERO
  }

  const limitePrimerTramo = parametros.baseMaxima.mul("0.10")
  const limiteSegundoTramo = parametros.baseMaxima.mul("0.50")
  const excesoPrimerTramo = min(baseCotizacion.excesoBase, limitePrimerTramo)
  const excesoSegundoTramo = min(
    max(CERO, baseCotizacion.excesoBase.minus(limitePrimerTramo)),
    limiteSegundoTramo.minus(limitePrimerTramo)
  )
  const excesoRestante = max(
    CERO,
    baseCotizacion.excesoBase.minus(limiteSegundoTramo)
  )

  return excesoPrimerTramo
    .mul(parametros.solidaridad.tipoPrimerExceso)
    .plus(excesoSegundoTramo.mul(parametros.solidaridad.tipoSegundoExceso))
    .plus(excesoRestante.mul(parametros.solidaridad.tipoExcesoRestante))
}

const repartirCotizacionSolidaridad = (
  totalSolidaridad: Decimal
): CotizacionesSociales => ({
  cotizacionEmpresarial: totalSolidaridad.mul(5).div(6),
  cotizacionTrabajador: totalSolidaridad.div(6),
})

const sumarCotizacionesSociales = (
  izquierda: CotizacionesSociales,
  derecha: CotizacionesSociales
): CotizacionesSociales => ({
  cotizacionEmpresarial: izquierda.cotizacionEmpresarial.plus(
    derecha.cotizacionEmpresarial
  ),
  cotizacionTrabajador: izquierda.cotizacionTrabajador.plus(
    derecha.cotizacionTrabajador
  ),
})

// Las cotizaciones separan la base ordinaria topada y, desde 2025, la cuota de
// solidaridad sobre el salario que supera la base maxima. El reparto replica el
// oraculo Python: 5/6 para empresa y 1/6 para trabajador.
const calcularCotizacionesSociales = (
  bruto: Decimal,
  parametros: Parametros
): CotizacionesSociales => {
  const baseCotizacion = baseCotizacionPara(bruto, parametros)
  const cotizacionesGenerales = {
    cotizacionEmpresarial: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacion(parametros, "empresarial").plus(
        parametros.mei.empresarial
      )
    ),
    cotizacionTrabajador: baseCotizacion.baseOrdinaria.mul(
      sumarTipoCotizacion(parametros, "trabajador").plus(
        parametros.mei.trabajador
      )
    ),
  }
  const cotizacionesSolidaridad = repartirCotizacionSolidaridad(
    calcularTotalSolidaridad(baseCotizacion, parametros)
  )

  return sumarCotizacionesSociales(
    cotizacionesGenerales,
    cotizacionesSolidaridad
  )
}

const importeBaseEnTramo = (
  baseImponible: Decimal,
  limiteAnterior: Decimal,
  limite: Decimal
) => {
  const baseImponibleRestante = max(CERO, baseImponible.minus(limiteAnterior))
  const anchoTramo = limite.minus(limiteAnterior)
  return min(baseImponibleRestante, anchoTramo)
}

// Plegar todos los tramos evita control de flujo mutable con "break" y conserva
// la formula progresiva: los tramos agotados aportan cero cuando la base ya esta
// completamente asignada.
const sumarCuotaTramo =
  (baseImponible: Decimal) => (estado: EstadoCuota, tramo: TramoIrpf) => {
    const [limite, tipo] = tramo
    const importeBase = importeBaseEnTramo(
      baseImponible,
      estado.limiteAnterior,
      limite
    )

    return {
      limiteAnterior: limite,
      cuota: estado.cuota.plus(importeBase.mul(tipo)),
    } satisfies EstadoCuota
  }

const calcularCuotaIrpf = (baseImponible: Decimal, tramos: TramosIrpf) => {
  if (baseImponible.lte(0)) {
    return CERO
  }

  return tramos.reduce(sumarCuotaTramo(baseImponible), {
    limiteAnterior: CERO,
    cuota: CERO,
  }).cuota
}

const primerTipoIrpf = (tramos: TramosIrpf) => {
  const primerTramo = tramos[0]
  if (primerTramo === undefined) {
    return CERO
  }

  return primerTramo[1]
}

// La cadena del IRPF queda desplegada paso a paso porque cada importe es un
// concepto fiscal auditable, no solo un detalle aritmetico intermedio.
const calcularIrpf = (
  bruto: Decimal,
  parametros: Parametros,
  cotizaciones: CotizacionesSociales
): CalculoIrpf => {
  const rendimientoPrevioNeto = bruto.minus(cotizaciones.cotizacionTrabajador)
  const reduccionTrabajo = parametros.reduccionTrabajo(rendimientoPrevioNeto)
  const rendimientoNeto = max(
    CERO,
    rendimientoPrevioNeto.minus(parametros.gastosFijos)
  )
  const baseImponible = max(CERO, rendimientoNeto.minus(reduccionTrabajo))
  const cuotaIntegra = calcularCuotaIrpf(baseImponible, parametros.tramosIrpf)
  const cuotaMinimoPersonal = parametros.minimoPersonalIrpf.mul(
    primerTipoIrpf(parametros.tramosIrpf)
  )
  const cuotaTeorica = max(CERO, cuotaIntegra.minus(cuotaMinimoPersonal))
  const deduccionSmi = parametros.deduccionSmi(bruto)
  const cuotaTrasSmi = max(CERO, cuotaTeorica.minus(deduccionSmi))
  const limiteRetencion = max(
    CERO,
    bruto.minus(parametros.minimoExentoRetencion).mul("0.43")
  )
  const irpfFinal = min(cuotaTrasSmi, limiteRetencion)

  return {
    rendimientoPrevioNeto,
    reduccionTrabajo,
    rendimientoNeto,
    baseImponible,
    cuotaIntegra,
    cuotaMinimoPersonal,
    cuotaTeorica,
    deduccionSmi,
    cuotaTrasSmi,
    limiteRetencion,
    irpfFinal,
  }
}

// El motor usa euros Decimal internamente. Los centimos solo entran y salen en
// fronteras explicitas de API.
const calcularDesgloseEuros = (
  bruto: Decimal,
  anio: AnioFiscal
): DesgloseEuros => {
  const parametros = obtenerParametros(anio)
  const cotizaciones = calcularCotizacionesSociales(bruto, parametros)
  const irpf = calcularIrpf(bruto, parametros, cotizaciones)
  const salarioNetoAnual = bruto
    .minus(cotizaciones.cotizacionTrabajador)
    .minus(irpf.irpfFinal)

  return {
    salarioBrutoAnual: bruto,
    cotizacionEmpresarial: cotizaciones.cotizacionEmpresarial,
    costeLaboral: bruto.plus(cotizaciones.cotizacionEmpresarial),
    cotizacionTrabajador: cotizaciones.cotizacionTrabajador,
    irpfFinal: irpf.irpfFinal,
    salarioNetoAnual,
  }
}

const centimosLiquidados = (euros: Decimal) =>
  eurosACentimos(redondearDinero(euros))

const liquidar = (desglose: DesgloseEuros): DesgloseLiquidado => ({
  salarioBrutoAnualCentimos: centimosLiquidados(desglose.salarioBrutoAnual),
  cotizacionEmpresarialCentimos: centimosLiquidados(
    desglose.cotizacionEmpresarial
  ),
  costeLaboralCentimos: centimosLiquidados(desglose.costeLaboral),
  cotizacionTrabajadorCentimos: centimosLiquidados(
    desglose.cotizacionTrabajador
  ),
  irpfFinalCentimos: centimosLiquidados(desglose.irpfFinal),
  salarioNetoAnualCentimos: centimosLiquidados(desglose.salarioNetoAnual),
})

const ajustarDesglose = (
  desglose: DesgloseEuros,
  factor: Decimal
): DesgloseLiquidado => liquidar(escalarDesglose(desglose, factor))

const escalarDesglose = (
  desglose: DesgloseEuros,
  factor: Decimal
): DesgloseEuros => ({
  salarioBrutoAnual: desglose.salarioBrutoAnual.mul(factor),
  cotizacionEmpresarial: desglose.cotizacionEmpresarial.mul(factor),
  costeLaboral: desglose.costeLaboral.mul(factor),
  cotizacionTrabajador: desglose.cotizacionTrabajador.mul(factor),
  irpfFinal: desglose.irpfFinal.mul(factor),
  salarioNetoAnual: desglose.salarioNetoAnual.mul(factor),
})

const diferenciaAnualCentimos = (
  comparadoSinLiquidar: DesgloseEuros,
  referenciaSinLiquidar: DesgloseEuros,
  factor: Decimal
) =>
  centimosLiquidados(
    comparadoSinLiquidar.salarioNetoAnual
      .mul(factor)
      .minus(referenciaSinLiquidar.salarioNetoAnual)
  )

const diferenciaMensualCentimos = (diferenciaAnual: number) =>
  Math.round(diferenciaAnual / 12)

const construirComparacionAjustadaPorIpc = (
  entrada: EntradaComparacionAjustadaPorIpc
): ComparacionAjustadaPorIpc => {
  const salarioBrutoReferencia = centimosAEuros(
    entrada.salarioBrutoAnualReferenciaCentimos
  )
  const factor = factorIpc(entrada.anioComparado, entrada.anioReferencia)
  const salarioBrutoNominalComparado = salarioBrutoReferencia.div(factor)
  const referenciaSinLiquidar = calcularDesgloseEuros(
    salarioBrutoReferencia,
    entrada.anioReferencia
  )
  const comparadoSinLiquidar = calcularDesgloseEuros(
    salarioBrutoNominalComparado,
    entrada.anioComparado
  )
  const diferenciaAnual = diferenciaAnualCentimos(
    comparadoSinLiquidar,
    referenciaSinLiquidar,
    factor
  )

  return {
    anioReferencia: entrada.anioReferencia,
    anioComparado: entrada.anioComparado,
    factorIpc: factor.toFixed(12),
    referencia: liquidar(referenciaSinLiquidar),
    comparado: {
      salarioBrutoNominalAnualCentimos: centimosLiquidados(
        salarioBrutoNominalComparado
      ),
      ajustado: ajustarDesglose(comparadoSinLiquidar, factor),
    },
    diferenciaPoderAdquisitivoNetoAnualCentimos: diferenciaAnual,
    diferenciaPoderAdquisitivoNetoMensualCentimos:
      diferenciaMensualCentimos(diferenciaAnual),
  }
}

// Los calculos exportados usan Effect.fn para conservar trazas utiles de llamada
// sin ocultar que las formulas son puras.
export const compararAjustadoPorIpc = Effect.fn(
  "progresividad.compararAjustadoPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  return construirComparacionAjustadaPorIpc(entrada)
})

const proporcionSegura = (numerador: number, denominador: number) => {
  if (denominador === 0) {
    return 0
  }

  return numerador / denominador
}

const tipoCarga = (desglose: DesgloseLiquidado) =>
  proporcionSegura(
    desglose.cotizacionTrabajadorCentimos + desglose.irpfFinalCentimos,
    desglose.salarioBrutoAnualCentimos
  )

const tipoCunaLaboral = (desglose: DesgloseLiquidado) =>
  proporcionSegura(
    desglose.costeLaboralCentimos - desglose.salarioNetoAnualCentimos,
    desglose.costeLaboralCentimos
  )

const ordenarPorDiferenciaAbsoluta = (
  puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>
) =>
  [...puntos].sort(
    (a, b) =>
      Math.abs(b.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos) -
      Math.abs(a.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos)
  )

const ordenarPorBrechaCarga = (
  puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>
) =>
  [...puntos].sort(
    (a, b) =>
      Math.abs(b.tipoCargaActual - b.tipoCargaComparada) -
      Math.abs(a.tipoCargaActual - a.tipoCargaComparada)
  )

const primero = <A>(valores: ReadonlyArray<A>) => valores[0]

const hallazgoMasAfectado = (
  punto: PuntoAuditoriaRangoSalarial | undefined
): HallazgoAuditoria | undefined => {
  if (punto === undefined) {
    return undefined
  }

  const diferencia =
    punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
  if (diferencia > 0) {
    return {
      titulo: "Mayor pérdida de poder adquisitivo",
      descripcion:
        "En este salario, la legislación actual deja menos neto real que el año comparado ajustado por IPC.",
      salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
      severidad: "perdida",
    }
  }

  return {
    titulo: "Mayor mejora de poder adquisitivo",
    descripcion:
      "En este salario, la legislación actual deja más neto real que el año comparado ajustado por IPC.",
    salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
    severidad: "ganancia",
  }
}

const hallazgoBrechaCarga = (
  punto: PuntoAuditoriaRangoSalarial | undefined
): HallazgoAuditoria | undefined => {
  if (punto === undefined) {
    return undefined
  }

  if (punto.tipoCargaActual > punto.tipoCargaComparada) {
    return {
      titulo: "Mayor cambio de carga sobre salario bruto",
      descripcion:
        "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
      salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
      severidad: "perdida",
    }
  }

  return {
    titulo: "Mayor cambio de carga sobre salario bruto",
    descripcion:
      "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
    salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
    severidad: "ganancia",
  }
}

const hallazgoPrimerIrpfActual = (
  punto: PuntoAuditoriaRangoSalarial | undefined
): HallazgoAuditoria | undefined => {
  if (punto === undefined) {
    return undefined
  }

  return {
    titulo: "Primer salario con IRPF final en 2026",
    descripcion:
      "Marca la entrada visible del IRPF final dentro del rango explorado; por debajo siguen existiendo cotizaciones.",
    salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
    severidad: "info",
  }
}

const estaPresente = <A>(valor: A | undefined): valor is A =>
  valor !== undefined

const construirHallazgos = (
  puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>
): ReadonlyArray<HallazgoAuditoria> => {
  const masAfectado = primero(ordenarPorDiferenciaAbsoluta(puntos))
  const mayorBrechaCarga = primero(ordenarPorBrechaCarga(puntos))
  const primerIrpfActual = puntos.find(
    (punto) => punto.comparacion.referencia.irpfFinalCentimos > 0
  )

  return [
    hallazgoMasAfectado(masAfectado),
    hallazgoBrechaCarga(mayorBrechaCarga),
    hallazgoPrimerIrpfActual(primerIrpfActual),
  ].filter(estaPresente)
}

const rangoSalarioBrutoAnualCentimos = (
  entrada: EntradaAuditoriaRangoSalarial
): ReadonlyArray<number> => {
  if (entrada.pasoCentimos <= 0) {
    return []
  }

  if (
    entrada.salarioBrutoAnualMinimoCentimos >
    entrada.salarioBrutoAnualMaximoCentimos
  ) {
    return []
  }

  const numeroPuntos =
    Math.floor(
      (entrada.salarioBrutoAnualMaximoCentimos -
        entrada.salarioBrutoAnualMinimoCentimos) /
        entrada.pasoCentimos
    ) + 1

  return globalThis.Array.from(
    { length: numeroPuntos },
    (_, index) =>
      entrada.salarioBrutoAnualMinimoCentimos + index * entrada.pasoCentimos
  )
}

const construirPuntoAuditoria = Effect.fn(
  "progresividad.construirPuntoAuditoria"
)(function* (
  entrada: EntradaAuditoriaRangoSalarial,
  salarioBrutoAnualCentimos: number
) {
  const comparacion = yield* compararAjustadoPorIpc({
    salarioBrutoAnualReferenciaCentimos: salarioBrutoAnualCentimos,
    anioComparado: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
  })

  return {
    salarioBrutoAnualCentimos,
    comparacion,
    tipoCargaActual: tipoCarga(comparacion.referencia),
    tipoCargaComparada: tipoCarga(comparacion.comparado.ajustado),
    tipoCunaLaboralActual: tipoCunaLaboral(comparacion.referencia),
    tipoCunaLaboralComparada: tipoCunaLaboral(comparacion.comparado.ajustado),
  } satisfies PuntoAuditoriaRangoSalarial
})

export const auditarRangoSalarial = Effect.fn(
  "progresividad.auditarRangoSalarial"
)(function* (entrada: EntradaAuditoriaRangoSalarial) {
  const puntos = yield* Effect.forEach(
    rangoSalarioBrutoAnualCentimos(entrada),
    (salarioBrutoAnualCentimos) =>
      construirPuntoAuditoria(entrada, salarioBrutoAnualCentimos)
  )

  return {
    anioComparado: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
    salarioBrutoAnualMinimoCentimos: entrada.salarioBrutoAnualMinimoCentimos,
    salarioBrutoAnualMaximoCentimos: entrada.salarioBrutoAnualMaximoCentimos,
    pasoCentimos: entrada.pasoCentimos,
    puntos,
    hallazgos: construirHallazgos(puntos),
  } satisfies AuditoriaRangoSalarial
})
