// Fixture sintético: comprueba transporte; no es documento oficial ni prueba fiscal.
import assert from "node:assert/strict"
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  renameSync,
  unlinkSync,
} from "node:fs"
import { resolve } from "node:path"
import { createHash } from "node:crypto"
import { guardarExterno } from "../lib/procedencia/io.mjs"
import { blobPublico } from "../lib/procedencia/almacen.ts"
import { responderObjeto } from "../lib/procedencia/http.ts"
const scratch = mkdtempSync(resolve(".cache/cas-local-r27-sol/contrato-"))
const store = resolve(scratch, "metadata")
const cas = resolve(scratch, "cas")
mkdirSync(resolve(store, "objetos"), { recursive: true })
mkdirSync(cas)
const hash = (b, algorithm = "sha256") =>
  createHash(algorithm).update(b).digest("hex")
const bytes = Buffer.alloc(10_000_001, 32)
bytes.write("%PDF- fixture sintetico sin autoridad\n")
const h = hash(bytes)
writeFileSync(resolve(cas, h), bytes)
const base = JSON.parse(
  readFileSync(
    "docs/procedencia/implementaciones/contenidos/datos/objetos/0bde6df52abc5563cc710ad5fccd8ff6289deb02d076dfbd8bd1e17edbc398df"
  )
)
const descriptor = {
  hash: h,
  sha512: hash(bytes, "sha512"),
  bytes: bytes.length,
  mime: "application/pdf",
  clase: "original-pdf",
}
const snapshot = {
  ...base,
  version: 3,
  externos: [descriptor],
  publicos: [{ hash: h, bytes: bytes.length, mime: "application/pdf" }],
}
function register(s) {
  const b = Buffer.from(JSON.stringify(s))
  const id = hash(b)
  writeFileSync(resolve(store, "objetos", id), b)
  writeFileSync(resolve(store, "snapshots.json"), JSON.stringify([id]))
  return id
}
const id = register(snapshot)
process.env.IROBOPF_CAS_LOCAL = cas
guardarExterno(descriptor, bytes)
assert.deepEqual(blobPublico(id, h, store).bytes, bytes)
assert.equal(responderObjeto(id, h, store).status, 200)
assert.equal(blobPublico(id, "a".repeat(64), store), null)
const sinPermiso = register({ ...snapshot, publicos: [] })
assert.equal(responderObjeto(sinPermiso, h, store).status, 404)
register(snapshot)
process.env.IROBOPF_CAS_LOCAL = "relativa-no-autorizada"
assert.equal(responderObjeto(id, h, store).status, 503)
process.env.IROBOPF_CAS_LOCAL = resolve(scratch, "no-existe")
assert.throws(() => guardarExterno(descriptor, bytes), /ENOENT/)
delete process.env.IROBOPF_CAS_LOCAL
assert.equal(responderObjeto(id, h, store).status, 503)
process.env.IROBOPF_CAS_LOCAL = cas
renameSync(resolve(cas, h), resolve(cas, "ausente"))
assert.equal(responderObjeto(id, h, store).status, 503)
renameSync(resolve(cas, "ausente"), resolve(cas, h))
writeFileSync(resolve(cas, h), bytes.subarray(0, 100))
assert.equal(responderObjeto(id, h, store).status, 503)
writeFileSync(resolve(cas, h), bytes)
const changed = Buffer.from(bytes)
changed[100] = 0
writeFileSync(resolve(cas, h), changed)
assert.equal(responderObjeto(id, h, store).status, 503)
writeFileSync(resolve(cas, h), bytes)
assert.equal(responderObjeto(id, h, store).status, 200)
renameSync(resolve(cas, h), resolve(cas, "original"))
symlinkSync(resolve(cas, "original"), resolve(cas, h))
assert.equal(responderObjeto(id, h, store).status, 503)
// Retira solo el enlace sintético propio para aislar el adverso del ancestro.
unlinkSync(resolve(cas,h))
renameSync(resolve(cas,"original"),resolve(cas,h))
renameSync(cas, cas + "-original")
symlinkSync(cas + "-original", cas)
assert.equal(responderObjeto(id, h, store).status, 503)
for (const extra of [
  { path: "/etc/passwd" },
  { host: "https://evil.example" },
  { bytes: 100_000_001 },
  { bytes: 10_000_000 },
  { clase: "cualquier-fichero" },
  { mime: "image/png" },
]) {
  const bad = register({ ...snapshot, externos: [{ ...descriptor, ...extra }] })
  assert.equal(responderObjeto(bad, h, store).status, 503)
}
console.log(
  JSON.stringify({
    success: true,
    fixture: "sintetico-no-oficial",
    scratch,
    controles:
      "bytes, HTTP, allowlist, configuración ausente/relativa, escritura imposible, ausencia, truncado, mutación persistente, recuperación, symlink, ancestro, descriptores hostiles",
  })
)
