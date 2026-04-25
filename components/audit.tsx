"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Effect } from "effect"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { SiteNav } from "@/components/site-nav"
import {
  COMPARABLE_YEARS,
  centsToEuros,
  eurosToCents,
  formatCents,
  formatIntegerCents,
  money,
  percent,
  type FiscalYear,
} from "@/lib/format"
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

function formatShortSalary(cents: number): string {
  const thousand = Math.round(cents / 100_000)
  return `${thousand}k`
}

function AuditImpl() {
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
        <header className="border-b-2 border-[var(--rule)] pb-4">
          <SiteNav />
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--rule)] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--display)] text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] tracking-wider text-[var(--ink)]">
            <span className="block">AUDITORÍA POR</span>
            <span className="block">
              RANGO <span className="text-[var(--ink-soft)]">SALARIAL</span>
            </span>
          </h1>
          <div className="grid gap-3 self-start">
            <p className="text-sm leading-6 text-[var(--ink)]">
              Barrido determinista del rango. La tabla está al final;{" "}
              <strong>los hallazgos van primero</strong>: el salario más afectado, la mayor brecha
              de carga y el primer salario con IRPF en 2026.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em]">
              <button
                type="button"
                onClick={() => onExport("educational")}
                disabled={exporting !== null}
                className="border-2 border-[var(--rule)] bg-[var(--paper)] px-3 py-2 transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX educativo
              </button>
              <button
                type="button"
                onClick={() => onExport("compatible")}
                disabled={exporting !== null}
                className="border-2 border-[var(--rule)] bg-[var(--rule)] px-3 py-2 text-[var(--paper)] transition-colors hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none disabled:opacity-40"
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

