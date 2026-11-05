import type { HechosAnualesTerritoriales } from "../anual-territorial-tipos"
import { eleccionesTerritorialesB } from "./conciliacion-lotes"
import { Schema,Result } from "effect"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional,type Racional } from "../anual-territorial-racional"
import { evaluarAmpliacionB2025,resolverDependenciaAnualB,type ResultadoAmpliacion,type RegimenPosterior } from "../asturias-cantabria-ampliacion-2025"
import { SolicitudBAmpliadoAnual,HechosBParaEvaluacionAnual,CodigosBConElecciones } from "./esquemas"
import { RechazoBAnual,exigirB,esObjetoB,conciliarBAnual,extraerPagosB,type ReferenciaPagoB } from "./conciliacion"
export { SolicitudBAmpliadoAnual }
export type MagnitudesBObservadas={readonly baseGeneral:string;readonly baseAhorro:string;readonly minimoPersonalFamiliar:string;readonly cuotaAutonomica:string}
export type GeneracionBAnual=
 | {readonly codigo:string;readonly estado:"excluida";readonly motivo:string;readonly rastro:readonly string[];readonly pagos:readonly ReferenciaPagoB[]}
 | {readonly codigo:string;readonly estado:"generada";readonly generado:Racional;readonly reservas:readonly string[];readonly evaluacion:ResultadoAmpliacion;readonly pagos:readonly ReferenciaPagoB[];readonly regimenPosterior?:RegimenPosterior}
export type ResultadoAdaptadorB=
 | {readonly estado:"no_soportado";readonly motivo:string;readonly magnitudes?:MagnitudesBObservadas}
 | {readonly estado:"generaciones_preparadas";readonly generaciones:readonly GeneracionBAnual[];readonly magnitudes:MagnitudesBObservadas;readonly aplicacionCuota:"libro_comun_pendiente";readonly aceptacionFiscal:"pendiente"}
