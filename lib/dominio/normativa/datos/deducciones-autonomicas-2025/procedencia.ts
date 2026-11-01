/** Referencia ligera. Los dictámenes y sus fuentes se consumen fuera del bundle. */
export type ReferenciaProcedenciaDeduccion2025 = {
  readonly version: 1
  readonly ejercicio: 2025
  readonly codigo: string
  readonly estado: "pendiente" | "candidato"
  /** SHA-256 del paquete documental; su integridad no implica aceptación jurídica. */
  readonly paqueteSha256?: string
}

/** También admite las fichas literales regionales anteriores al contrato. */
export const obtenerProcedenciaDeduccion2025 = (ficha: {
  readonly codigo: string
  readonly procedencia?: ReferenciaProcedenciaDeduccion2025
}): ReferenciaProcedenciaDeduccion2025 =>
  ficha.procedencia ?? {
    version: 1,
    ejercicio: 2025,
    codigo: ficha.codigo,
    estado: "pendiente",
  }
