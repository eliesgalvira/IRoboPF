import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import fixture from "./fixtures/open-2019-etapas.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"

// Nueve observaciones distintas; se conserva el rojo original de comparación.
// Los cuatro inputs nuevos son declaraciones sintéticas explícitas para esta API,
// no acreditaciones de negativos por silencio SES. Esperados sólo de PDF/SES.
for (const c of fixture.cases) it(`${c.id}: originales 2019 por etapa`, () => {
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
  const resumen = r.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")
  expect(resumen?.descripcion).toContain("Open Madrid 2019")
  expect(resumen?.descripcion).toContain("antes de obtener la base")
  expect(resumen?.descripcion).not.toContain("Artículo 20 conserva su fórmula y precisión histórica")
  expect(c.official["0023"].status).toBe("reserva")
  expect(c.official["0414"].status).toBe("reserva")
  expect(JSON.stringify(input)).toBe(before)
})
it("nueve identidades; cuatro capturas separadas de los cinco rojos", () => {
  expect(new Set(fixture.cases.map(c => c.caseHash)).size).toBe(9)
  expect(fixture.cases.filter(c => c.group === "cinco-originales-rojos")).toHaveLength(5)
  expect(fixture.cases.filter(c => c.group === "cuatro-discriminantes-separados")).toHaveLength(4)
})