function magnitudes(m:MagnitudesTerritorialesAnuales):MagnitudesBObservadas {
 const valores={baseGeneral:m.baseGeneral.toFixed(),baseAhorro:m.baseAhorro.toFixed(),minimoPersonalFamiliar:m.minimoPersonalFamiliar.toFixed(),cuotaAutonomica:m.cuotaAutonomica.toFixed()}
 for(const v of Object.values(valores))exigirB(/^-?\d{1,18}(\.\d{1,80})?$/.test(v),"Magnitud anual no finita o fuera del contrato80decimales")
 return valores
}
/** Prepara generaciones, no liquida. El dispatcher y el libro común permanecen fuera. */
export function prepararBAmpliadoAnual(solicitudes:readonly SolicitudBAmpliadoAnual[],m:MagnitudesTerritorialesAnuales,universo:readonly HechosAnualesTerritoriales[]=solicitudes):ResultadoAdaptadorB {
 let observadas:MagnitudesBObservadas|undefined
 try {
  exigirB(solicitudes.length<=37,"Máximo37 solicitudes B ampliadas por lote");const c=m.caso
  exigirB(c.anio===2025&&c.situacionFamiliar.tipo==="individual"&&c.fechaFallecimiento===undefined&&c.contribuyenteId!==undefined&&c.contribuyenteId.trim()!=="","Ámbito B anual:2025 individual ordinario con identidad")
  const contribuyente=c.contribuyenteId
  exigirB(c.comunidadAutonoma==="asturias"||c.comunidadAutonoma==="cantabria","Territorio fuera de lote B")
  exigirB(c.derechosMinimos===undefined||c.derechosMinimos.contribuyenteId===contribuyente,"Contribuyente de derechosMinimos contradictorio")
  if(c.derechosMinimos!==undefined)exigirB(c.derechosMinimos.ejercicio===2025&&c.derechosMinimos.territorio===c.comunidadAutonoma&&c.derechosMinimos.modalidad==="individual"&&c.derechosMinimos.devengo==="2025-12-31"&&c.derechosMinimos.edadContribuyenteDevengo===c.situacionFamiliar.edad&&c.derechosMinimos.discapacidadContribuyente._tag===c.situacionFamiliar.discapacidad._tag,"Derechos mínimos de otro ámbito anual");observadas=magnitudes(m)
  const codigos=new Set<string>(),ids=new Set<string>(),documentos=new Set<string>()
  const generaciones:GeneracionBAnual[]=[]
  const recibidas=solicitudes.map(entrada=>{const decoded=Schema.decodeUnknownResult(SolicitudBAmpliadoAnual)(entrada,{onExcessProperty:"error"})
   exigirB(Result.isSuccess(decoded),"Solicitud B ampliada no cerrada:hechos inválidos o magnitud anual externa")
   return decoded.success})
  const elecciones=eleccionesTerritorialesB(universo,contribuyente)
  for(const s of recibidas){const h=s.hechos,codigo=h.codigo
   exigirB(!codigos.has(codigo),"Código B ampliado duplicado:"+codigo);codigos.add(codigo)
   exigirB(codigo.startsWith(c.comunidadAutonoma+"_"),"Deducción de otro territorio:"+codigo)
   const json=Schema.decodeUnknownSync(Schema.Json)(h)
   let hechos=conciliarBAnual(json,m)
   if(CodigosBConElecciones.has(codigo)){exigirB(esObjetoB(hechos),"Hechos no estructurados");const registro=Schema.decodeUnknownSync(Schema.Record(Schema.String,Schema.Json))(hechos);hechos={...registro,usos:elecciones.filter(e=>e.codigo!==codigo)}}
   const pagos=extraerPagosB(hechos),locales=new Set<string>(),docsLocales=new Set<string>()
   for(const p of pagos){
    exigirB(!ids.has(p.id)&&!locales.has(p.id),"Pago duplicado:"+p.id)
    exigirB(!documentos.has(p.documento),"Documento monetario usado por otro código:"+p.documento)
    locales.add(p.id);docsLocales.add(p.documento)
   }
   locales.forEach(id=>ids.add(id));docsLocales.forEach(id=>documentos.add(id))
   const nodos=m.nodosFiscalesB2025
   if(nodos!==undefined)exigirB(nodos.ejercicio===2025&&nodos.contribuyente===contribuyente&&nodos.liquidacion.trim()!=="","Nodos fiscales B de otra persona/ejercicio o sin origen")
   if(codigo==="asturias_ayudas_ela"){
    exigirB(nodos?.tiposMediosGenerales!==undefined,"Falta productor motor:tiposMediosGenerales2025 art.63.2/74.2 y ayudaELAIntegrada2025")
    throw new RechazoBAnual({motivo:"Falta ayudaELAIntegrada2025 por ayudaId/base imponible/base liquidable;tipos generales producidos no acreditan imputación de la ayuda"})
   }
   if(codigo==="cantabria_traslado_residencia_motivos_laborales_despoblamiento")exigirB(nodos?.cuotaTrabajoActividad!==undefined,"Falta cuotaAutonomicaTrabajoActividad2025:base general mixta o procedencia no representada,art.2.11.3DL62/2008")
   if(codigo==="cantabria_donativos_fundaciones_fondo_cantabria_coopera_discapacidad")throw new RechazoBAnual({motivo:"Falta productor motor:basesDonativosEstatales2025(68.3/68.5),art.2.4DL62/2008;la base liquidable está disponible pero no se suponen ceros estatales"})
   const evaluables=Schema.decodeUnknownResult(HechosBParaEvaluacionAnual)(hechos,{onExcessProperty:"error"})
   exigirB(Result.isSuccess(evaluables),"Hechos conciliados incompatibles con contrato recibido")
   const marco={ejercicio:2025 as const,territorio:c.comunidadAutonoma,modalidad:"individual" as const,contribuyente:contribuyente,declarantes:[contribuyente],baseGeneral:observadas.baseGeneral,baseAhorro:observadas.baseAhorro,exhaustividad:"completa" as const}
   let evaluacion=evaluarAmpliacionB2025(marco,evaluables.success)
   if(evaluacion.estado==="dependencia_anual"){
    const rural=evaluacion.formula.clase==="residencia_rural_cuota"
    exigirB(rural||evaluacion.formula.clase==="traslado_rural_trabajo","Dependencia anual B sin productor tipado")
    const valor=rural?observadas.cuotaAutonomica:nodos?.cuotaTrabajoActividad?.importe
    exigirB(valor!==undefined,"Falta componente de cuota de trabajo/actividad del motor")
    evaluacion=resolverDependenciaAnualB(marco,evaluacion.formula,[{ejercicio:2025,contribuyente:contribuyente,liquidacion:nodos?.liquidacion??`motor-anual:2025:${contribuyente}`,concepto:rural?"cuota_integra_autonomica_2025":"cuota_integra_autonomica_2025_trabajo_actividad",valor}])
   }
   if(evaluacion.estado==="excluida"){generaciones.push({codigo,estado:"excluida",motivo:evaluacion.motivo,rastro:evaluacion.rastro,pagos});continue}
   if(evaluacion.estado==="no_soportado"){
    throw new RechazoBAnual({motivo:evaluacion.motivo})
   }
   exigirB(evaluacion.estado==="calculo_parcial","Evaluación sin generación exacta")
   const generado=racional(evaluacion.importeExacto.numeradorEuros,evaluacion.importeExacto.divisor)
   exigirB(!generado.numeradorEuros.startsWith("-"),"Generación negativa")
   const base={codigo,estado:"generada" as const,generado,reservas:evaluacion.pendientes,evaluacion,pagos}
   generaciones.push(evaluacion.regimenPosterior===undefined?base:{...base,regimenPosterior:evaluacion.regimenPosterior})
  }
  return {estado:"generaciones_preparadas",generaciones,magnitudes:observadas,aplicacionCuota:"libro_comun_pendiente",aceptacionFiscal:"pendiente"}
 }catch(e){
  if(Schema.is(RechazoBAnual)(e))return observadas===undefined?{estado:"no_soportado",motivo:e.motivo}:{estado:"no_soportado",motivo:e.motivo,magnitudes:observadas}
  throw e
 }
}
