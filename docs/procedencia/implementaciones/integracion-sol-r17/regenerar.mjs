import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { resolve } from "node:path"
import { prepararEntrada } from "../../../../scripts/procedencia/evidencia-contenido.mjs"
const own = resolve("docs/procedencia/implementaciones/integracion-sol-r17")
const run = (file) => {
  const result = spawnSync(process.execPath, [resolve(own, file)], { stdio: "inherit" })
  assert.equal(result.status, 0, file)
}
if (!process.argv.includes("--continuar")) {
  run("historicos.mjs")
  run("generar-v1.mjs")
  const v1 = JSON.parse(readFileSync(resolve(own, "generacion-v1.json")))
  writeFileSync(resolve(own, "entrada-publicacion.json"), JSON.stringify(prepararEntrada(process.cwd(), v1.snapshot), null, 2) + "\n")
}
run("publicar-una.mjs")
const historical = JSON.parse(readFileSync(resolve(own, "historicos.json")))
const v1 = JSON.parse(readFileSync(resolve(own, "generacion-v1.json")))
const v2 = JSON.parse(readFileSync(resolve(own, "repeticion-v2.json")))
const result = { historicalVerified: historical.count, v1, v2, deterministic: true, promotions: 0 }
writeFileSync(resolve(own, "publicacion.json"), JSON.stringify(result, null, 2) + "\n")
process.stdout.write(JSON.stringify(result) + "\n")
