import { readFileSync } from 'node:fs'
import ts from 'typescript'
import Ajv from 'ajv'
import { describe, expect, it } from 'vitest'
import { compileAdmissionGraph } from '../scripts/procedencia/flujo-admision-r36-compilador.mjs'
import { executeAdmissionGraph } from '../scripts/procedencia/flujo-admision-r36-runtime.mjs'
import { verifyCompleteAdmission } from '../scripts/procedencia/flujo-admision-r36-verificador.mjs'
import { siteIds } from '../scripts/procedencia/flujo-admision-r32.mjs'

const path = 'tests/fixtures/admision-r36-try.ts'
const source = readFileSync(new URL('./fixtures/admision-r36-try.ts', import.meta.url), 'utf8')
const names = ['sinTry', 'conCatch', 'conFinally', 'conTodo', 'condicional']
const schema = JSON.parse(readFileSync(new URL('../schemas/procedencia/flujo/admision-r36.schema.json', import.meta.url), 'utf8'))
const validateGraph = new Ajv({ allErrors: true, strict: false }).compile({ ...schema.properties.graph, $defs: schema.$defs })

// Se aísla el grafo: esta fixture no simula contratos monetarios ni servicios.
// El validador de producción sigue exigiendo el artefacto completo.
const verify = f => verifyCompleteAdmission(f, candidate => validateGraph(candidate.graph))

function fragment(graph = compileAdmissionGraph(names.map(name => ({ path, name })))) {
  return {
    edition: 'admision-r36', graph,
    rights: { programs: [], anchors: [], schemas: {}, sources: [], boundaries: [] },
    boundaries: [], conversions: [], services: [],
    sites: siteIds.map(siteId => ({ siteId, admissionClosed: false, siteClosed: false })),
    wiringAllowed: false, completeRuleAcceptance: false,
  }
}

const controls = graph => graph.definitions.flatMap(d => d.value.body.filter(n => n.op === 'pending-control'))

describe('frontera de TryStatement en admisión R36', () => {
  it('compila las tres formas con anclas del try completo y valida el grafo con el schema publicado', () => {
    const f = fragment()
    expect(verify(f)).toBe(true)
    expect(controls(f.graph)).toHaveLength(4)
    for (const n of controls(f.graph)) {
      const a = f.graph.anchors.find(a => a.id === n.id)
      const text = source.slice(a.start, a.end)
      expect(a.path).toBe(path)
      expect(text.startsWith('try')).toBe(true)
      expect(text.endsWith('}')).toBe(true)
      expect(n).toEqual({ id: n.id, op: 'pending-control', syntax: 'TryStatement' })
    }
    expect(f.wiringAllowed).toBe(false)
    expect(f.completeRuleAcceptance).toBe(false)
    expect(f.sites.every(s => !s.siteClosed && !s.admissionClosed)).toBe(true)
  })

  it.each(['conCatch', 'conFinally', 'conTodo'])('%s queda pendiente antes de ejecutar try, catch o finally', entry => {
    const f = fragment(), pasos = []
    const result = executeAdmissionGraph(f, entry, [pasos])
    expect(result.outcome).toBe('pending')
    expect(result.reason).toContain('TryStatement')
    expect(result.value).toBeUndefined()
    expect(result.sites).toEqual([])
    expect(result.trace.at(-1).op).toBe('pending-control')
    expect(pasos).toEqual(entry === 'conTodo' ? ['antes'] : [])
  })

  it('conserva los recorridos que no alcanzan try', () => {
    const f = fragment()
    expect(executeAdmissionGraph(f, 'sinTry', [])).toMatchObject({ outcome: 'success', value: 7 })
    expect(executeAdmissionGraph(f, 'condicional', [false])).toMatchObject({ outcome: 'success', value: 19 })
    expect(executeAdmissionGraph(f, 'condicional', [true]).outcome).toBe('pending')
  })

  it('no permite liberar el pendiente mediante evidencia externa', () => {
    const f = fragment(), node = controls(f.graph)[0]
    const result = executeAdmissionGraph(f, 'conCatch', [], {
      values: { [node.id]: { outcome: 'success', value: 41 } },
      selections: { [node.id]: true },
    })
    expect(result.outcome).toBe('pending')
    expect(result.reason).toContain('TryStatement')
    expect(result.value).toBeUndefined()
  })

  it('rechaza una frontera vinculada a otro nodo AST válido', () => {
    const f = fragment(), n = controls(f.graph)[0]
    const sf = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true)
    const statement = sf.statements[0].body.statements[0]
    const anchor = f.graph.anchors.find(a => a.id === n.id)
    anchor.start = statement.getStart(sf)
    anchor.end = statement.end
    expect(() => verify(f)).toThrow(/TryStatement/)
  })

  it('el contrato cerrado rechaza otros tipos de control y campos añadidos', () => {
    for (const change of [n => { n.syntax = 'SwitchStatement' }, n => { n.value = 0 }]) {
      const f = fragment()
      change(controls(f.graph)[0])
      expect(() => verify(f)).toThrow()
    }
  })

  it('la función real de deducciones compila y conserva el pendiente', () => {
    const real = 'lib/dominio/irpf/deducciones/castilla-y-leon-hechos-2025.ts'
    const f = fragment(compileAdmissionGraph([{ path: real, name: 'ejecutar' }]))
    expect(verify(f)).toBe(true)
    expect(executeAdmissionGraph(f, 'ejecutar', [])).toMatchObject({ outcome: 'pending', sites: [] })
  })

  it('mantiene el rechazo explícito de otras sentencias no traducidas', () => {
    expect(() => compileAdmissionGraph([{ path, name: 'switchSinRepresentar' }])).toThrow(/SwitchStatement/)
  })
})
