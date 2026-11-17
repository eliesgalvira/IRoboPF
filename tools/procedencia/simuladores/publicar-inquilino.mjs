// Ejecutar sólo sobre una integración autorizada, nunca desde esta preparación.
import {readFileSync,writeFileSync,openSync,closeSync,unlinkSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {cargarInquilinoPublico,readRelative} from './inquilinos-public-loader.mjs';
import {comprobarSlotInquilino,observacionInquilino,vincularInquilinoOpen} from './vincular-inquilino-open.mjs';
const pins=JSON.parse(readFileSync(new URL('./inquilinos-transaccion-pre.json',import.meta.url)));
const ref=JSON.parse(readFileSync(new URL('./inquilinos-public-reference.json',import.meta.url)));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function prepararPublicacion(casos,observaciones,{base,fixture}){
 const before=structuredClone({casos,observaciones});
 const a=casos.casos.filter(c=>c.id===ref.id),b=observaciones.casos.filter(c=>c.id===ref.id);
 if(a.length!==1||b.length!==1||casos.N!==80||observaciones.N!==80)throw Error('inq-pre-censo');
 comprobarSlotInquilino(a[0],{pre:true});comprobarSlotInquilino(b[0],{pre:true});
 const bytes=readRelative(base,'inquilinos-oficiales/inquilino-murcia-02.json.gz');
 const r=cargarInquilinoPublico({bytes,sha256:ref.package.sha256,entradaAPI:a[0].entradaAPI,identidadPeso:ref.identidadPeso,fixture,resultadoOfrecidoEUR:'264.55'});
 const post=structuredClone(before);
 for(const d of [post.casos,post.observaciones])Object.assign(d.casos.find(c=>c.id===ref.id),observacionInquilino(r.resultadoOpenEUR));
 for(const k of ['casos','observaciones']){
  const rest=d=>d.casos.filter(c=>c.id!==ref.id);
  if(!equal(rest(before[k]),rest(post[k]))||rest(post[k]).length!==79)throw Error('inq-otros-cambiados');
  if(vincularInquilinoOpen(post[k].casos.find(c=>c.id===ref.id),base,{fixture}).estado!=='transporte-inquilino-ses-pdf-vinculado')throw Error('inq-post-replay');
 }
 if(!equal(before,{casos,observaciones}))throw Error('inq-mutacion');
 return post;
}
export function publicarInquilino(root){
 const lock=resolve(root,'.inquilino-publicacion.lock'),fd=openSync(lock,'wx');
 try{
  const originals=Object.fromEntries(Object.keys(pins).map(n=>[n,readFileSync(resolve(root,n))]));
  const check=()=>{for(const [n,h]of Object.entries(pins))if(hash(readFileSync(resolve(root,n)))!==h)throw Error('inq-cas-deriva');};
  check();
  const names=Object.keys(pins),[a,b,f]=names;
  const post=prepararPublicacion(JSON.parse(originals[a]),JSON.parse(originals[b]),{base:dirname(resolve(root,a)),fixture:JSON.parse(originals[f])});
  check(); // PRE completo de ambos documentos, fixture y otros 79 antes de escribir.
  try{writeFileSync(resolve(root,a),JSON.stringify(post.casos,null,2)+'\n');writeFileSync(resolve(root,b),JSON.stringify(post.observaciones,null,2)+'\n');}
  catch(e){writeFileSync(resolve(root,a),originals[a]);writeFileSync(resolve(root,b),originals[b]);throw e;}
  return {estado:'publicado',generados:'pendientes-del-padre'};
 }finally{closeSync(fd);unlinkSync(lock);}
}
if(import.meta.main)publicarInquilino(resolve(process.argv[2]));
