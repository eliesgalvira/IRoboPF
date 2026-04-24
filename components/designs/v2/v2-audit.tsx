"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Effect } from "effect"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { VariantNav } from "@/components/designs/shared/variant-nav"
import {
  COMPARABLE_YEARS,
  centsToEuros,
  eurosToCents,
  formatCents,
  formatIntegerCents,
  money,
  percent,
  type FiscalYear,
} from "@/components/designs/shared/format"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  auditRangeConfig,
  auditSalaryRange,
  type AuditFinding,
  type SalaryRangeAudit,
  type SalaryRangeAuditPoint,
} from "@/lib/domain/progressivity"
import {
  exportCompatibleAuditExcel,
  exportEducationalAuditExcel,
} from "@/lib/export/audit-excel"
import { cn } from "@/lib/utils"

function V2AuditImpl() {
  const [minCents, setMinCents] = React.useState<number>(auditRangeConfig.defaultMinCents)
  const [maxCents, setMaxCents] = React.useState<number>(auditRangeConfig.defaultMaxCents)
  const [comparedYear, setComparedYear] = React.useState<FiscalYear>(2019)
  const [exporting, setExporting] = React.useState<"educational" | "compatible" | null>(null)

  const audit = React.useMemo(
    () =>
      Effect.runSync(
        auditSalaryRange({
          minGrossAnnualCents: Math.min(minCents, maxCents),
          maxGrossAnnualCents: Math.max(minCents, maxCents),
          stepCents: auditRangeConfig.stepCents,
          comparedYear,
          referenceYear: 2026,
        }),
      ),
    [comparedYear, maxCents, minCents],
  )

  const onExport = async (kind: "educational" | "compatible") => {
    setExporting(kind)
    try {
      if (kind === "educational") await exportEducationalAuditExcel(audit)
      else await exportCompatibleAuditExcel(audit)
    } finally {
      setExporting(null)
    }
  }

  const lead = audit.findings[0]

  return (
    <main className="min-h-svh">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="grid gap-3 border-b-2 border-[var(--v2-rule)] pb-4">
          <VariantNav variant="v2" tone="civic" />
          <div className="flex flex-wrap items-baseline justify-between gap-3 pt-2 text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">
            <span className="flex items-center gap-2">
              <span className="size-2 animate-pulse bg-[var(--v2-danger)]" />
              auditoría · barrido salarial · {audit.points.length} puntos
            </span>
            <span>oracle legacy 2012 — 2026</span>
          </div>
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--v2-rule)] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--v2-display)] text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.9] tracking-wider text-[var(--v2-ink)]">
            AUDITORÍA
            <br />
            POR RANGO
            <br />
            <span className="text-[var(--v2-ink-soft)]">SALARIAL</span>
          </h1>
          <div className="grid gap-3 self-start">
            <p className="text-sm leading-6 text-[var(--v2-ink)]">
              Barrido determinista del rango. La tabla está al final;{" "}
              <strong>los hallazgos van primero</strong>: el salario más afectado, la mayor brecha
              de carga y el primer salario con IRPF en 2026.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em]">
              <button
                type="button"
                onClick={() => onExport("educational")}
                disabled={exporting !== null}
                className="border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] px-3 py-2 transition hover:bg-[var(--v2-accent)] disabled:opacity-40"
              >
                ↓ XLSX educativo
              </button>
              <button
                type="button"
                onClick={() => onExport("compatible")}
                disabled={exporting !== null}
                className="border-2 border-[var(--v2-rule)] bg-[var(--v2-rule)] px-3 py-2 text-[var(--v2-paper)] transition hover:bg-[var(--v2-accent)] hover:text-[var(--v2-accent-ink)] disabled:opacity-40"
              >
                ↓ XLSX compatible
              </button>
            </div>
          </div>
        </section>

        <FilterBar
          minCents={minCents}
          maxCents={maxCents}
          comparedYear={comparedYear}
          setMinCents={setMinCents}
          setMaxCents={setMaxCents}
          setComparedYear={setComparedYear}
        />

        {lead ? <LeadFinding finding={lead} comparedYear={audit.comparedYear} /> : null}

        <SecondaryFindings findings={audit.findings.slice(1)} />

        <Visuals audit={audit} />
      </div>
    </main>
  )
}

