import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { publicar } from "../../../../scripts/procedencia/contenido-publicar.mjs"
import { verificarContenido } from "../../../../scripts/procedencia/contenido-verificar.mjs"
import { leerSnapshot } from "../../../../lib/procedencia/almacen.ts"
const root = process.cwd()
const own = resolve(root, "docs/procedencia/implementaciones/integracion-sol-r17")
const store = resolve(root, "docs/procedencia/implementaciones/contenidos/datos")
const entry = JSON.parse(readFileSync(resolve(own, "entrada-publicacion.json")))
const previous = JSON.parse(readFileSync(resolve(own, "primera-publicacion-v2.json")))
const result = await publicar(root, entry, store, store)
assert.equal(result.snapshot, previous.snapshot)
const snapshot = leerSnapshot(result.snapshot, store)
assert.equal(snapshot.version, 2)
verificarContenido(snapshot, store)
for (const evidence of snapshot.evidencias) {
  assert.equal(evidence.revisionBinding, "pending")
  assert.equal(evidence.aceptacionFiscalCompleta, false)
}
const aliasPath = resolve(root, "lib/procedencia/rastro-generado.json")
const alias = JSON.parse(readFileSync(aliasPath))
alias.actual.versiones = { snapshot: result.snapshot, ...snapshot.versiones }
writeFileSync(aliasPath, JSON.stringify(alias) + "\n")
writeFileSync(resolve(own, "repeticion-v2.json"), JSON.stringify(result, null, 2) + "\n")
process.stdout.write(JSON.stringify(result) + "\n")
