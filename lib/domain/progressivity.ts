import Decimal from "decimal.js"
import { Effect } from "effect"

export type FiscalYear =
  | 2012
  | 2013
  | 2014
  | 2015
  | 2016
  | 2017
  | 2018
  | 2019
  | 2020
  | 2021
  | 2022
  | 2023
  | 2024
  | 2025
  | 2026

export interface CompareInflationAdjustedInput {
  readonly referenceGrossAnnualCents: number
  readonly comparedYear: FiscalYear
  readonly referenceYear: FiscalYear
}

export interface LiquidatedBreakdown {
  readonly grossAnnualCents: number
  readonly employerContributionCents: number
  readonly laborCostCents: number
  readonly workerContributionCents: number
  readonly irpfFinalCents: number
  readonly salaryNetAnnualCents: number
}

export interface InflationAdjustedComparison {
  readonly referenceYear: FiscalYear
  readonly comparedYear: FiscalYear
  readonly inflationFactor: string
  readonly reference: LiquidatedBreakdown
  readonly compared: {
    readonly nominalGrossAnnualCents: number
    readonly adjusted: LiquidatedBreakdown
  }
  readonly netPurchasingPowerDeltaAnnualCents: number
  readonly netPurchasingPowerDeltaMonthlyCents: number
}

export interface SalaryRangeAuditInput {
  readonly minGrossAnnualCents: number
  readonly maxGrossAnnualCents: number
  readonly stepCents: number
  readonly comparedYear: FiscalYear
  readonly referenceYear: FiscalYear
}

export interface SalaryRangeAuditPoint {
  readonly grossAnnualCents: number
  readonly comparison: InflationAdjustedComparison
  readonly currentBurdenRate: number
  readonly comparedBurdenRate: number
  readonly currentLaborWedgeRate: number
  readonly comparedLaborWedgeRate: number
}

export interface AuditFinding {
  readonly title: string
  readonly description: string
  readonly salaryGrossAnnualCents: number
  readonly severity: "loss" | "gain" | "info"
}

export interface SalaryRangeAudit {
  readonly comparedYear: FiscalYear
  readonly referenceYear: FiscalYear
  readonly minGrossAnnualCents: number
  readonly maxGrossAnnualCents: number
  readonly stepCents: number
  readonly points: ReadonlyArray<SalaryRangeAuditPoint>
  readonly findings: ReadonlyArray<AuditFinding>
}

export const salaryControlConfig = {
  defaultCents: 1_800_000,
  precise: {
    minCents: 0,
    maxCents: 99_999_999,
    decimals: 2,
    maxIntegerDigits: 6,
  },
  quick: {
    minCents: 1_000_000,
    maxCents: 10_000_000,
    stepCents: 100_000,
  },
} as const

export const auditRangeConfig = {
  defaultMinCents: 1_000_000,
  defaultMaxCents: 6_000_000,
  minCents: 1_000_000,
  maxCents: 10_000_000,
  stepCents: 500_000,
} as const

interface Parameters {
  readonly baseMax: Decimal
  readonly ssTypes: Readonly<Record<string, readonly [Decimal, Decimal]>>
  readonly mei: readonly [Decimal, Decimal]
  readonly solidarity: ReadonlyArray<readonly [Decimal, Decimal]>
  readonly irpfMinimum: Decimal
  readonly withholdingMinimum: Decimal
  readonly fixedExpenses: Decimal
  readonly irpfBrackets: ReadonlyArray<readonly [Decimal, Decimal]>
  readonly workReduction: (previousNetIncome: Decimal) => Decimal
  readonly smiDeduction: (gross: Decimal) => Decimal
}

const d = (value: string | number) => new Decimal(value)

const IPC_ANNUAL_DECEMBER: Readonly<Record<number, Decimal>> = {
  2013: d("0.003"),
  2014: d("-0.010"),
  2015: d("0.000"),
  2016: d("0.016"),
  2017: d("0.011"),
  2018: d("0.012"),
  2019: d("0.008"),
  2020: d("-0.005"),
  2021: d("0.065"),
  2022: d("0.057"),
  2023: d("0.031"),
  2024: d("0.028"),
  2025: d("0.029"),
  2026: d("0.030"),
}

