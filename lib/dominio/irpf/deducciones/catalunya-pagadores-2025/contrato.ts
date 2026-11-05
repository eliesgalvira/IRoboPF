import { Schema } from "effect"
import { Euros } from "../../trabajo-anual/contrato"
const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Fecha = Schema.String.check(Schema.isPattern(/^2025-\d{2}-\d{2}$/))
/** Identidades y hechos, nunca una conclusión de obligación ni una cuota. */
export const HechosPagadoresCatalunya2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  titular: Texto,
  censo: Schema.Literal("todos-los-rendimientos-y-retenciones-2025"),
  referenciaCenso: Texto,
  pagadores: Schema.Array(Schema.Struct({
    nif: Schema.String.check(Schema.isPattern(/^(?:[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]|[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J])$/)),
    naturaleza: Schema.Literals(["persona-juridica-residente", "persona-fisica", "no-residente"]),
    concepto: Schema.Literals(["salario-ordinario", "prestacion-pasiva", "administrador", "curso-conferencia", "otro"]),
    certificado: Texto,
    integro: Euros,
    rendimientos: Schema.Array(Texto).check(Schema.isMinLength(1)),
    retenciones: Schema.Array(Texto),
  })).check(Schema.isMinLength(1), Schema.isMaxLength(100)),
  altasCuentaPropia: Schema.Array(Schema.Struct({
    regimen: Schema.Literals(["RETA", "mar-cuenta-propia"]), desde: Fecha, hasta: Fecha, referencia: Texto,
  })),
  prestacionesIMV: Schema.Array(Schema.Struct({
    expediente: Texto, miembroUnidad: Texto, referencia: Texto,
  })),
  aportacionesPrevision: Schema.Array(Schema.Struct({
    operacionId: Texto, importe: Euros, referencia: Texto,
  })),
})
export type HechosPagadoresCatalunya2025 = typeof HechosPagadoresCatalunya2025.Type
