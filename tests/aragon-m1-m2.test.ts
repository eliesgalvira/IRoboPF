import { Effect, Result } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { producirCensoInmuebles2025 } from "../lib/dominio/irpf/inmobiliario-2025/productor"
import type { CasoAragonSocialMixto2025 } from "../lib/dominio/irpf/aragon-social-mixto-2025/contrato"
import { casosAragonM1M2 } from "./aragon-m1-m2.fixtures"

const entradas = casosAragonM1M2 satisfies readonly { id: string; input: CasoAragonSocialMixto2025 }[]
const original = entradas[0]!.input
const liquidaciones = [
  { nombre: "canónica", ejecutar: (c: CasoAragonSocialMixto2025) => Effect.runSync(Effect.result(liquidarIrpfAnual(c, { modo: "canonico" }))) },
  { nombre: "explícita", ejecutar: (c: CasoAragonSocialMixto2025) => Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(c))) },
]
const periodosFuera = [
  { desde: "2024-01-01", hasta: "2024-12-31" },
  { desde: "2024-12-31", hasta: "2025-01-01" },
  { desde: "2025-12-31", hasta: "2026-01-01" },
  { desde: "2026-01-01", hasta: "2026-12-31" },
  { desde: "2025-12-31", hasta: "2025-01-01" },
  { desde: "2025-02-29", hasta: "2025-03-01" },
  { desde: "2025-02-01", hasta: "2025-02-30" },
]
const periodosAdmitidos = [
  { desde: "2025-01-01", hasta: "2025-12-31" },
  { desde: "2025-02-01", hasta: "2025-02-01" },
  { desde: "2025-12-31", hasta: "2025-12-31" },
]
function conPeriodo(periodoDevengo: { desde: string; hasta: string }): CasoAragonSocialMixto2025 {
  return { ...original, inmuebles: original.inmuebles.map(v => ({ ...v,
    gastos: v.gastos.map(g => ({ ...g, periodoDevengo })),
  })) }
}

for (const api of liquidaciones) {
  for (const c of entradas) it(`${api.nombre}: original ${c.id} rechazada`, () => {
    const r = api.ejecutar(c.input)
    expect(r._tag).toBe("Failure")
    if (Result.isFailure(r)) expect(r.failure.motivo).toMatch(c.id === "gasto-devengo-2024" ? /devengo/ : /gestor/)
  })
  for (const p of periodosFuera) it(`${api.nombre}: no deduce período ${p.desde}/${p.hasta}`, () => {
    const r = api.ejecutar(conPeriodo(p))
    expect(r._tag).toBe("Failure")
    if (Result.isFailure(r)) expect(r.failure).toMatchObject({ _tag: "RechazoP4a", codigo: "gasto" })
  })
  for (const p of periodosAdmitidos) it(`${api.nombre}: período 2025 conserva el gasto, ${p.desde}/${p.hasta}`, () => {
    const r = api.ejecutar(conPeriodo(p))
    expect(r._tag).toBe("Success")
    if (Result.isSuccess(r)) {
      expect(r.success.baseImponibleGeneral.toFixed(2)).toBe("37750.00")
      expect(r.success.cuotaDiferencial.toFixed(2)).toBe("8448.63")
    }
  })
}
for (const p of periodosFuera) it(`productor compartido: rechaza ${p.desde}/${p.hasta}`, () => {
  const r = Effect.runSync(Effect.result(producirCensoInmuebles2025(conPeriodo(p))))
  expect(r._tag).toBe("Failure")
  if (Result.isFailure(r)) expect(r.failure).toMatchObject({ _tag: "RechazoP4a", codigo: "gasto" })
})
for (const p of periodosAdmitidos) it(`productor compartido: conserva 100 euros de ${p.desde}/${p.hasta}`, () => {
  const r = Effect.runSync(producirCensoInmuebles2025(conPeriodo(p)))
  const gasto = r.inmuebles[0]!.otrosGastos
  expect(gasto.n).toBe(100n * gasto.d)
})
