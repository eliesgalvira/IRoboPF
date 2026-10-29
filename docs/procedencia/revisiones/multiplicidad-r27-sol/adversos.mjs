import assert from 'node:assert/strict'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const home=process.cwd(),out=resolve('docs/procedencia/revisiones/multiplicidad-r27-sol')
const root=resolve('.cache/multiplicidad-r27-sol/despues-acotado')
process.chdir(root)
const store=resolve('docs/procedencia/implementaciones/contenidos/datos')
const {leerSnapshot,leerPaquete,objeto}=await import(root+'/lib/procedencia/almacen.ts')
const {verificarContenido}=await import(root+'/scripts/procedencia/contenido-verificar.mjs')
const {bytesEntidad}=await import(root+'/lib/procedencia/verificador.ts')
const {comprobarEntrada}=await import(root+'/scripts/procedencia/evidencia-contenido.mjs')
const id=JSON.parse(readFileSync(out+'/despues-acotado/comprobacion-get.json')).result.snapshot
const s=leerSnapshot(id,store),entry=JSON.parse(readFileSync(out+'/despues-acotado/entrada.json'))
const rows=s.paquetes.flatMap(p=>leerPaquete(s,p.prefijo,store))
const doc=rows.find(r=>r.entidad.tipo==='Document').entidad
const good='https://www.borm.es/services/anuncio/ano/2022/numero/4846/pdf?id=811060'
assert.ok(bytesEntidad({...doc,url:good}).includes(good))
const bad=[good+'&id=2',good+'&token=secreto',good+'#x',good+'\n',good+'\r\n',good+'\u2028',good+'\u0000',good+' ',good.replace('id=','%69d='),good.replace('id=','ID='),good.replace('811060','%38'+'11060'),good.replace('811060','+811060'),good.replace('811060','0811060'),good.replace('811060','1e5'),good.replace('811060','-1'),good.replace('811060','0'),good.replace('811060','1234567890123'),good.replace('2022','2022%2f'),good.replace('www.borm.es','www.borm.es.evil.example'),good.replace('www.borm.es','www.borm.es@evil.example'),good.replace('www.borm.es','u:p@www.borm.es'),good.replace('www.borm.es','www.borm.es:443'),good.replace('www.borm.es','WWW.BORM.ES'),good.replace('https:','http:'),good.replace('/pdf?','/pdf/?'),good.replace('4846','0'),good.replace('/services','/x/../services'),good.replace('811060','811060?secret=1'),good.replace('811060','811060;token=1')]
const urls=bad.map(url=>{assert.throws(()=>bytesEntidad({...doc,url}));return {url,rechazado:true}})
const persistent=[]
for(const d of entry.dependencias.filter(d=>d.path.includes('/fixtures/sha256/')||d.path.endsWith('revisores.json')||d.path=== 'lib/calculo-irpf.ts').slice(0,24)){
 const path=resolve(root,d.path),bytes=readFileSync(path)
 try{writeFileSync(path,Buffer.concat([bytes,Buffer.from('\nCAMBIO PERSISTENTE')]))
 assert.throws(()=>comprobarEntrada(root,entry));persistent.push({path:d.path,rechazado:true})}
 finally{writeFileSync(path,bytes)}
}
const historyStore=resolve(home,'docs/procedencia/implementaciones/contenidos/datos')
const history=[]
for(const h of JSON.parse(readFileSync(historyStore+'/snapshots.json'))){
 const snap=leerSnapshot(h,historyStore);verificarContenido(snap,historyStore)
 const receiptVersions=snap.version===2?[...new Set(snap.evidencias.map(e=>JSON.parse(objeto(historyStore,e.recibo)).version))]:[]
 history.push({snapshot:h,version:snap.version,receiptVersions,valid:true})
}
writeFileSync(out+'/adversos.json',JSON.stringify({urls,persistent,history,storedCodeExecuted:false},null,2)+'\n')
console.log(JSON.stringify({urls:urls.length,persistent:persistent.length,history:history.length}))
