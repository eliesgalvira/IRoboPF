import Decimal from "decimal.js"
import { redondearRacionalHalfUp } from "../../dinero/redondeo"
import type { MagnitudesTerritorialesAnuales } from "../deducciones/anual-territorial"
import type { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial-esquemas"
import type { SolicitudAragonDosAnual2025 } from "../deducciones/aragon-dos-anual-esquemas"
import { exigir, fecha } from "../deducciones/aragon-dos-codigos-2025/comun"
const D = Decimal.clone({ precision: 80 })
type Social = Extract<SolicitudAragonDosAnual2025, {codigo:"aragon_arrendamiento_vivienda_social_arrendador"}>
type Plan = Extract<Social["hechos"], {viviendasPlan: unknown}>["viviendasPlan"]
export type ResultadoSocialMixto2025 = ReturnType<typeof evaluarSocialMixtoAnual2025>
/** Inferencia operativa acotada: proporción exacta, cuota atribuida monetizada, 30%, resultado monetizado. */
export function evaluarSocialMixtoAnual2025(plan: Plan, m: MagnitudesTerritorialesAnuales, solicitudes: SolicitudDeduccionesTerritoriales2025["solicitudes"]) {
 exigir(m.aragonSocialMixto2025 === true, "Social: falta productor mixto acotado; no aceptar rendimientos o cuotas externos")
 exigir(solicitudes.length === 1 && m.inmueblesP4a?.length === 1 && plan.length === 1, "Social: requiere una solicitud y un inmueble sin duplicación")
 const v = m.inmueblesP4a[0]!, p = plan[0]!
 exigir(fecha(p.desde) <= "2025-01-01" && fecha(p.hasta) >= "2025-12-31", "Social: período Plan parcial o invertido; no atribuir toda la renta anual")
 exigir(p.inmueble === v.inmueble.id && p.titular === m.caso.contribuyenteId && p.titular === v.inmueble.titular && p.titulo === v.inmueble.titulo, "Social: identidad/título del Plan no concilia con el censo fiscal")
 // Este perfil distingue al gestor por cuenta del propietario de las partes del alquiler.
 exigir(p.gestor.entidad !== v.inmueble.titular && p.gestor.entidad !== v.inmueble.contrato.arrendatario, "Social: identidad del gestor coincide con propietario o arrendatario; fuera del perfil de roles separados")
 exigir(v.inmueble.ubicacion === "aragon" && v.regimen === "art23-50" && v.diasAlquilados === 365 && v.diasImputados === 0, "Social: ubicación, período o régimen fuera del perfil")
 const r = new D(v.netoReducido.n.toString()).div(v.netoReducido.d.toString())
 exigir(r.gt(0) && m.baseGeneral.gt(0) && r.lte(m.baseGeneral) && m.baseAhorro.isZero() && m.minimoPersonalFamiliar.eq(5550), "Social: exige RNR positivo integrado en BLG, ahorro0 y mínimo5550")
 exigir(m.cuotaAutonomica.eq(m.cuotaAutonomica.toDecimalPlaces(2)), "Social: política de cuota común no monetizada")
 exigir(m.baseGeneral.eq(m.baseGeneral.toDecimalPlaces(2)), "Social: BLG fraccionaria fuera del contraste")
 // Redondeo racional exacto incluso en empates: no división Decimal aproximada ni tipo medio truncado.
 const centimos = (x: Decimal) => BigInt(x.toFixed(2).replace(".", ""))
 const atribuidaCentimos = redondearRacionalHalfUp(centimos(m.cuotaAutonomica)*v.netoReducido.n*100n, v.netoReducido.d*centimos(m.baseGeneral))
 const cuotaAtribuida = new D(atribuidaCentimos.toString()).div(100)
 const importe = new D(redondearRacionalHalfUp(atribuidaCentimos*3n,10n).toString()).div(100)

 return { estado:"calculo_parcial" as const, codigo:"aragon_arrendamiento_vivienda_social_arrendador" as const,
  importeExactoEuros:importe.toFixed(2), importePresentadoCentimos:importe.mul(100).toNumber(),
  contribuyente:p.titular, casoAnual:"anual:2025:aragon:"+p.titular,
  plan:p, inmueble:v.inmueble.id, productor:"inmobiliario-2025/composicion-anual",
  netoReducidoEuros:r.toFixed(), cuotaAtribuidaEuros:cuotaAtribuida.toFixed(2),
  legalRuleSelected:null, aceptacionFiscal:"pendiente" as const,
  metodo:"proporcion-exacta-cuota-atribuida-centimos-30porciento-centimos",
  citas:["art110-13", "AEAT-Open2025-captura26-tres-casos", "AEAT-Open2025-captura-redondeo-1"],
  reservas:["Evidencia operativa de cuatro hechos sintéticos; no certificación universal ni acreditación administrativa del Plan", "Gestor por cuenta del propietario; arrendatario jurídico y reducción50% independientes del nombre Plan"],
 }
}
