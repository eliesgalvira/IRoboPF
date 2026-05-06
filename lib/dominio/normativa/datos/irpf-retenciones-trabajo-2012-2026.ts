import type { AnioFiscal } from "../anio-fiscal"

export type SituacionFamiliarRetencionTabla =
  | "situacion1"
  | "situacion2"
  | "situacion3"

export type SituacionLaboralRetencionTabla =
  | "activo"
  | "pensionista"
  | "desempleado"
  | "otra-situacion"

export type UmbralRetencionSituacion = {
  readonly sinDescendientes: number | null
  readonly unDescendiente: number
  readonly dosOMasDescendientes: number
}

export type TablaUmbralesRetencion = {
  readonly situacion1: UmbralRetencionSituacion
  readonly situacion2: UmbralRetencionSituacion
  readonly situacion3: UmbralRetencionSituacion
}

export type PeriodoUmbralesRetencion = {
  readonly desde: string
  readonly hasta?: string
  readonly tabla: TablaUmbralesRetencion
}

export const UMBRALES_RETENCION_2012_2014 = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 13_662,
    dosOMasDescendientes: 15_617,
  },
  situacion2: {
    sinDescendientes: 13_335,
    unDescendiente: 14_774,
    dosOMasDescendientes: 16_952,
  },
  situacion3: {
    sinDescendientes: 11_162,
    unDescendiente: 11_888,
    dosOMasDescendientes: 12_519,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_2015_2017 = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 14_266,
    dosOMasDescendientes: 15_803,
  },
  situacion2: {
    sinDescendientes: 13_696,
    unDescendiente: 14_985,
    dosOMasDescendientes: 17_138,
  },
  situacion3: {
    sinDescendientes: 12_000,
    unDescendiente: 12_607,
    dosOMasDescendientes: 13_275,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_2018_DESDE_5_JULIO = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 15_168,
    dosOMasDescendientes: 16_730,
  },
  situacion2: {
    sinDescendientes: 14_641,
    unDescendiente: 15_845,
    dosOMasDescendientes: 17_492,
  },
  situacion3: {
    sinDescendientes: 12_643,
    unDescendiente: 13_455,
    dosOMasDescendientes: 14_251,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_2019_2022 = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 15_947,
    dosOMasDescendientes: 17_100,
  },
  situacion2: {
    sinDescendientes: 15_456,
    unDescendiente: 16_481,
    dosOMasDescendientes: 17_634,
  },
  situacion3: {
    sinDescendientes: 14_000,
    unDescendiente: 14_516,
    dosOMasDescendientes: 15_093,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_2023_DESDE_FEBRERO = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 17_270,
    dosOMasDescendientes: 18_617,
  },
  situacion2: {
    sinDescendientes: 16_696,
    unDescendiente: 17_894,
    dosOMasDescendientes: 19_241,
  },
  situacion3: {
    sinDescendientes: 15_000,
    unDescendiente: 15_599,
    dosOMasDescendientes: 16_272,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_2024_2026 = {
  situacion1: {
    sinDescendientes: null,
    unDescendiente: 17_644,
    dosOMasDescendientes: 18_694,
  },
  situacion2: {
    sinDescendientes: 17_197,
    unDescendiente: 18_130,
    dosOMasDescendientes: 19_262,
  },
  situacion3: {
    sinDescendientes: 15_876,
    unDescendiente: 16_342,
    dosOMasDescendientes: 16_867,
  },
} as const satisfies TablaUmbralesRetencion

export const UMBRALES_RETENCION_NOMINA_POR_ANIO = {
  2012: [{ desde: "2012-01-01", tabla: UMBRALES_RETENCION_2012_2014 }],
  2013: [{ desde: "2013-01-01", tabla: UMBRALES_RETENCION_2012_2014 }],
  2014: [{ desde: "2014-01-01", tabla: UMBRALES_RETENCION_2012_2014 }],

  2015: [{ desde: "2015-01-01", tabla: UMBRALES_RETENCION_2015_2017 }],
  2016: [{ desde: "2016-01-01", tabla: UMBRALES_RETENCION_2015_2017 }],
  2017: [{ desde: "2017-01-01", tabla: UMBRALES_RETENCION_2015_2017 }],

  2018: [
    {
      desde: "2018-01-01",
      hasta: "2018-07-04",
      tabla: UMBRALES_RETENCION_2015_2017,
    },
    { desde: "2018-07-05", tabla: UMBRALES_RETENCION_2018_DESDE_5_JULIO },
  ],

  2019: [{ desde: "2019-01-01", tabla: UMBRALES_RETENCION_2019_2022 }],
  2020: [{ desde: "2020-01-01", tabla: UMBRALES_RETENCION_2019_2022 }],
  2021: [{ desde: "2021-01-01", tabla: UMBRALES_RETENCION_2019_2022 }],
  2022: [{ desde: "2022-01-01", tabla: UMBRALES_RETENCION_2019_2022 }],

  2023: [
    {
      desde: "2023-01-01",
      hasta: "2023-01-31",
      tabla: UMBRALES_RETENCION_2019_2022,
    },
    { desde: "2023-02-01", tabla: UMBRALES_RETENCION_2023_DESDE_FEBRERO },
  ],

  2024: [
    {
      desde: "2024-01-01",
      hasta: "2024-02-07",
      tabla: UMBRALES_RETENCION_2023_DESDE_FEBRERO,
    },
    { desde: "2024-02-08", tabla: UMBRALES_RETENCION_2024_2026 },
  ],

  2025: [{ desde: "2025-01-01", tabla: UMBRALES_RETENCION_2024_2026 }],
  2026: [{ desde: "2026-01-01", tabla: UMBRALES_RETENCION_2024_2026 }],
} as const satisfies Readonly<
  Record<AnioFiscal, ReadonlyArray<PeriodoUmbralesRetencion>>
>

const tablaVigenteAlCierreDelAnio = (
  anio: AnioFiscal
): TablaUmbralesRetencion => {
  const periodos = UMBRALES_RETENCION_NOMINA_POR_ANIO[anio]

  return periodos[periodos.length - 1].tabla
}

export const tablaUmbralesRetencionTrabajo = ({
  anio,
  fecha,
}: {
  readonly anio: AnioFiscal
  readonly fecha?: string
}): TablaUmbralesRetencion => {
  if (fecha === undefined) {
    return tablaVigenteAlCierreDelAnio(anio)
  }

  const periodos: ReadonlyArray<PeriodoUmbralesRetencion> =
    UMBRALES_RETENCION_NOMINA_POR_ANIO[anio]
  const periodo = periodos.find(
    ({ desde, hasta }) =>
      fecha >= desde && (hasta === undefined || fecha <= hasta)
  )

  return periodo?.tabla ?? tablaVigenteAlCierreDelAnio(anio)
}

const umbralPorDescendientes = (
  umbrales: UmbralRetencionSituacion,
  numeroDescendientes: number
): number | null => {
  if (numeroDescendientes <= 0) {
    return umbrales.sinDescendientes
  }

  if (numeroDescendientes === 1) {
    return umbrales.unDescendiente
  }

  return umbrales.dosOMasDescendientes
}

export const umbralRetencionTrabajoEuros = ({
  anio,
  fecha,
  numeroDescendientes,
  situacionFamiliar,
}: {
  readonly anio: AnioFiscal
  readonly fecha?: string
  readonly numeroDescendientes: number
  readonly situacionFamiliar: SituacionFamiliarRetencionTabla
  readonly situacionLaboral?: SituacionLaboralRetencionTabla
}): number | null => {
  const tabla =
    fecha === undefined
      ? tablaUmbralesRetencionTrabajo({ anio })
      : tablaUmbralesRetencionTrabajo({ anio, fecha })

  return umbralPorDescendientes(tabla[situacionFamiliar], numeroDescendientes)
}

export const umbralRetencionTrabajoRequeridoEuros = (
  entrada: Parameters<typeof umbralRetencionTrabajoEuros>[0]
): number => {
  const umbral = umbralRetencionTrabajoEuros(entrada)

  if (umbral === null) {
    throw new Error("La situacion 1 sin descendientes no tiene umbral")
  }

  return umbral
}

export const maximoUmbralRetencionTrabajoEuros = ({
  anio,
  fecha,
}: {
  readonly anio: AnioFiscal
  readonly fecha?: string
  readonly situacionLaboral?: SituacionLaboralRetencionTabla
}): number => {
  const tabla =
    fecha === undefined
      ? tablaUmbralesRetencionTrabajo({ anio })
      : tablaUmbralesRetencionTrabajo({ anio, fecha })
  const umbrales = [
    tabla.situacion1.sinDescendientes,
    tabla.situacion1.unDescendiente,
    tabla.situacion1.dosOMasDescendientes,
    tabla.situacion2.sinDescendientes,
    tabla.situacion2.unDescendiente,
    tabla.situacion2.dosOMasDescendientes,
    tabla.situacion3.sinDescendientes,
    tabla.situacion3.unDescendiente,
    tabla.situacion3.dosOMasDescendientes,
  ].filter((umbral): umbral is number => umbral !== null)

  return Math.max(...umbrales)
}
