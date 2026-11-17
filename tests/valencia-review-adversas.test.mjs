// Pruebas independientes de integridad del paquete y del expediente.
// Requieren el compresor Nix fijado en C_SES_NODE. Sin skips ni motor fiscal.
import {beforeAll, test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gunzipSync, gzipSync} from 'node:zlib';
import {referenciaValencia, leerPaqueteValencia, reconstruirPaquete, cargarInquilinoValencia, originalCompression} from '../tools/procedencia/simuladores/valencia-public-loader.mjs';
import {vincularValenciaOpen, stableValencia} from '../tools/procedencia/simuladores/vincular-valencia-open.mjs';
import {proponerPublicacionValencia} from '../tools/procedencia/simuladores/proponer-valencia.mjs';
import {preValencia} from './valencia-transaction-fixture.mjs';
const ref=referenciaValencia();
const tx=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/valencia-transaction.json',import.meta.url)));
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
const fixture=JSON.parse(readFileSync(new URL('./fixtures/inquilinos-factual-2025.json',import.meta.url)));
const sha=b=>createHash('sha256').update(b).digest('hex');
let bytes;
const reject=r=>{assert.equal(r.transportComplete,false);assert.equal(r.countedAsMatch,false);assert.equal(r.resultadoOpenEUR,null);};
const load=overrides=>cargarInquilinoValencia({bytes,sha256:ref.package.sha256,fixture,entradaAPI:ref.casePre.entradaAPI,stable:ref.stable,resultadoOfrecidoEUR:'-198.95',...overrides});
beforeAll(()=>{
 bytes=leerPaqueteValencia(base);
 // El positivo evita que una instalación rota haga pasar sólo rechazos.
 const r=load();assert.equal(r.resultadoOpenEUR,'-198.95');assert.equal(r.countedAsMatch,false);
},30_000);
test('el fixture completo incluye las filas ajenas al slot y su orden',()=>{
 assert.deepEqual(fixture,ref.fixture);assert.ok(fixture.length>1);
 const i=fixture.findIndex(x=>x.id!==ref.id);assert.ok(i>=0);
 const changed=structuredClone(fixture);changed[i].extra='sintetico:alterado';
 for(const offered of [changed,fixture.filter((_,j)=>j!==i),[...fixture,fixture[i]],[...fixture].reverse()])
  assert.throws(()=>load({fixture:offered}),/val-fixture/);
});
test('ID y proxy territorial tampoco pueden alterarse junto al resultado correcto',()=>{
 for(const field of ['id','pesoExterno','pesoTerritorialProxy','entradaAPI']){
  const bad=structuredClone(tx.post);bad[field]=field==='id'?'sintetico:otro':null;
  reject(vincularValenciaOpen(bad,base));
 }
 const bad=structuredClone(tx.post);bad.pesoTerritorialProxy.n+=1;
 reject(vincularValenciaOpen(bad,base));assert.deepEqual(stableValencia(tx.post),ref.stable);
});
test('resumen salarial no sustituye al final ni permite redondeo o signo alternativo',()=>{
 for(const value of ['601.05','198.95','-198.950','-198.949',null])
  assert.throws(()=>load({resultadoOfrecidoEUR:value}),/val-result/);
 const r=load();assert.equal(r.originalResumenEUR,'601.05');assert.equal(r.resultadoEUR,'-198.95');
 assert.equal(r.resumenDifiereDelFinal,true);assert.equal(r.pdfBytesExtraidosIndependientemente,true);
});
test('un paquete modificado con su hash recalculado no se autoacredita',()=>{
 const p=JSON.parse(gunzipSync(bytes));
 const original=p.files[Object.keys(p.files)[0]];original.content+='sintetico:alterado';
 const offered=gzipSync(Buffer.from(JSON.stringify(p)));
 assert.throws(()=>reconstruirPaquete(offered,sha(offered)),/inq-open-package-root/);
});
test('sin compresor fijado no se acepta ni siquiera una recompresión trivial',()=>{
 const previous=process.env.C_SES_NODE;
 try{
  delete process.env.C_SES_NODE;
  assert.throws(()=>originalCompression(Buffer.from('sintetico'),'0'.repeat(64),ref.compressor),/inq-open-compressor/);
  process.env.C_SES_NODE='node';
  assert.throws(()=>originalCompression(Buffer.from('sintetico'),'0'.repeat(64),ref.compressor),/inq-open-compressor/);
 }finally{if(previous===undefined)delete process.env.C_SES_NODE;else process.env.C_SES_NODE=previous;}
});
test('CAS rechaza un cambio ajeno a Valencia y un único POST mezclado con PRE',()=>{
 const originals=preValencia(tx),names=Object.keys(tx.pins),docName=names.find(n=>n.endsWith('/casos.json'));
 const d=JSON.parse(originals[docName]),other=d.casos.find(c=>c.id!==ref.id);assert.ok(other);other.pesoExterno='0';
 assert.throws(()=>proponerPublicacionValencia({...originals,[docName]:Buffer.from(JSON.stringify(d,null,2)+'\n')},{base}),/val-transaction-cas/);
 const proposal=proponerPublicacionValencia(originals,{base});
 assert.throws(()=>proponerPublicacionValencia({...originals,[docName]:proposal.proposed[docName]},{base}),/val-transaction-cas/);
 for(const n of names)assert.equal(sha(originals[n]),tx.pins[n]);
 assert.equal(Object.keys(proposal.proposed).length,2);
 for(const [n,b]of Object.entries(proposal.proposed)){
  const pre=JSON.parse(originals[n]),post=JSON.parse(b),others=d=>d.casos.filter(c=>c.id!==ref.id);
  assert.equal(others(post).length,79);assert.deepEqual(others(post),others(pre));
  assert.deepEqual(post.casos.find(c=>c.id===ref.id),tx.post);
 }
});
