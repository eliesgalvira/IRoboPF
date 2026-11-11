import Decimal from "decimal.js"
import { DateTime, Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2020-2022-control.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { admiteArgumentoOpen2020A2022, esPerfilOpen2020A2022 } from "../lib/dominio/irpf/trabajo-anual/politica-open-2020-2022"
import { calcularReduccionTrabajoConOtrasRentas } from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import { componerLiquidacionAnual, type EntradaComposicionAnual } from "../lib/dominio/irpf/liquidacion/composicion-anual"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

const original = fixture.cases.find(c => c.id === "seed20261104-31")
if (original === undefined) throw new Error("Falta PRE original31")
const raw = original.input
const input = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
const D = Decimal.clone({ precision: 80 })
const option = { integro: new D("17000.43"), gastosAE: new D(1000) }

it("opción nueva cambia sólo 2020–2022, nunca activa política2019 por semejanza", () => {
  for (const anio of [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025] as const) {
    const args = { anio, rendimientoPrevioNeto: new D("16000.43"), otrasRentasNoExentas: new D(0) }
    const exact = calcularReduccionTrabajoConOtrasRentas(args)
    const nuevo = calcularReduccionTrabajoConOtrasRentas({ ...args, compatibilidadOpen2020A2022: option })
    const viejo = calcularReduccionTrabajoConOtrasRentas({ ...args, compatibilidadOpen2019: option })
    if (anio >= 2020 && anio <= 2022) {
      expect(exact.toFixed()).toBe("1236.855")
      expect(nuevo.toFixed()).toBe("1236.85")
      expect(viejo.eq(exact)).toBe(true)
    } else expect(nuevo.eq(exact)).toBe(true)
  }
})
it("guardas técnicas y cotas económicas no se confunden", () => {
  for (const gross of ["8565", "8564.99", "63000.01", "1000000", "1000000.01", "17000.431", "NaN", "Infinity", "-1"])
    expect(admiteArgumentoOpen2020A2022(new D(gross), new D(1000), 2020)).toBe(false)
  for (const gross of ["8565.01", "14115", "14115.01", "17824.99", "17825", "17825.01", "63000"])
    expect(admiteArgumentoOpen2020A2022(new D(gross), new D(1000), 2020)).toBe(true)
  for (const costs of ["999.99", "1000.01", "NaN", "Infinity"])
    expect(admiteArgumentoOpen2020A2022(new D(17000), new D(costs), 2020)).toBe(false)
})
it("2022 excluye la rama autonómica final sin testigo", () => {
  expect(admiteArgumentoOpen2020A2022(new D("58596.90"), new D(1000), 2022)).toBe(true)
  expect(admiteArgumentoOpen2020A2022(new D("58596.91"), new D(1000), 2022)).toBe(false)
  expect(admiteArgumentoOpen2020A2022(new D("58596.91"), new D(1000), 2021)).toBe(true)
})
it("opción nueva inválida conserva ruta decimal, sin transporte silencioso", () => {
  const args = { anio: 2020 as const, rendimientoPrevioNeto: new D("16000.43"), otrasRentasNoExentas: new D(0) }
  for (const gross of ["17000.431", "63000.01", "1000000.01", "NaN"])
    expect(calcularReduccionTrabajoConOtrasRentas({ ...args, compatibilidadOpen2020A2022: { integro: new D(gross), gastosAE: new D(1000) } }).eq(calcularReduccionTrabajoConOtrasRentas(args))).toBe(true)
  for (const otras of ["1", "6500.01"])
    expect(calcularReduccionTrabajoConOtrasRentas({ ...args, otrasRentasNoExentas: new D(otras), compatibilidadOpen2020A2022: option }).eq(calcularReduccionTrabajoConOtrasRentas({ ...args, otrasRentasNoExentas: new D(otras) }))).toBe(true)
})

const outside: readonly unknown[] = [
  { ...raw, edad: 34 }, { ...raw, edad: 36 }, { ...raw, comunidadAutonoma: "andalucia" },
  { ...raw, familiaresConDerechoMinimo: "segun-derechos" },
  { ...raw, discapacidad: "33-a-64" }, { ...raw, otrasRentas: "solo-ingresos-identificados" },
  { ...raw, trabajo: { ...raw.trabajo, movilidad: "ordinaria" } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, cotizaciones: { ...r.cotizaciones, derechosPasivos: "0.01" } })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, cotizaciones: { ...r.cotizaciones, colegiosHuerfanos: "0.01" } })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, clase: "empleo-estatutario" })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, cotizaciones: { ...r.cotizaciones, seguridadSocial: "1000.01" } })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, sindicato: { ...r.sindicato, importe: "0.01" } })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, integro: "63000.01" })) } },
  { ...raw, trabajo: { ...raw.trabajo, rendimientos: raw.trabajo.rendimientos.map(r => ({ ...r, integro: "17000.431" })) } },
  { ...raw, retenciones: raw.retenciones.map(r => ({ ...r, importe: "100.01" })) },
]
it.each(outside)("fuera del perfil conserva ruta anterior o rechazo", value => {
  const decoded = Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(value, { onExcessProperty: "error" })
  if (Result.isFailure(decoded)) return
  expect(esPerfilOpen2020A2022(decoded.success)).toBe(false)
  const result = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(decoded.success)))
  if (Result.isFailure(result)) return
  expect(result.success.rastro.pasos.some(p => p.descripcion?.includes("Política operativa revisable Open Madrid 2020–2022"))).toBe(false)
})

