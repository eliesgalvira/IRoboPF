import { Schema } from "effect"
import { SolicitudInversionAragonesa2025, SolicitudArrendadorSocial2025 } from "./aragon-dos-codigos-2025"

/** Proyecciones cerradas del contrato publicado: contexto y elecciones pertenecen a la anual. */
export const InversionAragonesaAnual2025 = Schema.Struct({
 lote: Schema.Literal("A-aragon-dos"),
 codigo: SolicitudInversionAragonesa2025.fields.codigo,
 hechos: Schema.Struct({
  censoInversionesEstatales2025: SolicitudInversionAragonesa2025.fields.censoInversionesEstatales2025,
  inversiones: SolicitudInversionAragonesa2025.fields.inversiones,
  reinversion: SolicitudInversionAragonesa2025.fields.reinversion,
 }),
})
export const ArrendadorSocialAnual2025 = Schema.Struct({
 lote: Schema.Literal("A-aragon-dos"),
 codigo: SolicitudArrendadorSocial2025.fields.codigo,
 hechos: Schema.Struct({ viviendas: SolicitudArrendadorSocial2025.fields.viviendas }),
})
export const SolicitudAragonDosAnual2025 = Schema.Union([InversionAragonesaAnual2025, ArrendadorSocialAnual2025])
export type SolicitudAragonDosAnual2025 = typeof SolicitudAragonDosAnual2025.Type
