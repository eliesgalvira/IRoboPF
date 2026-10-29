import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { leerSnapshot, directorioContenido } from "../../../../lib/procedencia/almacen.ts"
import { verificarContenido } from "../../../../scripts/procedencia/contenido-verificar.mjs"
const historical = JSON.parse(readFileSync("docs/procedencia/correcciones/contratos-r21/historicos.json"))
const actual = JSON.parse(readFileSync(directorioContenido + "/snapshots.json"))
assert.equal(historical.count, 32)
assert.equal(actual.length, 34)
assert.ok(historical.ids.every((h) => actual.includes(h)))
// Muestra histórica dirigida; los otros 28 conservan el pase del padre.
for (const h of [historical.ids[0], "e6eaeed1b3058155774984016651712a54213b0d4702dc59113e7ba9e99aaa9d"]) {
  console.log(h, verificarContenido(leerSnapshot(h), directorioContenido))
}
console.log("32 históricos conservados de 34; muestra dirigida con sus propias fuentes")
