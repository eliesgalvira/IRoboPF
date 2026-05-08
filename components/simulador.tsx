"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { useLocalStorage } from "@uidotdev/usehooks"
import { Effect } from "effect"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import { Button } from "@/components/ui/button"
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
  compararPasadoAjustadoPorIpc,
  configuracionControlSalario,
  type ComparacionAjustadaPorIpc,
  type DesgloseLiquidado,
  type PerdidaAcumulada,
} from "@/lib/dominio/auditoria/auditoria-progresividad-frio"
import { useContadorAnimado } from "@/lib/animacion"
import { cn } from "@/lib/utils"

type VistaComparacion = "bruto" | "coste-laboral" | "pasado"

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
  const [advertenciaSliderVista, fijarAdvertenciaSliderVista] = useLocalStorage(
    "irobopf.sliderOverwriteWarningSeen",
    false
  )
  const ignorarCambioPrecisoPorSlider = React.useRef(false)
  const [vistaCoste, fijarVistaCoste] =
    React.useState<VistaComparacion>("bruto")

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

  const comparacionPasada = React.useMemo(
    () =>
      Effect.runSync(
        compararPasadoAjustadoPorIpc({
          salarioBrutoAnualReferenciaCentimos: salarioCentimos,
          anioComparado: 2026,
          anioReferencia: anioComparado,
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
    if (precisoTocado && !advertenciaSliderVista) {
      fijarSliderPendienteCentimos(siguientesCentimos)
      window.setTimeout(() => fijarSobrescrituraAbierta(true), 0)
      return
    }
    fijarPrecisoTocado(false)
    fijarSalarioCentimos(siguientesCentimos)
  }

  const prepararInteraccionSlider = () => {
    if (!advertenciaSliderVista) return
    ignorarCambioPrecisoPorSlider.current = true
    window.setTimeout(() => {
      ignorarCambioPrecisoPorSlider.current = false
    }, 0)
  }

  const confirmarSobrescrituraSlider = () => {
    fijarAdvertenciaSliderVista(true)
    if (sliderPendienteCentimos !== null)
      fijarSalarioCentimos(sliderPendienteCentimos)
    fijarSliderPendienteCentimos(null)
    fijarPrecisoTocado(false)
    fijarSobrescrituraAbierta(false)
  }

  const cancelarSobrescrituraSlider = () => {
    fijarAdvertenciaSliderVista(true)
    fijarSliderPendienteCentimos(null)
    fijarSobrescrituraAbierta(false)
  }

  const cambiarAperturaSobrescritura = (abierta: boolean) => {
    if (abierta) {
      fijarSobrescrituraAbierta(true)
      return
    }
    cancelarSobrescrituraSlider()
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
              Calcula el neto anual y compara años en euros equivalentes. El IPC
              solo pone importes de fechas distintas en la misma escala.
            </p>
            <ul className="grid gap-1 text-sm tracking-wider text-[var(--ink-soft)] uppercase">
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
              step={100}
              format={{
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              }}
              locale="es-ES"
              onValueChange={(v) => {
                if (v === null) return
                if (ignorarCambioPrecisoPorSlider.current) return
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
              <label className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
                SALARIO BRUTO ANUAL EN EUROS DE{" "}
                {vistaCoste === "pasado" ? anioComparado : 2026}
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
              onPointerDownCapture={prepararInteraccionSlider}
              className="grid gap-2"
            >
              <Slider.Label className="sr-only">
                Control rápido · paso 1.000 €
              </Slider.Label>
              <Slider.Control className="relative flex h-8 touch-none items-center">
                <Slider.Track className="relative h-3 w-full bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                  <Slider.Indicator className="bg-[var(--mark)]" />
                </Slider.Track>
                <Slider.Thumb className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none" />
              </Slider.Control>
              <div className="flex justify-between text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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
            <span className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
              {vistaCoste === "pasado" ? "AÑO DE REFERENCIA" : "AÑO COMPARADO"}
            </span>
            <RejillaAnios
              valor={anioComparado}
              alCambiar={fijarAnioComparado}
            />
          </div>
        </section>

        <BandaIpc comparacion={comparacion} inflacion={inflacion} />

        <SelloPrincipal
          perdida={perdida}
          diferencia={diferenciaAnimada}
          comparacion={comparacion}
          netoAnimado={netoAnimado}
        />

        <Columnas
          comparacion={comparacion}
          comparacionPasada={comparacionPasada}
          modo={vistaCoste}
          fijarModo={fijarVistaCoste}
        />

        <PerdidaAcumuladaPanel perdidaAcumulada={perdidaAcumulada} />

        <Pasos comparacion={comparacion} />
      </div>

      <Dialog.Root
        open={sobrescrituraAbierta}
        onOpenChange={cambiarAperturaSobrescritura}
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
                del campo numérico. Esta advertencia solo aparecerá una vez.
              </Dialog.Description>
              <div className="mt-5 flex flex-wrap justify-end gap-2 text-sm tracking-[0.22em] uppercase">
                <Dialog.Close
                  onClick={cancelarSobrescrituraSlider}
                  className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 transition-colors hover:bg-[var(--danger)] hover:text-[var(--paper)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:outline-none"
                >
                  Cancelar
                </Dialog.Close>
                <Button
                  type="button"
                  onClick={confirmarSobrescrituraSlider}
                  variant="unstyled"
                  className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                >
                  Usar control rápido
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

export const Simulador = dynamic(
  () => Promise.resolve({ default: SimuladorImpl }),
  {
    ssr: false,
    loading: () => <div className="min-h-svh bg-[var(--paper)]" />,
  }
)

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
            "w-fit px-2 py-0.5 text-sm font-bold tracking-[0.35em] uppercase",
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
          Cada casilla muestra NETO_REAL_AÑO - NETO_
          {perdidaAcumulada.anioReferencia}: positivo en rojo significa que ese
          año dejaba más neto; negativo en verde significa que{" "}
          {perdidaAcumulada.anioReferencia} deja más neto. Promedio anual:{" "}
          <strong className="text-[var(--ink)]">
            {formatearCentimos(Math.abs(promedioCentimos))}
          </strong>
          .
        </p>
      </div>
      <ol className="grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
        {perdidaAcumulada.puntos.map((punto, indice) => {
          const puntoPerdida =
            punto.diferenciaPoderAdquisitivoNetoAnualCentimos > 0
          const esUltimo = indice === perdidaAcumulada.puntos.length - 1
          const rellenoAntesUltimoLg =
            perdidaAcumulada.puntos.length % 3 === 1 && esUltimo
          const rellenoFinalSm =
            perdidaAcumulada.puntos.length % 2 === 1 && esUltimo
          const rellenoFinalLg =
            perdidaAcumulada.puntos.length % 3 !== 0 && esUltimo
          return (
            <React.Fragment key={punto.anioComparado}>
              {rellenoAntesUltimoLg ? (
                <li
                  aria-hidden="true"
                  className="hidden min-h-[5rem] bg-[var(--paper)] lg:block"
                />
              ) : null}
              <li className="flex items-baseline justify-between gap-3 bg-[var(--paper)] p-3">
                <span className="font-[family-name:var(--display)] text-2xl leading-none tracking-wider text-[var(--ink)]">
                  {punto.anioComparado}
                </span>
                <span className="grid justify-items-end gap-1">
                  <span
                    className={cn(
                      "font-[family-name:var(--mono)] text-sm font-bold tabular-nums",
                      puntoPerdida
                        ? "text-[var(--danger)]"
                        : "text-[var(--gain)]"
                    )}
                  >
                    {formatearCentimosConSigno(
                      punto.diferenciaPoderAdquisitivoNetoAnualCentimos
                    )}
                  </span>
                  <span className="text-[0.65rem] leading-none tracking-[0.18em] text-[var(--ink-soft)] uppercase">
                    {puntoPerdida ? "2026 pierde" : "2026 mejora"}
                  </span>
                </span>
              </li>
              {rellenoFinalSm ? (
                <li
                  aria-hidden="true"
                  className="hidden min-h-[5rem] bg-[var(--paper)] sm:block lg:hidden"
                />
              ) : null}
              {rellenoFinalLg ? (
                <li
                  aria-hidden="true"
                  className="hidden min-h-[5rem] bg-[var(--paper)] lg:block"
                />
              ) : null}
            </React.Fragment>
          )
        })}
      </ol>
    </section>
  )
}

const formatearCentimosConSigno = (centimos: number): string =>
  centimos > 0 ? `+${formatearCentimos(centimos)}` : formatearCentimos(centimos)

function RejillaAnios({
  valor,
  alCambiar,
}: {
  readonly valor: AnioFiscal
  readonly alCambiar: (anio: AnioFiscal) => void
}) {
  return (
    <div
      role="radiogroup"
      className="grid auto-rows-[3.5rem] grid-cols-7 gap-0"
    >
      {ANIOS_COMPARABLES.map((anio, indice) => {
        const activo = anio === valor
        return (
          <button
            key={anio}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => alCambiar(anio)}
            className={cn(
              "m-0 flex h-full w-full appearance-none items-center justify-center border-0 border-[var(--rule)] p-0 transition-colors",
              indice % 7 !== 6 && "border-r",
              indice < 7 && "border-b",
              "font-[family-name:var(--mono)] text-sm font-bold tracking-wider tabular-nums",
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

function BandaIpc({
  comparacion,
  inflacion,
}: {
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly inflacion: number
}) {
  return (
    <section className="grid gap-5 border-b-2 border-[var(--rule)] py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="grid gap-3">
        <p className="flex flex-wrap items-center gap-2 text-sm font-bold tracking-[0.28em] text-[var(--ink-soft)] uppercase">
          <span>Euros</span>
          <span className="bg-[var(--info)] px-2 py-0.5 text-[var(--paper)]">
            equivalentes
          </span>
        </p>
        <dl className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <div className="grid gap-0.5">
            <dt className="text-sm tracking-[0.22em] text-[var(--ink-soft)] uppercase">
              Bruto nominal {comparacion.anioComparado}
            </dt>
            <dd className="font-[family-name:var(--display)] text-[clamp(2.25rem,7vw,4rem)] leading-none text-[var(--ink)] tabular-nums">
              {formatearCentimos(
                comparacion.comparado.salarioBrutoNominalAnualCentimos
              )}
            </dd>
          </div>
          <span className="pb-1 font-[family-name:var(--display)] text-[clamp(2rem,5vw,3.25rem)] leading-none text-[var(--ink-soft)]">
            =
          </span>
          <div className="grid gap-0.5">
            <dt className="text-sm tracking-[0.22em] text-[var(--ink-soft)] uppercase">
              Euros {comparacion.anioReferencia}
            </dt>
            <dd className="font-[family-name:var(--display)] text-[clamp(2.25rem,7vw,4rem)] leading-none text-[var(--ink)] tabular-nums">
              {formatearCentimos(
                comparacion.comparado.ajustado.salarioBrutoAnualCentimos
              )}
            </dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-0.5 lg:justify-items-end">
        <p className="hidden text-sm tracking-[0.16em] text-[var(--ink-soft)] uppercase lg:block">
          En 2026 se usa IPC = 3,00%
        </p>
        <p className="text-sm tracking-[0.22em] text-[var(--ink-soft)] uppercase">
          IPC acumulado
        </p>
        <div className="flex items-center gap-4 lg:block">
          <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,7vw,4.5rem)] leading-none text-[var(--ink)] tabular-nums">
            {porcentaje.format(inflacion)}
          </p>
          <p className="max-w-[12rem] text-sm leading-5 tracking-[0.16em] text-[var(--ink-soft)] uppercase lg:hidden">
            En 2026 se usa IPC = 3,00%
          </p>
        </div>
      </div>
    </section>
  )
}

function SelloPrincipal({
  perdida,
  diferencia,
  comparacion,
  netoAnimado,
}: {
  readonly perdida: boolean
  readonly diferencia: number
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly netoAnimado: number
}) {
  const netoMensualCentimos = Math.round(
    comparacion.referencia.salarioNetoAnualCentimos / 12
  )
  const cunaFiscal =
    comparacion.referencia.costeLaboralCentimos === 0
      ? 0
      : (comparacion.referencia.costeLaboralCentimos -
          comparacion.referencia.salarioNetoAnualCentimos) /
        comparacion.referencia.costeLaboralCentimos

  return (
    <section className="grid border-b-2 border-[var(--rule)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="grid gap-3 border-[var(--rule)] py-6 lg:border-r-2 lg:pr-8">
        <span className="flex items-center gap-2 text-sm tracking-[0.3em] uppercase">
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
      <div className="grid content-between gap-5 py-6 lg:pl-8">
        <div className="grid gap-3">
          <span className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
            De bruto a neto · 2026
          </span>
          <p className="font-[family-name:var(--display)] text-[clamp(3rem,8vw,5rem)] leading-none text-[var(--ink)] tabular-nums">
            {formatearCentimos(netoAnimado)}
          </p>
        </div>
        <dl className="grid gap-x-5 gap-y-3 text-sm tracking-wider uppercase sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="grid gap-0.5">
            <dt className="text-[var(--ink-soft)]">Neto mensual</dt>
            <dd className="font-[family-name:var(--display)] text-[clamp(1.75rem,4vw,2.5rem)] leading-none text-[var(--ink)] tabular-nums">
              {formatearCentimos(netoMensualCentimos)}
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-[var(--ink-soft)]">Cuña fiscal</dt>
            <dd className="font-[family-name:var(--display)] text-[clamp(1.75rem,4vw,2.5rem)] leading-none text-[var(--ink)] tabular-nums">
              {porcentaje.format(cunaFiscal)}
            </dd>
          </div>
        </dl>
        <dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm tracking-wider uppercase">
          <div className="grid gap-0.5">
            <dt className="text-[var(--ink-soft)]">Bruto</dt>
            <dd className="font-[family-name:var(--mono)] font-bold text-[var(--ink)] tabular-nums">
              {formatearCentimosEnteros(
                comparacion.referencia.salarioBrutoAnualCentimos
              )}
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-[var(--danger)]">SS trabajador</dt>
            <dd className="font-[family-name:var(--mono)] font-bold text-[var(--danger)] tabular-nums">
              {`-${formatearCentimos(
                comparacion.referencia.cotizacionTrabajadorCentimos
              )}`}
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-[var(--danger)]">IRPF final</dt>
            <dd className="font-[family-name:var(--mono)] font-bold text-[var(--danger)] tabular-nums">
              {`-${formatearCentimos(comparacion.referencia.irpfFinalCentimos)}`}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Columnas({
  comparacion,
  comparacionPasada,
  modo,
  fijarModo,
}: {
  readonly comparacion: ComparacionAjustadaPorIpc
  readonly comparacionPasada: ComparacionAjustadaPorIpc
  readonly modo: VistaComparacion
  readonly fijarModo: (modo: VistaComparacion) => void
}) {
  const comparacionMostrada =
    modo === "pasado" ? comparacionPasada : comparacion
  const usarCosteLaboral = modo === "coste-laboral"
  const etiquetaBase = usarCosteLaboral ? "COSTE LABORAL REAL" : "BRUTO REAL"
  const opcionesVista = [
    { modo: "bruto", etiqueta: "Salario bruto" },
    { modo: "coste-laboral", etiqueta: "Coste laboral" },
    { modo: "pasado", etiqueta: "Pasado" },
  ] as const satisfies ReadonlyArray<{
    readonly modo: VistaComparacion
    readonly etiqueta: string
  }>

  return (
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          Mismo poder de compra, dos reglas
        </h2>
        <div
          role="tablist"
          aria-label="Base de la comparación"
          className="inline-flex divide-x-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-sm tracking-[0.22em] uppercase"
        >
          {opcionesVista.map((opcion) => {
            const activo = modo === opcion.modo
            return (
              <Button
                key={opcion.modo}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => fijarModo(opcion.modo)}
                variant="unstyled"
                className={cn(
                  "px-3 py-2 transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
                  activo
                    ? "bg-[var(--rule)] text-[var(--paper)] hover:bg-[var(--rule)]"
                    : "bg-[var(--paper)] hover:bg-[var(--mark)]"
                )}
              >
                {opcion.etiqueta}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="mt-4 grid gap-px bg-[var(--rule)] lg:grid-cols-2">
        <Columna
          rotuloSuperior={`leyes ${comparacionMostrada.anioComparado}`}
          titulo={String(comparacionMostrada.anioComparado)}
          subtitulo={`euros reales de ${comparacionMostrada.anioReferencia}`}
          etiquetaBase={etiquetaBase}
          baseCentimos={
            usarCosteLaboral
              ? comparacionMostrada.comparado.ajustado.costeLaboralCentimos
              : comparacionMostrada.comparado.ajustado.salarioBrutoAnualCentimos
          }
          desglose={comparacionMostrada.comparado.ajustado}
          variante="comparado"
        />
        <Columna
          rotuloSuperior={
            modo === "pasado" ? "año de referencia" : "legislación actual"
          }
          titulo={String(comparacionMostrada.anioReferencia)}
          subtitulo={`euros nominales de ${comparacionMostrada.anioReferencia}`}
          etiquetaBase={etiquetaBase}
          baseCentimos={
            usarCosteLaboral
              ? comparacionMostrada.referencia.costeLaboralCentimos
              : comparacionMostrada.referencia.salarioBrutoAnualCentimos
          }
          desglose={comparacionMostrada.referencia}
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
  const etiquetaCarga = etiquetaBase.startsWith("BRUTO")
    ? "CARGA SOBRE BRUTO"
    : "CARGA SOBRE COSTE"
  return (
    <article
      className={cn(
        "grid gap-4 bg-[var(--paper)] p-4 sm:p-6",
        variante === "actual" &&
          "bg-[color-mix(in_oklab,var(--paper),var(--mark)_18%)]"
      )}
    >
      <header className="flex items-baseline justify-between gap-2">
        <p className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
          {rotuloSuperior}
        </p>
        <p className="font-[family-name:var(--display)] text-[clamp(2rem,6vw,3rem)] leading-none tracking-wider text-[var(--ink)]">
          {titulo}
        </p>
      </header>
      <p className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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
        <Fila etiqueta="CUÑA FISCAL" valor={porcentaje.format(cuna)} />
      </ul>
      <footer className="mt-2 flex flex-wrap items-baseline justify-between gap-3 border-t-2 border-[var(--rule)] pt-3">
        <span className="shrink-0 text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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
          "text-sm tracking-wider uppercase",
          peligro === true ? "text-[var(--danger)]" : "text-[var(--ink-soft)]"
        )}
      >
        {etiqueta}
      </span>
      <span
        className={cn(
          "font-[family-name:var(--mono)] text-sm font-bold tabular-nums",
          peligro === true ? "text-[var(--danger)]" : "text-[var(--ink)]"
        )}
      >
        {valor}
      </span>
    </li>
  )
}

function PiezaFormula({
  children,
  tono = "neutro",
}: {
  readonly children: React.ReactNode
  readonly tono?: "neutro" | "calculo" | "limite" | "resultado"
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full min-w-0 items-center border-2 border-[var(--rule)] px-2 py-1 text-left font-[family-name:var(--mono)] text-sm leading-5 font-bold [overflow-wrap:anywhere] break-words whitespace-normal tabular-nums",
        tono === "neutro" && "bg-[var(--paper)] text-[var(--ink)]",
        tono === "calculo" && "bg-[var(--mark)] text-[var(--mark-ink)]",
        tono === "limite" && "bg-[var(--paper-2)] text-[var(--ink)]",
        tono === "resultado" && "bg-[var(--rule)] text-[var(--paper)]"
      )}
    >
      {children}
    </span>
  )
}

function FormulaSimulador({
  children,
}: {
  readonly children: React.ReactNode
}) {
  return (
    <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2 leading-none">
      {children}
    </div>
  )
}

function TarjetaFormula({
  numero,
  titulo,
  children,
}: {
  readonly numero: string
  readonly titulo: string
  readonly children: React.ReactNode
}) {
  return (
    <article className="grid min-w-0 gap-3 border-2 border-[var(--rule)] bg-[var(--paper)] p-4 shadow-[3px_3px_0_0_var(--rule)]">
      <div className="flex min-w-0 items-start gap-3">
        <span className="font-[family-name:var(--display)] text-4xl leading-none text-[var(--ink-soft)]">
          {numero}
        </span>
        <h3 className="pt-1 text-sm leading-5 font-bold tracking-[0.22em] text-[var(--ink)] uppercase">
          {titulo}
        </h3>
      </div>
      <div className="grid min-w-0 gap-2">{children}</div>
    </article>
  )
}

function EnlaceNormativo({
  href,
  children,
}: {
  readonly href: string
  readonly children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="font-bold underline decoration-[var(--rule)] underline-offset-4"
    >
      {children}
    </a>
  )
}

function LineaRastroSimulador({
  etiqueta,
  formula,
  pasado,
  actual,
  destacado = false,
}: {
  readonly etiqueta: string
  readonly formula: string
  readonly pasado: string
  readonly actual: string
  readonly destacado?: boolean
}) {
  return (
    <div
      className={cn(
        "grid gap-2 border border-[var(--rule)] bg-[var(--paper-2)] p-3 md:grid-cols-[minmax(9rem,0.75fr)_minmax(12rem,1.2fr)_minmax(7rem,0.65fr)_minmax(7rem,0.65fr)]",
        destacado && "bg-[color-mix(in_oklab,var(--mark),var(--paper)_68%)]"
      )}
    >
      <dt className="text-sm font-bold tracking-[0.18em] uppercase">
        {etiqueta}
      </dt>
      <dd className="font-[family-name:var(--mono)] text-sm break-words text-[var(--ink-soft)]">
        {formula}
      </dd>
      <dd className="font-[family-name:var(--mono)] text-sm font-bold tabular-nums md:text-right">
        {pasado}
      </dd>
      <dd className="font-[family-name:var(--mono)] text-sm font-bold tabular-nums md:text-right">
        {actual}
      </dd>
    </div>
  )
}

function BloqueCompetencia({
  titulo,
  ambito,
  children,
}: {
  readonly titulo: string
  readonly ambito: string
  readonly children: React.ReactNode
}) {
  return (
    <article className="grid gap-2 border border-[var(--rule)] bg-[var(--paper-2)] p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold tracking-[0.18em] uppercase">
          {titulo}
        </h3>
        <span className="font-[family-name:var(--mono)] text-sm font-bold text-[var(--ink-soft)]">
          {ambito}
        </span>
      </div>
      <p className="text-sm leading-6 text-[var(--ink-soft)]">{children}</p>
    </article>
  )
}

function Pasos({
  comparacion,
}: {
  readonly comparacion: ComparacionAjustadaPorIpc
}) {
  const factor = Number(comparacion.factorIpc)
  const comparado = comparacion.comparado.ajustado
  const actual = comparacion.referencia
  const rendimientoPrevioComparado =
    comparado.salarioBrutoAnualCentimos - comparado.cotizacionTrabajadorCentimos
  const rendimientoPrevioActual =
    actual.salarioBrutoAnualCentimos - actual.cotizacionTrabajadorCentimos

  return (
    <section className="grid gap-6 py-6">
      <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
        CÁLCULO GUIADO
      </h2>
      <p className="max-w-4xl text-sm leading-6 text-[var(--ink-soft)]">
        La comparación no pregunta cuánto se cobraba nominalmente en el pasado,
        sino qué pasaría con un salario equivalente por IPC. La parte importante
        del IRPF sucede antes de los tramos: ahí se decide la base imponible, y
        muchos de esos parámetros son estatales.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TarjetaFormula numero="01" titulo="De salario nominal a euros reales">
          <FormulaSimulador>
            <PiezaFormula tono="resultado">SALARIO_BRUTO_REAL</PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="calculo">
              SALARIO_NOMINAL_{comparacion.anioComparado}
            </PiezaFormula>
            <PiezaFormula>×</PiezaFormula>
            <PiezaFormula tono="calculo">
              IPC_ACUM {factor.toFixed(4)}
            </PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="resultado">
              {formatearCentimos(comparado.salarioBrutoAnualCentimos)}
            </PiezaFormula>
          </FormulaSimulador>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            La comparación convierte una nómina antigua a euros equivalentes y
            deja fuera las subidas pactadas con el IPC del año anterior.
          </p>
        </TarjetaFormula>

        <TarjetaFormula numero="02" titulo="Del salario a la base imponible">
          <FormulaSimulador>
            <PiezaFormula tono="resultado">BASE_IMPONIBLE</PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="calculo">RENDIMIENTO_TRABAJO</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">SS_TRABAJADOR</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">GASTO_2.000</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">REDUCCION_ART_20</PiezaFormula>
          </FormulaSimulador>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Rendimientos del trabajo son sueldos, salarios, pensiones o paro. El
            gasto fijo de 2.000 € del{" "}
            <EnlaceNormativo href="https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a19">
              art. 19.2.f LIRPF
            </EnlaceNormativo>{" "}
            y la reducción del{" "}
            <EnlaceNormativo href="https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a20">
              art. 20 LIRPF
            </EnlaceNormativo>{" "}
            se aplican antes de que la CCAA toque su escala.
          </p>
        </TarjetaFormula>

        <TarjetaFormula numero="03" titulo="De base a cuota">
          <FormulaSimulador>
            <PiezaFormula tono="resultado">CUOTA_IRPF</PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="calculo">TRAMOS(BASE)</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">MINIMO_PERSONAL</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">DEDUCCIONES</PiezaFormula>
          </FormulaSimulador>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Una CCAA puede modificar su escala autonómica y parte del minimo,
            pero el mínimo personal y familiar parte de una referencia estatal.
            La{" "}
            <EnlaceNormativo href="https://www.boe.es/buscar/act.php?id=BOE-A-2009-20375#a46">
              Ley 22/2009
            </EnlaceNormativo>{" "}
            limita a un 10% la variación autonómica de esos minimos.
          </p>
        </TarjetaFormula>

        <TarjetaFormula numero="04" titulo="De cuota a neto">
          <FormulaSimulador>
            <PiezaFormula tono="resultado">NETO</PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="calculo">SALARIO_BRUTO</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">SS_TRABAJADOR</PiezaFormula>
            <PiezaFormula>-</PiezaFormula>
            <PiezaFormula tono="limite">IRPF_FINAL</PiezaFormula>
            <PiezaFormula>=</PiezaFormula>
            <PiezaFormula tono="resultado">
              {formatearCentimos(comparado.salarioNetoAnualCentimos)}
            </PiezaFormula>
          </FormulaSimulador>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            El resultado neto compara leyes de {comparacion.anioComparado} en
            euros de {comparacion.anioReferencia} contra la liquidación actual.
          </p>
        </TarjetaFormula>
      </div>

      <section className="border border-[var(--rule)] bg-[var(--paper)]">
        <header className="border-b border-[var(--rule)] p-4">
          <p className="text-sm tracking-[0.24em] text-[var(--ink-soft)] uppercase">
            Rastro con tus números
          </p>
          <h3 className="mt-1 text-2xl font-bold">Salario, IRPF y neto</h3>
        </header>
        <dl className="grid gap-2 p-4">
          <div className="hidden px-3 text-sm font-bold tracking-[0.18em] text-[var(--ink-soft)] uppercase md:grid md:grid-cols-[minmax(9rem,0.75fr)_minmax(12rem,1.2fr)_minmax(7rem,0.65fr)_minmax(7rem,0.65fr)]">
            <span>Concepto</span>
            <span>Fórmula</span>
            <span className="text-right">{comparacion.anioComparado}</span>
            <span className="text-right">{comparacion.anioReferencia}</span>
          </div>
          <LineaRastroSimulador
            etiqueta="Bruto comparable"
            formula={`${formatearCentimos(
              comparacion.comparado.salarioBrutoNominalAnualCentimos
            )} x IPC ${factor.toFixed(4)}`}
            pasado={formatearCentimos(comparado.salarioBrutoAnualCentimos)}
            actual={formatearCentimos(actual.salarioBrutoAnualCentimos)}
          />
          <LineaRastroSimulador
            etiqueta="Rendimiento previo"
            formula="Bruto - cotización trabajador"
            pasado={formatearCentimos(rendimientoPrevioComparado)}
            actual={formatearCentimos(rendimientoPrevioActual)}
          />
          <LineaRastroSimulador
            etiqueta="IRPF final"
            formula="Cuota anual ajustada por límites aplicables"
            pasado={formatearCentimos(comparado.irpfFinalCentimos)}
            actual={formatearCentimos(actual.irpfFinalCentimos)}
          />
          <LineaRastroSimulador
            etiqueta="Neto anual"
            formula="Bruto - cotización trabajador - IRPF final"
            pasado={formatearCentimos(comparado.salarioNetoAnualCentimos)}
            actual={formatearCentimos(actual.salarioNetoAnualCentimos)}
            destacado
          />
          <LineaRastroSimulador
            etiqueta="Diferencia"
            formula="Neto pasado comparable - neto actual"
            pasado={formatearCentimos(
              comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
            )}
            actual={`${formatearCentimos(
              comparacion.diferenciaPoderAdquisitivoNetoMensualCentimos
            )} / mes`}
            destacado
          />
        </dl>
      </section>

      <section className="border-t-2 border-[var(--rule)] pt-5">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Qué explica esto sobre deflactar
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <BloqueCompetencia
            titulo="La inflación entra antes de los tramos"
            ambito="Estado"
          >
            Si el salario nominal sube sólo para compensar IPC, el poder de
            compra puede ser el mismo pero el rendimiento nominal es mayor. Eso
            puede reducir la reducción por rendimientos del trabajo y elevar la
            base imponible antes de llegar a la escala autonómica.
          </BloqueCompetencia>
          <BloqueCompetencia
            titulo="El gasto de 2.000 € pierde valor"
            ambito="Estado"
          >
            El gasto deducible fijo no se actualiza con los precios dentro de la
            CCAA. Si permanece congelado, cada año protege menos renta real y la
            base imponible sube artificialmente frente al poder adquisitivo.
          </BloqueCompetencia>
          <BloqueCompetencia
            titulo="El mínimo familiar tiene corsé"
            ambito="Estado + CCAA"
          >
            Las CCAA pueden mover minimos para el gravamen autonómico, pero con
            el límite del 10%. Si la referencia estatal queda congelada y la
            inflación acumulada supera ese margen, la corrección autonómica es
            parcial.
          </BloqueCompetencia>
          <BloqueCompetencia
            titulo="Deflactar sólo la CCAA es parcial"
            ambito="CCAA"
          >
            Tocar la escala autonómica puede aliviar parte de la cuota, pero no
            repara los parámetros estatales que forman la base. Además, en el
            sistema de financiación, una bajada unilateral puede reducir caja
            real aunque la capacidad normativa usada por el sistema no baje al
            mismo ritmo.
          </BloqueCompetencia>
        </div>
      </section>
    </section>
  )
}
