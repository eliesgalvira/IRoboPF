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
    const magnitudes = [
      ["big", p.base.general, "Base imponible general", "trabajo art19/art20 del único perceptor"],
      ["reduccion-conjunta", reduccion.aplicadaGeneral, "Reducción conjunta aplicada", "art84 limitada a BIG; antes de escalas"],
      ["blg", comp.baseLiquidableGeneral, "Base liquidable general", "BIG menos reducción conjunta aplicada"],
      ["minimo-estatal", comp.minimoPersonalYFamiliar, "Mínimo estatal de unidad", "contribuyente una vez más hijo completo menor de tres"],
      ["minimo-autonomico", comp.minimoPersonalYFamiliarAutonomico, "Mínimo autonómico de unidad", "parámetros territoriales, contribuyente una vez e hijo completo"],
      ["diferencial", diferencial, "Cuota diferencial", "cuota posterior a DA61 menos retenciones efectivas una vez"],
    ] as const
    return {
      estado: "calculado" as const, ejercicio: 2025 as const, modalidad: "conjunta" as const,
      perfil: c.perfil, unidadId: c.unidadId, miembros: p.miembros,
      baseImponibleGeneral: p.base.general.toFixed(), baseLiquidableGeneral: comp.baseLiquidableGeneral.toFixed(),
      baseImponibleAhorro: "0", baseLiquidableAhorro: comp.baseLiquidableAhorro.toFixed(),
      reduccionConjunta: { teorica: reduccion.teorica.toFixed(), aplicadaGeneral: reduccion.aplicadaGeneral.toFixed(), aplicadaAhorro: reduccion.aplicadaAhorro.toFixed() },
      minimoContribuyente: comp.minimoContribuyente.toFixed(), minimoDescendientes: comp.minimoDescendientes.toFixed(),
      minimos: { estatal: comp.minimoPersonalYFamiliar.toFixed(), autonomico: comp.minimoPersonalYFamiliarAutonomico.toFixed() },
      cuotaLiquidaLegal: comp.cuotaLiquida.toFixed(), deduccionTrabajo: comp.deduccionTrabajo.toFixed(),
      cuotaPosterior: comp.cuotaPosterior.toFixed(), retenciones: p.retenciones.toFixed(), pagosFraccionados: "0",
      cuotaDiferencial: diferencial.toFixed(), cuotaDiferencialPresentada: diferencial.toFixed(2, Decimal.ROUND_HALF_UP),
      aceptacionFiscal: "pendiente" as const,
      rastro: { titulo: "Liquidación conjunta ordinaria2025", pasos: [{
        _tag: "PasoExplicacion" as const, titulo: "Unidad, reducción, mínimos y pagos",
        descripcion: "Censo y opción completos al31/12. Precisión decimal hasta salida. Sin evidencia Open conjunta; resultado condicionado.",
        fuentes: [{ titulo: "Alcance conjunto y fuentes AEAT2025", referencia: fuente }],
        lineasCalculo: magnitudes.map(([id, importe, etiqueta, formula]) => crearLineaCalculo({ siteId: `anual.conjunta.${id}`, instancia: 0, importe, unidad: "EUR", etiqueta, formula })),
      }] },
    }
  }
)
