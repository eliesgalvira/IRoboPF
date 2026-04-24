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
import { useReveal } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { HandArrow, HandUnderline, PaperTexture } from "./v3-shared"

function V3AuditImpl() {
  const [minCents, setMinCents] = React.useState<number>(auditRangeConfig.defaultMinCents)
  const [maxCents, setMaxCents] = React.useState<number>(auditRangeConfig.defaultMaxCents)
  const [comparedYear, setComparedYear] = React.useState<FiscalYear>(2019)
  const [exporting, setExporting] = React.useState<"educational" | "compatible" | null>(null)
  const [tableOpen, setTableOpen] = React.useState(false)

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
    <main className="relative min-h-svh overflow-hidden">
      <PaperTexture />
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-14 px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <header className="grid gap-5">
          <VariantNav variant="v3" tone="notebook" />
          <div className="flex flex-wrap items-baseline justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[var(--v3-ink-soft)]">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--v3-accent)]" />
              Cuaderno · auditoría completa
            </span>
            <span className="font-[family-name:var(--v3-mono)] text-[10px]">{audit.points.length} pts</span>
          </div>
        </header>

        <Thesis lead={lead} comparedYear={audit.comparedYear} />

        <Controls
          minCents={minCents}
          maxCents={maxCents}
          comparedYear={comparedYear}
          setMinCents={setMinCents}
          setMaxCents={setMaxCents}
          setComparedYear={setComparedYear}
        />

        <FindingsList findings={audit.findings.slice(1)} />

        <ChartPanel audit={audit} />

        <TableSection
          audit={audit}
          open={tableOpen}
          setOpen={setTableOpen}
          exporting={exporting}
          onExport={onExport}
        />
      </div>
    </main>
  )
}

export const V3Audit = dynamic(
  async () => ({ default: V3AuditImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v3-paper)]" /> },
)

function Thesis({
  lead,
  comparedYear,
}: {
  readonly lead: AuditFinding | undefined
  readonly comparedYear: FiscalYear
}) {
  const [ref, revealed] = useReveal<HTMLDivElement>()
  if (!lead) return null
  const tone =
    lead.severity === "loss"
      ? "var(--v3-accent)"
      : lead.severity === "gain"
        ? "var(--v3-secondary)"
        : "var(--v3-ink)"
  return (
    <section
      ref={ref}
      className={cn(
        "relative grid gap-8 transition-all duration-700",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      )}
    >
      <div className="absolute -left-3 -top-1 hidden text-[var(--v3-accent)] sm:block">
        <HandArrow className="h-8 w-16 -rotate-12" />
      </div>
      <h1 className="font-[family-name:var(--v3-display)] text-balance text-[clamp(2.4rem,6.6vw,5rem)] font-normal leading-[0.98] tracking-tight">
        El salario que más
        <br />
        <span className="relative inline-block">
          <span style={{ color: tone }}>te pellizca</span>
          <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" style={{ color: tone }} />
        </span>
        <br />
        comparando con {comparedYear},
        <br />
        <em className="italic text-[var(--v3-ink-soft)]">son</em>{" "}
        <span style={{ color: tone }}>{formatIntegerCents(lead.salaryGrossAnnualCents)}.</span>
      </h1>
      <p className="max-w-2xl text-base leading-7 text-[var(--v3-ink-soft)] sm:text-lg sm:leading-8">
        {lead.description} El resto del cuaderno explora el rango entero, los hallazgos secundarios
        y, si lo necesitas, deja la tabla y los Excel disponibles al final.
      </p>
    </section>
  )
}

