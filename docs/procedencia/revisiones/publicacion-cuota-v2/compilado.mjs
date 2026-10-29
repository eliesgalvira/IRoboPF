import {readFileSync,writeFileSync,readdirSync,mkdirSync,copyFileSync,statSync,renameSync} from 'node:fs'
import {resolve,dirname,relative} from 'node:path'
import {createRequire} from 'node:module'
import {createHash} from 'node:crypto'
import {gunzipSync,gzipSync} from 'node:zlib'
const root=process.cwd(), scratch=resolve(root,'.cache/publicacion-cuota-v2'), dest=resolve(scratch,'paquete'), files=new Set(), traces=[]
const sha=b=>createHash('sha256').update(b).digest('hex')
function scan(p){for(const e of readdirSync(p,{withFileTypes:true})){const f=resolve(p,e.name);if(e.isDirectory())scan(f);else if(e.name.endsWith('.nft.json')){const deps=JSON.parse(readFileSync(f)).files.map(x=>resolve(dirname(f),x));traces.push({ruta:relative(root,f),documentos:deps.filter(x=>x.includes('/contenidos/datos/')).length});for(const x of [f,f.slice(0,-9),...deps])files.add(x)}}}
scan(resolve(root,'.next/server/app/procedencia'))
files.delete(resolve(root,'node_modules'))
const retraza=JSON.parse(readFileSync(resolve(scratch,'retraza.json')))
for(const f of retraza.files){const p='/'+f;if(!statSync(p).isDirectory())files.add(p)}
let bytes=0
for(const f of files){const n=f.startsWith('/home/elies/Repos/IRoboPF/node_modules/')?'node_modules/'+relative('/home/elies/Repos/IRoboPF/node_modules',f):relative(root,f);if(n.startsWith('..')||n.startsWith('/'))throw Error('Externo '+n);if(n.split('/').some(x=>['.cache','.git','irobopf-contexto'].includes(x)))throw Error('Privado '+n);const to=resolve(dest,n);mkdirSync(dirname(to),{recursive:true});copyFileSync(f,to);bytes+=statSync(f).size}
process.chdir(dest)
const req=createRequire(resolve(dest,'runner.cjs')), data=resolve(dest,'docs/procedencia/implementaciones/contenidos/datos'), obj=h=>resolve(data,'objetos',h)
const id='983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb', s=JSON.parse(readFileSync(obj(id)))
const get=req(resolve(dest,'.next/server/app/procedencia/[snapshot]/[id]/[revision]/route.js')).routeModule.userland.GET
const blob=req(resolve(dest,'.next/server/app/procedencia/[snapshot]/objetos/[hash]/route.js')).routeModule.userland.GET
const results={archivos:files.size,bytes,traces,casos:[],paths:[...files].map(f=>relative(root,f))}
async function call(nombre,fn,params){const r=await fn(new Request('https://local.invalid'),{params:Promise.resolve(params)});const b=Buffer.from(await r.arrayBuffer());const html=b.toString();results.casos.push({nombre,status:r.status,headers:Object.fromEntries(r.headers),size:b.length,sha256:sha(b),doctype:/^<!doctype html>/i.test(html),fin:html.endsWith('</html>'),scripts:/<script\b/i.test(html),pdf:html.includes('Original PDF'),escapado:html.includes('&lt;script&gt;alert(1)&lt;/script&gt;')});return html}
await call('sujeto',get,{snapshot:id,...s.evidencias[0].sujeto})
for(const p of s.publicos)await call(p.mime,blob,{snapshot:id,hash:p.hash})
await call('auxiliar-privado',blob,{snapshot:id,hash:s.generador})
await call('404-revision',get,{snapshot:id,id:s.evidencias[0].sujeto.id,revision:'0'.repeat(64)})
const grupo=s.paquetes.find(p=>p.prefijo===sha(s.evidencias[0].sujeto.id).slice(0,2));const entities=JSON.parse(gunzipSync(readFileSync(obj(grupo.hash))));const otra=entities.find(e=>e.entidad.id!==s.evidencias[0].sujeto.id)
await call('otra-ficha',get,{snapshot:id,id:otra.entidad.id,revision:otra.revision})
const pub=obj(s.publicos[0].hash),original=readFileSync(pub);writeFileSync(pub,'corrupto');await call('corrupto',blob,{snapshot:id,hash:s.publicos[0].hash});writeFileSync(pub,original)
renameSync(resolve(data,'objetos'),resolve(data,'objetos.retenidos'))
await call('sin-almacen-1',get,{snapshot:id,...s.evidencias[0].sujeto});await call('sin-almacen-2',blob,{snapshot:id,hash:s.publicos[0].hash})
renameSync(resolve(data,'objetos.retenidos'),resolve(data,'objetos'))
const t=structuredClone(s),ent=entities.find(e=>e.entidad.id===s.evidencias[0].sujeto.id);ent.entidad.titulo='<script>alert(1)</script>';ent.revision=JSON.parse(readFileSync(resolve(scratch,'escape.json'))).revision;
function save(b){const h=sha(b);writeFileSync(obj(h),b);return h}
const pack=gzipSync(JSON.stringify(entities)), ind=Buffer.from(JSON.stringify(entities.map(e=>({id:e.entidad.id,revision:e.revision}))));const g=t.paquetes.find(p=>p.prefijo===grupo.prefijo);g.hash=save(pack);g.bytes=pack.length;g.indice=save(ind);t.evidencias[0].sujeto.revision=ent.revision;const evil=save(Buffer.from(JSON.stringify(t)));const ids=JSON.parse(readFileSync(resolve(data,'snapshots.json')));writeFileSync(resolve(data,'snapshots.json'),JSON.stringify([...ids,evil]));
await call('escape-html-en-ruta',get,{snapshot:evil,id:ent.entidad.id,revision:ent.revision})
results.modulosFuera=Object.keys(req.cache).filter(p=>!p.startsWith(dest+'/'))
writeFileSync(resolve(scratch,'compilado.json'),JSON.stringify(results,null,2)+'\n')
