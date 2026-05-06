import Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  type EscalaAutonomicaIrpf2025,
} from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export type EscalaAutonomicaIrpf2018 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_2018: TramosIrpf = [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo("22.5")],
]

const AEAT_MANUAL_RENTA_2018_PDF =
  "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2018/ManualRentaPatrimonio2018_V8_es_es.pdf"

const fuenteAeatEscalasAutonomicas2018 = {
  titulo:
    "AEAT Manual practico Renta 2018. Gravamen autonomico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2018_PDF,
} as const

const escala2018 = ({
  fuente = fuenteAeatEscalasAutonomicas2018,
  ...escala
}: Omit<EscalaAutonomicaIrpf2018, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2018["fuente"]
}): EscalaAutonomicaIrpf2018 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2018 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2018 =>
  escala2018({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025 = {
  "simulada-estatal": escala2018({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2018,
    fuente: {
      titulo:
        "AEAT Manual practico Renta 2018. Gravamen estatal de la base liquidable general",
      referencia: AEAT_MANUAL_RENTA_2018_PDF,
    },
  }),
  andalucia: escala2018({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucia",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(20200), tipo("12")],
      [importe(28000), tipo("15")],
      [importe(35200), tipo("16.5")],
      [importe(50000), tipo("19")],
      [importe(60000), tipo("19.5")],
      [importe(120000), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  aragon: escala2018({
    comunidadAutonoma: "aragon",
    nombre: "Aragon",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(20200), tipo("12.5")],
      [importe(34000), tipo("15.5")],
      [importe(50000), tipo("19")],
      [importe(60000), tipo("21")],
      [importe(70000), tipo("22")],
      [importe(90000), tipo("22.5")],
      [importe(130000), tipo("23.5")],
      [importe(150000), tipo("24.5")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  asturias: escala2018({
    comunidadAutonoma: "asturias",
    nombre: "Principado de Asturias",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(70000), tipo("21.5")],
      [importe(90000), tipo("22.5")],
      [importe(175000), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "illes-balears": escala2018({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears",
    tramos: [
      [importe(10000), tipo("9.5")],
      [importe(18000), tipo("11.75")],
      [importe(30000), tipo("14.75")],
      [importe(48000), tipo("17.75")],
      [importe(70000), tipo("19.25")],
      [importe(90000), tipo("22")],
      [importe(120000), tipo("23")],
      [importe(175000), tipo("24")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  canarias: escala2018({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(90000), tipo("23.5")],
      [importe(Infinity), tipo("24")],
    ],
  }),
  cantabria: escala2018({
    comunidadAutonoma: "cantabria",
    nombre: "Cantabria",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(34000), tipo("15")],
      [importe(46000), tipo("18.5")],
      [importe(60000), tipo("19.5")],
      [importe(90000), tipo("24.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "castilla-y-leon": escala2018({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
  }),
  catalunya: escala2018({
    comunidadAutonoma: "catalunya",
    nombre: "Catalunya",
    tramos: [
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(120000.2), tipo("21.5")],
      [importe(175000.2), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  extremadura: escala2018({
    comunidadAutonoma: "extremadura",
    nombre: "Extremadura",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12.5")],
      [importe(24200), tipo("15.5")],
      [importe(35200), tipo("16.5")],
      [importe(60000), tipo("20.5")],
      [importe(80200), tipo("23.5")],
      [importe(99200), tipo("24")],
      [importe(120200), tipo("24.5")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  galicia: escala2018({
    comunidadAutonoma: "galicia",
    nombre: "Galicia",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("11.75")],
      [importe(27700), tipo("15.5")],
      [importe(35200), tipo("17")],
      [importe(47600), tipo("18.5")],
      [importe(60000), tipo("20.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  madrid: escala2018({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(17707.2), tipo("11.2")],
      [importe(33007.2), tipo("13.3")],
      [importe(53407.2), tipo("17.9")],
      [importe(Infinity), tipo("21")],
    ],
  }),
  murcia: escala2018({
    comunidadAutonoma: "murcia",
    nombre: "Region de Murcia",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(20200), tipo("12.5")],
      [importe(34000), tipo("15.5")],
      [importe(60000), tipo("19.5")],
      [importe(Infinity), tipo("23.5")],
    ],
  }),
  "la-rioja": escala2018({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("11.6")],
      [importe(35200), tipo("14.6")],
      [importe(50000), tipo("18.8")],
      [importe(60000), tipo("19.5")],
      [importe(120000), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "comunitat-valenciana": escala2018({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(17000), tipo("11")],
      [importe(30000), tipo("13.9")],
      [importe(50000), tipo("18")],
      [importe(65000), tipo("23.5")],
      [importe(80000), tipo("24.5")],
      [importe(120000), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2018>>

export const ESCALAS_AUTONOMICAS_IRPF_2018: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2018>
> = {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.andalucia,
  aragon: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2018(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["castilla-y-leon"],
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.extremadura,
  galicia: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.galicia,
  madrid: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2018_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: reutilizarEscala2025ConFuente2018(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2018(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

export const obtenerEscalaAutonomicaIrpf2018 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2018 => ESCALAS_AUTONOMICAS_IRPF_2018[comunidadAutonoma]
