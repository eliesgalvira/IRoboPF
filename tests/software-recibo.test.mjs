import { test } from "node:test"
import assert from "node:assert/strict"
import { hash } from "../lib/procedencia/verificador.ts"
import { verificarSoftwareRecibo } from "../scripts/procedencia/explicacion-version.mjs"

const helperPath = "scripts/procedencia/explicacion-version.mjs"
const motorPath = "lib/historico.ts"
function fixture(
  lista = `export const FUENTES_EXPLICACION = ${JSON.stringify([helperPath, motorPath])}`
) {
  const objetos = new Map()
  const dependencias = []
  function save(path, text) {
    const bytes = Buffer.from(text)
    const sha256 = hash(bytes)
    objetos.set(sha256, bytes)
    dependencias.push({ path, sha256 })
    return sha256
  }
  const generador = save(
    "scripts/procedencia/contenido-generar.mjs",
    "generador histórico"
  )
  const helper = save(helperPath, lista)
  const motor = save(motorPath, "motor histórico")
  const sustituto = save("package.json", "otro objeto conservado")
  const snapshot = {
    generador,
    auxiliares: [...objetos.keys()],
    versiones: {
      explicacion: hash(
        JSON.stringify({ generador, fuentesSoftware: [helper, motor] })
      ),
    },
  }
  return { snapshot, dependencias, objetos, sustituto }
}
function run(f) {
  return verificarSoftwareRecibo(f.snapshot, f.dependencias, (h) =>
    f.objetos.get(h)
  )
}

test("un recibo histórico usa sus fuentes conservadas y no las del checkout", () => {
  assert.doesNotThrow(() => run(fixture()))
})

test("sustituir una fuente por otro objeto íntegro no conserva la versión", () => {
  const f = fixture()
  f.dependencias.find((d) => d.path === motorPath).sha256 = f.sustituto
  assert.throws(() => run(f), /distinto de la explicación/)
})

test("duplicados, fuentes ausentes y bytes corruptos se rechazan", () => {
  const duplicado = fixture()
  duplicado.dependencias.push(duplicado.dependencias[1])
  assert.throws(() => run(duplicado), /duplicada/)
  const ausente = fixture()
  ausente.dependencias = ausente.dependencias.filter(
    (d) => d.path !== motorPath
  )
  assert.throws(() => run(ausente), /ausente/)
  const corrupto = fixture()
  corrupto.objetos.set(corrupto.dependencias[2].sha256, Buffer.from("alterado"))
  assert.throws(() => run(corrupto), /corrupta/)
})

test("la lista conservada se interpreta como datos y nunca ejecuta expresiones", () => {
  for (const lista of [
    "// export const FUENTES_EXPLICACION = []",
    "export const FUENTES_EXPLICACION = (() => { throw Error('no ejecutar') })()",
    `export const FUENTES_EXPLICACION = [${JSON.stringify(helperPath)}, ...['x']]`,
    `export const FUENTES_EXPLICACION = [${JSON.stringify(helperPath)}, ${JSON.stringify(helperPath)}]`,
    `export const FUENTES_EXPLICACION = [${JSON.stringify(helperPath)}, '../fuera']`,
    "export const FUENTES_EXPLICACION = ['sin-helper']",
  ])
    assert.throws(() => run(fixture(lista)), /histórica/)
})

test("el binding histórico no admite otras declaraciones, aliases o escrituras", () => {
  const literal = JSON.stringify([helperPath, motorPath])
  for (const lista of [
    `export const FUENTES_EXPLICACION = ${literal}; export { FUENTES_EXPLICACION }`,
    `export var FUENTES_EXPLICACION = ${literal}; var FUENTES_EXPLICACION = ['otra']`,
    `export const FUENTES_EXPLICACION = ${literal}; var { x: FUENTES_EXPLICACION } = {}`,
    `export const FUENTES_EXPLICACION = ${literal}; if (true) { var FUENTES_EXPLICACION }`,
    `export const FUENTES_EXPLICACION = ${literal}; FUENTES_EXPLICACION.push('otra')`,
    `export const FUENTES_EXPLICACION = ${literal}; FUENTES_EXPLICACION[0] = 'otra'`,
    `export const FUENTES_EXPLICACION = ${literal}; const alias = FUENTES_EXPLICACION`,
    `export const FUENTES_EXPLICACION = ${literal}; export * from './otra.mjs'`,
    `export const FUENTES_EXPLICACION = ${JSON.stringify([helperPath, 'lib/x.ts\n'])}`,
  ])
    assert.throws(() => run(fixture(lista)), /histórica/)
})
