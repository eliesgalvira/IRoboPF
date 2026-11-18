// Diagnóstico; no selecciona ni instala una política fiscal.
// timeout -k 5s 90s bun tools/procedencia/simuladores/pension432.mjs ROOT OUTPUT [FRONTERAS_ROOT]
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'

const [rootArg, output, fronterasArg] = process.argv.slice(2)
assert(rootArg && output, 'Se requieren ROOT y OUTPUT')
const root = resolve(rootArg)
const require = createRequire(join(root, 'package.json'))
const { Effect, Schema } = require('effect')
const Decimal = require('decimal.js')
const load = p => import(pathToFileURL(join(root, p)).href)
const { liquidarIrpfAnualExplicito } = await load('lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts')
const { CasoFiscalAnualExplicito } = await load('lib/dominio/irpf/trabajo-anual/conexion-contrato.ts')
const { cuantizarAnual } = await load('lib/dominio/irpf/liquidacion/composicion-anual.ts')
const { calcularCuotaPorEscala } = await load('lib/dominio/irpf/cuotas/escalas-gravamen.ts')
const { rawPdfRows } = await load('tools/procedencia/simuladores/prospectivos-pdf-reader.mjs')
const json = p => JSON.parse(readFileSync(p, 'utf8'))
const hash = p => createHash('sha256').update(readFileSync(p)).digest('hex')
const D = Decimal.clone({ precision: 80 })
// Reutiliza la operación común; el nombre de política sólo sirve para obtener
// su operación aritmética pura. No se pasa a una liquidación de pensiones.
const q = v => cuantizarAnual(new D(v), 'open-cuotas-empleo-andalucia-2025')
const suites = [{ name: 'pensiones-prospectivas-2025', root }]
if (fronterasArg) suites.push({ name: 'pensiones-fronteras-2025', root: resolve(fronterasArg) })
const rows = [], evidence = []
for (const suite of suites) {
  const dir = `docs/procedencia/simuladores/${suite.name}`
  const read = rel => {
    const path = `${dir}/${rel}`, abs = join(suite.root, path)
    evidence.push({ path, sha256: hash(abs) })
    return json(abs)
  }
  const H = read('hechos-previos.json'), P = read('predicciones-previas.json')
  for (const row of H.casos) {
    const correspondence = read(`${row.id}/correspondencias.json`)
    const pdf = join(suite.root, dir, row.id, 'captura.pdf')
    const seal = correspondence.pdfSHA256 ?? read(`${row.id}/recibo-original.json`).pdfSha256
    assert.equal(hash(pdf), seal)
    evidence.push({ path: `${dir}/${row.id}/captura.pdf`, sha256: hash(pdf) })
    const boxes = {}
    for (const line of rawPdfRows(readFileSync(pdf))) {
      const m = / (-?[\d.]+,\d{2}) (\d{4})$/.exec(line.text)
      if (m) {
        const value = m[1].replaceAll('.', '').replace(',', '.')
        if (boxes[m[2]] !== undefined) assert.equal(boxes[m[2]], value, 'repetición PDF contradictoria')
        boxes[m[2]] = value
      }
    }
    for (const cell of correspondence.cells ?? []) assert.equal(boxes[cell.box], cell.value)
    const c = Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(row.entrada)
    assert.equal(c.perfil, 'solo-trabajo')
    assert(c.trabajo.rendimientos.every(r => r.clase === 'pension'))
    for (const key of ['mutualidadesDT2', 'serviciosLaborales2025', 'otrosPagadores', 'otrasRentas', 'familiares', 'discapacidad', 'ingresosExentos'])
      assert.equal(row.hechos[key], key === 'serviciosLaborales2025' || key === 'otrosPagadores' || key === 'familiares' || key === 'ingresosExentos' ? 'ninguno' : 'ninguna')
    const r = Effect.runSync(liquidarIrpfAnualExplicito(c))
    const frozen = P.casos.find(x => x.id === row.id).result
    for (const key of ['baseImponibleGeneral', 'baseLiquidableGeneral', 'reduccionArt20', 'cuotaPosterior', 'cuotaDiferencialPresentada']) assert.equal(r[key], frozen[key])
    assert.deepEqual(r.componentesCuota, frozen.componentesCuota)
    assert.equal(r.deduccionTrabajo, '0')
    const g = r.componentesCuota
    const est = new D(g.gravamenEstatal).minus(g.gravamenMinimoEstatal)
    const aut = new D(g.gravamenAutonomico).minus(g.gravamenMinimoAutonomico)
    assert(est.eq(g.cuotaEstatal) && aut.eq(g.cuotaAutonomica))
    assert(est.plus(aut).eq(r.cuotaPosterior))
    assert(new D(r.cuotaPosterior).minus(r.retenciones).eq(r.cuotaDiferencial))
    assert.equal(new D(r.rendimientoNetoReducido).toFixed(2), boxes['0025'])
    const lines = r.rastro.pasos.flatMap(p => p.lineasCalculo ?? [])
    for (const [site, value] of [['cuota.estatal', g.cuotaEstatal], ['cuota.autonomica', g.cuotaAutonomica], ['diferencial', r.cuotaDiferencial]])
      assert.equal(lines.find(l => l.origen?.siteId === `anual.explicito.${site}`).origen.decimal, value)
    const es = q(g.gravamenEstatal).minus(q(g.gravamenMinimoEstatal))
    const au = q(g.gravamenAutonomico).minus(q(g.gravamenMinimoAutonomico))
    const cuota = es.plus(au), diferencial = cuota.minus(r.retenciones)
    for (const [box, value] of [['0528', q(g.gravamenEstatal)], ['0529', q(g.gravamenAutonomico)], ['0530', q(g.gravamenMinimoEstatal)], ['0531', q(g.gravamenMinimoAutonomico)], ['0532', es], ['0533', au], ['0595', cuota], ['0670', diferencial]])
      assert.equal(value.toFixed(2), boxes[box], `${row.id} ${box}`)
    const alternative = q(est).plus(q(aut)).minus(r.retenciones)
    assert.equal(alternative.toFixed(2), diferencial.toFixed(2))
    const sinRet = Effect.runSync(liquidarIrpfAnualExplicito({ ...c, retenciones: [] }))
    assert.equal(sinRet.cuotaPosterior, r.cuotaPosterior)
    assert(new D(sinRet.cuotaDiferencial).minus(r.cuotaDiferencial).eq(r.retenciones))
    const renamed = Effect.runSync(liquidarIrpfAnualExplicito({ ...c, trabajo: { ...c.trabajo, rendimientos: c.trabajo.rendimientos.map(x => ({ ...x, id: 'sintetico-renombrado' })) } }))
    assert.equal(renamed.cuotaDiferencial, r.cuotaDiferencial)
    rows.push({ id: row.id, PRE: { frozen: frozen.cuotaDiferencialPresentada, current: r.cuotaDiferencialPresentada, componentes: g, cuota: r.cuotaPosterior, open: boxes['0670'], differenceOpenMinusMotor: new D(boxes['0670']).minus(r.cuotaDiferencialPresentada).toFixed(2) }, POST: { kind: 'contrafactual-no-aplicado', hypothesis: 'HALF_UP por gravamen completo antes de restar mínimos', estatal: es.toFixed(2), autonomica: au.toFixed(2), cuota: cuota.toFixed(2), diferencial: diferencial.toFixed(2), open: boxes['0670'], differenceOpenMinusCandidate: new D(boxes['0670']).minus(diferencial).toFixed(2), alternativeNetQuotaRoundingAlsoMatches: true }, netoDisponible: { PRE: new D(c.trabajo.rendimientos[0].integro).minus(r.cuotaPosterior).toFixed(2), POST: new D(c.trabajo.rendimientos[0].integro).minus(cuota).toFixed(2), meaning: 'bruto menos cuota; no es campo devuelto por la API' } })
  }
}
// Adversa aritmética sintética, sin captura ni peso: diferencia los algoritmos.
const tramos = [[new D(Infinity), new D('.095')]]
const escala = base => calcularCuotaPorEscala({ base: new D(base), tramos, aritmetica: D })
const gravamen = escala('11457'), minimo = escala('6700.05')
const porGravamen = q(gravamen).minus(q(minimo)), porCuota = q(gravamen.minus(minimo))
assert.equal(porGravamen.toFixed(2), '451.92')
assert.equal(porCuota.toFixed(2), '451.91')
assert.notEqual(porGravamen.toFixed(2), porCuota.toFixed(2))
const report = { schema: 'pension432-diagnostico-v1', decision: 'pendiente-sin-cambio-de-motor', productionChanged: false, metricsChanged: false, metrics: { original: '76/80', arrendadores: '4/4', pensiones: '1/2' }, rows, adversa: { synthetic: true, observed: false, base: '11457', minimo: '6700.05', porGravamen: porGravamen.toFixed(2), porCuota: porCuota.toFixed(2) }, evidence, api: { explicita: 'ejecutada con hechos de pensión y retenciones efectivas', canonica: 'no aplicable a esta entrada: sin contrato solo-trabajo de pensión efectiva; no convertir a salario estimado' }, limitations: ['Cotejo focal contra transcripción PDF y hash del PDF; no sustituye revisión documental independiente SES/PDF.', 'Dos patrones monetarios; fronteras repiten importes y no discriminan algoritmos.', 'POST es contrafactual sin rastro de producción modificado.', 'No habilita regla por ID, edad, territorio, importe, otros ejercicios ni todas las pensiones.'] }
writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ decision: report.decision, cases: rows.length, adversa: report.adversa, passed: true }))
