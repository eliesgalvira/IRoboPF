import Decimal from "decimal.js"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { ComunidadAutonoma } from "../../irpf/caso-fiscal-anual"
import type { TramosIrpf } from "./irpf-estatal-2012-2026"

const importe = crearImporteMonetario
const tipo = (porcentaje: string): Decimal => importe(porcentaje).div(100)

export interface EscalaAutonomicaIrpf2025 {
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly nombre: string
  readonly tramos: TramosIrpf
  readonly fuente: {
    readonly titulo: string
    readonly referencia: string
  }
}

export const TRAMOS_IRPF_ESTATAL_GENERAL_2025: TramosIrpf = [
  [importe(12450), tipo("9.5")],
  [importe(20200), tipo("12")],
  [importe(35200), tipo("15")],
  [importe(60000), tipo("18.5")],
  [importe(300000), tipo("22.5")],
  [importe(Infinity), tipo("24.5")],
]

const fuenteAeatEscalasAutonomicas2025 = {
  titulo: "AEAT Modelo 100 IRPF 2025: cuota integra autonomica",
  referencia:
    "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-ayuda-presentacion/irpf-2025/8-cumplimentacion-irpf/8_4-cuota-integra/8_4_3-gravamen-base-liquidable-general/8_4_3_2-cuota-integra-autonomica.html",
} as const

const escala = ({
  comunidadAutonoma,
  nombre,
  tramos,
}: Omit<EscalaAutonomicaIrpf2025, "fuente">): EscalaAutonomicaIrpf2025 => ({
  comunidadAutonoma,
  nombre,
  tramos,
  fuente: fuenteAeatEscalasAutonomicas2025,
})

export const ESCALAS_AUTONOMICAS_IRPF_2025: Readonly<
  Record<ComunidadAutonoma, EscalaAutonomicaIrpf2025>
