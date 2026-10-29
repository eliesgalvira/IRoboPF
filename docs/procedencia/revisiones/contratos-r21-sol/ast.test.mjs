import { test } from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { verificarSoftwareRecibo } from "../../../../scripts/procedencia/explicacion-version.mjs"

const helper = "scripts/procedencia/explicacion-version.mjs"
const motor = "lib/historico.ts"
const generator = "scripts/procedencia/contenido-generar.mjs"
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex")
const literal = JSON.stringify([helper, motor])
function fixture(text, paths = [helper, motor]) {
  const objects = new Map()
  const dependencies = []
  for (const [path, source] of [[generator, "generador"], [helper, text], [motor, "motor"], ["package.json", "otro"]]) {
    const bytes = Buffer.from(source)
    const sha256 = sha(bytes)
    objects.set(sha256, bytes)
    dependencies.push({ path, sha256 })
  }
  const byPath = (p) => dependencies.find((d) => d.path === p).sha256
  const generador = byPath(generator)
  const snapshot = { generador, auxiliares: [...objects.keys()], versiones: {
    explicacion: sha(JSON.stringify({ generador, fuentesSoftware: paths.map(byPath) })),
  } }
  return { snapshot, dependencies, objects }
}
function run(f) {
  verificarSoftwareRecibo(f.snapshot, f.dependencies, (h) => f.objects.get(h))
}
for (const [name, text] of [
  ["comentario", `// export const FUENTES_EXPLICACION = ${literal}`],
  ["no exportado", `const FUENTES_EXPLICACION = ${literal}`],
  ["export alias", `const x = ${literal}; export { x as FUENTES_EXPLICACION }`],
  ["declaraciones duplicadas", `export const FUENTES_EXPLICACION = ${literal}; export const FUENTES_EXPLICACION = ${literal}`],
  ["spread", `export const FUENTES_EXPLICACION = [...${literal}]`],
  ["expresión", `export const FUENTES_EXPLICACION = (() => ${literal})()`],
  ["plantilla", 'export const FUENTES_EXPLICACION = [`scripts/procedencia/explicacion-version.mjs`, "lib/historico.ts"]'],
  ["hueco", `export const FUENTES_EXPLICACION = [${JSON.stringify(helper)},,]`],
  ["sintaxis rota", `export const FUENTES_EXPLICACION = ${literal}; )`],
  ...["/abs", "../x", "a/../b", "a/./b", "a//b", "a/", "C:/a", "a\\b", "a?b", "a#b", "a%2fb", ""].map((p) => ["ruta " + p, `export const FUENTES_EXPLICACION = ${JSON.stringify([helper, p])}`]),
  ["ruta duplicada", `export const FUENTES_EXPLICACION = ${JSON.stringify([helper, helper])}`],
  ["helper ausente", 'export const FUENTES_EXPLICACION = ["lib/historico.ts"]'],
]) test(name, () => assert.throws(() => run(fixture(text)), /histórica/))

test("bytes históricos son datos, no se ejecuta ni un throw", () => {
  assert.doesNotThrow(() => run(fixture(`export const FUENTES_EXPLICACION = ${literal}; throw Error('NO EJECUTAR')`)))
})
test("orden, generador, versión y pérdida de fuente no son intercambiables", () => {
  const make = () => fixture(`export const FUENTES_EXPLICACION = ${literal}`)
  const absent = make()
  absent.dependencies = absent.dependencies.filter((d) => d.path !== motor)
  assert.throws(() => run(absent), /ausente/)
  const changed = make()
  changed.dependencies.find((d) => d.path === motor).sha256 = changed.dependencies.find((d) => d.path === "package.json").sha256
  assert.throws(() => run(changed), /distinto/)
  const gen = make()
  gen.snapshot.generador = "0".repeat(64)
  assert.throws(() => run(gen), /distinto/)
  const version = make()
  version.snapshot.versiones.explicacion = "0".repeat(64)
  assert.throws(() => run(version), /distinto/)
  assert.throws(() => run(fixture(`export const FUENTES_EXPLICACION = ${JSON.stringify([motor, helper])}`)), /distinto/)
})
// Nuevos adversos: se conservan rojos si el parser acepta un módulo ambiguo.
test("CR21-A: exportación duplicada del mismo nombre debe rechazarse", () => {
  assert.throws(() => run(fixture(`export const FUENTES_EXPLICACION = ${literal}; export { FUENTES_EXPLICACION };`)))
})
test("CR21-B: una redeclaración local del binding debe rechazarse", () => {
  assert.throws(() => run(fixture(`export var FUENTES_EXPLICACION = ${literal}; var FUENTES_EXPLICACION = ['otra'];`)))
})
