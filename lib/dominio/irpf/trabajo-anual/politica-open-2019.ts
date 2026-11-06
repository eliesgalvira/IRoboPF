import type Decimal from "decimal.js"
import { admiteOperandoOpen2018 } from "./politica-open-2018"

// Reutiliza sólo la guarda técnica numérica, no la política2018 de reducción/mezcla.
// Nueve testigos2019 tienen a–e1000. No se generalizan otros gastos ni su transporte.
export const admiteOperandoOpen2019 = admiteOperandoOpen2018
export const admiteArgumentoOpen2019 = (integro: Decimal, gastosAE: Decimal): boolean =>
  admiteOperandoOpen2019(integro) && gastosAE.eq(1000)
