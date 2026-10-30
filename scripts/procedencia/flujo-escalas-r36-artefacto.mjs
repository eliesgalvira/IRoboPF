import fs from "node:fs"
import { gzipSync } from "node:zlib"
import {
  composeEscalasR36,
  verifyEscalasR36,
  dimensionContracts
} from "./flujo-escalas-r36.mjs"
const out = "docs/procedencia/implementaciones/flujo-escalas-r36-sol"
const object = (properties, required = Object.keys(properties)) => ({
  type: "object",
  additionalProperties: false,
  required,
  properties
})
const array = (items) => ({ type: "array", items })
const str = { type: "string" },
  integer = { type: "integer" },
  bool = { type: "boolean" }
const source = object({
  file: str,
  start: integer,
  end: integer,
  sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
  offsetEncoding: { const: "utf16" }
})
const pattern = { $ref: "#/$defs/pattern" }
const fragment = composeEscalasR36()
verifyEscalasR36(fragment)
const ops = [...new Set(fragment.program.map((n) => n.op))].sort()
const data = object(
  {
    name: str,
    key: str,
    optional: bool,
    operator: str,
    value: { type: ["string", "number", "boolean", "null"] },
    parameters: array(
      object({
        binding: pattern,
        rest: bool,
        default: { type: ["string", "null"] }
      })
    ),
    binding: pattern,
    pattern: str,
    flags: str,
    fallback: bool,
    strings: array(str),
    output: bool,
    target: str,
    outputs: array(str),
    review: { const: "pending-independent" },
    unit: str,
    status: str,
    tag: str
  },
  []
)
const fields = object({
  key: str,
  binding: pattern,
  rest: bool,
  default: { type: ["string", "null"] }
})
const schema = object({
  version: { const: 1 },
  kind: { const: "escalas-r36" },
  base: { const: fragment.base },
  dimensionContracts: { const: dimensionContracts },
  dataRoutes: object({
    path: str,
    sha256: str,
    records: array({ type: "object" }),
    authority: str
  }),
  sources: array(object({ file: str, sha256: str })),
  program: array(
    object({ id: str, op: { enum: ops }, args: array(str), data, source })
  ),
  globalBindings: array(object({ name: str, node: str, source })),
  propertyBindings: array(
    object({
      id: str,
      receiver: str,
      property: { type: ["string", "null"] },
      index: { type: ["string", "null"] },
      optional: bool,
      unit: str,
      source
    })
  ),
  callBindings: array(
    object({
      id: str,
      target: str,
      arguments: array(object({ index: integer, operand: str })),
      instance: str,
      condition: str,
      source
    })
  ),
  boundaryContracts: array(
    object({
      id: str,
      outputs: array(str),
      parameters: array(
        object({
          index: integer,
          binding: str,
          type: { type: ["string", "null"] },
          source
        })
      ),
      calls: array(str),
      review: { const: "pending-independent" },
      closure: str
    })
  ),
  outputBindings: array(
    object({
      siteId: { enum: fragment.sites.map((s) => s.siteId) },
      valueNode: str,
      lineNode: str,
      source,
      amount: source,
      unit: { const: "EUR" },
      instance: { enum: ["singleton-0", "callback-index"] },
      condition: {
        enum: ["annual-admission-required", "explicit-admission-required"]
      },
      finalProperty: { const: "origen.decimal" }
    })
  ),
  sites: array(
    object({
      siteId: { enum: fragment.sites.map((s) => s.siteId) },
      unit: { const: "EUR" },
      valueClosed: { const: false },
      selectionClosed: { const: false },
      siteClosed: { const: false },
      closure: str
    })
  ),
  admissionObligations: array(
    object({
      id: str,
      route: { enum: ["annual", "explicit", "rights"] },
      source,
      expression: str,
      status: { const: "pending-review" },
      contractRequired: str
    })
  ),
  admissionInterface: { const: fragment.admissionInterface },
  completeRuleAcceptance: { const: false },
  wiringAllowed: { const: false },
  review: { const: "pending-independent" }
})
schema.$schema = "https://json-schema.org/draft/2020-12/schema"
schema.$id = "urn:irobopf:flujo-escalas-r36"
schema.$defs = {
  pattern: {
    oneOf: [
      object({ name: str }),
      object({ elements: array(pattern) }),
      object({ fields: array(fields) })
    ]
  }
}
fs.writeFileSync(
  "schemas/procedencia/flujo/escalas-r36.schema.json",
  JSON.stringify(schema, null, 2) + "\n"
)
fs.writeFileSync(out + "/fragmento.json.gz", gzipSync(JSON.stringify(fragment)))
fs.writeFileSync(
  out + "/contratos-dimensionales.json",
  JSON.stringify(dimensionContracts, null, 2) + "\n"
)
fs.writeFileSync(
  out + "/sitios.json",
  JSON.stringify(
    fragment.outputBindings.map((s) => ({
      ...s,
      status: "evaluable-condicionado",
      requires: [
        "review-independent",
        "admission-reviewed",
        "external-property-contracts-composed"
      ],
      siteClosed: false,
      completeRuleAcceptance: false
    })),
    null,
    2
  ) + "\n"
)
fs.writeFileSync(
  out + "/fronteras.json",
  JSON.stringify(
    {
      contracts: fragment.boundaryContracts,
      calls: fragment.program.filter((n) => n.op === "boundaryCall"),
      admission: fragment.admissionInterface
    },
    null,
    2
  ) + "\n"
)
console.log(
  JSON.stringify({
    operations: fragment.program.length,
    sources: fragment.sources.length,
    sites: fragment.sites.length,
    meaning: "receta candidata, no suficiencia causal ni aceptación fiscal"
  })
)
