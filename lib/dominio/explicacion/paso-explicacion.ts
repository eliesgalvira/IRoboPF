import type { FuenteExplicacion } from "./fuente-explicacion"

export interface PasoExplicacion {
  readonly _tag: "PasoExplicacion"
  readonly titulo: string
  readonly descripcion: string
  readonly lineasCalculo?: ReadonlyArray<LineaCalculo>
  readonly fuentes: ReadonlyArray<FuenteExplicacion>
}

export interface LineaCalculo {
  readonly etiqueta: string
  readonly formula: string
  readonly resultado: string
}
