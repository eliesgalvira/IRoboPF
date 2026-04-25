import type ExcelJS from "exceljs"
import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import { auditSalaryRange } from "../lib/domain/progressivity"
import { buildCompatibleAuditWorkbook } from "../lib/export/audit-excel"

const rowValues = (worksheet: ExcelJS.Worksheet, rowNumber: number) => {
  const row = worksheet.getRow(rowNumber)
  return globalThis.Array.from(
    { length: worksheet.columnCount },
    (_, index) => row.getCell(index + 1).value
  )
}

describe("buildCompatibleAuditWorkbook", () => {
  it.effect("keeps the legacy inflation comparison columns in order", () =>
    Effect.gen(function* () {
      const audit = yield* auditSalaryRange({
        minGrossAnnualCents: 1_000_000,
        maxGrossAnnualCents: 1_000_000,
        stepCents: 500_000,
        comparedYear: 2012,
        referenceYear: 2026,
      })

      const workbook = buildCompatibleAuditWorkbook(audit)
      const worksheet = workbook.getWorksheet("COMPARATIVA_INFLACION")
      expect(worksheet).toBeDefined()

      if (worksheet === undefined) {
        return
      }

      expect(rowValues(worksheet, 1)).toEqual([
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

      expect(rowValues(worksheet, 2)[6]).toBe(
        audit.points[0].comparison.compared.adjusted.employerContributionCents /
          100
      )
    })
  )
})
