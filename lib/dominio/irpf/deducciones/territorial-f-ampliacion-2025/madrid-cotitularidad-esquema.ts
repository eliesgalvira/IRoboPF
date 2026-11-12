import { Schema } from "effect"

const Texto = Schema.String.check(Schema.isPattern(/\S/))
const Id = Schema.String.check(Schema.isPattern(/^s-[0-9]{1,6}$/))

/** Compra terminada en proindiviso entre cónyuges; importes de escritura/facturas,
 * no una base fiscal ni un derecho a deducción declarado por el usuario. */
export const AdquisicionCompartidaMadrid2025 = Schema.Struct({
  ejercicio: Schema.Literal(2025),
  contribuyente: Id,
  viviendaId: Texto,
  adquisicion: Texto,
  modalidad: Schema.Literal("compraventa-terminada"),
  escritura: Texto,
  regimen: Schema.Literal("separacion-bienes"),
  soporteRegimen: Texto,
  regimenDesde: Texto,
  regimenHasta: Schema.Literal("2025-12-31"),
  titularesCompletos: Schema.Literal(true),
  titularidadHasta: Schema.Literal("2025-12-31"),
  titulares: Schema.Array(Schema.Struct({
    id: Id,
    porcentaje: Texto,
    precioAdquiridoEUR: Texto,
    gastosAtribuidosEUR: Texto,
    tributosAtribuidosEUR: Texto,
    soporte: Texto,
  })).check(Schema.isLengthBetween(2, 2)),
})

export type AdquisicionCompartidaMadrid2025 = typeof AdquisicionCompartidaMadrid2025.Type
