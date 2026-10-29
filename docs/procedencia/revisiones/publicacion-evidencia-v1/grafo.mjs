import { readFileSync, writeFileSync } from 'node:fs'
import { leerSnapshot, objeto, directorioContenido, buscar } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/almacen.ts'
import { bytesEntidad, hash, verificarGrafo } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/verificador.ts'
const id='efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6';const s=leerSnapshot(id);const receipt=JSON.parse(objeto(directorioContenido,s.evidencias[0].recibo));const results=[];
function test(name,fn){try{results.push({name,value:fn()})}catch(e){results.push({name,error:String(e)})}}
test('ids duplicados con revisiones distintas',()=>{const entries=structuredClone(receipt.entradas);const other=structuredClone(entries[0]);other.entidad.titulo='Duplicado';other.revision=hash(bytesEntidad(other.entidad));entries.push(other);return verificarGrafo(entries,new Set(s.auxiliares))});
test('receta divergente rehasheada',()=>{const entries=structuredClone(receipt.entradas);const fac=entries.find(e=>e.entidad.tipo==='Facsimile');const old=fac.revision;fac.entidad.receta='a'.repeat(64);fac.revision=hash(bytesEntidad(fac.entidad));for(const e of entries)for(const a of e.entidad.aristas)if(a.destino.revision===old)a.destino.revision=fac.revision;return verificarGrafo(entries,new Set([...s.auxiliares,'a'.repeat(64)]))});
for(const [territorio,ejercicio] of [['madrid','2020'],['andalucia','2020'],['madrid','2021']])test('ambito '+territorio+' '+ejercicio,()=>buscar(id,'inv-c24095c17f76bb198b34cf8b8d5a45ed',territorio,ejercicio));
const source=JSON.parse(readFileSync('lib/procedencia/rastro-generado.json'));results.push({name:'alias',value:source.actual});
writeFileSync('.cache/revision-publicacion/grafo.json',JSON.stringify(results,null,2));
