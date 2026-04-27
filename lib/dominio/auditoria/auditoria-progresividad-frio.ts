import { Effect } from "effect"

import type { ModoCalculo, PerfilCalculo } from "../irpf/perfil-calculo"
import {
  auditarRangoSalarial,
  type AuditoriaRangoSalarial,
  type EntradaAuditoriaRangoSalarial,
} from "../../domain/progresividad"

export {
  aniosFiscalesLegacy,
  calcularPerdidaAcumulada,
  compararAjustadoPorIpc,
  configuracionControlSalario,
  configuracionExportacionCompatibleLegacy,
  configuracionRangoAuditoria,
  construirTablaComparativaInflacionCompatible,
  construirTablaControlGeneralCompatible,
  construirTablaControlTramosIrpfCompatible,
  construirTablaDetalleAnualCompatible,
} from "../../domain/progresividad"

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
} from "../../domain/progresividad"

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

export const auditarProgresividadFrio = Effect.fn(
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
