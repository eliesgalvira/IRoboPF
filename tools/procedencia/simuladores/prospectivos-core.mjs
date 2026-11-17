import {Schema} from 'effect';
const string=Schema.is(Schema.String);
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {originalCompression} from './vincular-conjunta-open.mjs';
export const need=(ok,why)=>{if(!ok)throw Error(why);};
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function safePath(root,name){
 need(string(name)&&/^[a-zA-Z0-9_.\/-]+$/.test(name)&&!name.startsWith('/')&&!name.split('/').some(x=>!x||x==='.'||x==='..'),'ruta-relativa');
 let p=fs.realpathSync(root);
 for(const part of name.split('/')){p=path.join(p,part);need(!fs.lstatSync(p).isSymbolicLink(),'ruta-simbolica');}
 return p;
}
export function read(root,name,pin){
 const b=fs.readFileSync(safePath(root,name));need(b.length<=4194304,'archivo-limite');
 if(pin)need(b.length===pin.bytes&&hash(b)===pin.sha256,'sello:'+name);
 return b;
}
export const decimal=v=>{need(string(v)&&/^-?\d+(?:\.\d+)?$/.test(v),'decimal');const [a,b='']=v.split('.');return [BigInt(a+b),10n**BigInt(b.length)];};
export const add=(a,b)=>[a[0]*b[1]+b[0]*a[1],a[1]*b[1]];
export const sub=(a,b)=>add(a,[-b[0],b[1]]);
export const mul=(a,b)=>[a[0]*b[0],a[1]*b[1]];
export const div=(a,b)=>{need(b[0]!==0n,'division');return [a[0]*b[1],a[1]*b[0]];};
export const le=(a,b)=>a[0]*b[1]<=b[0]*a[1];
export const same=(a,b)=>a[0]*b[1]===b[0]*a[1];
export const quant=a=>[(a[0]*200n+a[1])/(2n*a[1]),100n];
export function gh(h,p,persistido){
 const i=h.entrada.inmuebles[0],d=decimal,A=add(d(i.adquisicion.precio),d(i.adquisicion.gastosTributos)),b=d(i.catastro2025.construccion),s=d(i.catastro2025.suelo),C=div(mul(A,b),add(b,s)),Hmax=mul(A,[93n,36600n]),aop=d(p.result.politicaOpen.amortizacion),cost=d(p.result.politicaOpen.costeOperativo);
 need(le(b,C)&&le(d(h.entrada.historia2024.construccion),C)&&le(C,A)&&le(add(Hmax,mul(C,d('0.03'))),C)&&le(add(Hmax,aop),C),'GH-desigualdad');
 need(same(C,[BigInt(p.result.politicaOpen.costeLegal.n),BigInt(p.result.politicaOpen.costeLegal.d)]),'GH-C');
 need(same(cost,div(mul(A,d(p.result.politicaOpen.porcentaje)),d('100'))),'coste-P');
 need(same(quant(cost),d(persistido)),'coste-persistido');
 return {C:C.map(String),Hmax:Hmax.map(String),igualdadExacta:same(cost,d(persistido)),diferencia:sub(cost,d(persistido)).map(String),dominio:'hechos externos H; 0 <= D <= Hmax'};
}
export function reconstruct(s){
 need(s.schema==='ses-latin1-reconstructible-v1'&&s.compresion==='zlib-deflate-level-6'&&string(s.contenido)&&s.contenido.length<=4194304&&[...s.contenido].every(c=>c.charCodeAt(0)<=255),'ses-envoltura');
 const b=Buffer.from(s.contenido,'latin1'),z=originalCompression(b,s.sesSHA256);
 need(b.length===s.latin1Bytes&&hash(b)===s.latin1SHA256&&z.length===s.sesBytes&&hash(z)===s.sesSHA256&&inflateSync(z,{maxOutputLength:4194304}).equals(b),'ses-reconstruccion');return z;
}
export function csvBytes(s){
 need(string(s)&&s.length<=4194304&&/^-?\d+(?:,-?\d+)*$/.test(s),'buffer-decimal');
 const n=s.split(',').map(Number);need(n.every(x=>Number.isInteger(x)&&x>=-128&&x<=255),'buffer-rango');return Buffer.from(n);
}
export function transports(s,parsed){
 need(s.transportesInternos.length===2,'transportes-censo');
 for(const t of s.transportesInternos){const rows=parsed.records.filter(r=>r.path===t.ambito&&r.key===t.campo);need(rows.length===1,'transporte-ambito');
  let stage=inflateSync(csvBytes(rows[0].value),{maxOutputLength:4194304}).toString('latin1');
  need(t.etapas.length===(t.campo==='DF_DATOS_SI'?2:1),'transporte-etapas');
  for(let n=0;n<t.etapas.length;n++){const e=t.etapas[n];need(stage===e.contenido&&hash(Buffer.from(stage,'latin1'))===e.sha256,'transporte-sello');if(n+1<t.etapas.length)stage=csvBytes(stage).toString('latin1');}
  if(t.campo==='DF_DATOS_SI'){const lines=stage.trimEnd().split('\n');need(lines.length===2&&lines[0].startsWith('DG\t')&&lines[1].startsWith('TI\t'),'buffer-censo');const ti=lines[1].split('\t');const dp=k=>parsed.records.find(r=>r.path==='DECLARACIONES/DP'&&r.key===k)?.value;need(ti[3]===dp('DPNIF_D')&&ti[4]===dp('DP_APENOM_D')&&ti[7]===dp('DPFNAC_D')&&ti[11]===dp('CAC_D'),'buffer-identidad');}
  else need(csvBytes(stage).toString('latin1')==='[dg1]','buffer-avisos');
 }
}
export function at(o,p){return p.split('/').filter(Boolean).reduce((v,k)=>v?.[k],o);}
export function binding(row,rule,context){
 if(rule.kind==='reserva')return false;
 if(rule.kind==='negativo'){need(row.type==='2'&&['254','255'].includes(row.value),'negativo');return true;}
 if(rule.kind==='transporte')return true;
 const expected=rule.source?at(context,rule.source):rule.literal;
 need(expected!==undefined,'mapa-localizador');
 need(rule.numeric?same(decimal(row.value),decimal(String(expected))):row.value===String(expected),'mapa-valor:'+row.key);return true;
}
