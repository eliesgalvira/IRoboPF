"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Effect } from "effect"
import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Euro,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SiteNav } from "@/components/site-nav"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  compareInflationAdjusted,
  salaryControlConfig,
  type FiscalYear,
  type InflationAdjustedComparison,
  type LiquidatedBreakdown,
} from "@/lib/domain/progressivity"
import { cn } from "@/lib/utils"

const comparedYears: ReadonlyArray<FiscalYear> = [
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
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const integerMoney = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const percent = new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const centsToEuros = (cents: number) => cents / 100
const eurosToCents = (euros: number) => Math.round(euros * 100)
const sliderWarningStorageKey = "irobopf.sliderOverwriteWarningSeen"

const formatCents = (cents: number) => money.format(centsToEuros(cents))
const formatIntegerCents = (cents: number) => integerMoney.format(centsToEuros(cents))

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function ProgressivitySimulator() {
  const [salaryCents, setSalaryCents] = React.useState<number>(salaryControlConfig.defaultCents)
  const [comparedYear, setComparedYear] = React.useState<FiscalYear>(2019)
  const [preciseTouched, setPreciseTouched] = React.useState(false)
  const [sliderWarningSeen, setSliderWarningSeen] = React.useState(false)
  const [pendingSliderCents, setPendingSliderCents] = React.useState<number | null>(null)
  const [overwriteOpen, setOverwriteOpen] = React.useState(false)

  React.useEffect(() => {
    setSliderWarningSeen(window.localStorage.getItem(sliderWarningStorageKey) === "true")
  }, [])

  const comparison = React.useMemo(
    () =>
      Effect.runSync(
        compareInflationAdjusted({
          referenceGrossAnnualCents: salaryCents,
          comparedYear,
          referenceYear: 2026,
        }),
      ),
    [salaryCents, comparedYear],
  )

  const sliderDisplayEuros = centsToEuros(
    clamp(
      salaryCents,
      salaryControlConfig.quick.minCents,
      salaryControlConfig.quick.maxCents,
    ),
  )

  const applySliderValue = (valueInEuros: number) => {
    const nextCents = eurosToCents(valueInEuros)
    if (preciseTouched && !sliderWarningSeen) {
      setPendingSliderCents(nextCents)
      setOverwriteOpen(true)
      return
    }
    setSalaryCents(nextCents)
  }

  const confirmSliderOverwrite = () => {
    if (pendingSliderCents !== null) {
      setSalaryCents(pendingSliderCents)
    }
    window.localStorage.setItem(sliderWarningStorageKey, "true")
    setSliderWarningSeen(true)
    setPendingSliderCents(null)
    setPreciseTouched(false)
    setOverwriteOpen(false)
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-4xl">
            <SiteNav />
            <div className="mb-3 mt-5 inline-flex items-center gap-2 border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              <ArrowDownRight className="size-3.5 text-destructive" />
              Comparacion ajustada por IPC
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Simulador de progresividad en frío
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Compara qué habría pasado con un salario equivalente si se aplicasen las reglas de
              otro año frente a 2026. Los importes se muestran en euros de 2026 para que la
              comparación no mezcle inflación con normativa.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <section className="grid gap-4 border border-border bg-card p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_18rem] md:p-5">
          <SalaryControl
            salaryCents={salaryCents}
            sliderDisplayEuros={sliderDisplayEuros}
            onPreciseChange={(nextCents) => {
              setPreciseTouched(true)
              setSalaryCents(nextCents)
            }}
            onSliderChange={applySliderValue}
          />

          <label className="flex min-w-0 flex-col gap-2 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CalendarDays className="size-4 text-primary" />
              Comparar con el año
            </span>
            <select
              value={comparedYear}
              onChange={(event) => setComparedYear(Number(event.target.value) as FiscalYear)}
              className="h-11 border border-input bg-background px-3 text-base font-medium outline-none transition focus:border-ring focus:ring-1 focus:ring-ring/50"
            >
              {comparedYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </section>

        <ImpactSummary comparison={comparison} />

        <Tabs.Root defaultValue="gross" className="grid gap-4">
          <Tabs.List className="inline-grid w-full grid-cols-2 border border-border bg-muted p-1 sm:w-fit">
            <Tabs.Tab
              value="gross"
              className="px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-background/70 hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              Salario bruto
            </Tabs.Tab>
            <Tabs.Tab
              value="labor-cost"
              className="px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition hover:bg-background/70 hover:text-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              Coste laboral
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gross">
            <ComparisonColumns comparison={comparison} mode="gross" />
          </Tabs.Panel>
          <Tabs.Panel value="labor-cost">
            <ComparisonColumns comparison={comparison} mode="labor-cost" />
          </Tabs.Panel>
        </Tabs.Root>

        <ExplanationAccordion comparison={comparison} />
      </div>

      <Dialog.Root open={overwriteOpen} onOpenChange={setOverwriteOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-card p-5 shadow-xl">
            <Dialog.Title className="text-lg font-semibold">El slider sustituirá tu valor exacto</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              El control rápido solo introduce salarios entre 10.000 y 100.000 euros en saltos de
              1.000 euros. Si continúas, se reemplazará el valor introducido en el campo numérico.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <Dialog.Close
                render={<Button type="button" variant="outline" />}
                onClick={() => {
                  window.localStorage.setItem(sliderWarningStorageKey, "true")
                  setSliderWarningSeen(true)
                  setPendingSliderCents(null)
                }}
              >
                Cancelar
              </Dialog.Close>
              <Button type="button" onClick={confirmSliderOverwrite}>
                Usar valor del slider
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

function SalaryControl({
  salaryCents,
  sliderDisplayEuros,
  onPreciseChange,
  onSliderChange,
}: {
  readonly salaryCents: number
  readonly sliderDisplayEuros: number
  readonly onPreciseChange: (nextCents: number) => void
  readonly onSliderChange: (valueInEuros: number) => void
}) {
  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <NumberField.Root
          value={centsToEuros(salaryCents)}
          min={centsToEuros(salaryControlConfig.precise.minCents)}
          max={centsToEuros(salaryControlConfig.precise.maxCents)}
          step={0.01}
          format={{
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }}
          locale="es-ES"
          onValueChange={(value) => {
            if (value === null) return
            const nextCents = clamp(
              eurosToCents(value),
              salaryControlConfig.precise.minCents,
              salaryControlConfig.precise.maxCents,
            )
            onPreciseChange(nextCents)
          }}
          className="grid gap-2"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Euro className="size-4 text-primary" />
            Salario bruto anual en 2026
          </label>
          <NumberField.Group className="grid h-12 grid-cols-[2.5rem_minmax(0,15rem)_2.5rem] border border-input bg-background">
            <NumberField.Decrement className="border-r border-border text-lg text-muted-foreground outline-none transition hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50">
              -
            </NumberField.Decrement>
            <NumberField.Input className="min-w-0 bg-transparent px-3 text-center text-lg font-semibold text-foreground outline-none" />
            <NumberField.Increment className="border-l border-border text-lg text-muted-foreground outline-none transition hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50">
              +
            </NumberField.Increment>
          </NumberField.Group>
        </NumberField.Root>

        <div className="text-left lg:text-right">
          <div className="text-xs font-medium uppercase text-muted-foreground">Valor actual</div>
          <div className="text-2xl font-semibold text-primary">{formatCents(salaryCents)}</div>
        </div>
      </div>

      <Slider.Root
        value={sliderDisplayEuros}
        min={centsToEuros(salaryControlConfig.quick.minCents)}
        max={centsToEuros(salaryControlConfig.quick.maxCents)}
        step={centsToEuros(salaryControlConfig.quick.stepCents)}
        onValueChange={onSliderChange}
        className="grid gap-2"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Slider.Label>Control rápido al millar</Slider.Label>
          <Slider.Value />
        </div>
        <Slider.Control className="relative flex h-8 touch-none items-center">
          <Slider.Track className="h-2 w-full bg-muted">
            <Slider.Indicator className="h-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb className="size-5 border-2 border-primary bg-background shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50" />
        </Slider.Control>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatIntegerCents(salaryControlConfig.quick.minCents)}</span>
          <span>{formatIntegerCents(salaryControlConfig.quick.maxCents)}</span>
        </div>
      </Slider.Root>
    </div>
  )
}

function ImpactSummary({ comparison }: { readonly comparison: InflationAdjustedComparison }) {
  const delta = comparison.netPurchasingPowerDeltaAnnualCents
  const loss = delta > 0
  const inflationRate = Number(comparison.inflationFactor) - 1
  return (
    <section
      className={cn(
        "grid gap-4 border p-5 md:grid-cols-[minmax(0,1fr)_18rem]",
        loss ? "border-destructive/30 bg-destructive/5" : "border-emerald-500/30 bg-emerald-500/5",
      )}
    >
      <div className="flex min-w-0 gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center border",
            loss
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          {loss ? <ArrowDownRight className="size-6" /> : <ArrowUpRight className="size-6" />}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Impacto de la progresividad en frío</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Un salario nominal de{" "}
            <strong className="text-foreground">
              {formatCents(comparison.compared.nominalGrossAnnualCents)}
            </strong>{" "}
            en {comparison.comparedYear} equivale a{" "}
            <strong className="text-foreground">
              {formatCents(comparison.reference.grossAnnualCents)}
            </strong>{" "}
            en {comparison.referenceYear} tras una inflación acumulada del{" "}
            <strong className="text-foreground">{percent.format(inflationRate)}</strong>. Tras
            aplicar cada normativa y reexpresar importes a euros de {comparison.referenceYear}, el
            salario neto real {loss ? "ha perdido poder adquisitivo" : "ha ganado poder adquisitivo"}:
          </p>
        </div>
      </div>
      <div className="border border-border bg-card p-4 text-center shadow-sm">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          {loss ? "Pérdida anual de poder adquisitivo" : "Ganancia anual de poder adquisitivo"}
        </div>
        <div
          className={cn(
            "mt-2 text-3xl font-semibold",
            loss ? "text-destructive" : "text-emerald-700 dark:text-emerald-300",
          )}
        >
          {formatCents(Math.abs(delta))}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          {formatCents(Math.abs(comparison.netPurchasingPowerDeltaMonthlyCents))} / mes
        </div>
      </div>
    </section>
  )
}

function ComparisonColumns({
  comparison,
  mode,
}: {
  readonly comparison: InflationAdjustedComparison
  readonly mode: "gross" | "labor-cost"
}) {
  const left = comparison.compared.adjusted
  const right = comparison.reference
  const baseLabel = mode === "gross" ? "Salario bruto" : "Coste laboral"
  const leftBase = mode === "gross" ? left.grossAnnualCents : left.laborCostCents
  const rightBase = mode === "gross" ? right.grossAnnualCents : right.laborCostCents

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <ComparisonCard
        eyebrow={`Si aplicásemos las leyes de ${comparison.comparedYear}`}
        title={String(comparison.comparedYear)}
        subtitle={`Datos ajustados a euros de ${comparison.referenceYear}`}
        baseLabel={baseLabel}
        baseCents={leftBase}
        breakdown={left}
        highlightClassName="text-emerald-700 dark:text-emerald-300"
      />
      <ComparisonCard
        eyebrow="Legislación actual"
        title={String(comparison.referenceYear)}
        subtitle="Año de referencia"
        baseLabel={baseLabel}
        baseCents={rightBase}
        breakdown={right}
        highlightClassName="text-primary"
        current
      />
    </section>
  )
}

function ComparisonCard({
  eyebrow,
  title,
  subtitle,
  baseLabel,
  baseCents,
  breakdown,
  highlightClassName,
  current = false,
}: {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  readonly baseLabel: string
  readonly baseCents: number
  readonly breakdown: LiquidatedBreakdown
  readonly highlightClassName: string
  readonly current?: boolean
}) {
  const burden = (breakdown.workerContributionCents + breakdown.irpfFinalCents) / baseCents
  const wedge =
    (breakdown.laborCostCents - breakdown.salaryNetAnnualCents) / breakdown.laborCostCents

  return (
    <article className="border border-border bg-card p-5 shadow-sm">
      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
          {eyebrow}
        </div>
        <h3 className="mt-1 text-3xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <dl className="mt-6 grid gap-0">
        <MetricRow label={baseLabel} value={formatCents(baseCents)} />
        <MetricRow
          label="SS trabajador"
          value={`-${formatCents(breakdown.workerContributionCents)}`}
          badge={current ? "MEI incluido" : undefined}
          danger
        />
        <MetricRow
          label="IRPF final"
          value={`-${formatCents(breakdown.irpfFinalCents)}`}
          badge={current ? "2026" : undefined}
          danger
        />
        <MetricRow label="Carga sobre bruto" value={percent.format(burden)} />
        <MetricRow label="Cuna fiscal laboral" value={percent.format(wedge)} />
      </dl>
      <div className="mt-5 flex items-center justify-between bg-muted px-4 py-3">
        <span className="text-sm font-semibold">Salario neto anual</span>
        <span className={cn("text-xl font-semibold", highlightClassName)}>
          {formatCents(breakdown.salaryNetAnnualCents)}
        </span>
      </div>
    </article>
  )
}

function MetricRow({
  label,
  value,
  badge,
  danger = false,
}: {
  readonly label: string
  readonly value: string
  readonly badge?: string | undefined
  readonly danger?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
      <dt className={cn("min-w-0 text-sm text-muted-foreground", danger && "text-destructive")}>
        {label}
        {badge ? (
          <span className="ml-2 whitespace-nowrap bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
            {badge}
          </span>
        ) : null}
      </dt>
      <dd className={cn("text-right text-sm font-semibold", danger && "text-destructive")}>{value}</dd>
    </div>
  )
}

function ExplanationAccordion({ comparison }: { readonly comparison: InflationAdjustedComparison }) {
  const factor = Number(comparison.inflationFactor)
  const inflationRate = factor - 1
  const steps = [
    {
      id: "inflation",
      title: "Equivalencia por inflación",
      body: `El factor IPC acumulado entre ${comparison.comparedYear} y ${comparison.referenceYear} es ${factor.toFixed(4)}, equivalente a una inflación acumulada del ${percent.format(inflationRate)}. Por eso ${formatCents(comparison.compared.nominalGrossAnnualCents)} nominales de ${comparison.comparedYear} se comparan contra ${formatCents(comparison.reference.grossAnnualCents)} en euros de ${comparison.referenceYear}.`,
    },
    {
      id: "contributions",
      title: "Cotizaciones sociales",
      body: `La cotizacion del trabajador pasa de ${formatCents(comparison.compared.adjusted.workerContributionCents)} ajustados a ${formatCents(comparison.reference.workerContributionCents)} en ${comparison.referenceYear}. La vista de coste laboral incorpora tambien la cotizacion empresarial.`,
    },
    {
      id: "base",
      title: "Reduccion y base del IRPF",
      body: "El motor aplica gastos fijos, reducción por rendimientos del trabajo y base imponible antes de calcular cuotas. Este paso es donde aparecen muchas diferencias de umbral entre años.",
    },
    {
      id: "brackets",
      title: "Tramos, minimos y deducciones",
      body: "Una vez calculada la base, se aplican tramos de IRPF, mínimo personal y deducción SMI cuando corresponde. Esta versión muestra el impacto agregado y dejará el rastro numérico completo en la siguiente iteración.",
    },
    {
      id: "final-irpf",
      title: "Límite de retención e IRPF final",
      body: `El IRPF final comparable es ${formatCents(comparison.compared.adjusted.irpfFinalCents)} para ${comparison.comparedYear} frente a ${formatCents(comparison.reference.irpfFinalCents)} en ${comparison.referenceYear}.`,
    },
    {
      id: "net",
      title: "Salario neto y pérdida o ganancia real",
      body: `La diferencia de poder adquisitivo frente a ${comparison.referenceYear} es ${formatCents(comparison.netPurchasingPowerDeltaAnnualCents)} al año, equivalente a ${formatCents(comparison.netPurchasingPowerDeltaMonthlyCents)} al mes en 12 pagas. Si el importe es positivo, el año comparado dejaba más neto real que la legislación actual.`,
    },
  ] as const

  return (
    <section className="border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <BriefcaseBusiness className="size-4 text-primary" />
        <h2 className="text-lg font-semibold">Detalle del cálculo</h2>
      </div>
      <Accordion defaultValue={["inflation"]} multiple>
        {steps.map((step) => (
          <AccordionItem key={step.id} value={step.id}>
            <AccordionTrigger>{step.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm leading-6 text-muted-foreground">{step.body}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button type="button" variant="outline" size="lg" className="w-fit" aria-label="Cambiar tema">
        <span className="size-4" aria-hidden="true" />
        <span className="inline-block w-[11ch] text-left">Modo oscuro</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-fit"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="inline-block w-[11ch] text-left">
        {isDark ? "Modo claro" : "Modo oscuro"}
      </span>
    </Button>
  )
}
