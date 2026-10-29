import type { AnioFiscal } from "./anio-fiscal"
import type { FuenteNormativaNormalizada } from "./fuente-normativa"

export type TipoMedidaNormativaComputable =
  | "deduccion_estatal"
  | "limite_retencion"
  | "escala_autonomica_anual"
  | "parametro_irpf"
  | "cotizacion_social"

export interface MedidaNormativaComputable {
  readonly id: string
  readonly tipo: TipoMedidaNormativaComputable
  readonly nombre: string
  readonly anioIntroduccion: AnioFiscal
  readonly fuentes: ReadonlyArray<FuenteNormativaNormalizada>
}

export interface ProcedenciaNormativaEjecutable {
  readonly medida: MedidaNormativaComputable
  readonly descripcion: string
}

export type EstadoMedidaEnEscenario = "activa" | "inactiva"

export interface EscenarioNormativoVersionado {
  readonly id: string
  readonly version: 1
  readonly medidas: Readonly<Record<string, EstadoMedidaEnEscenario>>
}
