import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2019-etapas.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { admiteArgumentoOpen2019 } from "../lib/dominio/irpf/trabajo-anual/politica-open-2019"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

it("art20 sin compatibilidad explícita conserva el decimal exacto 2019", () => {
  const r = calcularReduccionTrabajoConOtrasRentas({ anio: 2019,
    rendimientoPrevioNeto: new Decimal("16000.41"), otrasRentasNoExentas: new Decimal(0) })
  expect(r.toFixed()).toBe("1236.885")
})
it("la opción 2019 no activa otros años", () => {
  for (const anio of [2018, 2020, 2021, 2022, 2023, 2024, 2025] as const) {
    const args = { anio, rendimientoPrevioNeto: new Decimal("16000.41"), otrasRentasNoExentas: new Decimal(0) }
    const r = calcularReduccionTrabajoConOtrasRentas({ ...args,
      compatibilidadOpen2019: { integro: new Decimal("17000.41"), gastosAE: new Decimal(1000) } })
    expect(r.eq(calcularReduccionTrabajoConOtrasRentas(args))).toBe(true)
  }
})
it("no admite transporte de subcéntimos, fuera de cota ni gastos distintos", () => {
  for (const [gross, costs] of [["1000000.01","1000"],["17000.411","1000"],["17000.41","1000.01"],["17000.41","999"],["NaN","1000"]])
    expect(admiteArgumentoOpen2019(new Decimal(gross!), new Decimal(costs!))).toBe(false)
})
it("la API rechaza magnitud fuera de cota en el escenario activado", () => {
  const raw = structuredClone(fixture.cases[0]!.input)
  raw.trabajo.rendimientos[0]!.integro = "1000000.01"
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
  expect(Result.isFailure(Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(c))))).toBe(true)
})
it("edad distinta conserva ruta previa, sin promesa de la nueva compatibilidad", () => {
  const original = fixture.cases.find(c => c.id === "seed20261104-31")
  if (original === undefined) throw new Error("Falta original31")
  const raw = structuredClone(original.input)
  raw.edad = 35 // Mutación local, nunca un original oficial.
  const r = Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)))
  expect(r.componentesCuota.gravamenEstatal).toBe("3109.7")
})
const composition: EntradaComposicionAnual = {
  ambito: { anio: 2019, comunidadAutonoma: "madrid", situacionFamiliar: {
    tipo: "individual", edad: 34, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [],
  } },
  cotizaciones: { naturaleza: "efectivas", trabajador: new Decimal(1000) },
  rentasTrabajoAnuales: { integroTrabajo: new Decimal("29846.30"), restoRentas: new Decimal(0) },
  origenBaseGeneralB: "solo-trabajo", precision: 80, politica: "open-etapas-empleo-madrid-2019",
  baseGeneral: new Decimal("26846.30"), baseAhorro: new Decimal(0),
  rentasAntesReducciones: new Decimal("26846.30"), minimosEstatales: MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos: 0,
}
const invalid: readonly EntradaComposicionAnual[] = [
  { ...composition, ambito: { ...composition.ambito, anio: 2020 } },
  { ...composition, ambito: { ...composition.ambito, comunidadAutonoma: "andalucia" } },
  { ...composition, ambito: { ...composition.ambito, situacionFamiliar: { ...composition.ambito.situacionFamiliar, edad: 35 } } },
  { ...composition, origenBaseGeneralB: "solo-actividad" },
  { ...composition, cotizaciones: { ...composition.cotizaciones, trabajador: new Decimal("1000.01") } },
  { ...composition, baseGeneral: new Decimal("26846.301") },
  { ...composition, baseAhorro: new Decimal(1) },
  { ...composition, rentasTrabajoAnuales: undefined },
  { ...composition, rentasTrabajoAnuales: { integroTrabajo: new Decimal(30000), restoRentas: new Decimal(1) } },
]
it.each(invalid)("composición interna no amplía la política por su nombre", c => {
  expect(Result.isFailure(Effect.runSync(Effect.result(componerLiquidacionAnual(c))))).toBe(true)
})
