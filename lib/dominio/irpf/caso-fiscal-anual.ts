import type { AnioFiscal } from "../normativa/anio-fiscal"

export type ComunidadAutonoma =
  | "simulada-estatal"
  | "andalucia"
  | "aragon"
  | "asturias"
  | "illes-balears"
  | "canarias"
  | "cantabria"
  | "castilla-la-mancha"
  | "castilla-y-leon"
  | "catalunya"
  | "extremadura"
  | "galicia"
  | "madrid"
  | "murcia"
  | "la-rioja"
  | "comunitat-valenciana"
  | "ceuta"
  | "melilla"
export type DiscapacidadFiscal =
  | {
      readonly _tag: "SinDiscapacidad"
    }
  | {
      readonly _tag: "Discapacidad33a64"
      readonly necesitaAyudaOMovilidadReducida: boolean
    }
  | {
      readonly _tag: "Discapacidad65OMas"
    }

export const sinDiscapacidad = {
  _tag: "SinDiscapacidad",
} as const satisfies DiscapacidadFiscal

export const discapacidad33a64 = ({
  necesitaAyudaOMovilidadReducida = false,
}: {
  readonly necesitaAyudaOMovilidadReducida?: boolean
} = {}): DiscapacidadFiscal => ({
  _tag: "Discapacidad33a64",
  necesitaAyudaOMovilidadReducida,
})

export const discapacidad65OMas = {
  _tag: "Discapacidad65OMas",
} as const satisfies DiscapacidadFiscal

export interface FamiliarFiscal {
  readonly edad: number
  readonly discapacidad: DiscapacidadFiscal
}

export interface SituacionFamiliarIndividual {
  readonly tipo: "individual"
  readonly edad: number
  readonly descendientes: ReadonlyArray<FamiliarFiscal>
  readonly ascendientes: ReadonlyArray<FamiliarFiscal>
  readonly discapacidad: DiscapacidadFiscal
}

export interface RendimientoTrabajo {
  readonly importeIntegroCentimos: number
}

export interface RendimientoCapitalInmobiliario {
  readonly importeIntegroCentimos: number
}

export interface RendimientosCasoFiscal {
  readonly trabajo: ReadonlyArray<RendimientoTrabajo>
  readonly capitalInmobiliario?: ReadonlyArray<RendimientoCapitalInmobiliario>
}

export interface DeduccionAutonomicaAplicada {
  readonly importeCentimos: number
  readonly descripcion: string
}

export interface CasoFiscalAnual {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly situacionFamiliar: SituacionFamiliarIndividual
  readonly rendimientos: RendimientosCasoFiscal
  readonly reducciones: ReadonlyArray<never>
  readonly deducciones: ReadonlyArray<DeduccionAutonomicaAplicada>
  readonly retencionesSoportadasCentimos: number
  readonly pagosACuentaCentimos: number
}
