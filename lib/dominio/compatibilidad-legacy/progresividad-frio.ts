import Decimal from "decimal.js"
import {
  Array as EffectArray,
  Effect,
  Iterable as EffectIterable,
  Match,
} from "effect"

import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
  redondearImporteLiquidado,
} from "../dinero/importe-monetario"
import { porcentajeCompatibleLegacy } from "../dinero/porcentaje"
import { aniosFiscalesLegacy, type AnioFiscal } from "../normativa/anio-fiscal"
import {
  calcularCotizacionesSocialesLegacy,
  obtenerParametrosCotizacionLegacy,
  sumarTipoCotizacionLegacy,
} from "../laboral/cotizaciones-sociales"
import {
  GASTOS_FIJOS_IRPF_LEGACY,
  METADATOS_ARTICULO_20_LEGACY,
  MINIMO_PERSONAL_IRPF_LEGACY,
  obtenerTramosIrpfLegacy,
  type TramoIrpf,
  type TramosIrpf,
} from "../normativa/datos/irpf-estatal-2012-2026"
import { IPC_ANUAL_DICIEMBRE } from "../normativa/datos/ipc-2012-2026"
import { obtenerEspecificacionCompatibilidadHistorica } from "../normativa/datos/compatibilidad-historica"
import { UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR } from "../normativa/datos/irpf-obligacion-declarar"

export type { AnioFiscal } from "../normativa/anio-fiscal"
export { aniosFiscalesLegacy } from "../normativa/anio-fiscal"

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
  readonly irpfConObligacionDeclararCentimos?: number | undefined
  readonly irpfCuotaTrasDeduccionSmiCentimos?: number | undefined
  readonly irpfCuotaTrasDeduccionSmiPrecisoEuros?: string | undefined
  readonly irpfFinalPrecisoEuros?: string | undefined
  readonly salarioNetoAnualCentimos: number
}

export const anotarImportesIrpfAuxiliares = <T extends DesgloseLiquidado>(
  desglose: T,
  importes: {
    readonly irpfConObligacionDeclararCentimos?: number | undefined
    readonly irpfCuotaTrasDeduccionSmiCentimos?: number | undefined
    readonly irpfCuotaTrasDeduccionSmiPrecisoEuros?: string | undefined
  }
): T => {
  for (const [clave, valor] of Object.entries(importes)) {
    if (valor === undefined) continue

    Object.defineProperty(desglose, clave, {
      value: valor,
      enumerable: false,
      configurable: true,
    })
  }

  return desglose
}

export const anotarIrpfConObligacionDeclarar = <T extends DesgloseLiquidado>(
  desglose: T,
  irpfConObligacionDeclararCentimos: number
): T =>
  anotarImportesIrpfAuxiliares(desglose, {
    irpfConObligacionDeclararCentimos,
  })

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

export interface PuntoPerdidaAcumulada {
  readonly anioComparado: AnioFiscal
  readonly diferenciaPoderAdquisitivoNetoAnualCentimos: number
}