export const V2Audit = dynamic(
  async () => ({ default: V2AuditImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v2-paper)]" /> },
)

function FilterBar({
  minCents,
  maxCents,
  comparedYear,
  setMinCents,
  setMaxCents,
  setComparedYear,
}: {
  readonly minCents: number
  readonly maxCents: number
  readonly comparedYear: FiscalYear
  readonly setMinCents: (cents: number) => void
  readonly setMaxCents: (cents: number) => void
  readonly setComparedYear: (year: FiscalYear) => void
}) {
  return (
    <section className="grid gap-0 border-b-2 border-[var(--v2-rule)] py-6">
      <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">
        FILTROS / BARRIDO
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <MoneyField label="MÍNIMO" valueCents={minCents} onChange={setMinCents} />
            <MoneyField label="MÁXIMO" valueCents={maxCents} onChange={setMaxCents} />
          </div>
          <Slider.Root
            value={[centsToEuros(minCents), centsToEuros(maxCents)]}
            min={centsToEuros(auditRangeConfig.minCents)}
            max={centsToEuros(auditRangeConfig.maxCents)}
            step={centsToEuros(auditRangeConfig.stepCents)}
            onValueChange={(value) => {
              const [min = centsToEuros(minCents), max = centsToEuros(maxCents)] = value
              setMinCents(eurosToCents(min))
              setMaxCents(eurosToCents(max))
            }}
            className="grid gap-2"
          >
            <Slider.Control className="relative flex h-8 touch-none items-center">
              <Slider.Track className="h-3 w-full border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)]">
                <Slider.Indicator className="h-full bg-[var(--v2-accent)]" />
              </Slider.Track>
              <Slider.Thumb className="size-6 border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] outline-none focus-visible:bg-[var(--v2-accent)]" />
              <Slider.Thumb className="size-6 border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] outline-none focus-visible:bg-[var(--v2-accent)]" />
            </Slider.Control>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
              <span>{formatIntegerCents(auditRangeConfig.minCents)}</span>
              <span>{formatIntegerCents(auditRangeConfig.maxCents)}</span>
            </div>
          </Slider.Root>
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
            AÑO COMPARADO
          </span>
          <div role="radiogroup" className="grid grid-cols-7 gap-px bg-[var(--v2-rule)]">
            {COMPARABLE_YEARS.map((y) => {
              const active = y === comparedYear
              return (
                <button
                  key={y}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setComparedYear(y)}
                  className={cn(
                    "h-12 font-[family-name:var(--v2-mono)] text-[11px] font-bold tabular-nums outline-none transition",
                    active
                      ? "bg-[var(--v2-accent)] text-[var(--v2-accent-ink)]"
                      : "bg-[var(--v2-paper)] text-[var(--v2-ink-soft)] hover:bg-[var(--v2-paper-2)]",
                  )}
                >
                  {y}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function MoneyField({
  label,
  valueCents,
  onChange,
}: {
  readonly label: string
  readonly valueCents: number
  readonly onChange: (cents: number) => void
}) {
  return (
    <NumberField.Root
      value={centsToEuros(valueCents)}
      min={centsToEuros(auditRangeConfig.minCents)}
      max={centsToEuros(auditRangeConfig.maxCents)}
      step={5000}
      format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
      locale="es-ES"
      onValueChange={(v) => v !== null && onChange(eurosToCents(v))}
      className="grid gap-1"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">{label}</span>
      <NumberField.Group className="grid h-12 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)]">
        <NumberField.Decrement className="border-r-2 border-[var(--v2-rule)] hover:bg-[var(--v2-accent)]">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--v2-mono)] text-base font-bold tabular-nums outline-none" />
        <NumberField.Increment className="border-l-2 border-[var(--v2-rule)] hover:bg-[var(--v2-accent)]">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

function LeadFinding({
  finding,
  comparedYear,
}: {
  readonly finding: AuditFinding
  readonly comparedYear: FiscalYear
}) {
  const tone =
    finding.severity === "loss"
      ? "var(--v2-danger)"
      : finding.severity === "gain"
        ? "var(--v2-gain)"
        : "var(--v2-ink)"
  return (
    <section className="grid border-b-2 border-[var(--v2-rule)]">
      <div
        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-l-[10px] py-7 pl-5 sm:gap-6"
        style={{ borderLeftColor: tone }}
      >
        <span
          className="px-3 py-1 font-[family-name:var(--v2-mono)] text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--v2-paper)]"
          style={{ background: tone }}
        >
          HALLAZGO 01
        </span>
        <h2 className="font-[family-name:var(--v2-display)] text-2xl uppercase leading-tight tracking-wider sm:text-3xl">
          {finding.title}
        </h2>
      </div>
      <div className="grid gap-4 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-10">
        <p className="font-[family-name:var(--v2-display)] text-[clamp(3rem,9vw,6.5rem)] leading-[0.86] tabular-nums text-[var(--v2-ink)]">
          {formatIntegerCents(finding.salaryGrossAnnualCents)}
        </p>
        <p className="text-sm leading-6 text-[var(--v2-ink-soft)]">
          {finding.description} Punto identificado al comparar contra el año{" "}
          <span className="text-[var(--v2-ink)]">{comparedYear}</span>.
        </p>
      </div>
    </section>
  )
}

function SecondaryFindings({
  findings,
}: {
  readonly findings: ReadonlyArray<AuditFinding>
}) {
  if (findings.length === 0) return null
  return (
    <section className="border-b-2 border-[var(--v2-rule)] py-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
        OTROS HALLAZGOS
      </p>
      <ul className="mt-3 grid gap-px bg-[var(--v2-rule)]">
        {findings.map((f, i) => {
          const tone =
            f.severity === "loss"
              ? "var(--v2-danger)"
              : f.severity === "gain"
                ? "var(--v2-gain)"
                : "var(--v2-ink)"
          return (
            <li
              key={`${f.title}-${f.salaryGrossAnnualCents}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 bg-[var(--v2-paper)] px-4 py-4 sm:gap-6 sm:px-6"
            >
              <span
                className="px-2 py-0.5 font-[family-name:var(--v2-mono)] text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--v2-paper)]"
                style={{ background: tone }}
              >
                0{i + 2}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--v2-ink)]">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--v2-ink-soft)]">{f.description}</p>
              </div>
              <span className="font-[family-name:var(--v2-display)] text-2xl tabular-nums sm:text-3xl">
                {formatIntegerCents(f.salaryGrossAnnualCents)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const barChartConfig = {
  delta: { label: "Diferencia anual", color: "var(--v2-danger)" },
} satisfies ChartConfig

const lineChartConfig = {
  comparedNet: { label: "Neto año comparado", color: "var(--v2-gain)" },
  referenceNet: { label: "Neto 2026", color: "var(--v2-danger)" },
} satisfies ChartConfig

function chartRows(points: ReadonlyArray<SalaryRangeAuditPoint>) {
  return points.map((p) => ({
    salary: formatIntegerCents(p.grossAnnualCents),
    delta: centsToEuros(p.comparison.netPurchasingPowerDeltaAnnualCents),
    comparedNet: centsToEuros(p.comparison.compared.adjusted.salaryNetAnnualCents),
    referenceNet: centsToEuros(p.comparison.reference.salaryNetAnnualCents),
  }))
}

function Visuals({ audit }: { readonly audit: SalaryRangeAudit }) {
  const data = React.useMemo(() => chartRows(audit.points), [audit.points])
  return (
    <section className="border-b-2 border-[var(--v2-rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--v2-display)] text-3xl uppercase leading-none tracking-wider sm:text-4xl">
          DATA · 1 PANEL
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
          Tabla al final · gráficos arriba
        </p>
      </div>
      <Tabs.Root defaultValue="bars" className="mt-5 grid gap-4">
        <Tabs.List className="inline-flex divide-x-2 divide-[var(--v2-rule)] self-start border-2 border-[var(--v2-rule)] text-[11px] uppercase tracking-[0.22em]">
          {(["bars", "lines", "table"] as const).map((v) => (
            <Tabs.Tab
              key={v}
              value={v}
              className="bg-[var(--v2-paper)] px-3 py-2 outline-none transition hover:bg-[var(--v2-accent)] data-active:bg-[var(--v2-rule)] data-active:text-[var(--v2-paper)]"
            >
              {v === "bars" ? "BARRAS" : v === "lines" ? "LÍNEAS" : "TABLA"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="bars" className="border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] p-4 sm:p-5">
          <p className="text-xs leading-5 text-[var(--v2-ink-soft)]">
            DELTA ANUAL POR SALARIO. POSITIVO = AÑO COMPARADO MEJOR QUE 2026.
          </p>
          <ChartContainer config={barChartConfig} className="mt-3 h-[clamp(18rem,42vw,24rem)] w-full">
            <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v2-rule)" strokeDasharray="2 4" />
              <XAxis dataKey="salary" tickLine={false} axisLine={{ stroke: "var(--v2-rule)" }} tickMargin={8} interval="preserveStartEnd" />
              <YAxis tickLine={false} axisLine={{ stroke: "var(--v2-rule)" }} tickMargin={8} width={72} />
              <ChartTooltip
                cursor={{ fill: "var(--v2-accent)", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    formatter={(v) => money.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salary ?? ""}
                  />
                }
              />
              <Bar dataKey="delta" fill="var(--color-delta)" radius={0} />
            </BarChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel value="lines" className="border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] p-4 sm:p-5">
          <p className="text-xs leading-5 text-[var(--v2-ink-soft)]">
            NETO REAL · {audit.comparedYear} (REEXPRESADO) FRENTE A 2026.
          </p>
          <ChartContainer config={lineChartConfig} className="mt-3 h-[clamp(18rem,42vw,24rem)] w-full">
            <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v2-rule)" strokeDasharray="2 4" />
              <XAxis dataKey="salary" tickLine={false} axisLine={{ stroke: "var(--v2-rule)" }} tickMargin={8} interval="preserveStartEnd" />
              <YAxis tickLine={false} axisLine={{ stroke: "var(--v2-rule)" }} tickMargin={8} width={72} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v) => money.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salary ?? ""}
                  />
                }
              />
              <Line dataKey="comparedNet" type="monotone" stroke="var(--color-comparedNet)" strokeWidth={2} dot={false} />
              <Line dataKey="referenceNet" type="monotone" stroke="var(--color-referenceNet)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel value="table" className="border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] font-[family-name:var(--v2-mono)] text-xs tabular-nums">
              <thead className="border-b-2 border-[var(--v2-rule)] text-left text-[10px] uppercase tracking-[0.22em] text-[var(--v2-ink-soft)]">
                <tr>
                  <th className="px-3 py-3 font-bold">SALARIO 2026</th>
                  <th className="px-3 py-3 font-bold">BRUTO NOM.</th>
                  <th className="px-3 py-3 font-bold">NETO COMPARADO</th>
                  <th className="px-3 py-3 font-bold">NETO 2026</th>
                  <th className="px-3 py-3 font-bold">Δ ANUAL</th>
                  <th className="px-3 py-3 font-bold">CARGA</th>
                </tr>
              </thead>
              <tbody>
                {audit.points.map((p) => (
                  <tr key={p.grossAnnualCents} className="border-b border-dashed border-[var(--v2-rule)]/30">
                    <td className="px-3 py-2.5">{formatIntegerCents(p.grossAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.compared.nominalGrossAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.compared.adjusted.salaryNetAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.reference.salaryNetAnnualCents)}</td>
                    <td
                      className={cn(
                        "px-3 py-2.5 font-bold",
                        p.comparison.netPurchasingPowerDeltaAnnualCents > 0
                          ? "text-[var(--v2-danger)]"
                          : "text-[var(--v2-gain)]",
                      )}
                    >
                      {formatCents(p.comparison.netPurchasingPowerDeltaAnnualCents)}
                    </td>
                    <td className="px-3 py-2.5">{percent.format(p.currentBurdenRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
