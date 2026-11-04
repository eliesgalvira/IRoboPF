import Decimal from "decimal.js"
import { Effect } from "effect"
import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import { centimosAEuros } from "../../dinero/importe-monetario"
import { obtenerParametrosComunidadAutonoma as obtenerParametrosComunidadAutonomaPuro } from "../comunidades/comunidad-autonoma"
import {
  calcularCuotaPorEscala,
  calcularDesgloseCuotaPorEscala,
} from "../cuotas/escalas-gravamen"
import {
  calcularAhorroConMinimos,
  calcularCuotaPorEscalaAhorro,
  calcularDesgloseCuotaPorEscalaAhorro,
} from "../cuotas/cuota-integra-ahorro"
import {
  ESTATAL_ORDINARIA_2012_2014,
  ESTATAL_COMPLEMENTARIA_2012_2014,
  obtenerEscalaAutonomicaPublicada,
} from "../cuotas/escalas-publicadas"
import {
  calcularDerechosMinimos,
  validarDerechosMinimos,
  validarRentasAnualesDerechos,
  hayAlimentosPropiosSinMinimo,
} from "../minimos/derechos"
import { obtenerMinimoContribuyente } from "../minimos/minimo-contribuyente"
import { obtenerMinimoDiscapacidadContribuyente } from "../minimos/minimo-discapacidad"
import type { MinimosPersonalesFamiliaresIrpf } from "../../normativa/datos/minimos-autonomicos-2025"
import type { SituacionFamiliarIndividual } from "../caso-fiscal-anual"
import type { ResultadoNoSoportado } from "./liquidar-irpf-anual"
import { calcularDeduccionTrabajo } from "../trabajo-anual/calcular"

export type PoliticaAnual = "decimal-hasta-salida" | "open-empleo-madrid-2025"
/** Contrato interno: bases ya integradas en EUR Decimal; jamás reconstruye cotizaciones. */
export interface EntradaComposicionAnual {
  readonly ambito: Pick<
    CasoFiscalAnual,
    | "anio"
    | "comunidadAutonoma"
    | "fechaFallecimiento"
    | "situacionFamiliar"
    | "derechosMinimos"
  >
  readonly cotizaciones: {
    readonly naturaleza: "efectivas" | "estimadas-perfil-uniforme"
    readonly trabajador: Decimal
  }
  readonly precision: 20 | 80
  readonly politica: PoliticaAnual
  readonly baseGeneral: Decimal
  readonly baseAhorro: Decimal
  readonly rentasAntesReducciones: Decimal
  readonly minimosEstatales: MinimosPersonalesFamiliaresIrpf
  readonly deduccionesAutonomicasCentimos: number
  readonly serviciosLaborales?: { readonly bruto: Decimal } | undefined
}
const errorDerechosMinimos = ({
  motivo,
}: {
  readonly motivo: string
}): ResultadoNoSoportado => ({
  _tag: "ResultadoNoSoportado",
  motivo,
  fuenteReconocida: "docs/procedencia/API-MOTOR.md",
  rastro: { titulo: "Composición anual", pasos: [] },
})
export const cuantizarAnual = (
  importe: Decimal,
  politica: PoliticaAnual
): Decimal =>
  politica === "open-empleo-madrid-2025"
    ? importe.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    : importe

