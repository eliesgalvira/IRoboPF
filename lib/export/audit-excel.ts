import ExcelJS from "exceljs"

import type {
  AuditFinding,
  SalaryRangeAudit,
  SalaryRangeAuditPoint,
} from "@/lib/domain/progressivity"

const centsToEuros = (cents: number) => cents / 100

const percent = (value: number) => Number((value * 100).toFixed(2))

const createWorkbook = () => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "IRoboPF"
  workbook.created = new Date()
  return workbook
}

const downloadWorkbook = async (
  workbook: ExcelJS.Workbook,
  filename: string
) => {
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

const headerText = (header: unknown) => {
  if (header === undefined) {
    return ""
  }

  if (header === null) {
    return ""
  }

  if (globalThis.Array.isArray(header)) {
    return header.join(" ")
  }

  return header.toString()
}

const styleHeader = (worksheet: ExcelJS.Worksheet) => {
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  }
  worksheet.columns.forEach((column) => {
    column.width = Math.max(headerText(column.header).length, 16)
  })
}

const addManualWorksheet = (
  workbook: ExcelJS.Workbook,
  audit: SalaryRangeAudit
) => {
  const worksheet = workbook.addWorksheet("MANUAL_AUDITORIA")
  worksheet.columns = [
    { header: "Concepto", key: "concept" },
    { header: "Explicacion", key: "explanation", width: 72 },
  ]
  worksheet.addRows([
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
  styleHeader(worksheet)
}

const findingRow = (finding: AuditFinding) => ({
  title: finding.title,
  salary: centsToEuros(finding.salaryGrossAnnualCents),
  severity: finding.severity,
  description: finding.description,
})

const addFindingsWorksheet = (
  workbook: ExcelJS.Workbook,
  audit: SalaryRangeAudit
) => {
  const worksheet = workbook.addWorksheet("HALLAZGOS")
  worksheet.columns = [
    { header: "Hallazgo", key: "title", width: 34 },
    { header: "Salario bruto 2026", key: "salary", width: 20 },
    { header: "Severidad", key: "severity", width: 14 },
    { header: "Explicacion", key: "description", width: 82 },
  ]
  worksheet.addRows(audit.findings.map(findingRow))
  styleHeader(worksheet)
}

const educationalExplorationRow = (point: SalaryRangeAuditPoint) => ({
  gross: centsToEuros(point.grossAnnualCents),
  nominal: centsToEuros(point.comparison.compared.nominalGrossAnnualCents),
  comparedNet: centsToEuros(
    point.comparison.compared.adjusted.salaryNetAnnualCents
  ),
  referenceNet: centsToEuros(point.comparison.reference.salaryNetAnnualCents),
  delta: centsToEuros(point.comparison.netPurchasingPowerDeltaAnnualCents),
  currentBurden: percent(point.currentBurdenRate),
  comparedBurden: percent(point.comparedBurdenRate),
  currentWedge: percent(point.currentLaborWedgeRate),
  comparedWedge: percent(point.comparedLaborWedgeRate),
})

const addExplorationWorksheet = (
  workbook: ExcelJS.Workbook,
  audit: SalaryRangeAudit
) => {
  const worksheet = workbook.addWorksheet("EXPLORACION_RANGO")
  worksheet.columns = [
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
  worksheet.addRows(audit.points.map(educationalExplorationRow))
  styleHeader(worksheet)
}

export const buildEducationalAuditWorkbook = (audit: SalaryRangeAudit) => {
  const workbook = createWorkbook()
  addManualWorksheet(workbook, audit)
  addFindingsWorksheet(workbook, audit)
  addExplorationWorksheet(workbook, audit)
  return workbook
}

export const exportEducationalAuditExcel = async (audit: SalaryRangeAudit) => {
  await downloadWorkbook(
    buildEducationalAuditWorkbook(audit),
    `IRoboPF_Auditoria_Educativa_${audit.comparedYear}_${audit.referenceYear}.xlsx`
  )
}

const compatibleAuditRow =
  (audit: SalaryRangeAudit) => (point: SalaryRangeAuditPoint) => {
    const factor = Number(point.comparison.inflationFactor)

    return {
      year: audit.comparedYear,
      gross: centsToEuros(point.grossAnnualCents),
      factor: Number(factor.toFixed(4)),
      ipc: `${((factor - 1) * 100).toFixed(2)}%`,
      nominal: centsToEuros(point.comparison.compared.nominalGrossAnnualCents),
      laborCost: centsToEuros(
        point.comparison.compared.adjusted.laborCostCents
      ),
      employerContribution: centsToEuros(
        point.comparison.compared.adjusted.employerContributionCents
      ),
      workerContribution: centsToEuros(
        point.comparison.compared.adjusted.workerContributionCents
      ),
      irpf: centsToEuros(point.comparison.compared.adjusted.irpfFinalCents),
      comparedNet: centsToEuros(
        point.comparison.compared.adjusted.salaryNetAnnualCents
      ),
      referenceNet: centsToEuros(
        point.comparison.reference.salaryNetAnnualCents
      ),
      monthly: centsToEuros(
        point.comparison.netPurchasingPowerDeltaMonthlyCents
      ),
      annual: centsToEuros(point.comparison.netPurchasingPowerDeltaAnnualCents),
    }
  }

const addCompatibleComparisonWorksheet = (
  workbook: ExcelJS.Workbook,
  audit: SalaryRangeAudit
) => {
  const worksheet = workbook.addWorksheet("COMPARATIVA_INFLACION")
  worksheet.columns = [
    { header: "Año a Comparar", key: "year" },
    { header: "Salario Equivalente (2026)", key: "gross" },
    { header: "Multiplicador IPC Acum.", key: "factor" },
    { header: "IPC Acumulado (%)", key: "ipc" },
    { header: "Salario Bruto Nominal", key: "nominal" },
    { header: "Coste Lab. (Euros 2026)", key: "laborCost" },
    { header: "SS Emp. (Euros 2026)", key: "employerContribution" },
    { header: "SS Tra. (Euros 2026)", key: "workerContribution" },
    { header: "IRPF (Euros 2026)", key: "irpf" },
    { header: "Neto Real en su Año", key: "comparedNet" },
    { header: "Neto Real en 2026", key: "referenceNet" },
    {
      header: "Variación Poder Adquisitivo Mensual vs 2026 (12 pagas)",
      key: "monthly",
    },
    { header: "Pérdida/Ganancia Anual Poder Adq.", key: "annual" },
  ]
  worksheet.addRows(audit.points.map(compatibleAuditRow(audit)))
  styleHeader(worksheet)
}

export const buildCompatibleAuditWorkbook = (audit: SalaryRangeAudit) => {
  const workbook = createWorkbook()
  addCompatibleComparisonWorksheet(workbook, audit)
  return workbook
}

export const exportCompatibleAuditExcel = async (audit: SalaryRangeAudit) => {
  await downloadWorkbook(
    buildCompatibleAuditWorkbook(audit),
    `IRoboPF_Compatible_${audit.comparedYear}_${audit.referenceYear}.xlsx`
  )
}