const BASE_MAX: Readonly<Record<FiscalYear, Decimal>> = {
  2012: d("39150.0"),
  2013: d("41108.4"),
  2014: d("43164.0"),
  2015: d("43272.0"),
  2016: d("43704.0"),
  2017: d("45014.4"),
  2018: d("45014.4"),
  2019: d("48841.2"),
  2020: d("48841.2"),
  2021: d("48841.2"),
  2022: d("49672.8"),
  2023: d("53946.0"),
  2024: d("56646.0"),
  2025: d("58914.0"),
  2026: d("61214.4"),
}

const WITHHOLDING_MINIMUM: Readonly<Record<FiscalYear, Decimal>> = {
  2012: d(11162),
  2013: d(11162),
  2014: d(11162),
  2015: d(12000),
  2016: d(12000),
  2017: d(12000),
  2018: d(12643),
  2019: d(14000),
  2020: d(14000),
  2021: d(14000),
  2022: d(14000),
  2023: d(15000),
  2024: d(15876),
  2025: d(15876),
  2026: d(15876),
}

const centsToEuros = (cents: number) => d(cents).div(100)

const eurosToCents = (euros: Decimal) =>
  euros.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_EVEN).toNumber()

const roundMoney = (euros: Decimal) => euros.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)

const min = (a: Decimal, b: Decimal) => (a.lessThan(b) ? a : b)
const max = (a: Decimal, b: Decimal) => (a.greaterThan(b) ? a : b)

const inflationFactor = (baseYear: FiscalYear, referenceYear: FiscalYear) => {
  if (baseYear === referenceYear) {
    return d(1)
  }

  let factor = d(1)
  for (let year = baseYear + 1; year <= referenceYear; year += 1) {
    factor = factor.mul(d(1).plus(IPC_ANNUAL_DECEMBER[year] ?? d(0)))
  }
  return factor
}

const getWorkReduction = (year: FiscalYear) => (previousNetIncome: Decimal) => {
  if (year <= 2014) {
    if (previousNetIncome.lte(9180)) return d(4080)
    if (previousNetIncome.lte(13260)) {
      return d(4080).minus(d("0.35").mul(previousNetIncome.minus(9180)))
    }
    return d(2652)
  }
  if (year <= 2017) {
    if (previousNetIncome.lte(11250)) return d(3700)
    if (previousNetIncome.lte(14450)) {
      return d(3700).minus(d("1.15625").mul(previousNetIncome.minus(11250)))
    }
    return d(0)
  }
  if (year === 2018) {
    const pre = previousNetIncome.lte(11250)
      ? d(3700)
      : previousNetIncome.lte(14450)
        ? d(3700).minus(d("1.15625").mul(previousNetIncome.minus(11250)))
        : d(0)
    const post = previousNetIncome.lte(13115)
      ? d(5565)
      : previousNetIncome.lte(16825)
        ? max(d(0), d(5565).minus(d("1.5").mul(previousNetIncome.minus(13115))))
        : d(0)
    return pre.div(2).plus(post.div(2))
  }
  if (year <= 2022) {
    if (previousNetIncome.lte(13115)) return d(5565)
    if (previousNetIncome.lte(16825)) {
      return max(d(0), d(5565).minus(d("1.5").mul(previousNetIncome.minus(13115))))
    }
    return d(0)
  }
  if (year === 2023) {
    if (previousNetIncome.lte("14047.50")) return d(6498)
    if (previousNetIncome.lte("19747.50")) {
      return max(d(0), d(6498).minus(d("1.14").mul(previousNetIncome.minus("14047.50"))))
    }
    return d(0)
  }
  if (previousNetIncome.lte(14852)) return d(7302)
  if (previousNetIncome.lte("17673.52")) {
    return d(7302).minus(d("1.75").mul(previousNetIncome.minus(14852)))
  }
  if (previousNetIncome.lte("19747.50")) {
    return d("2364.34").minus(d("1.14").mul(previousNetIncome.minus("17673.52")))
  }
  return d(0)
}

