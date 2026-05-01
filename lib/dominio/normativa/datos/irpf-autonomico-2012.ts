import Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { EscalaAutonomicaIrpf2025 } from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

const AEAT_MANUAL_RENTA_2012_PDF =
  "http://www.agenciatributaria.es/static_files/AEAT/DIT/Contenidos_Publicos/CAT/AYUWEB/Biblioteca_Virtual/Manuales_practicos/Renta/Manual_renta_patrimonio_2012_es_es.pdf"

const fuenteAeatEscalasAutonomicas2012 = {
  titulo:
    "AEAT Manual practico Renta 2012. Gravamen autonomico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2012_PDF,
} as const

export type EscalaAutonomicaIrpf2012 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_BASE_2012: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe("120000.2"), tipo("21.5")],
  [importe("175000.2"), tipo("22.5")],
  [importe(Infinity), tipo("23.5")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_COMPLEMENTARIO_2012: TramosIrpf = [
  [importe("17707.2"), tipo("0.75")],
  [importe("33007.2"), tipo("2")],
  [importe("53407.2"), tipo("3")],
  [importe("120000.2"), tipo("4")],
  [importe("175000.2"), tipo("5")],
  [importe("300000.2"), tipo("6")],
  [importe(Infinity), tipo("7")],
]

export const TRAMOS_IRPF_ESTATAL_GENERAL_2012: TramosIrpf = [
  [importe("17707.2"), tipo("12.75")],
  [importe("33007.2"), tipo("16")],
  [importe("53407.2"), tipo("21.5")],
  [importe("120000.2"), tipo("25.5")],
  [importe("175000.2"), tipo("27.5")],
  [importe("300000.2"), tipo("29.5")],
  [importe(Infinity), tipo("30.5")],
]

export const TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012: TramosIrpf = [
  [importe("17707.2"), tipo("12")],
  [importe("33007.2"), tipo("14")],
  [importe("53407.2"), tipo("18.5")],
  [importe(Infinity), tipo("21.5")],
]

export const NORMATIVA_PRE_REFORMA_2015_IRPF_2012 = {
  _tag: "NormativaPreReforma2015Irpf2012",
  descripcion:
    "IRPF 2012 aplica la normativa previa a la reforma de 2015 y el gravamen complementario estatal 2012-2013.",
  medidasPosterioresNoExistentes: [
    "No existe el gasto fijo general de 2000 euros del art. 19.2.f LIRPF.",
    "No existen los minimos personales y familiares estatales incrementados desde 2015.",
    "No existe la escala estatal general 2015 ni los tramos estatales posteriores desde 300000 euros.",
    "No existe la escala del ahorro 2015 ni las ampliaciones posteriores de 2021, 2023 y 2025.",
    "No existe la regla 2013-2014 que integra en base general las ganancias por transmision con permanencia de un anio o menos.",
  ],
  fuente: fuenteAeatEscalasAutonomicas2012,
} as const

const escala2012 = ({
  fuente = fuenteAeatEscalasAutonomicas2012,
  ...escala
}: Omit<EscalaAutonomicaIrpf2012, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2012["fuente"]
}): EscalaAutonomicaIrpf2012 => ({
  ...escala,
  fuente,
})

export const ESCALAS_AUTONOMICAS_IRPF_2012 = {
  "simulada-estatal": escala2012({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2012",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  andalucia: escala2012({
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
  aragon: escala2012({
    comunidadAutonoma: "aragon",
    nombre: "Aragon",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  asturias: escala2012({
    comunidadAutonoma: "asturias",
    nombre: "Principado de Asturias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("90000"), tipo("21.5")],
      [importe("175000"), tipo("24")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  "illes-balears": escala2012({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  canarias: escala2012({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe(Infinity), tipo("22.58")],
    ],
  }),
  cantabria: escala2012({
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
  "castilla-la-mancha": escala2012({
    comunidadAutonoma: "castilla-la-mancha",
    nombre: "Castilla-La Mancha",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  "castilla-y-leon": escala2012({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  catalunya: escala2012({
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
  extremadura: escala2012({
    comunidadAutonoma: "extremadura",
    nombre: "Extremadura",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("60707.2"), tipo("21.5")],
      [importe("80007.2"), tipo("22")],
      [importe("99407.2"), tipo("22.5")],
      [importe("120007.2"), tipo("23.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  galicia: escala2012({
    comunidadAutonoma: "galicia",
    nombre: "Galicia",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  madrid: escala2012({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe("17707.2"), tipo("11.6")],
      [importe("33007.2"), tipo("13.7")],
      [importe("53407.2"), tipo("18.3")],
      [importe(Infinity), tipo("21.4")],
    ],
  }),
  murcia: escala2012({
    comunidadAutonoma: "murcia",
    nombre: "Region de Murcia",
    tramos: [
      [importe("17707.2"), tipo("12")],
      [importe("33007.2"), tipo("14")],
      [importe("53407.2"), tipo("18.5")],
      [importe("120000.2"), tipo("21.5")],
      [importe("175000.2"), tipo("22.5")],
      [importe(Infinity), tipo("23.5")],
    ],
  }),
  "la-rioja": escala2012({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe("17707.2"), tipo("11.6")],
      [importe("33007.2"), tipo("13.7")],
      [importe("53407.2"), tipo("18.3")],
      [importe(Infinity), tipo("21.4")],
    ],
  }),
  "comunitat-valenciana": escala2012({
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
  ceuta: escala2012({
    comunidadAutonoma: "ceuta",
    nombre: "Ceuta",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
  melilla: escala2012({
    comunidadAutonoma: "melilla",
    nombre: "Melilla",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2012,
  }),
} satisfies Readonly<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2012>>

export const obtenerEscalaAutonomicaIrpf2012 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2012 => ESCALAS_AUTONOMICAS_IRPF_2012[comunidadAutonoma]