export interface PerdidaAcumulada {
  readonly anioInicial: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly totalCentimos: number
  readonly puntos: ReadonlyArray<PuntoPerdidaAcumulada>
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
  readonly tipoEfectivoIrpfActual: number
  readonly tipoEfectivoIrpfComparado: number
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

export interface RangoSalarialEuros {
  readonly salarioMinimoEuros: number
  readonly salarioMaximoEuros: number
  readonly pasoEuros: number
}

export interface OpcionesRangoSalarialEuros {
  readonly salarioMinimoEuros?: number
  readonly salarioMaximoEuros?: number
  readonly pasoEuros?: number
}

export type ValorCeldaCompatible = number | string

export interface TablaCompatible {
  readonly cabeceras: ReadonlyArray<string>
  readonly filas: Iterable<ReadonlyArray<ValorCeldaCompatible>>
}

export const configuracionExportacionCompatibleLegacy = {
  comparativa: {
    salarioMinimoEuros: 15_000,
    salarioMaximoEuros: 100_000,
    pasoEuros: 1_000,
  },
  detalleAnual: {
    salarioMinimoEuros: 0,
    salarioMaximoEuros: 100_000,
    pasoEuros: 1,
  },
} as const satisfies {
  readonly comparativa: RangoSalarialEuros
  readonly detalleAnual: RangoSalarialEuros
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
  minimoPorDefectoCentimos: 1_500_000,
  maximoPorDefectoCentimos: 10_000_000,
  minimoCentimos: 1_000_000,
  maximoCentimos: 10_000_000,
  pasoCentimos: 10_000,
} as const

const decimal = (valor: string | number) => crearImporteMonetario(valor)
const CERO = decimal(0)
const UNO = decimal(1)

type PoliticaMonetaria = (valor: Decimal) => Decimal

interface Parametros {
  readonly minimoPersonalIrpf: Decimal
  readonly minimoExentoRetencion: Decimal
  readonly tipoMaximoRetencionNomina: Decimal
  readonly gastosFijos: Decimal
  readonly tramosIrpf: TramosIrpf
  readonly reduccionTrabajo: PoliticaMonetaria
  readonly deduccionSmi: PoliticaMonetaria
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
  readonly irpfConObligacionDeclarar: Decimal
}

interface DesgloseEuros {
  readonly salarioBrutoAnual: Decimal
  readonly cotizacionEmpresarial: Decimal
  readonly costeLaboral: Decimal
  readonly cotizacionTrabajador: Decimal
  readonly irpfFinal: Decimal
  readonly cuotaTrasSmi: Decimal
  readonly irpfConObligacionDeclarar: Decimal
  readonly salarioNetoAnual: Decimal
}

interface EstadoCuota {
  readonly limiteAnterior: Decimal
  readonly cuota: Decimal
}

const rangoComparativaInflacionLegacy =
  configuracionExportacionCompatibleLegacy.comparativa

const rangoDetalleAnualLegacy =
  configuracionExportacionCompatibleLegacy.detalleAnual

const dineroCompatible = (euros: Decimal) =>
  Number(redondearImporteLiquidado(euros).toString())

// Los conceptos fiscales abreviados del perfil legacy estan definidos en:
// docs/glosario-fiscal-motor.md
const min = (a: Decimal, b: Decimal) =>
  Match.value(a.lessThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  )

const max = (a: Decimal, b: Decimal) =>
  Match.value(a.greaterThan(b)).pipe(
    Match.when(true, () => a),
    Match.orElse(() => b)
  )

const ipcAnualConocido = (anio: number) =>
  Match.value(IPC_ANUAL_DICIEMBRE[anio]).pipe(
    Match.when(Match.undefined, () => CERO),
    Match.orElse((tipo) => tipo)
  )

const rangoNumerico = (inicio: number, fin: number): ReadonlyArray<number> =>
  Match.value(inicio > fin).pipe(
    Match.when(true, () => []),
    Match.orElse(() =>
      EffectArray.makeBy(fin - inicio + 1, (index) => inicio + index)
    )
  )

const factorIpc = (anioBase: AnioFiscal, anioReferencia: AnioFiscal) => {
  const anios = rangoNumerico(anioBase + 1, anioReferencia)
  return anios.reduce(
    (factor, anio) => factor.mul(UNO.plus(ipcAnualConocido(anio))),
    UNO
  )
}

const reduccionTrabajoHasta2014 = (rendimientoPrevioNeto: Decimal) =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(9180),
      () => decimal(4080)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13260),
      (rendimientoPrevioNeto) =>
        decimal(4080).minus(
          decimal("0.35").mul(rendimientoPrevioNeto.minus(9180))
        )
    ),
    Match.orElse(() => decimal(2652))
  )

const reduccionTrabajo2015A2017 = (rendimientoPrevioNeto: Decimal) =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(11250),
      () => decimal(3700)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14450),
      (rendimientoPrevioNeto) =>
        decimal(3700).minus(
          decimal("1.15625").mul(rendimientoPrevioNeto.minus(11250))
        )
    ),
    Match.orElse(() => CERO)
  )

