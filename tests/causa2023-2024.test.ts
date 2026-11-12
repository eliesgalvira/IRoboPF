import { describe, expect, it } from "vitest"
import { Effect, Schema } from "effect"
import Decimal from "decimal.js"
import fixture from "./fixtures/causa2023-2024.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito as direct } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { liquidarIrpfAnualExplicito as publicApi } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
const input = (c: typeof fixture.cases[number]) => {
  const raw = structuredClone(fixture.template)
  raw.ejercicio = c.year
  raw.edad = c.year - 1985
  raw.devengo = `${c.year}-12-31`
  raw.conciliacion.ejercicio = c.year
  raw.trabajo.ejercicio = c.year
  raw.trabajo.rendimientos[0]!.integro = c.gross
  raw.retenciones[0]!.ejercicio = c.year
  return Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
}
describe("Causa histórica 2023–2024: originales y reservas separadas", () => {
  for (const c of fixture.cases) it(`${c.year}/${c.group}/${c.id}`, () => {
    const i = input(c), before = JSON.stringify(i)
    const a = Effect.runSync(direct(i)), b = Effect.runSync(publicApi(i))
    expect(a).toEqual(b)
    expect(JSON.stringify(i)).toBe(before)
    const values = new Map(Object.entries({
      rendimientoNetoReducido: a.rendimientoNetoReducido,
      baseLiquidableGeneral: a.baseLiquidableGeneral,
      cuotaPosterior: a.cuotaPosterior,
      cuotaDiferencial: a.cuotaDiferencial,
      cuotaDiferencialPresentada: a.cuotaDiferencialPresentada,
      gravamenEstatal: a.componentesCuota.gravamenEstatal,
      gravamenAutonomico: a.componentesCuota.gravamenAutonomico,
      gravamenMinimoEstatal: a.componentesCuota.gravamenMinimoEstatal,
      gravamenMinimoAutonomico: a.componentesCuota.gravamenMinimoAutonomico,
      cuotaEstatal: a.componentesCuota.cuotaEstatal,
      cuotaAutonomica: a.componentesCuota.cuotaAutonomica,
    }))
    for (const e of c.expected) {
      const value = values.get(e.scalar)
      if (value === undefined) throw new Error("Magnitud sin correspondencia: " + e.scalar)
      expect.soft(new Decimal(value).eq(e.value), `${c.year}/${c.id}/${e.box}`).toBe(true)
    }
    expect(c.reserved).toContain("0023")
    expect(c.reserved).toContain("0414")
    expect(a.deduccionTrabajo).toBe("0")
  })
  it("precisión80 independiente del contexto Decimal global", () => {
    const old = Decimal.precision
    try {
      for (const c of fixture.cases.filter(c => c.group === "new-done")) {
        Decimal.set({precision: 80})
        const expected = Effect.runSync(publicApi(input(c)))
        Decimal.set({precision: 5})
        expect(Effect.runSync(publicApi(input(c)))).toEqual(expected)
      }
    } finally { Decimal.set({precision: old}) }
  })
})