export const Audit = dynamic(
  async () => ({ default: AuditImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--paper)]" /> },
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
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--ink-soft)]">
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
              <Slider.Track className="relative h-3 w-full bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                <Slider.Indicator className="bg-[var(--mark)]" />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                aria-label="Salario mínimo"
                className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              />
              <Slider.Thumb
                index={1}
                aria-label="Salario máximo"
                className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              />
            </Slider.Control>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              <span>{formatIntegerCents(auditRangeConfig.minCents)}</span>
              <span>{formatIntegerCents(auditRangeConfig.maxCents)}</span>
            </div>
          </Slider.Root>
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
            AÑO COMPARADO
          </span>
          <div role="radiogroup" className="grid grid-cols-7 gap-px bg-[var(--rule)]">
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
                    "h-12 font-[family-name:var(--mono)] text-[11px] font-bold tabular-nums transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:ring-inset",
                    active
                      ? "bg-[var(--mark)] text-[var(--mark-ink)]"
                      : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]",
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
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">{label}</span>
      <NumberField.Group className="grid h-12 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border-2 border-[var(--rule)] bg-[var(--paper)]">
        <NumberField.Decrement className="border-r-2 border-[var(--rule)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--mono)] text-base font-bold tabular-nums outline-none focus-visible:bg-[var(--mark)]/20" />
        <NumberField.Increment className="border-l-2 border-[var(--rule)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
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
      ? "var(--danger)"
      : finding.severity === "gain"
        ? "var(--gain)"
        : "var(--ink)"
  return (
    <section className="grid border-b-2 border-[var(--rule)]">
      <div
        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-l-[10px] py-6 pl-4 sm:gap-6 sm:pl-5"
        style={{ borderLeftColor: tone }}
      >
        <span
          className="px-2 py-1 font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper)] sm:px-3"
          style={{ background: tone }}
        >
          HALLAZGO 01
        </span>
        <h2 className="font-[family-name:var(--display)] text-xl uppercase leading-tight tracking-wider sm:text-3xl">
          {finding.title}
        </h2>
      </div>
      <div className="grid gap-3 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-10">
        <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,8vw,6rem)] leading-[0.86] tabular-nums text-[var(--ink)]">
          {formatIntegerCents(finding.salaryGrossAnnualCents)}
        </p>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          {finding.description} Punto identificado al comparar contra el año{" "}
          <span className="text-[var(--ink)]">{comparedYear}</span>.
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
    <section className="border-b-2 border-[var(--rule)] py-6">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
        OTROS HALLAZGOS
      </p>
      <ul className="mt-3 grid gap-px bg-[var(--rule)]">
        {findings.map((f, i) => {
          const tone =
            f.severity === "loss"
              ? "var(--danger)"
              : f.severity === "gain"
                ? "var(--gain)"
                : "var(--ink)"
          return (
            <li
              key={`${f.title}-${f.salaryGrossAnnualCents}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-[var(--paper)] px-3 py-4 sm:gap-6 sm:px-6"
            >
              <span
                className="px-2 py-0.5 font-[family-name:var(--mono)] text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--paper)]"
                style={{ background: tone }}
              >
                0{i + 2}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">{f.description}</p>
              </div>
              <span className="font-[family-name:var(--display)] text-xl tabular-nums sm:text-3xl">
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
  delta: { label: "Diferencia anual", color: "var(--danger)" },
} satisfies ChartConfig

const lineChartConfig = {
  comparedNet: { label: "Neto año comparado", color: "var(--gain)" },
  referenceNet: { label: "Neto 2026", color: "var(--danger)" },
} satisfies ChartConfig

function chartRows(points: ReadonlyArray<SalaryRangeAuditPoint>) {
  return points.map((p) => ({
    salary: formatIntegerCents(p.grossAnnualCents),
    salaryShort: formatShortSalary(p.grossAnnualCents),
    delta: centsToEuros(p.comparison.netPurchasingPowerDeltaAnnualCents),
    comparedNet: centsToEuros(p.comparison.compared.adjusted.salaryNetAnnualCents),
    referenceNet: centsToEuros(p.comparison.reference.salaryNetAnnualCents),
  }))
}

const tabButtonClass = cn(
  "px-3 py-2 transition-colors",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:ring-inset",
  "bg-[var(--paper)] text-[var(--ink)]",
  "not-data-[active]:hover:bg-[var(--mark)]",
  "data-[active]:bg-[var(--rule)] data-[active]:text-[var(--paper)]",
)

function Visuals({ audit }: { readonly audit: SalaryRangeAudit }) {
  const data = React.useMemo(() => chartRows(audit.points), [audit.points])
  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-none tracking-wider">
          DATA · 1 PANEL
        </h2>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
          Tabla al final · gráficos arriba
        </p>
      </div>
      <Tabs.Root defaultValue="bars" className="mt-5 grid gap-4">
        <Tabs.List className="inline-flex w-fit justify-self-start divide-x-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-[11px] uppercase tracking-[0.22em]">
          {(["bars", "lines", "table"] as const).map((v) => (
            <Tabs.Tab key={v} value={v} className={tabButtonClass}>
              {v === "bars" ? "BARRAS" : v === "lines" ? "LÍNEAS" : "TABLA"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="bars" className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5">
          <p className="text-xs leading-5 text-[var(--ink-soft)]">
            DELTA ANUAL POR SALARIO. POSITIVO = AÑO COMPARADO MEJOR QUE 2026.
          </p>
          <ChartContainer
            config={barChartConfig}
            className="mt-3 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            >
              <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="2 4" />
              <XAxis
                dataKey="salaryShort"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                interval="preserveStartEnd"
                minTickGap={12}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={4}
                width={44}
                fontSize={10}
                tickFormatter={(value: number) =>
                  Math.abs(value) >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
                }
              />
              <ChartTooltip
                cursor={{ fill: "var(--mark)", opacity: 0.4 }}
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
        <Tabs.Panel value="lines" className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5">
          <p className="text-xs leading-5 text-[var(--ink-soft)]">
            NETO REAL · {audit.comparedYear} (REEXPRESADO) FRENTE A 2026.
          </p>
          <ChartContainer
            config={lineChartConfig}
            className="mt-3 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            >
              <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="2 4" />
              <XAxis
                dataKey="salaryShort"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                interval="preserveStartEnd"
                minTickGap={12}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={4}
                width={44}
                fontSize={10}
                tickFormatter={(value: number) =>
                  Math.abs(value) >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
                }
              />
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
        <Tabs.Panel value="table" className="border-2 border-[var(--rule)] bg-[var(--paper)]">
          <div className="overflow-x-auto">
            <table className="w-full font-[family-name:var(--mono)] text-xs tabular-nums">
              <thead className="border-b-2 border-[var(--rule)] text-left text-[10px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                <tr>
                  <th className="px-2 py-3 font-bold sm:px-3">BRUTO</th>
                  <th className="hidden px-2 py-3 font-bold sm:table-cell sm:px-3">NOM.</th>
                  <th className="hidden px-2 py-3 font-bold md:table-cell md:px-3">NETO COMP.</th>
                  <th className="px-2 py-3 font-bold sm:px-3">NETO 2026</th>
                  <th className="px-2 py-3 font-bold sm:px-3">Δ ANUAL</th>
                  <th className="hidden px-2 py-3 font-bold md:table-cell md:px-3">CARGA</th>
                </tr>
              </thead>
              <tbody>
                {audit.points.map((p) => (
                  <tr key={p.grossAnnualCents} className="border-b border-dashed border-[var(--rule)]/30">
                    <td className="px-2 py-2.5 sm:px-3">{formatIntegerCents(p.grossAnnualCents)}</td>
                    <td className="hidden px-2 py-2.5 sm:table-cell sm:px-3">{formatCents(p.comparison.compared.nominalGrossAnnualCents)}</td>
                    <td className="hidden px-2 py-2.5 md:table-cell md:px-3">{formatCents(p.comparison.compared.adjusted.salaryNetAnnualCents)}</td>
                    <td className="px-2 py-2.5 sm:px-3">{formatCents(p.comparison.reference.salaryNetAnnualCents)}</td>
                    <td
                      className={cn(
                        "px-2 py-2.5 font-bold sm:px-3",
                        p.comparison.netPurchasingPowerDeltaAnnualCents > 0
                          ? "text-[var(--danger)]"
                          : "text-[var(--gain)]",
                      )}
                    >
                      {formatCents(p.comparison.netPurchasingPowerDeltaAnnualCents)}
                    </td>
                    <td className="hidden px-2 py-2.5 md:table-cell md:px-3">{percent.format(p.currentBurdenRate)}</td>
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
