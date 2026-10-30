import { expect, test } from "vitest"
import { composeSS, inspectSS, validateSS } from "../scripts/procedencia/flujo-ss-r36.mjs"
import { createSSEvaluator } from "../scripts/procedencia/flujo-ss-r36-consumidor.mjs"

interface Origin { decimal: string; siteId: string; instanceId: string; unidad: string }
interface OutputLine { origen: Origin }
const graph = composeSS()
const run = createSSEvaluator(graph)
const sample = { anio: 2025, rendimientos: { trabajo: [{ importeIntegroCentimos: 10000000 }] } }

test("once recorridos hasta decimal y admisión externa sin aceptación", () => {
  expect(graph.sites).toHaveLength(11)
  expect(graph.sites.every(s => s.valueClosed && s.selectionClosed && !s.siteClosed && !s.admissionClosed)).toBe(true)
  const result = run(sample, { modo: "canonico" }, true)
  expect(result.lines.map((l: OutputLine) => l.origen.decimal)).toEqual(["58914", "41086", "18498.996", "3741.039", "394.7238", "76.5882", "354.92246", "70.99372", "19248.64226", "3888.62092", "119248.64226"])
  expect(result.lines.every((l: OutputLine) => l.origen.instanceId === l.origen.siteId + ".0" && l.origen.unidad === "EUR")).toBe(true)
  expect(result.trace.some(t => t.operation === "reduce-index" && t.index === 0)).toBe(true)
  expect(result.admission).toBe("required-anual-publico-r32")
})

const mutations = [
  ["semilla 0→1 sin cambiar aristas", (g: typeof graph) => { g.program.find(n => n.op === "literal" && n.source.file.endsWith("rendimientos-trabajo.ts") && n.data.value === 0).data.value = 1 }],
  ["rama omitida coherentemente", (g: typeof graph) => { const n = g.program.find(n => n.op === "conditional"); n.args[1] = n.args[2] }],
  ["literal igual de otra instancia", (g: typeof graph) => { const ns = g.program.filter(n => n.op === "literal" && n.data.value === 12); ns[0].source = ns[1].source }],
  ["índice de celda", (g: typeof graph) => { const n = g.program.find(n => n.op === "index" && n.source.file.endsWith("cotizaciones-perfil-uniforme.ts")); n.args[1] = g.program.find(p => p.op === "literal" && p.data.value === 1).id }],
  ["unidad", (g: typeof graph) => { g.unitContracts[0].result = "centimos" }],
  ["unidad de propiedad", (g: typeof graph) => { const f = g.fieldUnits.find(f => f.key === "importeIntegroCentimos"); if(f === undefined) throw Error("Campo ausente"); f.unit = "EUR" }],
  ["binding anual", (g: typeof graph) => { g.annualBindings.pop() }],
  ["callback", (g: typeof graph) => { g.program.find(n => n.op === "function" && n.data.parameters.length === 2).data.parameters.reverse() }],
  ["condición año MEI", (g: typeof graph) => { g.program.find(n => n.op === "literal" && n.data.value === 2023).data.value = 2024 }],
  ["celda solidaridad", (g: typeof graph) => { const c = g.cells.find(n => n.path.includes("tiposSolidaridad")); if(c === undefined) throw Error("Celda ausente"); c.value = "0.99" }],
  ["transporte de salida", (g: typeof graph) => { g.outputBindings[0].amount = g.outputBindings[1].amount }],
  ["instancia", (g: typeof graph) => { g.outputBindings[0].instance = g.outputBindings[0].amount }],
  ["calls omitidas", (g: typeof graph) => { g.calls = [] }],
] as const
for (const [name, mutate] of mutations) test("discriminante semántico sin pin: " + name, () => {
  const g = structuredClone(graph)
  mutate(g)
  const derived = inspectSS(g)
  expect(derived.obligations.some(o => o.status === "pending")).toBe(true)
  expect(derived.sites.every(s => !s.valueClosed && !s.selectionClosed)).toBe(true)
  expect(() => validateSS(g)).toThrow()
})

