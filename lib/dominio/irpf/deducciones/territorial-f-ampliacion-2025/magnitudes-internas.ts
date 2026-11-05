import type Decimal from "decimal.js"
import type { SolicitudF } from "./esquemas"

/** Canal interno por identidad de objeto; no forma parte de ningún Schema JSON. */
export type MagnitudesInternasF = {
  readonly contribuyente: string
  readonly general: Decimal
  readonly ahorro: Decimal
  readonly liquidableGeneral?: Decimal | undefined
  readonly liquidableAhorro?: Decimal | undefined
  readonly minimoPersonalFamiliar: Decimal
}
const internas = new WeakMap<SolicitudF, MagnitudesInternasF>()
export const magnitudesInternasF = (s: SolicitudF) => internas.get(s)
export function conMagnitudesInternasF<T>(
  s: SolicitudF,
  m: MagnitudesInternasF,
  evaluar: () => T
): T {
  internas.set(s, m)
  try {
    return evaluar()
  } finally {
    internas.delete(s)
  }
}
