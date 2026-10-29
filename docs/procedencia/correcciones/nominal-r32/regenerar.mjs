import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generar } from '../../../../scripts/procedencia/contenido-generar.mjs'
import { prepararEntrada } from '../../../../scripts/procedencia/evidencia-contenido.mjs'
import { publicar } from '../../../../scripts/procedencia/contenido-publicar.mjs'
import { verificarContenido } from '../../../../scripts/procedencia/contenido-verificar.mjs'
import { leerSnapshot } from '../../../../lib/procedencia/almacen.ts'
import { hash } from '../../../../lib/procedencia/verificador.ts'

const root = process.cwd()
const out = resolve(root, 'docs/procedencia/correcciones/nominal-r32')
const datos = resolve(root, 'docs/procedencia/implementaciones/contenidos/datos')
const registry = resolve(root, 'docs/procedencia/enlaces/registro.json')
const reviewers = resolve(root, 'docs/procedencia/enlaces/revisores.json')
const registryBytes = readFileSync(registry), reviewerBytes = readFileSync(reviewers)
assert.equal(JSON.parse(registryBytes).entries.length, 1)
assert.equal(JSON.parse(registryBytes).entries[0].attestation, null)
assert.equal(JSON.parse(reviewerBytes).reviewers.length, 0)
assert.equal(hash(readFileSync(resolve(root, 'docs/procedencia/inventario.json'))), '30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7')
const interruptedDraft = '2a035eed497fa2b655ef3f081eadaf9779d40244e8c52417b9d27de85314411c'
const atStart = JSON.parse(readFileSync(resolve(datos, 'snapshots.json')))
assert.equal(atStart.length, 43)
assert.ok(atStart.includes(interruptedDraft))
const previous = atStart.filter(id => id !== interruptedDraft)
assert.equal(previous.length, 42)
const aliasPath = resolve(root, 'lib/procedencia/rastro-generado.json')
const alias = JSON.parse(readFileSync(aliasPath))
assert.equal(alias.actual.versiones.snapshot, interruptedDraft)
const priorActive = 'f811507b90eeb0b2e477a9abfa94c2cec6223992d94106cb6539c08d6c3c933c'
verificarContenido(leerSnapshot(priorActive, datos), datos)
const generated = generar(root, datos)
assert.equal(generated.snapshot, interruptedDraft)
const input = prepararEntrada(root, generated.snapshot)
writeFileSync(resolve(out, 'entrada-publicacion.json'), JSON.stringify(input, null, 2) + '\n')
const published = await publicar(root, input, datos, datos)
const snapshot = leerSnapshot(published.snapshot, datos)
assert.equal(snapshot.version, 2)
assert.equal(snapshot.evidencias.length, 1)
assert.equal(snapshot.evidencias[0].revisionBinding, 'pending')
assert.equal(snapshot.evidencias[0].aceptacionFiscalCompleta, false)
assert.equal(alias.actual.catalogoSha256, snapshot.catalogo)
alias.actual.versiones = { snapshot: published.snapshot, ...snapshot.versiones }
writeFileSync(aliasPath, JSON.stringify(alias) + '\n')
const current = JSON.parse(readFileSync(resolve(datos, 'snapshots.json')))
assert.equal(current.length, 44)
assert.ok(previous.every(id => current.includes(id)))
assert.deepEqual(readFileSync(registry), registryBytes)
assert.deepEqual(readFileSync(reviewers), reviewerBytes)
const result = { historicalPreserved: previous, parentHistoricalRechecked: [priorActive], independentHistoricalReview: 'docs/procedencia/revisiones/cas-local-r30-sol/historicos-restauracion.json', newSnapshots: [generated.snapshot, published.snapshot], total: current.length, versions: alias.actual.versiones, publication: published, registrySha256: hash(registryBytes), reviewersSha256: hash(reviewerBytes), completeRuleAcceptance: false }
writeFileSync(resolve(out, 'regeneracion.json'), JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify({ total: current.length, snapshot: published.snapshot, versions: alias.actual.versiones }))
