import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import { aplicarConcurrenciaDosDescendientesAnual2025 as concurrir } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { producirBasesFamiliares2025 as producir } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarCuotaAnualValenciana2025 as aplicar } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota-conjunta"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import type { SolicitudDeduccionesValencianasAnual2025 as Request } from "../lib/dominio/irpf/deducciones/valenciana-2025/anual"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
// Existing facts only; neither this fixture nor the candidate supplies expected values.
import { censo, familia, solicitud, concurrente, deporte } from "./valencia-concurrencia-fixture"
import oracle from "./revision-valencia-salud-expectativas.json"
const D=Decimal.clone({precision:80})
const salud="valenciana_gastos_salud", t="valenciana_dos_o_mas_descendientes"
const id=(code:string)=>JSON.stringify([code,2025,"s-1"])
const ats=["s-3","s-4"].map(sujetoId=>({sujetoId,titulares:["s-1","s-2"]}))
type Profile=keyof typeof oracle.profiles
function facts(sport=true,profile:Profile="topes") {
 const s=sport?concurrente():solicitud()
 const parts=oracle.profiles[profile]
 s.solicitudes.push({codigo:salud,eleccion:"aplicar",unidades:parts.map(p=>({id:p.clase,titulares:["s-1"],fecha:"2025-07-01",numeros:{gasto:p.gasto,ayudas:p.ayudas,reembolsos:p.reembolsos},textos:{clase:p.clase,familiaReforzada:"no",factura:"expediente/F",informeFacultativo:"expediente/I",registroSanitario:"expediente/R",justificantePago:"expediente/P",medioPago:"transferencia",tipoGasto:"tratamiento",finalidad:"sanitaria-no-estetica",donativo683:"no"}})),referencias:parts.map(p=>({unidad:p.clase,sujetos:["s-1"],bienes:[],eventos:["tratamiento-facturado-"+p.clase],cantidades:["p-"+p.clase]}))})
 s.cantidades.push(...parts.map(p=>({id:"p-"+p.clase,euros:p.gasto})))
 s.ordenConsumo.push(id(salud));return s
}
type Facts=ReturnType<typeof facts>
function previous(s:Request,quota:string,base=26056) {
 const {arrastres,ordenConsumo,criterioOrden,...h}=s
 return aplicar({hechos:{...h,solicitudes:h.solicitudes.map(({descendientesIncremento,...p})=>descendientesIncremento===undefined?p:{...p,descendientesIncremento}),bases:{liquidableGeneral:base,liquidableAhorro:0,imponibleGeneral:base,imponibleAhorro:0},cuota:{referencia:"cuota-autonomica-anual-2025:s-1",disponible:quota,arrastres}},ordenConsumo,criterioOrden})
}
function internal(s:Facts,quota:string,base="26056",other="0",baseHealth=26056) {
 const l=producir(censo(),{anio:2025,comunidadAutonoma:"comunitat-valenciana",contribuyenteId:"s-1"},{general:new D(base),ahorro:new D(0)})
 const bases=new Map(l.bases);bases.set("s-2",{general:new D(other),ahorro:new D(0)})
 return concurrir(s,{...l,bases},ats,new D(quota),p=>previous(p,quota,baseHealth))
}
for(const o of oracle.cases)for(const reverse of [false,true])it("independent residual "+JSON.stringify([o.profile,o.sport,o.first,o.quota,reverse]),()=>{
 const s=facts(o.sport,Schema.decodeUnknownSync(Schema.Literals(["topes", "netos", "subcentimo", "reintegrado"]))(o.profile))
 // Request order varies independently of expert order. t intentionally first.
 s.ordenConsumo=[id(t),...o.movements.map(m=>id(m.code==="salud"?salud:deporte))]
 if(reverse){s.solicitudes.reverse();s.cantidades.reverse();for(const p of s.solicitudes){p.unidades.reverse();p.referencias.reverse()}}
 const v=internal(s,o.quota);expect(v.estado).toBe("calculo_parcial")
 expect(v.totalAplicado).toBe(o.total);expect(v.cuotaRestante).toBe(o.remaining)
 expect(v.movimientos.map(m=>m.codigo)).toEqual([...o.movements.map(m=>m.code==="salud"?salud:deporte),t])
 for(const [i,e] of o.movements.entries()){
  const m=v.movimientos[i]!;expect(m.deduccionDisponible).toBe(e.generated);expect(m.aplicado).toBe(e.applied);expect(m.perdidoPorCuota).toBe(e.lost)
 }
 expect(v.movimientos.at(-1)!.aplicado).toBe(o.t)
 expect(new D(v.totalAplicado!).plus(v.cuotaRestante!).eq(o.quota)).toBe(true)
 expect(new Set(v.movimientos.map(m=>m.id)).size).toBe(v.movimientos.length)
 for(const m of v.movimientos){expect(m.pendiente).toBe("0");expect(m.caducadoAlCierre).toBe("0")}
 expect(v.aceptacionFiscal).toBe("pendiente")
})
it.each([
 ["29999.9999999999999999999999999999999999","0","37"],
 ["30000","0","37"],["30000.0000000000000000000000000000000001","0","0"],
 ["20000","10000","37"],["20000","10000.0000000000000000000000000000000001","0"],
])("family decimal boundary own=%s other=%s",(own,other,expected)=>{
 expect(internal(facts(),"1000",own,other).movimientos.at(-1)!.aplicado).toBe(expected)
})
it.each([[54000,"600"],[57000,"300"],[60000,"0"]])("health cap taper %s",(base,expected)=>{
 const v=internal(facts(false),"1000",String(base),"0",base)
 expect(v.movimientos[0]!.deduccionDisponible).toBe(expected);expect(v.movimientos.at(-1)!.aplicado).toBe("0")
})
const invalid=["factura","informeFacultativo","registroSanitario","justificantePago","seguro","estetica","cash","donativo","reembolsos","duplicada","compartido","importe","ajeno","copropio","clase","sin-censo","referencia-t"] as const
function mutate(s:Facts,cause:typeof invalid[number]) {
 const p=s.solicitudes.find(p=>p.codigo===salud)!,u=p.unidades[0]!
 if(["factura","informeFacultativo","registroSanitario","justificantePago"].includes(cause))u.textos[cause]="   "
 if(cause==="seguro")u.textos.tipoGasto="prima-seguro"
 if(cause==="estetica")u.textos.finalidad="estetica"
 if(cause==="cash")u.textos.medioPago="efectivo"
 if(cause==="donativo")u.textos.donativo683="si"
 if(cause==="reembolsos")delete u.numeros.reembolsos
 if(cause==="clase")u.textos.clase="otra"
 if(cause==="ajeno")p.referencias[0]!.sujetos=["s-3"]
 if(cause==="copropio")u.titulares.push("s-2")
 if(cause==="duplicada"){p.unidades.push({...u,id:"dup"});p.referencias.push({...p.referencias[0]!,unidad:"dup"})}
 if(cause==="importe")s.cantidades.find(c=>c.id==="p-dental")!.euros=999
 if(cause==="compartido"){
  u.numeros.gasto=100;p.referencias[0]!.cantidades=["pago"]
  s.cantidades=s.cantidades.filter(c=>c.id!=="p-dental")
 }
 if(cause==="referencia-t")s.solicitudes.find(p=>p.codigo===t)!.referencias[0]!.sujetos=["s-3","s-3"]
}
for(const quota of ["0","0.009","1000"])for(const cause of invalid)it("invalid even without quota "+quota+" "+cause,()=>{
 const s=facts();mutate(s,cause)
 if(cause==="sin-censo"){
  expect(()=>concurrir(s,undefined,ats,new D(quota),p=>previous(p,quota))).toThrow();return
 }
 // Either structured unsupported or RangeError is the internal rejection contract.
 let rejected=false
 try {rejected=internal(s,quota).estado==="no_soportado"}catch(e){if(!(e instanceof RangeError))throw e;rejected=true}
 expect(rejected).toBe(true)
})
for(const api of ["canonical","explicit"] as const){
 function run(s:Facts,zero=false){
  const wage=zero?10000:30000,rights=familia("comunitat-valenciana")
  for(const d of rights.descendientes)for(const holder of d.titulares)if(holder.titularId==="s-1")holder.rentasNoExentasCentimos=zero?735200:2605600
  const common={contribuyenteId:"s-1",comunidadAutonoma:"comunitat-valenciana",derechosMinimos:rights,basesFamiliares2025:censo(),deduccionesValencianas2025:s} as const
  const job=structuredClone(efectivo.trabajo),r=job.rendimientos[0]!
  return api==="canonical"
   ? Effect.runSync(Effect.result(liquidarIrpfAnual({...analitico,...common,rendimientos:{trabajo:[{importeIntegroCentimos:wage*100}]}},{modo:"canonico"})))
   : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({...efectivo,...common,trabajo:{...job,rendimientos:[{...r,integro:String(wage),cotizaciones:{...r.cotizaciones,seguridadSocial:zero?"648":"1944"}}]},familiaresConDerechoMinimo:"segun-derechos",deducciones:"valencianas-por-hechos-y-da61"})))
 }
 it(api+" full annual smoke from independent Fraction",()=>{
  const r=run(facts());expect(r._tag).toBe("Success");if(r._tag==="Failure")return
  const v=r.success.deduccionesValencianas2025!
  // Salary 30000, contribution 1944, expense 2000, taxable 26056;
  // regional scale difference versus minimum 8910 = 2086.5, see retained Fraction.
  expect(v.totalAplicado).toBe("775.65");expect(v.cuotaRestante).toBe("1310.85")
 })
 it(api+" zero-quota positive control",()=>{
  const r=run(facts(),true);expect(r._tag).toBe("Success");if(r._tag==="Failure")return
  expect(r.success.deduccionesValencianas2025!.totalAplicado).toBe("0")
 })
 for(const cause of invalid.filter(c=>c!=="sin-censo"))it(api+" validates at zero quota "+cause,()=>{
  const s=facts();mutate(s,cause);const r=run(s,true);expect(r._tag).toBe("Failure")
  if(r._tag==="Failure")expect(r.failure._tag).toBe("ResultadoNoSoportado")
 })
 it(api+" T02 sport-only survives",()=>{
  const r=run(concurrente());expect(r._tag).toBe("Success");if(r._tag==="Failure")return
  const v=r.success.deduccionesValencianas2025!
  expect(v.movimientos.map(m=>m.aplicado)).toEqual(["30","205.65"])
  expect(v.totalAplicado).toBe("235.65");expect(v.cuotaRestante).toBe("1850.85")
 })
}
