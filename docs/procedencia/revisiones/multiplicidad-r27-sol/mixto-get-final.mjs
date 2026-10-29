import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol'),root=resolve('.cache/multiplicidad-r27-sol/despues-acotado')
process.chdir(root)
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
const run=JSON.parse(readFileSync(out+'/mixto/recorrido.json'));assert.equal(run.success,true)
const {leerSnapshot}=await import(root+'/lib/procedencia/almacen.ts')
const {hash}=await import(root+'/lib/procedencia/verificador.ts')
const {GET:ficha}=await import(root+'/app/procedencia/[snapshot]/[id]/[revision]/route.ts')
const {GET:objeto}=await import(root+'/app/procedencia/[snapshot]/objetos/[hash]/route.ts')
const s=leerSnapshot(run.result.snapshot,store)
const pending=s.evidencias.filter(e=>e.revisionBinding==='pending');assert.equal(pending.length,1)
const expected=s.evidencias.filter(e=>e.sujeto.id===pending[0].sujeto.id)
assert.ok(expected.some(e=>e.revisionBinding==='accepted-limited'))
const params={snapshot:run.result.snapshot,...pending[0].sujeto}
const response=await ficha(new Request('http://localhost/'),{params:Promise.resolve(params)})
assert.equal(response.status,200);const html=(await response.text()).replace(/<!--[\s\S]*?-->/g,'')
const sections=[...html.matchAll(/<h2>Enlace documental: ([a-f0-9]{64})<\/h2><dl>(.*?)<\/dl>/gs)]
assert.equal(sections.length,expected.length)
const parsed=sections.map(([,payload,dl])=>({payload,fields:Object.fromEntries([...dl.matchAll(/<dt>(.*?)<\/dt><dd>(.*?)<\/dd>/gs)].map(([,k,v])=>[k,v]))}))
for(const e of expected){const p=parsed.find(p=>p.payload===e.payload);assert.ok(p)
 assert.equal(p.fields['Revisión del binding'],e.revisionBinding)
 assert.equal(p.fields['Aceptación fiscal completa'],'false')
 assert.equal(p.fields['Interpretación'],'candidata')
 assert.ok(p.fields['Autenticidad según manifiesto'].startsWith(e.autenticidad.estado+'.'))
}
const wrong=await ficha(new Request('http://localhost/'),{params:Promise.resolve({...params,revision:'f'.repeat(64)})});assert.equal(wrong.status,404)
const objects=[]
for(const p of s.publicos){const response=await objeto(new Request('http://localhost/'),{params:Promise.resolve({snapshot:run.result.snapshot,hash:p.hash})})
 const b=Buffer.from(await response.arrayBuffer());assert.equal(response.status,200);assert.equal(b.length,p.bytes);assert.equal(hash(b),p.hash);assert.equal(response.headers.get('Content-Type'),p.mime)
 objects.push({...p,status:response.status})}
writeFileSync(out+'/mixto-get-final.json',JSON.stringify({snapshot:run.result.snapshot,subject:pending[0].sujeto,parsed,objects,wrongRevisionStatus:wrong.status,completeRuleAcceptance:false},null,2)+'\n')
console.log(JSON.stringify({sections:sections.length,objects:objects.length,pending:pending.length}))
