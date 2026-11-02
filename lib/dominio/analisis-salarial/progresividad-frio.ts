import type { RastroCalculo } from "../explicacion/rastro-calculo"
import {
  GASTOS_FIJOS_IRPF_LEGACY,
  MINIMO_PERSONAL_IRPF_LEGACY,
} from "../normativa/datos/irpf-estatal-2012-2026"
import Decimal from "decimal.js"
import { Effect, Array as EffectArray, Match } from "effect"
import { liquidarIrpfAnual } from "../irpf/liquidacion/liquidar-irpf-anual"
import { mensualizarCentimosPresentacionLegacy } from "./aritmetica-tabular"

import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
} from "../dinero/importe-monetario"
import { porcentajeCompatibleLegacy } from "../dinero/porcentaje"
import {
  factorIpcPerfilLegacy,
  type ProcedenciaIpc,
} from "../inflacion/factor-ipc"
import {
  obtenerParametrosCotizacionLegacy,
  sumarTipoCotizacionLegacy,
} from "../laboral/cotizaciones-sociales"
import { aniosFiscalesLegacy, type AnioFiscal } from "../normativa/anio-fiscal"
import { METADATOS_ARTICULO_20_LEGACY } from "../normativa/datos/irpf-estatal-2012-2026"
import { UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR } from "../normativa/datos/irpf-obligacion-declarar"

export { aniosFiscalesLegacy } from "../normativa/anio-fiscal"
export type { AnioFiscal } from "../normativa/anio-fiscal"

export interface EntradaComparacionAjustadaPorIpc {
  readonly salarioBrutoAnualReferenciaCentimos: number
  readonly anioComparado: AnioFiscal
  readonly anioReferencia: AnioFiscal
}

export interface DesgloseLiquidado {
  readonly rastro?: RastroCalculo

  readonly salarioBrutoAnualCentimos: number
  readonly cotizacionEmpresarialCentimos: number
  readonly costeLaboralCentimos: number
  readonly cotizacionTrabajadorCentimos: number
  readonly irpfFinalCentimos: number
  readonly irpfFinalPrecisoEuros?: string | undefined
  readonly salarioNetoAnualCentimos: number
}

export interface ComparacionAjustadaPorIpc {
  readonly anioReferencia: AnioFiscal
  readonly anioComparado: AnioFiscal
  readonly procedenciaIpc: ProcedenciaIpc
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
const UNO = decimal(1)

interface DesgloseEuros {
  readonly rastro: RastroCalculo

