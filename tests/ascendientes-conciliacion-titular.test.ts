import { Effect } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirAscendientes2025, type AscendienteAnual2025 } from "../lib/dominio/irpf/minimos/ascendientes-2025"
import { casosH1 } from "./ascendientes-h1.fixtures"

type Caso = typeof casosH1[number]
const canonico = (c: Caso, ascendientes: readonly AscendienteAnual2025[]) =>
  liquidarIrpfAnual({ ...c.input.canon, derechosMinimos: { ...c.input.canon.derechosMinimos, ascendientes } }, { modo: "canonico" })
const explicito = (c: Caso, ascendientes: readonly AscendienteAnual2025[]) =>
  liquidarIrpfAnualExplicito({ ...c.input.explicito, derechosMinimos: { ...c.input.explicito.derechosMinimos, ascendientes } })
function coherentes(c: Caso, residente: boolean): readonly AscendienteAnual2025[] {
  return c.input.canon.derechosMinimos.ascendientes.map(a => ({ ...a,
    titulares: a.titulares.map(t => ({ ...t, residenteIrpf: t.titularId === "s-1" || residente })),
  }))
}
const cuotas = {
  madrid: ["4384.79", "3909.91"],
  "castilla-la-mancha": ["4723.86", "4239.36"],
  "comunitat-valenciana": ["4588.71", "4094.01"],
} as const

for (const c of casosH1) {
  // Los dos programas reciben las entradas originales completas, sin normalizarlas.
  it(`${c.region}: H1 original rechazada por API canónica`, () => {
    const e = Effect.runSync(Effect.flip(liquidarIrpfAnual(c.input.canon, { modo: "canonico" })))
    expect(e).toMatchObject({ _tag: "ResultadoNoSoportado" })
    expect(e.motivo).toMatch(/residencia.*contradictoria/)
  })
  it(`${c.region}: H1 original rechazada por API explícita`, () => {
    const e = Effect.runSync(Effect.flip(liquidarIrpfAnualExplicito(c.input.explicito)))
    expect(e).toMatchObject({ _tag: "ResultadoNoSoportado" })
    expect(e.motivo).toMatch(/residencia.*contradictoria/)
  })
  it.each([false, true])(`${c.region}: residencia contradictoria, orden invertido=%s`, invertir => {
    const as = [...c.input.canon.derechosMinimos.ascendientes]
    if (invertir) as.reverse()
    expect(() => producirAscendientes2025(as, "s-1", c.region)).toThrow(/residencia.*contradictoria/)
  })
  it.each([false, true])(`${c.region}: declaración contradictoria, orden invertido=%s`, invertir => {
    const as = coherentes(c, true).map((a, i) => ({ ...a,
      titulares: a.titulares.map(t => ({ ...t,
        declaracion: t.titularId === "s-2" && i === 1 ? "no-presenta" as const : t.declaracion,
      })),
    }))
    if (invertir) as.reverse()
    const ec = Effect.runSync(Effect.flip(canonico(c, as)))
    const ee = Effect.runSync(Effect.flip(explicito(c, as)))
    expect(ec).toMatchObject({ _tag: "ResultadoNoSoportado" })
    expect(ee).toMatchObject({ _tag: "ResultadoNoSoportado" })
    expect(ec.motivo).toMatch(/declaración.*contradictoria/)
    expect(ee.motivo).toMatch(/declaración.*contradictoria/)
  })
  it.each([true, false])(`${c.region}: control coherente, residente=%s`, residente => {
    const as = coherentes(c, residente)
    const esperado = cuotas[c.region][residente ? 0 : 1]
    expect(Effect.runSync(canonico(c, as)).cuotaLiquidaCentimos).toBe(new Decimal(esperado).mul(100).toNumber())
    expect(new Decimal(Effect.runSync(explicito(c, as)).cuotaLiquidaLegal).eq(esperado)).toBe(true)
  })
  it(`${c.region}: grado y convivencia pertenecen a cada relación`, () => {
    const as = coherentes(c, true).map((a, i) => ({ ...a,
      titulares: a.titulares.map(t => t.titularId === "s-2" && i === 1 ? { ...t, grado: 2,
        convivencia: [{ desde: "2025-01-01", hasta: "2025-07-01" }], soporte: "otra-relacion-acreditada",
      } : t),
    }))
    const libro = producirAscendientes2025(as, "s-1", c.region)
    expect(libro.map(a => a.titularesMinimo)).toEqual([["s-1", "s-2"], ["s-1"]])
  })
}
