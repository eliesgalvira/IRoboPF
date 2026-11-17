import {readFileSync} from 'node:fs';
import {isDeepStrictEqual as equal} from 'node:util';
import {referenciaValencia,cargarInquilinoValencia,leerPaqueteValencia} from './valencia-public-loader.mjs';
const ref=referenciaValencia();
export const valenciaId=ref.id;
const mutable=['resultadoOpenEUR','componentesOpenEUR','evidenciaOpen','integridadReferencias','estado','pendientes'];
export const stableValencia=c=>Object.fromEntries(Object.entries(c).filter(([k])=>!mutable.includes(k)));
const need=(v,c)=>{if(!v)throw Error(c);};
export function observacionValencia(resultado){return {
 resultadoOpenEUR:resultado,componentesOpenEUR:{},
 evidenciaOpen:{valencia:{schema:'valencia-open-public-v1',archivo:ref.package.file,sha256:ref.package.sha256}},
 integridadReferencias:{referencias:[{archivo:ref.package.file,sha256:ref.package.envelopeSha256}]},
 estado:'transporte-valencia-ses-pdf-vinculado',pendientes:[]};}
export function comprobarSlotValencia(caso,{pre=false}={}){
 need(equal(stableValencia(caso),ref.stable),'val-stable-slot');
 if(pre){need(equal(caso,ref.casePre),'val-transaction-pre');return;}
 const observation=Object.fromEntries(mutable.filter(k=>Object.hasOwn(caso,k)).map(k=>[k,caso[k]]));
 need(equal(observation,observacionValencia(caso.resultadoOpenEUR)),'val-observation');
}
export function vincularValenciaOpen(caso,base,{fixture=JSON.parse(readFileSync(new URL('../../../tests/fixtures/inquilinos-factual-2025.json',import.meta.url)))}={}){
 try{
  comprobarSlotValencia(caso);
  const r=cargarInquilinoValencia({bytes:leerPaqueteValencia(base),sha256:caso.evidenciaOpen.valencia.sha256,
   entradaAPI:caso.entradaAPI,stable:stableValencia(caso),fixture,resultadoOfrecidoEUR:caso.resultadoOpenEUR});
  return {...r,estado:'transporte-valencia-ses-pdf-vinculado',transporteValidado:true,transportComplete:true,countedAsMatch:false};
 }catch{return {estado:'no-verificado',motivo:'val-public-replay-rechazado',resultadoOpenEUR:null,transportComplete:false,countedAsMatch:false};}
}
