// Preparadas; replay público obligatorio. No raíz privada ni skips.
import {test,beforeAll} from 'vitest';
import {Schema} from 'effect';
const isRecord=Schema.is(Schema.Record(Schema.String,Schema.Unknown)),isBoolean=Schema.is(Schema.Boolean),isNumber=Schema.is(Schema.Number);
import {rawPdfRows} from '../tools/procedencia/simuladores/conjunta-pdf.mjs';
import {vincularValenciaOpen,stableValencia} from '../tools/procedencia/simuladores/vincular-valencia-open.mjs';
import {proponerPublicacionValencia} from '../tools/procedencia/simuladores/proponer-valencia.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {prepararInquilinoValencia,vincularInquilinoValencia,inspeccionarSESInquilinoValencia,proyectarValencia} from '../tools/procedencia/simuladores/valencia-open.mjs';
import {leerPaqueteValencia,referenciaValencia,reconstruirPaquete,cargarInquilinoValencia} from '../tools/procedencia/simuladores/valencia-public-loader.mjs';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/inquilinos-factual-2025.json',import.meta.url)));
const pub=referenciaValencia(),ref=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/valencia-reference.json',import.meta.url))),d='valencia-captura76/';
const base=new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url);
let files,prepared,text,pdf;
const reject=r=>{assert.equal(r.estado,'no-verificado');assert.equal(r.countedAsMatch,false);assert.equal(r.transportComplete,false);assert.equal(r.resultadoOpenEUR,null);};
beforeAll(()=>{
 files=reconstruirPaquete(leerPaqueteValencia(base),pub.package.sha256).files;
 assert.equal(Object.keys(files).length,185);
 prepared=prepararInquilinoValencia(fixture,files['inquilinos-transporte38/inquilinos-transporte.json']);
 text=inflateSync(files[d+'exportado.ses']).toString('latin1');pdf=files[d+'exportado-pdf.txt'].toString('utf8');
});
test('originales: proyección con límite explícito, sin mutar ni contar',()=>{
 const before=structuredClone(prepared),result=vincularInquilinoValencia(prepared,{files});
 assert.equal(result.estado,'entrada-ses-y-resultado-pdf-vinculados');
 assert.equal(result.resultadoEUR,'-198.95');assert.equal(result.originalResumenEUR,'601.05');
 assert.equal(result.resumenDifiereDelFinal,true);assert.equal(result.pdfBytesExtraidosIndependientemente,true);
 assert.equal(result.hechosExternosSonReadbacks,false);assert.equal(result.countedAsMatch,false);
 assert.equal(result.transportComplete,false);assert.equal(result.resultadoOpenEUR,null);
 assert.deepEqual(prepared,before);
 const replay=cargarInquilinoValencia({bytes:leerPaqueteValencia(base),sha256:pub.package.sha256,fixture,entradaAPI:ref.entrada,stable:pub.stable,resultadoOfrecidoEUR:'-198.95'});
 assert.equal(replay.resultadoOpenEUR,'-198.95');assert.equal(replay.countedAsMatch,false);
});
test('cada original ausente, alterado, extra y semilla salarial final falsa',()=>{
 for(const n of Object.keys(ref.archivos)){
  const missing={...files};delete missing[n];reject(vincularInquilinoValencia(prepared,{files:missing}));
  reject(vincularInquilinoValencia(prepared,{files:{...files,[n]:Buffer.concat([files[n],Buffer.from(' ')])}}));
 }
 reject(vincularInquilinoValencia(prepared,{files:{...files,extra:Buffer.alloc(0)}}));
 for(const ext of ['ses','pdf'])reject(vincularInquilinoValencia(prepared,{files:{...files,[d+'exportado.'+ext]:files['valencia-captura58/'+ref.id+'/parcial-trabajo.'+ext]}}));
 for(const ev of [null,{finalCapture:true,resultadoEUR:'-198.95'},{files:{}}])reject(vincularInquilinoValencia(prepared,ev));
});
function leaves(v,path=[]){return (Array.isArray(v)||isRecord(v))?Object.entries(v).flatMap(([k,x])=>leaves(x,[...path,k])):[path];}
test('todas las hojas de full inputs y externos, incluidos ceros y false',()=>{
 for(const field of ['entradaAPI','contratoExterno'])for(const path of leaves(prepared[field])){
  const bad=structuredClone(prepared);let parent=bad[field];for(const k of path.slice(0,-1))parent=parent[k];
  const key=path.at(-1),v=parent[key];parent[key]=isBoolean(v)?!v:isNumber(v)?v+1:String(v)+'-alterado';
  reject(vincularInquilinoValencia(bad,{files}));
  delete parent[key];reject(vincularInquilinoValencia(bad,{files}));
 }
 for(const field of ['entradaAPI','contratoExterno']){const bad=structuredClone(prepared);bad[field].extra=true;reject(vincularInquilinoValencia(bad,{files}));}
 assert.throws(()=>prepararInquilinoValencia([...fixture,...fixture.filter(f=>f.id===ref.id)],files['inquilinos-transporte38/inquilinos-transporte.json']));
});
test('SES: ámbitos, censo, tipos, flags, duplicados, signo y subcéntimos',()=>{
 const mutations=[
  s=>s.replace('CAC_D~1~17','CAC_D~1~13'),s=>s.replace('INDV~1~true','INDV~1~false'),
  s=>s.replace('CLAVE1VA14~1~2','CLAVE1VA14~1~1'),s=>s.replace('IMP1VA14~1~7200.0','IMP1VA14~1~7200.001'),
  s=>s.replace('IMP1VA14~1~7200.0','IMP1VA14~2~254'),s=>s.replace('IMP1VA14~1~7200.0','IMP1VA14~3~7200.0~254'),
  s=>s.replace('MESES1VA14~1~365','MESES1VA14~1~364'),s=>s.replace('NUM1VA14~1~1','NUM1VA14~1~2'),
  s=>s.replace('NIF1VA14~1~90000001N','NIF1VA14~1~90000000B'),
  s=>s.replace('     VA14~1~800.0','     VA14~1~800.0\n     VA14~1~800.0'),
  s=>s.replace('    [VALENCIA]','    [VALENCIA]\n    [VALENCIA]'),
  s=>s.replace('     IMP1VA14','   IMP1VA14'),s=>s.replace('RESULTADO~1~-198.95','RESULTADO~1~198.95'),
  s=>s.replace('  [RESUMEN]','  [INMUEBLES]\n  [RESUMEN]'),
 ];
 for(const mutate of mutations){const bad=mutate(text);assert.notEqual(bad,text);assert.throws(()=>inspeccionarSESInquilinoValencia(bad));}
});
test('PDF: falta/duplicación/cambio de casilla, NIF, importe y signo',()=>{
 for(const box of ['1124','1128','1129','1095','1130','0564','0570','0571','0587','0609','0610','0670','1122']){
  const lines=pdf.split('\n'),ix=lines.findIndex(l=>new RegExp('\\s'+box+'\\s*$').test(l));assert.ok(ix>=0);
  const missing=lines.filter((_,i)=>i!==ix).join('\n');assert.throws(()=>proyectarValencia(text,missing));
  assert.throws(()=>proyectarValencia(text,pdf+'\n'+lines[ix]));
  const changed=[...lines];changed[ix]=changed[ix].replace(box,'9999');assert.throws(()=>proyectarValencia(text,changed.join('\n')));
 }
 assert.throws(()=>proyectarValencia(text,pdf.replaceAll('-198,95','198,95')));
 assert.throws(()=>proyectarValencia(text,pdf.replaceAll('90000001N','90000000B')));
});

