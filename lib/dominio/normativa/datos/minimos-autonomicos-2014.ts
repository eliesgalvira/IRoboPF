import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2014Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"
import type {
  MinimoDiscapacidadIrpf,
  MinimosPersonalesFamiliaresIrpf,
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

const discapacidadComun = (
  grado33Hasta65: string,
  grado65OMas: string,
  gastosAsistencia: string
) => ({
  contribuyente: discapacidad(grado33Hasta65, grado65OMas, gastosAsistencia),
  descendiente: discapacidad(grado33Hasta65, grado65OMas, gastosAsistencia),
  ascendiente: discapacidad(grado33Hasta65, grado65OMas, gastosAsistencia),
})

export const MINIMOS_ESTATALES_2014 = {
  contribuyente: {
    general: importe("5151"),
    adicionalMayor65: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  descendientes: {
    primero: importe("1836"),
    segundo: importe("2040"),
    tercero: importe("3672"),
    cuartoYSiguientes: importe("4182"),
    adicionalMenorTres: importe("2244"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("918"),
    adicionalMayor75: importe("1122"),
  },
  discapacidad: discapacidadComun("2316", "7038", "2316"),
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_CANTABRIA_2014 = {
  contribuyente: MINIMOS_ESTATALES_2014.contribuyente,
  descendientes: {
    primero: importe("2000"),
    segundo: importe("2200"),
    tercero: importe("3900"),
    cuartoYSiguientes: importe("4450"),
    adicionalMenorTres: importe("2400"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("970"),
    adicionalMayor75: importe("1200"),
  },
  discapacidad: discapacidadComun("2400", "7200", "2400"),
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_CASTILLA_LA_MANCHA_2014 = {
  contribuyente: MINIMOS_ESTATALES_2014.contribuyente,
  descendientes: {
    primero: importe("1927.8"),
    segundo: importe("2142"),
    tercero: importe("3855.6"),
    cuartoYSiguientes: importe("4391.1"),
    adicionalMenorTres: importe("2356.2"),
  },
  ascendientes: MINIMOS_ESTATALES_2014.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2014.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

export const MINIMOS_MADRID_2014 = {
  contribuyente: MINIMOS_ESTATALES_2014.contribuyente,
  descendientes: {
    primero: importe("1836"),
    segundo: importe("2040"),
    tercero: importe("4039.2"),
    cuartoYSiguientes: importe("4600.2"),
    adicionalMenorTres: importe("2244"),
  },
  ascendientes: MINIMOS_ESTATALES_2014.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2014.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

const MINIMOS_ESTATALES_POR_COMUNIDAD_2014 = {
  "simulada-estatal": MINIMOS_ESTATALES_2014,
  andalucia: MINIMOS_ESTATALES_2014,
  aragon: MINIMOS_ESTATALES_2014,
  asturias: MINIMOS_ESTATALES_2014,
  "illes-balears": MINIMOS_ESTATALES_2014,
  canarias: MINIMOS_ESTATALES_2014,
  cantabria: MINIMOS_ESTATALES_2014,
  "castilla-la-mancha": MINIMOS_ESTATALES_2014,
  "castilla-y-leon": MINIMOS_ESTATALES_2014,
  catalunya: MINIMOS_ESTATALES_2014,
  extremadura: MINIMOS_ESTATALES_2014,
  galicia: MINIMOS_ESTATALES_2014,
  madrid: MINIMOS_ESTATALES_2014,
  murcia: MINIMOS_ESTATALES_2014,
  "la-rioja": MINIMOS_ESTATALES_2014,
  "comunitat-valenciana": MINIMOS_ESTATALES_2014,
  ceuta: MINIMOS_ESTATALES_2014,
  melilla: MINIMOS_ESTATALES_2014,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2014 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2014 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2014,
    cantabria: MINIMOS_CANTABRIA_2014,
    "castilla-la-mancha": MINIMOS_CASTILLA_LA_MANCHA_2014,
    madrid: MINIMOS_MADRID_2014,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2014Parte1,
})

export const obtenerMinimosAutonomicosIrpf2014 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2014.valor[comunidadAutonoma]
