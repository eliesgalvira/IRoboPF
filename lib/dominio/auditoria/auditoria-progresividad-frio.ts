import Decimal from "decimal.js"
import {
  Array as EffectArray,
  Context,
  Effect,
  Layer,
  Match,
  Option,
} from "effect"

import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import type { PerfilAuditoriaNormativa } from "./auditoria-normativa-historica"
import type { ComunidadAutonoma } from "../irpf/caso-fiscal-anual"
import {
  type AuditoriaRangoSalarial,
  type ComparacionAjustadaPorIpc,
  type DesgloseLiquidado,
  type EntradaAuditoriaRangoSalarial,
  type HallazgoAuditoria,
  type PuntoAuditoriaRangoSalarial,
} from "../compatibilidad-legacy/progresividad-frio"
import {
  CompatibilidadSalarioLegacy,
  type ServicioCompatibilidadSalarioLegacy,
} from "../compatibilidad-legacy/calculo-salario-legacy"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import {
  centimosAEuros,
  crearImporteMonetario,
  eurosACentimos,
} from "../dinero/importe-monetario"
import { IPC_ANUAL_DICIEMBRE } from "../normativa/datos/ipc-2012-2026"
import {
  instrumentarEffectAuditoria,
  medirAuditoriaSync,
  metricaDuracionCalculoAuditoria,
  registrarTiempoAgregadoAuditoria,
  registrarResumenTiemposAuditoria,
  reiniciarTiemposAgregadosAuditoria,
  tiempoAuditoriaMs,
} from "../../observabilidad/auditoria-rendimiento"

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
> | PerfilAuditoriaNormativa

export interface EntradaAuditoriaProgresividadFrio extends EntradaAuditoriaRangoSalarial {
  readonly perfil: PerfilAuditoriaProgresividadFrio
  readonly comunidadAutonoma?: ComunidadAutonoma | undefined
  readonly perfilAuditoria?: PerfilAuditoriaNormativa | undefined
}

