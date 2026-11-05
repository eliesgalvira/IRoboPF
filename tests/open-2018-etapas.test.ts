import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2018-etapas.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

// 28 identidades, una ejecución por identidad: los nueve están incluidos en 13+14.
// Preparadas para rojo contra preimagen; ninguna ejecución declarada en fase ligera.
for (const c of fixture.cases) it(`${c.id}: originales acreditados intactos`, () => {
  const input = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input)
  const before = JSON.stringify(input)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(input))
  const scalars = {
    "0025": r.rendimientoNetoReducido, "0500": r.baseLiquidableGeneral,
    "0505": r.baseLiquidableGeneral, "0528": r.componentesCuota.gravamenEstatal,
    "0529": r.componentesCuota.gravamenAutonomico,
    "0530": r.componentesCuota.gravamenMinimoEstatal,
    "0531": r.componentesCuota.gravamenMinimoAutonomico,
    "0532": r.componentesCuota.cuotaEstatal, "0533": r.componentesCuota.cuotaAutonomica,
    "0595": r.cuotaPosterior, "0610": r.cuotaDiferencial,
    "0670": r.cuotaDiferencialPresentada,
  }
  for (const [box, expected] of Object.entries(c.official)) {
    if (expected.status !== "acreditada" || expected.pdf === null || expected.ses === null) continue
    expect.soft(new Decimal(expected.pdf).eq(expected.ses), `${box}: PDF/SES`).toBe(true)
    const value = Object.entries(scalars).find(([key]) => key === box)?.[1]
    if (value === undefined) throw new Error(`Casilla acreditada sin proyección: ${box}`)
    expect.soft(new Decimal(value).eq(expected.pdf), `${c.id}/${box}`).toBe(true)
  }
  expect(c.official["0023"].status).toBe("reserva")
  expect(c.official["0414"].status).toBe("reserva")
  expect(JSON.stringify(input)).toBe(before)
})
it("recuento sin solapes ni promoción del experimento a matriz", () => {
  expect(new Set(fixture.cases.map(c => c.caseHash)).size).toBe(28)
  for (const [group, count] of [["nueve-originales", 9], ["art20", 13], ["empate-estatal", 14], ["experimento-aislado", 1]] as const)
    expect(fixture.cases.filter(c => c.groups.includes(group))).toHaveLength(count)
})
