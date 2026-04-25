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

const d = (value: string | number) => new Decimal(value)
const ZERO = d(0)
const ONE = d(1)

type ContributionSide = "employer" | "worker"
type IrpfBracket = readonly [limit: Decimal, rate: Decimal]
type IrpfBrackets = ReadonlyArray<IrpfBracket>
type MoneyPolicy = (value: Decimal) => Decimal

interface ContributionRates {
  readonly employer: Decimal
  readonly worker: Decimal
}

interface Parameters {
  readonly baseMax: Decimal
  readonly socialSecurityRates: Readonly<Record<string, ContributionRates>>
  readonly mei: ContributionRates
  readonly solidarity: SolidarityPolicy
  readonly irpfMinimum: Decimal
  readonly withholdingMinimum: Decimal
  readonly fixedExpenses: Decimal
  readonly irpfBrackets: IrpfBrackets
  readonly workReduction: MoneyPolicy
  readonly smiDeduction: MoneyPolicy
}

type SolidarityPolicy =
  | {
      readonly _tag: "NoSolidarity"
    }
  | {
      readonly _tag: "Solidarity"
      readonly firstExcessRate: Decimal
      readonly secondExcessRate: Decimal
      readonly remainingExcessRate: Decimal
    }

interface ContributionBase {
  readonly regularBase: Decimal
  readonly excessBase: Decimal
}

interface SocialContributions {
  readonly employerContribution: Decimal
  readonly workerContribution: Decimal
}

interface IrpfCalculation {
  readonly previousNetIncome: Decimal
  readonly workReduction: Decimal
  readonly netIncome: Decimal
  readonly taxableBase: Decimal
  readonly fullQuota: Decimal
  readonly personalMinimumQuota: Decimal
  readonly theoreticalQuota: Decimal
  readonly smiDeduction: Decimal
  readonly quotaAfterSmi: Decimal
  readonly withholdingLimit: Decimal
  readonly irpfFinal: Decimal
}

interface EuroBreakdown {
  readonly grossAnnual: Decimal
  readonly employerContribution: Decimal
  readonly laborCost: Decimal
  readonly workerContribution: Decimal
  readonly irpfFinal: Decimal
  readonly salaryNetAnnual: Decimal
}

interface QuotaState {
  readonly previousLimit: Decimal
  readonly quota: Decimal
}

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

const SOCIAL_SECURITY_RATES = {
  comunes: {
    employer: d("0.236"),
    worker: d("0.047"),
  },
  desempleo: {
    employer: d("0.055"),
    worker: d("0.0155"),
  },
  fogasa: {
    employer: d("0.002"),
    worker: ZERO,
  },
  fp: {
    employer: d("0.006"),
    worker: d("0.001"),
  },
  atep: {
    employer: d("0.015"),
    worker: ZERO,
  },
} satisfies Parameters["socialSecurityRates"]

const IRPF_BRACKETS_UNTIL_2014: IrpfBrackets = [
  [d(17707), d("0.2475")],
  [d(33007), d("0.30")],
  [d(53407), d("0.40")],
  [d(120000), d("0.47")],
  [d(175000), d("0.49")],
  [d(300000), d("0.51")],
  [d(Infinity), d("0.52")],
]

const IRPF_BRACKETS_2015: IrpfBrackets = [
  [d(12450), d("0.195")],
  [d(20200), d("0.245")],
  [d(34000), d("0.305")],
  [d(60000), d("0.38")],
  [d(Infinity), d("0.46")],
]

const IRPF_BRACKETS_2016_TO_2020: IrpfBrackets = [
  [d(12450), d("0.19")],
  [d(20200), d("0.24")],
  [d(35200), d("0.30")],
  [d(60000), d("0.37")],
  [d(Infinity), d("0.45")],
]

