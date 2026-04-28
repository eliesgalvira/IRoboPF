import type { FichaDeduccionAutonomica } from "../tipos"
import {
  categoriaCatalogadaDesdeCodigo,
  fichaImplementada,
  fichaImplementadaBasica,
  fichaImplementadaFormula,
  nombreCatalogadoDesdeCodigo,
} from "../helpers"

export const CEUTA_DEDUCCIONES_AUTONOMICAS_2025 =
  [] as const satisfies ReadonlyArray<FichaDeduccionAutonomica>
