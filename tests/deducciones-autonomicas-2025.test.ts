import { describe, expect, it } from "@effect/vitest"

import {
  CATALOGO_DEDUCCIONES_AUTONOMICAS_2025,
  DEDUCCIONES_AUTONOMICAS_2025_IMPLEMENTADAS,
} from "../lib/dominio/normativa/datos/deducciones-autonomicas-2025"

describe("deducciones autonomicas 2025", () => {
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
