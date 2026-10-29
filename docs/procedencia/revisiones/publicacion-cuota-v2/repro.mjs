import {readFileSync,writeFileSync,cpSync,renameSync} from 'node:fs'
import {resolve} from 'node:path'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
import {verificar,verificarContenido} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/scripts/procedencia/contenido-verificar.mjs'
import {leerSnapshot} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/procedencia/almacen.ts'
const root=process.cwd(), scratch=resolve(root,'.cache/publicacion-cuota-v2'), out=resolve(scratch,'resultados.json')
const base='6e210920a9063b7a7efd0730ae4ab1ac73a2141e'
const sha=b=>createHash('sha256').update(b).digest('hex')
const paths=execFileSync('git',['ls-tree','-rz','--name-only',base]).toString().split('\0').filter(Boolean)
const missing=[], sources=[]
for(const p of paths){try { const b=readFileSync(p); if(p.startsWith('app/procedencia/')||p==='next.config.mjs'||p==='components/auditoria.tsx'||p==='lib/dominio/auditoria/importes-comparables.ts'){const old=execFileSync('git',['cat-file','blob',`${base}:${p}`]);sources.push({path:p,size:b.length,sha256:sha(b),baseSha256:sha(old)})}}catch{missing.push(p)}}
const result={base,head:execFileSync('git',['rev-parse','HEAD']).toString().trim(),archivosBase:paths.length,ausentes:missing,diff:execFileSync('git',['diff',base,'--']).toString(),sources,casos:[]}
const orig=resolve(root,'docs/procedencia/implementaciones/contenidos/datos'), cas=resolve(scratch,'cas')
cpSync(orig,cas,{recursive:true})
const v1='54194f5a7ec34412ac9aa4aa27d8bcea053b1e3ca2bbda2e70ce211e4ee2d613',v2='983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb'
for(const id of [v1,v2])result.casos.push({id,resultado:verificar(id,cas)})
const s=leerSnapshot(v2,cas)
function prueba(nombre,fn){try{const r=fn();result.casos.push({nombre,aceptado:true,resultado:r})}catch(e){result.casos.push({nombre,aceptado:false,error:e.message})}writeFileSync(out,JSON.stringify(result,null,2)+'\n')}
function mutacion(nombre,fn){const t=structuredClone(s);fn(t);prueba(nombre,()=>verificarContenido(t,cas))}
mutacion('omision-total',t=>{t.evidencias=[]})
mutacion('duplicado',t=>{t.evidencias.push(t.evidencias[0])})
mutacion('sujeto-cambiado',t=>{t.evidencias[0].sujeto.revision='a'.repeat(64)})
function reciboMutado(t,fn){const old=t.evidencias[0].recibo;const r=JSON.parse(readFileSync(resolve(cas,'objetos',old)));fn(r);const b=Buffer.from(JSON.stringify(r));const h=sha(b);writeFileSync(resolve(cas,'objetos',h),b);t.evidencias[0].recibo=h;t.auxiliares=t.auxiliares.map(x=>x===old?h:x);t.dependencias=t.dependencias.map(x=>x.hash===old?{...x,hash:h,bytes:b.length}:x)}
mutacion('recibo-rehasheado-sin-estados',t=>reciboMutado(t,r=>{r.estados=[]}))
mutacion('recibo-rehasheado-sin-documentos',t=>reciboMutado(t,r=>{r.entradas=r.entradas.filter(x=>!['Document','Citation','Facsimile'].includes(x.entidad.tipo))}))
mutacion('recibo-rehasheado-grafo-falso',t=>reciboMutado(t,r=>{r.entradas[0].entidad.titulo='intruso';r.entradas[0].revision=sha(JSON.stringify(r.entradas[0].entidad))}))
const p=resolve(cas,'objetos',s.evidencias[0].manifiesto);renameSync(p,p+'.retenido')
prueba('ausencia-persistente-1',()=>verificar(v2,cas));prueba('ausencia-persistente-2',()=>verificar(v2,cas));renameSync(p+'.retenido',p)
writeFileSync(out,JSON.stringify(result,null,2)+'\n')
