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

export type EscalaAutonomicaIrpf2016 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_2016: TramosIrpf = [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo("22.5")],
]

const AEAT_MANUAL_RENTA_2016_PDF =
  "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2016/ManualRentaPatrimonio2016_es_es.pdf"

const fuenteAeatEscalasAutonomicas2016 = {
  titulo:
    "AEAT Manual practico Renta 2016. Gravamen autonomico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2016_PDF,
} as const

const escala2016 = ({
  fuente = fuenteAeatEscalasAutonomicas2016,
  ...escala
}: Omit<EscalaAutonomicaIrpf2016, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2016["fuente"]
}): EscalaAutonomicaIrpf2016 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2016 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2016 =>
  escala2016({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025 = {
  "simulada-estatal": escala2016({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2016,
    fuente: {
      titulo:
        "AEAT Manual practico Renta 2016. Gravamen estatal de la base liquidable general",
      referencia: AEAT_MANUAL_RENTA_2016_PDF,
    },
  }),
  andalucia: escala2016({
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
  aragon: escala2016({
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
  asturias: escala2016({
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
  "illes-balears": escala2016({
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
  canarias: escala2016({
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
  cantabria: escala2016({
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
  "castilla-y-leon": escala2016({
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
  catalunya: escala2016({
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
  extremadura: escala2016({
    comunidadAutonoma: "extremadura",
    nombre: "Extremadura",
    tramos: [
      [importe(12450), tipo("10.5")],
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
  galicia: escala2016({
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
  madrid: escala2016({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(17707.2), tipo("11.2")],
      [importe(33007.2), tipo("13.3")],
      [importe(53407.2), tipo("17.9")],
      [importe(Infinity), tipo("21")],
    ],
  }),
  murcia: escala2016({
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
  "la-rioja": escala2016({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(50000), tipo("19")],
      [importe(60000), tipo("19.5")],
      [importe(120000), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  "comunitat-valenciana": escala2016({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe(17707.2), tipo("11.90")],
      [importe(33007.2), tipo("13.92")],
      [importe(53407.2), tipo("18.45")],
      [importe(120000.2), tipo("21.48")],
      [importe(175000.2), tipo("22.48")],
      [importe(Infinity), tipo("23.48")],
    ],
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2016>>

export const ESCALAS_AUTONOMICAS_IRPF_2016: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2016>
> = {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.andalucia,
  aragon: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2016(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["castilla-y-leon"],
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.extremadura,
  galicia: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.galicia,
  madrid: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2016_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: reutilizarEscala2025ConFuente2016(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2016(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

export const obtenerEscalaAutonomicaIrpf2016 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2016 => ESCALAS_AUTONOMICAS_IRPF_2016[comunidadAutonoma]
