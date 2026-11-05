import {Effect,Schema} from "effect"
import Decimal from "decimal.js"
import {type MagnitudesTerritorialesAnuales,type SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type {CodigoViviendaRioja} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/vivienda-rioja"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import {SolicitudE38Anual2025} from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas"
function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="la-rioja"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"20000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}
export function magnitudes(territorio:MagnitudesTerritorialesAnuales["caso"]["comunidadAutonoma"]="la-rioja"):MagnitudesTerritorialesAnuales{return{caso:canonico(territorio),basesImponiblesE38:{general:new Decimal("14000"),ahorro:new Decimal("0")},baseGeneral:new Decimal("14000"),baseAhorro:new Decimal("0"),minimoPersonalFamiliar:new Decimal("5550"),cuotaAutonomica:new Decimal("1000"),sujetosConMinimo:[],atribucionesMinimo:[]}}

const doc=(referencia:string,fecha="2025-12-31")=>({referencia,fecha,emisor:"Entidad documental"})
const corte=(importe:string,fecha="2025-12-31")=>({importe,documento:doc("saldo"+fecha,fecha)})
const codigos=["rioja_vivienda_habitual_pequenos_municipios","rioja_inversion_vivienda_jovenes_menores_36"] as const
type HechosP5a=Extract<SolicitudE38Anual2025["hechos"],{readonly codigo:CodigoViviendaRioja}>
type SolicitudP5a=Omit<SolicitudE38Anual2025,"hechos"|"patrimonioP5a"> & {
 readonly hechos:HechosP5a
 readonly patrimonioP5a:NonNullable<SolicitudE38Anual2025["patrimonioP5a"]>
}
function fixture(codigo:typeof codigos[number]=codigos[0],financiada=codigo===codigos[1]):SolicitudP5a{
 const movimientos=[
 {id:"I",clase:"ingreso",sentido:"entrada",importe:"20000",fecha:"2025-01-02"},
 {id:"D",clase:"disposicion",sentido:"entrada",importe:"9000",fecha:"2025-02-01"},
 {id:"P",clase:"precio",sentido:"salida",importe:"10000",fecha:"2025-02-01"},
 {id:"A",clase:"amortizacion",sentido:"salida",importe:"100",fecha:"2025-12-01"},
 {id:"F",clase:"intereses",sentido:"salida",importe:"50",fecha:"2025-12-01"},
 {id:"C",clase:"consumo",sentido:"salida",importe:"18850",fecha:"2025-12-15"},
 ].map(m=>({...m,cuenta:"CTA",documento:doc(m.id,m.fecha)}))
 const pagos=movimientos.filter(m=>["precio","amortizacion","intereses"].includes(m.clase)).map(m=>({id:m.id,pagador:"A",receptor:m.clase==="precio"?"VEN":"BAN",fecha:m.fecha,importe:m.importe,factura:m.id,concepto:m.clase==="precio"?"adquisicion":m.clase,medio:"transferencia",subvencion:"0",especieExenta:"0"}))
 const solicitud=Schema.decodeUnknownSync(SolicitudE38Anual2025)({lote:"E38",nacimientoContribuyente:"1990-01-01",exhaustividad:"expediente_comun_completo_todos_pagadores",inversionesViviendaEjercicio:pagos.map(p=>({id:p.id,titular:p.pagador,fecha:p.fecha,importe:p.importe,documento:p.factura})),
 patrimonioP5a:{ejercicio:2025,persona:"A",exhaustividad:"todos_activos_deudas_derechos_y_movimientos",censo:[{id:"CTA",tipo:"cuenta_euros",inicio:"presente"},{id:"V",tipo:"vivienda",inicio:"ausente"},{id:"L",tipo:"prestamo",inicio:"ausente"}].map(c=>({...c,cierre:"presente",titular:"A",participacion:[1,1],documento:doc("censo")})),cuentas:[{id:"CTA",inicio:corte("2000","2025-01-01"),cierre:corte("2000")}],movimientos,
 adquisicion:{inmueble:"V",fecha:"2025-02-01",vendedor:"VEN",precio:"10000",escritura:doc("ES","2025-02-01"),valorCierre:corte("11000")},prestamo:{id:"L",fecha:"2025-02-01",acreedor:"BAN",inmueble:"V",contrato:doc("L","2025-02-01"),principalCierre:corte("8900")},historia:{desde:"1990-01-01",hasta:"2025-12-31",documento:doc("historia"),derechos:[{inmueble:"V",titular:"A",adquisicion:"2025-02-01",transmision:null,titulo:doc("ES","2025-02-01")}],anticipos:[],ejercicios:Array.from({length:35},(_,i)=>({anio:1990+i,documento:doc("fiscal"+i),eventos:[]}))}},
 hechos:{codigo,viviendas:[{inmueble:{id:"V",territorio:"la-rioja",titulares:[{titular:"A",numerador:1,denominador:1}],uso:"habitual",residencia:{desde:"2025-02-01",hasta:"2028-02-01"},adquisicion:"2025-02-01",precioAdquisicion:"10000",valorMercadoInicio:"0",valorSuelo:"0",catastralSuelo:"0",catastralConstruccion:"0"},municipio:"Ábalos",municipioHabitual:"Ábalos",operacion:"adquisicion",fechaInicioInversion:"2025-02-01",finConstruccion:"2025-02-01",primeraOcupacion:"2025-02-01",excepcionOcupacion:null,excepcionPermanencia:null,ampliacionPlazoConstruccion:null,obra:null,pagos,coberturaIntereses:"0",deduccionPre2013:null,ejercicioDeduccionAnterior:null,excepcion6812:null,primerPagoObra:"2025-02-01",informeDiscapacidad:null}]}} ,{onExcessProperty:"error"})
 if(solicitud.patrimonioP5a===undefined || (solicitud.hechos.codigo!==codigos[0] && solicitud.hechos.codigo!==codigos[1]))throw new Error("Fixture ajena a P5a")
 const perfil={...solicitud,hechos:solicitud.hechos,patrimonioP5a:solicitud.patrimonioP5a}
 if(!financiada){
  const p=perfil.patrimonioP5a,v=perfil.hechos.viviendas[0]
  if(v===undefined)throw new Error("Vivienda ausente")
  Object.assign(p,{prestamo:null,censo:p.censo.filter(x=>x.id!=="L"),movimientos:p.movimientos.filter(x=>!["D","A","F"].includes(x.id))})
  Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"10000"})
  Object.assign(v,{pagos:v.pagos.filter(x=>x.id==="P")})
  Object.assign(perfil,{inversionesViviendaEjercicio:perfil.inversionesViviendaEjercicio.filter(x=>x.id==="P")})
 }
 return perfil
}
export function ambas(s:SolicitudDeduccionesTerritoriales2025,edad=35){const caso=canonico();return [Effect.map(liquidarIrpfAnual({...caso,situacionFamiliar:{...caso.situacionFamiliar,edad},deduccionesTerritoriales2025:s},{modo:"canonico"}),x=>x.deduccionesTerritoriales2025),Effect.map(liquidarIrpfAnualExplicito({...efectivo(s),edad}),x=>x.deduccionesTerritoriales2025)]}

