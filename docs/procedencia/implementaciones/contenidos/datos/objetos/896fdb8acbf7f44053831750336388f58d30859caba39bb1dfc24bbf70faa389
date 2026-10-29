import { crearLineaCalculo } from "../../explicacion/linea-calculo"
import { enlazarRastroAnualActual } from "../../../procedencia/rastro-anual"
import Decimal from "decimal.js"
import { Context, Effect, Layer, Match, Option } from "effect"

import type {
  CasoFiscalAnual,
  SituacionFamiliarIndividual,
} from "../caso-fiscal-anual"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import {
  centimosAEuros,
  eurosACentimos,
  PoliticaMonetaria,
  type ServicioPoliticaMonetaria,
} from "../../dinero/importe-monetario"
import {
  calcularDesgloseCotizacionesSocialesLegacy,
  CotizacionesSociales,
  type ServicioCotizacionesSociales,
} from "../../laboral/cotizaciones-sociales"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../../laboral/cotizaciones-perfil-uniforme"
import type { MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import { MINIMOS_ESTATALES_2014 } from "../../normativa/datos/minimos-autonomicos-2014"
import { MINIMOS_ESTATALES_2013 } from "../../normativa/datos/minimos-autonomicos-2013"
import { MINIMOS_ESTATALES_2012 } from "../../normativa/datos/minimos-autonomicos-2012"
import {
  obtenerParametrosComunidadAutonoma as obtenerParametrosComunidadAutonomaPuro,
  ParametrosNormativosIrpf,
  type ServicioParametrosNormativosIrpf,
} from "../comunidades/comunidad-autonoma"
import {
  obtenerEscalaAutonomicaPublicada,
  ESTATAL_ORDINARIA_2012_2014,
  ESTATAL_COMPLEMENTARIA_2012_2014,
} from "../cuotas/escalas-publicadas"
import { calcularCuotaDiferencialCentimos } from "../cuotas/cuota-diferencial"
import {
  calcularCuotaPorEscalaAhorro,
  calcularAhorroConMinimos,
  calcularDesgloseCuotaPorEscalaAhorro,
} from "../cuotas/cuota-integra-ahorro"
import {
  calcularCuotaPorEscala,
  calcularCuotaPorEscalaGeneral,
  calcularDesgloseCuotaPorEscala,
  calcularDesgloseCuotaPorEscalaGeneral,
} from "../cuotas/escalas-gravamen"
import { calcularBaseImponibleAhorro } from "../integracion/base-imponible-ahorro"
import { calcularBaseImponibleGeneral } from "../integracion/base-imponible-general"
import { obtenerMinimoAscendientes } from "../minimos/minimo-ascendientes"
import { obtenerMinimoContribuyente } from "../minimos/minimo-contribuyente"
import { obtenerMinimoDescendientes } from "../minimos/minimo-descendientes"
import {
  obtenerMinimoDiscapacidadAscendientes,
  obtenerMinimoDiscapacidadContribuyente,
  obtenerMinimoDiscapacidadFamiliares,
} from "../minimos/minimo-discapacidad"
import {
  calcularRendimientoNetoCapitalInmobiliarioSimplificado,
  sumarRendimientosCapitalInmobiliario,
} from "../rendimientos/rendimientos-capital-inmobiliario"
import {
  calcularRendimientoNetoTrabajo,
  sumarRendimientosTrabajo,
} from "../rendimientos/rendimientos-trabajo"
import { calcularGananciasPatrimonialesPorTransmision } from "../rendimientos/ganancias-perdidas-patrimoniales"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import {
  calcularConciliacionSimuladorLegacy,
  type ConciliacionSimuladorLegacy,
} from "./conciliacion-simulador-legacy"
import {
  RetencionTrabajoAeat,
  type ResultadoNoSoportadoRetencion,
  type RetencionTrabajoCalculada,
  type ServicioRetencionTrabajoAeat,
} from "../retenciones/retencion-trabajo-aeat"
import {
  medirAuditoriaSync,
  registrarTiempoAgregadoAuditoria,
  tiempoAuditoriaMs,
} from "../../../observabilidad/auditoria-rendimiento"

export type { CasoFiscalAnual } from "../caso-fiscal-anual"

export interface ContextoLiquidacionIrpf {
  readonly modo: "canonico" | "compatible-legacy"
}

export interface ResultadoNoSoportado {
  readonly _tag: "ResultadoNoSoportado"
  readonly motivo: string
  readonly fuenteReconocida: string
  readonly rastro: RastroCalculo
}

export interface LiquidacionIrpfAnualCalculada {
  readonly _tag: "LiquidacionIrpfAnualCalculada"
  readonly perfil: "renta-individual-general"
  readonly anio: CasoFiscalAnual["anio"]
  readonly rendimientoIntegroTrabajoCentimos: number
  readonly rendimientoNetoTrabajoCentimos: number
  readonly rendimientoNetoCapitalInmobiliarioCentimos: number
  readonly gastosDeduciblesTrabajoCentimos: number
  readonly reduccionRendimientosTrabajoCentimos: number
  readonly totalGastosYDeduccionesTrabajoCentimos: number
  readonly baseImponibleGeneralCentimos: number
  readonly baseLiquidableGeneralCentimos: number
  readonly gananciaPatrimonialTotalCentimos: number
  readonly gananciaPatrimonialExentaCentimos: number
  readonly baseLiquidableAhorroCentimos: number
  readonly cotizacionEmpresarialCentimos: number
  readonly cotizacionTrabajadorCentimos: number
  readonly costeLaboralCentimos: number
  readonly meiEmpresarialCentimos: number
  readonly meiTrabajadorCentimos: number
  readonly solidaridadEmpresarialCentimos: number
  readonly solidaridadTrabajadorCentimos: number
  readonly cuotaIntegraGeneralCentimos: number
  readonly cuotaIntegraAhorroCentimos: number
  readonly cuotaMinimoPersonalCentimos: number
  readonly cuotaMinimoPersonalAhorroCentimos: number
  readonly deduccionesAutonomicasCentimos: number
  readonly cuotaLiquidaCentimos: number
  readonly retencionesYPagosACuentaCentimos: number
  readonly cuotaDiferencialCentimos: number
  readonly conciliacionSimuladorLegacy: Option.Option<ConciliacionSimuladorLegacy>
  readonly rastro: RastroCalculo
}

export type ResultadoLiquidacionIrpf =
  | LiquidacionIrpfAnualCalculada
  | ResultadoNoSoportado

export type LiquidarIrpfAnualError =
  | ResultadoNoSoportado
  | ResultadoNoSoportadoRetencion

interface DependenciasLiquidacionIrpfAnual {
  readonly cotizacionesSociales: ServicioCotizacionesSociales
  readonly parametrosNormativos: ServicioParametrosNormativosIrpf
  readonly politicaMonetaria: ServicioPoliticaMonetaria
  readonly retencionTrabajoAeat: ServicioRetencionTrabajoAeat
}

const construirLiquidarIrpfAnual = (
  dependencias: DependenciasLiquidacionIrpfAnual
) =>
  Effect.fn("LiquidacionIrpfAnual.liquidar")(function* (
    caso: CasoFiscalAnual,
    contexto: ContextoLiquidacionIrpf
  ) {
    yield* Effect.annotateCurrentSpan("irpf.anio", caso.anio)
    yield* Effect.annotateCurrentSpan(
      "irpf.comunidadAutonoma",
      caso.comunidadAutonoma
    )
    yield* Effect.annotateCurrentSpan("irpf.modo", contexto.modo)

    if (
      caso.retencionTrabajoAeat !== undefined &&
      caso.retencionTrabajoAeat.anio !== caso.anio
    ) {
      return yield* Effect.fail({
        _tag: "ResultadoNoSoportado",
        motivo:
          "La retención estimada y la liquidación deben pertenecer al mismo ejercicio",
        fuenteReconocida:
          "docs/procedencia/correcciones/coherencia-ronda9/INFORME.md",
        rastro: { titulo: "Coherencia del ejercicio", pasos: [] },
      } satisfies ResultadoNoSoportado)
    }

    const inicioDeteccion = tiempoAuditoriaMs()
    const resultadoNoSoportado = yield* Match.value(
      caso.deducciones.length
    ).pipe(
      Match.when(0, () => Effect.succeed(Option.none<ResultadoNoSoportado>())),
      Match.orElse(() =>
        detectarCasoNoSoportado(caso, dependencias.parametrosNormativos)
      )
    )
    registrarTiempoAgregadoAuditoria(
      "liquidacion.detectarCasoNoSoportado",
      tiempoAuditoriaMs() - inicioDeteccion
    )
    return yield* Option.match(resultadoNoSoportado, {
      onNone: () =>
        liquidarTrabajoIndividualSimple(caso, dependencias, contexto),
      onSome: (resultadoNoSoportado) => Effect.fail(resultadoNoSoportado),
    })
  })

export class LiquidacionIrpfAnual extends Context.Service<
  LiquidacionIrpfAnual,
  {
    readonly liquidar: (
      caso: CasoFiscalAnual,
      contexto: ContextoLiquidacionIrpf
    ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
  }
>()(
  "irobopf/lib/dominio/irpf/liquidacion/liquidar-irpf-anual/LiquidacionIrpfAnual"
) {
  static readonly layer = Layer.effect(
    LiquidacionIrpfAnual,
    Effect.gen(function* () {
      const cotizacionesSociales = yield* CotizacionesSociales
      const parametrosNormativos = yield* ParametrosNormativosIrpf
      const politicaMonetaria = yield* PoliticaMonetaria
      const retencionTrabajoAeat = yield* RetencionTrabajoAeat

      return {
        liquidar: construirLiquidarIrpfAnual({
          cotizacionesSociales,
          parametrosNormativos,
          politicaMonetaria,
          retencionTrabajoAeat,
        }),
      }
    })
  ).pipe(
    Layer.provideMerge(CotizacionesSociales.layer),
    Layer.provideMerge(ParametrosNormativosIrpf.layer),
    Layer.provideMerge(PoliticaMonetaria.layer),
    Layer.provideMerge(RetencionTrabajoAeat.layer)
  )
}

const liquidarIrpfAnualDesdeServicio = Effect.fn(
  "LiquidacionIrpfAnual.liquidarDesdeServicio"
)(function* (caso: CasoFiscalAnual, contexto: ContextoLiquidacionIrpf) {
  const liquidacion = yield* LiquidacionIrpfAnual
  return yield* liquidacion.liquidar(caso, contexto)
})

export const liquidarIrpfAnual = (
  caso: CasoFiscalAnual,
  contexto: ContextoLiquidacionIrpf
): Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError> =>
  // @effect-diagnostics-next-line effect/strictEffectProvide:off
  liquidarIrpfAnualDesdeServicio(caso, contexto).pipe(
    Effect.provide(LiquidacionIrpfAnual.layer)
  )

const liquidarTrabajoIndividualSimple = Effect.fn(
  "LiquidacionIrpfAnual.liquidarTrabajoIndividualSimple"
)(function* (
  caso: CasoFiscalAnual,
  dependencias: DependenciasLiquidacionIrpfAnual,
  contexto: ContextoLiquidacionIrpf
) {
  const inicioLiquidacionSimple = tiempoAuditoriaMs()
  const liquidarCentimos = eurosACentimos

  const rendimientoIntegroTrabajo = medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.sumar",
    () => sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)
  )
  const minimosEstatales = medirAuditoriaSync(
    "liquidacion.minimos.estatal",
    () =>
      Match.value(caso.anio).pipe(
        Match.when(2012, () => MINIMOS_ESTATALES_2012),
        Match.when(2013, () => MINIMOS_ESTATALES_2013),
        Match.when(2014, () => MINIMOS_ESTATALES_2014),
        Match.orElse(
          () => dependencias.parametrosNormativos.minimosEstatales2025
        )
      )
  )
  const cotizacionesSociales = medirAuditoriaSync(
    "liquidacion.cotizacionesSociales.desglosar",
    () =>
      (contexto.modo === "canonico"
        ? calcularDesgloseCotizacionesPerfilUniforme
        : calcularDesgloseCotizacionesSocialesLegacy)({
        anio: caso.anio,
        salarioBrutoAnual: rendimientoIntegroTrabajo,
      })
  )
  const rendimientoTrabajo = medirAuditoriaSync(
    "liquidacion.rendimientosTrabajo.neto",
    () =>
      calcularRendimientoNetoTrabajo({
        anio: caso.anio,
        rendimientoIntegro: rendimientoIntegroTrabajo,
        cotizacionTrabajador: cotizacionesSociales.cotizacionTrabajador,
      })
  )
  const rendimientoIntegroCapitalInmobiliario = medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.sumar",
    () =>
      sumarRendimientosCapitalInmobiliario(
        Option.fromNullishOr(caso.rendimientos.capitalInmobiliario).pipe(
          Option.getOrElse(() => [])
        ),
        centimosAEuros
      )
  )
  const rendimientoCapitalInmobiliario = medirAuditoriaSync(
    "liquidacion.capitalInmobiliario.neto",
    () =>
      calcularRendimientoNetoCapitalInmobiliarioSimplificado({
        rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
      })
  )
  const gananciasPatrimoniales = medirAuditoriaSync(
    "liquidacion.gananciasPatrimoniales",
    () =>
      calcularGananciasPatrimonialesPorTransmision({
        anio: caso.anio,
        edadContribuyente: caso.situacionFamiliar.edad,
        ganancias: Option.fromNullishOr(
          caso.rendimientos.gananciasPatrimoniales
        ).pipe(Option.getOrElse(() => [])),
        convertirCentimos: centimosAEuros,
      })
  )
  // Este perfil solo admite alquiler simplificado y ganancias por transmisión.
  // Conservar pérdidas y excluir exenciones antes de cualquier compensación
  // de bases. Las rentas nuevas deberán incorporarse explícitamente aquí.
  const otrasRentasNoExentas = rendimientoCapitalInmobiliario.rendimientoNeto
    .plus(gananciasPatrimoniales.gananciaSujetaGeneral)
    .plus(gananciasPatrimoniales.gananciaSujetaAhorro)
  const reduccionRendimientosTrabajo = medirAuditoriaSync(
    "liquidacion.reduccionRendimientosTrabajo",
    () =>
      calcularReduccionTrabajoConOtrasRentas({
        anio: caso.anio,
        fechaFallecimiento: caso.fechaFallecimiento,
        rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
        otrasRentasNoExentas,
      })
  )
  const baseImponibleGeneral = medirAuditoriaSync(
    "liquidacion.baseImponibleGeneral",
    () =>
      calcularBaseImponibleGeneral({
        gananciaPatrimonialGeneral:
          gananciasPatrimoniales.gananciaSujetaGeneral,
        reduccionRendimientosTrabajo,
        rendimientoCapitalInmobiliario,
        rendimientoTrabajo,
      })
  )
  const baseLiquidableGeneral = baseImponibleGeneral
  const baseLiquidableAhorro = medirAuditoriaSync(
    "liquidacion.baseImponibleAhorro",
    () =>
      calcularBaseImponibleAhorro({
        gananciasPatrimoniales,
      })
  )
  const resultadoParametrosComunidad = medirAuditoriaSync(
    "liquidacion.parametrosComunidad.obtener",
    () =>
      obtenerParametrosComunidadAutonomaPuro({
        anio: caso.anio,
        baseLiquidableGeneral,
        comunidadAutonoma: caso.comunidadAutonoma,
        fechaFallecimiento: caso.fechaFallecimiento,
      })
  )
  const inicioParametrosComunidadMatch = tiempoAuditoriaMs()
  const parametrosComunidad = yield* Match.valueTags(
    resultadoParametrosComunidad,
    {
      ComunidadAutonomaNoSoportada: (parametrosComunidad) =>
        Effect.fail({
          _tag: "ResultadoNoSoportado",
          motivo: parametrosComunidad.motivo,
          fuenteReconocida: parametrosComunidad.fuenteReconocida,
          rastro: rastroResultadoNoSoportado({
            caso,
            fuentePaso:
              "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
            tituloFuentePaso: "Manual Renta 2025 Parte 2",
            tituloPaso: "Comunidad autónoma no soportada",
            descripcionPaso:
              "El caso fiscal reconoce una comunidad autónoma real, pero esta version del motor solo calcula el caso técnico de contraste con tramo autonómico igualado al estatal.",
          }),
        } satisfies ResultadoNoSoportado),
      ParametrosComunidadAutonoma: (parametrosComunidad) =>
        Effect.succeed(parametrosComunidad),
    }
  )
  registrarTiempoAgregadoAuditoria(
    "liquidacion.parametrosComunidad.match",
    tiempoAuditoriaMs() - inicioParametrosComunidadMatch
  )
  const inicioCuotasIntegras = tiempoAuditoriaMs()
  const escalasPublicadasEstatales =
    caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"
      ? [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014]
      : undefined
  const escalaPublicadaAutonomica = obtenerEscalaAutonomicaPublicada(caso)
  const escalasPublicadasAutonomicas =
    escalaPublicadaAutonomica === undefined
      ? undefined
      : [escalaPublicadaAutonomica]
  const tramosIrpfEstatalGeneral = parametrosComunidad.escalaEstatalGeneral
  const usaEscalaAutonomicaReal =
    !parametrosComunidad.escalaAutonomicaIgualEstatal
  const cuotaIntegraGeneralEstatal = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      })
    : calcularCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: baseLiquidableGeneral,
      })
  const cuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
      })
    : baseLiquidableGeneral.mul(0)
  const cuotaIntegraGeneral = cuotaIntegraGeneralEstatal.plus(
    cuotaIntegraGeneralAutonomica
  )
  const cuotaIntegraAhorro = calcularCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  })
  const desgloseCuotaIntegraGeneralEstatal = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      })
    : calcularDesgloseCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: baseLiquidableGeneral,
      })
  const desgloseCuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
      })
    : []
  const desgloseCuotaIntegraAhorro = calcularDesgloseCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  })
  registrarTiempoAgregadoAuditoria(
    "liquidacion.cuotasIntegrasYDesgloses",
    tiempoAuditoriaMs() - inicioCuotasIntegras
  )
  const inicioMinimos = tiempoAuditoriaMs()
  const minimoContribuyente = obtenerMinimoContribuyente({
    anio: caso.anio,
    edad: caso.situacionFamiliar.edad,
    minimos: minimosEstatales,
  })
  const minimoAscendientes = obtenerMinimoAscendientes(
    caso.situacionFamiliar.ascendientes,
    minimosEstatales
  )
  const minimoDescendientes = obtenerMinimoDescendientes(
    caso.situacionFamiliar.descendientes,
    minimosEstatales
  )
  const minimoDiscapacidadContribuyente =
    obtenerMinimoDiscapacidadContribuyente(
      caso.situacionFamiliar,
      minimosEstatales
    )
  const minimoDiscapacidadFamiliares = obtenerMinimoDiscapacidadFamiliares(
    caso.situacionFamiliar.descendientes,
    minimosEstatales
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      caso.situacionFamiliar.ascendientes,
      minimosEstatales
    )
  )
  const minimoPersonalYFamiliar = minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliares)
  const minimoPersonalYFamiliarAutonomico = calcularMinimoPersonalYFamiliar({
    situacionFamiliar: caso.situacionFamiliar,
    anio: caso.anio,
    minimos: parametrosComunidad.minimosAutonomicos,
  })
  registrarTiempoAgregadoAuditoria(
    "liquidacion.minimosPersonalesFamiliares",
    tiempoAuditoriaMs() - inicioMinimos
  )
  const inicioCuotasMinimo = tiempoAuditoriaMs()
  const cuotaMinimoPersonalEstatal = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      })
    : calcularCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      })
  const cuotaMinimoPersonalAutonomica = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
      })
    : minimoPersonalYFamiliar.mul(0)
  const cuotaMinimoPersonal = cuotaMinimoPersonalEstatal.plus(
    cuotaMinimoPersonalAutonomica
  )
  const ahorroConMinimos = calcularAhorroConMinimos({
    anio: caso.anio,
    base: baseLiquidableAhorro,
    baseGeneral: baseLiquidableGeneral,
    minimoEstatal: minimoPersonalYFamiliar,
    minimoAutonomico: minimoPersonalYFamiliarAutonomico,
  })
  const cuotaMinimoPersonalAhorro = ahorroConMinimos.estatal.minoracion.plus(
    ahorroConMinimos.autonomico.minoracion
  )
  const desgloseCuotaMinimoPersonalEstatal = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
        escalasPublicadas: escalasPublicadasEstatales,
      })
    : calcularDesgloseCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      })
  const desgloseCuotaMinimoPersonalAutonomica = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: Decimal.min(
          minimoPersonalYFamiliarAutonomico,
          baseLiquidableGeneral
        ),
        tramos: parametrosComunidad.escalaAutonomica.tramos,
        escalasPublicadas: escalasPublicadasAutonomicas,
      })
    : []
  registrarTiempoAgregadoAuditoria(
    "liquidacion.cuotasMinimoYDesgloses",
    tiempoAuditoriaMs() - inicioCuotasMinimo
  )
  const inicioCuotaLiquida = tiempoAuditoriaMs()
  const cuotaGeneralDespuesMinimo = Decimal.max(
    0,
    cuotaIntegraGeneral.minus(cuotaMinimoPersonal)
  )
  const cuotaAutonomicaGeneralDespuesMinimo = Decimal.max(
    0,
    cuotaIntegraGeneralAutonomica.minus(cuotaMinimoPersonalAutonomica)
  )
  const cuotaAhorroDespuesMinimo = Decimal.max(
    0,
    cuotaIntegraAhorro.minus(cuotaMinimoPersonalAhorro)
  )
  const deduccionesAutonomicasDeclaradas = centimosAEuros(
    sumarDeduccionesAutonomicasCentimos(caso)
  )
  const deduccionesAutonomicasAplicadas = usaEscalaAutonomicaReal
    ? Decimal.min(
        deduccionesAutonomicasDeclaradas,
        cuotaAutonomicaGeneralDespuesMinimo.plus(
          ahorroConMinimos.autonomico.despuesMinimo
        )
      )
    : deduccionesAutonomicasDeclaradas
  const cuotaLiquida = Decimal.max(
    0,
    cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo)
      .minus(deduccionesAutonomicasAplicadas)
  )
  registrarTiempoAgregadoAuditoria(
    "liquidacion.deduccionesYCuotaLiquida",
    tiempoAuditoriaMs() - inicioCuotaLiquida
  )
  const importesLiquidacion = medirAuditoriaSync(
    "liquidacion.importesLiquidacion.redondeos",
    () => ({
      rendimientoIntegroTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.rendimientoIntegro
      ),
      rendimientoNetoTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.rendimientoNeto
      ),
      rendimientoNetoCapitalInmobiliarioCentimos: liquidarCentimos(
        rendimientoCapitalInmobiliario.rendimientoNeto
      ),
      gastosDeduciblesTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.gastosDeducibles
      ),
      reduccionRendimientosTrabajoCentimos: liquidarCentimos(
        reduccionRendimientosTrabajo
      ),
      totalGastosYDeduccionesTrabajoCentimos: liquidarCentimos(
        rendimientoTrabajo.cotizacionTrabajador
          .plus(rendimientoTrabajo.gastosDeducibles)
          .plus(reduccionRendimientosTrabajo)
      ),
      baseImponibleGeneralCentimos: liquidarCentimos(baseImponibleGeneral),
      baseLiquidableGeneralCentimos: liquidarCentimos(baseLiquidableGeneral),
      gananciaPatrimonialTotalCentimos: liquidarCentimos(
        gananciasPatrimoniales.gananciaTotal
      ),
      gananciaPatrimonialExentaCentimos: liquidarCentimos(
        gananciasPatrimoniales.gananciaExenta
      ),
      baseLiquidableAhorroCentimos: liquidarCentimos(baseLiquidableAhorro),
      cotizacionEmpresarialCentimos: liquidarCentimos(
        cotizacionesSociales.cotizacionEmpresarial
      ),
      cotizacionTrabajadorCentimos: liquidarCentimos(
        cotizacionesSociales.cotizacionTrabajador
      ),
      costeLaboralCentimos: liquidarCentimos(
        rendimientoIntegroTrabajo.plus(
          cotizacionesSociales.cotizacionEmpresarial
        )
      ),
      meiEmpresarialCentimos: liquidarCentimos(
        cotizacionesSociales.meiEmpresarial
      ),
      meiTrabajadorCentimos: liquidarCentimos(
        cotizacionesSociales.meiTrabajador
      ),
      solidaridadEmpresarialCentimos: liquidarCentimos(
        cotizacionesSociales.solidaridadEmpresarial
      ),
      solidaridadTrabajadorCentimos: liquidarCentimos(
        cotizacionesSociales.solidaridadTrabajador
      ),
      cuotaIntegraGeneralCentimos: liquidarCentimos(cuotaIntegraGeneral),
      cuotaIntegraAhorroCentimos: liquidarCentimos(cuotaIntegraAhorro),
      cuotaMinimoPersonalCentimos: liquidarCentimos(cuotaMinimoPersonal),
      cuotaMinimoPersonalAhorroCentimos: liquidarCentimos(
        cuotaMinimoPersonalAhorro
      ),
      deduccionesAutonomicasAplicadasCentimos: liquidarCentimos(
        deduccionesAutonomicasAplicadas
      ),
      cuotaLiquidaCentimos: liquidarCentimos(cuotaLiquida),
    })
  )
  const inicioRetencionTrabajo = tiempoAuditoriaMs()
  const retencionTrabajoAeat =
    caso.retencionTrabajoAeat !== undefined
      ? yield* dependencias.retencionTrabajoAeat.calcular(
          caso.retencionTrabajoAeat,
          contexto
        )
      : undefined
  registrarTiempoAgregadoAuditoria(
    "liquidacion.retencionTrabajoAeat.opcional",
    tiempoAuditoriaMs() - inicioRetencionTrabajo
  )
  const inicioCuotaDiferencial = tiempoAuditoriaMs()
  const retencionTrabajoAeatCentimos =
    retencionTrabajoAeat?.importeRetencionAnualCentimos ?? 0
  const pagosACuentaAplicadosCentimos =
    caso.pagosACuentaCentimos + retencionTrabajoAeatCentimos
  const cuotaDiferencialCentimos = calcularCuotaDiferencialCentimos({
    cuotaLiquidaCentimos: importesLiquidacion.cuotaLiquidaCentimos,
    pagosACuentaCentimos: pagosACuentaAplicadosCentimos,
    retencionesSoportadasCentimos: caso.retencionesSoportadasCentimos,
  })
  registrarTiempoAgregadoAuditoria(
    "liquidacion.cuotaDiferencial",
    tiempoAuditoriaMs() - inicioCuotaDiferencial
  )

  const inicioSalida = tiempoAuditoriaMs()
  const resultado = {
    _tag: "LiquidacionIrpfAnualCalculada",
    perfil: "renta-individual-general",
    anio: caso.anio,
    rendimientoIntegroTrabajoCentimos:
      importesLiquidacion.rendimientoIntegroTrabajoCentimos,
    rendimientoNetoTrabajoCentimos:
      importesLiquidacion.rendimientoNetoTrabajoCentimos,
    rendimientoNetoCapitalInmobiliarioCentimos:
      importesLiquidacion.rendimientoNetoCapitalInmobiliarioCentimos,
    gastosDeduciblesTrabajoCentimos:
      importesLiquidacion.gastosDeduciblesTrabajoCentimos,
    reduccionRendimientosTrabajoCentimos:
      importesLiquidacion.reduccionRendimientosTrabajoCentimos,
    totalGastosYDeduccionesTrabajoCentimos:
      importesLiquidacion.totalGastosYDeduccionesTrabajoCentimos,
    baseImponibleGeneralCentimos:
      importesLiquidacion.baseImponibleGeneralCentimos,
    baseLiquidableGeneralCentimos:
      importesLiquidacion.baseLiquidableGeneralCentimos,
    gananciaPatrimonialTotalCentimos:
      importesLiquidacion.gananciaPatrimonialTotalCentimos,
    gananciaPatrimonialExentaCentimos:
      importesLiquidacion.gananciaPatrimonialExentaCentimos,
    baseLiquidableAhorroCentimos:
      importesLiquidacion.baseLiquidableAhorroCentimos,
    cotizacionEmpresarialCentimos:
      importesLiquidacion.cotizacionEmpresarialCentimos,
    cotizacionTrabajadorCentimos:
      importesLiquidacion.cotizacionTrabajadorCentimos,
    costeLaboralCentimos: importesLiquidacion.costeLaboralCentimos,
    meiEmpresarialCentimos: importesLiquidacion.meiEmpresarialCentimos,
    meiTrabajadorCentimos: importesLiquidacion.meiTrabajadorCentimos,
    solidaridadEmpresarialCentimos:
      importesLiquidacion.solidaridadEmpresarialCentimos,
    solidaridadTrabajadorCentimos:
      importesLiquidacion.solidaridadTrabajadorCentimos,
    cuotaIntegraGeneralCentimos:
      importesLiquidacion.cuotaIntegraGeneralCentimos,
    cuotaIntegraAhorroCentimos: importesLiquidacion.cuotaIntegraAhorroCentimos,
    cuotaMinimoPersonalCentimos:
      importesLiquidacion.cuotaMinimoPersonalCentimos,
    cuotaMinimoPersonalAhorroCentimos:
      importesLiquidacion.cuotaMinimoPersonalAhorroCentimos,
    deduccionesAutonomicasCentimos:
      importesLiquidacion.deduccionesAutonomicasAplicadasCentimos,
    cuotaLiquidaCentimos: importesLiquidacion.cuotaLiquidaCentimos,
    retencionesYPagosACuentaCentimos:
      caso.retencionesSoportadasCentimos + pagosACuentaAplicadosCentimos,
    cuotaDiferencialCentimos,
    conciliacionSimuladorLegacy: calcularConciliacionSimuladorLegacy({
      modoCuotaOrigen: contexto.modo,
      anio: caso.anio,
      rendimientoIntegroTrabajoCentimos:
        importesLiquidacion.rendimientoIntegroTrabajoCentimos,
      cuotaLiquida,
      cuotaLiquidaCentimos: importesLiquidacion.cuotaLiquidaCentimos,
      cuotaDiferencialCentimos,
      limiteRetencionNominaCentimos: retencionTrabajoAeat?.limite43Centimos,
    }),
    rastro: {
      titulo: `Liquidación anual del IRPF ${caso.anio}`,
      contexto: {
        anio: caso.anio,
        territorio: caso.comunidadAutonoma,
        perfilCalculo: contexto.modo,
      },
      pasos: [
        {
          _tag: "PasoExplicacion",
          titulo: "Rendimientos del trabajo",
          descripcion: `Rendimiento íntegro ${rendimientoIntegroTrabajo.toFixed(2)} euros menos cotización del trabajador y gastos deducibles.`,
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.trabajo.integro",
              instancia: 0,
              importe: rendimientoTrabajo.rendimientoIntegro,
              unidad: "EUR",
              etiqueta: "Rendimiento íntegro del trabajo",
              formula: "Suma de importes declarados como trabajo",
            }),
            crearLineaCalculo({
              siteId: "anual.trabajo.cotizacion",
              instancia: 0,
              importe: rendimientoTrabajo.cotizacionTrabajador,
              unidad: "EUR",
              etiqueta: "Cotización deducible del trabajador",
              formula: "Cotizaciones sociales calculadas para el salario anual",
            }),
            crearLineaCalculo({
              siteId: "anual.trabajo.previo-neto",
              instancia: 0,
              importe: rendimientoTrabajo.rendimientoPrevioNeto,
              unidad: "EUR",
              etiqueta: "Rendimiento previo neto",
              formula: `${euros(rendimientoTrabajo.rendimientoIntegro)} - ${euros(rendimientoTrabajo.cotizacionTrabajador)}`,
            }),
            crearLineaCalculo({
              siteId: "anual.trabajo.gastos",
              instancia: 0,
              importe: rendimientoTrabajo.gastosDeducibles,
              unidad: "EUR",
              etiqueta: "Gastos deducibles aplicados",
              formula: "Gasto fijo del rendimiento del trabajo",
            }),
            crearLineaCalculo({
              siteId: "anual.trabajo.neto",
              instancia: 0,
              importe: rendimientoTrabajo.rendimientoNeto,
              unidad: "EUR",
              etiqueta: "Rendimiento neto del trabajo",
              formula: `max(0, ${euros(rendimientoTrabajo.rendimientoPrevioNeto)} - ${euros(rendimientoTrabajo.gastosDeducibles)})`,
            }),
            crearLineaCalculo({
              siteId: "anual.trabajo.reduccion",
              instancia: 0,
              importe: reduccionRendimientosTrabajo,
              unidad: "EUR",
              etiqueta: "Reducción por rendimientos del trabajo",
              formula: `Reducción estatal; otras rentas netas no exentas antes de compensaciones: ${euros(otrasRentasNoExentas)}`,
            }),
          ],
          fuentes: [
            {
              titulo: "Manual Renta 2025 Parte 1",
              referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cotizaciones a la Seguridad Social",
          descripcion:
            contexto.modo === "canonico"
              ? "Estimación analítica de doce mensualidades uniformes, con prorrata de extras, año completo y tipos ordinarios del perfil heredado. No acredita mínimos por grupo, elegibilidad ni redondeo mensual TGSS."
              : "Desglose del perfil compatible-legacy, conservado para comparación con el oracle histórico.",
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.ss.base",
              instancia: 0,
              importe: cotizacionesSociales.baseOrdinaria,
              unidad: "EUR",
              etiqueta: "Base ordinaria de cotización",
              formula:
                contexto.modo === "canonico"
                  ? "Suma de doce bases mensuales uniformes, limitadas por el tope vigente en cada mes"
                  : "min(rendimiento íntegro del trabajo, base máxima anual legacy)",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.exceso",
              instancia: 0,
              importe: cotizacionesSociales.excesoBase,
              unidad: "EUR",
              etiqueta: "Exceso sobre base máxima",
              formula:
                "max(0, rendimiento íntegro del trabajo - base ordinaria aplicada)",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.empresarial-ordinaria",
              instancia: 0,
              importe: cotizacionesSociales.cotizacionEmpresarialOrdinaria,
              unidad: "EUR",
              etiqueta: "Cotización empresarial ordinaria",
              formula:
                "Base ordinaria x tipos empresariales sin MEI ni solidaridad",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.trabajador-ordinaria",
              instancia: 0,
              importe: cotizacionesSociales.cotizacionTrabajadorOrdinaria,
              unidad: "EUR",
              etiqueta: "Cotización del trabajador ordinaria",
              formula:
                "Base ordinaria x tipos del trabajador sin MEI ni solidaridad",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.mei-empresarial",
              instancia: 0,
              importe: cotizacionesSociales.meiEmpresarial,
              unidad: "EUR",
              etiqueta: "MEI empresarial",
              formula: "Base ordinaria x tipo empresarial del MEI",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.mei-trabajador",
              instancia: 0,
              importe: cotizacionesSociales.meiTrabajador,
              unidad: "EUR",
              etiqueta: "MEI del trabajador",
              formula: "Base ordinaria x tipo del trabajador del MEI",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.solidaridad-empresarial",
              instancia: 0,
              importe: cotizacionesSociales.solidaridadEmpresarial,
              unidad: "EUR",
              etiqueta: "Solidaridad empresarial",
              formula:
                contexto.modo === "canonico"
                  ? "Suma de excesos por los tipos empresariales publicados de cada tramo"
                  : "5/6 de la cuota adicional de solidaridad",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.solidaridad-trabajador",
              instancia: 0,
              importe: cotizacionesSociales.solidaridadTrabajador,
              unidad: "EUR",
              etiqueta: "Solidaridad del trabajador",
              formula:
                contexto.modo === "canonico"
                  ? "Suma de excesos por los tipos del trabajador publicados de cada tramo"
                  : "1/6 de la cuota adicional de solidaridad",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.empresarial-total",
              instancia: 0,
              importe: cotizacionesSociales.cotizacionEmpresarial,
              unidad: "EUR",
              etiqueta: "Cotización empresarial total",
              formula:
                "Ordinaria empresarial + MEI empresarial + solidaridad empresarial",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.trabajador-total",
              instancia: 0,
              importe: cotizacionesSociales.cotizacionTrabajador,
              unidad: "EUR",
              etiqueta: "Cotización total del trabajador",
              formula:
                "Ordinaria trabajador + MEI trabajador + solidaridad trabajador",
            }),
            crearLineaCalculo({
              siteId: "anual.ss.coste-laboral",
              instancia: 0,
              importe: rendimientoIntegroTrabajo.plus(
                cotizacionesSociales.cotizacionEmpresarial
              ),
              unidad: "EUR",
              etiqueta: "Coste laboral",
              formula:
                "Rendimiento íntegro del trabajo + cotización empresarial",
            }),
          ],
          fuentes: [
            {
              titulo: "Parámetros Seguridad Social 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/seguridad-social-2012-2026.ts",
            },
            {
              titulo: "Glosario fiscal del motor",
              referencia: "docs/glosario-fiscal-motor.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Rendimientos de capital inmobiliario",
          descripcion: `Rendimiento íntegro ${rendimientoCapitalInmobiliario.rendimientoIntegro.toFixed(2)} euros integrado como rendimiento neto simplificado en la base general.`,
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.inmobiliario.integro",
              instancia: 0,
              importe: rendimientoCapitalInmobiliario.rendimientoIntegro,
              unidad: "EUR",
              etiqueta: "Rendimiento íntegro de capital inmobiliario",
              formula: "Suma de importes declarados en el formulario",
            }),
            crearLineaCalculo({
              siteId: "anual.inmobiliario.neto",
              instancia: 0,
              importe: rendimientoCapitalInmobiliario.rendimientoNeto,
              unidad: "EUR",
              etiqueta: "Rendimiento neto simplificado",
              formula:
                "Sin gastos, amortizaciones ni reducciones específicas todavía implementadas",
            }),
          ],
          fuentes: [
            {
              titulo: "Manual Renta 2025 Parte 1",
              referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Base general y mínimo personal",
          descripcion: `Base liquidable general ${baseLiquidableGeneral.toFixed(2)} euros, mínimo estatal ${minimoPersonalYFamiliar.toFixed(2)} euros y mínimo autonómico ${minimoPersonalYFamiliarAutonomico.toFixed(2)} euros.`,
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.base.general-imponible",
              instancia: 0,
              importe: baseImponibleGeneral,
              unidad: "EUR",
              etiqueta: "Base imponible general",
              formula: `max(0, ${euros(rendimientoTrabajo.rendimientoNeto)} - ${euros(reduccionRendimientosTrabajo)}) + ${euros(rendimientoCapitalInmobiliario.rendimientoNeto)} + ${euros(gananciasPatrimoniales.gananciaSujetaGeneral)}`,
            }),
            crearLineaCalculo({
              siteId: "anual.base.general-liquidable",
              instancia: 0,
              importe: baseLiquidableGeneral,
              unidad: "EUR",
              etiqueta: "Base liquidable general",
              formula:
                "Base imponible general sin reducciones de base aplicadas",
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.contribuyente",
              instancia: 0,
              importe: minimoContribuyente,
              unidad: "EUR",
              etiqueta: "Mínimo del contribuyente",
              formula: `Edad del contribuyente: ${caso.situacionFamiliar.edad}`,
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.ascendientes",
              instancia: 0,
              importe: minimoAscendientes,
              unidad: "EUR",
              etiqueta: "Mínimo por ascendientes",
              formula: `${caso.situacionFamiliar.ascendientes.length} ascendiente(s) declarados; se aplican las condiciones de edad y discapacidad modeladas`,
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.descendientes",
              instancia: 0,
              importe: minimoDescendientes,
              unidad: "EUR",
              etiqueta: "Mínimo por descendientes",
              formula: `${caso.situacionFamiliar.descendientes.length} descendiente(s) declarados; se filtra edad y discapacidad antes de ordenar`,
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.estatal",
              instancia: 0,
              importe: minimoPersonalYFamiliar,
              unidad: "EUR",
              etiqueta: "Mínimo personal y familiar",
              formula: `${euros(minimoContribuyente)} + ${euros(minimoDescendientes)} + ${euros(minimoAscendientes)} + ${euros(minimoDiscapacidadContribuyente)} + ${euros(minimoDiscapacidadFamiliares)}`,
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.autonomico",
              instancia: 0,
              importe: minimoPersonalYFamiliarAutonomico,
              unidad: "EUR",
              etiqueta: "Mínimo personal y familiar autonómico",
              formula: parametrosComunidad.minimoAutonomicoIgualEstatal
                ? "Coincide con el mínimo estatal"
                : `Minimos autonomicos IRPF ${caso.anio} de ${parametrosComunidad.escalaAutonomica.nombre}`,
            }),
            crearLineaCalculo({
              siteId: "anual.minimo.discapacidad",
              instancia: 0,
              importe: minimoDiscapacidadContribuyente.plus(
                minimoDiscapacidadFamiliares
              ),
              unidad: "EUR",
              etiqueta: "Mínimo por discapacidad",
              formula:
                "Contribuyente, descendientes y ascendientes con discapacidad computados",
            }),
          ],
          fuentes: [
            {
              titulo: "Manual Renta 2025 Parte 1",
              referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Ganancias patrimoniales y base del ahorro",
          descripcion:
            "Las ganancias sujetas se clasifican por ejercicio y fechas: el perfil histórico de 2013–2014 puede integrarlas en la base general. Se conservan pérdidas y se excluyen las exenciones modeladas; la compensación completa y los arrastres siguen pendientes.",
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.ganancias.total",
              instancia: 0,
              importe: gananciasPatrimoniales.gananciaTotal,
              unidad: "EUR",
              etiqueta: "Ganancias patrimoniales declaradas",
              formula: "Suma de ganancias por transmisión",
            }),
            crearLineaCalculo({
              siteId: "anual.ganancias.exenta",
              instancia: 0,
              importe: gananciasPatrimoniales.gananciaExenta,
              unidad: "EUR",
              etiqueta: "Ganancia patrimonial exenta",
              formula:
                "Exenciones modeladas por mayores de 65 años y por inmuebles urbanos adquiridos en la ventana de 2012, con límites de concurrencia",
            }),
            crearLineaCalculo({
              siteId: "anual.base.ahorro",
              instancia: 0,
              importe: baseLiquidableAhorro,
              unidad: "EUR",
              etiqueta: "Base liquidable del ahorro",
              formula: `max(0, ganancias sujetas clasificadas como ahorro: ${euros(gananciasPatrimoniales.gananciaSujetaAhorro)})`,
            }),
          ],
          fuentes: [
            {
              titulo: "Manual específico mayores de 65 años",
              referencia: "docs/fuentes/aeat/manual-renta-2025-mayores-65.md",
            },
            {
              titulo: "Manual Renta 2025 Parte 1",
              referencia: "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Comunidad autónoma",
          descripcion: Match.value(
            parametrosComunidad.escalaAutonomicaIgualEstatal
          ).pipe(
            Match.when(
              true,
              () =>
                "Caso técnico de contraste: los mínimos y la escala autonómica se igualan a los parámetros estatales. No representa la normativa propia de una comunidad autónoma real."
            ),
            Match.orElse(
              () =>
                `La comunidad autónoma ${parametrosComunidad.escalaAutonomica.nombre} aplica su escala autonómica general de ${parametrosComunidad.anio}. La cuota general se calcula como cuota estatal más cuota autonómica, y las deducciones autonómicas se restan después de minorar por el mínimo personal y familiar.`
            )
          ),
          fuentes: [
            {
              titulo: parametrosComunidad.escalaAutonomica.fuente.titulo,
              referencia:
                parametrosComunidad.escalaAutonomica.fuente.referencia,
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota íntegra general",
          descripcion: usaEscalaAutonomicaReal
            ? `Aplicación separada de las escalas estatal y autonómica. ${escalaPublicadaAutonomica === undefined ? "La escala autonómica conserva la integración previa de tipos; su política de cuotas publicadas no está cerrada para este supuesto." : "La escala autonómica usa cuota publicada más exceso; la aceptación se limita a esa representación y no certifica la liquidación completa."}`
            : "Aplicación de la escala general a la base liquidable general.",
          lineasCalculo: [
            ...desgloseCuotaIntegraGeneralEstatal.map((tramo, indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.general-estatal-tramo",
                instancia: indice,
                importe: tramo.cuota,
                unidad: "EUR",
                etiqueta: usaEscalaAutonomicaReal
                  ? `Tramo estatal ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`
                  : `Tramo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
                formula: `${tramo.cuotaFija === undefined ? "" : `${euros(tramo.cuotaFija)} + `}${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              })
            ),
            ...desgloseCuotaIntegraGeneralAutonomica.map((tramo, indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.general-autonomica-tramo",
                instancia: indice,
                importe: tramo.cuota,
                unidad: "EUR",
                etiqueta: `Tramo autonomico ${parametrosComunidad.escalaAutonomica.nombre} ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
                formula: `${tramo.cuotaFija === undefined ? "" : `${euros(tramo.cuotaFija)} + `}${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              })
            ),
            crearLineaCalculo({
              siteId: "anual.cuota.general-total",
              instancia: 0,
              importe: cuotaIntegraGeneral,
              unidad: "EUR",
              etiqueta: "Cuota íntegra general",
              formula: usaEscalaAutonomicaReal
                ? "Suma de cuota estatal general y cuota autonómica general"
                : "Suma de cuotas por tramo",
            }),
          ],
          fuentes: [
            {
              titulo: "Parámetros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota correspondiente al mínimo personal",
          descripcion: usaEscalaAutonomicaReal
            ? "Aplicación de la escala estatal y autonómica al mínimo personal y familiar para minorar la cuota íntegra general."
            : "Aplicación de la misma escala general al mínimo personal y familiar.",
          lineasCalculo: [
            ...desgloseCuotaMinimoPersonalEstatal.map((tramo, indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.minimo-estatal-tramo",
                instancia: indice,
                importe: tramo.cuota,
                unidad: "EUR",
                etiqueta: usaEscalaAutonomicaReal
                  ? `Tramo mínimo estatal ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`
                  : `Tramo mínimo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
                formula: `${tramo.cuotaFija === undefined ? "" : `${euros(tramo.cuotaFija)} + `}${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              })
            ),
            ...desgloseCuotaMinimoPersonalAutonomica.map((tramo, indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.minimo-autonomico-tramo",
                instancia: indice,
                importe: tramo.cuota,
                unidad: "EUR",
                etiqueta: `Tramo mínimo autonómico ${parametrosComunidad.escalaAutonomica.nombre} ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
                formula: `${tramo.cuotaFija === undefined ? "" : `${euros(tramo.cuotaFija)} + `}${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              })
            ),
            crearLineaCalculo({
              siteId: "anual.cuota.minimo-general-total",
              instancia: 0,
              importe: cuotaMinimoPersonal,
              unidad: "EUR",
              etiqueta: "Cuota del mínimo personal y familiar",
              formula: "Suma de cuotas por tramo del mínimo",
            }),
          ],
          fuentes: [
            {
              titulo: "Parámetros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota íntegra del ahorro",
          descripcion: `Escalas estatal y autonómica del ahorro de ${caso.anio}. ${caso.anio <= 2014 ? "El remanente reduce la base antes de aplicar cada tarifa." : "Cada cuota se minora aplicando su tarifa a su propio remanente."} Las cuantías de los mínimos se reciben del selector; esta fórmula no valida su procedencia.`,
          lineasCalculo: [
            ...desgloseCuotaIntegraAhorro.map((tramo, indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.ahorro-tramo",
                instancia: indice,
                importe: tramo.cuota,
                unidad: "EUR",
                etiqueta: `Tramo ahorro ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
                formula: `${tramo.cuotaFija === undefined ? "" : `${euros(tramo.cuotaFija)} + `}${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              })
            ),
            crearLineaCalculo({
              siteId: "anual.cuota.ahorro-total",
              instancia: 0,
              importe: cuotaIntegraAhorro,
              unidad: "EUR",
              etiqueta: "Cuota íntegra del ahorro",
              formula: "Suma de cuotas por tramo",
            }),
            ...(
              [
                ["estatal", ahorroConMinimos.estatal],
                ["autonómico", ahorroConMinimos.autonomico],
              ] as const
            ).map(([nombre, componente], indice) =>
              crearLineaCalculo({
                siteId: "anual.cuota.ahorro-componente-postminimo",
                instancia: indice,
                importe: componente.despuesMinimo,
                unidad: "EUR",
                etiqueta: `Ahorro ${nombre} después del mínimo`,
                formula:
                  caso.anio <= 2014
                    ? `F ${nombre}(${euros(baseLiquidableAhorro)} − ${euros(componente.remanente)})`
                    : `F ${nombre}(${euros(baseLiquidableAhorro)}) − F ${nombre}(${euros(componente.remanente)})`,
              })
            ),
            crearLineaCalculo({
              siteId: "anual.cuota.minimo-ahorro-total",
              instancia: 0,
              importe: cuotaMinimoPersonalAhorro,
              unidad: "EUR",
              etiqueta: "Minoración total por mínimos en el ahorro",
              formula:
                caso.anio <= 2014
                  ? "Suma por componente de F(base) − F(base − remanente)"
                  : "F estatal(remanente estatal) + F autonómica(remanente autonómico)",
            }),
          ],
          fuentes: [
            {
              titulo:
                "Escalas y mínimos del ahorro: alcance de la implementación",
              referencia:
                "docs/procedencia/implementaciones/escalas-ahorro/INFORME.md",
            },
          ],
        },
        ...(retencionTrabajoAeat !== undefined
          ? [
              pasoRetencionTrabajoAeat(retencionTrabajoAeat),
              ...retencionTrabajoAeat.rastro.pasos,
            ]
          : []),
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota diferencial",
          descripcion: `Cuota líquida ${cuotaLiquida.toFixed(2)} euros menos retenciones y pagos a cuenta declarados o calculados.`,
          lineasCalculo: [
            crearLineaCalculo({
              siteId: "anual.cuota.liquida",
              instancia: 0,
              importe: cuotaLiquida,
              unidad: "EUR",
              etiqueta: "Cuota líquida",
              formula: `max(0, ${euros(cuotaGeneralDespuesMinimo)} + ${euros(cuotaAhorroDespuesMinimo)} - ${euros(deduccionesAutonomicasAplicadas)})`,
            }),
            crearLineaCalculo({
              siteId: "anual.deducciones.autonomicas",
              instancia: 0,
              importe: deduccionesAutonomicasAplicadas,
              unidad: "EUR",
              etiqueta: "Deducciones autonómicas aplicadas",
              formula: usaEscalaAutonomicaReal
                ? `${deduccionesAutonomicasDescripcion(caso)}; límite por cuota autonómica general más ahorro disponible ${euros(cuotaAutonomicaGeneralDespuesMinimo.plus(ahorroConMinimos.autonomico.despuesMinimo))}`
                : deduccionesAutonomicasDescripcion(caso),
            }),
            crearLineaCalculo({
              siteId: "anual.pagos.retenciones",
              instancia: 0,
              importe: centimosAEuros(caso.retencionesSoportadasCentimos),
              unidad: "EUR",
              etiqueta: "Retenciones soportadas",
              formula: "Importe declarado en el caso fiscal",
            }),
            crearLineaCalculo({
              siteId: "anual.pagos.cuenta",
              instancia: 0,
              importe: centimosAEuros(pagosACuentaAplicadosCentimos),
              unidad: "EUR",
              etiqueta: "Pagos a cuenta",
              formula:
                retencionTrabajoAeat !== undefined
                  ? "Importe declarado más retención de trabajo estimada"
                  : "Importe declarado en el caso fiscal",
            }),
            crearLineaCalculo({
              siteId: "anual.cuota.diferencial",
              instancia: 0,
              importe: centimosAEuros(
                calcularCuotaDiferencialCentimos({
                  cuotaLiquidaCentimos:
                    importesLiquidacion.cuotaLiquidaCentimos,
                  pagosACuentaCentimos: pagosACuentaAplicadosCentimos,
                  retencionesSoportadasCentimos:
                    caso.retencionesSoportadasCentimos,
                })
              ),
              unidad: "EUR",
              etiqueta: "Cuota diferencial",
              formula: `${euros(cuotaLiquida)} - ${euros(centimosAEuros(caso.retencionesSoportadasCentimos))} - ${euros(centimosAEuros(pagosACuentaAplicadosCentimos))}`,
            }),
          ],
          fuentes: [],
        },
      ],
    },
  } satisfies LiquidacionIrpfAnualCalculada
  registrarTiempoAgregadoAuditoria(
    "liquidacion.salidaConRastro",
    tiempoAuditoriaMs() - inicioSalida
  )
  registrarTiempoAgregadoAuditoria(
    "liquidacion.trabajoIndividualSimple.total",
    tiempoAuditoriaMs() - inicioLiquidacionSimple
  )
  return { ...resultado, rastro: enlazarRastroAnualActual(resultado.rastro) }
})

const detectarCasoNoSoportado = Effect.fn(
  "LiquidacionIrpfAnual.detectarCasoNoSoportado"
)(function* (
  caso: CasoFiscalAnual,
  parametrosNormativos: ServicioParametrosNormativosIrpf
) {
  return yield* Option.match(Option.fromNullishOr(caso.deducciones[0]), {
    onNone: () => Effect.succeed(Option.none()),
    onSome: (deduccionPendiente) =>
      Effect.gen(function* () {
        const catalogada =
          yield* parametrosNormativos.obtenerDeduccionAutonomicaCatalogada(
            deduccionPendiente.codigo
          )

        const resultadoNoSoportado = {
          _tag: "ResultadoNoSoportado",
          motivo: Option.match(catalogada, {
            onNone: () =>
              `Deducción autonómica no catalogada: ${deduccionPendiente.codigo}`,
            onSome: (deduccionCatalogada) =>
              `Deducción autonómica reconocida no implementada: ${deduccionCatalogada.nombre}`,
          }),
          fuenteReconocida:
            "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
          rastro: rastroResultadoNoSoportado({
            caso,
            fuentePaso:
              "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
            tituloFuentePaso: "Manual Renta 2025 Parte 2",
            tituloPaso: Option.match(catalogada, {
              onNone: () => "Deducción autonómica no catalogada",
              onSome: () => "Deducción autonómica reconocida no implementada",
            }),
            descripcionPaso: Option.match(catalogada, {
              onNone: () =>
                `El motor ha recibido el codigo ${deduccionPendiente.codigo}, que no existe en el catalogo normalizado actual.`,
              onSome: (deduccionCatalogada) =>
                `El motor reconoce ${deduccionCatalogada.codigo} con estado ${deduccionCatalogada.estado}, pero todavia no tiene evaluador y tests para liquidarla.`,
            }),
          }),
        } satisfies ResultadoNoSoportado

        return Option.some(resultadoNoSoportado)
      }),
  })
})

const calcularMinimoPersonalYFamiliar = ({
  anio,
  minimos,
  situacionFamiliar,
}: {
  readonly anio: CasoFiscalAnual["anio"]
  readonly minimos: MinimosPersonalesFamiliaresIrpf
  readonly situacionFamiliar: SituacionFamiliarIndividual
}): Decimal => {
  const minimoContribuyente = obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  })
  const minimoAscendientes = obtenerMinimoAscendientes(
    situacionFamiliar.ascendientes,
    minimos
  )
  const minimoDescendientes = obtenerMinimoDescendientes(
    situacionFamiliar.descendientes,
    minimos
  )
  const minimoDiscapacidadContribuyente =
    obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos)
  const minimoDiscapacidadFamiliares = obtenerMinimoDiscapacidadFamiliares(
    situacionFamiliar.descendientes,
    minimos
  ).plus(
    obtenerMinimoDiscapacidadAscendientes(
      situacionFamiliar.ascendientes,
      minimos
    )
  )

  return minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliares)
}