const IRPF_BRACKETS_FROM_2021: IrpfBrackets = [
  [d(12450), d("0.19")],
  [d(20200), d("0.24")],
  [d(35200), d("0.30")],
  [d(60000), d("0.37")],
  [d(300000), d("0.45")],
  [d(Infinity), d("0.47")],
]

const NO_SOLIDARITY = {
  _tag: "NoSolidarity",
} as const satisfies SolidarityPolicy

const centsToEuros = (cents: number) => d(cents).div(100)

const eurosToCents = (euros: Decimal) =>
  euros.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_EVEN).toNumber()

const roundMoney = (euros: Decimal) =>
  euros.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN)

const min = (a: Decimal, b: Decimal) => {
  if (a.lessThan(b)) {
    return a
  }
  return b
}

const max = (a: Decimal, b: Decimal) => {
  if (a.greaterThan(b)) {
    return a
  }
  return b
}

const knownAnnualIpc = (year: number) => {
  const rate = IPC_ANNUAL_DECEMBER[year]
  if (rate === undefined) {
    return ZERO
  }
  return rate
}

const numberRange = (start: number, end: number): ReadonlyArray<number> => {
  if (start > end) {
    return []
  }

  return globalThis.Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  )
}

const inflationFactor = (baseYear: FiscalYear, referenceYear: FiscalYear) => {
  const years = numberRange(baseYear + 1, referenceYear)
  return years.reduce(
    (factor, year) => factor.mul(ONE.plus(knownAnnualIpc(year))),
    ONE
  )
}

const workReductionUntil2014 = (previousNetIncome: Decimal) => {
  if (previousNetIncome.lte(9180)) {
    return d(4080)
  }

  if (previousNetIncome.lte(13260)) {
    return d(4080).minus(d("0.35").mul(previousNetIncome.minus(9180)))
  }

  return d(2652)
}

const workReduction2015To2017 = (previousNetIncome: Decimal) => {
  if (previousNetIncome.lte(11250)) {
    return d(3700)
  }

  if (previousNetIncome.lte(14450)) {
    return d(3700).minus(d("1.15625").mul(previousNetIncome.minus(11250)))
  }

  return ZERO
}

const workReduction2019To2022 = (previousNetIncome: Decimal) => {
  if (previousNetIncome.lte(13115)) {
    return d(5565)
  }

  if (previousNetIncome.lte(16825)) {
    return max(
      ZERO,
      d(5565).minus(d("1.5").mul(previousNetIncome.minus(13115)))
    )
  }

  return ZERO
}

const workReduction2018 = (previousNetIncome: Decimal) => {
  const preTransitionReduction = workReduction2015To2017(previousNetIncome)
  const postTransitionReduction = workReduction2019To2022(previousNetIncome)
  return preTransitionReduction.div(2).plus(postTransitionReduction.div(2))
}

const workReduction2023 = (previousNetIncome: Decimal) => {
  if (previousNetIncome.lte("14047.50")) {
    return d(6498)
  }

  if (previousNetIncome.lte("19747.50")) {
    return max(
      ZERO,
      d(6498).minus(d("1.14").mul(previousNetIncome.minus("14047.50")))
    )
  }

  return ZERO
}

const workReductionFrom2024 = (previousNetIncome: Decimal) => {
  if (previousNetIncome.lte(14852)) {
    return d(7302)
  }

  if (previousNetIncome.lte("17673.52")) {
    return d(7302).minus(d("1.75").mul(previousNetIncome.minus(14852)))
  }

  if (previousNetIncome.lte("19747.50")) {
    return d("2364.34").minus(
      d("1.14").mul(previousNetIncome.minus("17673.52"))
    )
  }

  return ZERO
}

const getWorkReduction = (year: FiscalYear): MoneyPolicy => {
  if (year <= 2014) {
    return workReductionUntil2014
  }

  if (year <= 2017) {
    return workReduction2015To2017
  }

  if (year === 2018) {
    return workReduction2018
  }

  if (year <= 2022) {
    return workReduction2019To2022
  }

  if (year === 2023) {
    return workReduction2023
  }

  return workReductionFrom2024
}

