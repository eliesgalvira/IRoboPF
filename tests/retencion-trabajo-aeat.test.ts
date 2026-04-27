import { describe, expect, it } from "@effect/vitest"

import {
  calcularRetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

describe("calcularRetencionTrabajoAeat", () => {
  it("mantiene separado el procedimiento de retencion de la liquidacion anual", () => {
    const caso = {
      anio: 2026,
      retribucionAnualCentimos: 30_000_00,
      situacionFamiliar: "general",
      descendientes: 0,
      ascendientes: 0,
      discapacidad: "sin-discapacidad",
    } satisfies CasoRetencionTrabajo

    expect(calcularRetencionTrabajoAeat(caso, { modo: "canonico" })).toEqual({
      _tag: "ResultadoNoSoportado",
      motivo: "Procedimiento de retencion de trabajo AEAT aun no implementado",
      fuenteReconocida: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
      rastro: {
        titulo: "Procedimiento de retencion de trabajo AEAT 2026",
        pasos: [
          {
            _tag: "PasoExplicacion",
            titulo: "Caso de retencion reconocido",
            descripcion:
              "El motor ha recibido rendimientos del trabajo para calcular una retencion a cuenta, no una liquidacion anual del IRPF.",
            fuentes: [
              {
                titulo: "Algoritmo de retenciones 2026",
                referencia:
                  "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
              },
            ],
          },
        ],
      },
    })
  })
})
