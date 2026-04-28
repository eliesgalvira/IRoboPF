import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularRetencionTrabajoAeat,
  RetencionTrabajoAeat,
  type CasoRetencionTrabajo,
} from "../lib/dominio/irpf/retenciones/retencion-trabajo-aeat"

describe("calcularRetencionTrabajoAeat", () => {
  it.effect("expone el procedimiento de retencion como servicio Effect", () =>
    Effect.gen(function* () {
      const caso = casoRetencionBasico()
      const retencion = yield* RetencionTrabajoAeat

      const error = yield* retencion
        .calcular(caso, { modo: "canonico" })
        .pipe(Effect.flip)

      expect(error._tag).toBe("ResultadoNoSoportado")
      expect(error.rastro.titulo).toBe(
        "Procedimiento de retencion de trabajo AEAT 2026"
      )
    }).pipe(Effect.provide(RetencionTrabajoAeat.layer))
  )

  it.effect(
    "mantiene separado el procedimiento de retencion de la liquidacion anual",
    () =>
      Effect.gen(function* () {
        const caso = casoRetencionBasico()

        const error = yield* calcularRetencionTrabajoAeat(caso, {
          modo: "canonico",
        }).pipe(Effect.flip)

        expect(error).toEqual({
          _tag: "ResultadoNoSoportado",
          motivo:
            "Procedimiento de retencion de trabajo AEAT aun no implementado",
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
  )
})

const casoRetencionBasico = (): CasoRetencionTrabajo => {
  const caso = {
    anio: 2026,
    retribucionAnualCentimos: 30_000_00,
    situacionFamiliar: "general",
    descendientes: 0,
    ascendientes: 0,
    discapacidad: "sin-discapacidad",
  } satisfies CasoRetencionTrabajo

  return caso
}
