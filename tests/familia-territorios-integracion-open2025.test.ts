import oraculos from "./familia-cuantizacion-open2025.oraculos.json"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion"
import { CasoFiscalAnualExplicitoBase } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { esAmbitoCuotasTerritorialesOpen2025 } from "../lib/dominio/irpf/cuotas/politica-cuotas-open-2025"

// Integraci\u00F3n de ambas pol\u00EDticas: requiere tambi\u00E9n la extensi\u00F3n territorial balear.
// No es nueva evidencia de compatibilidad general de ese territorio.
const { vectores } = Schema.decodeUnknownSync(Schema.Struct({
  vectores: Schema.Array(Schema.Struct({ id: Schema.String, entrada: Schema.Unknown })),
}))(oraculos)
function caso(id: string) {
  const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicitoBase)(vectores.find(v => v.id === id)!.entrada)
  if (c.perfil !== "solo-trabajo" || c.ejercicio !== 2025) throw Error("Control laboral requerido")
  return c
}
const calcular = (c: ReturnType<typeof caso>) => Effect.runSync(liquidarIrpfAnualExplicito(c))
const descripcion = (r: Awaited<ReturnType<typeof calcular>>) => r.rastro.pasos.find(p => p.titulo === "Bases, cuotas y pagos anuales")!

it("separaci\u00F3n simult\u00E1nea: Baleares sin derechos, Andaluc\u00EDa familiar y Baleares con derechos", () => {
  const a = caso("open2025-andalucia-11"), can = caso("open2025-canarias-02")
  const b = { ...can, comunidadAutonoma: "illes-balears" as const, derechosMinimos: undefined, familiaresConDerechoMinimo: "ninguno" as const }
  const bf = { ...a, comunidadAutonoma: "illes-balears" as const, derechosMinimos: { ...a.derechosMinimos!, territorio: "illes-balears" as const } }
  expect(esAmbitoCuotasTerritorialesOpen2025({ anio: 2025, comunidadAutonoma: b.comunidadAutonoma })).toBe(true)
  expect(esAmbitoCuotasTerritorialesOpen2025({ anio: 2025, comunidadAutonoma: bf.comunidadAutonoma, derechosMinimos: bf.derechosMinimos })).toBe(false)
  const rb = calcular(b), ra = calcular(a), rf = calcular(bf)
  expect(rb.componentesCuota).toMatchObject({ gravamenEstatal: "5264.63", gravamenAutonomico: "5273.13",
    gravamenMinimoEstatal: "527.25", gravamenMinimoAutonomico: "499.5", cuotaEstatal: "4737.38", cuotaAutonomica: "4773.63" })
  expect(rb.cuotaDiferencialPresentada).toBe("1011.01")
  expect(descripcion(rb).descripcion).toContain("sin derechos familiares")
  expect(descripcion(rb).descripcion).toContain("expediente balear N80")
  expect(descripcion(rb).descripcion).not.toContain("Familia ordinaria 2025")
  expect(descripcion(ra).descripcion).toContain("Familia ordinaria 2025")
  expect(descripcion(ra).descripcion).not.toContain("sin derechos familiares")
  expect(ra.cuotaDiferencialPresentada).toBe("429.22")
  expect(descripcion(rf).descripcion).toContain("Precisi\u00F3n decimal hasta salida")
  expect(descripcion(rf).descripcion).not.toContain("sin derechos familiares")
  expect(descripcion(rf).descripcion).not.toContain("Familia ordinaria 2025")
  for (const r of [rb, rf]) expect(descripcion(r).fuentes?.some(f => f.referencia.endsWith("FAMILIA-CUANTIZACION.md"))).toBe(false)
})

it("Madrid sin familia conserva cuantizaci\u00F3n salarial de art20 y DA61", () => {
  const c = caso("open2025-madrid-03")
  const bajo = { ...c, derechosMinimos: undefined, familiaresConDerechoMinimo: "ninguno" as const, retenciones: [],
    trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(r => ({ ...r, integro: "17000.01",
      cotizaciones: { ...r.cotizaciones, seguridadSocial: "1000.00", derechosPasivos: "0", colegiosHuerfanos: "0" } })) } }
  const r = calcular(bajo)
  expect(r.reduccionArt20).toBe("5292.98")
  expect(r.deduccionTrabajo).toBe("255.2")
  expect(descripcion(r).descripcion).toContain("Empleo Madrid 2025: art\u00EDculo 20")
  expect(descripcion(r).descripcion).not.toContain("Familia ordinaria 2025")
})

it("identidad externa distinta no llega a pol\u00EDtica familiar; control expl\u00EDcito coincidente s\u00ED", () => {
  const c = caso("open2025-andalucia-11")
  expect(descripcion(calcular({ ...c, contribuyenteId: "s-1" })).descripcion).toContain("Familia ordinaria 2025")
  const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito({ ...c, contribuyenteId: "s-99" })))
  // La identidad es exclusi\u00F3n del selector; si el perfil contin\u00FAa, exige \u00E9xito
  // y rastro decimal. No se da por v\u00E1lido cualquier Failure del canal tipado.
  if (Result.isFailure(r)) throw Error("Se esperaba conservar el perfil previo sin selecci\u00F3n familiar")
  expect(descripcion(r.success).descripcion).toContain("Precisi\u00F3n decimal hasta salida")
  expect(descripcion(r.success).descripcion).not.toContain("Familia ordinaria 2025")
})
