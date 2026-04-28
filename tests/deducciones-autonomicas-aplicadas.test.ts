import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  calcularDeduccionesAutonomicasAplicadas,
  DEDUCCIONES_ESPECIFICAS_AUTONOMICAS_2025,
  obtenerControlDeduccionAutonomica,
} from "../lib/dominio/irpf/deducciones-autonomicas-aplicadas"
import { DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS } from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

describe("deducciones autonómicas aplicadas", () => {
  it("organiza el bloque final por comunidad para inspección y extensión", () => {
    expect(
      DEDUCCIONES_ESPECIFICAS_AUTONOMICAS_2025.madrid.map(
        (deduccion) => deduccion.codigo
      )
    ).toEqual([
      "madrid_nacimiento_adopcion_hijos",
      "madrid_adopcion_internacional",
      "madrid_acogimiento_familiar_menores",
      "madrid_acogimiento_mayores_65_discapacidad",
      "madrid_cuidado_ascendientes",
      "madrid_gastos_arrendamiento_viviendas",
      "madrid_arrendamiento_viviendas_vacias",
      "madrid_donativos_fundaciones_clubes_deportivos",
      "madrid_incremento_costes_financiacion_vivienda",
      "madrid_cambio_residencia_municipio_despoblacion",
      "madrid_vivienda_municipios_despoblacion",
      "madrid_cuidado_hijos_mayores_dependientes_discapacidad",
      "madrid_intereses_vivienda_jovenes_menores_30",
      "madrid_intereses_estudios_grado_master_doctorado",
      "madrid_vivienda_nacimiento_adopcion_hijos",
      "madrid_condicion_familia_numerosa",
      "madrid_familias_dos_descendientes_ingresos_reducidos",
      "madrid_inversion_entidades_nuevas_reciente_creacion",
      "madrid_autoempleo_jovenes_menores_35",
      "madrid_inversiones_mercado_alternativo_bursatil",
      "madrid_inversiones_nuevos_contribuyentes_extranjero",
    ])
  })

  it.effect(
    "todas las deducciones implementadas tienen control y cálculo de prueba",
    () =>
      Effect.gen(function* () {
        const controles = DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.map(
          obtenerControlDeduccionAutonomica
        )

        expect(controles).not.toContain(null)
        expect(controles).toHaveLength(351)

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
