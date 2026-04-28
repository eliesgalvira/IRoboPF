import Decimal from "decimal.js"
import { Context, Effect, Layer, Option } from "effect"

import type {
  CasoFiscalAnual,
  SituacionFamiliarIndividual,
} from "../caso-fiscal-anual"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import {
  centimosAEuros,
  PoliticaMonetaria,
  type ServicioPoliticaMonetaria,
} from "../../dinero/importe-monetario"
import {
  CotizacionesSociales,
  type ServicioCotizacionesSociales,
} from "../../laboral/cotizaciones-sociales"
import type { MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import {
  ParametrosNormativosIrpf,
  type ServicioParametrosNormativosIrpf,
} from "../comunidades/comunidad-autonoma"
import { calcularCuotaDiferencialCentimos } from "../cuotas/cuota-diferencial"
import {
  calcularCuotaPorEscalaAhorro,
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
import { calcularReduccionRendimientosTrabajo } from "../reducciones/reduccion-rendimientos-trabajo"
import {
  calcularConciliacionSimuladorLegacy,
  type ConciliacionSimuladorLegacy,
} from "./conciliacion-simulador-legacy"

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

export type LiquidarIrpfAnualError = ResultadoNoSoportado

interface DependenciasLiquidacionIrpfAnual {
  readonly cotizacionesSociales: ServicioCotizacionesSociales
  readonly parametrosNormativos: ServicioParametrosNormativosIrpf
  readonly politicaMonetaria: ServicioPoliticaMonetaria
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

    const resultadoNoSoportado = yield* detectarCasoNoSoportado(
      caso,
      dependencias.parametrosNormativos
    )
    if (Option.isSome(resultadoNoSoportado)) {
      return yield* Effect.fail(resultadoNoSoportado.value)
    }

    return yield* liquidarTrabajoIndividualSimple(caso, dependencias)
  })

export class LiquidacionIrpfAnual extends Context.Service<
  LiquidacionIrpfAnual,
  {
    readonly liquidar: (
      caso: CasoFiscalAnual,
      contexto: ContextoLiquidacionIrpf
    ) => Effect.Effect<LiquidacionIrpfAnualCalculada, LiquidarIrpfAnualError>
  }
>()("@irobopf/dominio/irpf/LiquidacionIrpfAnual") {
  static readonly layer = Layer.effect(
    LiquidacionIrpfAnual,
    Effect.gen(function* () {
      const cotizacionesSociales = yield* CotizacionesSociales
      const parametrosNormativos = yield* ParametrosNormativosIrpf
      const politicaMonetaria = yield* PoliticaMonetaria

      return {
        liquidar: construirLiquidarIrpfAnual({
          cotizacionesSociales,
          parametrosNormativos,
          politicaMonetaria,
        }),
      }
    })
  ).pipe(
    Layer.provideMerge(CotizacionesSociales.layer),
    Layer.provideMerge(ParametrosNormativosIrpf.layer),
    Layer.provideMerge(PoliticaMonetaria.layer)
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
  liquidarIrpfAnualDesdeServicio(caso, contexto).pipe(
    Effect.provide(LiquidacionIrpfAnual.layer)
  )

const liquidarTrabajoIndividualSimple = Effect.fn(
  "LiquidacionIrpfAnual.liquidarTrabajoIndividualSimple"
)(function* (
  caso: CasoFiscalAnual,
  dependencias: DependenciasLiquidacionIrpfAnual
) {
  const liquidarCentimos = (importe: Decimal) =>
    dependencias.politicaMonetaria.importeLiquidadoACentimos(importe)

  const rendimientoIntegroTrabajo = sumarRendimientosTrabajo(
    caso.rendimientos.trabajo,
    centimosAEuros
  )
  const minimosEstatales =
    dependencias.parametrosNormativos.minimosEstatales2025
  const tramosIrpfEstatalGeneral =
    dependencias.parametrosNormativos.tramosIrpfEstatalGeneral2025
  const parametrosComunidad =
    yield* dependencias.parametrosNormativos.obtenerParametrosComunidadAutonoma(
      {
        anio: caso.anio,
        comunidadAutonoma: caso.comunidadAutonoma,
      }
    )
  if (parametrosComunidad._tag === "ComunidadAutonomaNoSoportada") {
    const resultadoNoSoportado = {
      _tag: "ResultadoNoSoportado",
      motivo: parametrosComunidad.motivo,
      fuenteReconocida: parametrosComunidad.fuenteReconocida,
      rastro: rastroResultadoNoSoportado({
        caso,
        fuentePaso:
          "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
        tituloFuentePaso: "Manual Renta 2025 Parte 2",
        tituloPaso: "Comunidad autonoma no soportada",
        descripcionPaso:
          "El caso fiscal reconoce una comunidad autonoma real, pero esta version del motor solo calcula el caso tecnico de contraste con tramo autonomico igualado al estatal.",
      }),
    } satisfies ResultadoNoSoportado

    return yield* Effect.fail(resultadoNoSoportado)
  }
  const rendimientoTrabajo = calcularRendimientoNetoTrabajo({
    anio: caso.anio,
    rendimientoIntegro: rendimientoIntegroTrabajo,
  })
  const cotizacionesSociales =
    yield* dependencias.cotizacionesSociales.desglosarLegacy({
      anio: caso.anio,
      salarioBrutoAnual: rendimientoIntegroTrabajo,
    })
  const rendimientoIntegroCapitalInmobiliario =
    sumarRendimientosCapitalInmobiliario(
      caso.rendimientos.capitalInmobiliario ?? [],
      centimosAEuros
    )
  const rendimientoCapitalInmobiliario =
    calcularRendimientoNetoCapitalInmobiliarioSimplificado({
      rendimientoIntegro: rendimientoIntegroCapitalInmobiliario,
    })
  const reduccionRendimientosTrabajo = calcularReduccionRendimientosTrabajo({
    anio: caso.anio,
    rendimientoPrevioNeto: rendimientoTrabajo.rendimientoPrevioNeto,
  })
  const baseImponibleGeneral = calcularBaseImponibleGeneral({
    reduccionRendimientosTrabajo,
    rendimientoCapitalInmobiliario,
    rendimientoTrabajo,
  })
  const baseLiquidableGeneral = baseImponibleGeneral
  const gananciasPatrimoniales = calcularGananciasPatrimonialesPorTransmision({
    edadContribuyente: caso.situacionFamiliar.edad,
    ganancias: caso.rendimientos.gananciasPatrimoniales ?? [],
    convertirCentimos: centimosAEuros,
  })
  const baseLiquidableAhorro = calcularBaseImponibleAhorro({
    gananciasPatrimoniales,
  })
  const usaEscalaAutonomicaReal =
    !parametrosComunidad.escalaAutonomicaIgualEstatal
  const cuotaIntegraGeneralEstatal = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: tramosIrpfEstatalGeneral,
      })
    : calcularCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: baseLiquidableGeneral,
      })
  const cuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
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
      })
    : calcularDesgloseCuotaPorEscalaGeneral({
        anio: caso.anio,
        base: baseLiquidableGeneral,
      })
  const desgloseCuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: baseLiquidableGeneral,
        tramos: parametrosComunidad.escalaAutonomica.tramos,
      })
    : []
  const desgloseCuotaIntegraAhorro = calcularDesgloseCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  })
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
  const cuotaMinimoPersonalEstatal = usaEscalaAutonomicaReal
    ? calcularCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
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
      })
    : minimoPersonalYFamiliar.mul(0)
  const cuotaMinimoPersonal = cuotaMinimoPersonalEstatal.plus(
    cuotaMinimoPersonalAutonomica
  )
  const remanenteMinimoPersonalParaAhorro = Decimal.max(
    0,
    minimoPersonalYFamiliar.minus(baseLiquidableGeneral)
  )
  const remanenteMinimoPersonalAutonomicoParaAhorro = Decimal.max(
    0,
    minimoPersonalYFamiliarAutonomico.minus(baseLiquidableGeneral)
  )
  const cuotaMinimoPersonalAhorro = calcularCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: Decimal.min(
      Decimal.max(
        remanenteMinimoPersonalParaAhorro,
        remanenteMinimoPersonalAutonomicoParaAhorro
      ),
      baseLiquidableAhorro
    ),
  })
  const desgloseCuotaMinimoPersonalEstatal = usaEscalaAutonomicaReal
    ? calcularDesgloseCuotaPorEscala({
        base: Decimal.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
        tramos: tramosIrpfEstatalGeneral,
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
      })
    : []
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
        cuotaAutonomicaGeneralDespuesMinimo
      )
    : deduccionesAutonomicasDeclaradas
  const cuotaLiquida = Decimal.max(
    0,
    cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo)
      .minus(deduccionesAutonomicasAplicadas)
  )
  const importesLiquidacion = yield* Effect.all({
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
      rendimientoIntegroTrabajo.plus(cotizacionesSociales.cotizacionEmpresarial)
    ),
    meiEmpresarialCentimos: liquidarCentimos(
      cotizacionesSociales.meiEmpresarial
    ),
    meiTrabajadorCentimos: liquidarCentimos(cotizacionesSociales.meiTrabajador),
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
  const cuotaDiferencialCentimos = calcularCuotaDiferencialCentimos({
    cuotaLiquidaCentimos: importesLiquidacion.cuotaLiquidaCentimos,
    pagosACuentaCentimos: caso.pagosACuentaCentimos,
    retencionesSoportadasCentimos: caso.retencionesSoportadasCentimos,
  })

  return {
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
      caso.retencionesSoportadasCentimos + caso.pagosACuentaCentimos,
    cuotaDiferencialCentimos,
    conciliacionSimuladorLegacy: calcularConciliacionSimuladorLegacy({
      anio: caso.anio,
      rendimientoIntegroTrabajoCentimos:
        importesLiquidacion.rendimientoIntegroTrabajoCentimos,
      cuotaLiquidaCentimos: importesLiquidacion.cuotaLiquidaCentimos,
      cuotaDiferencialCentimos,
    }),
    rastro: {
      titulo: `Liquidacion anual del IRPF ${caso.anio}`,
      pasos: [
        {
          _tag: "PasoExplicacion",
          titulo: "Rendimientos del trabajo",
          descripcion: `Rendimiento integro ${rendimientoIntegroTrabajo.toFixed(2)} euros menos cotizacion del trabajador y gastos deducibles.`,
          lineasCalculo: [
            {
              etiqueta: "Rendimiento integro del trabajo",
              formula: "Suma de importes declarados como trabajo",
              resultado: euros(rendimientoTrabajo.rendimientoIntegro),
            },
            {
              etiqueta: "Cotizacion deducible del trabajador",
              formula: "Cotizaciones sociales calculadas para el salario anual",
              resultado: euros(rendimientoTrabajo.cotizacionTrabajador),
            },
            {
              etiqueta: "Rendimiento previo neto",
              formula: `${euros(rendimientoTrabajo.rendimientoIntegro)} - ${euros(rendimientoTrabajo.cotizacionTrabajador)}`,
              resultado: euros(rendimientoTrabajo.rendimientoPrevioNeto),
            },
            {
              etiqueta: "Gastos deducibles aplicados",
              formula: "Gasto fijo del rendimiento del trabajo",
              resultado: euros(rendimientoTrabajo.gastosDeducibles),
            },
            {
              etiqueta: "Rendimiento neto del trabajo",
              formula: `max(0, ${euros(rendimientoTrabajo.rendimientoPrevioNeto)} - ${euros(rendimientoTrabajo.gastosDeducibles)})`,
              resultado: euros(rendimientoTrabajo.rendimientoNeto),
            },
            {
              etiqueta: "Reduccion por rendimientos del trabajo",
              formula:
                "Reduccion estatal por obtencion de rendimientos del trabajo",
              resultado: euros(reduccionRendimientosTrabajo),
            },
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
            "Desglose de cotizaciones sociales usado por el caso tecnico actual: aportacion empresarial, aportacion del trabajador, MEI y cuota adicional de solidaridad cuando existe exceso sobre la base maxima.",
          lineasCalculo: [
            {
              etiqueta: "Base ordinaria de cotizacion",
              formula:
                "min(rendimiento integro del trabajo, base maxima anual)",
              resultado: euros(cotizacionesSociales.baseOrdinaria),
            },
            {
              etiqueta: "Exceso sobre base maxima",
              formula:
                "max(0, rendimiento integro del trabajo - base maxima anual)",
              resultado: euros(cotizacionesSociales.excesoBase),
            },
            {
              etiqueta: "Cotizacion empresarial ordinaria",
              formula:
                "Base ordinaria x tipos empresariales sin MEI ni solidaridad",
              resultado: euros(
                cotizacionesSociales.cotizacionEmpresarialOrdinaria
              ),
            },
            {
              etiqueta: "Cotizacion del trabajador ordinaria",
              formula:
                "Base ordinaria x tipos del trabajador sin MEI ni solidaridad",
              resultado: euros(
                cotizacionesSociales.cotizacionTrabajadorOrdinaria
              ),
            },
            {
              etiqueta: "MEI empresarial",
              formula: "Base ordinaria x tipo empresarial del MEI",
              resultado: euros(cotizacionesSociales.meiEmpresarial),
            },
            {
              etiqueta: "MEI del trabajador",
              formula: "Base ordinaria x tipo del trabajador del MEI",
              resultado: euros(cotizacionesSociales.meiTrabajador),
            },
            {
              etiqueta: "Solidaridad empresarial",
              formula: "5/6 de la cuota adicional de solidaridad",
              resultado: euros(cotizacionesSociales.solidaridadEmpresarial),
            },
            {
              etiqueta: "Solidaridad del trabajador",
              formula: "1/6 de la cuota adicional de solidaridad",
              resultado: euros(cotizacionesSociales.solidaridadTrabajador),
            },
            {
              etiqueta: "Cotizacion empresarial total",
              formula:
                "Ordinaria empresarial + MEI empresarial + solidaridad empresarial",
              resultado: euros(cotizacionesSociales.cotizacionEmpresarial),
            },
            {
              etiqueta: "Cotizacion total del trabajador",
              formula:
                "Ordinaria trabajador + MEI trabajador + solidaridad trabajador",
              resultado: euros(cotizacionesSociales.cotizacionTrabajador),
            },
            {
              etiqueta: "Coste laboral",
              formula:
                "Rendimiento integro del trabajo + cotizacion empresarial",
              resultado: euros(
                rendimientoIntegroTrabajo.plus(
                  cotizacionesSociales.cotizacionEmpresarial
                )
              ),
            },
          ],
          fuentes: [
            {
              titulo: "Parametros Seguridad Social 2012-2026",
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
          descripcion: `Rendimiento integro ${rendimientoCapitalInmobiliario.rendimientoIntegro.toFixed(2)} euros integrado como rendimiento neto simplificado en la base general.`,
          lineasCalculo: [
            {
              etiqueta: "Rendimiento integro de capital inmobiliario",
              formula: "Suma de importes declarados en el formulario",
              resultado: euros(
                rendimientoCapitalInmobiliario.rendimientoIntegro
              ),
            },
            {
              etiqueta: "Rendimiento neto simplificado",
              formula:
                "Sin gastos, amortizaciones ni reducciones especificas todavia implementadas",
              resultado: euros(rendimientoCapitalInmobiliario.rendimientoNeto),
            },
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
          titulo: "Base general y minimo personal",
          descripcion: `Base liquidable general ${baseLiquidableGeneral.toFixed(2)} euros, minimo estatal ${minimoPersonalYFamiliar.toFixed(2)} euros y minimo autonomico ${minimoPersonalYFamiliarAutonomico.toFixed(2)} euros.`,
          lineasCalculo: [
            {
              etiqueta: "Base imponible general",
              formula: `max(0, ${euros(rendimientoTrabajo.rendimientoNeto)} - ${euros(reduccionRendimientosTrabajo)}) + ${euros(rendimientoCapitalInmobiliario.rendimientoNeto)}`,
              resultado: euros(baseImponibleGeneral),
            },
            {
              etiqueta: "Base liquidable general",
              formula:
                "Base imponible general sin reducciones de base aplicadas",
              resultado: euros(baseLiquidableGeneral),
            },
            {
              etiqueta: "Minimo del contribuyente",
              formula: `Edad del contribuyente: ${caso.situacionFamiliar.edad}`,
              resultado: euros(minimoContribuyente),
            },
            {
              etiqueta: "Minimo por ascendientes",
              formula: `${caso.situacionFamiliar.ascendientes.length} ascendiente(s) computados`,
              resultado: euros(minimoAscendientes),
            },
            {
              etiqueta: "Minimo por descendientes",
              formula: `${caso.situacionFamiliar.descendientes.length} descendiente(s) computados`,
              resultado: euros(minimoDescendientes),
            },
            {
              etiqueta: "Minimo personal y familiar",
              formula: `${euros(minimoContribuyente)} + ${euros(minimoDescendientes)} + ${euros(minimoAscendientes)} + ${euros(minimoDiscapacidadContribuyente)} + ${euros(minimoDiscapacidadFamiliares)}`,
              resultado: euros(minimoPersonalYFamiliar),
            },
            {
              etiqueta: "Minimo personal y familiar autonomico",
              formula: parametrosComunidad.minimoAutonomicoIgualEstatal
                ? "Coincide con el minimo estatal"
                : `Minimos autonomicos IRPF 2025 de ${parametrosComunidad.escalaAutonomica.nombre}`,
              resultado: euros(minimoPersonalYFamiliarAutonomico),
            },
            {
              etiqueta: "Minimo por discapacidad",
              formula:
                "Contribuyente, descendientes y ascendientes con discapacidad computados",
              resultado: euros(
                minimoDiscapacidadContribuyente.plus(
                  minimoDiscapacidadFamiliares
                )
              ),
            },
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
            "Las ganancias patrimoniales por transmisión se integran en la base del ahorro salvo la parte exenta reconocida para mayores de 65 años.",
          lineasCalculo: [
            {
              etiqueta: "Ganancias patrimoniales declaradas",
              formula: "Suma de ganancias por transmisión",
              resultado: euros(gananciasPatrimoniales.gananciaTotal),
            },
            {
              etiqueta: "Ganancia patrimonial exenta",
              formula:
                "Exenciones por vivienda habitual o reinversión en renta vitalicia para mayores de 65 años",
              resultado: euros(gananciasPatrimoniales.gananciaExenta),
            },
            {
              etiqueta: "Base liquidable del ahorro",
              formula: `max(0, ${euros(gananciasPatrimoniales.gananciaTotal)} - ${euros(gananciasPatrimoniales.gananciaExenta)})`,
              resultado: euros(baseLiquidableAhorro),
            },
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
          titulo: "Comunidad autonoma",
          descripcion: parametrosComunidad.escalaAutonomicaIgualEstatal
            ? "Caso tecnico de contraste: los minimos y la escala autonomica se igualan a los parametros estatales. No representa la normativa propia de una comunidad autonoma real."
            : `La comunidad autonoma ${parametrosComunidad.escalaAutonomica.nombre} aplica su escala autonomica general de 2025. La cuota general se calcula como cuota estatal mas cuota autonomica, y las deducciones autonomicas se restan despues de minorar por el minimo personal y familiar.`,
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
          titulo: "Cuota integra general",
          descripcion: usaEscalaAutonomicaReal
            ? "Aplicacion separada de la escala estatal y la escala autonomica de la comunidad a la base liquidable general."
            : "Aplicacion de la escala general a la base liquidable general.",
          lineasCalculo: [
            ...desgloseCuotaIntegraGeneralEstatal.map((tramo) => ({
              etiqueta: usaEscalaAutonomicaReal
                ? `Tramo estatal ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`
                : `Tramo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            ...desgloseCuotaIntegraGeneralAutonomica.map((tramo) => ({
              etiqueta: `Tramo autonomico ${parametrosComunidad.escalaAutonomica.nombre} ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            {
              etiqueta: "Cuota integra general",
              formula: usaEscalaAutonomicaReal
                ? "Suma de cuota estatal general y cuota autonomica general"
                : "Suma de cuotas por tramo",
              resultado: euros(cuotaIntegraGeneral),
            },
          ],
          fuentes: [
            {
              titulo: "Parametros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota correspondiente al minimo personal",
          descripcion: usaEscalaAutonomicaReal
            ? "Aplicacion de la escala estatal y autonomica al minimo personal y familiar para minorar la cuota integra general."
            : "Aplicacion de la misma escala general al minimo personal y familiar.",
          lineasCalculo: [
            ...desgloseCuotaMinimoPersonalEstatal.map((tramo) => ({
              etiqueta: usaEscalaAutonomicaReal
                ? `Tramo minimo estatal ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`
                : `Tramo minimo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            ...desgloseCuotaMinimoPersonalAutonomica.map((tramo) => ({
              etiqueta: `Tramo minimo autonomico ${parametrosComunidad.escalaAutonomica.nombre} ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            {
              etiqueta: "Cuota del minimo personal y familiar",
              formula: "Suma de cuotas por tramo del minimo",
              resultado: euros(cuotaMinimoPersonal),
            },
          ],
          fuentes: [
            {
              titulo: "Parametros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota integra del ahorro",
          descripcion:
            "Aplicacion de la escala del ahorro a la base liquidable del ahorro.",
          lineasCalculo: [
            ...desgloseCuotaIntegraAhorro.map((tramo) => ({
              etiqueta: `Tramo ahorro ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            {
              etiqueta: "Cuota integra del ahorro",
              formula: "Suma de cuotas por tramo",
              resultado: euros(cuotaIntegraAhorro),
            },
            {
              etiqueta: "Cuota del remanente del minimo personal",
              formula:
                "Parte del minimo personal y familiar no absorbida por la base general",
              resultado: euros(cuotaMinimoPersonalAhorro),
            },
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
          titulo: "Cuota diferencial",
          descripcion: `Cuota liquida ${cuotaLiquida.toFixed(2)} euros menos retenciones y pagos a cuenta declarados.`,
          lineasCalculo: [
            {
              etiqueta: "Cuota liquida",
              formula: `max(0, ${euros(cuotaGeneralDespuesMinimo)} + ${euros(cuotaAhorroDespuesMinimo)} - ${euros(deduccionesAutonomicasAplicadas)})`,
              resultado: euros(cuotaLiquida),
            },
            {
              etiqueta: "Deducciones autonomicas aplicadas",
              formula: usaEscalaAutonomicaReal
                ? `${deduccionesAutonomicasDescripcion(caso)}; limite por cuota autonomica general disponible ${euros(cuotaAutonomicaGeneralDespuesMinimo)}`
                : deduccionesAutonomicasDescripcion(caso),
              resultado: euros(deduccionesAutonomicasAplicadas),
            },
            {
              etiqueta: "Retenciones soportadas",
              formula: "Importe declarado en el caso fiscal",
              resultado: euros(
                centimosAEuros(caso.retencionesSoportadasCentimos)
              ),
            },
            {
              etiqueta: "Pagos a cuenta",
              formula: "Importe declarado en el caso fiscal",
              resultado: euros(centimosAEuros(caso.pagosACuentaCentimos)),
            },
            {
              etiqueta: "Cuota diferencial",
              formula: `${euros(cuotaLiquida)} - ${euros(centimosAEuros(caso.retencionesSoportadasCentimos))} - ${euros(centimosAEuros(caso.pagosACuentaCentimos))}`,
              resultado: euros(
                centimosAEuros(
                  calcularCuotaDiferencialCentimos({
                    cuotaLiquidaCentimos:
                      importesLiquidacion.cuotaLiquidaCentimos,
                    pagosACuentaCentimos: caso.pagosACuentaCentimos,
                    retencionesSoportadasCentimos:
                      caso.retencionesSoportadasCentimos,
                  })
                )
              ),
            },
          ],
          fuentes: [],
        },
      ],
    },
  } satisfies LiquidacionIrpfAnualCalculada
})

const detectarCasoNoSoportado = Effect.fn(
  "LiquidacionIrpfAnual.detectarCasoNoSoportado"
)(function* (
  caso: CasoFiscalAnual,
  parametrosNormativos: ServicioParametrosNormativosIrpf
) {
  const deduccionPendiente = caso.deducciones[0]
  if (deduccionPendiente) {
    const catalogada =
      yield* parametrosNormativos.obtenerDeduccionAutonomicaCatalogada(
        deduccionPendiente.codigo
      )

    const resultadoNoSoportado = {
      _tag: "ResultadoNoSoportado",
      motivo: Option.match(catalogada, {
        onNone: () =>
          `Deduccion autonomica no catalogada: ${deduccionPendiente.codigo}`,
        onSome: (deduccionCatalogada) =>
          `Deduccion autonomica reconocida no implementada: ${deduccionCatalogada.nombre}`,
      }),
      fuenteReconocida:
        "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
      rastro: rastroResultadoNoSoportado({
        caso,
        fuentePaso:
          "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
        tituloFuentePaso: "Manual Renta 2025 Parte 2",
        tituloPaso: Option.match(catalogada, {
          onNone: () => "Deduccion autonomica no catalogada",
          onSome: () => "Deduccion autonomica reconocida no implementada",
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
  }

  return Option.none()
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

const sumarDeduccionesAutonomicasCentimos = (caso: CasoFiscalAnual): number =>
  caso.deduccionAutonomicaAgregadaCentimos ?? 0

const deduccionesAutonomicasDescripcion = (caso: CasoFiscalAnual): string => {
  if (!caso.deduccionAutonomicaAgregadaCentimos) {
    return "Sin deducciones autonomicas declaradas en el caso"
  }

  return "importe_agregado_no_desglosado"
}

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
  titulo: `Liquidacion anual del IRPF ${caso.anio}`,
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
