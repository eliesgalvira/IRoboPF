import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const root=resolve('.cache/multiplicidad-r27-sol/despues-acotado'),out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol')
const {comprobarEntrada}=await import(root+'/scripts/procedencia/evidencia-contenido.mjs')
const entry=JSON.parse(readFileSync(out+'/despues-acotado/entrada.json'))
const registry=JSON.parse(readFileSync(root+'/docs/procedencia/enlaces/registro.json'))
const sources=new Set(registry.entries.map(e=>JSON.parse(readFileSync(root+'/'+e.payload.path)).source.file))
comprobarEntrada(root,entry)
const results=[]
for(const path of sources){const d=entry.dependencias.find(d=>d.path===path);assert.ok(d,path)
 const actual=resolve(root,path),original=readFileSync(actual)
 try{writeFileSync(actual,Buffer.concat([original,Buffer.from('\n// cambio persistente tardío de contraprueba\n')]))
 assert.throws(()=>comprobarEntrada(root,entry),/Dependencia alterada/)
 results.push({path,baseSha256:d.sha256,rejected:true})}
 finally{writeFileSync(actual,original)}
}
writeFileSync(out+'/fuentes-persistentes.json',JSON.stringify(results,null,2)+'\n');console.log(results)
