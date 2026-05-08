import Decimal from "decimal.js"
import { Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { EscalaAutonomicaIrpf2025 } from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

const AEAT_MANUAL_RENTA_2014_PDF =
  "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/2014/Manual_Renta_2014_es_es.pdf"

const fuenteAeatEscalasAutonomicas2014 = {
  titulo:
    "AEAT Manual práctico Renta 2014. Gravamen autonómico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2014_PDF,
} as const

export type EscalaAutonomicaIrpf2014 = EscalaAutonomicaIrpf2025 & {
  readonly condicionAplicacion?: string
}

export interface EntradaEscalaAutonomicaIrpf2014 {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly baseLiquidableGeneral?: Decimal | undefined
}

export const TRAMOS_IRPF_ESTATAL_GENERAL_BASE_2014: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe("120000.2"), tipo("21.5")],
  [importe("175000.2"), tipo("22.5")],
  [importe(Infinity), tipo("23.5")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_COMPLEMENTARIO_2014: TramosIrpf = [
  [importe("17707.2"), tipo("0.75")],
  [importe("33007.2"), tipo("2")],
  [importe("53407.2"), tipo("3")],
  [importe("120000.2"), tipo("4")],
  [importe("175000.2"), tipo("5")],
  [importe("300000.2"), tipo("6")],
  [importe(Infinity), tipo("7")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_2014: TramosIrpf = [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [importe("175000.2"), tipo("27.5")],
  [importe("300000.2"), tipo("29.5")],
  [importe(Infinity), tipo("30.5")],
]

export const TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe(Infinity), tipo("21.5")],
]

export const NORMATIVA_PRE_REFORMA_2015_IRPF_2014 = {
  _tag: "NormativaPreReforma2015Irpf2014",
  descripcion:
    "IRPF 2014 aplica la normativa previa a la reforma de 2015 y el gravamen complementario estatal 2012-2014.",
  medidasPosterioresNoExistentes: [
    "No existe el gasto fijo general de 2000 euros del art. 19.2.f LIRPF.",
    "No existen los mínimos personales y familiares estatales incrementados desde 2015.",
    "No existe la escala estatal general 2015 ni los tramos estatales posteriores desde 300000 euros.",
    "No existe la escala del ahorro 2015 ni las ampliaciones posteriores de 2021, 2023 y 2025.",
    "Las ganancias patrimoniales por transmision con permanencia de un año o menos se integran en base general.",
  ],
  fuente: fuenteAeatEscalasAutonomicas2014,
} as const

const escala2014 = ({
  fuente = fuenteAeatEscalasAutonomicas2014,
  ...escala
}: Omit<EscalaAutonomicaIrpf2014, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2014["fuente"]
}): EscalaAutonomicaIrpf2014 => ({
  ...escala,
  fuente,
})

export const ESCALA_GALICIA_2014_BASE_HASTA_17707_20 = escala2014({
  comunidadAutonoma: "galicia",
  nombre: "Galicia - base liquidable general hasta 17707,20",
  condicionAplicacion:
    "Aplicable si la base liquidable general es igual o inferior a 17707,20 euros",
  tramos: [[importe(Infinity), tipo("11.5")]],
})

export const ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20 = escala2014({
  comunidadAutonoma: "galicia",
  nombre: "Galicia - base liquidable general superior a 17707,20",
  condicionAplicacion:
    "Aplicable si la base liquidable general es superior a 17707,20 euros",
  tramos: [
    [importe("17707.2"), tipo("12")],
    [importe("33007.2"), tipo("14")],
    [importe("53407.2"), tipo("18.5")],
    [importe(Infinity), tipo("21.5")],
  ],
})

