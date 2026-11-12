import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2018-parciales.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

for (const c of fixture.cases) it(`${c.id}: casillas oficiales y originales conservados`, () => {
  const input = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input)
  const before = JSON.stringify(input)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(input))
  const scalars = new Map<string, string>([
    ["0025", r.rendimientoNetoReducido], ["0500", r.baseLiquidableGeneral],
    ["0505", r.baseLiquidableGeneral], ["0528", r.componentesCuota.gravamenEstatal],
    ["0529", r.componentesCuota.gravamenAutonomico], ["0530", r.componentesCuota.gravamenMinimoEstatal],
    ["0531", r.componentesCuota.gravamenMinimoAutonomico], ["0532", r.componentesCuota.cuotaEstatal],
    ["0533", r.componentesCuota.cuotaAutonomica], ["0595", r.cuotaPosterior],
    ["0610", r.cuotaDiferencial], ["0670", r.cuotaDiferencialPresentada],
  ])
  for (const [box, expected] of Object.entries(c.official)) {
    if (expected.status !== "acreditada" || expected.pdf === null || expected.ses === null) continue
    expect.soft(new Decimal(expected.pdf).eq(expected.ses), `${c.id}/${box}: PDF/SES`).toBe(true)
    const value = scalars.get(box)
    if (value === undefined) throw new Error(`Casilla acreditada sin proyección: ${box}`)
    expect.soft(new Decimal(value).eq(expected.pdf), `${c.id}/${box}: importe oficial`).toBe(true)
  }
  expect(c.official["0023"].status).toBe("reserva")
  expect(c.official["0414"].status).toBe("reserva")
  expect(JSON.stringify(r.rastro)).toContain("resta entre parciales binary64/decimal corto")
  expect(JSON.stringify(input)).toBe(before)
})

it("seis discrepantes y un discriminante separado, sin convertir modelos aritméticos en originales", () => {
  expect(fixture.cases).toHaveLength(7)
  expect(new Set(fixture.cases.map(c => c.caseHash)).size).toBe(7)
  for (const c of fixture.cases) {
    expect(c.input.trabajo.rendimientos[0]?.integro).toBe(c.original.gross)
    expect(c.input.trabajo.rendimientos[0]?.cotizaciones.seguridadSocial).toBe(c.original.ss)
    expect(c.input.retenciones[0]?.importe).toBe(c.original.retention)
  }
})
