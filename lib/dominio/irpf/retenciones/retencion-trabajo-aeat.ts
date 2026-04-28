import { Context, Effect, Layer } from "effect"

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
export type CalcularRetencionTrabajoError = ResultadoNoSoportadoRetencion

const resultadoNoSoportadoRetencion = (
  caso: CasoRetencionTrabajo
): ResultadoNoSoportadoRetencion => ({
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
})

const calcularRetencionTrabajoAeatImpl = Effect.fn(
  "RetencionTrabajoAeat.calcular"
)(function* (caso: CasoRetencionTrabajo, _contexto: ContextoRetencionTrabajo) {
  void _contexto

  return yield* Effect.fail(resultadoNoSoportadoRetencion(caso))
})

export class RetencionTrabajoAeat extends Context.Service<
  RetencionTrabajoAeat,
  {
    readonly calcular: (
      caso: CasoRetencionTrabajo,
      contexto: ContextoRetencionTrabajo
    ) => Effect.Effect<never, CalcularRetencionTrabajoError>
  }
>()("@irobopf/dominio/irpf/RetencionTrabajoAeat") {
  static readonly layer = Layer.succeed(RetencionTrabajoAeat, {
    calcular: calcularRetencionTrabajoAeatImpl,
  })
}

const calcularRetencionTrabajoAeatDesdeServicio = Effect.fn(
  "RetencionTrabajoAeat.calcularDesdeServicio"
)(function* (caso: CasoRetencionTrabajo, contexto: ContextoRetencionTrabajo) {
  const retencion = yield* RetencionTrabajoAeat

  return yield* retencion.calcular(caso, contexto)
})

export const calcularRetencionTrabajoAeat = (
  caso: CasoRetencionTrabajo,
  contexto: ContextoRetencionTrabajo
): Effect.Effect<never, CalcularRetencionTrabajoError> =>
  calcularRetencionTrabajoAeatDesdeServicio(caso, contexto).pipe(
    Effect.provide(RetencionTrabajoAeat.layer)
  )
