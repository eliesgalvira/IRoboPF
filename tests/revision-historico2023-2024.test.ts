// Independent review GRANT0: normal Vitest; no private paths at runtime.
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import originals from "./fixtures/revision-historico2023-2024.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito as direct } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { liquidarIrpfAnualExplicito as api, liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { admiteArgumentoOpen2023A2024 as admits, esPerfilOpen2023A2024 as profile } from "../lib/dominio/irpf/trabajo-anual/politica-open-2023-2024"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
import { analitico } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
const D = Decimal.clone({ precision: 80 })
const raw = (year: number, gross: string, age = year - 1985) => ({
  ejercicio: year, comunidadAutonoma: "madrid", edad: age, modalidad: "individual",
  residenciaTodoElAnio: true, devengo: `${year}-12-31`, otrasRentas: "ninguna",
  familiaresConDerechoMinimo: "ninguno", discapacidad: "ninguna", reduccionesBase: "ninguna",
  saldosAnteriores: "ninguno", deducciones: "ninguna", rentasExtranjeras: "ninguna",
  especialidades: "ninguna", perfil: "solo-trabajo",
  trabajo: { ejercicio: year, territorio: "comun", reduccionesArt18: "ninguna", movilidad: "ninguna", discapacidadActiva: "ninguna",
    rendimientos: [{ id: "review-independent", clase: "empleo-laboral", integro: gross,
      cotizaciones: { clase: "efectivas", seguridadSocial: "1000", derechosPasivos: "0", colegiosHuerfanos: "0" },
      sindicato: { importe: "0", satisfecho: "no" },
      colegio: { importe: "0", satisfecho: "no", obligatorio: "no", finesEsenciales: "no" },
      defensa: { importe: "0", satisfecho: "no", litigioDirectoPagador: "no" } }] },
  conciliacion: { ejercicio: year, estado: "totales-anuales-sin-duplicados", procedencia: ["review:synthetic-explicit-negatives"] },
  retenciones: [{ operacionId: "review-payment", procedencia: "review:synthetic", ejercicio: year, importe: "100", efectiva: true }],
})
type EntradaTestigo = ReturnType<typeof raw>
const decode = (value: EntradaTestigo) => Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(value, { onExcessProperty: "error" })
const input = (year: number, gross: string, age = year - 1985) => decode(raw(year, gross, age))

