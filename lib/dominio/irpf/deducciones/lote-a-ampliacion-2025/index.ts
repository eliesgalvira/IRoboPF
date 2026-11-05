import { Schema } from "effect"
import { exigir, fecha, ref, salida, type ResultadoAmpliacion } from "./comun"
import { SolicitudAndalucia, calcularAndalucia } from "./andalucia"
import { SolicitudAragon, calcularAragon } from "./aragon"
import { SolicitudCatalunya, calcularCatalunya } from "./catalunya"
import { referencias } from "./referencias"

export const SolicitudAmpliacionLoteA2025 = Schema.Union([
  SolicitudAndalucia,
  SolicitudAragon,
  SolicitudCatalunya,
])
export type SolicitudAmpliacionLoteA2025 =
  typeof SolicitudAmpliacionLoteA2025.Type
export type { ResultadoAmpliacion } from "./comun"
export const CODIGOS_AMPLIACION_LOTE_A_2025 = Object.keys(referencias)
/** Evalúa hechos nuevos exclusivamente; no replica nacimiento andaluz ni los seis catalanes existentes. */
export function evaluarAmpliacionLoteA2025(
  entrada: SolicitudAmpliacionLoteA2025
): ResultadoAmpliacion {
  try {
    const h = Schema.decodeUnknownSync(SolicitudAmpliacionLoteA2025)(entrada, {
      onExcessProperty: "error",
    })
    ref(h.contribuyente)
    fecha(h.nacimiento)
    exigir(h.nacimiento <= h.devengo, "Nacimiento posterior al devengo")
    const importe =
      h.territorio === "andalucia"
        ? calcularAndalucia(h)
        : h.territorio === "aragon"
          ? calcularAragon(h)
          : calcularCatalunya(h)
    return salida(h, h.codigo, importe, referencias[h.codigo], [
      ...(h.territorio === "aragon"
        ? [
            "Fiscalidad diferenciada: el mantenimiento hasta2029 requiere seguimiento; no se certifica residencia futura.",
          ]
        : []),
      ...(h.codigo.includes("inversion") || h.codigo.includes("angel")
        ? [
            "Mantenimiento futuro de participación, empleo, voto, domicilio y actividad según artículo propio; no se certifica ni se liquida regularización futura.",
          ]
        : []),
      ...(h.codigo === "cataluna_inversion_cooperativas_agrarias_vivienda"
        ? [
            "Arrastre por insuficiencia: no se fija caducidad ni se aplica remanente; corresponde a composición/cuota.",
          ]
        : []),
    ])
  } catch (cause) {
    return {
      estado: "no_soportado",
      motivo:
        cause instanceof Error
          ? cause.message
          : "Esquema territorial2025 inválido: faltan hechos, sobran campos o el ámbito/discriminante no está soportado",
    }
  }
}