function Controls({
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
    <section className="grid gap-6 rounded-[32px] border border-[var(--v3-rule)] bg-[color-mix(in_oklab,var(--v3-paper),white_18%)] p-6 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
            Rango educativo · euros de 2026
          </p>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <MoneyField label="Mínimo" valueCents={minCents} onChange={setMinCents} />
            <MoneyField label="Máximo" valueCents={maxCents} onChange={setMaxCents} />
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
            <Slider.Control className="relative flex h-7 touch-none items-center">
              <Slider.Track className="h-1.5 w-full rounded-full bg-[var(--v3-paper-2)]">
                <Slider.Indicator className="h-full rounded-full bg-[var(--v3-accent)]" />
              </Slider.Track>
              <Slider.Thumb className="size-5 rounded-full border-2 border-[var(--v3-accent)] bg-[var(--v3-paper)] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.2)]" />
              <Slider.Thumb className="size-5 rounded-full border-2 border-[var(--v3-accent)] bg-[var(--v3-paper)] shadow-[0_4px_10px_-4px_rgba(0,0,0,0.2)]" />
            </Slider.Control>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              <span>{formatIntegerCents(auditRangeConfig.minCents)}</span>
              <span>{formatIntegerCents(auditRangeConfig.maxCents)}</span>
            </div>
          </Slider.Root>
        </div>
        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
            ¿Contra qué año?
          </p>
          <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2">
            {COMPARABLE_YEARS.map((y) => {
              const active = y === comparedYear
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => setComparedYear(y)}
                  className={cn(
                    "min-w-[3.4rem] snap-start rounded-full border px-4 py-2 font-[family-name:var(--v3-mono)] text-sm tabular-nums transition",
                    active
                      ? "border-[var(--v3-accent)] bg-[var(--v3-accent)] text-white"
                      : "border-[var(--v3-rule)] text-[var(--v3-ink-soft)] hover:border-[var(--v3-accent)] hover:text-[var(--v3-ink)]",
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
      <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">{label}</span>
      <NumberField.Group className="grid h-12 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)]">
        <NumberField.Decrement className="text-[var(--v3-ink-soft)] hover:text-[var(--v3-accent)]">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--v3-mono)] text-sm font-medium tabular-nums outline-none" />
        <NumberField.Increment className="text-[var(--v3-ink-soft)] hover:text-[var(--v3-accent)]">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

function FindingsList({ findings }: { readonly findings: ReadonlyArray<AuditFinding> }) {
  if (findings.length === 0) return null
  return (
    <section className="grid gap-4">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-accent)]">Otros hallazgos</p>
      <ol className="grid gap-3">
        {findings.map((f, i) => {
          const tone =
            f.severity === "loss"
              ? "var(--v3-accent)"
              : f.severity === "gain"
                ? "var(--v3-secondary)"
                : "var(--v3-ink)"
          return (
            <li
              key={`${f.title}-${f.salaryGrossAnnualCents}`}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-dashed border-[var(--v3-rule)] pb-3 sm:gap-5"
            >
              <span className="font-[family-name:var(--v3-display)] text-3xl italic" style={{ color: tone }}>
                0{i + 2}
              </span>
              <div className="grid gap-1">
                <h3 className="font-[family-name:var(--v3-display)] text-xl leading-tight sm:text-2xl">
                  {f.title}
                </h3>
                <p className="text-sm leading-6 text-[var(--v3-ink-soft)]">{f.description}</p>
              </div>
              <span className="font-[family-name:var(--v3-mono)] text-base tabular-nums text-[var(--v3-ink)] sm:text-lg">
                {formatIntegerCents(f.salaryGrossAnnualCents)}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

const barChartConfig = {
  delta: { label: "Diferencia anual", color: "var(--v3-accent)" },
} satisfies ChartConfig

const lineChartConfig = {
  comparedNet: { label: "Neto año comparado", color: "var(--v3-secondary)" },
  referenceNet: { label: "Neto 2026", color: "var(--v3-accent)" },
} satisfies ChartConfig

function chartRows(points: ReadonlyArray<SalaryRangeAuditPoint>) {
  return points.map((p) => ({
    salary: formatIntegerCents(p.grossAnnualCents),
    delta: centsToEuros(p.comparison.netPurchasingPowerDeltaAnnualCents),
    comparedNet: centsToEuros(p.comparison.compared.adjusted.salaryNetAnnualCents),
    referenceNet: centsToEuros(p.comparison.reference.salaryNetAnnualCents),
  }))
}

function ChartPanel({ audit }: { readonly audit: SalaryRangeAudit }) {
  const data = React.useMemo(() => chartRows(audit.points), [audit.points])
  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-[family-name:var(--v3-display)] text-balance text-3xl leading-tight sm:text-5xl">
          Lo que <em className="italic text-[var(--v3-ink-soft)]">dibuja</em> el rango
        </h2>
        <p className="max-w-sm text-xs italic leading-6 text-[var(--v3-ink-soft)]">
          Un solo panel con dos lecturas: barras para la diferencia anual, líneas para los netos.
        </p>
      </div>
      <Tabs.Root defaultValue="bars" className="grid gap-4 rounded-[28px] border border-[var(--v3-rule)] bg-[color-mix(in_oklab,var(--v3-paper),white_22%)] p-5 sm:p-7">
        <Tabs.List className="inline-flex self-start rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)] p-1 text-xs">
          {(["bars", "lines"] as const).map((v) => (
            <Tabs.Tab
              key={v}
              value={v}
              className="rounded-full px-4 py-1.5 outline-none transition data-active:bg-[var(--v3-ink)] data-active:text-[var(--v3-paper)]"
            >
              {v === "bars" ? "Diferencia anual" : "Netos comparados"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value="bars">
          <ChartContainer config={barChartConfig} className="h-[clamp(20rem,46vw,26rem)] w-full">
            <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v3-rule)" strokeDasharray="3 5" />
              <XAxis dataKey="salary" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={72} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v) => money.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salary ?? ""}
                  />
                }
              />
              <Bar dataKey="delta" fill="var(--color-delta)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel value="lines">
          <ChartContainer config={lineChartConfig} className="h-[clamp(20rem,46vw,26rem)] w-full">
            <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v3-rule)" strokeDasharray="3 5" />
              <XAxis dataKey="salary" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={72} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v) => money.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salary ?? ""}
                  />
                }
              />
              <Line dataKey="comparedNet" type="monotone" stroke="var(--color-comparedNet)" strokeWidth={2.5} dot={false} />
              <Line dataKey="referenceNet" type="monotone" stroke="var(--color-referenceNet)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ChartContainer>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}

function TableSection({
  audit,
  open,
  setOpen,
  exporting,
  onExport,
}: {
  readonly audit: SalaryRangeAudit
  readonly open: boolean
  readonly setOpen: (open: boolean) => void
  readonly exporting: "educational" | "compatible" | null
  readonly onExport: (kind: "educational" | "compatible") => Promise<void>
}) {
  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-1">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-accent)]">Anexo</p>
          <h2 className="font-[family-name:var(--v3-display)] text-3xl leading-tight sm:text-4xl">
            La tabla y los Excel
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={() => onExport("educational")}
            disabled={exporting !== null}
            className="rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)] px-5 py-2 transition hover:border-[var(--v3-accent)] hover:text-[var(--v3-accent)] disabled:opacity-50"
          >
            ↓ Excel educativo
          </button>
          <button
            type="button"
            onClick={() => onExport("compatible")}
            disabled={exporting !== null}
            className="rounded-full bg-[var(--v3-ink)] px-5 py-2 text-[var(--v3-paper)] transition hover:bg-[var(--v3-accent)] disabled:opacity-50"
          >
            ↓ Excel compatible
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-fit items-center gap-2 rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)] transition hover:text-[var(--v3-ink)]"
      >
        {open ? "Esconder tabla" : "Mostrar tabla"} · {audit.points.length} filas
        <span aria-hidden className={cn("transition-transform", open && "rotate-180")}>↓</span>
      </button>
      {open ? (
        <div className="overflow-x-auto rounded-[24px] border border-[var(--v3-rule)] bg-[var(--v3-paper)]">
          <table className="w-full min-w-[44rem] font-[family-name:var(--v3-mono)] text-xs tabular-nums">
            <thead className="border-b border-[var(--v3-rule)] text-left text-[10px] uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-medium">Salario 2026</th>
                <th className="px-4 py-3 font-medium">Bruto nominal</th>
                <th className="px-4 py-3 font-medium">Neto comparado</th>
                <th className="px-4 py-3 font-medium">Neto 2026</th>
                <th className="px-4 py-3 font-medium">Diferencia</th>
                <th className="px-4 py-3 font-medium">Carga</th>
              </tr>
            </thead>
            <tbody>
              {audit.points.map((p) => (
                <tr key={p.grossAnnualCents} className="border-b border-dashed border-[var(--v3-rule)]/40">
                  <td className="px-4 py-2.5">{formatIntegerCents(p.grossAnnualCents)}</td>
                  <td className="px-4 py-2.5">{formatCents(p.comparison.compared.nominalGrossAnnualCents)}</td>
                  <td className="px-4 py-2.5">{formatCents(p.comparison.compared.adjusted.salaryNetAnnualCents)}</td>
                  <td className="px-4 py-2.5">{formatCents(p.comparison.reference.salaryNetAnnualCents)}</td>
                  <td
                    className={cn(
                      "px-4 py-2.5 font-medium",
                      p.comparison.netPurchasingPowerDeltaAnnualCents > 0
                        ? "text-[var(--v3-accent)]"
                        : "text-[var(--v3-secondary)]",
                    )}
                  >
                    {formatCents(p.comparison.netPurchasingPowerDeltaAnnualCents)}
                  </td>
                  <td className="px-4 py-2.5">{percent.format(p.currentBurdenRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
