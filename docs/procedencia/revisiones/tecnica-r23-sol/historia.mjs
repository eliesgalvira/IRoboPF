import assert from 'node:assert/strict'
import {readFileSync, writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {leerSnapshot, objeto} from '../../../../lib/procedencia/almacen.ts'
import {verificarContenido} from '../../../../scripts/procedencia/contenido-verificar.mjs'
import {hash} from '../../../../lib/procedencia/verificador.ts'
const store = resolve('docs/procedencia/implementaciones/contenidos/datos')
const ids = JSON.parse(readFileSync(resolve(store,'snapshots.json')))
const anteriores = JSON.parse(readFileSync('docs/procedencia/correcciones/tecnica-r23/historicos.json')).ids
assert.equal(ids.length,36)
assert.equal(new Set(ids).size,36)
assert.equal(anteriores.length,34)
assert.ok(anteriores.every((id) => ids.includes(id)))
const resultados=[]
for(const id of ids) {
  const s=leerSnapshot(id,store)
  const control=verificarContenido(s,store)
  for(const e of s.evidencias ?? []) {
    const r=JSON.parse(objeto(store,e.recibo))
    for(const d of r.entrada.dependencias) assert.equal(hash(objeto(store,d.sha256)),d.sha256)
  }
  resultados.push({id,control})
  console.log('verificado',id)
}
writeFileSync('docs/procedencia/revisiones/tecnica-r23-sol/historicos-control.json',JSON.stringify({anteriores, resultados},null,2)+'\n')
