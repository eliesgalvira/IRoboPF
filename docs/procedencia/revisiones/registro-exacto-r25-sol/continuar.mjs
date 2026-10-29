import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const root=resolve('.cache/registro-exacto-r25-sol/ensayo')
const out=resolve('docs/procedencia/revisiones/registro-exacto-r25-sol')
const {comprobarEntrada}=await import(root+'/scripts/procedencia/evidencia-contenido.mjs')
const {leerSnapshot}=await import(root+'/lib/procedencia/almacen.ts')
const {verificarContenido}=await import(root+'/scripts/procedencia/contenido-verificar.mjs')
const {hash}=await import(root+'/lib/procedencia/verificador.ts')
const entry=JSON.parse(readFileSync(out+'/entrada.json'))
const registry=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/registro.json'))
const subjects=new Map(),collisions=[]
for(const e of registry.entries){
 const p=JSON.parse(readFileSync(root+'/'+e.payload.path))
 if(subjects.has(p.itemId)) collisions.push({itemId:p.itemId,first:subjects.get(p.itemId),next:e.payload,scope:p.scope})
 else subjects.set(p.itemId,e.payload)
}
comprobarEntrada(root,entry)
const mutations=[]
for(const d of entry.dependencias.filter(d=>d.path.includes('/fixtures/sha256/')||d.path===JSON.parse(readFileSync(root+'/'+registry.entries[0].payload.path)).source.file)){
 const path=resolve(root,d.path),original=readFileSync(path)
 try{
  writeFileSync(path,'alterado después de Python')
  assert.throws(()=>comprobarEntrada(root,entry),/Dependencia alterada/)
  mutations.push({path:d.path,rejected:true})
 } finally{writeFileSync(path,original)}
}
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
const ids=JSON.parse(readFileSync(store+'/snapshots.json'));assert.equal(ids.length,36)
const history=ids.map(id=>({id,result:verificarContenido(leerSnapshot(id,store),store)}))
const current='57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146'
const {GET:ficha}=await import(pathToFileURL(root+'/app/procedencia/[snapshot]/[id]/[revision]/route.ts'))
const {GET:blob}=await import(pathToFileURL(root+'/app/procedencia/[snapshot]/objetos/[hash]/route.ts'))
const snapshot=leerSnapshot(current,store),e=snapshot.evidencias[0]
const response=await ficha(new Request('http://localhost/'),{params:Promise.resolve({snapshot:current,...e.sujeto})})
assert.equal(response.status,200)
const html=await response.text()
for(const word of ['pending','trust-indeterminate','false']) assert.ok(html.includes(word),word)
const routes=[{kind:'ficha original Madrid',status:response.status}]
for(const pub of snapshot.publicos){
 const r=await blob(new Request('http://localhost/'),{params:Promise.resolve({snapshot:current,hash:pub.hash})})
 assert.equal(r.status,200)
 const bytes=Buffer.from(await r.arrayBuffer())
 assert.equal(hash(bytes),pub.hash);assert.equal(bytes.length,pub.bytes)
 assert.equal(r.headers.get('Content-Type'),pub.mime)
 routes.push({kind:pub.mime,status:r.status,sha256:hash(bytes),size:bytes.length})
}
writeFileSync(out+'/continuacion.json',JSON.stringify({uniqueSubjects:subjects.size,collisions,mutations,history,routes,newPublishedSnapshot:false},null,2)+'\n')
console.log('Historia conservada:',history.length,'sujetos únicos:',subjects.size,'colisiones:',collisions.length,'mutaciones tardías:',mutations.length,'rutas:',routes)
