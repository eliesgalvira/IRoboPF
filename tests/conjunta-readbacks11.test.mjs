import {test} from 'vitest';
import assert from 'node:assert/strict';
import {deflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {adaptMoney11,verifyMoney11,uiDecimal} from '../tools/procedencia/simuladores/conjunta-readbacks11.mjs';
import {bindStrict} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
// Entirely synthetic fixture. No capture directories, network or fiscal runtime.
function sample(change=()=>{}) {
  const names={GCS:'Cuotas satisfechas a Sindicatos',GCC:'Cuotas a Colegios profesionales',GDJ:'Gastos de defensa jurídica'};
  const actions=[],raw=[],files={};
  const add=(a,o,controls=[])=>{actions.push(a);if(o)raw.push({...o,action:a});raw.push({step:actions.length,controls});
    files[String(actions.length).padStart(3,'0')+'-accion.html']=Buffer.from(controls.map(c=>c.title in names?'':`<input id="${c.id}">`).join('')+Object.entries(names).map(([k,v])=>`<td><span>${v}</span></td><td><input id="${k}-${actions.length}"></td>`).join(''));
  };
  const css=k=>'[role=dialog] :text-is("'+names[k]+'") >> xpath=ancestor::td[1]/following-sibling::td[1]//input';
  const controls=()=>Object.keys(names).map(k=>({id:k+'-'+(actions.length+1),type:'text',value:'',disabled:false}));
  for(const key of Object.keys(names))add({op:'type',key,value:'0,00',css:css(key),monetary:true},{key,requested:'0.00',observed:''},controls());
  add({op:'click',css:'[role=dialog] button:text-is("Aceptar")'});
  add({op:'click',css:"xpath=//*[normalize-space(text())='0003']/../../..//button"});
  for(const key of Object.keys(names))add({op:'verifyZero',key,css:css(key)},{key,requested:'0.00',observed:'',reopened:true},controls());
  const details={IDICLDED2:[0,'Importe íntegro:','45000.00','45.000,00'],GSSCLDED2:[8,'Gastos Seguridad Social y otros:','2925.00','2.925,00']};
  for(const [key,[nth,title,value,observed]] of Object.entries(details)) {
    const before=Array.from({length:9},(_,i)=>({html:`<input id="detail-${i}" title="${i===nth?title:'Otro'}">`,parent:'<div></div>',value:''}));
    files['detalle-'+key+'.json']=Buffer.from(JSON.stringify(before));
    add({op:'detailMoney',key,nth,value},{key,requested:value,observed},[{id:'detail-'+nth,title,type:'text',disabled:false,value:observed}]);
  }
  const fixture={id:'sintetico-01',entradaCandidata:{tipoUnidad:'matrimonial',economia:{trabajo:{rendimientos:[{integro:'45000.00',cotizaciones:{seguridadSocial:'2925.00'}}]},retenciones:[{importe:'8500.00'}]}}};
  const casePlan={id:fixture.id,fixture,actions};
  let ses='<?xml EjModelo="2025"?><PERSISTENCIAV2>\n[DECLARACIONES]\n  [IRPF2025]\n   TITULAR~1~DECLARANTE\n   IDICLDED2~1~45000.0\n   GSSCLDED2~1~2925.0\n    [ATRABAJO]\n     TITA~1~DECLARANTE\n      [DLGTRABAJO]\n       IDII~1~45000.0\n       GSS~1~2925.0\n       IDRE~1~8500.0\n</PERSISTENCIAV2>\n';
  const data={casePlan,raw,files,ses,start:{operation:'Nueva declaración',context:'nuevo',at:'2026-01-01T00:00:00Z'}};
  change(data);ses=data.ses;
  files['exportado.ses']=deflateSync(Buffer.from(ses,'latin1'));
  files['acciones.json']=Buffer.from(JSON.stringify(actions));files['readbacks.json']=Buffer.from(JSON.stringify(raw));
  files['inicio-declaracion.json']=Buffer.from(JSON.stringify(data.start));
  const receiptBytes=Buffer.from(JSON.stringify({id:fixture.id,captura:'conservada',fixtureSha256:hash(JSON.stringify(fixture)),files:Object.entries(files).map(([file,b])=>({file,bytes:b.length,sha256:hash(b)}))}));
  return {casePlan,receiptBytes,files};
}
test('strict UI decimal: blanks require explicit zero context',()=>{
  assert.equal(uiDecimal('47.000,00'),'47000.00');assert.equal(uiDecimal('',true),'0.00');
  for(const bad of ['','0','1e3','47.00,00','NaN'])assert.throws(()=>uiDecimal(bad));
});
test('raw mapping preserves reopened IDs and actual SES detail scope',()=>{
  const input=sample(),a=adaptMoney11(input);
  assert.equal(a.money.length,5);assert.notEqual(a.money[0].observedControl,a.money[0].afterReopen.observedControl);
  assert.equal(a.money[3].afterReopen,undefined);assert.equal(a.money[3].persistence.scope,'DECLARANTE/IRPF2025');
  assert.deepEqual(verifyMoney11(a.money,a.moneySources,hash(input.files['exportado.ses']),{fixture:input.casePlan.fixture,receiptSha256:hash(input.receiptBytes),rawBundleSha256:a.money[0].rawBundleSha256}),[]);
  a.money[0].request.value='1.00';assert.throws(()=>verifyMoney11(a.money,a.moneySources,hash(input.files['exportado.ses']),{fixture:input.casePlan.fixture,receiptSha256:hash(input.receiptBytes),rawBundleSha256:a.money[0].rawBundleSha256}),/money-derivacion/);
});
// These mutations are rehashed into valid receipts: hashes alone cannot pass.
for(const [name,mutate] of [
  ['no click',d=>d.start.operation='Importar'],
  ['monoparental',d=>d.casePlan.fixture.entradaCandidata.tipoUnidad='monoparental'],
  ['zero never requested',d=>d.raw.find(r=>r.key==='GCS').requested=''],
  ['wrong explicit zero',d=>d.casePlan.actions[0].value='1,00'],
  ['fake reopen',d=>d.raw.find(r=>r.reopened).reopened=false],
  ['reopened nonzero',d=>d.raw.find(r=>r.reopened).observed='1,00'],
  ['ambiguous raw observation',d=>d.raw.splice(1,0,d.raw[0])],
  ['missing final census',d=>d.raw.pop()],
  ['DOM label swapped',d=>d.files['001-accion.html']=Buffer.from('<td>Otra etiqueta</td><td><input id="GCS-1"></td>')],
  ['detail wrong nth',d=>d.casePlan.actions.find(a=>a.key==='IDICLDED2').nth=1],
  ['detail blank',d=>d.raw.find(r=>r.key==='IDICLDED2').observed=''],
  ['detail false title',d=>d.files['detalle-IDICLDED2.json']=Buffer.from(JSON.stringify(Array.from({length:9},()=>({html:'<input id="detail-0" title="Otro">'}))))],
  ['detail wrong scope',d=>d.ses=d.ses.replace('   IDICLDED2~1~45000.0\n','').replace('       IDII','       IDICLDED2~1~45000.0\n       IDII')],
  ['detail duplicated',d=>d.ses=d.ses.replace('   IDICLDED2~1~45000.0','   IDICLDED2~1~45000.0\n   IDICLDED2~1~45000.0')],
  ['unrequested SES zero',d=>d.ses=d.ses.replace('       IDII','       GCS~1~1.0\n       IDII')],
])test('rejects '+name,()=>assert.throws(()=>adaptMoney11(sample(mutate))));
test('missing or changed bytes despite original receipt',()=>{
  const s=sample();s.files['exportado.ses']=Buffer.from('changed');assert.throws(()=>adaptMoney11(s),/artefacto-integridad/);
});
test('Arag02-v2: intact hashes do not resolve the legacy authority conflict',()=>{
  const entry={tipoUnidad:'matrimonial'},expedienteBytes=Buffer.from(JSON.stringify({entradaCandidata:entry,hogar:{legacy:true}}));
  const fixtureBytes=Buffer.from(JSON.stringify({id:'open2025-aragon-02-v2',entradaCandidata:entry,sha256Expediente:hash(expedienteBytes)}));
  const attempt=authority=>{const referenceBytes=Buffer.from(JSON.stringify({fixtureSha256:hash(fixtureBytes),authority,casePlan:{}}));
    return ()=>bindStrict({fixtureBytes,expedienteBytes,referenceBytes,referenceSha256:hash(referenceBytes)})};
  assert.throws(attempt({estado:'conflicto-pendiente'}),/autoridad-expediente-conflicto/);
  assert.throws(attempt({estado:'resuelto'}),/autoridad-v2-no-adicionada/);
});
