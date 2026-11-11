import { historica, ambas as ambasP5a } from "./rioja-anterior-fixture"
import { producirDT18Murcia2025, determinarDerechoDT18Balears2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/productor"
import { perfilDerecho, historia } from "./balears-alquiler-dt18.fixtures"
import { HechosDT18Murcia2025 } from "../lib/dominio/irpf/vivienda-dt18-2025/contrato"
import type { CasoFiscalAnual } from "../lib/dominio/irpf/caso-fiscal-anual"
import { expect, it } from "vitest"
import { Effect, Schema } from "effect"
import { fixture, ambas } from "./dt18-rioja-fixture"
import { ajustarPatrimonioP5a } from "../lib/dominio/irpf/patrimonio-p5a/productor"
import { euros } from "../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/comun"

// Sólo se reutilizan hechos y adaptadores de API; ningún esperado fiscal del autor.
// Oráculo exacto en céntimos enteros; cuotas conservan fracciones de céntimo.
const min = (a: bigint, b: bigint) => a < b ? a : b
const max = (a: bigint, b: bigint) => a > b ? a : b
function dinero(c: bigint) { return `${c < 0n ? "-" : ""}${(c < 0n ? -c : c) / 100n}.${String((c < 0n ? -c : c) % 100n).padStart(2,"0")}` }
function gcd(a: bigint,b: bigint): bigint { return b === 0n ? a : gcd(b,a % b) }
function cuota(base: bigint, n: bigint, d: bigint) {
  const num = base * n, den = 100n * d, g = gcd(num,den)
  return { numeradorEuros: String(num/g), divisor: String(den/g) }
}
const serial = (c: bigint) => ({numeradorCentimos: String(c), denominador: "1"})
function expediente(operacion: "adquisicion" | "rehabilitacion" | "adecuacion", capital: bigint, incremento: bigint, intereses: bigint, gastos = 0n) {
  const s = structuredClone(fixture([operacion])), h = s.viviendaDT182025
  const p = h.proyectos.find(x => x.operacion === operacion)!
  const cap = p.vivienda.pagos.find(x=>x.concepto === "amortizacion")!
  const interes = p.vivienda.pagos.find(x=>x.concepto === "intereses")!
  Object.assign(cap,{importe: dinero(capital)}); Object.assign(interes,{importe: dinero(intereses)})
  Object.assign(p.prestamo!.principalFinal,{importe: dinero(BigInt(p.prestamo!.principalInicio.importe)*100n-capital)})
  Object.assign(h.movimientos.find(x=>x.id===cap.id)!,{importe:cap.importe})
  Object.assign(h.movimientos.find(x=>x.id===interes.id)!,{importe:interes.importe})
  if(gastos > 0n) {
    const pago = {...cap,id:"COMISION",factura:"COMISION",concepto:"gastos" as const,importe:dinero(gastos)}
    Object.assign(p.vivienda,{pagos:[...p.vivienda.pagos,pago]})
    Object.assign(p.prestamo!,{pagos2025:[...p.prestamo!.pagos2025,pago.id]})
    const mov = {...h.movimientos.find(x=>x.id===cap.id)!,id:pago.id,clase:"gastos_financiacion" as const,importe:pago.importe,documento:{referencia:pago.factura,fecha:pago.fecha,emisor:"Banco"}}
    Object.assign(h,{movimientos:[...h.movimientos,mov].sort((a,b)=>a.fecha.localeCompare(b.fecha))})
  }
  // Identidad independiente: incremento = cierre-inicio+amortización.
  Object.assign(h.cuentas[0]!.inicio,{importe:"20000"})
  Object.assign(h.cuentas[0]!.cierre,{importe:dinero(2000000n+incremento-capital)})
  Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:dinero(5000000n-intereses-gastos-incremento)})
  for(const q of s.solicitudes) {
    if(q.lote!=="E38" || !("viviendas" in q.hechos)) throw Error("hechos E38")
    for(const v of q.hechos.viviendas) if("pagos" in v) Object.assign(v,{pagos:structuredClone(p.vivienda.pagos)})
    Object.assign(q,{inversionesViviendaEjercicio:p.vivienda.pagos.map(x=>({id:x.id,titular:x.pagador,fecha:x.fecha,importe:x.importe,documento:x.factura}))})
  }
  return s
}
const escenarios = [
  ["AEAT5300+1000", "adquisicion",800000n,530000n,100000n,0n],
  ["déficit1c", "rehabilitacion",300000n,299999n,5000n,0n],
  ["incremento0", "adquisicion",300000n,0n,5000n,0n],
  ["incrementoNegativo", "adquisicion",300000n,-1n,5000n,0n],
  ["comisiónFueraLímiteCapital", "adquisicion",300000n,299999n,5000n,10000n],
  ["9040menos1c", "adquisicion",600000n,599999n,304000n,0n],
  ["9040exacto", "adquisicion",600000n,599999n,304001n,0n],
  ["9040más1c", "adquisicion",600000n,599999n,304002n,0n],
  ["12080menos1c", "adecuacion",300000n,299999n,908000n,0n],
  ["12080exacto", "adecuacion",300000n,299999n,908001n,0n],
  ["12080más1c", "adecuacion",300000n,299999n,908002n,0n],
] as const
for(const [nombre,op,c,k,i,g] of escenarios) for(const api of [0,1] as const) it(`API${api}: ${nombre}`,()=>{
  const s = expediente(op,c,k,i,g), antes=structuredClone(s)
  const r = Effect.runSync(ambas(s,op==="adecuacion")[api]).deduccionesTerritoriales2025!
  const base = min(op==="adecuacion" ? 1208000n : 904000n,min(c,max(0n,k))+i+g)
  const libro = r.viviendaDT182025!
  expect(libro.baseDerechoSinAdecuacion).toEqual(serial(op==="adecuacion" ? 0n : base))
  expect(libro.baseDerechoAdecuacion).toEqual(serial(op==="adecuacion" ? base : 0n))
  expect(libro.cumpleCondicionPatrimonial).toBe(false)
  for(const parte of ["estatal","autonomica"] as const)
    expect(libro.cuotas?.[parte].total).toEqual(cuota(base,op==="adecuacion" ? 1n : 3n,op==="adecuacion" ? 10n : 40n))
  // El requisito autonómico riojano no cambia por cambiar la base estatal.
  expect(r.total).toEqual(cuota(0n,1n,1n))
  expect(s).toEqual(antes)
})
for(const clase of ["donacion","herencia"] as const) for(const api of [0,1] as const) it(`API${api}: ISD ${clase} es rechazo técnico sinimporte`,()=>{
  const s=expediente("adquisicion",300000n,300000n,5000n)
  Object.assign(s.viviendaDT182025.movimientos.find(x=>x.id==="ING")!,{clase})
  const e=Effect.runSync(Effect.flip(ambas(s)[api]))
  expect(e._tag).toBe("ResultadoNoSoportado")
  expect("motivo" in e && e.motivo).toMatch(/cronología de adquisición del derecho/)
  expect("cuotaLiquidaCentimos" in e).toBe(false)
  expect("cuotaLiquidaLegal" in e).toBe(false)
})
for(const isd of ["0.01","-0.01"]) it(`helper rechaza ISD !=0 (${isd}), sin devolver patrimonio calculado`,()=>{
  expect(()=>ajustarPatrimonioP5a(euros("100"),euros("100"),euros("0"),euros("0"),euros("0"),euros("0"),euros("0"),isd === "-0.01" ? {n:-1n,d:1n} : euros(isd))).toThrow(/no se calcula importe/)
})
for(const api of [0,1] as const) it(`API${api}: dos capitales con déficit exigen elección, sin cero fiscal`,()=>{
  const s=structuredClone(fixture(["adquisicion","rehabilitacion"]))
  const h=s.viviendaDT182025
  Object.assign(h.cuentas[0]!.cierre,{importe:"1999.99"})
  Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"43900.01"})
  const e=Effect.runSync(Effect.flip(ambas(s)[api]))
  expect(e._tag).toBe("ResultadoNoSoportado")
  expect("motivo" in e && e.motivo).toMatch(/atribución explícita de capital/)
})
for(const api of [0,1] as const) it(`REV-PARCIAL-01 API${api}: segundo proyecto sólo con intereses no requiere reparto de capital`,()=>{
  const s=structuredClone(fixture(["adquisicion","rehabilitacion"])),h=s.viviendaDT182025
  const p=h.proyectos.find(x=>x.operacion==="rehabilitacion")!
  Object.assign(p.vivienda,{pagos:p.vivienda.pagos.filter(x=>x.concepto!=="amortizacion")})
  Object.assign(p.prestamo!,{pagos2025:p.vivienda.pagos.map(x=>x.id)})
  Object.assign(p.prestamo!.principalFinal,{importe:p.prestamo!.principalInicio.importe})
  Object.assign(h,{movimientos:h.movimientos.filter(x=>x.id!=="rehabilitacion-A")})
  Object.assign(h.cuentas[0]!.cierre,{importe:"1999.99"})
  Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"46900.01"})
  for(const q of s.solicitudes) if(q.lote==="E38" && "viviendas" in q.hechos) {
    const ps=h.proyectos.find(x=>x.vivienda.pagos.some(p=>q.inversionesViviendaEjercicio.some(i=>i.id===p.id)))!
    for(const v of q.hechos.viviendas) if("pagos" in v) Object.assign(v,{pagos:structuredClone(ps.vivienda.pagos)})
    Object.assign(q,{inversionesViviendaEjercicio:ps.vivienda.pagos.map(x=>({id:x.id,titular:x.pagador,fecha:x.fecha,importe:x.importe,documento:x.factura}))})
  }
  const r=Effect.runSync(ambas(s)[api]).deduccionesTerritoriales2025!
  expect(r.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual(serial(309999n))
})

