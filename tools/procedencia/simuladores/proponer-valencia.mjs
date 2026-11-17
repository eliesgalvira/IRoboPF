// Propuesta sin escrituras: devuelve ambos documentos tras CAS de bytes completo.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {referenciaValencia} from './valencia-public-loader.mjs';
import {comprobarSlotValencia,observacionValencia,vincularValenciaOpen,stableValencia} from './vincular-valencia-open.mjs';
const tx=JSON.parse(readFileSync(new URL('./valencia-transaction.json',import.meta.url)));
const ref=referenciaValencia(),hash=b=>createHash('sha256').update(b).digest('hex');
const need=(v,c)=>{if(!v)throw Error(c);};
export function proponerPublicacionValencia(originals,{base}){
 need(equal(Object.keys(originals).sort(),Object.keys(tx.pins).sort()),'val-transaction-files');
 for(const [n,h]of Object.entries(tx.pins))need(Buffer.isBuffer(originals[n])&&hash(originals[n])===h,'val-transaction-cas');
 const [a,b,f]=Object.keys(tx.pins),fixture=JSON.parse(originals[f]);
 const before={casos:JSON.parse(originals[a]),observaciones:JSON.parse(originals[b])};
 const post=structuredClone(before);
 for(const k of ['casos','observaciones']){
  const d=post[k],slots=d.casos.filter(c=>c.id===ref.id);
  need(d.N===80&&d.casos.length===80&&new Set(d.casos.map(c=>c.id)).size===80&&slots.length===1,'val-transaction-census');
  comprobarSlotValencia(slots[0],{pre:true});
  Object.assign(slots[0],observacionValencia('-198.95'));
  const r=vincularValenciaOpen(slots[0],base,{fixture});
  need(r.transportComplete===true&&r.resultadoOpenEUR==='-198.95'&&r.countedAsMatch===false,'val-transaction-replay');
  need(equal(stableValencia(slots[0]),ref.stable),'val-transaction-stable');
  const rest=doc=>doc.casos.filter(c=>c.id!==ref.id);
  need(equal(rest(before[k]),rest(d))&&rest(d).length===79,'val-transaction-others');
 }
 const proposed={[a]:Buffer.from(JSON.stringify(post.casos,null,2)+'\n'),[b]:Buffer.from(JSON.stringify(post.observaciones,null,2)+'\n')};
 // El integrador debe volver a comparar los PRE y aplicar ambos o ninguno.
 return {estado:'propuesta-validada-sin-escrituras',preSha256:structuredClone(tx.pins),proposed,
  countedAsMatch:false,medicion:'pendiente-medidor-separado'};
}
