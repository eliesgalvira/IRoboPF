"use client"

import * as React from "react"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Effect } from "effect"
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SiteNav } from "@/components/site-nav"
import {
  auditRangeConfig,
  auditSalaryRange,
  type AuditFinding,
  type FiscalYear,
  type SalaryRangeAudit,
  type SalaryRangeAuditPoint,
} from "@/lib/domain/progressivity"
import { exportCompatibleAuditExcel, exportEducationalAuditExcel } from "@/lib/export/audit-excel"
import { cn } from "@/lib/utils"

const years: ReadonlyArray<FiscalYear> = [
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
]

const money = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const exactMoney = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const pct = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const centsToEuros = (cents: number) => cents / 100
const eurosToCents = (euros: number) => Math.round(euros * 100)
const formatCents = (cents: number) => exactMoney.format(centsToEuros(cents))
const formatIntegerCents = (cents: number) => money.format(centsToEuros(cents))

export function AuditExplorer() {
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

  const exportEducational = async () => {
    setExporting("educational")
    try {
      await exportEducationalAuditExcel(audit)
    } finally {
      setExporting(null)
    }
  }

  const exportCompatible = async () => {
    setExporting("compatible")
    try {
      await exportCompatibleAuditExcel(audit)
    } finally {
      setExporting(null)
    }
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-4xl">
              <SiteNav />
              <div className="mt-6">
                <div className="mb-3 inline-flex items-center gap-2 border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  <BarChart3 className="size-3.5 text-primary" />
                  Auditoría por rango salarial
                </div>
                <h1 className="text-3xl font-semibold sm:text-5xl">Auditoría completa explicada</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Explora patrones de progresividad en frío en un rango de salarios. La tabla no es el
                  producto: los hallazgos, umbrales y diferencias de carga ayudan a leer lo que el
                  Excel legacy solo enumera fila a fila.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={exportEducational}
                disabled={exporting !== null}
              >
                <Download className="size-4" />
                Excel educativo
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={exportCompatible}
                disabled={exporting !== null}
              >
                <FileSpreadsheet className="size-4" />
                Excel compatible
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 border border-border bg-card p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_16rem]">
          <RangeControls
            minCents={minCents}
            maxCents={maxCents}
            setMinCents={setMinCents}
            setMaxCents={setMaxCents}
          />
          <label className="grid gap-2 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <span className="text-sm font-medium">Año comparado</span>
            <select
              value={comparedYear}
              onChange={(event) => setComparedYear(Number(event.target.value) as FiscalYear)}
              className="h-11 border border-input bg-background px-3 text-base font-medium outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="text-xs leading-5 text-muted-foreground">
              La auditoría compara salarios equivalentes por IPC contra 2026.
            </p>
          </label>
        </section>

        <Manual audit={audit} />
        <Findings findings={audit.findings} />
        <AuditVisuals audit={audit} />
      </div>
    </main>
  )
}

function RangeControls({
  minCents,
  maxCents,
  setMinCents,
  setMaxCents,
}: {
  readonly minCents: number
  readonly maxCents: number
  readonly setMinCents: (value: number) => void
  readonly setMaxCents: (value: number) => void
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <Slider.Label>Rango educativo en euros de 2026</Slider.Label>
          <Slider.Value />
        </div>
        <Slider.Control className="relative flex h-8 touch-none items-center">
          <Slider.Track className="h-2 w-full bg-muted">
            <Slider.Indicator className="h-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="size-5 border-2 border-primary bg-background shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
          <Slider.Thumb className="size-5 border-2 border-primary bg-background shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50" />
        </Slider.Control>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatIntegerCents(auditRangeConfig.minCents)}</span>
          <span>{formatIntegerCents(auditRangeConfig.maxCents)}</span>
        </div>
      </Slider.Root>
    </div>
  )
}

