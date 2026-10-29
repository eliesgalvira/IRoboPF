import {mkdirSync,copyFileSync,appendFileSync,writeFileSync} from 'node:fs'
import {resolve,dirname} from 'node:path'
import {leerSnapshot,directorioContenido} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/procedencia/almacen.ts'
import {FUENTES_EXPLICACION,verificarSoftwareExplicacion} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/scripts/procedencia/explicacion-version.mjs'
const s=leerSnapshot('983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb',directorioContenido),root=process.cwd(),tmp=resolve(root,'.cache/publicacion-cuota-v2/software')
verificarSoftwareExplicacion(s,root)
for(const f of [...FUENTES_EXPLICACION,'scripts/procedencia/contenido-generar.mjs']){const p=resolve(tmp,f);mkdirSync(dirname(p),{recursive:true});copyFileSync(resolve(root,f),p)}
verificarSoftwareExplicacion(s,tmp);appendFileSync(resolve(tmp,'next.config.mjs'),'\n// cambio adverso\n')
let error=null;try{verificarSoftwareExplicacion(s,tmp)}catch(e){error=e.message}
if(!error)throw Error('No detecta config')
writeFileSync('.cache/publicacion-cuota-v2/puerta.json',JSON.stringify({actual:'correcta',configModificada:error},null,2))
