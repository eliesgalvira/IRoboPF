"use client"

import Decimal from "decimal.js"
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
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { NavegacionSitio } from "@/components/navegacion-sitio"
import {
  ANIOS_COMPARABLES,
  centimosAEuros,
  eurosACentimos,
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
import {
  BotonCopiarImagenGrafico,
  DIMENSIONES_ESCRITORIO_EXPORTACION_GRAFICO,
} from "@/components/copiar-imagen-grafico"
import {
  SelectorModoGrafico,
  type OpcionesSelectorModoGrafico,
} from "@/components/selector-modo-grafico"
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
  anioGraficoCunaFiscalPorDefecto,
  anioGraficoTipoMarginalIrpfPorDefecto,
  aniosGraficoDiferenciaTipoIrpfPorDefecto,
  aniosGraficoTipoEfectivoIrpfPorDefecto,
  type CambioEscenarioAuditoriaNormativa,
  comunidadesAuditoriaNormativa,
  decodificarPerfilAuditoriaNormativa,
  detallePerfilAuditoriaNormativa,
  describirComunidadAutonomaAuditoria,
  describirPerfilAuditoriaNormativa,
  leerEscenarioAuditoriaNormativaDesdeUrl,
  leerRangoSalarialAuditoriaDesdeUrl,
  leerSeleccionGraficoAuditoriaDesdeUrl,
  modoCunaFiscalGraficoAuditoriaPorDefecto,
  modoDiferenciaGraficoAuditoriaPorDefecto,
  modoTipoEfectivoGraficoAuditoriaPorDefecto,
  perfilesAuditoriaNormativa,
  perfilAuditoriaNormativaParaRetencionPersonalizada,
  escenarioPermiteReferenciaTecnica2026,
  serializarEscenarioAuditoriaNormativa,
  type DescendientePerfilAuditoriaNormativa,
  type EscenarioAuditoriaNormativaHistorica,
  type GraficoAuditoriaNormativa,
  type ModoUnidadGraficoAuditoria,
  type RangoSalarialAuditoria,
  type SeleccionGraficoAuditoriaNormativa,
  type SituacionRetencionPerfilAuditoria,
  umbralRetencionPerfilAuditoriaEuros,
} from "@/lib/dominio/auditoria/auditoria-normativa-historica"
import {
  configuracionRangoAuditoria,
  auditarProgresividadFrio,
  construirPuntosAuditoriaAnioAjustado,
  type AuditoriaRangoSalarial,
  type PuntoAuditoriaRangoSalarial,
} from "@/lib/dominio/auditoria/auditoria-progresividad-frio"
import { calcularSalarioLegacy } from "@/lib/dominio/compatibilidad-legacy/calculo-salario-legacy"
import { IPC_ANUAL_DICIEMBRE } from "@/lib/dominio/normativa/datos/ipc-2012-2026"
import { UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS } from "@/lib/dominio/normativa/datos/irpf-obligacion-declarar"
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
const VERSION_CALCULO_AUDITORIA_IRPF = "irpf-efectivo-salario-v4"
const VERSION_CALCULO_CUNA_FISCAL = "cuna-fiscal-salario-v1"
const VERSION_CALCULO_TIPO_MARGINAL_IRPF = "irpf-cuota-marginal-smi-v3"
const pasoCalculoMarginalMaximoCentimos = 5_000
const salarioDeclaracionConObligacionCentimos =
  UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS + 100
const descripcionSituacionRetencion: Record<
  SituacionRetencionPerfilAuditoria,
  string
> = {
  situacion1:
    "familia monoparental: contribuyente soltero, viudo, divorciado o separado legalmente con hijos que conviven exclusivamente con él",
  situacion2:
    "contribuyente casado y no separado legalmente cuyo cónyuge no supera 1.500 euros anuales de rentas no exentas",
  situacion3:
    "situación distinta de las dos anteriores o no comunicada: por ejemplo, soltero sin hijos o casado con cónyuge que supera 1.500 euros anuales",
}

const etiquetaSituacionRetencion = (
  situacion: SituacionRetencionPerfilAuditoria
): string => `Situación ${situacion.replace("situacion", "")}`

const descripcionDescendientesPerfil = (
  descendientes: ReadonlyArray<DescendientePerfilAuditoriaNormativa>
): string =>
  descendientes.length === 0
    ? "Sin descendientes computados"
    : `Con ${descendientes.length} descendiente${
        descendientes.length === 1 ? "" : "s"
      } computado${descendientes.length === 1 ? "" : "s"}`

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

const umbralRangoEuroAEuroCentimos = 100_000
const umbralRangoDiezEurosCentimos = 1_000_000
const pasoEuroAEuroCentimos = 100
const pasoDiezEurosCentimos = 1_000

const calcularPasoAuditoriaCentimos = ({
  minimoCentimos,
  maximoCentimos,
}: {
  readonly minimoCentimos: number
  readonly maximoCentimos: number
}) => {
  const anchuraCentimos = Math.abs(maximoCentimos - minimoCentimos)

  return Match.value(anchuraCentimos).pipe(
    Match.when(
      (anchuraCentimos) => anchuraCentimos <= umbralRangoEuroAEuroCentimos,
      () => pasoEuroAEuroCentimos
    ),
    Match.when(
      (anchuraCentimos) => anchuraCentimos <= umbralRangoDiezEurosCentimos,
      () => pasoDiezEurosCentimos
    ),
    Match.orElse(() => configuracionRangoAuditoria.pasoCentimos)
  )
}

const describirModoPasoPreciso = (pasoCentimos: number) =>
  Match.value(pasoCentimos).pipe(
    Match.when(pasoEuroAEuroCentimos, () => "preciso-1-euro"),
    Match.when(pasoDiezEurosCentimos, () => "preciso-10-euros"),
    Match.orElse(() => "base-100-euros")
  )

const pasoCalculoTipoMarginalCentimos = (pasoVisibleCentimos: number) =>
  Math.min(pasoVisibleCentimos, pasoCalculoMarginalMaximoCentimos)

const esSalarioVisibleTipoMarginal = ({
  salarioBrutoAnualCentimos,
  salarioMinimoCentimos,
  pasoVisibleCentimos,
}: {
  readonly salarioBrutoAnualCentimos: number
  readonly salarioMinimoCentimos: number
  readonly pasoVisibleCentimos: number
}) =>
  pasoVisibleCentimos <= 0 ||
  (salarioBrutoAnualCentimos - salarioMinimoCentimos) % pasoVisibleCentimos ===
    0

const esSalarioRegularAuditoria = ({
  salarioBrutoAnualCentimos,
  salarioMinimoCentimos,
  pasoCentimos,
}: {
  readonly salarioBrutoAnualCentimos: number
  readonly salarioMinimoCentimos: number
  readonly pasoCentimos: number
}) =>
  pasoCentimos <= 0 ||
  (salarioBrutoAnualCentimos - salarioMinimoCentimos) % pasoCentimos === 0

const esSalarioVisibleTipoEfectivoIrpf = ({
  salarioBrutoAnualCentimos,
  salarioMinimoCentimos,
  pasoCentimos,
}: {
  readonly salarioBrutoAnualCentimos: number
  readonly salarioMinimoCentimos: number
  readonly pasoCentimos: number
}) =>
  esSalarioRegularAuditoria({
    salarioBrutoAnualCentimos,
    salarioMinimoCentimos,
    pasoCentimos,
  }) || salarioBrutoAnualCentimos === salarioDeclaracionConObligacionCentimos

const claveCalculoAuditoria = ({
  escenario,
  minimoCentimos,
  maximoCentimos,
  pasoCentimos,
}: {
  readonly escenario: EscenarioAuditoriaNormativaHistorica
  readonly minimoCentimos: number
  readonly maximoCentimos: number
  readonly pasoCentimos: number
}) =>
  [
    escenario.comunidadAutonoma,
    escenario.perfil,
    escenario.magnitudAuditada,
    escenario.estrategiaProyeccionSalarial,
    VERSION_CALCULO_AUDITORIA_IRPF,
    escenario.anioComparado,
    escenario.anioReferencia,
    Math.min(minimoCentimos, maximoCentimos),
    Math.max(minimoCentimos, maximoCentimos),
    pasoCentimos,
  ].join("|")

const construirSeleccionGraficoAuditoria = ({
  vistaGrafico,
  aniosGraficoIrpf,
  modoTipoEfectivoIrpf,
  aniosGraficoDiferenciaTipoIrpf,
  anioGraficoCunaFiscal,
  modoCunaFiscal,
  modoDiferenciaTipoIrpf,
  anioGraficoTipoMarginalIrpf,
}: {
  readonly vistaGrafico: VistaGraficoAuditoria
  readonly aniosGraficoIrpf: ReadonlyArray<AnioFiscal>
  readonly modoTipoEfectivoIrpf: ModoTipoEfectivoIrpf
  readonly aniosGraficoDiferenciaTipoIrpf: readonly [AnioFiscal, AnioFiscal]
  readonly anioGraficoCunaFiscal: AnioFiscal
  readonly modoCunaFiscal: ModoCunaFiscal
  readonly modoDiferenciaTipoIrpf: ModoDiferenciaTipoIrpf
  readonly anioGraficoTipoMarginalIrpf: AnioFiscal
}): SeleccionGraficoAuditoriaNormativa =>
  Match.value(vistaGrafico).pipe(
    Match.withReturnType<SeleccionGraficoAuditoriaNormativa>(),
    Match.when("tipo-irpf", (grafica) => ({
      grafica,
      anios: aniosGraficoIrpf,
      modo: modoTipoEfectivoIrpf,
    })),
    Match.when("diferencia-irpf", (grafica) => ({
      grafica,
      anios: aniosGraficoDiferenciaTipoIrpf,
      modo: modoDiferenciaTipoIrpf,
    })),
    Match.when("cuna-fiscal", (grafica) => ({
      grafica,
      anio: anioGraficoCunaFiscal,
      modo: modoCunaFiscal,
    })),
    Match.when("tipo-marginal", (grafica) => ({
      grafica,
      anio: anioGraficoTipoMarginalIrpf,
    })),
    Match.exhaustive
  )

