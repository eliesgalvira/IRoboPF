import {isDeepStrictEqual} from "node:util"
import {executeCausalRentas} from "./causal-rentas-r59.mjs"
import {composeCausalRentas} from "./causal-rentas-r59-contratos.mjs"
import {verifyRentasR36,composeRentasR36} from "./flujo-rentas-r36.mjs"
import { createRequire } from "node:module"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const Decimal = require("decimal.js").Decimal
const {
  Match,
  Option,
  DateTime,
  Schema,
  Result,
  Array: EffectArray,
} = require("effect")
const returned = Symbol("return")
const binary = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  "===": (a, b) => a === b,
  "!==": (a, b) => a !== b,
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
  "<=": (a, b) => a <= b,
  ">=": (a, b) => a >= b,
}
function bind(pattern, value, env, defaultValue) {
  if (pattern.name) env.set(pattern.name, { value })
  else if (pattern.elements)
    pattern.elements.forEach((e, i) => {
      if (e)
        bind(
          e.binding,
          value[i] === undefined && e.default
            ? defaultValue(e.default)
            : value[i],
          env,
          defaultValue
        )
    })
  else
    for (const f of pattern.fields)
      bind(f.binding, value[f.key], env, defaultValue)
}
const present = (x) => x !== undefined && x !== null
const printableString = Schema.is(Schema.String)
const printable = (v) => {
  if (Decimal.isDecimal(v)) return { decimal: v.toFixed() }
  if (Array.isArray(v)) return v.map(printable)
  if (v && [Object.prototype, null].includes(Object.getPrototypeOf(v)))
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, printable(x)])
    )
  if (v === undefined) return { absent: true }
  if (Number.isFinite(v) || [null, true, false].includes(v) || printableString(v))
    return v
  return { opaquePrimitive: true }
}
/** Solo consume operaciones JSON. No importa motor, compilador TS ni ejecuta texto.
 * El llamante debe validar primero el fragmento; executeFinite no concede confianza. */
/** @param {string|null} expression
 * @param {((event: import("./puertos-composicion-r47").Observation) => void)|null} observe */
