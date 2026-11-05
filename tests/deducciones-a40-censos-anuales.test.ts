import { Effect, Schema } from "effect"
import { expect, it } from "vitest"
import casos from "./fixtures/a40-censos-anuales-revision.json"
import { DerechosMinimosAnuales } from "../lib/dominio/irpf/minimos/derechos-contrato"
import { SolicitudDeduccionesTerritoriales2025 } from "../lib/dominio/irpf/deducciones/anual-territorial"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import {
  liquidarIrpfAnual,
  liquidarIrpfAnualExplicito,
} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import { racional } from "../lib/dominio/irpf/deducciones/anual-territorial-racional"

// Sólo el formato de estas cuatro entradas congeladas; no es otro contrato público.
const Canonica = Schema.Struct({
  anio: Schema.Literal(2025),
  comunidadAutonoma: Schema.Literals(["andalucia", "aragon"]),
  contribuyenteId: Schema.String,
  situacionFamiliar: Schema.Struct({
    tipo: Schema.Literal("individual"),
    edad: Schema.Number,
    discapacidad: Schema.TaggedStruct("SinDiscapacidad", {}),
    ascendientes: Schema.Array(Schema.Never),
    descendientes: Schema.Array(Schema.Never),
  }),
  rendimientos: Schema.Struct({
    trabajo: Schema.Array(
      Schema.Struct({ importeIntegroCentimos: Schema.Number })
    ),
  }),
  reducciones: Schema.Array(Schema.Never),
  deducciones: Schema.Array(Schema.Never),
  retencionesSoportadasCentimos: Schema.Number,
  pagosACuentaCentimos: Schema.Number,
  derechosMinimos: DerechosMinimosAnuales,
  deduccionesTerritoriales2025: SolicitudDeduccionesTerritoriales2025,
})

for (const caso of casos) {
  const calcular = (entrada: (typeof casos)[number]["entrada"]) =>
    caso.api === "canonica"
      ? Effect.runSync(
          liquidarIrpfAnual(Schema.decodeUnknownSync(Canonica)(entrada), {
            modo: "canonico",
          })
        )
      : Effect.runSync(
          liquidarIrpfAnualExplicito(
            Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(entrada)
          )
        )

  it(`${caso.api} ${caso.hallazgo}: conserva el reparto completo`, () => {
    expect(calcular(caso.completa).deduccionesTerritoriales2025?.total).toEqual(
      racional(caso.esperado)
    )
  })
  it(`${caso.api} ${caso.hallazgo}: rechaza omitir al segundo titular`, () => {
    expect(() => calcular(caso.entrada)).toThrow()
  })
}
