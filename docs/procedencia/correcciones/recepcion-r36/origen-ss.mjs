import assert from 'node:assert/strict'
import { composeSS } from '../../../../scripts/procedencia/flujo-ss-r32.mjs'
import { Sources, ts } from '../../../../scripts/procedencia/flujo-ast.mjs'
const g = composeSS(), sources = new Sources(), rows = []
const byId = new Map(g.ports.map(p => [p.id, p]))
function check(port, owner, literal) {
  const ref = g.sources.find(s => s.id === port.source)
  const n = sources.exact(ref), ancestors = []
  for (let p = n.parent; p; p = p.parent)
    if (ts.isVariableDeclaration(p) || ts.isFunctionDeclaration(p)) ancestors.push(p.name?.getText())
  const passed = ancestors.includes(owner) && n.getText() === literal
  rows.push({port:port.id, source:ref, owner, literal, ancestors, passed})
}
const reducer = g.ports.find(p => p.op === 'reduce')
check(byId.get(byId.get(reducer.args[1]).args[0]), 'sumarRendimientosTrabajo', '0')
for (const value of ['0.1','0.5']) {
  const port = g.ports.find(p => p.op === 'literal' && p.detail.value === value)
  check(port, 'calcularTotalSolidaridad', JSON.stringify(value + '0'))
}
console.log(JSON.stringify(rows, null, 2))
assert.ok(rows.every(r => r.passed), 'Origen concreto de semilla y bandas legacy')
