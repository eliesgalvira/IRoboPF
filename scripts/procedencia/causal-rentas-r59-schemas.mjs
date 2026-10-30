import fs from "node:fs"
import { composeCausalRentas } from "./causal-rentas-r59-contratos.mjs"
// Forma JSON cerrada inferida del protocolo; la aceptación semántica exige replay.
function form(xs) {
  const kind = (x) =>
    x === null
      ? "null"
      : Array.isArray(x)
        ? "array"
        : Object(x) === x
          ? "object"
          : [true, false].includes(x)
            ? "boolean"
            : String(x) === x
              ? "string"
              : "number"
  const kinds = [...new Set(xs.map(kind))]
  if (kinds.length > 1)
    return { anyOf: kinds.map((k) => form(xs.filter((x) => kind(x) === k))) }
  const type = kinds[0]
  if (type === "object") {
    const keys = [...new Set(xs.flatMap(Object.keys))]
    return {
      type,
      additionalProperties: false,
      required: keys.filter((k) => xs.every((x) => Object.hasOwn(x, k))),
      properties: Object.fromEntries(
        keys.map((k) => [
          k,
          form(xs.filter((x) => Object.hasOwn(x, k)).map((x) => x[k])),
        ])
      ),
    }
  }
  if (type === "array") {
    const flat = xs.flat()
    return { type, items: flat.length ? form(flat) : {} }
  }
  return { type }
}
export function writeRentasSchemas(evidence) {
  const g = composeCausalRentas(),
    contract = form([g])
  const execution = form(evidence)
  // Los valores transportan datos JSON ordinarios, no solo los campos de una
  // muestra. El contrato de operaciones y el replay verifican su significado.
  execution.$defs = {
    value: {
      anyOf: [
        { type: "null" },
        { type: "boolean" },
        { type: "number" },
        { type: "string" },
        { type: "array", items: { $ref: "#/$defs/value" } },
        { type: "object", additionalProperties: { $ref: "#/$defs/value" } },
      ],
    },
  }
  execution.properties.events.items.properties.value = { $ref: "#/$defs/value" }
  for (const s of [contract, execution]) {
    s.$schema = "https://json-schema.org/draft/2020-12/schema"
    s.properties.kind = { const: "causal-rentas-r59" }
    s.properties.version = { const: 3 }
    for (const k of [
      "admissionClosed",
      "siteClosed",
      "wiringAllowed",
      "completeRuleAcceptance",
    ])
      s.properties[k] = { const: false }
  }
  contract.$id = "urn:irobopf:causal-rentas-r59:3"
  execution.$id = "urn:irobopf:ejecucion-r59:3"
  // Las entradas se comparan completas con las preadmitidas; no se fija un único fixture.
  execution.properties.input = { type: "object" }
  execution.properties.context = { type: "object" }
  fs.writeFileSync(
    "schemas/procedencia/flujo/causal-rentas-r59.json",
    JSON.stringify(contract, null, 2) + "\n"
  )
  fs.writeFileSync(
    "schemas/procedencia/flujo/ejecucion-r59.json",
    JSON.stringify(execution, null, 2) + "\n"
  )
}
