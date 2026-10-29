import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const dir=import.meta.dirname;
const resultados=JSON.parse(readFileSync(dir+'/resultados.json','utf8'));
const rastros=JSON.parse(readFileSync(dir+'/rastro.json','utf8'));
const pruebas=[
 ['CAV1-01',()=>assert.equal(resultados.find(r=>r.id==='cuota-publicada-centimo').exit.value.cuotaDiferencialPresentada,'3750.13')],
 ['CAV1-02-contexto',()=>assert.deepEqual(rastros[0].contexto,{anio:2025,territorio:'madrid',perfilCalculo:'solo-trabajo'})],
 ['CAV1-02-enlaces',()=>assert.equal(rastros.every(r=>r.lineas.every(l=>l.procedencia?.estado==='enlazada')),true)],
 ['CAV1-03',()=>assert.equal(resultados.find(r=>r.id==='agregado-extremo-empleo-laboral').exit._tag,'Success')],
];
const rojos=[];
for(const [id,ejecutar] of pruebas){
 try{ejecutar();rojos.push({id,estado:'verde'});}catch(error){rojos.push({id,estado:'rojo',error:String(error)});}
}
writeFileSync(dir+'/rojos.json',JSON.stringify(rojos,null,2));
console.log(JSON.stringify(rojos,null,2));
process.exitCode=rojos.some(r=>r.estado==='rojo')?1:0;
