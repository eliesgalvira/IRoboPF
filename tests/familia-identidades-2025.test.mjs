import { Effect } from "effect"
import { expect, it } from "vitest"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {
  analitico,
  efectivo,
} from "../docs/procedencia/reforma-motor/bloque-e/ejemplos"
import casos from "./fixtures/familia-identidades-2025.json"

// Entradas sintéticas y esperados independientes conservados tras H1/H2.
function ejecutar(f, api) {
  const comunes = {
    comunidadAutonoma: f.region,
    contribuyenteId: f.propio,
    derechosMinimos: f.derechos,
    basesFamiliares2025: f.censo,
  }
  if (f.solicitudMadrid)
    comunes.deduccionesTerritoriales2025 = { solicitudes: [f.solicitudMadrid] }
  if (f.solicitudValencia)
    comunes.deduccionesValencianas2025 = f.solicitudValencia
  return Effect.runSync(
    Effect.result(
      api === "canonica"
        ? liquidarIrpfAnual({ ...analitico, ...comunes }, { modo: "canonico" })
        : liquidarIrpfAnualExplicito({
            ...efectivo,
            ...comunes,
            familiaresConDerechoMinimo: "segun-derechos",
            deducciones: f.solicitudValencia
              ? "valencianas-por-hechos-y-da61"
              : f.solicitudMadrid
                ? "territoriales-por-hechos-y-da61"
                : "solo-da61-si-procede",
          })
    )
  )
}

for (const api of ["canonica", "explicita"]) {
  for (const c of casos)
    it(`${api}: identidad censada ${c.id}`, () => {
      const r = ejecutar(c.entrada, api)
      expect(r._tag).toBe(c.esperado.estado)
      if (r._tag !== "Success") return
      if (c.esperado.deduccionMadrid !== undefined)
        expect(r.success.deduccionesTerritoriales2025?.total).toEqual({
          numeradorEuros: c.esperado.deduccionMadrid,
          divisor: "1",
        })
      if (c.esperado.deduccionValencia !== undefined)
        expect(r.success.deduccionesValencianas2025?.totalAplicado).toBe(
          c.esperado.deduccionValencia
        )
    })

  for (const variante of ["cuenta", "liquidacion", "orden"]) {
    it(`${api}: no reutiliza identidad bancaria entre personas, ${variante}`, () => {
      const original = casos.find(
        (c) => c.id === "duplicado-cuenta-entre-personas"
      )
      const f = structuredClone(original.entrada)
      const personas = f.censo.personas.filter(
        (p) => "interesesBancarios2025" in p.economia
      )
      const otra = personas[1].economia.interesesBancarios2025.cuentas[0]
      if (variante === "cuenta") otra.liquidaciones[0].id += "-otra"
      if (variante === "liquidacion") otra.id += "-otra"
      if (variante === "orden") f.censo.personas.reverse()
      expect(ejecutar(f, api)._tag).toBe("Failure")
    })
  }
  it(`${api}: alquiler ajeno exige identificar la vivienda comprada`, () => {
    const original = casos.find(
      (c) => c.id === "union-exclusiva-conflicto-2000"
    )
    const f = structuredClone(original.entrada)
    delete f.solicitudMadrid.hechos.viviendas[0].id
    expect(ejecutar(f, api)._tag).toBe("Failure")
  })
}
