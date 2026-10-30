import { createRequire } from "node:module"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const { Decimal } = require("decimal.js")
const { Match, Option, DateTime, Array: EffectArray } = require("effect")
class Environment extends Map {
  parent = null
}
const returned = Symbol("return")
const binary = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
  "%": (a, b) => a % b,
  in: (a, b) => a in b,
  "===": (a, b) => a === b,
  "!==": (a, b) => a !== b,
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
  "<=": (a, b) => a <= b,
  ">=": (a, b) => a >= b
}
/** @param {any} pattern @param {any} value @param {Map<any,any>} env @param {(id:string)=>any} evaluateDefault */
function bind(
  pattern,
  value,
  env,
  evaluateDefault = (_id) => {
    throw Error("Default sin evaluador")
  }
) {
  if (pattern.name) env.set(pattern.name, value)
  else if (pattern.elements)
    pattern.elements.forEach((p, i) => bind(p, value[i], env, evaluateDefault))
  else
    for (const f of pattern.fields)
      bind(
        f.binding,
        f.rest
          ? Object.fromEntries(
              Object.entries(value).filter(
                ([k]) => !pattern.fields.some((p) => !p.rest && p.key === k)
              )
            )
          : value[f.key] === undefined && f.default
            ? evaluateDefault(f.default)
            : value[f.key],
        env,
        evaluateDefault
      )
}
const present = (x) => x !== undefined && x !== null
const printable = (v) => {
  if (Decimal.isDecimal(v)) return { decimal: v.toFixed() }
  if (Array.isArray(v)) return v.map(printable)
  if (v && Object.getPrototypeOf(v) === Object.prototype)
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, printable(x)])
    )
  if (v === undefined) return { absent: true }
  if (Number.isFinite(v) || [null, true, false].includes(v) || String(v) === v)
    return v
  return { opaquePrimitive: true }
}
/** Solo consume operaciones JSON. No importa motor, compilador TS ni ejecuta texto.
 * El llamante debe validar primero el fragmento; executeFinite no concede confianza. */
