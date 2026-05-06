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

export type EscalaAutonomicaIrpf2020 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_2020: TramosIrpf = [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo("22.5")],
]

const fuenteAeatEscalasAutonomicas2020 = {
  titulo:
    "AEAT Manual practico de Renta 2020. Gravamen autonomico de la base liquidable general",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico.html",
} as const

const escala2020 = ({
  fuente = fuenteAeatEscalasAutonomicas2020,
  ...escala
}: Omit<EscalaAutonomicaIrpf2020, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2020["fuente"]
}): EscalaAutonomicaIrpf2020 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2020 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2020 =>
  escala2020({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025 = {
  "simulada-estatal": escala2020({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2020,
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Gravamen estatal de la base liquidable general",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-estatal.html",
    },
  }),
  andalucia: escala2020({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucia",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(28000), tipo("15")],
      [importe(35200), tipo("15.9")],
      [importe(50000), tipo("18.8")],
      [importe(60000), tipo("19.1")],
      [importe(120000), tipo("23.1")],
      [importe(Infinity), tipo("24.3")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Andalucia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-andalucia.html",
    },
  }),
  aragon: escala2020({
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
    fuente: {
      titulo: "AEAT Manual practico de Renta 2020. Escala autonomica de Aragon",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-aragon.html",
    },
  }),
  asturias: escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica del Principado de Asturias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html",
    },
  }),
  "illes-balears": escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Illes Balears",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-illes-balears.html",
    },
  }),
  canarias: escala2020({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(17707.2), tipo("11.5")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(90000), tipo("23.5")],
      [importe(120000), tipo("25")],
      [importe(Infinity), tipo("26")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Canarias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-canarias.html",
    },
  }),
  cantabria: escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Cantabria",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cantabria.html",
    },
  }),
  "castilla-y-leon": escala2020({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Castilla y Leon",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-castilla-leon.html",
    },
  }),
  catalunya: escala2020({
    comunidadAutonoma: "catalunya",
    nombre: "Catalunya",
    tramos: [
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(90000), tipo("21.5")],
      [importe(120000), tipo("23.5")],
      [importe(175000), tipo("24.5")],
      [importe(Infinity), tipo("25.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Cataluna",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cataluna.html",
    },
  }),
  extremadura: escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Extremadura",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-extremadura.html",
    },
  }),
  galicia: escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de Galicia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-galicia.html",
    },
  }),
  madrid: escala2020({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(17707.2), tipo("11.2")],
      [importe(33007.2), tipo("13.3")],
      [importe(53407.29), tipo("17.9")],
      [importe(Infinity), tipo("21")],
    ],
    fuente: {
      titulo: "AEAT Manual practico de Renta 2020. Escala autonomica de Madrid",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-madrid.html",
    },
  }),
  murcia: escala2020({
    comunidadAutonoma: "murcia",
    nombre: "Region de Murcia",
    tramos: [
      [importe(12450), tipo("9.8")],
      [importe(20200), tipo("11.98")],
      [importe(34000), tipo("14.62")],
      [importe(60000), tipo("18.86")],
      [importe(Infinity), tipo("23.1")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de la Region de Murcia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-region-murcia.html",
    },
  }),
  "la-rioja": escala2020({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(20200), tipo("11.6")],
      [importe(35200), tipo("14.6")],
      [importe(50000), tipo("18.8")],
      [importe(60000), tipo("19.5")],
      [importe(120000), tipo("25")],
      [importe(Infinity), tipo("27")],
    ],
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de La Rioja",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-rioja.html",
    },
  }),
  "comunitat-valenciana": escala2020({
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
    fuente: {
      titulo:
        "AEAT Manual practico de Renta 2020. Escala autonomica de la Comunitat Valenciana",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2020/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunitat-valenciana.html",
    },
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2020>>

export const ESCALAS_AUTONOMICAS_IRPF_2020: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2020>
> = {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.andalucia,
  aragon: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2020(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["castilla-y-leon"],
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.extremadura,
  galicia: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.galicia,
  madrid: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2020_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: reutilizarEscala2025ConFuente2020(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2020(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

export const obtenerEscalaAutonomicaIrpf2020 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2020 => ESCALAS_AUTONOMICAS_IRPF_2020[comunidadAutonoma]