interface EntradaAuditoriaRangoSalarialConComunidad
  extends EntradaAuditoriaRangoSalarial {
  readonly comunidadAutonoma?: ComunidadAutonoma | undefined
  readonly perfilAuditoria?: PerfilAuditoriaNormativa | undefined
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
  readonly comunidadAutonoma?: ComunidadAutonoma | undefined
  readonly perfilAuditoria?: PerfilAuditoriaNormativa | undefined
  readonly compatibilidadSalarioLegacy: ServicioCompatibilidadSalarioLegacy
}) {
  const factor = medirAuditoriaSync("auditoria.comparacion.factorIpc", () =>
    factorIpc(entrada.anioComparado, entrada.anioReferencia)
  )
  const salarioBrutoNominalAnualCentimos = medirAuditoriaSync(
    "auditoria.comparacion.salarioNominal",
    () =>
      eurosACentimos(
        centimosAEuros(entrada.salarioBrutoAnualReferenciaCentimos).div(factor)
      )
  )
  const inicioReferencia = tiempoAuditoriaMs()
  const referencia = yield* entrada.compatibilidadSalarioLegacy.calcular({
    anio: entrada.anioReferencia,
    salarioBrutoAnualCentimos: entrada.salarioBrutoAnualReferenciaCentimos,
    comunidadAutonoma: entrada.comunidadAutonoma,
    perfilAuditoria: entrada.perfilAuditoria,
  })
  registrarTiempoAgregadoAuditoria(
    "auditoria.comparacion.salarioReferencia",
    tiempoAuditoriaMs() - inicioReferencia
  )
  const inicioComparado = tiempoAuditoriaMs()
  const comparadoNominal = yield* entrada.compatibilidadSalarioLegacy.calcular({
    anio: entrada.anioComparado,
    salarioBrutoAnualCentimos: salarioBrutoNominalAnualCentimos,
    comunidadAutonoma: entrada.comunidadAutonoma,
    perfilAuditoria: entrada.perfilAuditoria,
  })
  registrarTiempoAgregadoAuditoria(
    "auditoria.comparacion.salarioComparadoNominal",
    tiempoAuditoriaMs() - inicioComparado
  )
  const comparadoAjustado = medirAuditoriaSync(
    "auditoria.comparacion.ajustarDesglose",
    () => ajustarDesglose(comparadoNominal, factor)
  )

  return medirAuditoriaSync("auditoria.comparacion.resultado", () => ({
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
  }) satisfies ComparacionAjustadaPorIpc)
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
  entrada: EntradaAuditoriaRangoSalarialConComunidad
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
  entrada: EntradaAuditoriaRangoSalarialConComunidad,
  salarioBrutoAnualCentimos: number,
  compatibilidadSalarioLegacy: ServicioCompatibilidadSalarioLegacy
) {
  const inicioComparacion = tiempoAuditoriaMs()
  const comparacion = yield* compararAjustadoPorIpcConLiquidacion({
    salarioBrutoAnualReferenciaCentimos: salarioBrutoAnualCentimos,
    anioComparado: entrada.anioComparado,
    anioReferencia: entrada.anioReferencia,
    comunidadAutonoma: entrada.comunidadAutonoma,
    perfilAuditoria: entrada.perfilAuditoria,
    compatibilidadSalarioLegacy,
  })
  registrarTiempoAgregadoAuditoria(
    "auditoria.punto.comparacion",
    tiempoAuditoriaMs() - inicioComparacion
  )

  return medirAuditoriaSync("auditoria.punto.resultado", () => ({
    salarioBrutoAnualCentimos,
    comparacion,
    tipoCargaActual: tipoCarga(comparacion.referencia),
    tipoCargaComparada: tipoCarga(comparacion.comparado.ajustado),
    tipoEfectivoIrpfActual: tipoEfectivoIrpf(comparacion.referencia),
    tipoEfectivoIrpfComparado: tipoEfectivoIrpf(comparacion.comparado.ajustado),
    tipoCunaLaboralActual: tipoCunaLaboral(comparacion.referencia),
    tipoCunaLaboralComparada: tipoCunaLaboral(comparacion.comparado.ajustado),
  }) satisfies PuntoAuditoriaRangoSalarial)
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
)(function* (entrada: EntradaAuditoriaRangoSalarialConComunidad) {
  const salarios = rangoSalarioBrutoAnualCentimos(entrada)
  const lotes = partirEnLotes(salarios, TAMANO_LOTE_AUDITORIA_RANGO)
  reiniciarTiemposAgregadosAuditoria()

  return yield* instrumentarEffectAuditoria({
    nombre: "auditoria.rango.liquidacion",
    metrica: metricaDuracionCalculoAuditoria,
    detalles: {
      anioComparado: entrada.anioComparado,
      anioReferencia: entrada.anioReferencia,
      comunidadAutonoma: Option.fromNullishOr(entrada.comunidadAutonoma).pipe(
        Option.getOrElse(() => "simulada-estatal")
      ),
      perfilAuditoria: entrada.perfilAuditoria ?? "soltero_sin_hijos",
      puntos: salarios.length,
      liquidacionesIrpfAnuales: salarios.length * 2,
      lotes: lotes.length,
      tamanoLote: TAMANO_LOTE_AUDITORIA_RANGO,
      concurrencia: CONCURRENCIA_AUDITORIA_RANGO,
    },
    efecto: Effect.gen(function* () {
      const compatibilidadSalarioLegacy = yield* CompatibilidadSalarioLegacy
      const puntosPorLote = yield* Effect.forEach(
        lotes,
        (lote) =>
          Effect.forEach(lote, (salarioBrutoAnualCentimos) =>
            construirPuntoAuditoriaConLiquidacion(
              entrada,
              salarioBrutoAnualCentimos,
              compatibilidadSalarioLegacy
            )
          ),
        { concurrency: CONCURRENCIA_AUDITORIA_RANGO }
      )
      const puntos = puntosPorLote.flat()

      const auditoria = {
        anioComparado: entrada.anioComparado,
        anioReferencia: entrada.anioReferencia,
        salarioBrutoAnualMinimoCentimos:
          entrada.salarioBrutoAnualMinimoCentimos,
        salarioBrutoAnualMaximoCentimos:
          entrada.salarioBrutoAnualMaximoCentimos,
        pasoCentimos: entrada.pasoCentimos,
        puntos,
        hallazgos: construirHallazgos(puntos, entrada.anioReferencia),
      } satisfies AuditoriaRangoSalarial

      registrarResumenTiemposAuditoria("auditoria.rango.rank.etapas", {
        anioComparado: entrada.anioComparado,
        anioReferencia: entrada.anioReferencia,
        puntos: salarios.length,
      })

      return auditoria
    }),
  })
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
    comunidadAutonoma: entrada.comunidadAutonoma,
    perfilAuditoria:
      entrada.perfilAuditoria ??
      (entrada.perfil === "legacy-progresividad-frio"
        ? undefined
        : entrada.perfil),
  }).pipe(Effect.provide(CompatibilidadSalarioLegacy.layer))

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
