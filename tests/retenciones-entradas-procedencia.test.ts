import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"
import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

const base: CasoRetencionTrabajo = {
  anio: 2026,
  edad: 40,
  retribucionAnualCentimos: 3_000_000,
  cotizacionesCentimos: 114_300,
  situacionFamiliar: "situacion3",
  situacionLaboral: "activo",
  contrato: "general",
  descendientes: [],
  ascendientes: [],
  discapacidad: "sin-discapacidad",
}
const ejecutar = (caso: CasoRetencionTrabajo) =>
  Effect.runSyncExit(calcularRetencionTrabajoAeat(caso, { modo: "canonico" }))
describe("RET20-008: nunca devolver Success con importes no finitos", () => {
  it.each([0, -1, 1.5])("rechaza divisor de convivencia %s", (convivencia) => {
    expect(
      ejecutar({
        ...base,
        ascendientes: [
          {
            edad: 70,
            convivencia,
            discapacidad: "sin-discapacidad",
            movilidadReducida: false,
          },
        ],
      })._tag
    ).toBe("Failure")
  })
  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    "rechaza retribución no finita %s",
    (retribucionAnualCentimos) => {
      expect(ejecutar({ ...base, retribucionAnualCentimos })._tag).toBe(
        "Failure"
      )
    }
  )
  it("conserva el divisor uno como control", () => {
    const r = ejecutar({
      ...base,
      ascendientes: [
        {
          edad: 70,
          convivencia: 1,
          discapacidad: "sin-discapacidad",
          movilidadReducida: false,
        },
      ],
    })
    expect(r._tag).toBe("Success")
    if (r._tag === "Success")
      expect(Number.isFinite(r.value.importeRetencionAnualCentimos)).toBe(true)
  })
})
