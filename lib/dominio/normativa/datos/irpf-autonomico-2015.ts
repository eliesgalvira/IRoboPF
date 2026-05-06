import Decimal from "decimal.js"
import { Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  type EscalaAutonomicaIrpf2025,
} from "./irpf-autonomico-2025"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export type EscalaAutonomicaIrpf2015 = EscalaAutonomicaIrpf2025 & {
  readonly condicionAplicacion?: string
}

export interface EntradaEscalaAutonomicaIrpf2015 {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly baseLiquidableGeneral?: Decimal | undefined
  readonly fechaFallecimiento?: Date | undefined
}

export const TRAMOS_IRPF_ESTATAL_GENERAL_2015: TramosIrpf = [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(34000), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(Infinity), tipo("22.5")],
]

export const TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2015: TramosIrpf = [
  [importe(12450), tipo("10")],
  [importe(20200), tipo("12.5")],
  [importe(34000), tipo("15.5")],
  [importe(60000), tipo("19.5")],
  [importe(Infinity), tipo("23.5")],
]

const AEAT_MANUAL_RENTA_2015_PDF =
  "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2015/Manual_Renta_2015_es_es.pdf"

const fuenteAeatEscalasAutonomicas2015 = {
  titulo:
    "AEAT Manual practico Renta 2015. Gravamen autonomico de la base liquidable general",
  referencia: AEAT_MANUAL_RENTA_2015_PDF,
} as const

const escala2015 = ({
  fuente = fuenteAeatEscalasAutonomicas2015,
  ...escala
}: Omit<EscalaAutonomicaIrpf2015, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2015["fuente"]
}): EscalaAutonomicaIrpf2015 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2015 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2015 =>
  escala2015({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

const fechaCivilIsoUtc = (fecha: Date): string =>
  [
    fecha.getUTCFullYear(),
    String(fecha.getUTCMonth() + 1).padStart(2, "0"),
    String(fecha.getUTCDate()).padStart(2, "0"),
  ].join("-")

const fallecidoAntesDeFechaCivil = ({
  fechaCorte,
  fechaFallecimiento,
}: {
  readonly fechaCorte: string
  readonly fechaFallecimiento?: Date | undefined
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fechaFallecimiento) =>
        fechaCivilIsoUtc(fechaFallecimiento) < fechaCorte,
    })
  )

export const ESCALA_GALICIA_2015_BASE_HASTA_17707_20 = escala2015({
  comunidadAutonoma: "galicia",
  nombre: "Galicia - base liquidable general hasta 17707,20",
  condicionAplicacion:
    "Aplicable si la base liquidable general es igual o inferior a 17707,20 euros",
  tramos: [[importe(Infinity), tipo("11.5")]],
})

export const ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20 = escala2015({
  comunidadAutonoma: "galicia",
  nombre: "Galicia - base liquidable general superior a 17707,20",
  condicionAplicacion:
    "Aplicable si la base liquidable general es superior a 17707,20 euros",
  tramos: [
    [importe(17707.2), tipo("12")],
    [importe(33007.2), tipo("14")],
    [importe(53407.2), tipo("18.5")],
    [importe(Infinity), tipo("21.5")],
  ],
})

export const ESCALA_ILLES_BALEARS_2015_FALLECIDO_ANTES_31_DICIEMBRE =
  escala2015({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears - fallecido antes del 31/12/2015",
    condicionAplicacion:
      "Aplicable solo a contribuyentes residentes en Illes Balears fallecidos antes del 31 de diciembre de 2015",
    tramos: [
      [importe(10000), tipo("9.5")],
      [importe(18000), tipo("11.75")],
      [importe(30000), tipo("14.75")],
      [importe(48000), tipo("17.75")],
      [importe(75000), tipo("19.25")],
      [importe(Infinity), tipo("21.5")],
    ],
  })

export const ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025 = {
  "simulada-estatal": escala2015({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal / art. 65 LIRPF 2015",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2015,
  }),
  andalucia: escala2015({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucia",
    tramos: [
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(60000), tipo("21.5")],
      [importe(120000), tipo("23.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  aragon: escala2015({
    comunidadAutonoma: "aragon",
    nombre: "Aragon",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(20200), tipo("12.5")],
      [importe(34000), tipo("15.5")],
      [importe(60000), tipo("19")],
      [importe(Infinity), tipo("21.5")],
    ],
  }),
  asturias: escala2015({
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
  "illes-balears": escala2015({
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
  canarias: escala2015({
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
  cantabria: escala2015({
    comunidadAutonoma: "cantabria",
    nombre: "Cantabria",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(34000), tipo("15")],
      [importe(60000), tipo("18.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  "castilla-y-leon": escala2015({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: [
      [importe(12450), tipo("10")],
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
  }),
  catalunya: escala2015({
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
  extremadura: escala2015({
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
  galicia: ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
  madrid: escala2015({
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
  murcia: escala2015({
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
  "la-rioja": escala2015({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12.5")],
      [importe(34000), tipo("15.5")],
      [importe(60000), tipo("19.5")],
      [importe(Infinity), tipo("23.5")],
    ],
  }),
  "comunitat-valenciana": escala2015({
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
  ceuta: escala2015({
    comunidadAutonoma: "ceuta",
    nombre: "Ceuta",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2015,
  }),
  melilla: escala2015({
    comunidadAutonoma: "melilla",
    nombre: "Melilla",
    tramos: TRAMOS_IRPF_AUTONOMICO_GENERAL_ART65_2015,
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2015>>

export const ESCALAS_AUTONOMICAS_IRPF_2015: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2015>
> = {
  "simulada-estatal":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["simulada-estatal"],
  andalucia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.andalucia,
  aragon: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.aragon,
  asturias: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2015(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["castilla-y-leon"],
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.catalunya,
  extremadura: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.extremadura,
  galicia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.galicia,
  madrid: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.madrid,
  murcia: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.murcia,
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana":
    ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025["comunitat-valenciana"],
  ceuta: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.ceuta,
  melilla: ESCALAS_AUTONOMICAS_IRPF_2015_DISTINTAS_DE_2025.melilla,
}

export const obtenerEscalaAutonomicaIrpf2015 = ({
  baseLiquidableGeneral,
  comunidadAutonoma,
  fechaFallecimiento,
}: EntradaEscalaAutonomicaIrpf2015): EscalaAutonomicaIrpf2015 =>
  Match.value(comunidadAutonoma).pipe(
    Match.when("illes-balears", () =>
      Match.value(
        fallecidoAntesDeFechaCivil({
          fechaCorte: "2015-12-31",
          fechaFallecimiento,
        })
      ).pipe(
        Match.when(
          true,
          () => ESCALA_ILLES_BALEARS_2015_FALLECIDO_ANTES_31_DICIEMBRE
        ),
        Match.orElse(() => ESCALAS_AUTONOMICAS_IRPF_2015["illes-balears"])
      )
    ),
    Match.when("galicia", () =>
      Option.fromNullishOr(baseLiquidableGeneral).pipe(
        Option.match({
          onNone: () => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20,
          onSome: (baseLiquidableGeneral) =>
            Match.value(baseLiquidableGeneral).pipe(
              Match.when(
                (baseLiquidableGeneral) =>
                  baseLiquidableGeneral.lte("17707.20"),
                () => ESCALA_GALICIA_2015_BASE_HASTA_17707_20
              ),
              Match.orElse(() => ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20)
            ),
        })
      )
    ),
    Match.orElse(
      (comunidadAutonoma) => ESCALAS_AUTONOMICAS_IRPF_2015[comunidadAutonoma]
    )
  )
