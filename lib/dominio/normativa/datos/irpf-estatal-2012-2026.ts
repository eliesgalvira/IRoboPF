import type Decimal from "decimal.js"
import { DateTime, Match } from "effect"

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

export const TRAMOS_IRPF_AHORRO_2020: TramosIrpf = [
  [importe(6000), importe("0.19")],
  [importe(50000), importe("0.21")],
  [importe(Infinity), importe("0.23")],
]

export const TRAMOS_IRPF_AHORRO_2019: TramosIrpf = TRAMOS_IRPF_AHORRO_2020

export const TRAMOS_IRPF_AHORRO_2018: TramosIrpf = TRAMOS_IRPF_AHORRO_2020

export const TRAMOS_IRPF_AHORRO_2017: TramosIrpf = TRAMOS_IRPF_AHORRO_2020

export const TRAMOS_IRPF_AHORRO_2016: TramosIrpf = TRAMOS_IRPF_AHORRO_2020

export const TRAMOS_IRPF_AHORRO_2015: TramosIrpf = [
  [importe(6000), importe("0.195")],
  [importe(50000), importe("0.215")],
  [importe(Infinity), importe("0.235")],
]

export const TRAMOS_IRPF_AHORRO_2014: TramosIrpf = [
  [importe(6000), importe("0.21")],
  [importe(24000), importe("0.25")],
  [importe(Infinity), importe("0.27")],
]

export const TRAMOS_IRPF_AHORRO_2013: TramosIrpf = TRAMOS_IRPF_AHORRO_2014

export const TRAMOS_IRPF_AHORRO_2012: TramosIrpf = TRAMOS_IRPF_AHORRO_2014

export const REDUCCION_MOVILIDAD_GEOGRAFICA_TRANSITORIA_2015 = {
  condicionAplicacion:
    "Aceptacion de puesto de trabajo en 2014 con derecho a reduccion por movilidad geografica y continuidad en dicho trabajo en 2015",
  incompatibilidad:
    "Se aplica en lugar del gasto adicional por movilidad geografica del art. 19.2.f LIRPF vigente desde 2015",
  fuente: {
    titulo:
      "AEAT Manual practico Renta 2015. Regimen transitorio de movilidad geografica",
    referencia:
      "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/IRPF-2015/Manual_Renta_2015_es_es.pdf",
  },
} as const

export const REGLA_INTEGRACION_GANANCIAS_PATRIMONIALES_2014 = {
  transmisionConPermanenciaUnAnioOMenos: "base-general",
  transmisionConPermanenciaSuperiorAUnAnio: "base-ahorro",
  noDerivadaDeTransmision: "base-general",
  limiteCompensacionSaldoNegativoGananciasGeneralContraRendimientos:
    importe("0.10"),
  fuente: {
    titulo:
      "AEAT Manual practico Renta 2014. Integracion y compensacion de ganancias y perdidas patrimoniales",
    referencia:
      "https://sede.agenciatributaria.gob.es/static_files/Sede/Biblioteca/Manual/Practicos/IRPF/2014/Manual_Renta_2014_es_es.pdf",
  },
} as const

export const REGLA_INTEGRACION_GANANCIAS_PATRIMONIALES_2013 = {
  transmisionConPermanenciaUnAnioOMenos: "base-general",
  transmisionConPermanenciaSuperiorAUnAnio: "base-ahorro",
  noDerivadaDeTransmision: "base-general",
  limiteCompensacionSaldoNegativoGananciasGeneralContraRendimientos:
    importe("0.10"),
  fuente: {
    titulo:
      "AEAT Manual practico Renta 2013. Integracion y compensacion de ganancias y perdidas patrimoniales",
    referencia:
      "http://www.agenciatributaria.es/static_files/AEAT/DIT/Contenidos_Publicos/CAT/AYUWEB/Biblioteca_Virtual/Manuales_practicos/Renta/Manual_renta_patrimonio_2013_es_es.pdf",
  },
} as const

