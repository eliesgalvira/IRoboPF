import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { expect, it } from "vitest"
import documento from "../docs/procedencia/simuladores/medicion-2025/casos.json"
import { liquidarIrpfAnualExplicito } from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { validarDerechosMinimos, calcularDerechosMinimos } from "../lib/dominio/irpf/minimos/derechos"
import { MINIMOS_ESTATALES_2025 } from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"

// Resultados originales de Open: ninguna entrada se adapta al cálculo del motor.
const oficiales = [
  ["open2025-comunitat-valenciana-01", "377.95"],
  ["open2025-canarias-02", "226.80"],
  ["open2025-aragon-03", "370.04"],
  ["open2025-castilla-y-leon-04", "161.25"],
] as const
for (const [id, esperado] of oficiales) {
  const original = documento.casos.find(c => c.id === id)?.entradaAPI
  const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(original, { onExcessProperty: "error" })
  if (entrada.perfil !== "solo-trabajo" || entrada.derechosMinimos === undefined)
    throw new Error("Falta el perfil documental de ascendientes")
  it(id + ": contraste con diferencial oficial y diferencia pendiente explícita", () => {
    const r = Effect.runSync(liquidarIrpfAnualExplicito(entrada))
    // Canarias conserva un céntimo pendiente de las etapas de redondeo. Este
    // caso no cuenta como igualdad; el esperado Open permanece en 226,80.
    const diferencia = new Decimal(r.cuotaDiferencialPresentada).minus(esperado)
    expect(diferencia.toFixed(2)).toBe(id === "open2025-canarias-02" ? "-0.01" : "0.00")
  })
  if (entrada.comunidadAutonoma !== "comunitat-valenciana") {
    it(id + ": no amplía el consumidor general de mínimos", () => {
      const h = entrada.derechosMinimos!
      expect(Result.isFailure(Effect.runSync(Effect.result(validarDerechosMinimos(h))))).toBe(true)
      expect(Result.isFailure(Effect.runSync(Effect.result(calcularDerechosMinimos(h, MINIMOS_ESTATALES_2025))))).toBe(true)
    })
    it(id + ": conserva la conciliación de la economía del titular", () => {
      const copia = structuredClone(original)
      if (copia?.derechosMinimos === undefined || !Array.isArray(copia.derechosMinimos.ascendientes)) throw new Error("Censo ausente")
      const a = copia.derechosMinimos.ascendientes[0]!
      const t = a.titulares[0]!
      if (t.economia.perfil !== "solo-trabajo") throw new Error("Economía ausente")
      t.economia.trabajo.rendimientos[0]!.integro = "1.00"
      const e = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(copia)
      const r = Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))
      expect(Result.isFailure(r)).toBe(true)
      if (Result.isFailure(r)) expect(r.failure).toMatchObject({ motivo: expect.stringContaining("no concilia") })
    })
  }
}

it("el permiso anual conserva la reserva de otros censos y territorios", () => {
  const original = documento.casos.find(c => c.id === "open2025-canarias-02")?.entradaAPI
  const entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(original)
  const h = entrada.derechosMinimos
  if (h === undefined || h.ascendientes === "ninguno") throw new Error("Falta censo")
  const primero = h.ascendientes[0]
  if (primero === undefined) throw new Error("Falta ascendiente")
  for (const cambio of [
    { territorio: "murcia" as const },
    { ejercicio: 2024 as const, devengo: "2024-12-31" },
    { ascendientes: [{ ...primero, gradoDiscapacidad: 33 }] },
    { ascendientes: [{ ...primero, declaracion: "individual" as const }] },
    { ascendientes: [primero, { ...primero, sujetoId: "s-91" }] },
  ]) {
    const r = Effect.runSync(Effect.result(validarDerechosMinimos(
      { ...h, ...cambio }, "anual-trabajo-efectivo-2025"
    )))
    expect(Result.isFailure(r)).toBe(true)
  }
})
