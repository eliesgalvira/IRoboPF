import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const s=resolve('.cache/revision-nominal-r32'),view=resolve(s,'ensayo'),out=resolve('docs/procedencia/revisiones/nominal-r32-sol');
const {verifyLinks}=await import(pathToFileURL(resolve(view,'scripts/procedencia/verificar-enlaces.mjs')));
const cases=JSON.parse(readFileSync(resolve(out,'casos-node.json'))).rows;
const rows=[];
for(const c of cases){
 const saved=new Map(c.overrides.map(({path})=>[path,existsSync(resolve(view,path))?readFileSync(resolve(view,path)):null]));
 // Out-of-contract path is handled by schema before dereferencing; no write outside view.
 assert(c.overrides.every(({path})=>resolve(view,path).startsWith(view+'/')));
 let result,error;
 try{for(const {path,local}of c.overrides){if(saved.get(path)!==null)writeFileSync(resolve(view,path),readFileSync(local));}
 try{result=await verifyLinks(view,{casRoots:[resolve(s,'cas')]});}catch(e){error=String(e);}
 }finally{for(const [path,raw]of saved)if(raw!==null)writeFileSync(resolve(view,path),raw);}
 const environmentError=!!error&&/ENOENT|MODULE_NOT_FOUND|command not found|not installed|Timed out|ETIMEDOUT|Cannot find|out of memory/i.test(error);
 const ok=!environmentError&&(c.expected==='reject'?!!error:!error);
 rows.push({id:c.id,expected:c.expected,ok,environmentError,error,result});
 writeFileSync(resolve(out,'casos-coordinador.json'),JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify({id:c.id,ok,error:error?.slice(0,220)}));
 if(environmentError)throw new Error('Fallo de entorno; no es rechazo válido: '+error);
}
assert(rows.every(r=>r.ok));
