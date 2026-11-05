import { esAmbitoCuotasTerritorialesOpen2025 } from "../cuotas/politica-cuotas-open-2025"
import { pasosDeduccionesValencianasAnual } from "../deducciones/valenciana-2025/anual"
import { liquidarPagosAnuales } from "../cuotas/cuota-diferencial"
import {
  componerLiquidacionAnual,
  cuantizarAnual,
} from "../liquidacion/composicion-anual"
import Decimal from "decimal.js"
import { Effect, Result, Schema } from "effect"
import { CasoFiscalAnualExplicito } from "./conexion-contrato"
import { adaptarTrabajoAnual } from "./adaptador"
import { adaptarActividadGeneral } from "../actividades-economicas/adaptador"
import { calcularReduccionTrabajoConOtrasRentas } from "../reducciones/reduccion-rendimientos-trabajo"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import { crearLineaCalculo } from "../../explicacion/linea-calculo"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import type { ResultadoNoSoportado } from "../liquidacion/liquidar-irpf-anual"
import { rastroTrasReforma } from "../../../procedencia/rastro-reforma"

const D = Decimal.clone({ precision: 80 })
const rechazar = (motivo: string): ResultadoNoSoportado => ({
  _tag: "ResultadoNoSoportado",
  motivo,
  fuenteReconocida:
    "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
  rastro: { titulo: "Alcance anual explícito", pasos: [] },
})

