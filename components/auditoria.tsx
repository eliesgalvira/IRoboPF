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
  formatearCentimos,
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

        <Visualizaciones auditoria={auditoria} />
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
      step={5000}
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
      <div
        className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-l-[10px] py-6 pl-4 sm:gap-6 sm:pl-5"
        style={{ borderLeftColor: tono }}
      >
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

const configuracionGraficoLineas = {
  netoComparado: { label: "Neto año comparado", color: "var(--gain)" },
  netoReferencia: { label: "Neto 2026", color: "var(--danger)" },
} satisfies ChartConfig

function filasGrafico(puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>) {
  return puntos.map((punto) => ({
    salario: formatearCentimosEnteros(punto.salarioBrutoAnualCentimos),
    salarioCorto: formatearSalarioCorto(punto.salarioBrutoAnualCentimos),
    diferencia: centimosAEuros(
      punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
    ),
    netoComparado: centimosAEuros(
      punto.comparacion.comparado.ajustado.salarioNetoAnualCentimos
    ),
    netoReferencia: centimosAEuros(
      punto.comparacion.referencia.salarioNetoAnualCentimos
    ),
  }))
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
}: {
  readonly auditoria: AuditoriaRangoSalarial
}) {
  const datos = React.useMemo(
    () => filasGrafico(auditoria.puntos),
    [auditoria.puntos]
  )
  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          DATOS · 1 PANEL
        </h2>
        <p className="text-[10px] tracking-[0.3em] text-[var(--ink-soft)] uppercase">
          Tabla al final · gráficos arriba
        </p>
      </div>
      <Tabs.Root defaultValue="barras" className="mt-5 grid gap-4">
        <Tabs.List className="inline-flex w-fit divide-x-2 divide-[var(--rule)] justify-self-start border-2 border-[var(--rule)] text-[11px] tracking-[0.22em] uppercase">
          {(["barras", "lineas", "tabla"] as const).map((vista) => (
            <Tabs.Tab key={vista} value={vista} className={claseBotonPestana}>
              {vista === "barras"
                ? "BARRAS"
                : vista === "lineas"
                  ? "LÍNEAS"
                  : "TABLA"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel
          value="barras"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <p className="text-xs leading-5 text-[var(--ink-soft)]">
            DIFERENCIA ANUAL POR SALARIO. POSITIVO = AÑO COMPARADO MEJOR QUE
            2026.
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
                dataKey="salarioCorto"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                interval="preserveStartEnd"
                minTickGap={12}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={4}
                width={44}
                fontSize={10}
                tickFormatter={(valor: number) =>
                  Math.abs(valor) >= 1000
                    ? `${Math.round(valor / 1000)}k`
                    : String(valor)
                }
              />
              <ChartTooltip
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
              />
            </BarChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel
          value="lineas"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <p className="text-xs leading-5 text-[var(--ink-soft)]">
            NETO REAL · {auditoria.anioComparado} (REEXPRESADO) FRENTE A 2026.
          </p>
          <ChartContainer
            config={configuracionGraficoLineas}
            className="mt-3 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"
          >
            <LineChart
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
                dataKey="salarioCorto"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                interval="preserveStartEnd"
                minTickGap={12}
                fontSize={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={4}
                width={44}
                fontSize={10}
                tickFormatter={(valor: number) =>
                  Math.abs(valor) >= 1000
                    ? `${Math.round(valor / 1000)}k`
                    : String(valor)
                }
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(v) => dinero.format(Number(v))}
                    labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                  />
                }
              />
              <Line
                dataKey="netoComparado"
                type="monotone"
                stroke="var(--color-netoComparado)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="netoReferencia"
                type="monotone"
                stroke="var(--color-netoReferencia)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </Tabs.Panel>
        <Tabs.Panel
          value="tabla"
          className="border-2 border-[var(--rule)] bg-[var(--paper)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full font-[family-name:var(--mono)] text-xs tabular-nums">
              <thead className="border-b-2 border-[var(--rule)] text-left text-[10px] tracking-[0.22em] text-[var(--ink-soft)] uppercase">
                <tr>
                  <th className="px-2 py-3 font-bold sm:px-3">BRUTO</th>
                  <th className="hidden px-2 py-3 font-bold sm:table-cell sm:px-3">
                    NOM.
                  </th>
                  <th className="hidden px-2 py-3 font-bold md:table-cell md:px-3">
                    NETO COMP.
                  </th>
                  <th className="px-2 py-3 font-bold sm:px-3">NETO 2026</th>
                  <th className="px-2 py-3 font-bold sm:px-3">Δ ANUAL</th>
                  <th className="hidden px-2 py-3 font-bold md:table-cell md:px-3">
                    CARGA
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditoria.puntos.map((punto) => (
                  <tr
                    key={punto.salarioBrutoAnualCentimos}
                    className="border-b border-dashed border-[var(--rule)]/30"
                  >
                    <td className="px-2 py-2.5 sm:px-3">
                      {formatearCentimosEnteros(
                        punto.salarioBrutoAnualCentimos
                      )}
                    </td>
                    <td className="hidden px-2 py-2.5 sm:table-cell sm:px-3">
                      {formatearCentimos(
                        punto.comparacion.comparado
                          .salarioBrutoNominalAnualCentimos
                      )}
                    </td>
                    <td className="hidden px-2 py-2.5 md:table-cell md:px-3">
                      {formatearCentimos(
                        punto.comparacion.comparado.ajustado
                          .salarioNetoAnualCentimos
                      )}
                    </td>
                    <td className="px-2 py-2.5 sm:px-3">
                      {formatearCentimos(
                        punto.comparacion.referencia.salarioNetoAnualCentimos
                      )}
                    </td>
                    <td
                      className={cn(
                        "px-2 py-2.5 font-bold sm:px-3",
                        punto.comparacion
                          .diferenciaPoderAdquisitivoNetoAnualCentimos > 0
                          ? "text-[var(--danger)]"
                          : "text-[var(--gain)]"
                      )}
                    >
                      {formatearCentimos(
                        punto.comparacion
                          .diferenciaPoderAdquisitivoNetoAnualCentimos
                      )}
                    </td>
                    <td className="hidden px-2 py-2.5 md:table-cell md:px-3">
                      {porcentaje.format(punto.tipoCargaActual)}
                    </td>
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
