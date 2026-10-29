import assert from 'node:assert/strict'
import {readFileSync, writeFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {composeSS, validateSS} from '../../../../scripts/procedencia/flujo-ss-r32.mjs'
import {buildAdmissionFragment, verifyAdmissionFragment} from '../../../../scripts/procedencia/flujo-admision-r32.mjs'
import {preparar} from '../../../../scripts/procedencia/incorporacion-lote-r32.mjs'

const read = p => readFileSync(p)
const json = p => JSON.parse(read(p))
const sha = b => createHash('sha256').update(b).digest('hex')
const ss = composeSS()
const admission = buildAdmissionFragment()
assert.deepEqual(ss, json('docs/procedencia/implementaciones/flujo-ss-r32-sol/fragmento.json'))
assert.deepEqual(admission, json('docs/procedencia/implementaciones/flujo-admision-r32-sol/fragmento.json'))
validateSS(ss)
verifyAdmissionFragment(admission)
assert.equal(ss.sites.length,11)
assert.equal(admission.sites.length,17)
assert.ok(ss.sites.every(s => s.admissionRequirement === admission.contractId && !s.siteClosed))
assert.ok(admission.sites.every(s => !s.siteClosed))
assert.equal(ss.wiringAllowed,false)
assert.equal(admission.wiringAllowed,false)
const plan = preparar()
const folder = 'docs/procedencia/implementaciones/incorporacion-lote-r32-sol/'
for(const f of plan.files) {
  const name = f.path.split('/').at(-1)
  assert.equal(read(folder+'candidatos/'+name).toString('base64'),f.after)
  assert.equal(read(f.path).toString('base64'),f.before)
}
assert.deepEqual(plan.cases,json(folder+'casos.json'))
const consumers = json('docs/procedencia/revisiones/nominal-r32-sol/consumidores.json')
assert.equal(sha(read(consumers.path)),consumers.currentSha256)
assert.equal(sha(execFileSync('git',['show',consumers.baseAnterior+':'+consumers.path])),consumers.beforeSha256)
const receipt = {
  reconstruction:{ssSites:ss.sites.length,ssPorts:ss.ports.length,ssEdges:ss.edges.length,admissionSites:admission.sites.length,admissionPredicates:admission.predicates.length,exactAuthorArtifacts:true},
  incorporation:{pairs:plan.cases.length,subjects:new Set(plan.cases.map(c=>c.itemId)).size,exactCandidateFiles:true,activeFilesUnchanged:true},
  nominal:{finding:'NR30-01',exactReviewedConsumers:true,newIndependentReviewRequired:false,scope:'Forma estructural exclusivamente; revisión recibida y rojos/verdes previos del padre.'},
  acceptedFlowClosures:false,wiringAllowed:false,completeRuleAcceptance:false
}
writeFileSync('docs/procedencia/correcciones/recepcion-r32-r34/contraste.json',JSON.stringify(receipt,null,2)+'\n')
console.log(JSON.stringify(receipt))