export const REGLA_INTEGRACION_GANANCIAS_PATRIMONIALES_2012 = {
  transmisionDeElementoPatrimonial: "base-ahorro",
  noDerivadaDeTransmision: "base-general",
  limiteCompensacionSaldoNegativoGananciasGeneralContraRendimientos:
    importe("0.25"),
  permiteCompensacionCruzadaEnBaseAhorroEntreCapitalYGanancias: false,
  fuente: {
    titulo:
      "AEAT Manual practico Renta 2012. Integracion y compensacion de ganancias y perdidas patrimoniales",
    referencia:
      "http://www.agenciatributaria.es/static_files/AEAT/DIT/Contenidos_Publicos/CAT/AYUWEB/Biblioteca_Virtual/Manuales_practicos/Renta/Manual_renta_patrimonio_2012_es_es.pdf",
  },
} as const

export const EXENCION_50_POR_CIENTO_GANANCIAS_INMUEBLES_URBANOS_ADQUIRIDOS_2012 =
  {
    fechaInicioAdquisicion: "2012-05-12",
    fechaFinAdquisicion: "2012-12-31",
    porcentajeExento: importe("0.50"),
    aplicaSoloInmueblesUrbanos: true,
    requiereAdquisicionATituloOneroso: true,
    fuente: {
      titulo:
        "Ley 35/2006 LIRPF. Disposicion adicional 37. Ganancias patrimoniales procedentes de transmision de determinados inmuebles",
      referencia:
        "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#datrigesimaseptima",
    },
  } as const

export type BaseIntegracionGananciaPatrimonialHasta2014 =
  | "base-general"
  | "base-ahorro"

const sumarUnAnioFechaCivilIso = (fechaIso: string): string => {
  const [year = 0, month = 1, day = 1] = fechaIso.split("-").map(Number)
  const fecha = DateTime.makeUnsafe({ year: year + 1, month, day })
  const partes = DateTime.toPartsUtc(fecha)
  const yyyy = String(partes.year).padStart(4, "0")
  const mm = String(partes.month).padStart(2, "0")
  const dd = String(partes.day).padStart(2, "0")

  return `${yyyy}-${mm}-${dd}`
}

export const clasificarGananciaPatrimonialHasta2014 = ({
  derivaDeTransmision,
  fechaAdquisicion,
  fechaTransmision,
}: {
  readonly derivaDeTransmision: boolean
  readonly fechaAdquisicion?: string | undefined
  readonly fechaTransmision?: string | undefined
}): BaseIntegracionGananciaPatrimonialHasta2014 => {
  if (!derivaDeTransmision) {
    return "base-general"
  }

  if (fechaAdquisicion === undefined || fechaTransmision === undefined) {
    return "base-ahorro"
  }

  return fechaTransmision > sumarUnAnioFechaCivilIso(fechaAdquisicion)
    ? "base-ahorro"
    : "base-general"
}

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

export const obtenerTramosIrpfAhorro = (anio: AnioFiscal): TramosIrpf =>
  Match.value(anio).pipe(
    Match.when(2012, () => TRAMOS_IRPF_AHORRO_2012),
    Match.when(2013, () => TRAMOS_IRPF_AHORRO_2013),
    Match.when(2014, () => TRAMOS_IRPF_AHORRO_2014),
    Match.when(2015, () => TRAMOS_IRPF_AHORRO_2015),
    Match.when(2016, () => TRAMOS_IRPF_AHORRO_2016),
    Match.when(2017, () => TRAMOS_IRPF_AHORRO_2017),
    Match.when(2018, () => TRAMOS_IRPF_AHORRO_2018),
    Match.when(2019, () => TRAMOS_IRPF_AHORRO_2019),
    Match.when(2020, () => TRAMOS_IRPF_AHORRO_2020),
    Match.when(2021, () => TRAMOS_IRPF_AHORRO_2021),
    Match.when(2022, () => TRAMOS_IRPF_AHORRO_2022),
    Match.when(2023, () => TRAMOS_IRPF_AHORRO_2023),
    Match.when(2024, () => TRAMOS_IRPF_AHORRO_2024),
    Match.orElse(() => TRAMOS_IRPF_AHORRO_2025)
  )

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
