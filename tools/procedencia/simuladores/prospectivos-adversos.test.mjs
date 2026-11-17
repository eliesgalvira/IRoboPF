import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseSES} from './dt18-ses.mjs';
import {rawPdfRows} from './prospectivos-pdf-reader.mjs';
import {validatePdf} from './prospectivos-pdf.mjs';
import {validateSESContract} from './prospectivos-estructura.mjs';
import {binding,csvBytes,decimal,equal,gh,hash,need,reconstruct,safePath,transports} from './prospectivos-core.mjs';
const dir='docs/procedencia/simuladores/alquiler-prospectivo-2025/';
const json=n=>JSON.parse(fs.readFileSync(n));
const c=json('tools/procedencia/simuladores/prospectivos-censo.json');
test('rutas de escape, absolutas y separadores',()=>{for(const p of ['../escape','/escape','a//b','a/./b','a\\b','a:b'])assert.throws(()=>safePath('.',p));});
test('bytes internos fuera de rango y gramática',()=>{for(const s of ['256','-129','1,,2','1.5','1e2',''])assert.throws(()=>csvBytes(s));});
test('sin epsilon ni modificación del esperado',()=>{assert.notDeepEqual(decimal('75015.20004'),decimal('75015.20'));});
for(const o of c.observaciones){
 const S=json(dir+o.id+'/captura-ses.json'),H=json(dir+o.id+'/escenario-previo.json'),P=json(dir+o.id+'/prediccion-previa.json');
 test(o.id+' censo rechaza añadido, ausencia, ámbito y tipo',()=>{
  const parsed=parseSES(S.contenido);assert.deepEqual(parsed.sections,o.sections);assert.deepEqual(parsed.records,o.records);
  for(const text of [S.contenido.replace('</PERSISTENCIAV2>',' X_NUEVO~1~100\n</PERSISTENCIAV2>'),S.contenido.replace(/\n +RET1~[^\n]+/,''),S.contenido.replace('[IRPF2025]','[OTRO]'),S.contenido.replace('RET1~1~','RET1~3~')]){let rejected=false;try{const p=parseSES(text);need(equal(p,parsed),'censo');}catch{rejected=true;}assert.ok(rejected);}
 });
 test(o.id+' reconstrucción alterada, Unicode y buffers',()=>{
  for(const s of [{...S,contenido:S.contenido+' '},{...S,contenido:S.contenido+'\u0100'},{...S,sesBytes:S.sesBytes+1},{...S,latin1SHA256:'0'.repeat(64)}])assert.throws(()=>reconstruct(s));
  const p=parseSES(S.contenido);const t=structuredClone(S);t.transportesInternos[0].etapas[0].contenido+='0';assert.throws(()=>transports(t,p));
 });
 test(o.id+' correspondencias no aceptan contradicción ni reserva',()=>{for(let i=0;i<o.records.length;i++){const r=o.records[i],rule=o.rules[i];if(rule.kind==='reserva')assert.equal(binding(r,rule,{H,P}),false);if(rule.kind==='correspondencia')assert.throws(()=>binding({...r,value:'999999999.99'},rule,{H,P}));}});
 test(o.id+' PDF completo y guardas de página',()=>{const b=fs.readFileSync(dir+o.id+'/captura.pdf');assert.deepEqual(rawPdfRows(b,{pages:5,positions:true}),o.pdf);assert.throws(()=>rawPdfRows(b));assert.throws(()=>rawPdfRows(b,{pages:4}));assert.throws(()=>rawPdfRows(Buffer.from('%PDF-1.4\n/Encrypt')));const x=structuredClone(o.pdf);x[0].y+=1;assert.notDeepEqual(x,o.pdf);});
 test(o.id+' GH rechaza historia contradictoria',()=>{const h=structuredClone(H);h.entrada.historia2024.construccion='999999999';assert.throws(()=>gh(h,P,'0'));});
 test(o.id+' omitir RET1 con censo coherente no reduce el contrato obligatorio',()=>{
  const changed=structuredClone(o),i=changed.records.findIndex(r=>r.key==='RET1');
  assert.ok(i>=0);changed.records.splice(i,1);changed.rules.splice(i,1);
  assert.throws(()=>validateSESContract(changed,changed),/SES-estructura-obligatoria/);
 });
 test(o.id+' sustituir un campo manteniendo el tamaño tampoco satisface el contrato',()=>{
  const changed=structuredClone(o),i=changed.records.findIndex(r=>r.key==='RET1');
  changed.records[i].key='RET_SUSTITUIDO';changed.rules[i].row.key='RET_SUSTITUIDO';
  assert.throws(()=>validateSESContract(changed,changed),/SES-estructura-obligatoria/);
 });
 test(o.id+' una regla nueva no puede justificar un valor contra H/P',()=>{
  const changed=structuredClone(o),i=changed.records.findIndex(r=>r.key==='RET1');
  changed.rules[i].source=undefined;changed.rules[i].literal='999999.99';
  assert.throws(()=>validateSESContract(changed,changed),/SES-reglas-obligatorias/);
 });
 test(o.id+' omisiones, repeticiones y desplazamientos con censo PDF coherente se rechazan',()=>{
  for(const box of ['0001','0435','0460','0670']){
   const rows=structuredClone(o.pdf),i=rows.findIndex(r=>r.segments.at(-1).value===box);
   assert.ok(i>=0);rows.splice(i,1);
   assert.throws(()=>validatePdf(rows,rows,H,P),/PDF-ocurrencias-obligatorias/);
  }
  const duplicated=structuredClone(o.pdf);
  duplicated.push(structuredClone(duplicated.find(r=>r.segments.at(-1).value==='0670')));
  assert.throws(()=>validatePdf(duplicated,duplicated,H,P),/PDF-ocurrencias-obligatorias/);
  const moved=structuredClone(o.pdf);moved.find(r=>r.segments.at(-1).value==='0670').segments[1].x+=1;
  assert.throws(()=>validatePdf(moved,moved,H,P),/PDF-ocurrencias-obligatorias/);
 });
 test(o.id+' hashes distinguen recibo y fixture',()=>{const b=fs.readFileSync(dir+o.id+'/recibo.json');assert.notEqual(hash(b),hash(Buffer.concat([b,Buffer.from(' ')])));});
 test(o.id+' mapa de todas las casillas y del documento de ingreso',()=>{
  assert.equal(validatePdf(o.pdf,o.pdf,H,P).reservas.length,0);
  // Alterar también el censo no hace que un importe contradicho por P pase.
  for(const box of ['0003','0019','0123','0130','0534','0571','0670','1396']){
   const rows=structuredClone(o.pdf),r=rows.find(x=>x.segments.at(-1).value===box);
   assert.ok(r);r.segments[1].value='999.999,99';r.text=r.segments.map(s=>s.value).join(' ');
   assert.throws(()=>validatePdf(rows,rows,H,P),new RegExp('PDF-correspondencia:'+box));
  }
 });
 test(o.id+' posición horizontal, página y cantidad de repeticiones quedan fijadas',()=>{
  const rows=structuredClone(o.pdf);rows.find(r=>r.segments.length===3).segments[1].x+=1;
  assert.throws(()=>validatePdf(rows,o.pdf,H,P),/PDF-completo/);
  const moved=structuredClone(o.pdf);moved.find(r=>r.text.endsWith(' 0670')).page=3;
  assert.throws(()=>validatePdf(moved,o.pdf,H,P),/PDF-completo/);
  const repeated=structuredClone(o.pdf);repeated.push(structuredClone(repeated.find(r=>r.text.endsWith(' 0670'))));
  assert.throws(()=>validatePdf(repeated,o.pdf,H,P),/PDF-completo/);
 });
 test(o.id+' documento final se concilia aunque se altere coherentemente el censo',()=>{
  const rows=structuredClone(o.pdf),r=rows.find(x=>x.page===4&&x.text.startsWith('Resultado a ingresar o devolver : '));
  assert.ok(r);r.text='Resultado a ingresar o devolver : 999.999,99';
  assert.throws(()=>validatePdf(rows,rows,H,P),/PDF-documento-resultado/);
 });
}
