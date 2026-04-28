import { describe, expect, it } from "@effect/vitest"

import {
  CATALOGO_DEDUCCIONES_AUTONOMICAS_2025,
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
  DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA,
} from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

describe("deducciones autonomicas 2025", () => {
  it("cataloga las deducciones faltantes de la guía para mostrarlas en la interfaz", () => {
    const deduccionesCatalogadas = Object.values(
      CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor
    ).flatMap((catalogo) => catalogo.deducciones)
    const codigosCatalogados = new Set(
      deduccionesCatalogadas.map((deduccion) => deduccion.codigo)
    )
    const codigosFaltantes = Object.values(
      DEDUCCIONES_AUTONOMICAS_2025_FALTANTES_SEGUN_GUIA
    ).flat()

    expect(codigosFaltantes).toHaveLength(284)
    expect(deduccionesCatalogadas).toHaveLength(351)
    expect(
      codigosFaltantes.every((codigo) => codigosCatalogados.has(codigo))
    ).toBe(true)
  })

  it("mantiene las deducciones faltantes como catalogadas, no implementadas", () => {
    const deduccionesCatalogadas = Object.values(
      CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor
    ).flatMap((catalogo) => catalogo.deducciones)
    const deduccionesPorCodigo = new Map(
      deduccionesCatalogadas.map((deduccion) => [deduccion.codigo, deduccion])
    )

    expect(
      deduccionesPorCodigo.get("andalucia_gastos_educativos")
    ).toMatchObject({
      estado: "catalogada",
      nombre: "Por gastos educativos",
      comunidad: "andalucia",
    })
    expect(
      deduccionesPorCodigo.get(
        "valenciana_dana_danos_materiales_vivienda_habitual"
      )
    ).toMatchObject({
      estado: "catalogada",
      nombre: "Por DANA daños materiales vivienda habitual",
      comunidad: "comunitat-valenciana",
    })
  })

  it("expone las 67 deducciones catalogadas de 2025 como implementadas", () => {
    expect(DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor).toHaveLength(67)
  })

  it("publica como implementadas todas y solo las fichas catalogadas con estado implementada", () => {
    const deduccionesCatalogadas = Object.values(
      CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor
    ).flatMap((catalogo) => catalogo.deducciones)

    const codigosCatalogadosImplementados = deduccionesCatalogadas
      .filter((deduccion) => deduccion.estado === "implementada")
      .map((deduccion) => deduccion.codigo)
      .sort()

    const codigosPublicadosImplementados =
      DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor
        .map((deduccion) => deduccion.codigo)
        .sort()

    expect(codigosPublicadosImplementados).toEqual(
      codigosCatalogadosImplementados
    )
  })
})