function MoneyField({
  label,
  valueCents,
  onChange,
}: {
  readonly label: string
  readonly valueCents: number
  readonly onChange: (value: number) => void
}) {
  return (
    <NumberField.Root
      value={centsToEuros(valueCents)}
      min={centsToEuros(auditRangeConfig.minCents)}
      max={centsToEuros(auditRangeConfig.maxCents)}
      step={5000}
      format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
      locale="es-ES"
      onValueChange={(value) => {
        if (value !== null) onChange(eurosToCents(value))
      }}
      className="grid gap-2"
    >
      <label className="text-sm font-medium">{label}</label>
      <NumberField.Group className="grid h-11 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border border-input">
        <NumberField.Decrement className="border-r border-border text-muted-foreground hover:bg-muted">
          -
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-3 text-center font-semibold outline-none" />
        <NumberField.Increment className="border-l border-border text-muted-foreground hover:bg-muted">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

function Manual({ audit }: { readonly audit: SalaryRangeAudit }) {
  return (
    <section className="border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="size-4 text-primary" />
        <h2 className="text-xl font-semibold">Manual interactivo de lectura</h2>
      </div>
      <Accordion defaultValue={["what"]} multiple>
        <AccordionItem value="what">
          <AccordionTrigger>Qué compara esta auditoría</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Cada punto del rango parte de un salario bruto expresado en euros de 2026. Para el año
              comparado, el motor calcula el salario nominal equivalente por IPC, aplica las reglas
              de ese año y vuelve a expresar el resultado en euros de 2026.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="sign">
          <AccordionTrigger>Cómo leer pérdida y ganancia</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Si la diferencia anual es positiva, el año comparado dejaba más salario neto real que
              2026: es pérdida de poder adquisitivo bajo la legislación actual. Si es negativa, 2026
              mejora el neto real para ese salario.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="exports">
          <AccordionTrigger>Qué exporta cada Excel</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm leading-6 text-muted-foreground">
              El Excel educativo incluye manual, hallazgos y una tabla pensada para entender. El
              Excel compatible usa nombres de hoja y columnas inspirados en el output legacy para
              facilitar comparaciones tabulares del rango explorado.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="mt-4 text-xs text-muted-foreground">
        Rango actual: {formatIntegerCents(audit.minGrossAnnualCents)} -{" "}
        {formatIntegerCents(audit.maxGrossAnnualCents)} en saltos de{" "}
        {formatIntegerCents(audit.stepCents)}.
      </p>
    </section>
  )
}

function Findings({ findings }: { readonly findings: ReadonlyArray<AuditFinding> }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {findings.map((finding) => (
        <article
          key={`${finding.title}-${finding.salaryGrossAnnualCents}`}
          className={cn(
            "border p-4 shadow-sm",
            finding.severity === "loss" && "border-destructive/30 bg-destructive/5",
            finding.severity === "gain" && "border-emerald-500/30 bg-emerald-500/5",
            finding.severity === "info" && "border-border bg-card",
          )}
        >
          <div className="mb-3 flex items-center gap-2">
            {finding.severity === "loss" ? (
              <TrendingDown className="size-4 text-destructive" />
            ) : (
              <TrendingUp className="size-4 text-primary" />
            )}
            <h3 className="text-sm font-semibold">{finding.title}</h3>
          </div>
          <div className="text-2xl font-semibold">{formatIntegerCents(finding.salaryGrossAnnualCents)}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{finding.description}</p>
        </article>
      ))}
    </section>
  )
}

function AuditVisuals({ audit }: { readonly audit: SalaryRangeAudit }) {
  return (
    <Tabs.Root defaultValue="chart" className="grid gap-4">
      <Tabs.List className="inline-grid w-full grid-cols-3 border border-border bg-muted p-1 sm:w-fit">
        <Tabs.Tab
          value="chart"
          className="px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-background/70 hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm"
        >
          Barras
        </Tabs.Tab>
        <Tabs.Tab
          value="lines"
          className="px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-background/70 hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm"
        >
          Líneas
        </Tabs.Tab>
        <Tabs.Tab
          value="table"
          className="px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-background/70 hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm"
        >
          Tabla
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="chart">
        <DeltaBarChart points={audit.points} />
      </Tabs.Panel>
      <Tabs.Panel value="lines">
        <NetLineChart audit={audit} />
      </Tabs.Panel>
      <Tabs.Panel value="table">
        <AuditTable points={audit.points} />
      </Tabs.Panel>
    </Tabs.Root>
  )
}

const barChartConfig = {
  delta: {
    label: "Diferencia anual",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function chartRows(points: ReadonlyArray<SalaryRangeAuditPoint>) {
  return points.map((point) => ({
    salary: formatIntegerCents(point.grossAnnualCents),
    salaryValue: centsToEuros(point.grossAnnualCents),
    delta: centsToEuros(point.comparison.netPurchasingPowerDeltaAnnualCents),
    comparedNet: centsToEuros(point.comparison.compared.adjusted.salaryNetAnnualCents),
    referenceNet: centsToEuros(point.comparison.reference.salaryNetAnnualCents),
  }))
}

function DeltaBarChart({ points }: { readonly points: ReadonlyArray<SalaryRangeAuditPoint> }) {
  return (
    <section className="border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Pérdida o ganancia anual por salario</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Valores positivos significan que el año comparado dejaba más neto real que 2026.
      </p>
      <ChartContainer config={barChartConfig} className="mt-5 h-[22rem] w-full">
        <BarChart accessibilityLayer data={chartRows(points)} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="salary"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={72} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => exactMoney.format(Number(value))}
                labelFormatter={(_, payload) => payload[0]?.payload?.salary ?? ""}
              />
            }
          />
          <Bar dataKey="delta" fill="var(--color-delta)" radius={0} />
        </BarChart>
      </ChartContainer>
    </section>
  )
}

const lineChartConfig = {
  comparedNet: {
    label: "Neto año comparado",
    color: "var(--primary)",
  },
  referenceNet: {
    label: "Neto 2026",
    color: "var(--destructive)",
  },
} satisfies ChartConfig

function NetLineChart({ audit }: { readonly audit: SalaryRangeAudit }) {
  return (
    <section className="border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Neto real comparado frente a 2026</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        La línea de {audit.comparedYear} muestra el neto de ese año reexpresado en euros de 2026.
      </p>
      <ChartContainer config={lineChartConfig} className="mt-5 h-[22rem] w-full">
        <LineChart accessibilityLayer data={chartRows(audit.points)} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="salary"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={72} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => exactMoney.format(Number(value))}
                labelFormatter={(_, payload) => payload[0]?.payload?.salary ?? ""}
              />
            }
          />
          <Line
            dataKey="comparedNet"
            type="monotone"
            stroke="var(--color-comparedNet)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="referenceNet"
            type="monotone"
            stroke="var(--color-referenceNet)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </section>
  )
}

