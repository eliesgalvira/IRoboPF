import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {gzipSync} from 'node:zlib'
const out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol'),root=resolve('.cache/multiplicidad-r27-sol/antes')
process.chdir(root)
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
const {leerSnapshot,leerPaquete,objeto}=await import(root+'/lib/procedencia/almacen.ts')
const {verificarContenido}=await import(root+'/scripts/procedencia/contenido-verificar.mjs')
const {hash,bytesEntidad}=await import(root+'/lib/procedencia/verificador.ts')
const {filaBusqueda}=await import(root+'/scripts/procedencia/contenido-publicar.mjs')
const id='57377f076ca1050c368c7b57934d1f8edce13104a27258409ebf7f1a8f58d146'
const original=leerSnapshot(id,store)
const results=[]
for(const attack of ['proposicion-ajena']){
 const s=structuredClone(original),rows=s.paquetes.flatMap(p=>leerPaquete(s,p.prefijo,store))
 const additions=new Map()
 const save=bytes=>{const b=Buffer.from(bytes),h=hash(b);writeFileSync(store+'/objetos/'+h,b);additions.set(h,b.length);return h}
 const receipt=JSON.parse(objeto(store,s.evidencias[0].recibo))
 const evidence=s.evidencias[0]
 const subject=rows.find(r=>r.entidad.id===evidence.sujeto.id)
 const rule=rows.find(r=>r.entidad.id===`evidencia.${evidence.payload}.rule`)
 if(attack==='proposicion-ajena'){
  rule.entidad.proposicion+=' CONTRAPRUEBA: aplicable a otro ejercicio y territorio.'
  rule.revision=hash(bytesEntidad(rule.entidad))
  subject.entidad.aristas.find(a=>a.destino.id===rule.entidad.id).destino.revision=rule.revision
 } else if(attack==='arista-cruzada'){
  const other=rows.find(r=>r.entidad.tipo==='Rule'&&!subject.entidad.aristas.some(a=>a.destino.id===r.entidad.id))
  subject.entidad.aristas[0].destino={id:other.entidad.id,revision:other.revision}
 } else receipt.version=1
 subject.revision=hash(bytesEntidad(subject.entidad))
 for(const e of s.evidencias) if(e.sujeto.id===subject.entidad.id)e.sujeto.revision=subject.revision
 for(const e of receipt.estados) if(e.sujeto.id===subject.entidad.id)e.sujeto.revision=subject.revision
 const replacements=new Map(rows.map(r=>[r.entidad.id,r]))
 receipt.entradas=receipt.entradas.map(r=>replacements.get(r.entidad.id))
 const h=save(JSON.stringify(receipt));for(const e of s.evidencias)e.recibo=h
 s.paquetes=s.paquetes.map(p=>{
  const group=rows.filter(r=>hash(r.entidad.id).slice(0,2)===p.prefijo)
  const b=gzipSync(Buffer.from(JSON.stringify(group)),{level:9})
  return {...p,hash:save(b),bytes:b.length,indice:save(JSON.stringify(group.map(r=>({id:r.entidad.id,revision:r.revision}))))}
 })
 s.busqueda=save(gzipSync(Buffer.from(JSON.stringify([...rows].sort((a,b)=>a.entidad.id.localeCompare(b.entidad.id)).map(filaBusqueda))),{level:9}))
 s.auxiliares=[...new Set([...s.auxiliares,...additions.keys()])].sort()
 const sizes=new Map(s.dependencias.map(d=>[d.hash,d.bytes]));for(const [h,n] of additions)sizes.set(h,n)
 s.dependencias=[...sizes].map(([hash,bytes])=>({hash,bytes})).sort((a,b)=>a.hash.localeCompare(b.hash))
 let rejected=false,error=null
 try{verificarContenido(s,store)}catch(e){rejected=true;error=String(e)}
 results.push({attack,rejected,error,subject:evidence.sujeto,payload:evidence.payload,receipt:h})
 writeFileSync(out+'/reconstruidos-historico.json',JSON.stringify(results,null,2)+'\n')
 console.log(results.at(-1))
}
assert.ok(results.every(r=>r.rejected),'Se esperaba rechazo de reconstrucciones semánticamente ajenas')