const reduccionTrabajo2019A2022 = (rendimientoPrevioNeto: Decimal) =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(13115),
      () => decimal(5565)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(16825),
      (rendimientoPrevioNeto) =>
        max(
          CERO,
          decimal(5565).minus(
            decimal("1.5").mul(rendimientoPrevioNeto.minus(13115))
          )
        )
    ),
    Match.orElse(() => CERO)
  )

const reduccionTrabajo2018 = (rendimientoPrevioNeto: Decimal) => {
  const reduccionPreTransitoria = reduccionTrabajo2015A2017(
    rendimientoPrevioNeto
  )
  const reduccionPostTransitoria = reduccionTrabajo2019A2022(
    rendimientoPrevioNeto
  )
  return reduccionPreTransitoria.div(2).plus(reduccionPostTransitoria.div(2))
}

const reduccionTrabajo2023 = (rendimientoPrevioNeto: Decimal) =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("14047.50"),
      () => decimal(6498)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"),
      (rendimientoPrevioNeto) =>
        max(
          CERO,
          decimal(6498).minus(
            decimal("1.14").mul(rendimientoPrevioNeto.minus("14047.50"))
          )
        )
    ),
    Match.orElse(() => CERO)
  )

const reduccionTrabajoDesde2024 = (rendimientoPrevioNeto: Decimal) =>
  Match.value(rendimientoPrevioNeto).pipe(
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte(14852),
      () => decimal(7302)
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("17673.52"),
      (rendimientoPrevioNeto) =>
        decimal(7302).minus(
          decimal("1.75").mul(rendimientoPrevioNeto.minus(14852))
        )
    ),
    Match.when(
      (rendimientoPrevioNeto) => rendimientoPrevioNeto.lte("19747.50"),
      (rendimientoPrevioNeto) =>
        decimal("2364.34").minus(
          decimal("1.14").mul(rendimientoPrevioNeto.minus("17673.52"))
        )
    ),
    Match.orElse(() => CERO)
  )

const obtenerReduccionTrabajo = (anio: AnioFiscal): PoliticaMonetaria =>
  Match.value(anio).pipe(
    Match.when(
      (anio) => anio <= 2014,
      () => reduccionTrabajoHasta2014
    ),
    Match.when(
      (anio) => anio <= 2017,
      () => reduccionTrabajo2015A2017
    ),
    Match.when(2018, () => reduccionTrabajo2018),
    Match.when(
      (anio) => anio <= 2022,
      () => reduccionTrabajo2019A2022
    ),
    Match.when(2023, () => reduccionTrabajo2023),
    Match.orElse(() => reduccionTrabajoDesde2024)
  )

const obtenerParametros = (anio: AnioFiscal): Parametros => {
  const especificacionCompatibilidad =
    obtenerEspecificacionCompatibilidadHistorica(anio)

  return {
    minimoPersonalIrpf: MINIMO_PERSONAL_IRPF_LEGACY[anio],
    minimoExentoRetencion: especificacionCompatibilidad.minimoExentoRetencion,
    tipoMaximoRetencionNomina:
      especificacionCompatibilidad.tipoMaximoRetencionNomina,
    gastosFijos: GASTOS_FIJOS_IRPF_LEGACY[anio],
    tramosIrpf: obtenerTramosIrpfLegacy(anio),
    reduccionTrabajo: obtenerReduccionTrabajo(anio),
    deduccionSmi:
      especificacionCompatibilidad.deduccionObtencionRendimientosTrabajo,
  }
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

const calcularCuotaIrpf = (baseImponible: Decimal, tramos: TramosIrpf) =>
  Match.value(baseImponible).pipe(
    Match.when(
      (baseImponible) => baseImponible.lte(0),
      () => CERO
    ),
    Match.orElse(
      (baseImponible) =>
        tramos.reduce(sumarCuotaTramo(baseImponible), {
          limiteAnterior: CERO,
          cuota: CERO,
        }).cuota
    )
  )

const primerTipoIrpf = (tramos: TramosIrpf) =>
  Match.value(tramos[0]).pipe(
    Match.when(Match.undefined, () => CERO),
    Match.orElse((primerTramo) => primerTramo[1])
  )

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
    bruto
      .minus(parametros.minimoExentoRetencion)
      .mul(parametros.tipoMaximoRetencionNomina)
  )
  const irpfFinal = min(cuotaTrasSmi, limiteRetencion)
  const irpfConObligacionDeclarar = bruto.lte(
    UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR
  )
    ? irpfFinal
    : cuotaTrasSmi

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
    irpfConObligacionDeclarar,
  }
}

