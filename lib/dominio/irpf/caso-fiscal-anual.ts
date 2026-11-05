import type { CensoIngresosIdentificados2025 } from "./ingresos-identificados-2025/contrato"
import type { HechosMaternidad2025 } from "./maternidad-2025/contrato"
import type { SolicitudDeduccionesTerritoriales2025 } from "./deducciones/anual-territorial"
import type { SolicitudDeduccionesValencianasAnual2025 } from "./deducciones/valenciana-2025/anual"
import type { AnioFiscal } from "../normativa/anio-fiscal"
import type { DerechosMinimosAnuales } from "./minimos/derechos-contrato"
import type { CasoRetencionTrabajo } from "./retenciones/retencion-trabajo-aeat"

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

export interface SituacionFamiliarIndividual {
  readonly tipo: "individual"
  readonly edad: number
  readonly descendientes: ReadonlyArray<never>
  readonly ascendientes: ReadonlyArray<never>
  readonly discapacidad: DiscapacidadFiscal
}

export interface RendimientoTrabajo {
  readonly importeIntegroCentimos: number
}

export interface RendimientoCapitalInmobiliario {
  readonly importeIntegroCentimos: number
}

export type TratamientoGananciaPatrimonialMayores65 =
  | { readonly _tag: "SinExencionMayores65" }
  | { readonly _tag: "ViviendaHabitualMayores65" }
  | {
      readonly _tag: "ReinversionRentaVitaliciaMayores65"
      readonly importeTransmisionCentimos: number
      readonly importeReinvertidoRentaVitaliciaCentimos: number
      readonly reinversionesPreviasRentaVitaliciaCentimos: number
    }

export interface GananciaPatrimonialTransmision {
  readonly importeGananciaCentimos: number
  readonly tratamientoMayores65: TratamientoGananciaPatrimonialMayores65
  readonly fechaAdquisicion?: string | undefined
  readonly fechaTransmision?: string | undefined
  readonly exencionInmuebleUrbanoAdquirido2012?:
    | {
        readonly inmuebleUrbano: boolean
        readonly tituloOneroso: boolean
        readonly fechaAdquisicion: string
        readonly operacionConPersonaOEntidadVinculada?: boolean | undefined
      }
    | undefined
}

export interface RendimientosCasoFiscal {
  readonly trabajo: ReadonlyArray<RendimientoTrabajo>
  readonly capitalInmobiliario?: ReadonlyArray<RendimientoCapitalInmobiliario>
  readonly gananciasPatrimoniales?: ReadonlyArray<GananciaPatrimonialTransmision>
}

export interface DeduccionAutonomicaCatalogadaAplicada {
  readonly codigo: string
}

export interface CasoFiscalAnual {
  readonly basesFamiliares2025?: import("./bases-familiares-2025/productor").CensoBasesFamiliares2025 | undefined
  readonly ingresosIdentificados2025?: CensoIngresosIdentificados2025 | undefined
  readonly maternidad2025?: HechosMaternidad2025 | undefined
  readonly deduccionesTerritoriales2025?:
    | SolicitudDeduccionesTerritoriales2025
    | undefined
  /** Hechos completos de reparto; obligatorios cuando existen familiares. */
  readonly derechosMinimos?: DerechosMinimosAnuales | undefined
  readonly contribuyenteId?: string | undefined
  readonly deduccionesValencianas2025?:
    | SolicitudDeduccionesValencianasAnual2025
    | undefined
  readonly anio: AnioFiscal
  readonly comunidadAutonoma: ComunidadAutonoma
  readonly fechaFallecimiento?: Date | undefined
  readonly situacionFamiliar: SituacionFamiliarIndividual
  readonly rendimientos: RendimientosCasoFiscal
  readonly reducciones: ReadonlyArray<never>
  readonly deducciones: ReadonlyArray<DeduccionAutonomicaCatalogadaAplicada>
  readonly deduccionAutonomicaAgregadaCentimos?: number
  readonly retencionesSoportadasCentimos: number
  readonly pagosACuentaCentimos: number
  readonly retencionTrabajoAeat?: CasoRetencionTrabajo
}

/** Entrada anual con importes efectivos y admisión explícita. */
export { CasoFiscalAnualExplicito } from "./trabajo-anual/conexion-contrato"
