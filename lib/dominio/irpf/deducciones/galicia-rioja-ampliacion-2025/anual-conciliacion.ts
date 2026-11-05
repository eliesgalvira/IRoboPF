import { Schema } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import type { HechosE38Anuales } from "./anual-esquemas"
import { edad, exige, ids } from "./comun"
const objeto=Schema.is(Schema.Record(Schema.String,Schema.Json))
const lista=Schema.is(Schema.Array(Schema.Json))
const texto=Schema.is(Schema.String)
const numero=Schema.is(Schema.Number)
function mismos(a:readonly string[],b:readonly string[]):boolean{return ids(a)&&ids(b)&&a.length===b.length&&a.every(x=>b.includes(x))}
export function conciliarFamiliaE38(h:HechosE38Anuales,m:MagnitudesTerritorialesAnuales,nacimientoPropio:string):void{
 const titularAnual=m.caso.contribuyenteId
 exige(titularAnual!==undefined&&edad(nacimientoPropio)===m.caso.situacionFamiliar.edad,"Nacimiento propio contradictorio con edad anual E38")
 const titular=titularAnual
 function persona(id:string,nacimiento:Schema.Json|undefined,grado:Schema.Json|undefined):void{
  const propia=id===titular
  const f=m.caso.derechosMinimos?.descendientes.find(d=>d.sujetoId===id)
  exige(propia||f!==undefined,"Persona E38 sin identidad anual representada: "+id)
  if(texto(nacimiento))exige(propia?nacimiento===nacimientoPropio:nacimiento===f?.fechaNacimiento,"Nacimiento familiar E38 contradictorio: "+id)
  if(numero(grado)){const tag=(propia?m.caso.situacionFamiliar.discapacidad:f?.discapacidad)?._tag;exige(tag===(grado>=65?"Discapacidad65OMas":grado>=33?"Discapacidad33a64":"SinDiscapacidad"),"Discapacidad E38 contradictoria: "+id)}
 }
 function titularesMinimo(v:Schema.Json,id:string):void{
  exige(lista(v)&&v.every(texto),"Titulares sin identidad en E38")
  const a=m.atribucionesMinimo?.find(a=>a.sujetoId===id)?.titulares??[]
  exige(mismos(v,a),"Titulares del mínimo anual E38 incompletos,ajenos o contradictorios: "+id)
 }
 function recorrer(x:Schema.Json):void{
  if(lista(x)){x.forEach(recorrer);return}if(!objeto(x))return
  const p=objeto(x.persona)?x.persona:undefined
  const sujeto=p!==undefined&&texto(p.id)?p.id:texto(x.id)&&texto(x.nacimiento)?x.id:undefined
  if(texto(x.id)&&(texto(x.nacimiento)||numero(x.discapacidad)))persona(x.id,x.nacimiento,x.discapacidad)
  if("titularesMinimo"in x){exige(sujeto!==undefined,"Titulares del mínimo sin hijo E38");titularesMinimo(x.titularesMinimo,sujeto)}
  if(p!==undefined&&sujeto!==undefined){
   const f=m.caso.derechosMinimos?.descendientes.find(d=>d.sujetoId===sujeto)
   exige(f!==undefined,"Hijo E38 ajeno a los hechos anuales")
   if(lista(x.convivientes)&&x.convivientes.every(texto)){const conv=f.titulares.filter(t=>t.relacion==="convivencia").map(t=>t.titularId);exige(mismos(x.convivientes,conv),"Convivencia E38 contradictoria con vínculo anual: "+sujeto)}
   if(lista(x.progenitores)){const padres=x.progenitores.map(p=>texto(p)?p:objeto(p)&&texto(p.id)?p.id:"");exige(mismos(padres,f.titulares.map(t=>t.titularId)),"Progenitores E38 ajenos o incompletos: "+sujeto)}
   if(lista(x.titularesDeduccion)&&x.titularesDeduccion.every(texto))exige(lista(x.titularesMinimo)&&x.titularesMinimo.every(texto)&&mismos(x.titularesDeduccion,x.titularesMinimo)&&x.titularesDeduccion.includes(titular),"Titulares de deducción E38 distintos del ámbito anual representado;falta productor de derecho particular del cotitular")
  }
  for(const value of Object.values(x))recorrer(value)
 }
 recorrer(Schema.decodeUnknownSync(Schema.Json)(h))
 if(h.codigo==="galicia_nacimiento_adopcion_hijos"||h.codigo==="rioja_nacimiento_adopcion_hijos"){
  for(const e of h.eventos)for(const hijo of e.hijos){const f=m.caso.derechosMinimos?.descendientes.find(d=>d.sujetoId===hijo.persona.id);exige(f!==undefined,"Evento E38 sin hijo anual");exige(mismos(e.progenitores,f.titulares.map(t=>t.titularId)),"Progenitores del evento E38 incompatibles");const vinculo=f.titulares.find(t=>t.titularId===titular)?.vinculo;exige(e.tipo==="nacimiento"?f.fechaNacimiento===e.fecha:vinculo?.clase==="adopcion"&&vinculo.fechaConstitucionVinculo===e.fecha,"Fecha/tipo de nacimiento o adopción E38 contradictorios")}
 }
 if(h.codigo==="rioja_hijo_0_3_pequenos_municipios")for(const mes of h.meses)for(const x of mes.titularesPorHijo)titularesMinimo(x.titulares,x.hijo)
 if(h.codigo==="galicia_familia_numerosa"){
  exige(mismos(h.hijos.map(x=>x.persona.id),m.sujetosConMinimo),"Familia numerosa E38 no exhaustiva respecto de descendientes anuales")
  const padres=[...new Set((m.caso.derechosMinimos?.descendientes??[]).flatMap(f=>f.titulares.map(t=>t.titularId)))]
  exige(mismos(h.titulares,padres)&&h.titulares.includes(titular),"Titulares de familia numerosa ajenos/incompletos;derechos particulares fuera del ámbito anual representado")
 }
 if(h.codigo==="galicia_inversion_entidades_nuevas_reciente_creacion"||h.codigo==="galicia_inversion_entidades_nuevas_financiacion"||h.codigo==="galicia_inversion_empresas_agrarias"||h.codigo==="galicia_inversion_mab")exige(h.operaciones.every(o=>o.titular===titular),"Inversión E38 de otro contribuyente no representado por la anual")
}
