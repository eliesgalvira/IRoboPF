import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs'
import {resolve} from 'node:path'
import {leerSnapshot,directorioContenido,objeto} from '../../../../lib/procedencia/almacen.ts'
import {hash} from '../../../../lib/procedencia/verificador.ts'
import {verificarContenido} from '../../../../scripts/procedencia/contenido-verificar.mjs'
const s=leerSnapshot('e6eaeed1b3058155774984016651712a54213b0d4702dc59113e7ba9e99aaa9d')
const destino=resolve('.cache/contratos-r21-sol/software')
mkdirSync(resolve(destino,'objetos'),{recursive:true})
for(const h of s.auxiliares)cpSync(resolve(directorioContenido,'objetos',h),resolve(destino,'objetos',h))
const recibo=JSON.parse(objeto(directorioContenido,s.evidencias[0].recibo))
const d=recibo.entrada.dependencias.find(x=>x.path==='tools/procedencia/enlaces.py')
const original=d.sha256
// Sustituye solo la fuente conservada del recibo por bytes reales de package.json.
// No toca payloads, registros, aprobaciones, inventario, entidades ni software actual.
d.sha256=hash(readFileSync('package.json'))
assert.ok(s.auxiliares.includes(d.sha256))
const bytes=Buffer.from(JSON.stringify(recibo))
const nuevo=hash(bytes)
writeFileSync(resolve(destino,'objetos',nuevo),bytes)
const falso={...s,evidencias:s.evidencias.map(e=>({...e,recibo:nuevo})),auxiliares:[...s.auxiliares,nuevo].sort(),dependencias:[...s.dependencias,{hash:nuevo,bytes:bytes.length}].sort((a,b)=>a.hash.localeCompare(b.hash))}
console.log(JSON.stringify({originalSoftware:original,declaredSoftware:d.sha256,originalReceipt:s.evidencias[0].recibo,alteredReceipt:nuevo,explanationUnchanged:s.versiones.explicacion}))
assert.throws(()=>verificarContenido(falso,destino),'Debe rechazar fuente de software del recibo incoherente con la explicación conservada')
