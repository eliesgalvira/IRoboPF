import type { PasoExplicacion } from "./paso-explicacion"

export interface RastroCalculo {
  readonly titulo: string
  readonly pasos: ReadonlyArray<PasoExplicacion>
}
