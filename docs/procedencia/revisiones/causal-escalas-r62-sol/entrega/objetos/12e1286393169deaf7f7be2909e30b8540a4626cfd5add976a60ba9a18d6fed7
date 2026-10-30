import Decimal from "decimal.js"
import { Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  type EscalaAutonomicaIrpf2025,
} from "./irpf-autonomico-2025"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export type EscalaAutonomicaIrpf2022 = EscalaAutonomicaIrpf2025

export interface EscalaAutonomicaCondicionalIrpf2022 extends EscalaAutonomicaIrpf2022 {
  readonly condicionAplicacion: string
}

export const TRAMOS_IRPF_ESTATAL_GENERAL_2022 = TRAMOS_IRPF_ESTATAL_GENERAL_2025

const fuenteAeatEscalasAutonomicas2022 = {
  titulo:
    "AEAT Manual práctico de Renta 2022. Gravamen autonómico de la base liquidable general",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico.html",
} as const

const escala2022 = ({
  fuente = fuenteAeatEscalasAutonomicas2022,
  ...escala
}: Omit<EscalaAutonomicaIrpf2022, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2022["fuente"]
}): EscalaAutonomicaIrpf2022 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2022 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2022 =>
  escala2022({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025 = {
  aragon: escala2022({
    comunidadAutonoma: "aragon",
    nombre: "Aragón",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(50000), tipo("18.5")],
      [importe(60000), tipo("20.5")],
      [importe(80000), tipo("23")],
      [importe(90000), tipo("24")],
      [importe(130000), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
    fuente: {
      titulo: "AEAT Manual práctico de Renta 2022. Escala autonómica de Aragón",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-aragon.html",
    },
  }),
  asturias: escala2022({
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
        "AEAT Manual práctico de Renta 2022. Escala autonómica del Principado de Asturias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html",
    },
  }),
  "illes-balears": escala2022({
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
        "AEAT Manual práctico de Renta 2022. Escala autonómica de Illes Balears",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-illes-balears.html",
    },
  }),
  canarias: escala2022({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe(13010), tipo("9")],
      [importe(18468), tipo("11.5")],
      [importe(34327), tipo("14")],
      [importe(55276), tipo("18.5")],
      [importe(90000), tipo("23.5")],
      [importe(120000), tipo("25")],
      [importe(Infinity), tipo("26")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2022. Escala autonómica de Canarias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-canarias.html",
    },
  }),
  cantabria: escala2022({
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
        "AEAT Manual práctico de Renta 2022. Escala autonómica de Cantabria",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cantabria.html",
    },
  }),
  catalunya: escala2022({
    comunidadAutonoma: "catalunya",
    nombre: "Catalunya",
    tramos: [
      [importe(12450), tipo("10.5")],
      [importe(17707.2), tipo("12")],
      [importe(21000), tipo("14")],
      [importe(33007.2), tipo("15")],
      [importe(53407.2), tipo("18.8")],
      [importe(90000), tipo("21.5")],
      [importe(120000), tipo("23.5")],
      [importe(175000), tipo("24.5")],
      [importe(Infinity), tipo("25.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2022. Escala autonómica de Cataluña",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cataluna.html",
    },
  }),
  extremadura: escala2022({
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
        "AEAT Manual práctico de Renta 2022. Escala autonómica de Extremadura",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-extremadura.html",
    },
  }),
  madrid: escala2022({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(12960.45), tipo("8.5")],
      [importe(18433.2), tipo("10.7")],
      [importe(34360.5), tipo("12.8")],
      [importe(55596.9), tipo("17.4")],
      [importe(Infinity), tipo("20.5")],
    ],
    fuente: {
      titulo: "AEAT Manual práctico de Renta 2022. Escala autonómica de Madrid",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-madrid.html",
    },
  }),
  murcia: escala2022({
    comunidadAutonoma: "murcia",
    nombre: "Región de Murcia",
    tramos: [
      [importe(12960.45), tipo("9.6")],
      [importe(21028.2), tipo("11.46")],
      [importe(35394), tipo("13.74")],
      [importe(60000), tipo("18.22")],
      [importe(Infinity), tipo("22.7")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2022. Escala autonómica de la Región de Murcia",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-region-murcia.html",
    },
  }),
  "la-rioja": escala2022({
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
        "AEAT Manual práctico de Renta 2022. Escala autonómica de La Rioja",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-rioja.html",
    },
  }),
  "comunitat-valenciana": escala2022({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe(12000), tipo("9")],
      [importe(22000), tipo("12")],
      [importe(32000), tipo("15")],
      [importe(42000), tipo("17.5")],
      [importe(52000), tipo("20")],
      [importe(65000), tipo("24.17")],
      [importe(80000), tipo("24.5")],
      [importe(120000), tipo("25")],
      [importe(140000), tipo("25.5")],
      [importe(175000), tipo("27.5")],
      [importe(Infinity), tipo("29.5")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2022. Escala autonómica de la Comunitat Valenciana",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunitat-valenciana.html",
    },
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2022>>

export const ESCALA_COMUNITAT_VALENCIANA_2022_FALLECIDO_ANTES_28_OCTUBRE = {
  comunidadAutonoma: "comunitat-valenciana",
  nombre: "Comunitat Valenciana - fallecido antes del 28/10/2022",
  condicionAplicacion:
    "Aplicable solo a contribuyentes fallecidos antes del 28 de octubre de 2022",
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
      "AEAT Manual práctico de Renta 2022. Comunitat Valenciana. Escala para fallecidos antes del 28/10/2022",
    referencia:
      "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2022/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunitat-valenciana.html",
  },
} satisfies EscalaAutonomicaCondicionalIrpf2022

export const ESCALAS_AUTONOMICAS_IRPF_2022: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2022>
> = {
  "simulada-estatal": reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025.andalucia
  ),
  aragon: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon": reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-y-leon"]
  ),
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.extremadura,
  galicia: reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025.galicia
  ),
  madrid: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2022_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: reutilizarEscala2025ConFuente2022(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2022(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

const fechaCivilIsoUtc = (fecha: Date): string =>
  [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, "0"),
    String(fecha.getUTCDate()).padStart(2, "0"),
  ].join("-")

const fallecidoAntesDeFechaCivil = ({
  fechaFallecimiento,
  fechaCorte,
}: {
  readonly fechaFallecimiento: Date | undefined
  readonly fechaCorte: string
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fecha) => fechaCivilIsoUtc(fecha) < fechaCorte,
    })
  )

export const obtenerEscalaAutonomicaIrpf2022 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}): EscalaAutonomicaIrpf2022 =>
  Match.value({
    comunidadAutonoma,
    fallecidoAntesComunitatValenciana: fallecidoAntesDeFechaCivil({
      fechaFallecimiento,
      fechaCorte: "2022-10-28",
    }),
  }).pipe(
    Match.when(
      {
        comunidadAutonoma: "comunitat-valenciana",
        fallecidoAntesComunitatValenciana: true,
      },
      () => ESCALA_COMUNITAT_VALENCIANA_2022_FALLECIDO_ANTES_28_OCTUBRE
    ),
    Match.orElse(() => ESCALAS_AUTONOMICAS_IRPF_2022[comunidadAutonoma])
  )