// El motor usa euros Decimal internamente. Los centimos solo entran y salen en
// fronteras explicitas de API.
const calcularDesgloseEuros = (
  bruto: Decimal,
  anio: AnioFiscal
): DesgloseEuros => {
  const parametros = obtenerParametros(anio)
  const cotizaciones = calcularCotizacionesSocialesLegacy({
    salarioBrutoAnual: bruto,
    anio,
  })
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
    cuotaTrasSmi: irpf.cuotaTrasSmi,
    irpfConObligacionDeclarar: irpf.irpfConObligacionDeclarar,
    salarioNetoAnual,
  }
}

const centimosLiquidados = (euros: Decimal) => eurosACentimos(euros)

const liquidar = (desglose: DesgloseEuros): DesgloseLiquidado =>
  anotarImportesIrpfAuxiliares(
    {
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
    },
    {
      irpfConObligacionDeclararCentimos: centimosLiquidados(
        desglose.irpfConObligacionDeclarar
      ),
      irpfCuotaTrasDeduccionSmiCentimos: centimosLiquidados(
        desglose.cuotaTrasSmi
      ),
      irpfCuotaTrasDeduccionSmiPrecisoEuros: desglose.cuotaTrasSmi.toString(),
    }
  )

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
  cuotaTrasSmi: desglose.cuotaTrasSmi.mul(factor),
  irpfConObligacionDeclarar: desglose.irpfConObligacionDeclarar.mul(factor),
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

const construirComparacionPasadaAjustadaPorIpc = (
  entrada: EntradaComparacionAjustadaPorIpc
): ComparacionAjustadaPorIpc => {
  const salarioBrutoReferencia = centimosAEuros(
    entrada.salarioBrutoAnualReferenciaCentimos
  )
  const factor = factorIpc(entrada.anioReferencia, entrada.anioComparado)
  const factorAjustePasado = UNO.div(factor)
  const salarioBrutoNominalComparado = salarioBrutoReferencia.mul(factor)
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
    factorAjustePasado
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
      ajustado: ajustarDesglose(comparadoSinLiquidar, factorAjustePasado),
    },
    diferenciaPoderAdquisitivoNetoAnualCentimos: diferenciaAnual,
    diferenciaPoderAdquisitivoNetoMensualCentimos:
      diferenciaMensualCentimos(diferenciaAnual),
  }
}

export const compararPasadoAjustadoPorIpc = Effect.fn(
  "progresividad.compararPasadoAjustadoPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  return construirComparacionPasadaAjustadaPorIpc(entrada)
})

export const calcularPerdidaAcumulada = Effect.fn(
  "progresividad.calcularPerdidaAcumulada"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  const puntos = yield* Effect.forEach(
    aniosFiscalesLegacy.filter(
      (anio) => anio >= entrada.anioComparado && anio < entrada.anioReferencia
    ),
    (anioComparado) =>
      Effect.gen(function* () {
        const comparacion = yield* compararAjustadoPorIpc({
          ...entrada,
          anioComparado,
        })

        return {
          anioComparado,
          diferenciaPoderAdquisitivoNetoAnualCentimos:
            comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos,
        } satisfies PuntoPerdidaAcumulada
      })
  )

  return {
    anioInicial: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
    totalCentimos: puntos.reduce(
      (total, punto) =>
        total + punto.diferenciaPoderAdquisitivoNetoAnualCentimos,
      0
    ),
    puntos,
  } satisfies PerdidaAcumulada
})

