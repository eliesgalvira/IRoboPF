import {Effect,Schema} from "effect"
import {describe,it,expect} from "vitest"
import Decimal from "decimal.js"
import {fixture as rioja} from "./dt18-rioja-fixture"
import {SolicitudDeduccionesTerritoriales2025} from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {producirDT18Murcia2025} from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import {HechosDT18Murcia2025} from "../lib/dominio/irpf/vivienda-dt18-2025/contrato"
import {aplicarCuotasDT18} from "../lib/dominio/irpf/vivienda-dt18-2025/cuota"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
function canonico(comunidad:CasoFiscalAnual["comunidadAutonoma"]="murcia"):CasoFiscalAnual{return{anio:2025,comunidadAutonoma:comunidad,contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:10000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function efectivo(s:SolicitudDeduccionesTerritoriales2025){return{ejercicio:2025,comunidadAutonoma:"murcia",contribuyenteId:"A",edad:35,modalidad:"individual",residenciaTodoElAnio:true,devengo:"2025-12-31",otrasRentas:"ninguna",familiaresConDerechoMinimo:"ninguno",discapacidad:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:s,rentasExtranjeras:"ninguna",especialidades:"ninguna",perfil:"solo-trabajo",conciliacion:{ejercicio:2025,estado:"totales-anuales-sin-duplicados",procedencia:["certificado"]},trabajo:{ejercicio:2025,territorio:"comun",reduccionesArt18:"ninguna",movilidad:"ninguna",discapacidadActiva:"ninguna",rendimientos:[{id:"R",clase:"empleo-laboral",integro:"100000",cotizaciones:{clase:"efectivas",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},sindicato:{importe:"0",satisfecho:"no"},colegio:{importe:"0",satisfecho:"no",obligatorio:"no",finesEsenciales:"no"},defensa:{importe:"0",satisfecho:"no",litigioDirectoPagador:"no"}}]},retenciones:[]} as const}

function fixture(){
 const original=structuredClone(rioja(["adquisicion"])),h=original.viviendaDT182025!
 for(const p of h.proyectos)Object.assign(p.vivienda,{municipio:"Murcia",municipioHabitual:"Murcia",inmueble:{...p.vivienda.inmueble,territorio:"murcia"}})
 return Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)({viviendaDT182025:h,solicitudes:[{lote:"F-ampliado",codigo:"murcia_regimen_transitorio_inversion_vivienda_habitual",hechos:{ramaTransitoria:"estatal_pre2013"}}]},{onExcessProperty:"error"})
}
function ambas(s:SolicitudDeduccionesTerritoriales2025){
 return [
  Effect.map(liquidarIrpfAnual({...canonico(),deduccionesTerritoriales2025:s},{modo:"canonico"}),x=>({t:x.deduccionesTerritoriales2025,cuota:new Decimal(x.cuotaLiquidaCentimos).div(100)})),
  Effect.map(liquidarIrpfAnualExplicito(efectivo(s)),x=>({t:x.deduccionesTerritoriales2025,cuota:new Decimal(x.cuotaLiquidaLegal)})),
 ]
}
function sinPagos(s:SolicitudDeduccionesTerritoriales2025){
 const c=structuredClone(s),h=c.viviendaDT182025!
 Object.assign(h,{movimientos:h.movimientos.filter(m=>!["amortizacion","intereses","gastos_financiacion"].includes(m.clase))})
 Object.assign(h.movimientos.find(m=>m.clase==="consumo")!,{importe:"50000"})
 for(const p of h.proyectos){Object.assign(p.vivienda,{pagos:[]});Object.assign(p.prestamo!,{pagos2025:[]});Object.assign(p.prestamo!.principalFinal,{importe:p.prestamo!.principalInicio.importe})}
 return c
}
describe("Murcia DT primera.4 / perfil adquisición ordinaria",()=>{
 it("ambas API: base3050, cada tramo228,75 y ningún segundo consumo F",()=>{
  const s=fixture(),controles=ambas(sinPagos(s))
  for(const [i,e] of ambas(s).entries()){
   const r=Effect.runSync(e),t=r.t!
   expect(t.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional("228.75"))
   expect(t.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional("228.75"))
   expect(t.total).toEqual(racional("0"))
   expect(t.evaluacionesF[0]?.consumoCompartidoDT18).toEqual({generado:racional("228.75"),aplicado:racional("228.75"),pendiente:racional("0")})
   expect(t.aplicaciones[0]).toMatchObject({estado:"aplicada"})
   expect(r.cuota.eq(Effect.runSync(controles[i]!).cuota.minus("457.5"))).toBe(true)
  }
 })
 it("frontera art70: déficit de un céntimo excluye toda la base, incluidos intereses",()=>{
  const s=fixture(),h=s.viviendaDT182025!
  Object.assign(h.cuentas[0]!.cierre,{importe:"1999.99"});Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"46950.01"})
  for(const e of ambas(s)){const r=Effect.runSync(e);expect(r.t?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional("0"));expect(r.t?.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({numeradorCentimos:"0",denominador:"1"})}
 })
 it("variación de valor no sustituye ni limita ahorro reconstruido",()=>{
  for(const importe of ["0","999999"]){const s=fixture();Object.assign(s.viviendaDT182025!.adquisicion.valorCierre,{importe});for(const e of ambas(s))expect(Effect.runSync(e).t?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional("228.75"))}
 })
 it("base máxima9040 sin otro cupo regional y sin cambiar cuotas",()=>{
  const s=fixture(),h=s.viviendaDT182025!,p=h.proyectos[0]!
  Object.assign(p.vivienda.pagos.find(x=>x.concepto==="amortizacion")!,{importe:"9000"});Object.assign(p.prestamo!.principalFinal,{importe:"0"})
  Object.assign(h.movimientos.find(x=>x.clase==="amortizacion")!,{importe:"9000"});Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"40950"})
  for(const e of ambas(s)){const t=Effect.runSync(e).t!;expect(t.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({numeradorCentimos:"904000",denominador:"1"});expect(t.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional("678"));expect(t.total).toEqual(racional("0"))}
 })
 it("ISD gastado no sustituye ahorro propio",()=>{
  const s=fixture();Object.assign(s.viviendaDT182025!.movimientos.find(x=>x.id==="ING")!,{clase:"herencia"})
  for(const e of ambas(s))expect(Effect.runSync(e).t?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional("0"))
 })
 it("insuficiencia de cuota asimétrica y racional exacta",()=>{
  const s=fixture(),h=Schema.decodeUnknownSync(HechosDT18Murcia2025)(s.viviendaDT182025),l=producirDT18Murcia2025(h,canonico(),s.solicitudes)
  const q=aplicarCuotasDT18(l,racional("1",String(10n**79n)),racional("100"))
  expect(q.estatal.total).toEqual(racional("1",String(10n**79n)));expect(q.autonomica.total).toEqual(racional("100"));expect(q.autonomica.disponible).toEqual(racional("0"))
 })
 for(const fallo of ["sin_historia","sin_aplicacion","solo_derecho","ejercicio2013","adquisicion2013","otra_vivienda","reinversion","refinanciacion","principal","pago_omitido","efectivo","cotitular","no_ejercer","base_externa","cuota_externa","derecho_externo","1998_2000","Uno_vigente","jovenes","sin_productor","rehabilitacion"] as const)it("ambas API: rechazo concreto "+fallo,()=>{
  const s=fixture(),h=s.viviendaDT182025!,p=h.proyectos[0]!
  if(fallo==="sin_historia")Object.assign(h.historia,{ejercicios:[]})
  if(fallo==="sin_aplicacion")Object.assign(p,{aplicacionAnterior:undefined})
  if(fallo==="solo_derecho")Object.assign(p.aplicacionAnterior,{naturaleza:"derecho_no_ejercitado"})
  if(fallo==="ejercicio2013")Object.assign(p.aplicacionAnterior,{ejercicio:2013})
  if(fallo==="adquisicion2013")Object.assign(h.adquisicion,{fecha:"2013-01-01"})
  if(fallo==="otra_vivienda")Object.assign(h.historia,{derechos:[...h.historia.derechos,{...h.historia.derechos[0],inmueble:"OTRA"}]})
  if(fallo==="reinversion")Object.assign(h.historia.ejercicios[0]!,{eventos:[{tipo:"reinversion",inmueble:"V",documento:h.historia.documento}]})
  if(fallo==="refinanciacion")Object.assign(p.prestamo!,{exhaustividad:"refinanciado"})
  if(fallo==="principal")Object.assign(p.prestamo!.principalInicio,{importe:"8999"})
  if(fallo==="pago_omitido")Object.assign(p.prestamo!,{pagos2025:[]})
  if(fallo==="efectivo")Object.assign(p.vivienda.pagos[0]!,{medio:"efectivo"})
  if(fallo==="cotitular")Object.assign(p.vivienda.inmueble.titulares[0]!,{denominador:2})
  if(fallo==="no_ejercer")Object.assign(h,{ejercicioDelDerecho:"no_ejercer"})
  if(fallo==="base_externa")Object.assign(h,{baseEstatalViviendaSinAdecuacion:"0"})
  if(fallo==="cuota_externa")Object.assign(s.solicitudes[0]!,{cuotaAutonomica:"228.75"})
  if(fallo==="derecho_externo")Object.assign(s.solicitudes[0]!,{hechos:{ramaTransitoria:"estatal_pre2013",derechoHistoricoReferencia:"sí"}})
  if(fallo==="1998_2000"||fallo==="Uno_vigente")Object.assign(s.solicitudes[0]!,{hechos:{ramaTransitoria:fallo}})
  if(fallo==="jovenes")Object.assign(s.solicitudes[0]!,{codigo:"murcia_vivienda_jovenes_hasta_40"})
  if(fallo==="sin_productor")Object.assign(s,{viviendaDT182025:undefined})
  if(fallo==="rehabilitacion")Object.assign(p,{operacion:"rehabilitacion"})
  for(const e of ambas(s))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
 })
})
