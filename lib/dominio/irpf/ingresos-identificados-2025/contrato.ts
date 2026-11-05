import { Schema } from "effect"
import { Euros } from "../trabajo-anual/contrato"

const Identidad = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/), Schema.isMaxLength(200))
const Fecha = Schema.String.check(Schema.isPattern(/^2025-\d{2}-\d{2}$/))
/** Hechos declarados; las referencias no certifican los documentos externos. */
export const CensoIngresosIdentificados2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  contribuyenteId: Identidad,
  ambito: Schema.Literal("ayudas-publicas-no-transmision"),
  exhaustividad: Schema.Literal("completa"),
  ayudas: Schema.Array(Schema.Union([
Schema.Struct({
    ayudaId: Identidad,
    beneficiario: Identidad,
    programa: Schema.Literal("asturias-ela-2025"),
    administracion: Schema.Literal("principado_asturias"),
    enfermedad: Schema.Literal("ELA"),
    clasificacionFiscal: Schema.Literal("ganancia-patrimonial-no-transmision-no-exenta"),
    resolucion: Schema.Struct({
      referencia: Identidad,
      organismo: Schema.Literal("Consejería de Salud del Principado de Asturias"),
      fecha: Fecha,
      importeConcedido: Euros,
    }),
    cobros: Schema.Array(Schema.Struct({
      cobroId: Identidad,
      beneficiario: Identidad,
      ordenante: Schema.Literal("principado_asturias"),
      fecha: Fecha,
      euros: Euros,
      justificante: Identidad,
    })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  }),
Schema.Struct({
    ayudaId: Identidad,
    beneficiario: Identidad,
    programa: Schema.Literal("galicia-bs215a-2025"),
    administracion: Schema.Literal("xunta_galicia"),
    enfermedad: Schema.Literal("ELA_o_fenotipo"),
    clasificacionFiscal: Schema.Literal("ganancia-patrimonial-no-transmision-no-exenta"),
    resolucion: Schema.Struct({
      referencia: Identidad,
      organismo: Schema.Literal("Dirección General de Mayores y Atención Sociosanitaria"),
      fecha: Fecha,
      importeConcedido: Euros,
    }),
    cobros: Schema.Array(Schema.Struct({
      cobroId: Identidad,
      beneficiario: Identidad,
      ordenante: Schema.Literal("xunta_galicia"),
      fecha: Fecha,
      euros: Euros,
      justificante: Identidad,
    })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  }),
Schema.Struct({
    ayudaId: Identidad,
    beneficiario: Identidad,
    programa: Schema.Literal("extremadura-ela-2025"),
    administracion: Schema.Literal("junta_extremadura"),
    enfermedad: Schema.Literal("ELA"),
    clasificacionFiscal: Schema.Literal("ganancia-patrimonial-no-transmision-no-exenta"),
    resolucion: Schema.Struct({
      referencia: Identidad,
      organismo: Schema.Literal("Secretaría General de la Consejería de Salud y Servicios Sociales"),
      fecha: Fecha,
      importeConcedido: Euros,
    }),
    cobros: Schema.Array(Schema.Struct({
      cobroId: Identidad,
      beneficiario: Identidad,
      ordenante: Schema.Literal("junta_extremadura"),
      fecha: Fecha,
      euros: Euros,
      justificante: Identidad,
    })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  })
  ])).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
})
export type CensoIngresosIdentificados2025 = typeof CensoIngresosIdentificados2025.Type