const proporcionSegura = (numerador: number, denominador: number) =>
  Match.value(denominador).pipe(
    Match.when(0, () => 0),
    Match.orElse((denominador) => numerador / denominador)
  )

const tipoCarga = (desglose: DesgloseLiquidado) =>
  proporcionSegura(
    desglose.cotizacionTrabajadorCentimos + desglose.irpfFinalCentimos,
    desglose.salarioBrutoAnualCentimos
  )

const tipoEfectivoIrpf = (desglose: DesgloseLiquidado) =>
  proporcionSegura(
    desglose.irpfFinalCentimos,
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
): HallazgoAuditoria | undefined =>
  Match.value(punto).pipe(
    Match.when(Match.undefined, () => undefined),
    Match.when(
      (punto) =>
        punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos > 0,
      (punto) =>
        ({
          titulo: "Mayor pérdida de poder adquisitivo",
          descripcion:
            "En este salario, la legislación actual deja menos neto real que el año comparado ajustado por IPC.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "perdida",
        }) satisfies HallazgoAuditoria
    ),
    Match.orElse(
      (punto) =>
        ({
          titulo: "Mayor mejora de poder adquisitivo",
          descripcion:
            "En este salario, la legislación actual deja más neto real que el año comparado ajustado por IPC.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "ganancia",
        }) satisfies HallazgoAuditoria
    )
  )

const hallazgoBrechaCarga = (
  punto: PuntoAuditoriaRangoSalarial | undefined
): HallazgoAuditoria | undefined =>
  Match.value(punto).pipe(
    Match.when(Match.undefined, () => undefined),
    Match.when(
      (punto) => punto.tipoCargaActual > punto.tipoCargaComparada,
      (punto) =>
        ({
          titulo: "Mayor cambio de carga sobre salario bruto",
          descripcion:
            "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "perdida",
        }) satisfies HallazgoAuditoria
    ),
    Match.orElse(
      (punto) =>
        ({
          titulo: "Mayor cambio de carga sobre salario bruto",
          descripcion:
            "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "ganancia",
        }) satisfies HallazgoAuditoria
    )
  )

const hallazgoPrimerIrpfActual = (
  punto: PuntoAuditoriaRangoSalarial | undefined
): HallazgoAuditoria | undefined =>
  Match.value(punto).pipe(
    Match.when(Match.undefined, () => undefined),
    Match.orElse(
      (punto) =>
        ({
          titulo: "Primer salario con IRPF final en 2026",
          descripcion:
            "Marca la entrada visible del IRPF final dentro del rango explorado; por debajo siguen existiendo cotizaciones.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "info",
        }) satisfies HallazgoAuditoria
    )
  )

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
  const rangoRegular = Match.value(entrada).pipe(
    Match.when({ pasoCentimos: (paso) => paso <= 0 }, () => []),
    Match.when(
      (entrada) =>
        entrada.salarioBrutoAnualMinimoCentimos >
        entrada.salarioBrutoAnualMaximoCentimos,
      () => []
    ),
    Match.orElse((entrada) =>
      EffectArray.makeBy(
        Math.floor(
          (entrada.salarioBrutoAnualMaximoCentimos -
            entrada.salarioBrutoAnualMinimoCentimos) /
            entrada.pasoCentimos
        ) + 1,
        (index) =>
          entrada.salarioBrutoAnualMinimoCentimos + index * entrada.pasoCentimos
      )
    )
  )
  const puntosNormativos = puntosUmbralDeclaracionEnRango(entrada)

  return [...new Set([...rangoRegular, ...puntosNormativos])].sort(
    (a, b) => a - b
  )
}

