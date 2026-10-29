import assert from 'node:assert/strict'
import {writeFileSync,mkdirSync,cpSync} from 'node:fs'
import {resolve} from 'node:path'
import {leerSnapshot,directorioContenido,objeto} from '../../../../lib/procedencia/almacen.ts'
import {verificarContenido} from '../../../../scripts/procedencia/contenido-verificar.mjs'
import {verificarSoftwareExplicacion} from '../../../../scripts/procedencia/explicacion-version.mjs'
import {hash,bytesEntidad,verificarGrafo} from '../../../../lib/procedencia/verificador.ts'
import {GET as fichaGET} from '../../../../app/procedencia/[snapshot]/[id]/[revision]/route.ts'
import {GET as objetoGET} from '../../../../app/procedencia/[snapshot]/objetos/[hash]/route.ts'
import {responderObjeto} from '../../../../lib/procedencia/http.ts'
const actual='082bfc98eb13469b45e456a3d6cc65ebe811a748c1535d606efc3b06e78370ad'
for (const id of ['2d4c3dcdcc45fc4811d9ac65146cf991fd077908b5467a9118795c566acb8f93','98c315e18130d88b18a4c85aa62ec2b1dd1d18a62d9f5cf61fd57711399e7e1a','a257e37f24d5a8c2f9306d64b1b706c658de067e501128652db550a7e485280f',actual]) {
 const s=leerSnapshot(id)
 assert.ok(s)
 console.log('snapshot',id,verificarContenido(s,directorioContenido))
 // EC-02: el nombre conservado no sustituye a sus bytes físicos.
 const scratch=resolve('.cache/contratos-r21-sol/muestra-'+id)
 mkdirSync(resolve(scratch,'objetos'),{recursive:true})
 // Solo un objeto real copiado; el primer paquete se altera sin tocar originales.
 cpSync(resolve(directorioContenido,'objetos',s.paquetes[0].hash),resolve(scratch,'objetos',s.paquetes[0].hash))
 writeFileSync(resolve(scratch,'objetos',s.paquetes[0].hash),'alterado')
 assert.throws(()=>verificarContenido(s,scratch))
 console.log('mutacion-paquete-rechazada',id)
}
const s=leerSnapshot(actual)
verificarSoftwareExplicacion(s,process.cwd())
const e=s.evidencias[0]
assert.equal(e.payload,'e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258')
assert.equal(e.revisionBinding,'pending')
assert.equal(e.aceptacionFiscalCompleta,false)
const recibo=JSON.parse(objeto(directorioContenido,e.recibo))
assert.equal(recibo.estados[0].revisionBinding,'pending')
for(const d of recibo.entrada.dependencias) assert.equal(hash(objeto(directorioContenido,d.sha256)),d.sha256)
const f=await fichaGET(new Request('http://localhost/'),{params:Promise.resolve({snapshot:actual,...e.sujeto})})
assert.equal(f.status,200)
const html=await f.text()
for(const text of ['Original PDF','Captura PNG','trust-indeterminate','pending','false']) assert.ok(html.includes(text),text)
console.log('GET-ficha',f.status,'bytes',Buffer.byteLength(html))
for(const p of s.publicos){
 const r=await objetoGET(new Request('http://localhost/'),{params:Promise.resolve({snapshot:actual,hash:p.hash})})
 assert.equal(r.status,200);assert.equal(r.headers.get('Content-Type'),p.mime)
 const b=Buffer.from(await r.arrayBuffer());assert.equal(hash(b),p.hash);assert.equal(b.length,p.bytes)
 console.log('GET-objeto',p.hash,r.status,p.mime,b.length)
}
assert.equal((await fichaGET(new Request('http://localhost/'),{params:Promise.resolve({snapshot:actual,id:'ausente',revision:'a'.repeat(64)})})).status,404)
assert.equal((await objetoGET(new Request('http://localhost/'),{params:Promise.resolve({snapshot:actual,hash:s.generador})})).status,404)
for(const evidencias of [[],[e,e],[{...e,sujeto:{...e.sujeto,id:'otro'}}]]) assert.throws(()=>verificarContenido({...s,evidencias},directorioContenido))
console.log('EC-04 omision/duplicado/sujeto-ajeno rechazados')
const scratch=resolve('.cache/contratos-r21-sol/blob')
mkdirSync(resolve(scratch,'objetos'),{recursive:true})
writeFileSync(resolve(scratch,'snapshots.json'),JSON.stringify([actual]))
cpSync(resolve(directorioContenido,'objetos',actual),resolve(scratch,'objetos',actual))
writeFileSync(resolve(scratch,'objetos',s.publicos[0].hash),'corrupto')
assert.equal(responderObjeto(actual,s.publicos[0].hash,scratch).status,503)
console.log('objeto prometido corrupto:503; software actual coherente; recibo cerrado',recibo.entrada.dependencias.length)
const recetaNueva=hash('receta deliberadamente diferente')
const rehashed=new Map()
const grafo=structuredClone(recibo.entradas)
for(const entry of grafo){
 if(entry.entidad.tipo==='Facsimile') entry.entidad.receta=recetaNueva
 for(const a of entry.entidad.aristas){if(rehashed.has(a.destino.id))a.destino.revision=rehashed.get(a.destino.id)}
 entry.revision=hash(bytesEntidad(entry.entidad))
 rehashed.set(entry.entidad.id,entry.revision)
}
assert.throws(()=>verificarGrafo(grafo,new Set([...s.auxiliares,recetaNueva])),/Receta/)
console.log('EC-02 receta divergente con revisiones/aristas rehechas rechazada')
