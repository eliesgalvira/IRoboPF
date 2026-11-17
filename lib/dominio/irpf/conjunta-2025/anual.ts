import Decimal from "decimal.js"
import { Effect } from "effect"
import type { CasoConjunta2025 } from "./contrato"
import { prepararConjunta2025 } from "./preparar"
import { componerLiquidacionAnual } from "../liquidacion/composicion-anual"
import { liquidarPagosAnuales } from "../cuotas/cuota-diferencial"
import { MINIMOS_ESTATALES_2025 } from "../../normativa/datos/minimos-autonomicos-2025"
import type { ResultadoNoSoportado } from "../liquidacion/liquidar-irpf-anual"
import { crearLineaCalculo } from "../../explicacion/linea-calculo"
const D = Decimal.clone({ precision: 80 })
const fuente = "docs/procedencia/implementaciones/conjunta-ordinaria-2025/INFORME.md"
const rechazo = (cause: unknown): ResultadoNoSoportado => ({
  _tag: "ResultadoNoSoportado", motivo: String(cause), fuenteReconocida: fuente,
  rastro: { titulo: "Alcance conjunto2025", pasos: [] },
})
/** Ruta anual explícita conjunta; nunca construye una declaración individual. */
export const liquidarConjunta2025 = Effect.fn("Liquidacion.conjunta2025")(
  function* (entrada: CasoConjunta2025) {
    const p = yield* Effect.try({ try: () => prepararConjunta2025(entrada), catch: rechazo })
    const c = p.caso
    const comp = yield* componerLiquidacionAnual({
      conjunta2025: c,
      ambito: {
        anio: 2025, comunidadAutonoma: c.comunidadAutonoma, contribuyenteId: c.declarante.id,
        situacionFamiliar: { tipo: "conjunta", edad: p.edad, discapacidad: { _tag: "SinDiscapacidad" }, descendientes: [], ascendientes: [] },
      },
      cotizaciones: { naturaleza: "efectivas", trabajador: p.cotizaciones },
      precision: 80, politica: "decimal-hasta-salida",
      origenBaseGeneralB: "solo-trabajo",
      rentasTrabajoAnuales: { integroTrabajo: p.bruto, restoRentas: new D(0) },
      baseGeneral: p.base.general, baseAhorro: new D(0),
      rentasAntesReducciones: p.base.rentaAntesReducciones!,
      minimosEstatales: MINIMOS_ESTATALES_2025, deduccionesAutonomicasCentimos: 0,
      serviciosLaborales: { bruto: p.bruto },
    })
    const reduccion = comp.reduccionConjunta!
    const diferencial = liquidarPagosAnuales(comp.cuotaPosterior, p.retenciones, new D(0))
    return {
      estado: "calculado" as const, ejercicio: 2025 as const, modalidad: "conjunta" as const,
      perfil: c.perfil, unidadId: c.unidadId, miembros: p.miembros,
      baseImponibleGeneral: p.base.general.toFixed(), baseLiquidableGeneral: comp.baseLiquidableGeneral.toFixed(),
      baseImponibleAhorro: "0", baseLiquidableAhorro: comp.baseLiquidableAhorro.toFixed(),
      reduccionConjunta: { teorica: reduccion.teorica.toFixed(), aplicadaGeneral: reduccion.aplicadaGeneral.toFixed(), aplicadaAhorro: reduccion.aplicadaAhorro.toFixed() },
      minimoContribuyente: comp.minimoContribuyente.toFixed(), minimoDescendientes: comp.minimoDescendientes.toFixed(),
      minimos: { estatal: comp.minimoPersonalYFamiliar.toFixed(), autonomico: comp.minimoPersonalYFamiliarAutonomico.toFixed() },
      politicaCuantizacion: comp.politicaCuantizacionConjunta ?? "decimal-hasta-salida",
      gravamenes: {
        baseEstatal: comp.cuotaIntegraGeneralEstatal.toFixed(), baseAutonomica: comp.cuotaIntegraGeneralAutonomica.toFixed(),
        minimoEstatal: comp.cuotaMinimoPersonalEstatal.toFixed(), minimoAutonomico: comp.cuotaMinimoPersonalAutonomica.toFixed(),
      },
      cuotasNetas: { estatal: comp.cuotaEstatalDespuesMinimo.toFixed(), autonomica: comp.cuotaAutonomicaGeneralDespuesMinimo.toFixed() },
      cuotaLiquidaLegal: comp.cuotaLiquida.toFixed(), deduccionTrabajo: comp.deduccionTrabajo.toFixed(),
      cuotaPosterior: comp.cuotaPosterior.toFixed(), retenciones: p.retenciones.toFixed(), pagosFraccionados: "0",
      cuotaDiferencial: diferencial.toFixed(), cuotaDiferencialPresentada: diferencial.toFixed(2, Decimal.ROUND_HALF_UP),
      aceptacionFiscal: "pendiente" as const,
      rastro: { titulo: "Liquidación conjunta ordinaria2025", pasos: [{
        _tag: "PasoExplicacion" as const, titulo: "Unidad, reducción, mínimos y pagos",
        descripcion: comp.politicaCuantizacionConjunta === undefined
          ? "Censo y opción completos al31/12. Precisión decimal hasta salida. Fuera de la frontera de cuantización por componentes; resultado condicionado."
          : "Censo y opción completos al31/12. Tablas publicadas y HALF_UP al céntimo por gravamen antes de restar mínimos, sumar cuotas y restar pagos. Compatible con referencias sintéticas matrimoniales y monoparental de Castilla y León SES/PDF; gravámenes y netas son equivalentes en esta frontera, sin identificar la etapa interna de Open. Aceptación fiscal pendiente.",
        fuentes: [{ titulo: "Política monetaria y reserva documental", referencia: "docs/procedencia/implementaciones/conjunta-cuantizacion-2025/ALCANCE.md" }, { titulo: "Alcance conjunto y fuentes AEAT2025", referencia: fuente }],
        lineasCalculo: [
          crearLineaCalculo({ siteId: "anual.conjunta.big", instancia: 0, importe: p.base.general, unidad: "EUR", etiqueta: "Base imponible general", formula: "trabajo art19/art20 del único perceptor" }),
          crearLineaCalculo({ siteId: "anual.conjunta.reduccion-conjunta", instancia: 0, importe: reduccion.aplicadaGeneral, unidad: "EUR", etiqueta: "Reducción conjunta aplicada", formula: "art84 limitada a BIG; antes de escalas" }),
          crearLineaCalculo({ siteId: "anual.conjunta.blg", instancia: 0, importe: comp.baseLiquidableGeneral, unidad: "EUR", etiqueta: "Base liquidable general", formula: "BIG menos reducción conjunta aplicada" }),
          crearLineaCalculo({ siteId: "anual.conjunta.minimo-estatal", instancia: 0, importe: comp.minimoPersonalYFamiliar, unidad: "EUR", etiqueta: "Mínimo estatal de unidad", formula: "contribuyente una vez más hijo completo menor de tres" }),
          crearLineaCalculo({ siteId: "anual.conjunta.minimo-autonomico", instancia: 0, importe: comp.minimoPersonalYFamiliarAutonomico, unidad: "EUR", etiqueta: "Mínimo autonómico de unidad", formula: "parámetros territoriales, contribuyente una vez e hijo completo" }),
          crearLineaCalculo({ siteId: "anual.conjunta.gravamen-base-estatal", instancia: 0, importe: comp.cuotaIntegraGeneralEstatal, unidad: "EUR", etiqueta: "Gravamen estatal de base", formula: "escala estatal; política monetaria declarada" }),
          crearLineaCalculo({ siteId: "anual.conjunta.gravamen-base-autonomica", instancia: 0, importe: comp.cuotaIntegraGeneralAutonomica, unidad: "EUR", etiqueta: "Gravamen autonómico de base", formula: "escala autonómica; política monetaria declarada" }),
          crearLineaCalculo({ siteId: "anual.conjunta.gravamen-minimo-estatal", instancia: 0, importe: comp.cuotaMinimoPersonalEstatal, unidad: "EUR", etiqueta: "Gravamen mínimo estatal", formula: "escala estatal sobre mínimo aplicado; política monetaria declarada" }),
          crearLineaCalculo({ siteId: "anual.conjunta.gravamen-minimo-autonomico", instancia: 0, importe: comp.cuotaMinimoPersonalAutonomica, unidad: "EUR", etiqueta: "Gravamen mínimo autonómico", formula: "escala autonómica sobre mínimo aplicado; política monetaria declarada" }),
          crearLineaCalculo({ siteId: "anual.conjunta.neta-estatal", instancia: 0, importe: comp.cuotaEstatalDespuesMinimo, unidad: "EUR", etiqueta: "Cuota neta estatal", formula: "gravamen de base menos gravamen del mínimo" }),
          crearLineaCalculo({ siteId: "anual.conjunta.neta-autonomica", instancia: 0, importe: comp.cuotaAutonomicaGeneralDespuesMinimo, unidad: "EUR", etiqueta: "Cuota neta autonómica", formula: "gravamen de base menos gravamen del mínimo" }),
          crearLineaCalculo({ siteId: "anual.conjunta.diferencial", instancia: 0, importe: diferencial, unidad: "EUR", etiqueta: "Cuota diferencial", formula: "cuota posterior a DA61 menos retenciones efectivas una vez" }),
        ],
      }] },
    }
  }
)
