import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2021Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import {
  MINIMOS_AUTONOMICOS_IRPF_2025,
  MINIMOS_ESTATALES_2025,
  type MinimosPersonalesFamiliaresIrpf,
} from "./minimos-autonomicos-2025"

const importe = crearImporteMonetario

export const MINIMOS_ESTATALES_2021 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2021 = {
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1820"),
    adicionalMayor75: importe("1540"),
  },
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  discapacidad:
    MINIMOS_AUTONOMICOS_IRPF_2025.valor["illes-balears"].discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2021 = {
  contribuyente: MINIMOS_ESTATALES_2021.contribuyente,
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: MINIMOS_ESTATALES_2021.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2021.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_AUTONOMICOS_IRPF_2021 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2021",
  valor: {
    ...MINIMOS_AUTONOMICOS_IRPF_2025.valor,
    andalucia: MINIMOS_ESTATALES_2021,
    asturias: MINIMOS_ESTATALES_2021,
    "illes-balears": MINIMOS_ILLES_BALEARS_2021,
    canarias: MINIMOS_ESTATALES_2021,
    galicia: MINIMOS_ESTATALES_2021,
    madrid: MINIMOS_MADRID_2021,
    "comunitat-valenciana": MINIMOS_ESTATALES_2021,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2021Parte1,
})

export const obtenerMinimosAutonomicosIrpf2021 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2021.valor[comunidadAutonoma]
