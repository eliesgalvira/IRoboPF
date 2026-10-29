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

export type EscalaAutonomicaIrpf2024 = EscalaAutonomicaIrpf2025

export const TRAMOS_IRPF_ESTATAL_GENERAL_2024 = TRAMOS_IRPF_ESTATAL_GENERAL_2025

const fuenteAeatEscalasAutonomicas2024 = {
  titulo:
    "AEAT Manual práctico de Renta 2024. Gravamen autonómico de la base liquidable general",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico.html",
} as const

const escala2024 = ({
  fuente = fuenteAeatEscalasAutonomicas2024,
  ...escala
}: Omit<EscalaAutonomicaIrpf2024, "fuente"> & {
  readonly fuente?: EscalaAutonomicaIrpf2024["fuente"]
}): EscalaAutonomicaIrpf2024 => ({
  ...escala,
  fuente,
})

const reutilizarEscala2025ConFuente2024 = (
  escala: EscalaAutonomicaIrpf2025
): EscalaAutonomicaIrpf2024 =>
  escala2024({
    comunidadAutonoma: escala.comunidadAutonoma,
    nombre: escala.nombre,
    tramos: escala.tramos,
  })

export const ESCALAS_AUTONOMICAS_IRPF_2024_DISTINTAS_DE_2025 = {
  asturias: escala2024({
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
        "AEAT Manual práctico de Renta 2024. Escala autonómica del Principado de Asturias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-principado-asturias.html",
    },
  }),
  canarias: escala2024({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe(13465), tipo("9")],
      [importe(19022), tipo("11.5")],
      [importe(35185), tipo("14")],
      [importe(56382), tipo("18.5")],
      [importe(91350), tipo("23.5")],
      [importe(121200), tipo("25")],
      [importe(Infinity), tipo("26")],
    ],
    fuente: {
      titulo:
        "AEAT Manual práctico de Renta 2024. Escala autonómica de Canarias",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-canarias.html",
    },
  }),
  catalunya: escala2024({
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
        "AEAT Manual práctico de Renta 2024. Escala autonómica de Cataluña",
      referencia:
        "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2024/c15-calculo-impuesto-determinacion-cuotas-integras/gravamen-base-liquidable-general/gravamen-autonomico/comunidad-autonoma-cataluna.html",
    },
  }),
} satisfies Partial<Record<ComunidadAutonoma, EscalaAutonomicaIrpf2024>>

export const ESCALAS_AUTONOMICAS_IRPF_2024: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2024>
> = {
  "simulada-estatal": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["simulada-estatal"]
  ),
  andalucia: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.andalucia
  ),
  aragon: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.aragon
  ),
  asturias: ESCALAS_AUTONOMICAS_IRPF_2024_DISTINTAS_DE_2025.asturias,
  "illes-balears": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["illes-balears"]
  ),
  canarias: ESCALAS_AUTONOMICAS_IRPF_2024_DISTINTAS_DE_2025.canarias,
  cantabria: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.cantabria
  ),
  "castilla-la-mancha": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-la-mancha"]
  ),
  "castilla-y-leon": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["castilla-y-leon"]
  ),
  catalunya: ESCALAS_AUTONOMICAS_IRPF_2024_DISTINTAS_DE_2025.catalunya,
  extremadura: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.extremadura
  ),
  galicia: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.galicia
  ),
  madrid: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.madrid
  ),
  murcia: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.murcia
  ),
  "la-rioja": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["la-rioja"]
  ),
  "comunitat-valenciana": reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025["comunitat-valenciana"]
  ),
  ceuta: reutilizarEscala2025ConFuente2024(ESCALAS_AUTONOMICAS_IRPF_2025.ceuta),
  melilla: reutilizarEscala2025ConFuente2024(
    ESCALAS_AUTONOMICAS_IRPF_2025.melilla
  ),
}

export const obtenerEscalaAutonomicaIrpf2024 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2024 => ESCALAS_AUTONOMICAS_IRPF_2024[comunidadAutonoma]
