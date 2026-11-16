// Sólo fixtures explícitamente sintéticos; recepción original preservada.
import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {parseSES} from '../tools/procedencia/simuladores/conjunta-ses.mjs';
import {rawPdfRows} from '../tools/procedencia/simuladores/conjunta-pdf.mjs';
import {census,validateSES,moneyEvidence,moneyControls,bindStrict,hash} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';
const ref=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/conjunta-referencias/open2025-castilla-la-mancha-02.json',import.meta.url)));
function serialize(node,indent=0) {
  return ' '.repeat(indent)+'['+node.name+']\n'+node.fields.map(([k,t,f,v])=>' '.repeat(indent+1)+[k,t,v??'synthetic',...(f?[f]:[])].join('~')+'\n').join('')+node.children.map(n=>serialize(n,indent+2)).join('');
}
const wrap=node=>'<?xml '+Object.entries(ref.metadata).map(([k,v])=>k+'="'+v+'"').join(' ')+'?><PERSISTENCIAV2>\n'+serialize(node)+'</PERSISTENCIAV2>';
const entry={tipoUnidad:'matrimonial',modalidad:'conjunta',ejercicio:2025,comunidadAutonoma:'castilla-la-mancha',miembros:['s-1','s-2','s-3'],
  declarante:{id:'s-1',fechaNacimiento:'1985-01-01'},conyuge:{id:'s-2',fechaNacimiento:'1985-01-01'},hijos:[{id:'s-3',fechaNacimiento:'2023-01-01',rentaNoExenta:'0.00'}],
  economia:{censoCompleto:true,miembrosSinRentas:['s-2','s-3'],otrasRentasIncluidasExentas:'ninguna',actividadesAhorroInmueblesGanancias:'ninguno',perceptorId:'s-1',trabajo:{ejercicio:2025,territorio:'comun',rendimientos:[{integro:'30000.00',cotizaciones:{seguridadSocial:'1950.00',derechosPasivos:'0',colegiosHuerfanos:'0'},sindicato:{importe:'0'},colegio:{importe:'0'},defensa:{importe:'0'}}]},retenciones:[{importe:'4200.00'}]}};
