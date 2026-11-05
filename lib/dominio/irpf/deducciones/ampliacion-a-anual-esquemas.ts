import { Schema } from "effect"
import * as AND from "./lote-a-ampliacion-2025/andalucia"
import * as ARA from "./lote-a-ampliacion-2025/aragon"
import * as CAT from "./lote-a-ampliacion-2025/catalunya"
import { Texto } from "./lote-a-ampliacion-2025/comun"
const AND0 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S0.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S0.fields.hechos,
})
const AND1 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S1.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S1.fields.hechos,
})
const AND2 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S2.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S2.fields.hechos,
})
const AND3 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S3.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S3.fields.hechos,
})
const AND4 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S4.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S4.fields.hechos,
})
const AND5 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S5.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S5.fields.hechos,
})
const AND6 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S6.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    adopciones: Schema.Array(
      Schema.Struct({
        persona: Texto,
        inscripcionCivil: Texto,
        normaConvenio: Texto,
        asiento: Texto,
        titulares: Schema.Array(Texto),
      })
    ),
  }),
})
const AND7 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S7.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    familia: AND.S7.fields.hechos.fields.familia,
    posicion: AND.S7.fields.hechos.fields.posicion,
  }),
})
const AND8 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S8.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S8.fields.hechos,
})
const AND9 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S9.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S9.fields.hechos,
})
const AND10 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S10.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S10.fields.hechos,
})
const AND11 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S11.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S11.fields.hechos,
})
const AND12 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S12.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    titularTGSS: AND.S12.fields.hechos.fields.titularTGSS,
    afiliacionAndalucia: AND.S12.fields.hechos.fields.afiliacionAndalucia,
    viviendaHabitual: AND.S12.fields.hechos.fields.viviendaHabitual,
    personaPareja: AND.S12.fields.hechos.fields.personaPareja,
    vinculoPareja: AND.S12.fields.hechos.fields.vinculoPareja,
    registroPareja: AND.S12.fields.hechos.fields.registroPareja,
    nacimientoPareja: AND.S12.fields.hechos.fields.nacimientoPareja,
    hijos: AND.S12.fields.hechos.fields.hijos,
    empleado: AND.S12.fields.hechos.fields.empleado,
    cuotas: AND.S12.fields.hechos.fields.cuotas,
    eleccionBeneficiario: AND.S12.fields.hechos.fields.eleccionBeneficiario,
  }),
})
const AND13 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S13.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S13.fields.hechos,
})
const AND14 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S14.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S14.fields.hechos,
})
const AND15 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: AND.S15.fields.codigo,
  nacimiento: Texto,
  hechos: AND.S15.fields.hechos,
})
const ARA0 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S0.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S0.fields.hechos,
})
const ARA1 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S1.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S1.fields.hechos,
})
const ARA2 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S2.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S2.fields.hechos,
})
const ARA3 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S3.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S3.fields.hechos,
})
const ARA4 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S4.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S4.fields.hechos,
})
const ARA5 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S5.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S5.fields.hechos,
})
const ARA6 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S6.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S6.fields.hechos,
})
const ARA7 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S7.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S7.fields.hechos,
})
const ARA8 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S8.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Record(Schema.String, Schema.Never),
})
const ARA9 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S9.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S9.fields.hechos,
})
const ARA10 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S10.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    fiscalidad: ARA.S10.fields.hechos.fields.fiscalidad,
    dependientes: Schema.Array(
      Schema.Struct({
        persona: Texto,
        nacimiento: Texto,
        vinculo: Schema.Literals(["ascendiente", "descendiente"]),
        gradoDiscapacidad: Schema.Number,
        resolucion: Texto,
        cuidadores: Schema.Array(
          Schema.Struct({
            id: Texto,
            gradoParentesco: Schema.Number,
            diasConvivencia: Schema.Number,
            referencia: Texto,
          })
        ),
      })
    ),
  }),
})
const ARA11 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S11.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    donaciones: ARA.S11.fields.hechos.fields.donaciones,
  }),
})
const ARA12 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S12.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S12.fields.hechos,
})
const ARA13 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S13.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S13.fields.hechos,
})
const ARA14 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S14.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S14.fields.hechos,
})
const ARA15 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S15.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S15.fields.hechos,
})
const ARA16 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: ARA.S16.fields.codigo,
  nacimiento: Texto,
  hechos: ARA.S16.fields.hechos,
})
const CAT0 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S0.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S0.fields.hechos,
})
const CAT1 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S1.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S1.fields.hechos,
})
const CAT2 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S2.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S2.fields.hechos,
})
const CAT3 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S3.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S3.fields.hechos,
})
const CAT4 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S4.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S4.fields.hechos,
})
const CAT5 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S5.fields.codigo,
  nacimiento: Texto,
  hechos: CAT.S5.fields.hechos,
})
const CAT6 = Schema.Struct({
  lote: Schema.Literal("A40"),
  codigo: CAT.S6.fields.codigo,
  nacimiento: Texto,
  hechos: Schema.Struct({
    altaAutonomo2025: CAT.S6.fields.hechos.fields.altaAutonomo2025,
    otrasCausasObligacion: CAT.S6.fields.hechos.fields.otrasCausasObligacion,
  }),
})
export const SolicitudAmpliacionAnualA2025 = Schema.Union([
  AND0,
  AND1,
  AND2,
  AND3,
  AND4,
  AND5,
  AND6,
  AND7,
  AND8,
  AND9,
  AND10,
  AND11,
  AND12,
  AND13,
  AND14,
  AND15,
  ARA0,
  ARA1,
  ARA2,
  ARA3,
  ARA4,
  ARA5,
  ARA6,
  ARA7,
  ARA8,
  ARA9,
  ARA10,
  ARA11,
  ARA12,
  ARA13,
  ARA14,
  ARA15,
  ARA16,
  CAT0,
  CAT1,
  CAT2,
  CAT3,
  CAT4,
  CAT5,
  CAT6,
])
export type SolicitudAmpliacionAnualA2025 =
  typeof SolicitudAmpliacionAnualA2025.Type
