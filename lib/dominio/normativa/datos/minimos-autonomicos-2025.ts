import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import { fuenteAeatManualRenta2025Parte1 } from "../fuente-normativa"
import { parametroNormativo } from "../repositorio-parametros"

const importe = crearImporteMonetario

type ImporteMonetario = ReturnType<typeof crearImporteMonetario>

export interface MinimoContribuyenteIrpf {
  readonly general: ImporteMonetario
  readonly adicionalMayor65: ImporteMonetario
  readonly adicionalMayor75: ImporteMonetario
}

export interface MinimoDescendientesIrpf {
  readonly primero: ImporteMonetario
  readonly segundo: ImporteMonetario
  readonly tercero: ImporteMonetario
  readonly cuartoYSiguientes: ImporteMonetario
  readonly adicionalMenorTres: ImporteMonetario
}

export interface MinimoAscendientesIrpf {
  readonly mayor65OConDiscapacidad: ImporteMonetario
  readonly adicionalMayor75: ImporteMonetario
}

export interface MinimoDiscapacidadIrpf {
  readonly grado33Hasta65: ImporteMonetario
  readonly grado65OMas: ImporteMonetario
  readonly gastosAsistencia: ImporteMonetario
}

export interface MinimosDiscapacidadIrpf {
  readonly contribuyente: MinimoDiscapacidadIrpf
  readonly descendiente: MinimoDiscapacidadIrpf
  readonly ascendiente: MinimoDiscapacidadIrpf
}

export interface MinimosPersonalesFamiliaresIrpf {
  readonly contribuyente: MinimoContribuyenteIrpf
  readonly descendientes: MinimoDescendientesIrpf
  readonly ascendientes: MinimoAscendientesIrpf
  readonly discapacidad: MinimosDiscapacidadIrpf
}

const discapacidad = (
  grado33Hasta65: string,
  grado65OMas: string,
  gastosAsistencia: string
): MinimoDiscapacidadIrpf => ({
  grado33Hasta65: importe(grado33Hasta65),
  grado65OMas: importe(grado65OMas),
  gastosAsistencia: importe(gastosAsistencia),
})

const mismaDiscapacidadParaTodos = (
  grado33Hasta65: string,
  grado65OMas: string,
  gastosAsistencia: string
): MinimosDiscapacidadIrpf => {
  const minimo = discapacidad(grado33Hasta65, grado65OMas, gastosAsistencia)

  return {
    contribuyente: minimo,
    descendiente: minimo,
    ascendiente: minimo,
  }
}

const minimos = (
  minimosIrpf: MinimosPersonalesFamiliaresIrpf
): MinimosPersonalesFamiliaresIrpf => minimosIrpf

export const MINIMOS_ESTATALES_2025 = minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2700"),
    tercero: importe("4000"),
    cuartoYSiguientes: importe("4500"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1150"),
    adicionalMayor75: importe("1400"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3000", "9000", "3000"),
})

