import { readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { gzipSync, gunzipSync } from 'node:zlib'
import { leerSnapshot, leerPaquete, buscar, objeto, blobPublico, directorioContenido } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/almacen.ts'
import { verificar, verificarContenido } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/scripts/procedencia/contenido-verificar.mjs'
import { verificarRastroGenerado } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/scripts/procedencia/rastro-verificar.mjs'
import { hash } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/verificador.ts'
import { responderObjeto } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/lib/procedencia/http.ts'
import { GET } from '/home/elies/.t3/worktrees/IRoboPF/t3-dd9694a5/app/procedencia/[snapshot]/[id]/[revision]/route.ts'
const scratch=resolve('.cache/revision-publicacion'); const v1='8787155f02f4d8712648028532d966ab95c13e193ea36474f2fe2545516790e3'; const v2='efcc7f1395591bcd21090931860b8a969468233fa5f5066847d96669c4bbc2f6';
const results=[]; function record(name,fn){try{const value=fn();results.push({name,value})}catch(e){results.push({name,error:String(e)})}}
for(const id of [v1,v2]) record('verificar '+id,()=>verificar(id));
record('puerta actual',()=>verificarRastroGenerado());
const s=leerSnapshot(v2); const e=s.evidencias[0];
record('ids y catalogo',()=>{const ids=s.paquetes.flatMap(p=>leerPaquete(s,p.prefijo).map(x=>x.entidad.id));return {cantidad:ids.length,unicos:new Set(ids).size,catalogo:JSON.parse(objeto(directorioContenido,s.catalogo)).length,estado:e}});
for(const [snapshot,id,revision] of [[v2,e.sujeto.id,e.sujeto.revision],...s.publicos.map(p=>[v2,'objetos',p.hash]),[v2,'objetos',s.generador]]){const response=await GET(new Request('http://local'),{params:Promise.resolve({snapshot,id,revision})});const body=await response.text();results.push({name:'GET real',snapshot,id,revision,status:response.status,headers:Object.fromEntries(response.headers),documentos:body.includes('Original PDF'),estados:body.includes('trust-indeterminate')})}
record('ruta especifica presente',()=>existsSync('app/procedencia/[snapshot]/objetos/[hash]/route.ts'));
for(const p of s.publicos)record('helper '+p.mime,()=>{const r=responderObjeto(v2,p.hash);return {status:r.status,headers:Object.fromEntries(r.headers),bytes:blobPublico(v2,p.hash).bytes.length}});
record('privado helper',()=>responderObjeto(v2,s.generador).status);
const measures=[];for(const id of [v2,v2,v1,v2,v2]){const start=performance.now();const count=buscar(id,'Madrid').length;measures.push({snapshot:id,ms:performance.now()-start,count,rss:process.memoryUsage().rss})}results.push({name:'secuencia mismo proceso (tras verificador)',value:measures});
const copy=resolve(scratch,'cas');cpSync(directorioContenido,copy,{recursive:true});
record('cache tras corrupcion persistente',()=>{buscar(v2,'Madrid','','',copy);const path=resolve(copy,'objetos',s.busqueda);const bytes=readFileSync(path);writeFileSync(path,'corrupto');try{return buscar(v2,'Madrid','','',copy)}finally{writeFileSync(path,bytes)}});
record('ausente manifiesto',()=>{const c=structuredClone(s);c.evidencias[0].manifiesto='a'.repeat(64);return verificarContenido(c,copy)});
record('corrupto original',()=>{const path=resolve(copy,'objetos',s.publicos[0].hash);const bytes=readFileSync(path);writeFileSync(path,'corrupto');try{return {http:responderObjeto(v2,s.publicos[0].hash,copy).status}}finally{writeFileSync(path,bytes)}});
function guardar(bytes){const h=hash(bytes);writeFileSync(resolve(copy,'objetos',h),bytes);return h}
record('indice rehasheado titulo falso',()=>{const c=structuredClone(s);const rows=JSON.parse(gunzipSync(objeto(copy,s.busqueda)));rows[0].titulo='Falso';c.busqueda=guardar(gzipSync(Buffer.from(JSON.stringify(rows))));return verificarContenido(c,copy)});
record('recibo rehasheado sujeto falso',()=>{const c=structuredClone(s);c.evidencias[0].sujeto.id='inv-falso';return verificarContenido(c,copy)});
record('evidencias vacias rehash snapshot',()=>{const c=structuredClone(s);c.evidencias=[];const id=guardar(Buffer.from(JSON.stringify(c)));writeFileSync(resolve(copy,'snapshots.json'),JSON.stringify([id]));return {id,result:verificar(id,copy)}});
writeFileSync(resolve(scratch,'resultados.json'),JSON.stringify(results,null,2));process.stdout.write(JSON.stringify(results,null,2)+'\n');
