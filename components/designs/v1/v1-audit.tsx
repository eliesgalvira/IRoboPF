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

function V1AuditImpl() {
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

  return (
    <main className="min-h-svh">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-5 py-10 sm:px-10 lg:px-14 lg:py-16">
        <header className="flex flex-col gap-6 border-b border-[var(--v1-rule)] pb-8">
          <VariantNav variant="v1" tone="editorial" />
          <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.32em] text-[var(--v1-ink-soft)]">
            Reportaje de progresividad · auditoría completa
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div className="grid gap-4">
            <span className="inline-flex w-fit items-center gap-2 border-b border-[var(--v1-accent)] pb-1 font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
              <span className="size-1 rounded-full bg-[var(--v1-accent)]" />
              Auditoría por rango salarial
            </span>
            <h1 className="font-[family-name:var(--v1-display)] text-balance text-[clamp(2.2rem,5.6vw,4.2rem)] font-light leading-[1.02] tracking-tight text-[var(--v1-ink)]">
              No hace falta una hoja de Excel
              <em className="font-light italic text-[var(--v1-accent)]"> para entenderlo</em>.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--v1-ink-soft)] sm:text-lg">
              Aquí está la auditoría legacy convertida en lectura. Elige un rango y un año
              comparado: los hallazgos aparecen primero, después dos gráficos y, al final, la
              tabla por si la necesitas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            <button
              type="button"
              onClick={() => onExport("educational")}
              disabled={exporting !== null}
              className="flex items-center gap-2 border border-[var(--v1-ink)] px-4 py-2 font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--v1-ink)] transition hover:bg-[var(--v1-accent-soft)] disabled:opacity-50"
            >
              ↓ Excel educativo
            </button>
            <button
              type="button"
              onClick={() => onExport("compatible")}
              disabled={exporting !== null}
              className="flex items-center gap-2 border border-[var(--v1-ink)] bg-[var(--v1-ink)] px-4 py-2 font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--v1-paper)] transition hover:bg-[var(--v1-accent)] hover:border-[var(--v1-accent)] disabled:opacity-50"
            >
              ↓ Excel compatible
            </button>
          </div>
        </section>

        <Controls
          minCents={minCents}
          maxCents={maxCents}
          comparedYear={comparedYear}
          setMinCents={setMinCents}
          setMaxCents={setMaxCents}
          setComparedYear={setComparedYear}
        />

        <Findings findings={audit.findings} />

        <Visuals audit={audit} />
      </div>
    </main>
  )
}

export const V1Audit = dynamic(
  async () => ({ default: V1AuditImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v1-paper)]" /> },
)

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
    <section className="grid gap-6 border-y border-[var(--v1-rule)] py-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="grid gap-3">
          <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
            Rango educativo · euros de 2026
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
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
              <Slider.Track className="h-px w-full bg-[var(--v1-rule)]">
                <Slider.Indicator className="h-full bg-[var(--v1-accent)]" />
              </Slider.Track>
              <Slider.Thumb className="size-4 rounded-full border border-[var(--v1-accent)] bg-[var(--v1-paper)] shadow-[0_0_0_4px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-[var(--v1-accent)]/40" />
              <Slider.Thumb className="size-4 rounded-full border border-[var(--v1-accent)] bg-[var(--v1-paper)] shadow-[0_0_0_4px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-[var(--v1-accent)]/40" />
            </Slider.Control>
            <div className="flex justify-between font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-wider text-[var(--v1-ink-soft)]">
              <span>{formatIntegerCents(auditRangeConfig.minCents)}</span>
              <span>{formatIntegerCents(auditRangeConfig.maxCents)}</span>
            </div>
          </Slider.Root>
        </div>
        <label className="grid gap-2">
          <span className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
            Año comparado
          </span>
          <select
            value={comparedYear}
            onChange={(e) => setComparedYear(Number(e.target.value) as FiscalYear)}
            className="h-12 border-b-2 border-[var(--v1-ink)] bg-transparent px-1 font-[family-name:var(--v1-display)] text-2xl outline-none focus:border-[var(--v1-accent)]"
          >
            {COMPARABLE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-[var(--v1-ink-soft)]">
            La auditoría compara salarios equivalentes por IPC contra 2026.
          </p>
        </label>
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
      <span className="font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--v1-ink-soft)]">
        {label}
      </span>
      <NumberField.Group className="grid h-12 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border border-[var(--v1-rule)] bg-[color-mix(in_oklab,var(--v1-paper),white_30%)]">
        <NumberField.Decrement className="text-[var(--v1-ink-soft)] hover:text-[var(--v1-ink)]">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--v1-display)] text-lg font-medium outline-none" />
        <NumberField.Increment className="text-[var(--v1-ink-soft)] hover:text-[var(--v1-ink)]">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

