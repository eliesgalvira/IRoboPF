import { it, expect } from "vitest"
import Decimal from "decimal.js"
import { Effect } from "effect"
import { producirBasesFamiliares2025 as producir, producirEconomiaAjena2025, type CensoBasesFamiliares2025 } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarDosDescendientesAnual2025 as aplicar } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico, efectivo, derechos } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import type { CalendarioTrabajo2025 } from "../lib/dominio/irpf/trabajo-anual/calendario-2025"
import oraculos from "./familia-empleo-pension-2025.oraculos.json"
const D = Decimal.clone({ precision: 80 })
type Mutable<T> = T extends object ? { -readonly [K in keyof T]: Mutable<T[K]> } : T
const propia = { general: new D(20000), ahorro: new D(0) }
function censo(): Mutable<CensoBasesFamiliares2025> {
 return { referencia:"censo-sintetico", ejercicio:2025, devengo:"2025-12-31", contribuyente:"s-1", estadoCivil:"sin-vinculo", censoCompleto:true, hijosCompletos:true,
 hijos:["s-3","s-4"].map(id => ({id, nacimiento:"2017-01-01", progenitores:["s-1","s-2"], conviveCon:["s-1","s-2"], independienteConConsentimiento:false, apoyoJudicial:"ninguno", soporte:"filiacion"})),
 personas:["s-1","s-2","s-3","s-4"].map(id => ({id, soporte:"censo", residenteComunTodo2025:true, vivoTodo2025:true, economia:id === "s-1" ? {perfil:"declarante-en-composicion"} : {perfil:"sin-rentas", censoRentasCompleto:true}})) }
}
const ambito = { anio:2025, contribuyenteId:"s-1", comunidadAutonoma:"comunitat-valenciana" } as const
const ats = ["s-3","s-4"].map(sujetoId => ({ sujetoId, titulares:["s-1","s-2"] }))
const codigo="valenciana_dos_o_mas_descendientes"
const solicitud = () => ({ejercicio:2025, territorio:"comunitat-valenciana", modalidad:"individual", devengo:"2025-12-31", contribuyente:"s-1", cantidades:[], solicitudes:[{codigo,eleccion:"aplicar",unidades:[{id:"u",titulares:["s-1"],fecha:"2025-12-31",numeros:{},textos:{}}], referencias:[{unidad:"u",sujetos:["s-3","s-4"],bienes:[],eventos:[],cantidades:[]}]}], ordenBase30:[],consignaciones:[],arrastres:[],ordenConsumo:[JSON.stringify([codigo,2025,"s-1"])], criterioOrden:"eleccion_experta"} as const)
function familia(territorio:"madrid"|"comunitat-valenciana") {
 const ds=["s-3","s-4"].map(sujetoId=>({...derechos.descendientes[0]!,sujetoId,titulares:derechos.descendientes[0]!.titulares.map(t=>({...t,rentasNoExentasCentimos:t.titularId==="s-1"?2605600:0}))}))
 return {...derechos,territorio,descendientes:ds}
}
function calendarioT07(parcial = false, grado = 65, ayuda = false, ultimoIngreso = "1000"): Mutable<CalendarioTrabajo2025> {
 return { sujetoId:"s-2",rendimientoId:"pagador-a",empleador:"empleador-unico",soporteRelacionLaboral:"contrato-ordinario",fechaCorteDocumental:"2026-11-06",censoCompleto:true,imputacion:"servicios-ordinarios-2025-sin-atrasos",
 certificados:[{id:"cert-1",sujetoId:"s-2",organismo:"organo-competente-ccaa",emision:"2026-02-01",efectosDesde:parcial?"2025-10-20":"2025-01-01",efectosHasta:"2025-12-31",grado,ayudaOMovilidadReducida:ayuda,soporte:"resolucion-con-efectos-expresos"}],
 tramos:parcial ? [
 {id:"nomina-a",desde:"2025-01-01",hasta:"2025-10-19",soporte:"nominas-a",actividad:"servicios-efectivos",integro:new D(17000).minus(ultimoIngreso).toFixed(),seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},
 {id:"nomina-b",desde:"2025-10-20",hasta:"2025-12-31",soporte:"nominas-b",actividad:"servicios-efectivos",integro:ultimoIngreso,seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"},
 ] : [{id:"nomina-anual",desde:"2025-01-01",hasta:"2025-12-31",soporte:"nominas",actividad:"servicios-efectivos",integro:"17000",seguridadSocial:"0",derechosPasivos:"0",colegiosHuerfanos:"0"}] }
}
function trabajoT07(parcial = false, grado: "33-a-64" | "65-o-mas" = "65-o-mas", ayuda = false) {
 if(efectivo.perfil !== "solo-trabajo") throw Error("fixture laboral")
 return {...efectivo.trabajo,discapacidadActiva:{grado,ayudaOMovilidadReducida:ayuda?"si":"no",acreditadaDuranteTodoElTrabajo:parcial?"no":"si"} as const,
 rendimientos:efectivo.trabajo.rendimientos.map(r=>({...r,integro:"17000",cotizaciones:{...r.cotizaciones,seguridadSocial:"0"}}))}
}
function casosT07(territorio: "madrid" | "comunitat-valenciana", parcial = false) {
 const c=censo(), d=familia(territorio)
 const renta=parcial?1440000:725000
 for(const s of d.descendientes) for(const t of s.titulares) if(t.titularId === "s-2") t.rentasNoExentasCentimos=renta
 c.personas[1]!.economia={perfil:"solo-trabajo",censoRentasCompleto:true,otrasRentas:"ninguna",reduccionesBase:"ninguna",saldosAnteriores:"ninguno",trabajo:trabajoT07(parcial),calendarioTrabajo2025:calendarioT07(parcial)}
 const a={...analitico,comunidadAutonoma:territorio,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c} as const
 const e={...efectivo,comunidadAutonoma:territorio,contribuyenteId:"s-1",derechosMinimos:d,basesFamiliares2025:c,familiaresConDerechoMinimo:"segun-derechos"} as const
 return {a,e,c,d}
}

function mezcla(territorio: "madrid" | "comunitat-valenciana") {
 const x=casosT07(territorio)
 const e=x.c.personas[1]!.economia
 if(e.perfil!=="solo-trabajo" || e.calendarioTrabajo2025===undefined) throw Error("fixture B03")
 e.trabajo.rendimientos[0]!.integro="16000"
 e.calendarioTrabajo2025.tramos[0]!.integro="16000"
 e.trabajo.rendimientos.push({...e.trabajo.rendimientos[0]!,id:"pension-inss",clase:"pension",integro:"1000"})
 e.mezclaEmpleoPension2025={sujetoId:"s-2",empleoId:"pagador-a",pensionId:"pension-inss",pagadorPension:"INSS",soportePension:"certificado-anual-jubilacion",prestacion:"jubilacion-publica-ordinaria-no-exenta",imputacion:"periodica-2025-sin-atrasos-ni-art18"}
 return {...x,economia:e}
}
it.each(oraculos)("B03 Fraction %s", row=>{
 const {economia:e}=mezcla("madrid")
 e.trabajo.rendimientos[0]!.integro=row.empleo
 e.trabajo.rendimientos[1]!.integro=row.pension
 e.calendarioTrabajo2025!.tramos[0]!.integro=row.empleo
 for(const madrid of [false,true]) {
  const b=producirEconomiaAjena2025(e,madrid)
  expect(b.rentaAntesReducciones!.toFixed()).toBe(row.art19)
  expect(b.general.toFixed()).toBe(row.general)
  expect(b.ahorro.toFixed()).toBe("0")
 }
})
for(const territorio of ["madrid","comunitat-valenciana"] as const) {
 it(`B03 ${territorio} ambas API: base y cuota propias conservadas; consumidor regional`,()=>{
  const {a,e}=mezcla(territorio), control=casosT07(territorio)
  const ra=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),re=Effect.runSync(liquidarIrpfAnualExplicito(e))
  expect(ra.cuotaLiquidaCentimos).toBe(Effect.runSync(liquidarIrpfAnual(control.a,{modo:"canonico"})).cuotaLiquidaCentimos)
  expect(re.cuotaLiquidaLegal).toBe(Effect.runSync(liquidarIrpfAnualExplicito(control.e)).cuotaLiquidaLegal)
  expect(re.baseLiquidableGeneral).toBe("26056")
  if(territorio==="comunitat-valenciana") {
   const a1=Effect.runSync(liquidarIrpfAnual({...a,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
   const e1=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()}))
   expect(new D(a1.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(true)
   expect(new D(e1.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(true)
  } else {
   const f={solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}]} as const
   expect(Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:f},{modo:"canonico"})).cuotaLiquidaCentimos).toBeLessThan(ra.cuotaLiquidaCentimos)
   expect(new D(Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:f})).cuotaLiquidaLegal).lt(re.cuotaLiquidaLegal)).toBe(true)
  }
 })
 it(`B03 ${territorio} orden de prestaciones, certificados y tramos`,()=>{
  const {c,d,economia:e}=mezcla(territorio),cal=e.calendarioTrabajo2025!
  cal.certificados=[{...cal.certificados[0]!,id:"c0",efectosDesde:"2024-01-01",efectosHasta:"2024-12-31",grado:0},...cal.certificados]
  const before=producir(c,{...ambito,comunidadAutonoma:territorio,derechosMinimos:d},propia).bases.get("s-2")!.general.toFixed()
  e.trabajo.rendimientos.reverse();cal.certificados.reverse();cal.tramos.reverse();c.personas.reverse()
  expect(producir(c,{...ambito,comunidadAutonoma:territorio,derechosMinimos:d},propia).bases.get("s-2")!.general.toFixed()).toBe(before)
 })
 for(const causa of ["sin-contrato","sin-calendario","H2","identidad","duplicado","solape","fecha","emision","renta","filiacion","gasto-pension","clase","minimo"] as const) {
  it(`B03 ${territorio} ambas API rechazan ${causa}`,()=>{
   const {a,e,c,d,economia:ec}=mezcla(territorio),cal=ec.calendarioTrabajo2025!
   if(causa==="sin-contrato") delete ec.mezclaEmpleoPension2025
   if(causa==="sin-calendario" || causa==="H2") delete ec.calendarioTrabajo2025
   if(causa==="identidad") ec.mezclaEmpleoPension2025!.sujetoId="s-99"
   if(causa==="duplicado") ec.trabajo.rendimientos[1]!.id=ec.trabajo.rendimientos[0]!.id
   if(causa==="solape") cal.certificados.push({...cal.certificados[0]!,id:"otro"})
   if(causa==="fecha") cal.certificados[0]!.efectosDesde="2025-02-30"
   if(causa==="emision") cal.certificados[0]!.emision="2026-11-07"
   if(causa==="renta") d.descendientes[0]!.titulares[1]!.rentasNoExentasCentimos++
   if(causa==="filiacion") c.hijos[0]!.progenitores=["s-1"]
   if(causa==="gasto-pension") ec.trabajo.rendimientos[1]!.cotizaciones.seguridadSocial="1"
   if(causa==="clase") ec.trabajo.rendimientos[1]!.clase="otro-trabajo"
   if(causa==="minimo") { // El calendario pertenece ahora al descendiente; grado al devengo incompatible.
    c.personas[1]!.economia={perfil:"sin-rentas",censoRentasCompleto:true}
    c.personas[2]!.economia=ec;cal.sujetoId="s-3";cal.certificados[0]!.sujetoId="s-3";ec.mezclaEmpleoPension2025!.sujetoId="s-3"
   }
   expect(Effect.runSync(Effect.result(liquidarIrpfAnual(a,{modo:"canonico"})))).toMatchObject({_tag:"Failure"})
   expect(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))).toMatchObject({_tag:"Failure"})
  })
 }
}
it.each([["26293","100"],["26293.01","0"]])("B03 Valencia frontera exacta %s",(general,esperado)=>{
 const {c,d}=mezcla("comunitat-valenciana")
 expect(aplicar(solicitud(),producir(c,{...ambito,derechosMinimos:d},{general:new D(general),ahorro:new D(0)}),ats,new D(1000)).totalAplicado).toBe(esperado)
})

