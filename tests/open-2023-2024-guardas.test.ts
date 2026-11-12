import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/causa2023-2024.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { alternativaOpen2023A2024, admiteArgumentoOpen2023A2024, esPerfilOpen2023A2024 } from "../lib/dominio/irpf/trabajo-anual/politica-open-2023-2024"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { liquidarIrpfAnualExplicito as direct } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { liquidarIrpfAnualExplicito as publicApi } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

const D = Decimal.clone({ precision: 80 })
const caso = (year: 2023 | 2024, gross: string) => {
  const raw = structuredClone(fixture.template)
  raw.ejercicio = year; raw.edad = year - 1985; raw.devengo = `${year}-12-31`
  raw.trabajo.ejercicio = year; raw.conciliacion.ejercicio = year; raw.retenciones[0]!.ejercicio = year
  raw.trabajo.rendimientos[0]!.integro = gross
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
  if (c.perfil !== "solo-trabajo") throw new Error("Fixture debe ser empleo único")
  return c
}
const composition = (year: 2023 | 2024, gross: string, base: string): EntradaComposicionAnual => ({
  ambito: { anio: year, comunidadAutonoma: "madrid", situacionFamiliar: {
    tipo: "individual", edad: year - 1985, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [],
  } },
  cotizaciones: { naturaleza: "efectivas", trabajador: new D(1000) },
  rentasTrabajoAnuales: { integroTrabajo: new D(gross), restoRentas: new D(0) },
  origenBaseGeneralB: "solo-trabajo", precision: 80,
  politica: year === 2023 ? "open-etapas-empleo-madrid-2023" : "open-etapas-empleo-madrid-2024",
  hechosOpen2023A2024: caso(year, gross),
  baseGeneral: new D(base), baseAhorro: new D(0),
  rentasAntesReducciones: new D(gross).minus(3000), minimosEstatales: MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos: 0,
})
const rejected = (c: EntradaComposicionAnual) => {
  const r = Effect.runSync(Effect.result(componerLiquidacionAnual(c)))
  expect(Result.isFailure(r)).toBe(true)
  if (Result.isFailure(r)) expect(r.failure._tag).toBe("ResultadoNoSoportado")
}
for (const [year, gross, base, cuota] of [
  [2023, "15084.75", "5629.21", "534.77"],
  [2024, "15852.02", "5550.06", "527.26"],
  [2024, "17000.42", "8708.15", "827.27"],
] as const) {
  const c = composition(year, gross, base)
  it(`${year}/${gross}: positivo y contexto global5 sin mutaciones`, () => {
    const old = Decimal.precision, before = JSON.stringify(c)
    try {
      const expected = Effect.runSync(componerLiquidacionAnual(c))
      Decimal.set({ precision: 5 })
      const r = Effect.runSync(componerLiquidacionAnual(c))
      expect(JSON.stringify(r)).toBe(JSON.stringify(expected))
      expect(r.cuotaIntegraGeneralEstatal.toFixed()).toBe(cuota)
      const a = Effect.runSync(direct(c.hechosOpen2023A2024!)), b = Effect.runSync(publicApi(c.hechosOpen2023A2024!))
      expect(a).toEqual(b)
      expect(a.baseLiquidableGeneral).toBe(base)
      expect(a.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")?.descripcion).toContain(`Open Madrid ${year}`)
      expect(a.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).length).toBeGreaterThan(0)
      expect(JSON.stringify(c)).toBe(before)
      expect(Decimal.precision).toBe(5)
    } finally { Decimal.set({ precision: old }) }
  })
  const invalid: [string, EntradaComposicionAnual][] = [
    ["base inventada", { ...c, baseGeneral: new D(base).plus("0.01") }],
    ["reducción omitida", { ...c, baseGeneral: c.rentasAntesReducciones }],
    ["otra política art20", { ...c, baseGeneral: new D(year === 2023 ? "5629.22" : gross === "15852.02" ? "5550.05" : "8708.16") }],
    ["neto contradictorio", { ...c, rentasAntesReducciones: c.rentasAntesReducciones.plus("0.01") }],
    ["mínimo6000", { ...c, minimosEstatales: { ...MINIMOS_ESTATALES_2025, contribuyente: { ...MINIMOS_ESTATALES_2025.contribuyente, general: new D(6000) } } }],
    ["actividad aunque empleo", { ...c, rentaActividadAnualB: new D(1) }],
    ["origen actividad", { ...c, origenBaseGeneralB: "solo-actividad" }],
    ["sin hechos", { ...c, hechosOpen2023A2024: undefined }],
    ["SS ajena", { ...c, cotizaciones: { naturaleza: "efectivas", trabajador: new D("1000.01") } }],
    ["ahorro", { ...c, baseAhorro: new D(1) }],
    ["otra renta", { ...c, rentasTrabajoAnuales: { integroTrabajo: new D(gross), restoRentas: new D(1) } }],
    ["deducción", { ...c, deduccionesAutonomicasCentimos: 1 }],
    ["política otro año", { ...c, politica: year === 2023 ? "open-etapas-empleo-madrid-2024" : "open-etapas-empleo-madrid-2023" }],
    ["otro territorio", { ...c, ambito: { ...c.ambito, comunidadAutonoma: "andalucia" } }],
    ["edad ajena", { ...c, ambito: { ...c.ambito, situacionFamiliar: { ...c.ambito.situacionFamiliar, edad: 40 } } }],
    ...[79, 81, 20].map((precision): [string, EntradaComposicionAnual] => [ `precision${precision}`, Object.assign({ ...c }, { precision }) ]),
    ...["NaN", "Infinity", "-Infinity", "0", `${base}1`].map((v): [string, EntradaComposicionAnual] => [v, { ...c, baseGeneral: new D(v) }]),
  ]
  it.each(invalid)(`${year}/${gross}: rechaza %s`, (_, value) => rejected(value))
}
it("envolvente no es lista de brutos ni cota técnica; rechaza subcéntimos/no finitos", () => {
  for (const year of [2023, 2024]) {
    for (const g of ["12546.57", "58172.55", "25000.01"]) expect(admiteArgumentoOpen2023A2024(new D(g), new D(1000), year)).toBe(true)
    for (const g of ["12546.56", "58172.56", "25000.011", "NaN", "Infinity"]) expect(admiteArgumentoOpen2023A2024(new D(g), new D(1000), year)).toBe(false)
  }
})
it("alternativa no habilita otros años ni la ruta decimal por defecto", () => {
  for (const year of [2018, 2019, 2020, 2021, 2022, 2025] as const) {
    expect(alternativaOpen2023A2024(year, new D("17000.42"), new D(1000))).toBeUndefined()
    const args = { anio: year, rendimientoPrevioNeto: new D("16000.42"), otrasRentasNoExentas: new D(0) }
    expect(calcularReduccionTrabajoConOtrasRentas({ ...args, compatibilidadOpen2023A2024: alternativaOpen2023A2024(2024, new D("17000.42"), new D(1000)) })).toEqual(calcularReduccionTrabajoConOtrasRentas(args))
  }
  const args = { anio: 2023 as const, rendimientoPrevioNeto: new D("14084.75"), otrasRentasNoExentas: new D(0) }
  expect(calcularReduccionTrabajoConOtrasRentas(args).toFixed()).toBe("6455.535")
  expect(calcularReduccionTrabajoConOtrasRentas({ ...args, compatibilidadOpen2023A2024: alternativaOpen2023A2024(2023, new D("15084.75"), new D(1000)) }).toFixed()).toBe("6455.54")
})
it("hechos negativos: actividad, familia, discapacidad, ahorro/otras y empleo estatutario no seleccionan", () => {
  const c = caso(2024, "17000.42")
  for (const change of [
    { perfil: "solo-actividad-eds" }, { familiaresConDerechoMinimo: "segun-derechos" },
    { discapacidad: "33-a-64" }, { otrasRentas: "solo-ingresos-identificados" },
    { trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, clase: "empleo-estatutario" })) } },
  ]) expect(esPerfilOpen2023A2024(Object.assign({ ...c }, change))).toBe(false)
})

