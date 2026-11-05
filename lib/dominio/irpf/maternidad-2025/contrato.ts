import { Schema } from "effect"

const Id = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^\d{4}-\d{2}-\d{2}$/))
const Euros = Schema.String.check(Schema.isPattern(/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/))
const Periodo = { desde: Fecha, hasta: Fecha, referencia: Id }

/** Hechos primarios cerrados; el derecho y los meses se producen dentro de la anual. */
export const HechosMaternidad2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  beneficiaria: Id,
  residencia: Schema.Struct({ pais: Id, ...Periodo }),
  censo: Schema.Literal("todos_hijos_progenitores_facturas_ayudas_anticipos"),
  hijos: Schema.Array(Schema.Struct({
    id: Id,
    nacimiento: Fecha,
    filiacion: Schema.Literals(["biologica", "adopcion", "otra"]),
    convivencia: Schema.Literals(["estable_2025", "cambio_o_custodia_especial"]),
    segundoCiclo: Schema.Union([
      Schema.Struct({ calendario: Schema.Literal("no_cumple3_2025") }),
      Schema.Struct({ calendario: Schema.Literal("ordinario_septiembre2025"), inicio: Fecha, referencia: Id }),
    ]),
    progenitores: Schema.Array(Schema.Struct({
      id: Id,
      papel: Schema.Literals(["madre_biologica", "padre_biologico", "otro"]),
      altas: Schema.Array(Schema.Struct({ ...Periodo, regimen: Schema.Literals(["seguridad_social", "mutualidad"]) })),
      actividades: Schema.Array(Schema.Struct({ ...Periodo, empresa: Id, clase: Schema.Literals(["cuenta_ajena", "cuenta_propia"]) })),
    })),
    antecedenteInfancia2022: Schema.Literals(["sin_cobros_2022", "cobros_2022"]),
    // Doce meses, incluidos los vacíos y anteriores al nacimiento: no inferir ausencias.
    calendario: Schema.Array(Schema.Struct({
      mes: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 1, maximum: 12 })),
      complementoInfancia: Schema.Array(Schema.Struct({ id: Id, perceptor: Id, resolucion: Id, fechaCobro: Fecha, importe: Euros })),
      contratos: Schema.Array(Schema.Struct({ centro: Id, ...Periodo })),
    })),
    centros: Schema.Array(Schema.Struct({
      id: Id,
      nif: Id,
      municipio: Schema.String.check(Schema.isPattern(/^\d{5}$/)),
      clase: Schema.Literals(["guarderia", "centro_educacion_infantil"]),
      autorizacion: Schema.Struct({
        ...Periodo,
        clase: Schema.Literals(["apertura_funcionamiento_municipal", "educativa"]),
        autoridad: Id,
      }),
      registroCyl: Schema.Union([
        Schema.Struct({ estado: Schema.Literal("no_consta") }),
        Schema.Struct({ estado: Schema.Literal("inscrito"), ...Periodo }),
      ]),
    })),
    facturas: Schema.Array(Schema.Struct({
      // Referencia documental: clase distinta de las claves de pago.
      id: Id,
      centro: Id,
      mes: Schema.Number.check(Schema.isInt(), Schema.isBetween({ minimum: 1, maximum: 12 })),
      concepto: Schema.Literals(["matricula", "preinscripcion", "asistencia", "alimentacion"]),
      // Claves de pago consistentes entre los libros de esta declaración.
      pagos: Schema.Array(Schema.Struct({ id: Id, fecha: Fecha, pagador: Id, importe: Euros })),
      pagosEmpresa: Schema.Array(Schema.Struct({
        id: Id, fecha: Fecha, empresa: Id, empleado: Id, importe: Euros,
        forma: Schema.Literals(["contratacion_directa_custodia", "reembolso_dinero"]),
        contratoServicio: Id, nomina: Id,
      })),
    })),
    ayudas: Schema.Array(Schema.Struct({
      id: Id,
      fechaCobro: Fecha,
      beneficiario: Id,
      programa: Schema.Literals(["ordinaria", "bono_concilia", "reduccion_jornada_FAM1454", "analoga_junta"]),
      atribucion: Schema.Literals(["nominal", "compartida_sin_atribucion"]),
      importe: Euros,
      facturas: Schema.Array(Schema.Struct({ id: Id, importe: Euros })),
    })),
    anticipos140: Schema.Array(Schema.Struct({ id: Id, beneficiaria: Id, fechaCobro: Fecha, periodo: Fecha, importe: Euros })),
  })),
})
export type HechosMaternidad2025 = typeof HechosMaternidad2025.Type

/** Selección regional: referencia al niño del libro81, nunca al importe estatal. */
export const SolicitudCuidadoCyl81 = Schema.Struct({
  lote: Schema.Literal("CYL81"),
  codigo: Schema.Literal("cyl_cuidado_hijos_menores"),
  hechos: Schema.Struct({ hijo: Id, eleccion: Schema.Literal("centro") }),
})
export type SolicitudCuidadoCyl81 = typeof SolicitudCuidadoCyl81.Type