export function executeRentasFinite(
  fragment,
  functionName,
  args,
  capture = true,
  expression = null,
  bindings = [],
  boundaries = {},
  observe = null
) {
  const nodes = new Map(fragment.program.map((n) => [n.id, n]))
  const globals = new Map(fragment.globalBindings.map((b) => [b.name, b.node]))
  /** Intérprete dinámico de operandos JSON; no atribuye tipado fiscal al IR. @type {Map<string, any>} */
  const values = new Map(
    Object.entries({
      Decimal,
      Match,
      Option,
      DateTime,
      Schema,
      Result,
      EffectArray,
      String,
      Object,
      Set,
      Map,
      Date,
      Number,
      Array,
      Math,
      Error,
      ...boundaries,
      undefined,
      Infinity,
      Effect: {
        annotateCurrentSpan: () => undefined,
        fail: (x) => {
          const error = Object.assign(Error(x.motivo), { domainFailure: x })
          throw error
        },
      },
    })
  )
  const frames = []
  let invocation = 0
  const boundaryNames = new Map(Object.entries(boundaries).map(([name, value]) => [value, name]))
  const trace = []
  const bindValue = (pattern, value, env) =>
    bind(pattern, value, env, (id) => evaluate(id, env))
  function global(name) {
    if (!values.has(name)) {
      const id = globals.get(name)
      if (!id) throw Error("Frontera sin contrato " + name)
      values.set(name, evaluate(id, new Map()))
    }
    return values.get(name)
  }
  function evaluate(id, env) {
    const n = nodes.get(id)
    if (!n) throw Error("Operando ausente " + id)
    const ev = (i) => evaluate(n.args[i], env)
    const many = (ids) =>
      ids.flatMap((i) =>
        nodes.get(i).op === "spread"
          ? Array.from(evaluate(nodes.get(i).args[0], env))
          : [evaluate(i, env)]
      )
    let value
    switch (n.op) {
      case "literal":
        value = n.data.value
        break
      case "regex":
        value = new RegExp(n.data.pattern, n.data.flags)
        break
      case "global":
        value = global(n.data.name)
        if (observe && n.data.name.startsWith("boundary:") && Object.entries(boundaries).some(([name, v]) => name === n.data.name && v === value) && !Object.entries(boundaries).some(([name, v]) => name === n.data.name && v instanceof Function)) observe({ node: id, target: n.data.name, frames: [...frames], arguments: [], result: printable(value) })
        break
      case "local":
        if (!env.has(n.data.name))
          throw Error("Local sin binding " + n.data.name)
        value = env.get(n.data.name).value
        break
      case "function":
        value = (...xs) => {
          const local = new Map(env)
          n.data.parameters.forEach((p, i) =>
            bindValue(
              p.binding,
              p.rest
                ? xs.slice(i)
                : xs[i] === undefined && p.default
                  ? evaluate(p.default, env)
                  : xs[i],
              local
            )
          )
          try {
            frames.push({ node: n.id, invocation: ++invocation })
            return evaluate(n.args[0], local)
          } catch (e) {
            if (e?.[returned]) return e.value
            throw e
          } finally {
            frames.pop()
          }
        }
        break
      case "assign":
        if (!env.has(n.data.name))
          throw Error("Asignación sin binding " + n.data.name)
        value = ev(0)
        env.get(n.data.name).value = value
        break
      case "forof": {
        const xs = ev(0)
        let index = 0
        for (const x of xs) {
          const local = new Map(env)
          bindValue(n.data.binding, x, local)
          if (capture)
            trace.push({
              node: id,
              operation: "iteration",
              index: index++,
              element: printable(x),
            })
          evaluate(n.args[1], local)
        }
        break
      }
      case "block": {
        const local = new Map(env)
        for (const i of n.args) evaluate(i, local)
        value = undefined
        break
      }
      case "declarations":
        for (const i of n.args) evaluate(i, env)
        break
      case "bind":
        value = ev(0)
        bindValue(n.data.binding, value, env)
        break
      case "return":
        throw { [returned]: true, value: n.args.length ? ev(0) : undefined }
      case "throw":
        throw ev(0)
      case "pass":
        value = ev(0)
        break
      case "if":
        if (ev(0)) value = ev(1)
        else if (n.args[2]) value = ev(2)
        break
      case "conditional":
        value = ev(0) ? ev(1) : ev(2)
        break
      case "switch": {
        const selected = ev(0)
        const cases = n.args.slice(1).map((i) => nodes.get(i))
        const c =
          cases.find(
            (x) => !x.data.fallback && evaluate(x.args[0], env) === selected
          ) ?? cases.find((x) => x.data.fallback)
        if (c)
          for (const i of c.args.slice(c.data.fallback ? 0 : 1))
            evaluate(i, env)
        break
      }
      case "binary": {
        const a = ev(0)
        value =
          n.data.operator === "&&"
            ? a && ev(1)
            : n.data.operator === "||"
              ? a || ev(1)
              : n.data.operator === "??"
                ? (a ?? ev(1))
                : binary[n.data.operator](a, ev(1))
        break
      }
      case "unary":
        value =
          n.data.operator === "!"
            ? !ev(0)
            : n.data.operator === "-"
              ? -ev(0)
              : +ev(0)
        break
      case "get": {
        const a = ev(0)
        value = n.data.optional && !present(a) ? undefined : a[n.data.key]
        break
      }
      case "index": {
        const a = ev(0)
        value = n.data.optional && !present(a) ? undefined : a[ev(1)]
        break
      }
      case "call": {
        const target = nodes.get(n.args[0])
        let xs
        if (target.op === "get" || target.op === "index") {
          const receiver = evaluate(target.args[0], env)
          const key =
            target.op === "get"
              ? target.data.key
              : evaluate(target.args[1], env)
          xs = many(n.args.slice(1))
          if (capture && Array.isArray(receiver))
            trace.push({
              node: id,
              operation: "collection-input",
              cardinality: receiver.length,
              elements: printable(receiver),
              seed: xs.length > 1 ? printable(xs[1]) : null,
            })
          value = receiver[key](...xs)
        } else {
          const fn = ev(0)
          xs = many(n.args.slice(1))
          value = fn(...xs)
          if (observe && boundaryNames.has(fn)) observe({ node: id, target: boundaryNames.get(fn), frames: [...frames], arguments: xs.map(printable), result: printable(value) })
        }
        if (capture)
          trace.push({
            node: id,
            operation: "call",
            arguments: xs.map(printable),
            result: printable(value),
          })
        break
      }
      case "new": {
        const constructor = ev(0)
        value = new constructor(...many(n.args.slice(1)))
        break
      }
      case "array":
        value = many(n.args)
        break
      case "object":
        value = {}
        for (const i of n.args) {
          const p = nodes.get(i)
          if (p.op === "spread") Object.assign(value, evaluate(p.args[0], env))
          else value[p.data.key] = evaluate(p.args[0], env)
        }
        break
      case "template":
        value = n.data.strings[0]
        n.args.forEach((i, j) => {
          value += String(evaluate(i, env)) + n.data.strings[j + 1]
        })
        break
      default:
        throw Error("Operación desconocida " + n.op)
    }
    if (
      capture &&
      ["get", "index", "bind", "binary", "conditional"].includes(n.op)
    )
      trace.push({ node: id, operation: n.op, result: printable(value) })
    return value
  }
  const result = expression
    ? evaluate(expression, new Map(bindings.map(([k, v]) => [k, { value: v }])))
    : global(functionName)(...args)
  return { result, trace }
}

