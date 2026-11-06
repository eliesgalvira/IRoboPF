import { igualViviendaDT18 } from "../../vivienda-dt18-2025/productor"
import Decimal from "decimal.js"
import { producirPatrimonioP5a, producirSegundaRiojaAnterior } from "../../patrimonio-p5a/productor"
import { ingresoRegionalELA2025, ingresoRegionalIdentificado2025 } from "../../ingresos-identificados-2025/regiones"
import { producirRentaLibros2024 } from "./libros-historia"
import { ayudas, libros } from "./ayudas-libros"
import type { MagnitudesTerritorialesAnuales } from "../anual-territorial"
import { racional, type Racional } from "../anual-territorial-racional"
import { evaluarAmpliacionE2025 } from "./index"
import { viviendaRioja } from "./vivienda-rioja"
import { conciliarFamiliaE38 } from "./anual-conciliacion"
import type { SolicitudE38Anual2025 } from "./anual-esquemas"
import { exige, r, serial, cero, fecha, ids, documento, resultado, paso } from "./comun"
import type { R, Contexto, MagnitudMotor, ClaveAnual, Resultado } from "./comun"
const D = Decimal.clone({precision:200})
/** Conversión de un resultado de motor, no de un importe aportado en la API. */
function centimosMotor(v:Decimal):R{
 const s=v.toFixed();exige(/^-?\d+(\.\d+)?$/.test(s),"Magnitud del motor no finita")
 const [entera,fraccion=""]=s.split(".");return r(BigInt(entera+fraccion)*100n,10n**BigInt(fraccion.length))
}
const faltantes:Readonly<Partial<Record<SolicitudE38Anual2025["hechos"]["codigo"],string>>>= {
 galicia_ayudas_incendios_peifoga_2025:"VI100B reparación clasifica no integración DA5.3; otros daños/destrucción/personales/actividad requieren productores específicos antes de importe en BLG",
}
export const PRODUCTORES_PENDIENTES_E38 = faltantes
export function evaluarE38Anual(s:SolicitudE38Anual2025,m:MagnitudesTerritorialesAnuales):Resultado{
 try {const r=evaluarE38ConProductores(s,m);if(r.estado!=="calculo_parcial")throw new RangeError(s.hechos.codigo+": "+r.motivos.join("; "));return r}
 catch(cause){throw new RangeError(s.hechos.codigo+": "+(cause instanceof Error?cause.message:"hechos anuales E38 no representados"))}
}
function evaluarE38ConProductores(s:SolicitudE38Anual2025,m:MagnitudesTerritorialesAnuales):Resultado{
 const h=s.hechos
 if(h.codigo==="galicia_ayudas_incendios_peifoga_2025"){
  const x=m.libroIngresosIdentificados2025?.ayudasNoIntegradas.find(a=>a.ayudaId===h.ingresoId)
  exige(x!==undefined && x.beneficiario===m.caso.contribuyenteId,"Incendios: falta expediente clasificado propio; otros perfiles requieren productor específico")
  throw new RangeError("VI100B reparación: no integración DA5.3; no hay ayuda en BLG para deducir, sin importe sustitutorio")
 }
 exige(faltantes[h.codigo]===undefined,`${h.codigo}: productor anual no representado en APIv4: ${faltantes[h.codigo]??""}`)
 exige(s.patrimonioP5a===undefined||["rioja_vivienda_habitual_pequenos_municipios","rioja_inversion_vivienda_jovenes_menores_36"].includes(h.codigo),"P5a no es un productor para otras comunidades/códigos")
 exige(s.patrimonioRiojaAnterior===undefined||h.codigo==="rioja_segunda_vivienda_medio_rural","Patrimonio histórico riojano ajeno al perfil de segunda vivienda")
 const titularAnual=m.caso.contribuyenteId
 exige(titularAnual!==undefined&&["galicia","la-rioja"].includes(m.caso.comunidadAutonoma),"Titular o territorio anual E38 no representado")
 const id=titularAnual
 exige(ids(s.inversionesViviendaEjercicio.map(i=>i.id)),"Inventario económico de vivienda duplicado")
 for(const i of s.inversionesViviendaEjercicio)exige(i.titular===id&&fecha(i.fecha)&&i.fecha>="2025-01-01"&&i.fecha<="2025-12-31"&&/^\d+(\.\d{1,2})?$/.test(i.importe)&&i.documento.trim().length>0,"Inventario de vivienda ajeno/inválido")
 conciliarFamiliaE38(h.codigo === "galicia_libros_texto_material_escolar" ? {...h,miembros2024:[]} : h,m,s.nacimientoContribuyente)
 exige(s.historiaLibros2024 === undefined || h.codigo === "galicia_libros_texto_material_escolar", "Libros.historia: historia ajena a esta deducción")
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
  case "galicia_libros_texto_material_escolar": {
   const historia = s.historiaLibros2024
   const miembros2024 = producirRentaLibros2024(historia, [...h.miembros2024], id, s.nacimientoContribuyente)
   exige(historia !== undefined, "Libros.historia: ausente")
   for (const miembro of miembros2024) {
    if (miembro.persona.id === id) exige(miembro.persona.nacimiento === s.nacimientoContribuyente && miembro.persona.discapacidad === grado, "Libros.identidad: discapacidad propia contradictoria")
    const hijo = h.descendientes.find(x => x.persona.id === miembro.persona.id)
    if (hijo !== undefined) exige(hijo.persona.nacimiento === miembro.persona.nacimiento && hijo.persona.discapacidad === miembro.persona.discapacidad, "Libros.identidad: discapacidad/fecha del hijo contradictoria")
   }
   const padres = historia.personas.filter(p => p.relacion === "progenitor").map(p => p.id)
   for (const x of h.descendientes) {
    exige(x.curso === "2025-2026", "Libros.curso: se requiere curso2025–2026")
    exige(historia.personas.some(p => p.id === x.persona.id && p.relacion === "hijo-soltero-no-emancipado" && p.nacimiento === x.persona.nacimiento), "Libros.filiacion: falta hijo en historia estable")
    exige(x.progenitores.length === padres.length && padres.every(p => x.progenitores.includes(p)), "Libros.filiacion: progenitores no conciliados con historia")
   }
   // Art4 Orden26/03/2026: límite por período. Sin criterio de asignación
   // entre hijos al desbordarlo, este perfil admite material de un solo hijo.
   exige(h.descendientes.filter(x => x.compras.some(a => !["texto", "electronica", "uniforme", "otro"].includes(a.categoria))).length <= 1, "Libros.material: reparto del límite anual entre varios hijos requiere perfil de asignación")
   return libros(c, {...h, miembros2024})
  }

  case "rioja_obras_rehabilitacion_vivienda_habitual":
  case "rioja_adquisicion_construccion_vivienda_jovenes":
  case "rioja_adecuacion_vivienda_discapacidad":{
   const libro=m.libroDT18
   exige(libro!==undefined&&libro.persona===id&&libro.nacimiento===s.nacimientoContribuyente,"DT18: falta productor histórico por titular y operación; no aceptar deducción previa/base/cuota fiscal elegida")
   exige(libro.territorio==="la-rioja","DT18: libro estatal de otra comunidad")
   const reserva=libro.reservas.find(x=>x.codigo===h.codigo)
   exige(reserva!==undefined,"DT18: solicitud sin reserva conjunta")
   const p=libro.proyectos.find(x=>x.id===reserva.proyecto)
   exige(p!==undefined&&h.viviendas.length===1&&h.viviendas[0]!==undefined&&igualViviendaDT18(h.viviendas[0],p.vivienda),"DT18: vivienda regional ajena al proyecto histórico")
   exige(ids(s.inversionesViviendaEjercicio.map(x=>x.id))&&s.inversionesViviendaEjercicio.length===p.vivienda.pagos.length&&s.inversionesViviendaEjercicio.every(i=>p.vivienda.pagos.some(x=>x.id===i.id&&x.fecha===i.fecha&&x.importe===i.importe&&x.factura===i.documento&&x.pagador===i.titular)),"DT18: inventario anual regional no concilia con proyecto")
   emitir("patrimonioInicialAjustado",libro.patrimonio.inicial,"P5a.DT18.cuentas+costes-principalInicio")
   emitir("patrimonioFinalAjustado",libro.patrimonio.final,"P5a.DT18.ajusteValoracionISD")
   emitir("baseEstatalViviendaSinAdecuacion",libro.baseEstatalSinAdecuacion,"DT18.baseEstatalSinAdecuacion.ejercicioDelDerecho")
   emitir("baseConsumidaAdquisicionSegunda",reserva.previaAdquisicionSegunda,"DT18.reservaRegional9040.adquisicionSegunda")
   emitir("baseConsumidaRehabilitacionAdecuacion",reserva.previaRehabilitacionAdecuacion,"DT18.reservaRegional9040.rehabilitacionAdecuacion")
   const evaluacion=viviendaRioja(c,{...h,otrasModalidadesElegidas:[],viviendas:[{...p.vivienda,...libro.historiaDerivada}]})
   if(evaluacion.estado!=="calculo_parcial"||libro.cumplePatrimonio)return evaluacion
   // Art.70.1 LIRPF2012 y DT2.1 riojana: la condición abarca toda la inversión.
   // Conservar las validaciones de cada modalidad sin reutilizar el incremento.
   return resultado(c,cero,[...evaluacion.rastro,paso("patrimonio_conjunto_DT18","Incremento patrimonial inferior al capital conjunto de las inversiones DT18",libro.capital,cero)])
  }

  case "rioja_segunda_vivienda_medio_rural":{
   exige(m.caso.comunidadAutonoma==="la-rioja"&&m.caso.fechaFallecimiento===undefined,"Segunda vivienda: sólo La Rioja2025 sin devengo anticipado")
   exige(s.patrimonioRiojaAnterior!==undefined&&h.viviendas.length===1,"Segunda vivienda: falta censo histórico y trayectoria del préstamo original; rehabilitación requiere productor histórico de obras")
   const v=h.viviendas[0];exige(v!==undefined,"Segunda vivienda ausente")
   const p=producirSegundaRiojaAnterior(s.patrimonioRiojaAnterior,id,s.nacimientoContribuyente,v)
   const movimientos=s.patrimonioRiojaAnterior.movimientos.filter(x=>["amortizacion","intereses","gastos_financiacion"].includes(x.clase))
   exige(s.inversionesViviendaEjercicio.length===movimientos.length&&s.inversionesViviendaEjercicio.every(i=>movimientos.some(x=>x.id===i.id&&x.fecha===i.fecha&&x.importe===i.importe&&x.documento.referencia===i.documento)),"Segunda vivienda: inventario2025 no concilia con préstamo original")
   emitir("patrimonioInicialAjustado",p.inicial,"P5a.historico.cuentas+coste-principalInicio")
   emitir("patrimonioFinalAjustado",p.final,"P5a.historico.cuentas+coste-principalFinal-ISD")
   // El censo vital sólo contiene segunda residencia, sin otras inversiones ni derechos.
   // La ausencia de base estatal se deriva de ese perfil, nunca de una elección.
   emitir("baseEstatalViviendaSinAdecuacion",cero,"P5a.historia.unicoDerechoSegundaResidenciaSinUsoHabitual")
   emitir("baseConsumidaAdquisicionSegunda",cero,"anual.reservaUnicaSegunda.sinConcurrencias")
   const resultado=viviendaRioja(c,{...h,otrasModalidadesElegidas:[],viviendas:[{...v,...p.historia,pagos:p.pagos}]})
   return resultado.estado!=="calculo_parcial"?resultado:{...resultado,rastro:[...p.rastro,...resultado.rastro]}
  }

  case "rioja_vivienda_habitual_pequenos_municipios":case "rioja_inversion_vivienda_jovenes_menores_36":{
   exige(m.caso.comunidadAutonoma==="la-rioja"&&m.caso.fechaFallecimiento===undefined,"P5a sólo La Rioja2025 sin devengo anticipado representado")
   exige(s.patrimonioP5a!==undefined&&h.viviendas.length===1,"P5a requiere inventario patrimonial y una inversión identificada; perfil no representado")
   const v=h.viviendas[0];exige(v!==undefined,"P5a vivienda ausente")
   exige(h.codigo!=="rioja_vivienda_habitual_pequenos_municipios"||s.patrimonioP5a.prestamo===null,"P5a 32.2: financiación no representada; pendiente criterio sobre amortización, intereses y gastos, sin inferir ausencia de derecho")
   const p=producirPatrimonioP5a(s.patrimonioP5a,id,s.nacimientoContribuyente,v)
   const movimientos=s.patrimonioP5a.movimientos.filter(x=>["precio","amortizacion","intereses","gastos_financiacion"].includes(x.clase))
   exige(s.inversionesViviendaEjercicio.length===movimientos.length&&s.inversionesViviendaEjercicio.every(i=>movimientos.some(x=>x.id===i.id&&x.fecha===i.fecha&&x.importe===i.importe&&x.documento.referencia===i.documento)),"P5a inventario anual de inversiones no concilia con pagos exactos")
   emitir("patrimonioInicialAjustado",p.inicial,"P5a.cuentas.inicio")
   emitir("patrimonioFinalAjustado",p.final,"P5a.activos-menos-deudas-variacion-ISD")
   emitir("baseConsumidaViviendaMunicipios",cero,"anual.reservaP5a.unicaSolicitudDeclaracion")
   const r=viviendaRioja(c,{...h,otrasModalidadesElegidas:[],viviendas:[{...v,...p.historia,pagos:p.pagos}]},p.financiacionAdquisicion)
   return r.estado!=="calculo_parcial"?r:{...r,rastro:[...p.rastro,...r.rastro]}
  }
  case "galicia_ayudas_deportistas_alto_nivel": {
   const {ingreso:x,tipos}=ingresoRegionalIdentificado2025(m,h.ingresoId,"galicia-deportistas-resultados-2025")
   exige(new D(x.integradoBaseGeneral).eq(x.resolucion.importeConcedido),"Galicia: saldo pendiente de cobro no representado")
   const hechos=x.hechosDeportivos
   exige(hechos?.programa==="galicia-deportistas-resultados-2025"&&x.fiscalidadDeportiva?.exento==="0","Deportista sin hechos y clasificación derivados del libro común")
   const doc={referencia:x.resolucion.referencia,emisor:x.resolucion.organismo,fecha:x.resolucion.fecha}
   return ayudas(c,{codigo:h.codigo,ayudas:[{id:x.ayudaId,beneficiario:x.beneficiario,pagador:hechos.administracion==="xunta_galicia"?"administracion_gallega":"sector_publico_autonomico",resolucion:doc,fechaCobro:x.cobros[x.cobros.length-1]!.fecha,ejercicioImputacion:2025,concedido:x.resolucion.importeConcedido,concepto:"actividad_deportiva",partes:[{id:x.ayudaId+":integrada",clasificacion:"integrada",importe:x.integradoBaseGeneral,declaracionIntegracion:doc,nodoImputacionAnual:x.nodoFiscalOrigen,baseLiquidableAtribuida:x.integradoBaseLiquidable}],deportistaAltoNivel:hechos.reconocimientoGallego,actividadDeportiva:"sin_rendimiento_economico",diagnostico:null}],tiposMedios:(["estatal","autonomico"] as const).map(ambito=>{const t=racional(tipos[ambito]);return {ambito,ejercicio:2025,declarantes:[id],numeradorPorcentaje:t.numeradorEuros,denominador:t.divisor,nodoDerivacion:x.nodoFiscalOrigen+":tipo:"+ambito}})})
  }
  case "galicia_ayudas_talidomida": {
   const {ingreso:x,tipos}=ingresoRegionalIdentificado2025(m,h.ingresoId,"talidomida-rd574-2023-cobro2025")
   exige(new D(x.integradoBaseGeneral).eq(x.resolucion.importeConcedido),"Galicia: saldo pendiente de cobro no representado")
   const doc={referencia:x.resolucion.referencia,emisor:x.resolucion.organismo,fecha:x.resolucion.fecha}
   return ayudas(c,{codigo:h.codigo,ayudas:[{id:x.ayudaId,beneficiario:x.beneficiario,pagador:"administracion_gallega",resolucion:doc,fechaCobro:x.cobros[x.cobros.length-1]!.fecha,ejercicioImputacion:2025,concedido:x.resolucion.importeConcedido,concepto:"talidomida1950_1985",partes:[{id:x.ayudaId+":integrada",clasificacion:"integrada",importe:x.integradoBaseGeneral,declaracionIntegracion:doc,nodoImputacionAnual:x.nodoFiscalOrigen,baseLiquidableAtribuida:x.integradoBaseLiquidable}],deportistaAltoNivel:null,actividadDeportiva:"sin_rendimiento_economico",diagnostico:null}],tiposMedios:(["estatal","autonomico"] as const).map(ambito=>{const t=racional(tipos[ambito]);return {ambito,ejercicio:2025,declarantes:[id],numeradorPorcentaje:t.numeradorEuros,denominador:t.divisor,nodoDerivacion:x.nodoFiscalOrigen+":tipo:"+ambito}})})
  }
  case "galicia_ayudas_ela_fenotipos": {
   const {ingreso:x,tipos}=ingresoRegionalELA2025(m,h.ingresoId,h.diagnostico,"galicia-bs215a-2025")
   exige(new D(x.integradoBaseGeneral).eq(x.resolucion.importeConcedido),"Galicia: saldo pendiente de cobro no representado")
   const doc={referencia:x.resolucion.referencia,emisor:x.resolucion.organismo,fecha:x.resolucion.fecha}
   return ayudas(c,{codigo:h.codigo,ayudas:[{id:x.ayudaId,beneficiario:x.beneficiario,pagador:"administracion_gallega",resolucion:doc,fechaCobro:x.cobros[x.cobros.length-1]!.fecha,ejercicioImputacion:2025,concedido:x.resolucion.importeConcedido,concepto:"ELA_fenotipo",partes:[{id:x.ayudaId+":integrada",clasificacion:"integrada",importe:x.integradoBaseGeneral,declaracionIntegracion:doc,nodoImputacionAnual:x.nodoFiscalOrigen,baseLiquidableAtribuida:x.integradoBaseLiquidable}],deportistaAltoNivel:null,actividadDeportiva:"sin_rendimiento_economico",diagnostico:h.diagnostico}],tiposMedios:(["estatal","autonomico"] as const).map(ambito=>{const t=racional(tipos[ambito]);return {ambito,ejercicio:2025,declarantes:[id],numeradorPorcentaje:t.numeradorEuros,denominador:t.divisor,nodoDerivacion:x.nodoFiscalOrigen+":tipo:"+ambito}})})
  }
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
  default:throw new RangeError(`${s.hechos.codigo}: no hay productor anual para esta rama;sin importe`)
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
