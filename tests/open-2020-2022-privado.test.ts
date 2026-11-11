import { createHash } from "node:crypto"
// Lectura síncrona de bytes CAS para integridad de esta prueba privada; no servicio fiscal.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import { Config, Effect, Schema } from "effect"
import { describe, it, expect } from "vitest"
import refs from "./fixtures/open-2020-2022-referencias.json"
import { CasoFiscalAnualExplicito } from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import { Checks, contrastar } from "./open-2020-2022.casos"

const Receipt = Schema.Struct({ validation: Schema.Struct({ checks: Checks }) })
const Batch = Schema.Struct({
  caseHashes: Schema.Array(Schema.String),
  results: Schema.Array(Schema.Struct({ entradaEfectiva: CasoFiscalAnualExplicito })),
})
const read = (ref: { readonly path: string; readonly sha256: string; readonly bytes: number }) => {
  const bytes = readFileSync(ref.path)
  expect(bytes.byteLength).toBe(ref.bytes)
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(ref.sha256)
  return bytes.toString("utf8")
}
const privado = Effect.runSync(Config.string("IROBOPF_OPEN2020_PRIVATE").pipe(Config.withDefault("")).asEffect())
describe.skipIf(privado !== "1")("180 originales + seis nuevos externos", () => {
  it("mantiene identidades, PRE, ausencias y reservas sin sumar pilotos", () => {
    expect(new Set(refs.cases.map(c => `${c.year}/${c.caseHash}`)).size).toBe(186)
    for (const year of [2020, 2021, 2022]) {
      expect(refs.cases.filter(c => c.year === year && c.group === "PRE60")).toHaveLength(60)
      expect(refs.cases.filter(c => c.year === year && c.PRE?.state === "discrepante")).toHaveLength(5)
      expect(refs.cases.filter(c => c.year === year && c.group === "nuevo-separado")).toHaveLength(2)
    }
  })
  for (const c of refs.cases) it(`${c.year}/${c.id}: todas las casillas acreditadas`, () => {
    const receipt = Schema.decodeUnknownSync(Schema.fromJsonString(Receipt))(read(c.receipt))
    let entrada: CasoFiscalAnualExplicito
    if (c.batch !== null && c.index !== null) {
      const batch = Schema.decodeUnknownSync(Schema.fromJsonString(Batch))(read(c.batch))
      expect(batch.caseHashes[c.index]).toBe(c.caseHash)
      const row = batch.results[c.index]
      if (row === undefined) throw new Error(`Índice original ausente: ${c.id}`)
      entrada = row.entradaEfectiva
    } else { entrada = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input) }
    contrastar(entrada, receipt.validation.checks, `${c.year}/${c.id}`)
  })
})
