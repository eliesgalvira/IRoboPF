import ExcelJS from "exceljs"

import type { SalaryRangeAudit } from "@/lib/domain/progressivity"

const centsToEuros = (cents: number) => cents / 100

const percent = (value: number) => Number((value * 100).toFixed(2))

const downloadWorkbook = async (workbook: ExcelJS.Workbook, filename: string) => {
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const styleHeader = (worksheet: ExcelJS.Worksheet) => {
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  }
  worksheet.columns.forEach((column) => {
    column.width = Math.max(column.header?.toString().length ?? 12, 16)
  })
}

export const exportEducationalAuditExcel = async (audit: SalaryRangeAudit) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "IRoboPF"
  workbook.created = new Date()

  const summary = workbook.addWorksheet("MANUAL_AUDITORIA")
  summary.columns = [
    { header: "Concepto", key: "concept" },
    { header: "Explicacion", key: "explanation", width: 72 },
  ]
  summary.addRows([
    {
      concept: "Periodo comparado",
      explanation: `${audit.comparedYear} frente a ${audit.referenceYear}, siempre ajustado por IPC.`,
    },
    {
      concept: "Rango salarial",
      explanation: `${centsToEuros(audit.minGrossAnnualCents).toLocaleString("es-ES")} EUR - ${centsToEuros(audit.maxGrossAnnualCents).toLocaleString("es-ES")} EUR`,
    },
    {
      concept: "Lectura del signo",
      explanation:
        "Una perdida positiva significa que el año comparado dejaba mas salario neto real que la legislacion actual.",
    },
  ])
  styleHeader(summary)

  const findings = workbook.addWorksheet("HALLAZGOS")
  findings.columns = [
    { header: "Hallazgo", key: "title", width: 34 },
    { header: "Salario bruto 2026", key: "salary", width: 20 },
    { header: "Severidad", key: "severity", width: 14 },
    { header: "Explicacion", key: "description", width: 82 },
  ]
  findings.addRows(
    audit.findings.map((finding) => ({
      title: finding.title,
      salary: centsToEuros(finding.salaryGrossAnnualCents),
      severity: finding.severity,
      description: finding.description,
    })),
  )
  styleHeader(findings)

  const data = workbook.addWorksheet("EXPLORACION_RANGO")
  data.columns = [
    { header: "Salario bruto 2026", key: "gross" },
    { header: `Bruto nominal ${audit.comparedYear}`, key: "nominal" },
    { header: `Neto ${audit.comparedYear} ajustado`, key: "comparedNet" },
    { header: `Neto ${audit.referenceYear}`, key: "referenceNet" },
    { header: "Perdida/Ganancia anual", key: "delta" },
    { header: "Carga bruto actual %", key: "currentBurden" },
    { header: "Carga bruto comparada %", key: "comparedBurden" },
    { header: "Cuna fiscal actual %", key: "currentWedge" },
    { header: "Cuna fiscal comparada %", key: "comparedWedge" },
  ]
  data.addRows(
    audit.points.map((point) => ({
      gross: centsToEuros(point.grossAnnualCents),
      nominal: centsToEuros(point.comparison.compared.nominalGrossAnnualCents),
      comparedNet: centsToEuros(point.comparison.compared.adjusted.salaryNetAnnualCents),
      referenceNet: centsToEuros(point.comparison.reference.salaryNetAnnualCents),
      delta: centsToEuros(point.comparison.netPurchasingPowerDeltaAnnualCents),
      currentBurden: percent(point.currentBurdenRate),
      comparedBurden: percent(point.comparedBurdenRate),
      currentWedge: percent(point.currentLaborWedgeRate),
      comparedWedge: percent(point.comparedLaborWedgeRate),
    })),
  )
  styleHeader(data)

  await downloadWorkbook(
    workbook,
    `IRoboPF_Auditoria_Educativa_${audit.comparedYear}_${audit.referenceYear}.xlsx`,
  )
}

export const exportCompatibleAuditExcel = async (audit: SalaryRangeAudit) => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "IRoboPF"
  workbook.created = new Date()

  const comparative = workbook.addWorksheet("COMPARATIVA_INFLACION")
  comparative.columns = [
    { header: "Año a Comparar", key: "year" },
    { header: "Salario Equivalente (2026)", key: "gross" },
    { header: "Multiplicador IPC Acum.", key: "factor" },
    { header: "IPC Acumulado (%)", key: "ipc" },
    { header: "Salario Bruto Nominal", key: "nominal" },
    { header: "Coste Lab. (Euros 2026)", key: "laborCost" },
    { header: "SS Tra. (Euros 2026)", key: "workerContribution" },
    { header: "IRPF (Euros 2026)", key: "irpf" },
    { header: "Neto Real en su Año", key: "comparedNet" },
    { header: "Neto Real en 2026", key: "referenceNet" },
    { header: "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)", key: "monthly" },
    { header: "Pérdida/Ganancia Anual Poder Adq.", key: "annual" },
  ]
  comparative.addRows(
    audit.points.map((point) => {
      const factor = Number(point.comparison.inflationFactor)
      return {
        year: audit.comparedYear,
        gross: centsToEuros(point.grossAnnualCents),
        factor: Number(factor.toFixed(4)),
        ipc: `${((factor - 1) * 100).toFixed(2)}%`,
        nominal: centsToEuros(point.comparison.compared.nominalGrossAnnualCents),
        laborCost: centsToEuros(point.comparison.compared.adjusted.laborCostCents),
        workerContribution: centsToEuros(point.comparison.compared.adjusted.workerContributionCents),
        irpf: centsToEuros(point.comparison.compared.adjusted.irpfFinalCents),
        comparedNet: centsToEuros(point.comparison.compared.adjusted.salaryNetAnnualCents),
        referenceNet: centsToEuros(point.comparison.reference.salaryNetAnnualCents),
        monthly: centsToEuros(point.comparison.netPurchasingPowerDeltaMonthlyCents),
        annual: centsToEuros(point.comparison.netPurchasingPowerDeltaAnnualCents),
      }
    }),
  )
  styleHeader(comparative)

  await downloadWorkbook(
    workbook,
    `IRoboPF_Compatible_${audit.comparedYear}_${audit.referenceYear}.xlsx`,
  )
}
