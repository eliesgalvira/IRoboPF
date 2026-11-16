import { Effect, Schema } from "effect"
import { describe, expect, it } from "vitest"
import Decimal from "decimal.js"
import slots from "./fixtures/dt18-open2025-entradas.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial-esquemas"
import { HechosDT18Estatal2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/contrato"
import { producirDT18Estatal2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import { aplicarCuotasDT18 } from "../lib/dominio/irpf/vivienda-dt18-2025/cuota"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// Oráculo independiente: céntimos BigInt y fracción 3/40, sin fórmula del producto.
const cents=(s:string)=>{const [e,d=""]=s.split(".");return BigInt(e!)*100n+BigInt(d.padEnd(2,"0"))}
const euros=(n:bigint)=>String(n/100n)+"."+String(n%100n).padStart(2,"0")
const serial=(n:bigint)=>({numeradorCentimos:String(n),denominador:"1"})
function canonico(s:typeof slots[number]):CasoFiscalAnual {
 const e=s.entradaAPI
 const parsed=Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(e)
 return {anio:2025,comunidadAutonoma:parsed.comunidadAutonoma,contribuyenteId:e.contribuyenteId,
 situacionFamiliar:{tipo:"individual",edad:e.edad,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},
 rendimientos:{trabajo:[{importeIntegroCentimos:Number(cents(e.trabajo.rendimientos[0]!.integro))}]},
 reducciones:[],deducciones:[],retencionesSoportadasCentimos:1400000,pagosACuentaCentimos:0,
 deduccionesTerritoriales2025:Schema.decodeUnknownSync(SolicitudDeduccionesTerritoriales2025)(e.deduccionesTerritoriales2025)}
}
function ambas(s:typeof slots[number]) {
 return [Effect.map(liquidarIrpfAnual(canonico(s),{modo:"canonico"}),r=>({t:r.deduccionesTerritoriales2025,q:new Decimal(r.cuotaLiquidaCentimos).div(100)})),
 Effect.map(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(s.entradaAPI)),r=>({t:r.deduccionesTerritoriales2025,q:new Decimal(r.cuotaLiquidaLegal)}))]
}
function sinPagos(s:typeof slots[number]) {
 const z=structuredClone(s),h=z.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025
 const pago=h.movimientos.filter(m=>m.clase==="amortizacion"||m.clase==="intereses").reduce((n,m)=>n+cents(m.importe),0n)
 h.movimientos=h.movimientos.filter(m=>m.clase!=="amortizacion"&&m.clase!=="intereses")
 const consumo=h.movimientos.find(m=>m.clase==="consumo")!;consumo.importe=euros(cents(consumo.importe)+pago)
 for(const p of h.proyectos){p.vivienda.pagos=[];p.prestamo.pagos2025=[];p.prestamo.principalFinal.importe=p.prestamo.principalInicio.importe}
 // Rioja exige conciliación por valor de su solicitud regional incluso a base cero.
 for(const r of z.entradaAPI.deduccionesTerritoriales2025.solicitudes){r.inversionesViviendaEjercicio=[];r.hechos.viviendas[0]!.pagos=[]}
 return z
}
describe("DT18 ordinaria: ocho entradas sintéticas, sin esperado Open",()=>{
 for(const slot of slots)it(slot.id+": ambas API consumen cada tramo una sola vez",()=>{
  const h=slot.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025
  const pagos=h.proyectos[0]!.vivienda.pagos.reduce((n,p)=>n+cents(p.importe),0n)
  const base=pagos<904000n?pagos:904000n,tramo=racional(String(base*3n),"4000")
  const controles=ambas(sinPagos(slot))
  for(const [i,e] of ambas(slot).entries()){
   const r=Effect.runSync(e),t=r.t!,l=t.viviendaDT182025!
   expect(l.baseDerechoSinAdecuacion).toEqual(serial(base))
   expect(l.cuotas!.estatal.total).toEqual(tramo);expect(l.cuotas!.autonomica.total).toEqual(tramo)
   expect(t.total).toEqual(racional("0"))
   expect(r.q.eq(Effect.runSync(controles[i]!).q.minus(new Decimal(String(base*6n)).div(4000)))).toBe(true)
   expect(l.reservaRegionalFinal).toEqual({adquisicionSegunda:serial(0n),rehabilitacionAdecuacion:serial(0n)})
  }
 })
 // La API canónica usa cotización calculada: sólo se contrasta el delta DT18
 // dentro de cada API. La entrada explícita mantiene SS efectiva3900 íntegra.
 for(const slot of slots.filter(s=>s.territorio!=="la-rioja")) {
  it(slot.id+": capital limitado por patrimonio y valor excluido",()=>{
   for(const valor of ["0","999999"]){
    const s=structuredClone(slot),h=s.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025
    h.adquisicion.valorCierre.importe=valor
    h.cuentas[0]!.cierre.importe="9999.99"
    const consumo=h.movimientos.find(m=>m.clase==="consumo")!;consumo.importe=euros(cents(consumo.importe)+1n)
    const total=h.proyectos[0]!.vivienda.pagos.reduce((n,p)=>n+cents(p.importe),0n)-1n
    for(const e of ambas(s))expect(Effect.runSync(e).t?.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual(serial(total))
   }
  })
  for(const fallo of ["practica","historia","principal","patrimonio","territorio","concurrencia"] as const)it(slot.id+": rechaza "+fallo,()=>{
   const s=structuredClone(slot),h=s.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025,p=h.proyectos[0]!
   if(fallo==="practica")p.aplicacionAnterior.ejercicio=2013
   if(fallo==="historia")h.historia.ejercicios=[]
   if(fallo==="principal")p.prestamo.principalFinal.importe="1"
   if(fallo==="patrimonio")h.movimientos[0]!.clase="herencia"
   if(fallo==="territorio")s.entradaAPI.comunidadAutonoma="la-rioja"
   if(fallo==="concurrencia")s.entradaAPI.deduccionesTerritoriales2025.solicitudes=structuredClone(slots.find(x=>x.territorio==="la-rioja")!.entradaAPI.deduccionesTerritoriales2025.solicitudes)
   for(const e of ambas(s))expect(Effect.runSync(Effect.flip(e))._tag).toBe("ResultadoNoSoportado")
  })
 }
 it("contrato estricto rechaza cuotas/bases externas y modalidades ajenas",()=>{
  const h=slots.find(s=>s.territorio!=="la-rioja")!.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025
  for(const k of ["base","cuota","derecho"])expect(()=>Schema.decodeUnknownSync(HechosDT18Estatal2025)({...h,[k]:"1"},{onExcessProperty:"error"})).toThrow()
  for(const territorio of ["la-rioja","murcia","catalunya"]){const z=structuredClone(h);z.proyectos[0]!.vivienda.inmueble.territorio=territorio;expect(()=>Schema.decodeUnknownSync(HechosDT18Estatal2025)(z,{onExcessProperty:"error"})).toThrow()}
 })
 it("tope9040, préstamo reconstruido y cero pagos en ambas API",()=>{
  const s=structuredClone(slots.find(s=>s.territorio!=="la-rioja")!),h=s.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025,p=h.proyectos[0]!
  const capital=p.vivienda.pagos.find(x=>x.concepto==="amortizacion")!,delta=1_000_000n-cents(capital.importe)
  capital.importe="10000.00";h.movimientos.find(x=>x.clase==="amortizacion")!.importe=capital.importe
  p.prestamo.principalFinal.importe="20000.00"
  const consumo=h.movimientos.find(x=>x.clase==="consumo")!;consumo.importe=euros(cents(consumo.importe)-delta)
  for(const e of ambas(s)){const l=Effect.runSync(e).t!.viviendaDT182025!;expect(l.baseDerechoSinAdecuacion).toEqual(serial(904000n));expect(l.cuotas!.estatal.total).toEqual(racional("678"))}
  for(const e of ambas(sinPagos(s))){const l=Effect.runSync(e).t!.viviendaDT182025!;expect(l.baseDerechoSinAdecuacion).toEqual(serial(0n));expect(l.cuotas!.estatal.total).toEqual(racional("0"))}
 })
 it("consumo racional asimétrico no redondea ni duplica cuota",()=>{
  const s=slots.find(s=>s.territorio!=="la-rioja")!,h=Schema.decodeUnknownSync(HechosDT18Estatal2025)(s.entradaAPI.deduccionesTerritoriales2025.viviendaDT182025)
  const libro=producirDT18Estatal2025(h,canonico(s),[]),q=aplicarCuotasDT18(libro,racional("1","3"),racional("100"))
  expect(q.estatal.total).toEqual(racional("1","3"));expect(q.autonomica.total).toEqual(racional("100"))
  expect(q.estatal.disponible).toEqual(racional("0"));expect(q.autonomica.disponible).toEqual(racional("0"))
 })
})
