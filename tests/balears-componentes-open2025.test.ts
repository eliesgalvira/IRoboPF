import { DateTime, Effect, Schema } from "effect"
import Decimal from "decimal.js"
import { expect, it } from "vitest"
import muestra from "../docs/procedencia/simuladores/medicion-2025/casos.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { esAmbitoCuotasTerritorialesOpen2025 } from "../lib/dominio/irpf/cuotas/politica-cuotas-open-2025"

const original = muestra.casos.find(c => c.id === "open2025-illes-balears-02")
const entrada = () => {
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(original?.entradaAPI)
  if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw new Error("Expediente salarial requerido")
  return c
}
const calcular = (c: CasoFiscalAnualExplicito) => Effect.runSync(liquidarIrpfAnualExplicito(c))

it("reproduce componentes y resultado del PDF balear, sin ajuste al diferencial", () => {
  const r = calcular(entrada())
  expect(r.componentesCuota).toMatchObject({gravamenEstatal:"5264.63",gravamenAutonomico:"5273.13",gravamenMinimoEstatal:"527.25",gravamenMinimoAutonomico:"499.5",cuotaEstatal:"4737.38",cuotaAutonomica:"4773.63"})
  expect(r.cuotaPosterior).toBe("9511.01")
  expect(r.cuotaDiferencialPresentada).toBe("1011.01")
  expect(new Decimal(r.cuotaPosterior).minus(r.retenciones).eq(r.cuotaDiferencial)).toBe(true)
  expect(r.rastro.pasos.flatMap(p=>p.lineasCalculo??[]).find(l=>l.origen?.siteId==="anual.explicito.cuota.estatal")?.formula).toContain("5264.63 − 527.25")
})

it("las retenciones cambian sólo el pago final", () => {
  const c=entrada(), a=calcular(c), b=calcular({...c,retenciones:[]})
  expect(b.componentesCuota).toEqual(a.componentesCuota)
  expect(b.cuotaPosterior).toBe(a.cuotaPosterior)
  expect(new Decimal(b.cuotaDiferencial).minus(a.cuotaDiferencial).eq("8500")).toBe(true)
})

it("la pensión conserva la ruta decimal anterior", () => {
  const c=entrada()
  const pension=Schema.decodeUnknownSync(CasoFiscalAnualExplicito)({...c,trabajo:{...c.trabajo,rendimientos:c.trabajo.rendimientos.map(r=>({...r,clase:"pension"}))}})
  const r=calcular(pension)
  expect(r.componentesCuota.gravamenEstatal).toBe("5264.625")
  expect(r.componentesCuota.gravamenAutonomico).toBe("5273.125")
})

it("la extensión territorial mantiene año y fallecimiento como fronteras", () => {
  expect(esAmbitoCuotasTerritorialesOpen2025({anio:2025,comunidadAutonoma:"illes-balears"})).toBe(true)
  expect(esAmbitoCuotasTerritorialesOpen2025({anio:2024,comunidadAutonoma:"illes-balears"})).toBe(false)
  expect(esAmbitoCuotasTerritorialesOpen2025({anio:2025,comunidadAutonoma:"illes-balears",fechaFallecimiento:DateTime.toDateUtc(DateTime.makeUnsafe("2025-12-01T00:00:00Z"))})).toBe(false)
})
