import { prepareExplicitos } from "./causal-explicitos-r62-contratos.mjs";
import { decodeEscalasSchema } from "./causal-escalas-r60-schema.mjs";
import { prepareEscalas } from "./causal-escalas-r60-contratos.mjs";
import { prepareRentas } from "./causal-rentas-r59-contratos.mjs";
import {
  prepareRetenciones,
  prepareSS,
} from "./evidencia-causal-r57-contratos.ts";
import type {
  AnnualInput,
  ContextInput,
  RetFragment,
} from "./causal-retenciones-r57.ts";
import { isDeepStrictEqual } from "node:util";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
// Herramienta documental síncrona fuera de un programa Effect: lee los bytes fijados para verificar su identidad.
// @effect-diagnostics effect/nodeBuiltinImport:off
import { readFileSync } from "node:fs";
import { causalSlice } from "./evidencia-ejecucion-r54.ts";
import type {
  Edge,
  Event,
  Frame,
  ExecutionEvidence,
  AnnualBinding,
  Output,
} from "./evidencia-ejecucion-r54.ts";
export interface SSCase {
  anio: number;
  rendimientos: { trabajo: readonly { importeIntegroCentimos: number }[] };
}
export interface SSContext {
  modo: string;
}
export interface CausalResult {
  lines: Value["raw"][];
  evidence: ExecutionEvidence;
}
type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue };
const require = createRequire("/home/elies/Repos/IRoboPF/package.json");
interface DecimalValue {
  toFixed(n?: number): string;
}
interface DecimalAPI {
  new (v: Value["raw"]): DecimalValue;
  clone(options: { precision: number }): DecimalAPI;
  isDecimal(v: unknown): v is DecimalValue;
}
const Decimal: DecimalAPI = require("decimal.js");
const { Schema, DateTime }: typeof import("effect") = require("effect");
const record = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const text = Schema.is(Schema.String),
  number = Schema.is(Schema.Number),
  boolean = Schema.is(Schema.Boolean);
interface Pattern {
  name?: string;
  fields?: {
    key: string;
    binding: Pattern;
    rest?: boolean;
    default?: string | null;
  }[];
  elements?: ({ binding: Pattern; default: string | null } | null)[];
}
interface Node {
  id: string;
  op: string;
  args: string[];
  data: {
    tag?: string;
    schema?: string;
    name?: string;
    value?: unknown;
    key?: string;
    optional?: boolean;
    operator?: string;
    fallback?: boolean;
    parameters?: { binding: Pattern; rest: boolean; default: string | null }[];
    binding?: Pattern;
    strings?: string[];
    pattern?: string;
    flags?: string;
  };
  source: { file: string; start: number; end: number; sha256: string };
}
export interface SSFragment {
  schemaProgram?: SSFragment;
  entryPoints?: { annual: string; explicit: string };
  lineNode?: string;
  functionUnits?: { id: string; unit: string }[];
  pending: readonly string[];
  obligations: readonly { status: string }[];
  program: Node[];
  globalBindings: { name: string; node: string }[];
  annualBindings: { name: string; node: string }[];
  outputBindings: { siteId: string; node: string; unit?: string }[];
  sources: { file: string; sha256: string }[];
  fieldUnits: { id: string; unit: string }[];
  literalUnits: { id: string; unit: string }[];
}
interface Closure {
  body: string;
  parameters: NonNullable<Node["data"]["parameters"]>;
  env: Map<string, Value>;
  node: string;
}
interface Value {
  unit: string;
  raw: unknown;
  ref: string;
  props: Map<string, Value>;
  structure?: Value[] | undefined;
  closure?: Closure | undefined;
  native?: string | undefined;
  decimalClass?: DecimalAPI | undefined;
  state?: { input: Value; result?: Value; selections: Value[] } | undefined;
}
class ReturnValue {
  readonly value: Value;
  constructor(value: Value) {
    this.value = value;
  }
}
const digest = <T>(v: T) =>
  createHash("sha256").update(JSON.stringify(v)).digest("hex");