for(const api of [0,1] as const) it(`API${api}: ramas suficientes conservan reservas y ordinales`,()=>{
  const s=fixture(["rehabilitacion","adecuacion"])
  const r=Effect.runSync(ambas(s,true)[api]).deduccionesTerritoriales2025!
  const l=r.viviendaDT182025!
  expect(l.baseDerechoSinAdecuacion).toEqual(serial(305000n))
  expect(l.baseDerechoAdecuacion).toEqual(serial(305000n))
  expect(l.reservaRegionalFinal.rehabilitacionAdecuacion).toEqual(serial(610000n))
  expect(l.reservas.map(x=>x.previaRehabilitacionAdecuacion)).toEqual([serial(0n),serial(305000n)])
  expect(r.total).toEqual(cuota(61000n,1n,1n))
  for(const parte of ["estatal","autonomica"] as const)
    expect(l.cuotas?.[parte].total).toEqual(cuota(305000n,7n,40n))
})

function caso(comunidadAutonoma: "murcia" | "illes-balears", contribuyenteId="A"): CasoFiscalAnual {
  return {anio:2025,comunidadAutonoma,contribuyenteId,situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:10000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
}
it("Murcia ordinaria: déficit1c conserva base y financiación documentada",()=>{
  const s=expediente("adquisicion",300000n,299999n,5000n,10000n), h=s.viviendaDT182025
  for(const p of h.proyectos) Object.assign(p.vivienda.inmueble,{territorio:"murcia"})
  // Sólo se adapta territorio en hechos; no se introduce base fiscal.
  const l=producirDT18Murcia2025(Schema.decodeUnknownSync(HechosDT18Murcia2025)(h,{onExcessProperty:"error"}),caso("murcia"),[{lote:"F-ampliado",codigo:"murcia_regimen_transitorio_inversion_vivienda_habitual",hechos:{ramaTransitoria:"estatal_pre2013"}}])
  expect(l.baseDerechoSinAdecuacion).toEqual({n:314999n,d:1n})
})
it("Balears material: déficit1c mantiene derecho aun con elección no_aplicar",()=>{
  const h=historia(perfilDerecho())
  Object.assign(h.cuentas[0]!.cierre,{importe:"19999.99"})
  Object.assign(h.movimientos.find(x=>x.id==="CON")!,{importe:"25950.01"})
  const r=determinarDerechoDT18Balears2025(h,caso("illes-balears","s-1"))
  expect(r.baseDerecho).toEqual({n:304999n,d:1n})
  expect(r.conDerecho).toBe(true)
  expect(r.eleccion).toBe("no_aplicar")
})

for(const clase of ["donacion","herencia"] as const) for(const api of [0,1] as const) it(`P5a segunda Rioja API${api}: ${clase} no retorna cero fiscal`,()=>{
  const solicitud=historica(), p=solicitud.patrimonioRiojaAnterior!
  Object.assign(p.movimientos.find(x=>x.id==="I")!,{clase})
  const e=Effect.runSync(Effect.flip(ambasP5a({solicitudes:[solicitud]})[api]!))
  expect(e._tag).toBe("ResultadoNoSoportado")
  expect("motivo" in e && e.motivo).toMatch(/cronología de adquisición del derecho/)
  expect("total" in e).toBe(false)
})
