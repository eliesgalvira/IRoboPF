import assert from "node:assert/strict"
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { generar } from "../../../../scripts/procedencia/contenido-generar.mjs"
const store = resolve("docs/procedencia/implementaciones/contenidos/datos")
const result = generar(process.cwd(), store)
assert.equal(generar(process.cwd(), store).snapshot, result.snapshot)
writeFileSync(resolve("docs/procedencia/implementaciones/integracion-sol-r17/generacion-v1.json"), JSON.stringify(result) + "\n")
process.stdout.write("v1 determinista " + result.snapshot + "\n")