// Independent exact fractions, never production Decimal or production formula helpers.
type Q = readonly [bigint, bigint]
const q = (s: string): Q => { const [i,f=""] = s.split("."); return [BigInt(i!+f),10n**BigInt(f.length)] }
const sub = (a: Q,b: Q): Q => [a[0]*b[1]-b[0]*a[1],a[1]*b[1]]
const mul = (a: Q,b: Q): Q => [a[0]*b[0],a[1]*b[1]]
const hu = (a: Q): bigint => { const n=a[0]*100n; return n<0n ? -hu([-a[0],a[1]]) : (2n*n+a[1])/(2n*a[1]) }
const eur = (n: bigint): string => `${n/100n}.${(n%100n).toString().padStart(2,"0")}`
const cents = (s: string) => hu(q(s))
const oracle = (year: number,gross: string) => {
  const g=cents(gross), prev=g-100000n
  let reduction: bigint
  if(year===2023) {
    const exact: Q = prev<=1404750n ? q("6498") : prev<=1974750n ? sub(q("6498"),mul(q("1.14"),sub([prev,100n],q("14047.50")))) : q("0")
    reduction=hu(exact)
  } else {
    // Deliberately transport ORIGINAL operands before subtracting, then shortest decimal.
    const n=Number(gross)-1000
    const r=n<=14852 ? 7302 : n<=17673.52 ? 7302-1.75*(n-14852) : n<19747.50 ? 2364.34-1.14*(n-17673.52) : 0
    reduction=hu(q(String(r)))
  }
  const net=g-300000n; return eur(net-(reduction>net?net:reduction))
}
// Ordinary state scale: independently sum marginal slices in binary64.
const state = (base: string) => {
  const b=Number(base), bands=[[12450,.095],[20200,.12],[35200,.15],[60000,.185]] as const
  let lo=0,total=0
  for(const [hi,rate] of bands) { const amount=Math.min(Math.max(0,b-lo),hi-lo); if(amount>0) total+=amount*rate;lo=hi }
  return eur(hu(q(String(total))))
}
// BOE-A-2024-5610 pp3,14: published regional fixed quotas, exact decimal.
const regional = (base: string) => {
 const rows=[["0","0","0.085"],["13362.22","1135.79","0.107"],["19004.63","1739.53","0.128"],["35425.68","3841.42","0.174"],["57320.40","7651.10","0.205"]] as const
 let row: typeof rows[number]=rows[0]
 for(const candidate of rows)if(cents(base)>=cents(candidate[0]))row=candidate
 const v=mul(sub(q(base),q(row[0])),q(row[2])),fixed=q(row[1])
 return eur(hu([v[0]*fixed[1]+fixed[0]*v[1],v[1]*fixed[1]]))
}
const composition = (year: 2023|2024,gross: string): EntradaComposicionAnual => ({
  ambito:{anio:year,comunidadAutonoma:"madrid",situacionFamiliar:{tipo:"individual",edad:year-1985,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  hechosOpen2023A2024:input(year,gross),politica:year===2023?"open-etapas-empleo-madrid-2023":"open-etapas-empleo-madrid-2024",
  precision:80,cotizaciones:{naturaleza:"efectivas",trabajador:new D(1000)},origenBaseGeneralB:"solo-trabajo",
  rentasTrabajoAnuales:{integroTrabajo:new D(gross),restoRentas:new D(0)},baseGeneral:new D(oracle(year,gross)),baseAhorro:new D(0),
  rentasAntesReducciones:new D(gross).minus(3000),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0,
})
const reject = (c: EntradaComposicionAnual) => {
 const r=Effect.runSync(Effect.result(componerLiquidacionAnual(c)))
 expect(Result.isFailure(r)).toBe(true)
 if(Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
}
for(const row of originals) it(`original independently read ${row.year}/${row.gross}`,()=>{
 const c=input(row.year,row.gross),before=JSON.stringify(c)
 const a=Effect.runSync(direct(c));expect(Effect.runSync(api(c))).toEqual(a)
 const values=new Map(Object.entries({"0025":a.rendimientoNetoReducido,"0500":a.baseLiquidableGeneral,"0505":a.baseLiquidableGeneral,
 "0528":a.componentesCuota.gravamenEstatal,"0529":a.componentesCuota.gravamenAutonomico,"0530":a.componentesCuota.gravamenMinimoEstatal,
 "0531":a.componentesCuota.gravamenMinimoAutonomico,"0532":a.componentesCuota.cuotaEstatal,"0533":a.componentesCuota.cuotaAutonomica,
 "0595":a.cuotaPosterior,"0610":a.cuotaDiferencial,"0670":a.cuotaDiferencialPresentada}))
 for(const [box,v] of Object.entries(row.official)) {
  const value=values.get(box)
  if(value===undefined) throw new Error("Casilla sin correspondencia: "+box)
  expect(new D(value).eq(v),box).toBe(true)
 }
 expect(new D(a.baseLiquidableGeneral).eq(oracle(row.year,row.gross))).toBe(true);expect(new D(a.componentesCuota.gravamenEstatal).eq(state(a.baseLiquidableGeneral))).toBe(true)
 expect(Object.keys(row.official)).not.toContain("0023");expect(Object.keys(row.official)).not.toContain("0414")
 expect(a.deduccionTrabajo).toBe("0");expect(JSON.stringify(c)).toBe(before)
})
// Envelope/boundaries are synthetic properties, not newly accredited official cases.
for(const year of [2023,2024] as const) {
 for(const gross of ["12546.57","15084.75","15047.49","15047.50","15047.51","15851.99","15852.00","15852.01","15852.02","17000.42","18673.51","18673.52","18673.53","20747.49","20747.50","20747.51","29846.30","29846.11","38116.90","58172.55"]) {
  it(`synthetic low/high/branch/minimum ${year}/${gross}`,()=>{
   const c=composition(year,gross),before=JSON.stringify(c),old=Decimal.precision
   try {
    const expected=Effect.runSync(componerLiquidacionAnual(c));Decimal.set({precision:5})
    expect(JSON.stringify(Effect.runSync(componerLiquidacionAnual(c)))).toBe(JSON.stringify(expected))
    expect(expected.cuotaIntegraGeneralEstatal.eq(state(oracle(year,gross)))).toBe(true)
    const a=Effect.runSync(direct(input(year,gross)));expect(Effect.runSync(api(input(year,gross)))).toEqual(a)
    expect(new D(a.baseLiquidableGeneral).eq(oracle(year,gross))).toBe(true)
    expect(new D(a.componentesCuota.gravamenEstatal).eq(state(oracle(year,gross)))).toBe(true)
    expect(new D(a.componentesCuota.gravamenMinimoEstatal).eq(state(eur(cents(oracle(year,gross))<555000n?cents(oracle(year,gross)):555000n)))).toBe(true)
    expect(new D(a.componentesCuota.gravamenAutonomico).eq(regional(oracle(year,gross)))).toBe(true)
    const rb=cents(oracle(year,gross));expect(new D(a.componentesCuota.gravamenMinimoAutonomico).eq(regional(eur(rb<595665n?rb:595665n)))).toBe(true)
    expect(Decimal.precision).toBe(5);expect(JSON.stringify(c)).toBe(before)
   } finally {Decimal.set({precision:old})}
  })
 }
 const c=composition(year,year===2023?"15084.75":"17000.42")
 const bad: [string,EntradaComposicionAnual][]=[
  ["invented base",{...c,baseGeneral:c.baseGeneral.plus(".01")}],
  ["invented net",{...c,rentasAntesReducciones:c.rentasAntesReducciones.plus(".01")}],
  ["omitted reduction",{...c,baseGeneral:c.rentasAntesReducciones}],
  ["other policy base",{...c,baseGeneral:new D(year===2023?"5629.22":"8708.16")}],
  ["minimum6000",{...c,minimosEstatales:{...MINIMOS_ESTATALES_2025,contribuyente:{...MINIMOS_ESTATALES_2025.contribuyente,general:new D(6000)}}}],
  ["activity0",{...c,rentaActividadAnualB:new D(0)}],["activity1",{...c,rentaActividadAnualB:new D(1)}],
  ["no facts",{...c,hechosOpen2023A2024:undefined}],
  ["savings",{...c,baseAhorro:new D(".01")}],
  ["income",{...c,rentasTrabajoAnuales:{...c.rentasTrabajoAnuales!,restoRentas:new D(".01")}}],
  ["SS",{...c,cotizaciones:{naturaleza:"efectivas",trabajador:new D("1000.001")}}],
  ["extra property source",{...c,inmueblesP4a:[]}],
  ["deduction",{...c,deduccionesAutonomicasCentimos:1}],
  ["contradictory E38",{...c,basesImponiblesE38:{general:c.baseGeneral.plus(".01"),ahorro:new D(0)}}],
  ...[20,79,81].map((precision): [string,EntradaComposicionAnual]=>["precision"+precision,Object.assign({...c},{precision})]),
  ...["NaN","Infinity","-Infinity","0","5629.211"].map((v): [string,EntradaComposicionAnual]=>[v,{...c,baseGeneral:new D(v)}]),
  // Untyped callers are part of runtime validation; arrays are never[] in TS.
  ...["descendientes","ascendientes"].map((k): [string,EntradaComposicionAnual]=>[k,Object.assign({...c},{ambito:{...c.ambito,situacionFamiliar:{...c.ambito.situacionFamiliar,[k]:[{}]}}})]),
 ]
 for(const [name,value] of bad) it(`composition rejects ${year}/${name}`,()=>reject(value))
 for(const gross of ["12546.56","58172.56"]) it(`both explicit routes do not select outside envelope ${year}/${gross}`,()=>{
  expect(admits(new D(gross),new D(1000),year)).toBe(false)
  const c=input(year,gross);expect(profile(c)).toBe(false)
  for(const run of [direct,api]) {
   const result=Effect.runSync(Effect.result(run(c)))
   if(Result.isSuccess(result)) expect(JSON.stringify(result.success.rastro)).not.toContain(`Open Madrid ${year} acotado`)
   else expect(result.failure._tag).toBe("ResultadoNoSoportado")
  }
 })
 it(`both routes exclude age/SS/retention/employment changes ${year}`,()=>{
  for(const change of ["age","ss","retention","statutory","two-jobs"] as const) {
   const r=raw(year,"17000.42")
   if(change==="age")r.edad=40
   if(change==="ss")r.trabajo.rendimientos[0]!.cotizaciones.seguridadSocial="1000.01"
   if(change==="retention")r.retenciones[0]!.importe="100.01"
   if(change==="statutory")r.trabajo.rendimientos[0]!.clase="empleo-estatutario"
   if(change==="two-jobs")r.trabajo.rendimientos.push({...r.trabajo.rendimientos[0]!,id:"second"})
   const c=decode(r);expect(profile(c)).toBe(false)
   for(const run of [direct,api]) {
    const result=Effect.runSync(Effect.result(run(c)))
    if(Result.isSuccess(result))expect(JSON.stringify(result.success.rastro)).not.toContain(`Open Madrid ${year} acotado`)
    else expect(result.failure._tag).toBe("ResultadoNoSoportado")
   }
  }
 })
}
it("state rational tie remains distinct from binary short and truncation",()=>{
 expect(hu(q("3109.695"))).toBe(310970n)
 expect(state("26846.30")).toBe("3109.69");expect(state("26846.11")).toBe("3109.67");expect(state("35116.90")).toBe("4350.29")
 expect(oracle(2023,"15084.75")).toBe("5629.21");expect(oracle(2024,"15852.02")).toBe("5550.06");expect(oracle(2024,"17000.42")).toBe("8708.15")
})
it("canonical isolation and prior explicit age40 routes",()=>{
 for(const anio of [2018,2019,2020,2021,2022,2023,2024,2025] as const) {
  const r=Effect.runSync(liquidarIrpfAnual({...analitico,anio},{modo:"canonico"}))
  expect(JSON.stringify(r.rastro)).not.toContain("Open Madrid 2023 acotado")
  expect(JSON.stringify(r.rastro)).not.toContain("Open Madrid 2024 acotado")
  const c=raw(anio,"29846.11",40);if(anio===2025)c.deducciones="solo-da61-si-procede"
  const a=Effect.runSync(direct(decode(c)));expect(Effect.runSync(api(decode(c)))).toEqual(a)
  expect(new D(a.componentesCuota.gravamenEstatal).eq("3109.67")).toBe(true)
 }
})

it("2024 rejects rational-first base for the short-decimal discriminant",()=>{
 const c=composition(2024,"15852.02");reject({...c,baseGeneral:new D("5550.05")})
})

it("schema rejects nonfinite/subcent originals, without coercion",()=>{
 for(const gross of ["17000.421","NaN","Infinity","-Infinity"]) {
  expect(()=>input(2024,gross)).toThrow()
  expect(admits(new D(gross),new D(1000),2024)).toBe(false)
 }
})
