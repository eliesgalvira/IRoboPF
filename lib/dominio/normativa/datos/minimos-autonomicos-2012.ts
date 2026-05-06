import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2012Parte1 } from "../fuente-normativa"
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

export const MINIMOS_ESTATALES_2012 = {
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

export const MINIMOS_MADRID_2012 = {
  contribuyente: MINIMOS_ESTATALES_2012.contribuyente,
  descendientes: {
    primero: importe("1836"),
    segundo: importe("2040"),
    tercero: importe("4039.2"),
    cuartoYSiguientes: importe("4600.2"),
    adicionalMenorTres: importe("2244"),
  },
  ascendientes: MINIMOS_ESTATALES_2012.ascendientes,
  discapacidad: MINIMOS_ESTATALES_2012.discapacidad,
} satisfies MinimosPersonalesFamiliaresIrpf

const MINIMOS_ESTATALES_POR_COMUNIDAD_2012 = {
  "simulada-estatal": MINIMOS_ESTATALES_2012,
  andalucia: MINIMOS_ESTATALES_2012,
  aragon: MINIMOS_ESTATALES_2012,
  asturias: MINIMOS_ESTATALES_2012,
  "illes-balears": MINIMOS_ESTATALES_2012,
  canarias: MINIMOS_ESTATALES_2012,
  cantabria: MINIMOS_ESTATALES_2012,
  "castilla-la-mancha": MINIMOS_ESTATALES_2012,
  "castilla-y-leon": MINIMOS_ESTATALES_2012,
  catalunya: MINIMOS_ESTATALES_2012,
  extremadura: MINIMOS_ESTATALES_2012,
  galicia: MINIMOS_ESTATALES_2012,
  madrid: MINIMOS_ESTATALES_2012,
  murcia: MINIMOS_ESTATALES_2012,
  "la-rioja": MINIMOS_ESTATALES_2012,
  "comunitat-valenciana": MINIMOS_ESTATALES_2012,
  ceuta: MINIMOS_ESTATALES_2012,
  melilla: MINIMOS_ESTATALES_2012,
} satisfies Readonly<Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>>

export const MINIMOS_AUTONOMICOS_IRPF_2012 = parametroNormativo({
  nombre: "Minimos autonomicos IRPF 2012 pre-reforma 2015",
  valor: {
    ...MINIMOS_ESTATALES_POR_COMUNIDAD_2012,
    madrid: MINIMOS_MADRID_2012,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2012Parte1,
})

export const obtenerMinimosAutonomicosIrpf2012 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2012.valor[comunidadAutonoma]
