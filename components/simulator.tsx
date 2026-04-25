"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Effect } from "effect"

import { SiteNav } from "@/components/site-nav"
import {
  COMPARABLE_YEARS,
  centsToEuros,
  clamp,
  eurosToCents,
  formatCents,
  formatIntegerCents,
  percent,
  type FiscalYear,
} from "@/lib/format"
import {
  compareInflationAdjusted,
  salaryControlConfig,
  type InflationAdjustedComparison,
  type LiquidatedBreakdown,
} from "@/lib/domain/progressivity"
import { useCountUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

function SimulatorImpl() {
  const [salaryCents, setSalaryCents] = React.useState<number>(salaryControlConfig.defaultCents)
  const [comparedYear, setComparedYear] = React.useState<FiscalYear>(2019)
  const [preciseTouched, setPreciseTouched] = React.useState(false)
  const [pendingSliderCents, setPendingSliderCents] = React.useState<number | null>(null)
  const [overwriteOpen, setOverwriteOpen] = React.useState(false)
  const [costView, setCostView] = React.useState<"gross" | "labor-cost">("gross")

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
    if (preciseTouched) {
      setPendingSliderCents(nextCents)
      setOverwriteOpen(true)
      return
    }
    setSalaryCents(nextCents)
  }

  const confirmSliderOverwrite = () => {
    if (pendingSliderCents !== null) setSalaryCents(pendingSliderCents)
    setPendingSliderCents(null)
    setPreciseTouched(false)
    setOverwriteOpen(false)
  }

  const cancelSliderOverwrite = () => {
    setPendingSliderCents(null)
    setOverwriteOpen(false)
  }

  const delta = comparison.netPurchasingPowerDeltaAnnualCents
  const loss = delta > 0
  const inflation = Number(comparison.inflationFactor) - 1
  const animatedDelta = useCountUp(Math.abs(delta), 500)
  const animatedNet = useCountUp(comparison.reference.salaryNetAnnualCents, 500)

  return (
    <main className="min-h-svh">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="border-b-2 border-[var(--rule)] pb-4">
          <SiteNav />
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--rule)] pb-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--display)] text-[clamp(3rem,11vw,8rem)] leading-[0.86] tracking-[0.01em] text-[var(--ink)]">
            <span className="block">CALC. IRPF</span>
            <span className="block">
              <span className="text-[var(--danger)]">2012</span>
              <span className="text-[var(--ink-soft)]"> / </span>
              <span>2026</span>
            </span>
          </h1>
          <div className="grid gap-3">
            <p className="text-sm leading-6 text-[var(--ink)]">
              Cálculo determinista de <strong>SALARIO NETO</strong>, <strong>IRPF</strong> y{" "}
              <strong>COTIZACIONES</strong> sobre el caso fiscal simplificado del oracle legacy.
              Comparación ajustada por IPC contra 2026.
            </p>
            <ul className="grid gap-1 text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
              <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
                <span>Hipótesis</span>
                <span className="text-[var(--ink)]">Soltero · sin descendientes</span>
              </li>
              <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
                <span>Tramo autonómico</span>
                <span className="text-[var(--ink)]">Estatalizado</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="grid items-stretch border-b-2 border-[var(--rule)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid gap-4 border-[var(--rule)] py-6 lg:border-r-2 lg:pr-8">
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
              onValueChange={(v) => {
                if (v === null) return
                const next = clamp(
                  eurosToCents(v),
                  salaryControlConfig.precise.minCents,
                  salaryControlConfig.precise.maxCents,
                )
                setPreciseTouched(true)
                setSalaryCents(next)
              }}
              className="grid gap-2"
            >
              <label className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                <span>SALARIO BRUTO ANUAL · 2026</span>
                <span>EUR</span>
              </label>
              <NumberField.Group className="grid h-16 grid-cols-[3rem_minmax(0,1fr)_3rem] border-2 border-[var(--rule)] bg-[var(--paper)]">
                <NumberField.Decrement className="border-r-2 border-[var(--rule)] text-2xl transition hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
                  −
                </NumberField.Decrement>
                <NumberField.Input className="min-w-0 bg-transparent px-3 text-center font-[family-name:var(--mono)] text-2xl font-bold tabular-nums outline-none focus-visible:bg-[var(--mark)]/20 sm:text-3xl" />
                <NumberField.Increment className="border-l-2 border-[var(--rule)] text-2xl transition hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
                  +
                </NumberField.Increment>
              </NumberField.Group>
            </NumberField.Root>

            <Slider.Root
              value={sliderDisplayEuros}
              min={centsToEuros(salaryControlConfig.quick.minCents)}
              max={centsToEuros(salaryControlConfig.quick.maxCents)}
              step={centsToEuros(salaryControlConfig.quick.stepCents)}
              onValueChange={applySliderValue}
              className="grid gap-2"
            >
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                <Slider.Label>SLIDER · STEP 1.000 €</Slider.Label>
                <Slider.Value className="font-[family-name:var(--mono)] text-sm font-bold text-[var(--ink)]" />
              </div>
              <Slider.Control className="relative flex h-8 touch-none items-center">
                <Slider.Track className="relative h-3 w-full bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                  <Slider.Indicator className="bg-[var(--mark)]" />
                </Slider.Track>
                <Slider.Thumb className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none" />
              </Slider.Control>
              <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
                <span>{formatIntegerCents(salaryControlConfig.quick.minCents)}</span>
                <span>{formatIntegerCents(salaryControlConfig.quick.maxCents)}</span>
              </div>
            </Slider.Root>
          </div>

          <div className="grid gap-2 py-6 lg:pl-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
              AÑO COMPARADO
            </span>
            <YearGrid value={comparedYear} onChange={setComparedYear} />
          </div>
        </section>

        <Stamp
          loss={loss}
          delta={animatedDelta}
          comparison={comparison}
          animatedNet={animatedNet}
          inflation={inflation}
        />

        <Columns comparison={comparison} mode={costView} setMode={setCostView} />

        <Steps comparison={comparison} />
      </div>

      <Dialog.Root open={overwriteOpen} onOpenChange={setOverwriteOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[oklch(0.1_0_0/0.72)] backdrop-blur-[2px] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
            <Dialog.Popup className="relative w-full max-w-md border-2 border-[var(--rule)] bg-[var(--paper)] p-6 text-[var(--ink)] shadow-[6px_6px_0_0_var(--rule)] outline-none data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 transition-[opacity,translate] duration-150">
              <Dialog.Title className="font-[family-name:var(--display)] text-3xl uppercase tracking-wider">
                SLIDER VS PRECISO
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                El control rápido solo introduce salarios entre 10.000 y 100.000 € en saltos de 1.000 €.
                Si continúas, se reemplazará el valor del campo numérico.
              </Dialog.Description>
              <div className="mt-5 flex flex-wrap justify-end gap-2 text-[11px] uppercase tracking-[0.22em]">
                <Dialog.Close
                  onClick={cancelSliderOverwrite}
                  className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 transition-colors hover:bg-[var(--danger)] hover:text-[var(--paper)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:outline-none"
                >
                  Cancelar
                </Dialog.Close>
                <button
                  type="button"
                  onClick={confirmSliderOverwrite}
                  className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                >
                  Usar slider
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const Simulator = dynamic(
  async () => ({ default: SimulatorImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--paper)]" /> },
)

function YearGrid({
  value,
  onChange,
}: {
  readonly value: FiscalYear
  readonly onChange: (year: FiscalYear) => void
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-7 gap-px bg-[var(--rule)]">
      {COMPARABLE_YEARS.map((year) => {
        const active = year === value
        return (
          <button
            key={year}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(year)}
            className={cn(
              "h-12 transition-colors",
              "font-[family-name:var(--mono)] text-[11px] font-bold tracking-wider tabular-nums",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:ring-inset",
              active
                ? "bg-[var(--mark)] text-[var(--mark-ink)]"
                : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]",
            )}
          >
            {year}
          </button>
        )
      })}
    </div>
  )
}