it("B03 parcial: sólo 73 días asociados, pensión excluida del límite",()=>{
 const {economia:e}=mezcla("madrid")
 e.trabajo.discapacidadActiva={grado:"65-o-mas",ayudaOMovilidadReducida:"no",acreditadaDuranteTodoElTrabajo:"no"}
 const cal=e.calendarioTrabajo2025!,t=cal.tramos[0]!
 cal.certificados[0]!.efectosDesde="2025-10-20"
 cal.tramos=[{...t,id:"antes",hasta:"2025-10-19",integro:"15000"},{...t,id:"despues",desde:"2025-10-20",integro:"1000"}]
 // Fraction: 1000 - 2000*73/365 = 600; art19=14400; art20=3543.
 expect(producirEconomiaAjena2025(e,true).general.toFixed()).toBe("10857")
 cal.tramos.reverse();cal.certificados.reverse()
 expect(producirEconomiaAjena2025(e,false).general.toFixed()).toBe("10857")
})
for(const territorio of ["madrid","comunitat-valenciana"] as const) for(const centimo of [0,1]) {
 it(`B03 frontera ambas API ${territorio} céntimo=${centimo}`,()=>{
  const {a,e,c,d,economia:ec}=mezcla(territorio),cal=ec.calendarioTrabajo2025!
  if(territorio==="madrid") {
   c.estadoCivil="casado-no-separado";c.conyuge="s-2"
   const ingreso=new D("106414").plus(new D(centimo).div(100)).toFixed()
   ec.trabajo.rendimientos[0]!.integro=ingreso;cal.tramos[0]!.integro=ingreso
  } else {
   ec.trabajo.discapacidadActiva={grado:"65-o-mas",ayudaOMovilidadReducida:"no",acreditadaDuranteTodoElTrabajo:"no"}
   const t=cal.tramos[0]!,ultimo=new D(7913).minus(new D(centimo).div(100))
   cal.certificados[0]!.efectosDesde="2025-10-20"
   cal.tramos=[{...t,id:"antes",hasta:"2025-10-19",integro:new D(16000).minus(ultimo).toFixed()},{...t,id:"despues",desde:"2025-10-20",integro:ultimo.toFixed()}]
  }
  for(const s of d.descendientes) for(const t of s.titulares) if(t.titularId==="s-2") t.rentasNoExentasCentimos=(territorio==="madrid"?9766400:748700)+centimo
  if(territorio==="comunitat-valenciana") {
   const ra=Effect.runSync(liquidarIrpfAnual({...a,deduccionesValencianas2025:solicitud()},{modo:"canonico"}))
   const re=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"valencianas-por-hechos-y-da61",deduccionesValencianas2025:solicitud()}))
   expect(new D(ra.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo===0)
   expect(new D(re.deduccionesValencianas2025!.totalAplicado!).gt(0)).toBe(centimo===0)
  } else {
   const f={solicitudes:[{lote:"F-ampliado",codigo:"madrid_condicion_familia_numerosa",hechos:{titulo:{categoria:"general",referencia:"titulo",efectos:"2025-01-01",titulares:["s-1"]}}}]} as const
   const antes=Effect.runSync(liquidarIrpfAnual(a,{modo:"canonico"})),despues=Effect.runSync(liquidarIrpfAnual({...a,deduccionesTerritoriales2025:f},{modo:"canonico"}))
   const pre=Effect.runSync(liquidarIrpfAnualExplicito(e)),post=Effect.runSync(liquidarIrpfAnualExplicito({...e,deducciones:"territoriales-por-hechos-y-da61",deduccionesTerritoriales2025:f}))
   expect(despues.cuotaLiquidaCentimos<antes.cuotaLiquidaCentimos).toBe(centimo===0)
   expect(new D(post.cuotaLiquidaLegal).lt(pre.cuotaLiquidaLegal)).toBe(centimo===0)
  }
 })
}
