import { describe, expect, it } from "@effect/vitest"
import { Effect, Schema, Result } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoAragonSocialMixto2025 } from "../lib/dominio/irpf/aragon-social-mixto-2025/contrato"
import { social } from "./aragon-social-mixto.fixtures"
import { inspect } from "node:util"
const formato = { depth: null, maxArrayLength: null, maxStringLength: null, sorted: true } as const
const casos=[
 ["40000","4800","36000","37800","4209.04","60.13"],
 ["38900","4800","34900","36700","4014.64","59.07"],
 ["40000","3600","36000","37200","4098.04","39.66"],
 ["38905.77","4800","34905.77","36705.77","4015.51","59.08"],
] as const
describe("Aragón social mixto privado: cuatro observaciones oficiales",()=>{
 for(const [bruto,renta,trabajo,base,cuota,ar11] of casos) it.effect(bruto+"/"+renta,()=>Effect.gen(function*(){
  const c=social(bruto,renta)
  const a=yield* liquidarIrpfAnual(c,{modo:"canonico"}), b=yield* liquidarIrpfAnualExplicito(c)
  // Cada liquidación crea constructores Decimal propios; comparar valores completos, incluidos BigInt.
  expect(inspect(a, formato)).toBe(inspect(b, formato))
  expect(a.rendimientoNetoTrabajo.toFixed()).toBe(trabajo)
  expect(a.baseImponibleGeneral.toFixed()).toBe(base)
  expect(a.composicion.cuotaAutonomicaGeneralDespuesMinimo.toFixed(2)).toBe(cuota)
  const e=a.composicion.deduccionesTerritoriales2025?.evaluaciones[0]?.resultado
  expect(e !== undefined && "importeExactoEuros" in e ? e.importeExactoEuros : undefined).toBe(ar11)
  expect(a.legalRuleSelected).toBeNull()
 }))
 it.effect("retenciones disjuntas: base y cuota invariantes, diferencial una resta",()=>Effect.gen(function*(){
  const c=social(),a=yield* liquidarIrpfAnualExplicito(c)
  const b=yield* liquidarIrpfAnualExplicito({...c,retenciones:[{id:"RET1",documento:"CERT-RET",contribuyenteId:c.contribuyenteId,ejercicio:2025 as const,fecha:"2025-12-31",importe:"200"}]})
  expect(a.baseImponibleGeneral.eq(b.baseImponibleGeneral)).toBe(true)
  expect(a.cuotaDiferencial.minus(b.cuotaDiferencial).toFixed()).toBe("200")
 }))
 it.effect("pensión comparte productor; no aplica DA61",()=>Effect.gen(function*(){
  const c=social(),r=yield* liquidarIrpfAnualExplicito({...c,trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(x=>({...x,clase:"pension" as const}))}})
  expect(r.composicion.deduccionTrabajo.isZero()).toBe(true)
 }))
 it.effect("rechazos concretos sin cuota cero ficticia",()=>Effect.gen(function*(){
  const c=social(),v=c.inmuebles[0]!
  for(const malo of [
   {...c,deduccionesTerritoriales2025:{solicitudes:[...c.deduccionesTerritoriales2025.solicitudes,...c.deduccionesTerritoriales2025.solicitudes]}},
   {...c,conciliacion:{...c.conciliacion,contribuyenteId:"AJENO"}},
   {...c,censoInmobiliario:{...c.censoInmobiliario,inmuebles:["AJENO"]}},
   {...c,inmuebles:[{...v,titular:"AJENO"}]},
   {...c,inmuebles:[{...v,contrato:{...v.contrato,firma:"2023-05-26"}}]},
   {...c,inmuebles:[{...v,ubicacion:"resto-espana" as const}]},
   {...c,retenciones:[{id:"T1",documento:"CERT-RET",contribuyenteId:c.contribuyenteId,ejercicio:2025 as const,fecha:"2025-12-31",importe:"200"}]},
   {...c,inmuebles:[{...v,exigibilidades:v.exigibilidades.map(x=>({...x,importe:"1"}))}]},
  ]) {
   const a=yield* Effect.flip(liquidarIrpfAnual(malo,{modo:"canonico"})),b=yield* Effect.flip(liquidarIrpfAnualExplicito(malo))
   expect(a._tag).toBe("RechazoP4a");expect(a).toEqual(b)
  }
 }))
 it("sin magnitudes fiscales externas ni otros perfiles",()=>{
  const c=social()
  for(const extra of [{netoReducido:"1800"},{baseGeneral:"37800"},{cuota:"4209.04"},{edad:65},{otrasRentas:"ahorro"},{inmuebles:c.inmuebles.map(v=>({...v,contrato:{...v.contrato,alquilerSocial:true}}))},{inmuebles:[...c.inmuebles,...c.inmuebles]}])
   expect(Result.isFailure(Schema.decodeUnknownResult(CasoAragonSocialMixto2025)({...c,...extra},{onExcessProperty:"error"}))).toBe(true)
 })
})