const salarioReferenciaPrimerEuroObligadoDeclararCentimos = ({
  anioCalculado,
  anioReferencia,
}: {
  readonly anioCalculado: AnioFiscal
  readonly anioReferencia: AnioFiscal
}): number => {
  const primerEuroSobreUmbral =
    UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR.plus(1)

  return eurosACentimos(
    anioCalculado === anioReferencia
      ? primerEuroSobreUmbral
      : primerEuroSobreUmbral.mul(factorIpc(anioCalculado, anioReferencia))
  )
}

const puntosUmbralDeclaracionEnRango = (
  entrada: EntradaAuditoriaRangoSalarial
): ReadonlyArray<number> =>
  [
    salarioReferenciaPrimerEuroObligadoDeclararCentimos({
      anioCalculado: entrada.anioReferencia,
      anioReferencia: entrada.anioReferencia,
    }),
    salarioReferenciaPrimerEuroObligadoDeclararCentimos({
      anioCalculado: entrada.anioComparado,
      anioReferencia: entrada.anioReferencia,
    }),
  ].filter(
    (salario) =>
      salario >= entrada.salarioBrutoAnualMinimoCentimos &&
      salario <= entrada.salarioBrutoAnualMaximoCentimos
  )

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
    tipoEfectivoIrpfActual: tipoEfectivoIrpf(comparacion.referencia),
    tipoEfectivoIrpfComparado: tipoEfectivoIrpf(comparacion.comparado.ajustado),
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

const rangoSalarialEuros = (
  rangoPorDefecto: RangoSalarialEuros,
  opciones: OpcionesRangoSalarialEuros | undefined
): RangoSalarialEuros => ({
  salarioMinimoEuros:
    opciones?.salarioMinimoEuros ?? rangoPorDefecto.salarioMinimoEuros,
  salarioMaximoEuros:
    opciones?.salarioMaximoEuros ?? rangoPorDefecto.salarioMaximoEuros,
  pasoEuros: opciones?.pasoEuros ?? rangoPorDefecto.pasoEuros,
})

const numeroSalariosDelRango = (rango: RangoSalarialEuros): number =>
  Match.value(rango).pipe(
    Match.when({ pasoEuros: (paso) => paso <= 0 }, () => 0),
    Match.when(
      (rango) => rango.salarioMinimoEuros > rango.salarioMaximoEuros,
      () => 0
    ),
    Match.orElse(
      (rango) =>
        Math.floor(
          (rango.salarioMaximoEuros - rango.salarioMinimoEuros) /
            rango.pasoEuros
        ) + 1
    )
  )

const salariosDelRango = (rango: RangoSalarialEuros): Iterable<number> =>
  EffectIterable.makeBy(
    (indice) => rango.salarioMinimoEuros + indice * rango.pasoEuros,
    { length: numeroSalariosDelRango(rango) }
  )

const formatearNumeroPorcentajeLegacy = (valor: number): string => {
  const porcentajeRedondeado = Number(valor.toFixed(2))

  return Match.value(Number.isInteger(porcentajeRedondeado)).pipe(
    Match.when(true, () => porcentajeRedondeado.toFixed(1)),
    Match.orElse(() => String(porcentajeRedondeado))
  )
}

const textoPorcentajeLegacy = (valor: number) =>
  `${formatearNumeroPorcentajeLegacy(valor)}%`

const cabeceraTramoIrpf = (indice: number, tramo: TramoIrpf) => {
  const [, tipo] = tramo
  return `T${indice + 1} (${porcentajeCompatibleLegacy(tipo, 1).toFixed(1)}%)`
}

const valorLimiteTramo = (limite: Decimal): ValorCeldaCompatible =>
  Match.value(limite.isFinite()).pipe(
    Match.when(false, () => "En adelante"),
    Match.orElse(() => limite.toNumber())
  )

const calcularCuotasPorTramo = (
  baseImponible: Decimal,
  tramos: TramosIrpf
): ReadonlyArray<Decimal> =>
  tramos.map(([limite], indice) => {
    const limiteAnterior = Match.value(indice).pipe(
      Match.when(0, () => CERO),
      Match.orElse((indice) => tramos[indice - 1][0])
    )
    return importeBaseEnTramo(baseImponible, limiteAnterior, limite).mul(
      tramos[indice][1]
    )
  })

