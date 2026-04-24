"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Effect } from "effect"
import { useLocalStorage } from "@uidotdev/usehooks"

import { VariantNav } from "@/components/designs/shared/variant-nav"
import {
  COMPARABLE_YEARS,
  centsToEuros,
  clamp,
  eurosToCents,
  formatCents,
  formatIntegerCents,
  percent,
  type FiscalYear,
} from "@/components/designs/shared/format"
import {
  compareInflationAdjusted,
  salaryControlConfig,
  type InflationAdjustedComparison,
  type LiquidatedBreakdown,
} from "@/lib/domain/progressivity"
import { useCountUp } from "@/lib/motion"
import { cn } from "@/lib/utils"

const sliderWarningStorageKey = "irobopf.sliderOverwriteWarningSeen"

function V2SimulatorImpl() {
  const [salaryCents, setSalaryCents] = React.useState<number>(salaryControlConfig.defaultCents)
  const [comparedYear, setComparedYear] = React.useState<FiscalYear>(2019)
  const [preciseTouched, setPreciseTouched] = React.useState(false)
  const [sliderWarningSeen, setSliderWarningSeen] = useLocalStorage(sliderWarningStorageKey, false)
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
    if (preciseTouched && !sliderWarningSeen) {
      setPendingSliderCents(nextCents)
      setOverwriteOpen(true)
      return
    }
    setSalaryCents(nextCents)
  }

  const confirmSliderOverwrite = () => {
    if (pendingSliderCents !== null) setSalaryCents(pendingSliderCents)
    setSliderWarningSeen(true)
    setPendingSliderCents(null)
    setPreciseTouched(false)
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
        <header className="grid gap-3 border-b-2 border-[var(--v2-rule)] pb-4">
          <VariantNav variant="v2" tone="civic" />
          <div className="flex flex-wrap items-baseline justify-between gap-3 pt-2 text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">
            <span className="flex items-center gap-2">
              <span className="size-2 animate-pulse bg-[var(--v2-danger)]" />
              expediente vivo · cálculo local
            </span>
            <span>simulador / boletín 02 — 26</span>
          </div>
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--v2-rule)] pb-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--v2-display)] text-[clamp(3.4rem,12vw,9rem)] leading-[0.86] tracking-[0.01em] text-[var(--v2-ink)]">
            CALC.
            <br />
            IRPF
            <br />
            <span className="text-[var(--v2-danger)]">2012</span>
            <span className="text-[var(--v2-ink-soft)]">/</span>
            <span>2026</span>
          </h1>
          <div className="grid gap-3">
            <p className="text-sm leading-6 text-[var(--v2-ink)]">
              Cálculo determinista de <strong>SALARIO NETO</strong>, <strong>IRPF</strong> y{" "}
              <strong>COTIZACIONES</strong> sobre el caso fiscal simplificado del oracle legacy.
              Comparación ajustada por IPC contra 2026.
            </p>
            <ul className="grid gap-1 text-[11px] uppercase tracking-wider text-[var(--v2-ink-soft)]">
              <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
                <span>Hipótesis</span>
                <span className="text-[var(--v2-ink)]">Soltero · sin descendientes</span>
              </li>
              <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
                <span>Tramo autonómico</span>
                <span className="text-[var(--v2-ink)]">Estatalizado</span>
              </li>
              <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
                <span>Ejecución</span>
                <span className="text-[var(--v2-ink)]">100 % local</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="grid items-stretch border-b-2 border-[var(--v2-rule)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="grid gap-4 border-[var(--v2-rule)] py-6 lg:border-r-2 lg:pr-8">
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
              <label className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
                <span>SALARIO BRUTO ANUAL · 2026</span>
                <span>EUR</span>
              </label>
              <NumberField.Group className="grid h-16 grid-cols-[3rem_minmax(0,1fr)_3rem] border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)]">
                <NumberField.Decrement className="border-r-2 border-[var(--v2-rule)] text-2xl outline-none transition hover:bg-[var(--v2-accent)] focus-visible:bg-[var(--v2-accent)]">
                  −
                </NumberField.Decrement>
                <NumberField.Input className="min-w-0 bg-transparent px-3 text-center font-[family-name:var(--v2-mono)] text-2xl font-bold tabular-nums outline-none sm:text-3xl" />
                <NumberField.Increment className="border-l-2 border-[var(--v2-rule)] text-2xl outline-none transition hover:bg-[var(--v2-accent)] focus-visible:bg-[var(--v2-accent)]">
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
              <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
                <Slider.Label>SLIDER · STEP 1.000 €</Slider.Label>
                <Slider.Value className="font-[family-name:var(--v2-mono)] text-sm font-bold text-[var(--v2-ink)]" />
              </div>
              <Slider.Control className="relative flex h-8 touch-none items-center">
                <Slider.Track className="h-3 w-full border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)]">
                  <Slider.Indicator className="h-full bg-[var(--v2-accent)]" />
                </Slider.Track>
                <Slider.Thumb className="size-6 border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] outline-none transition focus-visible:bg-[var(--v2-accent)]" />
              </Slider.Control>
              <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
                <span>{formatIntegerCents(salaryControlConfig.quick.minCents)}</span>
                <span>{formatIntegerCents(salaryControlConfig.quick.maxCents)}</span>
              </div>
            </Slider.Root>
          </div>

          <div className="grid gap-2 py-6 lg:pl-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
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
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/70" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] p-6">
            <Dialog.Title className="font-[family-name:var(--v2-display)] text-3xl uppercase tracking-wider">
              SLIDER VS PRECISO
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--v2-ink-soft)]">
              El control rápido solo introduce salarios entre 10.000 y 100.000 € en saltos de 1.000 €. Si
              continúas, se reemplazará el valor del campo numérico.
            </Dialog.Description>
            <div className="mt-5 flex justify-end gap-2 text-[11px] uppercase tracking-[0.22em]">
              <Dialog.Close
                onClick={() => {
                  setSliderWarningSeen(true)
                  setPendingSliderCents(null)
                }}
                className="border-2 border-[var(--v2-rule)] bg-[var(--v2-paper)] px-4 py-2 transition hover:bg-[var(--v2-paper-2)]"
              >
                Cancelar
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmSliderOverwrite}
                className="border-2 border-[var(--v2-rule)] bg-[var(--v2-rule)] px-4 py-2 text-[var(--v2-paper)] transition hover:bg-[var(--v2-accent)] hover:text-[var(--v2-accent-ink)]"
              >
                Usar slider
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const V2Simulator = dynamic(
  async () => ({ default: V2SimulatorImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v2-paper)]" /> },
)

