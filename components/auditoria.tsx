"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Cause, Effect, Exit, Fiber } from "effect"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import {
  ANIOS_COMPARABLES,
  centimosAEuros,
  eurosACentimos,
  formatearCentimosEnteros,
  dinero,
  porcentaje,
  type AnioFiscal,
} from "@/lib/formato"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  configuracionRangoAuditoria,
  auditarRangoSalarial,
  type HallazgoAuditoria,
  type AuditoriaRangoSalarial,
  type PuntoAuditoriaRangoSalarial,
} from "@/lib/domain/progresividad"
import {
  exportarAuditoriaCompatibleExcelConProgreso,
  exportarAuditoriaEducativaExcel,
  type ProgresoExportacionCompatible,
} from "@/lib/export/auditoria-excel"
import { cn } from "@/lib/utils"

const MAX_LOGS_EXPORTACION_COMPATIBLE = 120

function formatearSalarioCorto(centimos: number): string {
  const miles = Math.round(centimos / 100_000)
  return `${miles}k`
}

function formatearDuracion(milisegundos: number): string {
  const segundosTotales = Math.floor(milisegundos / 1000)
  const minutos = Math.floor(segundosTotales / 60)
  const segundos = segundosTotales % 60
  return `${minutos}:${segundos.toString().padStart(2, "0")}`
}

type DialogoExportacionCompatible = "advertencia" | "progreso" | null

