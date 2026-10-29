import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const view=resolve('.cache/revision-nominal-r30/ensayo');
const {verificarNominalPublicado:verify}=await import(pathToFileURL(resolve(view,'scripts/procedencia/ambito-publicado.mjs')));
const prefix='docs/procedencia/implementaciones/contrato-nominal-r29-sol/';
const closure=JSON.parse(readFileSync('schemas/procedencia/nominal-dependencies.schema.json')).const;
const hash=x=>createHash('sha256').update(x).digest('hex');
const rows=[];
for(const which of ['executableScope','legalReview']){
 const p=JSON.parse(readFileSync(prefix+'payload.json')),a=JSON.parse(readFileSync(prefix+'ambito.json'));
 if(which==='executableScope')p.executableScope.unexpected='campo fuera del schema';
 else{p.legalReview.unexpected='campo fuera del schema';a.decision=p.legalReview;}
 const objects=new Map(),deps=[];
 const add=(path,raw)=>{const sha256=hash(raw);objects.set(sha256,raw);deps.push({path,sha256});return {path,sha256};};
 p.executableScope.sha256=hash(Buffer.from(JSON.stringify(a)));
 add(p.executableScope.path,Buffer.from(JSON.stringify(a)));
 const payload=add(prefix+'payload.json',Buffer.from(JSON.stringify(p)));
 add(p.legalReview.decisions.path,readFileSync(p.legalReview.decisions.path));
 for(const d of closure.documents)add(d.path,readFileSync(d.path));
 for(const b of closure.blobs)objects.set(b.sha256,readFileSync(resolve('.cache/revision-nominal-r30/cas/sha256',b.sha256)));
 objects.set(p.source.sha256,readFileSync(p.source.file));
 add('docs/procedencia/enlaces/registro.json',Buffer.from(JSON.stringify({schemaVersion:1,entries:[{payload,attestation:null}]})));
 let result,error;try{result=verify(payload.sha256,p.itemId,deps,h=>objects.get(h));}catch(e){error=String(e);}
 rows.push({which,payloadSha256:payload.sha256,scopeSha256:p.executableScope.sha256,expected:'reject-extra-fields',ok:!!error,result,error});
 writeFileSync(resolve('.cache/revision-nominal-r30',which+'-mutante.json'),JSON.stringify(p));
}
writeFileSync('docs/procedencia/revisiones/nominal-r30-sol/casos-schema.json',JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify(rows));assert(rows.every(r=>r.ok),'El consumidor nominal debe rechazar campos extra del payload cerrado');