/** Entradas generales previamente admitidas. SS se aporta solo mediante contratos ajenos.
 * La admisión común sigue pendiente: este resultado no habilita wiring. */
/** @param {((event: import("./puertos-composicion-r47").Observation) => void)|null} observe
 * @param {{causal?:boolean,execution?:string}|null} causalOptions */
export function consumeGeneralRentas(
  fragment,
  caso,
  contexto,
  boundaries = {},
  observe = null,
  causalOptions = null
) {
  if (causalOptions?.causal === true) {
    verifyRentasR36(fragment)
    if(!isDeepStrictEqual(fragment,composeRentasR36()))throw Error("Descriptor de rentas no derivado")
    if (Object.keys(boundaries).length || observe !== null) throw Error("Callbacks externos fuera del contrato causal")
    const result = executeCausalRentas(composeCausalRentas(), caso, contexto, causalOptions.execution)
    return {...result, admission: "pending-common-contract", wiringAllowed: false}
  }
  const bindings = [
    ["caso", caso],
    ["contexto", contexto],
  ]
  const terminals = {
    ...boundaries,
    "boundary:medirAuditoriaSync": (_label, callback) => callback(),
  }
  for (const binding of fragment.annualBindings) {
    const value = executeRentasFinite(
      fragment,
      null,
      [],
      false,
      binding.node,
      bindings,
      terminals,
      observe
    ).result
    bindings.push([binding.name, value])
  }
  const lines = fragment.outputs
    .filter((o) => o.expression)
    .map((o) => {
      const value = executeRentasFinite(
        fragment,
        null,
        [],
        false,
        o.expression,
        bindings,
        terminals
      ).result
      return executeRentasFinite(
        fragment,
        fragment.roots.crearLineaCalculo,
        [
          {
            siteId: o.siteId,
            instancia: 0,
            importe: value,
            unidad: o.unit,
            etiqueta: "contrato candidato",
            formula: "IR R36",
          },
        ],
        false,
        null,
        [],
        terminals
      ).result
    })
  return {
    lines,
    bindings,
    admission: "pending-common-contract",
    wiringAllowed: false,
  }
}
/** Distingue rechazo contractual de defecto; nunca transforma ninguno en importe cero. */
/** @param {((event: import("./puertos-composicion-r47").Observation) => void)|null} observe */
export function consumeExplicitRentas(fragment, entrada, boundaries = {}, observe = null) {
  try {
    const result = executeRentasFinite(
      fragment,
      fragment.roots.liquidarIrpfAnualExplicito,
      [entrada],
      false,
      null,
      [],
      { ...boundaries, "boundary:enlazarRastroAnualActual": (r) => r },
      observe
    ).result
    return {
      status: "success",
      result,
      admission: "pending-independent-common-contract",
      wiringAllowed: false,
    }
  } catch (error) {
    return error.domainFailure
      ? { status: "fail", reason: error.domainFailure, wiringAllowed: false }
      : { status: "defect", reason: String(error), wiringAllowed: false }
  }
}