const cabecerasDetalleAnualCompatible = (anio: AnioFiscal) => [
  "Salario Bruto",
  "Cot. Soc. Empresa",
  "Coste Laboral",
  "Cot. Soc. Trab.",
  "Ren. Previo",
  "Gastos Fijos",
  "Red. Ren. Trab.",
  "Base Imponible",
  ...obtenerTramosIrpfLegacy(anio).map((tramo, indice) =>
    cabeceraTramoIrpf(indice, tramo)
  ),
  "Cuota Íntegra",
  "Cuota Mínimo Personal",
  "Cuota Teórica",
  "Deducción SMI",
  "Cuota tras SMI",
  "Límite 43% (Art 85.3)",
  "IRPF Final",
  "Salario Neto",
]

const construirFilaDetalleAnualCompatible = (
  anio: AnioFiscal,
  salarioBrutoEuros: number
): ReadonlyArray<ValorCeldaCompatible> => {
  const bruto = decimal(salarioBrutoEuros)
  const parametros = obtenerParametros(anio)
  const cotizaciones = calcularCotizacionesSocialesLegacy({
    salarioBrutoAnual: bruto,
    anio,
  })
  const irpf = calcularIrpf(bruto, parametros, cotizaciones)
  const cuotasPorTramo = calcularCuotasPorTramo(
    irpf.baseImponible,
    parametros.tramosIrpf
  )
  const salarioNeto = bruto
    .minus(cotizaciones.cotizacionTrabajador)
    .minus(irpf.irpfFinal)

  return [
    salarioBrutoEuros,
    dineroCompatible(cotizaciones.cotizacionEmpresarial),
    dineroCompatible(bruto.plus(cotizaciones.cotizacionEmpresarial)),
    dineroCompatible(cotizaciones.cotizacionTrabajador),
    dineroCompatible(irpf.rendimientoPrevioNeto),
    parametros.gastosFijos.toNumber(),
    dineroCompatible(irpf.reduccionTrabajo),
    dineroCompatible(irpf.baseImponible),
    ...cuotasPorTramo.map(dineroCompatible),
    dineroCompatible(irpf.cuotaIntegra),
    dineroCompatible(irpf.cuotaMinimoPersonal),
    dineroCompatible(irpf.cuotaTeorica),
    dineroCompatible(irpf.deduccionSmi),
    dineroCompatible(irpf.cuotaTrasSmi),
    dineroCompatible(irpf.limiteRetencion),
    dineroCompatible(irpf.irpfFinal),
    dineroCompatible(salarioNeto),
  ]
}

export const construirTablaControlGeneralCompatible = (): TablaCompatible => ({
  cabeceras: [
    "Año",
    "Base Máx. Anual",
    "SS Empleador %",
    "SS Empleado %",
    "MEI Empleador %",
    "MEI Empleado %",
    "Gastos Fijos Art.19",
    "Mín. Contribuyente",
    "Mín. Exento Retención",
    "Art.20 Umbral Inf",
    "Art.20 Red. Máxima",
    "Art.20 Umbral Sup",
    "Art.20 Red. Mínima",
  ],
  filas: aniosFiscalesLegacy.map((anio) => {
    const parametros = obtenerParametros(anio)
    const parametrosCotizacion = obtenerParametrosCotizacionLegacy(anio)
    const articulo20 = METADATOS_ARTICULO_20_LEGACY[anio]

    return [
      anio,
      parametrosCotizacion.baseMaxima.toNumber(),
      porcentajeCompatibleLegacy(
        sumarTipoCotizacionLegacy(parametrosCotizacion, "empresarial"),
        2
      ),
      porcentajeCompatibleLegacy(
        sumarTipoCotizacionLegacy(parametrosCotizacion, "trabajador"),
        2
      ),
      porcentajeCompatibleLegacy(parametrosCotizacion.mei.empresarial, 3),
      porcentajeCompatibleLegacy(parametrosCotizacion.mei.trabajador, 3),
      parametros.gastosFijos.toNumber(),
      parametros.minimoPersonalIrpf.toNumber(),
      parametros.minimoExentoRetencion.toNumber(),
      articulo20.umbralInferior,
      articulo20.reduccionMaxima,
      articulo20.umbralSuperior,
      articulo20.reduccionMinima,
    ] satisfies ReadonlyArray<ValorCeldaCompatible>
  }),
})

