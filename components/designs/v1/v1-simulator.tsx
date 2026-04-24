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

const sliderWarningStorageKey = "irobopf.sliderOverwriteWarningSeen"

function V1SimulatorImpl() {
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
    if (pendingSliderCents !== null) {
      setSalaryCents(pendingSliderCents)
    }
    setSliderWarningSeen(true)
    setPendingSliderCents(null)
    setPreciseTouched(false)
    setOverwriteOpen(false)
  }

  const delta = comparison.netPurchasingPowerDeltaAnnualCents
  const loss = delta > 0
  const inflation = Number(comparison.inflationFactor) - 1
  const animatedDelta = useCountUp(delta, 700)
  const animatedNet = useCountUp(comparison.reference.salaryNetAnnualCents, 700)

  return (
    <main className="min-h-svh">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-5 py-10 sm:px-10 lg:px-14 lg:py-16">
        <header className="flex flex-col gap-6 border-b border-[var(--v1-rule)] pb-8">
          <VariantNav variant="v1" tone="editorial" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.32em] text-[var(--v1-ink-soft)]">
              Reportaje de progresividad · 2012 — 2026
            </p>
            <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.32em] text-[var(--v1-ink-soft)]">
              Lectura número 01
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end">
          <div className="grid gap-5">
            <span className="inline-flex w-fit items-center gap-2 border-b border-[var(--v1-accent)] pb-1 font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
              <span className="size-1 rounded-full bg-[var(--v1-accent)]" />
              La crónica del hachazo silencioso
            </span>
            <h1 className="font-[family-name:var(--v1-display)] text-balance text-[clamp(2.5rem,7vw,5.6rem)] font-light leading-[0.98] tracking-tight text-[var(--v1-ink)]">
              Lo que tu salario
              <br />
              dejaba de ser
              <em className="font-light italic text-[var(--v1-accent)]">, año a año.</em>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--v1-ink-soft)] sm:text-lg sm:leading-8">
              Esta calculadora compara, con las mismas reglas del motor exacto, qué habría
              pasado con un salario equivalente si <em>se aplicasen las leyes</em> de otro
              año frente a 2026. Todo se reexpresa en euros de 2026 para que la inflación
              no enmascare la normativa.
            </p>
          </div>
          <aside className="grid gap-3 border-l-0 border-t border-[var(--v1-rule)] pl-0 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
              Sumario en cifras
            </p>
            <ul className="grid gap-3 text-sm leading-6 text-[var(--v1-ink-soft)]">
              <li>
                <span className="font-[family-name:var(--v1-display)] text-3xl text-[var(--v1-ink)]">
                  {percent.format(inflation)}
                </span>
                <span className="ml-2">de inflación acumulada {comparison.comparedYear}→{comparison.referenceYear}.</span>
              </li>
              <li>
                <span className="font-[family-name:var(--v1-display)] text-3xl text-[var(--v1-ink)]">
                  {COMPARABLE_YEARS.length}
                </span>
                <span className="ml-2">años fiscales en cartera, todos auditables.</span>
              </li>
            </ul>
          </aside>
        </section>

        <section
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start"
          aria-label="Controles del simulador"
        >
          <div className="grid gap-6">
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
                setPreciseTouched(true)
                setSalaryCents(nextCents)
              }}
              className="grid gap-2"
            >
              <label className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
                Tu salario bruto anual en 2026
              </label>
              <NumberField.Group className="grid h-14 grid-cols-[3rem_minmax(0,1fr)_3rem] border-b-2 border-[var(--v1-ink)] bg-transparent">
                <NumberField.Decrement className="font-[family-name:var(--v1-display)] text-2xl text-[var(--v1-ink-soft)] outline-none transition hover:text-[var(--v1-ink)] focus-visible:ring-2 focus-visible:ring-[var(--v1-accent)]/30">
                  −
                </NumberField.Decrement>
                <NumberField.Input className="min-w-0 bg-transparent text-center font-[family-name:var(--v1-display)] text-3xl font-medium text-[var(--v1-ink)] outline-none sm:text-4xl" />
                <NumberField.Increment className="font-[family-name:var(--v1-display)] text-2xl text-[var(--v1-ink-soft)] outline-none transition hover:text-[var(--v1-ink)] focus-visible:ring-2 focus-visible:ring-[var(--v1-accent)]/30">
                  +
                </NumberField.Increment>
              </NumberField.Group>
              <p className="font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-wider text-[var(--v1-ink-soft)]">
                Control preciso · al céntimo
              </p>
            </NumberField.Root>

            <Slider.Root
              value={sliderDisplayEuros}
              min={centsToEuros(salaryControlConfig.quick.minCents)}
              max={centsToEuros(salaryControlConfig.quick.maxCents)}
              step={centsToEuros(salaryControlConfig.quick.stepCents)}
              onValueChange={applySliderValue}
              className="grid gap-2"
            >
              <div className="flex items-baseline justify-between font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-wider text-[var(--v1-ink-soft)]">
                <Slider.Label>Slider pedagógico, al millar</Slider.Label>
                <Slider.Value className="font-[family-name:var(--v1-display)] text-base text-[var(--v1-ink)]" />
              </div>
              <Slider.Control className="relative flex h-7 touch-none items-center">
                <Slider.Track className="h-px w-full bg-[var(--v1-rule)]">
                  <Slider.Indicator className="h-full bg-[var(--v1-accent)]" />
                </Slider.Track>
                <Slider.Thumb className="size-4 rounded-full border border-[var(--v1-accent)] bg-[var(--v1-paper)] shadow-[0_0_0_4px_rgba(0,0,0,0.04)] transition focus-visible:ring-2 focus-visible:ring-[var(--v1-accent)]/40" />
              </Slider.Control>
              <div className="flex justify-between font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-wider text-[var(--v1-ink-soft)]">
                <span>{formatIntegerCents(salaryControlConfig.quick.minCents)}</span>
                <span>{formatIntegerCents(salaryControlConfig.quick.maxCents)}</span>
              </div>
            </Slider.Root>
          </div>

          <div className="grid gap-3">
            <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
              Año comparado · contra 2026
            </p>
            <YearScroller value={comparedYear} onChange={setComparedYear} />
          </div>
        </section>

        <PullQuote loss={loss} delta={animatedDelta} comparison={comparison} animatedNet={animatedNet} inflation={inflation} />

        <ColumnsSection comparison={comparison} mode={costView} setMode={setCostView} />

        <ChaptersSection comparison={comparison} />
      </div>

      <Dialog.Root open={overwriteOpen} onOpenChange={setOverwriteOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[var(--v1-ink)]/40 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-[var(--v1-ink)] bg-[var(--v1-paper)] p-6 shadow-[12px_12px_0_0_var(--v1-ink)]">
            <Dialog.Title className="font-[family-name:var(--v1-display)] text-2xl font-medium text-[var(--v1-ink)]">
              El slider sustituirá tu valor exacto
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-[var(--v1-ink-soft)]">
              El control rápido solo introduce salarios entre 10.000 y 100.000 euros en saltos de 1.000.
              Si continúas, se reemplazará el valor introducido en el campo numérico.
            </Dialog.Description>
            <div className="mt-5 flex flex-wrap justify-end gap-3 font-[family-name:var(--v1-mono)] text-xs uppercase tracking-wider">
              <Dialog.Close
                onClick={() => {
                  setSliderWarningSeen(true)
                  setPendingSliderCents(null)
                }}
                className="border border-[var(--v1-ink)] px-4 py-2 transition hover:bg-[var(--v1-ink)] hover:text-[var(--v1-paper)]"
              >
                Cancelar
              </Dialog.Close>
              <button
                type="button"
                onClick={confirmSliderOverwrite}
                className="bg-[var(--v1-ink)] px-4 py-2 text-[var(--v1-paper)] transition hover:bg-[var(--v1-accent)]"
              >
                Usar valor del slider
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const V1Simulator = dynamic(
  async () => ({ default: V1SimulatorImpl }),
  { ssr: false, loading: () => <div className="min-h-svh bg-[var(--v1-paper)]" /> },
)

function YearScroller({
  value,
  onChange,
}: {
  readonly value: FiscalYear
  readonly onChange: (year: FiscalYear) => void
}) {
  return (
    <div
      className="-mx-1 flex snap-x snap-mandatory items-end gap-1 overflow-x-auto pb-2"
      role="radiogroup"
      aria-label="Año comparado"
    >
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
              "snap-start outline-none transition-all",
              "min-w-[3.4rem] sm:min-w-[3.2rem]",
              "border-b-[3px] py-2 text-left font-[family-name:var(--v1-display)] text-2xl",
              active
                ? "border-[var(--v1-accent)] text-[var(--v1-ink)]"
                : "border-transparent text-[var(--v1-ink-soft)] hover:border-[var(--v1-rule)] hover:text-[var(--v1-ink)]",
              "focus-visible:bg-[var(--v1-accent-soft)]",
            )}
          >
            {String(year).slice(2)}
            <span className="ml-0.5 text-xs align-top opacity-60">&rsquo;{String(year).slice(0, 2)}</span>
          </button>
        )
      })}
    </div>
  )
}

