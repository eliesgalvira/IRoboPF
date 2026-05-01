import Decimal from "decimal.js"
import { Array as EffectArray, Context, Effect, Layer, Match } from "effect"

import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import {
  type AuditoriaRangoSalarial,
  type ComparacionAjustadaPorIpc,
  type DesgloseLiquidado,
  type EntradaAuditoriaRangoSalarial,
  type HallazgoAuditoria,
  type PuntoAuditoriaRangoSalarial,
} from "../compatibilidad-legacy/progresividad-frio"
import { calcularSalarioLegacy } from "../compatibilidad-legacy/calculo-salario-legacy"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
} from "../dinero/importe-monetario"
import { IPC_ANUAL_DICIEMBRE } from "../normativa/datos/ipc-2012-2026"

export {
  aniosFiscalesLegacy,
  calcularPerdidaAcumulada,
  compararAjustadoPorIpc,
  compararPasadoAjustadoPorIpc,
  configuracionControlSalario,
  configuracionExportacionCompatibleLegacy,
  configuracionRangoAuditoria,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
} from "../compatibilidad-legacy/progresividad-frio"

export type {
  AnioFiscal,
  AuditoriaRangoSalarial,
  ComparacionAjustadaPorIpc,
  DesgloseLiquidado,
  EntradaAuditoriaRangoSalarial,
  EntradaComparacionAjustadaPorIpc,
  HallazgoAuditoria,
  OpcionesRangoSalarialEuros,
  PerdidaAcumulada,
  PuntoAuditoriaRangoSalarial,
  PuntoPerdidaAcumulada,
  RangoSalarialEuros,
  TablaCompatible,
  ValorCeldaCompatible,
} from "../compatibilidad-legacy/progresividad-frio"

export type PerfilAuditoriaProgresividadFrio = Extract<
  PerfilCalculo,
  "legacy-progresividad-frio"
>

export interface EntradaAuditoriaProgresividadFrio extends EntradaAuditoriaRangoSalarial {
  readonly perfil: PerfilAuditoriaProgresividadFrio
}

export interface ContextoAuditoriaProgresividadFrio {
  readonly modo: ModoCalculo
}

export interface ResultadoAuditoriaProgresividadFrio {
  readonly _tag: "ResultadoAuditoriaProgresividadFrio"
  readonly perfil: PerfilAuditoriaProgresividadFrio
  readonly modo: ModoCalculo
  readonly auditoria: AuditoriaRangoSalarial
}

const CERO = crearImporteMonetario(0)
const UNO = crearImporteMonetario(1)
const CONCURRENCIA_AUDITORIA_RANGO = 8
const TAMANO_LOTE_AUDITORIA_RANGO = 64

const rangoNumerico = (inicio: number, fin: number): ReadonlyArray<number> =>
  Match.value(inicio > fin).pipe(
    Match.when(true, () => []),
    Match.orElse(() =>
      EffectArray.makeBy(fin - inicio + 1, (index) => inicio + index)
    )
  )

const ipcAnualConocido = (anio: number): Decimal =>
  Match.value(IPC_ANUAL_DICIEMBRE[anio]).pipe(
    Match.when(Match.undefined, () => CERO),
    Match.orElse((tipo) => tipo)
  )

const factorIpc = (anioBase: AnioFiscal, anioReferencia: AnioFiscal) =>
  rangoNumerico(anioBase + 1, anioReferencia).reduce(
    (factor, anio) => factor.mul(UNO.plus(ipcAnualConocido(anio))),
    UNO
  )

const escalarCentimos = (centimos: number, factor: Decimal): number =>
  eurosACentimos(centimosAEuros(centimos).mul(factor))

const ajustarDesglose = (
  desglose: DesgloseLiquidado,
  factor: Decimal
): DesgloseLiquidado => ({
  salarioBrutoAnualCentimos: escalarCentimos(
    desglose.salarioBrutoAnualCentimos,
    factor
  ),
  cotizacionEmpresarialCentimos: escalarCentimos(
    desglose.cotizacionEmpresarialCentimos,
    factor
  ),
  costeLaboralCentimos: escalarCentimos(desglose.costeLaboralCentimos, factor),
  cotizacionTrabajadorCentimos: escalarCentimos(
    desglose.cotizacionTrabajadorCentimos,
    factor
  ),
  irpfFinalCentimos: escalarCentimos(desglose.irpfFinalCentimos, factor),
  salarioNetoAnualCentimos: escalarCentimos(
    desglose.salarioNetoAnualCentimos,
    factor
  ),
})

