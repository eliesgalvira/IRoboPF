import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularDeduccionesAutonomicasAplicadas,
  obtenerControlDeduccionAutonomica,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
import { DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

describe("deducciones autonómicas aplicadas", () => {
  it.effect(
    "todas las deducciones implementadas tienen control y cálculo de prueba",
    () =>
      Effect.gen(function* () {
        const controles = DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.map(
          obtenerControlDeduccionAutonomica
        )

        expect(controles).not.toContain(null)
        expect(controles).toHaveLength(170)

        yield* Effect.forEach(controles, (control) =>
          Effect.sync(() => {
            if (control === null) {
              throw new Error("Control de deducción inesperadamente ausente")
            }

            const importeCalculado = calcularDeduccionesAutonomicasAplicadas(
              control.entradasPrueba
            )

            expect(importeCalculado, control.codigo).toBeCloseTo(
              control.importeEsperadoPrueba,
              2
            )
            expect(importeCalculado, control.codigo).toBeGreaterThan(0)
          })
        )
      })
  )

  it("suma 200 euros cuando el usuario declara un hijo nacido o adoptado en Andalucía", () => {
    const deduccion = DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.find(
      (candidata) =>
        candidata.codigo === "andalucia_nacimiento_adopcion_acogimiento_menores"
    )

    expect(deduccion).toBeDefined()
    const control = obtenerControlDeduccionAutonomica(deduccion!)

    expect(control).toMatchObject({
      tipo: "especifico",
      importeEsperadoPrueba: 200,
    })
    expect(
      calcularDeduccionesAutonomicasAplicadas(control!.entradasPrueba)
    ).toBe(200)
  })
})
