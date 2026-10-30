import { calcularActividad2025 } from "./calcular"
import type {
  AporteActividadGeneral,
  CasoActividad2025,
  EtapaActividad,
  MotivoActividad,
} from "./contrato"

export type AdaptacionActividadGeneral =
  | {
      readonly estado: "no-soportado"
      readonly motivos: readonly MotivoActividad[]
    }
  | {
      readonly estado: "aporte-disponible"
      readonly aporte: AporteActividadGeneral
      readonly etapas: readonly EtapaActividad[]
      readonly aceptacionFiscal: "pendiente"
    }

/** No convierte a céntimos ni llama a la liquidación salarial/anual existente. */
export function adaptarActividadGeneral(
  caso: CasoActividad2025
): AdaptacionActividadGeneral {
  const resultado = calcularActividad2025(caso)
  if (resultado.estado === "no-soportado") return resultado
  return {
    estado: "aporte-disponible",
    aporte: resultado.aporte,
    etapas: resultado.etapas,
    aceptacionFiscal: "pendiente",
  }
}