const getMeiRates = (year: FiscalYear): ContributionRates => {
  if (year === 2023) {
    return {
      employer: d("0.005"),
      worker: d("0.001"),
    }
  }

  if (year === 2024) {
    return {
      employer: d("0.0058"),
      worker: d("0.0012"),
    }
  }

  if (year === 2025) {
    return {
      employer: d("0.0067"),
      worker: d("0.0013"),
    }
  }

  if (year >= 2026) {
    return {
      employer: d("0.0075"),
      worker: d("0.0015"),
    }
  }

  return {
    employer: ZERO,
    worker: ZERO,
  }
}

const getSolidarityPolicy = (year: FiscalYear): SolidarityPolicy => {
  if (year === 2025) {
    return {
      _tag: "Solidarity",
      firstExcessRate: d("0.0092"),
      secondExcessRate: d("0.0100"),
      remainingExcessRate: d("0.0117"),
    }
  }

  if (year >= 2026) {
    return {
      _tag: "Solidarity",
      firstExcessRate: d("0.0115"),
      secondExcessRate: d("0.0125"),
      remainingExcessRate: d("0.0146"),
    }
  }

  return NO_SOLIDARITY
}

const getIrpfBrackets = (year: FiscalYear): IrpfBrackets => {
  if (year <= 2014) {
    return IRPF_BRACKETS_UNTIL_2014
  }

  if (year === 2015) {
    return IRPF_BRACKETS_2015
  }

  if (year <= 2020) {
    return IRPF_BRACKETS_2016_TO_2020
  }

  return IRPF_BRACKETS_FROM_2021
}

const getIrpfMinimum = (year: FiscalYear) => {
  if (year <= 2014) {
    return d(5151)
  }
  return d(5550)
}

const getFixedExpenses = (year: FiscalYear) => {
  if (year <= 2014) {
    return ZERO
  }
  return d(2000)
}

const smiDeduction2026 = (gross: Decimal) => {
  if (gross.lte(17094)) {
    return d("590.89")
  }

  return max(ZERO, d("590.89").minus(d("0.20").mul(gross.minus(17094))))
}

const smiDeduction2025 = (gross: Decimal) => {
  if (gross.lte(16576)) {
    return d(340)
  }

  if (gross.lte(18276)) {
    return max(ZERO, d(340).minus(d("0.20").mul(gross.minus(16576))))
  }

  return ZERO
}

const noSmiDeduction = () => ZERO

const getSmiDeduction = (year: FiscalYear): MoneyPolicy => {
  if (year === 2026) {
    return smiDeduction2026
  }

  if (year === 2025) {
    return smiDeduction2025
  }

  return noSmiDeduction
}

const getParameters = (year: FiscalYear): Parameters => {
  return {
    baseMax: BASE_MAX[year],
    socialSecurityRates: SOCIAL_SECURITY_RATES,
    mei: getMeiRates(year),
    solidarity: getSolidarityPolicy(year),
    irpfMinimum: getIrpfMinimum(year),
    withholdingMinimum: WITHHOLDING_MINIMUM[year],
    fixedExpenses: getFixedExpenses(year),
    irpfBrackets: getIrpfBrackets(year),
    workReduction: getWorkReduction(year),
    smiDeduction: getSmiDeduction(year),
  }
}

const sumContributionRate = (parameters: Parameters, side: ContributionSide) =>
  Object.values(parameters.socialSecurityRates).reduce(
    (sum, rates) => sum.plus(contributionRateForSide(rates, side)),
    ZERO
  )

const contributionRateForSide = (
  rates: ContributionRates,
  side: ContributionSide
) => {
  if (side === "employer") {
    return rates.employer
  }

  return rates.worker
}

