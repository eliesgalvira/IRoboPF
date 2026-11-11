import {describe,it,expect} from "vitest"
import {Effect} from "effect"
import Decimal from "decimal.js"
import {fixture,ambas,territoriales,controlesSinPagos} from "./dt18-rioja-fixture"
import {racional} from "../lib/dominio/irpf/deducciones/anual-territorial-racional"
import {aplicarCuotasDT18} from "../lib/dominio/irpf/vivienda-dt18-2025/cuota"
import {producirDT182025} from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import type {CasoFiscalAnual} from "../lib/dominio/irpf/caso-fiscal-anual"
const caso=(discapacidad=false):CasoFiscalAnual=>({anio:2025,comunidadAutonoma:"la-rioja",contribuyenteId:"A",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:discapacidad?{_tag:"Discapacidad33a64",necesitaAyudaOMovilidadReducida:false}:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:10000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0})
function libro(s:ReturnType<typeof fixture>,discapacidad=false){if(s.viviendaDT182025===undefined)throw new Error("fixture");return producirDT182025(s.viviendaDT182025,caso(discapacidad),s.solicitudes)}
for(const [operacion,regional,dt18] of [["adquisicion","91.5","228.75"],["rehabilitacion","152.5","228.75"],["adecuacion","457.5","305"]] as const)describe(operacion,()=>{
 it("ambas API: positivo regional y dos tramos DT18 limitados una vez",()=>{
  for(const e of territoriales(fixture([operacion]),operacion==="adecuacion")){
   const r=Effect.runSync(e);expect(r?.total).toEqual(racional(regional));expect(r?.aplicaciones).toHaveLength(1)
   expect(r?.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional(dt18));expect(r?.viviendaDT182025?.cuotas?.autonomica.total).toEqual(racional(dt18))
  }
 })
 it("cuota líquida resta DT18 estatal+autonómica y regional respecto de anual sin deducciones",()=>{
  const s=fixture([operacion]),bases=controlesSinPagos(s,operacion==="adecuacion");for(const [api,e] of ambas(s,operacion==="adecuacion").entries()){const r=Effect.runSync(e);expect(new Decimal(r.cuotaLiquidaEuros).eq(Effect.runSync(bases[api]).minus(new Decimal(dt18).times(2)).minus(regional))).toBe(true);expect(r.deduccionesTerritoriales2025?.total).toEqual(racional(regional))}
 })
})
it("reserva conjunta9040 rehabilitación+adecuación; base estatal de adecuación separada",()=>{
 const s=fixture(["rehabilitacion","adecuacion"]),h=s.viviendaDT182025!
 for(const p of h.proyectos.filter(p=>p.prestamo!==null)){
  Object.assign(p.prestamo!.principalFinal,{importe:"0"});Object.assign(p.vivienda.pagos.find(x=>x.concepto==="amortizacion")!,{importe:"6000"})
 }
 for(const m of h.movimientos.filter(x=>x.clase==="amortizacion"))Object.assign(m,{importe:"6000"})
 Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"37900"})
 for(const solicitud of s.solicitudes){if(solicitud.lote!=="E38")throw new Error("fixture");if("viviendas"in solicitud.hechos)for(const v of solicitud.hechos.viviendas)if("pagos"in v)Object.assign(v.pagos.find(x=>x.id.endsWith("-A"))!,{importe:"6000"});Object.assign(solicitud.inversionesViviendaEjercicio.find(x=>x.id.endsWith("-A"))!,{importe:"6000"})}
 for(const e of territoriales(s,true)){const r=Effect.runSync(e);expect(r?.total).toEqual(racional("751"));expect(r?.evaluaciones.map(x=>x.exacto)).toEqual([racional("302.5"),racional("448.5")]);expect(r?.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({numeradorCentimos:"605000",denominador:"1"});expect(r?.viviendaDT182025?.baseDerechoAdecuacion).toEqual({numeradorCentimos:"605000",denominador:"1"})}
})
it("cuotas asimétricas y80 cifras: sin trasvasar insuficiencia de un tramo al otro",()=>{
 const l=libro(fixture());const q=racional("1",String(10n**79n));const c=aplicarCuotasDT18(l,q,racional("1000"));expect(c.estatal.total).toEqual(q);expect(c.autonomica.total).toEqual(racional("228.75"));expect(c.autonomica.disponible).toEqual(racional("771.25"))
})
it("capital3000, gasto3050, crecimiento3000 y deuda reconstruida separados",()=>{
 const l=libro(fixture());expect(l.capital).toEqual({n:300000n,d:1n});expect(l.cumplePatrimonio).toBe(true);expect(l.baseDerechoSinAdecuacion).toEqual({n:305000n,d:1n})
})
it("déficit patrimonial de un céntimo: DT18 parcial y deducción regional cero",()=>{
 const s=fixture(),h=s.viviendaDT182025!;Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"46950.01"});Object.assign(h.cuentas[0]!.cierre,{importe:"1999.99"})
 for(const e of territoriales(s)){const r=Effect.runSync(e);expect(r?.total).toEqual(racional("0"));expect(r?.viviendaDT182025?.cuotas?.estatal.total).toEqual(racional("228.74925"))}
})
it("variación valorativa de inmueble no sustituye ahorro",()=>{
 for(const importe of ["0","999999"]){const s=fixture();Object.assign(s.viviendaDT182025!.adquisicion.valorCierre,{importe});for(const e of territoriales(s))expect(Effect.runSync(e)?.total).toEqual(racional("152.5"))}
})
for(const fallo of ["sin_censo","otra_vivienda","transmision","reinversion","sin_aplicacion","derecho_sin_practica","ejercicio2013","saldo_elegido","base_externa","no_solicitar","cuenta","principal","efectivo","pago_omitido","obra2017","cotitular","ajeno","construccion"] as const)it("ambas API rechazan causa concreta: "+fallo,()=>{
 const s=fixture(),h=s.viviendaDT182025!,p=h.proyectos.find(p=>p.operacion==="rehabilitacion")!;
 if(fallo==="sin_censo")Object.assign(h.historia,{ejercicios:[]})
 if(fallo==="otra_vivienda")Object.assign(h.historia,{derechos:[...h.historia.derechos,{...h.historia.derechos[0],inmueble:"OTRA"}]})
 if(fallo==="transmision")Object.assign(h.historia.derechos[0]!,{transmision:"2020-01-01"})
 if(fallo==="reinversion")Object.assign(h.historia.ejercicios[0]!,{eventos:[{tipo:"reinversion",inmueble:"V",documento:h.historia.documento}]})
 if(fallo==="sin_aplicacion")Object.assign(p,{aplicacionAnterior:undefined})
 if(fallo==="derecho_sin_practica")Object.assign(p.aplicacionAnterior,{naturaleza:"derecho_no_ejercitado"})
 if(fallo==="ejercicio2013")Object.assign(p.aplicacionAnterior,{ejercicio:2013})
 if(fallo==="saldo_elegido")Object.assign(p.prestamo!.principalInicio,{importe:"5999"})
 if(fallo==="base_externa")Object.assign(h,{baseEstatalViviendaSinAdecuacion:"0"})
 if(fallo==="no_solicitar")Object.assign(h,{ejercicioDelDerecho:"no_ejercer"})
 if(fallo==="cuenta")Object.assign(h.cuentas[0]!.cierre,{importe:"2001"})
 if(fallo==="principal")Object.assign(p.prestamo!.principalFinal,{importe:"3001"})
 if(fallo==="efectivo")Object.assign(p.vivienda.pagos[0]!,{medio:"efectivo"})
 if(fallo==="pago_omitido")Object.assign(p.prestamo!,{pagos2025:[]})
 if(fallo==="obra2017")Object.assign(p,{terminacion:"2017-01-01"})
 if(fallo==="cotitular")Object.assign(p.vivienda.inmueble.titulares[0]!,{numerador:1,denominador:2})
 if(fallo==="ajeno")Object.assign(h,{persona:"B"})
 if(fallo==="construccion")Object.assign(p,{operacion:"construccion"})
 for(const e of ambas(s))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
})
// Boundaries of the regional rate are covered by the reviewed consumer regressions;
// this producer preserves exact transport and supplies annual inputs, never a chosen fiscal base.
it("DT18 no modifica la precisión Decimal global",()=>{const precision=Decimal.precision;libro(fixture());expect(Decimal.precision).toBe(precision)})

it("trayectoria anterior reconstruye principal; no aceptar corte aislado",()=>{
 const s=fixture(),p=s.viviendaDT182025!.proyectos.find(p=>p.operacion==="rehabilitacion")!,l=p.prestamo!
 Object.assign(l.disposicion,{importe:"7000"});Object.assign(l,{amortizacionesAnteriores:[{id:"H",fecha:"2014-01-01",importe:"1000",pagador:"A",receptor:l.acreedor,documento:{referencia:"H",fecha:"2014-01-01",emisor:"Banco"}}]})
 for(const e of territoriales(s))expect(Effect.runSync(e)?.total).toEqual(racional("152.5"))
})
it("ISD sin cronología del derecho rechaza sin importe para DT18",()=>{
 const s=fixture();Object.assign(s.viviendaDT182025!.movimientos.find(x=>x.id==="ING")!,{clase:"herencia"})
 for(const e of territoriales(s))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
})
