import { HechosEstatales681 } from "./inversion-681-2025"
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
  estatal681: Schema.optionalKey(HechosEstatales681),
 }),
})
export const ArrendadorSocialAnual2025 = Schema.Struct({
 lote: Schema.Literal("A-aragon-dos"),
 codigo: SolicitudArrendadorSocial2025.fields.codigo,
 hechos: Schema.Union([
  Schema.Struct({ viviendas: SolicitudArrendadorSocial2025.fields.viviendas }),
  Schema.Struct({ viviendasPlan: Schema.Array(Schema.Struct({
   inmueble: Schema.String.check(Schema.isPattern(/\S/)),
   titular: Schema.String.check(Schema.isPattern(/\S/)),
   titulo: Schema.String.check(Schema.isPattern(/\S/)),
   gestor: Schema.Struct({ entidad: Schema.String.check(Schema.isPattern(/\S/)),
    clase: Schema.Literals(["Gobierno-Aragon", "entidad-gestora-Plan"]),
    habilitacion: Schema.String.check(Schema.isPattern(/\S/)),
    mandatoPorCuentaPropietario: Schema.String.check(Schema.isPattern(/\S/)) }),
   acta: Schema.String.check(Schema.isPattern(/\S/)),
   desde: Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)), hasta: Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/)),
  })).check(Schema.isMinLength(1), Schema.isMaxLength(1)) }),
 ]),
})
export const SolicitudAragonDosAnual2025 = Schema.Union([InversionAragonesaAnual2025, ArrendadorSocialAnual2025])
export type SolicitudAragonDosAnual2025 = typeof SolicitudAragonDosAnual2025.Type
