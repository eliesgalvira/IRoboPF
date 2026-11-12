import { Schema } from "effect"
import { PagadoresMurcia2025 } from "./murcia-pagadores"
const Periodo = Schema.Struct({ desde: Schema.String, hasta: Schema.String })
export const AuxiliaresAnualesF = Schema.Struct({
  pagadoresMurcia: Schema.optionalKey(PagadoresMurcia2025),
  // Hechos civiles y pagos físicos; el derecho se calcula con PagadoresMurcia2025.
  ganancialesMurcia: Schema.optionalKey(Schema.Struct({
    referencia: Schema.String,
    conyuges: Schema.Array(Schema.String),
    matrimonio: Schema.Struct({ fecha: Schema.String, soporte: Schema.String }),
    estadoCivil: Schema.Literal("casados_no_separados_legalmente"),
    censoCivil: Schema.Literal("sin_cambios_2025"),
    regimen: Schema.Struct({ desde: Schema.String, hasta: Schema.String, soporte: Schema.String }),
    fondo: Schema.Literal("comun_ganancial"),
    pagosComunes: Schema.Array(Schema.Struct({ pagoId: Schema.String, movimientoId: Schema.String, soportePago: Schema.String })),
  })),
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
