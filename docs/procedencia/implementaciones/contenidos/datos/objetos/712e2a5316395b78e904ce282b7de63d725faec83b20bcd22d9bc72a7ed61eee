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
  readonly origen?: {
    readonly siteId: string
    readonly instanceId: string
    readonly decimal: string
    readonly unidad: "EUR" | "percent"
  }
  readonly procedencia?:
    | {
        readonly estado: "enlazada"
        readonly snapshot: string
        readonly algoritmo: string
        readonly datos: string
        readonly explicacion: string
        readonly sujeto: { readonly id: string; readonly revision: string }
        readonly href: string
      }
    | { readonly estado: "pendiente"; readonly motivo: string }
}
