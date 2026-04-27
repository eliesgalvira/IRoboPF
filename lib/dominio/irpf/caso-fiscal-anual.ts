import type { AnioFiscal } from "../normativa/anio-fiscal"

export type ComunidadAutonoma = "simulada-estatal"
export type DiscapacidadFiscal = "sin-discapacidad"

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

export interface CasoFiscalAnual {
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly situacionFamiliar: SituacionFamiliarIndividual
  readonly rendimientos: RendimientosCasoFiscal
  readonly reducciones: ReadonlyArray<never>
  readonly deducciones: ReadonlyArray<never>
  readonly retencionesSoportadasCentimos: number
  readonly pagosACuentaCentimos: number
}