function AuditTable({ points }: { readonly points: ReadonlyArray<SalaryRangeAuditPoint> }) {
  return (
    <section className="overflow-x-auto border border-border bg-card shadow-sm">
      <table className="w-full min-w-[52rem] text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="px-4 py-3 font-semibold">Salario 2026</th>
            <th className="px-4 py-3 font-semibold">Bruto nominal comparado</th>
            <th className="px-4 py-3 font-semibold">Neto comparado ajustado</th>
            <th className="px-4 py-3 font-semibold">Neto 2026</th>
            <th className="px-4 py-3 font-semibold">Diferencia anual</th>
            <th className="px-4 py-3 font-semibold">Carga actual</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.grossAnnualCents} className="border-t border-border">
              <td className="px-4 py-3">{formatIntegerCents(point.grossAnnualCents)}</td>
              <td className="px-4 py-3">
                {formatCents(point.comparison.compared.nominalGrossAnnualCents)}
              </td>
              <td className="px-4 py-3">
                {formatCents(point.comparison.compared.adjusted.salaryNetAnnualCents)}
              </td>
              <td className="px-4 py-3">{formatCents(point.comparison.reference.salaryNetAnnualCents)}</td>
              <td className="px-4 py-3">
                {formatCents(point.comparison.netPurchasingPowerDeltaAnnualCents)}
              </td>
              <td className="px-4 py-3">{pct.format(point.currentBurdenRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
