import Decimal from "decimal.js"
import { Effect } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { aplicarConcurrenciaDosDescendientesAnual2025 as concurrir } from "../lib/dominio/irpf/bases-familiares-2025/valencia"
import { producirBasesFamiliares2025 as producir } from "../lib/dominio/irpf/bases-familiares-2025/productor"
import { aplicarCuotaAnualValenciana2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/cuota-conjunta"
import type { SolicitudDeduccionesValencianasAnual2025 } from "../lib/dominio/irpf/deducciones/valenciana-2025/anual"
import { analitico, efectivo } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import { censo, familia, concurrente, solicitud, deporte } from "./valencia-concurrencia-fixture"
import oraculos from "./valencia-salud-descendientes-oraculos.json"
const D = Decimal.clone({precision:80})
const salud = "valenciana_gastos_salud"
const codigoT = "valenciana_dos_o_mas_descendientes"
const id = (codigo:string) => JSON.stringify([codigo,2025,"s-1"])
function hechos(conDeporte:boolean, categorias=false) {
 const s=conDeporte ? concurrente() : solicitud()
 const clases=categorias ? ["dental","mental","optica","cronica_rara","cerebral_alzheimer"] : ["dental"]
 s.solicitudes.push({codigo:salud,eleccion:"aplicar",unidades:clases.map(clase=>({id:clase,titulares:["s-1"],fecha:"2025-06-02",numeros:{gasto:1000,ayudas:0,reembolsos:0},textos:{factura:"factura-"+clase,informeFacultativo:"informe-"+clase,registroSanitario:"registro-prestador",justificantePago:"transferencia-"+clase,medioPago:"transferencia",tipoGasto:"tratamiento",finalidad:"sanitaria-no-estetica",donativo683:"no",...(clase==="cronica_rara"||clase==="cerebral_alzheimer" ? {clase,familiaReforzada:"no"} : {clase})}})),referencias:clases.map(clase=>({unidad:clase,sujetos:["s-1"],bienes:[],eventos:["factura-pago-transferencia-informe-registro-"+clase],cantidades:["pago-"+clase]}))})
 s.cantidades.push(...clases.map(clase=>({id:"pago-"+clase,euros:1000})))
 s.ordenConsumo.push(id(salud))
 return s
}
function previo(s:SolicitudDeduccionesValencianasAnual2025, cuota:string) {
 const {arrastres,ordenConsumo,criterioOrden,...h}=s
 return aplicarCuotaAnualValenciana2025({hechos:{...h,solicitudes:h.solicitudes.map(({descendientesIncremento,...p})=>descendientesIncremento===undefined?p:{...p,descendientesIncremento}),bases:{liquidableGeneral:26056,liquidableAhorro:0,imponibleGeneral:26056,imponibleAhorro:0},cuota:{referencia:"cuota-autonomica-anual-2025:s-1",disponible:cuota,arrastres}},ordenConsumo,criterioOrden})
}
function interno(s:ReturnType<typeof hechos>,cuota:string,base="26056") {
 const libro=producir(censo(),{anio:2025,comunidadAutonoma:"comunitat-valenciana",contribuyenteId:"s-1"},{general:new D(base),ahorro:new D(0)})
 return concurrir(s,libro,["s-3","s-4"].map(sujetoId=>({sujetoId,titulares:["s-1","s-2"]})),new D(cuota),p=>previo(p,cuota))
}
for(const api of ["canonica","explicita"] as const) {
 function evaluar(s:ReturnType<typeof hechos>,salario=30000,c=censo()) {
  const derechos=familia("comunitat-valenciana")
  // Renta para mínimos antes de art20; la base del libro la deriva cada API.
  const renta=Math.max(0,salario*0.9352-2000)
  for(const d of derechos.descendientes)for(const t of d.titulares)if(t.titularId==="s-1")t.rentasNoExentasCentimos=Math.round(renta*100)
  const comunes={contribuyenteId:"s-1",comunidadAutonoma:"comunitat-valenciana",derechosMinimos:derechos,basesFamiliares2025:c,deduccionesValencianas2025:s} as const
  const trabajo=structuredClone(efectivo.trabajo)
  const r=trabajo.rendimientos[0]!
  const actualizado={...trabajo,rendimientos:[{...r,integro:String(salario),cotizaciones:{...r.cotizaciones,seguridadSocial:new D(salario).times("0.0648").toFixed()}}]}
  return api==="canonica"
   ? Effect.runSync(Effect.result(liquidarIrpfAnual({...analitico,...comunes,rendimientos:{trabajo:[{importeIntegroCentimos:salario*100}]}},{modo:"canonico"})))
   : Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({...efectivo,...comunes,trabajo:actualizado,familiaresConDerechoMinimo:"segun-derechos",deducciones:"valencianas-por-hechos-y-da61"})))
 }
 for(const o of oraculos.api)for(const conDeporte of [false,true])for(const inverso of [false,true]) {
  it(api+" salud propia, cuota "+o.cuota+", deporte="+conDeporte+", inverso="+inverso,()=>{
   const s=hechos(conDeporte,true)
   if(inverso){s.solicitudes.reverse();s.ordenConsumo.reverse();s.cantidades.reverse()}
   const r=evaluar(s,o.salario);expect(r._tag).toBe("Success");if(r._tag==="Failure")return
   const v=r.success.deduccionesValencianas2025!,e=conDeporte?o.conDeporte:o.soloSalud
   expect(v.totalAplicado).toBe(e.total);expect(v.cuotaRestante).toBe(e.restante)
   expect(v.movimientos.at(-1)!.codigo).toBe(codigoT);expect(v.movimientos.at(-1)!.aplicado).toBe(e.t)
   expect(new Set(v.movimientos.map(m=>m.id)).size).toBe(conDeporte?3:2)
   expect(new D(v.totalAplicado!).plus(v.cuotaRestante!).toFixed()).toBe(o.cuota)
   // Cuota escasa: asignación entre compatibles respeta elección experta.
   let disponible=new D(o.cuota)
   for(const m of v.movimientos.slice(0,-1)) {
    const generado=m.codigo===salud?new D(600):new D(30)
    expect(m.deduccionDisponible).toBe(generado.toFixed())
    expect(m.aplicado).toBe(D.min(disponible,generado).toFixed())
    disponible=disponible.minus(m.aplicado)
    expect(m.perdidoPorCuota).toBe(generado.minus(m.aplicado).toFixed());expect(m.pendiente).toBe("0")
   }
  })
 }
 it.each(["factura","informeFacultativo","registroSanitario","justificantePago","efectivo","seguro","estetico","donativo","clase","gasto","ayudas","evento","pago","registro-cantidad","duplicado","categoria-repetida","ajeno","arrastre","otro","consignacion","cantidad-compartida","sin-censo"])(api+" rechaza requisito/compatibilidad ausente: %s",causa=>{
  const s=hechos(true),p=s.solicitudes.find(p=>p.codigo===salud)!
  if(["factura","informeFacultativo","registroSanitario","justificantePago"].includes(causa))delete p.unidades[0]!.textos[causa]
  if(causa==="efectivo")p.unidades[0]!.textos.medioPago="efectivo"
  if(causa==="seguro")p.unidades[0]!.textos.tipoGasto="prima-seguro"
  if(causa==="estetico")p.unidades[0]!.textos.finalidad="estetica"
  if(causa==="donativo")p.unidades[0]!.textos.donativo683="si"
  if(causa==="clase")delete p.unidades[0]!.textos.clase
  if(causa==="gasto")delete p.unidades[0]!.numeros.gasto
  if(causa==="ayudas")delete p.unidades[0]!.numeros.ayudas
  if(causa==="evento")p.referencias[0]!.eventos=[]
  if(causa==="pago")p.referencias[0]!.cantidades=[]
  if(causa==="registro-cantidad")s.cantidades.find(c=>c.id==="pago-dental")!.euros=999
  if(causa==="duplicado")s.solicitudes.push(p)
  if(causa==="categoria-repetida"){p.unidades.push({...p.unidades[0]!,id:"otra"});p.referencias.push({...p.referencias[0]!,unidad:"otra"})}
  if(causa==="ajeno")p.referencias[0]!.sujetos=["s-3"]
  if(causa==="arrastre")s.arrastres.push({id:"h",codigo:salud,contribuyente:"s-1",origen:2024,pendiente:10,soporte:"no soportado"})
  if(causa==="otro")p.codigo="valenciana_tratamientos_fertilidad"
  if(causa==="consignacion")s.consignaciones.push({codigo:salud,contribuyente:"s-1"})
  if(causa==="cantidad-compartida"){
   p.unidades[0]!.numeros.gasto=100;p.referencias[0]!.cantidades=["pago"]
   s.cantidades=s.cantidades.filter(c=>c.id!=="pago-dental")
  }
  const c=censo();if(causa==="sin-censo")c.personas.splice(1,1)
  const r=evaluar(s,30000,c);expect(r._tag).toBe("Failure")
  if(r._tag==="Failure")expect(r.failure._tag).toBe("ResultadoNoSoportado")
 })
}
for(const o of oraculos.internos)for(const conDeporte of [false,true])for(const inverso of [false,true])it("Fraction residual "+JSON.stringify([o.cuota,conDeporte,inverso]),()=>{
 const s=hechos(conDeporte);if(inverso){s.solicitudes.reverse();s.ordenConsumo.reverse()}
 const v=interno(s,o.cuota),e=conDeporte?o.conDeporte:o.soloSalud
 expect(v.totalAplicado).toBe(e.total);expect(v.cuotaRestante).toBe(e.restante);expect(v.movimientos.at(-1)!.aplicado).toBe(e.t)
})
it.each(oraculos.fronteras)("base familiar exacta $base",o=>{
 const v=interno(hechos(true),"1000",o.base)
 expect(v.movimientos.at(-1)!.aplicado).toBe(o.t)
})
it("sin libro familiar no inventa cuota ni elegibilidad",()=>{
 expect(()=>concurrir(hechos(false),undefined,[],new D(1000),p=>previo(p,"1000"))).toThrow(/censo económico/)
})