const compararAjustadoPorIpcConLiquidacion = Effect.fn(
  "auditoria.compararAjustadoPorIpcConLiquidacion"
)(function* (entrada: {
  readonly salarioBrutoAnualReferenciaCentimos: number
  readonly anioComparado: AnioFiscal
  readonly anioReferencia: AnioFiscal
}) {
  const factor = factorIpc(entrada.anioComparado, entrada.anioReferencia)
  const salarioBrutoNominalAnualCentimos = eurosACentimos(
    centimosAEuros(entrada.salarioBrutoAnualReferenciaCentimos).div(factor)
  )
  const referencia = yield* calcularSalarioLegacy({
    anio: entrada.anioReferencia,
    salarioBrutoAnualCentimos: entrada.salarioBrutoAnualReferenciaCentimos,
  })
  const comparadoNominal = yield* calcularSalarioLegacy({
    anio: entrada.anioComparado,
    salarioBrutoAnualCentimos: salarioBrutoNominalAnualCentimos,
  })
  const comparadoAjustado = ajustarDesglose(comparadoNominal, factor)

  return {
    anioReferencia: entrada.anioReferencia,
    anioComparado: entrada.anioComparado,
    factorIpc: factor.toFixed(12),
    referencia,
    comparado: {
      salarioBrutoNominalAnualCentimos,
      ajustado: comparadoAjustado,
    },
    diferenciaPoderAdquisitivoNetoAnualCentimos:
      comparadoAjustado.salarioNetoAnualCentimos -
      referencia.salarioNetoAnualCentimos,
    diferenciaPoderAdquisitivoNetoMensualCentimos: Math.round(
      (comparadoAjustado.salarioNetoAnualCentimos -
        referencia.salarioNetoAnualCentimos) /
        12
    ),
  } satisfies ComparacionAjustadaPorIpc
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

const rangoSalarioBrutoAnualCentimos = (
  entrada: EntradaAuditoriaRangoSalarial
): ReadonlyArray<number> =>
  Match.value(entrada).pipe(
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

const partirEnLotes = <A>(
  valores: ReadonlyArray<A>,
  tamanoLote: number
): ReadonlyArray<ReadonlyArray<A>> =>
  Match.value(tamanoLote <= 0).pipe(
    Match.when(true, () => []),
    Match.orElse(() =>
      EffectArray.makeBy(Math.ceil(valores.length / tamanoLote), (index) =>
        valores.slice(index * tamanoLote, (index + 1) * tamanoLote)
      )
    )
  )

const esHallazgoAuditoria = (
  hallazgo: HallazgoAuditoria | undefined
): hallazgo is HallazgoAuditoria => hallazgo !== undefined

const construirPuntoAuditoriaConLiquidacion = Effect.fn(
  "auditoria.construirPuntoAuditoriaConLiquidacion"
)(function* (
  entrada: EntradaAuditoriaRangoSalarial,
  salarioBrutoAnualCentimos: number
) {
  const comparacion = yield* compararAjustadoPorIpcConLiquidacion({
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

const construirHallazgos = (
  puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>,
  anioReferencia: AnioFiscal
): AuditoriaRangoSalarial["hallazgos"] => {
  const masAfectado = [...puntos].sort(
    (a, b) =>
      Math.abs(b.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos) -
      Math.abs(a.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos)
  )[0]
  const mayorBrechaCarga = [...puntos].sort(
    (a, b) =>
      Math.abs(b.tipoCargaActual - b.tipoCargaComparada) -
      Math.abs(a.tipoCargaActual - a.tipoCargaComparada)
  )[0]
  const primerIrpfReferencia = puntos.find(
    (punto) => punto.comparacion.referencia.irpfFinalCentimos > 0
  )

  const hallazgos: ReadonlyArray<HallazgoAuditoria | undefined> = [
    Match.value(masAfectado).pipe(
      Match.when(Match.undefined, () => undefined),
      Match.when(
        (punto) =>
          punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos > 0,
        (punto) => ({
          titulo: "Mayor pérdida de poder adquisitivo",
          descripcion:
            "En este salario, la legislación actual deja menos neto real que el año comparado ajustado por IPC.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "perdida" as const,
        })
      ),
      Match.orElse((punto) => ({
        titulo: "Mayor mejora de poder adquisitivo",
        descripcion:
          "En este salario, la legislación actual deja más neto real que el año comparado ajustado por IPC.",
        salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
        severidad: "ganancia" as const,
      }))
    ),
    Match.value(mayorBrechaCarga).pipe(
      Match.when(Match.undefined, () => undefined),
      Match.when(
        (punto) => punto.tipoCargaActual > punto.tipoCargaComparada,
        (punto) => ({
          titulo: "Mayor cambio de carga sobre salario bruto",
          descripcion:
            "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
          salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
          severidad: "perdida" as const,
        })
      ),
      Match.orElse((punto) => ({
        titulo: "Mayor cambio de carga sobre salario bruto",
        descripcion:
          "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
        salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
        severidad: "ganancia" as const,
      }))
    ),
    Match.value(primerIrpfReferencia).pipe(
      Match.when(Match.undefined, () => undefined),
      Match.orElse((punto) => ({
        titulo: `Primer salario con IRPF final en ${anioReferencia}`,
        descripcion:
          "Marca la entrada visible del IRPF final dentro del rango explorado; por debajo siguen existiendo cotizaciones.",
        salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
        severidad: "info" as const,
      }))
    ),
  ]

  return hallazgos.filter(esHallazgoAuditoria)
}

const auditarRangoSalarialConLiquidacionIrpf = Effect.fn(
  "auditoria.auditarRangoSalarialConLiquidacionIrpf"
)(function* (entrada: EntradaAuditoriaRangoSalarial) {
  const lotes = partirEnLotes(
    rangoSalarioBrutoAnualCentimos(entrada),
    TAMANO_LOTE_AUDITORIA_RANGO
  )
  const puntosPorLote = yield* Effect.forEach(
    lotes,
    (lote) =>
      Effect.forEach(lote, (salarioBrutoAnualCentimos) =>
        construirPuntoAuditoriaConLiquidacion(
          entrada,
          salarioBrutoAnualCentimos
        )
      ),
    { concurrency: CONCURRENCIA_AUDITORIA_RANGO }
  )
  const puntos = puntosPorLote.flat()

  return {
    anioComparado: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
    salarioBrutoAnualMinimoCentimos: entrada.salarioBrutoAnualMinimoCentimos,
    salarioBrutoAnualMaximoCentimos: entrada.salarioBrutoAnualMaximoCentimos,
    pasoCentimos: entrada.pasoCentimos,
    puntos,
    hallazgos: construirHallazgos(puntos, entrada.anioReferencia),
  } satisfies AuditoriaRangoSalarial
})

const auditarProgresividadFrioImpl = Effect.fn(
  "auditoria.auditarProgresividadFrio"
)(function* (
  entrada: EntradaAuditoriaProgresividadFrio,
  contexto: ContextoAuditoriaProgresividadFrio
) {
  const auditoria = yield* auditarRangoSalarialConLiquidacionIrpf({
    salarioBrutoAnualMinimoCentimos: entrada.salarioBrutoAnualMinimoCentimos,
    salarioBrutoAnualMaximoCentimos: entrada.salarioBrutoAnualMaximoCentimos,
    pasoCentimos: entrada.pasoCentimos,
    anioComparado: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
  })

  return {
    _tag: "ResultadoAuditoriaProgresividadFrio",
    perfil: entrada.perfil,
    modo: contexto.modo,
    auditoria,
  } satisfies ResultadoAuditoriaProgresividadFrio
})

export class AuditoriaProgresividadFrio extends Context.Service<
  AuditoriaProgresividadFrio,
  {
    readonly auditar: (
      entrada: EntradaAuditoriaProgresividadFrio,
      contexto: ContextoAuditoriaProgresividadFrio
    ) => Effect.Effect<ResultadoAuditoriaProgresividadFrio>
  }
>()("@irobopf/dominio/auditoria/AuditoriaProgresividadFrio") {
  static readonly layer = Layer.succeed(AuditoriaProgresividadFrio, {
    auditar: auditarProgresividadFrioImpl,
  })
}

const auditarProgresividadFrioDesdeServicio = Effect.fn(
  "auditoria.auditarProgresividadFrioDesdeServicio"
)(function* (
  entrada: EntradaAuditoriaProgresividadFrio,
  contexto: ContextoAuditoriaProgresividadFrio
) {
  const auditoria = yield* AuditoriaProgresividadFrio

  return yield* auditoria.auditar(entrada, contexto)
})

export const auditarProgresividadFrio = (
  entrada: EntradaAuditoriaProgresividadFrio,
  contexto: ContextoAuditoriaProgresividadFrio
): Effect.Effect<ResultadoAuditoriaProgresividadFrio> =>
  auditarProgresividadFrioDesdeServicio(entrada, contexto).pipe(
    Effect.provide(AuditoriaProgresividadFrio.layer)
  )
