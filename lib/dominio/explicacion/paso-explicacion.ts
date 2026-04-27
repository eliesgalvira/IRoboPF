import type { FuenteExplicacion } from "./fuente-explicacion"

export interface PasoExplicacion {
  readonly _tag: "PasoExplicacion"
  readonly titulo: string
  readonly descripcion: string
  readonly fuentes: ReadonlyArray<FuenteExplicacion>
}