test("pending explícito representable y consumidor bloqueado", () => {
  const g = structuredClone(graph)
  g.pending = [g.obligations[0].id]
  Object.assign(g, inspectSS(g))
  expect(validateSS(g)).toBe(true)
  expect(() => createSSEvaluator(g)).toThrow("pendientes")
})

test("copia privada, índices múltiples/repetidos y memoria por caso", () => {
  const copy = structuredClone(graph), evaluate = createSSEvaluator(copy)
  copy.program.length = 0
  const a = { anio: 2018, rendimientos: { trabajo: [{ importeIntegroCentimos: 1234567 }, { importeIntegroCentimos: 1234567 }, { importeIntegroCentimos: 1 }] } }
  const before = evaluate(a, { modo: "canonico" })
  evaluate(sample, { modo: "compatible-legacy" })
  expect(evaluate(a, { modo: "canonico" })).toEqual(before)
  expect(before.lines[0].origen.decimal).toBe("24691.35")
})

test("2018 conserva siete/cinco meses y saturaciones separadas", () => {
  const a = { anio: 2018, rendimientos: { trabajo: [{ importeIntegroCentimos: 4524000 }] } }
  expect(run(a, { modo: "canonico" }).lines[0].origen.decimal).toBe("45108.4")
  expect(run(a, { modo: "compatible-legacy" }).lines[0].origen.decimal).toBe("45014.4")
})

test("dominio técnico limitado sin admitir fiscalmente", () => {
  expect(() => run({ ...sample, anio: 2027 }, { modo: "canonico" })).toThrow("dominio")
  expect(() => run(sample, { modo: "otro" })).toThrow("dominio")
})

test("tabla por ejercicio/lado/tramo y runtime tags separados del tipo", () => {
  const cells = graph.cells.filter(c => c.path.includes("tiposSolidaridad"))
  expect(cells).toHaveLength(12)
  for (const year of ["2025", "2026"]) for (const side of ["empresa", "trabajador"]) {
    const selected = cells.filter(c => c.path.includes(year) && c.path.includes(side))
    expect(selected).toHaveLength(3)
    expect(selected.map(c => c.path.find((p: string) => p.startsWith("index:")))).toEqual(["index:0", "index:1", "index:2"])
  }
  const mei = graph.cells.filter(c => c.path.includes("obtenerTiposMei"))
  for (const year of [2023, 2024, 2025]) for (const side of ["empresarial", "trabajador"]) {
    expect(mei.filter(c => c.path.includes("when:" + year) && c.path.includes(side))).toHaveLength(1)
  }
  const tags = graph.cells.filter(c => c.value === "ConSolidaridad")
  expect(tags).toHaveLength(2)
  expect(tags.every(c => c.path.includes("obtenerPoliticaSolidaridad") && c.path.includes("_tag"))).toBe(true)
})

test("fuente de igual texto en el otro modo abre el cierre", () => {
  const g = structuredClone(graph)
  const a = g.program.find(n => n.op === "literal" && n.data.value === "empresarial" && n.source.file.endsWith("cotizaciones-sociales.ts"))
  const b = g.program.find(n => n.op === "literal" && n.data.value === "empresarial" && n.source.file.endsWith("cotizaciones-perfil-uniforme.ts"))
  a.source = b.source
  expect(inspectSS(g).sites.every(s => !s.valueClosed)).toBe(true)
})

test("selección de propiedad efectiva de salida no se confunde con cifra", () => {
  const g = structuredClone(graph)
  const node = g.program.find(n => n.op === "get" && n.source.file.endsWith("liquidar-irpf-anual.ts") && n.data.key === "baseOrdinaria")
  node.data.key = "excesoBase"
  expect(inspectSS(g).sites.every(s => !s.selectionClosed)).toBe(true)
})
