import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {originalCompression} from './vincular-conjunta-open.mjs';
import {parseSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './prospectivos-pdf-reader.mjs';
import {validateBinding,validateReadbacks,bindingContracts} from './pensiones-binding.mjs';
const prefix='docs/procedencia/simuladores/pensiones-prospectivas-2025';
const manifestHash='3647ff3745b3e8941871731e5dd4c913d3d25d38e61aa0f4d210a45e5abebab9';
const hash=x=>createHash('sha256').update(x).digest('hex');
export function checkPensions(root,compressor){
 const read=p=>fs.readFileSync(path.join(root,p));
 const mb=read(prefix+'/MANIFIESTO.json');assert.equal(hash(mb),manifestHash,'manifiesto-fijo');
 const m=JSON.parse(mb);assert.equal(m.metricChanged,false);assert.equal(m.casos.length,2);
 const seals=new Map();
 for(const f of m.files){assert.ok(!seals.has(f.path));assert.ok(!f.path.includes('..')&&!path.isAbsolute(f.path));const bytes=read(f.path);assert.equal(bytes.length,f.bytes);assert.equal(hash(bytes),f.sha256);seals.set(f.path,bytes);}
 const get=p=>{assert.ok(seals.has(p),'archivo-no-sellado');return seals.get(p);};
 const json=p=>JSON.parse(get(p));
 const H=json(prefix+'/hechos-previos.json'),P=json(prefix+'/predicciones-previas.json'),prior=json(prefix+'/manifiesto-previo.json');
 assert.equal(hash(get(prefix+'/hechos-previos.json')),prior.hechosSHA256);assert.equal(P.hechosSHA256,prior.hechosSHA256);
 assert.equal(hash(get(prefix+'/predicciones-previas.json')),prior.prediccionesSHA256);assert.equal(P.revision,prior.revision);assert.equal(prior.observedBefore,false);
 assert.deepEqual(H.casos.map(h=>h.id),m.casos.map(c=>c.id));assert.deepEqual(P.casos.map(p=>p.id),m.casos.map(c=>c.id));
 const observations=[];
 for(const c of m.casos){
  const h=H.casos.find(h=>h.id===c.id),p=P.casos.find(p=>p.id===c.id),dir=c.folder+'/';
  assert.equal(p.openObserved,false);assert.equal(p.schemaAccepted,true);assert.equal(p.result.cuotaDiferencialPresentada,c.expected);
  const s=json(dir+'captura-ses.json'),pdf=get(dir+'captura.pdf'),r=json(dir+'recibo-original.json');
  const raw=Buffer.from(s.contenido,'latin1'),ses=originalCompression(raw,s.sesSHA256,compressor);
  assert.equal(hash(raw),s.latin1SHA256);assert.equal(raw.length,s.latin1Bytes);assert.equal(hash(ses),s.sesSHA256);assert.equal(ses.length,s.sesBytes);
  assert.equal(r.target,c.id);assert.equal(r.sesSha256,s.sesSHA256);assert.equal(r.pdfSha256,hash(pdf));assert.equal(r.countedAsMatch,false);
  const parsed=parseSES(s.contenido),pdfRows=rawPdfRows(pdf,{pages:3,positions:true});
  const binding=validateBinding({h,parsed,pdfRows,spec:json(dir+'correspondencias.json'),contract:bindingContracts[h.id]});
  assert.equal(binding.observed,c.observed);
  const rb=json(dir+'readbacks.json'),readbacks=new Map();
  for(const entry of rb.entries){assert.equal(hash(Buffer.from(entry.contenido)),entry.sha256);assert.ok(!readbacks.has(entry.name));readbacks.set(entry.name,JSON.parse(entry.contenido));}
  assert.equal(readbacks.size,4);
  const work=validateReadbacks({h,initial:readbacks.get(rb.bindings.initial),work:readbacks.get(rb.bindings.work),da61:readbacks.get(rb.bindings.da61)});
  const personal=readbacks.get(rb.bindings.personal).filter(x=>x.visible);
  for(const v of ['90000000B','PRUEBA C OPEN','SOLTERO/A',h.hechos.nacimiento,h.entrada.comunidadAutonoma==='andalucia'?'ANDALUCIA':'MADRID'])assert.equal(personal.filter(x=>x.value===v).length,1,'personal-readback');
  const terminal=json(dir+'terminal-original.json');assert.equal(terminal.reason,'cierre-solicitado');
  const rejected=terminal.actions.filter(a=>a.selectionRejected);assert.deepEqual(rejected,c.id==='pension-2025-madrid-77'?[{selectionRejected:true,command:{op:'click',text:'Rendimientos del trabajo'},count:0}]:[]);
  const times=terminal.actions.filter(a=>!a.selectionRejected).map(a=>Date.parse(a.at));assert.ok(times.every((t,i)=>Number.isFinite(t)&&t>Date.parse(P.at)&&(i===0||t>times[i-1])));
  assert.equal(terminal.actions[0].command.name,'Nueva declaración');
  assert.ok(terminal.actions.some(a=>a.command.title==='Guardar datos trabajo (.ses)'));
  assert.ok(terminal.actions.some(a=>a.command.name==='Vista previa'));
  observations.push({id:c.id,expected:c.expected,observed:binding.observed,exact:c.expected===binding.observed,records:binding.checkedRecords,readbacks:work.work.length,externalFacts:'pensión ordinaria, un pagador y exclusiones según H; no deducidos de la edad ni de un diálogo agregado',weight:null,admission:'admitida-documentalmente'});
 }
 for(const f of m.files)assert.equal(hash(read(f.path)),f.sha256,'integridad-final');
 return {observations,comparison:{comparable:2,exact:observations.filter(o=>o.exact).length,discrepant:observations.filter(o=>!o.exact).length,separate:true},original:{exact:76,total:80,unchanged:true},landlords:{exact:4,total:4,separate:true},metricChanged:false,admission:'admitida-documentalmente',chronology:'coherencia de registros locales; sin firma temporal externa'};
}
