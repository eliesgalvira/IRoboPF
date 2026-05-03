"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { NumberField } from "@base-ui/react/number-field"
import { Slider } from "@base-ui/react/slider"
import { Tabs } from "@base-ui/react/tabs"
import { Cause, Effect, Exit, Fiber, Match, Option } from "effect"
import {
  Area,
  AreaChart,
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
  formatearCentimos,
  formatearCentimosEnteros,
  formatearPuntosPorcentuales,
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
import { Tooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxChevronTrigger,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  type CambioEscenarioAuditoriaNormativa,
  comunidadesAuditoriaNormativa,
  decodificarEstrategiaProyeccionSalarial,
  decodificarMagnitudAuditada,
  decodificarPerfilAuditoriaNormativa,
  describirComunidadAutonomaAuditoria,
  describirEstrategiaAuditoriaNormativa,
  describirMagnitudAuditoriaNormativa,
  describirPerfilAuditoriaNormativa,
  estrategiasAuditoriaNormativa,
  leerEscenarioAuditoriaNormativaDesdeUrl,
  magnitudesAuditoriaNormativa,
  perfilesAuditoriaNormativa,
  escenarioPermiteReferenciaTecnica2026,
  serializarEscenarioAuditoriaNormativa,
  type EscenarioAuditoriaNormativaHistorica,
} from "@/lib/dominio/auditoria/auditoria-normativa-historica"
import {
  configuracionRangoAuditoria,
  auditarProgresividadFrio,
  type AuditoriaRangoSalarial,
  type PuntoAuditoriaRangoSalarial,
} from "@/lib/dominio/auditoria/auditoria-progresividad-frio"
import {
  exportarAuditoriaCompatibleExcelConProgreso,
  exportarAuditoriaEducativaExcel,
  type ProgresoExportacionCompatible,
} from "@/lib/export/auditoria-excel"
import { obtenerEspecificacionCompatibilidadHistorica } from "@/lib/dominio/normativa/datos/compatibilidad-historica"
import { cn } from "@/lib/utils"
import { ticksSalarioEuros } from "@/lib/auditoria-graficos"
import {
  instrumentarEffectAuditoria,
  metricaDuracionFilasGraficosAuditoria,
  metricaDuracionSeriesAuditoria,
  registrarMarcaAuditoria,
  tiempoAuditoriaMs,
} from "@/lib/observabilidad/auditoria-rendimiento"

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

type EstadoAuditoria =
  | { readonly _tag: "cargando"; readonly clave: string }
  | {
      readonly _tag: "lista"
      readonly clave: string
      readonly auditoria: AuditoriaRangoSalarial
    }
  | { readonly _tag: "error"; readonly clave: string; readonly mensaje: string }

const claveCalculoAuditoria = ({
  escenario,
  minimoCentimos,
  maximoCentimos,
}: {
  readonly escenario: EscenarioAuditoriaNormativaHistorica
  readonly minimoCentimos: number
  readonly maximoCentimos: number
}) =>
  [
    escenario.comunidadAutonoma,
    escenario.anioComparado,
    escenario.anioReferencia,
    Math.min(minimoCentimos, maximoCentimos),
    Math.max(minimoCentimos, maximoCentimos),
    configuracionRangoAuditoria.pasoCentimos,
  ].join("|")

function AuditoriaImpl({
  parametrosIniciales = "",
}: {
  readonly parametrosIniciales?: string
}) {
  const router = useRouter()
  const [escenarioAuditoria, fijarEscenarioAuditoria] = React.useState(() =>
    leerEscenarioAuditoriaNormativaDesdeUrl(
      new URLSearchParams(parametrosIniciales)
    )
  )
  const [minimoCentimos, fijarMinimoCentimos] = React.useState<number>(
    configuracionRangoAuditoria.minimoPorDefectoCentimos
  )
  const [maximoCentimos, fijarMaximoCentimos] = React.useState<number>(
    configuracionRangoAuditoria.maximoPorDefectoCentimos
  )
  const [aniosGraficoIrpf, fijarAniosGraficoIrpf] = React.useState<
    ReadonlyArray<AnioFiscal>
  >([2019, 2025])
  const [aniosGraficoNetoReal, fijarAniosGraficoNetoReal] = React.useState<
    ReadonlyArray<AnioFiscal>
  >([2019])
  const permiteReferenciaTecnica2026 = escenarioPermiteReferenciaTecnica2026({
    perfil: escenarioAuditoria.perfil,
    comunidadAutonoma: escenarioAuditoria.comunidadAutonoma,
    comunidadesAutonomas: escenarioAuditoria.comunidadesAutonomas,
  })
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

  const claveAuditoria = claveCalculoAuditoria({
    escenario: escenarioAuditoria,
    minimoCentimos,
    maximoCentimos,
  })
  const [estadoAuditoria, fijarEstadoAuditoria] =
    React.useState<EstadoAuditoria>({
      _tag: "cargando",
      clave: claveAuditoria,
    })
  const auditoria = React.useMemo(
    () =>
      Match.value(estadoAuditoria).pipe(
        Match.when({ _tag: "lista" }, (estado) =>
          Match.value(estado.clave === claveAuditoria).pipe(
            Match.when(true, () => Option.some(estado.auditoria)),
            Match.orElse(() => Option.none<AuditoriaRangoSalarial>())
          )
        ),
        Match.orElse(() => Option.none<AuditoriaRangoSalarial>())
      ),
    [claveAuditoria, estadoAuditoria]
  )
  const exportacionEnCurso = Option.isSome(Option.fromNullishOr(exportando))

  React.useEffect(() => {
    registrarMarcaAuditoria("react.auditoria.mount", {
      claveAuditoria,
      parametrosIniciales,
    })
  }, [claveAuditoria, parametrosIniciales])

  React.useEffect(() => {
    const inicio = tiempoAuditoriaMs()
    registrarMarcaAuditoria("react.auditoria.calculo.inicio", {
      claveAuditoria,
      comunidadAutonoma: escenarioAuditoria.comunidadAutonoma,
      anioComparado: escenarioAuditoria.anioComparado,
      anioReferencia: escenarioAuditoria.anioReferencia,
      minimoCentimos: Math.min(minimoCentimos, maximoCentimos),
      maximoCentimos: Math.max(minimoCentimos, maximoCentimos),
      pasoCentimos: configuracionRangoAuditoria.pasoCentimos,
    })

    const fibra = Effect.runFork(
      auditarProgresividadFrio(
        {
          perfil: "legacy-progresividad-frio",
          comunidadAutonoma: escenarioAuditoria.comunidadAutonoma,
          salarioBrutoAnualMinimoCentimos: Math.min(
            minimoCentimos,
            maximoCentimos
          ),
          salarioBrutoAnualMaximoCentimos: Math.max(
            minimoCentimos,
            maximoCentimos
          ),
          pasoCentimos: configuracionRangoAuditoria.pasoCentimos,
          anioComparado: escenarioAuditoria.anioComparado,
          anioReferencia: escenarioAuditoria.anioReferencia,
        },
        { modo: "compatible-legacy" }
      )
    )

    fibra.addObserver((exit) => {
      if (Exit.isSuccess(exit)) {
        registrarMarcaAuditoria("react.auditoria.calculo.fin", {
          claveAuditoria,
          duracionMs: Math.round(tiempoAuditoriaMs() - inicio),
          puntos: exit.value.auditoria.puntos.length,
        })
        fijarEstadoAuditoria({
          _tag: "lista",
          clave: claveAuditoria,
          auditoria: exit.value.auditoria,
        })
        return
      }

      if (Cause.hasInterruptsOnly(exit.cause)) return

      registrarMarcaAuditoria("react.auditoria.calculo.error", {
        claveAuditoria,
        duracionMs: Math.round(tiempoAuditoriaMs() - inicio),
        mensaje: String(Cause.squash(exit.cause)),
      })
      fijarEstadoAuditoria({
        _tag: "error",
        clave: claveAuditoria,
        mensaje: String(Cause.squash(exit.cause)),
      })
    })

    return () => {
      Effect.runFork(Fiber.interrupt(fibra))
    }
  }, [
    escenarioAuditoria.anioComparado,
    escenarioAuditoria.anioReferencia,
    escenarioAuditoria.comunidadAutonoma,
    claveAuditoria,
    maximoCentimos,
    minimoCentimos,
  ])

  const actualizarEscenarioAuditoria = React.useCallback(
    (cambio: CambioEscenarioAuditoriaNormativa) => {
      const parametros = serializarEscenarioAuditoriaNormativa({
        ...escenarioAuditoria,
        ...cambio,
      })
      fijarEscenarioAuditoria(
        leerEscenarioAuditoriaNormativaDesdeUrl(parametros)
      )
      router.replace(`/auditoria?${parametros.toString()}`, { scroll: false })
    },
    [escenarioAuditoria, router]
  )

  React.useEffect(() => {
    const sincronizarEscenarioConUrl = () => {
      fijarEscenarioAuditoria(
        leerEscenarioAuditoriaNormativaDesdeUrl(
          new URLSearchParams(window.location.search)
        )
      )
    }

    window.addEventListener("popstate", sincronizarEscenarioConUrl)
    return () => {
      window.removeEventListener("popstate", sincronizarEscenarioConUrl)
    }
  }, [])

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
    await Option.match(auditoria, {
      onNone: () => Promise.resolve(),
      onSome: async (auditoriaLista) => {
        if (tipo === "compatible") {
          fijarDialogoExportacionCompatible("advertencia")
          return
        }

        fijarExportando(tipo)
        try {
          await exportarAuditoriaEducativaExcel(auditoriaLista)
        } finally {
          fijarExportando(null)
        }
      },
    })
  }

  const iniciarExportacionCompatible = () => {
    Option.match(auditoria, {
      onNone: () => {},
      onSome: (auditoriaLista) => {
        const fibraActiva = Option.fromNullishOr(
          fibraExportacionCompatible.current
        )
        if (Option.isSome(fibraActiva)) return

        fijarExportando("compatible")
        fijarDialogoExportacionCompatible("progreso")
        fijarProgresoExportacionCompatible(null)
        fijarLogsExportacionCompatible([])
        fijarErrorExportacionCompatible(null)

        const fibra = Effect.runFork(
          exportarAuditoriaCompatibleExcelConProgreso(auditoriaLista, {
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

          fijarErrorExportacionCompatible(
            "No se pudo generar el XLSX compatible"
          )
          fijarLogsExportacionCompatible((logsActuales) =>
            [
              ...logsActuales,
              `Error generando la exportación: ${String(Cause.squash(exit.cause))}`,
            ].slice(-MAX_LOGS_EXPORTACION_COMPATIBLE)
          )
        })
      },
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
              Barrido determinista del rango con referencia en{" "}
              <strong>
                {Option.match(auditoria, {
                  onNone: () => escenarioAuditoria.anioReferencia,
                  onSome: (auditoriaLista) => auditoriaLista.anioReferencia,
                })}
              </strong>
              . Cada punto se calcula con la liquidación IRPF anual y el IRPF
              final conciliado del simulador; la tabla está al final.
            </p>
            <div className="flex flex-wrap gap-2 text-sm tracking-[0.22em] uppercase">
              <Button
                type="button"
                onClick={() => exportar("educativa")}
                disabled={exportacionEnCurso || Option.isNone(auditoria)}
                variant="unstyled"
                className="border-2 border-[var(--rule)] bg-[var(--paper)] px-3 py-2 transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX educativo
              </Button>
              <Button
                type="button"
                onClick={() => exportar("compatible")}
                disabled={exportacionEnCurso || Option.isNone(auditoria)}
                variant="unstyled"
                className="border-2 border-[var(--rule)] bg-[var(--rule)] px-3 py-2 text-[var(--paper)] transition-colors hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX compatible
              </Button>
            </div>
          </div>
        </section>

        <BarraFiltros
          minimoCentimos={minimoCentimos}
          maximoCentimos={maximoCentimos}
          fijarMinimoCentimos={fijarMinimoCentimos}
          fijarMaximoCentimos={fijarMaximoCentimos}
        />

        <ControlesAuditoriaNormativa
          escenario={escenarioAuditoria}
          alCambiarEscenario={actualizarEscenarioAuditoria}
        />

        <Visualizaciones
          auditoria={auditoria}
          estadoAuditoria={estadoAuditoria}
          comunidadAutonoma={escenarioAuditoria.comunidadAutonoma}
          alCambiarComunidadAutonoma={(comunidadAutonoma) =>
            actualizarEscenarioAuditoria({
              comunidadAutonoma,
              comunidadesAutonomas: [comunidadAutonoma],
            })
          }
          permiteReferenciaTecnica2026={permiteReferenciaTecnica2026}
          aniosGraficoIrpf={aniosGraficoIrpf}
          fijarAniosGraficoIrpf={fijarAniosGraficoIrpf}
          aniosGraficoNetoReal={aniosGraficoNetoReal}
          fijarAniosGraficoNetoReal={fijarAniosGraficoNetoReal}
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

export const Auditoria = AuditoriaImpl

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
              <div className="mt-5 flex flex-wrap justify-end gap-2 text-sm tracking-[0.22em] uppercase">
                <Dialog.Close
                  onClick={alCancelarAdvertencia}
                  className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 transition-colors hover:bg-[var(--danger)] hover:text-[var(--paper)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:outline-none"
                >
                  Cancelar
                </Dialog.Close>
                <Button
                  type="button"
                  onClick={alConfirmarAdvertencia}
                  variant="unstyled"
                  className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                >
                  Generar XLSX
                </Button>
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
                <div className="flex justify-between font-[family-name:var(--mono)] text-sm tabular-nums">
                  <span>{progreso?.hoja ?? "LIBRO"}</span>
                  <span>{formatearPuntosPorcentuales(progresoVisible)}</span>
                </div>
                <div className="h-4 border-2 border-[var(--rule)] bg-[var(--paper-2)]">
                  <div
                    className="h-full bg-[var(--mark)] transition-[width]"
                    style={{ width: `${progresoVisible}%` }}
                  />
                </div>
                <div className="grid gap-1 font-[family-name:var(--mono)] text-sm text-[var(--ink-soft)] tabular-nums sm:grid-cols-4">
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
                <p className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
                  Logs de cálculo
                </p>
                <ol className="mt-2 grid max-h-64 gap-1 overflow-auto font-[family-name:var(--mono)] text-sm leading-5 tabular-nums">
                  {logs.map((log, indice) => (
                    <li key={`${indice}-${log}`}>{log}</li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-wrap justify-end gap-2 text-sm tracking-[0.22em] uppercase">
                {exportando ? (
                  <Button
                    type="button"
                    onClick={alCancelarGeneracion}
                    variant="unstyled"
                    className="border-2 border-[var(--rule)] bg-[var(--paper)] px-4 py-2 shadow-[3px_3px_0_0_var(--rule)] transition-[background-color,color,border-color,box-shadow,translate] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[var(--danger)] hover:bg-[var(--danger)] hover:text-[var(--paper)] hover:shadow-[5px_5px_0_0_var(--rule)] focus-visible:-translate-x-0.5 focus-visible:-translate-y-0.5 focus-visible:border-[var(--danger)] focus-visible:bg-[var(--danger)] focus-visible:text-[var(--paper)] focus-visible:shadow-[5px_5px_0_0_var(--rule)] focus-visible:outline-none active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_0_var(--rule)]"
                  >
                    Cancelar generación
                  </Button>
                ) : null}
                {puedeCerrarProgreso ? (
                  <Button
                    type="button"
                    onClick={alCerrarProgreso}
                    variant="unstyled"
                    className="border-2 border-[var(--rule)] bg-[var(--rule)] px-4 py-2 text-[var(--paper)] transition hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)] focus-visible:outline-none"
                  >
                    Cerrar
                  </Button>
                ) : null}
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function ControlesAuditoriaNormativa({
  escenario,
  alCambiarEscenario,
}: {
  readonly escenario: EscenarioAuditoriaNormativaHistorica
  readonly alCambiarEscenario: (
    cambio: CambioEscenarioAuditoriaNormativa
  ) => void
}) {
  const perfilActivo = describirPerfilAuditoriaNormativa(escenario.perfil)
  const estrategiaActiva = describirEstrategiaAuditoriaNormativa(
    escenario.estrategiaProyeccionSalarial
  )
  const magnitudActiva = describirMagnitudAuditoriaNormativa(
    escenario.magnitudAuditada
  )

  return (
    <section className="grid gap-4 border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.32em] text-[var(--ink-soft)] uppercase">
            AUDITORÍA NORMATIVA / ESCENARIO
          </p>
          <h2 className="mt-2 font-[family-name:var(--display)] text-[clamp(1.5rem,4vw,2.25rem)] leading-none tracking-wider uppercase">
            PERFIL Y MAGNITUD
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-5 text-[var(--ink-soft)]">
          {perfilActivo.detalle} · {estrategiaActiva.detalle} ·{" "}
          {magnitudActiva.detalle}
        </p>
      </div>

      <div className="grid gap-4">
        <Tabs.Root
          value={escenario.perfil}
          onValueChange={(valor) => {
            Option.fromNullishOr(valor).pipe(
              Option.flatMap(decodificarPerfilAuditoriaNormativa),
              Option.match({
                onNone: () => {},
                onSome: (perfil) => alCambiarEscenario({ perfil }),
              })
            )
          }}
          className="grid gap-3"
        >
          <Tabs.List
            aria-label="Perfil de auditoría"
            className="grid divide-y-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-sm tracking-[0.18em] uppercase md:grid-cols-5 md:divide-x-2 md:divide-y-0"
          >
            {perfilesAuditoriaNormativa.map((perfil) => {
              const ficha = describirPerfilAuditoriaNormativa(perfil)
              return (
                <Tabs.Tab
                  key={ficha.valor}
                  value={ficha.valor}
                  className={claseBotonPestana}
                >
                  {ficha.etiqueta}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Tabs.Root
          value={escenario.estrategiaProyeccionSalarial}
          onValueChange={(valor) => {
            Option.fromNullishOr(valor).pipe(
              Option.flatMap(decodificarEstrategiaProyeccionSalarial),
              Option.match({
                onNone: () => {},
                onSome: (estrategiaProyeccionSalarial) =>
                  alCambiarEscenario({ estrategiaProyeccionSalarial }),
              })
            )
          }}
          className="grid gap-3"
        >
          <Tabs.List
            aria-label="Estrategia de proyección salarial"
            className="grid divide-y-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-sm tracking-[0.18em] uppercase sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0"
          >
            {estrategiasAuditoriaNormativa.map((estrategia) => {
              const ficha = describirEstrategiaAuditoriaNormativa(estrategia)
              return (
                <Tabs.Tab
                  key={ficha.valor}
                  value={ficha.valor}
                  className={claseBotonPestana}
                >
                  {ficha.etiqueta}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </Tabs.Root>

        <Tabs.Root
          value={escenario.magnitudAuditada}
          onValueChange={(valor) => {
            Option.fromNullishOr(valor).pipe(
              Option.flatMap(decodificarMagnitudAuditada),
              Option.match({
                onNone: () => {},
                onSome: (magnitudAuditada) =>
                  alCambiarEscenario({ magnitudAuditada }),
              })
            )
          }}
          className="grid gap-3"
        >
          <Tabs.List
            aria-label="Magnitud auditada"
            className="grid divide-y-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-sm tracking-[0.18em] uppercase sm:grid-cols-5 sm:divide-x-2 sm:divide-y-0"
          >
            {magnitudesAuditoriaNormativa.map((magnitud) => {
              const ficha = describirMagnitudAuditoriaNormativa(magnitud)
              return (
                <Tabs.Tab
                  key={ficha.valor}
                  value={ficha.valor}
                  className={claseBotonPestana}
                >
                  {ficha.etiqueta}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
        </Tabs.Root>
      </div>
    </section>
  )
}

function BarraFiltros({
  minimoCentimos,
  maximoCentimos,
  fijarMinimoCentimos,
  fijarMaximoCentimos,
}: {
  readonly minimoCentimos: number
  readonly maximoCentimos: number
  readonly fijarMinimoCentimos: (centimos: number) => void
  readonly fijarMaximoCentimos: (centimos: number) => void
}) {
  return (
    <section className="grid gap-0 border-b-2 border-[var(--rule)] py-6">
      <p className="text-sm tracking-[0.32em] text-[var(--ink-soft)] uppercase">
        FILTROS / BARRIDO
      </p>
      <div className="mt-4 grid gap-4">
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
            <div className="flex justify-between text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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
      <span className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
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

const aniosTipoEfectivoIrpfConReferenciaTecnica2026 = [
  ...ANIOS_COMPARABLES,
  2026,
] as const satisfies ReadonlyArray<AnioFiscal>
const aniosNetoReal = ANIOS_COMPARABLES

const obtenerAniosTipoEfectivoIrpf = ({
  permiteReferenciaTecnica2026,
}: {
  readonly permiteReferenciaTecnica2026: boolean
}): ReadonlyArray<AnioFiscal> =>
  Match.value(permiteReferenciaTecnica2026).pipe(
    Match.when(true, () => aniosTipoEfectivoIrpfConReferenciaTecnica2026),
    Match.orElse(() => ANIOS_COMPARABLES)
  )
const aniosPestanasTipoEfectivoIrpf =
  aniosTipoEfectivoIrpfConReferenciaTecnica2026

const coloresTipoEfectivoIrpf: Readonly<Record<AnioFiscal, string>> = {
  2012: "oklch(0.48 0.18 265)",
  2013: "oklch(0.58 0.16 225)",
  2014: "oklch(0.58 0.15 185)",
  2015: "oklch(0.52 0.16 150)",
  2016: "oklch(0.66 0.17 125)",
  2017: "oklch(0.70 0.15 105)",
  2018: "oklch(0.52 0.16 305)",
  2019: "oklch(0.78 0.16 88)",
  2020: "oklch(0.64 0.19 55)",
  2021: "oklch(0.58 0.20 25)",
  2022: "oklch(0.52 0.18 5)",
  2023: "oklch(0.54 0.18 335)",
  2024: "oklch(0.48 0.18 285)",
  2025: "oklch(0.62 0.19 35)",
  2026: "oklch(0.38 0.12 285)",
}

type ComunidadAuditada =
  EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
const claveSerieTipoEfectivoIrpf = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `irpf-${comunidadAutonoma}-${anio}`
const claveSerieNeto = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `neto-${comunidadAutonoma}-${anio}`
const claveSerieNetoPositiva = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `${claveSerieNeto(comunidadAutonoma, anio)}-positiva`
const claveSerieNetoNegativa = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `${claveSerieNeto(comunidadAutonoma, anio)}-negativa`
const etiquetaSerieAuditoria = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) =>
  `${describirComunidadAutonomaAuditoria(comunidadAutonoma).etiqueta} ${anio}`
const aniosDesdeClaveGrafico = (clave: string): ReadonlyArray<AnioFiscal> =>
  clave
    .split(",")
    .filter((valor) => valor.length > 0)
    .map((valor) => Number(valor) as AnioFiscal)

const colorSerieAuditoria = (
  _comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
): string => coloresTipoEfectivoIrpf[anio]

const configuracionTipoEfectivoIrpf = ({
  comunidadesAutonomas,
  anios,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
}): ChartConfig =>
  Object.fromEntries(
    comunidadesAutonomas.flatMap((comunidadAutonoma) =>
      anios.map((anio) => [
        claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio),
        {
          label: etiquetaSerieAuditoria(comunidadAutonoma, anio),
          color: colorSerieAuditoria(comunidadAutonoma, anio),
        },
      ])
    )
  ) satisfies ChartConfig

const configuracionNetoReal = ({
  comunidadesAutonomas,
  anios,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
}): ChartConfig =>
  Object.fromEntries(
    comunidadesAutonomas.flatMap((comunidadAutonoma) =>
      anios.flatMap((anio) => [
        [
          claveSerieNetoPositiva(comunidadAutonoma, anio),
          {
            label: etiquetaSerieAuditoria(comunidadAutonoma, anio),
            color: colorSerieAuditoria(comunidadAutonoma, anio),
          },
        ],
        [
          claveSerieNetoNegativa(comunidadAutonoma, anio),
          {
            label: etiquetaSerieAuditoria(comunidadAutonoma, anio),
            color: colorSerieAuditoria(comunidadAutonoma, anio),
          },
        ],
      ])
    )
  ) satisfies ChartConfig

type FilaTipoEfectivoIrpf = Record<string, number | string>
type FilaNetoReal = Record<string, number | string | undefined>
type EstadoDatosGrafico =
  | { readonly _tag: "cargando"; readonly clave: string }
  | {
      readonly _tag: "lista"
      readonly clave: string
      readonly tipoEfectivoIrpf: ReadonlyArray<FilaTipoEfectivoIrpf>
      readonly netoReal: ReadonlyArray<FilaNetoReal>
    }
  | { readonly _tag: "error"; readonly clave: string; readonly mensaje: string }

const obtenerPuntosAuditoriaParaAnio = (
  auditoria: AuditoriaRangoSalarial,
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
): Effect.Effect<ReadonlyArray<PuntoAuditoriaRangoSalarial>> =>
  auditarProgresividadFrio(
    {
      perfil: "legacy-progresividad-frio",
      salarioBrutoAnualMinimoCentimos:
        auditoria.salarioBrutoAnualMinimoCentimos,
      salarioBrutoAnualMaximoCentimos:
        auditoria.salarioBrutoAnualMaximoCentimos,
      pasoCentimos: auditoria.pasoCentimos,
      anioComparado: anio,
      anioReferencia: auditoria.anioReferencia,
      comunidadAutonoma,
    },
    { modo: "compatible-legacy" }
  ).pipe(Effect.map((resultado) => resultado.auditoria.puntos))

const claveEntradaSerieAuditoria = ({
  comunidadAutonoma,
  anio,
}: {
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
}) => claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)

const entradasSerieAuditoriaUnicas = ({
  comunidadesAutonomas,
  aniosSeleccionados,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
}) =>
  [
    ...new Map(
      comunidadesAutonomas.flatMap((comunidadAutonoma) =>
        aniosSeleccionados.map((anio) => [
          claveEntradaSerieAuditoria({ comunidadAutonoma, anio }),
          { comunidadAutonoma, anio },
        ])
      )
    ).values(),
  ]

const puedeReusarPuntosAuditoriaBase = ({
  auditoria,
  comunidadAutonomaAuditoriaBase,
  comunidadAutonoma,
  anio,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
}) =>
  comunidadAutonoma === comunidadAutonomaAuditoriaBase &&
  (anio === auditoria.anioComparado || anio === auditoria.anioReferencia)

const claveCacheSerieAuditoria = ({
  auditoria,
  comunidadAutonoma,
  anio,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
}) =>
  [
    comunidadAutonoma,
    anio,
    auditoria.anioReferencia,
    auditoria.salarioBrutoAnualMinimoCentimos,
    auditoria.salarioBrutoAnualMaximoCentimos,
    auditoria.pasoCentimos,
  ].join("|")

const construirSeriesAuditoria = Effect.fn(
  "auditoria.ui.construirSeriesAuditoria"
)(function* ({
  auditoria,
  comunidadAutonomaAuditoriaBase,
  comunidadesAutonomas,
  aniosSeleccionados,
  cacheSeries,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly cacheSeries: Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>
}) {
  const entradasSolicitadas = entradasSerieAuditoriaUnicas({
    comunidadesAutonomas,
    aniosSeleccionados,
  })
  const entradasDesdeCache: Array<
    readonly [string, ReadonlyArray<PuntoAuditoriaRangoSalarial>]
  > = []
  const entradasPendientes: Array<{
    readonly comunidadAutonoma: ComunidadAuditada
    readonly anio: AnioFiscal
  }> = []

  for (const entrada of entradasSolicitadas) {
    const { comunidadAutonoma, anio } = entrada
    const claveSerie = claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)
    const claveCache = claveCacheSerieAuditoria({
      auditoria,
      comunidadAutonoma,
      anio,
    })
    const cacheada = Option.fromNullishOr(cacheSeries.get(claveCache))

    if (Option.isSome(cacheada)) {
      entradasDesdeCache.push([claveSerie, cacheada.value])
      continue
    }

    if (
      puedeReusarPuntosAuditoriaBase({
        auditoria,
        comunidadAutonomaAuditoriaBase,
        comunidadAutonoma,
        anio,
      })
    ) {
      cacheSeries.set(claveCache, auditoria.puntos)
      entradasDesdeCache.push([claveSerie, auditoria.puntos])
      continue
    }

    entradasPendientes.push(entrada)
  }

  const entradasCalculadas = yield* instrumentarEffectAuditoria({
    nombre: "auditoria.ui.series.calcularPendientes",
    metrica: metricaDuracionSeriesAuditoria,
    detalles: {
      seriesSolicitadas: entradasSolicitadas.length,
      seriesReusadasDesdeCache: entradasDesdeCache.length,
      seriesCalculadas: entradasPendientes.length,
      anios: aniosSeleccionados.join(","),
      comunidades: comunidadesAutonomas.join(","),
      puntosPorSerie: auditoria.puntos.length,
    },
    efecto: Effect.forEach(
      entradasPendientes,
      ({ comunidadAutonoma, anio }) =>
        obtenerPuntosAuditoriaParaAnio(auditoria, comunidadAutonoma, anio).pipe(
          Effect.map((puntos) => {
            cacheSeries.set(
              claveCacheSerieAuditoria({ auditoria, comunidadAutonoma, anio }),
              puntos
            )
            return [
              claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio),
              puntos,
            ] as const
          })
        ),
      { concurrency: 1 }
    ),
  })

  return new Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>([
    ...entradasDesdeCache,
    ...entradasCalculadas,
  ])
})

const construirFilasTipoEfectivoIrpfDesdeSeries = ({
  auditoria,
  comunidadesAutonomas,
  aniosSeleccionados,
  series,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) =>
  auditoria.puntos.map((puntoBase, indice) => {
    const fila: FilaTipoEfectivoIrpf = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const comunidadAutonoma of comunidadesAutonomas) {
      for (const anio of aniosSeleccionados) {
        const punto = Option.fromNullishOr(
          series.get(claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio))
        ).pipe(Option.flatMap((puntos) => Option.fromNullishOr(puntos[indice])))
        if (Option.isNone(punto)) continue
        fila[claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)] =
          Match.value(anio === auditoria.anioReferencia).pipe(
            Match.when(true, () => punto.value.tipoEfectivoIrpfActual),
            Match.orElse(() => punto.value.tipoEfectivoIrpfComparado)
          )
      }
    }

    return fila
  })

const construirFilasNetoRealDesdeSeries = ({
  auditoria,
  comunidadesAutonomas,
  aniosSeleccionados,
  series,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) =>
  auditoria.puntos.map((puntoBase, indice) => {
    const fila: FilaNetoReal = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const comunidadAutonoma of comunidadesAutonomas) {
      for (const anio of aniosSeleccionados) {
        const punto = Option.fromNullishOr(
          series.get(claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio))
        ).pipe(Option.flatMap((puntos) => Option.fromNullishOr(puntos[indice])))
        if (Option.isNone(punto)) continue

        const diferencia = Match.value(anio === auditoria.anioReferencia).pipe(
          Match.when(true, () => 0),
          Match.orElse(() =>
            centimosAEuros(
              punto.value.comparacion
                .diferenciaPoderAdquisitivoNetoAnualCentimos
            )
          )
        )

        fila[claveSerieNeto(comunidadAutonoma, anio)] = diferencia
        fila[claveSerieNetoPositiva(comunidadAutonoma, anio)] =
          Match.value(diferencia >= 0).pipe(
            Match.when(true, () => Option.some(diferencia)),
            Match.orElse(() => Option.none<number>()),
            Option.getOrUndefined
          )
        fila[claveSerieNetoNegativa(comunidadAutonoma, anio)] =
          Match.value(diferencia <= 0).pipe(
            Match.when(true, () => Option.some(diferencia)),
            Match.orElse(() => Option.none<number>()),
            Option.getOrUndefined
          )
      }
    }

    return fila
  })

const construirFilasGraficosAuditoria = Effect.fn(
  "auditoria.ui.construirFilasGraficosAuditoria"
)(function* ({
  auditoria,
  comunidadAutonomaAuditoriaBase,
  comunidadesAutonomas,
  aniosIrpf,
  aniosNeto,
  cacheSeries,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosIrpf: ReadonlyArray<AnioFiscal>
  readonly aniosNeto: ReadonlyArray<AnioFiscal>
  readonly cacheSeries: Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>
}) {
  const aniosSeries = [...new Set([...aniosIrpf, ...aniosNeto])]
  const series = yield* construirSeriesAuditoria({
    auditoria,
    comunidadAutonomaAuditoriaBase,
    comunidadesAutonomas,
    aniosSeleccionados: aniosSeries,
    cacheSeries,
  })

  const tipoEfectivoIrpf = yield* instrumentarEffectAuditoria({
    nombre: "auditoria.ui.filasTipoEfectivoIrpf",
    metrica: metricaDuracionFilasGraficosAuditoria,
    detalles: {
      filas: auditoria.puntos.length,
      series: comunidadesAutonomas.length * aniosIrpf.length,
      anios: aniosIrpf.join(","),
    },
    efecto: Effect.sync(() =>
      construirFilasTipoEfectivoIrpfDesdeSeries({
        auditoria,
        comunidadesAutonomas,
        aniosSeleccionados: aniosIrpf,
        series,
      })
    ),
  })

  const netoReal = yield* instrumentarEffectAuditoria({
    nombre: "auditoria.ui.filasNetoReal",
    metrica: metricaDuracionFilasGraficosAuditoria,
    detalles: {
      filas: auditoria.puntos.length,
      series: comunidadesAutonomas.length * aniosNeto.length,
      anios: aniosNeto.join(","),
    },
    efecto: Effect.sync(() =>
      construirFilasNetoRealDesdeSeries({
        auditoria,
        comunidadesAutonomas,
        aniosSeleccionados: aniosNeto,
        series,
      })
    ),
  })

  return { tipoEfectivoIrpf, netoReal }
})

const valoresNumericosDeFilas = (
  filas: ReadonlyArray<Record<string, number | string | undefined>>,
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

const formatearTickPorcentaje = (valor: number): string =>
  `${Math.round(valor * 100)}%`

const deduccionSmiFormula = (anio: AnioFiscal): string =>
  Match.value(anio).pipe(
    Match.when(
      2025,
      () =>
        "340,00 € si bruto <= 16.576,00 €; max(0, 340,00 € - 20,00% x (bruto - 16.576,00 €)) si bruto <= 18.276,00 €; 0,00 € si supera el tramo"
    ),
    Match.when(
      2026,
      () =>
        "590,89 € si bruto <= 17.094,00 €; max(0, 590,89 € - 20,00% x (bruto - 17.094,00 €)) si bruto supera el tramo"
    ),
    Match.orElse(() => "0,00 €")
  )

const parametrosFormulaTipoEfectivoIrpf = (anio: AnioFiscal) => {
  const especificacion = obtenerEspecificacionCompatibilidadHistorica(anio)

  return {
    anio,
    minimoExentoRetencion: formatearCentimos(
      eurosACentimos(Number(especificacion.minimoExentoRetencion))
    ),
    tipoMaximoRetencion: formatearPuntosPorcentuales(
      especificacion.tipoMaximoRetencionNomina.mul(100).toString()
    ),
    deduccionSmi: deduccionSmiFormula(anio),
  }
}

const dominioEurosSimetrico = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [-1000, 1000] as const

  const maximoAbsoluto = Math.max(...valores.map(Math.abs))
  const limite = Math.max(1000, Math.ceil((maximoAbsoluto * 1.1) / 1000) * 1000)
  return [-limite, limite] as const
}

const claseBotonPestana = cn(
  "px-3 py-2 transition-colors",
  "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
  "bg-[var(--paper)] text-[var(--ink)]",
  "not-data-[active]:hover:bg-[var(--mark)]",
  "data-[active]:bg-[var(--rule)] data-[active]:text-[var(--paper)]"
)

function LeyendaNetoReal({
  payload,
}: {
  readonly payload?: ReadonlyArray<{
    readonly color?: string
    readonly dataKey?: unknown
    readonly value?: unknown
  }>
}) {
  const items = []
  const valoresIncluidos = new Set<string>()

  for (const item of payload ?? []) {
    const valor = String(item.value)
    if (valoresIncluidos.has(valor)) continue
    valoresIncluidos.add(valor)
    items.push(item)
  }

  return (
    <div className="flex flex-wrap justify-end gap-4 pt-2 font-[family-name:var(--mono)] text-sm font-bold tabular-nums">
      {items.map((item) => (
        <span
          key={String(item.dataKey)}
          className="inline-flex items-center gap-2"
        >
          <span
            className="h-0 w-5 border-t-[3px]"
            style={{ borderColor: item.color }}
          />
          {String(item.value)}
        </span>
      ))}
    </div>
  )
}

function BloqueFormula({
  children,
  tono = "neutro",
}: {
  readonly children: React.ReactNode
  readonly tono?: "neutro" | "calculo" | "limite" | "resultado"
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center border-2 border-[var(--rule)] px-2 py-1 font-[family-name:var(--mono)] text-sm font-bold tabular-nums sm:text-base",
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

function FormulaLineal({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 leading-none">
      {children}
    </div>
  )
}

function ExplicacionVariable({
  termino,
  children,
}: {
  readonly termino: string
  readonly children: React.ReactNode
}) {
  return (
    <div className="pl-0">
      <dt className="font-[family-name:var(--mono)] text-base font-bold">
        {termino}
      </dt>
      <dd className="mt-1 max-w-5xl text-base leading-7 text-[var(--ink-soft)]">
        {children}
      </dd>
    </div>
  )
}

function FormulaTipoEfectivoIrpf({
  anios,
}: {
  readonly anios: ReadonlyArray<AnioFiscal>
}) {
  return (
    <section className="mt-5 grid gap-4 border-t-2 border-[var(--rule)] pt-5">
      <div className="grid gap-3">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Cálculo aplicado
        </p>
        <FormulaLineal>
          <BloqueFormula tono="resultado">TIPO_EFECTIVO_IRPF</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="resultado">IRPF_FINAL</BloqueFormula>
          <BloqueFormula>/</BloqueFormula>
          <BloqueFormula tono="calculo">SALARIO_BRUTO_REAL</BloqueFormula>
        </FormulaLineal>
      </div>

      <div className="grid gap-3">
        <FormulaLineal>
          <BloqueFormula tono="resultado">IRPF_FINAL</BloqueFormula>
          <BloqueFormula>= min(</BloqueFormula>
          <BloqueFormula tono="calculo">
            max(0, CUOTA_LIQUIDADA - DEDUCCION_SMI)
          </BloqueFormula>
          <BloqueFormula>,</BloqueFormula>
          <BloqueFormula tono="limite">LIMITE_RETENCION_NOMINA</BloqueFormula>
          <BloqueFormula>)</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="limite">LIMITE_RETENCION_NOMINA</BloqueFormula>
          <BloqueFormula>= max(</BloqueFormula>
          <BloqueFormula>0</BloqueFormula>
          <BloqueFormula>,</BloqueFormula>
          <BloqueFormula tono="limite">
            (SALARIO_BRUTO_REAL - MINIMO_EXENTO_RETENCION) x 43%
          </BloqueFormula>
          <BloqueFormula>)</BloqueFormula>
        </FormulaLineal>
      </div>

      <dl className="grid gap-4">
        <ExplicacionVariable termino="CUOTA_LIQUIDADA">
          Resultado de aplicar las reglas anuales del IRPF antes del límite
          final usado por esta comparación histórica.
        </ExplicacionVariable>
        <ExplicacionVariable termino="DEDUCCION_SMI">
          Deducción estatal por obtención de rendimientos del trabajo que sólo
          aparece en los años en los que existe en la especificación de
          compatibilidad.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SALARIO_BRUTO_REAL">
          Salario bruto anual expresado en euros comparables, ajustado a la
          inflación del año de referencia.
        </ExplicacionVariable>
        <ExplicacionVariable termino="MINIMO_EXENTO_RETENCION">
          Umbral exento usado por el límite de retención de nómina compatible
          con el histórico.
        </ExplicacionVariable>
        <ExplicacionVariable termino="LIMITE_RETENCION_NOMINA">
          Tope de nómina: en esta comparativa el IRPF final no puede superar el
          43% de la parte del salario que queda por encima de
          MINIMO_EXENTO_RETENCION. Ese porcentaje viene del procedimiento de
          retenciones de trabajo que publica la AEAT para calcular cuánto debe
          retener una nómina a cuenta del IRPF. La AEAT lo documenta en su
          página de{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/Retenciones.shtml"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            Retenciones
          </a>{" "}
          y en el PDF técnico del{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/static_files/Sede/Programas_ayuda/Retenciones/2026/ALGORITMO_2026.pdf"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            algoritmo de retenciones IRPF 2026
          </a>
          . No reemplaza a la liquidación anual completa: sólo limita el
          resultado para que el histórico se compare con la misma lógica de
          retención de nómina.
        </ExplicacionVariable>
      </dl>

      <p className="max-w-4xl text-base leading-7 text-[var(--ink)]">
        La fórmula es común; por año sólo se sustituyen sus parámetros
        normativos.
      </p>

      <div className="grid items-stretch gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {anios.map((anio) => {
          const parametros = parametrosFormulaTipoEfectivoIrpf(anio)
          return (
            <div
              key={`formula-irpf-${anio}`}
              className="grid h-full grid-rows-[auto_auto_minmax(6rem,1fr)] gap-2 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 shadow-[3px_3px_0_0_var(--rule)]"
              style={{ borderBottomColor: coloresTipoEfectivoIrpf[anio] }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-[family-name:var(--mono)] text-xl font-bold tabular-nums">
                  {anio}
                </span>
                <span
                  className="h-0 w-10 border-t-[5px]"
                  style={{ borderColor: coloresTipoEfectivoIrpf[anio] }}
                />
              </div>
              <dl className="grid gap-1 text-sm leading-5">
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--ink-soft)]">
                    MINIMO_EXENTO_RETENCION
                  </dt>
                  <dd className="font-[family-name:var(--mono)] font-bold tabular-nums">
                    {parametros.minimoExentoRetencion}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-[var(--ink-soft)]">Tipo límite</dt>
                  <dd className="font-[family-name:var(--mono)] font-bold tabular-nums">
                    {parametros.tipoMaximoRetencion}
                  </dd>
                </div>
              </dl>
              <div className="grid content-start gap-1">
                <p className="text-sm leading-5 text-[var(--ink-soft)]">
                  DEDUCCION_SMI
                </p>
                <p className="font-[family-name:var(--mono)] text-sm leading-5">
                  {parametros.deduccionSmi}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BotonAnioTipoEfectivoIrpf({
  anio,
  activo,
  disponible,
  alAlternar,
}: {
  readonly anio: AnioFiscal
  readonly activo: boolean
  readonly disponible: boolean
  readonly alAlternar: (anio: AnioFiscal) => void
}) {
  const boton = (
    <Button
      key={anio}
      type="button"
      aria-disabled={!disponible}
      aria-pressed={disponible ? activo : false}
      onClick={() => {
        if (disponible) alAlternar(anio)
      }}
      variant="unstyled"
      className={cn(
        "h-9 w-full min-w-0 bg-[var(--paper)] px-2 font-[family-name:var(--mono)] text-sm font-bold tabular-nums transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
        disponible && activo && "text-[var(--ink)]",
        disponible &&
          !activo &&
          "text-[var(--ink-soft)] opacity-55 hover:opacity-100",
        !disponible &&
          "cursor-not-allowed bg-[var(--paper-2)] text-[var(--ink-soft)] opacity-45"
      )}
      style={{
        boxShadow:
          disponible && activo
            ? `inset 0 -4px 0 ${coloresTipoEfectivoIrpf[anio]}`
            : undefined,
      }}
    >
      {anio}
    </Button>
  )

  return disponible ? (
    boton
  ) : (
    <Tooltip
      className="w-full"
      contenido="2026 no está disponible para esta comunidad autónoma: sus datos autonómicos todavía no se han actualizado a 2026. Usa Simulada estatal para ver la referencia técnica 2026."
    >
      {boton}
    </Tooltip>
  )
}

function Visualizaciones({
  auditoria,
  estadoAuditoria,
  comunidadAutonoma,
  alCambiarComunidadAutonoma,
  permiteReferenciaTecnica2026,
  aniosGraficoIrpf,
  fijarAniosGraficoIrpf,
  aniosGraficoNetoReal,
  fijarAniosGraficoNetoReal,
}: {
  readonly auditoria: Option.Option<AuditoriaRangoSalarial>
  readonly estadoAuditoria: EstadoAuditoria
  readonly comunidadAutonoma: ComunidadAuditada
  readonly alCambiarComunidadAutonoma: (
    comunidadAutonoma: ComunidadAuditada
  ) => void
  readonly permiteReferenciaTecnica2026: boolean
  readonly aniosGraficoIrpf: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoIrpf: (anios: ReadonlyArray<AnioFiscal>) => void
  readonly aniosGraficoNetoReal: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoNetoReal: (anios: ReadonlyArray<AnioFiscal>) => void
}) {
  const comunidadesAutonomas = [comunidadAutonoma] as const
  const opcionesComunidadAutonoma = comunidadesAuditoriaNormativa.map(
    describirComunidadAutonomaAuditoria
  )
  const opcionComunidadAutonoma =
    opcionesComunidadAutonoma.find(
      (opcion) => opcion.valor === comunidadAutonoma
    ) ?? opcionesComunidadAutonoma[0]
  const aniosTipoEfectivoIrpf = obtenerAniosTipoEfectivoIrpf({
    permiteReferenciaTecnica2026,
  })
  const aniosGraficoIrpfVisibles = aniosGraficoIrpf.filter((anio) =>
    aniosTipoEfectivoIrpf.includes(anio)
  )
  const claveAniosGraficoIrpfVisibles = aniosGraficoIrpfVisibles.join(",")
  const claveAniosGraficoNetoReal = aniosGraficoNetoReal.join(",")
  const claveDatosGrafico = Option.match(auditoria, {
    onNone: () => "sin-auditoria",
    onSome: (auditoriaLista) =>
      [
        comunidadAutonoma,
        auditoriaLista.anioReferencia,
        auditoriaLista.salarioBrutoAnualMinimoCentimos,
        auditoriaLista.salarioBrutoAnualMaximoCentimos,
        auditoriaLista.pasoCentimos,
        claveAniosGraficoIrpfVisibles,
        claveAniosGraficoNetoReal,
      ].join("|"),
  })
  const [estadoDatosGrafico, fijarEstadoDatosGrafico] =
    React.useState<EstadoDatosGrafico>({
      _tag: "cargando",
      clave: "sin-auditoria",
    })
  const cacheSeriesAuditoria = React.useRef(
    new Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>()
  )
  const inicioCalculoDatosGrafico =
    React.useRef<Option.Option<number>>(Option.none())
  const finCalculoDatosGrafico =
    React.useRef<Option.Option<number>>(Option.none())

  React.useEffect(() => {
    return Option.match(auditoria, {
      onNone: () => {},
      onSome: (auditoriaLista) => {
        const aniosIrpf = aniosDesdeClaveGrafico(claveAniosGraficoIrpfVisibles)
        const aniosNeto = aniosDesdeClaveGrafico(claveAniosGraficoNetoReal)
        const comunidades = [comunidadAutonoma] as const
        const inicio = tiempoAuditoriaMs()
        inicioCalculoDatosGrafico.current = Option.some(inicio)
        finCalculoDatosGrafico.current = Option.none()
        registrarMarcaAuditoria("react.graficos.datos.inicio", {
          claveDatosGrafico,
          comunidadAutonoma,
          aniosIrpf: aniosIrpf.join(","),
          aniosNeto: aniosNeto.join(","),
          puntosBase: auditoriaLista.puntos.length,
        })

        const fibra = Effect.runFork(
          construirFilasGraficosAuditoria({
            auditoria: auditoriaLista,
            comunidadAutonomaAuditoriaBase: comunidadAutonoma,
            comunidadesAutonomas: comunidades,
            aniosIrpf,
            aniosNeto,
            cacheSeries: cacheSeriesAuditoria.current,
          })
        )

        fibra.addObserver((exit) => {
          if (Exit.isSuccess(exit)) {
            const fin = tiempoAuditoriaMs()
            finCalculoDatosGrafico.current = Option.some(fin)
            registrarMarcaAuditoria("react.graficos.datos.fin", {
              claveDatosGrafico,
              duracionMs: Math.round(fin - inicio),
              filasTipoEfectivoIrpf: exit.value.tipoEfectivoIrpf.length,
              filasNetoReal: exit.value.netoReal.length,
            })
            fijarEstadoDatosGrafico({
              _tag: "lista",
              clave: claveDatosGrafico,
              tipoEfectivoIrpf: exit.value.tipoEfectivoIrpf,
              netoReal: exit.value.netoReal,
            })
            return
          }

          if (Cause.hasInterruptsOnly(exit.cause)) return

          registrarMarcaAuditoria("react.graficos.datos.error", {
            claveDatosGrafico,
            duracionMs: Math.round(tiempoAuditoriaMs() - inicio),
            mensaje: String(Cause.squash(exit.cause)),
          })
          fijarEstadoDatosGrafico({
            _tag: "error",
            clave: claveDatosGrafico,
            mensaje: String(Cause.squash(exit.cause)),
          })
        })

        return () => {
          Effect.runFork(Fiber.interrupt(fibra))
        }
      },
    })
  }, [
    claveAniosGraficoIrpfVisibles,
    claveAniosGraficoNetoReal,
    claveDatosGrafico,
    comunidadAutonoma,
    auditoria,
  ])

  const estadoDatosGraficoActual = Option.match(auditoria, {
    onNone: () =>
      Match.value(estadoAuditoria).pipe(
        Match.when(
          { _tag: "error" },
          (estado) =>
            ({
              _tag: "error",
              clave: claveDatosGrafico,
              mensaje: estado.mensaje,
            }) satisfies EstadoDatosGrafico
        ),
        Match.orElse(
          () =>
            ({
              _tag: "cargando",
              clave: claveDatosGrafico,
            }) satisfies EstadoDatosGrafico
        )
      ),
    onSome: () =>
      Match.value(estadoDatosGrafico.clave === claveDatosGrafico).pipe(
        Match.when(true, () => estadoDatosGrafico),
        Match.orElse(
          () =>
            ({
              _tag: "cargando",
              clave: claveDatosGrafico,
            }) satisfies EstadoDatosGrafico
        )
      ),
  })
  const datosTipoEfectivoIrpf = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.tipoEfectivoIrpf),
    Match.orElse(() => [])
  )
  const datosNetoReal = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.netoReal),
    Match.orElse(() => [])
  )
  const graficoCargando = estadoDatosGraficoActual._tag === "cargando"
  const errorGrafico = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "error" }, (estado) => Option.some(estado.mensaje)),
    Match.orElse(() => Option.none<string>())
  )

  React.useLayoutEffect(() => {
    if (estadoDatosGraficoActual._tag !== "lista") return

    const finDatos = finCalculoDatosGrafico.current
    registrarMarcaAuditoria("react.graficos.commit", {
      claveDatosGrafico: estadoDatosGraficoActual.clave,
      msDesdeDatosListos: Option.map(finDatos, (fin) =>
        Math.round(tiempoAuditoriaMs() - fin)
      ),
      filasTipoEfectivoIrpf: estadoDatosGraficoActual.tipoEfectivoIrpf.length,
      filasNetoReal: estadoDatosGraficoActual.netoReal.length,
    })
  }, [estadoDatosGraficoActual])

  const clavesTipoEfectivoIrpf = comunidadesAutonomas.flatMap(
    (comunidadAutonoma) =>
      aniosGraficoIrpfVisibles.map((anio) =>
        claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)
      )
  )
  const clavesNetoReal = comunidadesAutonomas.flatMap((comunidadAutonoma) =>
    aniosGraficoNetoReal.map((anio) => claveSerieNeto(comunidadAutonoma, anio))
  )
  const configTipoEfectivoIrpf = configuracionTipoEfectivoIrpf({
    comunidadesAutonomas,
    anios: aniosGraficoIrpfVisibles,
  })
  const configNetoReal = configuracionNetoReal({
    comunidadesAutonomas,
    anios: aniosGraficoNetoReal,
  })
  const dominioTipoEfectivoIrpf = dominioPorcentaje(
    valoresNumericosDeFilas(datosTipoEfectivoIrpf, clavesTipoEfectivoIrpf)
  )
  const ticksTipoEfectivoIrpf = ticksPorcentaje(dominioTipoEfectivoIrpf)
  const rangoSalarioCentimos = Option.match(auditoria, {
    onNone: () => ({
      minimo: configuracionRangoAuditoria.minimoPorDefectoCentimos,
      maximo: configuracionRangoAuditoria.maximoPorDefectoCentimos,
    }),
    onSome: (auditoriaLista) => ({
      minimo: auditoriaLista.salarioBrutoAnualMinimoCentimos,
      maximo: auditoriaLista.salarioBrutoAnualMaximoCentimos,
    }),
  })
  const ticksSalario = ticksSalarioEuros({
    minimoEuros: centimosAEuros(rangoSalarioCentimos.minimo),
    maximoEuros: centimosAEuros(rangoSalarioCentimos.maximo),
  })
  const dominioSalario = [
    centimosAEuros(rangoSalarioCentimos.minimo),
    centimosAEuros(rangoSalarioCentimos.maximo),
  ] as const
  const dominioDiferencia = dominioEurosSimetrico(
    valoresNumericosDeFilas(datosNetoReal, clavesNetoReal)
  )
  const alternarAnioIrpf = (anio: AnioFiscal) => {
    const siguiente = aniosGraficoIrpf.includes(anio)
      ? aniosGraficoIrpf.filter((anioSeleccionado) => anioSeleccionado !== anio)
      : [...aniosGraficoIrpf, anio].sort((a, b) => a - b)
    fijarAniosGraficoIrpf(siguiente.length > 0 ? siguiente : [anio])
  }
  const alternarAnioNetoReal = (anio: AnioFiscal) => {
    const siguiente = aniosGraficoNetoReal.includes(anio)
      ? aniosGraficoNetoReal.filter(
          (anioSeleccionado) => anioSeleccionado !== anio
        )
      : [...aniosGraficoNetoReal, anio].sort((a, b) => a - b)
    fijarAniosGraficoNetoReal(siguiente.length > 0 ? siguiente : [anio])
  }
  const claseGraficoTipoEfectivoIrpf =
    "mt-4 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(24rem,52vw,34rem)]"
  const claseGraficoNetoReal =
    "mt-4 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"

  return (
    <section className="border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          EXPLORACIÓN POR RANGO SALARIAL
        </h2>
      </div>
      <Tabs.Root defaultValue="tipo-irpf" className="mt-5 grid gap-4">
        <Tabs.List className="inline-flex w-fit divide-x-2 divide-[var(--rule)] justify-self-start border-2 border-[var(--rule)] text-sm tracking-[0.22em] uppercase">
          {(["tipo-irpf", "neto-real"] as const).map((vista) => (
            <Tabs.Tab key={vista} value={vista} className={claseBotonPestana}>
              {vista === "tipo-irpf" ? "TIPO IRPF" : "NETO REAL"}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel
          value="tipo-irpf"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid w-full max-w-3xl gap-3">
              <p className="text-sm leading-5 text-[var(--ink-soft)]">
                TIPO EFECTIVO DEL IRPF POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN
              </p>
              <Combobox
                items={opcionesComunidadAutonoma}
                value={opcionComunidadAutonoma}
                itemToStringValue={(opcion) => opcion.valor}
                itemToStringLabel={(opcion) => opcion.etiqueta}
                isItemEqualToValue={(opcion, valor) =>
                  opcion.valor === valor.valor
                }
                onValueChange={(opcion) => {
                  if (opcion === null) return
                  alCambiarComunidadAutonoma(opcion.valor)
                }}
              >
                <ComboboxInputGroup className="w-full max-w-[22rem]">
                  <ComboboxInput
                    aria-label="Buscar comunidad autónoma"
                    placeholder="Buscar comunidad autónoma"
                    className="min-w-0"
                  />
                  <ComboboxChevronTrigger />
                </ComboboxInputGroup>
                <ComboboxContent>
                  <ComboboxEmpty>
                    No hay comunidades con ese texto.
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(opcion) => (
                      <ComboboxItem key={opcion.valor} value={opcion}>
                        {opcion.etiqueta}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <div
              role="group"
              aria-label="Años visibles en la gráfica de tipo efectivo del IRPF"
              className="grid w-full grid-cols-5 gap-px bg-[var(--rule)] lg:[grid-template-columns:repeat(15,minmax(0,1fr))]"
            >
              {aniosPestanasTipoEfectivoIrpf.map((anio) => {
                const disponible = aniosTipoEfectivoIrpf.includes(anio)
                const activo = disponible && aniosGraficoIrpf.includes(anio)
                return (
                  <BotonAnioTipoEfectivoIrpf
                    key={anio}
                    anio={anio}
                    activo={activo}
                    disponible={disponible}
                    alAlternar={alternarAnioIrpf}
                  />
                )
              })}
            </div>
          </div>
          {graficoCargando ? (
            <Skeleton
              aria-label="Cargando gráfica de tipo efectivo del IRPF"
              className={claseGraficoTipoEfectivoIrpf}
            />
          ) : Option.isSome(errorGrafico) || Option.isNone(auditoria) ? (
            <div
              className={cn(
                claseGraficoTipoEfectivoIrpf,
                "grid place-items-center border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-center text-sm leading-6 text-[var(--ink-soft)]"
              )}
            >
              No se pudo calcular la gráfica:{" "}
              {Option.getOrElse(errorGrafico, () => "sin datos")}
            </div>
          ) : (
            <ChartContainer
              config={configTipoEfectivoIrpf}
              className={claseGraficoTipoEfectivoIrpf}
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
                  fontSize={14}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  width={44}
                  domain={dominioTipoEfectivoIrpf}
                  ticks={ticksTipoEfectivoIrpf}
                  fontSize={14}
                  tickFormatter={formatearTickPorcentaje}
                />
                <ChartTooltip
                  isAnimationActive={false}
                  allowEscapeViewBox={{ x: false, y: false }}
                  wrapperStyle={{ zIndex: 10, maxWidth: "min(24rem, 90vw)" }}
                  cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                  content={
                    <ChartTooltipContent
                      className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[5px_5px_0_0_var(--rule)]"
                      formatter={(valor, nombre, item) => (
                        <span
                          className="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
                          style={{ color: item.color }}
                        >
                          {porcentaje.format(Number(valor))} ({nombre})
                        </span>
                      )}
                      labelClassName="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
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
                    fontSize: 14,
                    fontWeight: 700,
                    paddingTop: 8,
                  }}
                />
                {comunidadesAutonomas.flatMap((comunidadAutonoma) =>
                  aniosGraficoIrpfVisibles.map((anio) => {
                    const clave = claveSerieTipoEfectivoIrpf(
                      comunidadAutonoma,
                      anio
                    )

                    return (
                      <Line
                        key={clave}
                        dataKey={clave}
                        name={etiquetaSerieAuditoria(comunidadAutonoma, anio)}
                        type="monotone"
                        stroke={`var(--color-${clave})`}
                        strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        isAnimationActive={false}
                      />
                    )
                  })
                )}
              </LineChart>
            </ChartContainer>
          )}
          <FormulaTipoEfectivoIrpf anios={aniosGraficoIrpfVisibles} />
        </Tabs.Panel>
        <Tabs.Panel
          value="neto-real"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-3xl text-sm leading-5 text-[var(--ink-soft)]">
              DIFERENCIA ANUAL DE PODER ADQUISITIVO NETO POR SALARIO BRUTO. SI
              ES POSITIVA, EL AÑO COMPARADO DEJABA MÁS NETO REAL QUE{" "}
              {Option.match(auditoria, {
                onNone: () => 2025,
                onSome: (auditoriaLista) => auditoriaLista.anioReferencia,
              })}
              .
            </p>
            <div
              role="group"
              aria-label="Años visibles en la gráfica de neto real"
              className="grid w-full grid-cols-5 gap-px bg-[var(--rule)] lg:[grid-template-columns:repeat(15,minmax(0,1fr))]"
            >
              {aniosNetoReal.map((anio) => {
                const activo = aniosGraficoNetoReal.includes(anio)
                return (
                  <Button
                    key={anio}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alternarAnioNetoReal(anio)}
                    variant="unstyled"
                    className={cn(
                      "h-9 min-w-0 bg-[var(--paper)] px-2 font-[family-name:var(--mono)] text-sm font-bold tabular-nums transition-colors",
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
                  </Button>
                )
              })}
            </div>
          </div>
          {graficoCargando ? (
            <Skeleton
              aria-label="Cargando gráfica de neto real"
              className={claseGraficoNetoReal}
            />
          ) : Option.isSome(errorGrafico) || Option.isNone(auditoria) ? (
            <div
              className={cn(
                claseGraficoNetoReal,
                "grid place-items-center border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-center text-sm leading-6 text-[var(--ink-soft)]"
              )}
            >
              No se pudo calcular la gráfica:{" "}
              {Option.getOrElse(errorGrafico, () => "sin datos")}
            </div>
          ) : (
            <ChartContainer
              config={configNetoReal}
              className={claseGraficoNetoReal}
            >
              <AreaChart
                accessibilityLayer
                data={datosNetoReal}
                baseValue={0}
                margin={{ left: 4, right: 18, top: 4, bottom: 28 }}
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
                  fontSize={14}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "var(--rule)" }}
                  tickMargin={4}
                  width={44}
                  domain={dominioDiferencia}
                  fontSize={14}
                  tickFormatter={(valor: number) =>
                    Math.abs(valor) >= 1000
                      ? `${Math.round(valor / 1000)}k`
                      : String(valor)
                  }
                />
                <ChartTooltip
                  isAnimationActive={false}
                  allowEscapeViewBox={{ x: false, y: false }}
                  wrapperStyle={{ zIndex: 10, maxWidth: "min(24rem, 90vw)" }}
                  cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                  content={
                    <ChartTooltipContent
                      className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[5px_5px_0_0_var(--rule)]"
                      formatter={(valor, nombre, item) => (
                        <span
                          className="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
                          style={{ color: item.color }}
                        >
                          {dinero.format(Number(valor))} ({nombre})
                        </span>
                      )}
                      labelClassName="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
                      labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                    />
                  }
                />
                <Legend
                  verticalAlign="bottom"
                  align="right"
                  iconType="plainline"
                  content={<LeyendaNetoReal />}
                  wrapperStyle={{
                    fontFamily: "var(--mono)",
                    fontSize: 14,
                    fontWeight: 700,
                    paddingTop: 8,
                  }}
                />
                {comunidadesAutonomas.flatMap((comunidadAutonoma) =>
                  aniosGraficoNetoReal.flatMap((anio) => {
                    const clavePositiva = claveSerieNetoPositiva(
                      comunidadAutonoma,
                      anio
                    )
                    const claveNegativa = claveSerieNetoNegativa(
                      comunidadAutonoma,
                      anio
                    )
                    const nombre = etiquetaSerieAuditoria(
                      comunidadAutonoma,
                      anio
                    )
                    const color = colorSerieAuditoria(comunidadAutonoma, anio)

                    return [
                      <Area
                        key={clavePositiva}
                        dataKey={clavePositiva}
                        name={nombre}
                        type="monotone"
                        stroke={color}
                        strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                        fill={color}
                        fillOpacity={0.16}
                        legendType="plainline"
                        baseValue={0}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        connectNulls={false}
                        isAnimationActive={false}
                      />,
                      <Area
                        key={claveNegativa}
                        dataKey={claveNegativa}
                        name={nombre}
                        type="monotone"
                        stroke={color}
                        strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                        fill={color}
                        fillOpacity={0.18}
                        legendType="plainline"
                        baseValue={0}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                        connectNulls={false}
                        isAnimationActive={false}
                      />,
                    ]
                  })
                )}
              </AreaChart>
            </ChartContainer>
          )}
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
