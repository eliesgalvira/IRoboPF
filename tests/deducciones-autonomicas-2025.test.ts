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

    expect(codigosFaltantes).toHaveLength(181)
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

    expect(deduccionesPorCodigo.get("clm_familia_monoparental")).toMatchObject({
      estado: "catalogada",
      nombre: "Por familia monoparental",
      comunidad: "castilla-la-mancha",
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

  it("expone las 170 deducciones catalogadas de 2025 como implementadas", () => {
    expect(DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor).toHaveLength(170)
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

  it("mantiene referencia de páginas del manual en todas las fichas implementadas", () => {
    expect(
      DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.filter(
        (deduccion) => deduccion.fuenteManual.paginas.length === 0
      )
    ).toEqual([])
  })

  it("no marca como pendiente la normativa de las fichas implementadas con páginas verificadas", () => {
    const deduccionesPorCodigo = new Map(
      DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS.valor.map((deduccion) => [
        deduccion.codigo,
        deduccion,
      ])
    )

    expect(
      deduccionesPorCodigo.get(
        "andalucia_familia_monoparental_ascendientes_mayores_75"
      )
    ).toMatchObject({
      normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
      fuenteManual: { paginas: [44, 45] },
    })
    expect(
      deduccionesPorCodigo.get("madrid_nacimiento_adopcion_hijos")
    ).toMatchObject({
      normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
      fuenteManual: { paginas: [403, 404] },
    })
    expect(
      deduccionesPorCodigo.get("cataluna_alquiler_victimas_violencia_machista")
    ).toMatchObject({
      normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
      fuenteManual: { paginas: [325, 326] },
    })
    expect(
      deduccionesPorCodigo.get(
        "cataluna_inversion_cooperativas_agrarias_vivienda"
      )
    ).toMatchObject({
      normativa: "Ficha normalizada desde Manual Renta 2025 Parte 2",
      fuenteManual: { paginas: [326, 327, 328] },
    })
  })
})
