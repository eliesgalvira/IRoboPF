import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { verificarSoftwareRecibo } from '../../../../scripts/procedencia/explicacion-version.mjs'
const helper = 'scripts/procedencia/explicacion-version.mjs'
const motor = 'lib/historico.ts'
const sha = (b) => createHash('sha256').update(b).digest('hex')
const literal = JSON.stringify([helper, motor])
function comprobar(text, paths = [helper, motor]) {
  const objects = new Map()
  const dependencias = []
  for (const [path, source] of [['scripts/procedencia/contenido-generar.mjs', 'generador'], [helper, text], ...paths.filter((p) => p !== helper).map((p) => [p, 'motor'])]) {
    const bytes = Buffer.from(source)
    const sha256 = sha(bytes)
    objects.set(sha256, bytes)
    dependencias.push({path, sha256})
  }
  const porRuta = (p) => dependencias.find((d) => d.path === p).sha256
  const generador = dependencias[0].sha256
  verificarSoftwareRecibo({generador, auxiliares:[...objects.keys()], versiones:{explicacion:sha(JSON.stringify({generador, fuentesSoftware:paths.map(porRuta)}))}}, dependencias, (h) => objects.get(h))
}
for (const suffix of [
  'export { otra as "FUENTES_EXPLICACION" }',
  'export { otra as "FUENTES_\\u0045XPLICACION" } from "otro"',
  'export * as FUENTES_EXPLICACION from "otro"',
  'let FUENTES_EXPLICACION',
  'function FUENTES_EXPLICACION() {}',
  'class FUENTES_EXPLICACION {}',
  'import { FUENTES_EXPLICACION } from "otro"',
  'const { x: FUENTES_EXPLICACION } = otro',
  'const [FUENTES_EXPLICACION] = otro',
  'const alias = FUENTES_EXPLICACION',
  'FUENTES_EXPLICACION = []',
  'FUENTES_EXPLICACION?.map(x => x)',
  'FUENTES_EXPLICACION["map"](x => x)',
  'export { FUENTES_EXPLICACION as otra }',
]) test('binding adverso: ' + suffix, () => assert.throws(() => comprobar(`export const FUENTES_EXPLICACION = ${literal}; ${suffix}`)))
for (const p of ['lib/ñ.ts', 'lib/x.ts\n', 'lib/x.ts\r', 'lib/x.ts\u2028', 'lib/x.ts\u2029', 'lib/x.ts\0', 'lib/ｘ.ts', 'lib/x.ts ', 'lib/x.ts\t', 'lib/../x.ts', '//x.ts', 'lib\\x.ts']) {
  test('ruta exacta rechazada ' + JSON.stringify(p), () => assert.throws(() => comprobar(`export const FUENTES_EXPLICACION = ${JSON.stringify([helper, p])}`, [helper, p])))
}
test('escape JS que representa el mismo identificador y ruta ASCII', () => assert.doesNotThrow(() => comprobar(`export const FUENTES_\\u0045XPLICACION = ["scripts/procedencia/explicacion-version.mjs", "lib/\\u0068istorico.ts"]`)))
test('map con callback opaco no es prueba de ejecución; sigue siendo dato', () => assert.doesNotThrow(() => comprobar(`export const FUENTES_EXPLICACION = ${literal}; FUENTES_EXPLICACION.map((v,i,a) => { a[i] = 'otra'; throw Error('NO EJECUTAR') });`)))
test('throw y bucle infinito no se ejecutan', () => assert.doesNotThrow(() => comprobar(`export const FUENTES_EXPLICACION = ${literal}; throw Error('NO'); while(true){}`)))