function Stamp({
  loss,
  delta,
  comparison,
  animatedNet,
  inflation,
}: {
  readonly loss: boolean
  readonly delta: number
  readonly comparison: InflationAdjustedComparison
  readonly animatedNet: number
  readonly inflation: number
}) {
  return (
    <section className="grid border-b-2 border-[var(--rule)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="grid gap-3 border-[var(--rule)] py-6 lg:border-r-2 lg:pr-8">
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
          <span
            className={cn(
              "px-2 py-0.5 font-bold tracking-[0.4em]",
              loss
                ? "bg-[var(--danger)] text-[var(--paper)]"
                : "bg-[var(--gain)] text-[var(--paper)]",
            )}
          >
            {loss ? "PÉRDIDA" : "GANANCIA"}
          </span>
          <span className="text-[var(--ink-soft)]">poder adquisitivo neto · anual</span>
        </span>
        <div className="font-[family-name:var(--display)] text-[clamp(3rem,10vw,8rem)] leading-[0.85] tabular-nums text-[var(--ink)]">
          {formatCents(delta)}
        </div>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          Si las normas de <span className="text-[var(--ink)]">{comparison.comparedYear}</span> se
          aplicaran a un salario equivalente, el neto real{" "}
          {loss ? "habría dejado más" : "habría dejado menos"} que la legislación actual.
          Equivalente a <strong className="text-[var(--ink)]">{formatCents(Math.abs(comparison.netPurchasingPowerDeltaMonthlyCents))}</strong> al mes.
        </p>
      </div>
      <div className="grid content-start gap-3 py-6 lg:pl-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
          Hoy · 2026
        </span>
        <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,7vw,4rem)] leading-none tabular-nums text-[var(--ink)]">
          {formatCents(animatedNet)}
        </p>
        <ul className="grid gap-1 text-[11px] uppercase tracking-wider text-[var(--ink-soft)]">
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>IPC acumulado</span>
            <span className="text-[var(--ink)] tabular-nums">{percent.format(inflation)}</span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>IRPF final 2026</span>
            <span className="text-[var(--ink)] tabular-nums">
              {formatCents(comparison.reference.irpfFinalCents)}
            </span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>SS trabajador</span>
            <span className="text-[var(--ink)] tabular-nums">
              {formatCents(comparison.reference.workerContributionCents)}
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

