import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const view=resolve('.cache/revision-nominal-r32/ensayo');
const {verificar}=await import(pathToFileURL(resolve(view,'scripts/procedencia/contenido-verificar.mjs')));
const dir=resolve('docs/procedencia/implementaciones/contenidos/datos');
const ids=JSON.parse(readFileSync(resolve(dir,'snapshots.json')));assert.equal(ids.length,44);const rows=[];
for(const id of ids){const result=verificar(id,dir);rows.push({id,result});console.log(JSON.stringify({id,result}));}
writeFileSync('docs/procedencia/revisiones/nominal-r32-sol/historicos.json',JSON.stringify({software:'fuentes conservadas de cada recibo; sin exigir software actual',rows},null,2)+'\n');
