import { Context, Effect, Layer } from "effect"

import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import {
  auditarRangoSalarial,
  type AuditoriaRangoSalarial,
  type EntradaAuditoriaRangoSalarial,
} from "../compatibilidad-legacy/progresividad-frio"

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

const auditarProgresividadFrioImpl = Effect.fn(
  "auditoria.auditarProgresividadFrio"
)(function* (
  entrada: EntradaAuditoriaProgresividadFrio,
  contexto: ContextoAuditoriaProgresividadFrio
) {
  const auditoria = yield* auditarRangoSalarial({
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
