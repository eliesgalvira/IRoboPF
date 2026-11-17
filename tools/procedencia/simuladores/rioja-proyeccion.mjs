/** Proyección fiscal de un único expediente sintético; nunca aceptación regional. */
import {readFileSync,realpathSync} from 'node:fs';
import {resolve,relative,isAbsolute,basename} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gunzipSync,inflateSync} from 'node:zlib';
import {parseSES,housingSES} from './dt18-ses.mjs';
import {Schema} from 'effect';
import {rawPdfRows} from './conjunta-pdf.mjs';

export const riojaId='open2025-la-rioja-01';
const need=(ok,code)=>{if(!ok)throw Error('rioja-'+code);};
const record=Schema.is(Schema.Record(Schema.String,Schema.Unknown));
export const canonRioja=x=>JSON.stringify(x,(_,v)=>record(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const hash=b=>createHash('sha256').update(b).digest('hex');
const h=x=>hash(canonRioja(x));
export function proyectarRioja(H,c){
 need(c.id===riojaId&&h(H)===c.Hsha256&&c.Hsha256==='b244bb9d964279d66255e2ef87165509e9bfebf6c9f7067c2d036768846b965c','H-distinto');
 const d=H.deduccionesTerritoriales2025,home=d.viviendaDT182025,p=home.proyectos;
 need(H.edad===40&&H.discapacidad==='ninguna'&&p.length===1&&p[0].operacion==='adquisicion'
  &&p[0].vivienda.obra===null&&p[0].vivienda.informeDiscapacidad===null
  &&home.adquisicion.fecha==='2010-02-01'&&home.historia.derechos.length===1
  &&d.solicitudes.length===1&&d.solicitudes[0].lote==='E38'
  &&canonRioja(d.solicitudes[0].hechos.viviendas[0])===canonRioja(p[0].vivienda),'hechos-no-conciliados');
 const P={ejercicio:H.ejercicio,comunidadAutonoma:H.comunidadAutonoma,edad:H.edad,modalidad:H.modalidad,devengo:H.devengo,trabajo:H.trabajo,retenciones:H.retenciones,vivienda:{adquisicion:'2010-02-01',uso:'habitual',titular:'s-1',porcentaje:'100.00',dias:365,municipio:'Logroño',pagos:'6000.00'}};
 need(h(P)===c.Psha256&&canonRioja(P)===canonRioja(c.P),'P-distinta');
 need(c.campos.length===Object.keys(H).length&&c.campos.every(f=>Object.hasOwn(H,f.campo)&&h(H[f.campo])===f.valorSha256),'campos-incompletos');
 return structuredClone(P);
}
export function cargarRioja(base){
 const root=realpathSync(resolve(base,'rioja-proyeccion'));
 const safe=name=>{need(Schema.is(Schema.String)(name)&&!isAbsolute(name)&&!name.includes('\\')&&!name.split('/').some(p=>['.','..',''].includes(p)),'ruta');
  const p=realpathSync(resolve(root,name)),r=relative(root,p);need(r!=='..'&&!r.startsWith('../')&&!isAbsolute(r),'ruta');return p;};
 const cb=readFileSync(safe('contrato.json'));need(hash(cb)==='cd389c0aeacf32e64e02e3b7ce48526596c9e5a0dad8f843d22cf0d0cc3223ba','contrato-hash');
 const c=JSON.parse(cb),art={};
 for(const [key,r]of Object.entries(c.refs)){
  if(key==='ses'){
   const descriptor=readFileSync(safe('ses-transcripcion.json'));
   need(hash(descriptor)==='65c04e47f134298cca1a571f56cf974fb502eb283d1cda9d4f68273d44cfafd3','transcripcion-descriptor');
   const d=JSON.parse(descriptor),bytes=readFileSync(safe(d.archivo)),text=bytes.toString('utf8');
   need(bytes.length<=4194304&&hash(bytes)===d.sha256&&Buffer.from(text).equals(bytes)
    &&[...text].every(char=>char.codePointAt(0)<=255),'transcripcion-texto');
   const latin=Buffer.from(text,'latin1');need(hash(latin)===d.latin1Sha256,'transcripcion-latin1');
   const exe=process.env.C_SES_NODE;
   need(Schema.is(Schema.String)(exe)&&exe.startsWith('/nix/store/')
    &&basename(resolve(exe,'../..'))===d.compressor.derivation
    &&hash(readFileSync(exe))==='5665680b3dd68ebe81308cba2283249c204f8c0ab9ef4d3d4cc322b4d9c24ad4','compresor');
   const program="import{readFileSync}from'node:fs';import{deflateSync}from'node:zlib';process.stdout.write(deflateSync(readFileSync(0),{level:6}));";
   const result=spawnSync('timeout',['-k','2s','12s',exe,'--input-type=module','-e',program],{input:latin,timeout:15000,killSignal:'SIGKILL',maxBuffer:4194304});
   need(!result.error&&result.status===0&&hash(result.stdout)===r.sha256&&r.sha256===d.originalCompressedSha256,'ses-reconstruccion');
   art.ses=result.stdout;continue;
  }
  const raw=readFileSync(safe(r.archivo));need(raw.length<=16*1024*1024,'tamano');
  const b=r.encoding==='gzip-base64'?gunzipSync(Buffer.from(raw.toString().trim(),'base64'),{maxOutputLength:16*1024*1024}):raw;
  need(hash(b)===r.sha256,'original-hash');art[key]=r.encoding==='utf8'?JSON.parse(b):b;
 }
 const ex=readFileSync(safe('exclusiones.json'));need(hash(ex)===c.exclusionesSha256,'exclusiones-hash');
 const checked=r=>{const bytes=readFileSync(safe(r.archivo));need(bytes.length<=16*1024*1024&&hash(bytes)===r.sha256,'evidencia-hash');return bytes;};
 const suplemento=JSON.parse(checked(c.suplemento));
 const temporal=JSON.parse(checked(c.fuenteTemporal));
 need(temporal.extractos.length===2,'temporal-extractos');
 for(const r of temporal.extractos)checked(r);
 const fuente=JSON.parse(checked(c.fuenteAcotada));
 need(fuente.extractos.length===4&&fuente.sustitucion.originalNoLocalizadoSha256==='13e19385dbc0421d693de5ca22a13b00a7f877f9ce7ceeda1e918deac7845017'&&fuente.sustitucion.equivalenciaIntegra===false,'fuente-sustitucion');
 for(const r of fuente.extractos)checked(r);
 for(const r of c.parsersVigentes)need(hash(readFileSync(new URL(r.nombre,import.meta.url)))===r.sha256,'parser-vigente');
 need(suplemento.originalReceiptSha256===c.refs.recibo.sha256&&suplemento.originalReceiptState==='discovery-needed'
  &&suplemento.transportComplete===false&&suplemento.regionalControlsAccepted===false
  &&suplemento.regionalAmountOpen===null&&suplemento.proyeccionFiscalVerificada===false,'suplemento');
 proyectarRioja(art.H,c);
 const decision=readFileSync(resolve(base,'rioja-documental146.txt'));
 need(hash(decision)==='9d67c1e2d2dac62cae8a1ac3907195159cc94829f96c1fac6e7463a3536d60aa','decision-revisada');
 const exclusiones=excluirSieteViasRioja(art.H);
 need(Object.values(exclusiones).every(Boolean),'exclusiones-no-acreditadas');
 need(art.recibo.state==='discovery-needed'&&art.recibo.transportComplete===false
  &&art.regional.regionalAmount===null&&art.regional.controlsAccepted===false,'regional-promovido');
 need(art.recibo.inputSha256===c.refs.H.sha256&&art.recibo.caseSha256===c.refs.original.sha256
  &&art.recibo.ses.sha256===c.refs.ses.sha256&&art.recibo.pdf.sha256===c.refs.pdf.sha256,'recibo');
 need(canonRioja(art.H)===canonRioja(art.original.entradaAPI)
  &&canonRioja(art.expediente.externalFacts.fullContract)===canonRioja(art.H.deduccionesTerritoriales2025.viviendaDT182025)
  &&canonRioja(art.expediente.externalFacts.regionalRequests)===canonRioja(art.H.deduccionesTerritoriales2025.solicitudes)
  &&canonRioja(art.recibo.readbacks)===canonRioja(art.readbacks.readbacks),'contrato-externo');
 for(const [name,expected]of Object.entries(art.semilla.pins)){
  const key=Object.entries(c.refs).find(([,r])=>r.sha256===expected);
  const historical=c.herramientasHistoricas.filter(r=>r.nombre===name&&r.sha256===expected&&r.rol==='procedencia-historica; no evidencia fiscal ni parser vigente');
  need(!!key||historical.length===1,'semilla-no-conciliada');
 }
 need(c.herramientasHistoricas.length===6,'herramientas-inventario');
 for(const [nombre,sha256] of Object.entries(art.recibo.dependencies).filter(([n])=>n.endsWith('.mjs')))
  need(c.herramientasHistoricas.filter(r=>r.nombre===nombre&&r.sha256===sha256).length===1,'herramienta-recibo');
 validarCensoRioja(art);
 return {c,art,exclusiones,decisionSha256:hash(decision)};
}
const cents=s=>{need(Schema.is(Schema.String)(s)&&/^-?\d+(?:\.\d{1,2})?$/.test(s),'decimal');const neg=s.startsWith('-'),[a,b='']=s.replace(/^-/,'').split('.');const n=BigInt(a)*100n+BigInt(b.padEnd(2,'0'));return neg?-n:n;};
export function replayRioja({art}){
 const text=inflateSync(art.ses,{maxOutputLength:4194304}).toString('latin1');
 const {records,sections}=parseSES(text),base='DECLARACIONES/IRPF2025';
 const row=(key,path=base,type='1',flag=null)=>{const a=records.filter(r=>r.key===key);need(a.length===1&&a[0].path===path&&a[0].type===type&&a[0].flag===flag,'ses-ambito');return a[0].value;};
 for(const p of ['DECLARACIONES','DECLARACIONES/DP',base])need(sections.filter(s=>s.path===p).length===1,'ses-ambito');
 const work=base+'/ATRABAJO/DLGTRABAJO';
 need(sections.filter(s=>s.path===base+'/ATRABAJO').length===1&&sections.filter(s=>s.path===work).length===1,'trabajo-instancias');
 const rb=key=>{const a=art.readbacks.readbacks.filter(r=>r.key===key);need(a.length===1,'readback');return a[0];};
 need(row('DPNIF_D','DECLARACIONES/DP','3','254')===rb('nif').observed
  &&row('DP_APENOM_D','DECLARACIONES/DP')===rb('name').observed
  &&row('DPFNAC_D','DECLARACIONES/DP')==='01/01/1985'&&row('EDADD','DECLARACIONES/DP')==='40'
  &&row('CAC_D','DECLARACIONES/DP')==='16'&&row('ZCCAD')==='16'
  &&row('INDV','DECLARACIONES')==='true','identidad');
 for(const [key,wanted]of [['IDII','60000.00'],['GSS','3900.00'],['IDRE','14000.00']]){
  const r=rb(key);need(r.requested===wanted&&cents(r.observed.replaceAll('.','').replace(',','.'))===cents(wanted)&&cents(row(key,work))===cents(wanted),'salario-readback');
 }
 for(const key of ['GCS','GCC','GDJ','IDICLDED2','GSSCLDED2']){
  const r=rb(key);need(['0','0.00'].includes(r.requested)&&r.observed==='','cero-readback');
  const rows=records.filter(r=>r.key===key);
  need(rows.length<=1,'cero-duplicado');
  if(rows.length)need(cents(row(key,work))===0n,'cero-ses');
 }
 housingSES(text,art.expediente);
 const pdfRows=rawPdfRows(art.pdf),boxes={};
 const one=box=>{const a=pdfRows.filter(r=>new RegExp('\\b'+box+'\\s*$').test(r.text));need(a.length===1,'pdf-casilla');return a[0].text;};
 for(const [box,label,value]of [['0001','NIF',rb('nif').observed],['0002','Apellidos y nombre',rb('name').observed],['0010','Fecha de nacimiento','01/01/1985']]) {
  const matches=pdfRows.filter(r=>r.page===0&&r.text.startsWith(label+' ')&&new RegExp('\\b'+box+'\\s*$').test(r.text));
  need(matches.length===1&&matches[0].text===label+' '+value+' '+box,'pdf-identidad');
 }
 for(const [key,box]of [['DED1E','0547'],['DED1A','0548'],['RESULTADO','0670'],['MPER','0511'],['MPERAU','0512'],['MPERFA','0519'],['MPERFAAU','0520']]){
  const m=/(-?[\d.]+,\d{2})\s+\d{4}\s*$/.exec(one(box));need(m,'pdf-decimal');
  const v=m[1].replaceAll('.','').replace(',','.');need(cents(v)===cents(row(key)),'ses-pdf');boxes[box]=v;
 }
 return {casillas:boxes,cuotaDiferencialPresentada:boxes['0670'],signo:'negativo=devolucion',unidad:'EUR',regionalAmountOpen:null,regionalControlsAccepted:false,transportComplete:false};
}
export function vincularRiojaProyeccion(caso,base){
 try{
  need(caso.id===riojaId&&caso.territorio==='la-rioja'&&caso.pesoExterno==='193406.000000000000','slot');
  const loaded=cargarRioja(base),{c}=loaded;need(h(caso.entradaAPI)===c.Hsha256,'H-distinto');
  const replay=replayRioja(loaded);need(caso.resultadoOpenEUR===replay.cuotaDiferencialPresentada,'resultado-signo');
  // El replay no acredita por sí mismo la historia externa ni aceptación regional.
  return {...replay,estado:'proyeccion-rioja-ses-pdf-vinculada',
   gates:{fuenteRevisada:true,exclusionesAcreditadas:true,replayContrastado:true},
   decisionSha256:loaded.decisionSha256,exclusiones:loaded.exclusiones,
   faltantesHistoricos:c.faltantes,proyeccionFiscalVerificada:true,countedAsMatch:false,historiaVerificada:false,
   diagnosticoAPIs:{estado:'contratos-distintos',explicitaEUR:'-691.10',canonicaEUR:'-660.82',diferenciaEUR:'30.28',totalComparable:false}};
 }catch(e){return {estado:'no-verificado',proyeccionFiscalVerificada:false,transportComplete:false,regionalControlsAccepted:false,regionalAmountOpen:null,countedAsMatch:false,motivo:/^rioja-[a-z-]+$/.test(e.message)?e.message:'rioja-vinculo-fallo'};}
}

export function validarCensoRioja(art){
 const same=(a,b)=>canonRioja(a)===canonRioja(b);
 const rb=key=>{const rows=art.readbacks.readbacks.filter(r=>r.key===key);need(rows.length===1,'censo-readback');return rows[0];};
 need(same(art.ficha.slice(0,art.censoDespues.length),art.censoDespues),'censo-relacion');
 need(same(rb('dt18-negativos-antes').observed,art.inventarioAntes)&&same(rb('dt18-negativos-despues').observed,art.inventarioDespues),'inventario-relacion');
 const one=(rows,title,parent=false)=>{const a=rows.filter(r=>(parent?r.parentTitle:r.title)===title);need(a.length===1,'censo-cardinalidad');return a[0];};
 need(one(art.censoAntes,'Propiedad (%):').value===''&&one(art.censoAntes,'Dirección:').value===''
  &&one(art.censoAntes,'Vivienda habitual en 2025:',true).checked===false,'censo-antes');
 need(one(art.ficha,'Propiedad (%):').value==='100,00'&&one(art.ficha,'Contribuyente titular:').value==='DECLARANTE'
  &&one(art.ficha,'Dirección:').value===art.expediente.address.candidate
  &&one(art.ficha,'Vivienda habitual en 2025:',true).checked===true
  &&one(art.ficha,'Número de días en que el inmueble ha sido su vivienda habitual en 2025:').value==='365','censo-hechos');
 need(rb('housing-address').requested===art.expediente.address.candidate&&rb('housing-address').observed===art.expediente.address.candidate
  &&rb('dt18-date').observed==='01/02/2010'&&rb('dt18-payments').observed==='6.000,00','censo-inversion');
 // Historia patrimonial es declaración externa íntegra, nunca aceptación UI.
 return {historiaVerificada:false,regionalAmountOpen:null,regionalControlsAccepted:false,transportComplete:false};
}

/** Motivos suficientes para este perfil; no evaluador general de derechos riojanos. */
export function excluirSieteViasRioja(H){
 const v=H.deduccionesTerritoriales2025?.viviendaDT182025;
 need(v&&H.ejercicio===2025&&H.comunidadAutonoma==='la-rioja'&&H.devengo==='2025-12-31','exclusiones-perfil');
 const h=v.historia,p=v.proyectos;
 need(v.exhaustividad==='primera_unica_vivienda_sin_transmisiones_reinversiones_ni_otras_inversiones'
  &&h.desde===v.nacimiento&&h.hasta===H.devengo&&h.derechos.length===1&&h.anticipos.length===0
  &&h.derechos[0].inmueble===v.adquisicion.inmueble&&h.derechos[0].titular===v.persona
  &&h.derechos[0].transmision===null&&h.derechos[0].adquisicion===v.adquisicion.fecha,
  'exclusiones-historia');
 const first=Number(v.nacimiento.slice(0,4));
 // Declaraciones de ejercicios anteriores; 2025 está en proyectos, pagos y censo.
 need(h.ejercicios.length===2025-first&&h.ejercicios.every((e,i)=>e.anio===first+i&&Array.isArray(e.eventos)),
  'exclusiones-historia');
 need(p.length===1&&p[0].vivienda.inmueble.id===v.adquisicion.inmueble
  &&p[0].vivienda.inmueble.uso==='habitual','exclusiones-vivienda');
 const ordinaria=p[0].operacion==='adquisicion'&&p[0].vivienda.obra===null
  &&p[0].vivienda.informeDiscapacidad===null&&p[0].calificacionAdecuacion===null;
 const anterior=limite=>ordinaria&&v.adquisicion.fecha<limite
  &&p[0].fechaInicio===v.adquisicion.fecha&&p[0].terminacion===v.adquisicion.fecha;
 return {'DT1.a':ordinaria,'DT1.b':H.edad>=36,'DT1.c':true,
  'DT1.d':ordinaria&&H.discapacidad==='ninguna','art32.2':anterior('2017-01-01'),
  'art32.11':H.edad>=36,'DA2':anterior('2013-01-01')};
}
