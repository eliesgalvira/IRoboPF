import { expect, it } from "vitest"
import { Effect } from "effect"
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { casoUniformeC36, casoExplicitoC36 } from "./c36-conexion-anual.fixtures"
import { hechos } from "./contraste-graves-canarias.fixtures"
import oraculos from "./contraste-graves-oraculos.json"
function exacto(r: { numeradorEuros: string; divisor: string } | undefined, n: string, d: string) {
  if (r === undefined) throw new Error("Falta resultado racional")
  expect(BigInt(r.numeradorEuros) * BigInt(d)).toBe(BigInt(n) * BigInt(r.divisor))
}
for (const api of ["uniforme", "explicita"] as const) {
  const ejecutar = (s: ReturnType<typeof hechos>) => api === "uniforme"
    ? Effect.runSync(liquidarIrpfAnual({ ...casoUniformeC36(), deduccionesTerritoriales2025: { solicitudes: [s] } }, { modo: "canonico" }))
    : Effect.runSync(liquidarIrpfAnualExplicito(casoExplicitoC36([s])))
  for (const c of oraculos) for (const orden of ["original", "inverso", "rotado"] as const) {
    it(`${api} ${c.id} pagos ${orden}`, () => {
      const s = hechos(c.entrada), v = s.hechos.viviendas[0]
      // Sólo reordena hechos de pago; los movimientos bancarios siguen cronológicos.
      if (orden === "inverso") Object.assign(v, { gastos: [...v.gastos].reverse() })
      if (orden === "rotado") Object.assign(v, { gastos: [...v.gastos.slice(1), v.gastos[0]] })
      const antes = JSON.stringify(s)
      const r = ejecutar(s)
      exacto(r.deduccionesTerritoriales2025?.total, c.n, c.d)
      expect(r.deduccionesTerritoriales2025?.aplicaciones).toHaveLength(1)
      expect(JSON.stringify(s)).toBe(antes)
    })
  }
}
