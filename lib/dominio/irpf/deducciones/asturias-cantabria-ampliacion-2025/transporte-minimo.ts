// Reutiliza la misma representación familiar: no hay segundo contrato de mínimos.
import { minimoDesc } from "./comun"
import { prioridad, type Descendiente } from "./familia"
export function minimoTransporte(p: Descendiente): boolean {
  return prioridad(p) && minimoDesc(p, p.titulares)
}
