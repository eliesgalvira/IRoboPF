import Decimal from "decimal.js"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional, type Racional } from "../anual-territorial-racional"
import { evaluarAmpliacionE2025 } from "./index"
import { conciliarFamiliaE38 } from "./anual-conciliacion"
import type { SolicitudE38Anual2025 } from "./anual-esquemas"
import { exige, r, serial, cero, fecha, ids, documento } from "./comun"
import type { R, Contexto, MagnitudMotor, ClaveAnual, Resultado } from "./comun"
const D = Decimal.clone({precision:200})
/** Conversión de un resultado de motor, no de un importe aportado en la API. */
function centimosMotor(v:Decimal):R{
 const s=v.toFixed();exige(/^-?\d+(\.\d+)?$/.test(s),"Magnitud del motor no finita")
 const [entera,fraccion=""]=s.split(".");return r(BigInt(entera+fraccion)*100n,10n**BigInt(fraccion.length))
}
const faltantes:Readonly<Partial<Record<SolicitudE38Anual2025["hechos"]["codigo"],string>>>= {
 rioja_vivienda_habitual_pequenos_municipios:"patrimonio inicial/final ajustado y reserva de base9040/452 por declaración",
 rioja_inversion_vivienda_jovenes_menores_36:"comparación patrimonial ajustada y base de viviendas anteriores/reinversión",
 rioja_obras_rehabilitacion_vivienda_habitual:"patrimonio ajustado y base regional compartida rehabilitación/adecuación9040",
 rioja_adquisicion_construccion_vivienda_jovenes:"patrimonio ajustado y base estatalDT18 sin adecuación/reserva regional9040",
 rioja_segunda_vivienda_medio_rural:"patrimonio ajustado,base estatalDT18 y reserva regional adquisición/segunda vivienda",
 rioja_adecuacion_vivienda_discapacidad:"patrimonio ajustado y reserva de base conjunta rehabilitación/adecuación9040",
 galicia_ayudas_incendios_peifoga_2025:"clasificación e imputación identificada de ayuda a base liquidable;tipos medios estatal/autonómico vinculados a esa imputación",
 galicia_ayudas_deportistas_alto_nivel:"imputación de ayuda deportiva y tipos medios;el ingreso no está identificado en las rentas de APIv4",
 galicia_ayudas_ela_fenotipos:"imputación individual de ayudaELA a base liquidable y tipos medios del ejercicio",
 galicia_ayudas_talidomida:"imputación individual de ayuda por talidomida y tipos medios del ejercicio",
 galicia_libros_texto_material_escolar:"renta2024 por miembro derivada de declaraciones previas;el motor APIv4 solo representa2025",
}
export const PRODUCTORES_PENDIENTES_E38 = faltantes
export function evaluarE38Anual(s:SolicitudE38Anual2025,m:MagnitudesTerritorialesAnuales):Resultado{
 try {const r=evaluarE38ConProductores(s,m);if(r.estado!=="calculo_parcial")throw new RangeError(s.hechos.codigo+": "+r.motivos.join("; "));return r}
 catch(cause){throw new RangeError(s.hechos.codigo+": "+(cause instanceof Error?cause.message:"hechos anuales E38 no representados"))}
}
function evaluarE38ConProductores(s:SolicitudE38Anual2025,m:MagnitudesTerritorialesAnuales):Resultado{
 const h=s.hechos
 exige(faltantes[h.codigo]===undefined,`${h.codigo}: productor anual no representado en APIv4: ${faltantes[h.codigo]??""}`)
 const titularAnual=m.caso.contribuyenteId
 exige(titularAnual!==undefined&&["galicia","la-rioja"].includes(m.caso.comunidadAutonoma),"Titular o territorio anual E38 no representado")
 const id=titularAnual
 exige(ids(s.inversionesViviendaEjercicio.map(i=>i.id)),"Inventario económico de vivienda duplicado")
 for(const i of s.inversionesViviendaEjercicio)exige(i.titular===id&&fecha(i.fecha)&&i.fecha>="2025-01-01"&&i.fecha<="2025-12-31"&&/^\d+(\.\d{1,2})?$/.test(i.importe)&&i.documento.trim().length>0,"Inventario de vivienda ajeno/inválido")
 conciliarFamiliaE38(h,m,s.nacimientoContribuyente)
 const magnitudes:MagnitudMotor[]=[]
 function emitir(clave:ClaveAnual,valor:Decimal|R,nodo:string):void{
  // El canal nominal distingue valores Decimal del motor de racionales internos.
  const exacto="n"in valor?valor:centimosMotor(valor)
  magnitudes.push({clave,exacto:serial(exacto),ejercicio:2025,declarantes:[id],nodoDerivacion:nodo})
 }
 const bi=m.basesImponiblesE38
 exige(bi!==undefined,"Falta productor de bases imponibles E38 antes del límite de liquidables")
 emitir("baseImponibleTotal",new D(bi.general).plus(bi.ahorro),"anual.basesImponibles.general+ahorro")
 emitir("baseLiquidableGeneral",D.max(0,m.baseGeneral),"anual.baseLiquidableGeneral")
 emitir("baseLiquidableAhorro",new D(m.baseAhorro),"anual.baseLiquidableAhorro")
 emitir("minimoPersonalFamiliar",m.minimoPersonalFamiliar,"anual.minimoPersonalFamiliar")
 emitir("cuotaIntegraAutonomica",m.cuotaAutonomica,"anual.cuotaAutonomicaAntesDeducciones")
 // Un código por declaración,una atribución de vehículo en individual; no saldos
 // externos ni otra persona de conjunta que consuma el mismo cupo.
 emitir("cuotaElectricoConsumidaDeclaracion",cero,"anual.reservaVehiculoIndividual.sinSolicitudPrevia")
 emitir("mecenazgoConsumidoDeclaracion",cero,"anual.reservaMecenazgoIndividual.sinSolicitudPrevia")
 const tag=m.caso.situacionFamiliar.discapacidad._tag
 const grado=tag==="Discapacidad65OMas"?65:tag==="Discapacidad33a64"?33:0
 const c:Contexto={ejercicio:2025,territorio:m.caso.comunidadAutonoma==="galicia"?"galicia":"la-rioja",titular:id,modalidad:"individual",declarantes:[id],personas:[{id,nacimiento:s.nacimientoContribuyente,discapacidad:grado},...(m.caso.derechosMinimos?.descendientes??[]).map(f=>({id:f.sujetoId,nacimiento:f.fechaNacimiento,discapacidad:f.discapacidad._tag==="Discapacidad65OMas"?65:f.discapacidad._tag==="Discapacidad33a64"?33:0}))],magnitudes:[],magnitudesMotor:magnitudes,expediente:"completo_todos_pagadores",creditoMecenazgoRioja:"no_aplicado"}
 switch(h.codigo){
  case "galicia_nacimiento_adopcion_hijos":case "rioja_nacimiento_adopcion_hijos":{
   const censos=s.censoHijosPorProgenitor
   exige(censos!==undefined&&ids(censos.map(p=>p.progenitor)),`${h.codigo}: falta censo físico completo de hijos por progenitor para derivar ordinal,sin número fiscal externo`)
   const padres=[...new Set(h.eventos.flatMap(e=>e.progenitores))]
   exige(censos.length===padres.length&&censos.every(p=>padres.includes(p.progenitor)),"Censo de progenitor ajeno o incompleto")
   for(const p of censos){exige(ids(p.hijos.map(x=>x.id)),"Censo de hijos duplicado");const pares=new Set<string>();for(const x of p.hijos){documento(x.soporte);exige(x.id!==p.progenitor&&fecha(x.nacimiento)&&fecha(x.fechaVinculo)&&x.nacimiento<=x.fechaVinculo&&x.fechaVinculo<="2025-12-31"&&x.soporte.fecha>=x.fechaVinculo&&(p.progenitor!==id||x.nacimiento>s.nacimientoContribuyente)&&Number.isInteger(x.prioridadRegistro)&&x.prioridadRegistro>=1,"Identidad/cronología/orden registral de censo inválidos");const k=x.fechaVinculo+":"+x.prioridadRegistro;exige(!pares.has(k),"Prioridad registral duplicada");pares.add(k)}for(const f of m.caso.derechosMinimos?.descendientes??[])if(f.titulares.some(t=>t.titularId===p.progenitor))exige(p.hijos.some(x=>x.id===f.sujetoId&&x.nacimiento===f.fechaNacimiento),"Censo previo omite hijo anual conocido")}
   return evaluarAmpliacionE2025(c,{...h,eventos:h.eventos.map(e=>({...e,hijos:e.hijos.map(x=>({...x,ordenPorProgenitor:e.progenitores.map(t=>{const p=censos.find(p=>p.progenitor===t);exige(p!==undefined,"Progenitor sin censo");const ordenados=[...p.hijos].sort((a,b)=>a.fechaVinculo.localeCompare(b.fechaVinculo)||a.prioridadRegistro-b.prioridadRegistro);const i=ordenados.findIndex(a=>a.id===x.persona.id);exige(i>=0&&ordenados[i].nacimiento===x.persona.nacimiento&&ordenados[i].fechaVinculo===e.fecha,"Evento no conciliado con censo de filiación");return {titular:t,orden:i+1}})}))}))})
  }
 case "galicia_familia_numerosa":return evaluarAmpliacionE2025(c,{...h,eleccion:"numerosa"})
  case "galicia_alquiler_vivienda_habitual":case "rioja_arrendamiento_menores_36":
   exige(s.inversionesViviendaEjercicio.length===0,`${h.codigo}: hay inversión de vivienda,productor de derecho a inversión no representado para esta concurrencia`)
   return evaluarAmpliacionE2025(c,{...h,derechoInversionVivienda:"sin_derecho"})
  case "galicia_climatizacion_agua_caliente_renovables":return evaluarAmpliacionE2025(c,{...h,eleccion:"renovables"})
  case "galicia_obras_eficiencia_energetica":return evaluarAmpliacionE2025(c,{...h,eleccion:"eficiencia"})
  case "galicia_inversion_entidades_nuevas_reciente_creacion":case "galicia_inversion_entidades_nuevas_financiacion":case "galicia_inversion_empresas_agrarias":
   return evaluarAmpliacionE2025(c,{...h,operaciones:h.operaciones.map(o=>({...o,otrasDeduccionesMismaOperacion:[]}))})
  case "galicia_inversion_mab":return evaluarAmpliacionE2025(c,{...h,operaciones:h.operaciones.map(o=>({...o,otrasDeduccionesMismaInversion:[]}))})
  case "galicia_aldeas_modelo":return evaluarAmpliacionE2025(c,{...h,viviendas:h.viviendas.map(v=>({...v,otrasDeduccionesMismaInversion:[]}))})
  case "galicia_adecuacion_inmueble_vacio_arrendamiento":{
   exige(h.viviendas.every(v=>v.alquiler.contrato>="2025-01-01"),`${h.codigo}: arriendo anterior2025 requiere productor de bases históricas por inmueble/origen,ausente en APIv4`)
   return evaluarAmpliacionE2025(c,{...h,viviendas:h.viviendas.map(v=>({...v,baseConsumidaAnterior:"0",basePendienteAnterior:[]}))})
  }
  case "galicia_arrendamiento_viviendas_vacias":
   exige(h.historiaPrimerArriendo.every(v=>v.primerContrato>="2025-01-01"),`${h.codigo}: cuota histórica pendiente requiere productor de saldos por origen,no representado en APIv4`)
   return evaluarAmpliacionE2025(c,h)
  case "rioja_paliar_subida_intereses_hipotecarios":return evaluarAmpliacionE2025(c,{...h,deduccionesElegidas:[]})
  case "rioja_donaciones_fomento_mecenazgo":return evaluarAmpliacionE2025(c,{...h,donaciones:h.donaciones.map(d=>{
   const v=d.valor
   if(v.tipo==="bienes"){exige(v.valorContable!==null,`${h.codigo}: valor segúnIP no derivable;falta valor contable representado`);return {...d,valor:{...v,valorPatrimonio:"0"}}}
   exige(v.tipo!=="usufructo_otros"&&v.tipo!=="deposito_cultural",`${h.codigo}: modalidad necesita productor ITP/interés legal o valoraciónArt18 de depósito no representado`)
   return {...d,valor:v}
  })})
  case "rioja_vehiculos_electricos_nuevos":
   exige(h.vehiculos.every(v=>v.pagos.every(p=>p.pagador===id)),`${h.codigo}: pagador ajeno;atribución de cotitular/tercero no representada en adquisición anual`)
   return evaluarAmpliacionE2025(c,h)
  case "galicia_cuidado_hijos_menores":case "rioja_escuelas_infantiles_pequenos_municipios":case "rioja_hijo_0_3_escolarizado":
  case "rioja_hijo_0_3_pequenos_municipios":case "rioja_menor_acogimiento_guarda_adopcion":case "rioja_fijacion_poblacion_ocupada_medio_rural":
  case "rioja_internet_jovenes_emancipados":case "rioja_luz_gas_jovenes_emancipados":case "galicia_rehabilitacion_centros_historicos":
  case "rioja_cantidades_patrimonio_historico":return evaluarAmpliacionE2025(c,h)
  default:throw new RangeError(`${h.codigo}: no hay productor anual para esta rama;sin importe`)
 }
}
export function racionalE38(v:{readonly numeradorCentimos:string;readonly denominador:string}):Racional{return racional(v.numeradorCentimos,String(BigInt(v.denominador)*100n))}
export type AplicacionE38={readonly pendiente:Racional}
export function saldosE38Anuales(codigos:readonly string[],evaluaciones:ReadonlyMap<number,Resultado>,aplicaciones:readonly AplicacionE38[]){
 const saldos:{codigo:string;tipo:"base"|"cuota";origen:number;caduca:number;importe:Racional;condicion:string;inmueble?:string}[]=[]
 codigos.forEach((codigo,i)=>{
  const resultado=evaluaciones.get(i)
  if(resultado===undefined||resultado.estado!=="calculo_parcial")return
  for(const s of resultado.saldos)saldos.push({codigo,tipo:s.tipo,origen:s.origen,caduca:s.caduca,importe:racionalE38(s.importe),condicion:s.condicion,inmueble:s.inmueble})
  const anos=codigo==="rioja_fijacion_poblacion_ocupada_medio_rural"?3:["galicia_adecuacion_inmueble_vacio_arrendamiento","galicia_arrendamiento_viviendas_vacias"].includes(codigo)?4:0
  const p=aplicaciones[i]?.pendiente
  if(anos>0&&p!==undefined&&BigInt(p.numeradorEuros)>0n)saldos.push({codigo,tipo:"cuota",origen:2025,caduca:2025+anos,importe:p,condicion:codigo.startsWith("galicia_")?"Mantener arriendo y requisitos;no confundir cuota con base pendiente":"Mantener actividad/residencia;aplicación última;sin saldos anteriores consignados"})
 })
 return saldos
}
