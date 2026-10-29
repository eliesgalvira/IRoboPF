import { test } from "node:test"
import assert from "node:assert/strict"
import {readFileSync} from "node:fs"
import { createHash } from "node:crypto"
import { verificarAceptacionLimitada } from "../../../../scripts/procedencia/ambito-publicado.mjs"

function fixture() {
 const dependencias=[]; const objetos=new Map()
 function save(path,value) {
  const bytes=Buffer.from(JSON.stringify(value));const sha256=createHash("sha256").update(bytes).digest("hex")
  dependencias.push({path,sha256});objetos.set(sha256,bytes);return {path,sha256}
 }
 const file=(path)=>JSON.parse(readFileSync(path))
 const original=file("docs/procedencia/correcciones/integracion-r19/candidatos/payloads/ambito-r19-ESTV2-2012-ordinaria-3-cuota.json")
 const scope=file(original.executableScope.path)
 const decisions=file(original.legalReview.decisions.path)
 const decision=decisions.find(d=>d.id===original.legalReview.decisionId)
 for(const ref of [...decision.citations,...[decision.chainEvidence,decision.additionalCitations].filter(Boolean)]) {
  const bytes=readFileSync(ref.path)
  assert.equal(createHash("sha256").update(bytes).digest("hex"),ref.sha256)
  if(!dependencias.some(d=>d.path===ref.path)){dependencias.push(ref);objetos.set(ref.sha256,bytes)}
 }
 const decisionRef=save("docs/procedencia/synthetic-decisions.json",decisions)
 original.legalReview.decisions=decisionRef;scope.decision.decisions=decisionRef
 original.executableScope=save("docs/procedencia/synthetic-scope.json",scope)
 const payload=save("docs/procedencia/synthetic-payload.json",original)
 const report=save("docs/procedencia/revisiones/synthetic/report.json",{synthetic:true})
 const attestation=save("docs/procedencia/synthetic-attestation.json",{
  schemaVersion:1,payloadSha256:payload.sha256,inventory:original.inventory,scope:original.scope,
  report,reviewTaskId:"synthetic-review",decision:"accepted-limited"
 })
 const delegationRegistry=save("docs/procedencia/synthetic-delegates.json",{version:1,delegate:{taskId:"synthetic-review"}})
 save("docs/procedencia/enlaces/revisores.json",{schemaVersion:2,reviewers:[{taskId:"synthetic-review",delegationRegistry,reportDirectory:"docs/procedencia/revisiones/synthetic",approvals:[{payloadSha256:payload.sha256,attestation}]}]})
 save("docs/procedencia/enlaces/registro.json",{schemaVersion:1,entries:[{payload,attestation}]})
 const result={dependencias,objetos,payload,report,subject:original.itemId,decisionId:decision.id}
 assert.equal(verificarAceptacionLimitada(payload.sha256,original.itemId,dependencias,h=>objetos.get(h)).completeRuleAcceptance,false)
 return result
}

function run(f) { return verificarAceptacionLimitada(f.payload.sha256, f.subject, f.dependencias, (h) => f.objetos.get(h)) }
function replace(f, path, value) {
 const bytes = Buffer.from(JSON.stringify(value))
 const sha256 = createHash("sha256").update(bytes).digest("hex")
 f.dependencias.find(d => d.path === path).sha256 = sha256
 f.objetos.set(sha256, bytes)
 return {path, sha256}
}
function get(f,path) {return JSON.parse(f.objetos.get(f.dependencias.find(d=>d.path===path).sha256))}
test("CP19-01: informe solo espacios debe rechazarse igual que Python", () => {
 const f=fixture()
 const bytes=Buffer.from("   ")
 const sha256=createHash("sha256").update(bytes).digest("hex")
 f.objetos.set(sha256,bytes)
 f.dependencias.find(d=>d.path===f.report.path).sha256=sha256
 const registry=get(f,"docs/procedencia/enlaces/registro.json")
 const att=get(f,registry.entries[0].attestation.path)
 att.report.sha256=sha256
 const attRef=replace(f,registry.entries[0].attestation.path,att)
 registry.entries[0].attestation=attRef
 replace(f,"docs/procedencia/enlaces/registro.json",registry)
 const reviewers=get(f,"docs/procedencia/enlaces/revisores.json")
 reviewers.reviewers[0].approvals[0].attestation=attRef
 replace(f,"docs/procedencia/enlaces/revisores.json",reviewers)
 assert.throws(()=>run(f), /Informe/)
})
test("CP19-02: decision contradictoria status/decision debe rechazarse",()=>{
 const f=fixture()
 const decisions=get(f,"docs/procedencia/synthetic-decisions.json")
 decisions.find(d=>d.id===f.decisionId).decision="rejected"
 const decisionRef=replace(f,"docs/procedencia/synthetic-decisions.json",decisions)
 const scope=get(f,"docs/procedencia/synthetic-scope.json")
 scope.decision.decisions=decisionRef
 const executableScope=replace(f,"docs/procedencia/synthetic-scope.json",scope)
 const payload=get(f,f.payload.path)
 payload.legalReview.decisions=decisionRef
 payload.executableScope=executableScope
 f.payload=replace(f,f.payload.path,payload)
 const registry=get(f,"docs/procedencia/enlaces/registro.json")
 registry.entries[0].payload=f.payload
 const att=get(f,registry.entries[0].attestation.path)
 att.payloadSha256=f.payload.sha256
 const attRef=replace(f,registry.entries[0].attestation.path,att)
 registry.entries[0].attestation=attRef
 replace(f,"docs/procedencia/enlaces/registro.json",registry)
 const reviewers=get(f,"docs/procedencia/enlaces/revisores.json")
 reviewers.reviewers[0].approvals=[{payloadSha256:f.payload.sha256,attestation:attRef}]
 replace(f,"docs/procedencia/enlaces/revisores.json",reviewers)
 assert.throws(()=>run(f))
})
