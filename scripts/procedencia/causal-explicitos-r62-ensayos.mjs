import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { composeCausalExplicitos } from './causal-explicitos-r62-contratos.mjs';
import { executeCausalExplicitos, verifyCausalExplicitos } from './causal-explicitos-r62.mjs';
import { executeFiniteCausal } from './evidencia-causal-r57.ts';
import { consumeExplicitRentas } from './flujo-rentas-r36-consumidor.mjs';
import { composeRentasR36, sitesR36 } from './flujo-rentas-r36.mjs';
import { explicit } from './causal-escalas-r60-casos.mjs';
import { actividad } from './causal-escalas-r60-bloqueo-ensayo.mjs';
import { real, Effect } from './causal-explicitos-r62-oracle.mjs';
const ctx={route:'explicit',modo:'canonico'};
const prefix='anual.explicito.';
const folder='.cache/causal-explicitos-r62-sol';
const amounts=(out)=>Object.fromEntries(out.evidence.outputs.map(o=>[o.siteId.slice(prefix.length),o.decimal]));
const actualLines=(r)=>r.rastro.pasos.flatMap(p=>p.lineasCalculo??[]);
function save(id,c,out){
 const bytes=gzipSync(JSON.stringify({id,caso:c,contexto:ctx,evidence:out.evidence}));
 const hash=createHash('sha256').update(bytes).digest('hex');
 fs.mkdirSync(folder+'/testigos',{recursive:true}); fs.writeFileSync(folder+'/testigos/'+hash+'.json.gz',bytes);
 return {id,file:folder+'/testigos/'+hash+'.json.gz',outputs:out.evidence.outputs.map(o=>({siteId:o.siteId,decimal:o.decimal}))};
}
export function runExplicitos(){
 fs.mkdirSync(folder,{recursive:true});
 const g=composeCausalExplicitos(),records=[];
 fs.writeFileSync(folder+'/contrato.json.gz',gzipSync(JSON.stringify(g)));
 const originals=[];
 const preserve=(file)=>{const b=fs.readFileSync(file),sha256=createHash('sha256').update(b).digest('hex'),sha512=createHash('sha512').update(b).digest('hex');fs.mkdirSync(folder+'/originales/sha256',{recursive:true});fs.writeFileSync(folder+'/originales/sha256/'+sha256,b);originals.push({file,sha256,sha512,size:b.length,object:folder+'/originales/sha256/'+sha256});};
 for(const s of g.sources)preserve(s.file);

 const check=(id,c,expected=null)=>{
  const r=Effect.runSync(real(c));
  const out=executeCausalExplicitos(g,c,ctx,id);
  const lines=actualLines(r).filter(l=>g.outputBindings.some(b=>b.siteId===l.origen.siteId));
  assert.deepEqual(out.lines,lines.map(l=>({etiqueta:l.etiqueta,formula:l.formula,resultado:l.resultado,origen:l.origen})),'API TS real '+id);
  assert.equal(out.evidence.outputs.length,9);
  assert.equal(new Set(out.lines.map(l=>l.origen.instanceId)).size,9);
  if(expected) for(const [site,value] of Object.entries(expected))assert.equal(amounts(out)[site],value,id+' '+site);
  for(const o of out.evidence.outputs){
   assert.ok(o.slice.length>1);
   const events=out.evidence.events.filter(e=>o.slice.includes(e.id));
   assert.ok(events.some(e=>e.operation==='transport'&&e.unit==='EUR-decimal-string'));
   assert.ok(events.some(e=>e.operation==='entry-selection'));
  }
  if(!records.length)for(const s of out.evidence.software)preserve(s.file);
  records.push(save(id,c,out)); return out;
 };
 for(const clase of ['empleo-laboral','empleo-estatutario','pension']){
  for(const bruto of ['0','16576','16576.01','18276','18276.01','20000','50000']){
   const c=explicit(bruto,clase);
   c.retenciones=[{operacionId:'r1',procedencia:'certificado',ejercicio:2025,importe:'123.45',efectiva:true},{operacionId:'r2',procedencia:'certificado',ejercicio:2025,importe:'67.89',efectiva:true}];
   const checked=check(clase+'-'+bruto,c,{'trabajo.integro':bruto==='16576.01'||bruto==='18276.01'?bruto:String(Number(bruto)),retenciones:'191.34',pagos:'0'});
   if(bruto==='16576'||bruto==='16576.01'){
    assert.equal(amounts(checked)['trabajo.art20'],bruto==='16576'?'4285':'4284.9825');
    assert.equal(amounts(checked).da61,clase==='pension'?'0':bruto==='16576'?'340':'339.998');
   }
   if(bruto==='0')assert.equal(amounts(checked).diferencial,'-191.34');
  }
 }
 const c=explicit('20000'); const w=c.trabajo.rendimientos[0];
 w.cotizaciones.seguridadSocial='1000.01'; w.cotizaciones.derechosPasivos='100.02'; w.cotizaciones.colegiosHuerfanos='10.03';
 w.sindicato={importe:'99.04',satisfecho:'si'};
 w.colegio={importe:'600.05',satisfecho:'si',obligatorio:'si',finesEsenciales:'si'};
 w.defensa={importe:'400.06',satisfecho:'si',litigioDirectoPagador:'si'};
 // a-e = 1000.01+100.02+10.03+99.04+500+300 = 2009.10;
 // previo art20 =17990.90; art19=15990.90; reducción=2364.34-1.14*(17990.90-17673.52)=2002.5268.
 const out=check('gastos-efectivos',c,{'trabajo.gastos-a-e':'2009.1','trabajo.gasto-f':'2000','trabajo.art19':'15990.9','trabajo.art20':'2002.5268',da61:'0'});
 assert.equal(verifyCausalExplicitos(g,out.evidence,c,ctx,'gastos-efectivos'),true);
 const events=out.evidence.events;
 for(const property of ['seguridadSocial','derechosPasivos','colegiosHuerfanos','importe','rendimientoAntesArt20','argumentoArt20','integro','gastosAE','generalesAplicados'])assert.ok(events.some(e=>e.property===property),property);
 const net=c.trabajo.rendimientos[0];const repeated=structuredClone(c); repeated.trabajo.rendimientos=[{...structuredClone(net),id:'a'},{...structuredClone(net),id:'b'}];check('dos-rendimientos',repeated,{'trabajo.integro':'40000'});
 const low=explicit('100');check('limite-gasto-f',low,{'trabajo.gastos-a-e':'0','trabajo.gasto-f':'100','trabajo.art19':'0','trabajo.art20':'0',diferencial:'0'});
 const negative=explicit('0');negative.retenciones=[{operacionId:'r',procedencia:'c',ejercicio:2025,importe:'19.87',efectiva:true}];check('diferencial-negativo',negative,{diferencial:'-19.87',retenciones:'19.87',pagos:'0'});
 for(const key of ['program','outputBindings','sources','obligations']){
  const bad=structuredClone(g);bad[key]=key==='obligations'?[{status:'satisfied',id:'fabricada'}]:[];
  assert.throws(()=>executeCausalExplicitos(bad,c,ctx,'bad'));
  assert.throws(()=>executeFiniteCausal(bad,c,ctx,'bad',{kind:'causal-explicitos-r62'}));
  assert.throws(()=>verifyCausalExplicitos(bad,out.evidence,c,ctx,'gastos-efectivos'));
 }
 const altered=structuredClone(out.evidence);altered.outputs[0].root=altered.outputs[1].root;
 assert.throws(()=>verifyCausalExplicitos(g,altered,c,ctx,'gastos-efectivos'));
 const integrated=consumeExplicitRentas(composeRentasR36(),c,{},null,{causal:true,execution:'gastos-efectivos'});
 assert.deepEqual(integrated.evidence,out.evidence);
 assert.throws(()=>consumeExplicitRentas(composeRentasR36(),c,{fake:()=>0},null,{causal:true}));
 const direct=executeFiniteCausal(g,c,ctx,'gastos-efectivos',{kind:'causal-explicitos-r62'}); assert.deepEqual(direct.evidence,out.evidence);
 for(const mutate of [c=>{c.ejercicio=2024},c=>{c.comunidadAutonoma='andalucia'},c=>{c.trabajo.rendimientos[0].clase='otro-trabajo'},c=>{c.trabajo.rendimientos=[]},c=>{c.trabajo.rendimientos[0].cotizaciones.clase='estimadas'},c=>{c.retenciones=[{operacionId:'r',procedencia:'c',ejercicio:2025,importe:'1',efectiva:true},{operacionId:'r',procedencia:'c',ejercicio:2025,importe:'2',efectiva:true}]}]){
  const bad=explicit();mutate(bad);assert.throws(()=>executeCausalExplicitos(g,bad,ctx,'rechazo'),e=>!!e.domainFailure);
 }
 const remaining=sitesR36.filter(s=>s.startsWith('anual.explicito.')).sort();assert.deepEqual(g.outputBindings.map(b=>b.siteId).sort(),remaining);
 fs.writeFileSync(folder+'/originales.json',JSON.stringify(originals,null,2));
 fs.writeFileSync(folder+'/casos.json',JSON.stringify(records,null,2));
 return {cases:records.length,sites:9,blocked:1};
}
export function runBloqueo(){
 fs.mkdirSync(folder,{recursive:true});
 const c=actividad();c.actividad.aplicarRentasBajas=false;
 c.actividad.ingresos=[{id:'factura',justificante:'f',fecha:'2025-06-01',base:'30000',iva:'0',ivaRecuperable:'0',afectacionExclusiva:true,registrado:true,categoria:'servicio',clienteId:'cliente',sujetoRetencion:true,rectificativa:false}];
 // La API real valida el fixture: no se fabrica retorno del adaptador.
 c.actividad.retenciones=[{id:'r',justificante:'cert',fecha:'2025-06-01',operacionId:'or',ingresoId:'factura',importe:'111.11',efectiva:true}];
 c.actividad.pagosFraccionados=[{id:'p',justificante:'pago',fecha:'2025-07-20',operacionId:'op',periodo:'2025-2T',modelo:'130',importe:'222.22',efectivo:true}];
 const before=Effect.runSync(real(c));
 assert.equal(before.retenciones,'111.11');assert.equal(before.pagosFraccionados,'222.22');assert.equal(before.deduccionTrabajo,'0');
 const retCase=structuredClone(c);retCase.actividad.retenciones[0].importe='112.11';
 const retChanged=Effect.runSync(real(retCase));assert.equal(retChanged.pagosFraccionados,'222.22');assert.equal(retChanged.cuotaPosterior,before.cuotaPosterior);assert.notEqual(retChanged.cuotaDiferencial,before.cuotaDiferencial);
 const payCase=structuredClone(c);payCase.actividad.pagosFraccionados[0].importe='224.22';
 const payChanged=Effect.runSync(real(payCase));assert.equal(payChanged.retenciones,'111.11');assert.equal(payChanged.cuotaPosterior,before.cuotaPosterior);assert.notEqual(payChanged.cuotaDiferencial,before.cuotaDiferencial);
 const out=actualLines(before);assert.equal(new Set(out.filter(l=>l.origen.siteId==='anual.explicito.actividad.etapa').map(l=>l.origen.instanceId)).size,out.filter(l=>l.origen.siteId==='anual.explicito.actividad.etapa').length);assert.ok(out.some(l=>l.origen.siteId==='anual.explicito.actividad.etapa'));
 c.actividad.ingresos[0].base='31000';
 const after=Effect.runSync(real(c));assert.notEqual(before.rendimientoNetoReducido,after.rendimientoNetoReducido);
 assert.throws(()=>executeCausalExplicitos(composeCausalExplicitos(),c,ctx,'bloqueo'),/19 familias|excluid|actividad/i);
 fs.writeFileSync(folder+'/bloqueo.json',JSON.stringify({caso:c,before,after,retChanged,payChanged,propiedades:['etapas[].importe','etapas[].reglaId','etapas[].id','etapas[].formula','aporte.importeEurosExactos','aporte.retencionesEuros','aporte.pagosFraccionadosEuros']},null,2));
 return true;
}
