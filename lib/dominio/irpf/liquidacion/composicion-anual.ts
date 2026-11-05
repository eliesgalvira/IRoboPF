import { usaPrecisionD51 } from "../deducciones/d51-anual"
import { RechazoAragonAnual } from "../deducciones/aragon-dos-anual-error"
import { esAmbitoCuotasTerritorialesOpen2025 } from "../cuotas/politica-cuotas-open-2025"
import { producirNodosFiscalesB2025 } from "../deducciones/b-ampliado-anual-2025/productores"
import { SolicitudDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial"
import { aplicarDeduccionesTerritoriales2025 } from "../deducciones/anual-territorial"
import Decimal from "decimal.js"
import { Effect, Schema, Result } from "effect"
import {
  SolicitudDeduccionesValencianasAnual2025,
  pasosDeduccionesValencianasAnual,
} from "../deducciones/valenciana-2025/anual"
import {
  aplicarCuotaAnualValenciana2025,
  type ResultadoCuotaConjuntaValenciana2025,
} from "../deducciones/valenciana-2025/cuota-conjunta"
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

export type PoliticaAnual =
  | "decimal-hasta-salida"
  | "open-empleo-madrid-2025"
  | "open-cuotas-empleo-andalucia-2025"
  | "open-cuotas-empleo-territorios-2025"
  | "open-cuotas-empleo-madrid-2018-2024"
/** Contrato interno: bases ya integradas en EUR Decimal; jamás reconstruye cotizaciones. */
export interface EntradaComposicionAnual {
  readonly rentaActividadAnualB?: Decimal | undefined
  readonly origenBaseGeneralB?: "solo-trabajo" | "solo-actividad" | undefined
  readonly rentasTrabajoAnuales?:
    | {
        readonly integroTrabajo: Decimal
        readonly restoRentas: Decimal
      }
    | undefined
  readonly deduccionesTerritoriales2025?:
    | SolicitudDeduccionesTerritoriales2025
    | undefined
  readonly ambito: Pick<
    CasoFiscalAnual,
    | "contribuyenteId"
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
  readonly basesImponiblesE38?: { readonly general: Decimal; readonly ahorro: Decimal } | undefined
  readonly baseGeneral: Decimal
  readonly baseAhorro: Decimal
  readonly rentasAntesReducciones: Decimal
  readonly minimosEstatales: MinimosPersonalesFamiliaresIrpf
  readonly deduccionesAutonomicasCentimos: number
  readonly deduccionesValencianas2025?:
    | SolicitudDeduccionesValencianasAnual2025
    | undefined
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
  politica !== "decimal-hasta-salida"
    ? importe.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
    : importe

export const componerLiquidacionAnual = Effect.fn("Liquidacion.componerAnual")(
  function* (entrada: EntradaComposicionAnual) {
    const ampliaF = entrada.deduccionesTerritoriales2025?.solicitudes.some((s) => s.lote === "F-ampliado") === true
    const A = Decimal.clone({ precision: ampliaF || usaPrecisionD51(entrada.deduccionesTerritoriales2025) ? 80 : entrada.precision })
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
      entrada.politica === "open-cuotas-empleo-madrid-2018-2024" &&
      (caso.anio < 2018 ||
        caso.anio > 2024 ||
        caso.comunidadAutonoma !== "madrid" ||
        caso.fechaFallecimiento !== undefined ||
        caso.derechosMinimos !== undefined ||
        caso.situacionFamiliar.edad < 18 ||
        caso.situacionFamiliar.edad >= 65 ||
        caso.situacionFamiliar.discapacidad._tag !== "SinDiscapacidad" ||
        entrada.cotizaciones.naturaleza !== "efectivas" ||
        entrada.rentasTrabajoAnuales === undefined ||
        !entrada.rentasTrabajoAnuales.integroTrabajo.gt(0) ||
        !entrada.rentasTrabajoAnuales.restoRentas.isZero() ||
        !entrada.baseAhorro.isZero() ||
        entrada.deduccionesAutonomicasCentimos !== 0 ||
        entrada.deduccionesTerritoriales2025 !== undefined ||
        entrada.deduccionesValencianas2025 !== undefined ||
        entrada.serviciosLaborales !== undefined)
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo:
            "Política de cuotas Open limitada a empleo efectivo Madrid 2018–2024, edad 18–64, sin fallecimiento, familia, discapacidad, otras rentas ni deducciones",
        })
      )
    if (
      entrada.politica === "open-cuotas-empleo-andalucia-2025" &&
      (caso.anio !== 2025 ||
        caso.comunidadAutonoma !== "andalucia" ||
        caso.derechosMinimos !== undefined ||
        entrada.cotizaciones.naturaleza !== "efectivas")
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo:
            "Política de cuotas Open limitada a empleo efectivo Andalucía 2025 sin derechos familiares",
        })
      )
    if (
      entrada.politica === "open-cuotas-empleo-territorios-2025" &&
      (!esAmbitoCuotasTerritorialesOpen2025(caso) ||
        entrada.cotizaciones.naturaleza !== "efectivas" ||
        entrada.rentasTrabajoAnuales === undefined ||
        entrada.serviciosLaborales === undefined ||
        !entrada.serviciosLaborales.bruto.gt(0) ||
        !entrada.serviciosLaborales.bruto.eq(
          entrada.rentasTrabajoAnuales.integroTrabajo
        ))
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo:
            "Política de cuotas territoriales Open limitada a empleo efectivo de los cinco territorios observados en 2025, sin derechos familiares",
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
    const cuotaAutonomicaDisponible = cuotaAutonomicaGeneralDespuesMinimo.plus(
      ahorroConMinimos.autonomico.despuesMinimo
    )
    let deduccionesValencianas2025:
      | ResultadoCuotaConjuntaValenciana2025<string>
      | undefined
    if (entrada.deduccionesValencianas2025 !== undefined) {
      const decoded = Schema.decodeUnknownResult(
        SolicitudDeduccionesValencianasAnual2025
      )(entrada.deduccionesValencianas2025, { onExcessProperty: "error" })
      if (Result.isFailure(decoded))
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "Solicitud anual valenciana incompleta o con bases/cuota externas",
          })
        )
      const s = decoded.success
      if (
        caso.anio !== 2025 ||
        caso.comunidadAutonoma !== "comunitat-valenciana" ||
        caso.situacionFamiliar.tipo !== "individual" ||
        caso.fechaFallecimiento !== undefined ||
        caso.contribuyenteId !== s.contribuyente ||
        (caso.derechosMinimos !== undefined &&
          caso.derechosMinimos.contribuyenteId !== s.contribuyente)
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "Identidad o ámbito incompatible con deducciones valencianas anuales",
          })
        )
      if (
        entrada.deduccionesAutonomicasCentimos !== 0 ||
        s.consignaciones.length !== 0
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "No mezclar hechos valencianos con consignaciones o agregado externo",
          })
        )
      if (
        s.solicitudes.some(
          (p) =>
            p.eleccion === "aplicar" &&
            p.codigo === "valenciana_dos_o_mas_descendientes"
        )
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "Dos o más descendientes: falta representar y conciliar las bases imponibles de todas las personas de la unidad familiar; no se admite cuota externa",
          })
        )
      const requierenMinimo = new Set([
        "valenciana_nacimiento_adopcion_guarda_acogimiento",
        "valenciana_nacimiento_adopcion_multiples",
        "valenciana_nacimiento_adopcion_acogimiento_discapacidad",
        "valenciana_custodia_guarderias_menores_3",
        "valenciana_conciliacion_trabajo_familia",
        "valenciana_material_escolar",
      ])
      const gastosFamiliares = new Set([
        "valenciana_gastos_salud",
        "valenciana_deporte_actividades_saludables",
        "valenciana_fomento_formacion_musical",
      ])
      for (const p of s.solicitudes.filter((p) => p.eleccion === "aplicar")) {
        if (
          p.codigo === "valenciana_ascendientes_mayores_discapacidad" ||
          (p.codigo === "valenciana_empleados_hogar_cuidado_personas" &&
            p.unidades.some((u) => u.textos.grupo === "ascendientes"))
        )
          return yield* Effect.fail(
            errorDerechosMinimos({
              motivo:
                "Ascendientes no representados en los derechos anuales; la evidencia externa de deducciones no habilita esa rama",
            })
          )
        if (requierenMinimo.has(p.codigo) || gastosFamiliares.has(p.codigo)) {
          const sujetos = p.referencias
            .flatMap((r) => r.sujetos)
            .filter((id) => id !== s.contribuyente)
          if (
            (requierenMinimo.has(p.codigo) && sujetos.length === 0) ||
            sujetos.some(
              (id) =>
                derechosEstatales?.atribuciones.some(
                  (a) => a.sujetoId === id
                ) !== true
            )
          )
            return yield* Effect.fail(
              errorDerechosMinimos({
                motivo:
                  "Sujetos de deducción sin derecho a mínimo conciliado con el caso anual; no basta elegibilidad externa",
              })
            )
        }
      }
      // Una unidad puede ser un gasto: su id no identifica a la persona.
      for (const p of s.solicitudes.filter((p) => p.eleccion === "aplicar"))
        for (const u of p.unidades) {
          const propias = [
            "valenciana_primera_vivienda_menores_35",
            "valenciana_discapacidad_65",
            "valenciana_tratamientos_fertilidad",
            "valenciana_vivienda_discapacidad",
          ].includes(p.codigo)
          const referencias = p.referencias.filter((r) => r.unidad === u.id)
          const sujetos = referencias.flatMap((r) => r.sujetos)
          const tieneDatosPersonales =
            u.numeros.edad !== undefined || u.numeros.grado !== undefined
          if (
            (tieneDatosPersonales || propias) &&
            (referencias.length !== 1 ||
              sujetos.length !== 1 ||
              (propias && sujetos[0] !== s.contribuyente))
          )
            return yield* Effect.fail(
              errorDerechosMinimos({
                motivo: "Identidad personal ambigua o ajena en deducciones",
              })
            )
          const propia = sujetos[0] === s.contribuyente
          const descendiente = caso.derechosMinimos?.descendientes.find(
            (d) => d.sujetoId === sujetos[0]
          )
          const edad = propia
            ? caso.situacionFamiliar.edad
            : descendiente?.edadDevengo
          const discapacidad = propia
            ? caso.situacionFamiliar.discapacidad
            : descendiente?.discapacidad
          if (
            tieneDatosPersonales &&
            (edad === undefined || discapacidad === undefined)
          )
            return yield* Effect.fail(
              errorDerechosMinimos({
                motivo:
                  "Sujeto de deducción sin datos personales conciliados en el caso anual",
              })
            )
          if (u.numeros.edad !== undefined && u.numeros.edad !== edad)
            return yield* Effect.fail(
              errorDerechosMinimos({
                motivo: "Edad contradictoria del sujeto en deducciones",
              })
            )
          if (u.numeros.grado !== undefined && discapacidad !== undefined) {
            const grado = u.numeros.grado,
              d = discapacidad._tag
            if (
              (d === "SinDiscapacidad" && grado >= 33) ||
              (d === "Discapacidad33a64" && (grado < 33 || grado >= 65)) ||
              (d === "Discapacidad65OMas" && grado < 65)
            )
              return yield* Effect.fail(
                errorDerechosMinimos({
                  motivo:
                    "Discapacidad contradictoria del sujeto en deducciones",
                })
              )
          }
          if (
            p.codigo === "valenciana_vivienda_discapacidad" &&
            caso.situacionFamiliar.discapacidad._tag === "SinDiscapacidad"
          )
            return yield* Effect.fail(
              errorDerechosMinimos({
                motivo:
                  "Vivienda por discapacidad incompatible con ausencia de discapacidad propia",
              })
            )
        }
      // Estas bases son las únicas del perfil actual, sin reducciones de base.
      // No redondear una base ni sanear un negativo para ganar elegibilidad.
      const bases = {
        liquidableGeneral: baseLiquidableGeneral.toNumber(),
        liquidableAhorro: baseLiquidableAhorro.toNumber(),
        imponibleGeneral: entrada.baseGeneral.toNumber(),
        imponibleAhorro: entrada.baseAhorro.toNumber(),
      }
      if (
        ![
          baseLiquidableGeneral,
          baseLiquidableAhorro,
          entrada.baseGeneral,
          entrada.baseAhorro,
        ].every((v, i) => v.gte(0) && v.eq(Object.values(bases)[i]))
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "Bases negativas o no representables sin pérdida en el contrato valenciano por hechos",
          })
        )
      // La disponibilidad y todos sus movimientos conservan el decimal exacto.
      const disponible = cuotaAutonomicaDisponible.toString()
      const { arrastres, ordenConsumo, criterioOrden, ...hechos } = s
      deduccionesValencianas2025 = aplicarCuotaAnualValenciana2025({
        hechos: {
          ...hechos,
          solicitudes: hechos.solicitudes.map(
            ({ descendientesIncremento, ...p }) =>
              descendientesIncremento === undefined
                ? p
                : { ...p, descendientesIncremento }
          ),
          bases,
          cuota: {
            referencia: "cuota-autonomica-anual-2025:" + s.contribuyente,
            disponible,
            arrastres,
          },
        },
        ordenConsumo,
        criterioOrden,
      })
      if (deduccionesValencianas2025.estado !== "calculo_parcial")
        return yield* Effect.fail({
          ...errorDerechosMinimos({
            motivo: deduccionesValencianas2025.incidencias.join("; "),
          }),
          rastro: {
            titulo: "Deducciones valencianas rechazadas",
            pasos: pasosDeduccionesValencianasAnual(deduccionesValencianas2025),
          },
        })
    }
    let deduccionesTerritoriales2025:
      | ReturnType<typeof aplicarDeduccionesTerritoriales2025>
      | undefined
    if (entrada.deduccionesTerritoriales2025 !== undefined) {
      if (
        entrada.deduccionesValencianas2025 !== undefined ||
        entrada.deduccionesAutonomicasCentimos !== 0
      )
        return yield* Effect.fail(
          errorDerechosMinimos({
            motivo:
              "No mezclar hechos territoriales con otra fuente de deducciones autonómicas",
          })
        )
      const solicitud = entrada.deduccionesTerritoriales2025
      deduccionesTerritoriales2025 = yield* Effect.try({
        try: () =>
          aplicarDeduccionesTerritoriales2025(solicitud, {
            caso,
            basesImponiblesE38: entrada.basesImponiblesE38,
            baseGeneral: entrada.baseGeneral,
            baseAhorro: entrada.baseAhorro,
            minimoPersonalFamiliar: minimoPersonalYFamiliar,
            basesLiquidables: {
              general: baseLiquidableGeneral,
              ahorro: baseLiquidableAhorro,
            },
            componentesMinimoEstatal: {
              contribuyente: minimoContribuyente,
              descendientes: minimoDescendientes,
            },
            cuotaAutonomica: cuotaAutonomicaDisponible,
            nodosFiscalesB2025: caso.anio === 2025 && caso.contribuyenteId !== undefined ? producirNodosFiscalesB2025(caso.contribuyenteId, baseLiquidableGeneral, cuotaEstatalDespuesMinimo, cuotaAutonomicaGeneralDespuesMinimo, entrada.origenBaseGeneralB) : undefined,
            rentasTrabajoAnuales: entrada.rentasTrabajoAnuales,
            rentaNoExentaAntesReduccionesB: entrada.rentasAntesReducciones,
            rentaActividadAnualB: entrada.rentaActividadAnualB,
            sujetosConMinimo:
              derechosEstatales?.atribuciones.map((a) => a.sujetoId) ?? [],
            atribucionesMinimo: derechosEstatales?.atribuciones,
          }),
        catch: (e) => Schema.is(RechazoAragonAnual)(e)
          ? {
              ...errorDerechosMinimos({motivo:e.motivo}),
              fuenteReconocida:"docs/procedencia/deducciones-2025/producto-aragon-conexion-anual/ALCANCE.md",
              dependenciaAragon:e.dependencia,
            }
          : errorDerechosMinimos({
              motivo:e instanceof RangeError ? e.message : "Hechos territoriales no componibles",
            }),
      })
    }
    if (deduccionesTerritoriales2025 !== undefined &&
      "completoEnRamasSolicitadas" in deduccionesTerritoriales2025 &&
      deduccionesTerritoriales2025.completoEnRamasSolicitadas === false)
      return yield* Effect.fail({
        ...errorDerechosMinimos({ motivo: "Deducciones F con condiciones pendientes; se conserva evaluación por rama y no se publica una cuota anual con deducciones desconocidas" }),
        deduccionesTerritoriales2025,
      })
    const deduccionesAutonomicasAplicadas =
      deduccionesTerritoriales2025 !== undefined
        ? new A(deduccionesTerritoriales2025.total.numeradorEuros).div(
            deduccionesTerritoriales2025.total.divisor
          )
        : deduccionesValencianas2025 !== undefined
          ? new A(deduccionesValencianas2025.totalAplicado!)
          : usaEscalaAutonomicaReal
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
      (caso.anio !== 2025 || entrada.baseAhorro.isZero() === false)
    )
      return yield* Effect.fail(
        errorDerechosMinimos({
          motivo:
            "DA61 anual integrada limitada al perfil efectivo común 2025 sin otras rentas",
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
      // La captura andaluza sólo acredita gravámenes; no discrimina DA61.
      deduccionTrabajo = cuantizarAnual(
        new A(resultado.importeAplicable),
        entrada.politica === "open-empleo-madrid-2025"
          ? entrada.politica
          : "decimal-hasta-salida"
      )
    }
    const cuotaPosterior = cuotaLiquida.minus(deduccionTrabajo)
    return {
      deduccionesTerritoriales2025,
      deduccionesValencianas2025,
      cuotaAutonomicaDisponible,
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
