import Decimal from "decimal.js"
import type { AnioFiscal } from "../../normativa/anio-fiscal"
import type { ComunidadAutonoma } from "../caso-fiscal-anual"

/** Euros y tipo en fracción. La cuota se transcribe: nunca se integra. */
export interface FilaEscalaPublicada {
  readonly baseInferior: Decimal
  readonly cuota: Decimal
  readonly tipo: Decimal
  readonly inferiorExclusivo?: boolean
}
export type EscalaPublicada = ReadonlyArray<FilaEscalaPublicada>
const filas = (
  datos: ReadonlyArray<readonly [string, string, string]>
): EscalaPublicada =>
  datos.map(([baseInferior, cuota, tipo]) => ({
    baseInferior: new Decimal(baseInferior),
    cuota: new Decimal(cuota),
    tipo: new Decimal(tipo),
  }))

// EEA-CUOTAS-FIJAS: Ley 39/2010 p63 y RDL 20/2011 p53; prórroga Ley 22/2013.
export const ESTATAL_ORDINARIA_2012_2014 = filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["120000.20", "22358.36", ".225"],
  ["175000.20", "34733.36", ".235"],
])
export const ESTATAL_COMPLEMENTARIA_2012_2014 = filas([
  ["0", "0", ".0075"],
  ["17707.20", "132.80", ".02"],
  ["33007.20", "438.80", ".03"],
  ["53407.20", "1050.80", ".04"],
  ["120000.20", "3714.52", ".05"],
  ["175000.20", "6464.52", ".06"],
  ["300000.20", "13964.52", ".07"],
])
// Aceptaciones limitadas a representación de cuota, no a declaración completa.
export const ANDALUCIA_2012_2015 = filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["60000", "9458.31", ".235"],
  ["120000", "23558.31", ".255"],
])
export const VALENCIA_2014_2016 = filas([
  ["0", "0", ".119"],
  ["17707.20", "2107.16", ".1392"],
  ["33007.20", "4236.92", ".1845"],
  ["53407.20", "8000.72", ".2148"],
  ["120000.20", "22304.90", ".2248"],
  ["175000.20", "34668.90", ".2348"],
])
export const CATALUNYA_2020_2021 = filas([
  ["0", "0", ".12"],
  ["17707.20", "2124.86", ".14"],
  ["33007.20", "4266.86", ".185"],
  ["53407.20", "8040.86", ".215"],
  ["90000", "15908.31", ".235"],
  ["120000", "22958.31", ".245"],
  ["175000", "36433.31", ".255"],
])
export const CATALUNYA_2022_2024 = filas([
  ["0", "0", ".105"],
  ["12450", "1307.25", ".12"],
  ["17707.20", "1938.11", ".14"],
  ["21000", "2399.10", ".15"],
  ["33007.20", "4200.18", ".188"],
  ["53407.20", "8035.38", ".215"],
  ["90000", "15902.83", ".235"],
  ["120000", "22952.83", ".245"],
  ["175000", "36427.83", ".255"],
])
export const MADRID_2022 = filas([
  ["0", "0", ".085"],
  ["12960.45", "1101.64", ".107"],
  ["18433.20", "1687.22", ".128"],
  ["34360.50", "3725.91", ".174"],
  ["55596.90", "7421.04", ".205"],
])
// CAV1-01: Ley 13/2023, BOE-A-2024-5610 p3; manual AEAT 2025 p1128.
// Ámbito revisado aquí: ejercicio 2025 ordinario, sin extender a fallecimientos.
export const MADRID_2025 = filas([
  ["0", "0", ".085"],
  ["13362.22", "1135.79", ".107"],
  ["19004.63", "1739.53", ".128"],
  ["35425.68", "3841.42", ".174"],
  ["57320.40", "7651.10", ".205"],
])
export const MURCIA_2022: EscalaPublicada = [
  ...filas([
    ["0", "0", ".096"],
    ["12960.45", "1244.20", ".1146"],
    ["21028.20", "2168.76", ".1374"],
    ["35394", "4142.62", ".1822"],
  ]),
  {
    baseInferior: new Decimal(60000),
    cuota: new Decimal("8716.67"),
    tipo: new Decimal(".227"),
    inferiorExclusivo: true,
  },
]