function Columns({
  comparison,
  mode,
  setMode,
}: {
  readonly comparison: InflationAdjustedComparison
  readonly mode: "gross" | "labor-cost"
  readonly setMode: (mode: "gross" | "labor-cost") => void
}) {
  return (
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-none tracking-wider">
          PARALELO 2 COLUMNAS
        </h2>
        <div
          role="tablist"
          aria-label="Base de la comparación"
          className="inline-flex divide-x-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-[11px] uppercase tracking-[0.22em]"
        >
          {(["gross", "labor-cost"] as const).map((m) => {
            const active = mode === m
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(m)}
                className={cn(
                  "px-3 py-2 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:ring-inset",
                  active
                    ? "bg-[var(--rule)] text-[var(--paper)] hover:bg-[var(--rule)]"
                    : "bg-[var(--paper)] hover:bg-[var(--mark)]",
                )}
              >
                {m === "gross" ? "Bruto" : "Coste"}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-px bg-[var(--rule)] lg:grid-cols-2">
        <Column
          eyebrow={`leyes ${comparison.comparedYear}`}
          title={String(comparison.comparedYear)}
          subtitle={`euros de ${comparison.referenceYear}`}
          baseLabel={mode === "gross" ? "BRUTO" : "COSTE LABORAL"}
          baseCents={
            mode === "gross"
              ? comparison.compared.adjusted.grossAnnualCents
              : comparison.compared.adjusted.laborCostCents
          }
          breakdown={comparison.compared.adjusted}
          variant="compared"
        />
        <Column
          eyebrow="legislación actual"
          title={String(comparison.referenceYear)}
          subtitle="año de referencia"
          baseLabel={mode === "gross" ? "BRUTO" : "COSTE LABORAL"}
          baseCents={
            mode === "gross"
              ? comparison.reference.grossAnnualCents
              : comparison.reference.laborCostCents
          }
          breakdown={comparison.reference}
          variant="current"
        />
      </div>
    </section>
  )
}

function Column({
  eyebrow,
  title,
  subtitle,
  baseLabel,
  baseCents,
  breakdown,
  variant,
}: {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  readonly baseLabel: string
  readonly baseCents: number
  readonly breakdown: LiquidatedBreakdown
  readonly variant: "current" | "compared"
}) {
  const burden = (breakdown.workerContributionCents + breakdown.irpfFinalCents) / baseCents
  const wedge =
    (breakdown.laborCostCents - breakdown.salaryNetAnnualCents) / breakdown.laborCostCents
  return (
    <article
      className={cn(
        "grid gap-4 bg-[var(--paper)] p-4 sm:p-6",
        variant === "current" && "bg-[color-mix(in_oklab,var(--paper),var(--mark)_18%)]",
      )}
    >
      <header className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">{eyebrow}</p>
        <p className="font-[family-name:var(--display)] text-[clamp(2rem,6vw,3rem)] leading-none tracking-wider text-[var(--ink)]">
          {title}
        </p>
      </header>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">{subtitle}</p>
      <ul className="grid gap-0 text-sm">
        <Row label={baseLabel} value={formatCents(baseCents)} />
        <Row
          label="SS TRABAJADOR"
          value={`−${formatCents(breakdown.workerContributionCents)}`}
          danger
        />
        <Row label="IRPF FINAL" value={`−${formatCents(breakdown.irpfFinalCents)}`} danger />
        <Row label="CARGA / BRUTO" value={percent.format(burden)} />
        <Row label="CUÑA LABORAL" value={percent.format(wedge)} />
      </ul>
      <footer className="mt-2 flex items-baseline justify-between gap-3 border-t-2 border-[var(--rule)] pt-3">
        <span className="shrink-0 text-[10px] uppercase tracking-[0.3em] text-[var(--ink-soft)]">
          Salario neto anual
        </span>
        <span className="font-[family-name:var(--display)] text-[clamp(1.5rem,4.5vw,2.25rem)] tracking-wider tabular-nums text-[var(--ink)]">
          {formatCents(breakdown.salaryNetAnnualCents)}
        </span>
      </footer>
    </article>
  )
}

function Row({
  label,
  value,
  danger,
}: {
  readonly label: string
  readonly value: string
  readonly danger?: boolean
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-dashed border-[var(--rule)]/30 py-2 last:border-b-0">
      <span
        className={cn(
          "text-[11px] uppercase tracking-wider",
          danger ? "text-[var(--danger)]" : "text-[var(--ink-soft)]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--mono)] text-sm font-bold tabular-nums",
          danger ? "text-[var(--danger)]" : "text-[var(--ink)]",
        )}
      >
        {value}
      </span>
    </li>
  )
}

function Steps({ comparison }: { readonly comparison: InflationAdjustedComparison }) {
  const factor = Number(comparison.inflationFactor)
  const steps = [
    {
      n: "01",
      title: "EQUIVALENCIA POR INFLACIÓN",
      body: `Factor IPC ${factor.toFixed(4)} entre ${comparison.comparedYear} y ${comparison.referenceYear}. ${formatCents(comparison.compared.nominalGrossAnnualCents)} nominales del año comparado equivalen a ${formatCents(comparison.reference.grossAnnualCents)} de hoy.`,
    },
    {
      n: "02",
      title: "COTIZACIONES SOCIALES",
      body: `Trabajador ${formatCents(comparison.compared.adjusted.workerContributionCents)} (ajustado) → ${formatCents(comparison.reference.workerContributionCents)} (2026).`,
    },
    {
      n: "03",
      title: "REDUCCIÓN Y BASE IRPF",
      body: "Gastos fijos, reducción por rendimientos del trabajo y base imponible antes de cuotas. Aquí cambian muchos umbrales entre años.",
    },
    {
      n: "04",
      title: "TRAMOS Y MÍNIMOS",
      body: "Tramos progresivos, mínimo personal y deducción SMI cuando corresponde. Esta versión muestra el impacto agregado.",
    },
    {
      n: "05",
      title: "LÍMITE DE RETENCIÓN",
      body: `IRPF final comparable ${formatCents(comparison.compared.adjusted.irpfFinalCents)} vs ${formatCents(comparison.reference.irpfFinalCents)} en ${comparison.referenceYear}.`,
    },
    {
      n: "06",
      title: "SALARIO NETO Y DELTA",
      body: `Δ poder adquisitivo ${formatCents(comparison.netPurchasingPowerDeltaAnnualCents)}/año = ${formatCents(comparison.netPurchasingPowerDeltaMonthlyCents)}/mes en 12 pagas.`,
    },
  ] as const
  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] uppercase leading-none tracking-wider">
        PROCEDIMIENTO · 6 PASOS
      </h2>
      <ol className="mt-5 grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="grid gap-2 bg-[var(--paper)] p-4 sm:p-5">
            <span className="font-[family-name:var(--display)] text-[clamp(2.5rem,6vw,3rem)] leading-none text-[var(--ink-soft)]">
              {s.n}
            </span>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-[var(--ink)]">
              {s.title}
            </h3>
            <p className="text-xs leading-5 text-[var(--ink-soft)]">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