const getParameters = (year: FiscalYear): Parameters => {
  const ssTypes = {
    comunes: [d("0.236"), d("0.047")],
    desempleo: [d("0.055"), d("0.0155")],
    fogasa: [d("0.002"), d("0")],
    fp: [d("0.006"), d("0.001")],
    atep: [d("0.015"), d("0")],
  } satisfies Parameters["ssTypes"]

  const mei: readonly [Decimal, Decimal] =
    year === 2023
      ? [d("0.005"), d("0.001")]
      : year === 2024
        ? [d("0.0058"), d("0.0012")]
        : year === 2025
          ? [d("0.0067"), d("0.0013")]
          : year >= 2026
            ? [d("0.0075"), d("0.0015")]
            : [d(0), d(0)]

  const solidarity: Parameters["solidarity"] =
    year === 2025
      ? [
          [d("1.10"), d("0.0092")],
          [d("1.50"), d("0.0100")],
          [d(Infinity), d("0.0117")],
        ]
      : year >= 2026
        ? [
            [d("1.10"), d("0.0115")],
            [d("1.50"), d("0.0125")],
            [d(Infinity), d("0.0146")],
          ]
        : []

  const irpfBrackets: Parameters["irpfBrackets"] =
    year <= 2014
      ? [
          [d(17707), d("0.2475")],
          [d(33007), d("0.30")],
          [d(53407), d("0.40")],
          [d(120000), d("0.47")],
          [d(175000), d("0.49")],
          [d(300000), d("0.51")],
          [d(Infinity), d("0.52")],
        ]
      : year === 2015
        ? [
            [d(12450), d("0.195")],
            [d(20200), d("0.245")],
            [d(34000), d("0.305")],
            [d(60000), d("0.38")],
            [d(Infinity), d("0.46")],
          ]
        : year <= 2020
          ? [
              [d(12450), d("0.19")],
              [d(20200), d("0.24")],
              [d(35200), d("0.30")],
              [d(60000), d("0.37")],
              [d(Infinity), d("0.45")],
            ]
          : [
              [d(12450), d("0.19")],
              [d(20200), d("0.24")],
              [d(35200), d("0.30")],
              [d(60000), d("0.37")],
              [d(300000), d("0.45")],
              [d(Infinity), d("0.47")],
            ]

  return {
    baseMax: BASE_MAX[year],
    ssTypes,
    mei,
    solidarity,
    irpfMinimum: year <= 2014 ? d(5151) : d(5550),
    withholdingMinimum: WITHHOLDING_MINIMUM[year],
    fixedExpenses: year <= 2014 ? d(0) : d(2000),
    irpfBrackets,
    workReduction: getWorkReduction(year),
    smiDeduction: (gross) => {
      if (year === 2026) {
        if (gross.lte(17094)) return d("590.89")
        return max(d(0), d("590.89").minus(d("0.20").mul(gross.minus(17094))))
      }
      if (year === 2025) {
        if (gross.lte(16576)) return d(340)
        if (gross.lte(18276)) return max(d(0), d(340).minus(d("0.20").mul(gross.minus(16576))))
      }
      return d(0)
    },
  }
}

const sumContributionRate = (parameters: Parameters, side: 0 | 1) =>
  Object.values(parameters.ssTypes).reduce((sum, pair) => sum.plus(pair[side]), d(0))

const calculateIrpfQuota = (
  taxableBase: Decimal,
  brackets: ReadonlyArray<readonly [Decimal, Decimal]>,
) => {
  if (taxableBase.lte(0)) return d(0)

  let total = d(0)
  let previousLimit = d(0)
  for (const [limit, rate] of brackets) {
    if (taxableBase.greaterThan(limit)) {
      total = total.plus(limit.minus(previousLimit).mul(rate))
      previousLimit = limit
    } else {
      total = total.plus(taxableBase.minus(previousLimit).mul(rate))
      break
    }
  }
  return total
}

