import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { Effect } from 'effect'
import Decimal from 'decimal.js'
import { liquidarIrpfAnualExplicito } from '../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const inputs = JSON.parse(readFileSync('.cache/anual-salarial-revision/entradas.json', 'utf8'))
const run = e => Effect.runSync(Effect.result(liquidarIrpfAnualExplicito(e)))
const records = []
for (const c of inputs) {
  const before = structuredClone(c.entrada)
  const got = run(c.entrada)
  assert.equal(got._tag, 'Success')
  const result = got.success
  for (const [key, value] of Object.entries(c.esperado)) {
    if (key === 'estatal' || key === 'madrid') continue
    assert.ok(new Decimal(result[key]).eq(value), `${c.nombre}:${key}`)
  }
  const lines = result.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
  assert.equal(lines.length, 15)
  for (const [suffix, expected] of [['cuota.estatal', c.esperado.estatal], ['cuota.autonomica', c.esperado.madrid], ['diferencial', result.cuotaDiferencial]]) {
    assert.ok(new Decimal(lines.find(l => l.origen.siteId === `anual.explicito.${suffix}`).origen.decimal).eq(expected))
  }
  assert.ok(lines.every(l => l.origen.unidad === 'EUR'))
  assert.deepEqual(c.entrada, before)
  records.push({ nombre: c.nombre, resultado: result })
}
const rejects = []
const base = inputs[0].entrada
const check = (name, mutate) => {
  const e = structuredClone(base)
  mutate(e)
  const got = run(e)
  assert.equal(got._tag, 'Failure', name)
  assert.equal(got.failure._tag, 'ResultadoNoSoportado')
  rejects.push({ nombre: name, resultado: got })
}
for (const value of [NaN, Infinity, -Infinity, 'NaN', 'Infinity', '1e3', '1.001', '1000000000000', '-1', 100, { cantidad: '100', unidad: 'centimos' }]) {
  check(`salario-${String(value)}`, e => { e.trabajo.rendimientos[0].integro = value })
  check(`retencion-${String(value)}`, e => { e.retenciones[0].importe = value })
}
check('rendimiento-duplicado', e => { e.trabajo.rendimientos = [e.trabajo.rendimientos[0], e.trabajo.rendimientos[0]] })
check('operacion-duplicada', e => { e.retenciones[1].operacionId = e.retenciones[0].operacionId })
check('vacio', e => { e.trabajo.rendimientos = [] })
check('101-rendimientos', e => { e.trabajo.rendimientos = Array.from({ length: 101 }, (_, i) => ({ ...e.trabajo.rendimientos[0], id: String(i) })) })
check('edad-no-finita', e => { e.edad = NaN })
check('foral', e => { e.trabajo.territorio = 'foral' })
check('otras-rentas', e => { e.otrasRentas = 'presentes' })
check('2026', e => { e.ejercicio = 2026 })
const equal = structuredClone(base)
equal.trabajo.rendimientos = [equal.trabajo.rendimientos[0], { ...equal.trabajo.rendimientos[0], id: 'otra-operacion' }]
assert.equal(run(equal)._tag, 'Success')
assert.equal(records[0].resultado.retenciones, '3000')
process.stdout.write(JSON.stringify({ recorridos: records, rechazos: rejects, igualesDistintosAdmitidos: true }, null, 2) + '\n')
