import { Schema } from "effect"
import { Euros } from "../trabajo-anual/contrato"
const Texto = Schema.String.check(Schema.isPattern(/^\S(?:.*\S)?$/))
const Documento = Schema.Struct({ referencia: Texto, emisor: Texto, fecha: Texto })
const Corte = Schema.Struct({ importe: Euros, documento: Documento })
const Anual = Schema.Struct({
  ejercicio: Schema.Literals([2024, 2025]),
  documentoCenso: Documento,
  censo: Schema.Array(Schema.Struct({ id: Texto, titular: Texto,
    tipo: Schema.Literals(["cuenta", "vivienda", "precio-aplazado-vendedor", "otro"]),
    inicio: Schema.Literals(["presente", "ausente"]), cierre: Schema.Literals(["presente", "ausente"]), documento: Documento })),
  cuentas: Schema.Array(Schema.Struct({ id: Texto, titular: Texto, entidad: Texto, inicio: Corte, cierre: Corte })),
  movimientos: Schema.Array(Schema.Struct({ id: Texto, cuenta: Texto, titular: Texto, contraparte: Texto,
    fecha: Texto, orden: Schema.Number.check(Schema.isInt(), Schema.isGreaterThan(0)), importe: Euros,
    clase: Schema.Literals(["salario", "consumo", "precio", "donacion", "herencia"]), documento: Documento })),
  salarios: Schema.Array(Schema.Struct({ id: Texto, titular: Texto, pagador: Texto,
    rendimiento: Texto, integro: Euros, cotizaciones: Euros, retenciones: Euros,
    documento: Documento, cobros: Schema.Array(Texto) })),
  valorVivienda: Corte,
  deudaVendedor: Schema.Struct({ inicio: Corte, cierre: Corte }),
})
/** Hechos nominales, no cortes fiscales ni suficiencia declarada. Perfil cerrado sin
 * efectivo, otros activos, transferencias internas, crédito bancario o rentas en especie.
 * El censo documental lista también las categorías fuera de perfil: se rechazan.
 */
export const PatrimonioHistoricoCLM = Schema.Struct({
  version: Schema.Literal("clm-patrimonio-factual-2024-2025-v1"), titular: Texto,
  exhaustividad: Schema.Literal("todos-activos-derechos-deudas-cuentas-y-movimientos-2024-2025"),
  adquisicion: Schema.Struct({ vivienda: Texto, titular: Texto, fecha: Texto, vendedor: Texto,
    precio: Euros, escritura: Documento, dominio: Schema.Literal("pleno-100-desde-compra"),
    uso: Schema.Literal("residencia-propia-sin-frutos-ni-rentas-2024-2025"),
    precioAplazado: Schema.Struct({ id: Texto, acreedor: Texto, importeOriginal: Euros,
      vencimiento: Texto, contrato: Documento, intereses: Schema.Literal("0"),
      pagos: Schema.Array(Texto) }) }),
  cortes2024: Anual, cortes2025: Anual,
})
export type PatrimonioHistoricoCLM = typeof PatrimonioHistoricoCLM.Type
