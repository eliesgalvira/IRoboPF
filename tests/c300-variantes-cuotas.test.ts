import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import fixtures from "./fixtures/c300-variantes.json"

const keys = [
  "TPRRT",
  "TPTOTAL",
  "BLGRAL",
  "BLGGRAV",
  "CEXGE1",
  "CEXGA1",
  "CEXGE2",
  "CEXGA2",
  "CIGEST",
  "CIGAUT",
  "CLDED2",
  "CAUTLIQ",
  "CDIF",
  "RESULTADO",
] as const
const empleo = (entrada: (typeof fixtures)[number]["entrada"]) => {
  const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
  if (caso.perfil !== "solo-trabajo")
    throw new Error("Fixture de empleo requerida")
  return caso
}
const calcular = (entrada: CasoFiscalAnualExplicito) =>
  Effect.runSync(liquidarIrpfAnualExplicito(entrada))

it.each(fixtures)(
  "$id: todos los importes oficiales presentes, sin convertir ausencias",
  (f) => {
    const r = calcular(empleo(f.entrada))
    const c = r.componentesCuota
    const actual = [
      r.reduccionArt20,
      r.rendimientoNetoReducido,
      r.baseImponibleGeneral,
      r.baseLiquidableGeneral,
      c.gravamenEstatal,
      c.gravamenAutonomico,
      c.gravamenMinimoEstatal,
      c.gravamenMinimoAutonomico,
      c.cuotaEstatal,
      c.cuotaAutonomica,
      r.deduccionTrabajo,
      r.cuotaPosterior,
      r.cuotaDiferencial,
      r.cuotaDiferencialPresentada,
    ]
    keys.forEach((key, i) => {
      const expected = f.fields[key]
      if (expected === null) return
      const value = actual[i]
      if (value === undefined) throw new Error("Componente sin proyección")
      expect.soft(new Decimal(value).eq(expected), `${f.id}/${key}`).toBe(true)
    })
  }
)

it.each(fixtures.filter((f) => f.originalEntrada !== undefined))(
  "$id: original sigue rechazado por renta propia incoherente",
  (f) => {
    const original = f.originalEntrada
    if (original === undefined) throw new Error("Original requerido")
    const result = Effect.runSync(
      Effect.result(
        liquidarIrpfAnualExplicito(
          Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(original)
        )
      )
    )
    expect(Result.isFailure(result)).toBe(true)
    if (Result.isFailure(result))
      expect(result.failure.motivo).toContain(
        "renta propia declarada no concilia"
      )
  }
)

const territoriales = fixtures.filter((f) => f.originalEntrada === undefined)
it.each(territoriales)("$id: pensión mantiene gravamen decimal", (f) => {
  const e = empleo(f.entrada)
  const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
    ...e,
    trabajo: {
      ...e.trabajo,
      rendimientos: e.trabajo.rendimientos.map((r) => ({
        ...r,
        clase: "pension",
      })),
    },
  })
  expect(calcular(caso).componentesCuota.gravamenEstatal).toBe("2149.758")
})

it.each(territoriales)("$id: no extiende política a 2024", (f) => {
  const e = empleo(f.entrada)
  const caso = Schema.decodeUnknownResult(CasoFiscalAnualExplicito)({
    ...e,
    ejercicio: 2024,
    devengo: "2024-12-31",
    trabajo: { ...e.trabajo, ejercicio: 2024 },
    conciliacion: { ...e.conciliacion, ejercicio: 2024 },
    retenciones: e.retenciones.map((r) => ({ ...r, ejercicio: 2024 })),
  })
  expect(Result.isFailure(caso)).toBe(true)
})

it.each(territoriales)(
  "$id: art20 y DA61 no reciben compatibilidad Madrid",
  (f) => {
    const e = empleo(f.entrada)
    const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...e,
      trabajo: {
        ...e.trabajo,
        rendimientos: e.trabajo.rendimientos.map((r) => ({
          ...r,
          integro: "16576.01",
          cotizaciones: { ...r.cotizaciones, seguridadSocial: "0" },
          sindicato: { ...r.sindicato, importe: "0" },
          colegio: { ...r.colegio, importe: "0" },
          defensa: { ...r.defensa, importe: "0" },
        })),
      },
    })
    const r = calcular(caso)
    expect(r.reduccionArt20).toBe("4284.9825")
    expect(r.deduccionTrabajo).toBe("339.998")
  }
)

it.each(territoriales)(
  "$id: derechos familiares conservan política decimal",
  (f) => {
    const family = fixtures.find((row) => row.originalEntrada !== undefined)
    if (family === undefined) throw new Error("Fixture familiar requerida")
    const rights = family.entrada.derechosMinimos
    if (rights === undefined) throw new Error("Derechos requeridos")
    const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
      ...f.entrada,
      familiaresConDerechoMinimo: "segun-derechos",
      derechosMinimos: { ...rights, territorio: f.entrada.comunidadAutonoma },
    })
    expect(calcular(caso).componentesCuota.gravamenEstatal).toBe("2149.758")
  }
)

it("Murcia sin evidencia nueva conserva gravamen decimal", () => {
  const f = fixtures[0]
  if (f === undefined) throw new Error("Fixture requerida")
  const caso = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({
    ...f.entrada,
    comunidadAutonoma: "murcia",
  })
  expect(calcular(caso).componentesCuota.gravamenEstatal).toBe("2149.758")
})