const calculateBreakdownEuros = (gross: Decimal, year: FiscalYear) => {
  const parameters = getParameters(year)
  const contributionBase = min(gross, parameters.baseMax)
  const baseExcess = max(d(0), gross.minus(parameters.baseMax))

  const employerRate = sumContributionRate(parameters, 0).plus(parameters.mei[0])
  const workerRate = sumContributionRate(parameters, 1).plus(parameters.mei[1])

  let employerContribution = contributionBase.mul(employerRate)
  let workerContribution = contributionBase.mul(workerRate)

  if (parameters.solidarity.length > 0 && baseExcess.gt(0)) {
    const firstLimit = parameters.baseMax.mul("0.10")
    const secondLimit = parameters.baseMax.mul("0.50")
    const excess1 = min(baseExcess, firstLimit)
    const excess2 = min(max(d(0), baseExcess.minus(firstLimit)), secondLimit.minus(firstLimit))
    const excess3 = max(d(0), baseExcess.minus(secondLimit))
    const solidarityTotal = excess1
      .mul(parameters.solidarity[0]?.[1] ?? 0)
      .plus(excess2.mul(parameters.solidarity[1]?.[1] ?? 0))
      .plus(excess3.mul(parameters.solidarity[2]?.[1] ?? 0))
    employerContribution = employerContribution.plus(solidarityTotal.mul(5).div(6))
    workerContribution = workerContribution.plus(solidarityTotal.div(6))
  }

  const previousNetIncome = gross.minus(workerContribution)
  const workReduction = parameters.workReduction(previousNetIncome)
  const netIncome = max(d(0), previousNetIncome.minus(parameters.fixedExpenses))
  const taxableBase = max(d(0), netIncome.minus(workReduction))
  const fullQuota = calculateIrpfQuota(taxableBase, parameters.irpfBrackets)
  const personalMinimumQuota = parameters.irpfMinimum.mul(parameters.irpfBrackets[0]?.[1] ?? 0)
  const theoreticalQuota = max(d(0), fullQuota.minus(personalMinimumQuota))
  const afterSmi = max(d(0), theoreticalQuota.minus(parameters.smiDeduction(gross)))
  const withholdingLimit = max(d(0), gross.minus(parameters.withholdingMinimum).mul("0.43"))
  const irpfFinal = min(afterSmi, withholdingLimit)
  const salaryNetAnnual = gross.minus(workerContribution).minus(irpfFinal)

  return {
    grossAnnual: gross,
    employerContribution,
    laborCost: gross.plus(employerContribution),
    workerContribution,
    irpfFinal,
    salaryNetAnnual,
  }
}

const liquidate = (breakdown: ReturnType<typeof calculateBreakdownEuros>): LiquidatedBreakdown => ({
  grossAnnualCents: eurosToCents(roundMoney(breakdown.grossAnnual)),
  employerContributionCents: eurosToCents(roundMoney(breakdown.employerContribution)),
  laborCostCents: eurosToCents(roundMoney(breakdown.laborCost)),
  workerContributionCents: eurosToCents(roundMoney(breakdown.workerContribution)),
  irpfFinalCents: eurosToCents(roundMoney(breakdown.irpfFinal)),
  salaryNetAnnualCents: eurosToCents(roundMoney(breakdown.salaryNetAnnual)),
})

const adjustBreakdown = (
  breakdown: ReturnType<typeof calculateBreakdownEuros>,
  factor: Decimal,
): LiquidatedBreakdown =>
  liquidate({
    grossAnnual: breakdown.grossAnnual.mul(factor),
    employerContribution: breakdown.employerContribution.mul(factor),
    laborCost: breakdown.laborCost.mul(factor),
    workerContribution: breakdown.workerContribution.mul(factor),
    irpfFinal: breakdown.irpfFinal.mul(factor),
    salaryNetAnnual: breakdown.salaryNetAnnual.mul(factor),
  })

export const compareInflationAdjusted = (input: CompareInflationAdjustedInput) =>
  Effect.sync((): InflationAdjustedComparison => {
    const referenceGross = centsToEuros(input.referenceGrossAnnualCents)
    const factor = inflationFactor(input.comparedYear, input.referenceYear)
    const comparedNominalGross = referenceGross.div(factor)

    const reference = liquidate(calculateBreakdownEuros(referenceGross, input.referenceYear))
    const comparedRaw = calculateBreakdownEuros(comparedNominalGross, input.comparedYear)
    const adjusted = adjustBreakdown(comparedRaw, factor)
    const referenceRaw = calculateBreakdownEuros(referenceGross, input.referenceYear)
    const deltaAnnual = eurosToCents(
      roundMoney(comparedRaw.salaryNetAnnual.mul(factor).minus(referenceRaw.salaryNetAnnual)),
    )

    return {
      referenceYear: input.referenceYear,
      comparedYear: input.comparedYear,
      inflationFactor: factor.toFixed(12),
      reference,
      compared: {
        nominalGrossAnnualCents: eurosToCents(roundMoney(comparedNominalGross)),
        adjusted,
      },
      netPurchasingPowerDeltaAnnualCents: deltaAnnual,
      netPurchasingPowerDeltaMonthlyCents: Math.round(deltaAnnual / 12),
    }
  })

