import type Decimal from "decimal.js"
import type { LineaCalculo } from "./paso-explicacion"

/** Identidad del punto de código y valor previo al formato visual. */
export function crearLineaCalculo({
  siteId,
  instancia,
  importe,
  unidad,
  etiqueta,
  formula,
}: {
  readonly siteId: string
  readonly instancia: number
  readonly importe: Decimal
  readonly unidad: "EUR" | "percent"
  readonly etiqueta: string
  readonly formula: string
}): LineaCalculo {
  return {
    etiqueta,
    formula,
    resultado:
      unidad === "EUR"
        ? `${importe.toFixed(2)} euros`
        : `${importe.toString()}%`,
    origen: {
      siteId,
      instanceId: `${siteId}.${instancia}`,
      decimal: importe.toFixed(),
      unidad,
    },
  }
}
