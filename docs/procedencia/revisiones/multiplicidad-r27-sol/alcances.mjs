import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const root=resolve('.cache/multiplicidad-r27-sol/despues-acotado'),out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol')
const {leerSnapshot,leerPaquete,objeto}=await import(root+'/lib/procedencia/almacen.ts')
const store=root+'/docs/procedencia/implementaciones/contenidos/datos'
const id=JSON.parse(readFileSync(out+'/despues-acotado/comprobacion-get.json')).result.snapshot
const s=leerSnapshot(id,store),nodes=s.paquetes.flatMap(p=>leerPaquete(s,p.prefijo,store))
const registry=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/registro.json'))
const cases=[]
for(const e of registry.entries){
 const payload=JSON.parse(readFileSync(root+'/'+e.payload.path)),states=s.evidencias.filter(x=>x.payload===e.payload.sha256)
 assert.equal(states.length,1)
 const state=states[0];assert.equal(state.sujeto.id,payload.itemId)
 const subject=nodes.find(x=>x.entidad.id===payload.itemId)
 assert.equal(subject.revision,state.sujeto.revision)
 const rule=nodes.find(x=>x.entidad.id===`evidencia.${e.payload.sha256}.rule`)
 assert.ok(subject.entidad.aristas.some(a=>a.relacion==='norma'&&a.destino.id===rule.entidad.id&&a.destino.revision===rule.revision))
 assert.equal(rule.entidad.proposicion,payload.scope.claim)
 const receipt=JSON.parse(objeto(store,state.recibo))
 const recorded=receipt.estados.filter(x=>x.payload.sha256===e.payload.sha256)
 assert.equal(recorded.length,1);assert.deepEqual(recorded[0].sujeto,state.sujeto)
 cases.push({payload:e.payload,attestation:e.attestation,itemId:payload.itemId,scope:payload.scope,source:payload.source,subjectRevision:subject.revision,rule:{id:rule.entidad.id,revision:rule.revision},state,receiptVersion:receipt.version,dictamen:'correspondencia técnica exacta; sin aceptación de aplicabilidad'})
}
const excluded=JSON.parse(readFileSync(out+'/despues-acotado/alcance-publicacion.json')).excluded
assert.equal(excluded.length,36);assert.equal(cases.length,228)
assert.equal(new Set([...cases.map(x=>x.payload.sha256),...excluded.map(x=>x.payload)]).size,264)
writeFileSync(out+'/casos-228.json',JSON.stringify({snapshot:id,cases,excluded,completeBatch:false},null,2)+'\n')
console.log('228 correspondencias exactas y 36 exclusiones distintas')