const contributionBaseFor = (
  gross: Decimal,
  parameters: Parameters
): ContributionBase => ({
  regularBase: min(gross, parameters.baseMax),
  excessBase: max(ZERO, gross.minus(parameters.baseMax)),
})

const calculateSolidarityTotal = (
  contributionBase: ContributionBase,
  parameters: Parameters
) => {
  if (parameters.solidarity._tag === "NoSolidarity") {
    return ZERO
  }

  if (contributionBase.excessBase.lte(0)) {
    return ZERO
  }

  const firstBandLimit = parameters.baseMax.mul("0.10")
  const secondBandLimit = parameters.baseMax.mul("0.50")
  const firstBandExcess = min(contributionBase.excessBase, firstBandLimit)
  const secondBandExcess = min(
    max(ZERO, contributionBase.excessBase.minus(firstBandLimit)),
    secondBandLimit.minus(firstBandLimit)
  )
  const remainingExcess = max(
    ZERO,
    contributionBase.excessBase.minus(secondBandLimit)
  )

  return firstBandExcess
    .mul(parameters.solidarity.firstExcessRate)
    .plus(secondBandExcess.mul(parameters.solidarity.secondExcessRate))
    .plus(remainingExcess.mul(parameters.solidarity.remainingExcessRate))
}

const splitSolidarityContribution = (
  solidarityTotal: Decimal
): SocialContributions => ({
  employerContribution: solidarityTotal.mul(5).div(6),
  workerContribution: solidarityTotal.div(6),
})

const addSocialContributions = (
  left: SocialContributions,
  right: SocialContributions
): SocialContributions => ({
  employerContribution: left.employerContribution.plus(
    right.employerContribution
  ),
  workerContribution: left.workerContribution.plus(right.workerContribution),
})

// Cotizaciones are split into the ordinary capped base plus, from 2025, the
// solidarity quota on salary above the cap. The split mirrors the Python oracle:
// 5/6 employer and 1/6 worker.
const calculateSocialContributions = (
  gross: Decimal,
  parameters: Parameters
): SocialContributions => {
  const contributionBase = contributionBaseFor(gross, parameters)
  const generalContributions = {
    employerContribution: contributionBase.regularBase.mul(
      sumContributionRate(parameters, "employer").plus(parameters.mei.employer)
    ),
    workerContribution: contributionBase.regularBase.mul(
      sumContributionRate(parameters, "worker").plus(parameters.mei.worker)
    ),
  }
  const solidarityContributions = splitSolidarityContribution(
    calculateSolidarityTotal(contributionBase, parameters)
  )

  return addSocialContributions(generalContributions, solidarityContributions)
}

const taxableAmountInBracket = (
  taxableBase: Decimal,
  previousLimit: Decimal,
  limit: Decimal
) => {
  const remainingTaxableBase = max(ZERO, taxableBase.minus(previousLimit))
  const bracketWidth = limit.minus(previousLimit)
  return min(remainingTaxableBase, bracketWidth)
}

// Folding every bracket avoids mutable "break" control flow while preserving the
// progressive quota formula: exhausted brackets contribute zero after the taxable
// base is fully allocated.
const addBracketQuota =
  (taxableBase: Decimal) => (state: QuotaState, bracket: IrpfBracket) => {
    const [limit, rate] = bracket
    const taxableAmount = taxableAmountInBracket(
      taxableBase,
      state.previousLimit,
      limit
    )

    return {
      previousLimit: limit,
      quota: state.quota.plus(taxableAmount.mul(rate)),
    } satisfies QuotaState
  }

const calculateIrpfQuota = (taxableBase: Decimal, brackets: IrpfBrackets) => {
  if (taxableBase.lte(0)) {
    return ZERO
  }

  return brackets.reduce(addBracketQuota(taxableBase), {
    previousLimit: ZERO,
    quota: ZERO,
  }).quota
}

const firstIrpfRate = (brackets: IrpfBrackets) => {
  const first = brackets[0]
  if (first === undefined) {
    return ZERO
  }

  return first[1]
}

