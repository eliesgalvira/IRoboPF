import { requireRetExecutable as requireExecutable } from "./evidencia-causal-r57-contratos.ts";
import { createHash, randomUUID } from "node:crypto";
// Lectura síncrona de identidad en herramienta documental fuera de Effect.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs";
import { executeFiniteCausal } from "./evidencia-causal-r57.ts";
import type { SSFragment } from "./evidencia-causal-r57.ts";
import { causalSlice } from "./evidencia-ejecucion-r54.ts";
import type { ExecutionEvidence } from "./evidencia-ejecucion-r54.ts";
export interface AnnualInput {
  anio?: number;
  retencionTrabajoAeat?:
    | import("../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat").CasoRetencionTrabajo
    | undefined;
  pagosACuentaCentimos?: number;
  retencionesSoportadasCentimos?: number;
}
export interface ContextInput {
  modo: string;
}
export interface RetFragment {
  program: SSFragment["program"];
  sources: SSFragment["sources"];
  globalBindings: SSFragment["globalBindings"];
  annualBindings: SSFragment["annualBindings"];
  outputBindings: { siteId: string; expression: string; unit: string }[];
  fieldBindings: { property: string; unit: string; reads: string[] }[];
  scaleCells: { id: string; valueNode: string; unit: string }[];
  obligations: { status: string }[];
}
const digest = <T>(x: T) =>
  createHash("sha256").update(JSON.stringify(x)).digest("hex");
/** Entradas ordinarias y coherentes ya admitidas externamente; no se certifica esa admisión. */
export function executeCausalRetenciones(
  g: RetFragment,
  caso: AnnualInput,
  contexto: ContextInput,
  execution: string = randomUUID(),
) {
  return executeFiniteCausal(g, caso, contexto, execution, {
    kind: "causal-retenciones-r57",
  });
}
/** Comprueba relaciones locales y estructura completa; identidad exacta y operaciones
 * adicionales dependen del replay compartido, no de igualdad de importes. */
export function verifyCausalRetenciones(
  g: RetFragment,
  e: ExecutionEvidence,
  caso: AnnualInput,
  contexto: ContextInput,
  execution: string,
): true {
  requireExecutable(g);
  const reject = (why: string): never => {
    throw Error("Evidencia insuficiente: " + why);
  };
  const closed = <T>(value: T, keys: string[]): void => {
    if (
      value === null ||
      Object.keys(Object(value)).sort().join() !== [...keys].sort().join()
    )
      reject("schema cerrado: claves");
  };
  closed(e, [
    "version",
    "kind",
    "execution",
    "program",
    "software",
    "sources",
    "input",
    "context",
    "frames",
    "events",
    "annualBindings",
    "outputs",
    "admissionClosed",
    "siteClosed",
    "wiringAllowed",
    "completeRuleAcceptance",
  ]);
  for (const v of e.frames) closed(v, ["id", "parent", "call", "function"]);
  for (const v of [...e.sources, ...e.software]) closed(v, ["file", "sha256"]);
  for (const v of e.annualBindings) closed(v, ["name", "producer", "frame"]);
  for (const v of e.outputs)
    closed(v, ["siteId", "decimal", "display", "root", "slice"]);
  for (const v of e.events) {
    closed(v, [
      "id",
      "frame",
      "node",
      "operation",
      "property",
      "unit",
      "value",
      "edges",
    ]);
    for (const edge of v.edges) closed(edge, ["role", "to"]);
  }
  if (
    e.kind !== "causal-retenciones-r57" ||
    e.version !== 2 ||
    e.execution !== execution ||
    e.program !== digest(g)
  )
    reject("dominio/versión/ejecución/programa");
  if (
    digest(e.input) !== digest(caso) ||
    digest(e.context) !== digest(contexto)
  )
    reject("entrada/contexto");
  if (
    e.admissionClosed !== false ||
    e.siteClosed !== false ||
    e.wiringAllowed !== false ||
    e.completeRuleAcceptance !== false
  )
    reject("puertas");
  const frames = new Map(e.frames.map((f) => [f.id, f])),
    nodes = new Map(g.program.map((n) => [n.id, n])),
    events = new Map<string, ExecutionEvidence["events"][number]>();
  if (frames.size !== e.frames.length) reject("frames duplicados");
  for (const [i, v] of e.events.entries()) {
    if (
      v.id !== execution + ":" + i ||
      !frames.has(v.frame) ||
      (v.node !== null && !nodes.has(v.node))
    )
      reject("identidad/frame/nodo");
    for (const edge of v.edges)
      if (!events.has(edge.to)) reject("referencia ausente/futura");
    const value = v.edges.find((x) => x.role === "value");
    if (
      value !== undefined &&
      JSON.stringify(events.get(value.to)?.value) !== JSON.stringify(v.value)
    )
      reject("alias sin productor");
    if (v.operation === "array-selection") {
      const receiver = v.edges.filter((x) => x.role === "identity:receiver"),
        members = v.edges.filter((x) => x.role.startsWith("identity:element:"));
      const input = events.get(receiver[0]?.to ?? "")?.value;
      if (
        receiver.length !== 1 ||
        !Array.isArray(input) ||
        members.length !== input.length ||
        v.value !== input.length
      )
        reject("estructura colección");
      if (!Array.isArray(input)) return reject("receptor no array");
      for (const [i, m] of members.entries())
        if (
          m.role !== "identity:element:" + i ||
          JSON.stringify(events.get(m.to)?.value) !== JSON.stringify(input[i])
        )
          reject("miembro/orden");
    }
    events.set(v.id, v);
  }
  for (const f of frames.values())
    if (
      (f.parent !== null && !frames.has(f.parent)) ||
      (f.call !== null && !nodes.has(f.call))
    )
      reject("marco/llamada");
  for (const source of g.sources)
    if (
      createHash("sha256").update(readFileSync(source.file)).digest("hex") !==
      source.sha256
    )
      reject("fuente");
  if (e.annualBindings.length !== 3) reject("fases");
  for (const b of g.annualBindings)
    if (
      !e.annualBindings.some(
        (x) =>
          x.name === b.name &&
          events.get(x.producer)?.operation === "annual-binding",
      )
    )
      reject("binding");
  for (const o of e.outputs) {
    const root = events.get(o.root);
    if (
      !g.outputBindings.some((b) => b.siteId === o.siteId) ||
      root?.operation !== "transport" ||
      root.property !== o.siteId ||
      root.value !== o.decimal
    )
      reject("salida/transporte");
    if (
      JSON.stringify(causalSlice(e.events, o.root)) !== JSON.stringify(o.slice)
    )
      reject("slice");
  }
  const replay = executeCausalRetenciones(
    g,
    caso,
    contexto,
    execution,
  ).evidence;
  if (digest(replay) !== digest(e))
    reject("relaciones/propiedad/unidades/fuente/selección no reproducidas");
  return true;
}
