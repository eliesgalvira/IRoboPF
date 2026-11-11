// Independent portable suite. Apply this file at tests/; no external receipts or author helpers.
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito as direct } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { liquidarIrpfAnualExplicito as api, liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { calcularReduccionTrabajoConOtrasRentas as reduce } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { admiteArgumentoOpen2020A2022 as admits, esPerfilOpen2020A2022 as profile } from "../lib/dominio/irpf/trabajo-anual/politica-open-2020-2022"
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
// No production formula imports in the rational oracle: integer slope increments.
const cents = (s: string) => { const [a,b=""] = s.split("."); return BigInt(a!)*100n + BigInt(b.padEnd(2,"0")) }
const stateNumerator = (b: bigint) => [[0n,95n],[1245000n,25n],[2020000n,30n],[3520000n,35n],[6000000n,40n]]
  .reduce((s,[t,r]) => s + (b>t! ? (b-t!)*r! : 0n),0n)
const half = (n: bigint, d: bigint) => (2n*n+d)/(2n*d)
const euro = (c: bigint) => `${c/100n}.${(c%100n).toString().padStart(2,"0")}`
// OBSERVED_ROWS and BOUNDARY_ROWS are populated from audited original receipts / independent oracle.
type Testigo = { readonly year: number; readonly id: string; readonly gross: string; readonly official: Readonly<Record<string, string>> }
const observed: readonly Testigo[] = [{"year":2020,"id":"seed20261104-1","gross":"17000.41","official":{"0025":"12763.52","0500":"12763.52","0505":"12763.52","0528":"1220.37","0529":"1155.61","0530":"527.25","0531":"499.50","0532":"693.12","0533":"656.11","0595":"1349.23","0610":"1249.23","0670":"1249.23"}},{"year":2020,"id":"seed20261104-3","gross":"17000.43","official":{"0025":"12763.58","0500":"12763.58","0505":"12763.58","0528":"1220.38","0529":"1155.62","0530":"527.25","0531":"499.50","0532":"693.13","0533":"656.12","0595":"1349.25","0610":"1249.25","0670":"1249.25"}},{"year":2020,"id":"seed20261104-22","gross":"14377.21","official":{"0025":"6205.52","0500":"6205.52","0505":"6205.52","0528":"589.52","0529":"558.50","0530":"527.25","0531":"499.50","0532":"62.27","0533":"59.00","0595":"121.27","0610":"21.27","0670":"21.27"}},{"year":2020,"id":"seed20261104-31","gross":"29846.30","official":{"0025":"26846.30","0500":"26846.30","0505":"26846.30","0528":"3109.69","0529":"2924.81","0530":"527.25","0531":"499.50","0532":"2582.44","0533":"2425.31","0595":"5007.75","0610":"4907.75","0670":"4907.75"}},{"year":2020,"id":"seed20261104-48","gross":"15042.17","official":{"0025":"7867.92","0500":"7867.92","0505":"7867.92","0528":"747.45","0529":"708.11","0530":"527.25","0531":"499.50","0532":"220.20","0533":"208.61","0595":"428.81","0610":"328.81","0670":"328.81"}},{"year":2021,"id":"seed20261104-1","gross":"17000.41","official":{"0025":"12763.52","0500":"12763.52","0505":"12763.52","0528":"1220.37","0529":"1155.61","0530":"527.25","0531":"499.50","0532":"693.12","0533":"656.11","0595":"1349.23","0610":"1249.23","0670":"1249.23"}},{"year":2021,"id":"seed20261104-3","gross":"17000.43","official":{"0025":"12763.58","0500":"12763.58","0505":"12763.58","0528":"1220.38","0529":"1155.62","0530":"527.25","0531":"499.50","0532":"693.13","0533":"656.12","0595":"1349.25","0610":"1249.25","0670":"1249.25"}},{"year":2021,"id":"seed20261104-22","gross":"14377.21","official":{"0025":"6205.52","0500":"6205.52","0505":"6205.52","0528":"589.52","0529":"558.50","0530":"527.25","0531":"499.50","0532":"62.27","0533":"59.00","0595":"121.27","0610":"21.27","0670":"21.27"}},{"year":2021,"id":"seed20261104-31","gross":"29846.30","official":{"0025":"26846.30","0500":"26846.30","0505":"26846.30","0528":"3109.69","0529":"2924.81","0530":"527.25","0531":"499.50","0532":"2582.44","0533":"2425.31","0595":"5007.75","0610":"4907.75","0670":"4907.75"}},{"year":2021,"id":"seed20261104-48","gross":"15042.17","official":{"0025":"7867.92","0500":"7867.92","0505":"7867.92","0528":"747.45","0529":"708.11","0530":"527.25","0531":"499.50","0532":"220.20","0533":"208.61","0595":"428.81","0610":"328.81","0670":"328.81"}},{"year":2022,"id":"seed20261104-1","gross":"17000.41","official":{"0025":"12763.52","0500":"12763.52","0505":"12763.52","0528":"1220.37","0529":"1084.90","0530":"527.25","0531":"491.09","0532":"693.12","0533":"593.81","0595":"1286.93","0610":"1186.93","0670":"1186.93"}},{"year":2022,"id":"seed20261104-3","gross":"17000.43","official":{"0025":"12763.58","0500":"12763.58","0505":"12763.58","0528":"1220.38","0529":"1084.90","0530":"527.25","0531":"491.09","0532":"693.13","0533":"593.81","0595":"1286.94","0610":"1186.94","0670":"1186.94"}},{"year":2022,"id":"seed20261104-22","gross":"14377.21","official":{"0025":"6205.52","0500":"6205.52","0505":"6205.52","0528":"589.52","0529":"527.47","0530":"527.25","0531":"491.09","0532":"62.27","0533":"36.38","0595":"98.65","0610":"-1.35","0670":"-1.35"}},{"year":2022,"id":"seed20261104-31","gross":"29846.30","official":{"0025":"26846.30","0500":"26846.30","0505":"26846.30","0528":"3109.69","0529":"2764.10","0530":"527.25","0531":"491.09","0532":"2582.44","0533":"2273.01","0595":"4855.45","0610":"4755.45","0670":"4755.45"}},{"year":2022,"id":"seed20261104-48","gross":"15042.17","official":{"0025":"7867.92","0500":"7867.92","0505":"7867.92","0528":"747.45","0529":"668.77","0530":"527.25","0531":"491.09","0532":"220.20","0533":"177.68","0595":"397.88","0610":"297.88","0670":"297.88"}},{"year":2020,"id":"disc2020-20261106-cuota1","gross":"29846.11","official":{"0025":"26846.11","0500":"26846.11","0505":"26846.11","0528":"3109.67","0529":"2924.79","0530":"527.25","0531":"499.50","0532":"2582.42","0533":"2425.29","0595":"5007.71","0610":"4907.71","0670":"4907.71"}},{"year":2020,"id":"disc2020-20261106-cuota2","gross":"38116.9","official":{"0025":"35116.90","0500":"35116.90","0505":"35116.90","0528":"4350.29","0529":"4121.85","0530":"527.25","0531":"499.50","0532":"3823.04","0533":"3622.35","0595":"7445.39","0610":"7345.39","0670":"7345.39"}},{"year":2021,"id":"disc2021-20261106-cuota1","gross":"29846.11","official":{"0025":"26846.11","0500":"26846.11","0505":"26846.11","0528":"3109.67","0529":"2924.79","0530":"527.25","0531":"499.50","0532":"2582.42","0533":"2425.29","0595":"5007.71","0610":"4907.71","0670":"4907.71"}},{"year":2021,"id":"disc2021-20261106-cuota2","gross":"38116.9","official":{"0025":"35116.90","0500":"35116.90","0505":"35116.90","0528":"4350.29","0529":"4121.85","0530":"527.25","0531":"499.50","0532":"3823.04","0533":"3622.35","0595":"7445.39","0610":"7345.39","0670":"7345.39"}},{"year":2022,"id":"disc2022-20261106-cuota1","gross":"29846.11","official":{"0025":"26846.11","0500":"26846.11","0505":"26846.11","0528":"3109.67","0529":"2764.07","0530":"527.25","0531":"491.09","0532":"2582.42","0533":"2272.98","0595":"4855.40","0610":"4755.40","0670":"4755.40"}},{"year":2022,"id":"disc2022-20261106-cuota2","gross":"38116.9","official":{"0025":"35116.90","0500":"35116.90","0505":"35116.90","0528":"4350.29","0529":"3857.52","0530":"527.25","0531":"491.09","0532":"3823.04","0533":"3366.43","0595":"7189.47","0610":"7089.47","0670":"7089.47"}}]
const boundaries = [{"year":2020,"gross":"8565.01","reduction":"5565.00","base":"0.01","state":"0.00"},{"year":2020,"gross":"14114.99","reduction":"5565.00","base":"5549.99","state":"527.25"},{"year":2020,"gross":"14115","reduction":"5565.00","base":"5550.00","state":"527.25"},{"year":2020,"gross":"14115.01","reduction":"5564.99","base":"5550.02","state":"527.25"},{"year":2020,"gross":"17824.99","reduction":"0.01","base":"14824.98","state":"1467.75"},{"year":2020,"gross":"17825","reduction":"0.00","base":"14825.00","state":"1467.75"},{"year":2020,"gross":"17825.01","reduction":"0.00","base":"14825.01","state":"1467.75"},{"year":2020,"gross":"14114.98","reduction":"5565.00","base":"5549.98","state":"527.25"},{"year":2020,"gross":"14115.02","reduction":"5564.97","base":"5550.05","state":"527.25"},{"year":2020,"gross":"29846.11","reduction":"0.00","base":"26846.11","state":"3109.67"},{"year":2020,"gross":"38116.90","reduction":"0.00","base":"35116.90","state":"4350.29"},{"year":2020,"gross":"63000","reduction":"0.00","base":"60000.00","state":"8950.75"},{"year":2021,"gross":"8565.01","reduction":"5565.00","base":"0.01","state":"0.00"},{"year":2021,"gross":"14114.99","reduction":"5565.00","base":"5549.99","state":"527.25"},{"year":2021,"gross":"14115","reduction":"5565.00","base":"5550.00","state":"527.25"},{"year":2021,"gross":"14115.01","reduction":"5564.99","base":"5550.02","state":"527.25"},{"year":2021,"gross":"17824.99","reduction":"0.01","base":"14824.98","state":"1467.75"},{"year":2021,"gross":"17825","reduction":"0.00","base":"14825.00","state":"1467.75"},{"year":2021,"gross":"17825.01","reduction":"0.00","base":"14825.01","state":"1467.75"},{"year":2021,"gross":"14114.98","reduction":"5565.00","base":"5549.98","state":"527.25"},{"year":2021,"gross":"14115.02","reduction":"5564.97","base":"5550.05","state":"527.25"},{"year":2021,"gross":"29846.11","reduction":"0.00","base":"26846.11","state":"3109.67"},{"year":2021,"gross":"38116.90","reduction":"0.00","base":"35116.90","state":"4350.29"},{"year":2021,"gross":"63000","reduction":"0.00","base":"60000.00","state":"8950.75"},{"year":2022,"gross":"8565.01","reduction":"5565.00","base":"0.01","state":"0.00"},{"year":2022,"gross":"14114.99","reduction":"5565.00","base":"5549.99","state":"527.25"},{"year":2022,"gross":"14115","reduction":"5565.00","base":"5550.00","state":"527.25"},{"year":2022,"gross":"14115.01","reduction":"5564.99","base":"5550.02","state":"527.25"},{"year":2022,"gross":"17824.99","reduction":"0.01","base":"14824.98","state":"1467.75"},{"year":2022,"gross":"17825","reduction":"0.00","base":"14825.00","state":"1467.75"},{"year":2022,"gross":"17825.01","reduction":"0.00","base":"14825.01","state":"1467.75"},{"year":2022,"gross":"14114.98","reduction":"5565.00","base":"5549.98","state":"527.25"},{"year":2022,"gross":"14115.02","reduction":"5564.97","base":"5550.05","state":"527.25"},{"year":2022,"gross":"29846.11","reduction":"0.00","base":"26846.11","state":"3109.67"},{"year":2022,"gross":"38116.90","reduction":"0.00","base":"35116.90","state":"4350.29"},{"year":2022,"gross":"58596.90","reduction":"0.00","base":"55596.90","state":"8136.18"}] as const
for (const w of observed) it(`original monetary witness ${w.year}/${w.id}`, () => {
  const i=input(w.year,w.gross), before=JSON.stringify(i)
  const r=Effect.runSync(direct(i)); expect(Effect.runSync(api(i))).toEqual(r)
  const values = new Map(Object.entries({
    "0025":r.rendimientoNetoReducido,"0500":r.baseLiquidableGeneral,"0505":r.baseLiquidableGeneral,
    "0528":r.componentesCuota.gravamenEstatal,"0529":r.componentesCuota.gravamenAutonomico,
    "0530":r.componentesCuota.gravamenMinimoEstatal,"0531":r.componentesCuota.gravamenMinimoAutonomico,
    "0532":r.componentesCuota.cuotaEstatal,"0533":r.componentesCuota.cuotaAutonomica,
    "0595":r.cuotaPosterior,"0610":r.cuotaDiferencial,"0670":r.cuotaDiferencialPresentada,
  }))
  for(const [box,expected] of Object.entries(w.official)) expect(new D(values.get(box)!).eq(expected),box).toBe(true)
  expect(new D(r.cuotaPosterior).minus(100).eq(r.cuotaDiferencial)).toBe(true)
  expect(JSON.stringify(i)).toBe(before);expect(r.aceptacionFiscal).toBe("pendiente")
  const text=JSON.stringify(r.rastro)
  expect(text).toContain("binary64/decimal corto/HALF_UP")
  expect(text).not.toContain("precisión histórica")
})
for(const b of boundaries) it(`exact boundary ${b.year}/${b.gross}`,()=>{
  const i=input(b.year,b.gross);expect(profile(i)).toBe(true)
  const r=Effect.runSync(api(i));expect(Effect.runSync(direct(i))).toEqual(r)
  expect(new D(r.baseLiquidableGeneral).eq(b.base)).toBe(true)
  expect(new D(r.reduccionArt20).eq(b.reduction)).toBe(true)
  expect(new D(r.componentesCuota.gravamenEstatal).eq(b.state)).toBe(true)
})
it("rational competitors distinguish short transport from exact and truncation",()=>{
  expect(stateNumerator(cents("26846.30"))).toBe(310969500n)
  expect(euro(half(stateNumerator(cents("26846.30")),1000n))).toBe("3109.70")
  for(const [base,expected] of [["26846.11","3109.67"],["35116.90","4350.29"]]) {
    const n=stateNumerator(cents(base!));expect(euro(half(n,1000n))).toBe(expected)
    expect(euro(n/1000n)).not.toBe(expected)
  }
  // Rational art20 = 1236.855; observed reduction = 1236.85 remains reserved as box0023.
  expect(5565000n-15n*(1600043n-1311500n)).toBe(1236855n)
})
const composition = (gross="29846.30",base="26846.30"):EntradaComposicionAnual => ({
  ambito:{anio:2020,comunidadAutonoma:"madrid",situacionFamiliar:{tipo:"individual",edad:35,discapacidad:{_tag:"SinDiscapacidad"},descendientes:[],ascendientes:[]}},
  cotizaciones:{naturaleza:"efectivas",trabajador:new D(1000)},rentasTrabajoAnuales:{integroTrabajo:new D(gross),restoRentas:new D(0)},
  origenBaseGeneralB:"solo-trabajo",precision:80,politica:"open-etapas-empleo-madrid-2020-2022",hechosOpen2020A2022:input(2020,gross),
  baseGeneral:new D(base),baseAhorro:new D(0),rentasAntesReducciones:new D(gross).minus(3000),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0,
})
it("valid composition and previous Decimal route remain usable",()=>{
  const c=composition();expect(Effect.runSync(componerLiquidacionAnual(c)).cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.69")
  const old=Effect.runSync(componerLiquidacionAnual({...c,politica:"decimal-hasta-salida",hechosOpen2020A2022:undefined}))
  expect(old.cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.695")
})
const invalid: Array<[string,()=>EntradaComposicionAnual]> = [
  ["name without facts",()=>({...composition(),hechosOpen2020A2022:undefined})],
  ["precision20",()=>({...composition(),precision:20})],
  ["unrelated base despite no art20",()=>composition("29846.30","20000")],
  ["missing required reduction",()=>composition("17000.43","14000.43")],
  ["rational HALF_UP instead of operative reduction",()=>composition("17000.43","12763.57")],
  ["arbitrary minimum",()=>({...composition(),minimosEstatales:{...MINIMOS_ESTATALES_2025,contribuyente:{...MINIMOS_ESTATALES_2025.contribuyente,general:new D(6000)}}})],
  ["other income",()=>({...composition(),rentasTrabajoAnuales:{integroTrabajo:new D("29846.30"),restoRentas:new D(1)}})],
  ["savings",()=>({...composition(),baseAhorro:new D(1)})],
  ["wrong social security",()=>({...composition(),cotizaciones:{naturaleza:"efectivas",trabajador:new D(999)}})],
  ["subcent base",()=>composition("29846.30","26846.301")],
  ["no positive base",()=>composition("29846.30","0")],
  ["activity contradicts work-only",()=>({...composition(),rentaActividadAnualB:new D(1)})],
]
for(const [label,make] of invalid) it(`reject contradiction: ${label}`,()=>{
  // A defect is not a fiscal rejection and a successful zero is never a rejection.
  const result=Effect.runSync(Effect.result(componerLiquidacionAnual(make())))
  expect(Result.isFailure(result)).toBe(true)
  if(Result.isFailure(result)) expect(result.failure._tag).toBe("ResultadoNoSoportado")
})
for(const y of [2018,2019,2023,2024,2025] as const) it(`policy cannot leak into ${y}`,()=>{
  const c=composition();const result=Effect.runSync(Effect.result(componerLiquidacionAnual({...c,ambito:{...c.ambito,anio:y}})))
  expect(Result.isFailure(result)).toBe(true)
  const args={anio:y,rendimientoPrevioNeto:new D("16000.43"),otrasRentasNoExentas:new D(0)}
  expect(reduce({...args,compatibilidadOpen2020A2022:{integro:new D("17000.43"),gastosAE:new D(1000)}}).eq(reduce(args))).toBe(true)
})
for(const y of [2020,2021,2022] as const) it(`selector economic boundary ${y}`,()=>{
  for(const s of ["8565","8564.99",y===2022?"58596.91":"63000.01","17000.431","NaN","Infinity","-1"])
    expect(admits(new D(s),new D(1000),y),s).toBe(false)
  for(const s of ["8565.01","14115","17825",y===2022?"58596.90":"63000"])
    expect(admits(new D(s),new D(1000),y),s).toBe(true)
  // Valid normal API route outside new profile must succeed with prior monetary semantics.
  const r=Effect.runSync(api(input(y,"29846.30",40)))
  expect(r.componentesCuota.gravamenEstatal).toBe("3109.7")
  expect(JSON.stringify(r.rastro)).not.toContain("Política operativa revisable Open Madrid 2020–2022")
})
it("strict public rejection does not become zero, both API",()=>{
  const r=raw(2020,"17000.43");r.trabajo.rendimientos[0]!.integro="17000.431"
  for(const f of [api,direct]) {
    // SAFETY: entrada deliberadamente inválida; ambas API deben rechazarla en su frontera runtime.
    const result=Effect.runSync(Effect.result(f(r as never)))
    expect(Result.isFailure(result)).toBe(true)
  }
})
it("precision80 independent of adversarial global context",()=>{
  const before=Decimal.precision
  try {
    Decimal.set({precision:5})
    for(const gross of ["17000.43","29846.30","38116.90"]) {
      const i=input(2020,gross);const r=Effect.runSync(api(i));expect(Effect.runSync(direct(i))).toEqual(r)
      const w=observed.find(w=>w.year===2020 && new D(w.gross).eq(gross))
      if(w === undefined) throw new Error(`missing independent witness ${gross}`)
      expect(new D(r.baseLiquidableGeneral).eq(w.official["0505"])).toBe(true)
      expect(new D(r.componentesCuota.gravamenEstatal).eq(w.official["0528"])).toBe(true)
    }
    expect(Decimal.precision).toBe(5)
  } finally {Decimal.set({precision:before})}
})
it("canonical excludes the explicit policy in 2018/19/20/21/22/23/24/25",()=>{
  for(const anio of [2018,2019,2020,2021,2022,2023,2024,2025] as const) {
    const a=Effect.runSync(liquidarIrpfAnual({...analitico,anio},{modo:"canonico"}))
    const b=Effect.runSync(liquidarIrpfAnual({...analitico,anio,retencionesSoportadasCentimos:10000},{modo:"canonico"}))
    expect(a.cuotaLiquidaCentimos).toBe(b.cuotaLiquidaCentimos)
    expect(a.cuotaDiferencialCentimos-b.cuotaDiferencialCentimos).toBe(10000)
    expect(JSON.stringify(a)).not.toContain("open-etapas-empleo-madrid-2020-2022")
    expect(JSON.stringify(a)).not.toContain("Open Madrid 2020–2022")
  }
})
for(const year of [2018,2019,2023,2024,2025]) it(`both explicit API preserve previous route ${year}`,()=>{
  const r=raw(year,"29846.11",40)
  if(year===2025) r.deducciones="solo-da61-si-procede"
  const i=decode(r);const a=Effect.runSync(direct(i));expect(Effect.runSync(api(i))).toEqual(a)
  expect(new D(a.componentesCuota.gravamenEstatal).eq("3109.67")).toBe(true)
  expect(JSON.stringify(a.rastro)).not.toContain("Política operativa revisable Open Madrid 2020–2022")
})
