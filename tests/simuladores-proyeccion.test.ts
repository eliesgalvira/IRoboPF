import { expect, it } from "vitest"
import Decimal from "decimal.js"
import { Effect, Schema } from "effect"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import oficiales from "../docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json"

it.each(oficiales)("proyección EUR sin tolerancia: $id", ({ entrada, casillas }) => {
  const result = Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)))
  expect(result.componentesCuota.unidad).toBe("EUR")
  const c = result.componentesCuota
  for (const [box, value] of [["0528", c.gravamenEstatal], ["0529", c.gravamenAutonomico], ["0530", c.gravamenMinimoEstatal], ["0531", c.gravamenMinimoAutonomico], ["0532", c.cuotaEstatal], ["0533", c.cuotaAutonomica]] as const) {
    expect(new Decimal(value).equals(casillas[box]), box).toBe(true)
  }
  expect(new Decimal(c.cuotaEstatal).plus(c.cuotaAutonomica).equals(result.cuotaLiquidaLegal)).toBe(true)
})
