import { expect, it } from "vitest"
import { Effect } from "effect"
import { fixture, ambas } from "./dt18-rioja-fixture"

for (const incremento of ["0", "-0.01"] as const) for (const api of [0, 1] as const) {
  it(`incremento ${incremento}, API${api}: varios capitales computan cero sin repartir financiación`, () => {
    const s = structuredClone(fixture(["adquisicion", "rehabilitacion"])), h = s.viviendaDT182025
    Object.assign(h.cuentas[0]!.inicio, { importe: "20000" })
    Object.assign(h.cuentas[0]!.cierre, { importe: incremento === "0" ? "14000" : "13999.99" })
    Object.assign(h.movimientos.find(x => x.id === "CON")!, { importe: incremento === "0" ? "49900" : "49900.01" })
    const antes = structuredClone(s)
    const r = Effect.runSync(ambas(s)[api]).deduccionesTerritoriales2025!
    expect(r.viviendaDT182025?.baseDerechoSinAdecuacion).toEqual({ numeradorCentimos: "10000", denominador: "1" })
    expect(r.total).toEqual({ numeradorEuros: "0", divisor: "1" })
    expect(s).toEqual(antes)
  })
}
