import { Schema } from "effect"
const Periodo = Schema.Struct({ desde: Schema.String, hasta: Schema.String })
export const AuxiliaresAnualesF = Schema.Struct({
  referenciaCenso: Schema.String,
  censo: Schema.Literal("completo_eventos_pagos_ayudas_todos_progenitores"),
  conservacionFacturas: Schema.Literal("plazo_prescripcion"),
  estadoCivil: Schema.Literals(["no_casado", "casado"]),
  regimenPagos: Schema.Literals(["separados", "gananciales"]),
  miembrosUnidad: Schema.Array(Schema.String),
  progenitores: Schema.Array(Schema.Struct({
    hijo: Schema.String, convivientesDevengo: Schema.Array(Schema.String), referencia: Schema.String,
  })),
  eventos: Schema.Array(Schema.Struct({
    id: Schema.String, tipo: Schema.Literals(["nacimiento", "adopcion", "acogimiento"]),
    fecha: Schema.String, hijos: Schema.Array(Schema.String), referencia: Schema.String,
  })),
  centros: Schema.Array(Schema.Struct({
    id: Schema.String, autorizacion: Schema.String, inscripcion: Schema.String,
    primerCiclo: Schema.Array(Periodo),
  })),
  servicios: Schema.Array(Schema.Struct({ pagoId: Schema.String, periodo: Periodo })),
})