const MINIMOS_ANDALUCIA_2025 = minimos({
  contribuyente: {
    general: importe("5790"),
    adicionalMayor65: importe("1200"),
    adicionalMayor75: importe("1460"),
  },
  descendientes: {
    primero: importe("2510"),
    segundo: importe("2820"),
    tercero: importe("4170"),
    cuartoYSiguientes: importe("4700"),
    adicionalMenorTres: importe("2920"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1200"),
    adicionalMayor75: importe("1460"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3130", "9390", "3130"),
})

const MINIMOS_ASTURIAS_2025 = minimos({
  contribuyente: {
    general: importe("6105"),
    adicionalMayor65: importe("1265"),
    adicionalMayor75: importe("1540"),
  },
  descendientes: {
    primero: importe("2640"),
    segundo: importe("2970"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("3080"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1265"),
    adicionalMayor75: importe("1540"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3300", "9900", "3300"),
})

const MINIMOS_ILLES_BALEARS_2025 = minimos({
  contribuyente: {
    general: importe("5550"),
    adicionalMayor65: importe("1820"),
    adicionalMayor75: importe("1540"),
  },
  descendientes: {
    primero: importe("2400"),
    segundo: importe("2970"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("2800"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1265"),
    adicionalMayor75: importe("1540"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3300", "9900", "3300"),
})

const MINIMOS_CANARIAS_2025 = minimos({
  contribuyente: {
    general: importe("5606"),
    adicionalMayor65: importe("1162"),
    adicionalMayor75: importe("1414"),
  },
  descendientes: {
    primero: importe("2424"),
    segundo: importe("2727"),
    tercero: importe("4040"),
    cuartoYSiguientes: importe("4545"),
    adicionalMenorTres: importe("2828"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1162"),
    adicionalMayor75: importe("1414"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3030", "9090", "3030"),
})

const MINIMOS_GALICIA_2025 = minimos({
  contribuyente: {
    general: importe("5789"),
    adicionalMayor65: importe("1199"),
    adicionalMayor75: importe("1460"),
  },
  descendientes: {
    primero: importe("2503"),
    segundo: importe("2816"),
    tercero: importe("4172"),
    cuartoYSiguientes: importe("4694"),
    adicionalMenorTres: importe("2920"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1199"),
    adicionalMayor75: importe("1460"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3129", "9387", "3129"),
})

const MINIMOS_MADRID_2025 = minimos({
  contribuyente: {
    general: importe("5956.65"),
    adicionalMayor65: importe("1234.26"),
    adicionalMayor75: importe("1502.58"),
  },
  descendientes: {
    primero: importe("2575.85"),
    segundo: importe("2897.83"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("3005.16"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1234.26"),
    adicionalMayor75: importe("1502.58"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3219.81", "9659.44", "3219.81"),
})

const MINIMOS_LA_RIOJA_2025 = minimos({
  ...MINIMOS_ESTATALES_2025,
  discapacidad: {
    contribuyente: MINIMOS_ESTATALES_2025.discapacidad.contribuyente,
    ascendiente: MINIMOS_ESTATALES_2025.discapacidad.ascendiente,
    descendiente: discapacidad("3300", "9900", "3000"),
  },
})

const MINIMOS_COMUNITAT_VALENCIANA_2025 = minimos({
  contribuyente: {
    general: importe("6105"),
    adicionalMayor65: importe("1265"),
    adicionalMayor75: importe("1540"),
  },
  descendientes: {
    primero: importe("2640"),
    segundo: importe("2970"),
    tercero: importe("4400"),
    cuartoYSiguientes: importe("4950"),
    adicionalMenorTres: importe("3080"),
  },
  ascendientes: {
    mayor65OConDiscapacidad: importe("1265"),
    adicionalMayor75: importe("1540"),
  },
  discapacidad: mismaDiscapacidadParaTodos("3300", "9900", "3300"),
})

const COMUNIDADES_MINIMOS_AUTONOMICOS_2025_SOPORTADAS = [
  "simulada-estatal",
  "andalucia",
  "aragon",
  "asturias",
  "illes-balears",
  "canarias",
  "cantabria",
  "castilla-la-mancha",
  "castilla-y-leon",
  "catalunya",
  "extremadura",
  "galicia",
  "madrid",
  "murcia",
  "la-rioja",
  "comunitat-valenciana",
  "ceuta",
  "melilla",
] as const satisfies readonly ComunidadAutonoma[]

export const MINIMOS_AUTONOMICOS_2025_SOPORTADOS = parametroNormativo({
  nombre: "Minimos autonomicos IRPF 2025 soportados",
  valor: COMUNIDADES_MINIMOS_AUTONOMICOS_2025_SOPORTADAS,
  fuente: fuenteAeatManualRenta2025Parte1,
})

export const MINIMOS_AUTONOMICOS_IRPF_2025 = parametroNormativo({
  nombre: "Minimos autonomicos IRPF 2025",
  valor: {
    "simulada-estatal": MINIMOS_ESTATALES_2025,
    andalucia: MINIMOS_ANDALUCIA_2025,
    aragon: MINIMOS_ESTATALES_2025,
    asturias: MINIMOS_ASTURIAS_2025,
    "illes-balears": MINIMOS_ILLES_BALEARS_2025,
    canarias: MINIMOS_CANARIAS_2025,
    cantabria: MINIMOS_ESTATALES_2025,
    "castilla-la-mancha": MINIMOS_ESTATALES_2025,
    "castilla-y-leon": MINIMOS_ESTATALES_2025,
    catalunya: MINIMOS_ESTATALES_2025,
    extremadura: MINIMOS_ESTATALES_2025,
    galicia: MINIMOS_GALICIA_2025,
    madrid: MINIMOS_MADRID_2025,
    murcia: MINIMOS_ESTATALES_2025,
    "la-rioja": MINIMOS_LA_RIOJA_2025,
    "comunitat-valenciana": MINIMOS_COMUNITAT_VALENCIANA_2025,
    ceuta: MINIMOS_ESTATALES_2025,
    melilla: MINIMOS_ESTATALES_2025,
  } satisfies Readonly<
    Record<ComunidadAutonoma, MinimosPersonalesFamiliaresIrpf>
  >,
  fuente: fuenteAeatManualRenta2025Parte1,
})

export const obtenerMinimosAutonomicosIrpf2025 = (
  comunidadAutonoma: ComunidadAutonoma
): MinimosPersonalesFamiliaresIrpf =>
  MINIMOS_AUTONOMICOS_IRPF_2025.valor[comunidadAutonoma]
