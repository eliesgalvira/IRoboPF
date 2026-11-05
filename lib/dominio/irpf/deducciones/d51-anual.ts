import { evaluarVaciaExt2025 } from "../inmobiliario-2025/consumidor-ext"
import { evaluarInversionExt2025 } from "./extremadura-inversion-anual-2025"
import type { GeneracionEstatal681 } from "./inversion-681-2025"
import type { SolicitudDeduccionesTerritoriales2025 as SolicitudComun } from "./anual-territorial-esquemas"
import { ingresoRegionalELA2025 } from "../ingresos-identificados-2025/regiones"
// Archivo aditivo D; los productores reciben exclusivamente resultados internos de la composición.
import Decimal from "decimal.js"
import { Schema, Result } from "effect"
import type { MagnitudesTerritorialesAnuales } from "./anual-territorial"
import { SolicitudD51 } from "./d51-anual-esquemas"
import * as CLM from "./castilla-la-mancha-hechos-2025"
import * as CYL from "./castilla-y-leon-hechos-2025"
import * as EXT from "./extremadura-hechos-2025"
import { racional } from "./anual-territorial-racional"
const A=Decimal.clone({precision:200})
const esObjeto=Schema.is(Schema.Record(Schema.String,Schema.Json))
const esLista=Schema.is(Schema.Array(Schema.Json))
const esTexto=Schema.is(Schema.String)
const esNumero=Schema.is(Schema.Number)
function exigir(b:boolean,motivo:string):asserts b {if(!b)throw new RangeError(motivo)}
function texto(v:Schema.Json|undefined):string {exigir(esTexto(v)&&v.trim().length>0,"Identidad/campo D51 ausente");return v}
function euros(v:string):Decimal {exigir(/^-?(0|[1-9]\d{0,13})(\.\d{1,80})?$/.test(v),"Decimal D51 inválido");return new A(v)}
function conjunto(a:readonly string[],b:readonly string[]):boolean{return a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x))}
function finito(divisor:string):void {let d=BigInt(divisor);while(d>0n&&d%2n===0n)d/=2n;while(d>0n&&d%5n===0n)d/=5n;exigir(d===1n,"D51: reparto periódico sin transporte racional del evaluador; no aproximar a80dígitos")}
export function crearSesionD51(m:MagnitudesTerritorialesAnuales) {
 const propio=texto(m.caso.contribuyenteId)
 let bases9af=new A(0)
 const marco={ejercicio:2025,territorio:m.caso.comunidadAutonoma,contribuyente:propio,declarantes:[propio],modalidad:"individual",baseGeneral:m.baseGeneral.toFixed(),baseAhorro:m.baseAhorro.toFixed(),minimoPersonalFamiliar:m.minimoPersonalFamiliar.toFixed()}
 function liquidable():Decimal {const p=m.basesLiquidables;exigir(p!==undefined,"D51: productor interno basesLiquidables no disponible");return new A(p.general).plus(p.ahorro)}
 function magnitud(campo:string,codigo:string,datos:Schema.JsonObject) {
  let concepto:string,valor:Decimal
  switch(campo){
   case "deduccionEstatal": {
    const libro=m.vehiculoDA58
    exigir(libro!==undefined,"D51: DA58 requiere hechos de adquisición y libro interno; anticipos/historia no producidos no equivalen a cero")
    exigir(texto(datos.id)===libro.vehiculoId&&libro.contribuyente===propio,"D51: DA58 de otro vehículo/persona")
    concepto="deduccion_estatal_mismo_vehiculo_para_declaracion:"+libro.vehiculoId;valor=new A(libro.generada);break
   }
   case "baseLiquidable":concepto="base_liquidable_total";valor=liquidable();break
   case "baseMenosMinimo":concepto="base_imponible_menos_minimo_personal_familiar";valor=new A(m.baseGeneral).plus(m.baseAhorro).minus(m.minimoPersonalFamiliar);break
   case "minimoDescendientes":concepto="minimo_descendientes";exigir(m.componentesMinimoEstatal!==undefined,"D51: productor interno componentesMinimoEstatal no disponible");valor=new A(m.componentesMinimoEstatal.descendientes);break
   case "cuotaAutonomica":concepto="cuota_integra_autonomica";valor=new A(m.cuotaAutonomica);break
   case "otrasBases9af":concepto="otras_bases_conjunto_9a_f";valor=bases9af;break
   case "baseLiquidableInicial":
    exigir(texto(datos.fechaTraslado).startsWith("2025-"),"D51: base liquidable del año inicial2024 no modelada");concepto="base_liquidable_inicio_periodo";valor=liquidable();break
   case "cuotaTrabajoActividad":
    exigir(m.rentasTrabajoAnuales!==undefined&&m.rentasTrabajoAnuales.integroTrabajo.gt(0)&&m.rentasTrabajoAnuales.restoRentas.eq(0)&&m.baseAhorro.eq(0),"D51: cuota atribuible a trabajo/actividad no modelada para rentas mixtas o actividad aislada")
    concepto="cuota_autonomica_trabajo_actividad";valor=new A(m.cuotaAutonomica);break
   case "baseLiquidableIndividual":case "base":
    exigir(texto(datos.id)===propio,"D51: bases liquidables de otra persona no modeladas");concepto="base_liquidable_individual:"+propio;valor=liquidable();break
   default:throw new RangeError("D51 "+codigo+": productor anual no modelado para "+campo+"; no aceptar importe fiscal externo ni suponer cero")
  }
  exigir(valor.isFinite()&&valor.sd()<=80,"D51: magnitud anual excede80dígitos significativos o no es finita")
  return {ejercicio:2025,declarantes:[propio],concepto,valor:valor.toFixed()}
 }
 function faltaFiscal(campo:string,datos:Schema.JsonObject):never {throw new RangeError("D51: "+campo+" de "+texto(datos.id)+" no derivable de la anual (rentas incluidas exentas/Patrimonio); no pedir cálculo ajeno")}
 function persona(id:string){const p=m.caso.derechosMinimos?.descendientes.find(p=>p.sujetoId===id);exigir(p!==undefined,"D51: persona familiar sin censo anual modelado: "+id);return p}
 function hijoFilial(id:string){const p=persona(id),t=p.titulares.find(t=>t.titularId===propio);exigir(t!==undefined&&t.grado===1&&["consanguinidad","adopcion"].includes(t.vinculo.clase),"D51: conexión filial de primer grado no conciliada; otros escenarios familiares no modelados");return p}
 function minimo(id:string){exigir(m.sujetosConMinimo.includes(id),"D51: sujeto sin mínimo anual conciliado: "+id)}
 function recorrer(x:Schema.Json,clave=""):void {
  if(esLista(x)){
   if(["hijosExclusivos","hijosMinimoExclusivo"].includes(clave))for(const v of x){const id=texto(v);minimo(id);hijoFilial(id);const titulares=m.atribucionesMinimo?.find(a=>a.sujetoId===id)?.titulares;exigir(titulares!==undefined&&conjunto(titulares,[propio]),"D51: mínimo exclusivo no producido por anual: "+id)}
   if(clave==="discapacitados65")for(const v of x){const id=texto(v);minimo(id);exigir(persona(id).discapacidad._tag==="Discapacidad65OMas","D51: discapacidad65 no conciliada")}
   if(["titulares","titularesMinimo","titularesConDerecho","titularesMismoGradoElegibles","adquirentes"].includes(clave)){
    const ids=x.map(texto);exigir(ids.length>0&&new Set(ids).size===ids.length,"D51: titulares vacíos/duplicados")
    finito(racional("1",String(ids.length)).divisor)
    if(clave==="titularesConDerecho")exigir(conjunto(ids,[propio]),"D51: elegibilidad fiscal de otros arrendatarios no modelada")
    for(const id of ids)exigir(id===propio||m.caso.derechosMinimos?.descendientes.some(p=>p.titulares.some(t=>t.titularId===id))===true,"D51: titular ajeno al censo anual: "+id)
   }
   x.forEach(v=>recorrer(v,clave));return
  }
  if(!esObjeto(x))return
  if(esTexto(x.pagador))exigir(x.pagador===propio||m.caso.derechosMinimos?.descendientes.some(p=>p.titulares.some(t=>t.titularId===x.pagador))===true,"D51: pagador ajeno a personas representadas por la anual")
  if(esTexto(x.nacimiento)&&!esTexto(x.id)&&!esTexto(x.persona)&&!esTexto(x.hijo))exigir(2025-Number(x.nacimiento.slice(0,4))===m.caso.situacionFamiliar.edad,"D51: nacimiento propio contradice edad anual")
  if(esNumero(x.grado)&&!esTexto(x.id)&&!esTexto(x.persona)&&!esTexto(x.hijo)){
   const esperado=x.grado>=65?"Discapacidad65OMas":x.grado>=33?"Discapacidad33a64":"SinDiscapacidad"
   exigir(m.caso.situacionFamiliar.discapacidad._tag===esperado,"D51: discapacidad propia contradictoria con la anual")
  }
  if(esTexto(x.id)&&esTexto(x.nacimiento)&&esLista(x.titulares)){
   const p=persona(x.id);const ids=x.titulares.map(texto)
   exigir(conjunto(ids,p.titulares.map(t=>t.titularId)),"D51: titulares de acogido incompletos/no conciliados")
   if(esTexto(x.adopcion))exigir((x.adopcion==="si")===p.titulares.some(t=>t.vinculo.clase==="adopcion"),"D51: adopción contradictoria con vínculo anual")
  }
  if(esTexto(x.id)&&esLista(x.titularesMismoGradoElegibles)){minimo(x.id);const p=persona(x.id);exigir(p.titulares.every(t=>t.grado===p.titulares[0].grado),"D51: prelación familiar de grados distintos no modelada")}
  for(const [k,v] of Object.entries(x))recorrer(v,k)
 }
 function evaluar(entrada:SolicitudD51):CLM.ResultadoHechos & { readonly estatal681?:GeneracionEstatal681 } {
  const decoded=Schema.decodeUnknownResult(SolicitudD51)(entrada,{onExcessProperty:"error"})
  exigir(Result.isSuccess(decoded),"D51: contrato inválido o magnitudes fiscales externas")
  const s=decoded.success
  const comprobables=[m.baseGeneral,m.baseAhorro,m.minimoPersonalFamiliar]
  exigir(comprobables.every(v=>v.isFinite()&&v.sd()<=80),"D51: marco anual excede80dígitos significativos; no recortar ni redondear una frontera fiscal")
  exigir(m.caso.anio===2025&&m.caso.situacionFamiliar.tipo==="individual"&&m.caso.fechaFallecimiento===undefined,"D51: solo2025 individual ordinaria")
  const territorio=s.codigo.startsWith("clm_")?"castilla-la-mancha":s.codigo.startsWith("cyl_")?"castilla-y-leon":"extremadura"
  exigir(territorio===m.caso.comunidadAutonoma,"D51: deducción de otro territorio")
  if(s.codigo==="extremadura_inversion_acciones_participaciones_mercantiles" && "perfil" in s.hechos)return evaluarInversionExt2025(s.hechos,m)
  const dinero=new Set<string>()
  function validarPagos(x:Schema.Json):void {
   if(esLista(x)){x.forEach(validarPagos);return}
   if(!esObjeto(x))return
   if(esTexto(x.id)&&("importe" in x||"valor" in x)){exigir(!dinero.has(x.id),"D51: pago/operación duplicado dentro de solicitud: "+x.id);dinero.add(x.id)}
   Object.values(x).forEach(validarPagos)
  }
  validarPagos(s.hechos)
  recorrer(s.hechos)
  if(s.codigo==="cyl_movilidad_sostenible"){
   const libro=m.vehiculoDA58
   exigir(libro!==undefined,"D51: deduccionEstatal requiere productor DA58 por hechos; no suponer cero")
   const v=libro.hechos.vehiculo
   exigir(s.hechos.vehiculos.length===1,"D51: primer perfil movilidad un único vehículo")
   const r=s.hechos.vehiculos[0]
   exigir(r!==undefined&&r.id===v.id&&r.tipo==="electrico"&&euros(r.wltp).eq(v.autonomiaWLTP)&&euros(r.precio).eq(libro.valor)&&r.fechaMatricula===v.primeraMatriculacion&&r.afectacion==="no"&&conjunto(r.adquirentes,[propio]),"D51: vehículo/precio/clasificación/titular no conciliados con DA58")
   exigir(r.pagos.length===v.pagos.length&&r.pagos.every(p=>v.pagos.some(q=>q.id===p.id&&q.fecha===p.fecha&&q.pagador===p.pagador&&euros(q.importe).eq(p.importe))),"D51: pagos regionales no coinciden con libro DA58")
  }
  if("personaTrasladada" in s.hechos)exigir(s.hechos.personaTrasladada===propio,"D51: persona trasladada no representada en anual individual")
  if(s.codigo==="extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler")exigir(euros(s.hechos.ayudaReconocida).eq(0),"D51 H2: ayuda reconocida positiva sin cronología/atribución fiscal; no calcular cero")
  if(s.codigo==="extremadura_vivienda_zonas_rurales")exigir(euros(s.hechos.ayudasJunta).eq(0),"D51 H3: ayudas Junta sin cronología/atribución fiscal; no calcular cero")
  if(s.codigo==="extremadura_contribuyentes_viudos")exigir(conjunto(s.hechos.descendientes.map(p=>p.id),m.sujetosConMinimo),"D51: censo de descendientes para viudedad no exhaustivo")
  if(s.codigo==="clm_familia_monoparental")for(const h of s.hechos.hijos)hijoFilial(h.id)
  if(s.codigo==="clm_acogimiento_familiar_no_remunerado_menores"||s.codigo==="extremadura_acogimiento_menores"){
   for(const acogido of s.hechos.personas){const v=persona(acogido.id).titulares.find(t=>t.titularId===propio)?.vinculo
    exigir(v!==undefined,"D51: acogido sin vínculo anual propio")
    if(s.codigo==="clm_acogimiento_familiar_no_remunerado_menores"&&"adopcion" in acogido&&acogido.adopcion==="si")continue
    exigir(["acogimiento-permanente","guarda-preadoptiva","acogimiento-temporal","acogimiento-urgencia","guarda-judicial"].includes(v.clase),"D51: vínculo anual no es acogimiento; historia previa/transformación no modelada")
    if("fechaConstitucionVinculo" in v&&v.fechaConstitucionVinculo!==undefined)exigir(acogido.inicio>=v.fechaConstitucionVinculo,"D51: acogimiento anterior al vínculo anual constituido")
   }
  }
  if(s.codigo==="clm_acogimiento_no_remunerado_mayores_65_discapacidad")for(const acogido of s.hechos.personas){const t=persona(acogido.id).titulares.find(t=>t.titularId===propio);exigir(t!==undefined,"D51: relación de persona acogida no modelada");if(t.vinculo.clase==="consanguinidad")exigir(acogido.parentesco===t.grado,"D51: parentesco declarado contradice el censo anual")}
  if(s.codigo==="extremadura_arrendamiento_vivienda_habitual")for(const contrato of s.hechos.contratos)exigir(conjunto(contrato.titulares,[propio]),"D51: elegibilidad fiscal de otros arrendatarios extremeños no modelada")
  if(s.codigo==="cyl_nacimiento_adopcion_hijos"||s.codigo==="cyl_partos_adopciones_multiples"){
   const conocidos=m.caso.derechosMinimos?.descendientes??[]
   const entradasFamilia=conocidos.flatMap(p=>{const t=p.titulares.find(t=>t.titularId===propio);if(t===undefined||t.relacion!=="convivencia")return []
    if(t.vinculo.clase==="consanguinidad")return [p.fechaNacimiento]
    if(t.vinculo.clase==="adopcion"){exigir(t.vinculo.fechaConstitucionVinculo!==undefined,"D51: cronología adoptiva familiar incompleta");return [t.vinculo.fechaConstitucionVinculo]}
    return []})
   exigir(new Set(s.hechos.hijos.map(h=>h.orden)).size===s.hechos.hijos.length,"D51: ordinales de hijos duplicados")
   for(const h of s.hechos.hijos){const p=hijoFilial(h.id);minimo(h.id)
    const vinculo=p.titulares.find(t=>t.titularId===propio)?.vinculo
    exigir(vinculo!==undefined,"D51: vínculo de hijo sin titular anual")
    if(vinculo.clase==="adopcion")exigir(vinculo.fechaConstitucionVinculo!==undefined&&h.fecha===vinculo.fechaConstitucionVinculo,"D51: fecha de adopción no conciliada con constitución anual")
    else exigir(h.fecha===p.fechaNacimiento,"D51: fecha de nacimiento contradictoria con censo anual")
    const anteriores=entradasFamilia.filter(fecha=>fecha<h.fecha).length,simultaneos=entradasFamilia.filter(fecha=>fecha===h.fecha).length
    exigir(h.orden>anteriores&&h.orden<=anteriores+simultaneos,"D51: ordinal contradice cronología/censo familiar anual o requiere antecedentes no modelados")
   }
  }
  if(s.codigo==="extremadura_cuidado_hijos_hasta_14"){
   const total=s.hechos.pagosUnidad.filter(p=>p.fecha>="2025-01-01"&&p.fecha<="2025-12-31").reduce((a,p)=>a.plus(euros(p.importe)),new A(0))
   const propioPagado=s.hechos.pagosUnidad.filter(p=>p.fecha>="2025-01-01"&&p.fecha<="2025-12-31"&&p.pagador===propio).reduce((a,p)=>a.plus(euros(p.importe)),new A(0))
   if(total.gt(0))finito(racional(propioPagado.toFixed(),total.toFixed()).divisor)
  }
  const registrarBase=(base:string)=>{bases9af=bases9af.plus(euros(base))}
  switch(s.codigo){
case "clm_familia_monoparental":return CLM.familiaMonoparental(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento}))}))
case "clm_libros_idiomas_otros_gastos_educacion":return CLM.gastosEducacion(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento})), baseMenosMinimo: magnitud("baseMenosMinimo","clm_libros_idiomas_otros_gastos_educacion",s.hechos)}))
case "clm_gastos_guarderia":return CLM.guarderia(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento}))}))
case "clm_acogimiento_familiar_no_remunerado_menores":return CLM.acogimientoMenores(marco,({...s.hechos, personas: s.hechos.personas.map(elemento=>({...elemento}))}))
case "clm_acogimiento_no_remunerado_mayores_65_discapacidad":return CLM.acogimientoMayores(marco,({...s.hechos, personas: s.hechos.personas.map(elemento=>({...elemento}))}))
case "clm_arrendamiento_menores_36":return CLM.alquilerJoven(marco,({...s.hechos, minimoDescendientes: magnitud("minimoDescendientes","clm_arrendamiento_menores_36",s.hechos)}))
case "clm_arrendamiento_dacion_pago":return CLM.alquilerDacion(marco,({...s.hechos, minimoDescendientes: magnitud("minimoDescendientes","clm_arrendamiento_dacion_pago",s.hechos)}))
case "clm_arrendamiento_familias_numerosas":return CLM.alquilerNumerosa(marco,({...s.hechos, minimoDescendientes: magnitud("minimoDescendientes","clm_arrendamiento_familias_numerosas",s.hechos)}))
case "clm_arrendamiento_familias_monoparentales":return CLM.alquilerMonoparental(marco,({...s.hechos, minimoDescendientes: magnitud("minimoDescendientes","clm_arrendamiento_familias_monoparentales",s.hechos)}))
case "clm_arrendamiento_personas_discapacidad":return CLM.alquilerDiscapacidad(marco,({...s.hechos, minimoDescendientes: magnitud("minimoDescendientes","clm_arrendamiento_personas_discapacidad",s.hechos)}))
case "clm_donaciones_cooperacion_lucha_pobreza_discapacidad":return CLM.donacionesCooperacion(marco,({...s.hechos, baseLiquidable: magnitud("baseLiquidable","clm_donaciones_cooperacion_lucha_pobreza_discapacidad",s.hechos)}))
case "clm_donaciones_idi_innovacion_empresarial":return CLM.donacionesIdi(marco,({...s.hechos, cuotaAutonomica: magnitud("cuotaAutonomica","clm_donaciones_idi_innovacion_empresarial",s.hechos)}))
case "clm_donaciones_bienes_culturales_mecenazgo":return CLM.mecenazgoCultural(marco,({...s.hechos, operaciones: s.hechos.operaciones.map(elemento=>({...elemento})), baseLiquidable: magnitud("baseLiquidable","clm_donaciones_bienes_culturales_mecenazgo",s.hechos)}))
case "clm_intereses_primera_vivienda_menores_40":return CLM.interesesPrimeraVivienda(marco,({...s.hechos}))
case "clm_residencia_zonas_rurales":return CLM.residenciaRural(marco,({...s.hechos, cuotaAutonomica: magnitud("cuotaAutonomica","clm_residencia_zonas_rurales",s.hechos), escolares: s.hechos.escolares.map(elemento=>({...elemento}))}))
case "clm_adquisicion_rehabilitacion_vivienda_zonas_rurales":return CLM.viviendaRural(marco,({...s.hechos, baseConsumidaAnterior: magnitud("baseConsumidaAnterior","clm_adquisicion_rehabilitacion_vivienda_zonas_rurales",s.hechos)}))
case "clm_traslado_vivienda_habitual":return CLM.trasladoLaboral(marco,({...s.hechos, baseLiquidableInicial: magnitud("baseLiquidableInicial","clm_traslado_vivienda_habitual",s.hechos), cuotaTrabajoActividad: magnitud("cuotaTrabajoActividad","clm_traslado_vivienda_habitual",s.hechos)}))
case "clm_inversion_acciones_participaciones_mercantiles":return CLM.inversionMercantil(marco,({...s.hechos}))
case "clm_inversion_economia_social":return CLM.inversionEconomiaSocial(marco,({...s.hechos}))
case "clm_ahorro_inversion_primera_vivienda":return CLM.cuentaVivienda(marco,({...s.hechos, deducidoAnterior: magnitud("deducidoAnterior","clm_ahorro_inversion_primera_vivienda",s.hechos)}))
case "clm_controles_veterinarios_perros_asistencia":return CLM.perrosAsistencia(marco,({...s.hechos}))
case "clm_familia_numerosa":return CLM.familiaNumerosaAmpliada(marco,({...s.hechos}))
case "clm_discapacidad_ascendientes_descendientes":return CLM.discapacidadFamiliares(marco,({...s.hechos, personas: s.hechos.personas.map(elemento=>({...elemento}))}))
case "cyl_partos_adopciones_multiples":return CYL.multiplesCyl(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento}))}))
case "cyl_cuidado_hijos_menores":return CYL.cuidadoMenoresCyl(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento})), incrementoEstatalMaternidad: magnitud("incrementoEstatalMaternidad","cyl_cuidado_hijos_menores",s.hechos)}))
case "cyl_vivienda_jovenes_medio_rural":return CYL.viviendaJovenRuralCyl(marco,({...s.hechos}))
case "cyl_rehabilitacion_subvencionada_eficiencia_sostenibilidad_discapacidad":return CYL.rehabilitacionSubvencionadaCyl(marco,({...s.hechos}))
case "cyl_rehabilitacion_viviendas_medio_rural_alquiler":return CYL.rehabilitacionAlquilerCyl(marco,({...s.hechos}))
case "cyl_fomento_emprendimiento":return CYL.emprendimientoCyl(marco,({...s.hechos}))
case "cyl_recuperacion_patrimonio_historico_cultural_natural":return CYL.patrimonioCyl(marco,({...s.hechos, baseLiquidable: magnitud("baseLiquidable","cyl_recuperacion_patrimonio_historico_cultural_natural",s.hechos), otrasBases9af: magnitud("otrasBases9af","cyl_recuperacion_patrimonio_historico_cultural_natural",s.hechos)}),registrarBase)
case "cyl_donaciones_fundaciones_patrimonio":return CYL.donacionesPatrimonioCyl(marco,({...s.hechos, baseLiquidable: magnitud("baseLiquidable","cyl_donaciones_fundaciones_patrimonio",s.hechos), otrasBases9af: magnitud("otrasBases9af","cyl_donaciones_fundaciones_patrimonio",s.hechos)}),registrarBase)
case "cyl_donaciones_idi":return CYL.donacionesIdiCyl(marco,({...s.hechos, baseLiquidable: magnitud("baseLiquidable","cyl_donaciones_idi",s.hechos), otrasBases9af: magnitud("otrasBases9af","cyl_donaciones_idi",s.hechos)}),registrarBase)
case "cyl_movilidad_sostenible":return CYL.movilidadCyl(marco,({...s.hechos, vehiculos: s.hechos.vehiculos.map(elemento=>({...elemento, deduccionEstatal: magnitud("deduccionEstatal","cyl_movilidad_sostenible",elemento)}))}))
case "cyl_vivienda_nueva_construccion":return CYL.viviendaNuevaCyl(marco,({...s.hechos}))
case "cyl_nacimiento_adopcion_hijos":return CYL.nacimientoCyl(marco,({...s.hechos, hijos: s.hechos.hijos.map(elemento=>({...elemento}))}))
case "cyl_arrendamiento_vivienda_jovenes":return CYL.alquilerJovenCyl(marco,({...s.hechos, contratos: s.hechos.contratos.map(elemento=>({...elemento}))}))
case "extremadura_acogimiento_menores":return EXT.acogimientoMenoresExt(marco,({...s.hechos, personas: s.hechos.personas.map(elemento=>({...elemento}))}))
case "extremadura_cuidado_hijos_hasta_14":return EXT.cuidadoHasta14Ext(marco,({...s.hechos, regimen: ({...s.hechos.regimen}), hijos: s.hechos.hijos.map(elemento=>({...elemento}))}))
case "extremadura_contribuyentes_viudos":return EXT.viudedadExt(marco,({...s.hechos, regimen: ({...s.hechos.regimen}), descendientes: s.hechos.descendientes.map(elemento=>({...elemento, rentasTotales: faltaFiscal("rentasTotales",elemento)}))}))
case "extremadura_vivienda_jovenes_victimas_terrorismo":return EXT.viviendaJovenExt(marco,({...s.hechos, regimen: ({...s.hechos.regimen})}))
case "extremadura_arrendadores_viviendas_vacias":return evaluarVaciaExt2025(s,m)
case "extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler":return EXT.rehabilitacionAlquilerExt(marco,({...s.hechos, baseHistorica: magnitud("baseHistorica","extremadura_rehabilitacion_viviendas_zonas_rurales_alquiler",s.hechos)}))
case "extremadura_inversion_acciones_participaciones_mercantiles":
 if("perfil" in s.hechos)throw new RangeError("EXT inversión: perfil no evaluado")
 return EXT.inversionMercantilExt(marco,({...s.hechos, baseEstatalMismaInversion: magnitud("baseEstatalMismaInversion","extremadura_inversion_acciones_participaciones_mercantiles",s.hechos)}))
