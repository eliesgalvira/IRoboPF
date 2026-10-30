import { requireExecutableSS } from "./evidencia-causal-r57-contratos.ts"
import { executeFiniteCausal } from "./evidencia-causal-r57.ts"
import { createRequire } from "node:module"
import { createHash, randomUUID } from "node:crypto"
// Herramienta documental síncrona fuera de un programa Effect: lee los bytes fijados para verificar su identidad.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs"
import { causalSlice } from "./evidencia-ejecucion-r54.ts"
import type {
  Event,
  ExecutionEvidence,
} from "./evidencia-ejecucion-r54.ts"
export interface SSCase {
  anio: number
  rendimientos: { trabajo: readonly { importeIntegroCentimos: number }[] }
}
export interface SSContext {
  modo: string
}
interface CausalResult {
  lines: Value["raw"][]
  evidence: ExecutionEvidence
}
type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue }
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const { Schema }: typeof import("effect") = require("effect")
const text = Schema.is(Schema.String)
interface Pattern {
  name?: string
  fields?: { key: string; binding: Pattern }[]
}
interface Node {
  id: string
  op: string
  args: string[]
  data: {
    name?: string
    value?: unknown
    key?: string
    optional?: boolean
    operator?: string
    fallback?: boolean
    parameters?: { binding: Pattern; rest: boolean; default: string | null }[]
    binding?: Pattern
    strings?: string[]
    pattern?: string
    flags?: string
  }
  source: { file: string; start: number; end: number; sha256: string }
}
export interface SSFragment {
  pending: readonly string[]
  obligations: readonly { status: string }[]
  program: Node[]
  globalBindings: { name: string; node: string }[]
  annualBindings: { name: string; node: string }[]
  outputBindings: { siteId: string; node: string }[]
  sources: { file: string; sha256: string }[]
  fieldUnits: { id: string; unit: string }[]
  literalUnits: { id: string; unit: string }[]
}
interface Closure {
  body: string
  parameters: NonNullable<Node["data"]["parameters"]>
  env: Map<string, Value>
  node: string
}
interface Value {
  unit: string
  raw: unknown
  ref: string
  props: Map<string, Value>
  closure?: Closure | undefined
  native?: string | undefined
  state?: { input: Value; result?: Value; selections: Value[] } | undefined
}
const digest = (
  v: SSFragment | ExecutionEvidence | SSCase | SSContext | string[],
) => createHash("sha256").update(JSON.stringify(v)).digest("hex")
function must<T>(v: T | undefined, message = "Operando ausente"): T {
  if (v === undefined) throw Error(message)
  return v
}
const binary = (op: string, a: Value["raw"], b: Value["raw"]): JSONValue => {
  switch (op) {
    case "===":
      return a === b
    case "!==":
      return a !== b
    case "+":
      if (text(a) || text(b)) return String(a) + String(b)
      return Number(a) + Number(b)
    case "-":
      return Number(a) - Number(b)
    case "*":
      return Number(a) * Number(b)
    case "/":
      return Number(a) / Number(b)
    case "%":
      return Number(a) % Number(b)
    case ">=":
      return Number(a) >= Number(b)
    case "<=":
      return Number(a) <= Number(b)
    case ">":
      return Number(a) > Number(b)
    case "<":
      return Number(a) < Number(b)
    default:
      throw Error("Operador no admitido: " + op)
  }
}
/** Única evaluación anual: mismo entorno entre fases y salidas. No ejecuta TS del motor. */
export function executeCausalSS(
  g: SSFragment,
  caso: SSCase,
  contexto: SSContext,
  execution: string = randomUUID(),
): CausalResult {
  return executeFiniteCausal(g, caso, contexto, execution, {kind:"causal-ss-r54"})
}

/** Consumo condicionado: referencias utilizadas, obligaciones por propiedad y replay de IR fijada.
 * La igualdad con el replay es integridad operacional; las obligaciones y pruebas externas
 * son las que delimitan suficiencia. No es una prueba universal ni autenticación. */
