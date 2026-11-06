import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarConcurrenciaDosDescendientesAnual2025 as concurrir } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { producirBasesFamiliares2025 as producir } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarCuotaAnualValenciana2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota-conjunta"
import type { SolicitudDeduccionesValencianasAnual2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/anual"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { censo, familia, concurrente, deporte } from "./valencia-concurrencia-fixture"
import oraculos from "./valencia-concurrencia-oraculos.json"
const D = Decimal.clone({ precision: 80 })
const ambito = {anio:2025,comunidadAutonoma:"comunitat-valenciana",contribuyenteId:"s-1"} as const
const ats = ["s-3","s-4"].map(sujetoId=>({sujetoId,titulares:["s-1","s-2"]}))
function evaluarDeporte(solicitud: SolicitudDeduccionesValencianasAnual2025,cuota:string) {
 const {arrastres,ordenConsumo,criterioOrden,...hechos}=solicitud
 return aplicarCuotaAnualValenciana2025({hechos:{...hechos,solicitudes:hechos.solicitudes.map(({descendientesIncremento,...peticion})=>descendientesIncremento === undefined ? peticion : {...peticion,descendientesIncremento}),bases:{liquidableGeneral:26056,liquidableAhorro:0,imponibleGeneral:26056,imponibleAhorro:0},cuota:{referencia:"cuota-autonomica-anual-2025:s-1",disponible:cuota,arrastres}},ordenConsumo,criterioOrden})
}
function interno(cuota:string,s=concurrente(),base="26056") {
 const libro = producir(censo(),ambito,{general:new D(base),ahorro:new D(0)})
 return concurrir(s,libro,ats,new D(cuota),solicitud=>evaluarDeporte(solicitud,cuota))
}
for (const api of ["canonica","explicita"] as const) {
 function evaluar(s: SolicitudDeduccionesValencianasAnual2025,c=censo()) {
  const comunes={contribuyenteId:"s-1",comunidadAutonoma:"comunitat-valenciana",derechosMinimos:familia("comunitat-valenciana"),basesFamiliares2025:c,deduccionesValencianas2025:s} as const
  return api === "canonica"
   ? Effect.runSync(Effect.result(liquidarIrpfAnual({...analitico,...comunes},{modo:"canonico"})))
   : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({...efectivo,...comunes,familiaresConDerechoMinimo:"segun-derechos",deducciones:"valencianas-por-hechos-y-da61"})))
 }
 it.each([false,true])(api+" VALENCIA_LIBRO_UNICO positivo y orden inverso=%s",inverso=>{
  const s=concurrente();if(inverso){s.solicitudes.reverse();s.ordenConsumo.reverse()}
  const r=evaluar(s);expect(r._tag).toBe("Success")
  if(r._tag === "Failure")return
  const v=r.success.deduccionesValencianas2025!,o=oraculos.casos[0]!
  expect(v.movimientos.map(m=>m.codigo)).toEqual([deporte,"valenciana_dos_o_mas_descendientes"])
  expect(v.movimientos.map(m=>m.aplicado)).toEqual([o.deporteAplicado,o.t])
  expect(v.totalAplicado).toBe(o.total);expect(v.cuotaRestante).toBe(o.restante)
 })
 it.each(["ausente","identidad","duplicado"])(api+" censo incompleto o contradictorio %s",causa=>{
  const c=censo()
  if(causa==="ausente")c.personas.splice(1,1)
  if(causa==="identidad")c.contribuyente="s-9"
  if(causa==="duplicado")c.personas.push(c.personas[1]!)
  expect(evaluar(concurrente(),c)._tag).toBe("Failure")
 })
 it.each(["edad","grado","pago","sujeto","fecha","sin-gasto","duplicada","referencia-t","cantidad-t","incremento-t","arrastre","otro-codigo","titular"])(api+" otra deducción inválida no oculta %s",causa=>{
  const s=concurrente(),p=s.solicitudes[1]!,t=s.solicitudes[0]!
  if(causa==="edad")p.unidades[0]!.numeros.edad=76
  if(causa==="grado")p.unidades[0]!.numeros.grado=65
  if(causa==="pago")s.cantidades[0]!.euros=99
  if(causa==="sujeto")p.referencias[0]!.sujetos=["s-99"]
  if(causa==="fecha")p.unidades[0]!.fecha="2024-06-02"
  if(causa==="sin-gasto")delete p.unidades[0]!.numeros.gasto
  if(causa==="duplicada")s.solicitudes.push(p)
  if(causa==="referencia-t")t.referencias[0]!.sujetos=["s-3","s-3"]
  if(causa==="cantidad-t")t.referencias[0]!.cantidades=["pago"]
  if(causa==="incremento-t")t.descendientesIncremento=["s-3"]
  if(causa==="arrastre")s.arrastres.push({id:"h",codigo:deporte,contribuyente:"s-1",origen:2024,pendiente:10,soporte:"historia"})
  if(causa==="otro-codigo")p.codigo="valenciana_gastos_salud"
  if(causa==="titular")p.unidades[0]!.titulares.push("s-2")
  const r=evaluar(s);expect(r._tag).toBe("Failure")
  if(r._tag === "Failure")expect(r.failure._tag).toBe("ResultadoNoSoportado")
 })
}
it.each(oraculos.casos.slice(0,5))("cuota insuficiente/agotada/cero legítimo: $cuota y $deporte",o=>{
 const s=concurrente();if(o.deporte==="0"){s.cantidades[0]!.euros=0;s.solicitudes[1]!.unidades[0]!.numeros.gasto=0}
 const v=interno(o.cuota,s)
 expect(v.estado).toBe("calculo_parcial");expect(v.totalAplicado).toBe(o.total);expect(v.cuotaRestante).toBe(o.restante)
 expect(v.movimientos.map(m=>m.aplicado)).toEqual([o.deporteAplicado,o.t])
 expect(new D(v.movimientos[0]!.perdidoPorCuota).eq(new D(o.deporte).minus(o.deporteAplicado))).toBe(true)
})
it.each([false,true])("límite30000 inclusivo y exceso racional: %s",exceso=>{
 const o=oraculos.casos[exceso?6:5]!
 expect(interno(o.cuota,concurrente(),exceso?"30000.0000000000000000000000000000000001":"30000").totalAplicado).toBe(o.total)
})
it("otro titular y descendientes cuentan una vez aunque compartan titular",()=>{
 const s=concurrente(),l=producir(censo(),ambito,{general:new D(20000),ahorro:new D(0)})
 // Aísla agregación exacta: libro interno alterado para frontera, nunca hechos públicos externos.
 const bases=new Map(l.bases);bases.set("s-2",{general:new D(9000),ahorro:new D(0)});bases.set("s-3",{general:new D(1000),ahorro:new D(0)})
 const evaluar=(solicitud: SolicitudDeduccionesValencianasAnual2025)=>evaluarDeporte(solicitud,"1000")
 expect(concurrir(s,{...l,bases},ats,new D(1000),evaluar).movimientos[1]!.aplicado).toBe("97")
 bases.set("s-4",{general:new D("0.01"),ahorro:new D(0)})
 expect(concurrir(s,{...l,bases},ats,new D(1000),evaluar).movimientos[1]!.aplicado).toBe("0")
})
it("sin productor no inventa cero",()=>{
 expect(()=>concurrir(concurrente(),undefined,ats,new D(1000),solicitud=>evaluarDeporte(solicitud,"1000"))).toThrow(/censo económico/)
})
