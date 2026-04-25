import { Effect } from "effect"
import { describe, expect, it } from "@effect/vitest"

import {
  auditSalaryRange,
  compareInflationAdjusted,
  salaryControlConfig,
} from "../lib/domain/progressivity"

describe("compareInflationAdjusted", () => {
  it("defines the agreed salary controls", () => {
    expect(salaryControlConfig.precise.maxCents).toBe(99_999_999)
    expect(salaryControlConfig.precise.decimals).toBe(2)
    expect(salaryControlConfig.quick.minCents).toBe(1_000_000)
    expect(salaryControlConfig.quick.maxCents).toBe(10_000_000)
    expect(salaryControlConfig.quick.stepCents).toBe(100_000)
    expect(salaryControlConfig.defaultCents).toBe(1_800_000)
  })

  it.effect("compares a 2026 salary against 2019 with IPC-adjusted euros", () =>
    Effect.gen(function* () {
      const comparison = yield* compareInflationAdjusted({
        referenceGrossAnnualCents: 1_800_000,
        comparedYear: 2019,
        referenceYear: 2026,
      })

      expect(comparison.reference.salaryNetAnnualCents).toBe(1_620_618)
      expect(comparison.compared.adjusted.salaryNetAnnualCents).toBe(1_669_141)
      expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(48_522)
      expect(comparison.compared.nominalGrossAnnualCents).toBe(1_430_607)
    })
  )

  it.effect("matches the legacy 30k example against 2012", () =>
    Effect.gen(function* () {
      const comparison = yield* compareInflationAdjusted({
        referenceGrossAnnualCents: 3_000_000,
        comparedYear: 2012,
        referenceYear: 2026,
      })

      expect(comparison.compared.nominalGrossAnnualCents).toBe(2_291_644)
      expect(comparison.compared.adjusted.workerContributionCents).toBe(190_500)
      expect(comparison.compared.adjusted.irpfFinalCents).toBe(450_107)
      expect(comparison.compared.adjusted.salaryNetAnnualCents).toBe(2_359_393)
      expect(comparison.reference.workerContributionCents).toBe(195_000)
      expect(comparison.reference.irpfFinalCents).toBe(492_600)
      expect(comparison.reference.salaryNetAnnualCents).toBe(2_312_400)
      expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(46_993)
    })
  )

  it.effect("matches the legacy 2018 transitional work reduction path", () =>
    Effect.gen(function* () {
      const comparison = yield* compareInflationAdjusted({
        referenceGrossAnnualCents: 1_800_000,
        comparedYear: 2018,
        referenceYear: 2026,
      })

      expect(comparison.compared.nominalGrossAnnualCents).toBe(1_419_253)
      expect(comparison.compared.adjusted.workerContributionCents).toBe(114_300)
      expect(comparison.compared.adjusted.irpfFinalCents).toBe(58_343)
      expect(comparison.compared.adjusted.salaryNetAnnualCents).toBe(1_627_357)
      expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(6_738)
    })
  )

  it.effect(
    "matches the legacy 2025 solidarity contribution path for high salaries",
    () =>
      Effect.gen(function* () {
        const comparison = yield* compareInflationAdjusted({
          referenceGrossAnnualCents: 10_000_000,
          comparedYear: 2025,
          referenceYear: 2026,
        })

        expect(comparison.reference.employerContributionCents).toBe(2_009_366)
        expect(comparison.reference.workerContributionCents).toBe(406_158)
        expect(comparison.reference.irpfFinalCents).toBe(3_211_929)
        expect(comparison.compared.nominalGrossAnnualCents).toBe(9_708_738)
        expect(comparison.compared.adjusted.employerContributionCents).toBe(
          1_979_686
        )
        expect(comparison.compared.adjusted.workerContributionCents).toBe(
          399_942
        )
        expect(comparison.compared.adjusted.irpfFinalCents).toBe(3_181_567)
        expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(36_578)
      })
  )

  it.effect(
    "keeps low salaries in range because historical IRPF can still apply",
    () =>
      Effect.gen(function* () {
        const comparison = yield* compareInflationAdjusted({
          referenceGrossAnnualCents: 1_500_000,
          comparedYear: 2012,
          referenceYear: 2026,
        })

        expect(comparison.compared.adjusted.irpfFinalCents).toBe(16_675)
        expect(comparison.reference.irpfFinalCents).toBe(0)
        expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(-14_425)
      })
  )

  it.effect(
    "matches the legacy SMI deduction path around the 2025 threshold",
    () =>
      Effect.gen(function* () {
        const comparison = yield* compareInflationAdjusted({
          referenceGrossAnnualCents: 1_700_000,
          comparedYear: 2025,
          referenceYear: 2026,
        })

        expect(comparison.reference.irpfFinalCents).toBe(0)
        expect(comparison.compared.nominalGrossAnnualCents).toBe(1_650_485)
        expect(comparison.compared.adjusted.irpfFinalCents).toBe(0)
        expect(comparison.compared.adjusted.salaryNetAnnualCents).toBe(
          1_589_840
        )
        expect(comparison.netPurchasingPowerDeltaAnnualCents).toBe(340)
      })
  )

  it.effect(
    "builds an audit range with findings for pedagogical exploration",
    () =>
      Effect.gen(function* () {
        const audit = yield* auditSalaryRange({
          minGrossAnnualCents: 1_000_000,
          maxGrossAnnualCents: 2_000_000,
          stepCents: 500_000,
          comparedYear: 2012,
          referenceYear: 2026,
        })

        expect(audit.points).toHaveLength(3)
        expect(audit.findings.length).toBeGreaterThanOrEqual(2)
        expect(
          audit.findings.some((finding) =>
            finding.title.includes("poder adquisitivo")
          )
        ).toBe(true)
      })
  )
})
