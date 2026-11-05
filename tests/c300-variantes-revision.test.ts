import { expect, it, vi } from "vitest"
import { Effect, Result, Schema } from "effect"
import Decimal from "decimal.js"
import * as composition from "../lib/dominio/irpf/liquidacion/composicion-anual.ts"
import { liquidarIrpfAnualExplicito as publicApi } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts"
import { liquidarIrpfAnualExplicito as workApi } from "../lib/dominio/irpf/trabajo-anual/conexion.ts"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato.ts"
import fixtures from "./fixtures/c300-variantes.json"
const territorial = fixtures.filter((f) => !("originalEntrada" in f))
const decode = (e: (typeof fixtures)[number]["entrada"]) =>
  Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(e)
it.each(territorial)(
  "$id: ambas API públicas usan la misma composición y captura",
  (f) => {
    const e = decode(f.entrada)
    const a = Effect.runSync(publicApi(e)),
      b = Effect.runSync(workApi(e))
    expect(a).toEqual(b)
    expect(
      new Decimal(a.componentesCuota.gravamenEstatal).eq(f.fields.CEXGE1!)
    ).toBe(true)
    expect(
      new Decimal(a.componentesCuota.gravamenAutonomico).eq(f.fields.CEXGA1!)
    ).toBe(true)
  }
)
it.each([
  [
    "2149.76499999999999999999999999999999999999999999999999999999999999999999",
    "2149.76",
  ],
  ["2149.765", "2149.77"],
  ["2149.7649", "2149.76"],
  ["-0.005", "-0.01"],
])("cuantización directa sin doble redondeo %s", (raw, expected) => {
  const D = Decimal.clone({ precision: 80 })
  expect(
    composition
      .cuantizarAnual(new D(raw), "open-cuotas-empleo-territorios-2025")
      .toFixed(2)
  ).toBe(expected)
})
it("guardia de composición: fronteras que deben rechazarse", () => {
  const spy = vi.spyOn(composition, "componerLiquidacionAnual")
  try {
    Effect.runSync(workApi(decode(territorial[0]!.entrada)))
    const e = spy.mock.calls[0]![0]
    expect(e.precision).toBe(80)
    expect(e.politica).toBe("open-cuotas-empleo-territorios-2025")
    const variants = [
      { ...e, ambito: { ...e.ambito, anio: 2024 } },
      { ...e, ambito: { ...e.ambito, comunidadAutonoma: "murcia" } },
      { ...e, ambito: { ...e.ambito, fechaFallecimiento: "2025-12-01" } },
      {
        ...e,
        cotizaciones: {
          ...e.cotizaciones,
          naturaleza: "estimadas-perfil-uniforme",
        },
      },
      { ...e, rentasTrabajoAnuales: undefined },
      { ...e, serviciosLaborales: undefined },
    ]
    for (const v of variants) {
      const r = Effect.runSync(
        Effect.result(
          // SAFETY: entradas internas inválidas construidas deliberadamente para probar sus rechazos.
          composition.componerLiquidacionAnual(v as typeof e)
        )
      )
      expect(Result.isFailure(r)).toBe(true)
    }
  } finally {
    spy.mockRestore()
  }
})
it.each(territorial)(
  "$id: distribuir hechos equivalentes entre dos pagadores conserva importes",
  (f) => {
    const raw = structuredClone(f.entrada)
    const one = raw.trabajo.rendimientos[0]!
    const a = structuredClone(one),
      b = structuredClone(one)
    a.id = "split-a"
    b.id = "split-b"
    a.integro = "12500.08"
    b.integro = "12500.09"
    a.cotizaciones.seguridadSocial = b.cotizaciones.seguridadSocial = "815.01"
    a.sindicato.importe = "61.72"
    b.sindicato.importe = "61.73"
    a.colegio.importe = "249.99"
    b.colegio.importe = "250.00"
    a.defensa.importe = "149.99"
    b.defensa.importe = "150.00"
    raw.trabajo.rendimientos = [a, b]
    const original = Effect.runSync(workApi(decode(f.entrada)))
    const split = Effect.runSync(workApi(decode(raw)))
    expect(split.componentesCuota).toEqual(original.componentesCuota)
    expect(split.reduccionArt20).toEqual(original.reduccionArt20)
    expect(split.deduccionTrabajo).toEqual(original.deduccionTrabajo)
    expect(split.cuotaDiferencial).toEqual(original.cuotaDiferencial)
  }
)

it.each(["bruto-cero", "integro-contradictorio"])(
  "guardia interna rechaza %s",
  (caso) => {
    const spy = vi.spyOn(composition, "componerLiquidacionAnual")
    try {
      Effect.runSync(workApi(decode(territorial[0]!.entrada)))
      const e = spy.mock.calls[0]![0]
      const bruto =
        caso === "bruto-cero"
          ? new Decimal(0)
          : e.rentasTrabajoAnuales!.integroTrabajo.plus(1)
      const r = Effect.runSync(
        Effect.result(
          composition.componerLiquidacionAnual({
            ...e,
            serviciosLaborales: { bruto },
          })
        )
      )
      expect(Result.isFailure(r)).toBe(true)
    } finally {
      spy.mockRestore()
    }
  }
)
