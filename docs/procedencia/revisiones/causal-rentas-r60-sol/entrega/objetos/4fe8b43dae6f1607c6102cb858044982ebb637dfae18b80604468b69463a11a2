import { Schema } from "effect"

const Texto = Schema.String.check(Schema.isPattern(/^[^\s].{0,199}$/))
const Importe = Schema.String.check(
  Schema.isPattern(/^(0|[1-9][0-9]{0,11})(\.[0-9]{1,2})?$/)
)
const Neto = Schema.String.check(
  Schema.isPattern(/^-?(0|[1-9][0-9]{0,11})(\.[0-9]{1,8})?$/)
)
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Documento = { id: Texto, justificante: Texto, fecha: Fecha }
const Asiento = {
  ...Documento,
  base: Importe,
  iva: Importe,
  ivaRecuperable: Importe,
  afectacionExclusiva: Schema.Boolean,
  registrado: Schema.Boolean,
}

export const CasoActividad2025 = Schema.Struct({
  ejercicio: Schema.Number,
  territorio: Schema.Literals(["comun", "foral", "desconocido"]),
  individual: Schema.Boolean,
  actividadId: Texto,
  iae: Texto,
  fechaInicio: Fecha,
  fechaFin: Fecha,
  serviciosOrdinarios: Schema.Boolean,
  hechos: Schema.Struct({
    otrasActividades: Schema.Boolean,
    otrasRentas: Schema.Boolean,
    existencias: Schema.Boolean,
    empleados: Schema.Boolean,
    artistica: Schema.Boolean,
    irregular: Schema.Boolean,
    subvenciones: Schema.Boolean,
    transmisiones: Schema.Boolean,
    extranjero: Schema.Boolean,
    mutualidad: Schema.Boolean,
    especialidadesTerritoriales: Schema.Boolean,
    saldosPendientes: Schema.Boolean,
    serviciosGratuitos: Schema.Boolean,
    autoconsumo: Schema.Boolean,
    noFacturados: Schema.Boolean,
    subvalorados: Schema.Boolean,
    trade: Schema.Boolean,
    hechosDesconocidos: Schema.Boolean,
  }),
  // Historial completo desde el inicio: se admite solo la trayectoria limpia.
  historial: Schema.Array(
    Schema.Struct({
      ejercicio: Schema.Number,
      documento: Texto,
      regimen: Schema.Literals(["eds", "normal", "objetiva", "desconocido"]),
      renuncia: Schema.Boolean,
      exclusion: Schema.Boolean,
      criterio: Schema.Literals(["devengo", "cobros-pagos", "desconocido"]),
      netoAntesReducciones: Neto,
    })
  ),
  actividadPreviaAlInicio: Schema.Literals([
    "ausente",
    "presente",
    "desconocida",
  ]),
  regimen2025: Schema.Literals(["eds", "normal", "objetiva", "desconocido"]),
  criterio2025: Schema.Literals(["devengo", "cobros-pagos", "desconocido"]),
  documentoCriterio2025: Texto,
  renuncia2025: Schema.Boolean,
  exclusion2025: Schema.Boolean,
  volumen2024: Importe,
  diasActividad2024: Schema.Number,
  documentoVolumen2024: Texto,
  clientes: Schema.Array(
    Schema.Struct({
      id: Texto,
      vinculado: Schema.Boolean,
      empleadorEnAnioAnteriorAlInicio: Schema.Boolean,
      documento: Texto,
    })
  ),
  ingresos: Schema.Array(
    Schema.Struct({
      ...Asiento,
      categoria: Schema.Literal("servicio"),
      clienteId: Texto,
      sujetoRetencion: Schema.Boolean,
      rectificativa: Schema.Boolean,
    })
  ),
  gastos: Schema.Array(
    Schema.Struct({
      ...Asiento,
      categoria: Schema.Literals([
        "consumibles-consumidos",
        "alquiler-local",
        "servicios-profesionales",
        "suministros-local",
      ]),
      correlacion: Schema.Boolean,
      rectificativa: Schema.Boolean,
    })
  ),
  reta: Schema.Array(
    Schema.Struct({
      ...Documento,
      importe: Importe,
      tipo: Schema.Literals(["ordinaria", "regularizacion", "devolucion"]),
      propia: Schema.Boolean,
      efectiva: Schema.Boolean,
      periodo: Texto,
    })
  ),
  activos: Schema.Array(
    Schema.Struct({
      ...Documento,
      grupo: Schema.Literals(["mobiliario", "hardware"]),
      coste: Importe,
      puestaMarcha: Importe,
      residual: Importe,
      acumulada: Importe,
      iva: Importe,
      ivaRecuperable: Importe,
      coeficiente: Schema.String.check(Schema.isPattern(/^0\.[0-9]{1,6}$/)),
      fechaUso: Fecha,
      fechaAdquisicion: Fecha,
      usoHasta: Fecha,
      nuevo: Schema.Boolean,
      exclusivo: Schema.Boolean,
      oneroso: Schema.Boolean,
      mejoras: Schema.Boolean,
      deterioros: Schema.Boolean,
      subvencionado: Schema.Boolean,
      leasing: Schema.Boolean,
      incentivo: Schema.Boolean,
      metodoHistorico: Schema.Literals(["lineal", "otro", "desconocido"]),
      coeficienteHistorico: Schema.String.check(
        Schema.isPattern(/^0\.[0-9]{1,6}$/)
      ),
      saldoDocumentado: Texto,
    })
  ),
  obligacionesFormales: Schema.Boolean,
  documentoObligaciones: Texto,
  discapacidad: Schema.Struct({
    grado: Schema.Number,
    ayudaOMovilidad: Schema.Boolean,
    ejercicioEfectivo: Schema.Boolean,
    documento: Texto,
  }),
  opcion: Schema.Literals(["gastos-dificiles", "cliente-unico"]),
  aplicarRentasBajas: Schema.Boolean,
  aplicarInicio: Schema.Boolean,
  retenciones: Schema.Array(
    Schema.Struct({
      ...Documento,
      operacionId: Texto,
      ingresoId: Texto,
      importe: Importe,
      efectiva: Schema.Boolean,
    })
  ),
  pagosFraccionados: Schema.Array(
    Schema.Struct({
      ...Documento,
      operacionId: Texto,
      periodo: Schema.Literals(["2025-1T", "2025-2T", "2025-3T", "2025-4T"]),
      modelo: Schema.Literal("130"),
      importe: Importe,
      efectivo: Schema.Boolean,
    })
  ),
})
export type CasoActividad2025 = typeof CasoActividad2025.Type
export interface MotivoActividad {
  readonly reglaId: string
  readonly id: string
  readonly motivo: string
}
export interface EtapaActividad {
  readonly reglaId: string
  readonly id: string
  readonly formula: string
  readonly fuentes: readonly string[]
  readonly importe: string
  readonly documentos: readonly string[]
}
export interface AporteActividadGeneral {
  readonly clase: "rendimiento-actividad-2025"
  readonly importeEurosExactos: string
  readonly retencionesEuros: string
  readonly pagosFraccionadosEuros: string
  readonly liquidacionAnual: "no-calculada"
}
export type ResultadoActividad2025 =
  | {
      readonly estado: "no-soportado"
      readonly motivos: readonly MotivoActividad[]
    }
  | {
      readonly estado: "soportado"
      readonly revisionFiscal: "pendiente"
      readonly etapas: readonly EtapaActividad[]
      readonly elegibleClienteUnico: boolean
      readonly primerPositivo: number | null
      readonly aporte: AporteActividadGeneral
    }
