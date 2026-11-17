import {Schema} from 'effect';
// Evidencia de fixtures sintéticos; stdlib, sin motor fiscal.
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {accessSES} from './conjunta-ses.mjs';
const need=(v,c)=>{if(!v)throw Error(c)};
const hash=b=>createHash('sha256').update(b).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const one=(xs,c)=>{need(xs.length===1,c);return xs[0]};
const decimal=s=>{need(Schema.is(Schema.String)(s)&&/^-?\d+(?:\.\d{1,2})?$/.test(s),'ses-decimal');const [a,b='']=s.split('.');return a+'.'+b.padEnd(2,'0')};
export function uiDecimal(s,zero=false) {
  if(s===''&&zero)return '0.00';
  need(Schema.is(Schema.String)(s)&&/^-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}$/.test(s),'ui-decimal');
  return s.replaceAll('.','').replace(',','.');
}
const labels={GCS:'Cuotas satisfechas a Sindicatos',GCC:'Cuotas a Colegios profesionales',GDJ:'Gastos de defensa jurídica'};
const detail={IDICLDED2:[0,'Importe íntegro:'],GSSCLDED2:[8,'Gastos Seguridad Social y otros:']};
const keys=[...Object.keys(labels),...Object.keys(detail)];
// The descriptor pins original bytes. Derived events never substitute for raw evidence.
export function adaptMoney11({casePlan,receiptBytes,files}) {
  const receipt=JSON.parse(receiptBytes),entry=casePlan.fixture.entradaCandidata;
  need(entry.tipoUnidad==='matrimonial'||entry.tipoUnidad==='monoparental'&&entry.conyuge===null,'monoparental-sin-evidencia');
  need(receipt.id===casePlan.id&&receipt.captura==='conservada','recibo-no-final');
  need(receipt.fixtureSha256===hash(JSON.stringify(casePlan.fixture)),'fixture-recibo');
  const pins=new Map();
  for(const f of receipt.files) {
    need(/^[a-zA-Z0-9_.-]+$/.test(f.file)&&!pins.has(f.file),'recibo-ruta-duplicada');
    const b=files[f.file];need(b&&b.length===f.bytes&&hash(b)===f.sha256,'artefacto-integridad');pins.set(f.file,f.sha256);
  }
  const get=n=>{need(pins.has(n),'fuente-no-inventariada');return files[n]};
  const json=n=>JSON.parse(get(n));
  const start=json('inicio-declaracion.json');
  need(start.operation==='Nueva declaración'&&start.context==='nuevo'&&Number.isFinite(Date.parse(start.at)),'inicio-click');
  const actions=json('acciones.json'),raw=json('readbacks.json');
  need(same(actions,casePlan.actions),'acciones-plan');
  // Associate each action observation with its following census, never an index guess.
  const observations=new Map(),inventories=new Map();let pending=[];
  for(const r of raw) {
    if(Object.hasOwn(r,'controls')) {
      need(Number.isInteger(r.step)&&r.step===inventories.size+1&&Array.isArray(r.controls),'readback-pasos');
      need(new Set(r.controls.map(c=>c.id)).size===r.controls.length,'control-duplicado');
      inventories.set(r.step,r.controls);
      need(pending.length<=1,'readback-ambiguo');
      if(pending.length){const o=pending[0];need(same(o.action,actions[r.step-1]),'readback-accion');observations.set(r.step,o)}
      pending=[];
    }else pending.push(r);
  }
  need(!pending.length&&inventories.size===actions.length,'readback-incompleto');
  const sesBytes=get('exportado.ses'),p=accessSES(inflateSync(sesBytes,{maxOutputLength:4194304}).toString('latin1'));
  const d=p.instance('IRPF2025','TITULAR','DECLARANTE');
  const work=one(p.sections.filter(s=>s.parent===d.id&&s.name==='ATRABAJO'),'trabajo-instancia');
  const dialog=one(p.sections.filter(s=>s.parent===work.id&&s.name==='DLGTRABAJO'),'dialogo-instancia');
  need(p.row(work,'TITA')==='DECLARANTE','trabajo-titular');
  const wage=entry.economia.trabajo.rendimientos;need(wage.length===1&&entry.economia.retenciones.length===1,'economia-cardinalidad');
  const expected={GCS:'0.00',GCC:'0.00',GDJ:'0.00',IDICLDED2:wage[0].integro,GSSCLDED2:wage[0].cotizaciones.seguridadSocial};
  for(const [key,value]of Object.entries({IDII:expected.IDICLDED2,GSS:expected.GSSCLDED2,IDRE:entry.economia.retenciones[0].importe}))need(decimal(p.row(dialog,key))===value,'ses-salario');
  const stepFor=(key,op)=>one(actions.flatMap((a,i)=>a.key===key&&a.op===op?[i+1]:[]),'accion-no-unica');
  const htmlAt=step=>get(one([...pins.keys()].filter(n=>n.startsWith(String(step).padStart(3,'0')+'-')&&n.endsWith('.html')),'html-no-unico')).toString('utf8');
  const money=keys.map(key=>{
    const isDetail=Object.hasOwn(detail,key),step=stepFor(key,isDetail?'detailMoney':'type'),a=actions[step-1],o=observations.get(step);
    need(o&&o.key===key&&o.requested===expected[key]&&uiDecimal(o.observed,!isDetail)===expected[key],'solicitud-importe');
    need(a.value===(isDetail?expected[key]:expected[key].replace('.',',')),'solicitud-explicita');
    const zeroAt=s=>{
      const escaped=labels[key].replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const matches=[...htmlAt(s).matchAll(new RegExp('>'+escaped+'<[^]*?</td>\\s*<td\\b[^]*?</td>','g'))];
      need(matches.length===1,'cero-etiqueta');
      const id=one([...matches[0][0].matchAll(/<input\b[^>]*\bid="([^"]+)"/g)],'cero-celda')[1];
      return one(inventories.get(s).filter(c=>c.id===id),'cero-control');
    };
    let control;
    if(isDetail) {
      const [nth,title]=detail[key],before=json('detalle-'+key+'.json');
      need(a.nth===nth&&before.length===9,'detalle-censo');
      const id=/\bid="([^"]+)"/.exec(before[nth].html)?.[1];
      need(id&&before[nth].html.includes('title="'+title+'"'),'detalle-semantica');
      control=one(inventories.get(step).filter(c=>c.id===id&&c.title===title),'detalle-control');
    }else {
      const css='[role=dialog] :text-is("'+labels[key]+'") >> xpath=ancestor::td[1]/following-sibling::td[1]//input';
      need(a.css===css&&a.monetary===true,'cero-selector');
      // Original and reopened DOMs may assign different IDs to the same label.
      control=zeroAt(step);
    }
    need(control.type==='text'&&!control.disabled&&uiDecimal(control.value,!isDetail)===expected[key],'control-importe');
    need(htmlAt(step).includes('id="'+control.id+'"'),'control-dom');
    const result={schema:'money-raw11-v1',control:key,holder:'DECLARANTE',dialog:'DLGTRABAJO',instance:1,
      observedControl:control.id,request:{step,value:expected[key],explicit:true},afterBlur:{step,value:control.value},
      captureSha256:hash(sesBytes),rawReadbacksSha256:pins.get('readbacks.json')};
    if(!isDetail) {
      const reopen=stepFor(key,'verifyZero'),ro=observations.get(reopen);
      need(reopen>step&&ro?.reopened===true&&ro.key===key&&ro.requested==='0.00'&&actions[reopen-1].css===a.css,'cero-reapertura');
      const between=actions.slice(step,reopen-1);
      need(between.some(x=>x.op==='click'&&x.css==='[role=dialog] button:text-is("Aceptar")')&&between.some(x=>x.op==='click'&&x.css==="xpath=//*[normalize-space(text())='0003']/../../..//button"),'cero-cierre-apertura');
      const rc=zeroAt(reopen);
      need(uiDecimal(ro.observed,true)==='0.00'&&rc.value===ro.observed&&!rc.disabled&&htmlAt(reopen).includes('id="'+rc.id+'"'),'cero-relectura');
      result.afterReopen={step:reopen,value:ro.observed,observedControl:rc.id};
    }
    const rows=p.records.filter(r=>r.key===key);
    need(rows.length===0&&!isDetail||rows.length===1&&rows[0].scope===(isDetail?d.id:dialog.id)&&rows[0].type==='1'&&decimal(rows[0].value)===expected[key],'persistencia-ambito');
    result.persistence={key,value:rows[0]?.value??null,scope:isDetail?'DECLARANTE/IRPF2025':'DECLARANTE/ATRABAJO/DLGTRABAJO',artifactSha256:hash(sesBytes)};
    return result;
  });
  const moneySources=Object.fromEntries([...pins].map(([n,h])=>[h,files[n]]));
  const descriptor=Buffer.from(JSON.stringify({casePlan,receiptSha256:hash(receiptBytes)}));
  moneySources[hash(receiptBytes)]=receiptBytes;moneySources[hash(descriptor)]=descriptor;
  for(const r of money)r.rawBundleSha256=hash(descriptor);
  return {money,moneySources};
}
export function verifyMoney11(money,sources,sourceHash,{fixture,receiptSha256,rawBundleSha256}) {
  const bytes=h=>{need(sources[h]&&hash(sources[h])===h,'fuente-integridad');return sources[h]};
  need(money.length===5&&money.every(r=>r.rawBundleSha256===rawBundleSha256&&r.captureSha256===sourceHash),'money-referencia');
  const desc=JSON.parse(bytes(rawBundleSha256));
  need(same(desc.casePlan.fixture,fixture)&&desc.receiptSha256===receiptSha256,'money-contrato');
  const receiptBytes=bytes(desc.receiptSha256),receipt=JSON.parse(receiptBytes);
  const files=Object.fromEntries(receipt.files.map(f=>[f.file,bytes(f.sha256)]));
  need(same(adaptMoney11({casePlan:desc.casePlan,receiptBytes,files}).money,money),'money-derivacion');
  return [];
}
