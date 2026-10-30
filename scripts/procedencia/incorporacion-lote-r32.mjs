// Propuesta finita R32: solo aplica en scratch propio; no es un activador de confianza.
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync, lstatSync, realpathSync } from "node:fs"
import { resolve, dirname, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { createHash } from "node:crypto"
export const BASE = "846f25e183ba07414065d4e6bdf9e98311b98a17"
const source = process.env.IROBOPF_R32_SOURCE ?? resolve(dirname(fileURLToPath(import.meta.url)), "../..")
const derivedPath = "docs/procedencia/revisiones/tecnica-r23-sol/registro-derivado-candidato.json"
const reviewerPath = "docs/procedencia/correcciones/registro-candidato-r25/revisores-candidatos.json"
export const sha = (bytes) => createHash("sha256").update(bytes).digest("hex")
const serialize = (value) => Buffer.from(JSON.stringify(value, null, 2) + "\n")
export function preparar(root = source) {
  // Integrar el candidato añade commits: los contenidos exigidos siguen fijados debajo.
  execFileSync("git", ["merge-base", "--is-ancestor", BASE, "HEAD"], {cwd:root})
  assert.equal(sha(readFileSync(resolve(root, reviewerPath))), "26d3969ac6690eeaec9ab6855e9e4d4becb9515273f51277b6a380e72ae137be")
  const load = (p) => JSON.parse(readFileSync(resolve(root, p)).toString("utf8"))
  const ref = (r) => {
    assert.match(r.path, /^(?!.*(?:^|\/)\.\.(?:\/|$))[a-zA-Z0-9_./[\]-]+$/)
    const bytes = readFileSync(resolve(root, r.path))
    assert.equal(sha(bytes), r.sha256, r.path)
    if (r.sha512) assert.equal(createHash("sha512").update(bytes).digest("hex"), r.sha512)
    if (r.size !== undefined) assert.equal(bytes.length, r.size)
    return bytes
  }
  const raw = readFileSync(resolve(root, derivedPath))
  assert.equal(sha(raw), "436a1ab85b99776a38079958632311e13b89cf1391e629990c071b1d0aded2ca")
  const derived = JSON.parse(raw.toString("utf8"))
  const originalBytes = ref(derived.sourceRegistry)
  assert.deepEqual(originalBytes, Buffer.from(derived.sourceRegistryOriginalBytesBase64, "base64"))
  const original = JSON.parse(originalBytes.toString("utf8"))
  const map = JSON.parse(ref(derived.identityMap).toString("utf8"))
  assert.equal(derived.operationalApproval, false)
  assert.equal(derived.trustMutation, false)
  const reviewers = load(reviewerPath)
  assert.equal(reviewers.reviewers.length, 2)
  const entries = [], cases = [], identities = []
  const bindings = new Map(derived.bindings.map((b) => [b.payload.sha256, b]))
  assert.equal(bindings.size, 264)
  for (const reviewer of reviewers.reviewers) {
    const matches = map.identities.filter((i) => [i.canonicalTaskId, i.commandKey].includes(reviewer.taskId))
    assert.equal(matches.length, 1)
    const identity = matches[0]
    const delegate = original.delegates.filter((d) => d.key === identity.key)
    assert.equal(delegate.length, 1)
    assert.equal(delegate[0].role, "review")
    assert.equal(delegate[0].model, "gpt-6.1-sol")
    assert.equal(delegate[0].taskId, identity.canonicalTaskId)
    assert.equal(delegate[0].childNodeId, identity.canonicalTaskId)
    assert.equal(decodeURIComponent(identity.canonicalTaskId.replace(/^node:delegated-task:/, "")), identity.commandKey)
    const preserved = derived.delegates.find((d) => d.key === identity.key)
    assert.deepEqual(preserved.sourceDelegate, delegate[0])
    assert.deepEqual(reviewer.delegationRegistry, {path:derivedPath, sha256:sha(raw)})
    identities.push({taskId:reviewer.taskId, canonicalTaskId:identity.canonicalTaskId, commandKey:identity.commandKey, sourceRegistry:derived.sourceRegistry, reportDirectory:reviewer.reportDirectory})
    for (const approval of reviewer.approvals) {
      const binding = bindings.get(approval.payloadSha256)
      assert.ok(binding)
      const payload = JSON.parse(ref(binding.payload).toString("utf8"))
      const attestation = JSON.parse(ref(approval.attestation).toString("utf8"))
      assert.deepEqual(approval.attestation, {path:binding.attestation.path, sha256:binding.attestation.sha256})
      assert.ok(identity.attestations.some((a) => a.path === approval.attestation.path && a.sha256 === approval.attestation.sha256))
      assert.equal(attestation.payloadSha256, approval.payloadSha256)
      assert.equal(attestation.reviewTaskId, reviewer.taskId)
      assert.equal(binding.reviewTaskId, reviewer.taskId)
      assert.ok(![identity.canonicalTaskId, identity.commandKey].includes(payload.authorTaskId))
      assert.deepEqual(attestation.scope, payload.scope)
      assert.deepEqual(binding.scope, payload.scope)
      assert.deepEqual(attestation.inventory, payload.inventory)
      assert.deepEqual(binding.inventory, payload.inventory)
      assert.deepEqual(attestation.report, binding.report)
      assert.equal(dirname(attestation.report.path), reviewer.reportDirectory)
      assert.ok(ref(attestation.report).toString().trim())
      assert.equal(payload.scope.completeRule, false)
      entries.push({payload:{path:binding.payload.path, sha256:binding.payload.sha256}, attestation:approval.attestation})
      cases.push({payload:binding.payload, attestation:binding.attestation, itemId:payload.itemId, scope:payload.scope, reviewTaskId:reviewer.taskId, report:attestation.report, completeRuleAcceptance:false, objecion:"Un pase técnico no acredita fecha civil ni aplicabilidad.", respuesta:"Conservar el ámbito exacto R19 y su estado por enlace.", coste:"Contraste del padre y revisión nueva antes de activar."})
    }
  }
  assert.equal(entries.length, 264)
  assert.equal(new Set(entries.map((e) => e.payload.sha256)).size, 264)
  assert.equal(new Set(cases.map((e) => e.itemId)).size, 102)
  const expected = load("docs/procedencia/correcciones/integracion-r19/candidatos/correspondencias.json").rows
  assert.deepEqual(entries.map((e) => e.payload.sha256).sort(), expected.map((e) => e.candidate.sha256).sort())
  const registryPath = "docs/procedencia/enlaces/registro.json", reviewersPath = "docs/procedencia/enlaces/revisores.json"
  // El plan permanece reproducible después de incorporarlo. Sus bytes previos
  // están preservados; el estado operativo se coteja abajo con ambos extremos.
  const previous = readFileSync(resolve(root, "docs/procedencia/implementaciones/incorporacion-lote-r32-sol/previos/registro.json"))
  const previousReviewers = readFileSync(resolve(root, "docs/procedencia/implementaciones/incorporacion-lote-r32-sol/previos/revisores.json"))
  assert.equal(sha(previous), "1d52209d31204c67a8c4c13934b58fd46621be59e10cdb695d5785958c0bac4d")
  assert.equal(sha(previousReviewers), "3015971a9083a4be10471597c79d7cf1f382a0255bccba7d6be679185930dbd2")
  const registry = JSON.parse(previous.toString("utf8"))
  assert.equal(registry.entries.length, 1)
  assert.equal(registry.entries[0].payload.sha256, "e16bd15666f0f83502756ac1648259979ab07bdc5eea18abb0e7965a634a4258")
  assert.equal(registry.entries[0].attestation, null)
  const files = [{path:registryPath, before:previous, after:serialize({...registry, entries:[...registry.entries,...entries]})}, {path:reviewersPath, before:previousReviewers, after:readFileSync(resolve(root, reviewerPath))}].map(f => ({path:f.path,baseSha256:sha(f.before),sha256:sha(f.after),before:f.before.toString("base64"),after:f.after.toString("base64")}))
  const actual = files.map(f=>sha(readFileSync(resolve(root,f.path))))
  assert.ok(files.every((f,i)=>actual[i]===f.baseSha256)||files.every((f,i)=>actual[i]===f.sha256), "Estado mixto o desconocido; recuperar antes de preparar")
  return {base:BASE, kind:"propuesta-incorporacion-r32", trustMutation:false, completeRuleAcceptance:false, files, identities, cases}
}
function transition(tree, plan, backwards) {
  assert.deepEqual(plan, preparar(source), "Plan distinto de la derivación fijada")
  const absolute = resolve(tree)
  assert.ok(absolute.startsWith(resolve(source, ".cache/incorporacion-lote-r32") + "/"), "Solo scratch propio")
  assert.equal(realpathSync(absolute), absolute, "Raíz con enlaces")
  for (const f of plan.files) {
    const target = resolve(absolute, f.path)
    let p = absolute
    for (const part of relative(absolute, target).split("/")) {
      p = resolve(p, part)
      assert.equal(lstatSync(p).isSymbolicLink(), false, "Destino enlazado")
    }
    assert.equal(lstatSync(target).nlink, 1, "Destino con hardlinks")
    assert.equal(sha(readFileSync(target)), backwards ? f.sha256 : f.baseSha256, "Base inesperada")
  }
  // Preflight de ambos archivos antes de escribir. Serial, sin promesa transaccional ante apagón.
  for (const f of plan.files) writeFileSync(resolve(absolute, f.path), Buffer.from(backwards ? f.before : f.after, "base64"))
}
export const aplicar = (tree, plan) => transition(tree, plan, false)
export const revertir = (tree, plan) => transition(tree, plan, true)
