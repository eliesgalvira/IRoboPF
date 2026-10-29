import assert from "node:assert/strict"
import { renameSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { generar } from "../../../../scripts/procedencia/contenido-generar.mjs"
import { prepararEntrada } from "../../../../scripts/procedencia/evidencia-contenido.mjs"
import { publicar } from "../../../../scripts/procedencia/contenido-publicar.mjs"
import { verificarContenido } from "../../../../scripts/procedencia/contenido-verificar.mjs"
import {
  leerSnapshot,
  resolver,
  enlacesDocumentales,
} from "../../../../lib/procedencia/almacen.ts"
import { Ficha } from "../../../../lib/procedencia/ficha.tsx"

const root = process.cwd()
const expected = fileURLToPath(
  new URL("../../../../.cache/ambitos/e2e", import.meta.url)
)
assert.equal(root, expected, "Ensayo permitido solo en scratch propio")
const store = resolve(
  root,
  "docs/procedencia/implementaciones/contenidos/datos"
)
const generated = generar(root, store)
const entry = prepararEntrada(root, generated.snapshot)
const result = await publicar(root, entry, store, store)
const snapshot = leerSnapshot(result.snapshot, store)
assert.equal(snapshot.version, 2)
verificarContenido(snapshot, store)
const evidence = snapshot.evidencias[0]
assert.equal(evidence.revisionBinding, "accepted-limited")
assert.equal(evidence.aceptacionFiscalCompleta, false)
const entidad = resolver(
  result.snapshot,
  evidence.sujeto.id,
  evidence.sujeto.revision,
  store
)
assert.ok(entidad)
const html = renderToStaticMarkup(
  createElement(Ficha, {
    entidad,
    snapshot: result.snapshot,
    evidencia: evidence,
    enlaces: enlacesDocumentales(result.snapshot, entidad, store),
  })
)
for (const text of [
  "accepted-limited",
  "MADRID_2022[0].baseInferior",
  "madrid-2022",
  "no acreditadas",
  "false",
])
  assert.ok(html.includes(text), text)
const receipt = resolve(store, "objetos", evidence.recibo)
const moved = receipt + ".synthetic-moved"
renameSync(receipt, moved)
try {
  assert.throws(() => verificarContenido(snapshot, store), /ausente|ENOENT/)
} finally {
  renameSync(moved, receipt)
}
verificarContenido(snapshot, store)
process.stdout.write(
  JSON.stringify({
    syntheticOnly: true,
    ...result,
    renderVerified: true,
    missingReceiptRejected: true,
  }) + "\n"
)