// The IRPF chain is intentionally expanded step by step because each value is an
// auditable fiscal concept, not just an intermediate arithmetic detail.
const calculateIrpf = (
  gross: Decimal,
  parameters: Parameters,
  contributions: SocialContributions
): IrpfCalculation => {
  const previousNetIncome = gross.minus(contributions.workerContribution)
  const workReduction = parameters.workReduction(previousNetIncome)
  const netIncome = max(ZERO, previousNetIncome.minus(parameters.fixedExpenses))
  const taxableBase = max(ZERO, netIncome.minus(workReduction))
  const fullQuota = calculateIrpfQuota(taxableBase, parameters.irpfBrackets)
  const personalMinimumQuota = parameters.irpfMinimum.mul(
    firstIrpfRate(parameters.irpfBrackets)
  )
  const theoreticalQuota = max(ZERO, fullQuota.minus(personalMinimumQuota))
  const smiDeduction = parameters.smiDeduction(gross)
  const quotaAfterSmi = max(ZERO, theoreticalQuota.minus(smiDeduction))
  const withholdingLimit = max(
    ZERO,
    gross.minus(parameters.withholdingMinimum).mul("0.43")
  )
  const irpfFinal = min(quotaAfterSmi, withholdingLimit)

  return {
    previousNetIncome,
    workReduction,
    netIncome,
    taxableBase,
    fullQuota,
    personalMinimumQuota,
    theoreticalQuota,
    smiDeduction,
    quotaAfterSmi,
    withholdingLimit,
    irpfFinal,
  }
}

// Money is Decimal euros inside the engine. Cents are only accepted and emitted at API boundaries.
const calculateBreakdownEuros = (
  gross: Decimal,
  year: FiscalYear
): EuroBreakdown => {
  const parameters = getParameters(year)
  const contributions = calculateSocialContributions(gross, parameters)
  const irpf = calculateIrpf(gross, parameters, contributions)
  const salaryNetAnnual = gross
    .minus(contributions.workerContribution)
    .minus(irpf.irpfFinal)

  return {
    grossAnnual: gross,
    employerContribution: contributions.employerContribution,
    laborCost: gross.plus(contributions.employerContribution),
    workerContribution: contributions.workerContribution,
    irpfFinal: irpf.irpfFinal,
    salaryNetAnnual,
  }
}

const liquidatedCents = (euros: Decimal) => eurosToCents(roundMoney(euros))

const liquidate = (breakdown: EuroBreakdown): LiquidatedBreakdown => ({
  grossAnnualCents: liquidatedCents(breakdown.grossAnnual),
  employerContributionCents: liquidatedCents(breakdown.employerContribution),
  laborCostCents: liquidatedCents(breakdown.laborCost),
  workerContributionCents: liquidatedCents(breakdown.workerContribution),
  irpfFinalCents: liquidatedCents(breakdown.irpfFinal),
  salaryNetAnnualCents: liquidatedCents(breakdown.salaryNetAnnual),
})

const adjustBreakdown = (
  breakdown: EuroBreakdown,
  factor: Decimal
): LiquidatedBreakdown => liquidate(scaleBreakdown(breakdown, factor))

const scaleBreakdown = (
  breakdown: EuroBreakdown,
  factor: Decimal
): EuroBreakdown => ({
  grossAnnual: breakdown.grossAnnual.mul(factor),
  employerContribution: breakdown.employerContribution.mul(factor),
  laborCost: breakdown.laborCost.mul(factor),
  workerContribution: breakdown.workerContribution.mul(factor),
  irpfFinal: breakdown.irpfFinal.mul(factor),
  salaryNetAnnual: breakdown.salaryNetAnnual.mul(factor),
})