function AuditoriaImpl({
  parametrosIniciales = "",
}: {
  readonly parametrosIniciales?: string
}) {
  const router = useRouter()
  const estadoInicialAuditoria = React.useMemo(() => {
    const parametros = new URLSearchParams(parametrosIniciales)

    return {
      escenario: leerEscenarioAuditoriaNormativaDesdeUrl(parametros),
      rangoSalarial: leerRangoSalarialAuditoriaDesdeUrl(parametros),
      seleccionGrafico: leerSeleccionGraficoAuditoriaDesdeUrl(parametros),
    }
  }, [parametrosIniciales])
  const [escenarioAuditoria, fijarEscenarioAuditoria] = React.useState(
    () => estadoInicialAuditoria.escenario
  )
  const [minimoCentimos, fijarMinimoCentimos] = React.useState<number>(
    () => estadoInicialAuditoria.rangoSalarial.minimoCentimos
  )
  const [maximoCentimos, fijarMaximoCentimos] = React.useState<number>(
    () => estadoInicialAuditoria.rangoSalarial.maximoCentimos
  )
  const [vistaGrafico, fijarVistaGrafico] =
    React.useState<VistaGraficoAuditoria>(
      () => estadoInicialAuditoria.seleccionGrafico.grafica
    )
  const [aniosGraficoIrpf, fijarAniosGraficoIrpf] = React.useState<
    ReadonlyArray<AnioFiscal>
  >(() =>
    estadoInicialAuditoria.seleccionGrafico.grafica === "tipo-irpf"
      ? estadoInicialAuditoria.seleccionGrafico.anios
      : aniosGraficoTipoEfectivoIrpfPorDefecto
  )
  const [modoTipoEfectivoIrpf, fijarModoTipoEfectivoIrpf] =
    React.useState<ModoTipoEfectivoIrpf>(() =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "tipo-irpf"
        ? estadoInicialAuditoria.seleccionGrafico.modo
        : modoTipoEfectivoGraficoAuditoriaPorDefecto
    )
  const [aniosGraficoDiferenciaTipoIrpf, fijarAniosGraficoDiferenciaTipoIrpf] =
    React.useState<readonly [AnioFiscal, AnioFiscal]>(() =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "diferencia-irpf"
        ? estadoInicialAuditoria.seleccionGrafico.anios
        : aniosGraficoDiferenciaTipoIrpfPorDefecto
    )
  const [anioGraficoCunaFiscal, fijarAnioGraficoCunaFiscal] =
    React.useState<AnioFiscal>(() =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "cuna-fiscal"
        ? estadoInicialAuditoria.seleccionGrafico.anio
        : anioGraficoCunaFiscalPorDefecto
    )
  const [modoCunaFiscal, fijarModoCunaFiscal] = React.useState<ModoCunaFiscal>(
    () =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "cuna-fiscal"
        ? estadoInicialAuditoria.seleccionGrafico.modo
        : modoCunaFiscalGraficoAuditoriaPorDefecto
  )
  const [modoDiferenciaTipoIrpf, fijarModoDiferenciaTipoIrpf] =
    React.useState<ModoDiferenciaTipoIrpf>(() =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "diferencia-irpf"
        ? estadoInicialAuditoria.seleccionGrafico.modo
        : modoDiferenciaGraficoAuditoriaPorDefecto
    )
  const [anioGraficoTipoMarginalIrpf, fijarAnioGraficoTipoMarginalIrpf] =
    React.useState<AnioFiscal>(() =>
      estadoInicialAuditoria.seleccionGrafico.grafica === "tipo-marginal"
        ? estadoInicialAuditoria.seleccionGrafico.anio
        : anioGraficoTipoMarginalIrpfPorDefecto
    )
  const ordenSeleccionDiferenciaTipoIrpfRef = React.useRef<
    ReadonlyArray<AnioFiscal>
  >(
    estadoInicialAuditoria.seleccionGrafico.grafica === "diferencia-irpf"
      ? estadoInicialAuditoria.seleccionGrafico.anios
      : aniosGraficoDiferenciaTipoIrpfPorDefecto
  )
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

  const pasoAuditoriaCentimos = calcularPasoAuditoriaCentimos({
    minimoCentimos,
    maximoCentimos,
  })
  const modoPasoAuditoria = describirModoPasoPreciso(pasoAuditoriaCentimos)
  const claveAuditoria = claveCalculoAuditoria({
    escenario: escenarioAuditoria,
    minimoCentimos,
    maximoCentimos,
    pasoCentimos: pasoAuditoriaCentimos,
  })
  const [cacheAuditorias, fijarCacheAuditorias] = React.useState(
    () => new Map<string, AuditoriaRangoSalarial>()
  )
  const [estadoAuditoria, fijarEstadoAuditoria] =
    React.useState<EstadoAuditoria>({
      _tag: "cargando",
      clave: claveAuditoria,
    })
  const auditoria = React.useMemo(() => {
    const auditoriaDesdeEstado = Match.value(estadoAuditoria).pipe(
      Match.when({ _tag: "lista" }, (estado) =>
        Match.value(estado.clave === claveAuditoria).pipe(
          Match.when(true, () => Option.some(estado.auditoria)),
          Match.orElse(() => Option.none<AuditoriaRangoSalarial>())
        )
      ),
      Match.orElse(() => Option.none<AuditoriaRangoSalarial>())
    )

    return Option.match(auditoriaDesdeEstado, {
      onNone: () => Option.fromNullishOr(cacheAuditorias.get(claveAuditoria)),
      onSome: Option.some,
    })
  }, [cacheAuditorias, claveAuditoria, estadoAuditoria])
  const estadoAuditoriaActual = React.useMemo(
    () =>
      Match.value(estadoAuditoria.clave === claveAuditoria).pipe(
        Match.when(true, () => estadoAuditoria),
        Match.orElse(() =>
          Option.match(auditoria, {
            onNone: () =>
              ({
                _tag: "cargando",
                clave: claveAuditoria,
              }) satisfies EstadoAuditoria,
            onSome: (auditoriaLista) =>
              ({
                _tag: "lista",
                clave: claveAuditoria,
                auditoria: auditoriaLista,
              }) satisfies EstadoAuditoria,
          })
        )
      ),
    [auditoria, claveAuditoria, estadoAuditoria]
  )
  const exportacionEnCurso = Option.isSome(Option.fromNullishOr(exportando))

  React.useEffect(() => {
    const auditoriaCacheada = Option.fromNullishOr(
      cacheAuditorias.get(claveAuditoria)
    )
    if (Option.isSome(auditoriaCacheada)) {
      registrarMarcaAuditoria("react.auditoria.calculo.cache", {
        claveAuditoria,
        puntos: auditoriaCacheada.value.puntos.length,
      })
      return
    }

    const inicio = tiempoAuditoriaMs()
    registrarMarcaAuditoria("react.auditoria.calculo.inicio", {
      claveAuditoria,
      comunidadAutonoma: escenarioAuditoria.comunidadAutonoma,
      anioComparado: escenarioAuditoria.anioComparado,
      anioReferencia: escenarioAuditoria.anioReferencia,
      minimoCentimos: Math.min(minimoCentimos, maximoCentimos),
      maximoCentimos: Math.max(minimoCentimos, maximoCentimos),
      anchuraRangoCentimos: Math.abs(maximoCentimos - minimoCentimos),
      pasoCentimos: pasoAuditoriaCentimos,
      modoPaso: modoPasoAuditoria,
    })

    const fibra = Effect.runFork(
      auditarProgresividadFrio(
        {
          perfil: "legacy-progresividad-frio",
          perfilAuditoria: perfilAuditoriaNormativaParaRetencionPersonalizada(
            escenarioAuditoria.perfil
          ),
          comunidadAutonoma: escenarioAuditoria.comunidadAutonoma,
          salarioBrutoAnualMinimoCentimos: Math.min(
            minimoCentimos,
            maximoCentimos
          ),
          salarioBrutoAnualMaximoCentimos: Math.max(
            minimoCentimos,
            maximoCentimos
          ),
          pasoCentimos: pasoAuditoriaCentimos,
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
        fijarCacheAuditorias((cacheActual) =>
          new Map(cacheActual).set(claveAuditoria, exit.value.auditoria)
        )
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
    escenarioAuditoria.perfil,
    cacheAuditorias,
    claveAuditoria,
    maximoCentimos,
    minimoCentimos,
    modoPasoAuditoria,
    pasoAuditoriaCentimos,
  ])

  const seleccionGraficoAuditoriaActual = React.useMemo(
    () =>
      construirSeleccionGraficoAuditoria({
        vistaGrafico,
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      }),
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      modoTipoEfectivoIrpf,
      vistaGrafico,
    ]
  )

  const reemplazarUrlAuditoria = React.useCallback(
    ({
      escenario = escenarioAuditoria,
      rangoSalarial = { minimoCentimos, maximoCentimos },
      seleccionGrafico = seleccionGraficoAuditoriaActual,
    }: {
      readonly escenario?: EscenarioAuditoriaNormativaHistorica
      readonly rangoSalarial?: RangoSalarialAuditoria
      readonly seleccionGrafico?: SeleccionGraficoAuditoriaNormativa
    } = {}): URLSearchParams => {
      const parametros = serializarEscenarioAuditoriaNormativa(
        escenario,
        rangoSalarial,
        seleccionGrafico
      )
      router.replace(`/auditoria?${parametros.toString()}`, { scroll: false })

      return parametros
    },
    [
      escenarioAuditoria,
      maximoCentimos,
      minimoCentimos,
      router,
      seleccionGraficoAuditoriaActual,
    ]
  )

  const actualizarEscenarioAuditoria = React.useCallback(
    (cambio: CambioEscenarioAuditoriaNormativa) => {
      const parametros = reemplazarUrlAuditoria({
        escenario: {
          ...escenarioAuditoria,
          ...cambio,
        },
      })
      const rangoSalarial = leerRangoSalarialAuditoriaDesdeUrl(parametros)
      fijarEscenarioAuditoria(
        leerEscenarioAuditoriaNormativaDesdeUrl(parametros)
      )
      fijarMinimoCentimos(rangoSalarial.minimoCentimos)
      fijarMaximoCentimos(rangoSalarial.maximoCentimos)
    },
    [escenarioAuditoria, reemplazarUrlAuditoria]
  )

  const actualizarRangoSalarialAuditoria = React.useCallback(
    (rangoSalarialCandidato: RangoSalarialAuditoria) => {
      const parametros = reemplazarUrlAuditoria({
        rangoSalarial: rangoSalarialCandidato,
      })
      const rangoSalarial = leerRangoSalarialAuditoriaDesdeUrl(parametros)
      fijarMinimoCentimos(rangoSalarial.minimoCentimos)
      fijarMaximoCentimos(rangoSalarial.maximoCentimos)
    },
    [reemplazarUrlAuditoria]
  )

  const aplicarSeleccionGraficoAuditoria = React.useCallback(
    (seleccionGrafico: SeleccionGraficoAuditoriaNormativa) => {
      fijarVistaGrafico(seleccionGrafico.grafica)

      Match.value(seleccionGrafico).pipe(
        Match.when({ grafica: "tipo-irpf" }, ({ anios, modo }) => {
          fijarAniosGraficoIrpf(anios)
          fijarModoTipoEfectivoIrpf(modo)
        }),
        Match.when({ grafica: "diferencia-irpf" }, ({ anios, modo }) => {
          fijarAniosGraficoDiferenciaTipoIrpf(anios)
          fijarModoDiferenciaTipoIrpf(modo)
          ordenSeleccionDiferenciaTipoIrpfRef.current = anios
        }),
        Match.when({ grafica: "cuna-fiscal" }, ({ anio, modo }) => {
          fijarAnioGraficoCunaFiscal(anio)
          fijarModoCunaFiscal(modo)
        }),
        Match.when({ grafica: "tipo-marginal" }, ({ anio }) => {
          fijarAnioGraficoTipoMarginalIrpf(anio)
        }),
        Match.exhaustive
      )
    },
    []
  )

  const actualizarVistaGrafico = React.useCallback(
    (vistaGrafico: VistaGraficoAuditoria) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico,
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarVistaGrafico(vistaGrafico)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      modoTipoEfectivoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarAniosGraficoIrpf = React.useCallback(
    (anios: ReadonlyArray<AnioFiscal>) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "tipo-irpf",
        aniosGraficoIrpf: anios,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarAniosGraficoIrpf(anios)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      modoTipoEfectivoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarAniosGraficoDiferenciaTipoIrpf = React.useCallback(
    (anios: readonly [AnioFiscal, AnioFiscal]) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "diferencia-irpf",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf: anios,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarAniosGraficoDiferenciaTipoIrpf(anios)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoIrpf,
      modoTipoEfectivoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarAnioGraficoCunaFiscal = React.useCallback(
    (anio: AnioFiscal) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "cuna-fiscal",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal: anio,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarAnioGraficoCunaFiscal(anio)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoTipoEfectivoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarModoCunaFiscal = React.useCallback(
    (modo: ModoCunaFiscal) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "cuna-fiscal",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal: modo,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarModoCunaFiscal(modo)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoDiferenciaTipoIrpf,
      modoTipoEfectivoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarModoTipoEfectivoIrpf = React.useCallback(
    (modo: ModoTipoEfectivoIrpf) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "tipo-irpf",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf: modo,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf,
      })
      fijarModoTipoEfectivoIrpf(modo)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarModoDiferenciaTipoIrpf = React.useCallback(
    (modo: ModoDiferenciaTipoIrpf) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "diferencia-irpf",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf: modo,
        anioGraficoTipoMarginalIrpf,
      })
      fijarModoDiferenciaTipoIrpf(modo)
      fijarVistaGrafico("diferencia-irpf")
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      anioGraficoTipoMarginalIrpf,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoCunaFiscal,
      modoTipoEfectivoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  const actualizarAnioGraficoTipoMarginalIrpf = React.useCallback(
    (anio: AnioFiscal) => {
      const seleccionGrafico = construirSeleccionGraficoAuditoria({
        vistaGrafico: "tipo-marginal",
        aniosGraficoIrpf,
        modoTipoEfectivoIrpf,
        aniosGraficoDiferenciaTipoIrpf,
        anioGraficoCunaFiscal,
        modoCunaFiscal,
        modoDiferenciaTipoIrpf,
        anioGraficoTipoMarginalIrpf: anio,
      })
      fijarAnioGraficoTipoMarginalIrpf(anio)
      reemplazarUrlAuditoria({ seleccionGrafico })
    },
    [
      anioGraficoCunaFiscal,
      aniosGraficoDiferenciaTipoIrpf,
      aniosGraficoIrpf,
      modoCunaFiscal,
      modoDiferenciaTipoIrpf,
      modoTipoEfectivoIrpf,
      reemplazarUrlAuditoria,
    ]
  )

  React.useEffect(() => {
    const sincronizarEscenarioConUrl = () => {
      const parametros = new URLSearchParams(window.location.search)
      const rangoSalarial = leerRangoSalarialAuditoriaDesdeUrl(parametros)
      const seleccionGrafico = leerSeleccionGraficoAuditoriaDesdeUrl(parametros)
      fijarEscenarioAuditoria(
        leerEscenarioAuditoriaNormativaDesdeUrl(parametros)
      )
      fijarMinimoCentimos(rangoSalarial.minimoCentimos)
      fijarMaximoCentimos(rangoSalarial.maximoCentimos)
      aplicarSeleccionGraficoAuditoria(seleccionGrafico)
    }

    window.addEventListener("popstate", sincronizarEscenarioConUrl)
    return () => {
      window.removeEventListener("popstate", sincronizarEscenarioConUrl)
    }
  }, [aplicarSeleccionGraficoAuditoria])

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

  const exportar = (tipo: "educativa" | "compatible") => {
    Option.match(auditoria, {
      onNone: () => {},
      onSome: (auditoriaLista) => {
        if (tipo === "compatible") {
          fijarDialogoExportacionCompatible("advertencia")
          return
        }

        fijarExportando(tipo)
        Effect.runFork(
          exportarAuditoriaEducativaExcel(auditoriaLista).pipe(
            Effect.ensuring(Effect.sync(() => fijarExportando(null)))
          )
        )
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
          alCambiarRangoSalarial={actualizarRangoSalarialAuditoria}
        />

        <ControlesAuditoriaNormativa
          escenario={escenarioAuditoria}
          alCambiarEscenario={actualizarEscenarioAuditoria}
        />

        <Visualizaciones
          auditoria={auditoria}
          estadoAuditoria={estadoAuditoriaActual}
          comunidadAutonoma={escenarioAuditoria.comunidadAutonoma}
          perfil={escenarioAuditoria.perfil}
          magnitudAuditada={escenarioAuditoria.magnitudAuditada}
          alCambiarComunidadAutonoma={(comunidadAutonoma) =>
            actualizarEscenarioAuditoria({
              comunidadAutonoma,
              comunidadesAutonomas: [comunidadAutonoma],
            })
          }
          permiteReferenciaTecnica2026={permiteReferenciaTecnica2026}
          vistaGrafico={vistaGrafico}
          alCambiarVistaGrafico={actualizarVistaGrafico}
          aniosGraficoIrpf={aniosGraficoIrpf}
          fijarAniosGraficoIrpf={actualizarAniosGraficoIrpf}
          modoTipoEfectivoIrpf={modoTipoEfectivoIrpf}
          fijarModoTipoEfectivoIrpf={actualizarModoTipoEfectivoIrpf}
          aniosGraficoDiferenciaTipoIrpf={aniosGraficoDiferenciaTipoIrpf}
          fijarAniosGraficoDiferenciaTipoIrpf={
            actualizarAniosGraficoDiferenciaTipoIrpf
          }
          anioGraficoCunaFiscal={anioGraficoCunaFiscal}
          fijarAnioGraficoCunaFiscal={actualizarAnioGraficoCunaFiscal}
          modoCunaFiscal={modoCunaFiscal}
          fijarModoCunaFiscal={actualizarModoCunaFiscal}
          modoDiferenciaTipoIrpf={modoDiferenciaTipoIrpf}
          fijarModoDiferenciaTipoIrpf={actualizarModoDiferenciaTipoIrpf}
          anioGraficoTipoMarginalIrpf={anioGraficoTipoMarginalIrpf}
          fijarAnioGraficoTipoMarginalIrpf={
            actualizarAnioGraficoTipoMarginalIrpf
          }
          ordenSeleccionDiferenciaTipoIrpfRef={
            ordenSeleccionDiferenciaTipoIrpfRef
          }
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

  return (
    <section className="grid gap-4 border-b-2 border-[var(--rule)] py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.32em] text-[var(--ink-soft)] uppercase">
            AUDITORÍA NORMATIVA / ESCENARIO
          </p>
          <h2 className="mt-2 font-[family-name:var(--display)] text-[clamp(1.5rem,4vw,2.25rem)] leading-none tracking-wider uppercase">
            PERFIL
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-5 text-[var(--ink-soft)]">
          {perfilActivo.detalle}
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
            className="grid divide-y-2 divide-[var(--rule)] border-2 border-[var(--rule)] text-sm tracking-[0.18em] uppercase md:grid-cols-2 md:divide-x-2 md:divide-y-0"
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
    </section>
  )
}

function BarraFiltros({
  minimoCentimos,
  maximoCentimos,
  alCambiarRangoSalarial,
}: {
  readonly minimoCentimos: number
  readonly maximoCentimos: number
  readonly alCambiarRangoSalarial: (rango: RangoSalarialAuditoria) => void
}) {
  return (
    <section className="grid min-w-0 gap-0 border-b-2 border-[var(--rule)] py-6">
      <p className="text-sm tracking-[0.22em] text-[var(--ink-soft)] uppercase sm:tracking-[0.32em]">
        FILTROS / BARRIDO
      </p>
      <div className="mt-4 grid min-w-0 gap-4">
        <div className="grid min-w-0 gap-4">
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 sm:gap-3">
            <CampoDinero
              etiqueta="MÍNIMO"
              valorCentimos={minimoCentimos}
              alCambiar={(minimoCentimos) =>
                alCambiarRangoSalarial({ minimoCentimos, maximoCentimos })
              }
            />
            <CampoDinero
              etiqueta="MÁXIMO"
              valorCentimos={maximoCentimos}
              alCambiar={(maximoCentimos) =>
                alCambiarRangoSalarial({ minimoCentimos, maximoCentimos })
              }
            />
          </div>
          <Slider.Root
            thumbAlignment="center"
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
              alCambiarRangoSalarial({
                minimoCentimos: eurosACentimos(minimo),
                maximoCentimos: eurosACentimos(maximo),
              })
            }}
            className="grid min-w-0 gap-2"
          >
            <Slider.Control className="relative mx-3.5 flex h-8 min-w-0 touch-none items-center sm:mx-0">
              <Slider.Track className="relative h-3 min-w-0 flex-1 bg-[var(--paper)] [outline:2px_solid_var(--rule)]">
                <Slider.Indicator className="bg-[var(--mark)]" />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                aria-label="Salario mínimo"
                className="size-7 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none sm:size-6"
              />
              <Slider.Thumb
                index={1}
                aria-label="Salario máximo"
                className="size-7 border-2 border-[var(--rule)] bg-[var(--paper)] transition focus-visible:bg-[var(--mark)] focus-visible:outline-none sm:size-6"
              />
            </Slider.Control>
            <div className="flex min-w-0 justify-between gap-3 text-sm tracking-[0.14em] text-[var(--ink-soft)] uppercase sm:tracking-[0.3em]">
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
      className="grid min-w-0 gap-1"
    >
      <span className="text-sm tracking-[0.22em] text-[var(--ink-soft)] uppercase sm:tracking-[0.3em]">
        {etiqueta}
      </span>
      <NumberField.Group className="grid h-12 min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] border-2 border-[var(--rule)] bg-[var(--paper)]">
        <NumberField.Decrement className="border-r-2 border-[var(--rule)] transition-colors hover:bg-[var(--mark)] focus-visible:bg-[var(--mark)] focus-visible:outline-none">
          −
        </NumberField.Decrement>
        <NumberField.Input className="min-w-0 bg-transparent px-2 text-center font-[family-name:var(--mono)] text-sm font-bold tabular-nums outline-none focus-visible:bg-[var(--mark)]/20 sm:text-base" />
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
  2025: "oklch(0.38 0.12 285)",
  2026: "oklch(0.62 0.19 35)",
}

type ComunidadAuditada =
  EscenarioAuditoriaNormativaHistorica["comunidadAutonoma"]
type PerfilAuditado = EscenarioAuditoriaNormativaHistorica["perfil"]
type MagnitudAuditadaAuditoria =
  EscenarioAuditoriaNormativaHistorica["magnitudAuditada"]
const claveSerieTipoEfectivoIrpf = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `irpf-${comunidadAutonoma}-${anio}`
const claveDiferenciaTipoIrpfPorcentaje = "diferenciaTipoIrpfPorcentaje"
const claveDiferenciaTipoIrpfEurosReales = "diferenciaTipoIrpfEurosReales"
const claveDiferenciaTipoIrpfPorcentajeFavorable =
  "diferenciaTipoIrpfPorcentajeFavorable"
const claveDiferenciaTipoIrpfPorcentajeDesfavorable =
  "diferenciaTipoIrpfPorcentajeDesfavorable"
const claveDiferenciaTipoIrpfEurosRealesFavorable =
  "diferenciaTipoIrpfEurosRealesFavorable"
const claveDiferenciaTipoIrpfEurosRealesDesfavorable =
  "diferenciaTipoIrpfEurosRealesDesfavorable"
const colorDiferenciaTipoIrpfFavorable = "oklch(0.43 0.14 152)"
const colorDiferenciaTipoIrpfDesfavorable = "oklch(0.48 0.20 28)"
type ComponenteCunaFiscal =
  | "irpf"
  | "cotizaciones-trabajador"
  | "cotizaciones-empresa"
  | "total"
const componentesApiladosCunaFiscal = [
  "irpf",
  "cotizaciones-trabajador",
  "cotizaciones-empresa",
] as const satisfies ReadonlyArray<ComponenteCunaFiscal>
const componentesLeyendaCunaFiscal = [
  "cotizaciones-empresa",
  "cotizaciones-trabajador",
  "total",
  "irpf",
] as const satisfies ReadonlyArray<ComponenteCunaFiscal>
const claveSerieCunaFiscal = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal,
  componente: ComponenteCunaFiscal
) => `cuna-fiscal-${comunidadAutonoma}-${anio}-${componente}`
const claveStackCunaFiscal = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) => `cuna-fiscal-${comunidadAutonoma}-${anio}`
const colorComponenteCunaFiscal = (componente: ComponenteCunaFiscal): string =>
  Match.value(componente).pipe(
    Match.when("irpf", () => "oklch(0.62 0.12 245)"),
    Match.when("cotizaciones-trabajador", () => "oklch(0.78 0.15 82)"),
    Match.when("cotizaciones-empresa", () => "oklch(0.68 0.17 72)"),
    Match.when("total", () => "var(--rule)"),
    Match.exhaustive
  )
const claveTipoMarginalIrpf = "tipoMarginalIrpf"
const claveTipoEfectivoIrpfMarginal = "tipoEfectivoIrpfMarginal"
const colorTipoMarginalIrpf = "oklch(0.52 0.14 245)"
const colorTipoEfectivoIrpfMarginal = "oklch(0.48 0.20 28)"
const etiquetaSerieAuditoria = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal
) =>
  `${describirComunidadAutonomaAuditoria(comunidadAutonoma).etiqueta} ${anio}`
const etiquetaComponenteCunaFiscal = (
  componente: ComponenteCunaFiscal
): string =>
  Match.value(componente).pipe(
    Match.when("irpf", () => "IRPF"),
    Match.when("cotizaciones-trabajador", () => "Cotizaciones trabajador"),
    Match.when("cotizaciones-empresa", () => "Cotizaciones empresa"),
    Match.when("total", () => "Cuña fiscal"),
    Match.exhaustive
  )
const etiquetaSerieCunaFiscal = (
  comunidadAutonoma: ComunidadAuditada,
  anio: AnioFiscal,
  componente: ComponenteCunaFiscal
) =>
  `${etiquetaComponenteCunaFiscal(componente)} ${etiquetaSerieAuditoria(
    comunidadAutonoma,
    anio
  )}`
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

const configuracionDiferenciaTipoIrpf = ({
  comunidadAutonoma,
  anios,
}: {
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anios: readonly [AnioFiscal, AnioFiscal]
}): ChartConfig => {
  const [anioBase, anioComparado] = anios
  const etiqueta = `${describirComunidadAutonomaAuditoria(comunidadAutonoma).etiqueta} ${anioComparado} - ${anioBase}`

  return {
    [claveDiferenciaTipoIrpfPorcentaje]: {
      label: etiqueta,
      color: colorDiferenciaTipoIrpfDesfavorable,
    },
    [claveDiferenciaTipoIrpfEurosReales]: {
      label: etiqueta,
      color: colorDiferenciaTipoIrpfDesfavorable,
    },
    [claveDiferenciaTipoIrpfPorcentajeFavorable]: {
      label: `${etiqueta} baja o igual`,
      color: colorDiferenciaTipoIrpfFavorable,
    },
    [claveDiferenciaTipoIrpfPorcentajeDesfavorable]: {
      label: `${etiqueta} sube`,
      color: colorDiferenciaTipoIrpfDesfavorable,
    },
    [claveDiferenciaTipoIrpfEurosRealesFavorable]: {
      label: `${etiqueta} baja o igual`,
      color: colorDiferenciaTipoIrpfFavorable,
    },
    [claveDiferenciaTipoIrpfEurosRealesDesfavorable]: {
      label: `${etiqueta} sube`,
      color: colorDiferenciaTipoIrpfDesfavorable,
    },
  } satisfies ChartConfig
}

const configuracionCunaFiscal = ({
  comunidadesAutonomas,
  anios,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
}): ChartConfig =>
  Object.fromEntries(
    comunidadesAutonomas.flatMap((comunidadAutonoma) =>
      anios.flatMap((anio) =>
        ([...componentesApiladosCunaFiscal, "total"] as const).map(
          (componente) => [
            claveSerieCunaFiscal(comunidadAutonoma, anio, componente),
            {
              label: etiquetaSerieCunaFiscal(
                comunidadAutonoma,
                anio,
                componente
              ),
              color: colorComponenteCunaFiscal(componente),
            },
          ]
        )
      )
    )
  ) satisfies ChartConfig

const configuracionTipoMarginalIrpf = ({
  comunidadAutonoma,
  anio,
}: {
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
}): ChartConfig => {
  const etiqueta = `${describirComunidadAutonomaAuditoria(comunidadAutonoma).etiqueta} ${anio}`

  return {
    [claveTipoMarginalIrpf]: {
      label: `Tipo marginal ${etiqueta}`,
      color: colorTipoMarginalIrpf,
    },
    [claveTipoEfectivoIrpfMarginal]: {
      label: `Tipo efectivo ${etiqueta}`,
      color: colorTipoEfectivoIrpfMarginal,
    },
  } satisfies ChartConfig
}

const itemsLeyendaTipoEfectivoIrpf = ({
  comunidadesAutonomas,
  anios,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
}): ReadonlyArray<ItemLeyendaGraficoAuditoria> =>
  comunidadesAutonomas.flatMap((comunidadAutonoma) =>
    anios.map((anio) => ({
      clave: claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio),
      etiqueta: etiquetaSerieAuditoria(comunidadAutonoma, anio),
      color: colorSerieAuditoria(comunidadAutonoma, anio),
      tipo: "linea",
    }))
  )

const itemsLeyendaCunaFiscal = ({
  comunidadesAutonomas,
  anios,
}: {
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
}): ReadonlyArray<ItemLeyendaGraficoAuditoria> =>
  comunidadesAutonomas.flatMap((comunidadAutonoma) =>
    anios.flatMap((anio) =>
      componentesLeyendaCunaFiscal.map((componente) => ({
        clave: claveSerieCunaFiscal(comunidadAutonoma, anio, componente),
        etiqueta: etiquetaSerieCunaFiscal(comunidadAutonoma, anio, componente),
        color: colorComponenteCunaFiscal(componente),
        tipo: componente === "total" ? "linea" : "rectangulo",
      }))
    )
  )

type FilaTipoEfectivoIrpf = Record<string, number | string>
type FilaDiferenciaTipoIrpf = Record<string, number | string | undefined>
type FilaCunaFiscal = Record<string, number | string | undefined>
type FilaTipoMarginalIrpf = Record<string, number | string | undefined>
type ModoTipoEfectivoIrpf = ModoUnidadGraficoAuditoria
type ModoDiferenciaTipoIrpf = ModoUnidadGraficoAuditoria
type ModoCunaFiscal = ModoUnidadGraficoAuditoria
type TipoMarcadorLeyendaGrafico = "linea" | "rectangulo"
type ItemLeyendaGraficoAuditoria = {
  readonly clave: string
  readonly etiqueta: string
  readonly color: string
  readonly tipo: TipoMarcadorLeyendaGrafico
}
const opcionesModoPorcentajeEuros = [
  { valor: "porcentaje", etiqueta: "%" },
  { valor: "euros-reales", etiqueta: "€" },
] as const satisfies OpcionesSelectorModoGrafico<ModoUnidadGraficoAuditoria>
type EstadoDatosGrafico =
  | { readonly _tag: "cargando"; readonly clave: string }
  | {
      readonly _tag: "lista"
      readonly clave: string
      readonly tipoEfectivoIrpf: ReadonlyArray<FilaTipoEfectivoIrpf>
      readonly diferenciaTipoIrpf: ReadonlyArray<FilaDiferenciaTipoIrpf>
      readonly cunaFiscal: ReadonlyArray<FilaCunaFiscal>
      readonly tipoMarginalIrpf: ReadonlyArray<FilaTipoMarginalIrpf>
    }
  | { readonly _tag: "error"; readonly clave: string; readonly mensaje: string }
type DatosGraficoListos = Extract<
  EstadoDatosGrafico,
  { readonly _tag: "lista" }
>
type VistaGraficoAuditoria = GraficoAuditoriaNormativa
type VistaTipoEfectivoIrpfAuditoria = Extract<
  VistaGraficoAuditoria,
  "tipo-irpf" | "diferencia-irpf"
>
type PanelGraficoAuditoria = "tipo-efectivo" | "cuna-fiscal" | "tipo-marginal"
const panelesGraficoAuditoria = [
  "tipo-efectivo",
  "cuna-fiscal",
  "tipo-marginal",
] as const satisfies ReadonlyArray<PanelGraficoAuditoria>
const vistasTipoEfectivoIrpfAuditoria = [
  "tipo-irpf",
  "diferencia-irpf",
] as const satisfies ReadonlyArray<VistaTipoEfectivoIrpfAuditoria>

const panelGraficoDesdeVista = (
  vista: VistaGraficoAuditoria
): PanelGraficoAuditoria =>
  Match.value(vista).pipe(
    Match.when("tipo-irpf", () => "tipo-efectivo" as const),
    Match.when("diferencia-irpf", () => "tipo-efectivo" as const),
    Match.when("cuna-fiscal", () => "cuna-fiscal" as const),
    Match.when("tipo-marginal", () => "tipo-marginal" as const),
    Match.exhaustive
  )

const vistaGraficoDesdePanel = (
  panel: PanelGraficoAuditoria
): VistaGraficoAuditoria =>
  Match.value(panel).pipe(
    Match.when("tipo-efectivo", () => "tipo-irpf" as const),
    Match.when("cuna-fiscal", () => "cuna-fiscal" as const),
    Match.when("tipo-marginal", () => "tipo-marginal" as const),
    Match.exhaustive
  )

const decodificarPanelGraficoAuditoria = (
  valor: string
): Option.Option<PanelGraficoAuditoria> =>
  Match.value(valor).pipe(
    Match.when("tipo-efectivo", (panel) => Option.some(panel)),
    Match.when("cuna-fiscal", (panel) => Option.some(panel)),
    Match.when("tipo-marginal", (panel) => Option.some(panel)),
    Match.orElse(() => Option.none<PanelGraficoAuditoria>())
  )

const decodificarVistaTipoEfectivoIrpfAuditoria = (
  valor: string
): Option.Option<VistaTipoEfectivoIrpfAuditoria> =>
  Match.value(valor).pipe(
    Match.when("tipo-irpf", (vista) => Option.some(vista)),
    Match.when("diferencia-irpf", (vista) => Option.some(vista)),
    Match.orElse(() => Option.none<VistaTipoEfectivoIrpfAuditoria>())
  )

const versionCalculoDatosGrafico = (vista: VistaGraficoAuditoria) =>
  Match.value(vista).pipe(
    Match.when("cuna-fiscal", () => VERSION_CALCULO_CUNA_FISCAL),
    Match.when("tipo-marginal", () => VERSION_CALCULO_TIPO_MARGINAL_IRPF),
    Match.orElse(() => VERSION_CALCULO_AUDITORIA_IRPF)
  )

const obtenerPuntosAuditoriaParaAnio = (
  auditoria: AuditoriaRangoSalarial,
  comunidadAutonoma: ComunidadAuditada,
  perfil: PerfilAuditado,
  anio: AnioFiscal,
  anioReferenciaSeries: AnioFiscal
): Effect.Effect<ReadonlyArray<PuntoAuditoriaRangoSalarial>> =>
  construirPuntosAuditoriaAnioAjustado({
    salarioBrutoAnualMinimoCentimos: auditoria.salarioBrutoAnualMinimoCentimos,
    salarioBrutoAnualMaximoCentimos: auditoria.salarioBrutoAnualMaximoCentimos,
    pasoCentimos: auditoria.pasoCentimos,
    anio,
    anioReferencia: anioReferenciaSeries,
    comunidadAutonoma,
    perfilAuditoria: perfilAuditoriaNormativaParaRetencionPersonalizada(perfil),
  })

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
}) => [
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
  anioReferenciaSeries,
  puedeReusarBase,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly puedeReusarBase: boolean
}) =>
  puedeReusarBase &&
  anioReferenciaSeries === auditoria.anioReferencia &&
  comunidadAutonoma === comunidadAutonomaAuditoriaBase &&
  (anio === auditoria.anioComparado || anio === auditoria.anioReferencia)

const claveCacheSerieAuditoria = ({
  auditoria,
  comunidadAutonoma,
  perfil,
  anio,
  anioReferenciaSeries,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: ComunidadAuditada
  readonly perfil: PerfilAuditado
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
}) =>
  [
    VERSION_CALCULO_AUDITORIA_IRPF,
    comunidadAutonoma,
    perfil,
    anio,
    anioReferenciaSeries,
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
  perfil,
  aniosSeleccionados,
  anioReferenciaSeries,
  cacheSeries,
  puedeReusarBase,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly perfil: PerfilAuditado
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly anioReferenciaSeries: AnioFiscal
  readonly cacheSeries: Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>
  readonly puedeReusarBase: boolean
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
      perfil,
      anio,
      anioReferenciaSeries,
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
        anioReferenciaSeries,
        puedeReusarBase,
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
      anioReferencia: anioReferenciaSeries,
      comunidades: comunidadesAutonomas.join(","),
      puntosPorSerie: auditoria.puntos.length,
    },
    efecto: Effect.forEach(
      entradasPendientes,
      ({ comunidadAutonoma, anio }) =>
        obtenerPuntosAuditoriaParaAnio(
          auditoria,
          comunidadAutonoma,
          perfil,
          anio,
          anioReferenciaSeries
        ).pipe(
          Effect.map((puntos) => {
            cacheSeries.set(
              claveCacheSerieAuditoria({
                auditoria,
                comunidadAutonoma,
                perfil,
                anio,
                anioReferenciaSeries,
              }),
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

const claveCacheSerieTipoMarginalIrpf = ({
  auditoria,
  comunidadAutonoma,
  perfil,
  anio,
  anioReferenciaSeries,
  pasoCalculoCentimos,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: ComunidadAuditada
  readonly perfil: PerfilAuditado
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly pasoCalculoCentimos: number
}) =>
  [
    VERSION_CALCULO_TIPO_MARGINAL_IRPF,
    comunidadAutonoma,
    perfil,
    anio,
    anioReferenciaSeries,
    pasoCalculoCentimos,
    auditoria.salarioBrutoAnualMinimoCentimos,
    auditoria.salarioBrutoAnualMaximoCentimos,
    auditoria.pasoCentimos,
  ].join("|")

const construirSerieTipoMarginalIrpf = Effect.fn(
  "auditoria.ui.construirSerieTipoMarginalIrpf"
)(function* ({
  auditoria,
  comunidadAutonoma,
  perfil,
  anio,
  anioReferenciaSeries,
  cacheSeries,
  pasoCalculoCentimos,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: ComunidadAuditada
  readonly perfil: PerfilAuditado
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly cacheSeries: Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>
  readonly pasoCalculoCentimos: number
}) {
  const claveSerie = claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)
  const claveCache = claveCacheSerieTipoMarginalIrpf({
    auditoria,
    comunidadAutonoma,
    perfil,
    anio,
    anioReferenciaSeries,
    pasoCalculoCentimos,
  })
  const cacheada = Option.fromNullishOr(cacheSeries.get(claveCache))

  if (Option.isSome(cacheada)) {
    return new Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>([
      [claveSerie, cacheada.value],
    ])
  }

  const puntos = yield* instrumentarEffectAuditoria({
    nombre: "auditoria.ui.series.calcularTipoMarginal",
    metrica: metricaDuracionSeriesAuditoria,
    detalles: {
      anio,
      anioReferencia: anioReferenciaSeries,
      comunidadAutonoma,
      pasoVisibleCentimos: auditoria.pasoCentimos,
      pasoCalculoCentimos,
    },
    efecto: construirPuntosAuditoriaAnioAjustado({
      salarioBrutoAnualMinimoCentimos:
        auditoria.salarioBrutoAnualMinimoCentimos,
      salarioBrutoAnualMaximoCentimos:
        auditoria.salarioBrutoAnualMaximoCentimos,
      pasoCentimos: pasoCalculoCentimos,
      anio,
      anioReferencia: anioReferenciaSeries,
      comunidadAutonoma,
      perfilAuditoria:
        perfilAuditoriaNormativaParaRetencionPersonalizada(perfil),
    }),
  })

  cacheSeries.set(claveCache, puntos)

  return new Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>([
    [claveSerie, puntos],
  ])
})

const construirFilasTipoEfectivoIrpfDesdeSeries = ({
  auditoria,
  comunidadesAutonomas,
  aniosSeleccionados,
  anioReferenciaSeries,
  modo,
  series,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly anioReferenciaSeries: AnioFiscal
  readonly modo: ModoTipoEfectivoIrpf
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) =>
  auditoria.puntos.flatMap((puntoBase) => {
    if (
      !esSalarioVisibleTipoEfectivoIrpf({
        salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
        salarioMinimoCentimos: auditoria.salarioBrutoAnualMinimoCentimos,
        pasoCentimos: auditoria.pasoCentimos,
      })
    ) {
      return []
    }

    const fila: FilaTipoEfectivoIrpf = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const comunidadAutonoma of comunidadesAutonomas) {
      for (const anio of aniosSeleccionados) {
        const punto = puntoSeriePorSalario({
          series,
          comunidadAutonoma,
          anio,
          salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
        })
        if (Option.isNone(punto)) continue
        const desglose = desgloseLiquidadoParaAnio({
          anio,
          anioReferenciaSeries,
          punto: punto.value,
        })
        fila[claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)] = Match.value(
          modo
        ).pipe(
          Match.when("porcentaje", () =>
            proporcionSegura(
              irpfConDeclaracionCentimos(desglose),
              desglose.salarioBrutoAnualCentimos
            )
          ),
          Match.when("euros-reales", () =>
            centimosAEuros(irpfConDeclaracionCentimos(desglose))
          ),
          Match.exhaustive
        )
      }
    }

    return [fila]
  })

const puntoSeriePorSalario = ({
  series,
  comunidadAutonoma,
  anio,
  salarioBrutoAnualCentimos,
}: {
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
  readonly salarioBrutoAnualCentimos: number
}) =>
  Option.fromNullishOr(
    series.get(claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio))
  ).pipe(
    Option.flatMap((puntos) =>
      Option.fromNullishOr(
        puntos.find(
          (punto) =>
            punto.salarioBrutoAnualCentimos === salarioBrutoAnualCentimos
        )
      )
    )
  )

const tipoEfectivoIrpfParaAnio = ({
  anio,
  anioReferenciaSeries,
  punto,
}: {
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly punto: PuntoAuditoriaRangoSalarial
}) =>
  Match.value(anio === anioReferenciaSeries).pipe(
    Match.when(true, () => punto.tipoEfectivoIrpfActual),
    Match.orElse(() => punto.tipoEfectivoIrpfComparado)
  )

const desgloseLiquidadoParaAnio = ({
  anio,
  anioReferenciaSeries,
  punto,
}: {
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly punto: PuntoAuditoriaRangoSalarial
}) =>
  Match.value(anio === anioReferenciaSeries).pipe(
    Match.when(true, () => punto.comparacion.referencia),
    Match.orElse(() => punto.comparacion.comparado.ajustado)
  )

const proporcionSegura = (numerador: number, denominador: number) =>
  denominador === 0 ? 0 : numerador / denominador

const irpfConDeclaracionCentimos = (
  desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"]
) => desglose.irpfConObligacionDeclararCentimos ?? desglose.irpfFinalCentimos

const irpfBaseMarginalCentimos = (
  desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"]
) => desglose.irpfCuotaTrasDeduccionSmiCentimos ?? desglose.irpfFinalCentimos

const irpfBaseMarginalPrecisoEuros = (
  desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"]
) => {
  const cuotaTrasDeduccionSmiPrecisa = Option.fromNullishOr(
    desglose.irpfCuotaTrasDeduccionSmiPrecisoEuros
  )
  if (Option.isSome(cuotaTrasDeduccionSmiPrecisa)) {
    return cuotaTrasDeduccionSmiPrecisa
  }

  return desglose.irpfCuotaTrasDeduccionSmiCentimos === undefined
    ? Option.fromNullishOr(desglose.irpfFinalPrecisoEuros)
    : Option.none<string>()
}

const valorMagnitudCentimos = (
  desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"],
  magnitud: MagnitudAuditadaAuditoria
) =>
  Match.value(magnitud).pipe(
    Match.when("irpf_final", () => irpfConDeclaracionCentimos(desglose)),
    Match.when(
      "cotizacion_trabajador",
      () => desglose.cotizacionTrabajadorCentimos
    ),
    Match.when(
      "cotizacion_empresarial",
      () => desglose.cotizacionEmpresarialCentimos
    ),
    Match.when("salario_neto_anual", () => desglose.salarioNetoAnualCentimos),
    Match.when("coste_laboral", () => desglose.costeLaboralCentimos),
    Match.when(
      "carga_fiscal_efectiva",
      () =>
        desglose.cotizacionTrabajadorCentimos +
        irpfConDeclaracionCentimos(desglose)
    ),
    Match.exhaustive
  )

const tipoEfectivoMagnitud = (
  desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"],
  magnitud: MagnitudAuditadaAuditoria
) =>
  proporcionSegura(
    valorMagnitudCentimos(desglose, magnitud),
    desglose.salarioBrutoAnualCentimos
  )

const numeroEnFila = (
  fila: Readonly<Record<string, number | string | undefined>>,
  clave: string
) => {
  const valor = fila[clave]
  if (typeof valor === "number" && Number.isFinite(valor)) {
    return Option.some(valor)
  }

  return Option.none<number>()
}

const clavesDiferenciaTipoIrpfBase = [
  claveDiferenciaTipoIrpfPorcentaje,
  claveDiferenciaTipoIrpfEurosReales,
] as const

const signosOpuestos = (primero: number, segundo: number) =>
  (primero < 0 && segundo > 0) || (primero > 0 && segundo < 0)

const interpolarNumeroEntreFilas = ({
  filaAnterior,
  filaSiguiente,
  clave,
  proporcion,
}: {
  readonly filaAnterior: FilaDiferenciaTipoIrpf
  readonly filaSiguiente: FilaDiferenciaTipoIrpf
  readonly clave: string
  readonly proporcion: number
}) => {
  const valorAnterior = numeroEnFila(filaAnterior, clave)
  const valorSiguiente = numeroEnFila(filaSiguiente, clave)

  if (Option.isNone(valorAnterior)) return Option.none<number>()
  if (Option.isNone(valorSiguiente)) return Option.none<number>()

  return Option.some(
    valorAnterior.value +
      (valorSiguiente.value - valorAnterior.value) * proporcion
  )
}

const interpolarFilaCruceCeroDiferencia = ({
  filaAnterior,
  filaSiguiente,
  claveCruce,
}: {
  readonly filaAnterior: FilaDiferenciaTipoIrpf
  readonly filaSiguiente: FilaDiferenciaTipoIrpf
  readonly claveCruce: string
}) => {
  const valorAnterior = numeroEnFila(filaAnterior, claveCruce)
  const valorSiguiente = numeroEnFila(filaSiguiente, claveCruce)
  const salarioAnterior = numeroEnFila(filaAnterior, "salarioEuros")
  const salarioSiguiente = numeroEnFila(filaSiguiente, "salarioEuros")

  if (Option.isNone(valorAnterior)) return Option.none<FilaDiferenciaTipoIrpf>()
  if (Option.isNone(valorSiguiente))
    return Option.none<FilaDiferenciaTipoIrpf>()
  if (Option.isNone(salarioAnterior))
    return Option.none<FilaDiferenciaTipoIrpf>()
  if (Option.isNone(salarioSiguiente))
    return Option.none<FilaDiferenciaTipoIrpf>()
  if (!signosOpuestos(valorAnterior.value, valorSiguiente.value)) {
    return Option.none<FilaDiferenciaTipoIrpf>()
  }

  const proporcion =
    -valorAnterior.value / (valorSiguiente.value - valorAnterior.value)
  const salarioEuros =
    salarioAnterior.value +
    (salarioSiguiente.value - salarioAnterior.value) * proporcion
  const fila: FilaDiferenciaTipoIrpf = {
    salarioEuros,
    salario: formatearCentimosEnteros(eurosACentimos(salarioEuros)),
  }

  for (const clave of clavesDiferenciaTipoIrpfBase) {
    interpolarNumeroEntreFilas({
      filaAnterior,
      filaSiguiente,
      clave,
      proporcion,
    }).pipe(
      Option.match({
        onNone: () => {},
        onSome: (valor) => {
          fila[clave] = valor
        },
      })
    )
  }

  fila[claveCruce] = 0
  return Option.some(fila)
}

const salarioEurosOrdenFila = (fila: FilaDiferenciaTipoIrpf) =>
  Option.getOrElse(numeroEnFila(fila, "salarioEuros"), () => 0)

const insertarCrucesCeroDiferenciaTipoIrpf = (
  filas: ReadonlyArray<FilaDiferenciaTipoIrpf>
) => {
  const filasConCruces: Array<FilaDiferenciaTipoIrpf> = []

  filas.forEach((fila, indice) => {
    filasConCruces.push({ ...fila })
    const filaSiguiente = Option.fromNullishOr(filas[indice + 1])

    if (Option.isNone(filaSiguiente)) return

    for (const claveCruce of clavesDiferenciaTipoIrpfBase) {
      interpolarFilaCruceCeroDiferencia({
        filaAnterior: fila,
        filaSiguiente: filaSiguiente.value,
        claveCruce,
      }).pipe(
        Option.match({
          onNone: () => {},
          onSome: (filaCruce) => {
            filasConCruces.push(filaCruce)
          },
        })
      )
    }
  })

  return filasConCruces.sort(
    (filaA, filaB) =>
      salarioEurosOrdenFila(filaA) - salarioEurosOrdenFila(filaB)
  )
}

const asignarDiferenciaSegmentada = ({
  fila,
  valor,
  claveFavorable,
  claveDesfavorable,
}: {
  readonly fila: FilaDiferenciaTipoIrpf
  readonly valor: number
  readonly claveFavorable: string
  readonly claveDesfavorable: string
}) => {
  const valorFavorable = Match.value(valor <= 0).pipe(
    Match.when(true, () => Option.some(valor)),
    Match.orElse(() => Option.none<number>()),
    Option.getOrUndefined
  )
  const valorDesfavorable = Match.value(valor >= 0).pipe(
    Match.when(true, () => Option.some(valor)),
    Match.orElse(() => Option.none<number>()),
    Option.getOrUndefined
  )

  fila[claveFavorable] = valorFavorable
  fila[claveDesfavorable] = valorDesfavorable
}

const asignarSegmentosDiferenciaTipoIrpf = (fila: FilaDiferenciaTipoIrpf) => {
  numeroEnFila(fila, claveDiferenciaTipoIrpfPorcentaje).pipe(
    Option.match({
      onNone: () => {},
      onSome: (valor) =>
        asignarDiferenciaSegmentada({
          fila,
          valor,
          claveFavorable: claveDiferenciaTipoIrpfPorcentajeFavorable,
          claveDesfavorable: claveDiferenciaTipoIrpfPorcentajeDesfavorable,
        }),
    })
  )
  numeroEnFila(fila, claveDiferenciaTipoIrpfEurosReales).pipe(
    Option.match({
      onNone: () => {},
      onSome: (valor) =>
        asignarDiferenciaSegmentada({
          fila,
          valor,
          claveFavorable: claveDiferenciaTipoIrpfEurosRealesFavorable,
          claveDesfavorable: claveDiferenciaTipoIrpfEurosRealesDesfavorable,
        }),
    })
  )

  return fila
}

const construirFilasDiferenciaTipoIrpfDesdeSeries = ({
  auditoria,
  comunidadAutonoma,
  magnitud,
  aniosSeleccionados,
  anioReferenciaSeries,
  series,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonoma: ComunidadAuditada
  readonly magnitud: MagnitudAuditadaAuditoria
  readonly aniosSeleccionados: readonly [AnioFiscal, AnioFiscal]
  readonly anioReferenciaSeries: AnioFiscal
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) =>
  insertarCrucesCeroDiferenciaTipoIrpf(
    auditoria.puntos.flatMap((puntoBase) => {
      if (
        !esSalarioVisibleTipoEfectivoIrpf({
          salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
          salarioMinimoCentimos: auditoria.salarioBrutoAnualMinimoCentimos,
          pasoCentimos: auditoria.pasoCentimos,
        })
      ) {
        return []
      }

      const fila: FilaDiferenciaTipoIrpf = {
        salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
        salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
      }
      const [anioBase, anioComparado] = aniosSeleccionados
      const puntoBaseComparacion = puntoSeriePorSalario({
        series,
        comunidadAutonoma,
        anio: anioBase,
        salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
      })
      const puntoAnioComparado = puntoSeriePorSalario({
        series,
        comunidadAutonoma,
        anio: anioComparado,
        salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
      })

      if (Option.isNone(puntoBaseComparacion)) return []
      if (Option.isNone(puntoAnioComparado)) return []

      const desgloseBase = desgloseLiquidadoParaAnio({
        anio: anioBase,
        anioReferenciaSeries,
        punto: puntoBaseComparacion.value,
      })
      const desgloseComparado = desgloseLiquidadoParaAnio({
        anio: anioComparado,
        anioReferenciaSeries,
        punto: puntoAnioComparado.value,
      })

      const tipoMagnitudBase = tipoEfectivoMagnitud(desgloseBase, magnitud)
      const tipoMagnitudComparado = tipoEfectivoMagnitud(
        desgloseComparado,
        magnitud
      )

      fila[claveDiferenciaTipoIrpfPorcentaje] =
        tipoMagnitudComparado - tipoMagnitudBase
      fila[claveDiferenciaTipoIrpfEurosReales] = centimosAEuros(
        valorMagnitudCentimos(desgloseComparado, magnitud) -
          valorMagnitudCentimos(desgloseBase, magnitud)
      )

      return [fila]
    })
  ).map(asignarSegmentosDiferenciaTipoIrpf)

const valorComponenteCunaFiscal = ({
  desglose,
  componente,
  modo,
}: {
  readonly desglose: PuntoAuditoriaRangoSalarial["comparacion"]["referencia"]
  readonly componente: ComponenteCunaFiscal
  readonly modo: ModoCunaFiscal
}) => {
  const irpfComparableCentimos = irpfConDeclaracionCentimos(desglose)
  const valorCentimos = Match.value(componente).pipe(
    Match.withReturnType<number>(),
    Match.when("irpf", () => irpfComparableCentimos),
    Match.when(
      "cotizaciones-trabajador",
      () => desglose.cotizacionTrabajadorCentimos
    ),
    Match.when(
      "cotizaciones-empresa",
      () => desglose.cotizacionEmpresarialCentimos
    ),
    Match.when(
      "total",
      () =>
        irpfComparableCentimos +
        desglose.cotizacionTrabajadorCentimos +
        desglose.cotizacionEmpresarialCentimos
    ),
    Match.exhaustive
  )

  return Match.value(modo).pipe(
    Match.withReturnType<number>(),
    Match.when("porcentaje", () =>
      proporcionSegura(valorCentimos, desglose.costeLaboralCentimos)
    ),
    Match.when("euros-reales", () => centimosAEuros(valorCentimos)),
    Match.exhaustive
  )
}

const construirFilasCunaFiscalDesdeSeries = ({
  auditoria,
  comunidadesAutonomas,
  aniosSeleccionados,
  anioReferenciaSeries,
  modo,
  series,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly aniosSeleccionados: ReadonlyArray<AnioFiscal>
  readonly anioReferenciaSeries: AnioFiscal
  readonly modo: ModoCunaFiscal
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) =>
  auditoria.puntos.flatMap((puntoBase) => {
    if (
      !esSalarioVisibleTipoEfectivoIrpf({
        salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
        salarioMinimoCentimos: auditoria.salarioBrutoAnualMinimoCentimos,
        pasoCentimos: auditoria.pasoCentimos,
      })
    ) {
      return []
    }

    const fila: FilaCunaFiscal = {
      salarioEuros: centimosAEuros(puntoBase.salarioBrutoAnualCentimos),
      salario: formatearCentimosEnteros(puntoBase.salarioBrutoAnualCentimos),
    }

    for (const comunidadAutonoma of comunidadesAutonomas) {
      for (const anio of aniosSeleccionados) {
        const punto = puntoSeriePorSalario({
          series,
          comunidadAutonoma,
          anio,
          salarioBrutoAnualCentimos: puntoBase.salarioBrutoAnualCentimos,
        })
        if (Option.isNone(punto)) continue

        const desglose = desgloseLiquidadoParaAnio({
          anio,
          anioReferenciaSeries,
          punto: punto.value,
        })

        for (const componente of [
          ...componentesApiladosCunaFiscal,
          "total",
        ] as const) {
          fila[claveSerieCunaFiscal(comunidadAutonoma, anio, componente)] =
            valorComponenteCunaFiscal({ desglose, componente, modo })
        }
      }
    }

    return [fila]
  })

const calcularTipoMarginalIrpf = ({
  anio,
  anioReferenciaSeries,
  punto,
  puntoSiguiente,
}: {
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly punto: PuntoAuditoriaRangoSalarial
  readonly puntoSiguiente: PuntoAuditoriaRangoSalarial
}) => {
  const incrementoSalarioCentimos =
    puntoSiguiente.salarioBrutoAnualCentimos - punto.salarioBrutoAnualCentimos

  if (incrementoSalarioCentimos <= 0) return Option.none<number>()

  const incrementoSalarioEuros = Match.value(
    anio === anioReferenciaSeries
  ).pipe(
    Match.when(true, () => new Decimal(incrementoSalarioCentimos).div(100)),
    Match.orElse(() =>
      new Decimal(
        puntoSiguiente.comparacion.comparado.salarioBrutoNominalAnualCentimos -
          punto.comparacion.comparado.salarioBrutoNominalAnualCentimos
      )
        .div(100)
        .mul(punto.comparacion.factorIpc)
    )
  )

  const desglose = desgloseLiquidadoParaAnio({
    anio,
    anioReferenciaSeries,
    punto,
  })
  const desgloseSiguiente = desgloseLiquidadoParaAnio({
    anio,
    anioReferenciaSeries,
    punto: puntoSiguiente,
  })
  const irpfPreciso = irpfBaseMarginalPrecisoEuros(desglose)
  const irpfSiguientePreciso = irpfBaseMarginalPrecisoEuros(desgloseSiguiente)

  if (Option.isSome(irpfPreciso) && Option.isSome(irpfSiguientePreciso)) {
    return Option.some(
      new Decimal(irpfSiguientePreciso.value)
        .minus(irpfPreciso.value)
        .div(incrementoSalarioEuros)
        .toNumber()
    )
  }

  return Option.some(
    (irpfBaseMarginalCentimos(desgloseSiguiente) -
      irpfBaseMarginalCentimos(desglose)) /
      incrementoSalarioCentimos
  )
}

const tipoMarginalIrpfParaIndice = ({
  anio,
  anioReferenciaSeries,
  puntos,
  indice,
}: {
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly puntos: ReadonlyArray<PuntoAuditoriaRangoSalarial>
  readonly indice: number
}) => {
  const punto = Option.fromNullishOr(puntos[indice])
  const puntoSiguiente = Option.fromNullishOr(puntos[indice + 1])

  if (Option.isSome(punto) && Option.isSome(puntoSiguiente)) {
    return calcularTipoMarginalIrpf({
      anio,
      anioReferenciaSeries,
      punto: punto.value,
      puntoSiguiente: puntoSiguiente.value,
    })
  }

  const puntoAnterior = Option.fromNullishOr(puntos[indice - 1])

  if (Option.isSome(puntoAnterior) && Option.isSome(punto)) {
    return calcularTipoMarginalIrpf({
      anio,
      anioReferenciaSeries,
      punto: puntoAnterior.value,
      puntoSiguiente: punto.value,
    })
  }

  return Option.none<number>()
}

const construirFilasTipoMarginalIrpfDesdeSeries = ({
  comunidadAutonoma,
  anio,
  anioReferenciaSeries,
  salarioMinimoCentimos,
  pasoVisibleCentimos,
  series,
}: {
  readonly comunidadAutonoma: ComunidadAuditada
  readonly anio: AnioFiscal
  readonly anioReferenciaSeries: AnioFiscal
  readonly salarioMinimoCentimos: number
  readonly pasoVisibleCentimos: number
  readonly series: ReadonlyMap<
    string,
    ReadonlyArray<PuntoAuditoriaRangoSalarial>
  >
}) => {
  const puntos = Option.fromNullishOr(
    series.get(claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio))
  )
  if (Option.isNone(puntos)) return []

  return puntos.value.flatMap((punto, indice) => {
    if (
      !esSalarioVisibleTipoMarginal({
        salarioBrutoAnualCentimos: punto.salarioBrutoAnualCentimos,
        salarioMinimoCentimos,
        pasoVisibleCentimos,
      })
    ) {
      return []
    }

    const salarioEuros = centimosAEuros(punto.salarioBrutoAnualCentimos)
    const fila: FilaTipoMarginalIrpf = {
      salarioEuros,
      salario: formatearCentimosEnteros(punto.salarioBrutoAnualCentimos),
      [claveTipoEfectivoIrpfMarginal]: tipoEfectivoIrpfParaAnio({
        anio,
        anioReferenciaSeries,
        punto,
      }),
    }
    const tipoMarginal = tipoMarginalIrpfParaIndice({
      anio,
      anioReferenciaSeries,
      puntos: puntos.value,
      indice,
    })

    if (Option.isNone(tipoMarginal)) return [fila]

    fila[claveTipoMarginalIrpf] = tipoMarginal.value
    return [fila]
  })
}

const construirFilasGraficosAuditoria = Effect.fn(
  "auditoria.ui.construirFilasGraficosAuditoria"
)(function* ({
  auditoria,
  comunidadAutonomaAuditoriaBase,
  comunidadesAutonomas,
  perfil,
  aniosIrpf,
  modoTipoEfectivoIrpf,
  aniosDiferenciaTipoIrpf,
  anioCunaFiscal,
  modoCunaFiscal,
  magnitudAuditada,
  anioTipoMarginalIrpf,
  anioReferenciaGraficosIrpf,
  cacheSeries,
  vistaGrafico,
}: {
  readonly auditoria: AuditoriaRangoSalarial
  readonly comunidadAutonomaAuditoriaBase: ComunidadAuditada
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly perfil: PerfilAuditado
  readonly aniosIrpf: ReadonlyArray<AnioFiscal>
  readonly modoTipoEfectivoIrpf: ModoTipoEfectivoIrpf
  readonly aniosDiferenciaTipoIrpf: readonly [AnioFiscal, AnioFiscal]
  readonly anioCunaFiscal: AnioFiscal
  readonly modoCunaFiscal: ModoCunaFiscal
  readonly magnitudAuditada: MagnitudAuditadaAuditoria
  readonly anioTipoMarginalIrpf: AnioFiscal
  readonly anioReferenciaGraficosIrpf: AnioFiscal
  readonly cacheSeries: Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>
  readonly vistaGrafico: VistaGraficoAuditoria
}) {
  const anioReferenciaTipoEfectivoIrpf = anioReferenciaGraficosIrpf
  const anioReferenciaDiferenciaTipoIrpf = anioReferenciaGraficosIrpf
  const anioReferenciaCunaFiscal = anioReferenciaGraficosIrpf
  const anioReferenciaTipoMarginalIrpf = anioReferenciaGraficosIrpf
  const tipoEfectivoIrpf = yield* Match.value(vistaGrafico).pipe(
    Match.when("tipo-irpf", () =>
      Effect.gen(function* () {
        const seriesTipoEfectivoIrpf = yield* construirSeriesAuditoria({
          auditoria,
          comunidadAutonomaAuditoriaBase,
          comunidadesAutonomas,
          perfil,
          aniosSeleccionados: aniosIrpf,
          anioReferenciaSeries: anioReferenciaTipoEfectivoIrpf,
          cacheSeries,
          puedeReusarBase: true,
        })

        return yield* instrumentarEffectAuditoria({
          nombre: "auditoria.ui.filasTipoEfectivoIrpf",
          metrica: metricaDuracionFilasGraficosAuditoria,
          detalles: {
            filas: auditoria.puntos.length,
            series: comunidadesAutonomas.length * aniosIrpf.length,
            anios: aniosIrpf.join(","),
            modo: modoTipoEfectivoIrpf,
            anioReferencia: anioReferenciaTipoEfectivoIrpf,
          },
          efecto: Effect.sync(() =>
            construirFilasTipoEfectivoIrpfDesdeSeries({
              auditoria,
              comunidadesAutonomas,
              aniosSeleccionados: aniosIrpf,
              anioReferenciaSeries: anioReferenciaTipoEfectivoIrpf,
              modo: modoTipoEfectivoIrpf,
              series: seriesTipoEfectivoIrpf,
            })
          ),
        })
      })
    ),
    Match.orElse(() =>
      Effect.succeed([] as ReadonlyArray<FilaTipoEfectivoIrpf>)
    )
  )

  const diferenciaTipoIrpf = yield* Match.value(vistaGrafico).pipe(
    Match.when("diferencia-irpf", () =>
      Effect.gen(function* () {
        const seriesDiferenciaTipoIrpf = yield* construirSeriesAuditoria({
          auditoria,
          comunidadAutonomaAuditoriaBase,
          comunidadesAutonomas,
          perfil,
          aniosSeleccionados: aniosDiferenciaTipoIrpf,
          anioReferenciaSeries: anioReferenciaDiferenciaTipoIrpf,
          cacheSeries,
          puedeReusarBase: true,
        })

        return yield* instrumentarEffectAuditoria({
          nombre: "auditoria.ui.filasDiferenciaTipoIrpf",
          metrica: metricaDuracionFilasGraficosAuditoria,
          detalles: {
            filas: auditoria.puntos.length,
            series:
              comunidadesAutonomas.length * aniosDiferenciaTipoIrpf.length,
            anios: aniosDiferenciaTipoIrpf.join(","),
            anioReferencia: anioReferenciaDiferenciaTipoIrpf,
          },
          efecto: Effect.sync(() =>
            construirFilasDiferenciaTipoIrpfDesdeSeries({
              auditoria,
              comunidadAutonoma: comunidadAutonomaAuditoriaBase,
              magnitud: magnitudAuditada,
              aniosSeleccionados: aniosDiferenciaTipoIrpf,
              anioReferenciaSeries: anioReferenciaDiferenciaTipoIrpf,
              series: seriesDiferenciaTipoIrpf,
            })
          ),
        })
      })
    ),
    Match.orElse(() =>
      Effect.succeed([] as ReadonlyArray<FilaDiferenciaTipoIrpf>)
    )
  )

  const cunaFiscal = yield* Match.value(vistaGrafico).pipe(
    Match.when("cuna-fiscal", () =>
      Effect.gen(function* () {
        const aniosCunaFiscal = [anioCunaFiscal] as const
        const seriesCunaFiscal = yield* construirSeriesAuditoria({
          auditoria,
          comunidadAutonomaAuditoriaBase,
          comunidadesAutonomas,
          perfil,
          aniosSeleccionados: aniosCunaFiscal,
          anioReferenciaSeries: anioReferenciaCunaFiscal,
          cacheSeries,
          puedeReusarBase: true,
        })

        return yield* instrumentarEffectAuditoria({
          nombre: "auditoria.ui.filasCunaFiscal",
          metrica: metricaDuracionFilasGraficosAuditoria,
          detalles: {
            filas: auditoria.puntos.length,
            series: comunidadesAutonomas.length,
            anio: anioCunaFiscal,
            modo: modoCunaFiscal,
            anioReferencia: anioReferenciaCunaFiscal,
          },
          efecto: Effect.sync(() =>
            construirFilasCunaFiscalDesdeSeries({
              auditoria,
              comunidadesAutonomas,
              aniosSeleccionados: aniosCunaFiscal,
              anioReferenciaSeries: anioReferenciaCunaFiscal,
              modo: modoCunaFiscal,
              series: seriesCunaFiscal,
            })
          ),
        })
      })
    ),
    Match.orElse(() => Effect.succeed([] as ReadonlyArray<FilaCunaFiscal>))
  )

  const tipoMarginalIrpf = yield* Match.value(vistaGrafico).pipe(
    Match.when("tipo-marginal", () =>
      Effect.gen(function* () {
        const pasoCalculoMarginalCentimos = pasoCalculoTipoMarginalCentimos(
          auditoria.pasoCentimos
        )
        const seriesTipoMarginalIrpf = yield* construirSerieTipoMarginalIrpf({
          auditoria,
          comunidadAutonoma: comunidadAutonomaAuditoriaBase,
          perfil,
          anio: anioTipoMarginalIrpf,
          anioReferenciaSeries: anioReferenciaTipoMarginalIrpf,
          cacheSeries,
          pasoCalculoCentimos: pasoCalculoMarginalCentimos,
        })

        return yield* instrumentarEffectAuditoria({
          nombre: "auditoria.ui.filasTipoMarginalIrpf",
          metrica: metricaDuracionFilasGraficosAuditoria,
          detalles: {
            filas: Math.max(
              0,
              Math.floor(
                (auditoria.salarioBrutoAnualMaximoCentimos -
                  auditoria.salarioBrutoAnualMinimoCentimos) /
                  auditoria.pasoCentimos
              ) + 1
            ),
            series: 1,
            anios: String(anioTipoMarginalIrpf),
            anioReferencia: anioReferenciaTipoMarginalIrpf,
            pasoVisibleCentimos: auditoria.pasoCentimos,
            pasoCalculoCentimos: pasoCalculoMarginalCentimos,
          },
          efecto: Effect.sync(() =>
            construirFilasTipoMarginalIrpfDesdeSeries({
              comunidadAutonoma: comunidadAutonomaAuditoriaBase,
              anio: anioTipoMarginalIrpf,
              anioReferenciaSeries: anioReferenciaTipoMarginalIrpf,
              salarioMinimoCentimos: auditoria.salarioBrutoAnualMinimoCentimos,
              pasoVisibleCentimos: auditoria.pasoCentimos,
              series: seriesTipoMarginalIrpf,
            })
          ),
        })
      })
    ),
    Match.orElse(() =>
      Effect.succeed([] as ReadonlyArray<FilaTipoMarginalIrpf>)
    )
  )

  return { tipoEfectivoIrpf, diferenciaTipoIrpf, cunaFiscal, tipoMarginalIrpf }
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

const dominioPorcentajeTipoMarginalIrpf = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [0, 0.8] as const

  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const paso = 0.1
  const inferior = Match.value(minimo < 0).pipe(
    Match.when(true, () => Math.floor((minimo - paso) / paso) * paso),
    Match.orElse(() => 0)
  )
  const superior = Math.max(0.1, Math.ceil((maximo + paso) / paso) * paso)
  return [inferior, superior] as const
}

const ticksPorcentajeTipoMarginalIrpf = (
  dominio: readonly [number, number]
) => {
  const [inferior, superior] = dominio
  const paso = 0.1
  const inicio = Math.floor(inferior / paso)
  const fin = Math.ceil(superior / paso)
  return Array.from({ length: fin - inicio + 1 }, (_, indice) =>
    Number(((inicio + indice) * paso).toFixed(2))
  )
}

const formatearTickPorcentaje = (valor: number): string =>
  `${Math.round(valor * 100)}%`

const alinearDominioSecundarioPorCero = ({
  dominioPrincipal,
  dominioSecundario,
}: {
  readonly dominioPrincipal: readonly [number, number]
  readonly dominioSecundario: readonly [number, number]
}) => {
  const [inferiorPrincipal, superiorPrincipal] = dominioPrincipal
  const [, superiorSecundario] = dominioSecundario

  if (inferiorPrincipal >= 0 || superiorPrincipal <= 0) {
    return dominioSecundario
  }

  const proporcionCero =
    Math.abs(inferiorPrincipal) / (superiorPrincipal - inferiorPrincipal)
  const inferiorSecundario =
    -(proporcionCero * superiorSecundario) / (1 - proporcionCero)

  return [inferiorSecundario, superiorSecundario] as const
}

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
        "590,89 € si bruto <= 17.094,00 €; max(0, 590,89 € - 20,00% x (bruto - 17.094,00 €)) si 17.094,00 € < bruto < 20.048,45 €; 0,00 € si supera el tramo"
    ),
    Match.orElse(() => "0,00 €")
  )

const parametrosFormulaTipoEfectivoIrpf = (anio: AnioFiscal) => {
  const especificacion = obtenerEspecificacionCompatibilidadHistorica(anio)

  return {
    tipoMaximoRetencion: formatearPuntosPorcentuales(
      especificacion.tipoMaximoRetencionNomina.mul(100).toString()
    ),
    deduccionSmi: deduccionSmiFormula(anio),
  }
}

interface CalculoSaltoDeclaracion {
  readonly anio: AnioFiscal
  readonly salarioGraficoUmbralCentimos: number
  readonly cuotaAnualUmbralCentimos: number
  readonly limiteRetencionUmbralCentimos: number
  readonly irpfAntesUmbralCentimos: number
  readonly irpfDespuesUmbralCentimos: number
  readonly saltoCentimos: number
  readonly tipoMaximoRetencionPorcentaje: string
  readonly umbralRetencionActualCentimos: number
  readonly umbralRetencionCriticoCentimos: number
  readonly haySalto: boolean
}

type EstadoCalculosSaltoDeclaracion =
  | { readonly _tag: "cargando"; readonly clave: string }
  | {
      readonly _tag: "lista"
      readonly clave: string
      readonly calculos: ReadonlyArray<CalculoSaltoDeclaracion>
    }
  | { readonly _tag: "error"; readonly clave: string; readonly mensaje: string }

const construirCalculoSaltoDeclaracion = Effect.fn(
  "auditoria.ui.construirCalculoSaltoDeclaracion"
)(function* ({
  anio,
  anioReferencia,
  comunidadAutonoma,
  perfil,
}: {
  readonly anio: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly comunidadAutonoma: ComunidadAuditada
  readonly perfil: PerfilAuditado
}) {
  const salarioSinObligacionCentimos =
    UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS
  const salarioConObligacionCentimos =
    UMBRAL_RENDIMIENTOS_TRABAJO_NO_OBLIGACION_DECLARAR_UN_PAGADOR_CENTIMOS + 100
  const perfilAuditoria =
    perfilAuditoriaNormativaParaRetencionPersonalizada(perfil)
  const sinObligacion = yield* calcularSalarioLegacy({
    anio,
    salarioBrutoAnualCentimos: salarioSinObligacionCentimos,
    comunidadAutonoma,
    perfilAuditoria,
  })
  const conObligacion = yield* calcularSalarioLegacy({
    anio,
    salarioBrutoAnualCentimos: salarioConObligacionCentimos,
    comunidadAutonoma,
    perfilAuditoria,
  })
  const especificacion = obtenerEspecificacionCompatibilidadHistorica(anio)
  const tipoMaximoRetencion =
    especificacion.tipoMaximoRetencionNomina.toNumber()
  const umbralRetencionActualCentimos = eurosACentimos(
    umbralRetencionPerfilAuditoriaEuros({ anio, perfil })
  )
  const salarioSinObligacionEuros = centimosAEuros(salarioSinObligacionCentimos)
  const cuotaAnualUmbralCentimos =
    sinObligacion.irpfCuotaTrasDeduccionSmiCentimos ??
    sinObligacion.irpfFinalCentimos
  const limiteRetencionUmbralCentimos = eurosACentimos(
    Math.max(
      0,
      (salarioSinObligacionEuros -
        centimosAEuros(umbralRetencionActualCentimos)) *
        tipoMaximoRetencion
    )
  )
  const umbralRetencionCriticoCentimos = eurosACentimos(
    salarioSinObligacionEuros -
      centimosAEuros(cuotaAnualUmbralCentimos) / tipoMaximoRetencion
  )
  const irpfAntesUmbralCentimos =
    sinObligacion.irpfConObligacionDeclararCentimos ??
    sinObligacion.irpfFinalCentimos
  const irpfDespuesUmbralCentimos =
    conObligacion.irpfConObligacionDeclararCentimos ??
    conObligacion.irpfFinalCentimos
  const ajustarAGrafico = (centimosNominales: number) =>
    ajustarCentimosAAnioReferencia({
      centimosNominales,
      anioNominal: anio,
      anioReferencia,
    })

  return {
    anio,
    salarioGraficoUmbralCentimos: ajustarAGrafico(salarioSinObligacionCentimos),
    cuotaAnualUmbralCentimos: ajustarAGrafico(cuotaAnualUmbralCentimos),
    limiteRetencionUmbralCentimos: ajustarAGrafico(
      limiteRetencionUmbralCentimos
    ),
    irpfAntesUmbralCentimos: ajustarAGrafico(irpfAntesUmbralCentimos),
    irpfDespuesUmbralCentimos: ajustarAGrafico(irpfDespuesUmbralCentimos),
    saltoCentimos: ajustarAGrafico(
      irpfDespuesUmbralCentimos - irpfAntesUmbralCentimos
    ),
    tipoMaximoRetencionPorcentaje: formatearPuntosPorcentuales(
      especificacion.tipoMaximoRetencionNomina.mul(100).toString()
    ),
    umbralRetencionActualCentimos: ajustarAGrafico(
      umbralRetencionActualCentimos
    ),
    umbralRetencionCriticoCentimos: ajustarAGrafico(
      umbralRetencionCriticoCentimos
    ),
    haySalto: umbralRetencionActualCentimos > umbralRetencionCriticoCentimos,
  } satisfies CalculoSaltoDeclaracion
})

const formatoEurosEnteros = (euros: number): string =>
  formatearCentimosEnteros(eurosACentimos(euros))

const ipcAnualConocido = (anio: number): Decimal =>
  IPC_ANUAL_DICIEMBRE[anio] ?? new Decimal(0)

const factorIpcEntreAnios = (
  anioBase: AnioFiscal,
  anioReferencia: AnioFiscal
) => {
  if (anioBase === anioReferencia) return new Decimal(1)

  const inicio = Math.min(anioBase, anioReferencia) + 1
  const fin = Math.max(anioBase, anioReferencia)
  const factor = Array.from(
    { length: fin - inicio + 1 },
    (_, indice) => inicio + indice
  ).reduce(
    (acumulado, anio) =>
      acumulado.mul(new Decimal(1).plus(ipcAnualConocido(anio))),
    new Decimal(1)
  )

  return anioBase < anioReferencia ? factor : new Decimal(1).div(factor)
}

const ajustarCentimosAAnioReferencia = ({
  centimosNominales,
  anioNominal,
  anioReferencia,
}: {
  readonly centimosNominales: number
  readonly anioNominal: AnioFiscal
  readonly anioReferencia: AnioFiscal
}) =>
  new Decimal(centimosNominales)
    .mul(factorIpcEntreAnios(anioNominal, anioReferencia))
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber()

const umbralRetencionPerfilNominalCentimos = ({
  anio,
  perfil,
}: {
  readonly anio: AnioFiscal
  readonly perfil: PerfilAuditado
}) => eurosACentimos(umbralRetencionPerfilAuditoriaEuros({ anio, perfil }))

const umbralRetencionPerfil = ({
  anio,
  anioReferencia,
  perfil,
}: {
  readonly anio: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly perfil: PerfilAuditado
}) => {
  const nominalCentimos = umbralRetencionPerfilNominalCentimos({
    anio,
    perfil,
  })

  return {
    nominalCentimos,
    realCentimos: ajustarCentimosAAnioReferencia({
      centimosNominales: nominalCentimos,
      anioNominal: anio,
      anioReferencia,
    }),
  }
}

const redondearInferiorAPaso = (valor: number, paso: number) =>
  Number((Math.floor(valor / paso) * paso).toFixed(6))

const redondearSuperiorAPaso = (valor: number, paso: number) =>
  Number((Math.ceil(valor / paso) * paso).toFixed(6))

const dominioEurosDiferencia = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [-1000, 1000] as const

  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const paso = 1000
  const inferior = minimo < 0 ? redondearInferiorAPaso(minimo, paso) : 0
  const superior = maximo > 0 ? redondearSuperiorAPaso(maximo, paso) : 0

  if (inferior === 0 && superior === 0) {
    return [0, paso] as const
  }

  return [inferior, superior] as const
}

const dominioDiferenciaPorcentaje = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [-0.01, 0.01] as const

  const minimo = Math.min(...valores)
  const maximo = Math.max(...valores)
  const paso = 0.01

  const inferior = minimo < 0 ? redondearInferiorAPaso(minimo, paso) : 0
  const superior = maximo > 0 ? redondearSuperiorAPaso(maximo, paso) : 0
  if (inferior === 0 && superior === 0) {
    return [0, paso] as const
  }

  return [inferior, superior] as const
}

const dominioEurosCunaFiscal = (valores: ReadonlyArray<number>) => {
  if (valores.length === 0) return [0, 1000] as const

  const maximo = Math.max(...valores)
  const paso = 5000
  const superior = redondearSuperiorAPaso(maximo + paso, paso)

  return [0, Math.max(paso, superior)] as const
}

const ticksDominioLineal = ({
  dominio,
  paso,
}: {
  readonly dominio: readonly [number, number]
  readonly paso: number
}) => {
  const [inferior, superior] = dominio
  const inicio = Math.ceil(inferior / paso)
  const fin = Math.floor(superior / paso)

  return Array.from({ length: Math.max(0, fin - inicio + 1) }, (_, indice) =>
    Number(((inicio + indice) * paso).toFixed(6))
  )
}

const ticksGraficoCunaFiscal = ({
  dominio,
  modo,
}: {
  readonly dominio: readonly [number, number]
  readonly modo: ModoCunaFiscal
}) =>
  Match.value(modo).pipe(
    Match.when("porcentaje", () => ticksPorcentaje(dominio)),
    Match.when("euros-reales", () =>
      ticksDominioLineal({ dominio, paso: 5000 })
    ),
    Match.exhaustive
  )

const ticksDiferenciaTipoIrpf = ({
  dominio,
  modo,
}: {
  readonly dominio: readonly [number, number]
  readonly modo: ModoDiferenciaTipoIrpf
}) =>
  Match.value(modo).pipe(
    Match.when("porcentaje", () => ticksDominioLineal({ dominio, paso: 0.01 })),
    Match.when("euros-reales", () =>
      ticksDominioLineal({ dominio, paso: 1000 })
    ),
    Match.exhaustive
  )

const ordenarParAnios = (
  anios: readonly [AnioFiscal, AnioFiscal]
): readonly [AnioFiscal, AnioFiscal] => {
  const [primero, segundo] = anios
  return Match.value(primero <= segundo).pipe(
    Match.when(true, () => [primero, segundo] as const),
    Match.orElse(() => [segundo, primero] as const)
  )
}

const parAniosDiferenciaDisponible = ({
  anios,
  aniosDisponibles,
}: {
  readonly anios: readonly [AnioFiscal, AnioFiscal]
  readonly aniosDisponibles: ReadonlyArray<AnioFiscal>
}): readonly [AnioFiscal, AnioFiscal] => {
  const activosDisponibles = anios.filter((anio) =>
    aniosDisponibles.includes(anio)
  )
  if (activosDisponibles.length === 2) {
    return ordenarParAnios([
      activosDisponibles[0],
      activosDisponibles[1],
    ] as const)
  }

  return [2019, 2025]
}

const claseBotonPestana = cn(
  "min-w-0 px-3 py-2 text-center transition-colors",
  "focus-visible:ring-2 focus-visible:ring-[var(--rule)] focus-visible:outline-none focus-visible:ring-inset",
  "bg-[var(--paper)] text-[var(--ink)]",
  "not-data-[active]:hover:bg-[var(--mark)]",
  "data-[active]:bg-[var(--rule)] data-[active]:text-[var(--paper)]"
)

const claseTextoCortable =
  "min-w-0 max-w-full break-words [overflow-wrap:anywhere]"
const claseTarjetaParametroFormula =
  "grid h-full min-w-0 w-[calc(100%-3px)] justify-self-start grid-rows-[auto_auto_minmax(6rem,1fr)] gap-2 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 shadow-[3px_3px_0_0_var(--rule)] sm:w-auto sm:justify-self-stretch"
const claseFilaParametroFormula =
  "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3"
const claseEtiquetaParametroFormula = cn(
  "text-[var(--ink-soft)]",
  claseTextoCortable
)
const claseValorParametroFormula =
  "min-w-0 text-right font-[family-name:var(--mono)] font-bold tabular-nums"
const claseTextoParametroFormula = cn(
  "font-[family-name:var(--mono)] text-sm leading-5",
  claseTextoCortable
)

function BloqueFormula({
  children,
  tono = "neutro",
  compacto = false,
}: {
  readonly children: React.ReactNode
  readonly tono?: "neutro" | "calculo" | "limite" | "resultado"
  readonly compacto?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 max-w-full min-w-0 items-center border-2 border-[var(--rule)] px-2 py-1 text-left font-[family-name:var(--mono)] leading-5 font-bold [overflow-wrap:anywhere] break-words whitespace-normal tabular-nums",
        compacto ? "text-sm" : "text-sm sm:text-base",
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

function BloqueFormulaSm({
  children,
  tono = "neutro",
}: {
  readonly children: React.ReactNode
  readonly tono?: "neutro" | "calculo" | "limite" | "resultado"
}) {
  return (
    <BloqueFormula tono={tono} compacto>
      {children}
    </BloqueFormula>
  )
}

function FormulaLineal({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2 leading-none">
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
    <div className="min-w-0 pl-0">
      <dt
        className={cn(
          "font-[family-name:var(--mono)] text-base font-bold",
          claseTextoCortable
        )}
      >
        {termino}
      </dt>
      <dd
        className={cn(
          "mt-1 max-w-5xl text-base leading-7 text-[var(--ink-soft)]",
          claseTextoCortable
        )}
      >
        {children}
      </dd>
    </div>
  )
}

function CalculosSaltoDeclaracion({
  estado,
  anioReferencia,
}: {
  readonly estado: EstadoCalculosSaltoDeclaracion
  readonly anioReferencia: AnioFiscal
}) {
  return Match.value(estado).pipe(
    Match.when({ _tag: "cargando" }, () => (
      <p className="text-sm leading-6 text-[var(--ink-soft)]">
        Calculando el umbral crítico de retención...
      </p>
    )),
    Match.when({ _tag: "error" }, (estado) => (
      <p className="text-sm leading-6 text-[var(--danger)]">
        No se pudo calcular el umbral crítico: {estado.mensaje}
      </p>
    )),
    Match.when({ _tag: "lista" }, (estado) => (
      <div className="grid min-w-0 gap-3">
        <p
          className={cn(
            "max-w-4xl text-base leading-7 text-[var(--ink)]",
            claseTextoCortable
          )}
        >
          El punto crítico sale de igualar la cuota anual con el límite de
          retención en el salario donde aparece el umbral en el eje del gráfico.
          Las cifras ya están reexpresadas en euros de {anioReferencia}. Si el
          umbral real de retención queda por encima de ese punto crítico, la
          nómina retiene menos que la cuota anual y al declarar aparece el
          salto.
        </p>

        <div className="grid min-w-0 gap-3 lg:grid-cols-2">
          {estado.calculos.map((calculo) => (
            <div
              key={`salto-declaracion-${calculo.anio}`}
              className="grid min-w-0 gap-3 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 shadow-[3px_3px_0_0_var(--rule)]"
              style={{
                borderBottomColor: coloresTipoEfectivoIrpf[calculo.anio],
              }}
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="font-[family-name:var(--mono)] text-lg font-bold tabular-nums">
                  {calculo.anio}
                </span>
                <span
                  className="h-0 w-10 border-t-[5px]"
                  style={{ borderColor: coloresTipoEfectivoIrpf[calculo.anio] }}
                />
              </div>

              <div className="grid min-w-0 gap-2">
                <FormulaLineal>
                  <BloqueFormulaSm tono="resultado">IRPF_22K</BloqueFormulaSm>
                  <BloqueFormulaSm>= min(</BloqueFormulaSm>
                  <BloqueFormulaSm tono="calculo">
                    {formatearCentimosEnteros(calculo.cuotaAnualUmbralCentimos)}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>,</BloqueFormulaSm>
                  <BloqueFormulaSm tono="limite">
                    {formatearCentimosEnteros(
                      calculo.limiteRetencionUmbralCentimos
                    )}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>)</BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    {formatearCentimosEnteros(calculo.irpfAntesUmbralCentimos)}
                  </BloqueFormulaSm>
                </FormulaLineal>
                <FormulaLineal>
                  <BloqueFormulaSm tono="resultado">IRPF_22K+1</BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="calculo">CUOTA_ANUAL</BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    {formatearCentimosEnteros(
                      calculo.irpfDespuesUmbralCentimos
                    )}
                  </BloqueFormulaSm>
                </FormulaLineal>
                <FormulaLineal>
                  <BloqueFormulaSm tono="resultado">SALTO</BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="calculo">
                    {formatearCentimosEnteros(
                      calculo.irpfDespuesUmbralCentimos
                    )}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>-</BloqueFormulaSm>
                  <BloqueFormulaSm tono="limite">
                    {formatearCentimosEnteros(calculo.irpfAntesUmbralCentimos)}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    {formatearCentimosEnteros(calculo.saltoCentimos)}
                  </BloqueFormulaSm>
                </FormulaLineal>
              </div>

              <div className="grid min-w-0 gap-2 border-t-2 border-[var(--rule)] pt-3">
                <FormulaLineal>
                  <BloqueFormulaSm tono="resultado">
                    UMBRAL_CRITICO
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="calculo">
                    {formatearCentimosEnteros(
                      calculo.salarioGraficoUmbralCentimos
                    )}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>-</BloqueFormulaSm>
                  <BloqueFormulaSm tono="calculo">
                    {formatearCentimosEnteros(calculo.cuotaAnualUmbralCentimos)}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>/</BloqueFormulaSm>
                  <BloqueFormulaSm tono="limite">
                    {calculo.tipoMaximoRetencionPorcentaje}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm>=</BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    {formatearCentimosEnteros(
                      calculo.umbralRetencionCriticoCentimos
                    )}
                  </BloqueFormulaSm>
                </FormulaLineal>
                <FormulaLineal>
                  <BloqueFormulaSm tono="limite">UMBRAL_ACTUAL</BloqueFormulaSm>
                  <BloqueFormulaSm>
                    {calculo.haySalto ? ">" : "<="}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    UMBRAL_CRITICO
                  </BloqueFormulaSm>
                  <BloqueFormulaSm tono="limite">
                    {formatearCentimosEnteros(
                      calculo.umbralRetencionActualCentimos
                    )}
                  </BloqueFormulaSm>
                  <BloqueFormulaSm tono="resultado">
                    {calculo.haySalto ? "HAY SALTO" : "NO HAY SALTO"}
                  </BloqueFormulaSm>
                </FormulaLineal>
              </div>
            </div>
          ))}
        </div>
      </div>
    )),
    Match.exhaustive
  )
}

function FormulaTipoEfectivoIrpf({
  anios,
  anioReferencia,
  comunidadAutonoma,
  modo,
  perfil,
}: {
  readonly anios: ReadonlyArray<AnioFiscal>
  readonly anioReferencia: AnioFiscal
  readonly comunidadAutonoma: ComunidadAuditada
  readonly modo: ModoTipoEfectivoIrpf
  readonly perfil: PerfilAuditado
}) {
  const detallePerfil = detallePerfilAuditoriaNormativa(perfil)
  const claveAnios = anios.join(",")
  const claveCalculosSalto = [
    claveAnios,
    comunidadAutonoma,
    perfil,
    anioReferencia,
  ].join("|")
  const [estadoCalculosSalto, fijarEstadoCalculosSalto] =
    React.useState<EstadoCalculosSaltoDeclaracion>({
      _tag: "cargando",
      clave: "inicial",
    })
  const estadoCalculosSaltoVisible =
    estadoCalculosSalto.clave === claveCalculosSalto
      ? estadoCalculosSalto
      : ({ _tag: "cargando", clave: claveCalculosSalto } as const)

  React.useEffect(() => {
    const fibra = Effect.runFork(
      Effect.forEach(
        anios,
        (anio) =>
          construirCalculoSaltoDeclaracion({
            anio,
            anioReferencia,
            comunidadAutonoma,
            perfil,
          }),
        { concurrency: 1 }
      )
    )

    fibra.addObserver((exit) => {
      if (Exit.isSuccess(exit)) {
        fijarEstadoCalculosSalto({
          _tag: "lista",
          clave: claveCalculosSalto,
          calculos: exit.value,
        })
        return
      }

      if (Cause.hasInterruptsOnly(exit.cause)) return

      fijarEstadoCalculosSalto({
        _tag: "error",
        clave: claveCalculosSalto,
        mensaje: String(Cause.squash(exit.cause)),
      })
    })

    return () => {
      Effect.runFork(Fiber.interrupt(fibra))
    }
  }, [claveCalculosSalto, anioReferencia, comunidadAutonoma, perfil, anios])

  return (
    <section className="mt-5 grid min-w-0 gap-4 border-t-2 border-[var(--rule)] pt-5">
      <div className="grid min-w-0 gap-3">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Cálculo aplicado
        </p>
        {modo === "porcentaje" ? (
          <FormulaLineal>
            <BloqueFormula tono="resultado">TIPO_EFECTIVO_IRPF</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="resultado">IRPF_COMPARABLE_REAL</BloqueFormula>
            <BloqueFormula>/</BloqueFormula>
            <BloqueFormula tono="calculo">SALARIO_BRUTO_REAL</BloqueFormula>
          </FormulaLineal>
        ) : (
          <FormulaLineal>
            <BloqueFormula tono="resultado">IRPF_GRAFICO</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="resultado">IRPF_COMPARABLE_REAL</BloqueFormula>
          </FormulaLineal>
        )}
      </div>

      <div className="grid min-w-0 gap-3">
        <FormulaLineal>
          <BloqueFormula tono="resultado">
            IRPF_COMPARABLE_NOMINAL
          </BloqueFormula>
          <BloqueFormula>
            = si SALARIO_BRUTO_NOMINAL {">"} 22.000 EUR
          </BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">
            IRPF_COMPARABLE_NOMINAL
          </BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">
            max(0, CUOTA_LIQUIDADA - DEDUCCION_SMI)
          </BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">
            IRPF_COMPARABLE_NOMINAL
          </BloqueFormula>
          <BloqueFormula>= si no, IRPF_FINAL</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">IRPF_FINAL</BloqueFormula>
          <BloqueFormula>= min(</BloqueFormula>
          <BloqueFormula tono="calculo">
            max(0, CUOTA_LIQUIDADA - DEDUCCION_SMI)
          </BloqueFormula>
          <BloqueFormula>,</BloqueFormula>
          <BloqueFormula tono="limite">
            LIMITE_RETENCION_NOMINA_NOMINAL
          </BloqueFormula>
          <BloqueFormula>)</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="limite">
            LIMITE_RETENCION_NOMINA_NOMINAL
          </BloqueFormula>
          <BloqueFormula>= max(</BloqueFormula>
          <BloqueFormula>0</BloqueFormula>
          <BloqueFormula>,</BloqueFormula>
          <BloqueFormula tono="limite">
            (SALARIO_BRUTO_NOMINAL - UMBRAL_RETENCION_PERFIL_NOMINAL) x 43%
          </BloqueFormula>
          <BloqueFormula>)</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">IRPF_COMPARABLE_REAL</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">
            IRPF_COMPARABLE_NOMINAL ajustado por IPC a euros de {anioReferencia}
          </BloqueFormula>
        </FormulaLineal>
      </div>

      <dl className="grid min-w-0 gap-4">
        <ExplicacionVariable termino="PERFIL">
          PERFIL fija las circunstancias personales usadas para escoger el
          umbral del límite del 43% en nómina. Este caso parte de{" "}
          {detallePerfil.descripcionCalculo} En el{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/static_files/Sede/Procedimiento_ayuda/G603/mod145_es_es.pdf"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            modelo 145
          </a>
          , {etiquetaSituacionRetencion(detallePerfil.situacionRetencion)} es{" "}
          {descripcionSituacionRetencion[detallePerfil.situacionRetencion]}.{" "}
          {descripcionDescendientesPerfil(detallePerfil.descendientes)}, el
          umbral nominal de 2026 es{" "}
          {formatoEurosEnteros(detallePerfil.umbralRetencion2026Euros)}.
        </ExplicacionVariable>
        <ExplicacionVariable termino="CUOTA_LIQUIDADA">
          Resultado de aplicar las reglas anuales del IRPF antes del límite
          final usado por esta comparación histórica.
        </ExplicacionVariable>
        <ExplicacionVariable termino="IRPF_COMPARABLE_NOMINAL / REAL">
          Importe usado en las gráficas de IRPF y diferencia. Primero se calcula
          con importes nominales y normativa nominal de cada año; después se
          ajusta por IPC a euros de {anioReferencia} para que el selector pueda
          mostrarlo directamente en euros reales o dividirlo entre
          SALARIO_BRUTO_REAL como tipo efectivo. Hasta 22.000 € de rendimientos
          íntegros del trabajo con un pagador, si no hay obligación general de
          declarar, se usa el IRPF final de nómina: la menor cifra entre la
          cuota anual y el límite de retención. Al superar 22.000 €, se usa la
          cuota anual tras deducción.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SALTO EN 22.000 EUR">
          El umbral de 22.000 € no nace en 2024; ya está en el{" "}
          <a
            href="https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a96"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            artículo 96 de la Ley 35/2006
          </a>{" "}
          y en la página de la AEAT sobre{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c01-campana-declaracion-renta/quienes-estan-obligados-presentar-declaracion-irpf/delimitacion-obligacion-declarar-irpf.html"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            obligación de declarar
          </a>
          . El salto sólo se ve cuando, justo antes de ese umbral, la nómina ha
          retenido menos que la cuota anual. La cifra de 15.876 € no actúa por
          magia: hay que compararla con el umbral crítico calculado abajo. El{" "}
          <a
            href="https://www.boe.es/buscar/doc.php?id=BOE-A-2024-2249"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            Real Decreto 142/2024
          </a>{" "}
          elevó el mínimo sin retención hasta 15.876 € en la situación general;
          las tarjetas muestran si ese umbral queda por encima o por debajo del
          punto en el que empieza el salto. La gráfica de tipo marginal usa la
          cuota anual tras deducción SMI para no convertir una obligación formal
          de declarar en un marginal de la escala.
        </ExplicacionVariable>
        <CalculosSaltoDeclaracion
          estado={estadoCalculosSaltoVisible}
          anioReferencia={anioReferencia}
        />
        <ExplicacionVariable termino="RENDIMIENTOS_DEL_TRABAJO">
          Son los ingresos derivados del trabajo personal o de una relación
          laboral o estatutaria: por ejemplo sueldos, salarios, prestaciones por
          desempleo o pensiones. En esta auditoría equivalen al salario bruto
          anual del perfil.
        </ExplicacionVariable>
        <ExplicacionVariable termino="DEDUCCION_SMI">
          Deducción estatal por obtención de rendimientos del trabajo. Los
          umbrales escritos en la fórmula son nominales del año indicado; cuando
          se representan en el gráfico se proyectan sobre salario bruto real en
          euros de {anioReferencia}.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SALARIO_BRUTO_REAL">
          Salario bruto anual expresado en euros comparables de {anioReferencia}
          , ajustado a la inflación del año de referencia.
        </ExplicacionVariable>
        <ExplicacionVariable termino="UMBRAL_RETENCION_PERFIL_NOMINAL">
          Umbral legal que entra en el límite de nómina, expresado en euros
          nominales de cada año. En 2026 no es un único 15.876 €: depende de la
          situación familiar y del número de descendientes comunicados en el
          perfil.
        </ExplicacionVariable>
        <ExplicacionVariable termino="UMBRAL_RETENCION_PERFIL_REAL">
          Mismo umbral nominal reexpresado por IPC en euros de {anioReferencia}.
          Es el valor comparable con el eje salarial del gráfico.
        </ExplicacionVariable>
        <ExplicacionVariable termino="LIMITE_RETENCION_NOMINA">
          Tope de nómina: en esta comparativa el IRPF final no puede superar el
          43% de la parte del salario que queda por encima de
          UMBRAL_RETENCION_PERFIL_NOMINAL, porque la regla se aplica antes de
          ajustar el resultado por inflación. Ese porcentaje viene del
          procedimiento de retenciones de trabajo que publica la AEAT para
          calcular cuánto debe retener una nómina a cuenta del IRPF. La AEAT lo
          documenta en su página de{" "}
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

      <p
        className={cn(
          "max-w-4xl text-base leading-7 text-[var(--ink)]",
          claseTextoCortable
        )}
      >
        La fórmula es común; por año sólo se sustituyen sus parámetros
        normativos.
      </p>

      <div className="grid min-w-0 items-stretch gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {anios.map((anio) => {
          const parametros = parametrosFormulaTipoEfectivoIrpf(anio)
          const umbralRetencion = umbralRetencionPerfil({
            anio,
            anioReferencia,
            perfil,
          })
          return (
            <div
              key={`formula-irpf-${anio}`}
              className={claseTarjetaParametroFormula}
              style={{ borderBottomColor: coloresTipoEfectivoIrpf[anio] }}
            >
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="font-[family-name:var(--mono)] text-xl font-bold tabular-nums">
                  {anio}
                </span>
                <span
                  className="h-0 w-10 border-t-[5px]"
                  style={{ borderColor: coloresTipoEfectivoIrpf[anio] }}
                />
              </div>
              <dl className="grid min-w-0 gap-1 text-sm leading-5">
                <div className={claseFilaParametroFormula}>
                  <dt className={claseEtiquetaParametroFormula}>
                    <span className="block">
                      UMBRAL_RETENCION_PERFIL_NOMINAL
                    </span>
                    <span className="block">euros nominales {anio}</span>
                  </dt>
                  <dd className={claseValorParametroFormula}>
                    {formatearCentimosEnteros(umbralRetencion.nominalCentimos)}
                  </dd>
                </div>
                <div className={claseFilaParametroFormula}>
                  <dt className={claseEtiquetaParametroFormula}>
                    <span className="block">UMBRAL_RETENCION_PERFIL_REAL</span>
                    <span className="block">IPC, euros {anioReferencia}</span>
                  </dt>
                  <dd className={claseValorParametroFormula}>
                    {formatearCentimosEnteros(umbralRetencion.realCentimos)}
                  </dd>
                </div>
                <div className={claseFilaParametroFormula}>
                  <dt className={claseEtiquetaParametroFormula}>Tipo límite</dt>
                  <dd className={claseValorParametroFormula}>
                    {parametros.tipoMaximoRetencion}
                  </dd>
                </div>
              </dl>
              <div className="grid min-w-0 content-start gap-1">
                <p
                  className={cn(
                    "text-sm leading-5 text-[var(--ink-soft)]",
                    claseTextoCortable
                  )}
                >
                  DEDUCCION_SMI_NOMINAL
                </p>
                <p className={claseTextoParametroFormula}>
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

function FormulaTipoMarginalIrpf({
  anio,
  anioReferencia,
  perfil,
  pasoCentimos,
}: {
  readonly anio: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly perfil: PerfilAuditado
  readonly pasoCentimos: number
}) {
  const parametros = parametrosFormulaTipoEfectivoIrpf(anio)
  const detallePerfil = detallePerfilAuditoriaNormativa(perfil)
  const pasoCalculoCentimos = pasoCalculoTipoMarginalCentimos(pasoCentimos)
  const umbralRetencion = umbralRetencionPerfil({
    anio,
    anioReferencia,
    perfil,
  })

  return (
    <section className="mt-5 grid min-w-0 gap-4 border-t-2 border-[var(--rule)] pt-5">
      <div className="grid min-w-0 gap-3">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Cálculo aplicado
        </p>
        <FormulaLineal>
          <BloqueFormula tono="resultado">TIPO_MARGINAL_IRPF</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="resultado">DELTA_CUOTA_IRPF</BloqueFormula>
          <BloqueFormula>/</BloqueFormula>
          <BloqueFormula tono="calculo">DELTA_SALARIO_BRUTO</BloqueFormula>
        </FormulaLineal>
      </div>

      <div className="grid min-w-0 gap-3">
        <FormulaLineal>
          <BloqueFormula tono="resultado">DELTA_CUOTA_IRPF</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">
            CUOTA_TRAS_DEDUCCION_SMI(salario + paso)
          </BloqueFormula>
          <BloqueFormula>-</BloqueFormula>
          <BloqueFormula tono="calculo">
            CUOTA_TRAS_DEDUCCION_SMI(salario)
          </BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="calculo">CUOTA_TRAS_DEDUCCION_SMI</BloqueFormula>
          <BloqueFormula>= max(0,</BloqueFormula>
          <BloqueFormula tono="calculo">CUOTA_LIQUIDADA</BloqueFormula>
          <BloqueFormula>-</BloqueFormula>
          <BloqueFormula tono="calculo">DEDUCCION_SMI</BloqueFormula>
          <BloqueFormula>)</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">NO SE USA</BloqueFormula>
          <BloqueFormula tono="calculo">
            IRPF_FINAL = min(CUOTA_TRAS_DEDUCCION_SMI, LIMITE_RETENCION)
          </BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="calculo">DELTA_SALARIO_BRUTO</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">SALARIO_BRUTO(siguiente)</BloqueFormula>
          <BloqueFormula>-</BloqueFormula>
          <BloqueFormula tono="calculo">SALARIO_BRUTO(actual)</BloqueFormula>
        </FormulaLineal>
      </div>

      <dl className="grid min-w-0 gap-4">
        <ExplicacionVariable termino="TIPO_MARGINAL_IRPF">
          <div className="grid gap-2">
            <p>
              Porcentaje de cada euro bruto adicional que se transforma en más
              IRPF anual del salario siguiente.
            </p>
            <p>
              Por ejemplo: si al pasar de 20.000 EUR a 20.050 EUR la cuota sube
              25 EUR, el tipo marginal mostrado es 25 / 50 = 50%.
            </p>
          </div>
        </ExplicacionVariable>
        <ExplicacionVariable termino="CUOTA_TRAS_DEDUCCION_SMI">
          Se recalcula la cuota anual para dos salarios consecutivos después de
          escala, mínimo personal, reducción por rendimientos del trabajo y
          deducción SMI. No se usa el límite de retención de nómina ni el salto
          por obligación de declarar: esas reglas afectan al importe comparable
          en tipo efectivo y diferencias, pero convertirían un trámite o una
          regla de retención en un falso marginal de la escala del IRPF.
        </ExplicacionVariable>
        <ExplicacionVariable termino="PRECISION">
          La pendiente se calcula con la cuota anual precisa en euros decimales,
          antes de redondearla a céntimos. Si se dividiera una diferencia
          redondeada entre pasos de 1 EUR, un solo céntimo movería la barra un
          punto porcentual y aparecería un serrucho artificial dentro de una
          meseta estable.
        </ExplicacionVariable>
        <ExplicacionVariable termino="RESOLUCION">
          La gráfica mantiene puntos visibles cada{" "}
          {formatearCentimosEnteros(pasoCentimos)}, pero la pendiente marginal
          se calcula con paso interno de{" "}
          {formatearCentimosEnteros(pasoCalculoCentimos)}. Así se reduce el
          ruido de resolución sin cambiar la escala visual del eje salarial.
        </ExplicacionVariable>
        <ExplicacionVariable termino="JOROBA 18K-21K">
          La AEAT recoge la{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/7-cumplimentacion-irpf/7_1-rendimientos-trabajo-personal/7_1_6-reduccion-obtencion-rendimientos-trabajo.html"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            reducción por obtención de rendimientos del trabajo
          </a>
          : desde 2024 se reduce a medida que sube el rendimiento neto entre
          14.852 EUR, 17.673,52 EUR y 19.747,50 EUR. Además, en 2025 la AEAT
          incorporó una{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/8-cumplimentacion-irpf/8_7-cuota-liquida-cuota-resultante-autoliquidacion/8_7_3-cuota-resultante-autoliquidacion/8_7_3_2_deduccion-obtencion-rendimientos-trabajo.html"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            deducción por obtención de rendimientos del trabajo
          </a>{" "}
          para anular el gravamen hasta el SMI de 16.576 EUR y retirarlo hasta
          18.276 EUR. Al perderse esas ventajas euro a euro, la base y la cuota
          crecen más rápido que el salario y aparece el tramo alto que no se ve
          si el marginal se calcula con el IRPF limitado por retención.
        </ExplicacionVariable>
        <ExplicacionVariable termino="PERFIL">
          PERFIL fija las circunstancias personales usadas para escoger el
          umbral de retención. Este caso parte de{" "}
          {detallePerfil.descripcionCalculo} En el{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/static_files/Sede/Procedimiento_ayuda/G603/mod145_es_es.pdf"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            modelo 145
          </a>
          , {etiquetaSituacionRetencion(detallePerfil.situacionRetencion)} es{" "}
          {descripcionSituacionRetencion[detallePerfil.situacionRetencion]}.{" "}
          {descripcionDescendientesPerfil(detallePerfil.descendientes)}, el
          umbral nominal de 2026 es{" "}
          {formatoEurosEnteros(detallePerfil.umbralRetencion2026Euros)}.
        </ExplicacionVariable>
        <ExplicacionVariable termino="ESCALAS IRPF">
          Hacienda aplica tipos progresivos sobre la base liquidable general en
          la parte estatal y autonómica. La AEAT describe en su manual de Renta
          2025 que la base liquidable general se grava con{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/introduccion/general.html"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            escalas estatal y autonómica
          </a>{" "}
          y publica las{" "}
          <a
            href="https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico.html"
            className="font-bold underline decoration-[var(--rule)] underline-offset-4"
          >
            escalas autonómicas
          </a>{" "}
          que corresponden por comunidad. Esta gráfica no copia sólo la tabla
          legal: proyecta ese cálculo completo sobre salario bruto anual.
        </ExplicacionVariable>
      </dl>

      <div className="grid min-w-0 items-stretch gap-2 sm:grid-cols-2">
        <div
          className={claseTarjetaParametroFormula}
          style={{ borderBottomColor: colorTipoMarginalIrpf }}
        >
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="font-[family-name:var(--mono)] text-xl font-bold tabular-nums">
              {anio}
            </span>
            <span
              className="h-0 w-10 border-t-[5px]"
              style={{ borderColor: colorTipoMarginalIrpf }}
            />
          </div>
          <dl className="grid min-w-0 gap-1 text-sm leading-5">
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>Paso visible</dt>
              <dd className={claseValorParametroFormula}>
                {formatearCentimosEnteros(pasoCentimos)}
              </dd>
            </div>
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>Paso cálculo</dt>
              <dd className={claseValorParametroFormula}>
                {formatearCentimosEnteros(pasoCalculoCentimos)}
              </dd>
            </div>
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>
                <span className="block">UMBRAL_RETENCION_PERFIL_NOMINAL</span>
                <span className="block">euros nominales {anio}</span>
              </dt>
              <dd className={claseValorParametroFormula}>
                {formatearCentimosEnteros(umbralRetencion.nominalCentimos)}
              </dd>
            </div>
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>
                <span className="block">UMBRAL_RETENCION_PERFIL_REAL</span>
                <span className="block">IPC, euros {anioReferencia}</span>
              </dt>
              <dd className={claseValorParametroFormula}>
                {formatearCentimosEnteros(umbralRetencion.realCentimos)}
              </dd>
            </div>
          </dl>
          <div className="grid min-w-0 content-start gap-1">
            <p
              className={cn(
                "text-sm leading-5 text-[var(--ink-soft)]",
                claseTextoCortable
              )}
            >
              DEDUCCION_SMI_NOMINAL
            </p>
            <p className={claseTextoParametroFormula}>
              {parametros.deduccionSmi}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FormulaDiferenciaTipoEfectivoIrpf({
  anioReferencia,
  modo,
}: {
  readonly anioReferencia: AnioFiscal
  readonly modo: ModoDiferenciaTipoIrpf
}) {
  const etiquetaResultado =
    modo === "porcentaje"
      ? "DIFERENCIA_TIPO_EFECTIVO_IRPF"
      : "DIFERENCIA_IRPF_REAL"

  return (
    <section className="mt-5 grid min-w-0 gap-4 border-t-2 border-[var(--rule)] pt-5">
      <div className="grid min-w-0 gap-3">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Cálculo aplicado
        </p>
        <FormulaLineal>
          <BloqueFormula tono="resultado">TIPO_EFECTIVO_IRPF</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="resultado">IRPF_COMPARABLE_REAL</BloqueFormula>
          <BloqueFormula>/</BloqueFormula>
          <BloqueFormula tono="calculo">SALARIO_BRUTO_REAL</BloqueFormula>
        </FormulaLineal>
        <FormulaLineal>
          <BloqueFormula tono="resultado">{etiquetaResultado}</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">
            {modo === "porcentaje"
              ? "TIPO_EFECTIVO_IRPF"
              : "IRPF_COMPARABLE_REAL"}
            (año comparado)
          </BloqueFormula>
          <BloqueFormula>-</BloqueFormula>
          <BloqueFormula tono="calculo">
            {modo === "porcentaje"
              ? "TIPO_EFECTIVO_IRPF"
              : "IRPF_COMPARABLE_REAL"}
            (año base)
          </BloqueFormula>
        </FormulaLineal>
      </div>
      <dl className="grid min-w-0 gap-4">
        <ExplicacionVariable termino="IRPF_COMPARABLE_REAL">
          Es el IRPF comparable definido en TIPO EFECTIVO, expresado en euros de{" "}
          {anioReferencia}. Se calcula primero con importes nominales y
          normativa nominal de cada año, se aplica la regla de obligación de
          declarar cuando corresponde y después se ajusta por IPC.
        </ExplicacionVariable>
        <ExplicacionVariable termino="TIPO_EFECTIVO_IRPF">
          Es IRPF_COMPARABLE_REAL dividido entre SALARIO_BRUTO_REAL. La
          diferencia en porcentaje compara ese tipo efectivo entre los dos años
          seleccionados.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SALARIO_BRUTO_REAL">
          El eje X y el denominador del tipo efectivo están en euros de{" "}
          {anioReferencia}. Las reglas fiscales de cada año se calculan primero
          con importes nominales de ese año y sólo después se reexpresan por IPC
          para poder compararlas en la misma unidad.
        </ExplicacionVariable>
      </dl>
    </section>
  )
}

function FormulaCunaFiscal({
  anio,
  anioReferencia,
  modo,
}: {
  readonly anio: AnioFiscal
  readonly anioReferencia: AnioFiscal
  readonly modo: ModoCunaFiscal
}) {
  return (
    <section className="mt-5 grid min-w-0 gap-4 border-t-2 border-[var(--rule)] pt-5">
      <div className="grid min-w-0 gap-3">
        <p className="text-sm font-bold tracking-[0.24em] text-[var(--ink-soft)] uppercase">
          Cálculo aplicado
        </p>
        {modo === "porcentaje" ? (
          <FormulaLineal>
            <BloqueFormula tono="resultado">CUÑA_FISCAL</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="resultado">
              IRPF_COMPARABLE_REAL + SS_TRABAJADOR_REAL + SS_EMPRESA_REAL
            </BloqueFormula>
            <BloqueFormula>/</BloqueFormula>
            <BloqueFormula tono="calculo">COSTE_LABORAL_REAL</BloqueFormula>
          </FormulaLineal>
        ) : (
          <FormulaLineal>
            <BloqueFormula tono="resultado">CUÑA_FISCAL_EUROS</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="resultado">
              IRPF_COMPARABLE_REAL + SS_TRABAJADOR_REAL + SS_EMPRESA_REAL
            </BloqueFormula>
          </FormulaLineal>
        )}
        <FormulaLineal>
          <BloqueFormula tono="calculo">COSTE_LABORAL_REAL</BloqueFormula>
          <BloqueFormula>=</BloqueFormula>
          <BloqueFormula tono="calculo">SALARIO_BRUTO_REAL</BloqueFormula>
          <BloqueFormula>+</BloqueFormula>
          <BloqueFormula tono="calculo">SS_EMPRESA_REAL</BloqueFormula>
        </FormulaLineal>
        {modo === "porcentaje" ? (
          <FormulaLineal>
            <BloqueFormula tono="resultado">CUÑA_FISCAL</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="calculo">1 - </BloqueFormula>
            <BloqueFormula tono="resultado">SALARIO_NETO_REAL</BloqueFormula>
            <BloqueFormula>/</BloqueFormula>
            <BloqueFormula tono="calculo">COSTE_LABORAL_REAL</BloqueFormula>
          </FormulaLineal>
        ) : (
          <FormulaLineal>
            <BloqueFormula tono="resultado">CUÑA_FISCAL_EUROS</BloqueFormula>
            <BloqueFormula>=</BloqueFormula>
            <BloqueFormula tono="calculo">COSTE_LABORAL_REAL</BloqueFormula>
            <BloqueFormula>-</BloqueFormula>
            <BloqueFormula tono="resultado">SALARIO_NETO_REAL</BloqueFormula>
          </FormulaLineal>
        )}
      </div>

      <dl className="grid min-w-0 gap-4">
        <ExplicacionVariable termino="CUÑA_FISCAL">
          Es la parte del coste laboral total que no llega al salario neto:
          IRPF, cotizaciones sociales del trabajador y cotizaciones sociales de
          la empresa. Por eso el denominador no es el salario bruto, sino el
          coste laboral.
        </ExplicacionVariable>
        <ExplicacionVariable termino="IRPF_COMPARABLE_REAL">
          Usa el mismo IRPF comparable de TIPO EFECTIVO: normativa nominal de
          cada año, regla de obligación de declarar de 22.000 € cuando
          corresponde, y después ajuste por IPC a euros de {anioReferencia}.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SS_TRABAJADOR_REAL">
          Cotizaciones sociales a cargo del trabajador. Se descuentan del
          salario bruto antes de llegar al neto.
        </ExplicacionVariable>
        <ExplicacionVariable termino="SS_EMPRESA_REAL">
          Cotizaciones sociales a cargo de la empresa. No salen del salario
          bruto del trabajador, pero sí forman parte del coste laboral necesario
          para contratar ese salario.
        </ExplicacionVariable>
        <ExplicacionVariable termino="LECTURA">
          {modo === "porcentaje"
            ? "Las áreas se suman en puntos porcentuales de COSTE_LABORAL_REAL para un único año. No se normaliza la altura al 100%: la línea superior es la cuña fiscal total."
            : `Las áreas se suman en euros reales de ${anioReferencia} para un único año. La línea superior es el coste fiscal total: IRPF, cotizaciones del trabajador y cotizaciones de empresa.`}
        </ExplicacionVariable>
      </dl>

      <div className="grid min-w-0 items-stretch gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div
          className={claseTarjetaParametroFormula}
          style={{ borderBottomColor: coloresTipoEfectivoIrpf[anio] }}
        >
          <div className="flex min-w-0 items-center justify-between gap-3">
            <span className="font-[family-name:var(--mono)] text-xl font-bold tabular-nums">
              {anio}
            </span>
            <span
              className="h-0 w-10 border-t-[5px]"
              style={{ borderColor: coloresTipoEfectivoIrpf[anio] }}
            />
          </div>
          <dl className="grid min-w-0 gap-1 text-sm leading-5">
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>Unidad gráfica</dt>
              <dd className={claseValorParametroFormula}>
                {modo === "porcentaje" ? "% coste" : "€ reales"}
              </dd>
            </div>
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>Áreas apiladas</dt>
              <dd className={claseValorParametroFormula}>IRPF + SS</dd>
            </div>
            <div className={claseFilaParametroFormula}>
              <dt className={claseEtiquetaParametroFormula}>Línea superior</dt>
              <dd className={claseValorParametroFormula}>Total</dd>
            </div>
          </dl>
          <p className={claseTextoParametroFormula}>
            {modo === "porcentaje"
              ? `Total = suma de componentes divididos entre COSTE_LABORAL_REAL del año ${anio}.`
              : `Total = suma de componentes del año ${anio}, expresados en euros de ${anioReferencia}.`}
          </p>
        </div>
      </div>
    </section>
  )
}

function BotonAnioGraficoAuditoria({
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

function SelectorAniosGraficoAuditoria({
  anios,
  aniosDisponibles,
  aniosActivos,
  ariaLabel,
  alAlternar,
}: {
  readonly anios: ReadonlyArray<AnioFiscal>
  readonly aniosDisponibles: ReadonlyArray<AnioFiscal>
  readonly aniosActivos: ReadonlyArray<AnioFiscal>
  readonly ariaLabel: string
  readonly alAlternar: (anio: AnioFiscal) => void
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(4.75rem,1fr))] gap-px bg-[var(--rule)] md:col-span-2"
    >
      {anios.map((anio) => (
        <BotonAnioGraficoAuditoria
          key={anio}
          anio={anio}
          activo={aniosActivos.includes(anio)}
          disponible={aniosDisponibles.includes(anio)}
          alAlternar={alAlternar}
        />
      ))}
    </div>
  )
}

function SelectorComunidadAutonomaAuditoria({
  opciones,
  opcion,
  alCambiar,
}: {
  readonly opciones: ReadonlyArray<
    ReturnType<typeof describirComunidadAutonomaAuditoria>
  >
  readonly opcion: ReturnType<typeof describirComunidadAutonomaAuditoria>
  readonly alCambiar: (comunidadAutonoma: ComunidadAuditada) => void
}) {
  return (
    <Combobox
      items={opciones}
      value={opcion}
      itemToStringValue={(opcion) => opcion.valor}
      itemToStringLabel={(opcion) => opcion.etiqueta}
      isItemEqualToValue={(opcion, valor) => opcion.valor === valor.valor}
      onValueChange={(opcion) => {
        Option.fromNullishOr(opcion).pipe(
          Option.match({
            onNone: () => {},
            onSome: (opcion) => alCambiar(opcion.valor),
          })
        )
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
        <ComboboxEmpty>No hay comunidades con ese texto.</ComboboxEmpty>
        <ComboboxList>
          {(opcion) => (
            <ComboboxItem key={opcion.valor} value={opcion}>
              {opcion.etiqueta}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function TooltipDiferenciaTipoIrpf({
  claveDesfavorable,
  formatearValor,
  ...props
}: React.ComponentProps<typeof ChartTooltipContent> & {
  readonly claveDesfavorable: string
  readonly formatearValor: (valor: number) => string
}) {
  const payloadFiltrado = Option.fromNullishOr(props.payload).pipe(
    Option.map((items) =>
      items.filter((item) => {
        if (String(item.dataKey) !== claveDesfavorable) return true
        if (Number(item.value) !== 0) return true
        return false
      })
    )
  )
  const propsTooltip = Option.match(payloadFiltrado, {
    onNone: () => props,
    onSome: (payload) => ({ ...props, payload }),
  })

  return (
    <ChartTooltipContent
      {...propsTooltip}
      formatter={(valor, nombre, item) => (
        <span
          className="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
          style={{ color: item.color }}
        >
          {formatearValor(Number(valor))} ({nombre})
        </span>
      )}
    />
  )
}

function LeyendaGraficoAuditoria({
  items,
  className,
}: {
  readonly items: ReadonlyArray<ItemLeyendaGraficoAuditoria>
  readonly className?: string
}) {
  if (items.length === 0) return null

  return (
    <div
      className={cn(
        "recharts-legend-wrapper flex min-w-0 justify-center pt-1",
        className
      )}
    >
      <ul className="recharts-default-legend flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] leading-4 sm:gap-x-4 sm:text-sm sm:leading-5">
        {items.map((item) => (
          <li
            key={item.clave}
            className="recharts-legend-item inline-flex min-w-0 items-center gap-1.5 font-[family-name:var(--mono)] font-bold tabular-nums"
            style={{ color: item.color }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "shrink-0",
                item.tipo === "linea"
                  ? "h-0 w-4 border-t-2"
                  : "size-2.5 sm:size-3"
              )}
              style={
                item.tipo === "linea"
                  ? { borderColor: item.color }
                  : { backgroundColor: item.color }
              }
            />
            <span className="min-w-0">{item.etiqueta}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ContenidoGraficoCunaFiscal({
  datos,
  comunidadesAutonomas,
  anios,
  modo,
  dominioSalario,
  ticksSalario,
  dominioCunaFiscal,
  ticksCunaFiscal,
}: {
  readonly datos: ReadonlyArray<FilaCunaFiscal>
  readonly comunidadesAutonomas: ReadonlyArray<ComunidadAuditada>
  readonly anios: ReadonlyArray<AnioFiscal>
  readonly modo: ModoCunaFiscal
  readonly dominioSalario: readonly [number, number]
  readonly ticksSalario: ReadonlyArray<number>
  readonly dominioCunaFiscal: readonly [number, number]
  readonly ticksCunaFiscal: ReadonlyArray<number>
}) {
  return (
    <AreaChart
      accessibilityLayer
      data={datos}
      margin={{ left: 6, right: 18, top: 18, bottom: 28 }}
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
        domain={dominioCunaFiscal}
        ticks={ticksCunaFiscal}
        fontSize={14}
        tickFormatter={(valor: number) =>
          modo === "porcentaje"
            ? formatearTickPorcentaje(valor)
            : formatearSalarioCorto(eurosACentimos(valor))
        }
      />
      <ChartTooltip
        isAnimationActive={false}
        allowEscapeViewBox={{ x: false, y: false }}
        wrapperStyle={{ zIndex: 10, maxWidth: "min(25rem, 92vw)" }}
        cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
        content={
          <ChartTooltipContent
            className="max-w-[min(25rem,92vw)] border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[5px_5px_0_0_var(--rule)]"
            formatter={(valor, nombre, item) => (
              <span
                className="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                style={{ color: item.color }}
              >
                {modo === "porcentaje"
                  ? porcentaje.format(Number(valor))
                  : dinero.format(Number(valor))}{" "}
                ({nombre})
              </span>
            )}
            labelClassName="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
            labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
          />
        }
      />
      {comunidadesAutonomas.flatMap((comunidadAutonoma) =>
        anios.flatMap((anio) =>
          componentesApiladosCunaFiscal.map((componente) => {
            const clave = claveSerieCunaFiscal(
              comunidadAutonoma,
              anio,
              componente
            )

            return (
              <Area
                key={clave}
                dataKey={clave}
                name={etiquetaSerieCunaFiscal(
                  comunidadAutonoma,
                  anio,
                  componente
                )}
                type="linear"
                stackId={claveStackCunaFiscal(comunidadAutonoma, anio)}
                stroke={`var(--color-${clave})`}
                strokeWidth={1}
                fill={`var(--color-${clave})`}
                fillOpacity={0.72}
                legendType="rect"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            )
          })
        )
      )}
      {comunidadesAutonomas.flatMap((comunidadAutonoma) =>
        anios.map((anio) => {
          const clave = claveSerieCunaFiscal(comunidadAutonoma, anio, "total")

          return (
            <Line
              key={clave}
              dataKey={clave}
              name={etiquetaSerieCunaFiscal(comunidadAutonoma, anio, "total")}
              type="linear"
              stroke={`var(--color-${clave})`}
              strokeWidth={anio === 2026 ? 4 : 3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              legendType="plainline"
              isAnimationActive={false}
            />
          )
        })
      )}
    </AreaChart>
  )
}

function Visualizaciones({
  auditoria,
  estadoAuditoria,
  comunidadAutonoma,
  perfil,
  magnitudAuditada,
  alCambiarComunidadAutonoma,
  permiteReferenciaTecnica2026,
  vistaGrafico,
  alCambiarVistaGrafico,
  aniosGraficoIrpf,
  fijarAniosGraficoIrpf,
  modoTipoEfectivoIrpf,
  fijarModoTipoEfectivoIrpf,
  aniosGraficoDiferenciaTipoIrpf,
  fijarAniosGraficoDiferenciaTipoIrpf,
  anioGraficoCunaFiscal,
  fijarAnioGraficoCunaFiscal,
  modoCunaFiscal,
  fijarModoCunaFiscal,
  modoDiferenciaTipoIrpf,
  fijarModoDiferenciaTipoIrpf,
  anioGraficoTipoMarginalIrpf,
  fijarAnioGraficoTipoMarginalIrpf,
  ordenSeleccionDiferenciaTipoIrpfRef,
}: {
  readonly auditoria: Option.Option<AuditoriaRangoSalarial>
  readonly estadoAuditoria: EstadoAuditoria
  readonly comunidadAutonoma: ComunidadAuditada
  readonly perfil: PerfilAuditado
  readonly magnitudAuditada: MagnitudAuditadaAuditoria
  readonly alCambiarComunidadAutonoma: (
    comunidadAutonoma: ComunidadAuditada
  ) => void
  readonly permiteReferenciaTecnica2026: boolean
  readonly vistaGrafico: VistaGraficoAuditoria
  readonly alCambiarVistaGrafico: (vista: VistaGraficoAuditoria) => void
  readonly aniosGraficoIrpf: ReadonlyArray<AnioFiscal>
  readonly fijarAniosGraficoIrpf: (anios: ReadonlyArray<AnioFiscal>) => void
  readonly modoTipoEfectivoIrpf: ModoTipoEfectivoIrpf
  readonly fijarModoTipoEfectivoIrpf: (modo: ModoTipoEfectivoIrpf) => void
  readonly aniosGraficoDiferenciaTipoIrpf: readonly [AnioFiscal, AnioFiscal]
  readonly fijarAniosGraficoDiferenciaTipoIrpf: (
    anios: readonly [AnioFiscal, AnioFiscal]
  ) => void
  readonly anioGraficoCunaFiscal: AnioFiscal
  readonly fijarAnioGraficoCunaFiscal: (anio: AnioFiscal) => void
  readonly modoCunaFiscal: ModoCunaFiscal
  readonly fijarModoCunaFiscal: (modo: ModoCunaFiscal) => void
  readonly modoDiferenciaTipoIrpf: ModoDiferenciaTipoIrpf
  readonly fijarModoDiferenciaTipoIrpf: (modo: ModoDiferenciaTipoIrpf) => void
  readonly anioGraficoTipoMarginalIrpf: AnioFiscal
  readonly fijarAnioGraficoTipoMarginalIrpf: (anio: AnioFiscal) => void
  readonly ordenSeleccionDiferenciaTipoIrpfRef: React.RefObject<
    ReadonlyArray<AnioFiscal>
  >
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
  const aniosGraficoIrpfVisibles = React.useMemo(
    () =>
      aniosGraficoIrpf.filter((anio) => aniosTipoEfectivoIrpf.includes(anio)),
    [aniosGraficoIrpf, aniosTipoEfectivoIrpf]
  )
  const aniosDiferenciaTipoIrpfVisibles = React.useMemo(
    () =>
      parAniosDiferenciaDisponible({
        anios: aniosGraficoDiferenciaTipoIrpf,
        aniosDisponibles: aniosTipoEfectivoIrpf,
      }),
    [aniosGraficoDiferenciaTipoIrpf, aniosTipoEfectivoIrpf]
  )
  const anioGraficoTipoMarginalIrpfVisible = React.useMemo(
    () =>
      Match.value(
        aniosTipoEfectivoIrpf.includes(anioGraficoTipoMarginalIrpf)
      ).pipe(
        Match.when(true, () => anioGraficoTipoMarginalIrpf),
        Match.orElse(() => 2025 as AnioFiscal)
      ),
    [anioGraficoTipoMarginalIrpf, aniosTipoEfectivoIrpf]
  )
  const anioGraficoCunaFiscalVisible = React.useMemo(
    () =>
      Match.value(aniosTipoEfectivoIrpf.includes(anioGraficoCunaFiscal)).pipe(
        Match.when(true, () => anioGraficoCunaFiscal),
        Match.orElse(() => anioGraficoCunaFiscalPorDefecto)
      ),
    [anioGraficoCunaFiscal, aniosTipoEfectivoIrpf]
  )
  const anioReferenciaGraficosIrpf = Match.value(
    permiteReferenciaTecnica2026
  ).pipe(
    Match.when(true, () => 2026 as AnioFiscal),
    Match.orElse(() =>
      Option.match(auditoria, {
        onNone: () => 2025 as AnioFiscal,
        onSome: (auditoriaLista) => auditoriaLista.anioReferencia,
      })
    )
  )
  const claveAniosGraficoIrpfVisibles = aniosGraficoIrpfVisibles.join(",")
  const claveAnioGraficoCunaFiscal = String(anioGraficoCunaFiscalVisible)
  const claveAniosGraficoDiferenciaTipoIrpf =
    aniosDiferenciaTipoIrpfVisibles.join(",")
  const claveDatosGrafico = Option.match(auditoria, {
    onNone: () => "sin-auditoria",
    onSome: (auditoriaLista) => {
      const claveBase = [
        versionCalculoDatosGrafico(vistaGrafico),
        comunidadAutonoma,
        perfil,
        auditoriaLista.anioReferencia,
        auditoriaLista.salarioBrutoAnualMinimoCentimos,
        auditoriaLista.salarioBrutoAnualMaximoCentimos,
        auditoriaLista.pasoCentimos,
        anioReferenciaGraficosIrpf,
        vistaGrafico,
      ]

      return Match.value(vistaGrafico).pipe(
        Match.when("tipo-irpf", () =>
          [
            ...claveBase,
            claveAniosGraficoIrpfVisibles,
            modoTipoEfectivoIrpf,
          ].join("|")
        ),
        Match.when("diferencia-irpf", () =>
          [
            ...claveBase,
            magnitudAuditada,
            claveAniosGraficoDiferenciaTipoIrpf,
          ].join("|")
        ),
        Match.when("cuna-fiscal", () =>
          [...claveBase, claveAnioGraficoCunaFiscal, modoCunaFiscal].join("|")
        ),
        Match.when("tipo-marginal", () =>
          [...claveBase, anioGraficoTipoMarginalIrpfVisible].join("|")
        ),
        Match.exhaustive
      )
    },
  })
  const [estadoDatosGrafico, fijarEstadoDatosGrafico] =
    React.useState<EstadoDatosGrafico>({
      _tag: "cargando",
      clave: "sin-auditoria",
    })
  const [cacheDatosGrafico, fijarCacheDatosGrafico] = React.useState(
    () => new Map<string, DatosGraficoListos>()
  )
  const cacheSeriesAuditoria = React.useRef(
    new Map<string, ReadonlyArray<PuntoAuditoriaRangoSalarial>>()
  )
  const inicioCalculoDatosGrafico = React.useRef<Option.Option<number>>(
    Option.none()
  )
  const finCalculoDatosGrafico = React.useRef<Option.Option<number>>(
    Option.none()
  )
  const graficoTipoEfectivoIrpfRef = React.useRef<HTMLDivElement | null>(null)
  const graficoDiferenciaTipoIrpfRef = React.useRef<HTMLDivElement | null>(null)
  const graficoCunaFiscalRef = React.useRef<HTMLDivElement | null>(null)
  const graficoTipoMarginalIrpfRef = React.useRef<HTMLDivElement | null>(null)
  const graficoTipoEfectivoIrpfExportacionRef =
    React.useRef<HTMLDivElement | null>(null)
  const graficoDiferenciaTipoIrpfExportacionRef =
    React.useRef<HTMLDivElement | null>(null)
  const graficoCunaFiscalExportacionRef = React.useRef<HTMLDivElement | null>(
    null
  )
  const graficoTipoMarginalIrpfExportacionRef =
    React.useRef<HTMLDivElement | null>(null)

  React.useEffect(
    () =>
      Option.match(auditoria, {
        onNone: () => {},
        onSome: (auditoriaLista) => {
          const datosCacheados = Option.fromNullishOr(
            cacheDatosGrafico.get(claveDatosGrafico)
          )
          if (Option.isSome(datosCacheados)) {
            registrarMarcaAuditoria("react.graficos.datos.cache", {
              claveDatosGrafico,
              filasTipoEfectivoIrpf:
                datosCacheados.value.tipoEfectivoIrpf.length,
              filasDiferenciaTipoIrpf:
                datosCacheados.value.diferenciaTipoIrpf.length,
              filasCunaFiscal: datosCacheados.value.cunaFiscal.length,
              filasTipoMarginalIrpf:
                datosCacheados.value.tipoMarginalIrpf.length,
            })
            return
          }

          const aniosIrpf = aniosDesdeClaveGrafico(
            claveAniosGraficoIrpfVisibles
          )
          const aniosDiferencia = aniosDiferenciaTipoIrpfVisibles
          const comunidades = [comunidadAutonoma] as const
          const inicio = tiempoAuditoriaMs()
          inicioCalculoDatosGrafico.current = Option.some(inicio)
          finCalculoDatosGrafico.current = Option.none()
          registrarMarcaAuditoria("react.graficos.datos.inicio", {
            claveDatosGrafico,
            comunidadAutonoma,
            aniosIrpf: aniosIrpf.join(","),
            modoTipoEfectivoIrpf,
            aniosDiferenciaTipoIrpf: aniosDiferencia.join(","),
            anioCunaFiscal: anioGraficoCunaFiscalVisible,
            modoCunaFiscal,
            anioTipoMarginalIrpf: anioGraficoTipoMarginalIrpfVisible,
            anioReferenciaGraficosIrpf,
            puntosBase: auditoriaLista.puntos.length,
            vistaGrafico,
            pasoCentimos: auditoriaLista.pasoCentimos,
            modoPaso: describirModoPasoPreciso(auditoriaLista.pasoCentimos),
          })

          const fibra = Effect.runFork(
            construirFilasGraficosAuditoria({
              auditoria: auditoriaLista,
              comunidadAutonomaAuditoriaBase: comunidadAutonoma,
              comunidadesAutonomas: comunidades,
              perfil,
              aniosIrpf,
              modoTipoEfectivoIrpf,
              aniosDiferenciaTipoIrpf: aniosDiferencia,
              anioCunaFiscal: anioGraficoCunaFiscalVisible,
              modoCunaFiscal,
              magnitudAuditada,
              anioTipoMarginalIrpf: anioGraficoTipoMarginalIrpfVisible,
              anioReferenciaGraficosIrpf,
              cacheSeries: cacheSeriesAuditoria.current,
              vistaGrafico,
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
                filasDiferenciaTipoIrpf: exit.value.diferenciaTipoIrpf.length,
                filasCunaFiscal: exit.value.cunaFiscal.length,
                filasTipoMarginalIrpf: exit.value.tipoMarginalIrpf.length,
                anioReferenciaGraficosIrpf,
              })
              const estadoListo = {
                _tag: "lista",
                clave: claveDatosGrafico,
                tipoEfectivoIrpf: exit.value.tipoEfectivoIrpf,
                diferenciaTipoIrpf: exit.value.diferenciaTipoIrpf,
                cunaFiscal: exit.value.cunaFiscal,
                tipoMarginalIrpf: exit.value.tipoMarginalIrpf,
              } satisfies DatosGraficoListos
              fijarCacheDatosGrafico((cacheActual) =>
                new Map(cacheActual).set(claveDatosGrafico, estadoListo)
              )
              fijarEstadoDatosGrafico(estadoListo)
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
      }),
    [
      claveAniosGraficoIrpfVisibles,
      anioGraficoCunaFiscalVisible,
      claveAniosGraficoDiferenciaTipoIrpf,
      claveDatosGrafico,
      cacheDatosGrafico,
      comunidadAutonoma,
      perfil,
      magnitudAuditada,
      auditoria,
      aniosDiferenciaTipoIrpfVisibles,
      anioGraficoTipoMarginalIrpfVisible,
      anioReferenciaGraficosIrpf,
      modoCunaFiscal,
      modoTipoEfectivoIrpf,
      vistaGrafico,
    ]
  )

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
        Match.when(true, () =>
          Match.value(estadoDatosGrafico).pipe(
            Match.when({ _tag: "cargando" }, () =>
              Option.fromNullishOr(
                cacheDatosGrafico.get(claveDatosGrafico)
              ).pipe(
                Option.getOrElse(
                  () =>
                    ({
                      _tag: "cargando",
                      clave: claveDatosGrafico,
                    }) satisfies EstadoDatosGrafico
                )
              )
            ),
            Match.orElse(() => estadoDatosGrafico)
          )
        ),
        Match.orElse(() =>
          Option.fromNullishOr(cacheDatosGrafico.get(claveDatosGrafico)).pipe(
            Option.getOrElse(
              () =>
                ({
                  _tag: "cargando",
                  clave: claveDatosGrafico,
                }) satisfies EstadoDatosGrafico
            )
          )
        )
      ),
  })
  const datosTipoEfectivoIrpf = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.tipoEfectivoIrpf),
    Match.orElse(() => [])
  )
  const datosDiferenciaTipoIrpf = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.diferenciaTipoIrpf),
    Match.orElse(() => [])
  )
  const datosCunaFiscal = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.cunaFiscal),
    Match.orElse(() => [])
  )
  const datosTipoMarginalIrpf = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "lista" }, (estado) => estado.tipoMarginalIrpf),
    Match.orElse(() => [])
  )
  const graficoCargando = estadoDatosGraficoActual._tag === "cargando"
  const errorGrafico = Match.value(estadoDatosGraficoActual).pipe(
    Match.when({ _tag: "error" }, (estado) => Option.some(estado.mensaje)),
    Match.orElse(() => Option.none<string>())
  )
  const copiaGraficoDeshabilitada =
    graficoCargando || Option.isSome(errorGrafico) || Option.isNone(auditoria)

  React.useLayoutEffect(() => {
    if (estadoDatosGraficoActual._tag !== "lista") return

    const finDatos = finCalculoDatosGrafico.current
    registrarMarcaAuditoria("react.graficos.commit", {
      claveDatosGrafico: estadoDatosGraficoActual.clave,
      msDesdeDatosListos: Option.map(finDatos, (fin) =>
        Math.round(tiempoAuditoriaMs() - fin)
      ),
      filasTipoEfectivoIrpf: estadoDatosGraficoActual.tipoEfectivoIrpf.length,
      filasDiferenciaTipoIrpf:
        estadoDatosGraficoActual.diferenciaTipoIrpf.length,
      filasCunaFiscal: estadoDatosGraficoActual.cunaFiscal.length,
      filasTipoMarginalIrpf: estadoDatosGraficoActual.tipoMarginalIrpf.length,
    })
  }, [estadoDatosGraficoActual])

  const clavesTipoEfectivoIrpf = comunidadesAutonomas.flatMap(
    (comunidadAutonoma) =>
      aniosGraficoIrpfVisibles.map((anio) =>
        claveSerieTipoEfectivoIrpf(comunidadAutonoma, anio)
      )
  )
  const clavesCunaFiscalTotal = comunidadesAutonomas.flatMap(
    (comunidadAutonoma) =>
      [anioGraficoCunaFiscalVisible].map((anio) =>
        claveSerieCunaFiscal(comunidadAutonoma, anio, "total")
      )
  )
  const claveDiferenciaTipoIrpfActiva = Match.value(
    modoDiferenciaTipoIrpf
  ).pipe(
    Match.when("porcentaje", () => claveDiferenciaTipoIrpfPorcentaje),
    Match.when("euros-reales", () => claveDiferenciaTipoIrpfEurosReales),
    Match.exhaustive
  )
  const clavesDiferenciaTipoIrpfSegmentadas = Match.value(
    modoDiferenciaTipoIrpf
  ).pipe(
    Match.when(
      "porcentaje",
      () =>
        [
          claveDiferenciaTipoIrpfPorcentajeFavorable,
          claveDiferenciaTipoIrpfPorcentajeDesfavorable,
        ] as const
    ),
    Match.when(
      "euros-reales",
      () =>
        [
          claveDiferenciaTipoIrpfEurosRealesFavorable,
          claveDiferenciaTipoIrpfEurosRealesDesfavorable,
        ] as const
    ),
    Match.exhaustive
  )
  const configTipoEfectivoIrpf = configuracionTipoEfectivoIrpf({
    comunidadesAutonomas,
    anios: aniosGraficoIrpfVisibles,
  })
  const configDiferenciaTipoIrpf = configuracionDiferenciaTipoIrpf({
    comunidadAutonoma,
    anios: aniosDiferenciaTipoIrpfVisibles,
  })
  const configCunaFiscal = configuracionCunaFiscal({
    comunidadesAutonomas,
    anios: [anioGraficoCunaFiscalVisible],
  })
  const configTipoMarginalIrpf = configuracionTipoMarginalIrpf({
    comunidadAutonoma,
    anio: anioGraficoTipoMarginalIrpfVisible,
  })
  const valoresTipoEfectivoIrpf = valoresNumericosDeFilas(
    datosTipoEfectivoIrpf,
    clavesTipoEfectivoIrpf
  )
  const dominioTipoEfectivoIrpf = Match.value(modoTipoEfectivoIrpf).pipe(
    Match.when("porcentaje", () => dominioPorcentaje(valoresTipoEfectivoIrpf)),
    Match.when("euros-reales", () =>
      dominioEurosCunaFiscal(valoresTipoEfectivoIrpf)
    ),
    Match.exhaustive
  )
  const ticksTipoEfectivoIrpf = Match.value(modoTipoEfectivoIrpf).pipe(
    Match.when("porcentaje", () => ticksPorcentaje(dominioTipoEfectivoIrpf)),
    Match.when("euros-reales", () =>
      ticksDominioLineal({ dominio: dominioTipoEfectivoIrpf, paso: 5000 })
    ),
    Match.exhaustive
  )
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
  const pasoAuditoriaVisibleCentimos = Option.match(auditoria, {
    onNone: () => configuracionRangoAuditoria.pasoCentimos,
    onSome: (auditoriaLista) => auditoriaLista.pasoCentimos,
  })
  const ticksSalario = ticksSalarioEuros({
    minimoEuros: centimosAEuros(rangoSalarioCentimos.minimo),
    maximoEuros: centimosAEuros(rangoSalarioCentimos.maximo),
  })
  const dominioSalario = [
    centimosAEuros(rangoSalarioCentimos.minimo),
    centimosAEuros(rangoSalarioCentimos.maximo),
  ] as const
  const valoresDiferenciaTipoIrpf = valoresNumericosDeFilas(
    datosDiferenciaTipoIrpf,
    [claveDiferenciaTipoIrpfActiva]
  )
  const dominioDiferenciaTipoIrpf = Match.value(modoDiferenciaTipoIrpf).pipe(
    Match.when("porcentaje", () =>
      dominioDiferenciaPorcentaje(valoresDiferenciaTipoIrpf)
    ),
    Match.when("euros-reales", () =>
      dominioEurosDiferencia(valoresDiferenciaTipoIrpf)
    ),
    Match.exhaustive
  )
  const ticksDiferenciaIrpf = ticksDiferenciaTipoIrpf({
    dominio: dominioDiferenciaTipoIrpf,
    modo: modoDiferenciaTipoIrpf,
  })
  const valoresCunaFiscalTotal = valoresNumericosDeFilas(
    datosCunaFiscal,
    clavesCunaFiscalTotal
  )
  const dominioCunaFiscal = Match.value(modoCunaFiscal).pipe(
    Match.when("porcentaje", () => dominioPorcentaje(valoresCunaFiscalTotal)),
    Match.when("euros-reales", () =>
      dominioEurosCunaFiscal(valoresCunaFiscalTotal)
    ),
    Match.exhaustive
  )
  const ticksCunaFiscal = ticksGraficoCunaFiscal({
    dominio: dominioCunaFiscal,
    modo: modoCunaFiscal,
  })
  const dominioMarginalIrpf = dominioPorcentajeTipoMarginalIrpf(
    valoresNumericosDeFilas(datosTipoMarginalIrpf, [claveTipoMarginalIrpf])
  )
  const ticksMarginalIrpf = ticksPorcentajeTipoMarginalIrpf(dominioMarginalIrpf)
  const dominioEfectivoEnGraficoMarginal = dominioPorcentaje(
    valoresNumericosDeFilas(datosTipoMarginalIrpf, [
      claveTipoEfectivoIrpfMarginal,
    ])
  )
  const dominioEfectivoAlineadoEnGraficoMarginal =
    alinearDominioSecundarioPorCero({
      dominioPrincipal: dominioMarginalIrpf,
      dominioSecundario: dominioEfectivoEnGraficoMarginal,
    })
  const ticksEfectivoEnGraficoMarginal = ticksPorcentaje(
    dominioEfectivoEnGraficoMarginal
  )
  const formatearValorDiferenciaTipoIrpf = (valor: number) =>
    Match.value(modoDiferenciaTipoIrpf).pipe(
      Match.when("porcentaje", () => porcentaje.format(valor)),
      Match.when("euros-reales", () => dinero.format(valor)),
      Match.exhaustive
    )
  const formatearValorTipoEfectivoIrpf = (valor: number) =>
    Match.value(modoTipoEfectivoIrpf).pipe(
      Match.when("porcentaje", () => porcentaje.format(valor)),
      Match.when("euros-reales", () => dinero.format(valor)),
      Match.exhaustive
    )
  const formatearTickTipoEfectivoIrpf = (valor: number) =>
    Match.value(modoTipoEfectivoIrpf).pipe(
      Match.when("porcentaje", () => formatearTickPorcentaje(valor)),
      Match.when("euros-reales", () =>
        formatearSalarioCorto(eurosACentimos(valor))
      ),
      Match.exhaustive
    )
  const formatearTickDiferenciaTipoIrpf = (valor: number) =>
    Match.value(modoDiferenciaTipoIrpf).pipe(
      Match.when("porcentaje", () => formatearTickPorcentaje(valor)),
      Match.when("euros-reales", () =>
        Match.value(Math.abs(valor) >= 1000).pipe(
          Match.when(true, () => `${Math.round(valor / 1000)}k`),
          Match.orElse(() => String(valor))
        )
      ),
      Match.exhaustive
    )
  const [anioDiferenciaBase, anioDiferenciaComparado] =
    aniosDiferenciaTipoIrpfVisibles
  const etiquetaDiferenciaTipoIrpf = Match.value(modoDiferenciaTipoIrpf).pipe(
    Match.when(
      "porcentaje",
      () =>
        `DIFERENCIA EN TIPO EFECTIVO DE IRPF ENTRE ${anioDiferenciaBase} Y ${anioDiferenciaComparado}`
    ),
    Match.when(
      "euros-reales",
      () =>
        `DIFERENCIA DE IRPF EN EUROS REALES ENTRE ${anioDiferenciaBase} Y ${anioDiferenciaComparado}`
    ),
    Match.exhaustive
  )
  const alternarAnioIrpf = (anio: AnioFiscal) => {
    const siguiente = aniosGraficoIrpf.includes(anio)
      ? aniosGraficoIrpf.filter((anioSeleccionado) => anioSeleccionado !== anio)
      : [...aniosGraficoIrpf, anio].sort((a, b) => a - b)
    fijarAniosGraficoIrpf(siguiente.length > 0 ? siguiente : [anio])
  }
  const alternarAnioDiferenciaTipoIrpf = (anio: AnioFiscal) => {
    if (aniosDiferenciaTipoIrpfVisibles.includes(anio)) return

    const ordenActivo = ordenSeleccionDiferenciaTipoIrpfRef.current.filter(
      (anioSeleccionado) =>
        aniosDiferenciaTipoIrpfVisibles.includes(anioSeleccionado)
    )
    const ordenNormalizado = Match.value(ordenActivo.length).pipe(
      Match.when(2, () => ordenActivo),
      Match.orElse(() => aniosDiferenciaTipoIrpfVisibles)
    )
    const siguiente = [ordenNormalizado[1], anio] as const
    ordenSeleccionDiferenciaTipoIrpfRef.current = siguiente
    fijarAniosGraficoDiferenciaTipoIrpf(siguiente)
  }
  const alternarAnioCunaFiscal = (anio: AnioFiscal) => {
    if (anio === anioGraficoCunaFiscalVisible) return

    fijarAnioGraficoCunaFiscal(anio)
  }
  const alternarAnioTipoMarginalIrpf = (anio: AnioFiscal) => {
    if (anio === anioGraficoTipoMarginalIrpfVisible) return

    fijarAnioGraficoTipoMarginalIrpf(anio)
  }
  const tituloGraficoTipoEfectivoIrpf = Match.value(modoTipoEfectivoIrpf).pipe(
    Match.when(
      "porcentaje",
      () =>
        `TIPO EFECTIVO DEL IRPF POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN, EN EUROS DE ${anioReferenciaGraficosIrpf}`
    ),
    Match.when(
      "euros-reales",
      () =>
        `IRPF POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN, EN EUROS DE ${anioReferenciaGraficosIrpf}`
    ),
    Match.exhaustive
  )
  const tituloGraficoDiferenciaTipoIrpf = `${etiquetaDiferenciaTipoIrpf} POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN, EN EUROS DE ${anioReferenciaGraficosIrpf}`
  const tituloGraficoCunaFiscal = Match.value(modoCunaFiscal).pipe(
    Match.when(
      "porcentaje",
      () =>
        `CUÑA FISCAL POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN, EN % DEL COSTE LABORAL`
    ),
    Match.when(
      "euros-reales",
      () =>
        `CUÑA FISCAL POR SALARIO BRUTO AJUSTADO A LA INFLACIÓN, EN EUROS DE ${anioReferenciaGraficosIrpf}`
    ),
    Match.exhaustive
  )
  const tituloGraficoTipoMarginalIrpf = `TIPO MARGINAL DE IRPF SOBRE EL SALARIO BRUTO, EN EUROS DE ${anioReferenciaGraficosIrpf}`
  const panelGraficoActivo = panelGraficoDesdeVista(vistaGrafico)
  const vistaTipoEfectivoIrpfActiva = Match.value(vistaGrafico).pipe(
    Match.when("diferencia-irpf", () => "diferencia-irpf" as const),
    Match.orElse(() => "tipo-irpf" as const)
  ) satisfies VistaTipoEfectivoIrpfAuditoria
  const tituloGraficoTipoEfectivoActivo = Match.value(
    vistaTipoEfectivoIrpfActiva
  ).pipe(
    Match.when("tipo-irpf", () => tituloGraficoTipoEfectivoIrpf),
    Match.when("diferencia-irpf", () => tituloGraficoDiferenciaTipoIrpf),
    Match.exhaustive
  )
  const modoTipoEfectivoIrpfActivo = Match.value(vistaGrafico).pipe(
    Match.withReturnType<ModoUnidadGraficoAuditoria>(),
    Match.when("tipo-irpf", () => modoTipoEfectivoIrpf),
    Match.when("diferencia-irpf", () => modoDiferenciaTipoIrpf),
    Match.orElse(() => modoTipoEfectivoGraficoAuditoriaPorDefecto)
  )
  const cambiarModoTipoEfectivoIrpfActivo = (
    modo: ModoUnidadGraficoAuditoria
  ) => {
    if (vistaTipoEfectivoIrpfActiva === "tipo-irpf") {
      fijarModoTipoEfectivoIrpf(modo)
      return
    }

    fijarModoDiferenciaTipoIrpf(modo)
  }
  const graficoTipoEfectivoActivoRef = Match.value(
    vistaTipoEfectivoIrpfActiva
  ).pipe(
    Match.when("tipo-irpf", () => graficoTipoEfectivoIrpfRef),
    Match.when("diferencia-irpf", () => graficoDiferenciaTipoIrpfRef),
    Match.exhaustive
  )
  const graficoTipoEfectivoActivoExportacionRef = Match.value(
    vistaTipoEfectivoIrpfActiva
  ).pipe(
    Match.when("tipo-irpf", () => graficoTipoEfectivoIrpfExportacionRef),
    Match.when(
      "diferencia-irpf",
      () => graficoDiferenciaTipoIrpfExportacionRef
    ),
    Match.exhaustive
  )
  const claseMarcoGrafico = "mt-4 grid min-w-0 w-full gap-2 sm:gap-3"
  const claseTextoGraficoCompacto =
    "text-[11px] sm:text-sm [&_.recharts-cartesian-axis-tick_text]:text-[11px] sm:[&_.recharts-cartesian-axis-tick_text]:text-sm"
  const claseLienzoGraficoTipoEfectivoIrpf = cn(
    "aspect-[5/4] w-full min-w-0 sm:aspect-[16/9] sm:h-[clamp(28rem,56vw,40rem)]",
    claseTextoGraficoCompacto
  )
  const claseLienzoGraficoDiferenciaTipoIrpf = cn(
    "aspect-[5/4] w-full min-w-0 sm:aspect-[16/9] sm:h-[clamp(22rem,48vw,32rem)]",
    claseTextoGraficoCompacto
  )
  const claseLienzoGraficoCunaFiscal = cn(
    "aspect-[5/4] w-full min-w-0 sm:aspect-[16/9] sm:h-[clamp(28rem,56vw,40rem)]",
    claseTextoGraficoCompacto
  )
  const claseLienzoGraficoTipoMarginalIrpf = cn(
    "aspect-[5/4] w-full min-w-0 sm:aspect-[16/9] sm:h-[clamp(28rem,56vw,40rem)]",
    claseTextoGraficoCompacto
  )
  const claseGraficoTipoEfectivoIrpf = cn(
    "mt-4",
    claseLienzoGraficoTipoEfectivoIrpf
  )
  const claseGraficoDiferenciaTipoIrpf = cn(
    "mt-4",
    claseLienzoGraficoDiferenciaTipoIrpf
  )
  const claseGraficoCunaFiscal = cn("mt-4", claseLienzoGraficoCunaFiscal)
  const claseGraficoTipoMarginalIrpf = cn(
    "mt-4",
    claseLienzoGraficoTipoMarginalIrpf
  )
  const estiloLienzoGraficoExportacion = {
    width: DIMENSIONES_ESCRITORIO_EXPORTACION_GRAFICO.ancho,
    height: DIMENSIONES_ESCRITORIO_EXPORTACION_GRAFICO.alto,
  } satisfies React.CSSProperties
  const estiloMarcoGraficoExportacion = {
    width: DIMENSIONES_ESCRITORIO_EXPORTACION_GRAFICO.ancho,
  } satisfies React.CSSProperties
  const claseMarcoGraficoExportacion = "grid min-w-0 gap-3"
  const claseGraficoExportacion = "aspect-auto min-w-0 text-sm"

  return (
    <section className="py-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-wider uppercase">
          EXPLORACIÓN POR RANGO SALARIAL
        </h2>
      </div>
      <Tabs.Root
        value={panelGraficoActivo}
        onValueChange={(valor) => {
          Option.fromNullishOr(valor).pipe(
            Option.flatMap(decodificarPanelGraficoAuditoria),
            Option.match({
              onNone: () => {},
              onSome: (panel) =>
                alCambiarVistaGrafico(vistaGraficoDesdePanel(panel)),
            })
          )
        }}
        className="mt-5 grid min-w-0 gap-4"
      >
        <Tabs.List className="grid w-full min-w-0 divide-y-2 divide-[var(--rule)] justify-self-start border-2 border-[var(--rule)] text-sm tracking-[0.22em] uppercase sm:inline-flex sm:w-fit sm:divide-x-2 sm:divide-y-0">
          {panelesGraficoAuditoria.map((panel) => (
            <Tabs.Tab key={panel} value={panel} className={claseBotonPestana}>
              {Match.value(panel).pipe(
                Match.when("tipo-efectivo", () => "TIPO EFECTIVO"),
                Match.when("cuna-fiscal", () => "CUÑA FISCAL"),
                Match.when("tipo-marginal", () => "TIPO MARGINAL"),
                Match.exhaustive
              )}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel
          value="tipo-efectivo"
          className="min-w-0 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <Tabs.Root
            value={vistaTipoEfectivoIrpfActiva}
            onValueChange={(valor) => {
              Option.fromNullishOr(valor).pipe(
                Option.flatMap(decodificarVistaTipoEfectivoIrpfAuditoria),
                Option.match({
                  onNone: () => {},
                  onSome: alCambiarVistaGrafico,
                })
              )
            }}
            className="grid min-w-0 gap-4"
          >
            <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="grid min-w-0 gap-3 md:max-w-3xl">
                <p className="text-xs leading-5 text-[var(--ink-soft)] sm:text-sm">
                  {tituloGraficoTipoEfectivoActivo}
                </p>
                <div className="flex min-w-0 flex-wrap items-start gap-3">
                  <SelectorComunidadAutonomaAuditoria
                    opciones={opcionesComunidadAutonoma}
                    opcion={opcionComunidadAutonoma}
                    alCambiar={alCambiarComunidadAutonoma}
                  />
                  <Tabs.List
                    aria-label="Tipo de gráfica de tipo efectivo"
                    className="inline-flex h-10 divide-x-2 divide-[var(--rule)] border-2 border-[var(--rule)] bg-[var(--paper)] text-sm tracking-[0.18em] uppercase shadow-[3px_3px_0_0_var(--rule)]"
                  >
                    {vistasTipoEfectivoIrpfAuditoria.map((vista) => (
                      <Tabs.Tab
                        key={vista}
                        value={vista}
                        className={claseBotonPestana}
                      >
                        {Match.value(vista).pipe(
                          Match.when("tipo-irpf", () => "TIPO"),
                          Match.when("diferencia-irpf", () => "DIFERENCIA"),
                          Match.exhaustive
                        )}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  <SelectorModoGrafico
                    ariaLabel="Cambiar unidad del análisis de tipo efectivo"
                    modo={modoTipoEfectivoIrpfActivo}
                    opciones={opcionesModoPorcentajeEuros}
                    alCambiar={cambiarModoTipoEfectivoIrpfActivo}
                  />
                </div>
              </div>
              <div className="w-full min-w-0 self-end md:w-auto">
                <BotonCopiarImagenGrafico
                  graficoRef={graficoTipoEfectivoActivoRef}
                  graficoExportacionRef={
                    graficoTipoEfectivoActivoExportacionRef
                  }
                  disabled={copiaGraficoDeshabilitada}
                  titulo={tituloGraficoTipoEfectivoActivo}
                />
              </div>
              {vistaTipoEfectivoIrpfActiva === "tipo-irpf" ? (
                <SelectorAniosGraficoAuditoria
                  anios={aniosPestanasTipoEfectivoIrpf}
                  aniosDisponibles={aniosTipoEfectivoIrpf}
                  aniosActivos={aniosGraficoIrpfVisibles}
                  ariaLabel="Años visibles en la gráfica de tipo efectivo del IRPF"
                  alAlternar={alternarAnioIrpf}
                />
              ) : (
                <SelectorAniosGraficoAuditoria
                  anios={aniosPestanasTipoEfectivoIrpf}
                  aniosDisponibles={aniosTipoEfectivoIrpf}
                  aniosActivos={aniosDiferenciaTipoIrpfVisibles}
                  ariaLabel="Años comparados en la gráfica de diferencia de tipo de IRPF"
                  alAlternar={alternarAnioDiferenciaTipoIrpf}
                />
              )}
            </div>
            <Tabs.Panel value="tipo-irpf" className="min-w-0">
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
                <div
                  ref={graficoTipoEfectivoIrpfRef}
                  className={claseMarcoGrafico}
                >
                  <ChartContainer
                    config={configTipoEfectivoIrpf}
                    className={claseLienzoGraficoTipoEfectivoIrpf}
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
                        tickFormatter={formatearTickTipoEfectivoIrpf}
                      />
                      <ChartTooltip
                        isAnimationActive={false}
                        allowEscapeViewBox={{ x: false, y: false }}
                        wrapperStyle={{
                          zIndex: 10,
                          maxWidth: "min(24rem, 90vw)",
                        }}
                        cursor={{
                          stroke: "var(--rule)",
                          strokeDasharray: "3 3",
                        }}
                        content={
                          <ChartTooltipContent
                            className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] text-xs shadow-[5px_5px_0_0_var(--rule)] sm:text-sm"
                            formatter={(valor, nombre, item) => (
                              <span
                                className="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                                style={{ color: item.color }}
                              >
                                {formatearValorTipoEfectivoIrpf(Number(valor))}{" "}
                                ({nombre})
                              </span>
                            )}
                            labelClassName="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                            labelFormatter={(_, p) =>
                              p[0]?.payload?.salario ?? ""
                            }
                          />
                        }
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
                              name={etiquetaSerieAuditoria(
                                comunidadAutonoma,
                                anio
                              )}
                              type="linear"
                              stroke={`var(--color-${clave})`}
                              strokeWidth={
                                anio === 2026 ? 4 : anio === 2019 ? 3 : 2
                              }
                              dot={false}
                              activeDot={{ r: 4, strokeWidth: 0 }}
                              isAnimationActive={false}
                            />
                          )
                        })
                      )}
                    </LineChart>
                  </ChartContainer>
                  <LeyendaGraficoAuditoria
                    items={itemsLeyendaTipoEfectivoIrpf({
                      comunidadesAutonomas,
                      anios: aniosGraficoIrpfVisibles,
                    })}
                  />
                </div>
              )}
              <FormulaTipoEfectivoIrpf
                anios={aniosGraficoIrpfVisibles}
                anioReferencia={anioReferenciaGraficosIrpf}
                comunidadAutonoma={comunidadAutonoma}
                modo={modoTipoEfectivoIrpf}
                perfil={perfil}
              />
            </Tabs.Panel>
            <Tabs.Panel value="diferencia-irpf" className="min-w-0">
              {graficoCargando ? (
                <Skeleton
                  aria-label="Cargando gráfica de diferencia de tipo de IRPF"
                  className={claseGraficoDiferenciaTipoIrpf}
                />
              ) : Option.isSome(errorGrafico) || Option.isNone(auditoria) ? (
                <div
                  className={cn(
                    claseGraficoDiferenciaTipoIrpf,
                    "grid place-items-center border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-center text-sm leading-6 text-[var(--ink-soft)]"
                  )}
                >
                  No se pudo calcular la gráfica:{" "}
                  {Option.getOrElse(errorGrafico, () => "sin datos")}
                </div>
              ) : (
                <ChartContainer
                  ref={graficoDiferenciaTipoIrpfRef}
                  config={configDiferenciaTipoIrpf}
                  className={claseGraficoDiferenciaTipoIrpf}
                >
                  <AreaChart
                    accessibilityLayer
                    data={datosDiferenciaTipoIrpf}
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
                      width={54}
                      domain={dominioDiferenciaTipoIrpf}
                      ticks={ticksDiferenciaIrpf}
                      fontSize={14}
                      tickFormatter={formatearTickDiferenciaTipoIrpf}
                    />
                    <ChartTooltip
                      isAnimationActive={false}
                      allowEscapeViewBox={{ x: false, y: false }}
                      wrapperStyle={{
                        zIndex: 10,
                        maxWidth: "min(24rem, 90vw)",
                      }}
                      cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                      content={
                        <TooltipDiferenciaTipoIrpf
                          claveDesfavorable={
                            clavesDiferenciaTipoIrpfSegmentadas[1]
                          }
                          formatearValor={formatearValorDiferenciaTipoIrpf}
                          className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] text-xs shadow-[5px_5px_0_0_var(--rule)] sm:text-sm"
                          labelClassName="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                          labelFormatter={(_, p) =>
                            p[0]?.payload?.salario ?? ""
                          }
                        />
                      }
                    />
                    <Area
                      dataKey={clavesDiferenciaTipoIrpfSegmentadas[1]}
                      name={`${anioDiferenciaComparado} - ${anioDiferenciaBase}`}
                      type="linear"
                      stroke={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[1]})`}
                      strokeWidth={3}
                      fill={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[1]})`}
                      fillOpacity={0.22}
                      baseValue={0}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                    <Area
                      dataKey={clavesDiferenciaTipoIrpfSegmentadas[0]}
                      name={`${anioDiferenciaComparado} - ${anioDiferenciaBase}`}
                      type="linear"
                      stroke={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[0]})`}
                      strokeWidth={3}
                      fill={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[0]})`}
                      fillOpacity={0.22}
                      baseValue={0}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
              <FormulaDiferenciaTipoEfectivoIrpf
                anioReferencia={anioReferenciaGraficosIrpf}
                modo={modoDiferenciaTipoIrpf}
              />
            </Tabs.Panel>
          </Tabs.Root>
        </Tabs.Panel>
        <Tabs.Panel
          value="cuna-fiscal"
          className="min-w-0 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="grid min-w-0 gap-3 md:max-w-3xl">
              <p className="text-xs leading-5 text-[var(--ink-soft)] sm:text-sm">
                {tituloGraficoCunaFiscal}
              </p>
              <div className="flex min-w-0 flex-wrap items-start gap-3">
                <SelectorComunidadAutonomaAuditoria
                  opciones={opcionesComunidadAutonoma}
                  opcion={opcionComunidadAutonoma}
                  alCambiar={alCambiarComunidadAutonoma}
                />
                <SelectorModoGrafico
                  ariaLabel="Cambiar unidad de cuña fiscal"
                  modo={modoCunaFiscal}
                  opciones={opcionesModoPorcentajeEuros}
                  alCambiar={fijarModoCunaFiscal}
                />
              </div>
            </div>
            <div className="w-full min-w-0 self-end md:w-auto">
              <BotonCopiarImagenGrafico
                graficoRef={graficoCunaFiscalRef}
                graficoExportacionRef={graficoCunaFiscalExportacionRef}
                disabled={copiaGraficoDeshabilitada}
                titulo={tituloGraficoCunaFiscal}
              />
            </div>
            <SelectorAniosGraficoAuditoria
              anios={aniosPestanasTipoEfectivoIrpf}
              aniosDisponibles={aniosTipoEfectivoIrpf}
              aniosActivos={[anioGraficoCunaFiscalVisible]}
              ariaLabel="Años visibles en la gráfica de cuña fiscal"
              alAlternar={alternarAnioCunaFiscal}
            />
          </div>
          {graficoCargando ? (
            <Skeleton
              aria-label="Cargando gráfica de cuña fiscal"
              className={claseGraficoCunaFiscal}
            />
          ) : Option.isSome(errorGrafico) || Option.isNone(auditoria) ? (
            <div
              className={cn(
                claseGraficoCunaFiscal,
                "grid place-items-center border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-center text-sm leading-6 text-[var(--ink-soft)]"
              )}
            >
              No se pudo calcular la gráfica:{" "}
              {Option.getOrElse(errorGrafico, () => "sin datos")}
            </div>
          ) : (
            <div ref={graficoCunaFiscalRef} className={claseMarcoGrafico}>
              <ChartContainer
                config={configCunaFiscal}
                className={claseLienzoGraficoCunaFiscal}
              >
                <ContenidoGraficoCunaFiscal
                  datos={datosCunaFiscal}
                  comunidadesAutonomas={comunidadesAutonomas}
                  anios={[anioGraficoCunaFiscalVisible]}
                  modo={modoCunaFiscal}
                  dominioSalario={dominioSalario}
                  ticksSalario={ticksSalario}
                  dominioCunaFiscal={dominioCunaFiscal}
                  ticksCunaFiscal={ticksCunaFiscal}
                />
              </ChartContainer>
              <LeyendaGraficoAuditoria
                items={itemsLeyendaCunaFiscal({
                  comunidadesAutonomas,
                  anios: [anioGraficoCunaFiscalVisible],
                })}
              />
            </div>
          )}
          <FormulaCunaFiscal
            anio={anioGraficoCunaFiscalVisible}
            anioReferencia={anioReferenciaGraficosIrpf}
            modo={modoCunaFiscal}
          />
        </Tabs.Panel>
        <Tabs.Panel
          value="tipo-marginal"
          className="min-w-0 border-2 border-[var(--rule)] bg-[var(--paper)] p-3 sm:p-5"
        >
          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="grid min-w-0 gap-3 md:max-w-3xl">
              <p className="text-xs leading-5 text-[var(--ink-soft)] sm:text-sm">
                {tituloGraficoTipoMarginalIrpf}
              </p>
              <SelectorComunidadAutonomaAuditoria
                opciones={opcionesComunidadAutonoma}
                opcion={opcionComunidadAutonoma}
                alCambiar={alCambiarComunidadAutonoma}
              />
            </div>
            <div className="w-full min-w-0 self-end md:w-auto">
              <BotonCopiarImagenGrafico
                graficoRef={graficoTipoMarginalIrpfRef}
                graficoExportacionRef={graficoTipoMarginalIrpfExportacionRef}
                disabled={copiaGraficoDeshabilitada}
                titulo={tituloGraficoTipoMarginalIrpf}
              />
            </div>
            <SelectorAniosGraficoAuditoria
              anios={aniosPestanasTipoEfectivoIrpf}
              aniosDisponibles={aniosTipoEfectivoIrpf}
              aniosActivos={[anioGraficoTipoMarginalIrpfVisible]}
              ariaLabel="Año visible en la gráfica de tipo marginal de IRPF"
              alAlternar={alternarAnioTipoMarginalIrpf}
            />
          </div>
          {graficoCargando ? (
            <Skeleton
              aria-label="Cargando gráfica de tipo marginal de IRPF"
              className={claseGraficoTipoMarginalIrpf}
            />
          ) : Option.isSome(errorGrafico) || Option.isNone(auditoria) ? (
            <div
              className={cn(
                claseGraficoTipoMarginalIrpf,
                "grid place-items-center border-2 border-[var(--rule)] bg-[var(--paper-2)] p-4 text-center text-sm leading-6 text-[var(--ink-soft)]"
              )}
            >
              No se pudo calcular la gráfica:{" "}
              {Option.getOrElse(errorGrafico, () => "sin datos")}
            </div>
          ) : (
            <ChartContainer
              ref={graficoTipoMarginalIrpfRef}
              config={configTipoMarginalIrpf}
              className={claseGraficoTipoMarginalIrpf}
            >
              <ComposedChart
                accessibilityLayer
                data={datosTipoMarginalIrpf}
                margin={{ left: 6, right: 18, top: 24, bottom: 28 }}
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
                  yAxisId="marginal"
                  tickLine={false}
                  axisLine={{ stroke: "var(--rule)" }}
                  tickMargin={6}
                  width={44}
                  domain={dominioMarginalIrpf}
                  ticks={ticksMarginalIrpf}
                  fontSize={14}
                  tickFormatter={formatearTickPorcentaje}
                />
                <YAxis
                  yAxisId="efectivo"
                  orientation="right"
                  tickLine={false}
                  axisLine={{ stroke: "var(--rule)" }}
                  tickMargin={6}
                  width={44}
                  domain={dominioEfectivoAlineadoEnGraficoMarginal}
                  ticks={ticksEfectivoEnGraficoMarginal}
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
                      className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] text-xs shadow-[5px_5px_0_0_var(--rule)] sm:text-sm"
                      formatter={(valor, nombre, item) => (
                        <span
                          className="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                          style={{ color: item.color }}
                        >
                          {porcentaje.format(Number(valor))} ({nombre})
                        </span>
                      )}
                      labelClassName="font-[family-name:var(--mono)] text-xs font-bold tabular-nums sm:text-sm"
                      labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                    />
                  }
                />
                <Area
                  yAxisId="marginal"
                  dataKey={claveTipoMarginalIrpf}
                  name={`Tipo marginal ${anioGraficoTipoMarginalIrpfVisible}`}
                  type="stepAfter"
                  stroke={`var(--color-${claveTipoMarginalIrpf})`}
                  strokeWidth={1}
                  fill={`var(--color-${claveTipoMarginalIrpf})`}
                  fillOpacity={0.38}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
                {ticksMarginalIrpf.map((tick) => (
                  <ReferenceLine
                    key={`marginal-grid-${tick}`}
                    yAxisId="marginal"
                    y={tick}
                    stroke="var(--rule)"
                    strokeDasharray="2 4"
                    strokeOpacity={0.75}
                    ifOverflow="extendDomain"
                  />
                ))}
                <Line
                  yAxisId="efectivo"
                  dataKey={claveTipoEfectivoIrpfMarginal}
                  name={`Tipo efectivo ${anioGraficoTipoMarginalIrpfVisible}`}
                  type="linear"
                  stroke={`var(--color-${claveTipoEfectivoIrpfMarginal})`}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ChartContainer>
          )}
          <FormulaTipoMarginalIrpf
            anio={anioGraficoTipoMarginalIrpfVisible}
            anioReferencia={anioReferenciaGraficosIrpf}
            perfil={perfil}
            pasoCentimos={pasoAuditoriaVisibleCentimos}
          />
        </Tabs.Panel>
      </Tabs.Root>
      {!copiaGraficoDeshabilitada ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-[-100000px] opacity-0"
        >
          <div
            ref={graficoTipoEfectivoIrpfExportacionRef}
            className={claseMarcoGraficoExportacion}
            style={estiloMarcoGraficoExportacion}
          >
            <ChartContainer
              config={configTipoEfectivoIrpf}
              className={claseGraficoExportacion}
              style={estiloLienzoGraficoExportacion}
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
                  tickFormatter={formatearTickTipoEfectivoIrpf}
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
                          {formatearValorTipoEfectivoIrpf(Number(valor))} (
                          {nombre})
                        </span>
                      )}
                      labelClassName="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
                      labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                    />
                  }
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
                        type="linear"
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
            <LeyendaGraficoAuditoria
              items={itemsLeyendaTipoEfectivoIrpf({
                comunidadesAutonomas,
                anios: aniosGraficoIrpfVisibles,
              })}
            />
          </div>

          <ChartContainer
            ref={graficoDiferenciaTipoIrpfExportacionRef}
            config={configDiferenciaTipoIrpf}
            className={claseGraficoExportacion}
            style={estiloLienzoGraficoExportacion}
          >
            <AreaChart
              accessibilityLayer
              data={datosDiferenciaTipoIrpf}
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
                width={54}
                domain={dominioDiferenciaTipoIrpf}
                ticks={ticksDiferenciaIrpf}
                fontSize={14}
                tickFormatter={formatearTickDiferenciaTipoIrpf}
              />
              <ChartTooltip
                isAnimationActive={false}
                allowEscapeViewBox={{ x: false, y: false }}
                wrapperStyle={{ zIndex: 10, maxWidth: "min(24rem, 90vw)" }}
                cursor={{ stroke: "var(--rule)", strokeDasharray: "3 3" }}
                content={
                  <TooltipDiferenciaTipoIrpf
                    claveDesfavorable={clavesDiferenciaTipoIrpfSegmentadas[1]}
                    formatearValor={formatearValorDiferenciaTipoIrpf}
                    className="max-w-[min(24rem,90vw)] border-2 border-[var(--rule)] bg-[var(--paper)] shadow-[5px_5px_0_0_var(--rule)]"
                    labelClassName="font-[family-name:var(--mono)] text-sm font-bold tabular-nums"
                    labelFormatter={(_, p) => p[0]?.payload?.salario ?? ""}
                  />
                }
              />
              <Area
                dataKey={clavesDiferenciaTipoIrpfSegmentadas[1]}
                name={`${anioDiferenciaComparado} - ${anioDiferenciaBase}`}
                type="linear"
                stroke={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[1]})`}
                strokeWidth={3}
                fill={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[1]})`}
                fillOpacity={0.22}
                baseValue={0}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                connectNulls={false}
                isAnimationActive={false}
              />
              <Area
                dataKey={clavesDiferenciaTipoIrpfSegmentadas[0]}
                name={`${anioDiferenciaComparado} - ${anioDiferenciaBase}`}
                type="linear"
                stroke={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[0]})`}
                strokeWidth={3}
                fill={`var(--color-${clavesDiferenciaTipoIrpfSegmentadas[0]})`}
                fillOpacity={0.22}
                baseValue={0}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>

          <div
            ref={graficoCunaFiscalExportacionRef}
            className={claseMarcoGraficoExportacion}
            style={estiloMarcoGraficoExportacion}
          >
            <ChartContainer
              config={configCunaFiscal}
              className={claseGraficoExportacion}
              style={estiloLienzoGraficoExportacion}
            >
              <ContenidoGraficoCunaFiscal
                datos={datosCunaFiscal}
                comunidadesAutonomas={comunidadesAutonomas}
                anios={[anioGraficoCunaFiscalVisible]}
                modo={modoCunaFiscal}
                dominioSalario={dominioSalario}
                ticksSalario={ticksSalario}
                dominioCunaFiscal={dominioCunaFiscal}
                ticksCunaFiscal={ticksCunaFiscal}
              />
            </ChartContainer>
            <LeyendaGraficoAuditoria
              items={itemsLeyendaCunaFiscal({
                comunidadesAutonomas,
                anios: [anioGraficoCunaFiscalVisible],
              })}
            />
          </div>

          <ChartContainer
            ref={graficoTipoMarginalIrpfExportacionRef}
            config={configTipoMarginalIrpf}
            className={claseGraficoExportacion}
            style={estiloLienzoGraficoExportacion}
          >
            <ComposedChart
              accessibilityLayer
              data={datosTipoMarginalIrpf}
              margin={{ left: 6, right: 18, top: 24, bottom: 28 }}
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
                yAxisId="marginal"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                width={44}
                domain={dominioMarginalIrpf}
                ticks={ticksMarginalIrpf}
                fontSize={14}
                tickFormatter={formatearTickPorcentaje}
              />
              <YAxis
                yAxisId="efectivo"
                orientation="right"
                tickLine={false}
                axisLine={{ stroke: "var(--rule)" }}
                tickMargin={6}
                width={44}
                domain={dominioEfectivoAlineadoEnGraficoMarginal}
                ticks={ticksEfectivoEnGraficoMarginal}
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
              <Area
                yAxisId="marginal"
                dataKey={claveTipoMarginalIrpf}
                name={`Tipo marginal ${anioGraficoTipoMarginalIrpfVisible}`}
                type="stepAfter"
                stroke={`var(--color-${claveTipoMarginalIrpf})`}
                strokeWidth={1}
                fill={`var(--color-${claveTipoMarginalIrpf})`}
                fillOpacity={0.38}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
              {ticksMarginalIrpf.map((tick) => (
                <ReferenceLine
                  key={`marginal-grid-exportacion-${tick}`}
                  yAxisId="marginal"
                  y={tick}
                  stroke="var(--rule)"
                  strokeDasharray="2 4"
                  strokeOpacity={0.75}
                  ifOverflow="extendDomain"
                />
              ))}
              <Line
                yAxisId="efectivo"
                dataKey={claveTipoEfectivoIrpfMarginal}
                name={`Tipo efectivo ${anioGraficoTipoMarginalIrpfVisible}`}
                type="linear"
                stroke={`var(--color-${claveTipoEfectivoIrpfMarginal})`}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      ) : null}
    </section>
  )
}
