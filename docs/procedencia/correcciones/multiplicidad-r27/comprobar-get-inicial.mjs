import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
const root = resolve('.cache/orquestador-recepcion/r27/multiplicidad/despues-acotado')
const out = resolve('docs/procedencia/correcciones/multiplicidad-r27/despues-acotado')
process.chdir(root)
const store = resolve('docs/procedencia/implementaciones/contenidos/datos')
const { leerSnapshot } = await import(root + '/lib/procedencia/almacen.ts')
const snapshots = JSON.parse(readFileSync(store + '/snapshots.json')).map((id) => ({id,snapshot:leerSnapshot(id,store)}))
const publicados = snapshots.filter(({snapshot})=>snapshot.version===2)
assert.equal(publicados.length,1)
const {id,snapshot} = publicados[0]
assert.equal(snapshot.evidencias.length,228)
const { GET: ficha } = await import(root + '/app/procedencia/[snapshot]/[id]/[revision]/route.ts')
const { GET: objeto } = await import(root + '/app/procedencia/[snapshot]/objetos/[hash]/route.ts')
const sujetos = new Map(snapshot.evidencias.map((e)=>[e.sujeto.id,e.sujeto]))
assert.equal(sujetos.size,90)
const start=performance.now()
for(const sujeto of sujetos.values()){
 const response=await ficha(new Request('http://localhost/'),{params:Promise.resolve({snapshot:id,...sujeto})})
 assert.equal(response.status,200)
 const html=await response.text()
 const expected=snapshot.evidencias.filter((e)=>e.sujeto.id===sujeto.id)
 for(const e of expected){
  assert.ok(html.includes(e.payload))
  assert.ok(html.includes(`/evidencia.${e.payload}.rule/`))
 }
 assert.equal((html.match(/Aceptación fiscal completa/g)??[]).length,expected.length)
 assert.equal((html.match(/<dd>false<\/dd>/g)??[]).length,expected.length)
 assert.equal((html.match(/<dd>accepted-limited<\/dd>/g)??[]).length,expected.length)
 assert.ok(html.includes('Ocurrencia técnica versionada; no es una regla fiscal aceptada.'))
}
for(const p of snapshot.publicos){
 const response=await objeto(new Request('http://localhost/'),{params:Promise.resolve({snapshot:id,hash:p.hash})})
 assert.equal(response.status,200)
 const bytes=Buffer.from(await response.arrayBuffer())
 assert.equal(bytes.length,p.bytes)
 assert.equal(createHash('sha256').update(bytes).digest('hex'),p.hash)
}
const result={success:true,result:{snapshot:id},sujetos:sujetos.size,estados:228,objetosPublicos:snapshot.publicos.length,milliseconds:performance.now()-start,completeBatch:false,excludedPairs:36,aceptacionFiscalCompleta:false}
writeFileSync(out+'/comprobacion-get.json',JSON.stringify(result,null,2)+'\n')
console.log(JSON.stringify(result))