/** Liquidación condicionada a los hechos declarados, sin aceptación fiscal automática. */
export const liquidarIrpfAnualExplicito = Effect.fn("Liquidacion.explicita")(
  function* (entrada: CasoFiscalAnualExplicito) {
    const decoded = Schema.decodeUnknownResult(CasoFiscalAnualExplicito)(
      entrada,
      { onExcessProperty: "error" }
    )
    if (Result.isFailure(decoded))
      return yield* Effect.fail(
        rechazar(
          "Entrada incompleta o fuera del alcance anual efectivo declarado"
        )
      )
    const caso = decoded.success
    const solicitudTerritorial =
      "deduccionesTerritoriales2025" in caso
        ? caso.deduccionesTerritoriales2025
        : undefined
    if (
      (caso.deducciones === "territoriales-por-hechos-y-da61") !==
      (solicitudTerritorial !== undefined)
    )
      return yield* Effect.fail(
        rechazar("Discriminante territorial incompatible con hechos")
      )
    const solicitudValenciana =
      "deduccionesValencianas2025" in caso
        ? caso.deduccionesValencianas2025
        : undefined
    if (
      (caso.deducciones === "valencianas-por-hechos-y-da61") !==
      (solicitudValenciana !== undefined)
    )
      return yield* Effect.fail(
        rechazar(
          "Discriminante de deducciones incompatible con la solicitud por hechos"
        )
      )
    if (
      (caso.saldosAnteriores === "solo-deducciones-valencianas") !==
      (solicitudValenciana?.arrastres.length ?? 0) > 0
    )
      return yield* Effect.fail(
        rechazar(
          "La declaración de saldos anteriores debe coincidir con los arrastres valencianos; no habilita compensaciones de base"
        )
      )
    if (
      caso.devengo !== `${caso.ejercicio}-12-31` ||
      (caso.perfil === "solo-trabajo" &&
        (caso.conciliacion.ejercicio !== caso.ejercicio ||
          caso.retenciones.some((r) => r.ejercicio !== caso.ejercicio)))
    )
      return yield* Effect.fail(
        rechazar(
          "Ejercicios incompatibles entre devengo, conciliación y retenciones"
        )
      )
    if (
      (caso.familiaresConDerechoMinimo === "segun-derechos") !==
      (caso.derechosMinimos !== undefined)
    )
      return yield* Effect.fail(
        rechazar(
          "La declaración de familiares exige derechos completos y coherentes"
        )
      )
    if (
      caso.derechosMinimos !== undefined &&
      caso.derechosMinimos.discapacidadContribuyente._tag !== "SinDiscapacidad"
    )
      return yield* Effect.fail(
        rechazar(
          "Discapacidad del contribuyente incompatible con la ausencia declarada en el perfil efectivo"
        )
      )
    let redondeoSalarialOpen = false
    let redondeoCuotasAndaluciaOpen = false
    let redondeoCuotasTerritorialesOpen = false
    let redondeoCuotasHistoricasOpen = false
    const cuantizarEtapa = (importe: Decimal) =>
      cuantizarAnual(
        importe,
        redondeoSalarialOpen
          ? "open-empleo-madrid-2025"
          : "decimal-hasta-salida"
      )
    const pasos: RastroCalculo["pasos"][number][] = []
    let trabajoIntegroTerritorial: Decimal | undefined
    let cotizacionEfectiva = new D(0)
    let neto = new D(0),
      reduccionArt20 = new D(0),
      brutoServicios = new D(0)
    let retenciones = new D(0),
      pagos = new D(0)
    if (caso.perfil === "solo-trabajo") {
      if (
        caso.trabajo.ejercicio !== caso.ejercicio ||
        caso.trabajo.discapacidadActiva !== "ninguna"
      )
        return yield* Effect.fail(
          rechazar(
            "Ejercicio o discapacidad del trabajo incompatibles con el alcance anual"
          )
        )
      const clases = new Set(caso.trabajo.rendimientos.map((r) => r.clase))
      const empleo = [...clases].every(
        (c) => c === "empleo-laboral" || c === "empleo-estatutario"
      )
      const pension = clases.size === 1 && clases.has("pension")
      if ((!empleo && !pension) || caso.trabajo.rendimientos.length === 0)
        return yield* Effect.fail(
          rechazar(
            "Atribución de gastos y reducciones entre pensión, empleo u otras rentas no soportada"
          )
        )
      if (caso.ejercicio !== 2025 && !empleo)
        return yield* Effect.fail(
          rechazar("El perfil histórico efectivo sólo admite empleo")
        )
      // Observado en Open 2025; no extrapolar a pensión ni actividad.
      redondeoSalarialOpen =
        empleo && caso.ejercicio === 2025 && caso.comunidadAutonoma === "madrid"
      // Evidencia independiente de cuotas; no habilita compatibilidad art20 ni DA61.
      redondeoCuotasAndaluciaOpen =
        empleo &&
        caso.ejercicio === 2025 &&
        caso.comunidadAutonoma === "andalucia" &&
        caso.derechosMinimos === undefined
      // Siete pilotos Open: cuantizar gravámenes antes de restar mínimos.
      // No activa la compatibilidad salarial de 2025 ni altera art. 20 histórico.
      redondeoCuotasHistoricasOpen = empleo && caso.ejercicio >= 2018 &&
        caso.ejercicio <= 2024 && caso.comunidadAutonoma === "madrid" &&
        caso.derechosMinimos === undefined
      const trabajo = adaptarTrabajoAnual(caso.trabajo)
      if (trabajo.estado === "no-soportado")
        return yield* Effect.fail(rechazar(trabajo.motivo))
      cotizacionEfectiva = caso.trabajo.rendimientos.reduce(
        (total, r) =>
          total
            .plus(r.cotizaciones.seguridadSocial)
            .plus(r.cotizaciones.derechosPasivos)
            .plus(r.cotizaciones.colegiosHuerfanos),
        new D(0)
      )
      trabajoIntegroTerritorial = new D(trabajo.gastos.integro)
      neto = new D(trabajo.rendimientoAntesArt20)
      reduccionArt20 = D.min(
        D.max(neto, 0),
        calcularReduccionTrabajoConOtrasRentas({
          anio: caso.ejercicio,
          rendimientoPrevioNeto: new D(trabajo.argumentoArt20),
          otrasRentasNoExentas: new D(0),
          compatibilidadOpen2025: redondeoSalarialOpen
            ? {
                integro: new D(trabajo.gastos.integro),
                gastosAE: new D(trabajo.gastos.gastosAE),
              }
            : undefined,
        })
      )
      reduccionArt20 = cuantizarEtapa(reduccionArt20)
      neto = neto.minus(reduccionArt20)
      if (empleo) brutoServicios = new D(trabajo.gastos.integro)
      redondeoCuotasTerritorialesOpen =
        empleo &&
        brutoServicios.gt(0) &&
        esAmbitoCuotasTerritorialesOpen2025({
          anio: caso.ejercicio,
          comunidadAutonoma: caso.comunidadAutonoma,
          derechosMinimos: caso.derechosMinimos,
        })
      if (
        new Set(caso.retenciones.map((r) => r.operacionId)).size !==
        caso.retenciones.length
      )
        return yield* Effect.fail(rechazar("Operación de retención duplicada"))
      retenciones = caso.retenciones.reduce(
        (a, r) => a.plus(r.importe),
        new D(0)
      )
      pasos.push({
        _tag: "PasoExplicacion",
        titulo: "Trabajo conciliado y reducción única",
        descripcion: `Totales anuales disjuntos aportados: ${caso.conciliacion.procedencia.join(", ")}. Pensión excluida de DA61.`,
        fuentes: [
          {
            titulo: "Alcance y evidencia de la conexión anual",
            referencia:
              "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
          },
        ],
        lineasCalculo: [
          crearLineaCalculo({
            siteId: "anual.explicito.trabajo.integro",
            instancia: 0,
            importe: new D(trabajo.gastos.integro),
            unidad: "EUR",
            etiqueta: "Trabajo íntegro",
            formula: "suma de rendimientos anuales conciliados",
          }),
          crearLineaCalculo({
            siteId: "anual.explicito.trabajo.gastos-a-e",
            instancia: 0,
            importe: new D(trabajo.gastos.gastosAE),
            unidad: "EUR",
            etiqueta: "Gastos a–e",
            formula:
              "cotizaciones efectivas + sindicato + colegio limitado + defensa limitada, una vez al año",
          }),
          crearLineaCalculo({
            siteId: "anual.explicito.trabajo.gasto-f",
            instancia: 0,
            importe: new D(trabajo.gastos.generalesAplicados),
            unidad: "EUR",
            etiqueta: "Gasto general aplicado",
            formula: "min(2000, saldo positivo después de a–e)",
          }),
          crearLineaCalculo({
            siteId: "anual.explicito.trabajo.art19",
            instancia: 0,
            importe: new D(trabajo.rendimientoAntesArt20),
            unidad: "EUR",
            etiqueta: "Neto artículo 19",
            formula: "íntegro menos gastos efectivos a–e y gasto f limitado",
          }),
          crearLineaCalculo({
            siteId: "anual.explicito.trabajo.art20",
            instancia: 0,
            importe: reduccionArt20,
            unidad: "EUR",
            etiqueta: "Reducción artículo 20",
            formula: redondeoSalarialOpen
              ? "compatibilidad numérica Open 2025 en el núcleo compartido para íntegro y gastos a–e entre 0 y 1.000.000 EUR; fuera, Decimal; min(saldo positivo art19, reducción sobre neto sin f; otras rentas = 0)"
              : "min(saldo positivo art19, reducción sobre neto sin f; otras rentas = 0)",
          }),
        ],
      })
    } else {
      // La cota del adaptador no concilia amortizaciones históricas: no promoverlas al anual.
      if (
        caso.actividad.activos.length > 0 ||
        caso.actividad.discapacidad.grado !== 0
      )
        return yield* Effect.fail(
          rechazar(
            "Activos con amortización y discapacidad de actividad fuera del alcance anual integrado"
          )
        )
      const actividad = adaptarActividadGeneral(caso.actividad)
      if (actividad.estado === "no-soportado")
        return yield* Effect.fail(
          rechazar(actividad.motivos.map((m) => m.motivo).join("; "))
        )
      cotizacionEfectiva = caso.actividad.reta.reduce(
        (total, r) => total.plus(r.importe),
        new D(0)
      )
      neto = new D(actividad.aporte.importeEurosExactos)
      retenciones = new D(actividad.aporte.retencionesEuros)
      pagos = new D(actividad.aporte.pagosFraccionadosEuros)
      pasos.push({
        _tag: "PasoExplicacion",
        titulo: "Actividad EDS 2025",
        descripcion:
          "RETA y artículo 32 ya incluidos en el aporte; no se aplican cotizaciones salariales ni artículo 20.",
        fuentes: [
          {
            titulo: "Alcance y evidencia de la conexión anual",
            referencia:
              "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
          },
        ],
        lineasCalculo: actividad.etapas.map((e, instancia) =>
          crearLineaCalculo({
            siteId: "anual.explicito.actividad.etapa",
            instancia: instancia,
            importe: new D(e.importe),
            unidad: "EUR",
            etiqueta: `${e.reglaId}: ${e.id}`,
            formula: e.formula,
          })
        ),
      })
    }
    // Sin otras rentas, reducciones de base ni saldos anteriores: BIG = BLG con signo.
    const base = D.max(neto, 0)
    const composicion = yield* componerLiquidacionAnual({
      rentaActividadAnualB: caso.perfil === "solo-actividad-eds" ? neto : undefined,
      origenBaseGeneralB: caso.perfil === "solo-actividad-eds" ? "solo-actividad" : "solo-trabajo",
      rentasTrabajoAnuales:
        trabajoIntegroTerritorial === undefined
          ? undefined
          : {
              integroTrabajo: trabajoIntegroTerritorial,
              restoRentas: new D(0),
            },
      ambito: {
        contribuyenteId:
          "contribuyenteId" in caso ? caso.contribuyenteId : undefined,
        anio: caso.ejercicio,
        comunidadAutonoma: caso.comunidadAutonoma,
        derechosMinimos: caso.derechosMinimos,
        situacionFamiliar: {
          tipo: "individual",
          edad: caso.edad,
          discapacidad: { _tag: "SinDiscapacidad" },
          descendientes: [],
          ascendientes: [],
        },
      },
      cotizaciones: { naturaleza: "efectivas", trabajador: cotizacionEfectiva },
      precision: 80,
      politica: redondeoSalarialOpen
        ? "open-empleo-madrid-2025"
        : redondeoCuotasAndaluciaOpen
          ? "open-cuotas-empleo-andalucia-2025"
          : redondeoCuotasTerritorialesOpen
            ? "open-cuotas-empleo-territorios-2025"
            : redondeoCuotasHistoricasOpen
              ? "open-cuotas-empleo-madrid-2018-2024"
              : "decimal-hasta-salida",
      basesImponiblesE38: { general: neto, ahorro: new D(0) },
      baseGeneral: base,
      baseAhorro: new D(0),
      rentasAntesReducciones: neto.plus(reduccionArt20),
      // Las tablas estatales 2018–2024 del motor remiten a estas mismas cuantías.
      // Se conserva esa selección histórica; no constituye una nueva acreditación.
      minimosEstatales: MINIMOS_ESTATALES_2025,
      deduccionesAutonomicasCentimos: 0,
      deduccionesValencianas2025: solicitudValenciana,
      deduccionesTerritoriales2025: solicitudTerritorial,
      serviciosLaborales:
        caso.ejercicio === 2025 && brutoServicios.gt(0)
          ? { bruto: brutoServicios }
          : undefined,
    })
    const {
      cuotaIntegraGeneralEstatal: gravamenEstatal,
      cuotaMinimoPersonalEstatal: gravamenMinimoEstatal,
      cuotaIntegraGeneralAutonomica: gravamenAutonomico,
      cuotaMinimoPersonalAutonomica: gravamenMinimoAutonomico,
      cuotaEstatalDespuesMinimo: cuotaEstatal,
      cuotaAutonomicaGeneralDespuesMinimo: cuotaAutonomica,
      cuotaLiquida: liquida,
      deduccionTrabajo: deduccion,
      cuotaPosterior: posterior,
    } = composicion
    pasos.push(
      ...pasosDeduccionesValencianasAnual(
        composicion.deduccionesValencianas2025
      )
    )
    const diferencial = liquidarPagosAnuales(posterior, retenciones, pagos)
    pasos.push({
      _tag: "PasoExplicacion",
      titulo: "Bases, cuotas y pagos anuales",
      descripcion:
        solicitudValenciana !== undefined
          ? "Deducciones valencianas por hechos aplicadas una sola vez a cuota autonómica; resultado condicionado. DA61 y pagos conservan sus etapas únicas posteriores."
          : redondeoSalarialOpen
            ? "Empleo Madrid 2025: artículo 20 con compatibilidad numérica observada y acotada por operandos; gravámenes y DA61 a céntimos half-up antes de restar. Evidencias Open 1.19 y C300, sin aceptación fiscal automática ni cobertura universal."
            : redondeoCuotasAndaluciaOpen
              ? "Empleo Andalucía 2025 sin derechos familiares: gravámenes a céntimos half-up antes de restar mínimos y sumar cuotas. Artículo 20 y DA61 conservan precisión decimal. Evidencia C300 de una entrada; aceptación fiscal pendiente."
              : redondeoCuotasTerritorialesOpen
                ? `Empleo ${caso.comunidadAutonoma} 2025 sin derechos familiares: cuatro gravámenes a céntimos half-up antes de restar mínimos y sumar cuotas. Artículo 20 y DA61 conservan precisión decimal. Cinco capturas C300; sin aceptación fiscal automática.`
                : redondeoCuotasHistoricasOpen
                  ? `Empleo Madrid ${caso.ejercicio} sin derechos familiares: cuatro gravámenes a céntimos half-up antes de restar mínimos. Artículo 20 conserva su fórmula y precisión histórica; no aplica DA61. Evidencia de un piloto por ejercicio; aceptación fiscal pendiente.`
                  : "Sin ahorro, reducciones de base ni otras deducciones. Artículo 80 sin importe al excluir rentas extranjeras. Cuota líquida legal conservada antes de DA61. Precisión decimal hasta salida; presentación final half-up a céntimos, pendiente de aceptación fiscal.",
      fuentes: [
        {
          titulo: "Alcance y evidencia de la conexión anual",
          referencia:
            "docs/procedencia/implementaciones/conexion-anual/INFORME.md",
        },
      ],
      lineasCalculo: [
        crearLineaCalculo({
          siteId: "anual.explicito.big",
          instancia: 0,
          importe: neto,
          unidad: "EUR",
          etiqueta: "Base imponible general",
          formula: "rendimiento neto reducido con signo",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.blg",
          instancia: 0,
          importe: neto,
          unidad: "EUR",
          etiqueta: "Base liquidable general",
          formula: "BIG sin reducciones de base ni compensaciones anteriores",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.cuota.estatal",
          instancia: 0,
          importe: cuotaEstatal,
          unidad: "EUR",
          etiqueta: "Cuota estatal",
          formula: redondeoSalarialOpen || redondeoCuotasHistoricasOpen
            ? `gravámenes a céntimos Open: ${gravamenEstatal.toFixed(2)} − ${gravamenMinimoEstatal.toFixed(2)}`
            : redondeoCuotasTerritorialesOpen
              ? `gravámenes a céntimos Open 2025: ${gravamenEstatal.toFixed(2)} − ${gravamenMinimoEstatal.toFixed(2)}`
              : "escala(base positiva) − escala(mínimo limitado a base)",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.cuota.autonomica",
          instancia: 0,
          importe: cuotaAutonomica,
          unidad: "EUR",
          etiqueta: "Cuota autonómica",
          formula: redondeoSalarialOpen || redondeoCuotasHistoricasOpen
            ? `gravámenes a céntimos Open Madrid: ${gravamenAutonomico.toFixed(2)} − ${gravamenMinimoAutonomico.toFixed(2)}`
            : redondeoCuotasTerritorialesOpen
              ? `gravámenes a céntimos Open 2025 ${caso.comunidadAutonoma}: ${gravamenAutonomico.toFixed(2)} − ${gravamenMinimoAutonomico.toFixed(2)}`
              : "escala autonómica(base) − escala(mínimo limitado a base)",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.cuota.liquida-legal",
          instancia: 0,
          importe: liquida,
          unidad: "EUR",
          etiqueta: "Cuota líquida legal",
          formula:
            solicitudValenciana === undefined
              ? "cuota estatal + autonómica; sin otras deducciones"
              : "cuota estatal + autonómica - deducciones valencianas aplicadas a cuota común",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.da61",
          instancia: 0,
          importe: deduccion,
          unidad: "EUR",
          etiqueta: "DA61",
          formula: redondeoSalarialOpen
            ? "DA61 a céntimos half-up antes de restar, observado en Open 2025"
            : redondeoCuotasHistoricasOpen
              ? "No aplicable al ejercicio histórico; importe cero"
              : "deducción de servicios después del artículo 80, una sola vez",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.cuota.posterior",
          instancia: 0,
          importe: posterior,
          unidad: "EUR",
          etiqueta: "Cuota posterior",
          formula: "cuota líquida legal − DA61",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.retenciones",
          instancia: 0,
          importe: retenciones,
          unidad: "EUR",
          etiqueta: "Retenciones efectivas",
          formula: "suma por operación única",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.pagos",
          instancia: 0,
          importe: pagos,
          unidad: "EUR",
          etiqueta: "Pagos fraccionados efectivos",
          formula: "suma por operación única",
        }),
        crearLineaCalculo({
          siteId: "anual.explicito.diferencial",
          instancia: 0,
          importe: diferencial,
          unidad: "EUR",
          etiqueta: "Cuota diferencial",
          formula: "cuota posterior − retenciones − pagos fraccionados",
        }),
      ],
    })
    return {
      _tag: "LiquidacionIrpfAnualExplicitaCalculada" as const,
      perfil: caso.perfil,
      ejercicio: caso.ejercicio,
      alcance:
        caso.ejercicio === 2025
          ? ("individual-comun-2025-hechos-explicitos" as const)
          : ("individual-madrid-2018-a-2024-hechos-explicitos" as const),
      rendimientoNetoReducido: neto.toFixed(),
      baseImponibleGeneral: neto.toFixed(),
      baseLiquidableGeneral: neto.toFixed(),
      baseLiquidableAhorro: "0",
      reduccionArt20: reduccionArt20.toFixed(),
      componentesCuota: {
        unidad: "EUR" as const,
        gravamenEstatal: gravamenEstatal.toFixed(),
        gravamenMinimoEstatal: gravamenMinimoEstatal.toFixed(),
        gravamenAutonomico: gravamenAutonomico.toFixed(),
        gravamenMinimoAutonomico: gravamenMinimoAutonomico.toFixed(),
        cuotaEstatal: cuotaEstatal.toFixed(),
        cuotaAutonomica: cuotaAutonomica.toFixed(),
      },
      deduccionesValencianas2025: composicion.deduccionesValencianas2025,
      deduccionesTerritoriales2025: composicion.deduccionesTerritoriales2025,
      cuotaLiquidaLegal: liquida.toFixed(),
      deduccionTrabajo: deduccion.toFixed(),
      cuotaPosterior: posterior.toFixed(),
      retenciones: retenciones.toFixed(),
      pagosFraccionados: pagos.toFixed(),
      cuotaDiferencial: diferencial.toFixed(),
      cuotaDiferencialPresentada: diferencial.toFixed(2, Decimal.ROUND_HALF_UP),
      aceptacionFiscal: "pendiente" as const,
      rastro: rastroTrasReforma({
        titulo: `Liquidación anual explícita ${caso.ejercicio}`,
        contexto: {
          anio: caso.ejercicio,
          territorio: caso.comunidadAutonoma,
          perfilCalculo: caso.perfil,
        },
        pasos,
      }),
    }
  }
)
