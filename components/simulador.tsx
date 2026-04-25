"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Effect } from "effect"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import {
  ANIOS_COMPARABLES,
  centimosAEuros,
  limitar,
  eurosACentimos,
  formatearCentimos,
  formatearCentimosEnteros,
  porcentaje,
  type AnioFiscal,
} from "@/lib/formato"
import {
  calcularPerdidaAcumulada,
  compararAjustadoPorIpc,
  configuracionControlSalario,
  type ComparacionAjustadaPorIpc,
  type DesgloseLiquidado,
  type PerdidaAcumulada,
} from "@/lib/domain/progresividad"
import { useContadorAnimado } from "@/lib/animacion"
import { cn } from "@/lib/utils"

function SimuladorImpl() {
  const [salarioCentimos, fijarSalarioCentimos] = React.useState<number>(
    configuracionControlSalario.valorPorDefectoCentimos
  )
  const [anioComparado, fijarAnioComparado] = React.useState<AnioFiscal>(2019)
  const [precisoTocado, fijarPrecisoTocado] = React.useState(false)
  const [sliderPendienteCentimos, fijarSliderPendienteCentimos] =
    React.useState<number | null>(null)
  const [sobrescrituraAbierta, fijarSobrescrituraAbierta] =
    React.useState(false)
  const [vistaCoste, fijarVistaCoste] = React.useState<
    "bruto" | "coste-laboral"
  >("bruto")

  const comparacion = React.useMemo(
    () =>
      Effect.runSync(
        compararAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: salarioCentimos,
          anioComparado,
          anioReferencia: 2026,
        })
      ),
    [salarioCentimos, anioComparado]
  )

  const perdidaAcumulada = React.useMemo(
    () =>
      Effect.runSync(
        calcularPerdidaAcumulada({
          salarioBrutoAnualReferenciaCentimos: salarioCentimos,
          anioComparado,
          anioReferencia: 2026,
        })
      ),
    [salarioCentimos, anioComparado]
  )

  const eurosMostradosSlider = centimosAEuros(
    limitar(
      salarioCentimos,
      configuracionControlSalario.rapido.minimoCentimos,
      configuracionControlSalario.rapido.maximoCentimos
    )
  )

  const aplicarValorSlider = (valorEnEuros: number) => {
    const siguientesCentimos = eurosACentimos(valorEnEuros)
    if (precisoTocado) {
      fijarSliderPendienteCentimos(siguientesCentimos)
      fijarSobrescrituraAbierta(true)
      return
    }
    fijarSalarioCentimos(siguientesCentimos)
  }

  const confirmarSobrescrituraSlider = () => {
    if (sliderPendienteCentimos !== null)
      fijarSalarioCentimos(sliderPendienteCentimos)
    fijarSliderPendienteCentimos(null)
    fijarPrecisoTocado(false)
    fijarSobrescrituraAbierta(false)
  }

  const cancelarSobrescrituraSlider = () => {
    fijarSliderPendienteCentimos(null)
    fijarSobrescrituraAbierta(false)
  }

  const diferencia = comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
  const perdida = diferencia > 0
  const inflacion = Number(comparacion.factorIpc) - 1
  const diferenciaAnimada = useContadorAnimado(Math.abs(diferencia), 500)
  const netoAnimado = useContadorAnimado(
    comparacion.referencia.salarioNetoAnualCentimos,
    500
  )

  return (
    <main className="min-h-svh">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="border-b-2 border-[var(--rule)] pb-4">
          <NavegacionSitio />
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--rule)] pb-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--display)] text-[clamp(3rem,11vw,8rem)] leading-[0.92] tracking-[0.01em] text-[var(--ink)]">
            <span className="block">CALC. IRPF</span>
            <span className="block">
              <span className="text-[var(--danger)]">2012</span>
              <span className="text-[var(--ink-soft)]"> / </span>
              <span>2026</span>
            </span>
          </h1>
          <div className="grid gap-3">
            <p className="text-sm leading-6 text-[var(--ink)]">
              Elige un salario bruto anual y un año pasado. La página calcula el{" "}
              <strong>SALARIO NETO</strong>, el <strong>IRPF</strong> y las{" "}
              <strong>COTIZACIONES</strong>, corrige la inflación y compara ese
              resultado con las reglas de 2026.
            </p>
            <ul className="grid gap-1 text-[11px] tracking-wider text-[var(--ink-soft)] uppercase">
              <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
                <span>Hipótesis</span>
                <span className="text-[var(--ink)]">
                  Soltero · sin descendientes
                </span>
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
              value={centimosAEuros(salarioCentimos)}
              min={centimosAEuros(
                configuracionControlSalario.preciso.minimoCentimos
              )}
              max={centimosAEuros(
                configuracionControlSalario.preciso.maximoCentimos
              )}
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
                const siguientesCentimos = limitar(
                  eurosACentimos(v),
                  configuracionControlSalario.preciso.minimoCentimos,
                  configuracionControlSalario.preciso.maximoCentimos
                )
                fijarPrecisoTocado(true)
                fijarSalarioCentimos(siguientesCentimos)
              }}
              className="grid gap-2"
            >
              <label className="flex items-baseline justify-between text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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
              value={eurosMostradosSlider}
              min={centimosAEuros(
                configuracionControlSalario.rapido.minimoCentimos
              )}
              max={centimosAEuros(
                configuracionControlSalario.rapido.maximoCentimos
              )}
              step={centimosAEuros(
                configuracionControlSalario.rapido.pasoCentimos
              )}
              onValueChange={aplicarValorSlider}
              className="grid gap-2"
            >
              <div className="flex items-baseline justify-between text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
                <Slider.Label>CONTROL RÁPIDO · PASO 1.000 €</Slider.Label>
                <Slider.Value className="font-[family-name:var(--mono)] text-sm font-bold text-[var(--ink)]" />
              </div>
              <Slider.Control className="relative flex h-8 touch-none items-center">
                <Slider.Track className="relative h-3 w-full bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                  <Slider.Indicator className="bg-[var(--mark)]" />
                </Slider.Track>
                <Slider.Thumb className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none" />
              </Slider.Control>
              <div className="flex justify-between text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
                <span>
                  {formatearCentimosEnteros(
                    configuracionControlSalario.rapido.minimoCentimos
                  )}
                </span>
                <span>
                  {formatearCentimosEnteros(
                    configuracionControlSalario.rapido.maximoCentimos
                  )}
                </span>
              </div>
            </Slider.Root>
          </div>

          <div className="grid gap-2 py-6 lg:pl-8">
            <span className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
              AÑO COMPARADO
            </span>
            <RejillaAnios
              valor={anioComparado}
              alCambiar={fijarAnioComparado}
            />
          </div>
        </section>

        <SelloPrincipal
          perdida={perdida}
          diferencia={diferenciaAnimada}
          comparacion={comparacion}
          netoAnimado={netoAnimado}
          inflacion={inflacion}
        />

        <Columnas
          comparacion={comparacion}
          modo={vistaCoste}
          fijarModo={fijarVistaCoste}
        />

        <PerdidaAcumuladaPanel perdidaAcumulada={perdidaAcumulada} />

        <Pasos comparacion={comparacion} />
      </div>

      <Dialog.Root
        open={sobrescrituraAbierta}
        onOpenChange={fijarSobrescrituraAbierta}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[oklch(0.1_0_0/0.72)] backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
            <Dialog.Popup className="relative w-full max-w-md border-2 border-[var(--rule)] bg-[var(--paper)] p-6 text-[var(--ink)] shadow-[6px_6px_0_0_var(--rule)] transition-[opacity,translate] duration-150 outline-none data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0">
              <Dialog.Title className="font-[family-name:var(--display)] text-3xl tracking-wider uppercase">
                RÁPIDO VS PRECISO
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                El control rápido solo introduce salarios entre 10.000 y 100.000
                € en saltos de 1.000 €. Si continúas, se reemplazará el valor
                del campo numérico.
              </Dialog.Description>
              <div className="mt-5 flex flex-wrap justify-end gap-2 text-[11px] tracking-[0.22em] uppercase">
                <Dialog.Close
                  onClick={cancelarSobrescrituraSlider}
                  className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 transition-colors hover:bg-[var(--danger)] hover:text-[var(--paper)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:outline-none"
                >
                  Cancelar
                </Dialog.Close>
                <button
                  type="button"
                  onClick={confirmarSobrescrituraSlider}
                  className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                >
                  Usar control rápido
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const Simulador = dynamic(async () => ({ default: SimuladorImpl }), {
  ssr: false,
  loading: () => <div className="min-h-svh bg-[var(--paper)]" />,
})

function PerdidaAcumuladaPanel({
  perdidaAcumulada,
}: {
  readonly perdidaAcumulada: PerdidaAcumulada
}) {
  const perdida = perdidaAcumulada.totalCentimos > 0
  const promedioCentimos =
    perdidaAcumulada.puntos.length === 0
      ? 0
      : Math.round(
          perdidaAcumulada.totalCentimos / perdidaAcumulada.puntos.length
        )

  return (
    <section className="grid gap-5 border-b-2 border-[var(--rule)] py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="grid content-start gap-3">
        <span
          className={cn(
            "w-fit px-2 py-0.5 text-[10px] font-bold tracking-[0.35em] uppercase",
            perdida
              ? "bg-[var(--danger)] text-[var(--paper)]"
              : "bg-[var(--gain)] text-[var(--paper)]"
          )}
        >
          {perdida ? "PÉRDIDA ACUMULADA" : "GANANCIA ACUMULADA"}
        </span>
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          De {perdidaAcumulada.anioInicial} a {perdidaAcumulada.anioReferencia}
        </h2>
        <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,8vw,5rem)] leading-none text-[var(--ink)] tabular-nums">
          {formatearCentimos(Math.abs(perdidaAcumulada.totalCentimos))}
        </p>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          Suma de la diferencia anual de poder adquisitivo neto de cada año
          comparado, reexpresada en euros de {perdidaAcumulada.anioReferencia}.
          Promedio anual:{" "}
          <strong className="text-[var(--ink)]">
            {formatearCentimos(Math.abs(promedioCentimos))}
          </strong>
          .
        </p>
      </div>
      <ol className="grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
        {perdidaAcumulada.puntos.map((punto) => {
          const puntoPerdida =
            punto.diferenciaPoderAdquisitivoNetoAnualCentimos > 0
          return (
            <li
              key={punto.anioComparado}
              className="flex items-baseline justify-between gap-3 bg-[var(--paper)] p-3"
            >
              <span className="font-[family-name:var(--display)] text-2xl leading-none tracking-wider text-[var(--ink)]">
                {punto.anioComparado}
              </span>
              <span
                className={cn(
                  "font-[family-name:var(--mono)] text-sm font-bold tabular-nums",
                  puntoPerdida ? "text-[var(--danger)]" : "text-[var(--gain)]"
                )}
              >
                {formatearCentimos(
                  Math.abs(punto.diferenciaPoderAdquisitivoNetoAnualCentimos)
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function RejillaAnios({
  valor,
  alCambiar,
}: {
  readonly valor: AnioFiscal
  readonly alCambiar: (anio: AnioFiscal) => void
}) {
  return (
    <div role="radiogroup" className="grid grid-cols-7 gap-px bg-[var(--rule)]">
      {ANIOS_COMPARABLES.map((anio) => {
        const activo = anio === valor
        return (
          <button
            key={anio}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => alCambiar(anio)}
            className={cn(
              "h-12 transition-colors",
              "font-[family-name:var(--mono)] text-[11px] font-bold tracking-wider tabular-nums",
              "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
              activo
                ? "bg-[var(--mark)] text-[var(--mark-ink)]"
                : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
            )}
          >
            {anio}
          </button>
        )
      })}
    </div>
  )
}

function SelloPrincipal({
  perdida,
  diferencia,
  comparacion,
  netoAnimado,
  inflacion,
}: {
  readonly perdida: boolean
  readonly diferencia: number
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly netoAnimado: number
  readonly inflacion: number
}) {
  return (
    <section className="grid border-b-2 border-[var(--rule)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="grid gap-3 border-[var(--rule)] py-6 lg:border-r-2 lg:pr-8">
        <span className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
          <span
            className={cn(
              "px-2 py-0.5 font-bold tracking-[0.4em]",
              perdida
                ? "bg-[var(--danger)] text-[var(--paper)]"
                : "bg-[var(--gain)] text-[var(--paper)]"
            )}
          >
            {perdida ? "PÉRDIDA" : "GANANCIA"}
          </span>
          <span className="text-[var(--ink-soft)]">
            poder adquisitivo neto · anual
          </span>
        </span>
        <div className="font-[family-name:var(--display)] text-[clamp(3rem,10vw,8rem)] leading-[0.85] text-[var(--ink)] tabular-nums">
          {formatearCentimos(diferencia)}
        </div>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          Si las normas de{" "}
          <span className="text-[var(--ink)]">{comparacion.anioComparado}</span>{" "}
          se aplicaran a un salario equivalente, el neto real{" "}
          {perdida ? "habría dejado más" : "habría dejado menos"} que la
          legislación actual. Equivalente a{" "}
          <strong className="text-[var(--ink)]">
            {formatearCentimos(
              Math.abs(
                comparacion.diferenciaPoderAdquisitivoNetoMensualCentimos
              )
            )}
          </strong>{" "}
          al mes.
        </p>
      </div>
      <div className="grid content-start gap-3 py-6 lg:pl-8">
        <span className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
          Hoy · 2026
        </span>
        <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,7vw,4rem)] leading-none text-[var(--ink)] tabular-nums">
          {formatearCentimos(netoAnimado)}
        </p>
        <ul className="grid gap-1 text-[11px] tracking-wider text-[var(--ink-soft)] uppercase">
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>IPC acumulado</span>
            <span className="text-[var(--ink)] tabular-nums">
              {porcentaje.format(inflacion)}
            </span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>IRPF final 2026</span>
            <span className="text-[var(--ink)] tabular-nums">
              {formatearCentimos(comparacion.referencia.irpfFinalCentimos)}
            </span>
          </li>
          <li className="flex justify-between border-t border-dashed border-[var(--rule)] py-1">
            <span>SS trabajador</span>
            <span className="text-[var(--ink)] tabular-nums">
              {formatearCentimos(
                comparacion.referencia.cotizacionTrabajadorCentimos
              )}
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

function Columnas({
  comparacion,
  modo,
  fijarModo,
}: {
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly modo: "bruto" | "coste-laboral"
  readonly fijarModo: (modo: "bruto" | "coste-laboral") => void
}) {
  return (
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          MISMO SALARIO, DOS REGLAS
        </h2>
        <div
          role="tablist"
          aria-label="Base de la comparación"
          className="inline-flex divide-x-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-[11px] tracking-[0.22em] uppercase"
        >
          {(["bruto", "coste-laboral"] as const).map((modoColumna) => {
            const activo = modo === modoColumna
            return (
              <button
                key={modoColumna}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => fijarModo(modoColumna)}
                className={cn(
                  "px-3 py-2 transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
                  activo
                    ? "bg-[var(--rule)] text-[var(--paper)] hover:bg-[var(--rule)]"
                    : "bg-[var(--paper)] hover:bg-[var(--mark)]"
                )}
              >
                {modoColumna === "bruto" ? "Salario bruto" : "Coste laboral"}
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-px bg-[var(--rule)] lg:grid-cols-2">
        <Columna
          rotuloSuperior={`leyes ${comparacion.anioComparado}`}
          titulo={String(comparacion.anioComparado)}
          subtitulo={`euros de ${comparacion.anioReferencia}`}
          etiquetaBase={modo === "bruto" ? "BRUTO" : "COSTE LABORAL"}
          baseCentimos={
            modo === "bruto"
              ? comparacion.comparado.ajustado.salarioBrutoAnualCentimos
              : comparacion.comparado.ajustado.costeLaboralCentimos
          }
          desglose={comparacion.comparado.ajustado}
          variante="comparado"
        />
        <Columna
          rotuloSuperior="legislación actual"
          titulo={String(comparacion.anioReferencia)}
          subtitulo="año de referencia"
          etiquetaBase={modo === "bruto" ? "BRUTO" : "COSTE LABORAL"}
          baseCentimos={
            modo === "bruto"
              ? comparacion.referencia.salarioBrutoAnualCentimos
              : comparacion.referencia.costeLaboralCentimos
          }
          desglose={comparacion.referencia}
          variante="actual"
        />
      </div>
    </section>
  )
}

function Columna({
  rotuloSuperior,
  titulo,
  subtitulo,
  etiquetaBase,
  baseCentimos,
  desglose,
  variante,
}: {
  readonly rotuloSuperior: string
  readonly titulo: string
  readonly subtitulo: string
  readonly etiquetaBase: string
  readonly baseCentimos: number
  readonly desglose: DesgloseLiquidado
  readonly variante: "actual" | "comparado"
}) {
  const carga =
    (desglose.cotizacionTrabajadorCentimos + desglose.irpfFinalCentimos) /
    baseCentimos
  const cuna =
    (desglose.costeLaboralCentimos - desglose.salarioNetoAnualCentimos) /
    desglose.costeLaboralCentimos
  const etiquetaCarga =
    etiquetaBase === "BRUTO" ? "CARGA SOBRE BRUTO" : "CARGA SOBRE COSTE"
  return (
    <article
      className={cn(
        "grid gap-4 bg-[var(--paper)] p-4 sm:p-6",
        variante === "actual" &&
          "bg-[color-mix(in_oklab,var(--paper),var(--mark)_18%)]"
      )}
    >
      <header className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
          {rotuloSuperior}
        </p>
        <p className="font-[family-name:var(--display)] text-[clamp(2rem,6vw,3rem)] leading-none tracking-wider text-[var(--ink)]">
          {titulo}
        </p>
      </header>
      <p className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
        {subtitulo}
      </p>
      <ul className="grid gap-0 text-sm">
        <Fila etiqueta={etiquetaBase} valor={formatearCentimos(baseCentimos)} />
        <Fila
          etiqueta="SS TRABAJADOR"
          valor={`−${formatearCentimos(desglose.cotizacionTrabajadorCentimos)}`}
          peligro
        />
        <Fila
          etiqueta="IRPF FINAL"
          valor={`−${formatearCentimos(desglose.irpfFinalCentimos)}`}
          peligro
        />
        <Fila etiqueta={etiquetaCarga} valor={porcentaje.format(carga)} />
        <Fila etiqueta="CUÑA LABORAL" valor={porcentaje.format(cuna)} />
      </ul>
      <footer className="mt-2 flex flex-wrap items-baseline justify-between gap-3 border-t-2 border-[var(--rule)] pt-3">
        <span className="shrink-0 text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
          Salario neto anual
        </span>
        <span className="font-[family-name:var(--display)] text-[clamp(1.5rem,4.5vw,2.25rem)] tracking-wider text-[var(--ink)] tabular-nums">
          {formatearCentimos(desglose.salarioNetoAnualCentimos)}
        </span>
      </footer>
    </article>
  )
}

function Fila({
  etiqueta,
  valor,
  peligro,
}: {
  readonly etiqueta: string
  readonly valor: string
  readonly peligro?: boolean
}) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-dashed border-[var(--rule)]/30 py-2 last:border-b-0">
      <span
        className={cn(
          "text-[11px] tracking-wider uppercase",
          peligro ? "text-[var(--danger)]" : "text-[var(--ink-soft)]"
        )}
      >
        {etiqueta}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--mono)] text-sm font-bold tabular-nums",
          peligro ? "text-[var(--danger)]" : "text-[var(--ink)]"
        )}
      >
        {valor}
      </span>
    </li>
  )
}

function Pasos({
  comparacion,
}: {
  readonly comparacion: ComparacionAjustadaPorIpc
}) {
  const factor = Number(comparacion.factorIpc)
  const pasos = [
    {
      numero: "01",
      titulo: "PRIMERO IGUALAMOS EUROS",
      cuerpo: `No comparamos euros nominales. Aplicamos el factor IPC acumulado ${factor.toFixed(4)}: ${formatearCentimos(comparacion.comparado.salarioBrutoNominalAnualCentimos)} de ${comparacion.anioComparado} compraban aproximadamente lo mismo que ${formatearCentimos(comparacion.referencia.salarioBrutoAnualCentimos)} en ${comparacion.anioReferencia}.`,
    },
    {
      numero: "02",
      titulo: "RESTAMOS LA COTIZACIÓN DEL TRABAJADOR",
      cuerpo: `Del salario bruto sale primero la cotización del trabajador. Con las reglas de ${comparacion.anioComparado}, reexpresada en euros de ${comparacion.anioReferencia}, son ${formatearCentimos(comparacion.comparado.ajustado.cotizacionTrabajadorCentimos)}. Con las reglas de ${comparacion.anioReferencia} son ${formatearCentimos(comparacion.referencia.cotizacionTrabajadorCentimos)}.`,
    },
    {
      numero: "03",
      titulo: "CONSTRUIMOS LA BASE DEL IRPF",
      cuerpo:
        "Después entran los gastos fijos y la reducción por rendimientos del trabajo. Ese tramo del cálculo convierte el rendimiento del salario en base imponible: la cantidad sobre la que empiezan a aplicarse los tramos del IRPF.",
    },
    {
      numero: "04",
      titulo: "APLICAMOS TRAMOS, MÍNIMOS Y DEDUCCIONES",
      cuerpo:
        "El IRPF no se aplica a todo el salario con un único porcentaje. Cada tramo grava solo la parte que cae dentro de su intervalo; luego se descuentan el mínimo personal y, cuando corresponde, la deducción ligada al SMI.",
    },
    {
      numero: "05",
      titulo: "LLEGAMOS AL IRPF FINAL",
      cuerpo: `El cálculo todavía respeta el límite de retención. Tras ese límite, el IRPF final comparable queda en ${formatearCentimos(comparacion.comparado.ajustado.irpfFinalCentimos)} con reglas de ${comparacion.anioComparado}, frente a ${formatearCentimos(comparacion.referencia.irpfFinalCentimos)} con reglas de ${comparacion.anioReferencia}.`,
    },
    {
      numero: "06",
      titulo: "COMPARAMOS EL PODER ADQUISITIVO NETO",
      cuerpo: `Al salario bruto le quitamos cotización del trabajador e IRPF final. La diferencia de poder adquisitivo neto es ${formatearCentimos(comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos)} al año, equivalente a ${formatearCentimos(comparacion.diferenciaPoderAdquisitivoNetoMensualCentimos)} al mes en 12 pagas.`,
    },
  ] as const
  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
        CÁLCULO GUIADO PASO A PASO
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">
        La comparación no pregunta cuánto se cobraba nominalmente en el pasado,
        sino qué pasaría con un salario equivalente por IPC. Por eso cada paso
        separa inflación, cotizaciones, cálculo del IRPF y salario neto.
      </p>
      <ol className="mt-5 grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
        {pasos.map((paso) => (
          <li
            key={paso.numero}
            className="grid gap-2 bg-[var(--paper)] p-4 sm:p-5"
          >
            <span className="font-[family-name:var(--display)] text-[clamp(2.5rem,6vw,3rem)] leading-none text-[var(--ink-soft)]">
              {paso.numero}
            </span>
            <h3 className="text-[11px] tracking-[0.22em] text-[var(--ink)] uppercase">
              {paso.titulo}
            </h3>
            <p className="text-xs leading-5 text-[var(--ink-soft)]">
              {paso.cuerpo}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
