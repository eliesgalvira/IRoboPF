import {executeCausalSS} from './causal-ss-r54.ts'
import {validateSS} from './flujo-ss-r36.mjs'
import { createRequire } from "node:module"
const require = createRequire("/home/elies/Repos/IRoboPF/package.json")
const Decimal = require("decimal.js")
const { Match, Array: EffectArray } = require("effect")
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
function bind(pattern, value, env) {
  if (pattern.name) env.set(pattern.name, value)
  else for (const f of pattern.fields) bind(f.binding, value[f.key], env)
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
export function executeFinite(
  fragment,
  functionName,
  args,
  capture = true,
  expression = null,
  bindings = []
) {
  const nodes = new Map(fragment.program.map((n) => [n.id, n]))
  const globals = new Map(fragment.globalBindings.map((b) => [b.name, b.node]))
  const values = new Map(
    Object.entries({
      Decimal,
      EffectArray,
      Object,
      medirAuditoriaSync: (_etapa, calcular) => calcular(),
      Match,
      Number,
      Array,
      Math,
      Error,
      undefined,
      Infinity,
      Effect: {
        annotateCurrentSpan: () => undefined,
        fail: (x) => {
          throw Error("ResultadoNoSoportado: " + x.motivo)
        },
      },
    })
  )
  const trace = []
  function global(name) {
    if (!values.has(name)) {
      const id = globals.get(name)
      if (!id) throw Error("Global sin resolver " + name)
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
          ? evaluate(nodes.get(i).args[0], env)
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
        break
      case "local":
        if (!env.has(n.data.name))
          throw Error("Local sin binding " + n.data.name)
        value = env.get(n.data.name)
        break
      case "function":
        value = (...xs) => {
          if(capture)trace.push({node:id,operation:"invocation",parameters:n.data.parameters,arguments:xs.map(printable),captures:[...env].map(([name,v])=>({name,value:printable(v)}))})
          const local = new Map(env)
          n.data.parameters.forEach((p, i) =>
            bind(
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
            return evaluate(n.args[0], local)
          } catch (e) {
            if (e?.[returned]) return e.value
            throw e
          }
        }
        break
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
            trace.push({
              node: id,
              operation: "collection-input",
              cardinality: receiver.length,
              elements: printable(receiver),
              seed: xs.length > 1 ? printable(xs[1]) : null,
            })
          if(capture && receiver===EffectArray && key==='reduce') {
            const original=xs[2];let index=0
            trace.push({node:id,operation:'reduce-frame',cardinality:xs[0].length,seed:printable(xs[1]),order:'0..length-1'})
            xs[2]=(...args)=>{trace.push({node:id,operation:'reduce-index',index:index++,arguments:args.map(printable)});return original(...args)}
          }
          value = receiver[key](...xs)
        } else {
          const fn = ev(0)
          xs = many(n.args.slice(1))
          value = fn(...xs)
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
    ? evaluate(expression, new Map(bindings))
    : global(functionName)(...args)
  return { result, trace }
}


// Consumidor técnico: el dominio numérico no sustituye la admisión anual externa.
export function createSSEvaluator(candidate) {
  validateSS(candidate)
  const g=structuredClone(candidate)
  if(g.obligations.some(o=>o.status!=='satisfied'))throw Error('Obligaciones pendientes')
  const causal=(caso,contexto)=>({...executeCausalSS(g,caso,contexto),admission:'required-anual-publico-r32',siteClosed:false,wiringAllowed:false})
  const legacy=(caso,contexto,capture=false)=>{
    if(!Number.isInteger(caso.anio)||caso.anio<2012||caso.anio>2026||!['canonico','compatible-legacy'].includes(contexto.modo))throw Error('Fuera del dominio técnico; admisión externa requerida')
    const locals=new Map([['caso',caso],['contexto',contexto]]),trace=[]
    for(const b of g.annualBindings){const r=executeFinite(g,null,[],capture,b.node,[...locals]);locals.set(b.name,r.result);trace.push(...r.trace)}
    const transport=[]
    const lines=g.outputBindings.map(b=>{const r=executeFinite(g,null,[],capture,b.node,[...locals]);transport.push({siteId:b.siteId,instance:b.instance,unit:b.unit,expression:b.amount,destination:b.destination,decimal:r.result.origen.decimal,trace:r.trace});trace.push(...r.trace);return r.result})
    return {lines,transport,trace,admission:'required-anual-publico-r32',siteClosed:false,wiringAllowed:false}
  }
  /**
   * Cada modo conserva su resultado; la captura booleana sigue ofreciendo trace.
   * @overload
   * @param {unknown} caso Entrada externa: el adaptador conserva la validación de cada modo.
   * @param {unknown} contexto
   * @param {boolean} [capture]
   * @returns {ReturnType<typeof legacy>}
   */
  /**
   * @template {import('./causal-ss-r54.ts').SSCase} TCase
   * @overload
   * @param {TCase} caso
   * @param {import('./causal-ss-r54.ts').SSContext} contexto
   * @param {'causal'} capture
   * @returns {ReturnType<typeof causal>}
   */
  /**
   * @overload
   * @param {unknown} caso
   * @param {unknown} contexto
   * @param {boolean | 'causal'} capture
   * @returns {ReturnType<typeof legacy> | ReturnType<typeof causal>}
   */
  /**
   * @param {unknown} caso
   * @param {unknown} contexto
   * @param {boolean | 'causal'} [capture]
   */
  function evaluate(caso,contexto,capture=false) {
    return capture==='causal' ? causal(caso,contexto) : legacy(caso,contexto,capture)
  }
  return evaluate
}