const burdenRate = (breakdown: LiquidatedBreakdown) =>
  (breakdown.workerContributionCents + breakdown.irpfFinalCents) / breakdown.grossAnnualCents

const laborWedgeRate = (breakdown: LiquidatedBreakdown) =>
  (breakdown.laborCostCents - breakdown.salaryNetAnnualCents) / breakdown.laborCostCents

const sortByAbsoluteDelta = (points: ReadonlyArray<SalaryRangeAuditPoint>) =>
  [...points].sort(
    (a, b) =>
      Math.abs(b.comparison.netPurchasingPowerDeltaAnnualCents) -
      Math.abs(a.comparison.netPurchasingPowerDeltaAnnualCents),
  )

const buildFindings = (points: ReadonlyArray<SalaryRangeAuditPoint>): ReadonlyArray<AuditFinding> => {
  const mostAffected = sortByAbsoluteDelta(points)[0]
  const biggestBurdenGap = [...points].sort(
    (a, b) =>
      Math.abs(b.currentBurdenRate - b.comparedBurdenRate) -
      Math.abs(a.currentBurdenRate - a.comparedBurdenRate),
  )[0]
  const firstCurrentIrpf = points.find((point) => point.comparison.reference.irpfFinalCents > 0)
  const findings: Array<AuditFinding> = []

  if (mostAffected) {
    const delta = mostAffected.comparison.netPurchasingPowerDeltaAnnualCents
    findings.push({
      title: delta > 0 ? "Mayor pérdida de poder adquisitivo" : "Mayor mejora de poder adquisitivo",
      description:
        delta > 0
          ? "En este salario, la legislación actual deja menos neto real que el año comparado ajustado por IPC."
          : "En este salario, la legislación actual deja más neto real que el año comparado ajustado por IPC.",
      salaryGrossAnnualCents: mostAffected.grossAnnualCents,
      severity: delta > 0 ? "loss" : "gain",
    })
  }

  if (biggestBurdenGap) {
    findings.push({
      title: "Mayor cambio de carga sobre salario bruto",
      description: "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
      salaryGrossAnnualCents: biggestBurdenGap.grossAnnualCents,
      severity:
        biggestBurdenGap.currentBurdenRate > biggestBurdenGap.comparedBurdenRate ? "loss" : "gain",
    })
  }

  if (firstCurrentIrpf) {
    findings.push({
      title: "Primer salario con IRPF final en 2026",
      description: "Marca la entrada visible del IRPF final dentro del rango explorado; por debajo siguen existiendo cotizaciones.",
      salaryGrossAnnualCents: firstCurrentIrpf.grossAnnualCents,
      severity: "info",
    })
  }

  return findings
}

export const auditSalaryRange = (input: SalaryRangeAuditInput) =>
  Effect.gen(function* () {
    const points: Array<SalaryRangeAuditPoint> = []
    for (
      let grossAnnualCents = input.minGrossAnnualCents;
      grossAnnualCents <= input.maxGrossAnnualCents;
      grossAnnualCents += input.stepCents
    ) {
      const comparison = yield* compareInflationAdjusted({
        referenceGrossAnnualCents: grossAnnualCents,
        comparedYear: input.comparedYear,
        referenceYear: input.referenceYear,
      })

      points.push({
        grossAnnualCents,
        comparison,
        currentBurdenRate: burdenRate(comparison.reference),
        comparedBurdenRate: burdenRate(comparison.compared.adjusted),
        currentLaborWedgeRate: laborWedgeRate(comparison.reference),
        comparedLaborWedgeRate: laborWedgeRate(comparison.compared.adjusted),
      })
    }

    return {
      comparedYear: input.comparedYear,
      referenceYear: input.referenceYear,
      minGrossAnnualCents: input.minGrossAnnualCents,
      maxGrossAnnualCents: input.maxGrossAnnualCents,
      stepCents: input.stepCents,
      points,
      findings: buildFindings(points),
    } satisfies SalaryRangeAudit
  })
