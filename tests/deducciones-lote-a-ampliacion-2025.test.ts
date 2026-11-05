import Decimal from "decimal.js"
import { describe, expect, it } from "vitest"
import casos from "./lote-a-ampliacion.fronteras.json"
import {
  evaluarAmpliacionLoteA2025,
  type SolicitudAmpliacionLoteA2025,
} from "../lib/dominio/irpf/deducciones/lote-a-ampliacion-2025"

type PayloadPrueba =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly PayloadPrueba[]
  | { readonly [campo: string]: PayloadPrueba }
function ejecutar(entrada: PayloadPrueba) {
  // SAFETY: se simulan llamadas JS; la función valida primero el Schema completo y rechaza campos sobrantes anidados.
  return evaluarAmpliacionLoteA2025(entrada as SolicitudAmpliacionLoteA2025)
}

describe("Ampliación loteA2025: oráculos documentales por hechos", () => {
  for (const c of casos)
    it(c.nombre, () => {
      const r = ejecutar(c.entrada)
      if (c.exacto === null) {
        expect(r.estado).toBe("no_soportado")
        expect("importeExactoEuros" in r).toBe(false)
        if (r.estado === "no_soportado")
          expect(r.motivo.length).toBeGreaterThan(0)
      } else {
        expect(r.estado, r.estado === "no_soportado" ? r.motivo : "").toBe(
          "calculo_parcial"
        )
        if (r.estado === "calculo_parcial") {
          expect(r.importeExactoEuros).toBe(c.exacto)
          expect(r.importePresentadoCentimos).toBe(c.presentadoCentimos)
          expect(r.codigo).toBe(c.codigo)
          expect(r.aceptacionFiscal).toBe("pendiente")
          expect(r.citas).toEqual(c.citas)
          expect(r.reservas.length).toBeGreaterThan(0)
        }
      }
    })
  it("no cambia la precisión Decimal global", () => {
    const anterior = Decimal.precision
    ejecutar(casos[0].entrada)
    expect(Decimal.precision).toBe(anterior)
  })
})
