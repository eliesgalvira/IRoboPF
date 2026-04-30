import type Decimal from "decimal.js"
import { Match } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../anio-fiscal"

export type TramoIrpf = readonly [limite: Decimal, tipo: Decimal]
export type TramosIrpf = ReadonlyArray<TramoIrpf>

export type ValorMetadatoArticulo20 = number | "Transitorio"

export interface MetadatosArticulo20 {
  readonly umbralInferior: ValorMetadatoArticulo20
  readonly reduccionMaxima: ValorMetadatoArticulo20
  readonly umbralSuperior: ValorMetadatoArticulo20
  readonly reduccionMinima: ValorMetadatoArticulo20
}

const importe = crearImporteMonetario

export const MINIMO_EXENTO_RETENCION_LEGACY: Readonly<
  Record<AnioFiscal, Decimal>
> = {
  2012: importe(11162),
  2013: importe(11162),
  2014: importe(11162),
  2015: importe(12000),
  2016: importe(12000),
  2017: importe(12000),
  2018: importe(12643),
  2019: importe(14000),
  2020: importe(14000),
  2021: importe(14000),
  2022: importe(14000),
  2023: importe(15000),
  2024: importe(15876),
  2025: importe(15876),
  2026: importe(15876),
}

export const MINIMO_PERSONAL_IRPF_LEGACY: Readonly<
  Record<AnioFiscal, Decimal>
> = {
  2012: importe(5151),
  2013: importe(5151),
  2014: importe(5151),
  2015: importe(5550),
  2016: importe(5550),
  2017: importe(5550),
  2018: importe(5550),
  2019: importe(5550),
  2020: importe(5550),
  2021: importe(5550),
  2022: importe(5550),
  2023: importe(5550),
  2024: importe(5550),
  2025: importe(5550),
  2026: importe(5550),
}

export const GASTOS_FIJOS_IRPF_LEGACY: Readonly<Record<AnioFiscal, Decimal>> = {
  2012: importe(0),
  2013: importe(0),
  2014: importe(0),
  2015: importe(2000),
  2016: importe(2000),
  2017: importe(2000),
  2018: importe(2000),
  2019: importe(2000),
  2020: importe(2000),
  2021: importe(2000),
  2022: importe(2000),
  2023: importe(2000),
  2024: importe(2000),
  2025: importe(2000),
  2026: importe(2000),
}

export const TRAMOS_IRPF_HASTA_2014: TramosIrpf = [
  [importe(17707), importe("0.2475")],
  [importe(33007), importe("0.30")],
  [importe(53407), importe("0.40")],
  [importe(120000), importe("0.47")],
  [importe(175000), importe("0.49")],
  [importe(300000), importe("0.51")],
  [importe(Infinity), importe("0.52")],
]

export const TRAMOS_IRPF_2015: TramosIrpf = [
  [importe(12450), importe("0.195")],
  [importe(20200), importe("0.245")],
  [importe(34000), importe("0.305")],
  [importe(60000), importe("0.38")],
  [importe(Infinity), importe("0.46")],
]

export const TRAMOS_IRPF_2016_A_2020: TramosIrpf = [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe(Infinity), importe("0.45")],
]

export const TRAMOS_IRPF_DESDE_2021: TramosIrpf = [
  [importe(12450), importe("0.19")],
  [importe(20200), importe("0.24")],
  [importe(35200), importe("0.30")],
  [importe(60000), importe("0.37")],
  [importe(300000), importe("0.45")],
  [importe(Infinity), importe("0.47")],
]

export const TRAMOS_IRPF_AHORRO_2025: TramosIrpf = [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [importe(Infinity), importe("0.30")],
]

export const TRAMOS_IRPF_AHORRO_2024: TramosIrpf = [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(300000), importe("0.27")],
  [importe(Infinity), importe("0.28")],
]

export const TRAMOS_IRPF_AHORRO_2023: TramosIrpf = TRAMOS_IRPF_AHORRO_2024

