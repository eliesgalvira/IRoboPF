/** Adversas de las correspondencias nominales y monetarias SES. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import * as core from './prospectivos-core.mjs';
import {bind,compareDG_TI,contextSES} from './prospectivos-ses.mjs';
import {validateSESContract} from './prospectivos-estructura.mjs';
const root=process.cwd();
const c=JSON.parse(fs.readFileSync(path.join(root,'tools/procedencia/simuladores/prospectivos-censo.json')));
for(const o of c.observaciones){
 const id=o.id,prefix=path.join(root,'docs/procedencia/simuladores/alquiler-prospectivo-2025',id);
 const H=JSON.parse(fs.readFileSync(path.join(prefix,'escenario-previo.json'))),P=JSON.parse(fs.readFileSync(path.join(prefix,'prediccion-previa.json'))),S=JSON.parse(fs.readFileSync(path.join(prefix,'captura-ses.json')));
 const at=k=>o.records.findIndex(r=>r.key===k);
 const run=(k,c={H,P},row)=>{const i=at(k);return bind(row??o.records[i],o.rules[i],c,core);};
 test(id+' cuota autonómica debe restar deducción',()=>{const c=structuredClone({H,P});c.P.result.composicion.deduccionesAutonomicasAplicadas='101';assert.throws(()=>run('CLIQAUT',c));});
 test(id+' tipo medio y fracción no son literales observados',()=>{for(const k of ['TME','TMA','TBGD','T1_IMPORTE_PF1','T1_IMPORTE_PF2'])assert.throws(()=>run(k,{H,P},{...o.records[at(k)],value:'999.99'}));});
 test(id+' bruto y desglose dependen del mismo H',()=>{const c=structuredClone({H,P});c.H.entrada.trabajo.rendimientos[0].integro='40000';for(const k of ['IDICLDED2','IDII','TPDIN'])assert.throws(()=>run(k,c));});
 test(id+' negativo254 no acepta255 ni tipo1',()=>{const r=o.records.at(-1),rule=o.rules.at(-1);for(const change of [{value:'255'},{type:'1'},{key:'IMPA7CAN18'}])assert.throws(()=>bind({...r,...change},rule,{H,P},core));});
 test(id+' nominal no admite familiares ni segundo inmueble',()=>{for(const mutate of [c=>c.H.entrada.familiares='uno',c=>c.H.entrada.inmuebles.push(c.H.entrada.inmuebles[0])]){const c=structuredClone({H,P});mutate(c);assert.throws(()=>contextSES(c,core));}});
 test(id+' reserva con transformación permanece cerrada y no excusa otra regla alterada',()=>{
  const changed=structuredClone(o),i=at('INDV');
  assert.ok(changed.rules[i].transform);changed.rules[i].kind='reserva';
  validateSESContract(changed,changed);
  assert.equal(bind(changed.records[i],changed.rules[i],{H,P},core),false);
  const j=at('RET1');changed.records[j].value='999999.99';
  changed.rules[j]={kind:'correspondencia',literal:'999999.99',numeric:true,row:changed.rules[j].row};
  assert.throws(()=>validateSESContract(changed,changed),/SES-reglas-obligatorias/);
 });
 test(id+' todos los campos DG/TI sellados, incluso vacíos',()=>{for(const col of Array.from({length:21},(_,i)=>i)){const s=structuredClone(S),t=s.transportesInternos.find(x=>x.campo==='DF_DATOS_SI'),last=t.etapas.at(-1),lines=last.contenido.split('\n'),ti=lines[1].split('\t');ti[col]='ALTERADO';lines[1]=ti.join('\t');last.contenido=lines.join('\n');last.sha256=core.hash(Buffer.from(last.contenido,'latin1'));assert.throws(()=>compareDG_TI(last.contenido,o.records,core));}});
 test(id+' DG completo, sin depender de sellos',()=>{const text=S.transportesInternos.find(x=>x.campo==='DF_DATOS_SI').etapas.at(-1).contenido;for(let col=0;col<6;col++){const lines=text.split('\n'),dg=lines[0].split('\t');dg[col]='ALTERADO';lines[0]=dg.join('\t');assert.throws(()=>compareDG_TI(lines.join('\n'),o.records,core));}});
 test(id+' costeMadrid4 mantiene diferencia sin epsilon',()=>{const k='C_BASEAMOR';assert.equal(run(k),true);if(id==='madrid-02'){assert.equal(core.same(core.decimal(P.result.politicaOpen.costeOperativo),core.decimal(o.records[at(k)].value)),false);assert.equal(core.same(core.sub(core.decimal(P.result.politicaOpen.costeOperativo),core.decimal(o.records[at(k)].value)),core.decimal('0.00004')),true);}});
}