export function historica(){
 const original=fixture(codigos[1]),p=structuredClone(original.patrimonioP5a),v=structuredClone(original.hechos.viviendas[0]!)
 const fecha="2012-02-01"
 Object.assign(p.adquisicion,{fecha,escritura:doc("ES",fecha)})
 Object.assign(p.prestamo!,{fecha,contrato:doc("L",fecha),principalCierre:corte("6000")})
 Object.assign(p,{censo:p.censo.map(c=>({...c,inicio:"presente"})),movimientos:p.movimientos.filter(x=>["I","A","F","C"].includes(x.id))})
 Object.assign(p.movimientos.find(x=>x.id==="A")!,{importe:"3000"})
 Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"16950"})
 Object.assign(p.historia.ejercicios.find(x=>x.anio===2012)!,{eventos:[{tipo:"inversion_vivienda",inmueble:"V",documento:doc("ES",fecha)}]})
 Object.assign(p.historia.derechos[0]!,{adquisicion:fecha,titulo:doc("ES",fecha)})
 Object.assign(v.inmueble,{adquisicion:fecha,uso:"esporadico"})
 Object.assign(v,{fechaInicioInversion:fecha,finConstruccion:fecha,primeraOcupacion:fecha,municipioHabitual:"Logroño",pagos:v.pagos.filter(x=>x.id!=="P").map(x=>({...x,importe:x.id==="A"?"3000":x.importe}))})
 const {patrimonioP5a:omitido,...resto}=original
 void omitido
 return Schema.decodeUnknownSync(SolicitudE38Anual2025)({...resto,patrimonioRiojaAnterior:{...p,financiacionAnterior:{exhaustividad:"trayectoria_completa_sin_refinanciacion_ni_disposiciones_adicionales",pagoPrecio:{fecha,importe:"10000",receptor:"VEN",documento:doc("pago-original",fecha)},disposicion:corte("9000",fecha),principalInicio:corte("9000","2025-01-01"),amortizaciones:[],usoDesdeAdquisicion:"segunda_residencia_sin_uso_habitual"}},inversionesViviendaEjercicio:v.pagos.map(x=>({id:x.id,titular:x.pagador,fecha:x.fecha,importe:x.importe,documento:x.factura})),hechos:{codigo:"rioja_segunda_vivienda_medio_rural",viviendas:[v]}},{onExcessProperty:"error"})
}
