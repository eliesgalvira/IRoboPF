import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2020Parte1 } from "../fuente-normativa"
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

export const MINIMOS_ESTATALES_2020 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2020 = {
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
  ascendientes: MINIMOS_ESTATALES_2020.ascendientes,
  discapacidad: {
    contribuyente: discapacidad("3300", "9900", "3300"),
    descendiente: discapacidad("3300", "9900", "3300"),
    ascendiente: discapacidad("3300", "9900", "3300"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2020 = {
  contribuyente: MINIMOS_ESTATALES_2020.contribuyente,
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: MINIMOS_ESTATALES_2020.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2020.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_LA_RIOJA_2020 = {
  ...MINIMOS_ESTATALES_2020,
  discapacidad: {
    contribuyente: MINIMOS_ESTATALES_2020.discapacidad.contribuyente,
    ascendiente: MINIMOS_ESTATALES_2020.discapacidad.ascendiente,
    descendiente: discapacidad("3300", "9900", "3000"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_CATALUNYA_2020_CANONICO = MINIMOS_ESTATALES_2020

const MINIMOS_ESTATALES_POR_COMUNIDAD_2020 = {
  "simulada-estatal": MINIMOS_ESTATALES_2020,
  andalucia: MINIMOS_ESTATALES_2020,
  aragon: MINIMOS_ESTATALES_2020,
  asturias: MINIMOS_ESTATALES_2020,
  "illes-balears": MINIMOS_ESTATALES_2020,
  canarias: MINIMOS_ESTATALES_2020,
  cantabria: MINIMOS_ESTATALES_2020,
  "castilla-la-mancha": MINIMOS_ESTATALES_2020,
  "castilla-y-leon": MINIMOS_ESTATALES_2020,
  catalunya: MINIMOS_ESTATALES_2020,
  extremadura: MINIMOS_ESTATALES_2020,
  galicia: MINIMOS_ESTATALES_2020,
  madrid: MINIMOS_ESTATALES_2020,
  murcia: MINIMOS_ESTATALES_2020,
  "la-rioja": MINIMOS_ESTATALES_2020,
  "comunitat-valenciana": MINIMOS_ESTATALES_2020,
  ceuta: MINIMOS_ESTATALES_2020,
  melilla: MINIMOS_ESTATALES_2020,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2020 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2020",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2020,
    "illes-balears": MINIMOS_ILLES_BALEARS_2020,
    catalunya: MINIMOS_CATALUNYA_2020_CANONICO,
    madrid: MINIMOS_MADRID_2020,
    "la-rioja": MINIMOS_LA_RIOJA_2020,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2020Parte1,
})

export const obtenerMinimosAutonomicosIrpf2020 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2020.valor[comunidadAutonoma]
