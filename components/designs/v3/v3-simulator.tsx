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
import { useCountUp, useReveal } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { HandArrow, HandUnderline, PaperTexture } from "./v3-shared"

const sliderWarningStorageKey = "irobopf.sliderOverwriteWarningSeen"

function V3SimulatorImpl() {
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
  const animatedDelta = useCountUp(Math.abs(delta), 700)
  const animatedNet = useCountUp(comparison.reference.salaryNetAnnualCents, 700)

  return (
    <main className="relative min-h-svh overflow-hidden">
      <PaperTexture />
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-14 px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <header className="grid gap-5">
          <VariantNav variant="v3" tone="notebook" />
          <div className="flex flex-wrap items-baseline justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[var(--v3-ink-soft)]">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--v3-accent)]" />
              Cuaderno de campo · cálculo en vivo
            </span>
            <span className="font-[family-name:var(--v3-mono)] text-[10px]">03 / 03 · simulador</span>
          </div>
        </header>

        <Hero
          comparison={comparison}
          loss={loss}
          inflation={inflation}
          animatedDelta={animatedDelta}
          animatedNet={animatedNet}
        />

        <SalaryNote
          salaryCents={salaryCents}
          sliderDisplayEuros={sliderDisplayEuros}
          comparedYear={comparedYear}
          onPreciseChange={(c) => {
            setPreciseTouched(true)
            setSalaryCents(c)
          }}
          onSliderChange={applySliderValue}
          onYearChange={setComparedYear}
        />

        <Diptych
          comparison={comparison}
          mode={costView}
          setMode={setCostView}
        />

        <Steps comparison={comparison} />
      </div>

      <Dialog.Root open={overwriteOpen} onOpenChange={setOverwriteOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[var(--v3-ink)]/40 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-[var(--v3-rule)] bg-[var(--v3-paper)] p-6 shadow-2xl rounded-[24px]">
            <Dialog.Title className="font-[family-name:var(--v3-display)] text-3xl">
              ¿Cambiamos el valor exacto?
            </Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--v3-ink-soft)]">
              El control rápido solo introduce salarios entre 10.000 y 100.000 € en saltos de 1.000.
              Si continuamos, reemplazamos el valor del campo numérico.
            </Dialog.Description>
            <div className="mt-5 flex flex-wrap justify-end gap-2 text-sm">
              <Dialog.Close
                onClick={() => {
                  setSliderWarningSeen(true)
                  setPendingSliderCents(null)
                }}
                className="rounded-full border border-[var(--v3-rule)] px-5 py-2 transition hover:bg-[var(--v3-paper-2)]"
              >
                Cancelar
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmSliderOverwrite}
                className="rounded-full bg-[var(--v3-accent)] px-5 py-2 text-white transition hover:bg-[oklch(0.50_0.22_35)]"
              >
                Sí, usar el slider
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const V3Simulator = dynamic(
  async () => ({ default: V3SimulatorImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v3-paper)]" /> },
)