const instance=(tree,name,holder)=>tree.children.find(n=>n.name===name&&n.fields.some(r=>r[0]===(name==='RESUMEN'?'R_TIT':'TITULAR')&&r[3]===holder));
test('tres titulares y resumen por titular, sin colisión de rutas',()=>assert.doesNotThrow(()=>validateSES(wrap(ref.census),ref,entry)));
for(const [name,mutate] of [
  ['instancia conjunta duplicada',t=>t.children.push(structuredClone(instance(t,'IRPF2025','CONJUNTA')))],
  ['titulares intercambiados',t=>{const a=instance(t,'IRPF2025','DECLARANTE'),b=instance(t,'IRPF2025','CONYUGE');a.fields.find(r=>r[0]==='TITULAR')[3]='CONYUGE';b.fields.find(r=>r[0]==='TITULAR')[3]='DECLARANTE';}],
  ['resumen de otro titular',t=>instance(t,'RESUMEN','CONJUNTA').fields.find(r=>r[0]==='R_SPNIF')[3]='90000001N'],
  ['miembro extra',t=>t.children.find(n=>n.name==='DP').children.push({name:'DESCENDIENTES',fields:[],children:[]})],
  ['sección extra',t=>t.children.push({name:'EXTRA',fields:[],children:[]})],
  ['clave extra',t=>t.fields.push(['EXTRA','1',null,'0'])],
  ['tipo cambiado',t=>t.fields[0][1]='3'],
  ['céntimo cambiado',t=>instance(t,'IRPF2025','CONJUNTA').fields.find(r=>r[0]==='RET1')[3]='4200.01'],
  ['perceptor cambiado',t=>instance(t,'IRPF2025','DECLARANTE').children.find(n=>n.name==='ATRABAJO').fields.find(r=>r[0]==='TITA')[3]='CONYUGE'],
  ['atributo repetido',t=>t.fields.push(structuredClone(t.fields[0]))],
])test(name,()=>{const tree=structuredClone(ref.census);mutate(tree);assert.throws(()=>validateSES(wrap(tree),ref,entry));});
test('orden de secciones no identifica titular',()=>{const tree=structuredClone(ref.census);tree.children.reverse();assert.deepEqual(census(wrap(tree)),ref.census);});
test('monoparentales rechazadas aunque se aporte SES matrimonial',()=>assert.throws(()=>validateSES(wrap(ref.census),ref,{...entry,tipoUnidad:'monoparental'}),/monoparental/));
test('los cinco controles siguen pendientes sin evidencia',()=>assert.deepEqual(moneyEvidence(undefined,{},'0'.repeat(64)),moneyControls));
test('blancos, duplicados y evidencia autodeclarada no bastan',()=>{
  for(const rows of [[],moneyControls.map(control=>({control})),moneyControls.map(()=>({control:'GCS'}))])assert.throws(()=>moneyEvidence(rows,{},'0'.repeat(64)));
});
test('referencia manipulada se rechaza antes del parseo',()=>assert.throws(()=>bindStrict({referenceBytes:Buffer.from('{'),referenceSha256:'0'.repeat(64)}),/referencia-integridad/));
test('contrato ficticio completo se huella antes de proyectar',()=>{
  const referenceBytes=Buffer.from(JSON.stringify({fixtureSha256:'0'.repeat(64)}));
  assert.throws(()=>bindStrict({referenceBytes,referenceSha256:hash(referenceBytes),fixtureBytes:Buffer.from(JSON.stringify({entradaCandidata:entry})),expedienteBytes:Buffer.from('{}')}),/contrato-externo-integridad/);
});
function syntheticMoney() {
  const sources={},sourceHash='1'.repeat(64),amounts={IDII:'30000.00',GSS:'1950.00'};
  const save=value=>{const bytes=Buffer.from(JSON.stringify(value)),digest=hash(bytes);sources[digest]=bytes;return digest;};
  const records=moneyControls.map((control,index)=>{
    const value=index<3?'0.00':index===3?amounts.IDII:amounts.GSS;
    const scope={control,observedControl:'synthetic-'+control,holder:'DECLARANTE',dialog:'DLGTRABAJO',instance:1,captureSha256:sourceHash};
    const inventorySha256=save({controls:[{id:scope.observedControl,semanticKey:control,holder:scope.holder,dialog:scope.dialog,instance:1}]});
    const phases=Object.fromEntries(['request','afterBlur','afterReopen'].map((kind,i)=>{
      const event={kind,...scope,step:3*index+i+1,value};
      if(i===0)event.explicit=true;
      const phase={step:event.step,value,artifactSha256:save(event)};
      if(i===0)phase.explicit=true;
      return [kind,phase];
    }));
    return {...scope,inventorySha256,...phases,persistence:{key:control,value:index<3?null:value}};
  });return {records,sources,amounts,sourceHash};
}
test('contrato de readbacks dedicado sintético completo',()=>{const s=syntheticMoney();assert.deepEqual(moneyEvidence(s.records,s.amounts,s.sourceHash,s.sources),[]);});
for(const [name,mutate] of [
  ['cero sin solicitud',s=>s.records[0].request.explicit=false],
  ['blanco después de salir',s=>s.records[0].afterBlur.value=''],
  ['cambio de céntimo en detalle',s=>s.records[3].afterReopen.value='30000.01'],
  ['reutilizar IDII como detalle',s=>s.records[3].control='IDII'],
  ['readback de otro perceptor',s=>s.records[4].holder='CONYUGE'],
  ['readback de otra captura',s=>s.records[4].captureSha256='2'.repeat(64)],
  ['fuente manipulada',s=>s.sources[s.records[0].request.artifactSha256]=Buffer.from('{}')],
  ['inventario ausente',s=>delete s.sources[s.records[0].inventorySha256]],
  ['reapertura anterior',s=>s.records[0].afterReopen.step=1],
])test(name,()=>{const s=syntheticMoney();mutate(s);assert.throws(()=>moneyEvidence(s.records,s.amounts,s.sourceHash,s.sources));});
for(const transform of [s=>s.replace('EjModelo="2025"','EjModelo="2025" EjModelo="2025"'),s=>s+'basura',s=>s.replace('~1~','~4~'),s=>s.replace('[DP]','[DP]\t')])
  test('gramática cerrada '+String(transform),()=>assert.throws(()=>parseSES(transform(wrap(ref.census)))));
function syntheticPdf(program) {
  const stream=deflateSync(Buffer.from(program,'latin1'));
  return Buffer.concat([Buffer.from('%PDF-1.4\n'+[1,2,3].map(n=>n+' 0 obj\n<< /Type /Page /Contents 4 0 R >>\nendobj\n').join('')+'4 0 obj\n<< /Filter /FlateDecode /Length '+stream.length+' >>\nstream\n'),stream,Buffer.from('\nendstream\nendobj\n')]);
}
test('PDF sintético con varios renglones en un bloque',()=>{
  const rows=rawPdfRows(syntheticPdf('BT\n/F2 8 Tf\n48 580 Td\n(UNO) Tj\n0 -11 Td\n(DOS) Tj\nET\n'));
  assert.equal(rows.length,6);assert.equal(rows[1].text,'DOS');assert.equal(rows[1].y,569);
});
test('PDF con operador no admitido se rechaza',()=>assert.throws(()=>rawPdfRows(syntheticPdf('BT\n48 580 Td\n[(UNO)] TJ\nET\n'))));
test('versión de reglas distinta se rechaza',()=>assert.throws(()=>validateSES(wrap(ref.census).replace(ref.metadata.VersionReglas,'OTRA'),ref,entry),/ses-version/));
