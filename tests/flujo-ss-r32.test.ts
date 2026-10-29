import { expect, test } from "vitest"
import Decimal from "decimal.js"
import { composeSS, createSSEvaluator, validateSS, traceSSClosure } from "../scripts/procedencia/flujo-ss-r32.mjs"
import { calcularDesgloseCotizacionesSocialesLegacy } from "../lib/dominio/laboral/cotizaciones-sociales"
import { calcularDesgloseCotizacionesPerfilUniforme } from "../lib/dominio/laboral/cotizaciones-perfil-uniforme"
import { sumarRendimientosTrabajo } from "../lib/dominio/irpf/rendimientos/rendimientos-trabajo"
import { centimosAEuros } from "../lib/dominio/dinero/importe-monetario"
import type { AnioFiscal } from "../lib/dominio/normativa/anio-fiscal"
import { Sources } from "../scripts/procedencia/flujo-ast.mjs"

const graph = composeSS()
const execute = createSSEvaluator(graph)
const fields = ["baseOrdinaria", "excesoBase", "cotizacionEmpresarialOrdinaria", "cotizacionTrabajadorOrdinaria", "meiEmpresarial", "meiTrabajador", "solidaridadEmpresarial", "solidaridadTrabajador", "cotizacionEmpresarial", "cotizacionTrabajador"] as const
const years: readonly AnioFiscal[] = [2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026]
const modes = ["canonico", "compatible-legacy"] as const

for (const anio of years) {
  for (const modo of modes) {
    test(`TS real: ${anio}/${modo}, vacío, múltiples, topes y bandas`, () => {
      const max = anio === 2025 ? 58914 : anio === 2026 ? 61214.4 : 45014.4
      const salaries = [0, 1, 123.45, 45014.39, 45014.4, 45014.41, 45240, 45644.39, 45644.4, 45644.41, max, max*1.1-0.01, max*1.1, max*1.1+0.01, max*1.5-0.01, max*1.5, max*1.5+0.01, 100000]
      for (const salario of salaries) {
        for (const amounts of [[], [Math.round(salario*100)], [123, 456, Math.round(salario*100)]]) {
          const trabajo = amounts.map(importeIntegroCentimos => ({importeIntegroCentimos}))
          const bruto = sumarRendimientosTrabajo(trabajo, centimosAEuros)
          const real = (modo === "canonico" ? calcularDesgloseCotizacionesPerfilUniforme : calcularDesgloseCotizacionesSocialesLegacy)({anio, salarioBrutoAnual: bruto})
          const result = execute({anio, rendimientos:{trabajo}}, {modo})
          fields.forEach((field, i) => {
            const site = graph.sites[i]
            if (site === undefined) throw Error("Sitio ausente")
            expect(new Decimal(result[site.siteId]).minus(real[field]).abs().lt("0.000000000001")).toBe(true)
          })
          expect(new Decimal(result["anual.ss.coste-laboral"]).eq(bruto.plus(real.cotizacionEmpresarial))).toBe(true)
        }
      }
    })
  }
}

test("Once salidas con selección y valor; admisión separada", () => {
  expect(graph.sites).toHaveLength(11)
  expect(graph.unresolved).toEqual([])
  for (const site of graph.sites) {
    expect(site.valueClosed).toBe(true)
    expect(site.selectionClosed).toBe(true)
    expect(site.siteClosed).toBe(false)
    expect(site.admissionRequirement).toBe("anual-publico-r32")
  }
  expect(graph.completeRuleAcceptance).toBe(false)
  expect(graph.wiringAllowed).toBe(false)
})

test("No hay funciones financieras terminales y cada operación tiene fuente", () => {
  const allowed = ["literal","input","element","accumulator","reduce","if","eq","gte","lte","plus","minus","mul","div","min","max"]
  for (const p of graph.ports) {
    expect(allowed).toContain(p.op)
    expect(graph.sources.some(s=>s.id===p.source)).toBe(true)
    if (p.op === "input") expect(["caso.anio","contexto.modo","caso.rendimientos.trabajo"]).toContain(p.detail.path)
  }
})