const deltaAnnualCents = (
  comparedRaw: EuroBreakdown,
  referenceRaw: EuroBreakdown,
  factor: Decimal
) =>
  liquidatedCents(
    comparedRaw.salaryNetAnnual.mul(factor).minus(referenceRaw.salaryNetAnnual)
  )

const deltaMonthlyCents = (deltaAnnual: number) => Math.round(deltaAnnual / 12)

const buildInflationAdjustedComparison = (
  input: CompareInflationAdjustedInput
): InflationAdjustedComparison => {
  const referenceGross = centsToEuros(input.referenceGrossAnnualCents)
  const factor = inflationFactor(input.comparedYear, input.referenceYear)
  const comparedNominalGross = referenceGross.div(factor)
  const referenceRaw = calculateBreakdownEuros(
    referenceGross,
    input.referenceYear
  )
  const comparedRaw = calculateBreakdownEuros(
    comparedNominalGross,
    input.comparedYear
  )
  const deltaAnnual = deltaAnnualCents(comparedRaw, referenceRaw, factor)

  return {
    referenceYear: input.referenceYear,
    comparedYear: input.comparedYear,
    inflationFactor: factor.toFixed(12),
    reference: liquidate(referenceRaw),
    compared: {
      nominalGrossAnnualCents: liquidatedCents(comparedNominalGross),
      adjusted: adjustBreakdown(comparedRaw, factor),
    },
    netPurchasingPowerDeltaAnnualCents: deltaAnnual,
    netPurchasingPowerDeltaMonthlyCents: deltaMonthlyCents(deltaAnnual),
  }
}

// Exported calculation effects are named with Effect.fn so failures or future
// instrumentation get useful call-site spans without hiding the pure formulas.
export const compareInflationAdjusted = Effect.fn(
  "progressivity.compareInflationAdjusted"
)(function* (input: CompareInflationAdjustedInput) {
  return buildInflationAdjustedComparison(input)
})

const safeRate = (numerator: number, denominator: number) => {
  if (denominator === 0) {
    return 0
  }

  return numerator / denominator
}

const burdenRate = (breakdown: LiquidatedBreakdown) =>
  safeRate(
    breakdown.workerContributionCents + breakdown.irpfFinalCents,
    breakdown.grossAnnualCents
  )

const laborWedgeRate = (breakdown: LiquidatedBreakdown) =>
  safeRate(
    breakdown.laborCostCents - breakdown.salaryNetAnnualCents,
    breakdown.laborCostCents
  )

const sortByAbsoluteDelta = (points: ReadonlyArray<SalaryRangeAuditPoint>) =>
  [...points].sort(
    (a, b) =>
      Math.abs(b.comparison.netPurchasingPowerDeltaAnnualCents) -
      Math.abs(a.comparison.netPurchasingPowerDeltaAnnualCents)
  )

const sortByBurdenGap = (points: ReadonlyArray<SalaryRangeAuditPoint>) =>
  [...points].sort(
    (a, b) =>
      Math.abs(b.currentBurdenRate - b.comparedBurdenRate) -
      Math.abs(a.currentBurdenRate - a.comparedBurdenRate)
  )

const first = <A>(values: ReadonlyArray<A>) => values[0]

const mostAffectedFinding = (
  point: SalaryRangeAuditPoint | undefined
): AuditFinding | undefined => {
  if (point === undefined) {
    return undefined
  }

  const delta = point.comparison.netPurchasingPowerDeltaAnnualCents
  if (delta > 0) {
    return {
      title: "Mayor pérdida de poder adquisitivo",
      description:
        "En este salario, la legislación actual deja menos neto real que el año comparado ajustado por IPC.",
      salaryGrossAnnualCents: point.grossAnnualCents,
      severity: "loss",
    }
  }

  return {
    title: "Mayor mejora de poder adquisitivo",
    description:
      "En este salario, la legislación actual deja más neto real que el año comparado ajustado por IPC.",
    salaryGrossAnnualCents: point.grossAnnualCents,
    severity: "gain",
  }
}

