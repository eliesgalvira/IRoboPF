import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { generarEvidencia, prepararEntrada, comprobarEntrada } from './scripts/procedencia/evidencia-contenido.mjs';
import { hash, bytesEntidad, verificarGrafo } from './lib/procedencia/verificador.ts';
const root=process.cwd();
const snapshot=JSON.parse(readFileSync('lib/procedencia/rastro-generado.json')).actual.versiones.snapshot;
const payloadPath='docs/procedencia/enlaces/madrid-2020-limite.json';
const registryPath='docs/procedencia/enlaces/registro.json';
const citationPath='docs/procedencia/corpus/madrid-2020-limite.citation.json';
const originales=new Map([payloadPath,registryPath,citationPath].map(p=>[p,readFileSync(p)]));
const logs=[];
function restore(){for(const [p,b] of originales)writeFileSync(p,b);}
function repin(edit){
 const p=JSON.parse(originales.get(payloadPath)); const r=JSON.parse(originales.get(registryPath)); const c=JSON.parse(originales.get(citationPath));
 edit(p,c,r); writeFileSync(citationPath,JSON.stringify(c)); p.citation.sha256=hash(readFileSync(citationPath));
 writeFileSync(payloadPath,JSON.stringify(p)); r.entries[0].payload.sha256=hash(readFileSync(payloadPath)); writeFileSync(registryPath,JSON.stringify(r));
 return prepararEntrada(root,snapshot);
}
async function caso(id,fn){try{const resultado=await fn();logs.push({id,resultado});}catch(e){logs.push({id,rechazo:String(e)});}finally{restore();writeFileSync('../adversos.json',JSON.stringify(logs,null,2));}}
let positivo;
await caso('positivo-real',async()=>{positivo=await generarEvidencia(root,prepararEntrada(root,snapshot)); mkdirSync('../objetos-positivo',{recursive:true});for(const [h,b] of positivo.objetos)writeFileSync('../objetos-positivo/'+h,b); return {revision:positivo.revision,estados:positivo.informe.estados,objetos:positivo.objetos.size};});
await caso('claim-y-ambito-repinados',async()=>{const input=repin(p=>{p.scope.year=2021;p.scope.territory='andalucia';p.scope.claim='Este límite acredita toda la escala de Andalucía en 2021.';});const r=await generarEvidencia(root,input);return r.informe.estados;});
await caso('unidad-repinada',async()=>generarEvidencia(root,repin(p=>{p.scope.unit='percent';})));
await caso('texto-y-selector-repinados',async()=>generarEvidencia(root,repin((p,c)=>{c.quote=c.quote.replace('53.407,20','53.407,29');c.selectors[0].exact=c.quote;})));
await caso('geometria-repinada',async()=>generarEvidencia(root,repin((p,c)=>{c.geometry.rotation=90;})));
await caso('recibo-inyectado',()=>comprobarEntrada(root,{...prepararEntrada(root,snapshot),evidence:{integrity:'verified'}}));
await caso('cierre-solo-declarado',()=>verificarGrafo(positivo.informe.entradas,new Set(positivo.objetos.keys())));
await caso('ids-iguales-revisiones-distintas',()=>{const entries=structuredClone(positivo.informe.entradas);const e=structuredClone(entries[0].entidad);e.titulo='Otra revisión';entries.push({entidad:e,revision:hash(bytesEntidad(e))});return verificarGrafo(entries,new Set(positivo.objetos.keys()));});
await caso('receta-crop-divergente-rehasheada',()=>{const entries=structuredClone(positivo.informe.entradas);const crop=entries.find(e=>e.entidad.tipo==='Facsimile');const previo=crop.revision;crop.entidad.receta=hash('receta falsa');crop.revision=hash(bytesEntidad(crop.entidad));for(const e of entries){for(const a of e.entidad.aristas){if(a.destino.revision===previo)a.destino.revision=crop.revision;}e.revision=hash(bytesEntidad(e.entidad));} // reparar aristas ascendentes tras cambiar Rule
 const rule=entries.find(e=>e.entidad.tipo==='Rule');const parameter=entries.find(e=>e.entidad.tipo==='Parameter');parameter.entidad.aristas[0].destino.revision=rule.revision;parameter.revision=hash(bytesEntidad(parameter.entidad));return verificarGrafo(entries,new Set([...positivo.objetos.keys(),hash('receta falsa')]));});
console.log(JSON.stringify(logs,null,2));
