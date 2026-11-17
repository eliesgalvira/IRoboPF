import {Schema} from 'effect';
const isString=Schema.is(Schema.String);
import {rawPdfRows} from './conjunta-pdf.mjs';
/** Candidato documental aislado: no importa producto ni ejecuta cálculo fiscal. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual as equal} from 'node:util';
import {inflateSync} from 'node:zlib';
import {accessSES} from './conjunta-ses.mjs';
import {conciliarMedidaObservada} from './inquilinos-open.mjs';

const ref=JSON.parse(readFileSync(new URL('./valencia-reference.json',import.meta.url)));
const need=(v,c)=>{if(!v)throw Error(c);};
const sha=b=>createHash('sha256').update(b).digest('hex');
const dir='valencia-captura76/';
const seed='valencia-captura58/'+ref.id+'/';
const tax='DECLARACIONES/IRPF2025',region=tax+'/VALENCIA';
const pending=()=>({resultadoOpenEUR:null,transportComplete:false,countedAsMatch:false});

/** Se fija toda la entrada, incluidos pagos/referencias/órdenes y negativos.
 * Ninguna ausencia equivale a cero o falso. No se aceptan overrides parciales. */
export function prepararInquilinoValencia(fixture,contratoBytes){
 need(Buffer.isBuffer(contratoBytes)&&sha(contratoBytes)===ref.archivos['inquilinos-transporte38/inquilinos-transporte.json'],'val-contrato');
 const rows=JSON.parse(contratoBytes).cases.filter(c=>c.id===ref.id);
 const fixtures=fixture.filter(c=>c.id===ref.id);
 need(rows.length===1&&fixtures.length===1&&equal(fixtures[0].entrada,ref.entrada)
  &&equal(rows[0].entry,ref.entrada)&&equal(rows[0].housing,ref.housing),'val-full-inputs');
 return {id:ref.id,entradaAPI:structuredClone(ref.entrada),contratoExterno:structuredClone(ref.housing),...pending()};
}

/** Census por instancia. Sólo predicados observados, sin inferencia jurídica. */
export function inspeccionarSESInquilinoValencia(text){
 const ses=accessSES(text);
 need(equal(ses.sections.map(s=>s.path),ref.censo),'val-censo-ses');
 for(const d of ref.descriptores)need(ses.row(ses.path(d.path),d.key,d.type,d.flag)===d.value,'val-descriptor');
 const keys=ses.records.filter(r=>r.scope===ses.path(region).id).map(r=>r.key).sort();
 need(equal(keys,ref.descriptores.filter(d=>d.path===region).map(d=>d.key).sort()),'val-censo-regional');
 return ses;
}

/** No usa RESUMEN como resultado vigente. Conserva ambos sin corregir bytes. */
export function proyectarValencia(text,pdfText){
 need(isString(pdfText)&&Buffer.byteLength(pdfText)<=4194304,'val-pdf-text');
 const ses=inspeccionarSESInquilinoValencia(text);
 const rows=pdfText.split(/\r?\n/).map(text=>({text}));
 const descriptors=[
  [region,'IMP1VA14','1124'],[tax,'IMPTARR','1128'],[tax,'CANTARR1','1129'],
  [region,'VA14','1095'],[tax,'IMPARR','1130'],[tax,'SUMADEDAUT','0564'],
  [tax,'CLIQEST','0570'],[tax,'CLIQAUT','0571'],[tax,'CLIQT','0587'],
  [tax,'PAGOS','0609'],[tax,'CDIF','0610'],[tax,'RESULTADO','0670'],
 ];
 const medidas=descriptors.map(([path,key,box])=>({path,key,...conciliarMedidaObservada(ses,rows,{path,key,box,type:'1',flag:null})}));
 const nifs=rows.filter(r=>/\s1122\s*$/.test(r.text));
 need(nifs.length===1&&/\s90000001N\s+1122\s*$/.test(nifs[0].text),'val-nif-pdf');
 const originalResumen=ses.row(ses.path('DECLARACIONES/RESUMEN'),'R_RESULTADO');
 const resultadoEUR=medidas.find(m=>m.box==='0670').pdf;
 return {medidas,resultadoEUR,originalResumenEUR:originalResumen,
  resumenDifiereDelFinal:Number(originalResumen)!==Number(resultadoEUR)};
}

