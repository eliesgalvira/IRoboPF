import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  FUENTES_EXPLICACION,
  verificarSoftwareExplicacion,
} from "../scripts/procedencia/explicacion-version.mjs"
import { hash } from "../lib/procedencia/verificador.ts"

const root = fileURLToPath(new URL("../", import.meta.url))
const nominal = [
  "scripts/procedencia/nominal-contrato.mjs",
  "tools/procedencia/nominal.py",
  "schemas/procedencia/binding-payload.schema.json",
  "schemas/procedencia/nominal-cell-scope.schema.json",
  "schemas/procedencia/nominal-projection.schema.json",
  "schemas/procedencia/nominal-dependencies.schema.json",
]

for (const changed of nominal) {
  test(`el snapshot detecta cambios persistentes en ${changed}`, () => {
    const cache = resolve(root, ".cache/nominal-software-pruebas")
    mkdirSync(cache, { recursive: true })
    const target = mkdtempSync(resolve(cache, "caso-"))
    const generator = "scripts/procedencia/contenido-generar.mjs"
    for (const name of new Set([...FUENTES_EXPLICACION, ...nominal, generator])) {
      const path = resolve(target, name)
      mkdirSync(dirname(path), { recursive: true })
      writeFileSync(path, readFileSync(resolve(root, name)))
    }
    const generador = hash(readFileSync(resolve(target, generator)))
    const fuentesSoftware = FUENTES_EXPLICACION.map((name) =>
      hash(readFileSync(resolve(target, name)))
    )
    const snapshot = {
      generador,
      versiones: { explicacion: hash(JSON.stringify({ generador, fuentesSoftware })) },
      auxiliares: fuentesSoftware,
    }
    assert.doesNotThrow(() => verificarSoftwareExplicacion(snapshot, target))
    const path = resolve(target, changed)
    writeFileSync(path, Buffer.concat([readFileSync(path), Buffer.from("\n ")]))
    assert.throws(
      () => verificarSoftwareExplicacion(snapshot, target),
      /Software de explicación distinto/
    )
  })
}
