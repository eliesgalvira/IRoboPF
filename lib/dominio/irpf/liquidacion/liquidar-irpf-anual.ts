import Decimal from "decimal.js"

import type { CasoFiscalAnual } from "../caso-fiscal-anual"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import {
  centimosAEuros,
  eurosACentimos,
  redondearImporteLiquidado,
} from "../../dinero/importe-monetario"
import { calcularDesgloseCotizacionesSocialesLegacy } from "../../laboral/cotizaciones-sociales"
import { obtenerDeduccionAutonomicaCatalogada } from "../../normativa/datos/deducciones-autonomicas-2025"
import { obtenerParametrosComunidadAutonoma } from "../comunidades/comunidad-autonoma"
import { calcularCuotaDiferencialCentimos } from "../cuotas/cuota-diferencial"
import {
  calcularCuotaPorEscalaAhorro,
  calcularDesgloseCuotaPorEscalaAhorro,
} from "../cuotas/cuota-integra-ahorro"
import {
  calcularCuotaPorEscalaGeneral,
  calcularDesgloseCuotaPorEscalaGeneral,
} from "../cuotas/escalas-gravamen"
import { calcularBaseImponibleAhorro } from "../integracion/base-imponible-ahorro"
import { calcularBaseImponibleGeneral } from "../integracion/base-imponible-general"
import { obtenerMinimoAscendientes } from "../minimos/minimo-ascendientes"
import { obtenerMinimoContribuyente } from "../minimos/minimo-contribuyente"
import { obtenerMinimoDescendientes } from "../minimos/minimo-descendientes"
import {
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

export interface ResultadoLiquidacionIrpfSoportada {
  readonly _tag: "ResultadoLiquidacionIrpf"
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
  readonly rastro: RastroCalculo
}

export type ResultadoLiquidacionIrpf =
  | ResultadoLiquidacionIrpfSoportada
  | ResultadoNoSoportado

export const liquidarIrpfAnual = (
  caso: CasoFiscalAnual,
  _contexto: ContextoLiquidacionIrpf
): ResultadoLiquidacionIrpf => {
  void _contexto

  const resultadoNoSoportado = detectarCasoNoSoportado(caso)
  if (resultadoNoSoportado !== null) {
    return resultadoNoSoportado
  }

  return liquidarTrabajoIndividualSimple(caso)
}

const liquidarTrabajoIndividualSimple = (
  caso: CasoFiscalAnual
): ResultadoLiquidacionIrpf => {
  const rendimientoIntegroTrabajo = sumarRendimientosTrabajo(
    caso.rendimientos.trabajo,
    centimosAEuros
  )
  const parametrosComunidad = obtenerParametrosComunidadAutonoma({
    anio: caso.anio,
    comunidadAutonoma: caso.comunidadAutonoma,
  })
  if (parametrosComunidad._tag === "ComunidadAutonomaNoSoportada") {
    return {
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
    }
  }
  const rendimientoTrabajo = calcularRendimientoNetoTrabajo({
    anio: caso.anio,
    rendimientoIntegro: rendimientoIntegroTrabajo,
  })
  const cotizacionesSociales = calcularDesgloseCotizacionesSocialesLegacy({
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
  const cuotaIntegraGeneral = calcularCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: baseLiquidableGeneral,
  })
  const cuotaIntegraAhorro = calcularCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  })
  const desgloseCuotaIntegraGeneral = calcularDesgloseCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: baseLiquidableGeneral,
  })
  const desgloseCuotaIntegraAhorro = calcularDesgloseCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: baseLiquidableAhorro,
  })
  const minimoContribuyente = obtenerMinimoContribuyente({
    anio: caso.anio,
    edad: caso.situacionFamiliar.edad,
  })
  const minimoAscendientes = obtenerMinimoAscendientes(
    caso.situacionFamiliar.ascendientes
  )
  const minimoDescendientes = obtenerMinimoDescendientes(
    caso.situacionFamiliar.descendientes
  )
  const minimoDiscapacidadContribuyente =
    obtenerMinimoDiscapacidadContribuyente(caso.situacionFamiliar)
  const minimoDiscapacidadFamiliares = obtenerMinimoDiscapacidadFamiliares([
    ...caso.situacionFamiliar.descendientes,
    ...caso.situacionFamiliar.ascendientes,
  ])
  const minimoPersonalYFamiliar = minimoContribuyente
    .plus(minimoDescendientes)
    .plus(minimoAscendientes)
    .plus(minimoDiscapacidadContribuyente)
    .plus(minimoDiscapacidadFamiliares)
  const cuotaMinimoPersonal = calcularCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: minimoPersonalYFamiliar,
  })
  const remanenteMinimoPersonalParaAhorro = Decimal.max(
    0,
    minimoPersonalYFamiliar.minus(baseLiquidableGeneral)
  )
  const cuotaMinimoPersonalAhorro = calcularCuotaPorEscalaAhorro({
    anio: caso.anio,
    base: Decimal.min(remanenteMinimoPersonalParaAhorro, baseLiquidableAhorro),
  })
  const desgloseCuotaMinimoPersonal = calcularDesgloseCuotaPorEscalaGeneral({
    anio: caso.anio,
    base: minimoPersonalYFamiliar,
  })
  const cuotaGeneralDespuesMinimo = Decimal.max(
    0,
    cuotaIntegraGeneral.minus(cuotaMinimoPersonal)
  )
  const cuotaAhorroDespuesMinimo = Decimal.max(
    0,
    cuotaIntegraAhorro.minus(cuotaMinimoPersonalAhorro)
  )
  const cuotaLiquida = Decimal.max(
    0,
    cuotaGeneralDespuesMinimo
      .plus(cuotaAhorroDespuesMinimo)
      .minus(centimosAEuros(sumarDeduccionesAutonomicasCentimos(caso)))
  )
  const cuotaLiquidaCentimos = eurosACentimos(
    redondearImporteLiquidado(cuotaLiquida)
  )

  return {
    _tag: "ResultadoLiquidacionIrpf",
    perfil: "renta-individual-general",
    anio: caso.anio,
    rendimientoIntegroTrabajoCentimos: eurosACentimos(
      redondearImporteLiquidado(rendimientoTrabajo.rendimientoIntegro)
    ),
    rendimientoNetoTrabajoCentimos: eurosACentimos(
      redondearImporteLiquidado(rendimientoTrabajo.rendimientoNeto)
    ),
    rendimientoNetoCapitalInmobiliarioCentimos: eurosACentimos(
      redondearImporteLiquidado(rendimientoCapitalInmobiliario.rendimientoNeto)
    ),
    gastosDeduciblesTrabajoCentimos: eurosACentimos(
      redondearImporteLiquidado(rendimientoTrabajo.gastosDeducibles)
    ),
    reduccionRendimientosTrabajoCentimos: eurosACentimos(
      redondearImporteLiquidado(reduccionRendimientosTrabajo)
    ),
    totalGastosYDeduccionesTrabajoCentimos: eurosACentimos(
      redondearImporteLiquidado(
        rendimientoTrabajo.cotizacionTrabajador
          .plus(rendimientoTrabajo.gastosDeducibles)
          .plus(reduccionRendimientosTrabajo)
      )
    ),
    baseImponibleGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(baseImponibleGeneral)
    ),
    baseLiquidableGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(baseLiquidableGeneral)
    ),
    gananciaPatrimonialTotalCentimos: eurosACentimos(
      redondearImporteLiquidado(gananciasPatrimoniales.gananciaTotal)
    ),
    gananciaPatrimonialExentaCentimos: eurosACentimos(
      redondearImporteLiquidado(gananciasPatrimoniales.gananciaExenta)
    ),
    baseLiquidableAhorroCentimos: eurosACentimos(
      redondearImporteLiquidado(baseLiquidableAhorro)
    ),
    cotizacionEmpresarialCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.cotizacionEmpresarial)
    ),
    cotizacionTrabajadorCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.cotizacionTrabajador)
    ),
    costeLaboralCentimos: eurosACentimos(
      redondearImporteLiquidado(
        rendimientoIntegroTrabajo.plus(
          cotizacionesSociales.cotizacionEmpresarial
        )
      )
    ),
    meiEmpresarialCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.meiEmpresarial)
    ),
    meiTrabajadorCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.meiTrabajador)
    ),
    solidaridadEmpresarialCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.solidaridadEmpresarial)
    ),
    solidaridadTrabajadorCentimos: eurosACentimos(
      redondearImporteLiquidado(cotizacionesSociales.solidaridadTrabajador)
    ),
    cuotaIntegraGeneralCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaIntegraGeneral)
    ),
    cuotaIntegraAhorroCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaIntegraAhorro)
    ),
    cuotaMinimoPersonalCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaMinimoPersonal)
    ),
    cuotaMinimoPersonalAhorroCentimos: eurosACentimos(
      redondearImporteLiquidado(cuotaMinimoPersonalAhorro)
    ),
    deduccionesAutonomicasCentimos: sumarDeduccionesAutonomicasCentimos(caso),
    cuotaLiquidaCentimos,
    retencionesYPagosACuentaCentimos:
      caso.retencionesSoportadasCentimos + caso.pagosACuentaCentimos,
    cuotaDiferencialCentimos: calcularCuotaDiferencialCentimos({
      cuotaLiquidaCentimos,
      pagosACuentaCentimos: caso.pagosACuentaCentimos,
      retencionesSoportadasCentimos: caso.retencionesSoportadasCentimos,
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
          descripcion: `Base liquidable general ${baseLiquidableGeneral.toFixed(2)} euros y minimo personal y familiar ${minimoPersonalYFamiliar.toFixed(2)} euros.`,
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
              titulo: "Parametros IRPF estatal 2012-2026",
              referencia:
                "lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Ganancias patrimoniales y base del ahorro",
          descripcion:
            "Las ganancias patrimoniales por transmision se integran en la base del ahorro salvo la parte exenta reconocida para mayores de 65 anos.",
          lineasCalculo: [
            {
              etiqueta: "Ganancias patrimoniales declaradas",
              formula: "Suma de ganancias por transmision",
              resultado: euros(gananciasPatrimoniales.gananciaTotal),
            },
            {
              etiqueta: "Ganancia patrimonial exenta",
              formula:
                "Exenciones por vivienda habitual o reinversion en renta vitalicia para mayores de 65 anos",
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
              titulo: "Manual especifico mayores de 65 anos",
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
            : "La comunidad autonoma aplica parametros propios.",
          fuentes: [
            {
              titulo: "Manual Renta 2025 Parte 2",
              referencia:
                "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
            },
          ],
        },
        {
          _tag: "PasoExplicacion",
          titulo: "Cuota integra general",
          descripcion:
            "Aplicacion de la escala general a la base liquidable general.",
          lineasCalculo: [
            ...desgloseCuotaIntegraGeneral.map((tramo) => ({
              etiqueta: `Tramo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
              formula: `${euros(tramo.baseAplicada)} x ${porcentaje(tramo.tipo)}`,
              resultado: euros(tramo.cuota),
            })),
            {
              etiqueta: "Cuota integra general",
              formula: "Suma de cuotas por tramo",
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
          descripcion:
            "Aplicacion de la misma escala general al minimo personal y familiar.",
          lineasCalculo: [
            ...desgloseCuotaMinimoPersonal.map((tramo) => ({
              etiqueta: `Tramo minimo ${euros(tramo.limiteInferior)} - ${euros(tramo.limiteSuperior)}`,
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
              formula: `max(0, ${euros(cuotaGeneralDespuesMinimo)} + ${euros(cuotaAhorroDespuesMinimo)} - ${euros(centimosAEuros(sumarDeduccionesAutonomicasCentimos(caso)))})`,
              resultado: euros(cuotaLiquida),
            },
            {
              etiqueta: "Deducciones autonomicas aplicadas",
              formula: deduccionesAutonomicasDescripcion(caso),
              resultado: euros(
                centimosAEuros(sumarDeduccionesAutonomicasCentimos(caso))
              ),
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
                    cuotaLiquidaCentimos,
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
  }
}

const detectarCasoNoSoportado = (
  caso: CasoFiscalAnual
): ResultadoNoSoportado | null => {
  const deduccionPendiente = caso.deducciones[0]
  if (deduccionPendiente) {
    const catalogada = obtenerDeduccionAutonomicaCatalogada(
      deduccionPendiente.codigo
    )

    return {
      _tag: "ResultadoNoSoportado",
      motivo: catalogada
        ? `Deduccion autonomica reconocida no implementada: ${catalogada.nombre}`
        : `Deduccion autonomica no catalogada: ${deduccionPendiente.codigo}`,
      fuenteReconocida:
        "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
      rastro: rastroResultadoNoSoportado({
        caso,
        fuentePaso:
          "docs/fuentes/aeat/manual-renta-2025-parte-2-deducciones-autonomicas.md",
        tituloFuentePaso: "Manual Renta 2025 Parte 2",
        tituloPaso: catalogada
          ? "Deduccion autonomica reconocida no implementada"
          : "Deduccion autonomica no catalogada",
        descripcionPaso: catalogada
          ? `El motor reconoce ${catalogada.codigo} con estado ${catalogada.estado}, pero todavia no tiene evaluador y tests para liquidarla.`
          : `El motor ha recibido el codigo ${deduccionPendiente.codigo}, que no existe en el catalogo normalizado actual.`,
      }),
    }
  }

  return null
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
