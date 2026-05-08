import { crearImporteMonetario } from "../../dinero/importe-monetario"
import { fuenteAeatRetenciones2026 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"

export const LIMITE_RETENCION_LEGACY_43_POR_CIENTO = parametroNormativo({
  nombre: "Límite de retención legacy 43 por ciento",
  valor: crearImporteMonetario("0.43"),
  fuente: fuenteAeatRetenciones2026,
})
