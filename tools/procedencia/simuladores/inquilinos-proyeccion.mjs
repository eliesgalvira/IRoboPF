import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {basename,resolve} from 'node:path';
import {isDeepStrictEqual as equal} from 'node:util';
import {Schema} from 'effect';
import {accessSES} from './conjunta-ses.mjs';
import {rawPdfRows} from './conjunta-pdf.mjs';
const REFERENCE_SHA = 'af3beaed61ed9bebb7aea0de05e90f0b05c464adf9f74c31592069d4797b158d';
export const hash=b=>createHash('sha256').update(b).digest('hex');
const record=Schema.is(Schema.Record(Schema.String,Schema.Unknown));
const string=Schema.is(Schema.String);
const canonical=v=>JSON.stringify(v,(_,x)=>record(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const digest=v=>hash(canonical(v));
const need=(v,c)=>{if(!v)throw Error(c);};
const freeze=v=>{if(Array.isArray(v)||record(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const refBytes=readFileSync(new URL('./inquilinos-proyeccion-reference.json',import.meta.url));
need(hash(refBytes)===REFERENCE_SHA,'proyeccion-referencia');
const ref=freeze(JSON.parse(refBytes));
export const idsProyeccion=Object.freeze(ref.casos.map(c=>c.id));
export function centimosProyeccion(v){
 need(string(v)&&/^-?\d{1,24}(?:\.\d{1,2})?$/.test(v),'proyeccion-importe');
 const [a,b='']=v.replace(/^-/,'').split('.');const n=BigInt(a)*100n+BigInt(b.padEnd(2,'0'));return v.startsWith('-')?-n:n;
}
const money=n=>`${n<0n?'-':''}${(n<0n?-n:n)/100n}.${String((n<0n?-n:n)%100n).padStart(2,'0')}`;
const euro=s=>s.replaceAll('.','').replace(',','.');
export function referenciaProyeccion(){return structuredClone(ref);}

/** P conserva exactamente entradaAPI. H íntegro sigue siendo autoridad y nunca
 * se sustituye por la referencia salarial. Whitelist local, sin repinear variantes.
 * Violencia: negativa conservadora adicional; no es una vía probada de 612-3.
 */
export function proyectarInquilino(H,fixtures){
 const p=ref.casos.find(c=>c.id===H?.id);
 need(p&&digest(H)===p.slotSha256,'proyeccion-autoridad');
 const fs=fixtures.filter(f=>f.id===H.id);
 need(fs.length===1&&equal(fs[0],p.fixture)&&equal(fs[0].entrada,H.entradaAPI),'proyeccion-fixture');
 const h=H.preparacionVivienda.hechosHabitacion;
 need(digest(h)===p.housingSha256&&h.inquilino===true&&h.violenciaGenero===false,'proyeccion-housing');
 return freeze({id:H.id,H:structuredClone(H),entradaAPI:structuredClone(H.entradaAPI),
  retenidos:[...p.retained],omitidos:[...p.omitted],
  viviendaTransportada:false,transportComplete:false,proyeccionFiscalVerificada:false});
}

/** Paquete rastreable: capturas originales y extractos normativos identificados.
 * La recomprensión usa siempre el ejecutable Node 24.19 fijado; no fallback nativo.
 */
export function reconstruirProyeccion(bytes){
 need(Buffer.isBuffer(bytes)&&bytes.length===ref.package.size&&hash(bytes)===ref.package.sha256,'proyeccion-paquete');
 const pkg=JSON.parse(bytes);need(pkg.schema==='inquilinos-proyeccion-originales-v1'
  &&equal(Object.keys(pkg.files).sort(),ref.files.map(f=>f.file).sort()),'proyeccion-archivos');
 const files=Object.create(null);
 for(const d of ref.files){
  const v=pkg.files[d.file];need(v.format===d.format&&v.sha256===d.sha256&&v.size===d.size,'proyeccion-descriptor');
  let b;
  if(d.format==='ses-latin1'){
   need([...v.content].every(c=>c.codePointAt(0)<=255),'proyeccion-latin1');
   const latin=Buffer.from(v.content,'latin1');need(hash(latin)===d.decodedSha256,'proyeccion-ses-texto');
   const exe=process.env.C_SES_NODE;
   need(string(exe)&&exe.startsWith('/nix/store/')
    &&basename(resolve(exe,'../..'))===ref.compressor.derivation
    &&hash(readFileSync(exe))===ref.compressor.executableSha256,'proyeccion-node24-19');
   const program="import{readFileSync}from'node:fs';import{deflateSync}from'node:zlib';process.stdout.write(deflateSync(readFileSync(0),{level:6}));";
   const r=spawnSync('timeout',['-k','2s','12s',exe,'--input-type=module','-e',program],{input:latin,timeout:15000,killSignal:'SIGKILL',maxBuffer:4194304});
   need(!r.error&&r.status===0,'proyeccion-compresion');b=r.stdout;
  }else if(d.format==='pdf-base64'){b=Buffer.from(v.content,'base64');need(b.toString('base64')===v.content,'proyeccion-base64');}
  else{need(d.format==='utf8','proyeccion-formato');b=Buffer.from(v.content,'utf8');}
  need(b.length===d.size&&hash(b)===d.sha256,'proyeccion-original');files[d.file]=b;
 }
 return files;
}

function pdfAmount(rows,box){
 const found=rows.filter(r=>new RegExp(`\\s${box}\\s*$`).test(r.text));
 need(found.length===1,'proyeccion-pdf-unico');
 const m=/(?:^|\s)(-?(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2})\s+\d{4}\s*$/.exec(found[0].text);
 need(m,'proyeccion-pdf-importe');return euro(m[1]);
}
/** Binding recibe originales propios. Los totales se derivan de SES y PDF;
 * ningún total esperado constante ni bandera aportada concede la admisión.
 */
export function vincularProyeccion(H,fixtures,bytes){
 const P=proyectarInquilino(H,fixtures),p=ref.casos.find(c=>c.id===H.id);
 const files=reconstruirProyeccion(bytes),load=n=>files[H.id+'/'+n];
 const legal=JSON.parse(files['normativa/citas.json']);
 const required=p.fuentes.flatMap(f=>f.citas);
 need(required.every(id=>legal.citas.filter(c=>c.id===id).length===1),'proyeccion-citas');
 const docIds=new Set(legal.citas.filter(c=>required.includes(c.id)).map(c=>c.documentoId));
 need(!legal.missing.some(d=>docIds.has(d.id)),'proyeccion-fuente-primaria-ausente');
 for(const d of legal.documentos.filter(d=>docIds.has(d.id)||d.id==='LIRPF-2025'))
  need(files['normativa/'+d.sha256]&&hash(files['normativa/'+d.sha256])===(d.extractoPublico?.sha256??d.sha256),'proyeccion-norma');
 const state=JSON.parse(files['normativa/estatal.json']);
 need(['LIRPF-art19','LIRPF-DT15'].every(id=>state.filter(q=>q.id===id).length===1),'proyeccion-estatal');
 for(const q of state){
  const d=legal.documentos.find(d=>d.sha256===q.documentoSha256);
  const desplazamiento=d?.extractoPublico?.inicioUTF16??0;
  need(q.inicio>=desplazamiento&&files['normativa/'+q.documentoSha256].toString('utf8').slice(q.inicio-desplazamiento,q.fin-desplazamiento)===q.html,'proyeccion-cita-estatal');
 }
 need(equal(JSON.parse(load('entrada-intacta.json')),P.entradaAPI)
  &&equal(JSON.parse(load('expediente-externo-sintetico.json')).housing,P.H.preparacionVivienda.hechosHabitacion),'proyeccion-entrada-original');
 const decoded=inflateSync(load('parcial-trabajo.ses'),{maxOutputLength:4194304}).toString('latin1');
 need(decoded===load('ses-observado.txt').toString('utf8'),'proyeccion-derivacion-ses');
 const ses=accessSES(decoded),row=(path,key)=>ses.row(ses.path(path),key);
 const tax='DECLARACIONES/IRPF2025';
 need(row('DECLARACIONES','INDV')==='true'&&row(tax,'TITULAR')==='DECLARANTE'
  &&row('DECLARACIONES/DP','CAC_D')===p.region&&row(tax,'ZCCAD')===p.region
  &&row('DECLARACIONES/DP','EDADD')===String(P.entradaAPI.edad)
  &&row('DECLARACIONES/DP','DPFNAC_D')==='01/01/1985','proyeccion-identidad-ses');
 const rows=rawPdfRows(load('parcial-trabajo.pdf'));
 const ui=JSON.parse(load('readbacks.json')).readbacks;
 const salary=P.entradaAPI.trabajo.rendimientos[0];
 const measures=[['IDII',salary.integro,'0003'],['GSS',salary.cotizaciones.seguridadSocial,'0013'],['IDRE',P.entradaAPI.retenciones[0].importe,'0596']];
 for(const [key,amount,box]of measures){
  const rs=ui.filter(r=>r.key===key);need(rs.length===1&&rs[0].state==='explicit-ui-value'
   &&centimosProyeccion(euro(rs[0].observed))===centimosProyeccion(amount)
   &&centimosProyeccion(row(tax+'/ATRABAJO/DLGTRABAJO',key))===centimosProyeccion(amount)
   &&centimosProyeccion(pdfAmount(rows,box))===centimosProyeccion(amount),'proyeccion-salario');
 }
 const regions=ui.filter(r=>r.key==='region'),birth=ui.filter(r=>r.key==='birth');
 need(regions.length===1&&regions[0].observed===(p.region==='07'?'CASTILLA-LA MANCHA':'CATALUÑA')
  &&birth.length===1&&birth[0].observed==='01/01/1985','proyeccion-readback-personal');
 const html=load('resumen-parcial.html').toString('utf8');
 const sums=[...html.matchAll(/Suma de deducciones autonómicas[\s\S]*?<u>([^<]+)<\/u>/g)];
 need(sums.length===1&&centimosProyeccion(euro(sums[0][1]))===0n
  &&centimosProyeccion(pdfAmount(rows,'0564'))===0n,'proyeccion-cero-agregado');
 const total=centimosProyeccion(row(tax,'RESULTADO'));
 const summary=[...html.matchAll(/<button id="RESINGDEV"[^>]*><u>([^<]+)<\/u>/g)];
 need(summary.length===1&&total===centimosProyeccion(euro(summary[0][1]))
  &&total===centimosProyeccion(row(tax,'CDIF'))&&total===centimosProyeccion(pdfAmount(rows,'0670')),'proyeccion-total');
 // Misma convención de signo que cuotaDiferencialPresentada: ingreso positivo.
 return freeze({...P,estado:'proyeccion-inquilino-ses-pdf-vinculada',proyeccionFiscalVerificada:true,
  resultadoOpenEUR:money(total),deduccionAlquilerDocumentalEUR:'0.00',
  deduccionAlquilerOpenEUR:null,sumaDeduccionesAutonomicasOpenEUR:'0.00',
  reglaSigno:'ingreso-positivo-devolucion-negativa',countedAsMatch:false});
}

/** Única entrada del medidor: rehace vínculo; no acepta banderas copiadas. */
export function admitirProyeccionMedida(caso,base){
 try{
  const descriptor=caso.evidenciaOpen?.proyeccionInquilino;
  need(descriptor&&equal(Object.keys(descriptor).sort(),['packageSha256']),'proyeccion-evidencia');
  need(descriptor.packageSha256===ref.package.sha256,'proyeccion-paquete-ofrecido');
  const p=ref.casos.find(p=>p.id===caso.id);need(p,'proyeccion-id');
  const {resultadoOpenEUR,componentesOpenEUR}=caso;
  const wrappers=new Set(['resultadoOpenEUR','componentesOpenEUR','evidenciaOpen','integridadReferencias']);
  const authority=Object.fromEntries(Object.entries(caso).filter(([key])=>!wrappers.has(key)));
  // La observación no atribuye importes a componentes sin una proyección propia.
  need(equal(componentesOpenEUR,{}),'proyeccion-componentes');
  // Sólo las envolturas de observación cambian; hechos y pesos siguen fijados.
  const H={...authority,resultadoOpenEUR:p.casePre.resultadoOpenEUR,componentesOpenEUR:p.casePre.componentesOpenEUR};
  need(digest(H)===p.slotSha256,'proyeccion-slot-medicion');
  const bytes=readFileSync(resolve(base,descriptorPath(base)));
  const r=vincularProyeccion(H,[p.fixture],bytes);
  need(centimosProyeccion(resultadoOpenEUR)===centimosProyeccion(r.resultadoOpenEUR),'proyeccion-total-ofrecido');
  return r;
 }catch{return {estado:'no-verificado',viviendaTransportada:false,transportComplete:false,proyeccionFiscalVerificada:false,countedAsMatch:false,resultadoOpenEUR:null};}
}
function descriptorPath(){return 'proyeccion-inquilinos/originales.json';}
