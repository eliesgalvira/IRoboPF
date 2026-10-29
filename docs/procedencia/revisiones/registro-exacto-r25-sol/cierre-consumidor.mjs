import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {pathToFileURL} from 'node:url'
const root=resolve('.cache/registro-exacto-r25-sol/ensayo')
const out=resolve('docs/procedencia/revisiones/registro-exacto-r25-sol')
const {verificarAceptacionLimitada}=await import(root+"/scripts/procedencia/ambito-publicado.mjs")
const {hash}=await import(root+"/lib/procedencia/verificador.ts")
const input=JSON.parse(readFileSync(out+'/entrada.json'))
const files=new Map(input.dependencias.map(d=>[d.sha256,readFileSync(resolve(root,d.path))]))
const registry=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/registro.json'))
const seen=new Map()
const collisions=[]
const controls=[]
function check(entry,dependencies=input.dependencias,objects=files){
 const p=JSON.parse(files.get(entry.payload.sha256))
 return verificarAceptacionLimitada(entry.payload.sha256,p.itemId,dependencies,h=>objects.get(h))
}
for(const entry of registry.entries){
 check(entry)
 const p=JSON.parse(files.get(entry.payload.sha256))
 if(seen.has(p.itemId)) collisions.push({itemId:p.itemId,first:seen.get(p.itemId),next:entry.payload,scope:p.scope})
 else seen.set(p.itemId,entry.payload)
}
function reject(label,fn){
 console.log("control",label)
 assert.throws(fn,label)
 controls.push({case:label,rejected:true})
}
const entry=registry.entries[0]
const p=JSON.parse(files.get(entry.payload.sha256))
const att=JSON.parse(files.get(entry.attestation.sha256))
const reviewersPath='docs/procedencia/enlaces/revisores.json'
const reviewers=JSON.parse(readFileSync(root+'/'+reviewersPath))
function mutate(path,value,fn){
 const bytes=Buffer.from(JSON.stringify(value)),h=hash(bytes)
 const deps=input.dependencias.map(d=>d.path===path?{...d,sha256:h}:d)
 const objects=new Map(files);objects.set(h,bytes)
 fn(deps,objects)
}
for(const [label,entries] of [['par omitido',registry.entries.slice(1)],['par duplicado',[...registry.entries,entry]]]){
 mutate('docs/procedencia/enlaces/registro.json',{...registry,entries},(deps,objects)=>reject(label,()=>check(entry,deps,objects)))
}
const extra=structuredClone(reviewers)
extra.reviewers[0].approvals=[]
mutate(reviewersPath,extra,(deps,objects)=>reject('sin aprobación exacta',()=>check(entry,deps,objects)))
const crossed=structuredClone(registry)
crossed.entries[0].attestation=registry.entries.at(-1).attestation
mutate('docs/procedencia/enlaces/registro.json',crossed,(deps,objects)=>reject('atestación cruzada',()=>check(entry,deps,objects)))
const changed=structuredClone(att)
changed.report={path:att.report.path+'.movido',sha256:att.report.sha256}
mutate(entry.attestation.path,changed,(deps,objects)=>reject('informe movido y hashes coherentes sin cambiar aprobación',()=>check(entry,deps,objects)))
for(const path of [att.report.path,p.source.file,p.executableScope.path]){
 reject('dependencia ausente '+path,()=>check(entry,input.dependencias.filter(d=>d.path!==path)))
}
const reportObjects=new Map(files);reportObjects.set(att.report.sha256,Buffer.from(''))
reject('informe físicamente vacío',()=>check(entry,input.dependencias,reportObjects))
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
const {leerSnapshot,objeto}=await import(root+'/lib/procedencia/almacen.ts')
const {verificarContenido}=await import(root+'/scripts/procedencia/contenido-verificar.mjs')
const ids=JSON.parse(readFileSync(store+'/snapshots.json'))
assert.equal(ids.length,36)
const history=ids.map(id=>({id,result:verificarContenido(leerSnapshot(id,store),store)}))
const current='57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146'
// Importar rutas originales con resolución de alias hacia el árbol de ensayo.
// El cwd fija su almacén al original, que solo se lee.
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
assert.equal(JSON.parse(objeto(store,e.recibo)).estados[0].aceptacionFiscalCompleta,false)
writeFileSync(out+'/consumidor.json',JSON.stringify({limitedClosurePairs:264,uniqueSubjects:seen.size,collisions,controls,history,routes,newPublishedSnapshot:false},null,2)+'\n')
console.log('264 cierres limitados; sujetos únicos',seen.size,'colisiones',collisions.length,'históricos',ids.length,'rutas originales',routes)
