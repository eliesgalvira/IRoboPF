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
const out = resolve(root, 'docs/procedencia/correcciones/multiplicidad-r27')
const datos = resolve(root, 'docs/procedencia/implementaciones/contenidos/datos')
const registroPath = resolve(root, 'docs/procedencia/enlaces/registro.json')
const revisoresPath = resolve(root, 'docs/procedencia/enlaces/revisores.json')
const registroBytes = readFileSync(registroPath)
const revisoresBytes = readFileSync(revisoresPath)
assert.equal(JSON.parse(readFileSync(resolve(out, 'despues-acotado/comprobacion-propia.json'))).enlaces, 228)
assert.equal(JSON.parse(registroBytes).entries.length, 1)
assert.equal(JSON.parse(registroBytes).entries[0].attestation, null)
assert.equal(JSON.parse(revisoresBytes).reviewers.length, 0)
assert.equal(hash(readFileSync(resolve(root, 'docs/procedencia/inventario.json'))), '30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7')
const anteriores = JSON.parse(readFileSync(resolve(datos, 'snapshots.json')))
assert.equal(anteriores.length, 36)
for (const id of anteriores) verificarContenido(leerSnapshot(id, datos), datos)
writeFileSync(resolve(out, 'historicos.json'), JSON.stringify({ ids: anteriores, verificados: true }, null, 2) + '\n')
const generado = generar(root, datos)
const entrada = prepararEntrada(root, generado.snapshot)
writeFileSync(resolve(out, 'entrada-publicacion.json'), JSON.stringify(entrada, null, 2) + '\n')
const publicado = await publicar(root, entrada, datos, datos)
const snapshot = leerSnapshot(publicado.snapshot, datos)
assert.equal(snapshot.version, 2)
assert.equal(snapshot.evidencias.length, 1)
assert.equal(snapshot.evidencias[0].revisionBinding, 'pending')
assert.equal(snapshot.evidencias[0].aceptacionFiscalCompleta, false)
const aliasPath = resolve(root, 'lib/procedencia/rastro-generado.json')
const alias = JSON.parse(readFileSync(aliasPath))
assert.equal(alias.actual.catalogoSha256, snapshot.catalogo)
alias.actual.versiones = { snapshot: publicado.snapshot, ...snapshot.versiones }
writeFileSync(aliasPath, JSON.stringify(alias) + '\n')
const actuales = JSON.parse(readFileSync(resolve(datos, 'snapshots.json')))
assert.equal(actuales.length, 38)
assert.ok(anteriores.every((id) => actuales.includes(id)))
assert.deepEqual(readFileSync(registroPath), registroBytes)
assert.deepEqual(readFileSync(revisoresPath), revisoresBytes)
const resultado = { anterioresVerificados: 36, nuevos: [generado.snapshot, publicado.snapshot], totalConservado: 38, versiones: alias.actual.versiones, publicacion: publicado, registroSha256: hash(registroBytes), revisoresSha256: hash(revisoresBytes), aceptacionFiscalCompleta: false }
writeFileSync(resolve(out, 'regeneracion.json'), JSON.stringify(resultado, null, 2) + '\n')
console.log(JSON.stringify(resultado))
