import {createRequire} from 'node:module'
import {writeFileSync} from 'node:fs'
const req=createRequire(import.meta.url),{nodeFileTrace}=req('next/dist/compiled/@vercel/nft')
const root=process.cwd()
const routes=['.next/server/app/procedencia/[snapshot]/[id]/[revision]/route.js','.next/server/app/procedencia/[snapshot]/objetos/[hash]/route.js']
const r=await nodeFileTrace(routes.map(p=>root+'/'+p),{base:'/',processCwd:root})
writeFileSync('.cache/publicacion-cuota-v2/retraza.json',JSON.stringify({files:[...r.fileList],warnings:[...r.warnings].map(String)},null,2))
