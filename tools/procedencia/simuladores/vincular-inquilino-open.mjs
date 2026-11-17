// Contrato permanente separado del PRE transaccional. Sólo proyección sintética.
import {readFileSync} from 'node:fs';
import {isDeepStrictEqual as equal} from 'node:util';
import {cargarInquilinoPublico,readRelative} from './inquilinos-public-loader.mjs';
const ref=JSON.parse(readFileSync(new URL('./inquilinos-public-reference.json',import.meta.url)));
export const inquilinoId=ref.id;
const archivo='inquilinos-oficiales/inquilino-murcia-02.json.gz';
const mutable=['resultadoOpenEUR','componentesOpenEUR','evidenciaOpen','integridadReferencias','estado','pendientes'];
const stable=c=>Object.fromEntries(Object.entries(c).filter(([k])=>!mutable.includes(k)));
const need=(v,c)=>{if(!v)throw Error(c);};
export function observacionInquilino(resultado){return {
 resultadoOpenEUR:resultado,componentesOpenEUR:{},
 evidenciaOpen:{inquilino:{schema:'inquilino-open-public-v1',archivo,sha256:ref.package.sha256}},
 integridadReferencias:{referencias:[{archivo,sha256:ref.package.sha256}]},
 estado:'transporte-inquilino-ses-pdf-vinculado',pendientes:[]};}
export function comprobarSlotInquilino(caso,{pre=false}={}){
 need(equal(stable(caso),stable(ref.casePre)),'inq-current-stable');
 if(pre){need(equal(caso,ref.casePre),'inq-transaction-pre');return;}
 const actual=Object.fromEntries(mutable.filter(k=>Object.hasOwn(caso,k)).map(k=>[k,caso[k]]));
 need(equal(actual,observacionInquilino(caso.resultadoOpenEUR)),'inq-current-observation');
}
export function vincularInquilinoOpen(caso,base,{fixture=JSON.parse(readFileSync(new URL('../../../tests/fixtures/inquilinos-factual-2025.json',import.meta.url)))}={}){
 try{
  comprobarSlotInquilino(caso);
  const identidadPeso=Object.fromEntries(Object.keys(ref.identidadPeso).map(k=>[k,caso[k]]));
  const r=cargarInquilinoPublico({bytes:readRelative(base,archivo),sha256:caso.evidenciaOpen.inquilino.sha256,entradaAPI:caso.entradaAPI,identidadPeso,fixture,resultadoOfrecidoEUR:caso.resultadoOpenEUR});
  need(r.resultadoOpenEUR===caso.resultadoOpenEUR,'inq-current-result');
  return {...r,estado:'transporte-inquilino-ses-pdf-vinculado',transporteValidado:true,transportComplete:true,countedAsMatch:false};
 }catch{return {estado:'no-verificado',motivo:'inq-public-replay-rechazado',resultadoOpenEUR:null,transportComplete:false,countedAsMatch:false};}
}