export const componerLiquidacionAnual = Effect.fn("Liquidacion.componerAnual")(
  function* (entrada: EntradaComposicionAnual) {
    const A = Decimal.clone({ precision: entrada.precision })
    const caso = entrada.ambito
    const baseLiquidableGeneral = A.max(0, entrada.baseGeneral)
    const baseLiquidableAhorro = new A(entrada.baseAhorro)
    const minimosEstatales = entrada.minimosEstatales
    const cuantizar = (importe: Decimal) =>
      cuantizarAnual(importe, entrada.politica)
    const gravar = (args: Parameters<typeof calcularCuotaPorEscala>[0]) =>
      cuantizar(calcularCuotaPorEscala({ ...args, aritmetica: A }))
    if (
      entrada.politica === "open-empleo-madrid-2025" &&
      (caso.anio !== 2025 ||
        caso.comunidadAutonoma !== "madrid" ||
        entrada.cotizaciones.naturaleza !== "efectivas")
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo: "Política Open limitada a empleo efectivo Madrid 2025",
        })
      )
    if (
      caso.situacionFamiliar.tipo !== "individual" ||
      caso.situacionFamiliar.descendientes.length !== 0 ||
      caso.situacionFamiliar.ascendientes.length !== 0
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo: "Modalidad o listas familiares parciales no soportadas",
        })
      )
    if (caso.derechosMinimos !== undefined) {
      const derechos = yield* validarDerechosMinimos(caso.derechosMinimos).pipe(
        Effect.mapError(errorDerechosMinimos)
      )
      if (
        caso.anio !== derechos.ejercicio ||
        caso.comunidadAutonoma !== derechos.territorio ||
        caso.fechaFallecimiento !== undefined ||
        caso.situacionFamiliar.edad !== derechos.edadContribuyenteDevengo ||
        hayAlimentosPropiosSinMinimo(derechos) ||
        caso.situacionFamiliar.discapacidad._tag !==
          derechos.discapacidadContribuyente._tag ||
        (caso.situacionFamiliar.discapacidad._tag === "Discapacidad33a64" &&
          derechos.discapacidadContribuyente._tag === "Discapacidad33a64" &&
          caso.situacionFamiliar.discapacidad
            .necesitaAyudaOMovilidadReducida !==
            derechos.discapacidadContribuyente.necesitaAyudaOMovilidadReducida)
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo: "Derechos incompatibles con ámbito o contribuyente anual",
          })
        )
      yield* validarRentasAnualesDerechos(
        derechos,
        entrada.rentasAntesReducciones
      ).pipe(Effect.mapError(errorDerechosMinimos))
    }
    const seleccion = obtenerParametrosComunidadAutonomaPuro({
      anio: caso.anio,
      comunidadAutonoma: caso.comunidadAutonoma,
      fechaFallecimiento: caso.fechaFallecimiento,
      baseLiquidableGeneral,
    })
    if (seleccion._tag === "ComunidadAutonomaNoSoportada")
      return yield* Effect.fail(errorDerechosMinimos(seleccion))
    const parametrosComunidad = seleccion
    const escalasPublicadasEstatales =
      caso.anio <= 2014 && caso.comunidadAutonoma !== "simulada-estatal"
        ? [ESTATAL_ORDINARIA_2012_2014, ESTATAL_COMPLEMENTARIA_2012_2014]
        : undefined
    const escalaPublicadaAutonomica = obtenerEscalaAutonomicaPublicada(caso)
    const escalasPublicadasAutonomicas =
      escalaPublicadaAutonomica === undefined
        ? undefined
        : [escalaPublicadaAutonomica]
    const usaEscalaAutonomicaReal =
      !parametrosComunidad.escalaAutonomicaIgualEstatal
    // El escenario simulado duplica la parte estatal del mismo selector.
    // No consulta otra tabla general ni representa una comunidad real.
    const tramosIrpfEstatalGeneral = usaEscalaAutonomicaReal
      ? parametrosComunidad.escalaEstatalGeneral
      : parametrosComunidad.escalaEstatalGeneral.map(
          ([limite, tipo]) => [limite, new A(tipo).mul(2)] as const
        )
    const cuotaIntegraGeneralEstatal = gravar({
      base: baseLiquidableGeneral,
      tramos: tramosIrpfEstatalGeneral,
      escalasPublicadas: escalasPublicadasEstatales,
    })
    const cuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
      ? gravar({
          base: baseLiquidableGeneral,
          tramos: parametrosComunidad.escalaAutonomica.tramos,
          escalasPublicadas: escalasPublicadasAutonomicas,
        })
      : baseLiquidableGeneral.mul(0)
    const cuotaIntegraGeneral = cuotaIntegraGeneralEstatal.plus(
      cuotaIntegraGeneralAutonomica
    )
    const cuotaIntegraAhorro = calcularCuotaPorEscalaAhorro({
      aritmetica: A,
      anio: caso.anio,
      base: baseLiquidableAhorro,
    })
    const desgloseCuotaIntegraGeneralEstatal = calcularDesgloseCuotaPorEscala({
      aritmetica: A,
      base: baseLiquidableGeneral,
      tramos: tramosIrpfEstatalGeneral,
      escalasPublicadas: escalasPublicadasEstatales,
    })
    const desgloseCuotaIntegraGeneralAutonomica = usaEscalaAutonomicaReal
      ? calcularDesgloseCuotaPorEscala({
          aritmetica: A,
          base: baseLiquidableGeneral,
          tramos: parametrosComunidad.escalaAutonomica.tramos,
          escalasPublicadas: escalasPublicadasAutonomicas,
        })
      : []
    const desgloseCuotaIntegraAhorro = calcularDesgloseCuotaPorEscalaAhorro({
      aritmetica: A,
      anio: caso.anio,
      base: baseLiquidableAhorro,
    })
    const derechosEstatales =
      caso.derechosMinimos === undefined
        ? undefined
        : yield* calcularDerechosMinimos(
            caso.derechosMinimos,
            minimosEstatales,
            A
          ).pipe(Effect.mapError(errorDerechosMinimos))
    const derechosAutonomicos =
      caso.derechosMinimos === undefined
        ? undefined
        : yield* calcularDerechosMinimos(
            caso.derechosMinimos,
            parametrosComunidad.minimosAutonomicos,
            A
          ).pipe(Effect.mapError(errorDerechosMinimos))
    const minimoContribuyente =
      derechosEstatales?.contribuyente ??
      obtenerMinimoContribuyente({
        anio: caso.anio,
        edad: caso.situacionFamiliar.edad,
        minimos: minimosEstatales,
      })
    const minimoAscendientes = derechosEstatales?.ascendientes ?? new A(0)
    const minimoDescendientes = derechosEstatales?.descendientes ?? new A(0)
    const minimoDiscapacidadContribuyente =
      derechosEstatales?.discapacidadContribuyente ??
      obtenerMinimoDiscapacidadContribuyente(
        caso.situacionFamiliar,
        minimosEstatales
      )
    const minimoDiscapacidadFamiliares =
      derechosEstatales?.discapacidadFamiliares ?? new A(0)
    const minimoPersonalYFamiliar = new A(minimoContribuyente)
      .plus(minimoDescendientes)
      .plus(minimoAscendientes)
      .plus(minimoDiscapacidadContribuyente)
      .plus(minimoDiscapacidadFamiliares)
    const minimoPersonalYFamiliarAutonomico =
      derechosAutonomicos?.total ??
      calcularMinimoPersonalYFamiliar({
        aritmetica: A,
        situacionFamiliar: caso.situacionFamiliar,
        anio: caso.anio,
        minimos: parametrosComunidad.minimosAutonomicos,
      })
    const cuotaMinimoPersonalEstatal = gravar({
      base: A.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      tramos: tramosIrpfEstatalGeneral,
      escalasPublicadas: escalasPublicadasEstatales,
    })
    const cuotaMinimoPersonalAutonomica = usaEscalaAutonomicaReal
      ? gravar({
          base: A.min(minimoPersonalYFamiliarAutonomico, baseLiquidableGeneral),
          tramos: parametrosComunidad.escalaAutonomica.tramos,
          escalasPublicadas: escalasPublicadasAutonomicas,
        })
      : minimoPersonalYFamiliar.mul(0)
    const cuotaMinimoPersonal = cuotaMinimoPersonalEstatal.plus(
      cuotaMinimoPersonalAutonomica
    )
    const ahorroConMinimos = calcularAhorroConMinimos({
      aritmetica: A,
      anio: caso.anio,
      base: baseLiquidableAhorro,
      baseGeneral: baseLiquidableGeneral,
      minimoEstatal: minimoPersonalYFamiliar,
      minimoAutonomico: minimoPersonalYFamiliarAutonomico,
    })
    const cuotaMinimoPersonalAhorro = ahorroConMinimos.estatal.minoracion.plus(
      ahorroConMinimos.autonomico.minoracion
    )
    const desgloseCuotaMinimoPersonalEstatal = calcularDesgloseCuotaPorEscala({
      aritmetica: A,
      base: A.min(minimoPersonalYFamiliar, baseLiquidableGeneral),
      tramos: tramosIrpfEstatalGeneral,
      escalasPublicadas: escalasPublicadasEstatales,
    })
    const desgloseCuotaMinimoPersonalAutonomica = usaEscalaAutonomicaReal
      ? calcularDesgloseCuotaPorEscala({
          aritmetica: A,
          base: A.min(minimoPersonalYFamiliarAutonomico, baseLiquidableGeneral),
          tramos: parametrosComunidad.escalaAutonomica.tramos,
          escalasPublicadas: escalasPublicadasAutonomicas,
        })
      : []
    const cuotaEstatalDespuesMinimo = A.max(
      0,
      cuotaIntegraGeneralEstatal.minus(cuotaMinimoPersonalEstatal)
    )
    const cuotaGeneralDespuesMinimo = A.max(
      0,
      cuotaIntegraGeneral.minus(cuotaMinimoPersonal)
    )
    const cuotaAutonomicaGeneralDespuesMinimo = A.max(
      0,
      cuotaIntegraGeneralAutonomica.minus(cuotaMinimoPersonalAutonomica)
    )
    const cuotaAhorroDespuesMinimo = A.max(
      0,
      cuotaIntegraAhorro.minus(cuotaMinimoPersonalAhorro)
    )
    const deduccionesAutonomicasDeclaradas = centimosAEuros(
      entrada.deduccionesAutonomicasCentimos
    )
    const deduccionesAutonomicasAplicadas = usaEscalaAutonomicaReal
      ? A.min(
          deduccionesAutonomicasDeclaradas,
          cuotaAutonomicaGeneralDespuesMinimo.plus(
            ahorroConMinimos.autonomico.despuesMinimo
          )
        )
      : deduccionesAutonomicasDeclaradas
    const cuotaLiquida = A.max(
      0,
      cuotaGeneralDespuesMinimo
        .plus(cuotaAhorroDespuesMinimo)
        .minus(deduccionesAutonomicasAplicadas)
    )
    if (
      entrada.serviciosLaborales !== undefined &&
      (caso.anio !== 2025 ||
        caso.comunidadAutonoma !== "madrid" ||
        entrada.baseAhorro.isZero() === false ||
        caso.derechosMinimos !== undefined)
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo:
            "DA61 anual integrada limitada al perfil efectivo Madrid 2025 sin otras rentas ni derechos",
        })
      )
    let deduccionTrabajo = new A(0)
    if (
      entrada.serviciosLaborales !== undefined &&
      entrada.serviciosLaborales.bruto.gt(0)
    ) {
      const resultado = calcularDeduccionTrabajo({
        regla: "da61",
        ambito: "comun-individual",
        ejercicio: 2025,
        brutoServicios: entrada.serviciosLaborales.bruto.toFixed(),
        otrasRentasNoExentas: "0",
        netoReducidoServicios: baseLiquidableGeneral.toFixed(),
        baseLiquidableGeneral: baseLiquidableGeneral.toFixed(),
        cuotaIntegraGeneral: cuotaLiquida.toFixed(),
        cuotaLiquidaTotal: cuotaLiquida.toFixed(),
        cuotaTrasArt80: cuotaLiquida.toFixed(),
        etapa: "despues-art80-sin-deduccion-trabajo",
        calificacion: "laboral-estatutaria-acreditada",
      })
      if (resultado.estado === "no-soportado")
        return yield* Effect.fail(errorDerechosMinimos(resultado))
      deduccionTrabajo = cuantizar(new A(resultado.importeAplicable))
    }
    const cuotaPosterior = cuotaLiquida.minus(deduccionTrabajo)
    return {
      cotizaciones: entrada.cotizaciones,
      cuotaEstatalDespuesMinimo,
      parametrosComunidad,
      escalaPublicadaAutonomica,
      usaEscalaAutonomicaReal,
      cuotaIntegraGeneral,
      cuotaIntegraAhorro,
      desgloseCuotaIntegraGeneralEstatal,
      desgloseCuotaIntegraGeneralAutonomica,
      desgloseCuotaIntegraAhorro,
      derechosEstatales,
      minimoContribuyente,
      minimoAscendientes,
      minimoDescendientes,
      minimoDiscapacidadContribuyente,
      minimoDiscapacidadFamiliares,
      minimoPersonalYFamiliar,
      minimoPersonalYFamiliarAutonomico,
      cuotaMinimoPersonal,
      ahorroConMinimos,
      cuotaMinimoPersonalAhorro,
      desgloseCuotaMinimoPersonalEstatal,
      desgloseCuotaMinimoPersonalAutonomica,
      cuotaGeneralDespuesMinimo,
      cuotaAutonomicaGeneralDespuesMinimo,
      cuotaAhorroDespuesMinimo,
      deduccionesAutonomicasAplicadas,
      cuotaLiquida,
      cuotaIntegraGeneralEstatal,
      cuotaIntegraGeneralAutonomica,
      cuotaMinimoPersonalEstatal,
      cuotaMinimoPersonalAutonomica,
      deduccionTrabajo,
      cuotaPosterior,
    }
  }
)

const calcularMinimoPersonalYFamiliar = ({
  aritmetica: A,
  anio,
  minimos,
  situacionFamiliar,
}: {
  readonly aritmetica: Decimal.Constructor
  readonly anio: CasoFiscalAnual["anio"]
  readonly minimos: MinimosPersonalesFamiliaresIrpf
  readonly situacionFamiliar: SituacionFamiliarIndividual
}): Decimal => {
  const minimoContribuyente = obtenerMinimoContribuyente({
    anio,
    edad: situacionFamiliar.edad,
    minimos,
  })
  return new A(minimoContribuyente).plus(
    obtenerMinimoDiscapacidadContribuyente(situacionFamiliar, minimos)
  )
}
