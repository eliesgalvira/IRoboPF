import assert from 'node:assert/strict'
import {writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const phase=process.env.IRPF_MULTIPLICIDAD_ETAPA
assert.ok(phase==='antes'||phase==='despues'||phase==='despues-url'||phase==='despues-acotado')
const root=resolve('.cache/multiplicidad-r27-sol',phase)
const out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol',phase)
process.chdir(root)
const {generar}=await import(root+'/scripts/procedencia/contenido-generar.mjs')
const {prepararEntrada}=await import(root+'/scripts/procedencia/evidencia-contenido.mjs')
const {publicar}=await import(root+'/scripts/procedencia/contenido-publicar.mjs')
const {verificarContenido}=await import(root+'/scripts/procedencia/contenido-verificar.mjs')
const {leerSnapshot}=await import(root+'/lib/procedencia/almacen.ts')
const start=performance.now()
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
let stage='generar'
try {
 const generated=generar(root,store)
 stage='prepararEntrada'
 const entry=prepararEntrada(root,generated.snapshot)
 writeFileSync(out+'/entrada.json',JSON.stringify(entry,null,2)+'\n')
 stage='publicar: coordinador → evidencia → publicador'
 const result=await publicar(root,entry,store,store)
 stage='verificarContenido'
 const snapshot=leerSnapshot(result.snapshot,store)
 verificarContenido(snapshot,store)
 assert.equal(snapshot.evidencias.length,phase==='despues-acotado'?228:264)
 for(const evidence of snapshot.evidencias){
  assert.equal(evidence.revisionBinding,'accepted-limited')
  assert.equal(evidence.aceptacionFiscalCompleta,false)
 }
 stage='GET importados'
 const {GET:ficha}=await import(root+'/app/procedencia/[snapshot]/[id]/[revision]/route.ts')
 const {GET:objeto}=await import(root+'/app/procedencia/[snapshot]/objetos/[hash]/route.ts')
 for(const e of snapshot.evidencias){
  const r=await ficha(new Request('http://localhost/'),{params:Promise.resolve({snapshot:result.snapshot,...e.sujeto})})
  assert.equal(r.status,200)
  const html=await r.text()
  const expected=snapshot.evidencias.filter((x)=>x.sujeto.id===e.sujeto.id)
  for(const x of expected) assert.ok(html.includes(x.payload),x.payload)
  assert.equal((html.match(/<dt>Aceptación fiscal completa<\/dt>/g)??[]).length,expected.length)
  assert.equal((html.match(/<dd>false<\/dd>/g)??[]).length,expected.length)
  assert.ok(html.includes('Ocurrencia técnica versionada; no es una regla fiscal aceptada.'))
 }
 for(const p of snapshot.publicos){
  const r=await objeto(new Request('http://localhost/'),{params:Promise.resolve({snapshot:result.snapshot,hash:p.hash})})
  assert.equal(r.status,200)
 }
 writeFileSync(out+'/recorrido.json',JSON.stringify({stage,result,milliseconds:performance.now()-start,success:true},null,2)+'\n')
} catch(error){
 const result={stage,error:String(error),stack:error.stack,milliseconds:performance.now()-start,success:false,peakRss:process.resourceUsage().maxRSS}
 writeFileSync(out+'/recorrido.json',JSON.stringify(result,null,2)+'\n')
 console.error(result)
 process.exitCode=1
}
