import type { ModoCalculo } from "../perfil-calculo"
import type { RastroCalculo } from "../../explicacion/rastro-calculo"
import type { AnioFiscal } from "../../normativa/anio-fiscal"

export interface CasoRetencionTrabajo {
  readonly anio: AnioFiscal
  readonly retribucionAnualCentimos: number
  readonly situacionFamiliar: "general"
  readonly descendientes: number
  readonly ascendientes: number
  readonly discapacidad: "sin-discapacidad"
}

export interface ContextoRetencionTrabajo {
  readonly modo: ModoCalculo
}

export interface ResultadoNoSoportadoRetencion {
  readonly _tag: "ResultadoNoSoportado"
  readonly motivo: string
  readonly fuenteReconocida: string
  readonly rastro: RastroCalculo
}

export type ResultadoRetencionTrabajo = ResultadoNoSoportadoRetencion

export const calcularRetencionTrabajoAeat = (
  caso: CasoRetencionTrabajo,
  _contexto: ContextoRetencionTrabajo
): ResultadoRetencionTrabajo => {
  void _contexto

  return {
    _tag: "ResultadoNoSoportado",
    motivo: "Procedimiento de retencion de trabajo AEAT aun no implementado",
    fuenteReconocida: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
    rastro: {
      titulo: `Procedimiento de retencion de trabajo AEAT ${caso.anio}`,
      pasos: [
        {
          _tag: "PasoExplicacion",
          titulo: "Caso de retencion reconocido",
          descripcion:
            "El motor ha recibido rendimientos del trabajo para calcular una retencion a cuenta, no una liquidacion anual del IRPF.",
          fuentes: [
            {
              titulo: "Algoritmo de retenciones 2026",
              referencia: "docs/fuentes/aeat/algoritmo-retenciones-2026.md",
            },
          ],
        },
      ],
    },
  }
}
