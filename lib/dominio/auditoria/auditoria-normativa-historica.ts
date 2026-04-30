import { Match } from "effect"

export type MagnitudAuditada =
  | "irpf_final"
  | "cotizacion_trabajador"
  | "cotizacion_empresarial"
  | "salario_neto_anual"
  | "coste_laboral"
  | "carga_fiscal_efectiva"

export type EstrategiaProyeccionSalarial =
  | "salario_bruto_real_constante"
  | "coste_laboral_real_constante"
  | "trayectoria_salarial_propia"

export interface VarianteAuditoriaNormativaHistorica {
  readonly magnitudAuditada: MagnitudAuditada
  readonly estrategiaProyeccionSalarial: EstrategiaProyeccionSalarial
}

export interface ContratoUrlAuditoriaNormativaHistoricaV1 {
  readonly v: 1
  readonly perfil: string
  readonly anioReferencia: number
  readonly periodo: string
  readonly estrategiaSalario: EstrategiaProyeccionSalarial
  readonly magnitud: MagnitudAuditada
  readonly medida?: string
  readonly paquete?: string
  readonly comunidad?: string
  readonly salario?: number
  readonly vista?: string
}

export const varianteAuditoriaPorDefecto = {
  magnitudAuditada: "irpf_final",
  estrategiaProyeccionSalarial: "salario_bruto_real_constante",
} as const satisfies VarianteAuditoriaNormativaHistorica

export const impactoDesdePerspectivaCiudadano = ({
  magnitud,
  resultadoRealCentimos,
  resultadoContrafactualCentimos,
}: {
  readonly magnitud: MagnitudAuditada
  readonly resultadoRealCentimos: number
  readonly resultadoContrafactualCentimos: number
}): number =>
  Match.value(magnitud).pipe(
    Match.when(
      "salario_neto_anual",
      () => resultadoRealCentimos - resultadoContrafactualCentimos
    ),
    Match.orElse(() => resultadoContrafactualCentimos - resultadoRealCentimos)
  )