> = {
  "simulada-estatal": escala({
    comunidadAutonoma: "simulada-estatal",
    nombre: "Simulada estatal",
    tramos: TRAMOS_IRPF_ESTATAL_GENERAL_2025,
  }),
  andalucia: escala({
    comunidadAutonoma: "andalucia",
    nombre: "Andalucia",
    tramos: [
      [importe(13000), tipo("9.5")],
      [importe(21100), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(60000), tipo("18.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  aragon: escala({
    comunidadAutonoma: "aragon",
    nombre: "Aragon",
    tramos: [
      [importe(13072.5), tipo("9.5")],
      [importe(21210), tipo("12")],
      [importe(36960), tipo("15")],
      [importe(52500), tipo("18.5")],
      [importe(60000), tipo("20.5")],
      [importe(80000), tipo("23")],
      [importe(90000), tipo("24")],
      [importe(130000), tipo("25")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  asturias: escala({
    comunidadAutonoma: "asturias",
    nombre: "Principado de Asturias",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(17707.2), tipo("12")],
      [importe(33007.2), tipo("14")],
      [importe(53407.2), tipo("19.2")],
      [importe(70000), tipo("21.5")],
      [importe(90000), tipo("22.5")],
      [importe(175000), tipo("25")],
      [importe(Infinity), tipo("26")],
    ],
  }),
  "illes-balears": escala({
    comunidadAutonoma: "illes-balears",
    nombre: "Illes Balears",
    tramos: [
      [importe(10000), tipo("9")],
      [importe(18000), tipo("11.25")],
      [importe(30000), tipo("14.25")],
      [importe(48000), tipo("17.5")],
      [importe(70000), tipo("19")],
      [importe(90000), tipo("21.75")],
      [importe(120000), tipo("22.75")],
      [importe(175000), tipo("23.75")],
      [importe(Infinity), tipo("24.75")],
    ],
  }),
  canarias: escala({
    comunidadAutonoma: "canarias",
    nombre: "Canarias",
    tramos: [
      [importe(13748), tipo("9")],
      [importe(19422), tipo("11.5")],
      [importe(35924), tipo("14")],
      [importe(57566), tipo("18.5")],
      [importe(93268), tipo("23.5")],
      [importe(123745), tipo("25")],
      [importe(Infinity), tipo("26")],
    ],
  }),
  cantabria: escala({
    comunidadAutonoma: "cantabria",
    nombre: "Cantabria",
    tramos: [
      [importe(13000), tipo("8.5")],
      [importe(21000), tipo("11")],
      [importe(35200), tipo("14.5")],
      [importe(60000), tipo("18")],
      [importe(90000), tipo("22.5")],
      [importe(Infinity), tipo("24.5")],
    ],
  }),
  "castilla-la-mancha": escala({
    comunidadAutonoma: "castilla-la-mancha",
    nombre: "Castilla-La Mancha",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(60000), tipo("18.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  "castilla-y-leon": escala({
    comunidadAutonoma: "castilla-y-leon",
    nombre: "Castilla y Leon",
    tramos: [
      [importe(12450), tipo("9")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("14")],
      [importe(53407.2), tipo("18.5")],
      [importe(Infinity), tipo("21.5")],
    ],
  }),
  catalunya: escala({
    comunidadAutonoma: "catalunya",
    nombre: "Catalunya",
    tramos: [
      [importe(12500), tipo("9.5")],
      [importe(22000), tipo("12.5")],
      [importe(33000), tipo("16")],
      [importe(53000), tipo("19")],
      [importe(90000), tipo("21.5")],
      [importe(120000), tipo("23.5")],
      [importe(175000), tipo("24.5")],
      [importe(Infinity), tipo("25.5")],
    ],
  }),
  extremadura: escala({
    comunidadAutonoma: "extremadura",
    nombre: "Extremadura",
    tramos: [
      [importe(12450), tipo("8")],
      [importe(20200), tipo("10")],
      [importe(24200), tipo("16")],
      [importe(35200), tipo("17.5")],
      [importe(60000), tipo("21")],
      [importe(80200), tipo("23.5")],
      [importe(99200), tipo("24")],
      [importe(120200), tipo("24.5")],
      [importe(Infinity), tipo("25")],
    ],
  }),
  galicia: escala({
    comunidadAutonoma: "galicia",
    nombre: "Galicia",
    tramos: [
      [importe(12985.35), tipo("9")],
      [importe(21068.6), tipo("11.65")],
      [importe(35200), tipo("14.9")],
      [importe(60000), tipo("18.4")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  madrid: escala({
    comunidadAutonoma: "madrid",
    nombre: "Comunidad de Madrid",
    tramos: [
      [importe(13362.22), tipo("8.5")],
      [importe(19004.63), tipo("10.7")],
      [importe(35425.68), tipo("12.8")],
      [importe(57320.4), tipo("17.4")],
      [importe(Infinity), tipo("20.5")],
    ],
  }),
  murcia: escala({
    comunidadAutonoma: "murcia",
    nombre: "Region de Murcia",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("11.2")],
      [importe(34000), tipo("13.3")],
      [importe(60000), tipo("17.9")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  "la-rioja": escala({
    comunidadAutonoma: "la-rioja",
    nombre: "La Rioja",
    tramos: [
      [importe(12450), tipo("8")],
      [importe(20200), tipo("10.6")],
      [importe(35200), tipo("13.6")],
      [importe(40000), tipo("17.8")],
      [importe(50000), tipo("18.3")],
      [importe(60000), tipo("19")],
      [importe(120000), tipo("24.5")],
      [importe(Infinity), tipo("27")],
    ],
  }),
  "comunitat-valenciana": escala({
    comunidadAutonoma: "comunitat-valenciana",
    nombre: "Comunitat Valenciana",
    tramos: [
      [importe(12000), tipo("9")],
      [importe(22000), tipo("12")],
      [importe(32000), tipo("15")],
      [importe(42000), tipo("17.5")],
      [importe(52000), tipo("20")],
      [importe(62000), tipo("22.5")],
      [importe(72000), tipo("25")],
      [importe(100000), tipo("26.5")],
      [importe(150000), tipo("27.5")],
      [importe(200000), tipo("28.5")],
      [importe(Infinity), tipo("29.5")],
    ],
  }),
  ceuta: escala({
    comunidadAutonoma: "ceuta",
    nombre: "Ceuta",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(60000), tipo("18.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
  melilla: escala({
    comunidadAutonoma: "melilla",
    nombre: "Melilla",
    tramos: [
      [importe(12450), tipo("9.5")],
      [importe(20200), tipo("12")],
      [importe(35200), tipo("15")],
      [importe(60000), tipo("18.5")],
      [importe(Infinity), tipo("22.5")],
    ],
  }),
}

export const obtenerEscalaAutonomicaIrpf2025 = (
  comunidadAutonoma: ComunidadAutonoma
): EscalaAutonomicaIrpf2025 =>
  ESCALAS_AUTONOMICAS_IRPF_2025[comunidadAutonoma]