export const TRAMOS_IRPF_AHORRO_2022: TramosIrpf = [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(200000), importe("0.23")],
  [importe(Infinity), importe("0.26")],
]

export const TRAMOS_IRPF_AHORRO_2021: TramosIrpf = TRAMOS_IRPF_AHORRO_2022

export const obtenerTramosIrpfLegacy = (anio: AnioFiscal): TramosIrpf =>
  Match.value(anio).pipe(
    Match.when(
      (anio) => anio <= 2014,
      () => TRAMOS_IRPF_HASTA_2014
    ),
    Match.when(2015, () => TRAMOS_IRPF_2015),
    Match.when(
      (anio) => anio <= 2020,
      () => TRAMOS_IRPF_2016_A_2020
    ),
    Match.orElse(() => TRAMOS_IRPF_DESDE_2021)
  )

export const obtenerTramosIrpfAhorro = (anio: AnioFiscal): TramosIrpf => {
  return Match.value(anio).pipe(
    Match.when(2021, () => TRAMOS_IRPF_AHORRO_2021),
    Match.when(2022, () => TRAMOS_IRPF_AHORRO_2022),
    Match.when(2023, () => TRAMOS_IRPF_AHORRO_2023),
    Match.when(2024, () => TRAMOS_IRPF_AHORRO_2024),
    Match.orElse(() => TRAMOS_IRPF_AHORRO_2025)
  )
}

export const METADATOS_ARTICULO_20_LEGACY: Readonly<
  Record<AnioFiscal, MetadatosArticulo20>
> = {
  2012: {
    umbralInferior: 9180,
    reduccionMaxima: 4080,
    umbralSuperior: 13260,
    reduccionMinima: 2652,
  },
  2013: {
    umbralInferior: 9180,
    reduccionMaxima: 4080,
    umbralSuperior: 13260,
    reduccionMinima: 2652,
  },
  2014: {
    umbralInferior: 9180,
    reduccionMaxima: 4080,
    umbralSuperior: 13260,
    reduccionMinima: 2652,
  },
  2015: {
    umbralInferior: 11250,
    reduccionMaxima: 3700,
    umbralSuperior: 14450,
    reduccionMinima: 0,
  },
  2016: {
    umbralInferior: 11250,
    reduccionMaxima: 3700,
    umbralSuperior: 14450,
    reduccionMinima: 0,
  },
  2017: {
    umbralInferior: 11250,
    reduccionMaxima: 3700,
    umbralSuperior: 14450,
    reduccionMinima: 0,
  },
  2018: {
    umbralInferior: "Transitorio",
    reduccionMaxima: "Transitorio",
    umbralSuperior: "Transitorio",
    reduccionMinima: "Transitorio",
  },
  2019: {
    umbralInferior: 13115,
    reduccionMaxima: 5565,
    umbralSuperior: 16825,
    reduccionMinima: 0,
  },
  2020: {
    umbralInferior: 13115,
    reduccionMaxima: 5565,
    umbralSuperior: 16825,
    reduccionMinima: 0,
  },
  2021: {
    umbralInferior: 13115,
    reduccionMaxima: 5565,
    umbralSuperior: 16825,
    reduccionMinima: 0,
  },
  2022: {
    umbralInferior: 13115,
    reduccionMaxima: 5565,
    umbralSuperior: 16825,
    reduccionMinima: 0,
  },
  2023: {
    umbralInferior: 14047.5,
    reduccionMaxima: 6498,
    umbralSuperior: 19747.5,
    reduccionMinima: 0,
  },
  2024: {
    umbralInferior: 14852,
    reduccionMaxima: 7302,
    umbralSuperior: 19747.5,
    reduccionMinima: 0,
  },
  2025: {
    umbralInferior: 14852,
    reduccionMaxima: 7302,
    umbralSuperior: 19747.5,
    reduccionMinima: 0,
  },
  2026: {
    umbralInferior: 14852,
    reduccionMaxima: 7302,
    umbralSuperior: 19747.5,
    reduccionMinima: 0,
  },
}
