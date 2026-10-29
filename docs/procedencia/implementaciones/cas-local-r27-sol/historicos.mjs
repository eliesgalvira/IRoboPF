import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
} from "node:fs"
import { resolve } from "node:path"
import assert from "node:assert/strict"
import {
  verificar,
  verificarContenido,
} from "../../../../scripts/procedencia/contenido-verificar.mjs"
import { leerSnapshot } from "../../../../lib/procedencia/almacen.ts"
const out = resolve(".cache/cas-local-r27-sol")
const actual = resolve("docs/procedencia/implementaciones/contenidos/datos")
const ids = JSON.parse(readFileSync(resolve(actual, "snapshots.json")))
for (const id of ids) verificar(id, actual)
// Restauración de copia local: solo metadatos y allowlist externa fijados.
const source = resolve(
  out,
  "ensayo/docs/procedencia/implementaciones/contenidos/datos"
)
const target = resolve(out, "restaurado")
const cas = resolve(out, "cas-restaurado")
mkdirSync(resolve(target, "objetos"), { recursive: true })
mkdirSync(cas, { recursive: true })
const result = JSON.parse(readFileSync(out + "/recorrido.json"))
const snap = leerSnapshot(result.result.snapshot, source)
for (const h of [...snap.auxiliares, result.result.snapshot]) {
  if (snap.externos.some((e) => e.hash === h)) continue
  copyFileSync(resolve(source, "objetos", h), resolve(target, "objetos", h))
}
for (const e of snap.externos) {
  const src = resolve(out, "externo", e.hash)
  const dst = resolve(cas, e.hash)
  copyFileSync(src, dst)
  assert.notEqual(statSync(src).ino, statSync(dst).ino)
}
writeFileSync(
  resolve(target, "snapshots.json"),
  JSON.stringify([result.result.snapshot])
)
process.env.IROBOPF_CAS_LOCAL = cas
verificarContenido(leerSnapshot(result.result.snapshot, target), target)
assert.deepEqual(
  JSON.parse(readFileSync(resolve(actual, "snapshots.json"))),
  ids
)
writeFileSync(
  out + "/historicos-restauracion.json",
  JSON.stringify(
    {
      historicos: ids,
      restaurado: result.result.snapshot,
      externos: snap.externos,
      copiaOrdinaria: true,
      success: true,
    },
    null,
    2
  ) + "\n"
)
console.log(JSON.stringify({ historicos: ids.length, restauracion: true }))
