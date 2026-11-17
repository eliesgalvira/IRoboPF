import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './prospectivos-pdf-reader.mjs';
import {validateBinding,validateReadbacks,bindingContracts} from './pensiones-binding.mjs';
import {checkPensions} from './pensiones-checker.mjs';
const prefix='docs/procedencia/simuladores/pensiones-prospectivas-2025';
const json=p=>JSON.parse(fs.readFileSync(prefix+'/'+p));
const H=json('hechos-previos.json');
test('dos observaciones conservan el céntimo discrepante y el contador original',()=>{
 const r=checkPensions(process.cwd());
 assert.deepEqual(r.observations.map(o=>[o.expected,o.observed,o.exact]),[['-323.72','-323.71',false],['465.24','465.24',true]]);
 assert.deepEqual(r.original,{exact:76,total:80,unchanged:true});assert.equal(r.metricChanged,false);
 assert.ok(r.observations.every(o=>o.weight===null));
});
for(const h of H.casos){
 const s=json(h.id+'/captura-ses.json'),parsed=parseSES(s.contenido),spec=json(h.id+'/correspondencias.json');
 const pdfRows=rawPdfRows(fs.readFileSync(prefix+'/'+h.id+'/captura.pdf'),{pages:3,positions:true});
 const input={h,parsed,spec,pdfRows,contract:bindingContracts[h.id]};
 const rb=json(h.id+'/readbacks.json'),entries=new Map(rb.entries.map(e=>[e.name,JSON.parse(e.contenido)]));
 const readings={h,initial:entries.get(rb.bindings.initial),work:entries.get(rb.bindings.work),da61:entries.get(rb.bindings.da61)};
 test(h.id+' cada registro se contrasta por su significado y ámbito',()=>{
  assert.equal(validateBinding(input).checkedRecords,parsed.records.length);
  for(let i=0;i<parsed.records.length;i++){
   const x=structuredClone(parsed);x.records[i].value=x.records[i].value==='1'?'2':'1';
   assert.throws(()=>validateBinding({...input,parsed:x}),undefined,'registro '+i);
  }
 });
 test(h.id+' estructura, duplicación y omisión no se admiten',()=>{
  for(const key of ['scope','type','flag']){const x=structuredClone(parsed);x.records[0][key]=key==='scope'?1:key==='type'?'3':'254';assert.throws(()=>validateBinding({...input,parsed:x}));}
  const extra=structuredClone(parsed);extra.records.push({...extra.records[0]});assert.throws(()=>validateBinding({...input,parsed:extra}));
  const missing=structuredClone(parsed);missing.records.pop();assert.throws(()=>validateBinding({...input,parsed:missing}));
 });
 test(h.id+' contrato y hechos no se resellan para admitir otra población',()=>{
  const changed=structuredClone(h);changed.entrada.trabajo.rendimientos[0].clase='empleo-laboral';assert.throws(()=>validateBinding({...input,h:changed}));
  for(const [key,value]of [['otrasRentas','capital-mobiliario'],['familiaresConDerechoMinimo','segun-derechos'],['residenciaTodoElAnio',false],['saldosAnteriores','positivos']]){const x=structuredClone(h);x.entrada[key]=value;assert.throws(()=>validateBinding({...input,h:x}));}
  const rules=structuredClone(spec);rules.rules[0].literal='123';assert.throws(()=>validateBinding({...input,spec:rules}));
  assert.throws(()=>validateBinding({...input,contract:{...input.contract,rules:'0'.repeat(64)}}));
 });
 test(h.id+' importes visibles y DA61 se vinculan a controles concretos',()=>{
  const result=validateReadbacks(readings);assert.equal(result.work.length,6);
  for(const item of result.work){const x=structuredClone(readings.work);x.find(v=>v.id===item.id).value='9.999,99';assert.throws(()=>validateReadbacks({...readings,work:x}));}
  const x=structuredClone(readings.da61);x.find(v=>v.visible&&v.title==='Importe íntegro:').value='17.000,00';assert.throws(()=>validateReadbacks({...readings,da61:x}));
 });
 test(h.id+' casillas y páginas del PDF son necesarias',()=>{
  assert.throws(()=>rawPdfRows(fs.readFileSync(prefix+'/'+h.id+'/captura.pdf'),{pages:2,positions:true}));
  const x=pdfRows.filter(r=>!r.text.endsWith('0670'));assert.throws(()=>validateBinding({...input,pdfRows:x}));
 });
}
