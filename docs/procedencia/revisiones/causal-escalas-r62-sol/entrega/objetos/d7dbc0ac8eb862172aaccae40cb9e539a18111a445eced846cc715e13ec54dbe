import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2024Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import {
  MINIMOS_AUTONOMICOS_IRPF_2025,
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "./minimos-autonomicos-2025"

export const MINIMOS_ESTATALES_2024 = MINIMOS_ESTATALES_2025

export const MINIMOS_AUTONOMICOS_IRPF_2024 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2024",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    asturias: MINIMOS_ESTATALES_2024,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2024Parte1,
})

export const obtenerMinimosAutonomicosIrpf2024 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2024.valor[comunidadAutonoma]
