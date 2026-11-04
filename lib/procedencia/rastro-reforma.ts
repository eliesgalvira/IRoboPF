import { enlazarRastroAnualActual } from "./rastro-anual"
import type { RastroCalculo } from "../dominio/explicacion/rastro-calculo"

/** Los enlaces conservan su versión histórica; no certifican este código. */
export const rastroTrasReforma = (rastro: RastroCalculo): RastroCalculo => {
  const historico = enlazarRastroAnualActual(rastro)
  return {
    ...historico,
    pasos: historico.pasos.map((paso) =>
      paso.lineasCalculo === undefined
        ? paso
        : {
            ...paso,
            lineasCalculo: paso.lineasCalculo.map((linea) => {
              const referencia = linea.procedencia
              if (referencia?.estado !== "enlazada") return linea
              return {
                ...linea,
                procedencia: {
                  estado: "pendiente" as const,
                  motivo: `Reforma pendiente de nuevo snapshot y revisión. Referencia histórica: ${referencia.href}; snapshot ${referencia.snapshot}; algoritmo ${referencia.algoritmo}; datos ${referencia.datos}; explicación ${referencia.explicacion}; sujeto ${referencia.sujeto.id}@${referencia.sujeto.revision}`,
                },
              }
            }),
          }
    ),
  }
}