it("ruta decimal de composición permanece disponible y sin activar las alternativas", () => {
  for (const year of [2023, 2024] as const) {
    const c = composition(year, "29846.30", "26846.30")
    const r = Effect.runSync(componerLiquidacionAnual({ ...c, politica: "decimal-hasta-salida", hechosOpen2023A2024: undefined }))
    expect(r.cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.695")
    expect(Effect.runSync(componerLiquidacionAnual(c)).cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.69")
  }
})
it("traza pública expone argumento2024 previo a art20 y decisión2023; sin promover reservas", () => {
  const a = Effect.runSync(publicApi(caso(2024, "17000.42")))
  const b = Effect.runSync(publicApi(caso(2023, "15084.75")))
  const linea = (r: typeof a) => r.rastro.pasos.flatMap(p => p.lineasCalculo ?? []).find(l => l.origen?.siteId === "anual.explicito.trabajo.art20")
  expect(linea(a)?.formula).toBe("Open Madrid 2024 acotado: argumento art20 Number(bruto)-Number(SS)=16000.419999999998; ramas binary64/decimal corto/HALF_UP antes de restar a art19 Decimal80; base a céntimos propagada a ambas escalas")
  expect(linea(b)?.formula).toBe("Open Madrid 2023 acotado: art20 racional/HALF_UP antes de restar a art19 Decimal80; base a céntimos propagada a ambas escalas")
  for (const r of [a, b]) {
    const summary = r.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")?.descripcion
    expect(summary).toContain("0023/0414 reservadas, ausencias sin promover a cero")
    expect(summary).toContain("No atribuye algoritmo interno a AEAT ni equivalencia general Open1.23/1.24")
  }
})
import { liquidarIrpfAnual } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { analitico } from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
it("API canónica sigue sin seleccionar las alternativas de la conexión explícita", () => {
  for (const anio of [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] as const) {
    const r = Effect.runSync(liquidarIrpfAnual({ ...analitico, anio }, { modo: "canonico" }))
    expect(JSON.stringify(r.rastro)).not.toContain("Política operativa revisable Open Madrid 2023")
    expect(JSON.stringify(r.rastro)).not.toContain("Política operativa revisable Open Madrid 2024")
  }
})