export const construirTablaControlTramosIrpfCompatible =
  (): TablaCompatible => ({
    cabeceras: ["Año", "Nº Tramo", "Hasta Base", "Tipo %"],
    filas: aniosFiscalesLegacy.flatMap((anio) =>
      obtenerTramosIrpfLegacy(anio).map(
        ([limite, tipo], indice) =>
          [
            anio,
            indice + 1,
            valorLimiteTramo(limite),
            porcentajeCompatibleLegacy(tipo, 2),
          ] satisfies ReadonlyArray<ValorCeldaCompatible>
      )
    ),
  })

export const construirTablaComparativaInflacionCompatible = (
  opciones?: OpcionesRangoSalarialEuros
): TablaCompatible => {
  const rango = rangoSalarialEuros(rangoComparativaInflacionLegacy, opciones)

  function* filas(): Iterable<ReadonlyArray<ValorCeldaCompatible>> {
    for (const anio of aniosFiscalesLegacy) {
      for (const salario of salariosDelRango(rango)) {
        const salarioReferencia = Number(salario)
        const comparacion = construirComparacionAjustadaPorIpc({
          salarioBrutoAnualReferenciaCentimos: salarioReferencia * 100,
          anioComparado: anio,
          anioReferencia: 2026,
        })
        const factor = Number(comparacion.factorIpc)

        yield [
          anio,
          salarioReferencia,
          Number(factor.toFixed(4)),
          textoPorcentajeLegacy((factor - 1) * 100),
          comparacion.comparado.salarioBrutoNominalAnualCentimos / 100,
          comparacion.comparado.ajustado.costeLaboralCentimos / 100,
          comparacion.comparado.ajustado.cotizacionEmpresarialCentimos / 100,
          comparacion.comparado.ajustado.cotizacionTrabajadorCentimos / 100,
          comparacion.comparado.ajustado.irpfFinalCentimos / 100,
          comparacion.comparado.ajustado.salarioNetoAnualCentimos / 100,
          comparacion.referencia.salarioNetoAnualCentimos / 100,
          comparacion.diferenciaPoderAdquisitivoNetoMensualCentimos / 100,
          comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos / 100,
        ]
      }
    }
  }

  return {
    cabeceras: [
      "Año a Comparar",
      "Salario Equivalente (2026)",
      "Multiplicador IPC Acum.",
      "IPC Acumulado (%)",
      "Salario Bruto Nominal",
      "Coste Lab. (Euros 2026)",
      "SS Emp. (Euros 2026)",
      "SS Tra. (Euros 2026)",
      "IRPF (Euros 2026)",
      "Neto Real en su Año",
      "Neto Real en 2026",
      "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)",
      "Pérdida/Ganancia Anual Poder Adq.",
    ],
    filas: filas(),
  }
}

export const construirTablaDetalleAnualCompatible = (
  anio: AnioFiscal,
  opciones?: OpcionesRangoSalarialEuros
): TablaCompatible => {
  const rango = rangoSalarialEuros(rangoDetalleAnualLegacy, opciones)

  function* filas(): Iterable<ReadonlyArray<ValorCeldaCompatible>> {
    for (const salario of salariosDelRango(rango)) {
      yield construirFilaDetalleAnualCompatible(anio, Number(salario))
    }
  }

  return {
    cabeceras: cabecerasDetalleAnualCompatible(anio),
    filas: filas(),
  }
}