export const ESCALAS_AUTONOMICAS_IRPF_2014 = {
  "simulada-estatal": escala2014({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2014",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
  andalucia: escala2014({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucía",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(60000), tipo("21.5")],
      [importe(120000), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  aragon: escala2014({
    comunidadAutonoma: "aragon",
    nombre: "Aragón",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
  asturias: escala2014({
    comunidadAutonoma: "asturias",
    nombre: "Principado de Asturias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(70000), tipo("21.5")],
      [importe(90000), tipo("22.5")],
      [importe(175000), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "illes-balears": escala2014({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
  canarias: escala2014({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(Infinity), tipo("22.58")],
    ],
  }),
  cantabria: escala2014({
    comunidadAutonoma: "cantabria",
    nombre: "Cantabria",
    tramos: [
      [importe("17707.2"), tipo("11")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("67707.2"), tipo("21.5")],
      [importe("80007.2"), tipo("22")],
      [importe("99407.2"), tipo("22.5")],
      [importe("120007.2"), tipo("24")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  "castilla-la-mancha": escala2014({
    comunidadAutonoma: "castilla-la-mancha",
    nombre: "Castilla-La Mancha",
    tramos: [
      [importe("17707.2"), tipo("11")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
  }),
  "castilla-y-leon": escala2014({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y León",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
  catalunya: escala2014({
    comunidadAutonoma: "catalunya",
    nombre: "Catalunya",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("120000.2"), tipo("21.5")],
      [importe("175000.2"), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  extremadura: escala2014({
    comunidadAutonoma: "extremadura",
    nombre: "Extremadura",
    tramos: [
      [importe("10000.2"), tipo("11.25")],
      [importe("14000.2"), tipo("11.75")],
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14.55")],
      [importe("53407.2"), tipo("18.5")],
      [importe("60707.2"), tipo("21.5")],
      [importe("80007.2"), tipo("22")],
      [importe("99407.2"), tipo("22.5")],
      [importe("120007.2"), tipo("23.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  galicia: ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
  madrid: escala2014({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe("17707.2"), tipo("11.2")],
      [importe("33007.2"), tipo("13.3")],
      [importe("53407.2"), tipo("17.9")],
      [importe(Infinity), tipo("21")],
    ],
  }),
  murcia: escala2014({
    comunidadAutonoma: "murcia",
    nombre: "Región de Murcia",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("120000.2"), tipo("21.5")],
      [importe("175000.2"), tipo("23.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  "la-rioja": escala2014({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe("17707.2"), tipo("11.6")],
      [importe("33007.2"), tipo("13.7")],
      [importe("53407.2"), tipo("18.3")],
      [importe(Infinity), tipo("21.4")],
    ],
  }),
  "comunitat-valenciana": escala2014({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe("17707.2"), tipo("11.9")],
      [importe("33007.2"), tipo("13.92")],
      [importe("53407.2"), tipo("18.45")],
      [importe("120000.2"), tipo("21.48")],
      [importe("175000.2"), tipo("22.48")],
      [importe(Infinity), tipo("23.48")],
    ],
  }),
  ceuta: escala2014({
    comunidadAutonoma: "ceuta",
    nombre: "Ceuta",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
  melilla: escala2014({
    comunidadAutonoma: "melilla",
    nombre: "Melilla",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2014,
  }),
} satisfies Readonly<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2014>>

export const obtenerEscalaAutonomicaIrpf2014 = ({
  baseLiquidableGeneral,
  comunidadAutonoma,
}: EntradaEscalaAutonomicaIrpf2014): EscalaAutonomicaIrpf2014 =>
  Match.value(comunidadAutonoma).pipe(
    Match.when("galicia", () =>
      Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral).pipe(
              Match.when(
                (baseLiquidableGeneral) =>
                  baseLiquidableGeneral.lte("17707.20"),
                () => ESCALA_GALICIA_2014_BASE_HASTA_17707_20
              ),
              Match.orElse(() => ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20)
            ),
        })
      )
    ),
    Match.orElse(
      (comunidadAutonoma) => ESCALAS_AUTONOMICAS_IRPF_2014[comunidadAutonoma]
    )
  )