const euros = (importe: Decimal): string => `${importe.toFixed(2)} euros`

const porcentaje = (tipo: Decimal): string => `${tipo.mul(100).toFixed(2)}%`

const pasoRetencionTrabajoAeat = (
  retencion: RetencionTrabajoCalculada
): RastroCalculo["pasos"][number] => ({
  _tag: "PasoExplicacion",
  titulo: "Retención estimada de trabajo",
  descripcion:
    "Retención anual estimada con el procedimiento no regularizado para rendimientos del trabajo.",
  lineasCalculo: [
    crearLineaCalculo({
      siteId: "anual.retencion.base",
      instancia: 0,
      importe: centimosAEuros(retencion.baseRetencionCentimos),
      unidad: "EUR",
      etiqueta: "Base de retención",
      formula: "Rendimiento neto reducido menos reducciones comunicadas",
    }),
    crearLineaCalculo({
      siteId: "anual.retencion.cuota",
      instancia: 0,
      importe: centimosAEuros(retencion.cuotaRetencionCentimos),
      unidad: "EUR",
      etiqueta: "Cuota de retención",
      formula: "Escala de retención sobre base menos escala sobre mínimo",
    }),
    crearLineaCalculo({
      siteId: "anual.retencion.tipo",
      instancia: 0,
      importe: new Decimal(retencion.tipoRetencionPorcentaje),
      unidad: "percent",
      etiqueta: "Tipo de retención",
      formula: "Tipo truncado a dos decimales",
    }),
    crearLineaCalculo({
      siteId: "anual.retencion.anual",
      instancia: 0,
      importe: centimosAEuros(retencion.importeRetencionAnualCentimos),
      unidad: "EUR",
      etiqueta: "Retención anual",
      formula: "Retribuciones x tipo de retención",
    }),
  ],
  fuentes: [
    {
      titulo: "Algoritmo de retenciones 2026",
      referencia: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
    },
  ],
})

