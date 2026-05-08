import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2013Parte1 } from "../fuente-normativa"
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

export const MINIMOS_ESTATALES_2013 = {
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

export const MINIMOS_MADRID_2013 = {
  contribuyente: MINIMOS_ESTATALES_2013.contribuyente,
  descendientes: {
    primero: importe("1836"),
    segundo: importe("2040"),
    tercero: importe("4039.2"),
    cuartoYSiguientes: importe("4600.2"),
    adicionalMenorTres: importe("2244"),
  },
  ascendientes: MINIMOS_ESTATALES_2013.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2013.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

const MINIMOS_ESTATALES_POR_COMUNIDAD_2013 = {
  "simulada-estatal": MINIMOS_ESTATALES_2013,
  andalucia: MINIMOS_ESTATALES_2013,
  aragon: MINIMOS_ESTATALES_2013,
  asturias: MINIMOS_ESTATALES_2013,
  "illes-balears": MINIMOS_ESTATALES_2013,
  canarias: MINIMOS_ESTATALES_2013,
  cantabria: MINIMOS_ESTATALES_2013,
  "castilla-la-mancha": MINIMOS_ESTATALES_2013,
  "castilla-y-leon": MINIMOS_ESTATALES_2013,
  catalunya: MINIMOS_ESTATALES_2013,
  extremadura: MINIMOS_ESTATALES_2013,
  galicia: MINIMOS_ESTATALES_2013,
  madrid: MINIMOS_ESTATALES_2013,
  murcia: MINIMOS_ESTATALES_2013,
  "la-rioja": MINIMOS_ESTATALES_2013,
  "comunitat-valenciana": MINIMOS_ESTATALES_2013,
  ceuta: MINIMOS_ESTATALES_2013,
  melilla: MINIMOS_ESTATALES_2013,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2013 = parametroNormativo({
  nombre: "Mínimos autonómicos IRPF 2013 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2013,
    madrid: MINIMOS_MADRID_2013,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2013Parte1,
})

export const obtenerMinimosAutonomicosIrpf2013 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2013.valor[comunidadAutonoma]