function Hero({
  comparison,
  loss,
  inflation,
  animatedDelta,
  animatedNet,
}: {
  readonly comparison: InflationAdjustedComparison
  readonly loss: boolean
  readonly inflation: number
  readonly animatedDelta: number
  readonly animatedNet: number
}) {
  const [ref, revealed] = useReveal<HTMLDivElement>()
  return (
    <section
      ref={ref}
      className={cn(
        "grid gap-8 transition-all duration-700",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
      )}
    >
      <h1 className="font-[family-name:var(--v3-display)] text-balance text-[clamp(2.6rem,7.5vw,6rem)] font-normal leading-[0.98] tracking-tight">
        Si las leyes de{" "}
        <span className="relative inline-block">
          <span className="text-[var(--v3-accent)]">{comparison.comparedYear}</span>
          <HandUnderline className="absolute -bottom-2 left-0 h-2 w-full text-[var(--v3-accent)]" />
        </span>
        <br />
        se aplicaran a tu salario,
        <br />
        <em className="italic text-[var(--v3-ink-soft)]">
          {loss ? "habrías ganado" : "habrías perdido"} en términos reales.
        </em>
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 sm:items-end">
        <p className="max-w-md text-base leading-7 text-[var(--v3-ink-soft)] sm:text-lg sm:leading-8">
          Este cuaderno mide la <strong className="text-[var(--v3-ink)]">progresividad en frío</strong>:
          comparamos un salario equivalente por IPC bajo dos legislaciones distintas y dejamos las
          cuentas a la vista. La inflación acumulada es del{" "}
          <strong className="text-[var(--v3-ink)]">{percent.format(inflation)}</strong>.
        </p>
        <div className="grid gap-4 rounded-[28px] border border-[var(--v3-rule)] bg-[var(--v3-paper-2)]/40 p-6 sm:p-7">
          <div className="grid gap-1">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              {loss ? "Pérdida de poder adquisitivo · anual" : "Ganancia de poder adquisitivo · anual"}
            </p>
            <p
              className={cn(
                "font-[family-name:var(--v3-display)] text-5xl leading-none tabular-nums sm:text-6xl",
                loss ? "text-[var(--v3-accent)]" : "text-[var(--v3-secondary)]",
              )}
            >
              {formatCents(animatedDelta)}
            </p>
            <p className="text-sm text-[var(--v3-ink-soft)]">
              ≈ {formatCents(Math.abs(comparison.netPurchasingPowerDeltaMonthlyCents))} al mes en 12 pagas
            </p>
          </div>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-3 border-t border-dashed border-[var(--v3-rule)] pt-4">
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              Hoy, neto
            </span>
            <span className="text-right font-[family-name:var(--v3-display)] text-2xl tabular-nums text-[var(--v3-ink)] sm:text-3xl">
              {formatCents(animatedNet)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function SalaryNote({
  salaryCents,
  sliderDisplayEuros,
  comparedYear,
  onPreciseChange,
  onSliderChange,
  onYearChange,
}: {
  readonly salaryCents: number
  readonly sliderDisplayEuros: number
  readonly comparedYear: FiscalYear
  readonly onPreciseChange: (cents: number) => void
  readonly onSliderChange: (euros: number) => void
  readonly onYearChange: (year: FiscalYear) => void
}) {
  return (
    <section className="relative grid gap-7 rounded-[32px] border border-[var(--v3-rule)] bg-[color-mix(in_oklab,var(--v3-paper),white_30%)] p-6 sm:p-8 lg:p-10">
      <div className="absolute -left-3 -top-3 hidden text-[var(--v3-accent)] sm:block">
        <HandArrow className="h-8 w-16 -rotate-12" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="grid gap-4">
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
              onPreciseChange(next)
            }}
            className="grid gap-2"
          >
            <label className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              Tu salario bruto anual
            </label>
            <NumberField.Group className="grid h-16 grid-cols-[3rem_minmax(0,1fr)_3rem] rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)]">
              <NumberField.Decrement className="font-[family-name:var(--v3-display)] text-2xl text-[var(--v3-ink-soft)] transition hover:text-[var(--v3-accent)]">
                −
              </NumberField.Decrement>
              <NumberField.Input className="min-w-0 bg-transparent px-3 text-center font-[family-name:var(--v3-display)] text-3xl text-[var(--v3-ink)] outline-none sm:text-4xl" />
              <NumberField.Increment className="font-[family-name:var(--v3-display)] text-2xl text-[var(--v3-ink-soft)] transition hover:text-[var(--v3-accent)]">
                +
              </NumberField.Increment>
            </NumberField.Group>
          </NumberField.Root>

          <Slider.Root
            value={sliderDisplayEuros}
            min={centsToEuros(salaryControlConfig.quick.minCents)}
            max={centsToEuros(salaryControlConfig.quick.maxCents)}
            step={centsToEuros(salaryControlConfig.quick.stepCents)}
            onValueChange={onSliderChange}
            className="grid gap-2"
          >
            <div className="flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-[var(--v3-ink-soft)]">
              <Slider.Label>Slider · al millar</Slider.Label>
              <Slider.Value className="font-[family-name:var(--v3-mono)] text-sm text-[var(--v3-ink)]" />
            </div>
            <Slider.Control className="relative flex h-7 touch-none items-center">
              <Slider.Track className="h-1.5 w-full rounded-full bg-[var(--v3-paper-2)]">
                <Slider.Indicator className="h-full rounded-full bg-[var(--v3-accent)]" />
              </Slider.Track>
              <Slider.Thumb className="size-5 rounded-full border-2 border-[var(--v3-accent)] bg-[var(--v3-paper)] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.2)] transition focus-visible:scale-110" />
            </Slider.Control>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
              <span>{formatIntegerCents(salaryControlConfig.quick.minCents)}</span>
              <span>{formatIntegerCents(salaryControlConfig.quick.maxCents)}</span>
            </div>
          </Slider.Root>
        </div>

        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
            ¿Contra qué año comparamos?
          </p>
          <div className="-mx-2 flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-2">
            {COMPARABLE_YEARS.map((y) => {
              const active = y === comparedYear
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => onYearChange(y)}
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
          <p className="text-xs italic text-[var(--v3-ink-soft)]">
            Comparamos siempre con 2026 como año de referencia. Los importes se reexpresan en euros
            de 2026 para que la inflación no enmascare la normativa.
          </p>
        </div>
      </div>
    </section>
  )
}

function Diptych({
  comparison,
  mode,
  setMode,
}: {
  readonly comparison: InflationAdjustedComparison
  readonly mode: "gross" | "labor-cost"
  readonly setMode: (mode: "gross" | "labor-cost") => void
}) {
  const [ref, revealed] = useReveal<HTMLDivElement>()
  return (
    <section
      ref={ref}
      className={cn(
        "grid gap-6 transition-all duration-700",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-[family-name:var(--v3-display)] text-balance text-3xl leading-tight sm:text-5xl">
          Dos columnas, <em className="italic text-[var(--v3-ink-soft)]">un mismo cuerpo</em>
        </h2>
        <div className="inline-flex rounded-full border border-[var(--v3-rule)] bg-[var(--v3-paper)] p-1 text-xs">
          {(["gross", "labor-cost"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-4 py-1.5 transition",
                mode === m
                  ? "bg-[var(--v3-ink)] text-[var(--v3-paper)]"
                  : "text-[var(--v3-ink-soft)] hover:text-[var(--v3-ink)]",
              )}
            >
              {m === "gross" ? "Salario bruto" : "Coste laboral"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Panel
          eyebrow={`Si aplicásemos las leyes de ${comparison.comparedYear}`}
          title={String(comparison.comparedYear)}
          subtitle={`Datos ajustados a euros de ${comparison.referenceYear}`}
          baseLabel={mode === "gross" ? "Salario bruto" : "Coste laboral"}
          baseCents={
            mode === "gross"
              ? comparison.compared.adjusted.grossAnnualCents
              : comparison.compared.adjusted.laborCostCents
          }
          breakdown={comparison.compared.adjusted}
          accent="secondary"
        />
        <Panel
          eyebrow="Legislación actual"
          title={String(comparison.referenceYear)}
          subtitle="Año de referencia"
          baseLabel={mode === "gross" ? "Salario bruto" : "Coste laboral"}
          baseCents={
            mode === "gross"
              ? comparison.reference.grossAnnualCents
              : comparison.reference.laborCostCents
          }
          breakdown={comparison.reference}
          accent="accent"
          current
        />
      </div>
    </section>
  )
}

function Panel({
  eyebrow,
  title,
  subtitle,
  baseLabel,
  baseCents,
  breakdown,
  accent,
  current,
}: {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  readonly baseLabel: string
  readonly baseCents: number
  readonly breakdown: LiquidatedBreakdown
  readonly accent: "accent" | "secondary"
  readonly current?: boolean
}) {
  const accentClass = accent === "accent" ? "text-[var(--v3-accent)]" : "text-[var(--v3-secondary)]"
  const burden = (breakdown.workerContributionCents + breakdown.irpfFinalCents) / baseCents
  const wedge =
    (breakdown.laborCostCents - breakdown.salaryNetAnnualCents) / breakdown.laborCostCents

  return (
    <article className="grid gap-5 rounded-[28px] border border-[var(--v3-rule)] bg-[color-mix(in_oklab,var(--v3-paper),white_18%)] p-6 sm:p-7">
      <header className="grid gap-1">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">{eyebrow}</p>
        <h3 className={cn("font-[family-name:var(--v3-display)] text-5xl leading-none sm:text-6xl", accentClass)}>
          {title}
        </h3>
        <p className="text-xs italic text-[var(--v3-ink-soft)]">{subtitle}</p>
      </header>
      <ul className="grid gap-2.5 text-sm">
        <Row label={baseLabel} value={formatCents(baseCents)} />
        <Row
          label="Cotización del trabajador"
          value={`−${formatCents(breakdown.workerContributionCents)}`}
          tag={current ? "MEI" : undefined}
          danger
        />
        <Row label="IRPF final" value={`−${formatCents(breakdown.irpfFinalCents)}`} danger />
        <Row label="Carga sobre bruto" value={percent.format(burden)} />
        <Row label="Cuna laboral" value={percent.format(wedge)} />
      </ul>
      <footer className="flex items-baseline justify-between border-t border-dashed border-[var(--v3-rule)] pt-4">
        <span className="text-xs uppercase tracking-[0.22em] text-[var(--v3-ink-soft)]">
          Salario neto anual
        </span>
        <span className={cn("font-[family-name:var(--v3-display)] text-3xl tabular-nums sm:text-4xl", accentClass)}>
          {formatCents(breakdown.salaryNetAnnualCents)}
        </span>
      </footer>
    </article>
  )
}

function Row({
  label,
  value,
  tag,
  danger,
}: {
  readonly label: string
  readonly value: string
  readonly tag?: string | undefined
  readonly danger?: boolean
}) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-[var(--v3-ink-soft)]">
        {label}
        {tag ? (
          <span className="ml-2 inline-block rounded-full bg-[var(--v3-accent-soft)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--v3-accent)]">
            {tag}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--v3-mono)] tabular-nums",
          danger ? "text-[var(--v3-accent)]" : "text-[var(--v3-ink)]",
        )}
      >
        {value}
      </span>
    </li>
  )
}

function Steps({ comparison }: { readonly comparison: InflationAdjustedComparison }) {
  const factor = Number(comparison.inflationFactor)
  const inflationRate = factor - 1
  const steps = [
    {
      n: "i",
      title: "Equivalencia por inflación",
      body: (
        <>
          El factor IPC acumulado es <strong>{factor.toFixed(4)}</strong>, equivalente a{" "}
          <strong>{percent.format(inflationRate)}</strong>. Por eso{" "}
          {formatCents(comparison.compared.nominalGrossAnnualCents)} nominales de{" "}
          {comparison.comparedYear} dialogan con {formatCents(comparison.reference.grossAnnualCents)} de hoy.
        </>
      ),
    },
    {
      n: "ii",
      title: "Cotizaciones sociales",
      body: (
        <>
          La cotización del trabajador pasa de{" "}
          {formatCents(comparison.compared.adjusted.workerContributionCents)} ajustados a{" "}
          {formatCents(comparison.reference.workerContributionCents)} en {comparison.referenceYear}.
        </>
      ),
    },
    {
      n: "iii",
      title: "Reducción y base del IRPF",
      body: (
        <>
          Gastos fijos, reducción por rendimientos del trabajo y base imponible antes de cuotas.
          Aquí cambian muchos umbrales entre años.
        </>
      ),
    },
    {
      n: "iv",
      title: "Tramos, mínimos y deducciones",
      body: (
        <>
          Tramos progresivos, mínimo personal y deducción SMI cuando corresponde. La explicación
          v1 muestra el impacto agregado.
        </>
      ),
    },
    {
      n: "v",
      title: "Límite de retención e IRPF final",
      body: (
        <>
          IRPF final comparable {formatCents(comparison.compared.adjusted.irpfFinalCents)} vs{" "}
          {formatCents(comparison.reference.irpfFinalCents)} en {comparison.referenceYear}.
        </>
      ),
    },
    {
      n: "vi",
      title: "Salario neto y delta real",
      body: (
        <>
          Δ poder adquisitivo neto{" "}
          <strong>{formatCents(comparison.netPurchasingPowerDeltaAnnualCents)}</strong> al año,
          equivalente a {formatCents(comparison.netPurchasingPowerDeltaMonthlyCents)} al mes.
        </>
      ),
    },
  ] as const

  return (
    <section className="grid gap-6">
      <h2 className="font-[family-name:var(--v3-display)] text-balance text-3xl leading-tight sm:text-5xl">
        El cálculo, <em className="italic text-[var(--v3-ink-soft)]">explicado en seis trazos</em>
      </h2>
      <ol className="grid gap-px overflow-hidden rounded-[28px] border border-[var(--v3-rule)] bg-[var(--v3-rule)] sm:grid-cols-2">
        {steps.map((s) => (
          <li
            key={s.n}
            className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-4 bg-[var(--v3-paper)] p-5 sm:p-6"
          >
            <span className="font-[family-name:var(--v3-display)] text-3xl italic text-[var(--v3-accent)] sm:text-4xl">
              {s.n}.
            </span>
            <div className="grid gap-2">
              <h3 className="font-[family-name:var(--v3-display)] text-xl sm:text-2xl">
                {s.title}
              </h3>
              <p className="text-sm leading-6 text-[var(--v3-ink-soft)]">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