  readonly salarioBrutoAnual: Decimal
  readonly cotizacionEmpresarial: Decimal
  readonly costeLaboral: Decimal
  readonly cotizacionTrabajador: Decimal
  readonly irpfFinal: Decimal
  readonly salarioNetoAnual: Decimal
}

const factorIpc = (anioBase: AnioFiscal, anioReferencia: AnioFiscal) =>
  factorIpcPerfilLegacy(anioBase, anioReferencia).factor

const calcularDesgloseEuros = Effect.fn("Analisis.calcularDesgloseEuros")(
  function* (bruto: Decimal, anio: AnioFiscal) {
    const anual = yield* liquidarIrpfAnual(
      {
        anio,
        comunidadAutonoma: "simulada-estatal",
        situacionFamiliar: {
          tipo: "individual",
          edad: 40,
          discapacidad: { _tag: "SinDiscapacidad" },
          descendientes: [],
          ascendientes: [],
        },
        rendimientos: {
          trabajo: [{ importeIntegroCentimos: eurosACentimos(bruto) }],
        },
        reducciones: [],
        deducciones: [],
        retencionesSoportadasCentimos: 0,
        pagosACuentaCentimos: 0,
      },
      { modo: "canonico" }
    )
    const impuesto = centimosAEuros(anual.cuotaLiquidaCentimos)
    const cotizacion = centimosAEuros(anual.cotizacionTrabajadorCentimos)
    return {
      rastro: anual.rastro,
      salarioBrutoAnual: bruto,
      cotizacionEmpresarial: centimosAEuros(
        anual.cotizacionEmpresarialCentimos
      ),
      costeLaboral: centimosAEuros(anual.costeLaboralCentimos),
      cotizacionTrabajador: cotizacion,
      irpfFinal: impuesto,
      salarioNetoAnual: bruto.minus(cotizacion).minus(impuesto),
    } satisfies DesgloseEuros
  }
)

const centimosLiquidados = (euros: Decimal) => eurosACentimos(euros)

const liquidar = (desglose: DesgloseEuros): DesgloseLiquidado => ({
  rastro: desglose.rastro,
  salarioBrutoAnualCentimos: centimosLiquidados(desglose.salarioBrutoAnual),
  cotizacionEmpresarialCentimos: centimosLiquidados(
    desglose.cotizacionEmpresarial
  ),
  costeLaboralCentimos: centimosLiquidados(desglose.costeLaboral),
  cotizacionTrabajadorCentimos: centimosLiquidados(
    desglose.cotizacionTrabajador
  ),
  irpfFinalCentimos: centimosLiquidados(desglose.irpfFinal),
  irpfFinalPrecisoEuros: desglose.irpfFinal.toString(),
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
  rastro: desglose.rastro,
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
  mensualizarCentimosPresentacionLegacy(diferenciaAnual)

const construirComparacionAjustadaPorIpc = Effect.fn(
  "Analisis.construirComparacionAjustadaPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  const salarioBrutoReferencia = centimosAEuros(
    entrada.salarioBrutoAnualReferenciaCentimos
  )
  const factor = factorIpc(entrada.anioComparado, entrada.anioReferencia)
  const salarioBrutoNominalComparado = salarioBrutoReferencia.div(factor)
  const referenciaSinLiquidar = yield* calcularDesgloseEuros(
    salarioBrutoReferencia,
    entrada.anioReferencia
  )
  const comparadoSinLiquidar = yield* calcularDesgloseEuros(
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
    procedenciaIpc: factorIpcPerfilLegacy(
      entrada.anioComparado,
      entrada.anioReferencia
    ).procedencia,
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
})

// Los calculos exportados usan Effect.fn para conservar trazas utiles de llamada
// sin ocultar que las formulas son puras.
export const compararAjustadoPorIpc = Effect.fn(
  "progresividad.compararAjustadoPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  return yield* construirComparacionAjustadaPorIpc(entrada)
})

const construirComparacionPasadaAjustadaPorIpc = Effect.fn(
  "Analisis.construirComparacionPasadaAjustadaPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  const salarioBrutoReferencia = centimosAEuros(
    entrada.salarioBrutoAnualReferenciaCentimos
  )
  const factor = factorIpc(entrada.anioReferencia, entrada.anioComparado)
  const factorAjustePasado = UNO.div(factor)
  const salarioBrutoNominalComparado = salarioBrutoReferencia.mul(factor)
  const referenciaSinLiquidar = yield* calcularDesgloseEuros(
    salarioBrutoReferencia,
    entrada.anioReferencia
  )
  const comparadoSinLiquidar = yield* calcularDesgloseEuros(
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
    procedenciaIpc: factorIpcPerfilLegacy(
      entrada.anioComparado,
      entrada.anioReferencia
    ).procedencia,
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
})

export const compararPasadoAjustadoPorIpc = Effect.fn(
  "progresividad.compararPasadoAjustadoPorIpc"
)(function* (entrada: EntradaComparacionAjustadaPorIpc) {
  return yield* construirComparacionPasadaAjustadaPorIpc(entrada)
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
    "Art.20 Umbral Inf",
    "Art.20 Red. Máxima",
    "Art.20 Umbral Sup",
    "Art.20 Red. Mínima",
  ],
  filas: aniosFiscalesLegacy.map((anio) => {
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
      GASTOS_FIJOS_IRPF_LEGACY[anio].toNumber(),
      MINIMO_PERSONAL_IRPF_LEGACY[anio].toNumber(),
      articulo20.umbralInferior,
      articulo20.reduccionMaxima,
      articulo20.umbralSuperior,
      articulo20.reduccionMinima,
    ] satisfies ReadonlyArray<ValorCeldaCompatible>
  }),
})