/** undefined conserva el algoritmo previo: NO significa aceptación fiscal. */
export const obtenerEscalaAutonomicaPublicada = ({
  anio,
  comunidadAutonoma,
  fechaFallecimiento,
}: {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
}): EscalaPublicada | undefined => {
  if (comunidadAutonoma === "andalucia" && anio >= 2012 && anio <= 2015)
    return ANDALUCIA_2012_2015
  if (
    comunidadAutonoma === "comunitat-valenciana" &&
    anio >= 2014 &&
    anio <= 2016
  )
    return VALENCIA_2014_2016
  if (comunidadAutonoma === "catalunya" && anio >= 2020 && anio <= 2021)
    return CATALUNYA_2020_2021
  if (comunidadAutonoma === "catalunya" && anio >= 2022 && anio <= 2024)
    return CATALUNYA_2022_2024
  if (comunidadAutonoma === "madrid" && anio === 2022) return MADRID_2022
  if (
    comunidadAutonoma === "madrid" &&
    anio === 2025 &&
    fechaFallecimiento === undefined
  )
    return MADRID_2025
  // No extender el cierre ordinario a fallecimientos cuyo régimen sigue pendiente.
  if (
    comunidadAutonoma === "murcia" &&
    anio === 2022 &&
    fechaFallecimiento === undefined
  )
    return MURCIA_2022
  return undefined
}

export const AHORRO_ORDINARIO_2012_2014 = filas([
  ["0", "0", ".095"],
  ["6000", "570", ".105"],
])
export const AHORRO_COMPLEMENTARIO_2012_2014 = filas([
  ["0", "0", ".02"],
  ["6000", "120", ".04"],
  ["24000", "840", ".06"],
])
export const AHORRO_2016_2020 = filas([
  ["0", "0", ".095"],
  ["6000", "570", ".105"],
  ["50000", "5190", ".115"],
])
export const AHORRO_AUTONOMICO_2015 = filas([
  ["0", "0", ".10"],
  ["6000", "600", ".11"],
  ["50000", "5440", ".12"],
])
export const AHORRO_2021_2022 = [
  ...AHORRO_2016_2020,
  ...filas([["200000", "22440", ".13"]]),
]
export const AHORRO_2023_2024 = [
  ...AHORRO_2016_2020,
  ...filas([
    ["200000", "22440", ".135"],
    ["300000", "35940", ".14"],
  ]),
]
export const AHORRO_2025 = [
  ...AHORRO_2016_2020,
  ...filas([
    ["200000", "22440", ".135"],
    ["300000", "35940", ".15"],
  ]),
]

/** 2026 conserva la hipótesis previa de continuidad; no acepta cierre normativo. */
export const obtenerEscalasAhorroPublicadas = (
  anio: AnioFiscal,
  componente: "estatal" | "autonomico"
): ReadonlyArray<EscalaPublicada> => {
  if (anio <= 2014)
    return componente === "estatal"
      ? [AHORRO_ORDINARIO_2012_2014, AHORRO_COMPLEMENTARIO_2012_2014]
      : [AHORRO_ORDINARIO_2012_2014]
  if (anio === 2015)
    return [
      componente === "estatal" ? AHORRO_2016_2020 : AHORRO_AUTONOMICO_2015,
    ]
  if (anio <= 2020) return [AHORRO_2016_2020]
  if (anio <= 2022) return [AHORRO_2021_2022]
  if (anio <= 2024) return [AHORRO_2023_2024]
  return [AHORRO_2025]
}