export function executeEscalasR36(
  fragment,
  functionName,
  args,
  capture = true,
  expression = null,
  bindings = [],
  boundaries = new Map()
) {
  const nodes = new Map(fragment.program.map((n) => [n.id, n]))
  const globals = new Map(fragment.globalBindings.map((b) => [b.name, b.node]))
  /** @type {Map<string, any>} Heterogeneidad del intérprete, verificada por la receta. */
  const values = new Map(
    Object.entries({
      Decimal,
      Match,
      Option,
      DateTime,
      EffectArray,
      String,
      Set,
      Map,
      Date,
      clock: () => 0,
      Number,
      Array,
      Math,
      Error,
      undefined,
      Infinity,
      Effect: {
        annotateCurrentSpan: () => undefined,
        succeed: (x) => x,
        fail: (x) => {
          throw Error("ResultadoNoSoportado: " + x.motivo)
        }
      }
    })
  )
  const trace = []
  const stack = []
  let invocation = 0,
    event = 0
  const record = (entry) =>
    trace.push({ ...entry, event: ++event, instance: stack.join("/") })
  function global(name) {
    if (!values.has(name)) {
      const id = globals.get(name)
      if (!id) throw Error("Global sin resolver " + name)
      values.set(name, evaluate(id, new Environment()))
    }
    return values.get(name)
  }
  /** @param {string} id @param {Environment} env */
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
      case "failurePayload":
        value = { _tag: n.data.tag, ...ev(0) }
        break
      case "noop":
        break
      case "invoke":
        value = ev(0)()
        break
      case "mapError":
        value = ev(0)
        break
      case "isFailure":
        value = ev(0)._tag === "Failure"
        break
      case "boundary":
        value = (...xs) => {
          const fn = boundaries.get(n.data.target)
          if (!fn)
            throw Error("Frontera sin contrato suministrado " + n.data.target)
          const result = fn(...xs)
          record({
            node: id,
            operation: "external-boundary",
            target: n.data.target,
            arguments: xs.map(printable),
            result: printable(result),
            status: "pending-review"
          })
          return result
        }
        break
      case "boundaryCall": {
        const fn = boundaries.get(n.data.target)
        if (!fn)
          throw Error("Frontera sin contrato suministrado " + n.data.target)
        const xs = n.args.map((i) => evaluate(i, env))
        value = fn(...xs)
        record({
          node: id,
          operation: "external-boundary",
          target: n.data.target,
          arguments: xs.map(printable),
          result: printable(value),
          status: "pending-review"
        })
        break
      }
      case "assign": {
        value = ev(0)
        let owner = env
        while (owner && !owner.has(n.data.name)) owner = owner.parent
        if (!owner) throw Error("Asignación sin binding " + n.data.name)
        owner.set(n.data.name, value)
        break
      }
      case "forOf":
        for (const element of ev(0)) {
          const local = new Environment()
          local.parent = env
          bind(n.data.binding, element, local)
          evaluate(n.args[1], local)
        }
        break
      case "literal":
        value = n.data.value
        break
      case "regex":
        value = new RegExp(n.data.pattern, n.data.flags)
        break
      case "global":
        value = global(n.data.name)
        break
      case "local":
        let owner = env
        while (owner && !owner.has(n.data.name)) owner = owner.parent
        if (!owner) throw Error("Local sin binding " + n.data.name)
        value = owner.get(n.data.name)
        break
      case "function":
        value = (...xs) => {
          const local = new Environment()
          local.parent = env
          n.data.parameters.forEach((p, i) =>
            bind(
              p.binding,
              p.rest
                ? xs.slice(i)
                : xs[i] === undefined && p.default
                  ? evaluate(p.default, local)
                  : xs[i],
              local,
              (id) => evaluate(id, local)
            )
          )
          try {
            stack.push(n.id + "@" + ++invocation)
            record({
              node: n.id,
              operation: "function-enter",
              arguments: xs.map(printable)
            })
            return evaluate(n.args[0], local)
          } catch (e) {
            if (e?.[returned]) return e.value
            throw e
          } finally {
            stack.pop()
          }
        }
        break
      case "block": {
        const local = new Environment()
        local.parent = env
        for (const i of n.args) evaluate(i, local)
        value = undefined
        break
      }
      case "declarations":
        for (const i of n.args) evaluate(i, env)
        break
      case "bind":
        value = ev(0)
        bind(n.data.binding, value, env)
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
            record({
              node: id,
              operation: "collection-input",
              cardinality: receiver.length,
              elements: printable(receiver),
              seed: xs.length > 1 ? printable(xs[1]) : null
            })
          value = receiver[key](...xs)
        } else {
          const fn = ev(0)
          xs = many(n.args.slice(1))
          value = fn(...xs)
        }
        if (capture)
          record({
            node: id,
            operation: "call",
            arguments: xs.map(printable),
            result: printable(value)
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
      record({ node: id, operation: n.op, result: printable(value) })
    return value
  }
  const result = expression
    ? evaluate(expression, new Environment(bindings))
    : global(functionName)(...args)
  return { result, trace }
}

/** Ensayo condicionado. Los callbacks son contratos ajenos suministrados por el
 * llamante; nunca se convierten en admisión ni en revisión independiente. */
export function consumeEscalasR36(fragment, route, caso, contexto, boundaries) {
  if (!["annual", "explicit"].includes(route)) throw Error("Ruta no admitida")
  const entry =
    route === "annual"
      ? "lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts#liquidarTrabajoIndividualSimple"
      : "lib/dominio/irpf/trabajo-anual/conexion.ts#liquidarIrpfAnualExplicito"
  const result = executeEscalasR36(
    fragment,
    entry,
    route === "annual" ? [caso, {}, contexto] : [caso],
    true,
    null,
    [],
    boundaries
  )
  const lines = result.result.flat()
  if (
    lines.some(
      (l) =>
        !fragment.sites.some((s) => s.siteId === l.origen.siteId) ||
        l.origen.unidad !== "EUR"
    )
  )
    throw Error("Salida fuera del contrato")
  return {
    lines,
    trace: result.trace,
    admission: fragment.admissionInterface,
    siteClosed: false,
    completeRuleAcceptance: false,
    wiringAllowed: false,
    review: "pending-independent"
  }
}