const sumarDeduccionesAutonomicasCentimos = (caso: CasoFiscalAnual): number =>
  caso.deduccionAutonomicaAgregadaCentimos ?? 0

const deduccionesAutonomicasDescripcion = (caso: CasoFiscalAnual): string =>
  Match.value(caso.deduccionAutonomicaAgregadaCentimos).pipe(
    Match.when(
      (deduccionAutonomicaAgregadaCentimos) =>
        deduccionAutonomicaAgregadaCentimos === undefined ||
        deduccionAutonomicaAgregadaCentimos === 0,
      () => "Sin deducciones autonómicas declaradas en el caso"
    ),
    Match.orElse(() => "importe_agregado_no_desglosado")
  )

const rastroResultadoNoSoportado = ({
  caso,
  tituloPaso,
  descripcionPaso,
  fuentePaso = "docs/fuentes/aeat/manual-renta-2025-parte-1.md",
  tituloFuentePaso = "Manual Renta 2025 Parte 1",
}: {
  readonly caso: CasoFiscalAnual
  readonly tituloPaso: string
  readonly descripcionPaso: string
  readonly fuentePaso?: string
  readonly tituloFuentePaso?: string
}): RastroCalculo => ({
  titulo: `Liquidación anual del IRPF ${caso.anio}`,
  pasos: [
    {
      _tag: "PasoExplicacion",
      titulo: "Caso fiscal anual reconocido",
      descripcion: `El motor ha recibido un caso individual para la comunidad ${caso.comunidadAutonoma}.`,
      fuentes: [],
    },
    {
      _tag: "PasoExplicacion",
      titulo: tituloPaso,
      descripcion: descripcionPaso,
      fuentes: [
        {
          titulo: tituloFuentePaso,
          referencia: fuentePaso,
        },
      ],
    },
  ],
})

export { liquidarIrpfAnualExplicito } from "../trabajo-anual/conexion"
