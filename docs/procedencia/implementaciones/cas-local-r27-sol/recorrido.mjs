import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { createHash } from "node:crypto"
const out = resolve(".cache/cas-local-r27-sol")
const root = resolve(out, "ensayo")
process.env.IROBOPF_CAS_LOCAL = resolve(out, "externo")
process.chdir(root)
const { generar } = await import(
  root + "/scripts/procedencia/contenido-generar.mjs"
)
const { prepararEntrada } = await import(
  root + "/scripts/procedencia/evidencia-contenido.mjs"
)
const { publicar } = await import(
  root + "/scripts/procedencia/contenido-publicar.mjs"
)
const { verificarContenido } = await import(
  root + "/scripts/procedencia/contenido-verificar.mjs"
)
const { leerSnapshot } = await import(root + "/lib/procedencia/almacen.ts")
const start = performance.now()
const store = resolve("docs/procedencia/implementaciones/contenidos/datos")
const generated = generar(root, store)
const entry = prepararEntrada(root, generated.snapshot)
writeFileSync(out + "/entrada.json", JSON.stringify(entry, null, 2) + "\n")
const registroAntes = readFileSync(resolve(store, "snapshots.json"))
const casBueno = process.env.IROBOPF_CAS_LOCAL
const casFallido = resolve(out, "no-directorio")
writeFileSync(casFallido, "fallo de escritura inyectado: archivo ordinario")
process.env.IROBOPF_CAS_LOCAL = casFallido
await assert.rejects(publicar(root, entry, store, store), /ENOTDIR/)
assert.deepEqual(readFileSync(resolve(store, "snapshots.json")), registroAntes)
process.env.IROBOPF_CAS_LOCAL = casBueno
const result = await publicar(root, entry, store, store)
const snapshot = leerSnapshot(result.snapshot, store)
verificarContenido(snapshot, store)
assert.equal(snapshot.version, 3)
assert.equal(snapshot.evidencias.length, 264)
assert.equal(snapshot.externos.length, 1)
assert.equal(
  snapshot.externos[0].hash,
  "e7b629a20bde61bcb42c54b2caf3af06f2b44613fc6f89718ff5ff9763d4a4f4"
)
assert.equal(snapshot.externos[0].bytes, 42_900_459)
const originalGrande = snapshot.externos[0].hash
let enlacesOriginal = 0
for (const e of snapshot.evidencias) {
  const payload = JSON.parse(readFileSync(resolve(store, "objetos", e.payload)))
  const document = JSON.parse(
    readFileSync(resolve(store, "objetos", payload.document.sha256))
  )
  if (document.sha256 === originalGrande) enlacesOriginal++
}
assert.equal(enlacesOriginal, 36)
const sujetos = [
  ...new Map(snapshot.evidencias.map((e) => [e.sujeto.id, e.sujeto])).values(),
]
assert.equal(sujetos.length, 102)
for (const e of snapshot.evidencias) {
  assert.equal(e.revisionBinding, "accepted-limited")
  assert.equal(e.aceptacionFiscalCompleta, false)
}
const { GET: ficha } = await import(
  root + "/app/procedencia/[snapshot]/[id]/[revision]/route.ts"
)
const { GET: objeto } = await import(
  root + "/app/procedencia/[snapshot]/objetos/[hash]/route.ts"
)
for (const sujeto of sujetos) {
  const r = await ficha(new Request("http://localhost/"), {
    params: Promise.resolve({ snapshot: result.snapshot, ...sujeto }),
  })
  assert.equal(r.status, 200)
  const html = await r.text()
  const expected = snapshot.evidencias.filter((e) => e.sujeto.id === sujeto.id)
  for (const e of expected) assert.ok(html.includes(e.payload))
  assert.equal(
    (html.match(/<dt>Aceptación fiscal completa<\/dt>/g) ?? []).length,
    expected.length
  )
  assert.equal((html.match(/<dd>false<\/dd>/g) ?? []).length, expected.length)
}
const objetos = []
for (const p of snapshot.publicos) {
  const r = await objeto(new Request("http://localhost/"), {
    params: Promise.resolve({ snapshot: result.snapshot, hash: p.hash }),
  })
  assert.equal(r.status, 200)
  assert.equal(r.headers.get("content-type"), p.mime)
  const bytes = Buffer.from(await r.arrayBuffer())
  assert.equal(bytes.length, p.bytes)
  assert.equal(createHash("sha256").update(bytes).digest("hex"), p.hash)
  objetos.push(p)
}
writeFileSync(
  out + "/recorrido.json",
  JSON.stringify(
    {
      success: true,
      result,
      pares: 264,
      sujetos: sujetos.length,
      externos: snapshot.externos,
      objetos,
      milliseconds: performance.now() - start,
      peakRss: process.resourceUsage().maxRSS,
      aceptacionFiscalCompleta: false,
    },
    null,
    2
  ) + "\n"
)
console.log(readFileSync(out + "/recorrido.json", "utf8"))