function comprobarUI(load){
 const rb=JSON.parse(load(dir+'alquiler-readbacks.json'));
 need(equal(rb.externalHousing,ref.housing)&&equal(rb.externalNegatives,ref.externalNegatives)
  &&rb.externalFactsAreUiReadbacks===false&&equal(rb.nifMapping,ref.ui.nifMapping),'val-negativos-externos');
 need(equal(rb.initial,ref.ui.initial)&&equal(rb.reopened,ref.ui.reopened)
  &&equal(rb.requests,ref.ui.requests),'val-ui-censo');
 need(equal(rb.initial,JSON.parse(load(dir+'026-readback-inicial.json')))
  &&equal(rb.reopened,JSON.parse(load(dir+'061-readback-antes-aceptar.json')))
  &&equal(rb.reopened,JSON.parse(load(dir+'070-readback-reabierto.json'))),'val-ui-original');
 const controls=rb.reopened.controls;
 need(rb.reopened.count===28&&controls.length===28,'val-ui-instancias');
 need(equal(controls.slice(0,7).map(c=>c.value),[' ','2','7.200,00','365','1','90000001N',''])
  &&controls.slice(7).every(c=>c.value.trim()===''),'val-ui-valores');
 const options=JSON.parse(load(dir+'031-opciones-clave.json'));
 // El original de opciones queda fijado por SHA; no se confunde el índice 2 con edad/discapacidad acreditadas.
 need(options&&equal(JSON.parse(load(dir+'contrato-fijado.json')).options,ref.options),'val-ui-opciones');
 const actions=JSON.parse(load(dir+'094-acciones.json')).actions;
 let last=-1;
 for(const label of ['importar-semilla-propia','region-valenciana','seleccionar-clave-2-texto-observado','escribir-importe','escribir-dias','escribir-declarantes','escribir-arrendador','aceptar-alquiler','reabrir-alquiler','cancelar-reapertura-sin-cambios','exportar-ses','resumen','vista-previa']){
  const ix=actions.flatMap((a,i)=>a.label===label&&a.state==='completed'?[i]:[]);
  need(ix.length===1&&ix[0]>last,'val-cadena');last=ix[0];
 }
 const chain=JSON.parse(load(dir+'cadena-semilla.json'));
 for(const [name,hash] of Object.entries(chain.pins))need(ref.archivos[seed+name]===hash,'val-semilla-propia');
 const receipt=JSON.parse(load(dir+'093-frontera.json'));
 need(receipt.sesSha256===ref.archivos[dir+'exportado.ses']&&receipt.pdfSha256===ref.archivos[dir+'exportado.pdf'],'val-exportacion');
}

/** Todos los originales, sin archivos extra. Los hashes vienen del código,
 * nunca del expediente. El texto PDF ya extraído sólo permite proyección acotada. */
export function vincularInquilinoValencia(preparado,evidencia){
 try{
  need(preparado?.id===ref.id&&equal(preparado.entradaAPI,ref.entrada)&&equal(preparado.contratoExterno,ref.housing),'val-preparacion');
  need(evidencia?.files&&equal(Object.keys(evidencia.files).sort(),Object.keys(ref.archivos).sort()),'val-archivos');
  const load=name=>{const b=evidencia.files[name];need(Buffer.isBuffer(b)&&b.length<=16777216&&sha(b)===ref.archivos[name],'val-hash');return b;};
  for(const n of Object.keys(ref.archivos))load(n);
  prepararInquilinoValencia([{id:ref.id,entrada:preparado.entradaAPI}],load('inquilinos-transporte38/inquilinos-transporte.json'));
  need(equal(JSON.parse(load(seed+'entrada-intacta.json')),ref.entrada),'val-semilla-entrada');
  const contract=JSON.parse(load(dir+'contrato-fijado.json'));
  const transport=JSON.parse(load('valencia-captura-preparacion68/contrato.json'));
  for(const c of [contract,transport])need(c.caseId===ref.id&&equal(c.entry,ref.entrada)&&equal(c.housing,ref.housing),'val-contrato-captura');
  comprobarUI(load);
  const decoded=inflateSync(load(dir+'exportado.ses'),{maxOutputLength:4194304});
  const text=decoded.toString('latin1');
  need(text===load(dir+'ses-zlib-latin1.txt').toString('utf8'),'val-ses-extraido');
  const independent=proyectarValencia(text,rawPdfRows(load(dir+'exportado.pdf')).map(r=>r.text).join('\n'));
  const projection=proyectarValencia(text,load(dir+'exportado-pdf.txt').toString('utf8'));
  need(equal(independent,projection),'val-pdf-independent');
  const ui=JSON.parse(load(dir+'resultado-final-vivo.json'));
  need(ui.forcedExpectedResult===false&&equal(ui.finalEconomic,[{text:projection.resultadoEUR.replace('.',','),length:projection.resultadoEUR.length}]),'val-resultado-ui');
  return {estado:'entrada-ses-y-resultado-pdf-vinculados',...projection,...pending(),
   negativosExternos:structuredClone(ref.externalNegatives),hechosExternosSonReadbacks:false,
   controlesPendientes:structuredClone(ref.controlesPendientes),
   pdfTextoConciliado:true,pdfBytesExtraidosIndependientemente:true,
   limite:'No acredita dominio fiscal, tenencia jurídica, hechos futuros ni coincidencia del motor. No acredita coincidencia del motor; corresponde al medidor separado.'};
 }catch(e){return {estado:'no-verificado',motivo:/^val-[a-z-]+$/.test(e?.message)?e.message:'val-vinculo-fallo',...pending()};}
}