function Findings({ findings }: { readonly findings: ReadonlyArray<AuditFinding> }) {
  const [ref, revealed] = useReveal<HTMLDivElement>()
  return (
    <section
      ref={ref}
      className={cn(
        "grid gap-5 transition-all duration-700",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="grid gap-1">
        <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
          Hallazgos
        </p>
        <h2 className="font-[family-name:var(--v1-display)] text-3xl font-light leading-tight text-[var(--v1-ink)] sm:text-4xl">
          Lo más relevante de este rango
        </h2>
      </div>
      <ol className="grid gap-0 border-y border-[var(--v1-rule)]">
        {findings.map((f, i) => {
          const colour =
            f.severity === "loss"
              ? "text-[var(--v1-accent)]"
              : f.severity === "gain"
                ? "text-[var(--v1-gain)]"
                : "text-[var(--v1-ink)]"
          return (
            <li
              key={`${f.title}-${f.salaryGrossAnnualCents}`}
              className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--v1-rule)] py-5 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-6"
            >
              <span className="font-[family-name:var(--v1-display)] text-2xl italic text-[var(--v1-ink-soft)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="grid gap-1">
                <h3 className={cn("font-[family-name:var(--v1-display)] text-lg font-medium sm:text-xl", colour)}>
                  {f.title}
                </h3>
                <p className="text-sm leading-6 text-[var(--v1-ink-soft)]">{f.description}</p>
              </div>
              <span className="col-span-2 font-[family-name:var(--v1-mono)] text-base tabular-nums text-[var(--v1-ink)] sm:col-span-1 sm:text-right">
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
  delta: { label: "Diferencia anual", color: "var(--v1-accent)" },
} satisfies ChartConfig

const lineChartConfig = {
  comparedNet: { label: "Neto año comparado", color: "var(--v1-gain)" },
  referenceNet: { label: "Neto 2026", color: "var(--v1-accent)" },
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
    <section className="grid gap-5">
      <div className="grid gap-1">
        <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
          Visualización
        </p>
        <h2 className="font-[family-name:var(--v1-display)] text-3xl font-light leading-tight text-[var(--v1-ink)] sm:text-4xl">
          Dos gráficos y, al final, la tabla
        </h2>
      </div>

      <Tabs.Root defaultValue="bars" className="grid gap-5">
        <Tabs.List className="inline-flex items-stretch self-start font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.22em]">
          {(["bars", "lines", "table"] as const).map((value, i) => (
            <Tabs.Tab
              key={value}
              value={value}
              className={cn(
                "border border-[var(--v1-ink)] px-3 py-2 outline-none transition",
                i > 0 && "border-l-0",
                "data-active:bg-[var(--v1-ink)] data-active:text-[var(--v1-paper)] hover:bg-[var(--v1-accent-soft)]",
              )}
            >
              {value === "bars" ? "Barras" : value === "lines" ? "Líneas" : "Tabla"}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value="bars" className="grid gap-3">
          <p className="text-sm leading-6 text-[var(--v1-ink-soft)]">
            Pérdida o ganancia anual por salario. Las barras hacia la derecha indican que el año
            comparado dejaba más neto real que 2026.
          </p>
          <ChartContainer config={barChartConfig} className="h-[clamp(18rem,42vw,24rem)] w-full">
            <BarChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v1-rule)" />
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
              <Bar dataKey="delta" fill="var(--color-delta)" radius={0} />
            </BarChart>
          </ChartContainer>
        </Tabs.Panel>

        <Tabs.Panel value="lines" className="grid gap-3">
          <p className="text-sm leading-6 text-[var(--v1-ink-soft)]">
            Neto real comparado frente a 2026. La línea de {audit.comparedYear} se reexpresa en
            euros de 2026.
          </p>
          <ChartContainer config={lineChartConfig} className="h-[clamp(18rem,42vw,24rem)] w-full">
            <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} stroke="var(--v1-rule)" />
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
              <Line dataKey="comparedNet" type="monotone" stroke="var(--color-comparedNet)" strokeWidth={2} dot={false} />
              <Line dataKey="referenceNet" type="monotone" stroke="var(--color-referenceNet)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </Tabs.Panel>

        <Tabs.Panel value="table" className="grid gap-3">
          <p className="text-sm leading-6 text-[var(--v1-ink-soft)]">
            Tabla compacta del rango actual. Útil cuando hay que verificar números fila a fila.
          </p>
          <div className="overflow-x-auto border-y border-[var(--v1-rule)]">
            <table className="w-full min-w-[44rem] font-[family-name:var(--v1-mono)] text-xs tabular-nums">
              <thead className="border-b border-[var(--v1-rule)] text-left text-[10px] uppercase tracking-[0.2em] text-[var(--v1-ink-soft)]">
                <tr>
                  <th className="px-3 py-3 font-medium">Salario 2026</th>
                  <th className="px-3 py-3 font-medium">Bruto nominal</th>
                  <th className="px-3 py-3 font-medium">Neto comparado</th>
                  <th className="px-3 py-3 font-medium">Neto 2026</th>
                  <th className="px-3 py-3 font-medium">Diferencia</th>
                  <th className="px-3 py-3 font-medium">Carga actual</th>
                </tr>
              </thead>
              <tbody>
                {audit.points.map((p) => (
                  <tr key={p.grossAnnualCents} className="border-b border-dashed border-[var(--v1-rule)]">
                    <td className="px-3 py-2.5">{formatIntegerCents(p.grossAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.compared.nominalGrossAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.compared.adjusted.salaryNetAnnualCents)}</td>
                    <td className="px-3 py-2.5">{formatCents(p.comparison.reference.salaryNetAnnualCents)}</td>
                    <td
                      className={cn(
                        "px-3 py-2.5",
                        p.comparison.netPurchasingPowerDeltaAnnualCents > 0
                          ? "text-[var(--v1-accent)]"
                          : "text-[var(--v1-gain)]",
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
