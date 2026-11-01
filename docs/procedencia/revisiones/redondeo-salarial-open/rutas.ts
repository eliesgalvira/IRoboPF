import {readFileSync,writeFileSync} from 'node:fs'
import {GET} from './app/procedencia/[snapshot]/[id]/[revision]/route'
import catalogo from './lib/procedencia/rastro-generado.json'
import {leerSnapshot} from './lib/procedencia/almacen'
const nuevo=catalogo.actual.versiones.snapshot
const viejo='d758a1f8ac67587d2eae689da158ac8baa28b03df16c462069f4014d4af588a1'
const resultados=[]
for(const b of catalogo.bindings.filter(b=>b.siteId.startsWith('anual.explicito.'))) {
 const response=await GET(new Request('http://localhost/'),{params:Promise.resolve({snapshot:nuevo,id:b.sujeto.id,revision:b.sujeto.revision})})
 const texto=await response.text(); if(response.status!==200) throw new Error('Ruta '+b.siteId+': '+response.status)
 resultados.push({siteId:b.siteId,status:response.status,bytes:texto.length})
}
writeFileSync(process.argv[2],JSON.stringify({nuevo:{version:leerSnapshot(nuevo)?.version},historico:{version:leerSnapshot(viejo)?.version},rutas:resultados},null,2))
