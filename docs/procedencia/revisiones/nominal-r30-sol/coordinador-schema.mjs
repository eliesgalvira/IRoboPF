import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const view=resolve('.cache/revision-nominal-r30/ensayo');
const {verifyLinks}=await import(pathToFileURL(resolve(view,'scripts/procedencia/verificar-enlaces.mjs')));
const pp='docs/procedencia/implementaciones/contrato-nominal-r29-sol/payload.json',ap='docs/procedencia/implementaciones/contrato-nominal-r29-sol/ambito.json',rp='docs/procedencia/enlaces/registro.json';
const saved=new Map([pp,ap,rp].map(p=>[p,readFileSync(resolve(view,p))]));const rows=[];
for(const name of ['executableScope','legalReview']){const raw=readFileSync(resolve('.cache/revision-nominal-r30',name+'-mutante.json'));const p=JSON.parse(raw),a=JSON.parse(saved.get(ap)),reg=JSON.parse(saved.get(rp));if(name==='legalReview')a.decision=p.legalReview;
 reg.entries[0].payload.sha256=createHash('sha256').update(raw).digest('hex');let error;
 try{writeFileSync(resolve(view,pp),raw);writeFileSync(resolve(view,ap),JSON.stringify(a));writeFileSync(resolve(view,rp),JSON.stringify(reg));try{await verifyLinks(view,{casRoots:[resolve('.cache/revision-nominal-r30/cas')]});}catch(e){error=String(e);}}finally{for(const [path,bytes]of saved)writeFileSync(resolve(view,path),bytes);}
 rows.push({name,expected:'reject',error,ok:!!error});}
writeFileSync('docs/procedencia/revisiones/nominal-r30-sol/coordinador-schema.json',JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify(rows));assert(rows.every(r=>r.ok));