function YearGrid({
  value,
  onChange,
}: {
  readonly value: FiscalYear
  readonly onChange: (year: FiscalYear) => void
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-7 gap-px bg-[var(--v2-rule)] sm:grid-cols-7">
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
              "h-12 outline-none transition-all",
              "font-[family-name:var(--v2-mono)] text-[11px] font-bold tracking-wider tabular-nums",
              active
                ? "bg-[var(--v2-accent)] text-[var(--v2-accent-ink)]"
                : "bg-[var(--v2-paper)] text-[var(--v2-ink-soft)] hover:bg-[var(--v2-paper-2)] hover:text-[var(--v2-ink)]",
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
    <section className="grid border-b-2 border-[var(--v2-rule)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div
        className={cn(
          "grid gap-3 border-[var(--v2-rule)] py-6 lg:border-r-2 lg:pr-8",
          loss ? "" : "",
        )}
      >
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
          <span
            className={cn(
              "px-2 py-0.5 font-bold tracking-[0.4em]",
              loss
                ? "bg-[var(--v2-danger)] text-[var(--v2-paper)]"
                : "bg-[var(--v2-gain)] text-[var(--v2-paper)]",
            )}
          >
            {loss ? "PÉRDIDA" : "GANANCIA"}
          </span>
          <span className="text-[var(--v2-ink-soft)]">poder adquisitivo neto · anual</span>
        </span>
        <div className="font-[family-name:var(--v2-display)] text-[clamp(3.5rem,11vw,8.5rem)] leading-[0.85] tabular-nums text-[var(--v2-ink)]">
          {formatCents(delta)}
        </div>
        <p className="text-sm leading-6 text-[var(--v2-ink-soft)]">
          Si las normas de <span className="text-[var(--v2-ink)]">{comparison.comparedYear}</span> se
          aplicaran a un salario equivalente, el neto real{" "}
          {loss ? "habría dejado más" : "habría dejado menos"} que la legislación actual.
          Equivalente a <strong className="text-[var(--v2-ink)]">{formatCents(Math.abs(comparison.netPurchasingPowerDeltaMonthlyCents))}</strong> al mes.
        </p>
      </div>
      <div className="grid content-start gap-3 py-6 lg:pl-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
          Hoy · 2026
        </span>
        <p className="font-[family-name:var(--v2-display)] text-5xl leading-none tabular-nums text-[var(--v2-ink)] sm:text-6xl">
          {formatCents(animatedNet)}
        </p>
        <ul className="grid gap-1 text-[11px] uppercase tracking-wider text-[var(--v2-ink-soft)]">
          <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
            <span>IPC acumulado</span>
            <span className="text-[var(--v2-ink)] tabular-nums">{percent.format(inflation)}</span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
            <span>IRPF final 2026</span>
            <span className="text-[var(--v2-ink)] tabular-nums">
              {formatCents(comparison.reference.irpfFinalCents)}
            </span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--v2-rule)] py-1">
            <span>SS trabajador</span>
            <span className="text-[var(--v2-ink)] tabular-nums">
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
    <section className="grid gap-0 border-b-2 border-[var(--v2-rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--v2-display)] text-3xl uppercase leading-none tracking-wider sm:text-4xl">
          PARALELO 2 COLUMNAS
        </h2>
        <div className="inline-flex divide-x-2 divide-[var(--v2-rule)] border-2 border-[var(--v2-rule)] text-[11px] uppercase tracking-[0.22em]">
          {(["gross", "labor-cost"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-2 transition",
                mode === m
                  ? "bg-[var(--v2-rule)] text-[var(--v2-paper)]"
                  : "bg-[var(--v2-paper)] hover:bg-[var(--v2-accent)]",
              )}
            >
              {m === "gross" ? "Bruto" : "Coste"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-px bg-[var(--v2-rule)] lg:grid-cols-2">
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
        "grid gap-4 bg-[var(--v2-paper)] p-5 sm:p-6",
        variant === "current" && "bg-[color-mix(in_oklab,var(--v2-paper),var(--v2-accent)_18%)]",
      )}
    >
      <header className="flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">{eyebrow}</p>
        <p className="font-[family-name:var(--v2-display)] text-5xl leading-none tracking-wider text-[var(--v2-ink)]">
          {title}
        </p>
      </header>
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">{subtitle}</p>
      <ul className="grid gap-0 text-sm">
        <Row label={baseLabel} value={formatCents(baseCents)} />
        <Row
          label="SS TRABAJADOR"
          value={`−${formatCents(breakdown.workerContributionCents)}`}
          danger
        />
        <Row label="IRPF FINAL" value={`−${formatCents(breakdown.irpfFinalCents)}`} danger />
        <Row label="CARGA / BRUTO" value={percent.format(burden)} />
        <Row label="CUNA LABORAL" value={percent.format(wedge)} />
      </ul>
      <footer className="mt-2 flex items-baseline justify-between border-t-2 border-[var(--v2-rule)] pt-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--v2-ink-soft)]">
          Salario neto anual
        </span>
        <span className="font-[family-name:var(--v2-display)] text-3xl tracking-wider tabular-nums text-[var(--v2-ink)] sm:text-4xl">
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
    <li className="flex items-baseline justify-between border-b border-dashed border-[var(--v2-rule)]/30 py-2 last:border-b-0">
      <span
        className={cn(
          "text-[11px] uppercase tracking-wider",
          danger ? "text-[var(--v2-danger)]" : "text-[var(--v2-ink-soft)]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--v2-mono)] text-sm font-bold tabular-nums",
          danger ? "text-[var(--v2-danger)]" : "text-[var(--v2-ink)]",
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
    <section className="border-b-2 border-[var(--v2-rule)] py-6">
      <h2 className="font-[family-name:var(--v2-display)] text-3xl uppercase leading-none tracking-wider sm:text-4xl">
        PROCEDIMIENTO · 6 PASOS
      </h2>
      <ol className="mt-5 grid gap-px bg-[var(--v2-rule)] sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="grid gap-2 bg-[var(--v2-paper)] p-5">
            <span className="font-[family-name:var(--v2-display)] text-5xl leading-none text-[var(--v2-ink-soft)]">
              {s.n}
            </span>
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-[var(--v2-ink)]">
              {s.title}
            </h3>
            <p className="text-xs leading-5 text-[var(--v2-ink-soft)]">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
