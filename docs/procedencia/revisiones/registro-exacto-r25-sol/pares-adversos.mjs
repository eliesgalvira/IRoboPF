import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const root=resolve('.cache/registro-exacto-r25-sol/ensayo')
const out=resolve('docs/procedencia/revisiones/registro-exacto-r25-sol')
const {verificarAceptacionLimitada}=await import(root+'/scripts/procedencia/ambito-publicado.mjs')
const {hash}=await import(root+'/lib/procedencia/verificador.ts')
const input=JSON.parse(readFileSync(out+'/entrada.json'))
const files=new Map(input.dependencias.map(d=>[d.sha256,readFileSync(root+'/'+d.path)]))
const registry=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/registro.json'))
const reviewers=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/revisores.json'))
const derived=JSON.parse(readFileSync(root+'/'+reviewers.reviewers[0].delegationRegistry.path))
const results=[]
for(const reviewer of reviewers.reviewers){
 const e=registry.entries.find(e=>reviewer.approvals.some(a=>a.payloadSha256===e.payload.sha256))
 const p=JSON.parse(files.get(e.payload.sha256)),a=JSON.parse(files.get(e.attestation.sha256))
 const identity=derived.delegates.find(d=>d.taskId===a.reviewTaskId)
 for(const name of ['author-canonical','author-command','scope','inventory','report-moved','report-empty','third-reviewer']){
  const payload=structuredClone(p),att=structuredClone(a),reg=structuredClone(registry)
  const objects=new Map(files),deps=structuredClone(input.dependencias)
  const replace=(path,value)=>{
   const bytes=Buffer.from(JSON.stringify(value)),sha256=hash(bytes)
   const d=deps.find(d=>d.path===path)
   if(d)d.sha256=sha256;else deps.push({path,sha256})
   objects.set(sha256,bytes);return {path,sha256}
  }
  if(name==='author-canonical')payload.authorTaskId=identity.canonicalTaskId
  if(name==='author-command')payload.authorTaskId=identity.commandKey
  if(name==='scope')payload.scope.year=2026
  if(name==='inventory')payload.inventory.manifestSha256='0'.repeat(64)
  if(name==='third-reviewer')att.reviewTaskId='tercero-no-autorizado'
  if(name==='report-moved')att.report={...att.report,path:att.report.path+'.movido'}
  if(name==='report-empty'){
   const bytes=Buffer.from(''),sha256=hash(bytes);objects.set(sha256,bytes)
   deps.find(d=>d.path===att.report.path).sha256=sha256
   att.report.sha256=sha256
  }
  const pr=replace(e.payload.path,payload)
  att.payloadSha256=pr.sha256;att.inventory=payload.inventory;att.scope=payload.scope
  const ar=replace(e.attestation.path,att)
  const target=reg.entries.find(x=>x.payload.sha256===e.payload.sha256)
  target.payload=pr;target.attestation=ar
  replace('docs/procedencia/enlaces/registro.json',reg)
  assert.throws(()=>verificarAceptacionLimitada(pr.sha256,payload.itemId,deps,h=>objects.get(h)),name)
  results.push({reviewTaskId:reviewer.taskId,case:name,rejected:true,trustRegistryUnchanged:true})
 }
}
writeFileSync(out+'/pares-adversos.json',JSON.stringify(results,null,2)+'\n')
console.log('14 mutaciones coherentes de los dos revisores rechazadas sin cambiar raíz de aprobación')
