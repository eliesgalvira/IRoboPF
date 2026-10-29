import Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  type EscalaAutonomicaIrpf2025,
} from "./irpf-autonomico-2025"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export type EscalaAutonomicaIrpf2021 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_2021 = TRAMOS_IRPF_ESTATAL_GENERAL_2025

const fuenteAeatEscalasAutonomicas2021 = {
  titulo:
    "AEAT Manual práctico de Renta 2021. Gravamen autonómico de la base liquidable general",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico.html",
} as const

const escala2021 = ({
  fuente = fuenteAeatEscalasAutonomicas2021,
  ...escala
}: Omit<EscalaAutonomicaIrpf2021, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2021["fuente"]
}): EscalaAutonomicaIrpf2021 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2021 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2021 =>
  escala2021({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025 = {
  andalucia: escala2021({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucía",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(28000), tipo("15")],
      [importe(35200), tipo("15.6")],
      [importe(50000), tipo("18.7")],
      [importe(60000), tipo("18.9")],
      [importe(120000), tipo("22.9")],
      [importe(Infinity), tipo("23.7")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Andalucía",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-andalucia.html",
    },
  }),
  aragon: escala2021({
    comunidadAutonoma: "aragon",
    nombre: "Aragón",
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
      titulo: "AEAT Manual práctico de Renta 2021. Escala autonómica de Aragón",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-aragon.html",
    },
  }),
  asturias: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica del Principado de Asturias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html",
    },
  }),
  "illes-balears": escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Illes Balears",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-illes-balears.html",
    },
  }),
  canarias: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Canarias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-canarias.html",
    },
  }),
  cantabria: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Cantabria",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cantabria.html",
    },
  }),
  "castilla-y-leon": escala2021({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y León",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Castilla y León",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-castilla-leon.html",
    },
  }),
  catalunya: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Cataluña",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cataluna.html",
    },
  }),
  extremadura: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Extremadura",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-extremadura.html",
    },
  }),
  galicia: escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de Galicia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-galicia.html",
    },
  }),
  madrid: escala2021({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(17707.2), tipo("11.2")],
      [importe(33007.2), tipo("13.3")],
      [importe(53407.2), tipo("17.9")],
      [importe(Infinity), tipo("21")],
    ],
    fuente: {
      titulo: "AEAT Manual práctico de Renta 2021. Escala autonómica de Madrid",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-madrid.html",
    },
  }),
  murcia: escala2021({
    comunidadAutonoma: "murcia",
    nombre: "Región de Murcia",
    tramos: [
      [importe(12450), tipo("9.7")],
      [importe(20200), tipo("11.72")],
      [importe(34000), tipo("14.18")],
      [importe(60000), tipo("18.54")],
      [importe(Infinity), tipo("22.9")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2021. Escala autonómica de la Región de Murcia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-region-murcia.html",
    },
  }),
  "la-rioja": escala2021({
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
        "AEAT Manual práctico de Renta 2021. Escala autonómica de La Rioja",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-rioja.html",
    },
  }),
  "comunitat-valenciana": escala2021({
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
      [importe(140000), tipo("25.5")],
      [importe(175000), tipo("27.5")],
      [importe(Infinity), tipo("29.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2021. Escala autonómica de la Comunitat Valenciana",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2021/capitulo-15-calculo-impuesto-determinacion-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunitat-valenciana.html",
    },
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2021>>

export const ESCALAS_AUTONOMICAS_IRPF_2021: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2021>
> = {
  "simulada-estatal": reutilizarEscala2025ConFuente2021(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.andalucia,
  aragon: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2021(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon":
    ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025["castilla-y-leon"],
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.extremadura,
  galicia: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.galicia,
  madrid: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2021_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: reutilizarEscala2025ConFuente2021(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2021(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

export const obtenerEscalaAutonomicaIrpf2021 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2021 => ESCALAS_AUTONOMICAS_IRPF_2021[comunidadAutonoma]
