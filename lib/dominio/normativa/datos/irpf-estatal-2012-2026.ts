import type Decimal from "decimal.js"
import { DateTime, Match } from "effect"

import { crearImporteMonetario } from "../../dinero/importe-monetario"
import type { AnioFiscal } from "../anio-fiscal"
import type { FuenteNormativaNormalizada } from "../fuente-normativa"
import {
  parametroNormativo,
  type ParametroNormativoEjecutable,
} from "../repositorio-parametros"

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

/**
 * Operación que liga la base liquidable del ahorro, el remanente de cada
 * mínimo personal y familiar (su exceso sobre la base liquidable general,
 * limitado a la base del ahorro) y la escala de cada gravamen.
 */
export type ReglaMinimoAhorro =
  | {
      /** Cada escala grava la base del ahorro menos su remanente. */
      readonly _tag: "GravarBaseNetaDeMinimo"
      readonly fuente: FuenteNormativaNormalizada
    }
  | {
      /**
       * Cada escala grava la base del ahorro entera y la cuota se minora con
       * la de esa misma escala aplicada a su remanente.
       */
      readonly _tag: "MinorarCuotaConLaDelMinimo"
      readonly fuente: FuenteNormativaNormalizada
    }

export interface EscalasIrpfAhorroPorGravamen {
  readonly reglaMinimo: ReglaMinimoAhorro
  readonly estatal: TramosIrpf
  readonly autonomica: TramosIrpf
}

const LEY_IRPF_BOE = "https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764"

const fuenteEscalasAhorro = (
  titulo: string,
  referencia: string,
  nota = "Escala estatal (art. 66.1) y autonómica (art. 76) del ahorro."
): FuenteNormativaNormalizada => ({
  _tag: "FuenteNormativaNormalizada",
  titulo,
  referencia,
  nota,
})

const GRAVAR_BASE_NETA_DE_MINIMO: ReglaMinimoAhorro = {
  _tag: "GravarBaseNetaDeMinimo",
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 39/2010, art. 63) y disposición adicional trigésima quinta.1.b",
    `${LEY_IRPF_BOE}&p=20131226#a66`,
    "«La base liquidable del ahorro, en la parte que no corresponda, en su caso, con el mínimo personal y familiar […] se gravará a los tipos que aparecen en la siguiente escala»; el gravamen complementario de la DA 35.ª.1.b se aplica a la misma base. Vigente del 1 de enero de 2012 al 31 de diciembre de 2014."
  ),
}

const MINORAR_CUOTA_CON_LA_DEL_MINIMO: ReglaMinimoAhorro = {
  _tag: "MinorarCuotaConLaDelMinimo",
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1.2.º y 76.2.º (redacción de la Ley 26/2014, art. primero, apartados cuarenta y dos y cincuenta y uno)",
    `${LEY_IRPF_BOE}&p=20141128#a66`,
    "«La cuantía resultante se minorará en el importe derivado de aplicar a la parte de la base liquidable del ahorro correspondiente al mínimo personal y familiar, la escala prevista en el número 1.º anterior». En vigor desde el 1 de enero de 2015 (Ley 26/2014, disposición final sexta)."
  ),
}

const ESCALA_AHORRO_MITAD_2010: TramosIrpf = [
  [importe(6000), importe("0.095")],
  [importe(Infinity), importe("0.105")],
]

const ESCALA_AHORRO_MITAD_2015: TramosIrpf = [
  [importe(6000), importe("0.095")],
  [importe(50000), importe("0.105")],
  [importe(Infinity), importe("0.115")],
]

const ESCALA_AHORRO_MITAD_2021: TramosIrpf = [
  [importe(6000), importe("0.095")],
  [importe(50000), importe("0.105")],
  [importe(200000), importe("0.115")],
  [importe(Infinity), importe("0.13")],
]

const ESCALA_AHORRO_MITAD_2023: TramosIrpf = [
  [importe(6000), importe("0.095")],
  [importe(50000), importe("0.105")],
  [importe(200000), importe("0.115")],
  [importe(300000), importe("0.135")],
  [importe(Infinity), importe("0.14")],
]

const ESCALA_AHORRO_MITAD_2025: TramosIrpf = [
  [importe(6000), importe("0.095")],
  [importe(50000), importe("0.105")],
  [importe(200000), importe("0.115")],
  [importe(300000), importe("0.135")],
  [importe(Infinity), importe("0.15")],
]

const ESCALAS_AHORRO_2012_A_2014 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro 2012-2014",
  valor: {
    reglaMinimo: GRAVAR_BASE_NETA_DE_MINIMO,
    // Art. 66.1 (9,5 / 10,5) más el gravamen complementario estatal de la
    // DA 35.ª.1.b (2 / 4 / 6), que grava la base del ahorro en la parte que
    // no corresponda con el mínimo del art. 56, es decir, el estatal.
    estatal: [
      [importe(6000), importe("0.115")],
      [importe(24000), importe("0.145")],
      [importe(Infinity), importe("0.165")],
    ],
    autonomica: ESCALA_AHORRO_MITAD_2010,
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 39/2010, art. 63) y disposición adicional trigésima quinta.1.b (añadida por el Real Decreto-ley 20/2011, disposición final segunda, para 2012 y 2013, y prorrogada a 2014 por la Ley 22/2013, art. 64)",
    `${LEY_IRPF_BOE}&p=20131226#datrigesimaquinta`,
    "Arts. 66.1 y 76: https://www.boe.es/buscar/act.php?id=BOE-A-2010-19703#a63. Alta de la DA 35.ª: https://www.boe.es/buscar/act.php?id=BOE-A-2011-20638#segunda-3. Prórroga a 2014: https://www.boe.es/buscar/act.php?id=BOE-A-2013-13616#a64."
  ),
})