case "extremadura_vivienda_zonas_rurales":return EXT.viviendaRuralExt(marco,({...s.hechos, baseHistorica: magnitud("baseHistorica","extremadura_vivienda_zonas_rurales",s.hechos)}))
case "extremadura_residencia_municipios_menos_3000":return EXT.residenciaRuralExt(marco,({...s.hechos, residentes: s.hechos.residentes.map(elemento=>({...elemento, baseLiquidableIndividual: magnitud("baseLiquidableIndividual","extremadura_residencia_municipios_menos_3000",elemento)})), cuotaAutonomica: magnitud("cuotaAutonomica","extremadura_residencia_municipios_menos_3000",s.hechos)}))
case "extremadura_intereses_vivienda_jovenes":return EXT.interesesJovenExt(marco,({...s.hechos}))
case "extremadura_donaciones_entidades_culturales_deportistas":return EXT.donativosExt(marco,({...s.hechos, donaciones: s.hechos.donaciones.map(elemento=>({...elemento}))}))
case "extremadura_traslado_residencia_habitual":return EXT.trasladoExt(marco,({...s.hechos, basesIndividuales: s.hechos.basesIndividuales.map(elemento=>({...elemento, base: magnitud("base","extremadura_traslado_residencia_habitual",elemento)})), cuotaAutonomica: magnitud("cuotaAutonomica","extremadura_traslado_residencia_habitual",s.hechos)}))
case "extremadura_ayudas_subvenciones_ela": {
 const {ingreso:x,tipos}=ingresoRegionalELA2025(m,s.hechos.ingresoId,s.hechos.diagnostico,"extremadura-ela-2025")
 const anual=(concepto:string,valor:string)=>({ejercicio:2025,declarantes:[propio],concepto,valor})
 return EXT.subvencionesElaExt(marco,{concedida:x.resolucion.importeConcedido,cobrada:x.integradoBaseGeneral,exhaustividad:s.hechos.exhaustividad,
 integradaBaseGeneral:anual("ayuda_ela_integrada_base_general",x.integradoBaseGeneral),integradaBaseLiquidable:anual("ayuda_ela_integrada_base_liquidable",x.integradoBaseLiquidable),
 tipoMedioEstatal:anual("tipo_medio_estatal",tipos.estatal),tipoMedioAutonomico:anual("tipo_medio_autonomico",tipos.autonomico),cuotaAutonomica:magnitud("cuotaAutonomica",s.codigo,s.hechos)})
}
case "extremadura_cuidado_familiares_discapacidad":return EXT.cuidadoDiscapacidadExt(marco,({...s.hechos, regimen: ({...s.hechos.regimen}), personas: s.hechos.personas.map(elemento=>({...elemento, rentasIncluidasExentas: faltaFiscal("rentasIncluidasExentas",elemento), obligacionPatrimonio: faltaFiscal("obligacionPatrimonio",elemento)}))}))
case "extremadura_arrendamiento_vivienda_habitual":return EXT.alquilerExt(marco,({...s.hechos, regimen: ({...s.hechos.regimen}), contratos: s.hechos.contratos.map(elemento=>({...elemento}))}))
  }
 }
 return {evaluar}
}

