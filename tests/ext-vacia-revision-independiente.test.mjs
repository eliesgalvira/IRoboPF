import { it, assert } from "@effect/vitest"
import { Effect } from "effect"
import { casoExtVacia } from "./ext-vacia.fixtures.ts"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirInmueblesP4a } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import rows from "./ext-vacia-revision-oraculos.json"
const rat=(x,s)=>{const [a,b=""]=s.split(".");assert.strictEqual(x.n*10n**BigInt(b.length),BigInt(a+b)*x.d)}
const api=[(c)=>liquidarIrpfAnual(c,{modo:"canonico"}),liquidarIrpfAnualExplicito]
for(const o of rows) for(const [i,f] of api.entries()) it.effect(`independiente ${o.ingreso} API${i}`,()=>Effect.gen(function*(){
 let c=structuredClone(casoExtVacia(o.ingreso))
 if(o.coste){let v=c.inmuebles[0]; v.adquisicion.precio="50000";v.adquisicion.sueloPrecio="20000";v.catastro2025.construccion=o.construccion;v.gastos[0].importe=o.gasto;v.gastos[0].totalFactura=o.gasto}
 const p=yield* producirInmueblesP4a(c);const v=p.inmuebles[0]
 rat(v.amortizacion,o.amort);rat(v.neto,o.neto);rat(v.netoReducido,o.rnr);rat(v.comprobacionVacia2024.imputacion,"660");assert.strictEqual(v.comprobacionVacia2024.dias,366);rat(p.imputacion,"0")
 const a=yield* f(c);assert.isTrue(a.baseImponibleGeneral.eq(o.rnr));assert.isTrue(a.composicion.cuotaAutonomicaGeneralDespuesMinimo.eq(o.cuota));assert.isTrue(a.composicion.deduccionesAutonomicasAplicadas.eq(o.aplicado))
 const g=a.composicion.deduccionesTerritoriales2025.aplicaciones[0].generado;rat({n:BigInt(g.numeradorEuros),d:BigInt(g.divisor)},o.generado)
 const b=yield* f({...c,deduccionesTerritoriales2025:{solicitudes:[]}});assert.isTrue(b.cuotaDiferencial.minus(a.cuotaDiferencial).eq(o.aplicado));assert.isAbove(a.seguimiento.length,0)
}))
for(const [vigor,proc,total] of [["2011-12-31","colectivo-general","1200"],["2012-01-01","colectivo-general","660"],["2013-01-01","colectivo-general","660"],["2014-01-01","otro","1200"],["2024-01-01","colectivo-general","660"]])it.effect(`histórico ${vigor}/${proc}`,()=>Effect.gen(function*(){let c=structuredClone(casoExtVacia());Object.assign(c.inmuebles[0].vaciaExt2025.catastro2024,{entradaVigor:vigor,procedimiento:proc});const p=yield*producirInmueblesP4a(c);rat(p.inmuebles[0].comprobacionVacia2024.imputacion,total)}))
const mutations={
 "ayuda":(c)=>c.inmuebles[0].ayudas="100",
 "reembolso":(c)=>c.inmuebles[0].gastos[0].reembolsos="1",
 "exceso":(c)=>{c.inmuebles[0].gastos[0].importe="999999";c.inmuebles[0].gastos[0].totalFactura="999999"},
 "suelo-sin-construccion":(c)=>c.inmuebles[0].vaciaExt2025.catastro2024.construccion="0",
 "sin-catastro":(c)=>delete c.inmuebles[0].vaciaExt2025.catastro2024,
 "revision-intranual":(c)=>c.inmuebles[0].vaciaExt2025.catastro2024.entradaVigor="2024-02-29",
 "cesion":(c)=>c.inmuebles[0].derecho="usufructo",
 "censo-dos":(c)=>c.inmuebles[0].vaciaExt2025.censoDerechos.inmuebles.push("V2"),
 "censo-tres":(c)=>c.inmuebles[0].vaciaExt2025.censoDerechos.inmuebles.push("V2","V3"),
 "censo-identidad":(c)=>c.inmuebles[0].vaciaExt2025.censoDerechos.inmuebles=["V2"],
 "edad17":(c)=>c.edad=17,"edad65":(c)=>c.edad=65,
 "final-inclusivo":(c)=>{c.inmuebles[0].contrato.hasta="2027-12-31";c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].finContrato="2027-12-31"},
 "firma-posterior":(c)=>c.inmuebles[0].contrato.firma="2025-01-02",
 "imputacion-inventada":(c)=>c.inmuebles[0].vaciaExt2025.imputacion2024="660",
 "base-externa":(c)=>c.baseGeneral="99999",
 "RNR-externo":(c)=>c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].rendimientoNetoReducido="99999",
 "ocupacion-no-conciliada":(c)=>c.inmuebles[0].vaciaExt2025.observacion2025.ocupacionDesde="2025-01-02",
 "salto-bisiesto":(c)=>{let p=c.inmuebles[0].vaciaExt2025;let o=p.observaciones2024[0];p.observaciones2024=[{...o,hasta:"2024-02-28"},{...o,desde:"2024-03-01"}]},
 "dias365":(c)=>c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].diasVaciaAntes=365,
 "procedimiento":(c)=>c.inmuebles[0].vaciaExt2025.procedimientos=[{documento:"R",fecha:"2025-06-01",objeto:"deduccion",resultado:"regularizacion"}],
}
for(const [name,change]of Object.entries(mutations))for(const[i,f]of api.entries())it.effect(`rechazo ${name} API${i}`,()=>Effect.gen(function*(){const c=structuredClone(casoExtVacia());(change)(c);const e=yield*Effect.flip(f(c));assert.strictEqual(e._tag,name==="dias365"?"ResultadoNoSoportado":"RechazoP4a")}))
for(const age of [18,64])it.effect(`límite edad ${age} y partición bisiesta completa`,()=>Effect.gen(function*(){let c=structuredClone(casoExtVacia());c.edad=age;let p=c.inmuebles[0].vaciaExt2025;let o=p.observaciones2024[0];p.observaciones2024=[{...o,hasta:"2024-02-28"},{...o,desde:"2024-02-29",hasta:"2024-02-29"},{...o,desde:"2024-03-01"}];const a=yield*liquidarIrpfAnualExplicito(c);assert.isTrue(a.baseImponibleGeneral.eq("16300"))}))
