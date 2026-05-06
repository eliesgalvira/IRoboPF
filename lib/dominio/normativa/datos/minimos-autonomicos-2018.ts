import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2018Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import {
  MINIMOS_ESTATALES_2025,
  type MinimoDiscapacidadIrpf,
  type MinimosPersonalesFamiliaresIrpf,
} from "./minimos-autonomicos-2025"

const importe = crearImporteMonetario

const discapacidad = (
  grado33Hasta65: string,
  grado65OMas: string,
  gastosAsistencia: string
): MinimoDiscapacidadIrpf => ({
  grado33Hasta65: importe(grado33Hasta65),
  grado65OMas: importe(grado65OMas),
  gastosAsistencia: importe(gastosAsistencia),
})

export const MINIMOS_ESTATALES_2018 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2018 = {
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
  ascendientes: MINIMOS_ESTATALES_2018.ascendientes,
  discapacidad: {
    contribuyente: discapacidad("3300", "9900", "3300"),
    descendiente: discapacidad("3300", "9900", "3300"),
    ascendiente: discapacidad("3300", "9900", "3300"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2018 = {
  contribuyente: MINIMOS_ESTATALES_2018.contribuyente,
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: MINIMOS_ESTATALES_2018.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2018.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_LA_RIOJA_2018 = {
  ...MINIMOS_ESTATALES_2018,
  discapacidad: {
    contribuyente: MINIMOS_ESTATALES_2018.discapacidad.contribuyente,
    ascendiente: MINIMOS_ESTATALES_2018.discapacidad.ascendiente,
    descendiente: discapacidad("3300", "9900", "3000"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

const MINIMOS_ESTATALES_POR_COMUNIDAD_2018 = {
  "simulada-estatal": MINIMOS_ESTATALES_2018,
  andalucia: MINIMOS_ESTATALES_2018,
  aragon: MINIMOS_ESTATALES_2018,
  asturias: MINIMOS_ESTATALES_2018,
  "illes-balears": MINIMOS_ESTATALES_2018,
  canarias: MINIMOS_ESTATALES_2018,
  cantabria: MINIMOS_ESTATALES_2018,
  "castilla-la-mancha": MINIMOS_ESTATALES_2018,
  "castilla-y-leon": MINIMOS_ESTATALES_2018,
  catalunya: MINIMOS_ESTATALES_2018,
  extremadura: MINIMOS_ESTATALES_2018,
  galicia: MINIMOS_ESTATALES_2018,
  madrid: MINIMOS_ESTATALES_2018,
  murcia: MINIMOS_ESTATALES_2018,
  "la-rioja": MINIMOS_ESTATALES_2018,
  "comunitat-valenciana": MINIMOS_ESTATALES_2018,
  ceuta: MINIMOS_ESTATALES_2018,
  melilla: MINIMOS_ESTATALES_2018,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2018 = parametroNormativo({
  nombre: "Minimos autonomicos IRPF 2018",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2018,
    "illes-balears": MINIMOS_ILLES_BALEARS_2018,
    madrid: MINIMOS_MADRID_2018,
    "la-rioja": MINIMOS_LA_RIOJA_2018,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2018Parte1,
})

export const obtenerMinimosAutonomicosIrpf2018 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2018.valor[comunidadAutonoma]
