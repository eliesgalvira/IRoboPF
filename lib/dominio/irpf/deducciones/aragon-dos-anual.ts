import { evaluarSocialMixtoAnual2025, type ResultadoSocialMixto2025 } from "../aragon-social-mixto-2025/atribucion"
import { producirEstatal681, type GeneracionEstatal681 } from "./inversion-681-2025"
import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import type { SolicitudDeduccionesTerritoriales2025 } from "./anual-territorial-esquemas"
import { evaluarInversionAragonesa2025, prepararArrendadorSocial2025, type ResultadoInversionAragonesa2025 } from "./aragon-dos-codigos-2025"
import { exigir, ref } from "./aragon-dos-codigos-2025/comun"
import { SolicitudAragonDosAnual2025 } from "./aragon-dos-anual-esquemas"
import { RechazoAragonAnual } from "./aragon-dos-anual-error"

/** Una sola validación común de la cartera y generación estatal interna; las cuotas se consumen en el libro anual. */
export function evaluarAragonDosAnual2025(
 entrada: SolicitudAragonDosAnual2025,
 m: MagnitudesTerritorialesAnuales,
 solicitudes: SolicitudDeduccionesTerritoriales2025["solicitudes"]
): (Extract<ResultadoInversionAragonesa2025,{estado:"calculo_parcial"}> | ResultadoSocialMixto2025) & { readonly estatal681?: GeneracionEstatal681 } {
 const s=Schema.decodeUnknownSync(SolicitudAragonDosAnual2025)(entrada,{onExcessProperty:"error"})
 const c=m.caso
 exigir(c.anio===2025 && c.comunidadAutonoma==="aragon" && c.situacionFamiliar.tipo==="individual" && c.fechaFallecimiento===undefined,"Aragón anual:2025 individual ordinario sin fallecimiento")
 exigir(c.contribuyenteId!==undefined,"Aragón anual: identidad obligatoria")
 const contribuyente=c.contribuyenteId;ref(contribuyente)
 const contexto={ejercicio:2025 as const,territorio:"aragon" as const,modalidad:"individual" as const,devengo:"2025-12-31" as const,
  contribuyente,casoAnual:"anual:2025:aragon:"+contribuyente}
 if(s.codigo==="aragon_arrendamiento_vivienda_social_arrendador"){
  if ("viviendasPlan" in s.hechos) return evaluarSocialMixtoAnual2025(s.hechos.viviendasPlan, m, solicitudes)
  const r=prepararArrendadorSocial2025({...contexto,codigo:s.codigo,...s.hechos})
  exigir(r.estado==="requiere_atribucion_anual",r.estado==="no_soportado"?r.motivo:"Preparación social ausente")
  throw new RechazoAragonAnual({motivo:"El productor inmobiliario anual disponible es simplificado: faltan neto reducido23.2/3, BLG derivada y atribución oficial de cuota al Plan. Se conserva petición3/10, sin importe.",dependencia:{
   tipo:"ARAGON_SOCIAL_SIN_PRODUCTORES_ANUALES",codigo:s.codigo,peticion:r.peticion,formula:r.formula,
   nodosPendientes:["neto-reducido-inmobiliario-23.2-23.3","BLG-derivada-Plan","cuota-autonomica-derivada-metodo-contrastado"],
  }})
 }
 // Una referencia monetaria no se reutiliza dentro de la cartera. La conciliación transversal común comprueba los demás códigos.
 exigir(new Set(s.hechos.inversiones.map(i=>i.pago.justificante)).size===s.hechos.inversiones.length,"Aragón anual: justificante de pago repetido; individualizar los desembolsos")
 const elecciones: {codigo:string;inversion:string}[]=[]
 for(const otra of solicitudes){
  if(otra.lote!=="A40" || (otra.codigo!=="aragon_inversion_acciones_mab" && otra.codigo!=="aragon_inversion_economia_social"))continue
  for(const i of s.hechos.inversiones)for(const o of otra.hechos.inversiones){
   const mismoPago=i.pago.id===o.pago.id || i.pago.justificante===o.pago.justificante
   const mismaOperacion=i.entidad===o.entidad && i.escritura===o.escritura
   if(mismoPago || mismaOperacion)elecciones.push({codigo:otra.codigo,inversion:i.id})
  }
 }
 exigir(elecciones.length===0,"Aragón anual: inversión/censo68.1 compartido con elección MAB/economía social; resolver partición de la misma operación, no duplicar pago ni base")
 const hechosComunes={censoInversionesEstatales2025:s.hechos.censoInversionesEstatales2025,inversiones:s.hechos.inversiones,reinversion:s.hechos.reinversion}
 const r=evaluarInversionAragonesa2025({...contexto,codigo:s.codigo,...hechosComunes,elecciones})
 exigir(r.estado==="calculo_parcial",r.estado==="no_soportado"?r.motivo:"Evaluación de inversión ausente")
 if(s.hechos.reinversion.tipo!=="sin-exencion38.2")
  throw new RechazoAragonAnual({motivo:"La exención38.2 elegida requiere productor de transmisión/ganancia/reinversión anual; el cero regional aislado no acredita su liquidación.",dependencia:{
   tipo:"ARAGON_38_2_SIN_PRODUCTOR",codigo:s.codigo,inversiones:s.hechos.inversiones.map(i=>i.id),
  }})
 const positiva=s.hechos.inversiones.some(i=>i.asignacion.estatalCentimos>0)
 if(positiva && s.hechos.estatal681===undefined)
  throw new RechazoAragonAnual({motivo:"Asignación estatal positiva: aportar hechos patrimoniales70 y titularidades para el productor68.1 acotado.",dependencia:{tipo:"ARAGON_68_1_ESTATAL_SIN_PRODUCTOR",codigo:s.codigo,baseEstatalElegidaEuros:r.baseEstatalAsignadaEuros,inversiones:s.hechos.inversiones.map(i=>i.id)}})
 if(!positiva)return r // Conserva estatal0 y sus oráculos publicados.
 const estatal681=producirEstatal681({...contexto,codigo:s.codigo,...s.hechos,elecciones},s.hechos.estatal681)
 return {...r,estatal681}
}
