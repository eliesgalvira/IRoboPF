import fs from 'node:fs';
import assert from 'node:assert/strict';
const src='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/',out='docs/procedencia/revisiones/flujo-retenciones-ss-r26-sol/';
const originalProgram=fs.readFileSync(src+'verificar.mjs','utf8');
const original=JSON.parse(fs.readFileSync(src+'grafo.json','utf8'));
const results=[];
/** @type {Array<[string, (g: any) => any]>} */
const variants=[['base',g=>g],['sin-aristas',g=>{g.edges=[];return g;}],['fuente-arista-falsa',g=>{g.edges[0].source.text='inexistente';return g;}],['destino-inexistente',g=>{g.edges[0].to='inventado';return g;}],['binding-falso',g=>{g.nodes.find(n=>n.id==='R.escala').argumentBindings[0].arguments=['baseFalsa'];return g;}],['subject-extra',g=>{g.sites[0].subject.extra='ajeno';return g;}]];
for(const [id,mutate] of variants){const altered=mutate(structuredClone(original));const program=`const reviewOut=${JSON.stringify(out+'validador-')};\n`+originalProgram.replace("const data=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));",'const data='+JSON.stringify(altered)+';').replaceAll('fs.writeFileSync(out+','fs.writeFileSync(reviewOut+');try{await import('data:text/javascript;base64,'+Buffer.from(program+'\n//'+id).toString('base64'));results.push({id,accepted:true});}catch(error){results.push({id,accepted:false,error:String(error)});}}
fs.writeFileSync(out+'limites-validador.json',JSON.stringify(results,null,2));
assert.equal(results[0].accepted,true,'La variante base debe pasar antes de interpretar las mutaciones');
const cases=fs.readFileSync(src+'casos.mjs','utf8').replace("const out='"+src+"';","const out='"+out+"autor-';");await import('data:text/javascript;base64,'+Buffer.from(cases).toString('base64'));
