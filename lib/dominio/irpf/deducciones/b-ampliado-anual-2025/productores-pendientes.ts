/** Datos fiscales todavía no representados. No son hechos de cliente ni activan ramas. */
export type AyudaELAIntegradaB2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly ayudaId: string
  readonly integradoBaseGeneral: string
  readonly integradoBaseLiquidable: string
  readonly nodoFiscalOrigen: string
}
export type BasesDonativosEstatalesB2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly baseLiquidableComputable: string
  readonly baseEstatal68_3: string
  readonly baseEstatal68_5: string
  readonly nodoFiscalOrigen: string
}
export type CuotaTrabajoActividadMixtaB2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly cuotaProcedenteTrabajoActividad: string
  readonly nodoFiscalOrigen: string
  readonly reglaAtribucionArt2_11_3: string
}
export type RentaPeriodoFamiliarB2025 = {
  readonly ejercicio: 2025
  readonly contribuyente: string
  readonly inicioPeriodo: string
  readonly finPeriodo: string
  readonly rentaComputablePeriodo: string
  readonly nodoFiscalOrigen: string
}