function PullQuote({
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
  const [ref, revealed] = useReveal<HTMLDivElement>()

  return (
    <section
      ref={ref}
      className={cn(
        "grid gap-8 border-y border-[var(--v1-rule)] py-10 transition-all duration-700 sm:py-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14",
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <p className="font-[family-name:var(--v1-display)] text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-[1.15] text-balance text-[var(--v1-ink)]">
        Si las normas de <em className="text-[var(--v1-accent)]">{comparison.comparedYear}</em>{" "}
        se aplicaran hoy a tu salario, tu poder adquisitivo neto{" "}
        <strong
          className={cn(
            "font-medium",
            loss ? "text-[var(--v1-accent)]" : "text-[var(--v1-gain)]",
          )}
        >
          {loss ? "habría sido mayor" : "sería menor"}
        </strong>{" "}
        en{" "}
        <span className="font-[family-name:var(--v1-mono)] text-[1em] tabular-nums">
          {formatCents(Math.abs(delta))}
        </span>{" "}
        anuales — equivalentes a {formatCents(Math.abs(comparison.netPurchasingPowerDeltaMonthlyCents))} al mes en 12 pagas.
      </p>
      <aside className="grid gap-4">
        <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
          Hoy, en 2026
        </p>
        <p className="font-[family-name:var(--v1-display)] text-5xl font-light leading-none tabular-nums text-[var(--v1-ink)]">
          {formatCents(animatedNet)}
        </p>
        <p className="text-sm leading-6 text-[var(--v1-ink-soft)]">
          de salario neto anual con la legislación actual. La inflación acumulada desde {comparison.comparedYear}
          {" "}es del{" "}
          <strong className="text-[var(--v1-ink)]">{percent.format(inflation)}</strong>.
        </p>
      </aside>
    </section>
  )
}

function ColumnsSection({
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
        <div>
          <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
            Capítulo II
          </p>
          <h2 className="mt-2 font-[family-name:var(--v1-display)] text-3xl font-light leading-tight text-[var(--v1-ink)] sm:text-4xl">
            Dos columnas, un salario equivalente
          </h2>
        </div>
        <div className="inline-flex items-stretch self-start font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.22em]">
          {(["gross", "labor-cost"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "border border-[var(--v1-ink)] px-3 py-2 transition first:border-r-0",
                mode === m
                  ? "bg-[var(--v1-ink)] text-[var(--v1-paper)]"
                  : "text-[var(--v1-ink)] hover:bg-[var(--v1-accent-soft)]",
              )}
            >
              {m === "gross" ? "Salario bruto" : "Coste laboral"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ColumnCard
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
          accentClass="text-[var(--v1-gain)]"
        />
        <ColumnCard
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
          accentClass="text-[var(--v1-accent)]"
          current
        />
      </div>
    </section>
  )
}

function ColumnCard({
  eyebrow,
  title,
  subtitle,
  baseLabel,
  baseCents,
  breakdown,
  accentClass,
  current,
}: {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  readonly baseLabel: string
  readonly baseCents: number
  readonly breakdown: LiquidatedBreakdown
  readonly accentClass: string
  readonly current?: boolean
}) {
  const burden = (breakdown.workerContributionCents + breakdown.irpfFinalCents) / baseCents
  const wedge =
    (breakdown.laborCostCents - breakdown.salaryNetAnnualCents) / breakdown.laborCostCents

  return (
    <article className="grid gap-5 border border-[var(--v1-rule)] bg-[color-mix(in_oklab,var(--v1-paper),white_25%)] p-6 sm:p-7">
      <header className="grid gap-1">
        <p className="font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
          {eyebrow}
        </p>
        <h3 className="font-[family-name:var(--v1-display)] text-5xl font-light leading-none text-[var(--v1-ink)] sm:text-6xl">
          {title}
        </h3>
        <p className="text-xs italic text-[var(--v1-ink-soft)]">{subtitle}</p>
      </header>
      <ul className="grid gap-0">
        <Row label={baseLabel} value={formatCents(baseCents)} />
        <Row
          label="Cotización del trabajador"
          value={`−${formatCents(breakdown.workerContributionCents)}`}
          tag={current ? "MEI 2026" : undefined}
          danger
        />
        <Row
          label="IRPF final"
          value={`−${formatCents(breakdown.irpfFinalCents)}`}
          tag={current ? "Tramos 2026" : undefined}
          danger
        />
        <Row label="Carga sobre bruto" value={percent.format(burden)} />
        <Row label="Cuna fiscal laboral" value={percent.format(wedge)} />
      </ul>
      <footer className="mt-1 flex items-baseline justify-between border-t border-[var(--v1-rule)] pt-4">
        <span className="font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-[0.3em] text-[var(--v1-ink-soft)]">
          Salario neto anual
        </span>
        <span
          className={cn(
            "font-[family-name:var(--v1-display)] text-3xl font-medium tabular-nums sm:text-4xl",
            accentClass,
          )}
        >
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
    <li className="flex items-baseline justify-between gap-3 border-b border-dashed border-[var(--v1-rule)] py-2.5 last:border-b-0">
      <span className={cn("text-sm", danger ? "text-[var(--v1-accent)]" : "text-[var(--v1-ink-soft)]")}>
        {label}
        {tag ? (
          <span className="ml-2 inline-block bg-[var(--v1-accent-soft)] px-1.5 py-px font-[family-name:var(--v1-mono)] text-[10px] uppercase tracking-wider text-[var(--v1-accent)]">
            {tag}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--v1-mono)] text-sm font-medium tabular-nums",
          danger ? "text-[var(--v1-accent)]" : "text-[var(--v1-ink)]",
        )}
      >
        {value}
      </span>
    </li>
  )
}

function ChaptersSection({ comparison }: { readonly comparison: InflationAdjustedComparison }) {
  const factor = Number(comparison.inflationFactor)
  const inflationRate = factor - 1
  const chapters = [
    {
      number: "I.",
      title: "La equivalencia por inflación",
      body: (
        <>
          El factor IPC acumulado entre {comparison.comparedYear} y {comparison.referenceYear} es{" "}
          <strong className="text-[var(--v1-ink)]">{factor.toFixed(4)}</strong>, equivalente a una
          inflación del <strong className="text-[var(--v1-ink)]">{percent.format(inflationRate)}</strong>.
          Por eso {formatCents(comparison.compared.nominalGrossAnnualCents)} nominales del año
          comparado dialogan con {formatCents(comparison.reference.grossAnnualCents)} de hoy.
        </>
      ),
    },
    {
      number: "II.",
      title: "Cotizaciones sociales",
      body: (
        <>
          La cotización del trabajador pasa de{" "}
          {formatCents(comparison.compared.adjusted.workerContributionCents)} ajustados a{" "}
          {formatCents(comparison.reference.workerContributionCents)} en {comparison.referenceYear}.
          La vista de coste laboral incorpora también la cotización empresarial.
        </>
      ),
    },
    {
      number: "III.",
      title: "Reducción y base del IRPF",
      body: (
        <>
          El motor aplica gastos fijos, reducción por rendimientos del trabajo y base imponible
          antes de calcular cuotas. Aquí aparecen muchos de los umbrales que cambiaron a lo largo
          del periodo.
        </>
      ),
    },
    {
      number: "IV.",
      title: "Tramos, mínimos y deducciones",
      body: (
        <>
          Una vez calculada la base, se aplican tramos de IRPF, mínimo personal y deducción SMI
          cuando corresponde. Esta versión muestra el impacto agregado y dejará el rastro completo
          en la siguiente iteración del proyecto.
        </>
      ),
    },
    {
      number: "V.",
      title: "Límite de retención e IRPF final",
      body: (
        <>
          El IRPF final comparable es{" "}
          {formatCents(comparison.compared.adjusted.irpfFinalCents)} para {comparison.comparedYear}{" "}
          frente a {formatCents(comparison.reference.irpfFinalCents)} en {comparison.referenceYear}.
        </>
      ),
    },
    {
      number: "VI.",
      title: "Salario neto y pérdida o ganancia real",
      body: (
        <>
          La diferencia de poder adquisitivo frente a {comparison.referenceYear} es de{" "}
          {formatCents(comparison.netPurchasingPowerDeltaAnnualCents)} al año, equivalente a{" "}
          {formatCents(comparison.netPurchasingPowerDeltaMonthlyCents)} al mes en 12 pagas. Si el
          importe es positivo, el año comparado dejaba más neto real que la legislación actual.
        </>
      ),
    },
  ] as const

  return (
    <section className="grid gap-6">
      <div className="grid gap-1">
        <p className="font-[family-name:var(--v1-mono)] text-[11px] uppercase tracking-[0.3em] text-[var(--v1-accent)]">
          Capítulo III
        </p>
        <h2 className="font-[family-name:var(--v1-display)] text-3xl font-light leading-tight text-[var(--v1-ink)] sm:text-4xl">
          El cálculo, contado paso a paso
        </h2>
      </div>
      <ol className="grid gap-0">
        {chapters.map((chapter) => (
          <li
            key={chapter.number}
            className="grid gap-4 border-b border-[var(--v1-rule)] py-6 last:border-b-0 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-8"
          >
            <span className="font-[family-name:var(--v1-display)] text-3xl italic text-[var(--v1-accent)]">
              {chapter.number}
            </span>
            <div className="grid max-w-3xl gap-2">
              <h3 className="font-[family-name:var(--v1-display)] text-xl font-medium text-[var(--v1-ink)] sm:text-2xl">
                {chapter.title}
              </h3>
              <p className="text-sm leading-7 text-[var(--v1-ink-soft)] sm:text-base">
                {chapter.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
