import {Schema} from 'effect';
const isString=Schema.is(Schema.String);
const isRecord=Schema.is(Schema.Record(Schema.String,Schema.Unknown));
// Replay documental síncrono. Importar no ejecuta el candidato.
import * as candidate from './valencia-open.mjs';
import {readFileSync, realpathSync, statSync} from 'node:fs';
import {resolve, relative, isAbsolute, basename} from 'node:path';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {isDeepStrictEqual as equal} from 'node:util';
const REFERENCE_SHA = '2a403fbce0568c1a4a31c635a517d59ac38d33966a3b14e25eca77e8c628c5d9';
export const hash = b => createHash('sha256').update(b).digest('hex');
export const canonical = v => JSON.stringify(Array.isArray(v) ? v.map(x=>JSON.parse(canonical(x))) : isRecord(v) ? Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))])) : v);
const need = (v,c) => {if(!v)throw Error(c);};
const keys = (v,n,c) => need(v && equal(Object.keys(v).sort(),n.slice().sort()),c);
const maxExpanded=128*1024*1024, maxCompressed=16*1024*1024;
const nameOK=n=>isString(n)&&!isAbsolute(n)&&!n.includes('\\')&&n.split('/').every(p=>/^[A-Za-z0-9_.-]+$/.test(p)&&p!=='.'&&p!=='..');
export function readRelative(base,name){
  need(nameOK(name),'inq-open-path');
  const root=realpathSync(base),file=realpathSync(resolve(root,name)),rel=relative(root,file);
  need(rel&&!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('../'),'inq-open-path');
  need(statSync(file).isFile()&&statSync(file).size<=maxExpanded,'inq-open-size');
  return readFileSync(file);
}
// Misma reconstrucción level6 del patrón lossless; exige ejecutable Nix fijado
// incluso si la compresión nativa coincide. Nunca acepta sólo igualdad textual.
export function originalCompression(latin1,expected,compressor){
  const executable=process.env.C_SES_NODE;
  need(isString(executable)&&executable.startsWith('/nix/store/')&&basename(resolve(executable,'../..'))===compressor.derivation&&hash(readFileSync(executable))===compressor.executableSha256,'inq-open-compressor');
  const program="import{readFileSync}from'node:fs';import{deflateSync}from'node:zlib';process.stdout.write(deflateSync(readFileSync(0),{level:6}));";
  const r=spawnSync(executable,['--input-type=module','-e',program],{input:latin1,timeout:10000,killSignal:'SIGKILL',maxBuffer:4194304});
  need(!r.error&&r.status===0&&hash(r.stdout)===expected,'inq-open-recompression');
  return r.stdout;
}
export function comprobarReferenciaPublica(b){
  need(hash(b)===REFERENCE_SHA,'inq-open-trust-root');
  return JSON.parse(b);
}
function reference(){
  return comprobarReferenciaPublica(readFileSync(new URL('./valencia-public-reference.json',import.meta.url)));
}
export function reconstruirPaquete(bytes,offeredSha){
  const ref=reference();
  need(Buffer.isBuffer(bytes)&&bytes.length<=maxCompressed&&bytes.length===ref.package.size&&hash(bytes)===ref.package.sha256&&offeredSha===ref.package.sha256,'inq-open-package-root');
  const raw=gunzipSync(bytes,{maxOutputLength:maxExpanded});
  need(raw.length===ref.package.expandedSize,'inq-open-expansion');
  const p=JSON.parse(raw.toString('utf8'));
  need(Buffer.from(canonical(p)).equals(raw),'inq-open-canonical');
  keys(p,['schema','naturaleza','files'],'inq-open-schema');
  need(p.schema==='valencia-open-lossless-v1'&&p.naturaleza==='fixture-exclusivamente-sintetico','inq-open-schema');
  keys(p.files,ref.files.map(f=>f.file),'inq-open-files');
  const files=Object.create(null);
  for(const d of ref.files){
    need(nameOK(d.file),'inq-open-path');
    const v=p.files[d.file];
    keys(v,['format','sha256','size','content','decodedSha256','decodedSize'],'inq-open-descriptor');
    need(v.format===d.format&&v.sha256===d.sha256&&v.size===d.size&&v.decodedSha256===d.decodedSha256&&v.decodedSize===d.decodedSize,'inq-open-descriptor');
    need(isString(v.content),'inq-open-content');
    let b;
    if(d.format==='utf8') b=Buffer.from(v.content,'utf8');
    else if(d.format==='pdf-base64'){
      b=Buffer.from(v.content,'base64');need(b.toString('base64')===v.content,'inq-open-base64');
    }else if(d.format==='latin1-as-utf8'){
      need([...v.content].every(c=>c.codePointAt(0)<=255),'val-latin1');b=Buffer.from(v.content,'latin1');
    }else{
      need(d.format==='ses-latin1-as-utf8'&&[...v.content].every(c=>c.codePointAt(0)<=255),'inq-open-latin1');
      const latin1=Buffer.from(v.content,'latin1');
      need(latin1.length<=4194304&&latin1.length===d.decodedSize&&hash(latin1)===d.decodedSha256,'inq-open-ses');
      b=originalCompression(latin1,d.sha256,ref.compressor);
    }
    need(b.length===d.size&&hash(b)===d.sha256,'inq-open-source');
    files[d.file]=b;
  }
  return {files,ref};
}

export function referenciaValencia(){return reference();}
export function leerPaqueteValencia(base){
 const ref=reference(),b=readRelative(base,ref.package.file);
 need(b.length===ref.package.envelopeSize&&hash(b)===ref.package.envelopeSha256,'val-envelope-root');
 const e=JSON.parse(b);keys(e,['schema','content'],'val-envelope');
 need(e.schema==='valencia-package-base64-v1'&&isString(e.content),'val-envelope');
 const bytes=Buffer.from(e.content,'base64');need(bytes.toString('base64')===e.content,'val-envelope');return bytes;
}
export function cargarInquilinoValencia({bytes,sha256,entradaAPI,stable,fixture,resultadoOfrecidoEUR}){
 const {files,ref}=reconstruirPaquete(bytes,sha256);
 need(equal(stable,ref.stable)&&equal(entradaAPI,ref.casePre.entradaAPI),'val-current-stable');
 need(equal(fixture,ref.fixture),'val-fixture');
 for(const d of ref.modules)need(hash(readRelative(new URL('.',import.meta.url),d.file))===d.sha256,'val-module');
 const prepared=candidate.prepararInquilinoValencia(structuredClone(fixture),files['inquilinos-transporte38/inquilinos-transporte.json']);
 const result=candidate.vincularInquilinoValencia(prepared,{files});
 need(result.estado==='entrada-ses-y-resultado-pdf-vinculados'&&result.pdfBytesExtraidosIndependientemente===true,'val-binding');
 need(isString(resultadoOfrecidoEUR)&&resultadoOfrecidoEUR===result.resultadoEUR,'val-result');
 return {...result,resultadoOpenEUR:result.resultadoEUR,countedAsMatch:false,transportComplete:false};
}
