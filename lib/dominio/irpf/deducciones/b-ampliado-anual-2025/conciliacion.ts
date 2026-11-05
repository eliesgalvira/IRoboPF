import Decimal from "decimal.js"
import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional } from "../anual-territorial-racional"
import { fecha } from "../asturias-cantabria-hechos-2025/comun"

const D=Decimal.clone({precision:220})
export class RechazoBAnual extends Schema.TaggedErrorClass<RechazoBAnual>()("RechazoBAnual",{motivo:Schema.String}) {}
export function exigirB(ok:boolean,motivo:string):asserts ok {if(!ok)throw new RechazoBAnual({motivo})}
export const esObjetoB=Schema.is(Schema.Record(Schema.String,Schema.Json))
const esLista=Schema.is(Schema.Array(Schema.Json))
const texto=Schema.is(Schema.String)
const numero=Schema.is(Schema.Number)
function textos(v:Schema.Json):readonly string[] {
 exigirB(esLista(v)&&v.every(texto),"Lista de identidades no textual")
 return v
}
function iguales(xs:readonly string[],ys:readonly string[]):boolean {
 return xs.length===ys.length&&new Set(xs).size===xs.length&&new Set(ys).size===ys.length&&xs.every(x=>ys.includes(x))
}
function compararRenta(euros:string,centimos:number):string {
 exigirB(/^-?\d{1,18}(\.\d{1,80})?$/.test(euros),"Renta familiar no decimal exacta")
 exigirB(Number.isSafeInteger(centimos),"Renta anual familiar sin céntimos exactos")
 const a=racional(euros),b=racional(String(centimos),"100")
 exigirB(a.numeradorEuros===b.numeradorEuros&&a.divisor===b.divisor,"Renta familiar contradictoria con derechosMinimos")
 return new D(String(centimos)).div("100").toFixed()
}
/** Conciliación específica de la representación B. No recalcula el derecho al mínimo. */
export function conciliarBAnual(datos:Schema.Json,m:MagnitudesTerritorialesAnuales,propietario=m.caso.contribuyenteId,rol="",codigo=""):Schema.Json {
 if(esLista(datos))return datos.map(x=>conciliarBAnual(x,m,propietario,rol,codigo))
 if(!esObjetoB(datos))return datos
 const contextoCodigo=texto(datos.codigo)?datos.codigo:codigo
 const original=Schema.decodeUnknownSync(Schema.Record(Schema.String,Schema.Json))(datos)
 const out={...original}
 const repartoFamiliar=contextoCodigo==="asturias_familias_numerosas"?datos.reparto:contextoCodigo==="cantabria_acogimiento_familiar_menores"?datos.pareja:undefined
 const miembros=contextoCodigo==="asturias_familias_numerosas"?datos.hijos:contextoCodigo==="cantabria_acogimiento_familiar_menores"?datos.acogidos:undefined
 if(esObjetoB(repartoFamiliar)&&"titulares" in repartoFamiliar){
  exigirB(esLista(miembros)&&miembros.length>0,"Reparto familiar sin descendientes conciliables;falta titularidad territorial familiar")
  const titulares=textos(repartoFamiliar.titulares)
  for(const p of miembros)exigirB(esObjetoB(p)&&"titulares" in p&&iguales(titulares,textos(p.titulares)),"Reparto familiar distinto de los titulares completos de sus descendientes;falta titularidad territorial familiar")
 }
 if(datos.clase==="descendiente"&&esObjetoB(datos.persona)&&texto(datos.persona.id)&&texto(datos.custodia)){
  const sujeto=datos.persona.id
  const d=m.caso.derechosMinimos?.descendientes.find(x=>x.sujetoId===sujeto)
  const t=d?.titulares.find(x=>x.titularId===m.caso.contribuyenteId)
  exigirB(t!==undefined&&(datos.custodia==="compartida")===(t.custodia==="compartida"),"Custodia contradice los derechos anuales")
 }
 if(esObjetoB(datos.hijo)&&texto(datos.hijo.id)&&esObjetoB(datos.resolucion)&&texto(datos.resolucion.fecha)&&texto(datos.inscripcion)){
  const sujeto=datos.hijo.id
  const d=m.caso.derechosMinimos?.descendientes.find(x=>x.sujetoId===sujeto)
  const vinculo=d?.titulares.find(x=>x.titularId===m.caso.contribuyenteId)?.vinculo
  exigirB(vinculo?.clase==="adopcion","Evento adoptivo sin vínculo anual de adopción")
  if(vinculo.fechaConstitucionVinculo!==undefined)exigirB(vinculo.fechaConstitucionVinculo===datos.resolucion.fecha,"Fecha de constitución adoptiva contradictoria con vínculo anual")
  const inscripcion=datos.inscripcion==="no_necesaria"?datos.resolucion.fecha:esObjetoB(datos.registroCivil)&&texto(datos.registroCivil.fecha)?datos.registroCivil.fecha:undefined
  exigirB(inscripcion!==undefined&&vinculo.fechaInicioIncremento<=inscripcion,"Inicio del vínculo posterior a la inscripción adoptiva o inscripción ausente")
 }
 if(datos.relacion==="descendiente"&&esObjetoB(datos.persona)&&esObjetoB(datos.reparto)){
  const sujeto=datos.persona.id;exigirB(texto(sujeto),"Paciente sin sujeto anual")
  const atribuciones=m.atribucionesMinimo?.filter(a=>a.sujetoId===sujeto)??[]
  exigirB(m.sujetosConMinimo.includes(sujeto)&&atribuciones.length===1,"Paciente sin mínimo efectivo calculado")
  exigirB("titulares" in datos.reparto&&iguales(textos(datos.reparto.titulares),atribuciones[0].titulares),"Reparto de paciente no coincide con titulares efectivos completos")
 }
 const id=texto(datos.id)?datos.id:propietario
 if(texto(datos.parentesco)&&"progenitores" in datos){
  exigirB(id!==undefined,"Descendiente sin identidad conciliable")
  exigirB(id!==m.caso.contribuyenteId&&!textos(datos.progenitores).includes(id),"Identidad del descendiente igual al contribuyente o a un progenitor")
  exigirB(datos.parentesco!=="tutela","Tutela sin vínculo personal representado por el marco anual")
 }
 exigirB(datos.relacion!=="conyuge"&&datos.relacion!=="ascendiente"&&datos.clase!=="ascendiente","Cónyuge/ascendiente sin representación personal en el marco anual individual")
 if(texto(datos.nacimiento)){
  exigirB(id!==undefined&&fecha(datos.nacimiento),"Nacimiento sin identidad conciliable o fecha civil inválida")
  const propia=id===m.caso.contribuyenteId
  const d=m.caso.derechosMinimos?.descendientes.find(x=>x.sujetoId===id)
  exigirB(propia||d!==undefined,"Persona no representada por el caso anual:"+id)
  if(propia)exigirB(2025-Number(datos.nacimiento.slice(0,4))===m.caso.situacionFamiliar.edad,"Nacimiento propio contradice edad anual")
  else {
   exigirB(d!==undefined&&datos.nacimiento===d.fechaNacimiento&&2025-Number(datos.nacimiento.slice(0,4))===d.edadDevengo,"Nacimiento/edad de descendiente contradictorios")
   if(texto(datos.rentaNoExenta))out.rentaNoExenta=compararRenta(datos.rentaNoExenta,d.rentasNoExentasCentimos)
   if("declaracionRentas" in datos){
    if(d.declaracion.modalidad==="no-presenta")exigirB(datos.declaracionRentas===null,"Declaración familiar contradice el caso anual")
    else {exigirB(texto(datos.declaracionRentas),"Falta renta de declaración familiar");out.declaracionRentas=compararRenta(datos.declaracionRentas,d.declaracion.rentasCentimos)}
   }
   if("titulares" in datos){
    const atribuciones=m.atribucionesMinimo?.filter(x=>x.sujetoId===id)??[];exigirB(atribuciones.length===1,"Atribución efectiva ausente o duplicada:"+id);const a=atribuciones[0]
    exigirB(m.sujetosConMinimo.includes(id)&&a!==undefined,"Falta atribución efectiva de mínimo para el descendiente:"+id)
    exigirB(a.titulares.every(id=>d.titulares.some(t=>t.titularId===id)),"Atribución con titular no representado en el sujeto anual");exigirB(iguales(textos(datos.titulares),a.titulares),"Conjunto de titulares efectivos incompleto,duplicado o con extras:"+id)
    const seleccionado=d.titulares.find(t=>t.titularId===m.caso.contribuyenteId)
    exigirB(seleccionado!==undefined&&a.titulares.includes(seleccionado.titularId),"Contribuyente no es titular efectivo del sujeto")
    if(datos.parentesco==="hijo"||datos.parentesco==="adoptado")exigirB(seleccionado.grado===1&&["consanguinidad","adopcion"].includes(seleccionado.vinculo.clase),"Vínculo de hijo no coincide con el titular anual")
    if(datos.parentesco==="adoptado")exigirB(seleccionado.vinculo.clase==="adopcion","Adopción declarada contradice vínculo anual")
    if(contextoCodigo==="asturias_adopcion_internacional")exigirB(seleccionado.grado===1&&seleccionado.vinculo.clase==="adopcion","Adopción internacional sin progenitor adoptante anual identificado")
    if(datos.parentesco==="nieto")exigirB(seleccionado.grado>=2&&seleccionado.vinculo.clase==="consanguinidad","Vínculo de nieto no coincide con grado anual")
    if(datos.parentesco==="acogimiento")exigirB(["acogimiento-permanente","guarda-preadoptiva"].includes(seleccionado.vinculo.clase),"Vínculo de acogimiento anual distinto")
    out.gradoTitular=seleccionado.grado
    out.gradosOtrosAscendientes=d.titulares.filter(t=>a.titulares.includes(t.titularId)&&t.titularId!==seleccionado.titularId).map(t=>t.grado)
   }
  }
  const categoria=propia?m.caso.situacionFamiliar.discapacidad._tag:d?.discapacidad._tag
  if("discapacidad" in datos){
   const g=datos.discapacidad===null?0:esObjetoB(datos.discapacidad)&&numero(datos.discapacidad.grado)?datos.discapacidad.grado:undefined
   exigirB(g!==undefined&&Number.isInteger(g)&&g>=0&&g<=100,"Grado de discapacidad no representado")
   exigirB(categoria===(g>=65?"Discapacidad65OMas":g>=33?"Discapacidad33a64":"SinDiscapacidad"),"Discapacidad contradictoria con categoría anual:"+id)
  }
 }
 if(rol==="empleadores"){
  exigirB(id===m.caso.contribuyenteId,"Empleador sin identidad anual propia")
  out.porcentajeReparto="100" // Único empleador propio admitido;otra identidad se rechaza,no se recibe un porcentaje calculado.
  const origen=m.nodosFiscalesB2025?.cuotaTrabajoActividad?.origen
  exigirB(origen!==undefined,"Falta separación anual de trabajo/actividad del empleador;perfil general mixto")
  if(origen==="solo-trabajo"){
   exigirB(m.rentasTrabajoAnuales!==undefined,"Falta magnitud anual de trabajo para ayuda doméstica")
   out.rendimientosTrabajo=m.rentasTrabajoAnuales.integroTrabajo.toFixed();out.rendimientosActividad="0"
  }else{
   exigirB(m.rentaActividadAnualB!==undefined,"Falta rendimiento anual de actividad calculado por motor")
   out.rendimientosTrabajo="0";out.rendimientosActividad=m.rentaActividadAnualB.toFixed()
  }
 }
 // Nombres personales sin nacimiento (p.ej. ELA): comprobar identidad por rol.
 if(texto(datos.beneficiario))exigirB(datos.beneficiario===m.caso.contribuyenteId,"Ayuda de otro contribuyente")
 if((rol==="discapacidades"||rol==="discapacidad")&&numero(datos.grado)){
  const propia=id===m.caso.contribuyenteId,d=m.caso.derechosMinimos?.descendientes.find(x=>x.sujetoId===id)
  exigirB(propia||d!==undefined,"Discapacidad sin persona anual")
  const cat=propia?m.caso.situacionFamiliar.discapacidad._tag:d?.discapacidad._tag
  exigirB(cat===(datos.grado>=65?"Discapacidad65OMas":datos.grado>=33?"Discapacidad33a64":"SinDiscapacidad"),"Grado propio/familiar contradice la categoría anual")
 }
 for(const [k,v] of Object.entries(out))out[k]=conciliarBAnual(v,m,id,k,contextoCodigo)
 if(contextoCodigo==="asturias_familias_monoparentales"&&"cambioSituacion" in datos){
  exigirB(datos.cambioSituacion===null,"Falta renta computable del período familiar tras cambio de situación,art.12DL2/2014;no se sustituye por renta anual")
  exigirB(m.rentaNoExentaAntesReduccionesB!==undefined,"Falta renta anual antes de reducciones para composición monoparental")
  out.rentaPeriodo=m.rentaNoExentaAntesReduccionesB.toFixed()
 }
 return out
}
export type ReferenciaPagoB={readonly id:string;readonly documento:string;readonly pagador:string}
export function extraerPagosB(datos:Schema.Json):readonly ReferenciaPagoB[] {
 if(esLista(datos))return datos.flatMap(extraerPagosB)
 if(!esObjetoB(datos))return []
 const propios:ReferenciaPagoB[]=[]
 if("euros" in datos&&"pagador" in datos){
  exigirB(texto(datos.id)&&texto(datos.documento)&&texto(datos.pagador),"Pago sin identidad,documento o pagador")
  propios.push({id:datos.id,documento:datos.documento,pagador:datos.pagador})
 }
 return [...propios,...Object.values(datos).flatMap(extraerPagosB)]
}