export function verifyCausalSS(
  g: SSFragment,
  evidence: ExecutionEvidence,
  caso: SSCase,
  contexto: SSContext,
  execution: string,
): true {
  requireExecutableSS(g)
  const reject: (message: string) => never = (message) => {
    throw Error("Evidencia insuficiente: " + message)
  }
  if (
    evidence.version !== 1 ||
    evidence.kind !== "causal-ss-r54" ||
    evidence.execution !== execution ||
    evidence.program !== digest(g)
  )
    reject("protocolo/programa/ejecución")
  if (
    JSON.stringify(evidence.input) !== JSON.stringify(caso) ||
    JSON.stringify(evidence.context) !== JSON.stringify(contexto)
  )
    reject("entrada/contexto")
  if (
    evidence.admissionClosed !== false ||
    evidence.siteClosed !== false ||
    evidence.wiringAllowed !== false ||
    evidence.completeRuleAcceptance !== false
  )
    reject("promoción")
  for (const source of g.sources)
    if (
      createHash("sha256").update(readFileSync(source.file)).digest("hex") !==
      source.sha256
    )
      reject("fuente")
  const nodes = new Map(g.program.map((n) => [n.id, n])),
    ids = new Map<string, Event>(),
    frames = new Map(evidence.frames.map((f) => [f.id, f]))
  if (frames.size !== evidence.frames.length) reject("frames duplicados")
  for (const [i, e] of evidence.events.entries()) {
    if (
      e.id !== execution + ":" + i ||
      ids.has(e.id) ||
      !frames.has(e.frame) ||
      (e.node !== null && !nodes.has(e.node))
    )
      reject("identidad/frame/nodo")
    for (const edge of e.edges)
      if (!ids.has(edge.to)) reject("referencia hacia futuro o ausente")
    if (e.operation === "collection-selection") {
      const receivers = e.edges.filter(x => x.role === "identity:receiver")
      const receiver = ids.get(receivers[0]?.to ?? "")
      if (receivers.length !== 1 || receiver === undefined || !Array.isArray(receiver.value))
        reject("receptor estructural de colección")
      const elements = e.edges.filter(x => x.role.startsWith("identity:element:"))
      const values = must(receiver).value
      if (!Array.isArray(values)) reject("colección no ordinaria")
      if (e.value !== values.length || elements.length !== values.length ||
          e.edges.filter(x => x.role === "seed").length !== 1 ||
          e.edges.filter(x => x.role === "callback").length !== 1)
        reject("cardinalidad/semilla/callback de colección")
      for (const [i, element] of elements.entries())
        if (element.role !== "identity:element:" + i ||
            JSON.stringify(ids.get(element.to)?.value) !== JSON.stringify(values[i]))
          reject("orden/elemento de colección")
    }
    const valueEdge = e.edges.find((x) => x.role === "value")
    const aliasOperations = [
      "property",
      "local",
      "global",
      "binding",
      "capture",
      "default",
      "return",
      "function-return",
      "call-return",
      "annual-binding",
      "transport",
      "branch-return",
      "short-return",
      "match-return",
      "tag-return",
      "instrumentation-return",
      "reduce-step",
      "reduce-return",
      "property-definition",
      "parameter:0",
      "parameter:1",
      "parameter:2",
    ]
    if (aliasOperations.includes(e.operation)) {
      if (
        valueEdge === undefined ||
        JSON.stringify(ids.get(valueEdge.to)?.value) !== JSON.stringify(e.value)
      )
        reject("valor sin productor por propiedad")
    }
    if (e.operation === "binary") {
      const left = e.edges.find((x) => x.role === "left"),
        right = e.edges.find((x) => x.role === "right")
      if (left === undefined || right === undefined) reject("argumento binario ausente")
      const op = nodes.get(e.node ?? "")?.data.operator
      if (
        op === undefined || op === "" ||
        JSON.stringify(
          binary(
            op,
            ids.get(must(left).to)?.value,
            ids.get(must(right).to)?.value,
          ),
        ) !== JSON.stringify(e.value)
      )
        reject("semántica binaria")
    }
    if (e.operation === "branch") {
      const p = e.edges.find((x) => x.role === "predicate")
      if (p === undefined || e.value !== (Boolean(ids.get(p.to)?.value) ? 1 : 2))
        reject("predicado de rama")
    }
    ids.set(e.id, e)
  }
  for (const frame of frames.values())
    if (
      (frame.parent !== null && !frames.has(frame.parent)) ||
      (frame.call !== null && !nodes.has(frame.call))
    )
      reject("frame/llamada")
  if (
    evidence.annualBindings.length !== 2 ||
    evidence.outputs.length !== g.outputBindings.length
  )
    reject("fases/salidas")
  for (const b of g.annualBindings)
    if (
      !evidence.annualBindings.some(
        (x) =>
          x.name === b.name &&
          ids.get(x.producer)?.operation === "annual-binding",
      )
    )
      reject("productor anual")
  for (const binding of g.outputBindings) {
    const output = evidence.outputs.find((x) => x.siteId === binding.siteId)
    if (output === undefined) reject("sitio ausente")
    const o = must(output),
      root = ids.get(o.root)
    if (
      root?.operation !== "transport" ||
      root.property !== binding.siteId ||
      root.value !== o.decimal
    )
      reject("transporte decimal")
    const slice = causalSlice(evidence.events, o.root)
    if (digest(slice) !== digest(o.slice)) reject("slice no derivado")
    const events = slice.map((id) => must(ids.get(id)))
    if (
      !events.some(
        (e) =>
          e.operation === "annual-binding" &&
          e.property.startsWith("cotizacionesSociales/"),
      )
    )
      reject("binding cotizaciones por propiedad")
    if (
      !events.some(
        (e) => e.operation === "input" && e.property === "contexto/modo",
      )
    )
      reject("selector modo")
    if (
      !events.some((e) => e.operation === "input" && e.property === "caso/anio")
    )
      reject("selector año")
    if (
      !(
        binding.siteId.includes("solidaridad-") &&
        contexto.modo === "compatible-legacy"
      ) &&
      !events.some((e) => e.operation === "reduce-return")
    )
      reject("selección/semilla trabajo")
    for (const event of events)
      if (
        event.operation === "binary" &&
        (!event.edges.some((x) => x.role === "left") ||
          !event.edges.some((x) => x.role === "right"))
      )
        reject("operandos binarios")
  }
  const replay = executeCausalSS(g, caso, contexto, execution).evidence
  if (digest(evidence) !== digest(replay))
    reject("operación/propiedad/selección/frame no reproducido")
  return true
}
