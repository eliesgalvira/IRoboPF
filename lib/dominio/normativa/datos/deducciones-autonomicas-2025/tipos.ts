export type CategoriaDeduccionAutonomica =
  | "circunstancias_personales_familiares"
  | "vivienda_habitual"
  | "donativos_donaciones"
  | "otros_conceptos"

/**
 * Estados del ciclo de vida de una deducción autonómica en el motor.
 *
 * - catalogada: existe en el manual y el motor puede reconocerla, pero todavia
 *   no hay una ficha revisada con datos suficientes para calcularla.
 * - normalizada_pendiente_tests: ya hay ficha estructurada, pero falta cubrirla
 *   con tests antes de usarla en una liquidacion.
 * - implementada: tiene ficha, evaluador de interfaz y tests o verificacion de
 *   comportamiento suficiente para poder aplicarla.
 * - no_soportada: se ha revisado y se sabe que este motor no puede calcularla
 *   con los datos disponibles; debe producir diagnostico visible, no cero.
 */
export type EstadoDeduccionAutonomica =
  | "catalogada"
  | "normalizada_pendiente_tests"
  | "implementada"
  | "no_soportada"

export type EstadoImplementada = Extract<
  EstadoDeduccionAutonomica,
  "implementada"
>

export type CuantiaDeduccionAutonomica =
  | {
      readonly tipo: "importe_fijo"
      readonly euros: string
      readonly por: string
    }
  | {
      readonly tipo: "porcentaje"
      readonly porcentaje: string
      readonly base: string
      readonly limiteMaximoEuros?: string
    }
  | {
      readonly tipo: "mixta"
      readonly descripcion: string
    }

export interface FuenteManualDeduccionAutonomica {
  readonly documento: "ManualRenta2025Parte2"
  readonly paginas: ReadonlyArray<number>
}

export type FichaDeduccionAutonomica = {
  readonly codigo: string
  readonly comunidad: string
  readonly nombre: string
  readonly normativa: string
  readonly categoria: CategoriaDeduccionAutonomica
  readonly cuantia: CuantiaDeduccionAutonomica
  readonly requisitos: ReadonlyArray<string>
  readonly limites: ReadonlyArray<string>
  readonly prorrateo: ReadonlyArray<string>
  readonly compatibilidades: ReadonlyArray<string>
  readonly incompatibilidades: ReadonlyArray<string>
  readonly entradaNecesaria: ReadonlyArray<string>
  readonly fuenteManual: FuenteManualDeduccionAutonomica
  readonly estado: EstadoDeduccionAutonomica
}

export type DeduccionAutonomicaCatalogada = FichaDeduccionAutonomica

export type CatalogoDeduccionesAutonomicasPorComunidad = {
  readonly comunidad: string
  readonly fuente: string
  readonly deducciones: ReadonlyArray<FichaDeduccionAutonomica>
}