/** Elecciones por la persona de la declaración; no elige el resultado más favorable. */
export function validarSeleccionesD51(codigos:readonly string[]):void {
 const pares=[
 ["clm_familia_numerosa","clm_arrendamiento_familias_numerosas"],
 ["clm_familia_monoparental","clm_arrendamiento_familias_monoparentales"],
 ["clm_discapacidad_contribuyente","clm_arrendamiento_personas_discapacidad"],
 ["extremadura_contribuyentes_viudos","extremadura_trabajo_dependiente"],
 ["extremadura_vivienda_zonas_rurales","extremadura_vivienda_jovenes_victimas_terrorismo"],
 ["extremadura_vivienda_zonas_rurales","extremadura_intereses_vivienda_jovenes"],
 ]
 for(const [a,b] of pares)exigir(!(codigos.includes(a)&&codigos.includes(b)),"D51: elección incompatible por contribuyente: "+a+" / "+b)
 exigir(!(codigos.includes("clm_intereses_primera_vivienda_menores_40")&&codigos.includes("clm_adquisicion_rehabilitacion_vivienda_zonas_rurales")),"D51: reserva delimitada de concurrencia12/12ter")
 exigir(!(codigos.includes("clm_inversion_acciones_participaciones_mercantiles")&&codigos.includes("clm_inversion_economia_social")),"D51: concurrencia de vías12sexies/12septies necesita identidad de inversiones no modelada; no afirmar incompatibilidad de inversiones distintas")
 const alquileres=codigos.filter(c=>["clm_arrendamiento_menores_36","clm_arrendamiento_dacion_pago","clm_arrendamiento_familias_numerosas","clm_arrendamiento_familias_monoparentales","clm_arrendamiento_personas_discapacidad"].includes(c))
 exigir(alquileres.length<=1,"D51: resolver elección entre deducciones CLM de alquiler")
}

const esSolicitudJson=Schema.is(Schema.Struct({solicitudes:Schema.Array(Schema.Json)}))
/** Detección segura previa a la frontera completa; no valida ni acepta la solicitud. */
export function usaPrecisionD51(entrada:SolicitudComun|undefined):boolean {
 if(!esSolicitudJson(entrada))return false
 return entrada.solicitudes.some(s=>esObjeto(s)&&s.lote==="D51")
}
