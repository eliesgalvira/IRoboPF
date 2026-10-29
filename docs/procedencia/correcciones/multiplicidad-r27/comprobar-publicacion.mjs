import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const padre = process.cwd()
const root = resolve(padre, '.cache/orquestador-recepcion/r27/multiplicidad/despues-acotado')
const out = resolve(padre, 'docs/procedencia/correcciones/multiplicidad-r27/despues-acotado')
const ejecucion = JSON.parse(readFileSync(resolve(out, 'comprobacion-get.json'), 'utf8'))
assert.equal(ejecucion.success, true)
process.chdir(root)
const { leerSnapshot, resolver, enlacesDocumentales, objeto } = await import(root + '/lib/procedencia/almacen.ts')
const { verificarContenido } = await import(root + '/scripts/procedencia/contenido-verificar.mjs')
const store = resolve(root, 'docs/procedencia/implementaciones/contenidos/datos')
const id = ejecucion.result.snapshot
const snapshot = leerSnapshot(id, store)
assert.equal(snapshot.version, 2)
const registry = JSON.parse(readFileSync(resolve(root, 'docs/procedencia/enlaces/registro.json'), 'utf8'))
const esperados = new Map()
for (const entry of registry.entries) {
  const payload = JSON.parse(readFileSync(resolve(root, entry.payload.path), 'utf8'))
  const lista = esperados.get(payload.itemId) ?? []
  lista.push({ hash: entry.payload.sha256, payload })
  esperados.set(payload.itemId, lista)
}
assert.equal(esperados.size, 90)
assert.equal(snapshot.evidencias.length, 228)
let maximoEnlaces = 0
for (const [itemId, lista] of esperados) {
  const estados = snapshot.evidencias.filter((e) => e.sujeto.id === itemId)
  assert.deepEqual(estados.map((e) => e.payload).sort(), lista.map((p) => p.hash).sort())
  assert.equal(new Set(estados.map((e) => e.sujeto.revision)).size, 1)
  const sujeto = resolver(id, itemId, estados[0].sujeto.revision, store)
  assert.deepEqual(sujeto.aristas.filter((a) => a.relacion === 'norma').map((a) => a.destino.id).sort(), lista.map((p) => `evidencia.${p.hash}.rule`).sort())
  for (const { hash, payload } of lista) {
    const ref = sujeto.aristas.find((a) => a.destino.id === `evidencia.${hash}.rule`).destino
    const regla = resolver(id, ref.id, ref.revision, store)
    assert.equal(regla.proposicion, payload.scope.claim)
    assert.equal(regla.aristas.length, 2)
    assert.equal(regla.ambito.estado, 'desconocido')
  }
  const enlaces = enlacesDocumentales(id, sujeto, store)
  assert.ok(enlaces.length >= 3)
  maximoEnlaces = Math.max(maximoEnlaces, enlaces.length)
}
for (const h of new Set(snapshot.evidencias.map((e) => e.recibo))) {
  const recibo = JSON.parse(objeto(store, h).toString())
  assert.equal(recibo.version, 2)
  assert.equal(recibo.estados.length, 228)
  assert.equal(new Set(recibo.entradas.map((e) => e.entidad.id)).size, recibo.entradas.length)
}
const repetido = snapshot.evidencias.find((e) => esperados.get(e.sujeto.id).length > 1)
const otra = snapshot.evidencias.find((e) => e.sujeto.id === repetido.sujeto.id && e.payload !== repetido.payload)
const mutaciones = [
  ['omitir un año de sujeto compartido', snapshot.evidencias.filter((e) => e !== repetido)],
  ['duplicar un par', [...snapshot.evidencias, repetido]],
  ['cruzar dos años del mismo sujeto', snapshot.evidencias.map((e) => e === repetido ? { ...e, payload: otra.payload } : e)],
  ['cambiar revisión del sujeto', snapshot.evidencias.map((e) => e === repetido ? { ...e, sujeto: { ...e.sujeto, revision: 'f'.repeat(64) } } : e)],
]
const negativos = []
for (const [nombre, evidencias] of mutaciones) {
  assert.throws(() => verificarContenido({ ...snapshot, evidencias }, store), /Cobertura de evidencia/)
  negativos.push({ nombre, rechazado: true })
}
const resultado = { snapshot: id, sujetos: esperados.size, enlaces: snapshot.evidencias.length, maximoEnlacesDocumentales: maximoEnlaces, negativos, aceptacionFiscalCompleta: false, confianzaActivaModificada: false }
writeFileSync(resolve(out, 'comprobacion-propia.json'), JSON.stringify(resultado, null, 2) + '\n')
console.log(JSON.stringify(resultado))
