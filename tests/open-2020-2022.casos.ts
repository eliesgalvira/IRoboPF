import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { expect } from "vitest"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"

const Check = Schema.Struct({
  pdf: Schema.Union([Schema.String, Schema.Null]),
  ses: Schema.Union([Schema.String, Schema.Null]),
  status: Schema.String,
})
export const Checks = Schema.Record(Schema.String, Check)
export const contrastar = (c: CasoFiscalAnualExplicito, checks: typeof Checks.Type, id: string) => {
  const before = JSON.stringify(c)
  const r = Effect.runSync(liquidarIrpfAnualExplicito(c))
  const values = new Map(Object.entries({
    "0025": r.rendimientoNetoReducido, "0500": r.baseLiquidableGeneral,
    "0505": r.baseLiquidableGeneral, "0528": r.componentesCuota.gravamenEstatal,
    "0529": r.componentesCuota.gravamenAutonomico,
    "0530": r.componentesCuota.gravamenMinimoEstatal,
    "0531": r.componentesCuota.gravamenMinimoAutonomico,
    "0532": r.componentesCuota.cuotaEstatal, "0533": r.componentesCuota.cuotaAutonomica,
    "0595": r.cuotaPosterior, "0610": r.cuotaDiferencial, "0670": r.cuotaDiferencialPresentada,
  }))
  for (const [box, expected] of Object.entries(checks)) {
    if (expected.status !== "acreditada" || expected.pdf === null || expected.ses === null) continue
    expect.soft(new Decimal(expected.pdf).eq(expected.ses), `${id}/${box}: PDF/SES`).toBe(true)
    const actual = values.get(box)
    if (actual === undefined) throw new Error(`Casilla acreditada sin proyección: ${box}`)
    expect.soft(new Decimal(actual).eq(expected.pdf), `${id}/${box}`).toBe(true)
  }
  expect(checks["0023"]?.status).toBe("reserva")
  expect(checks["0414"]?.status).toBe("reserva")
  expect(JSON.stringify(c)).toBe(before)
  expect(r.aceptacionFiscal).toBe("pendiente")
  return r
}
