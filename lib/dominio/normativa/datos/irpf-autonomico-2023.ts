import Decimal from "decimal.js"
import { DateTime, Match, Option } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import {
  ESCALAS_AUTONOMICAS_IRPF_2025,
  TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  type EscalaAutonomicaIrpf2025,
} from "./irpf-autonomico-2025"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export type EscalaAutonomicaIrpf2023 = EscalaAutonomicaIrpf2025

export interface EscalaAutonomicaCondicionalIrpf2023 extends EscalaAutonomicaIrpf2023 {
  readonly condicionAplicacion: string
}

export const TRAMOS_IRPF_ESTATAL_GENERAL_2023 = TRAMOS_IRPF_ESTATAL_GENERAL_2025

const fuenteAeatEscalasAutonomicas2023 = {
  titulo:
    "AEAT Manual practico de Renta 2023. Gravamen autonomico de la base liquidable general",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico.html",
} as const

const escala2023 = ({
  fuente = fuenteAeatEscalasAutonomicas2023,
  ...escala
}: Omit<EscalaAutonomicaIrpf2023, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2023["fuente"]
}): EscalaAutonomicaIrpf2023 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2023 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2023 =>
  escala2023({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025 = {
  asturias: escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica del Principado de Asturias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html",
    },
  }),
  "illes-balears": escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica de Illes Balears",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-illes-balears.html",
    },
  }),
  canarias: escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica de Canarias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-canarias.html",
    },
  }),
  cantabria: escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica de Cantabria",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cantabria.html",
    },
  }),
  catalunya: escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica de Cataluna",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cataluna.html",
    },
  }),
  "la-rioja": escala2023({
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
        "AEAT Manual practico de Renta 2023. Escala autonomica de La Rioja",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-rioja.html",
    },
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2023>>

export const ESCALA_EXTREMADURA_2023_FALLECIDO_ANTES_15_SEPTIEMBRE = {
  comunidadAutonoma: "extremadura",
  nombre: "Extremadura - fallecido antes del 15/09/2023",
  condicionAplicacion:
    "Aplicable solo a contribuyentes fallecidos antes del 15 de septiembre de 2023",
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
      "AEAT Manual practico de Renta 2023. Escala autonomica de Extremadura",
    referencia:
      "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2023/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-extremadura.html",
  },
} satisfies EscalaAutonomicaCondicionalIrpf2023

export const ESCALAS_AUTONOMICAS_IRPF_2023: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2023>
> = {
  "simulada-estatal": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.andalucia
  ),
  aragon: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.aragon
  ),
  asturias: ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025.asturias,
  "illes-balears":
    ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025["illes-balears"],
  canarias: ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025.canarias,
  cantabria: ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025.cantabria,
  "castilla-la-mancha": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-y-leon"]
  ),
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025.catalunya,
  extremadura: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.extremadura
  ),
  galicia: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.galicia
  ),
  madrid: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.madrid
  ),
  murcia: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.murcia
  ),
  "la-rioja": ESCALAS_AUTONOMICAS_IRPF_2023_DISTINTAS_DE_2025["la-rioja"],
  "comunitat-valenciana": reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025["comunitat-valenciana"]
  ),
  ceuta: reutilizarEscala2025ConFuente2023(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2023(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

const fechaLimiteExtremaduraMs = DateTime.makeUnsafe(
  "2023-09-15T00:00:00.000Z"
).epochMilliseconds

const fallecidoAntesDe = ({
  fechaFallecimiento,
  fechaLimiteMs,
}: {
  readonly fechaFallecimiento: Date | undefined
  readonly fechaLimiteMs: number
}): boolean =>
  Option.fromNullishOr(fechaFallecimiento).pipe(
    Option.match({
      onNone: () => false,
      onSome: (fecha) => fecha.getTime() < fechaLimiteMs,
    })
  )

export const obtenerEscalaAutonomicaIrpf2023 = ({
  comunidadAutonoma,
  fechaFallecimiento,
}: {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}): EscalaAutonomicaIrpf2023 =>
  Match.value({
    comunidadAutonoma,
    fallecidoAntesExtremadura: fallecidoAntesDe({
      fechaFallecimiento,
      fechaLimiteMs: fechaLimiteExtremaduraMs,
    }),
  }).pipe(
    Match.when(
      { comunidadAutonoma: "extremadura", fallecidoAntesExtremadura: true },
      () => ESCALA_EXTREMADURA_2023_FALLECIDO_ANTES_15_SEPTIEMBRE
    ),
    Match.orElse(() => ESCALAS_AUTONOMICAS_IRPF_2023[comunidadAutonoma])
  )
