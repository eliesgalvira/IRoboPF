import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2019Parte1 } from "../fuente-normativa"
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

export const MINIMOS_ESTATALES_2019 = MINIMOS_ESTATALES_2025

export const MINIMOS_ILLES_BALEARS_2019 = {
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
  ascendientes: MINIMOS_ESTATALES_2019.ascendientes,
  discapacidad: {
    contribuyente: discapacidad("3300", "9900", "3300"),
    descendiente: discapacidad("3300", "9900", "3300"),
    ascendiente: discapacidad("3300", "9900", "3300"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2019 = {
  contribuyente: MINIMOS_ESTATALES_2019.contribuyente,
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: MINIMOS_ESTATALES_2019.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2019.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_LA_RIOJA_2019 = {
  ...MINIMOS_ESTATALES_2019,
  discapacidad: {
    contribuyente: MINIMOS_ESTATALES_2019.discapacidad.contribuyente,
    ascendiente: MINIMOS_ESTATALES_2019.discapacidad.ascendiente,
    descendiente: discapacidad("3300", "9900", "3000"),
  },
} satisfies MinimosPersonalesFamiliaresIrpf

const MINIMOS_ESTATALES_POR_COMUNIDAD_2019 = {
  "simulada-estatal": MINIMOS_ESTATALES_2019,
  andalucia: MINIMOS_ESTATALES_2019,
  aragon: MINIMOS_ESTATALES_2019,
  asturias: MINIMOS_ESTATALES_2019,
  "illes-balears": MINIMOS_ESTATALES_2019,
  canarias: MINIMOS_ESTATALES_2019,
  cantabria: MINIMOS_ESTATALES_2019,
  "castilla-la-mancha": MINIMOS_ESTATALES_2019,
  "castilla-y-leon": MINIMOS_ESTATALES_2019,
  catalunya: MINIMOS_ESTATALES_2019,
  extremadura: MINIMOS_ESTATALES_2019,
  galicia: MINIMOS_ESTATALES_2019,
  madrid: MINIMOS_ESTATALES_2019,
  murcia: MINIMOS_ESTATALES_2019,
  "la-rioja": MINIMOS_ESTATALES_2019,
  "comunitat-valenciana": MINIMOS_ESTATALES_2019,
  ceuta: MINIMOS_ESTATALES_2019,
  melilla: MINIMOS_ESTATALES_2019,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2019 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2019",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2019,
    "illes-balears": MINIMOS_ILLES_BALEARS_2019,
    madrid: MINIMOS_MADRID_2019,
    "la-rioja": MINIMOS_LA_RIOJA_2019,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2019Parte1,
})

export const obtenerMinimosAutonomicosIrpf2019 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2019.valor[comunidadAutonoma]
