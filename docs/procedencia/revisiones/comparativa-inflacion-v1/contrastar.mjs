import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
const [root, out] = process.argv.slice(2)
const load = p => import(pathToFileURL(`${root}/${p}`).href)
const current = await load('lib/dominio/compatibilidad-legacy/progresividad-frio.ts')
const old = await load('.cache/comparativa-review/lib/dominio/compatibilidad-legacy/progresividad-frio.ts')
const arithmetic = await load('lib/dominio/compatibilidad-legacy/aritmetica-tabular.ts')
const tabular = await load('lib/dominio/compatibilidad-legacy/comparativa-tabular.ts')
const oracle = JSON.parse(readFileSync(`${out}/oracle.json`, 'utf8'))
const xml = x => Number.isFinite(x) ? Number(x.toPrecision(16)) : x
const compare = (actual, expected, serialize = false) => {
 const differences = []
 if (actual.length !== expected.length) throw Error('Número de filas distinto')
 actual.forEach((r,i) => {
  if (r.length !== expected[i].length) throw Error('Número de columnas distinto')
  r.forEach((v,j) => { if ((serialize ? xml(v) : v) !== expected[i][j]) differences.push({cell:`${String.fromCharCode(65+j)}${i+2}`,actual:v,expected:expected[i][j]}) })
 })
 return differences
}
const table = current.construirTablaComparativaInflacionCompatible()
const rows = Array.from(table.filas)
const baseline = compare(Array.from(old.construirTablaComparativaInflacionCompatible().filas),oracle.rows)
const counts = {}
for (const d of baseline) counts[d.cell[0]] = (counts[d.cell[0]] ?? 0)+1
const boundaries = oracle.boundaries.map(r => tabular.filaComparativaTabular(r[0],r[1]))
const controls = [current.construirTablaControlGeneralCompatible(),current.construirTablaControlTramosIrpfCompatible()]
const result = {baseline,counts,currentPython:compare(rows,oracle.rows),currentXml:compare(rows,oracle.sheets.COMPARATIVA_INFLACION.slice(1),true),pythonXml:compare(oracle.rows,oracle.sheets.COMPARATIVA_INFLACION.slice(1),true),boundaries:compare(boundaries,oracle.boundaries),rounds:oracle.rounds.map(r=>({...r,actualPython:arithmetic.redondearPython(r.x,r.digits),actualNumpy:arithmetic.redondearNumpy(r.x,r.digits)})),factors:Object.entries(oracle.factors).map(([y,f])=>({year:y,expected:f,actual:tabular.factorComparativaTabular(Number(y)).factor})),headers:JSON.stringify(table.cabeceras)===JSON.stringify(oracle.sheets.COMPARATIVA_INFLACION[0]),controls:controls.map((t,i)=>({header:JSON.stringify(t.cabeceras)===JSON.stringify(oracle.sheets[['CONTROL_GENERAL','CONTROL_TRAMOS_IRPF'][i]][0]),differences:compare(Array.from(t.filas),oracle.sheets[['CONTROL_GENERAL','CONTROL_TRAMOS_IRPF'][i]].slice(1),true)}))}
writeFileSync(`${out}/resultados.json`,JSON.stringify(result,null,2)+'\n')
if(result.currentPython.length || result.currentXml.length || result.pythonXml.length || result.boundaries.length || result.rounds.some(r=>r.python!==r.actualPython || r.numpy!==r.actualNumpy)) process.exitCode=1
