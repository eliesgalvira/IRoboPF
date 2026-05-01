"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  type CambioEscenarioAuditoriaNormativa,
  comunidadesAuditoriaNormativa,
  decodificarComunidadAutonomaAuditoria,
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
import { cn } from "@/lib/utils"
import { ticksSalarioEuros } from "@/lib/auditoria-graficos"

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
  | { readonly _tag: "cargando" }
  | { readonly _tag: "lista"; readonly auditoria: AuditoriaRangoSalarial }
  | { readonly _tag: "error"; readonly mensaje: string }

function AuditoriaImpl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const escenarioAuditoria =
    leerEscenarioAuditoriaNormativaDesdeUrl(searchParams)
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

  const [estadoAuditoria, fijarEstadoAuditoria] =
    React.useState<EstadoAuditoria>({ _tag: "cargando" })
  const auditoria =
    estadoAuditoria._tag === "lista" ? estadoAuditoria.auditoria : null

  React.useEffect(() => {
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
        fijarEstadoAuditoria({
          _tag: "lista",
          auditoria: exit.value.auditoria,
        })
        return
      }

      if (Cause.hasInterruptsOnly(exit.cause)) return

      fijarEstadoAuditoria({
        _tag: "error",
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
    maximoCentimos,
    minimoCentimos,
  ])

  const actualizarEscenarioAuditoria = React.useCallback(
    (cambio: CambioEscenarioAuditoriaNormativa) => {
      const parametros = serializarEscenarioAuditoriaNormativa({
        ...escenarioAuditoria,
        ...cambio,
      })
      router.replace(`${pathname}?${parametros.toString()}`, { scroll: false })
    },
    [escenarioAuditoria, pathname, router]
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
    if (auditoria === null) return

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
    if (auditoria === null) return
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

  if (auditoria === null) {
    return (
      <main className="min-h-svh">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="border-b-2 border-[var(--rule)] pb-4">
            <NavegacionSitio />
          </header>
          <section className="border-b-2 border-[var(--rule)] py-8">
            <h1 className="font-[family-name:var(--display)] text-[clamp(2.4rem,9vw,5.8rem)] leading-none tracking-wider uppercase">
              AUDITORÍA
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--ink-soft)] uppercase">
              {estadoAuditoria._tag === "error"
                ? `No se pudo calcular la auditoría: ${estadoAuditoria.mensaje}`
                : "Calculando la liquidación IRPF anual por rango salarial..."}
            </p>
          </section>
        </div>
      </main>
    )
  }

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
              <strong>{auditoria.anioReferencia}</strong>. Cada punto se calcula
              con la liquidación IRPF anual y el IRPF final conciliado del
              simulador; la tabla está al final.
            </p>
            <div className="flex flex-wrap gap-2 text-sm tracking-[0.22em] uppercase">
              <Button
                type="button"
                onClick={() => exportar("educativa")}
                disabled={exportando !== null}
                variant="unstyled"
                className="border-2 border-[var(--rule)] bg-[var(--paper)] px-3 py-2 transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none disabled:opacity-40"
              >
                ↓ XLSX educativo
              </Button>
              <Button
                type="button"
                onClick={() => exportar("compatible")}
                disabled={exportando !== null}
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
          anioComparado={escenarioAuditoria.anioComparado}
          fijarMinimoCentimos={fijarMinimoCentimos}
          fijarMaximoCentimos={fijarMaximoCentimos}
          fijarAnioComparado={(anioComparado) =>
            actualizarEscenarioAuditoria({ anioComparado })
          }
        />

        <ControlesAuditoriaNormativa
          escenario={escenarioAuditoria}
          alCambiarEscenario={actualizarEscenarioAuditoria}
        />

        <Visualizaciones
          auditoria={auditoria}
          comunidadAutonoma={escenarioAuditoria.comunidadAutonoma}
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
                  <span>{progresoVisible.toFixed(1)}%</span>
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
  const comunidadActiva = describirComunidadAutonomaAuditoria(
    escenario.comunidadAutonoma
  )
  const opcionesComunidadAutonoma = comunidadesAuditoriaNormativa.map(
    describirComunidadAutonomaAuditoria
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
          {magnitudActiva.detalle} · {comunidadActiva.detalle}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)]">
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

        <Combobox
          compacto
          etiqueta="Comunidad autónoma"
          opciones={opcionesComunidadAutonoma}
          valor={escenario.comunidadAutonoma}
          onChange={(valor) => {
            decodificarComunidadAutonomaAuditoria(valor).pipe(
              Option.match({
                onNone: () => {},
                onSome: (comunidadAutonoma) =>
                  alCambiarEscenario({ comunidadAutonoma }),
              })
            )
          }}
          classNames={{
            etiqueta:
              "min-h-0 text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase",
            trigger:
              "h-10 rounded-none border-2 border-[var(--rule)] bg-[var(--paper)] px-3 font-[family-name:var(--mono)] text-sm font-bold tracking-[0.12em] uppercase shadow-[3px_3px_0_0_var(--rule)] hover:bg-[var(--mark)] hover:text-[var(--mark-ink)] focus-visible:bg-[var(--mark)] focus-visible:text-[var(--mark-ink)]",
            listbox:
              "border-2 border-[var(--rule)] shadow-[5px_5px_0_0_var(--rule)]",
            opcion:
              "rounded-none font-[family-name:var(--mono)] tracking-[0.08em] uppercase hover:bg-[var(--mark)] hover:text-[var(--mark-ink)]",
            opcionActiva: "bg-[var(--rule)] text-[var(--paper)]",
          }}
        />
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
      <p className="text-sm tracking-[0.32em] text-[var(--ink-soft)] uppercase">
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
        <div className="grid gap-2">
          <span className="text-sm tracking-[0.3em] text-[var(--ink-soft)] uppercase">
            AÑO COMPARADO
          </span>
          <div
            role="radiogroup"
            className="grid grid-cols-7 gap-px bg-[var(--rule)]"
          >
            {ANIOS_COMPARABLES.map((anio) => {
              const activo = anio === anioComparado
              return (
                <Button
                  key={anio}
                  type="button"
                  role="radio"
                  aria-checked={activo}
                  onClick={() => fijarAnioComparado(anio)}
                  variant="unstyled"
                  className={cn(
                    "h-12 font-[family-name:var(--mono)] text-sm font-bold tabular-nums transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
                    activo
                      ? "bg-[var(--mark)] text-[var(--mark-ink)]"
                      : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
                  )}
                >
                  {anio}
                </Button>
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
const claveDiferenciaNeta = (anio: AnioFiscal) => `neto${anio}`
const claveDiferenciaNetaPositiva = (anio: AnioFiscal) =>
  `${claveDiferenciaNeta(anio)}Positiva`
const claveDiferenciaNetaNegativa = (anio: AnioFiscal) =>
  `${claveDiferenciaNeta(anio)}Negativa`
const aniosDesdeClaveGrafico = (clave: string): ReadonlyArray<AnioFiscal> =>
  clave
    .split(",")
    .filter((valor) => valor.length > 0)
    .map((valor) => Number(valor) as AnioFiscal)

const configuracionTipoEfectivoIrpf = Object.fromEntries(
  aniosTipoEfectivoIrpfConReferenciaTecnica2026.map((anio) => [
    claveAnio(anio),
    {
      label: String(anio),
      color: coloresTipoEfectivoIrpf[anio],
    },
  ])
) satisfies ChartConfig

const configuracionNetoReal = Object.fromEntries(
  aniosNetoReal.flatMap((anio) => [
    [
      claveDiferenciaNetaPositiva(anio),
      {
        label: String(anio),
        color: coloresTipoEfectivoIrpf[anio],
      },
    ],
    [
      claveDiferenciaNetaNegativa(anio),
      {
        label: String(anio),
        color: "var(--gain)",
      },
    ],
  ])
) satisfies ChartConfig

type FilaTipoEfectivoIrpf = Record<string, number | string>
type FilaNetoReal = Record<string, number | string | null>

const obtenerPuntosAuditoriaParaAnio = (
  auditoria: AuditoriaRangoSalarial,
  comunidadAutonoma: EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"],
  anio: AnioFiscal
): Effect.Effect<ReadonlyArray<PuntoAuditoriaRangoSalarial>> =>
  Match.value(anio).pipe(
    Match.when(
      (anio) =>
        anio === auditoria.anioReferencia || anio === auditoria.anioComparado,
      () => Effect.succeed(auditoria.puntos)
    ),
    Match.orElse((anio) =>
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
    )
  )

const construirSeriesAuditoria = Effect.fn(
  "auditoria.ui.construirSeriesAuditoria"
)(function* ({
  auditoria,
  comunidadAutonoma,
  aniosSeleccionados,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
}) {
  const entradas = yield* Effect.forEach(
    aniosSeleccionados,
    (anio) =>
      obtenerPuntosAuditoriaParaAnio(auditoria, comunidadAutonoma, anio).pipe(
        Effect.map((puntos) => [anio, puntos] as const)
      ),
    { concurrency: 4 }
  )

  return new Map<AnioFiscal, ReadonlyArray<PuntoAuditoriaRangoSalarial>>(
    entradas
  )
})

const filasTipoEfectivoIrpf = Effect.fn(
  "auditoria.ui.filasTipoEfectivoIrpf"
)(function* ({
  auditoria,
  comunidadAutonoma,
  aniosSeleccionados,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
}) {
  const series = yield* construirSeriesAuditoria({
    auditoria,
    comunidadAutonoma,
    aniosSeleccionados,
  })

  return auditoria.puntos.map((puntoBase, indice) => {
    const fila: FilaTipoEfectivoIrpf = {
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
})

const filasNetoReal = Effect.fn("auditoria.ui.filasNetoReal")(function* ({
  auditoria,
  comunidadAutonoma,
  aniosSeleccionados,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
}) {
  const series = yield* construirSeriesAuditoria({
    auditoria,
    comunidadAutonoma,
    aniosSeleccionados,
  })

  return auditoria.puntos.map((puntoBase, indice) => {
    const fila: FilaNetoReal = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const anio of aniosSeleccionados) {
      const punto = series.get(anio)?.[indice]
      if (punto === undefined) continue

      const diferencia = centimosAEuros(
        punto.comparacion.diferenciaPoderAdquisitivoNetoAnualCentimos
      )

      fila[claveDiferenciaNeta(anio)] = diferencia
      fila[claveDiferenciaNetaPositiva(anio)] =
        diferencia >= 0 ? diferencia : null
      fila[claveDiferenciaNetaNegativa(anio)] =
        diferencia <= 0 ? diferencia : null
    }

    return fila
  })
})

const valoresNumericosDeFilas = (
  filas: ReadonlyArray<Record<string, number | string | null>>,
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

function Visualizaciones({
  auditoria,
  comunidadAutonoma,
  permiteReferenciaTecnica2026,
  aniosGraficoIrpf,
  fijarAniosGraficoIrpf,
  aniosGraficoNetoReal,
  fijarAniosGraficoNetoReal,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
  readonly permiteReferenciaTecnica2026: boolean
  readonly aniosGraficoIrpf: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoIrpf: (anios: ReadonlyArray<AnioFiscal>) => void
  readonly aniosGraficoNetoReal: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoNetoReal: (anios: ReadonlyArray<AnioFiscal>) => void
}) {
  const aniosTipoEfectivoIrpf = obtenerAniosTipoEfectivoIrpf({
    permiteReferenciaTecnica2026,
  })
  const aniosGraficoIrpfVisibles = aniosGraficoIrpf.filter((anio) =>
    aniosTipoEfectivoIrpf.includes(anio)
  )
  const claveAniosGraficoIrpfVisibles = aniosGraficoIrpfVisibles.join(",")
  const claveAniosGraficoNetoReal = aniosGraficoNetoReal.join(",")
  const [datosTipoEfectivoIrpf, fijarDatosTipoEfectivoIrpf] = React.useState<
    ReadonlyArray<FilaTipoEfectivoIrpf>
  >([])
  const [datosNetoReal, fijarDatosNetoReal] = React.useState<
    ReadonlyArray<FilaNetoReal>
  >([])

  React.useEffect(() => {
    const aniosIrpf = aniosDesdeClaveGrafico(claveAniosGraficoIrpfVisibles)
    const aniosNeto = aniosDesdeClaveGrafico(claveAniosGraficoNetoReal)

    const fibra = Effect.runFork(
      Effect.all(
        {
          tipoEfectivoIrpf: filasTipoEfectivoIrpf({
            auditoria,
            comunidadAutonoma,
            aniosSeleccionados: aniosIrpf,
          }),
          netoReal: filasNetoReal({
            auditoria,
            comunidadAutonoma,
            aniosSeleccionados: aniosNeto,
          }),
        },
        { concurrency: 2 }
      )
    )

    fibra.addObserver((exit) => {
      if (!Exit.isSuccess(exit)) return
      fijarDatosTipoEfectivoIrpf(exit.value.tipoEfectivoIrpf)
      fijarDatosNetoReal(exit.value.netoReal)
    })

    return () => {
      Effect.runFork(Fiber.interrupt(fibra))
    }
  }, [
    claveAniosGraficoIrpfVisibles,
    claveAniosGraficoNetoReal,
    auditoria,
    comunidadAutonoma,
  ])

  const clavesTipoEfectivoIrpf = aniosGraficoIrpfVisibles.map(claveAnio)
  const clavesNetoReal = aniosGraficoNetoReal.map(claveDiferenciaNeta)
  const dominioTipoEfectivoIrpf = dominioPorcentaje(
    valoresNumericosDeFilas(datosTipoEfectivoIrpf, clavesTipoEfectivoIrpf)
  )
  const ticksTipoEfectivoIrpf = ticksPorcentaje(dominioTipoEfectivoIrpf)
  const ticksSalario = ticksSalarioEuros({
    minimoEuros: centimosAEuros(auditoria.salarioBrutoAnualMinimoCentimos),
    maximoEuros: centimosAEuros(auditoria.salarioBrutoAnualMaximoCentimos),
  })
  const dominioSalario = [
    centimosAEuros(auditoria.salarioBrutoAnualMinimoCentimos),
    centimosAEuros(auditoria.salarioBrutoAnualMaximoCentimos),
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
            <p className="max-w-3xl text-sm leading-5 text-[var(--ink-soft)]">
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
                  <Button
                    key={anio}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => alternarAnioIrpf(anio)}
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
                tickFormatter={(valor: number) => `${Math.round(valor * 100)}%`}
              />
              <ChartTooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 10 }}
                cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
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
              {aniosGraficoIrpfVisibles.map((anio) => (
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
          value="neto-real"
          className="border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="max-w-3xl text-sm leading-5 text-[var(--ink-soft)]">
              DIFERENCIA ANUAL DE PODER ADQUISITIVO NETO POR SALARIO BRUTO. SI
              ES POSITIVA, EL AÑO COMPARADO DEJABA MÁS NETO REAL QUE{" "}
              {auditoria.anioReferencia}.
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
          <ChartContainer
            config={configuracionNetoReal}
            className="mt-4 aspect-[4/3] w-full sm:aspect-[16/9] sm:h-[clamp(18rem,42vw,24rem)]"
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
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 10 }}
                cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
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
              {aniosGraficoNetoReal.flatMap((anio) => [
                <Area
                  key={`${anio}-positiva`}
                  dataKey={claveDiferenciaNetaPositiva(anio)}
                  name={String(anio)}
                  type="monotone"
                  stroke={coloresTipoEfectivoIrpf[anio]}
                  strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                  fill={coloresTipoEfectivoIrpf[anio]}
                  fillOpacity={0.16}
                  legendType="plainline"
                  baseValue={0}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />,
                <Area
                  key={`${anio}-negativa`}
                  dataKey={claveDiferenciaNetaNegativa(anio)}
                  name={String(anio)}
                  type="monotone"
                  stroke="var(--gain)"
                  strokeWidth={anio === 2026 ? 4 : anio === 2019 ? 3 : 2}
                  fill="var(--gain)"
                  fillOpacity={0.18}
                  legendType="plainline"
                  baseValue={0}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />,
              ])}
            </AreaChart>
          </ChartContainer>
        </Tabs.Panel>
      </Tabs.Root>
    </section>
  )
}
