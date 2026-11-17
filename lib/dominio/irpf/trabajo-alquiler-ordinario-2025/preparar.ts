import { producirSolicitudAsturiasArrendador2025 } from "./asturias-arrendador"
import { producirSolicitudMadridArrendador2025 } from "./madrid-arrendador"
import { producirPoliticaAlquilerOpen2025 } from "./politica-open"
import { costeConstruccion2025, historiaDesconocidaNoVinculante2025 } from "../inmobiliario-2025/coste-construccion"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { CasoTrabajoAlquilerOrdinario2025 } from "./contrato"
import { producirCensoInmuebles2025, type ExactoP4a } from "../inmobiliario-2025/productor"
import { RechazoP4a } from "../inmobiliario-2025/contrato"
import { adaptarTrabajoAnual } from "../trabajo-anual/adaptador"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../../laboral/cotizaciones-perfil-uniforme"
import { calcularRendimientoNetoTrabajo } from "../rendimientos/rendimientos-trabajo"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
const D = Decimal.clone({ precision:80 })
const decimal = (r: ExactoP4a) => new D(r.n.toString()).div(r.d.toString())
const rechazo = (motivo:string) => new RechazoP4a({codigo:"renta-mixta", motivo})
/** Ambas API despachan aquí. Integración, cuotas, deducciones y retenciones una sola vez. */
export const prepararTrabajoAlquilerOrdinario2025 = Effect.fn("Trabajo.prepararAlquilerOrdinario2025")(function* (entrada: CasoTrabajoAlquilerOrdinario2025, cotizacionesModo: "efectivas" | "estimadas-perfil-uniforme" = "efectivas") {
 const decoded = Schema.decodeUnknownResult(CasoTrabajoAlquilerOrdinario2025)(entrada,{onExcessProperty:"error"})
 if(Result.isFailure(decoded)) return yield* rechazo("Alquiler ordinario: esquema fuera del alcance 2025 Asturias/Andalucía/Madrid individual 18–64, sin familia/discapacidad/ahorro/reducciones/compensaciones/otras deducciones: "+String(decoded.failure))
 const c=decoded.success, v=c.inmuebles[0]!
 if(c.censoInmobiliario.inmuebles[0]!==v.id || v.ubicacion!=="resto-espana" || v.primerAlquiler2025!==undefined || v.vaciaExt2025!==undefined || v.cambioHabitual2025!==undefined || v.cambioHabitualBalears2025!==undefined || v.contrato.firma!=="2024-12-01" || v.contrato.desde!=="2024-12-01" || v.gastos.some(g=>g.clase!=="reparacion"))
  return yield* rechazo("Alquiler ordinario: censo único, contrato diciembre2024; sólo reparación corriente, sin extensiones")
 const solicitudAsturias=yield* Effect.try({try:()=>producirSolicitudAsturiasArrendador2025(c),catch:e=>rechazo(String(e))})
 // Conserva el nombre interno anterior para los consumidores comunes de ambas API.
 const solicitudMadrid=solicitudAsturias ?? (yield* Effect.try({try:()=>producirSolicitudMadridArrendador2025(c),catch:e=>rechazo(String(e))}))
 const coste=yield* Effect.try({
  try:()=>costeConstruccion2025(v.adquisicion,v.catastro2025),
  catch:e=>rechazo(e instanceof RangeError?e.message:"Coste de construcción incoherente"),
 })
 // Comparación cruzada exacta: también conserva la garantía en razones periódicas.
 const excede=(importe:string)=>new D(importe).mul(coste.d.toString()).gt(coste.n.toString())
 // Con suelo conocido, ambas bases <=coste. Con desconocido se exige además la cota histórica conservadora.
 // No se solicita ni se inventa la amortización efectivamente deducida en2024.
 if(coste.n<=0n || excede(c.historia2024.construccion) || excede(v.catastro2025.construccion))
  return yield* rechazo("Alquiler ordinario: historia catastral insuficiente para acreditar límite acumulado no vinculante")
 if(c.retenciones.some(r=>r.contribuyenteId!==c.contribuyenteId) || c.trabajo.discapacidadActiva!=="ninguna" || c.conciliacion.contribuyenteId!==c.contribuyenteId || c.trabajo.ejercicio!==2025 || c.trabajo.rendimientos.length!==1 || c.trabajo.rendimientos.some(r=>!["empleo-laboral","empleo-estatutario"].includes(r.clase)))
  return yield* rechazo("Alquiler ordinario: identidad/año laboral incompatible o clase distinta de empleo ordinario")
 if(v.adquisicion.costeSuelo?.estado==="desconocido" && !historiaDesconocidaNoVinculante2025(v.adquisicion,c.historia2024.construccion,coste))
  return yield* rechazo("Alquiler ordinario: historia insuficiente para excluir el límite acumulado con suelo desconocido")
 const ids=[...c.trabajo.rendimientos.map(r=>r.id),...v.exigibilidades.map(r=>r.id),...v.gastos.map(g=>g.id),...c.retenciones.map(r=>r.id)]
 const docs=[...c.conciliacion.procedencia,...v.exigibilidades.map(r=>r.documento),...c.retenciones.map(r=>r.documento)]
 if(new Set(ids).size!==ids.length || new Set(docs).size!==docs.length) return yield* rechazo("Alquiler ordinario: operación/procedencia duplicada entre trabajo, renta, gastos y retenciones")
 const inm=yield* producirCensoInmuebles2025(c, { continuidadDiciembre2024: true })
 const x=inm.inmuebles[0]!
 // El libro legal racional se conserva en ambas rutas; la política operativa se prepara aparte.
 if(x.netoReducido.n<=0n || x.excesoNoAplicado.n!==0n || x.imputacion.n!==0n || x.regimen!=="art23-50")
  return yield* rechazo("Alquiler ordinario: RNR positivo 50%, sin exceso/imputación; pérdidas, excesos e imputaciones fuera de alcance")
 const t=adaptarTrabajoAnual(c.trabajo)
 if(t.estado!=="aporte-disponible") return yield* rechazo("Alquiler ordinario: trabajo fuera del productor art19")
 // Las facturas se identifican y concilian por prestador, número y línea en el censo.
 // La API canónica mantiene su perfil salarial uniforme; no etiqueta la estimación como pago efectivo.
 const cero=new D(0), bruto=new D(t.gastos.integro)
 const cotizacionesEfectivas=c.trabajo.rendimientos.reduce((a,r)=>a.plus(r.cotizaciones.seguridadSocial).plus(r.cotizaciones.derechosPasivos).plus(r.cotizaciones.colegiosHuerfanos),cero)
 const uniforme=cotizacionesModo==="estimadas-perfil-uniforme"
 if(uniforme && c.trabajo.rendimientos.some(r=>r.clase!=="empleo-laboral" || [r.sindicato.importe,r.colegio.importe,r.defensa.importe,r.cotizaciones.derechosPasivos,r.cotizaciones.colegiosHuerfanos].some(x=>!new D(x).isZero())))
  return yield* rechazo("Alquiler ordinario canónico: perfil uniforme laboral sin gastos adicionales; usar la API explícita para gastos efectivos")
 const cotizaciones=uniforme?new D(calcularDesgloseCotizacionesPerfilUniforme({anio:2025,salarioBrutoAnual:bruto}).cotizacionTrabajador):cotizacionesEfectivas
 const trabajoUniforme=uniforme?calcularRendimientoNetoTrabajo({anio:2025,rendimientoIntegro:bruto,cotizacionTrabajador:cotizaciones}):undefined
 const neto=new D(trabajoUniforme?.rendimientoNeto??t.rendimientoAntesArt20), rentaLegal=decimal(inm.neto), rnrLegal=decimal(inm.netoReducido)
 const politicaOpen=uniforme || v.adquisicion.costeSuelo?.estado!=="desconocido" ? undefined : yield* Effect.try({
  try:()=>producirPoliticaAlquilerOpen2025(c),
  catch:e=>rechazo(String(e)),
 })
 const renta=politicaOpen?.neto ?? rentaLegal, rnr=politicaOpen?.netoReducido ?? rnrLegal
 const argumentoArt20=new D(trabajoUniforme?.rendimientoPrevioNeto??t.argumentoArt20)
 const reduccion=calcularReduccionTrabajoConOtrasRentas({anio:2025,rendimientoPrevioNeto:argumentoArt20,otrasRentasNoExentas:renta})
 if(!reduccion.isZero() || neto.lt(0)) return yield* rechazo("Alquiler ordinario: reducción art20 o trabajo negativo fuera del perfil sin reducciones")
 const base=neto.plus(rnr)
 const empleo=c.trabajo.rendimientos.every(r=>r.clase!=="pension")
 if(!empleo && c.trabajo.rendimientos.some(r=>r.clase!=="pension")) return yield* rechazo("Alquiler ordinario: mezcla empleo/pensión requiere conciliación de servicios DA61")
 return {c,inm,neto,renta,rnr,base,bruto,cotizaciones,cero,empleo,politicaOpen,solicitudMadrid}
})
