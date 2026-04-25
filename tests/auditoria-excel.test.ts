import type ExcelJS from "exceljs"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { auditarRangoSalarial } from "../lib/domain/progresividad"
import { construirLibroAuditoriaCompatible } from "../lib/export/auditoria-excel"

const valoresFila = (hoja: ExcelJS.Worksheet, numeroFila: number) => {
  const fila = hoja.getRow(numeroFila)
  return globalThis.Array.from(
    { length: hoja.columnCount },
    (_, indice) => fila.getCell(indice + 1).value
  )
}

describe("construirLibroAuditoriaCompatible", () => {
  it.effect(
    "mantiene las columnas legacy de comparacion por inflacion en orden",
    () =>
      Effect.gen(function* () {
        const auditoria = yield* auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: 1_000_000,
          salarioBrutoAnualMaximoCentimos: 1_000_000,
          pasoCentimos: 500_000,
          anioComparado: 2012,
          anioReferencia: 2026,
        })

        const libro = construirLibroAuditoriaCompatible(auditoria)
        const hoja = libro.getWorksheet("COMPARATIVA_INFLACION")
        expect(hoja).toBeDefined()

        if (hoja === undefined) {
          return
        }

        expect(valoresFila(hoja, 1)).toEqual([
          "Año a Comparar",
          "Salario Equivalente (2026)",
          "Multiplicador IPC Acum.",
          "IPC Acumulado (%)",
          "Salario Bruto Nominal",
          "Coste Lab. (Euros 2026)",
          "SS Emp. (Euros 2026)",
          "SS Tra. (Euros 2026)",
          "IRPF (Euros 2026)",
          "Neto Real en su Año",
          "Neto Real en 2026",
          "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)",
          "Pérdida/Ganancia Anual Poder Adq.",
        ])

        expect(valoresFila(hoja, 2)[6]).toBe(
          auditoria.puntos[0].comparacion.comparado.ajustado
            .cotizacionEmpresarialCentimos / 100
        )
      })
  )
})
