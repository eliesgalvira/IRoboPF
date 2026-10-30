import { createHash } from "node:crypto"
import { expect, test } from "vitest"
import { composeSS, inspectSS, validateSS } from "../scripts/procedencia/flujo-ss-r36.mjs"
import { createSSEvaluator } from "../scripts/procedencia/flujo-ss-r36-consumidor.mjs"
import { executeCausalSS, verifyCausalSS } from "../scripts/procedencia/causal-ss-r54.ts"
import type { Event } from "../scripts/procedencia/evidencia-ejecucion-r54.ts"

const g = composeSS()
const caso = { anio: 2025, rendimientos: { trabajo: [
  { importeIntegroCentimos: 1000000 }, { importeIntegroCentimos: 2000000 },
] } }
const contexto = { modo: "canonico" }
const authentic = () => executeCausalSS(g, caso, contexto, "r56-control").evidence

test("R55-N01: la API productora exige obligaciones satisfechas, igual que el adaptador", () => {
  const changed = structuredClone(g)
  const n = changed.program.find(n => n.op === "literal" && n.data.value === "0.236")
  if (n === undefined) throw Error("Literal nominal ausente")
  n.data.value = "0.999"
  changed.pending = ["program:" + n.id]
  Object.assign(changed, inspectSS(changed, g))
  expect(validateSS(changed)).toBe(true)
  expect(() => createSSEvaluator(changed)).toThrow(/Obligaciones pendientes/)
  expect(() => executeCausalSS(changed, caso, contexto)).toThrow(/obligaciones pendientes/)
})

test("R55-N01: el consumidor rechaza un pendiente explícito aunque las operaciones sean auténticas", () => {
  const pending = structuredClone(g)
  pending.pending = [g.obligations[0].id]
  Object.assign(pending, inspectSS(pending, g))
  expect(validateSS(pending)).toBe(true)
  const evidence = authentic()
  // Solo el sobre del programa cambia: su IR y las operaciones del testigo siguen intactas.
  evidence.program = createHash("sha256").update(JSON.stringify(pending)).digest("hex")
  expect(() => verifyCausalSS(pending, evidence, caso, contexto, evidence.execution))
    .toThrow(/obligaciones pendientes/)
})

for (const [site, side] of [
  ["empresarial-ordinaria", "empresarial"],
  ["trabajador-ordinaria", "trabajador"],
  ["empresarial-total", "empresarial"],
  ["trabajador-total", "trabajador"],
  ["coste-laboral", "empresarial"],
] as const) {
  test(`R55-N02: ${site} conserva cinco celdas propias y ninguna del lado contrario`, () => {
    const evidence = authentic()
    const output = evidence.outputs.find(o => o.siteId === "anual.ss." + site)
    if (output === undefined) throw Error("Salida ausente")
    const ids = new Set(output.slice)
    const nodes = new Set(evidence.events.filter(e => ids.has(e.id)).map(e => e.node))
    const reached = g.cells.filter(c => c.path.includes("TIPOS_SEGURIDAD_SOCIAL_LEGACY") && nodes.has(c.id))
    expect(reached.filter(c => c.path.at(-1) !== side)).toEqual([])
    expect(reached.filter(c => c.path.at(-1) === side)).toHaveLength(5)
    expect(verifyCausalSS(g, evidence, caso, contexto, evidence.execution)).toBe(true)
  })
}

for (const salaries of [[], [100, 100], [100, 200]]) {
  test(`R56: estructura de colección para ${JSON.stringify(salaries)}`, () => {
    const input = { anio: 2025, rendimientos: { trabajo: salaries.map(importeIntegroCentimos => ({ importeIntegroCentimos })) } }
    const evidence = executeCausalSS(g, input, contexto).evidence
    for (const selection of evidence.events.filter(e => e.operation === "collection-selection")) {
      const elements = selection.edges.filter(e => e.role.startsWith("identity:element:"))
      expect(elements).toHaveLength(Number(selection.value))
      expect(selection.edges.filter(e => e.role === "identity:receiver")).toHaveLength(1)
      expect(selection.edges.filter(e => e.role === "seed")).toHaveLength(1)
      expect(selection.edges.filter(e => e.role === "callback")).toHaveLength(1)
    }
    expect(verifyCausalSS(g, evidence, input, contexto, evidence.execution)).toBe(true)
  })
}

const structureMutations: [string, (selection: Event) => void][] = [
  ["receptor ausente", e => { e.edges = e.edges.filter(x => x.role !== "identity:receiver") }],
  ["miembro ausente", e => { e.edges = e.edges.filter(x => x.role !== "identity:element:0") }],
  ["cardinalidad falsa", e => { e.value = 3 }],
  ["orden falseado", e => {
    const member = e.edges.find(x => x.role === "identity:element:0")
    if (member === undefined) throw Error("Miembro ausente")
    member.role = "identity:element:1"
  }],
  ["misma cuantía con otro productor", e => {
    const first = e.edges.find(x => x.role === "identity:element:0")
    const second = e.edges.find(x => x.role === "identity:element:1")
    if (first === undefined || second === undefined) throw Error("Miembros ausentes")
    first.to = second.to
  }],
]
for (const [label, mutate] of structureMutations) {
  test(`R56: ${label} se rechaza aunque conserve todos los importes`, () => {
    const input = { anio: 2025, rendimientos: { trabajo: [
      { importeIntegroCentimos: 100 }, { importeIntegroCentimos: 100 },
    ] } }
    const evidence = executeCausalSS(g, input, contexto).evidence
    const selection = evidence.events.find(e => e.operation === "collection-selection" && e.value === 2)
    if (selection === undefined) throw Error("Colección salarial ausente")
    const financialOutputs = structuredClone(evidence.outputs)
    mutate(selection)
    expect(evidence.outputs).toEqual(financialOutputs)
    expect(() => verifyCausalSS(g, evidence, input, contexto, evidence.execution)).toThrow(/Evidencia insuficiente/)
  })
}