const tx=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/valencia-transaction.json',import.meta.url)));
test('PDF original independiente coincide en todas las casillas finales y NIF',()=>{
 const independent=rawPdfRows(files[d+'exportado.pdf']).map(r=>r.text).join('\n');
 assert.deepEqual(proyectarValencia(text,independent),proyectarValencia(text,pdf));
 assert.equal(proyectarValencia(text,independent).resultadoEUR,'-198.95');
 assert.throws(()=>rawPdfRows(Buffer.from(pdf)));
 assert.throws(()=>rawPdfRows(files[d+'exportado.pdf'].subarray(0,64)));
 const seed='valencia-captura58/'+ref.id+'/parcial-trabajo.pdf';
 assert.throws(()=>proyectarValencia(text,rawPdfRows(files[seed]).map(r=>r.text).join('\n')));
});
test('paquete obligatorio: bytes, hash, ausencia y archivos adicionales nunca acreditan replay',()=>{
 const bytes=leerPaqueteValencia(base);
 for(const offered of [Buffer.alloc(0),Buffer.concat([bytes,Buffer.from(' ')]),bytes.subarray(0,bytes.length-1)])assert.throws(()=>reconstruirPaquete(offered,pub.package.sha256));
 assert.throws(()=>reconstruirPaquete(bytes,'0'.repeat(64)));
 assert.throws(()=>leerPaqueteValencia(new URL('./fixtures/',import.meta.url)));
 const args={bytes,sha256:pub.package.sha256,fixture,entradaAPI:ref.entrada,stable:pub.stable,resultadoOfrecidoEUR:'-198.95'};
 for(const value of ['601.05','198.95','-198.950',null,undefined])assert.throws(()=>cargarInquilinoValencia({...args,resultadoOfrecidoEUR:value}));
 for(const key of Object.keys(pub.stable)){
  const stable=structuredClone(pub.stable);delete stable[key];assert.throws(()=>cargarInquilinoValencia({...args,stable}));
 }
 assert.throws(()=>cargarInquilinoValencia({...args,fixture:fixture.slice(1)}));
});
test('slot estable y todos los pesos se comprueban antes del mutable; replay público obligatorio',()=>{
 assert.equal(vincularValenciaOpen(tx.post,base).transportComplete,true);
 for(const field of Object.keys(pub.stable)){
  const bad=structuredClone(tx.post);delete bad[field];reject(vincularValenciaOpen(bad,base));
  const changed=structuredClone(tx.post);changed[field]=null;reject(vincularValenciaOpen(changed,base));
 }
 for(const value of ['601.05','198.95',null])reject(vincularValenciaOpen({...tx.post,resultadoOpenEUR:value},base));
 reject(vincularValenciaOpen({...tx.post,extra:true},base));
 reject(vincularValenciaOpen({...tx.post,componentesOpenEUR:{cuotaDiferencial:'601.05'}},base));
 reject(vincularValenciaOpen(tx.pre,base));
 assert.deepEqual(stableValencia(tx.post),pub.stable);
});
test('propuesta CAS rechaza bytes derivados y no escribe ni cambia los otros 79',()=>{
 // Los documentos propuestos en el parche son POST. El PRE sólo se acepta por hash.
 const originals=Object.fromEntries(Object.keys(tx.pins).map(n=>[n,readFileSync(new URL('../'+n,import.meta.url))]));
 assert.throws(()=>proponerPublicacionValencia(originals,{base}));
 for(const n of Object.keys(originals)){
  const changed={...originals,[n]:Buffer.concat([originals[n],Buffer.from(' ')])};
  assert.throws(()=>proponerPublicacionValencia(changed,{base}));
 }
 const preBytes={...originals};
 for(const n of Object.keys(tx.pins).slice(0,2)){
  const doc=JSON.parse(originals[n]);doc.casos[doc.casos.findIndex(c=>c.id===ref.id)]=structuredClone(tx.pre);
  preBytes[n]=Buffer.from(JSON.stringify(doc,null,2)+'\n');
 }
 const snapshot=Object.fromEntries(Object.entries(preBytes).map(([n,b])=>[n,Buffer.from(b)]));
 const proposal=proponerPublicacionValencia(preBytes,{base});
 assert.equal(proposal.estado,'propuesta-validada-sin-escrituras');assert.equal(proposal.countedAsMatch,false);
 assert.deepEqual(preBytes,snapshot);
 for(const n of Object.keys(proposal.proposed)){
  const before=JSON.parse(preBytes[n]),post=JSON.parse(proposal.proposed[n]);
  assert.deepEqual(post.casos.filter(c=>c.id!==ref.id),before.casos.filter(c=>c.id!==ref.id));
  assert.equal(post.casos.find(c=>c.id===ref.id).resultadoOpenEUR,'-198.95');
 }
});