const burdenGapFinding = (
  point: SalaryRangeAuditPoint | undefined
): AuditFinding | undefined => {
  if (point === undefined) {
    return undefined
  }

  if (point.currentBurdenRate > point.comparedBurdenRate) {
    return {
      title: "Mayor cambio de carga sobre salario bruto",
      description:
        "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
      salaryGrossAnnualCents: point.grossAnnualCents,
      severity: "loss",
    }
  }

  return {
    title: "Mayor cambio de carga sobre salario bruto",
    description:
      "Aquí se concentra la mayor diferencia de IRPF y cotización del trabajador sobre el salario bruto.",
    salaryGrossAnnualCents: point.grossAnnualCents,
    severity: "gain",
  }
}

const firstCurrentIrpfFinding = (
  point: SalaryRangeAuditPoint | undefined
): AuditFinding | undefined => {
  if (point === undefined) {
    return undefined
  }

  return {
    title: "Primer salario con IRPF final en 2026",
    description:
      "Marca la entrada visible del IRPF final dentro del rango explorado; por debajo siguen existiendo cotizaciones.",
    salaryGrossAnnualCents: point.grossAnnualCents,
    severity: "info",
  }
}

const isPresent = <A>(value: A | undefined): value is A => value !== undefined

const buildFindings = (
  points: ReadonlyArray<SalaryRangeAuditPoint>
): ReadonlyArray<AuditFinding> => {
  const mostAffected = first(sortByAbsoluteDelta(points))
  const biggestBurdenGap = first(sortByBurdenGap(points))
  const firstCurrentIrpf = points.find(
    (point) => point.comparison.reference.irpfFinalCents > 0
  )

  return [
    mostAffectedFinding(mostAffected),
    burdenGapFinding(biggestBurdenGap),
    firstCurrentIrpfFinding(firstCurrentIrpf),
  ].filter(isPresent)
}

const grossAnnualCentsRange = (
  input: SalaryRangeAuditInput
): ReadonlyArray<number> => {
  if (input.stepCents <= 0) {
    return []
  }

  if (input.minGrossAnnualCents > input.maxGrossAnnualCents) {
    return []
  }

  const pointCount =
    Math.floor(
      (input.maxGrossAnnualCents - input.minGrossAnnualCents) / input.stepCents
    ) + 1

  return globalThis.Array.from(
    { length: pointCount },
    (_, index) => input.minGrossAnnualCents + index * input.stepCents
  )
}

const buildAuditPoint = Effect.fn("progressivity.buildAuditPoint")(function* (
  input: SalaryRangeAuditInput,
  grossAnnualCents: number
) {
  const comparison = yield* compareInflationAdjusted({
    referenceGrossAnnualCents: grossAnnualCents,
    comparedYear: input.comparedYear,
    referenceYear: input.referenceYear,
  })

  return {
    grossAnnualCents,
    comparison,
    currentBurdenRate: burdenRate(comparison.reference),
    comparedBurdenRate: burdenRate(comparison.compared.adjusted),
    currentLaborWedgeRate: laborWedgeRate(comparison.reference),
    comparedLaborWedgeRate: laborWedgeRate(comparison.compared.adjusted),
  } satisfies SalaryRangeAuditPoint
})

export const auditSalaryRange = Effect.fn("progressivity.auditSalaryRange")(
  function* (input: SalaryRangeAuditInput) {
    const points = yield* Effect.forEach(
      grossAnnualCentsRange(input),
      (grossAnnualCents) => buildAuditPoint(input, grossAnnualCents)
    )

    return {
      comparedYear: input.comparedYear,
      referenceYear: input.referenceYear,
      minGrossAnnualCents: input.minGrossAnnualCents,
      maxGrossAnnualCents: input.maxGrossAnnualCents,
      stepCents: input.stepCents,
      points,
      findings: buildFindings(points),
    } satisfies SalaryRangeAudit
  }
)
