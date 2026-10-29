import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve('.cache/revision-nominal-r30/ensayo');
const {verifyLinks}=await import(pathToFileURL(resolve(root,'scripts/procedencia/verificar-enlaces.mjs')));
const pp='docs/procedencia/implementaciones/contrato-nominal-r29-sol/payload.json',rp='docs/procedencia/enlaces/registro.json';
const p=readFileSync(resolve(root,pp)),r=readFileSync(resolve(root,rp));
const sha=b=>createHash('sha256').update(b).digest('hex');
const cases=[['exact',x=>x,false],['duplicado-escapado',x=>x.replace('"schemaVersion": 3','"schemaVersion": 3,"schema\\u0056ersion":3'),true],['id-vecino',x=>x.replace('inv-c24095c17f76bb198b34cf8b8d5a45ed','inv-c24095c17f76bb198b34cf8b8d5a45ee'),true],['ruta-vecina',x=>x.replace('"3",\n      "0"','"3",\n      "1"'),true],['atestacion-heredada',x=>x,true]];
const rows=[];
for(const [id,change,reject]of cases){let result,error;const raw=Buffer.from(change(p.toString()));const reg=JSON.parse(r);reg.entries[0].payload.sha256=sha(raw);if(id==='atestacion-heredada')reg.entries[0].attestation={path:'docs/procedencia/atestacion-historica.json',sha256:'a'.repeat(64)};
 try{writeFileSync(resolve(root,pp),raw);writeFileSync(resolve(root,rp),JSON.stringify(reg));try{result=await verifyLinks(root,{casRoots:[resolve('.cache/revision-nominal-r30/cas')]});}catch(e){error=String(e);}}finally{writeFileSync(resolve(root,pp),p);writeFileSync(resolve(root,rp),r);}
 rows.push({id,reject,error,result,ok:reject?!!error:!error});
}
writeFileSync('docs/procedencia/revisiones/nominal-r30-sol/casos-coordinador.json',JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify(rows.map(({id,ok,error})=>({id,ok,error}))));assert(rows.every(r=>r.ok));
