import Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { EscalaAutonomicaIrpf2025 } from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

const AEAT_MANUAL_RENTA_2013_PDF =
  "http://www.agenciatributaria.es/static_files/AEAT/DIT/Contenidos_Publicos/CAT/AYUWEB/Biblioteca_Virtual/Manuales_practicos/Renta/Manual_renta_patrimonio_2013_es_es.pdf"

const fuenteAeatEscalasAutonomicas2013 = {
  titulo:
    "AEAT Manual practico Renta 2013. Gravamen autonomico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2013_PDF,
} as const

export type EscalaAutonomicaIrpf2013 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_BASE_2013: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe("120000.2"), tipo("21.5")],
  [importe("175000.2"), tipo("22.5")],
  [importe(Infinity), tipo("23.5")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_COMPLEMENTARIO_2013: TramosIrpf = [
  [importe("17707.2"), tipo("0.75")],
  [importe("33007.2"), tipo("2")],
  [importe("53407.2"), tipo("3")],
  [importe("120000.2"), tipo("4")],
  [importe("175000.2"), tipo("5")],
  [importe("300000.2"), tipo("6")],
  [importe(Infinity), tipo("7")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_2013: TramosIrpf = [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [importe("175000.2"), tipo("27.5")],
  [importe("300000.2"), tipo("29.5")],
  [importe(Infinity), tipo("30.5")],
]

export const TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe(Infinity), tipo("21.5")],
]

export const NORMATIVA_PRE_REFORMA_2015_IRPF_2013 = {
  _tag: "NormativaPreReforma2015Irpf2013",
  descripcion:
    "IRPF 2013 aplica la normativa previa a la reforma de 2015 y el gravamen complementario estatal 2012-2013.",
  medidasPosterioresNoExistentes: [
    "No existe el gasto fijo general de 2000 euros del art. 19.2.f LIRPF.",
    "No existen los minimos personales y familiares estatales incrementados desde 2015.",
    "No existe la escala estatal general 2015 ni los tramos estatales posteriores desde 300000 euros.",
    "No existe la escala del ahorro 2015 ni las ampliaciones posteriores de 2021, 2023 y 2025.",
    "Las ganancias patrimoniales por transmision con permanencia de un anio o menos se integran en base general.",
  ],
  fuente: fuenteAeatEscalasAutonomicas2013,
} as const

const escala2013 = ({
  fuente = fuenteAeatEscalasAutonomicas2013,
  ...escala
}: Omit<EscalaAutonomicaIrpf2013, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2013["fuente"]
}): EscalaAutonomicaIrpf2013 => ({
  ...escala,
  fuente,
})

export const ESCALAS_AUTONOMICAS_IRPF_2013 = {
  "simulada-estatal": escala2013({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2013",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  andalucia: escala2013({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucia",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("60000"), tipo("21.5")],
      [importe("120000"), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  aragon: escala2013({
    comunidadAutonoma: "aragon",
    nombre: "Aragon",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  asturias: escala2013({
    comunidadAutonoma: "asturias",
    nombre: "Principado de Asturias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("70000"), tipo("21.5")],
      [importe("90000"), tipo("22.5")],
      [importe("175000"), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "illes-balears": escala2013({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  canarias: escala2013({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(Infinity), tipo("22.58")],
    ],
  }),
  cantabria: escala2013({
    comunidadAutonoma: "cantabria",
    nombre: "Cantabria",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("67707.2"), tipo("21.5")],
      [importe("80007.2"), tipo("22")],
      [importe("99407.2"), tipo("22.5")],
      [importe("120007.2"), tipo("23.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  "castilla-la-mancha": escala2013({
    comunidadAutonoma: "castilla-la-mancha",
    nombre: "Castilla-La Mancha",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  "castilla-y-leon": escala2013({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  catalunya: escala2013({
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
  extremadura: escala2013({
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
  galicia: escala2013({
    comunidadAutonoma: "galicia",
    nombre: "Galicia",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  madrid: escala2013({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe("17707.2"), tipo("11.6")],
      [importe("33007.2"), tipo("13.7")],
      [importe("53407.2"), tipo("18.3")],
      [importe(Infinity), tipo("21.4")],
    ],
  }),
  murcia: escala2013({
    comunidadAutonoma: "murcia",
    nombre: "Region de Murcia",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("120000.2"), tipo("21.5")],
      [importe("175000.2"), tipo("23.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  "la-rioja": escala2013({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe("17707.2"), tipo("11.6")],
      [importe("33007.2"), tipo("13.7")],
      [importe("53407.2"), tipo("18.3")],
      [importe(Infinity), tipo("21.4")],
    ],
  }),
  "comunitat-valenciana": escala2013({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("120000.2"), tipo("21.5")],
      [importe("175000.2"), tipo("22.5")],
      [importe(Infinity), tipo("23.5")],
    ],
  }),
  ceuta: escala2013({
    comunidadAutonoma: "ceuta",
    nombre: "Ceuta",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
  melilla: escala2013({
    comunidadAutonoma: "melilla",
    nombre: "Melilla",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2013,
  }),
} satisfies Readonly<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2013>>

export const obtenerEscalaAutonomicaIrpf2013 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2013 => ESCALAS_AUTONOMICAS_IRPF_2013[comunidadAutonoma]