function AuditoriaImpl() {
  const [minimoCentimos, fijarMinimoCentimos] = React.useState<number>(
    configuracionRangoAuditoria.minimoPorDefectoCentimos
  )
  const [maximoCentimos, fijarMaximoCentimos] = React.useState<number>(
    configuracionRangoAuditoria.maximoPorDefectoCentimos
  )
  const [anioComparado, fijarAnioComparado] = React.useState<AnioFiscal>(2019)
  const [aniosGraficoIrpf, fijarAniosGraficoIrpf] = React.useState<
    ReadonlyArray<AnioFiscal>
  >([2019, 2026])
  const [exportando, fijarExportando] = React.useState<
    "educativa" | "compatible" | null
  >(null)
  const [dialogoExportacionCompatible, fijarDialogoExportacionCompatible] =
    React.useState<DialogoExportacionCompatible>(null)
  const [progresoExportacionCompatible, fijarProgresoExportacionCompatible] =
    React.useState<ProgresoExportacionCompatible | null>(null)
  const [logsExportacionCompatible, fijarLogsExportacionCompatible] =
    React.useState<ReadonlyArray<string>>([])
  const [errorExportacionCompatible, fijarErrorExportacionCompatible] =
    React.useState<string | null>(null)
  const fibraExportacionCompatible = React.useRef<Fiber.Fiber<
    void,
    unknown
  > | null>(null)

  const auditoria = React.useMemo(
    () =>
      Effect.runSync(
        auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos: Math.min(
            minimoCentimos,
            maximoCentimos
          ),
          salarioBrutoAnualMaximoCentimos: Math.max(
            minimoCentimos,
            maximoCentimos
          ),
          pasoCentimos: configuracionRangoAuditoria.pasoCentimos,
          anioComparado,
          anioReferencia: 2026,
        })
      ),
    [anioComparado, maximoCentimos, minimoCentimos]
  )

  const registrarProgresoExportacionCompatible = React.useCallback(
    (progreso: ProgresoExportacionCompatible) => {
      fijarProgresoExportacionCompatible(progreso)
      fijarLogsExportacionCompatible((logsActuales) =>
        [
          ...logsActuales,
          `${formatearDuracion(progreso.milisegundosTranscurridos)} · ${progreso.mensaje}`,
        ].slice(-MAX_LOGS_EXPORTACION_COMPATIBLE)
      )
    },
    []
  )

  const exportar = async (tipo: "educativa" | "compatible") => {
    if (tipo === "compatible") {
      fijarDialogoExportacionCompatible("advertencia")
      return
    }

    fijarExportando(tipo)
    try {
      await exportarAuditoriaEducativaExcel(auditoria)
    } finally {
      fijarExportando(null)
    }
  }

  const iniciarExportacionCompatible = () => {
    if (fibraExportacionCompatible.current !== null) return

    fijarExportando("compatible")
    fijarDialogoExportacionCompatible("progreso")
    fijarProgresoExportacionCompatible(null)
    fijarLogsExportacionCompatible([])
    fijarErrorExportacionCompatible(null)

    const fibra = Effect.runFork(
      exportarAuditoriaCompatibleExcelConProgreso(auditoria, {
        onProgreso: registrarProgresoExportacionCompatible,
      })
    )
    fibraExportacionCompatible.current = fibra
    fibra.addObserver((exit) => {
      fibraExportacionCompatible.current = null
      fijarExportando(null)

      if (Exit.isSuccess(exit)) return

      if (Cause.hasInterruptsOnly(exit.cause)) {
        fijarErrorExportacionCompatible("Exportación cancelada")
        fijarLogsExportacionCompatible((logsActuales) =>
          [...logsActuales, "Exportación cancelada por el usuario"].slice(
            -MAX_LOGS_EXPORTACION_COMPATIBLE
          )
        )
        return
      }

      fijarErrorExportacionCompatible("No se pudo generar el XLSX compatible")
      fijarLogsExportacionCompatible((logsActuales) =>
        [
          ...logsActuales,
          `Error generando la exportación: ${String(Cause.squash(exit.cause))}`,
        ].slice(-MAX_LOGS_EXPORTACION_COMPATIBLE)
      )
    })
  }

  const cancelarExportacionCompatible = () => {
    const fibra = fibraExportacionCompatible.current
    if (fibra === null) return
    fijarLogsExportacionCompatible((logsActuales) =>
      [...logsActuales, "Cancelando exportación compatible..."].slice(
        -MAX_LOGS_EXPORTACION_COMPATIBLE
      )
    )
    Effect.runFork(Fiber.interrupt(fibra))
  }

  React.useEffect(
    () => () => {
      const fibra = fibraExportacionCompatible.current
      if (fibra !== null) Effect.runFork(Fiber.interrupt(fibra))
    },
    []
  )

  const hallazgoPrincipal = auditoria.hallazgos[0]

  return (
    <main className="min-h-svh">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="border-b-2 border-[var(--rule)] pb-4">
          <NavegacionSitio />
        </header>

        <section className="mt-8 grid items-end gap-4 border-b-2 border-[var(--rule)] pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10 lg:pb-10">
          <h1 className="font-[family-name:var(--display)] text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] tracking-wider text-[var(--ink)]">
            <span className="block">AUDITORÍA POR</span>
            <span className="block">
              RANGO <span className="text-[var(--ink-soft)]">SALARIAL</span>
            </span>
          </h1>
          <div className="grid gap-3 self-start">
            <p className="text-sm leading-6 text-[var(--ink)]">
              Barrido determinista del rango. La tabla está al final;{" "}
              <strong>los hallazgos van primero</strong>: el salario más
              afectado, la mayor brecha de carga y el primer salario con IRPF en
              2026.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] tracking-[0.22em] uppercase">
              <button
                type="button"
                onClick={() => exportar("educativa")}
                disabled={exportando !== null}
                className="border-2 border-[var(--rule)] bg-[var(--paper)] px-3 py-2 transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX educativo
              </button>
              <button
                type="button"
                onClick={() => exportar("compatible")}
                disabled={exportando !== null}
                className="border-2 border-[var(--rule)] bg-[var(--rule)] px-3 py-2 text-[var(--paper)] transition-colors hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX compatible
              </button>
            </div>
          </div>
        </section>

        <BarraFiltros
          minimoCentimos={minimoCentimos}
          maximoCentimos={maximoCentimos}
          anioComparado={anioComparado}
          fijarMinimoCentimos={fijarMinimoCentimos}
          fijarMaximoCentimos={fijarMaximoCentimos}
          fijarAnioComparado={fijarAnioComparado}
        />

        {hallazgoPrincipal ? (
          <HallazgoPrincipal
            hallazgo={hallazgoPrincipal}
            anioComparado={auditoria.anioComparado}
          />
        ) : null}

        <HallazgosSecundarios hallazgos={auditoria.hallazgos.slice(1)} />

        <Visualizaciones
          auditoria={auditoria}
          aniosGraficoIrpf={aniosGraficoIrpf}
          fijarAniosGraficoIrpf={fijarAniosGraficoIrpf}
        />
      </div>

      <DialogoExportacionCompatible
        dialogo={dialogoExportacionCompatible}
        progreso={progresoExportacionCompatible}
        logs={logsExportacionCompatible}
        error={errorExportacionCompatible}
        exportando={exportando === "compatible"}
        alCancelarAdvertencia={() => fijarDialogoExportacionCompatible(null)}
        alConfirmarAdvertencia={iniciarExportacionCompatible}
        alCancelarGeneracion={cancelarExportacionCompatible}
        alCerrarProgreso={() => fijarDialogoExportacionCompatible(null)}
      />
    </main>
  )
}