test("Rechaza alteración de dependencia, rama, campo, unidad y omisión", () => {
  const mutations = [
    (g: typeof graph) => {g.ports.find(p=>p.op === "element").detail.property = "otroCampo"},
    (g: typeof graph) => {g.ports.find(p=>p.op === "literal" && p.detail.value === "100").detail.value = "10"},
    (g: typeof graph) => {g.ports.find(p=>p.op === "if").args.reverse()},
    (g: typeof graph) => {g.ports.find(p=>p.op === "reduce").args.pop()},
    (g: typeof graph) => {g.ports.find(p=>p.op === "mul").unit = "centimos"},
    (g: typeof graph) => {g.sites[0].siteClosed = true},
    (g: typeof graph) => {g.edges.pop()},
  ]
  for (const mutate of mutations) {
    const copy = structuredClone(graph)
    mutate(copy)
    expect(() => validateSS(copy)).toThrow("contrato reconstruido")
  }
})

test("El contrato usa bytes de fuente, no hashes autodeclarados", () => {
  const sources = new Sources()
  for (const source of graph.sources) {
    expect(sources.exact(source).getText()).toBe(source.text)
  }
  const copy = structuredClone(graph)
  copy.sources[0].sha256 = "0".repeat(64)
  expect(()=>validateSS(copy)).toThrow()
})

test("Las sumas, extremos y ramas conservan unidad; parámetros de callback ligados", () => {
  const byId = new Map(graph.ports.map(p=>[p.id,p]))
  for (const p of graph.ports) {
    if (["plus","minus","min","max"].includes(p.op)) {
      for (const id of p.args) expect(byId.get(id)?.unit).toBe(p.unit)
    }
    if (p.op === "if") {
      expect(byId.get(p.args[0])?.unit).toBe("boolean")
      expect(byId.get(p.args[1])?.unit).toBe(p.unit)
      expect(byId.get(p.args[2])?.unit).toBe(p.unit)
    }
    if (p.op === "element") expect(p.detail.array).toBeDefined()
    if (p.op === "accumulator") expect(p.detail.seed).toBeDefined()
  }
  for (const binding of graph.bindings) {
    const call = graph.sources.find(s=>s.id===binding.call)
    if (call === undefined) throw Error("Llamada sin fuente")
    for (const argId of binding.arguments) {
      const arg = graph.sources.find(s=>s.id===argId)
      if (arg === undefined) throw Error("Argumento sin fuente")
      expect(arg.file).toBe(call.file)
      expect(arg.start).toBeGreaterThanOrEqual(call.start)
      expect(arg.end).toBeLessThanOrEqual(call.end)
    }
  }
})

test("El selector anual real transporta año y salario a ambas funciones", () => {
  const binding = graph.bindings.find(b => b.callee.includes("contexto.modo") && b.callee.includes("calcularDesgloseCotizacionesPerfilUniforme") && b.callee.includes("calcularDesgloseCotizacionesSocialesLegacy"))
  if (binding === undefined) throw Error("No se transportó la llamada condicional anual")
  const arg = graph.sources.find(s=>s.id===binding.arguments[0])
  expect(arg?.text).toContain("anio: caso.anio")
  expect(arg?.text).toContain("salarioBrutoAnual: rendimientoIntegroTrabajo")
  const seed = graph.ports.find(p=>p.op==="reduce")
  expect(seed?.detail.order).toBe("i=0..length-1")
  const indexes = graph.ports.filter(p=>p.detail?.parameter?.startsWith("cuotaSolidaridad.tipos"))
  expect(indexes).toHaveLength(12)
  expect(new Set(indexes.map(p=>p.detail.index))).toEqual(new Set([0,1,2]))
})

test("El cierre se deriva del recorrido y detecta un callback sin enlace", () => {
  for (const c of graph.closures) {
    expect(c.closed).toBe(true)
    expect(c.terminals.length).toBeGreaterThan(0)
    expect(c.unresolved).toEqual([])
  }
  const copy = structuredClone(graph)
  copy.ports.find(p=>p.op==="element").detail.property = "campoAjeno"
  for (const site of copy.sites) expect(traceSSClosure(copy,site.output).closed).toBe(false)
})