const composition: EntradaComposicionAnual = {
  ambito: { anio: 2020, comunidadAutonoma: "madrid", situacionFamiliar: {
    tipo: "individual", edad: 35, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [],
  } },
  cotizaciones: { naturaleza: "efectivas", trabajador: new D(1000) },
  rentasTrabajoAnuales: { integroTrabajo: new D("29846.30"), restoRentas: new D(0) },
  origenBaseGeneralB: "solo-trabajo", precision: 80, politica: "open-etapas-empleo-madrid-2020-2022",
  hechosOpen2020A2022: input,
  baseGeneral: new D("26846.30"), baseAhorro: new D(0),
  rentasAntesReducciones: new D("26846.30"), minimosEstatales: MINIMOS_ESTATALES_2025,
  deduccionesAutonomicasCentimos: 0,
}
const invalid: readonly EntradaComposicionAnual[] = [
  ...([2018, 2019, 2023, 2024, 2025] as const).map(anio => ({ ...composition, ambito: { ...composition.ambito, anio } })),
  { ...composition, ambito: { ...composition.ambito, comunidadAutonoma: "andalucia" } },
  { ...composition, ambito: { ...composition.ambito, fechaFallecimiento: DateTime.toDateUtc(DateTime.makeUnsafe("2020-06-01")) } },
  { ...composition, ambito: { ...composition.ambito, situacionFamiliar: { ...composition.ambito.situacionFamiliar, edad: 34 } } },
  { ...composition, hechosOpen2020A2022: undefined }, { ...composition, origenBaseGeneralB: "solo-actividad" },
  { ...composition, precision: 20 },
  { ...composition, cotizaciones: { naturaleza: "estimadas-perfil-uniforme", trabajador: new D(1000) } },
  { ...composition, cotizaciones: { naturaleza: "efectivas", trabajador: new D("999.99") } },
  { ...composition, baseGeneral: new D("26846.301") }, { ...composition, baseGeneral: new D(0) },
  { ...composition, baseGeneral: new D("60000.01") }, { ...composition, baseAhorro: new D(1) },
  { ...composition, rentasTrabajoAnuales: undefined },
  { ...composition, rentasTrabajoAnuales: { integroTrabajo: new D(30000), restoRentas: new D(0) } },
  { ...composition, rentasTrabajoAnuales: { integroTrabajo: new D("29846.30"), restoRentas: new D(1) } },
]
it.each(invalid)("composición valida ámbito y hechos; el nombre no amplía política", c => {
  expect(Result.isFailure(Effect.runSync(Effect.result(componerLiquidacionAnual(c))))).toBe(true)
})
it("precisión80 sobrevive al contexto global adversarial; API fuera no cambia de política", () => {
  const precision = Decimal.precision
  try {
    Decimal.set({ precision: 5 })
    const c = Effect.runSync(componerLiquidacionAnual(composition))
    expect(c.cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.69")
    const dec = Effect.runSync(componerLiquidacionAnual({ ...composition, politica: "decimal-hasta-salida", hechosOpen2020A2022: undefined }))
    expect(dec.cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.695")
    const old = Effect.runSync(componerLiquidacionAnual({ ...composition, politica: "open-cuotas-empleo-madrid-2018-2024", hechosOpen2020A2022: undefined }))
    expect(old.cuotaIntegraGeneralEstatal.toFixed()).toBe("3109.7")
    const r = Effect.runSync(liquidarIrpfAnualExplicito(input))
    expect(r.componentesCuota.gravamenEstatal).toBe("3109.69")
    expect(Decimal.precision).toBe(5)
  } finally { Decimal.set({ precision }) }
})
