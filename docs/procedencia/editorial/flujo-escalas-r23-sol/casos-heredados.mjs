import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { Decimal } from '/home/elies/Repos/IRoboPF/node_modules/decimal.js/decimal.mjs'
const root = process.cwd()
const output = path.join(root, 'docs/procedencia/editorial/flujo-escalas-r23-sol')
const scratch = path.join(root, '.cache/flujo-escalas-r23-sol')
fs.mkdirSync(scratch, { recursive: true })
const load = (p) => import(pathToFileURL(path.join(root, p)).href)
const scales = await load('lib/dominio/irpf/cuotas/escalas-publicadas.ts')
const engine = await load('lib/dominio/irpf/cuotas/escalas-gravamen.ts')
const savings = await load('lib/dominio/irpf/cuotas/cuota-integra-ahorro.ts')
const results = []
const D = (x) => new Decimal(x)
const originalPath = path.join(root, 'lib/dominio/irpf/cuotas/escalas-gravamen.ts')
const original = fs.readFileSync(originalPath, 'utf8')
assert.equal(original.split('? base.gt(fila.baseInferior)').length, 2)
const mutation = original.replace('? base.gt(fila.baseInferior)', '? base.gte(fila.baseInferior)')
  .replace(/from "(\.[^"]+)"/g, (_, target) => `from "${path.resolve(path.dirname(originalPath), target)}"`)
const mutantPath = path.join(scratch, 'murcia-inclusiva.ts')
fs.writeFileSync(mutantPath, mutation)
const mutant = await import(pathToFileURL(mutantPath).href)
const quota = (module, base) => module.calcularCuotaPorEscala({ base:D(base), tramos:[], escalasPublicadas:[scales.MURCIA_2022] }).toFixed()
for (const [base, expected, mutated] of [['60000','8625.8332','8716.67'],['60000.01','8716.67227','8716.67227'],['60001','8716.897','8716.897']]) {
 const actual=quota(engine,base), bad=quota(mutant,base)
 assert.equal(actual,expected); assert.equal(bad,mutated)
 results.push({id:`murcia-${base}`,base,actual,mutant:bad,discriminates:actual!==bad})
}
// Cuota fija, límite y tipo tienen efectos diferentes sobre una base que permanece en fila.
for (const [field, delta, expected] of [['cuota','1','1'],['baseInferior','1','-0.215'],['tipo','0.001','0.001']]) {
 const table=scales.ESTATAL_ORDINARIA_2012_2014.map((row,index)=>index===3?{...row,[field]:row[field].plus(delta)}:row)
 const input={base:D('53408.2'),tramos:[],escalasPublicadas:[scales.ESTATAL_ORDINARIA_2012_2014]}
 const before=engine.calcularCuotaPorEscala(input)
 const after=engine.calcularCuotaPorEscala({...input,escalasPublicadas:[table]})
 assert.equal(after.minus(before).toFixed(),expected)
 results.push({id:`papel-${field}`,before:before.toFixed(),after:after.toFixed(),delta:expected})
}
const old=savings.calcularAhorroConMinimos({anio:2014,base:D(9000),baseGeneral:D(0),minimoEstatal:D(1000),minimoAutonomico:D(1000)})
const wrong=savings.calcularCuotaComponenteAhorro({anio:2014,base:D(9000),componente:'estatal'}).minus(savings.calcularCuotaComponenteAhorro({anio:2014,base:D(1000),componente:'estatal'}))
assert.equal(old.estatal.despuesMinimo.toFixed(),'980'); assert.equal(wrong.toFixed(),'1010')
results.push({id:'orden-ahorro-2014-estatal',actual:old.estatal.despuesMinimo.toFixed(),wrong:wrong.toFixed()})
const asymmetric=savings.calcularAhorroConMinimos({anio:2015,base:D(6000),baseGeneral:D(0),minimoEstatal:D(2500),minimoAutonomico:D(1000)})
assert.equal(asymmetric.estatal.despuesMinimo.toFixed(),'332.5'); assert.equal(asymmetric.autonomico.despuesMinimo.toFixed(),'500')
results.push({id:'ahorro-2015-componentes',estatal:asymmetric.estatal.despuesMinimo.toFixed(),autonomico:asymmetric.autonomico.despuesMinimo.toFixed()})
for (const year of [2022,2025,2026]) {
 const selected=scales.obtenerEscalaAutonomicaPublicada({anio:year,comunidadAutonoma:'madrid'})
 results.push({id:`madrid-selector-${year}`,published:selected!==undefined})
 assert.equal(selected!==undefined,year!==2026)
}
assert.equal(scales.obtenerEscalaAutonomicaPublicada({anio:2025,comunidadAutonoma:'madrid',fechaFallecimiento:new Date('2025-12-30')}),undefined)
results.push({id:'madrid-fallecimiento',published:false})
fs.writeFileSync(path.join(output,'casos-resultados.json'),JSON.stringify({sourceSha256:crypto.createHash('sha256').update(original).digest('hex'),mutantSha256:crypto.createHash('sha256').update(mutation).digest('hex'),results,legalAcceptance:false},null,2)+'\n')
console.log(`${results.length} discriminantes/casos TS reales correctos; sin aceptación fiscal`)
const cells=JSON.parse(fs.readFileSync(path.join(root,'docs/procedencia/correcciones/editorial-r21/escalas-celdas.json'),'utf8'))
const perCell=[]
for (const cell of cells) {
 const table=scales[cell.selector.simbolo]
 const index=cell.filaCodigo0Based
 const row=table[index]
 const field=cell.columna
 assert.equal(row[field].toFixed(),new Decimal(cell.valor).toFixed())
 const b=row.baseInferior.plus(1)
 const initial=engine.calcularCuotaPorEscala({base:b,tramos:[],escalasPublicadas:[table]})
 const expected=row.cuota.plus(row.tipo) // B=L+1, cálculo independiente de selección.
 assert.equal(initial.toFixed(),expected.toFixed())
 const changed=table.map((r,i)=>i===index?{...r,[field]:r[field].plus('0.01')}:r)
 const updated=engine.calcularCuotaPorEscala({base:b,tramos:[],escalasPublicadas:[changed]})
 const delta=field==='cuota'?D('0.01'):row.tipo.mul('-0.01')
 assert.equal(updated.minus(initial).toFixed(),delta.toFixed())
 perCell.push({id:cell.id,year:cell.selector.ejercicio,symbol:cell.selector.simbolo,field,index,base:b.toFixed(),actual:initial.toFixed(),mutant:updated.toFixed(),expectedDelta:delta.toFixed(),scope:'Fila aislada; no acredita selector anual ni aceptación jurídica del payload.'})
}
fs.writeFileSync(path.join(output,'casos-264-celdas.json'),JSON.stringify(perCell,null,2)+'\n')
console.log(`${perCell.length} mutaciones por celda: Q y L discriminados con TS real`)