function shown(v: Value["raw"], internal = false): JSONValue {
  if (internal && v === Infinity) return { infinity: true };
  if (internal && v instanceof RegExp)
    return { regex: v.source, flags: v.flags };
  if (internal && v instanceof Date) return { date: v.toISOString() };
  if (internal && DateTime.isDateTime(v))
    return { dateTime: DateTime.toEpochMillis(v) };
  if (Decimal.isDecimal(v)) return { decimal: v.toFixed() };
  if (v === undefined) return { absent: true };
  if (v === null || text(v) || boolean(v)) return v;
  if (number(v)) {
    if (!Number.isFinite(v)) throw Error("Número no finito");
    return v;
  }
  if (Array.isArray(v)) return v.map((x) => shown(x, internal));
  if (record(v)) {
    if (
      Object.getPrototypeOf(v) !== Object.prototype &&
      Object.getPrototypeOf(v) !== null
    )
      throw Error("Objeto externo no admitido");
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, shown(x, internal)]),
    );
  }
  throw Error("Valor externo no admitido");
}
function must<T>(v: T | undefined, message = "Operando ausente"): T {
  if (v === undefined) throw Error(message);
  return v;
}
const binary = (op: string, a: Value["raw"], b: Value["raw"]): JSONValue => {
  switch (op) {
    case "===":
      return a === b;
    case "!==":
      return a !== b;
    case "+":
      if (text(a) || text(b)) return String(a) + String(b);
      return Number(a) + Number(b);
    case "-":
      return Number(a) - Number(b);
    case "*":
      return Number(a) * Number(b);
    case "/":
      return Number(a) / Number(b);
    case "%":
      return Number(a) % Number(b);
    case ">=":
      return Number(a) >= Number(b);
    case "<=":
      return Number(a) <= Number(b);
    case ">":
      return Number(a) > Number(b);
    case "<":
      return Number(a) < Number(b);
    default:
      throw Error("Operador no admitido: " + op);
  }
};
export interface FiniteOptions {
  kind:
    | "causal-ss-r54"
    | "causal-retenciones-r57"
    | "causal-rentas-r59"
    | "causal-escalas-r60"
    | "causal-explicitos-r62";
}
interface VerifiedOptions extends FiniteOptions {
  software: string[];
}
/** También esta exportación impone fuentes y cierre; el intérprete sin verificar no se exporta. */
export function executeFiniteCausal(
  g: SSFragment | RetFragment,
  caso: SSCase | AnnualInput,
  contexto: ContextInput,
  execution: string,
  options: FiniteOptions,
): CausalResult {
  const extendedGrammar = options.kind === "causal-escalas-r60" || options.kind === "causal-explicitos-r62";
  if (extendedGrammar) {
    const route = "route" in contexto ? contexto.route : "annual";
    contexto = Object.assign({}, contexto, { route: route ?? "annual" });
  }
  let prepared: SSFragment;
  let software: string[];
  if (extendedGrammar) {
    prepared = options.kind === "causal-explicitos-r62" ? prepareExplicitos(g, caso, contexto) : prepareEscalas(g, caso, contexto);
    software = [
      ...(options.kind === "causal-explicitos-r62" ? ["scripts/procedencia/causal-explicitos-r62.mjs", "scripts/procedencia/causal-explicitos-r62-contratos.mjs", "scripts/procedencia/causal-explicitos-r62-ir.mjs"] : []),
      "scripts/procedencia/causal-escalas-r60.mjs",
      "scripts/procedencia/causal-escalas-r60-contratos.mjs",
      "scripts/procedencia/causal-escalas-r60-schema.mjs",
      "scripts/procedencia/causal-rentas-r59-contratos.mjs",
      "scripts/procedencia/flujo-rentas-r36.mjs",
      "scripts/procedencia/flujo-rentas-r36-consumidor.mjs",
      "scripts/procedencia/flujo-retenciones-r34.mjs",
      "scripts/procedencia/flujo-retenciones-r32.mjs",
      "scripts/procedencia/flujo-escalas-r36.mjs",
      "scripts/procedencia/flujo-escalas-r36-consumidor.mjs",
    ];
  } else if (options.kind === "causal-rentas-r59") {
    prepared = prepareRentas(g, caso, contexto);
    software = [
      "scripts/procedencia/causal-rentas-r59-contratos.mjs",
      "scripts/procedencia/causal-rentas-r59.mjs",
      "scripts/procedencia/flujo-rentas-r36.mjs",
      "scripts/procedencia/flujo-rentas-r36-consumidor.mjs",
    ];
  } else if (
    options.kind === "causal-retenciones-r57" &&
    "fieldBindings" in g
  ) {
    prepared = prepareRetenciones(g, caso, contexto);
    software = [
      "scripts/procedencia/causal-retenciones-r57.ts",
      "scripts/procedencia/flujo-retenciones-r34.mjs",
      "scripts/procedencia/flujo-retenciones-r34-consumidor.mjs",
      "scripts/procedencia/flujo-retenciones-r32.mjs",
    ];
  } else if (options.kind === "causal-ss-r54" && "pending" in g) {
    prepared = prepareSS(g, caso, contexto);
    software = [];
  } else throw Error("Evidencia insuficiente: dominio/fragmento sin contrato");
  const result = evaluateVerifiedFinite(
    structuredClone(prepared),
    caso,
    contexto,
    execution,
    { kind: options.kind, software },
  );
  result.evidence.program = digest(g);
  return result;
}
/** Núcleo interno: el adaptador público impone fuentes, obligaciones y dominio antes de llamar. */
function evaluateVerifiedFinite(
  g: SSFragment,
  caso: SSCase | AnnualInput,
  contexto: ContextInput,
  execution: string,
  options: VerifiedOptions,
): CausalResult {
  const extendedGrammar = options.kind === "causal-escalas-r60" || options.kind === "causal-explicitos-r62";
  shown(
    caso,
    options.kind === "causal-rentas-r59" ||
      extendedGrammar,
  );
  shown(contexto);
  const normalizedInput =
    options.kind === "causal-rentas-r59" ||
    extendedGrammar
      ? shown(caso, true)
      : caso;
  if (!record(normalizedInput)) throw Error("Entrada anual no ordinaria");
  const parents = new WeakMap<Map<string, Value>, Map<string, Value>>();
  const locals = new WeakMap<Map<string, Value>, Set<string>>();
  // Solo R62 admite push. La identidad del array sobrevive a sus aliases;
  // los eventos conservan instantáneas y enlazan la última mutación.
  const arrayVersions = new WeakMap<unknown[], string>();
  function mutationEdges(v: Value): Edge[] {
    const ref = Array.isArray(v.raw) ? arrayVersions.get(v.raw) : undefined;
    return ref === undefined ? [] : [{ role: "mutation-state", to: ref }];
  }
  const nodes = new Map(g.program.map((n) => [n.id, n])),
    globals = new Map(g.globalBindings.map((b) => [b.name, b.node])),
    values = new Map<string, Value>();
  const events: Event[] = [],
    frames: Frame[] = [
      { id: execution + ":f0", parent: null, call: null, function: null },
    ];
  let frame = frames[0].id,
    current: string | null = null,
    controls: Value[] = [];
  const units = new Map(
    [...g.fieldUnits, ...g.literalUnits].map((x) => [x.id, x.unit]),
  );
  function emit(
    operation: string,
    raw: Value["raw"],
    edges: Edge[] = [],
    property = "",
    unit = units.get(current ?? "") ?? "structural",
  ): Value {
    const id = execution + ":" + events.length;
    if (
      extendedGrammar &&
      number(raw) &&
      Number.isNaN(raw)
    )
      throw Error(
        "NaN IR: " +
          current +
          " " +
          JSON.stringify(edges.map((e) => events.find((v) => v.id === e.to))),
      );
    events.push({
      id,
      frame,
      node: current,
      operation,
      property,
      unit,
      value:
        options.kind !== "causal-ss-r54" && raw === Infinity
          ? { infinity: true }
          : raw instanceof RegExp
            ? { regex: raw.source, flags: raw.flags }
            : shown(raw, options.kind !== "causal-ss-r54"),
      edges: [
        ...edges,
        ...controls.map((x) => ({ role: "selection", to: x.ref })),
      ],
    });
    return { unit, raw, ref: id, props: new Map() };
  }
  function alias(
    v: Value,
    operation: string,
    extras: Edge[] = [],
    property = "",
  ): Value {
    const out = emit(
      operation,
      v.raw,
      [{ role: "value", to: v.ref }, ...mutationEdges(v), ...extras],
      property,
      v.unit,
    );
    out.structure = v.structure;
    out.closure = v.closure;
    out.native = v.native;
    out.decimalClass = v.decimalClass;
    out.state = v.state;
    if (options.kind === "causal-explicitos-r62" && Array.isArray(v.raw)) {
      out.props = v.props;
      return out;
    }
    for (const [key, child] of v.props)
      out.props.set(
        key,
        alias(
          child,
          operation,
          [...extras, { role: "identity:owner", to: out.ref }],
          property + "/" + key,
        ),
      );
    return out;
  }
  function external(raw: Value["raw"], path: string): Value {
    const v = emit(
      "input",
      raw,
      [],
      path,
      path.endsWith("importeIntegroCentimos") ||
        (options.kind !== "causal-ss-r54" && path.endsWith("Centimos"))
        ? "centimos"
        : path.endsWith("anio")
          ? "ejercicio"
          : path.endsWith("modo")
            ? "modo"
            : "structural",
    );
    if (Array.isArray(raw) || record(raw))
      for (const [key, x] of Object.entries(raw))
        v.props.set(key, external(x, path + "/" + key));
    return v;
  }
  function native(name: string): Value {
    const v = emit("primitive", name);
    v.native = name;
    return v;
  }
  function prop(v: Value, key: string, selector?: Value): Value {
    const selected = v.props.get(key);
    if (selected !== undefined)
      return alias(
        { ...selected, unit: units.get(current ?? "") ?? selected.unit },
        "property",
        [
          { role: "identity:receiver", to: v.ref },
          ...mutationEdges(v),
          ...(selector !== undefined
            ? [{ role: "selector", to: selector.ref }]
            : []),
        ],
        key,
      );
    if (options.kind !== "causal-ss-r54") {
      if (
        v.native === "Decimal" &&
        ["ROUND_HALF_UP", "ROUND_DOWN"].includes(key)
      )
        return emit(
          "rounding-mode",
          key === "ROUND_HALF_UP" ? 4 : 1,
          [{ role: "receiver", to: v.ref }],
          key,
          "rounding-mode",
        );
      if (
        (Array.isArray(v.raw) &&
          [
            "some",
            "toSorted",
            "includes",
            "filter",
            "map",
            "join",
            "every",
            "find",
            "reduce",
            "sort",
            "reverse",
            "slice",
            ...(options.kind === "causal-explicitos-r62" ? ["push"] : []),
          ].includes(key)) ||
        (text(v.raw) &&
          [
            "startsWith",
            "slice",
            "split",
            "padStart",
            "localeCompare",
          ].includes(key)) ||
        (v.raw instanceof RegExp && key === "test")
      ) {
        const out = native("receiver." + key);
        out.props.set("receiver", v);
        return out;
      }
    }
    if (
      (options.kind === "causal-rentas-r59" ||
        extendedGrammar) &&
      v.raw instanceof Date &&
      [
        "getUTCFullYear",
        "getUTCMonth",
        "getUTCDate",
        ...(extendedGrammar ? ["getTime"] : []),
      ].includes(key)
    ) {
      const out = native("date." + key);
      out.props.set("receiver", v);
      return out;
    }
    if (
      extendedGrammar &&
      DateTime.isDateTime(v.raw) &&
      key === "epochMilliseconds"
    )
      return emit(
        "dateTime-epoch",
        DateTime.toEpochMillis(v.raw),
        [{ role: "receiver", to: v.ref }],
        key,
        "epoch-ms",
      );
    if (v.native === "finite-set") {
      if (key === "size")
        return emit("set-size", v.props.size, [
          { role: "structure", to: v.ref },
        ]);
      if (key === "has") {
        const out = native("set.has");
        out.props.set("receiver", v);
        return out;
      }
    }
    if (v.native !== undefined && v.native !== "") {
      const out = native(v.native + "." + key);
      out.decimalClass = v.decimalClass;
      return out;
    }
    if (Decimal.isDecimal(v.raw)) {
      const out = native("decimal." + key);
      out.props.set("receiver", v);
      return out;
    }
    if (v.state !== undefined && key === "pipe") {
      const out = native("match.pipe");
      out.state = v.state;
      return out;
    }
    if (Array.isArray(v.raw) && key === "length")
      return emit(
        "length",
        v.raw.length,
        options.kind !== "causal-ss-r54"
          ? [
              { role: "identity:receiver", to: v.ref },
              ...mutationEdges(v),
              ...(v.structure ?? []).map((x) => ({
                role: "structure",
                to: x.ref,
              })),
            ]
          : [{ role: "receiver", to: v.ref }],
      );
    if (v.raw === undefined || v.raw === null)
      throw Error("Propiedad de ausente: " + key);
    return emit(
      "missing-property",
      undefined,
      [
        {
          role:
            options.kind !== "causal-ss-r54" ? "identity:receiver" : "receiver",
          to: v.ref,
        },
        ...mutationEdges(v),
      ],
      key,
    );
  }
  function bind(
    p: Pattern,
    v: Value,
    env: Map<string, Value>,
    role: string,
  ): void {
    if (p.name !== undefined && p.name !== "") {
      env.set(p.name, alias(v, role, [], p.name));
      if (extendedGrammar) {
        const names = locals.get(env) ?? new Set<string>();
        names.add(p.name);
        locals.set(env, names);
      }
    } else if ("elements" in p && Array.isArray(p.elements)) {
      for (const [i, e] of p.elements.entries())
        if (e !== null) {
          let child = prop(v, String(i));
          if (child.raw === undefined && e.default !== null && e.default !== "")
            child = evaluate(e.default, env);
          bind(e.binding, child, env, role);
        }
    } else
      for (const f of p.fields ?? []) {
        let child: Value;
        if (extendedGrammar && f.rest === true) {
          const fields = [...v.props].filter(
            ([key]) =>
              p.fields?.some((x) => x.rest !== true && x.key === key) !== true,
          );
          child = emit(
            "object-rest",
            Object.fromEntries(fields.map(([k, v]) => [k, v.raw])),
            [{ role: "identity:receiver", to: v.ref }],
          );
          child.props = new Map(fields);
        } else child = prop(v, f.key);
        if (
          child.raw === undefined &&
          f.default !== undefined &&
          f.default !== null &&
          f.default !== ""
        )
          child = alias(evaluate(f.default, env), "default");
        bind(f.binding, child, env, role);
      }
  }
  function global(name: string): Value {
    if (!values.has(name)) {
      const id = globals.get(name);
      if (id !== undefined && id !== "")
        values.set(name, evaluate(id, new Map()));
      else if (
        [
          "Decimal",
          ...(options.kind !== "causal-ss-r54"
            ? [
                "Effect",
                "Number",
                "Array",
                "Math",
                "Error",
                "Option",
                "String",
                "DateTime",
                ...(extendedGrammar
                  ? ["clock", "Set", "Map", "Date", "Result"]
                  : []),
              ]
            : []),
          "Match",
          "EffectArray",
          "Object",
          "medirAuditoriaSync",
        ].includes(name)
      )
        values.set(name, native(name));
      else if (name === "Infinity" && options.kind !== "causal-ss-r54")
        values.set(name, emit("literal-infinity", Infinity));
      else if (name === "undefined")
        values.set(name, emit("literal", undefined));
      else throw Error("Global sin terminal: " + name);
    }
    return must(values.get(name));
  }
  function invoke(fn: Value, xs: Value[], call: string | null): Value {
    const previousFrame = frame,
      previousNode = current,
      previousControls = controls;
    frame = execution + ":f" + frames.length;
    frames.push({
      id: frame,
      parent: previousFrame,
      call,
      function: fn.closure?.node ?? fn.native ?? null,
    });
    try {
      if (fn.closure !== undefined) {
        controls = [...controls, fn];
        const f = fn.closure,
          env = new Map(
            [...f.env].map(([name, v]) => [
              name,
              alias(v, "capture", [], name),
            ]),
          );
        if (extendedGrammar) parents.set(env, f.env);
        current = f.node;
        emit("invoke", null, [
          { role: "callee", to: fn.ref },
          ...xs.map((x, i) => ({ role: "argument:" + i, to: x.ref })),
        ]);
        f.parameters.forEach((p, i) => {
          let v = xs[i];
          if (p.rest) v = collection(xs.slice(i), "rest");
          else if (
            (v === undefined || v.raw === undefined) &&
            p.default !== null &&
            p.default !== ""
          )
            v = alias(evaluate(p.default, f.env), "default");
          bind(
            p.binding,
            v ?? emit("omitted-argument", undefined),
            env,
            "parameter:" + i,
          );
        });
        let result: Value;
        try {
          result = evaluate(f.body, env);
        } catch (e) {
          if (e instanceof ReturnValue) result = e.value;
          else throw e;
        }
        if (extendedGrammar && f.node === g.lineNode)
          captureLine(result);
        return alias(
          options.kind !== "causal-ss-r54" &&
            g.functionUnits?.some((u) => u.id === f.node) === true
            ? {
                ...result,
                unit: must(g.functionUnits.find((u) => u.id === f.node)).unit,
              }
            : result,
          "function-return",
          [{ role: "identity:callee", to: fn.ref }],
        );
      }
      return invokeNative(
        must(fn.native, "Callback opaco en " + String(current)),
        fn,
        xs,
      );
    } finally {
      frame = previousFrame;
      current = previousNode;
      controls = previousControls;
    }
  }
  function collection(xs: Value[], operation: string): Value {
    const v = emit(
      operation,
      xs.map((x) => x.raw),
      xs.map((x, i) => ({ role: "element:" + i, to: x.ref })),
    );
    if (options.kind !== "causal-ss-r54") v.structure = [...controls];
    xs.forEach((x, i) =>
      v.props.set(
        String(i),
        options.kind !== "causal-ss-r54"
          ? alias(x, "member", [{ role: "identity:collection", to: v.ref }])
          : x,
      ),
    );
    return v;
  }
  function matchPattern(pattern: Value, input: Value): Value {
    if (
      pattern.closure !== undefined ||
      pattern.native === "Match.number" ||
      pattern.native === "Match.string" ||
      pattern.native === "Match.undefined"
    )
      return invoke(pattern, [input], current);
    if (pattern.props.size > 0) {
      const predicates: Value[] = [];
      for (const [key, p] of pattern.props) {
        const result = matchPattern(p, prop(input, key));
        predicates.push(result);
        if (!Boolean(result.raw)) break;
      }
      return emit(
        "match-properties",
        predicates.every((p) => Boolean(p.raw)),
        predicates.map((p) => ({ role: "predicate", to: p.ref })),
      );
    }
    return emit("match-equals", pattern.raw === input.raw, [
      { role: "input", to: input.ref },
      { role: "pattern", to: pattern.ref },
    ]);
  }
  function invokeNative(name: string, fn: Value, xs: Value[]): Value {
    const x = (i: number) => must(xs[i]),
      raw = xs.map((v) => v.raw),
      edges = xs.map((v, i) => ({ role: "argument:" + i, to: v.ref }));
    if (extendedGrammar) {
      if (name === "Decimal.clone") {
        if (!record(raw[0]) || !number(raw[0].precision))
          throw Error("Precision Decimal requise");
        const out = native("Decimal");
        out.decimalClass = (fn.decimalClass ?? Decimal).clone({
          precision: raw[0].precision,
        });
        return out;
      }
      if (name === "Set") {
        const members = [...x(0).props.values()].filter(
          (v, i, a) => a.findIndex((w) => w.raw === v.raw) === i,
        );
        const out = collection(members, "set-members");
        out.native = "finite-set";
        return out;
      }
      if (name === "set.has") {
        const receiver = must(fn.props.get("receiver"));
        return emit(
          "set.has",
          [...receiver.props.values()].some((v) => v.raw === raw[0]),
          [{ role: "receiver", to: receiver.ref }, ...edges],
        );
      }
      if (name === "blocked-family")
        throw Error(
          "BloqueoFamilia: adaptarActividadGeneral.aporte.importeEurosExactos exige calcularActividad2025; 19 familias excluidas",
        );
      if (name === "preadmitted") return alias(x(0), "admission-precondition");
      if (name === "clock") return emit("clock-excluded", 0);
      if (name === "Effect.succeed") return alias(x(0), "success");
      if (name === "Result.isFailure") {
        const tag = prop(x(0), "_tag");
        return emit("isFailure", tag.raw === "Failure", [
          { role: "predicate", to: tag.ref },
        ]);
      }
    }
    if (options.kind !== "causal-ss-r54") {
      if (name === "retencion-concrete")
        return invoke(global("calcularRetencionTrabajoAeatImpl"), xs, current);
      if (name === "Effect.annotateCurrentSpan")
        return emit("annotation", undefined, edges);
      if (name === "Effect.fail" && extendedGrammar)
        throw Object.assign(
          Error("ResultadoNoSoportado: " + String(prop(x(0), "motivo").raw)),
          { domainFailure: x(0).raw },
        );
      if (name === "Effect.fail")
        throw Error(
          "ResultadoNoSoportado: " + String(prop(x(0), "motivo").raw),
        );
      if (name === "String") return emit(name, String(raw[0]), edges);
      if (
        name === "DateTime.makeUnsafe" &&
        extendedGrammar &&
        text(raw[0])
      )
        return emit(name, DateTime.makeUnsafe(raw[0]), edges);
      if (name === "DateTime.makeUnsafe") {
        const input = Schema.decodeUnknownSync(
          Schema.Struct({
            year: Schema.Number,
            month: Schema.Number,
            day: Schema.Number,
          }),
        )(raw[0]);
        return emit(name, DateTime.makeUnsafe(input), edges);
      }
      if (name === "DateTime.toPartsUtc") {
        if (!DateTime.isDateTime(raw[0])) throw Error("DateTime requerido");
        const parts = DateTime.toPartsUtc(raw[0]);
        const out = emit(name, parts, edges);
        for (const [k, v] of Object.entries(parts))
          out.props.set(k, emit("date-part", v, edges, k));
        return out;
      }
      if (name.startsWith("date.")) {
        const receiver = must(fn.props.get("receiver"));
        if (!(receiver.raw instanceof Date)) throw Error("Date requerido");
        const d = receiver.raw;
        return emit(
          name,
          name === "date.getTime"
            ? d.getTime()
            : name === "date.getUTCFullYear"
              ? d.getUTCFullYear()
              : name === "date.getUTCMonth"
                ? d.getUTCMonth()
                : d.getUTCDate(),
          [{ role: "receiver", to: receiver.ref }],
        );
      }
      if (name === "Number") return emit(name, Number(raw[0]), edges);
      if (name === "Number.isSafeInteger")
        return emit(name, Number.isSafeInteger(raw[0]), edges);
      if (name === "Array.isArray")
        return emit(
          name,
          Array.isArray(raw[0]),
          edges.map((e) => ({ ...e, role: "identity:" + e.role })),
        );
      if (name === "Match.undefined")
        return emit(name, raw[0] === undefined, edges);
      if (name === "Match.number") return emit(name, number(raw[0]), edges);
      if (name === "Match.string") return emit(name, text(raw[0]), edges);
      if (name === "Math.min" && extendedGrammar)
        return emit(name, Math.min(...raw.map(Number)), edges);
      if (name === "Math.max")
        return emit(name, Math.max(...raw.map(Number)), edges);
      if (name === "Error") throw Error("Excepción IR: " + String(raw[0]));
      if (name.startsWith("receiver.")) {
        const receiver = must(fn.props.get("receiver")),
          key = name.slice(9);
        if (text(receiver.raw)) {
          if (key === "localeCompare")
            return emit(
              "localeCompare",
              receiver.raw.localeCompare(String(raw[0])),
              [{ role: "receiver", to: receiver.ref }, ...edges],
            );
          if (key === "split")
            return collection(
              receiver.raw
                .split(String(raw[0]))
                .map((v, i) =>
                  emit(
                    "split-part",
                    v,
                    [{ role: "receiver", to: receiver.ref }, ...edges],
                    String(i),
                  ),
                ),
              "split-return",
            );
          if (key === "padStart")
            return emit(
              name,
              receiver.raw.padStart(Number(raw[0]), String(raw[1])),
              [{ role: "receiver", to: receiver.ref }, ...edges],
            );
          return emit(
            name,
            key === "slice"
              ? receiver.raw.slice(
                  Number(raw[0]),
                  raw[1] === undefined ? undefined : Number(raw[1]),
                )
              : receiver.raw.startsWith(String(raw[0])),
            [{ role: "receiver", to: receiver.ref }, ...edges],
          );
        }
        if (receiver.raw instanceof RegExp)
          return emit(name, receiver.raw.test(String(raw[0])), [
            { role: "receiver", to: receiver.ref },
            ...edges,
          ]);
        const members = [...receiver.props.values()];
        const selection = emit(
          "array-selection",
          members.length,
          [
            { role: "identity:receiver", to: receiver.ref },
            ...mutationEdges(receiver),
            ...members.map((v, i) => ({
              role: "identity:element:" + i,
              to: v.ref,
            })),
            ...edges,
          ],
          key,
        );
        const index = (i: number) =>
          emit(
            "index",
            i,
            [{ role: "collection", to: selection.ref }],
            "index",
            "index",
          );
        if (key === "push" && options.kind === "causal-explicitos-r62") {
          if (!Array.isArray(receiver.raw)) throw Error("push requiere un array");
          for (const v of xs) receiver.props.set(String(receiver.props.size), v);
          receiver.raw.push(...xs.map((v) => v.raw));
          const mutation = emit("array-push", receiver.raw, [
            { role: "receiver", to: receiver.ref },
            { role: "previous-state", to: selection.ref },
            ...edges,
          ]);
          arrayVersions.set(receiver.raw, mutation.ref);
          return emit("push-length", receiver.raw.length, [
            { role: "mutation-state", to: mutation.ref },
          ]);
        }
        if (key === "includes")
          return emit(
            "includes",
            members.some((v) => v.raw === raw[0]),
            [
              { role: "collection", to: selection.ref },
              ...members.map((v) => ({ role: "member", to: v.ref })),
              ...edges,
            ],
          );
        if (key === "join")
          return emit(
            "join",
            raw[0] === undefined
              ? members.map((v) => String(v.raw)).join()
              : members.map((v) => String(v.raw)).join(String(raw[0])),
            [
              { role: "collection", to: selection.ref },
              ...members.map((v) => ({ role: "member", to: v.ref })),
              ...edges,
            ],
          );
        if (key === "map" && extendedGrammar) {
          const prev = controls;
          controls = [...prev, selection];
          try {
            return collection(
              members.map((v, i) =>
                invoke(x(0), [v, index(i), receiver], current),
              ),
              "map-return",
            );
          } finally {
            controls = prev;
          }
        }
        if (key === "map")
          return collection(
            members.map((v, i) =>
              invoke(x(0), [v, index(i), receiver], current),
            ),
            "map-return",
          );
        if (key === "reduce") {
          let acc = x(1);
          for (const [i, v] of members.entries())
            acc = alias(
              invoke(x(0), [acc, v, index(i), receiver], current),
              "reduce-step",
            );
          return alias(acc, "reduce-return", [
            { role: "collection-selection", to: selection.ref },
          ]);
        }
        const selections: Value[] = [];
        let output: Value[] = [];
        if (
          key === "filter" ||
          key === "find" ||
          key === "every" ||
          key === "some"
        ) {
          for (const [i, v] of members.entries()) {
            const predicate = invoke(x(0), [v, index(i), receiver], current);
            selections.push(predicate);
            if (Boolean(predicate.raw)) {
              output.push(v);
              if (key === "find" || key === "some") break;
            } else if (key === "every") break;
          }
          const links = [
            { role: "structure", to: selection.ref },
            ...selections.map((p) => ({ role: "predicate", to: p.ref })),
          ];
          if (key === "some")
            return emit(
              "some-return",
              selections.some((p) => Boolean(p.raw)),
              links,
            );
          if (key === "every")
            return emit(
              "every-return",
              selections.every((p) => Boolean(p.raw)),
              links,
            );
          if (key === "find")
            return alias(
              output[0] ?? emit("not-found", undefined),
              "find-return",
              links,
            );
          const prev = controls;
          controls = [...controls, ...selections, selection];
          try {
            return collection(output, "filter-return");
          } finally {
            controls = prev;
          }
        }
        if (key === "sort" || key === "toSorted") {
          output = [...members].sort((a, b) => {
            const cmp = invoke(x(0), [a, b], current);
            selections.push(cmp);
            return Number(cmp.raw);
          });
        } else if (key === "reverse") output = [...members].reverse();
        else if (key === "slice")
          output = members.slice(
            Number(raw[0] ?? 0),
            raw[1] === undefined ? undefined : Number(raw[1]),
          );
        else throw Error("Colección sin contrato: " + key);
        const prev = controls;
        controls = [...controls, selection, ...selections];
        try {
          return collection(output, key + "-return");
        } finally {
          controls = prev;
        }
      }
    }
    if (name === "medirAuditoriaSync")
      return alias(invoke(x(1), [], current), "instrumentation-return");
    if (name === "Decimal")
      return emit(
        "Decimal",
        new (fn.decimalClass ?? Decimal)(raw[0]),
        edges,
        "",
        options.kind !== "causal-ss-r54"
          ? (units.get(current ?? "") ?? x(0).unit)
          : x(0).unit,
      );
    if (
      name.startsWith("decimal.") ||
      ["Decimal.min", "Decimal.max"].includes(name)
    ) {
      const key = name.split(".")[1],
        receiver = fn.props.get("receiver");
      const allowed = [
        "eq",
        "times",
        "min",
        "max",
        "plus",
        "minus",
        "mul",
        "div",
        "lessThan",
        "lt",
        "gt",
        "greaterThan",
        "lte",
        "gte",
        "toFixed",
        "toString",
        "isNegative",
        "abs",
        "toDecimalPlaces",
        "isFinite",
        "isInteger",
        "toNumber",
      ];
      if (!allowed.includes(key))
        throw Error("Primitiva Decimal ausente: " + key);
      const owner = receiver?.raw ?? fn.decimalClass ?? Decimal;
      // SAFETY: owner es Decimal concreto; key pertenece a la lista cerrada anterior. No se admite inyección.
      const method = (
        owner as Record<string, (...args: Value["raw"][]) => Value["raw"]>
      )[key];
      const result = must(method).apply(owner, raw);
      const unit = boolean(result)
        ? "boolean"
        : key === "toFixed" || key === "toString"
          ? (receiver?.unit ?? "contextual") + "-decimal-string"
          : options.kind !== "causal-ss-r54" && units.has(current ?? "")
            ? must(units.get(current ?? ""))
            : options.kind !== "causal-ss-r54" &&
                key === "div" &&
                receiver?.unit === "EUR" &&
                x(0).unit === "EUR"
              ? "ratio"
              : options.kind !== "causal-ss-r54" &&
                  key === "mul" &&
                  receiver?.unit === "ratio" &&
                  raw[0] === 100
                ? "percent"
                : options.kind !== "causal-ss-r54" &&
                    key === "mul" &&
                    receiver?.unit === "EUR" &&
                    x(0).unit === "percent"
                  ? "EUR*percent"
                  : options.kind !== "causal-ss-r54" &&
                      key === "div" &&
                      receiver?.unit === "EUR*percent" &&
                      x(0).unit === "percent-divisor"
                    ? "EUR"
                    : key === "div" && x(0).unit === "centimos/EUR"
                      ? "EUR"
                      : (receiver?.unit ??
                        xs.find((x) => x.unit === "EUR")?.unit ??
                        x(0).unit);
      return emit(
        name,
        result,
        [
          ...(receiver !== undefined
            ? [{ role: "receiver", to: receiver.ref }]
            : []),
          ...edges,
        ],
        "",
        unit,
      );
    }
    if (name === "Object.values")
      return collection([...x(0).props.values()], "Object.values");
    if (extendedGrammar && name === "EffectArray.empty")
      return collection([], "array-empty");
    if (
      extendedGrammar &&
      [
        "EffectArray.flatMap",
        "EffectArray.findFirst",
        "EffectArray.findLast",
      ].includes(name)
    ) {
      const receiver = x(0),
        members = [...receiver.props.values()];
      const selection = emit("array-selection", members.length, [
        { role: "identity:receiver", to: receiver.ref },
        ...members.map((v, i) => ({
          role: "identity:element:" + i,
          to: v.ref,
        })),
        ...(receiver.structure ?? []).map((v) => ({
          role: "structure",
          to: v.ref,
        })),
        { role: "callback", to: x(1).ref },
      ]);
      const prev = controls;
      controls = [...prev, selection];
      try {
        if (name === "EffectArray.flatMap")
          return collection(
            members.flatMap((v, i) => [
              ...invoke(
                x(1),
                [
                  v,
                  emit("index", i, [{ role: "collection", to: selection.ref }]),
                ],
                current,
              ).props.values(),
            ]),
            "flatMap-return",
          );
        let chosen: Value | undefined;
        const predicates: Value[] = [];
        for (const [i, v] of name === "EffectArray.findLast"
          ? [...members.entries()].reverse()
          : [...members.entries()]) {
          const test = invoke(
            x(1),
            [v, emit("index", i, [{ role: "collection", to: selection.ref }])],
            current,
          );
          predicates.push(test);
          if (Boolean(test.raw)) {
            chosen = v;
            break;
          }
        }
        const out = emit(name, null, [
          { role: "collection", to: selection.ref },
          ...predicates.map((v) => ({ role: "predicate", to: v.ref })),
        ]);
        out.state = {
          input: chosen ?? emit("not-found", undefined),
          selections: [selection, ...predicates],
        };
        return out;
      } finally {
        controls = prev;
      }
    }
    if (name === "EffectArray.map") {
      const receiver = x(0),
        callback = x(1);
      const selection = emit("array-selection", receiver.props.size, [
        { role: "identity:receiver", to: receiver.ref },
        ...[...receiver.props.values()].map((v, i) => ({
          role: "identity:element:" + i,
          to: v.ref,
        })),
        { role: "callback", to: callback.ref },
      ]);
      const prev = controls;
      controls = [...controls, selection];
      try {
        return collection(
          [...receiver.props.values()].map((v, i) =>
            invoke(
              callback,
              [
                v,
                emit(
                  "index",
                  i,
                  [{ role: "collection", to: selection.ref }],
                  "index",
                  "index",
                ),
              ],
              current,
            ),
          ),
          "map-return",
        );
      } finally {
        controls = prev;
      }
    }
    if (name === "EffectArray.reduce") {
      const receiver = x(0),
        seed = x(1),
        callback = x(2);
      const selection = emit("collection-selection", receiver.props.size, [
        // La estructura selecciona las iteraciones; los valores financieros
        // proceden de las propiedades que consume cada callback, no de sus hermanas.
        { role: "identity:receiver", to: receiver.ref },
        ...[...receiver.props].map(([key, element]) => ({
          role: "identity:element:" + key,
          to: element.ref,
        })),
        ...(extendedGrammar
          ? (receiver.structure ?? []).map((v) => ({
              role: "structure",
              to: v.ref,
            }))
          : []),
        { role: "seed", to: seed.ref },
        { role: "callback", to: callback.ref },
      ]);
      let acc = seed;
      for (const [key, element] of receiver.props) {
        const index = emit(
          "index",
          Number(key),
          [{ role: "collection", to: selection.ref }],
          "index",
          "index",
        );
        acc = alias(
          invoke(callback, [acc, element, index], current),
          "reduce-step",
          [{ role: "index", to: index.ref }],
        );
      }
      return alias(acc, "reduce-return", [
        { role: "collection-selection", to: selection.ref },
      ]);
    }
    if (name === "Option.fromNullishOr") {
      const v = emit(
        name,
        null,
        edges.map((e) => ({ ...e, role: "identity:" + e.role })),
      );
      v.state = { input: x(0), selections: [] };
      return v;
    }
    if (
      name === "Option.match" &&
      xs.length === 2 &&
      extendedGrammar
    ) {
      const state = must(x(0).state),
        present = state.input.raw !== undefined && state.input.raw !== null;
      const selection = emit("option-presence", present, [
        { role: "identity:input", to: state.input.ref },
        ...state.selections.map((v) => ({ role: "selector", to: v.ref })),
      ]);
      const prev = controls;
      controls = [...prev, selection];
      try {
        return alias(
          invoke(
            prop(x(1), present ? "onSome" : "onNone"),
            present ? [state.input] : [],
            current,
          ),
          "option-return",
        );
      } finally {
        controls = prev;
      }
    }
    if (name === "Option.getOrElse" || name === "Option.match") {
      const v = native(name + ":apply");
      v.props.set("0", x(0));
      return v;
    }
    if (name === "Match.value") {
      const v = emit(name, null, edges);
      v.state = { input: x(0), selections: [] };
      return v;
    }
    if (
      name === "Match.when" ||
      name === "Match.orElse" ||
      name === "Match.withReturnType"
    ) {
      const v = emit(name, null, edges);
      v.native = name + ":apply";
      if (options.kind !== "causal-ss-r54") v.structure = [...controls];
      xs.forEach((x, i) =>
        v.props.set(
          String(i),
          options.kind !== "causal-ss-r54"
            ? alias(x, "member", [{ role: "identity:collection", to: v.ref }])
            : x,
        ),
      );
      return v;
    }
    if (name === "match.pipe") {
      let state = must(fn.state);
      for (const op of xs) {
        if (
          op.native === "Option.getOrElse:apply" ||
          op.native === "Option.match:apply"
        ) {
          const present =
            state.input.raw !== undefined && state.input.raw !== null;
          const selection = emit("option-presence", present, [
            { role: "identity:input", to: state.input.ref },
          ]);
          const prev = controls;
          controls = [...controls, selection];
          try {
            if (op.native === "Option.getOrElse:apply")
              return alias(
                present
                  ? state.input
                  : invoke(must(op.props.get("0")), [], current),
                "option-return",
              );
            return alias(
              invoke(
                prop(must(op.props.get("0")), present ? "onSome" : "onNone"),
                present ? [state.input] : [],
                current,
              ),
              "option-return",
            );
          } finally {
            controls = prev;
          }
        }
        if (op.native === "Match.withReturnType:apply") continue;
        if (op.native === "Match.exhaustive") {
          if (state.result === undefined) throw Error("Match no exhaustivo");
          return alias(
            state.result,
            "match-return",
            state.selections.map((x) => ({ role: "selector", to: x.ref })),
          );
        }
        if (op.native === "Match.when:apply") {
          if (state.result !== undefined) continue;
          const pattern = must(op.props.get("0")),
            callback = must(op.props.get("1"));
          const predicate =
            pattern.closure !== undefined ||
            pattern.native === "Match.undefined"
              ? invoke(pattern, [state.input], current)
              : options.kind !== "causal-ss-r54" && pattern.props.size > 0
                ? matchPattern(pattern, state.input)
                : emit("match-equals", pattern.raw === state.input.raw, [
                    { role: "input", to: state.input.ref },
                    { role: "pattern", to: pattern.ref },
                  ]);
          state = { ...state, selections: [...state.selections, predicate] };
          if (Boolean(predicate.raw)) {
            const prev = controls;
            controls = [...controls, ...state.selections];
            const result = invoke(callback, [state.input], current);
            controls = prev;
            state = { ...state, result };
          }
        } else if (op.native === "Match.orElse:apply") {
          if (state.result === undefined) {
            const prev = controls;
            controls = [...controls, ...state.selections];
            state = {
              ...state,
              result: invoke(must(op.props.get("0")), [state.input], current),
            };
            controls = prev;
          }
          return alias(
            must(state.result),
            "match-return",
            state.selections.map((x) => ({ role: "selector", to: x.ref })),
          );
        } else throw Error("Opérateur Match absent: " + op.native);
      }
      throw Error("Match sans terminal");
    }
    if (name === "Match.valueTags") {
      const tag = prop(x(0), "_tag"),
        callback = prop(x(1), String(tag.raw));
      const prev = controls;
      controls = [...controls, tag];
      const result = invoke(callback, [x(0)], current);
      controls = prev;
      return alias(result, "tag-return", [{ role: "selector", to: tag.ref }]);
    }
    throw Error("Primitiva sin contrato: " + name);
  }
  function terminates(id: string | undefined): boolean {
    if (id === undefined) return false;
    const n = must(nodes.get(id));
    if (n.op === "return" || n.op === "throw") return true;
    if (n.op === "block") return terminates(n.args.at(-1));
    return n.op === "if" && terminates(n.args[1]) && terminates(n.args[2]);
  }
  function evaluate(id: string, env: Map<string, Value>): Value {
    const n = must(nodes.get(id)),
      previousNode = current;
    current = id;
    const ev = (i: number) => evaluate(must(n.args[i]), env);
    const many = (ids: string[]) =>
      ids.flatMap((id) => {
        const n = must(nodes.get(id));
        return n.op === "spread"
          ? [...evaluate(must(n.args[0]), env).props.values()]
          : [evaluate(id, env)];
      });
    try {
      switch (n.op) {
        case "assign": {
          if (!extendedGrammar)
            throw Error("assign fuera de dominio");
          const v = ev(0),
            name = must(n.data.name);
          let owner = env;
          while (parents.has(owner) && locals.get(owner)?.has(name) !== true)
            owner = must(parents.get(owner));
          if (!owner.has(name)) throw Error("Asignación sin declaración");
          const out = alias(v, "assignment", [], name);
          owner.set(name, out);
          return out;
        }
        case "forof":
        case "forOf": {
          const receiver = ev(0);
          let result = emit("loop-empty", undefined);
          const selection = emit("loop-selection", receiver.props.size, [
            { role: "identity:receiver", to: receiver.ref },
            ...[...receiver.props.values()].map((v, i) => ({
              role: "identity:element:" + i,
              to: v.ref,
            })),
          ]);
          for (const [key, v] of receiver.props) {
            const local = new Map(env);
            parents.set(local, env);
            const prev = controls;
            controls = [
              ...prev,
              selection,
              emit("loop-index", key, [
                { role: "collection", to: selection.ref },
              ]),
            ];
            try {
              bind(must(n.data.binding), v, local, "iteration");
              result = evaluate(must(n.args[1]), local);
            } finally {
              controls = prev;
            }
          }
          return result;
        }
        case "preadmitted": {
          const out = native("preadmitted");
          return out;
        }
        case "blockedFamily":
          return native("blocked-family");
        case "schemaDecode": {
          const input = ev(0);
          const decoded = decodeEscalasSchema(
            must(g.schemaProgram),
            must(n.data.schema),
            input.raw,
          );
          if (decoded._tag === "Failure") {
            const failed = emit("schema-failure", { _tag: "Failure" }, [
              { role: "validation", to: input.ref },
            ]);
            failed.props.set(
              "_tag",
              emit("schema-tag", "Failure", [
                { role: "validation", to: input.ref },
              ]),
            );
            return failed;
          }
          function reconstruct(raw: Value["raw"], encoded: Value, property = ""): Value {
            if (isDeepStrictEqual(raw, encoded.raw)) return alias(encoded, "decoded-input", [], property);
            const v = emit("schema-transformation", raw, [{role:"encoded-input",to:encoded.ref}], property);
            if (Array.isArray(raw) || record(raw))
              for (const [key, value] of Object.entries(raw))
                v.props.set(key, reconstruct(value, prop(encoded, key), key));
            return v;
          }
          const success = options.kind === "causal-explicitos-r62" ? reconstruct(decoded.success, input) : alias(input, "decoded-input");
          const out = emit(
            "schema-success",
            { _tag: "Success", success: success.raw },
            [{ role: "identity:input", to: input.ref }],
          );
          out.props.set(
            "_tag",
            emit("schema-tag", "Success", [
              { role: "identity:input", to: input.ref },
            ]),
          );
          out.props.set("success", success);
          return out;
        }
        case "failurePayload": {
          const input = ev(0);
          if (!record(input.raw))
            throw Error("Payload de rechazo no ordinario");
          const out = emit(
            "failure-payload",
            { _tag: n.data.tag, ...input.raw },
            [{ role: "payload", to: input.ref }],
          );
          out.props = new Map(input.props);
          out.props.set("_tag", emit("failure-tag", n.data.tag));
          return out;
        }
        case "isFailure": {
          const tag = prop(ev(0), "_tag");
          return emit("isFailure", tag.raw === "Failure", [
            { role: "predicate", to: tag.ref },
          ]);
        }
        case "noop":
          return emit("noop", undefined);
        case "invoke":
          return invoke(ev(0), [], id);
        case "mapError":
          return ev(0);
        case "literal":
          return emit("literal", n.data.value);
        case "regex":
          return emit("regex", new RegExp(must(n.data.pattern), n.data.flags));
        case "local": {
          let owner = env;
          if (extendedGrammar)
            while (
              parents.has(owner) &&
              locals.get(owner)?.has(must(n.data.name)) !== true
            )
              owner = must(parents.get(owner));
          return alias(
            must(
              owner.get(must(n.data.name)),
              "Local sin binding: " + n.data.name,
            ),
            "local",
            [],
            must(n.data.name),
          );
        }
        case "global":
          return alias(global(must(n.data.name)), "global");
        case "function": {
          const v = emit("function", null);
          v.closure = {
            body: must(n.args[0]),
            parameters: must(n.data.parameters),
            env: extendedGrammar ? env : new Map(env),
            node: id,
          };
          return v;
        }
        case "block": {
          const local = new Map(env);
          if (extendedGrammar) parents.set(local, env);
          for (const id of n.args) evaluate(id, local);
          return emit("block", undefined);
        }
        case "declarations":
          for (const id of n.args) evaluate(id, env);
          return emit("declarations", undefined);
        case "bind": {
          const v = ev(0);
          bind(must(n.data.binding), v, env, "binding");
          return alias(v, "bind");
        }
        case "return":
          throw new ReturnValue(
            alias(
              n.args.length > 0 ? ev(0) : emit("undefined", undefined),
              "return",
            ),
          );
        case "pass":
          return alias(ev(0), "pass");
        case "throw":
          if (extendedGrammar)
            throw Object.assign(Error("Rechazo IR R60"), {
              domainFailure: ev(0).raw,
            });
          throw Error("Excepción IR no resuelta");
        case "if":
        case "conditional": {
          const predicate = ev(0),
            branch = Boolean(predicate.raw) ? 1 : 2,
            prev = controls;
          const selection = emit(
            "branch",
            branch,
            [{ role: "predicate", to: predicate.ref }],
            String(branch),
          );
          controls = [...controls, selection];
          let continuation = false;
          try {
            continuation =
              options.kind !== "causal-ss-r54" &&
              n.op === "if" &&
              terminates(n.args[branch === 1 ? 2 : 1]);
            return Boolean(n.args[branch])
              ? alias(ev(branch), "branch-return")
              : emit("branch-empty", undefined);
          } finally {
            controls = continuation ? [...prev, selection] : prev;
          }
        }
        case "switch": {
          const selected = ev(0),
            tests: Value[] = [];
          let choice: Node | undefined;
          for (const id of n.args.slice(1)) {
            const c = must(nodes.get(id));
            if (c.data.fallback === true) {
              if (choice === undefined) choice = c;
              continue;
            }
            const v = evaluate(must(c.args[0]), env);
            const test = emit("switch-equals", selected.raw === v.raw, [
              { role: "selector", to: selected.ref },
              { role: "case", to: v.ref },
            ]);
            tests.push(test);
            if (Boolean(test.raw)) {
              choice = c;
              break;
            }
          }
          const prev = controls;
          controls = [...controls, ...tests];
          try {
            if (choice !== undefined)
              for (const id of choice.args.slice(
                choice.data.fallback === true ? 0 : 1,
              ))
                evaluate(id, env);
            return emit("switch-empty", undefined);
          } finally {
            controls = prev;
          }
        }
        case "binary": {
          const a = ev(0),
            op = must(n.data.operator);
          if (["&&", "||", "??"].includes(op)) {
            const take =
              op === "&&"
                ? Boolean(a.raw)
                : op === "||"
                  ? !Boolean(a.raw)
                  : a.raw === null || a.raw === undefined;
            const selection = emit("short-circuit", take, [
              {
                role:
                  options.kind !== "causal-ss-r54" &&
                  (record(a.raw) || Array.isArray(a.raw))
                    ? "identity:predicate"
                    : "predicate",
                to: a.ref,
              },
            ]);
            const prev = controls;
            controls = [...controls, selection];
            try {
              return alias(take ? ev(1) : a, "short-return");
            } finally {
              controls = prev;
            }
          }
          const b = ev(1);
          if (op === "in" && extendedGrammar) {
            if (!record(b.raw) && !Array.isArray(b.raw))
              throw Error("Presencia en no objeto");
            return emit("property-presence", String(a.raw) in b.raw, [
              { role: "key", to: a.ref },
              { role: "identity:receiver", to: b.ref },
            ]);
          }
          const presence =
            options.kind !== "causal-ss-r54" &&
            ["===", "!=="].includes(op) &&
            (a.raw === undefined ||
              a.raw === null ||
              b.raw === undefined ||
              b.raw === null);
          const objectIdentity = (v: Value): boolean =>
            record(v.raw) || Array.isArray(v.raw);
          return emit(
            presence ? "presence-comparison" : "binary",
            options.kind !== "causal-ss-r54" &&
              text(a.raw) &&
              text(b.raw) &&
              ["<", ">", "<=", ">="].includes(op)
              ? op === "<"
                ? a.raw < b.raw
                : op === ">"
                  ? a.raw > b.raw
                  : op === "<="
                    ? a.raw <= b.raw
                    : a.raw >= b.raw
              : binary(op, a.raw, b.raw),
            [
              {
                role: presence && objectIdentity(a) ? "identity:left" : "left",
                to: a.ref,
              },
              {
                role:
                  presence && objectIdentity(b) ? "identity:right" : "right",
                to: b.ref,
              },
            ],
          );
        }
        case "unary": {
          const a = ev(0);
          return emit(
            "unary",
            n.data.operator === "!"
              ? !Boolean(a.raw)
              : n.data.operator === "-"
                ? -Number(a.raw)
                : Number(a.raw),
            [{ role: "argument", to: a.ref }],
          );
        }
        case "get":
        case "index": {
          const receiver = ev(0);
          if (
            n.data.optional === true &&
            (receiver.raw === null || receiver.raw === undefined)
          )
            return emit("optional-absent", undefined, [
              { role: "selector", to: receiver.ref },
            ]);
          const key = n.op === "index" ? ev(1) : undefined;
          return prop(
            receiver,
            n.op === "get" ? must(n.data.key) : String(must(key).raw),
            key,
          );
        }
        case "call":
        case "new": {
          const fn = ev(0),
            args = many(n.args.slice(1));
          return alias(invoke(fn, args, id), "call-return", [
            { role: "identity:call-target", to: fn.ref },
          ]);
        }
        case "array":
          return collection(many(n.args), "array");
        case "object": {
          const fields = new Map<string, Value>();
          for (const id of n.args) {
            const p = must(nodes.get(id));
            if (p.op === "spread")
              for (const [k, v] of evaluate(must(p.args[0]), env).props)
                fields.set(k, v);
            else {
              const prev: string | null = current;
              current = id;
              const v = alias(
                evaluate(must(p.args[0]), env),
                "property-definition",
                [],
                must(p.data.key),
              );
              current = prev;
              fields.set(must(p.data.key), v);
            }
          }
          const v = emit(
            "object",
            Object.fromEntries([...fields].map(([k, v]) => [k, v.raw])),
            [...fields].map(([k, v]) => ({ role: "property:" + k, to: v.ref })),
          );
          v.props = fields;
          return v;
        }
        case "template": {
          const xs = n.args.map((id) => evaluate(id, env));
          return emit(
            "template",
            xs.reduce(
              (s, x, i) => s + String(x.raw) + must(n.data.strings?.[i + 1]),
              must(n.data.strings?.[0]),
            ),
            xs.map((x, i) => ({ role: "argument:" + i, to: x.ref })),
          );
        }
        default:
          throw Error("Gramática sin contrato: " + n.op);
      }
    } finally {
      current = previousNode;
    }
  }
  function lineArgument(
    b: SSFragment["outputBindings"][number],
    env: Map<string, Value>,
  ): Value {
    const amount = evaluate(b.node, env);
    const v = external(
      {
        siteId: b.siteId,
        instancia: 0,
        unidad: b.unit,
        etiqueta: "candidato",
        formula: "contrato R34",
      },
      "output-metadata",
    );
    v.props.set("importe", amount);
    if (!record(v.raw)) throw Error("Metadata de salida no ordinaria");
    v.raw = { ...v.raw, importe: amount.raw };
    return v;
  }
  const env = new Map([
    ["caso", external(caso, "caso")],
    ["contexto", external(contexto, "contexto")],
  ]);
  if (options.kind === "causal-retenciones-r57") {
    const service = native("retencion-concrete");
    const holder = emit("service-binding", null);
    holder.props.set("calcular", service);
    const dependencies = emit("dependencies", null);
    dependencies.props.set("retencionTrabajoAeat", holder);
    env.set("dependencias", dependencies);
  }
  const annualBindings: AnnualBinding[] = [];
  for (const b of g.annualBindings) {
    const v = alias(evaluate(b.node, env), "annual-binding", [], b.name);
    env.set(b.name, v);
    annualBindings.push({ name: b.name, producer: v.ref, frame });
  }
  const lines: unknown[] = [],
    outputs: Output[] = [];
  if (options.kind === "causal-retenciones-r57") {
    env.set("retencion", must(env.get("retencionTrabajoAeat")));
  }
  function captureLine(v: Value): void {
    const origin = prop(v, "origen"),
      site = prop(origin, "siteId");
    if (!g.outputBindings.some((b) => b.siteId === site.raw)) return;
    const decimal = prop(origin, "decimal"),
      display = prop(v, "resultado");
    const transported = alias(
      { ...decimal, unit: "EUR-decimal-string" },
      "transport",
      [],
      String(site.raw),
    );
    lines.push(v.raw);
    const output: Output = {
      siteId: String(site.raw),
      decimal: String(decimal.raw),
      display: display.raw,
      root: transported.ref,
      slice: causalSlice(events, transported.ref),
    };
    if (options.kind === "causal-explicitos-r62") Object.assign(output, {instanceId: String(prop(origin, "instanceId").raw), unit: String(prop(origin, "unidad").raw)});
    outputs.push(output);
  }
  if (extendedGrammar) {
    const entry = must(g.entryPoints);
    const routeValue = prop(must(env.get("contexto")), "route");
    const entrySelection = emit("entry-selection", routeValue.raw, [
      { role: "selector", to: routeValue.ref },
    ]);
    controls = [...controls, entrySelection];
    const explicit = routeValue.raw === "explicit";
    invoke(
      global(explicit ? entry.explicit : entry.annual),
      explicit
        ? [must(env.get("caso"))]
        : [
            must(env.get("caso")),
            external({}, "dependencias"),
            must(env.get("contexto")),
          ],
      null,
    );
  }
  for (const b of extendedGrammar
    ? []
    : g.outputBindings) {
    if (
      options.kind === "causal-retenciones-r57" &&
      b.siteId.startsWith("anual.retencion.") &&
      env.get("retencion")?.raw === undefined
    )
      continue;
    const v =
      options.kind !== "causal-ss-r54"
        ? invoke(
            global(
              options.kind === "causal-rentas-r59"
                ? "rentas:lib/dominio/explicacion/linea-calculo.ts:crearLineaCalculo"
                : "crearLineaCalculo",
            ),
            [lineArgument(b, env)],
            b.node,
          )
        : evaluate(b.node, env);
    lines.push(v.raw);
    const decimal = prop(prop(v, "origen"), "decimal"),
      display = prop(v, "resultado");
    const transported = alias(decimal, "transport", [], b.siteId);
    outputs.push({
      siteId: b.siteId,
      decimal: String(decimal.raw),
      display: display.raw,
      root: transported.ref,
      slice: causalSlice(events, transported.ref),
    });
  }
  return {
    lines,
    evidence: {
      version:
        options.kind === "causal-explicitos-r62" ? 5 : options.kind === "causal-ss-r54"
          ? 1
          : extendedGrammar
            ? 4
            : options.kind === "causal-rentas-r59"
              ? 3
              : 2,
      kind: options.kind,
      execution,
      program: digest(g),
      sources: structuredClone(g.sources),
      software: [
        "scripts/procedencia/causal-ss-r54.ts",
        "scripts/procedencia/evidencia-causal-r57.ts",
        "scripts/procedencia/evidencia-causal-r57-contratos.ts",
        ...options.software,
        "scripts/procedencia/evidencia-ejecucion-r54.ts",
        "scripts/procedencia/flujo-ss-r36.mjs",
        "scripts/procedencia/flujo-ss-r36-consumidor.mjs",
        require.resolve("decimal.js"),
        require.resolve("effect"),
      ].map((file) => ({
        file,
        sha256: createHash("sha256").update(readFileSync(file)).digest("hex"),
      })),
      input: structuredClone(normalizedInput),
      context: structuredClone(contexto),
      frames,
      events,
      annualBindings,
      outputs,
      admissionClosed: false,
      siteClosed: false,
      wiringAllowed: false,
      completeRuleAcceptance: false,
    },
  };
}