export const Auditoria = dynamic(async () => ({ default: AuditoriaImpl }), {
  ssr: false,
  loading: () => <div className="min-h-svh bg-[var(--paper)]" />,
})

function DialogoExportacionCompatible({
  dialogo,
  progreso,
  logs,
  error,
  exportando,
  alCancelarAdvertencia,
  alConfirmarAdvertencia,
  alCancelarGeneracion,
  alCerrarProgreso,
}: {
  readonly dialogo: DialogoExportacionCompatible
  readonly progreso: ProgresoExportacionCompatible | null
  readonly logs: ReadonlyArray<string>
  readonly error: string | null
  readonly exportando: boolean
  readonly alCancelarAdvertencia: () => void
  readonly alConfirmarAdvertencia: () => void
  readonly alCancelarGeneracion: () => void
  readonly alCerrarProgreso: () => void
}) {
  const progresoVisible = progreso?.porcentaje ?? 0
  const tiempoTranscurrido = formatearDuracion(
    progreso?.milisegundosTranscurridos ?? 0
  )
  const puedeCerrarProgreso =
    exportando === false && (error !== null || progreso?.fase === "completado")

  return (
    <>
      <Dialog.Root
        open={dialogo === "advertencia"}
        onOpenChange={(abierto) => {
          if (!abierto) alCancelarAdvertencia()
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[oklch(0.1_0_0/0.72)] backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
            <Dialog.Popup className="relative w-full max-w-lg border-2 border-[var(--rule)] bg-[var(--paper)] p-6 text-[var(--ink)] shadow-[6px_6px_0_0_var(--rule)] transition-[opacity,translate] duration-150 outline-none data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0">
              <Dialog.Title className="font-[family-name:var(--display)] text-3xl tracking-wider uppercase">
                Exportación pesada
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
                El XLSX compatible replica el Excel legacy completo: hojas de
                control, comparativa de inflación y `DAT_2012`...`DAT_2026` con
                granularidad de 1 €. Se generará localmente por lotes y podrás
                seguir el progreso sin bloquear la página.
              </Dialog.Description>
              <div className="mt-5 flex flex-wrap justify-end gap-2 text-[11px] tracking-[0.22em] uppercase">
                <Dialog.Close
                  onClick={alCancelarAdvertencia}
                  className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 transition-colors hover:bg-[var(--danger)] hover:text-[var(--paper)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:outline-none"
                >
                  Cancelar
                </Dialog.Close>
                <button
                  type="button"
                  onClick={alConfirmarAdvertencia}
                  className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                >
                  Generar XLSX
                </button>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={dialogo === "progreso"}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-[oklch(0.1_0_0/0.72)] backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-auto p-4">
            <Dialog.Popup className="relative grid max-h-[90svh] w-full max-w-3xl gap-4 border-2 border-[var(--rule)] bg-[var(--paper)] p-6 text-[var(--ink)] shadow-[6px_6px_0_0_var(--rule)] outline-none">
              <Dialog.Title className="font-[family-name:var(--display)] text-3xl tracking-wider uppercase">
                Generando XLSX compatible
              </Dialog.Title>
              <Dialog.Description className="text-sm leading-6 text-[var(--ink-soft)]">
                {error ??
                  progreso?.mensaje ??
                  "Preparando el runtime de generación incremental..."}
              </Dialog.Description>

              <div className="grid gap-2">
                <div className="flex justify-between font-[family-name:var(--mono)] text-xs tabular-nums">
                  <span>{progreso?.hoja ?? "LIBRO"}</span>
                  <span>{progresoVisible.toFixed(1)}%</span>
                </div>
                <div className="h-4 border-2 border-[var(--rule)] bg-[var(--paper-2)]">
                  <div
                    className="h-full bg-[var(--mark)] transition-[width]"
                    style={{ width: `${progresoVisible}%` }}
                  />
                </div>
                <div className="grid gap-1 font-[family-name:var(--mono)] text-[11px] text-[var(--ink-soft)] tabular-nums sm:grid-cols-4">
                  <span>
                    Hojas {progreso?.hojasProcesadas ?? 0}/
                    {progreso?.hojasTotales ?? 18}
                  </span>
                  <span>
                    Fila hoja {progreso?.filasHoja.toLocaleString("es-ES") ?? 0}
                    /{progreso?.filasHojaTotales.toLocaleString("es-ES") ?? 0}
                  </span>
                  <span>
                    Total{" "}
                    {progreso?.filasProcesadas.toLocaleString("es-ES") ?? 0}/
                    {progreso?.filasTotales.toLocaleString("es-ES") ?? 0}
                  </span>
                  <span>Tiempo {tiempoTranscurrido}</span>
                </div>
              </div>

              <div className="min-h-0 border-2 border-[var(--rule)] bg-[var(--paper-2)] p-3">
                <p className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
                  Logs de cálculo
                </p>
                <ol className="mt-2 grid max-h-64 gap-1 overflow-auto font-[family-name:var(--mono)] text-[11px] leading-5 tabular-nums">
                  {logs.map((log, indice) => (
                    <li key={`${indice}-${log}`}>{log}</li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap justify-end gap-2 text-[11px] tracking-[0.22em] uppercase">
                {exportando ? (
                  <button
                    type="button"
                    onClick={alCancelarGeneracion}
                    className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 shadow-[3px_3px_0_0_var(--rule)] transition-[background-color,color,border-color,box-shadow,translate] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[var(--danger)] hover:bg-[var(--danger)] hover:text-[var(--paper)] hover:shadow-[5px_5px_0_0_var(--rule)] focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 focus-visible:border-[var(--danger)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:shadow-[5px_5px_0_0_var(--rule)] focus-visible:outline-none active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--rule)]"
                  >
                    Cancelar generación
                  </button>
                ) : null}
                {puedeCerrarProgreso ? (
                  <button
                    type="button"
                    onClick={alCerrarProgreso}
                    className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                  >
                    Cerrar
                  </button>
                ) : null}
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function BarraFiltros({
  minimoCentimos,
  maximoCentimos,
  anioComparado,
  fijarMinimoCentimos,
  fijarMaximoCentimos,
  fijarAnioComparado,
}: {
  readonly minimoCentimos: number
  readonly maximoCentimos: number
  readonly anioComparado: AnioFiscal
  readonly fijarMinimoCentimos: (centimos: number) => void
  readonly fijarMaximoCentimos: (centimos: number) => void
  readonly fijarAnioComparado: (anio: AnioFiscal) => void
}) {
  return (
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <p className="text-[10px] tracking-[0.32em] text-[var(--ink-soft)] uppercase">
        FILTROS / BARRIDO
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
        <div className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <CampoDinero
              etiqueta="MÍNIMO"
              valorCentimos={minimoCentimos}
              alCambiar={fijarMinimoCentimos}
            />
            <CampoDinero
              etiqueta="MÁXIMO"
              valorCentimos={maximoCentimos}
              alCambiar={fijarMaximoCentimos}
            />
          </div>
          <Slider.Root
            value={[
              centimosAEuros(minimoCentimos),
              centimosAEuros(maximoCentimos),
            ]}
            min={centimosAEuros(configuracionRangoAuditoria.minimoCentimos)}
            max={centimosAEuros(configuracionRangoAuditoria.maximoCentimos)}
            step={centimosAEuros(configuracionRangoAuditoria.pasoCentimos)}
            onValueChange={(valores) => {
              const [
                minimo = centimosAEuros(minimoCentimos),
                maximo = centimosAEuros(maximoCentimos),
              ] = valores
              fijarMinimoCentimos(eurosACentimos(minimo))
              fijarMaximoCentimos(eurosACentimos(maximo))
            }}
            className="grid gap-2"
          >
            <Slider.Control className="relative flex h-8 touch-none items-center">
              <Slider.Track className="relative h-3 w-full bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                <Slider.Indicator className="bg-[var(--mark)]" />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                aria-label="Salario mínimo"
                className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              />
              <Slider.Thumb
                index={1}
                aria-label="Salario máximo"
                className="size-6 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none"
              />
            </Slider.Control>
            <div className="flex justify-between text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
              <span>
                {formatearCentimosEnteros(
                  configuracionRangoAuditoria.minimoCentimos
                )}
              </span>
              <span>
                {formatearCentimosEnteros(
                  configuracionRangoAuditoria.maximoCentimos
                )}
              </span>
            </div>
          </Slider.Root>
        </div>
        <div className="grid gap-2">
          <span className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
            AÑO COMPARADO
          </span>
          <div
            role="radiogroup"
            className="grid grid-cols-7 gap-px bg-[var(--rule)]"
          >
            {ANIOS_COMPARABLES.map((anio) => {
              const activo = anio === anioComparado
              return (
                <button
                  key={anio}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => fijarAnioComparado(anio)}
                  className={cn(
                    "h-12 font-[family-name:var(--mono)] text-[11px] font-bold tabular-nums transition-colors",
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
        </div>
      </div>
    </section>
  )
}

function CampoDinero({
  etiqueta,
  valorCentimos,
  alCambiar,
}: {
  readonly etiqueta: string
  readonly valorCentimos: number
  readonly alCambiar: (centimos: number) => void
}) {
  return (
    <NumberField.Root
      value={centimosAEuros(valorCentimos)}
      min={centimosAEuros(configuracionRangoAuditoria.minimoCentimos)}
      max={centimosAEuros(configuracionRangoAuditoria.maximoCentimos)}
      step={centimosAEuros(configuracionRangoAuditoria.pasoCentimos)}
      format={{ style: "currency", currency: "EUR", maximumFractionDigits: 0 }}
      locale="es-ES"
      onValueChange={(valor) =>
        valor !== null && alCambiar(eurosACentimos(valor))
      }
      className="grid gap-1"
    >
      <span className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
        {etiqueta}
      </span>
      <NumberField.Group className="grid h-12 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border-2 border-[var(--rule)] bg-[var(--paper)]">
        <NumberField.Decrement className="border-r-2 border-[var(--rule)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--mono)] text-base font-bold tabular-nums outline-none focus-visible:bg-[var(--mark)]/20" />
        <NumberField.Increment className="border-l-2 border-[var(--rule)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
          +
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}

function HallazgoPrincipal({
  hallazgo,
  anioComparado,
}: {
  readonly hallazgo: HallazgoAuditoria
  readonly anioComparado: AnioFiscal
}) {
  const tono =
    hallazgo.severidad === "perdida"
      ? "var(--danger)"
      : hallazgo.severidad === "ganancia"
        ? "var(--gain)"
        : "var(--ink)"
  return (
    <section className="grid border-b-2 border-[var(--rule)]">
      <div className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-6 pl-4 sm:gap-6 sm:pl-5">
        <span
          aria-hidden="true"
          className="absolute top-6 left-0 h-10 w-[10px]"
          style={{ background: tono }}
        />
        <span
          className="px-2 py-1 font-[family-name:var(--mono)] text-[10px] font-bold tracking-[0.3em] text-[var(--paper)] uppercase sm:px-3"
          style={{ background: tono }}
        >
          HALLAZGO 01
        </span>
        <h2 className="font-[family-name:var(--display)] text-xl leading-tight tracking-wider uppercase sm:text-3xl">
          {hallazgo.titulo}
        </h2>
      </div>
      <div className="grid gap-3 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end lg:gap-10">
        <p className="font-[family-name:var(--display)] text-[clamp(2.5rem,8vw,6rem)] leading-[0.86] text-[var(--ink)] tabular-nums">
          {formatearCentimosEnteros(hallazgo.salarioBrutoAnualCentimos)}
        </p>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">
          {hallazgo.descripcion} Punto identificado al comparar contra el año{" "}
          <span className="text-[var(--ink)]">{anioComparado}</span>.
        </p>
      </div>
    </section>
  )
}

function HallazgosSecundarios({
  hallazgos,
}: {
  readonly hallazgos: ReadonlyArray<HallazgoAuditoria>
}) {
  if (hallazgos.length === 0) return null
  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <p className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
        OTROS HALLAZGOS
      </p>
      <ul className="mt-3 grid gap-px bg-[var(--rule)]">
        {hallazgos.map((hallazgo, indice) => {
          const tono =
            hallazgo.severidad === "perdida"
              ? "var(--danger)"
              : hallazgo.severidad === "ganancia"
                ? "var(--gain)"
                : "var(--ink)"
          return (
            <li
              key={`${hallazgo.titulo}-${hallazgo.salarioBrutoAnualCentimos}`}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 bg-[var(--paper)] px-3 py-4 sm:gap-6 sm:px-6"
            >
              <span
                className="px-2 py-0.5 font-[family-name:var(--mono)] text-[10px] font-bold tracking-[0.3em] text-[var(--paper)] uppercase"
                style={{ background: tono }}
              >
                0{indice + 2}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold tracking-wider text-[var(--ink)] uppercase">
                  {hallazgo.titulo}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--ink-soft)]">
                  {hallazgo.descripcion}
                </p>
              </div>
              <span className="font-[family-name:var(--display)] text-xl tabular-nums sm:text-3xl">
                {formatearCentimosEnteros(hallazgo.salarioBrutoAnualCentimos)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const configuracionGraficoBarras = {
  diferencia: { label: "Diferencia anual", color: "var(--danger)" },
} satisfies ChartConfig

const aniosTipoEfectivoIrpf = [
  ...ANIOS_COMPARABLES,
  2026,
] as const satisfies ReadonlyArray<AnioFiscal>

const coloresTipoEfectivoIrpf: Readonly<Record<AnioFiscal, string>> = {
  2012: "oklch(0.38 0 0)",
  2013: "oklch(0.58 0 0)",
  2014: "oklch(0.47 0 0)",
  2015: "oklch(0.18 0 0)",
  2016: "oklch(0.82 0 0)",
  2017: "oklch(0.62 0 0)",
  2018: "oklch(0.44 0.13 260)",
  2019: "oklch(0.78 0.16 88)",
  2020: "oklch(0.68 0 0)",
  2021: "oklch(0.52 0 0)",
  2022: "oklch(0.24 0 0)",
  2023: "oklch(0.78 0 0)",
  2024: "oklch(0.64 0 0)",
  2025: "oklch(0.42 0 0)",
  2026: "oklch(0.62 0.19 35)",
}

const claveAnio = (anio: AnioFiscal) => `anio${anio}`

const configuracionTipoEfectivoIrpf = Object.fromEntries(
  aniosTipoEfectivoIrpf.map((anio) => [
    claveAnio(anio),
    {
      label: String(anio),
      color: coloresTipoEfectivoIrpf[anio],
    },
  ])
) satisfies ChartConfig

function filasGrafico(puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>) {
  return puntos.map((punto) => ({
    salarioEuros: centimosAEuros(punto.salarioBrutoAnualCentimos),
    salario: formatearCentimosEnteros(punto.salarioBrutoAnualCentimos),
    diferencia: centimosAEuros(
      punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
    ),
  }))
}

function filasTipoEfectivoIrpf({
  auditoria,
  aniosSeleccionados,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
}) {
  const series = new Map<
    AnioFiscal,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >()

  for (const anio of aniosSeleccionados) {
    if (anio === auditoria.anioReferencia || anio === auditoria.anioComparado) {
      series.set(anio, auditoria.puntos)
      continue
    }

    series.set(
      anio,
      Effect.runSync(
        auditarRangoSalarial({
          salarioBrutoAnualMinimoCentimos:
            auditoria.salarioBrutoAnualMinimoCentimos,
          salarioBrutoAnualMaximoCentimos:
            auditoria.salarioBrutoAnualMaximoCentimos,
          pasoCentimos: auditoria.pasoCentimos,
          anioComparado: anio,
          anioReferencia: auditoria.anioReferencia,
        })
      ).puntos
    )
  }

  return auditoria.puntos.map((puntoBase, indice) => {
    const fila: Record<string, number | string> = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const anio of aniosSeleccionados) {
      const punto = series.get(anio)?.[indice]
      if (punto === undefined) continue
      fila[claveAnio(anio)] =
        anio === auditoria.anioReferencia
          ? punto.tipoEfectivoIrpfActual
          : punto.tipoEfectivoIrpfComparado
    }

    return fila
  })
}

const valoresNumericosDeFilas = (
  filas: ReadonlyArray<Record<string, number | string>>,
  claves: ReadonlyArray<string>
) =>
  filas.flatMap((fila) =>
    claves.flatMap((clave) => {
      const valor = fila[clave]
      return typeof valor === "number" && Number.isFinite(valor) ? [valor] : []
    })
  )

const dominioPorcentaje = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [0, 0.02] as const

  const maximo = Math.max(...valores)
  const superior = Math.min(1, Math.ceil((maximo + 0.01) / 0.02) * 0.02)
  return [0, Math.max(0.02, superior)] as const
}

const ticksPorcentaje = (dominio: readonly [number, number]) => {
  const [, superior] = dominio
  const numeroTicks = Math.round(superior / 0.02)
  return Array.from({ length: numeroTicks + 1 }, (_, indice) =>
    Number((indice * 0.02).toFixed(2))
  )
}

const dominioEurosSimetrico = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [-1000, 1000] as const

  const maximoAbsoluto = Math.max(...valores.map(Math.abs))
  const limite = Math.max(1000, Math.ceil((maximoAbsoluto * 1.1) / 1000) * 1000)
  return [-limite, limite] as const
}

const ticksSalarioEuros = (auditoria: AuditoriaRangoSalarial) => {
  const minimo = centimosAEuros(auditoria.salarioBrutoAnualMinimoCentimos)
  const maximo = centimosAEuros(auditoria.salarioBrutoAnualMaximoCentimos)
  const primerTick = Math.ceil(minimo / 5000) * 5000
  const ticks = []

  for (let salario = primerTick; salario <= maximo; salario += 5000) {
    ticks.push(salario)
  }

  if (ticks[0] !== minimo) ticks.unshift(minimo)
  if (ticks.at(-1) !== maximo) ticks.push(maximo)

  return ticks
}

const claseBotonPestana = cn(
  "px-3 py-2 transition-colors",
  "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
  "bg-[var(--paper)] text-[var(--ink)]",
  "not-data-[active]:hover:bg-[var(--mark)]",
  "data-[active]:bg-[var(--rule)] data-[active]:text-[var(--paper)]"
)

function Visualizaciones({
  auditoria,
  aniosGraficoIrpf,
  fijarAniosGraficoIrpf,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly aniosGraficoIrpf: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoIrpf: (anios: ReadonlyArray<AnioFiscal>) => void
}) {
  const datos = React.useMemo(
    () => filasGrafico(auditoria.puntos),
    [auditoria.puntos]
  )
  const datosTipoEfectivoIrpf = React.useMemo(
    () =>
      filasTipoEfectivoIrpf({
        auditoria,
        aniosSeleccionados: aniosGraficoIrpf,
      }),
    [aniosGraficoIrpf, auditoria]
  )
  const clavesTipoEfectivoIrpf = React.useMemo(
    () => aniosGraficoIrpf.map(claveAnio),
    [aniosGraficoIrpf]
  )
  const dominioTipoEfectivoIrpf = React.useMemo(
    () =>
      dominioPorcentaje(
        valoresNumericosDeFilas(datosTipoEfectivoIrpf, clavesTipoEfectivoIrpf)
      ),
    [clavesTipoEfectivoIrpf, datosTipoEfectivoIrpf]
  )
  const ticksTipoEfectivoIrpf = React.useMemo(
    () => ticksPorcentaje(dominioTipoEfectivoIrpf),
    [dominioTipoEfectivoIrpf]
  )
  const ticksSalario = React.useMemo(
    () => ticksSalarioEuros(auditoria),
    [auditoria]
  )
  const dominioSalario = React.useMemo(
    () =>
      [
        centimosAEuros(auditoria.salarioBrutoAnualMinimoCentimos),
        centimosAEuros(auditoria.salarioBrutoAnualMaximoCentimos),
      ] as const,
    [auditoria]
  )
  const dominioDiferencia = React.useMemo(
    () => dominioEurosSimetrico(datos.map((fila) => fila.diferencia)),
    [datos]
  )
  const [animarBarras, fijarAnimarBarras] = React.useState(true)
  const alternarAnioIrpf = (anio: AnioFiscal) => {
    const siguiente = aniosGraficoIrpf.includes(anio)
      ? aniosGraficoIrpf.filter((anioSeleccionado) => anioSeleccionado !== anio)
      : [...aniosGraficoIrpf, anio].sort((a, b) => a - b)
    fijarAniosGraficoIrpf(siguiente.length > 0 ? siguiente : [anio])
  }

  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          EXPLORACIÓN POR RANGO SALARIAL
        </h2>
      </div>
      <Tabs.Root defaultValue="tipo-irpf" className="mt-5 grid gap-4">
        <Tabs.List className="inline-flex w-fit divide-x-2 divide-[var(--rule)] justify-self-start border-2 border-[var(--rule)] text-[11px] tracking-[0.22em] uppercase">
          {(["tipo-irpf", "barras"] as const).map((vista) => (
            <Tabs.Tab key={vista} value={vista} className={claseBotonPestana}>
              {vista === "tipo-irpf" ? "TIPO IRPF" : "BARRAS"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel
          value="tipo-irpf"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-3xl text-xs leading-5 text-[var(--ink-soft)]">
              TIPO EFECTIVO DEL IRPF: IRPF FINAL COMO PORCENTAJE DEL SALARIO
              BRUTO ANUAL AJUSTADO POR IPC.
            </p>
            <div
              role="group"
              aria-label="Años visibles en la gráfica de tipo efectivo del IRPF"
              className="grid w-full grid-cols-5 gap-px bg-[var(--rule)] lg:[grid-template-columns:repeat(15,minmax(0,1fr))]"
            >
              {aniosTipoEfectivoIrpf.map((anio) => {
                const activo = aniosGraficoIrpf.includes(anio)
                return (
                  <button
                    key={anio}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alternarAnioIrpf(anio)}
                    className={cn(
                      "h-9 min-w-0 bg-[var(--paper)] px-2 font-[family-name:var(--mono)] text-[11px] font-bold tabular-nums transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
                      activo
                        ? "text-[var(--ink)]"
                        : "text-[var(--ink-soft)] opacity-55 hover:opacity-100"
                    )}
                    style={{
                      boxShadow: activo
                        ? `inset 0 -4px 0 ${coloresTipoEfectivoIrpf[anio]}`
                        : undefined,
                    }}
                  >
                    {anio}
                  </button>
                )
              })}
            </div>
          </div>
          <ChartContainer
            config={configuracionTipoEfectivoIrpf}
            className="mt-4 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(24rem,52vw,34rem)]"
          >
            <LineChart
              accessibilityLayer
              data={datosTipoEfectivoIrpf}
              margin={{ left: 6, right: 18, top: 12, bottom: 28 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--rule)"
                strokeDasharray="2 4"
              />
              <XAxis
                type="number"
                dataKey="salarioEuros"
                domain={dominioSalario}
                ticks={ticksSalario}
                tickFormatter={(valor: number) =>
                  formatearSalarioCorto(eurosACentimos(valor))
                }
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={10}
                interval={0}
                minTickGap={8}
                angle={-90}
                textAnchor="end"
                height={66}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                width={44}
                domain={dominioTipoEfectivoIrpf}
                ticks={ticksTipoEfectivoIrpf}
                fontSize={12}
                tickFormatter={(valor: number) => `${Math.round(valor * 100)}%`}
              />
              <ChartTooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 10 }}
                cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    formatter={(v) => porcentaje.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                  />
                }
              />
              <Legend
                verticalAlign="bottom"
                align="right"
                iconType="plainline"
                wrapperStyle={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  fontWeight: 700,
                  paddingTop: 8,
                }}
              />
              {aniosGraficoIrpf.map((anio) => (
                <Line
                  key={anio}
                  dataKey={claveAnio(anio)}
                  name={String(anio)}
                  type="monotone"
                  stroke={`var(--color-${claveAnio(anio)})`}
                  strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel
          value="barras"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <p className="text-xs leading-5 text-[var(--ink-soft)]">
            DIFERENCIA ANUAL DE PODER ADQUISITIVO NETO POR SALARIO BRUTO. SI ES
            POSITIVA, EL AÑO COMPARADO DEJABA MÁS NETO REAL QUE 2026.
          </p>
          <ChartContainer
            config={configuracionGraficoBarras}
            className="mt-3 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"
          >
            <BarChart
              accessibilityLayer
              data={datos}
              margin={{ left: 4, right: 4, top: 4, bottom: 4 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--rule)"
                strokeDasharray="2 4"
              />
              <XAxis
                type="number"
                dataKey="salarioEuros"
                domain={dominioSalario}
                ticks={ticksSalario}
                tickFormatter={(valor: number) =>
                  formatearSalarioCorto(eurosACentimos(valor))
                }
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                interval={0}
                minTickGap={12}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={4}
                width={44}
                domain={dominioDiferencia}
                fontSize={10}
                tickFormatter={(valor: number) =>
                  Math.abs(valor) >= 1000
                    ? `${Math.round(valor / 1000)}k`
                    : String(valor)
                }
              />
              <ChartTooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 10 }}
                cursor={{ fill: "var(--mark)", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    formatter={(v) => dinero.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                  />
                }
              />
              <Bar
                dataKey="diferencia"
                fill="var(--color-diferencia)"
                radius={0}
                isAnimationActive={animarBarras}
                onAnimationEnd={() => fijarAnimarBarras(false)}
              />
            </BarChart>
          </ChartContainer>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
