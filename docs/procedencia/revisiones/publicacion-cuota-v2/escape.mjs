import {writeFileSync} from 'node:fs'
import {leerSnapshot,leerPaquete} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/procedencia/almacen.ts'
import {bytesEntidad,hash} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/procedencia/verificador.ts'
const s=leerSnapshot('983a06755162fedd569a8bb6989714463e00903506a614659b94eed1d43dd1eb'),id=s.evidencias[0].sujeto.id
const e=leerPaquete(s,hash(id).slice(0,2)).find(x=>x.entidad.id===id).entidad
e.titulo='<script>alert(1)</script>'
writeFileSync('.cache/publicacion-cuota-v2/escape.json',JSON.stringify({revision:hash(bytesEntidad(e))}))