const ESCALAS_AHORRO_2015 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro 2015",
  valor: {
    reglaMinimo: MINORAR_CUOTA_CON_LA_DEL_MINIMO,
    estatal: ESCALA_AHORRO_MITAD_2015,
    autonomica: [
      [importe(6000), importe("0.10")],
      [importe(50000), importe("0.11")],
      [importe(Infinity), importe("0.12")],
    ],
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, disposición adicional trigésima primera.1.c y e (redacción del Real Decreto-ley 9/2015)",
    "https://www.boe.es/buscar/doc.php?id=BOE-A-2015-7765"
  ),
})

const ESCALAS_AHORRO_2016_A_2020 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro 2016-2020",
  valor: {
    reglaMinimo: MINORAR_CUOTA_CON_LA_DEL_MINIMO,
    estatal: ESCALA_AHORRO_MITAD_2015,
    autonomica: ESCALA_AHORRO_MITAD_2015,
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 26/2014)",
    `${LEY_IRPF_BOE}&p=20141128#a66`
  ),
})

const ESCALAS_AHORRO_2021_A_2022 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro 2021-2022",
  valor: {
    reglaMinimo: MINORAR_CUOTA_CON_LA_DEL_MINIMO,
    estatal: ESCALA_AHORRO_MITAD_2021,
    autonomica: ESCALA_AHORRO_MITAD_2021,
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 11/2020)",
    `${LEY_IRPF_BOE}&p=20201231#a66`
  ),
})

const ESCALAS_AHORRO_2023_A_2024 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro 2023-2024",
  valor: {
    reglaMinimo: MINORAR_CUOTA_CON_LA_DEL_MINIMO,
    estatal: ESCALA_AHORRO_MITAD_2023,
    autonomica: ESCALA_AHORRO_MITAD_2023,
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 31/2022)",
    `${LEY_IRPF_BOE}&p=20221224#a66`
  ),
})

const ESCALAS_AHORRO_DESDE_2025 = parametroNormativo({
  nombre: "Escalas estatal y autonómica del ahorro desde 2025",
  valor: {
    reglaMinimo: MINORAR_CUOTA_CON_LA_DEL_MINIMO,
    estatal: ESCALA_AHORRO_MITAD_2025,
    autonomica: ESCALA_AHORRO_MITAD_2025,
  } satisfies EscalasIrpfAhorroPorGravamen,
  fuente: fuenteEscalasAhorro(
    "Ley 35/2006, arts. 66.1 y 76 (redacción de la Ley 7/2024)",
    `${LEY_IRPF_BOE}#a66`
  ),
})

export const ESCALAS_IRPF_AHORRO_POR_GRAVAMEN: Readonly<
  Record<AnioFiscal, ParametroNormativoEjecutable<EscalasIrpfAhorroPorGravamen>>
> = {
  2012: ESCALAS_AHORRO_2012_A_2014,
  2013: ESCALAS_AHORRO_2012_A_2014,
  2014: ESCALAS_AHORRO_2012_A_2014,
  2015: ESCALAS_AHORRO_2015,
  2016: ESCALAS_AHORRO_2016_A_2020,
  2017: ESCALAS_AHORRO_2016_A_2020,
  2018: ESCALAS_AHORRO_2016_A_2020,
  2019: ESCALAS_AHORRO_2016_A_2020,
  2020: ESCALAS_AHORRO_2016_A_2020,
  2021: ESCALAS_AHORRO_2021_A_2022,
  2022: ESCALAS_AHORRO_2021_A_2022,
  2023: ESCALAS_AHORRO_2023_A_2024,
  2024: ESCALAS_AHORRO_2023_A_2024,
  2025: ESCALAS_AHORRO_DESDE_2025,
  2026: ESCALAS_AHORRO_DESDE_2025,
}

export const REDUCCION_MOVILIDAD_GEOGRAFICA_TRANSITORIA_2015 = {
  condicionAplicacion:
    "Aceptacion de puesto de trabajo en 2014 con derecho a reducción por movilidad geográfica y continuidad en dicho trabajo en 2015",
  incompatibilidad:
    "Se aplica en lugar del gasto adicional por movilidad geográfica del art. 19.2.f LIRPF vigente desde 2015",
  fuente: {
    titulo:
      "AEAT Manual práctico Renta 2015. Régimen transitorio de movilidad geográfica",
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
      "AEAT Manual práctico Renta 2014. Integración y compensación de ganancias y pérdidas patrimoniales",
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
      "AEAT Manual práctico Renta 2013. Integración y compensación de ganancias y pérdidas patrimoniales",
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
      "AEAT Manual práctico Renta 2012. Integración y compensación de ganancias y pérdidas patrimoniales",
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
