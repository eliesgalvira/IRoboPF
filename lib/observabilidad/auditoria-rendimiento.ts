import { Duration, Effect, Exit, Match, Metric, Option } from "effect"

export const diagnosticoRendimientoAuditoriaActivo =
  process.env.IROBOPF_AUDITORIA_PERF === "1" ||
  process.env.NEXT_PUBLIC_AUDITORIA_PERF === "1" ||
  (process.env.NODE_ENV === "development" && typeof window !== "undefined")

export const metricaDuracionCalculoAuditoria = Metric.timer(
  "auditoria_calculo_ms",
  {
    description: "Duracion de los barridos de auditoria por rango salarial",
  }
)

export const metricaDuracionSeriesAuditoria = Metric.timer(
  "auditoria_series_ms",
  {
    description: "Duracion de la construccion de series para graficas",
  }
)

export const metricaDuracionFilasGraficosAuditoria = Metric.timer(
  "auditoria_filas_graficos_ms",
  {
    description: "Duracion del mapeo de puntos de auditoria a filas Recharts",
  }
)

const ahora = () =>
  Match.value(typeof performance).pipe(
    Match.when("undefined", () => Date.now()),
    Match.orElse(() => performance.now())
  )

export const tiempoAuditoriaMs = ahora

const redondearMilisegundos = (milisegundos: number) =>
  Math.round(milisegundos * 10) / 10

const resumenMetrica = (estado: Metric.HistogramState) => ({
  muestras: estado.count,
  mediaMs: Match.value(estado.count).pipe(
    Match.when(0, () => 0),
    Match.orElse((muestras) => redondearMilisegundos(estado.sum / muestras))
  ),
  maxMs: redondearMilisegundos(estado.max),
})

interface TiempoAgregadoAuditoria {
  readonly muestras: number
  readonly totalMs: number
  readonly maxMs: number
}

const tiemposAgregados = new Map<string, TiempoAgregadoAuditoria>()

export const reiniciarTiemposAgregadosAuditoria = () => {
  if (!diagnosticoRendimientoAuditoriaActivo) return
  tiemposAgregados.clear()
}

export const registrarTiempoAgregadoAuditoria = (
  etapa: string,
  duracionMs: number
) => {
  if (!diagnosticoRendimientoAuditoriaActivo) return

  const actual = Option.fromNullishOr(tiemposAgregados.get(etapa)).pipe(
    Option.getOrElse(() => ({
      muestras: 0,
      totalMs: 0,
      maxMs: 0,
    }))
  )
  tiemposAgregados.set(etapa, {
    muestras: actual.muestras + 1,
    totalMs: actual.totalMs + duracionMs,
    maxMs: Math.max(actual.maxMs, duracionMs),
  })
}

export const medirAuditoriaSync = <A>(etapa: string, calcular: () => A): A => {
  if (!diagnosticoRendimientoAuditoriaActivo) return calcular()

  const inicio = ahora()
  try {
    return calcular()
  } finally {
    registrarTiempoAgregadoAuditoria(etapa, ahora() - inicio)
  }
}

export const resumenTiemposAgregadosAuditoria = () =>
  [...tiemposAgregados.entries()]
    .map(([etapa, tiempo]) => ({
      etapa,
      muestras: tiempo.muestras,
      totalMs: redondearMilisegundos(tiempo.totalMs),
      mediaMs: redondearMilisegundos(tiempo.totalMs / tiempo.muestras),
      maxMs: redondearMilisegundos(tiempo.maxMs),
    }))
    .sort((a, b) => b.totalMs - a.totalMs)

export const registrarResumenTiemposAuditoria = (
  evento: string,
  detalles: Record<string, unknown> = {}
) => {
  if (!diagnosticoRendimientoAuditoriaActivo) return
  console.table(resumenTiemposAgregadosAuditoria())
  registrarMarcaAuditoria(evento, {
    ...detalles,
    etapas: resumenTiemposAgregadosAuditoria().slice(0, 12),
  })
}

export const registrarMarcaAuditoria = (
  evento: string,
  detalles: Record<string, unknown> = {}
) => {
  if (!diagnosticoRendimientoAuditoriaActivo) return
  console.info(`[auditoria/perf] ${evento}`, {
    t: redondearMilisegundos(ahora()),
    ...detalles,
  })
}

export const instrumentarEffectAuditoria = <A, E, R>({
  nombre,
  detalles = {},
  metrica,
  efecto,
}: {
  readonly nombre: string
  readonly detalles?: Record<string, unknown>
  readonly metrica: Metric.Histogram<Duration.Duration>
  readonly efecto: Effect.Effect<A, E, R>
}): Effect.Effect<A, E, R> => {
  if (!diagnosticoRendimientoAuditoriaActivo) return efecto

  return Effect.gen(function* () {
    const inicio = yield* Effect.sync(ahora)
    yield* Effect.logInfo(`[auditoria/perf] inicio ${nombre}`, detalles)

    const exit = yield* Effect.exit(
      efecto.pipe(
        Effect.withSpan(nombre, { attributes: detalles }),
        Effect.withLogSpan(nombre),
        Effect.trackDuration(metrica)
      )
    )
    const duracionMs = redondearMilisegundos(ahora() - inicio)
    const estadoMetrica = yield* Metric.value(metrica)
    const resumen = {
      ...detalles,
      duracionMs,
      metrica: resumenMetrica(estadoMetrica),
    }

    if (Exit.isSuccess(exit)) {
      yield* Effect.logInfo(`[auditoria/perf] fin ${nombre}`, resumen)
      return exit.value
    }

    yield* Effect.logWarning(`[auditoria/perf] fallo ${nombre}`, resumen)
    return yield* Effect.failCause(exit.cause)
  }).pipe(Effect.annotateLogs({ auditoriaPerf: nombre }))
}
