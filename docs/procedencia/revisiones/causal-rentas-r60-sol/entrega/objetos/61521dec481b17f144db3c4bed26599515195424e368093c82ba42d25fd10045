import fs from "node:fs"
import zlib from "node:zlib"
import { createHash } from "node:crypto"
import { composeRentasR36 } from "./flujo-rentas-r36.mjs"
const dest = "docs/procedencia/implementaciones/flujo-rentas-r36-sol/"
const sha = (b) => createHash("sha256").update(b).digest("hex")
export function historicalControls(fragment) {
  const oldPath =
    "docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/instancias.json"
  const old = JSON.parse(fs.readFileSync(oldPath, "utf8"))
  const cases = fragment.stages.map((s, i) => ({
    id: "ARG4-" + i,
    expected: s.argument4,
    received: old[i].argument4,
    pass:
      old[i].argument4.start === s.argument4.start &&
      old[i].argument4.end === s.argument4.end,
  }))
  const paths = [
    "docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/pruebas.json",
    "docs/procedencia/revisiones/flujo-rentas-actividad-r25-sol/hallazgos.json",
    "docs/procedencia/correcciones/flujos-r28/antes.json",
    "docs/procedencia/correcciones/flujos-r28/rectificaciones.json",
    "docs/procedencia/revisiones/flujos-rectificaciones-r28-sol/casos.json",
  ]
  return {
    kind: "históricos inmutables; seis rojos de rango R25 reproducidos contra fuente actual; R28 conserva su fase roja",
    original: { path: oldPath, sha256: sha(fs.readFileSync(oldPath)) },
    cases,
    received: paths.map((path) => ({
      path,
      sha256: sha(fs.readFileSync(path)),
    })),
    acceptance: false,
  }
}
// Schema cerrado de la gramática: formas inferidas, semántica comprobada por correspondencias.
// No convierte igualdad de receta en suficiencia causal.
function form(xs) {
  const types = [
    ...new Set(
      xs.map((x) =>
        x === null
          ? "null"
          : Array.isArray(x)
            ? "array"
            : Object(x) === x
              ? "object"
              : String(x) === x
                ? "string"
                : x === true || x === false
                  ? "boolean"
                  : "number"
      )
    ),
  ]
  if (types.length > 1)
    return {
      anyOf: types.map((t) =>
        form(
          xs.filter(
            (x) =>
              (x === null
                ? "null"
                : Array.isArray(x)
                  ? "array"
                  : Object(x) === x
                    ? "object"
                    : String(x) === x
                      ? "string"
                      : x === true || x === false
                        ? "boolean"
                        : "number") === t
          )
        )
      ),
    }
  const type = types[0]
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
    const all = xs.flat()
    return { type, items: all.length ? form(all) : {} }
  }
  return { type }
}
export function writeControls() {
  const f = composeRentasR36()
  fs.writeFileSync(
    dest + "historicos-rojos.json",
    JSON.stringify(historicalControls(f), null, 2)
  )
  const schema = form([f])
  schema.$schema = "https://json-schema.org/draft/2020-12/schema"
  schema.$id = "urn:irobopf:flujo:rentas-r36:1"
  schema.properties.version = { const: 1 }
  schema.properties.kind = { const: "rentas-actividad-r36" }
  schema.properties.base = { const: f.base }
  schema.properties.completeRuleAcceptance = { const: false }
  schema.properties.wiringAllowed = { const: false }
  schema.properties.program.items = {
    oneOf: [...new Set(f.program.map((n) => n.op))].map((op) => {
      const s = form(f.program.filter((n) => n.op === op))
      s.properties.op = { const: op }
      return s
    }),
  }
  for (const collection of ["outputs", "stages"])
    schema.properties[collection].items.properties.unit = { const: "EUR" }
  fs.mkdirSync("schemas/procedencia/flujo", { recursive: true })
  fs.writeFileSync(
    "schemas/procedencia/flujo/rentas-r36.schema.json",
    JSON.stringify(schema, null, 2) + "\n"
  )
  fs.writeFileSync(dest + "fragmento.json.gz", zlib.gzipSync(JSON.stringify(f)))
  return {
    historicalFailures: historicalControls(f).cases.filter((c) => !c.pass)
      .length,
    program: f.program.length,
  }
}
