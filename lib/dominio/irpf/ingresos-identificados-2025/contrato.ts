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
  ayudas: Schema.Array(Schema.Struct({
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
  })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
})
export type CensoIngresosIdentificados2025 = typeof CensoIngresosIdentificados2025.Type
