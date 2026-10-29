import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const bytes=fs.readFileSync('docs/procedencia/inventario-datos.json.gz');
assert.equal(hash(bytes),'59bae155b45e791b1e1ec4f0003c4a3fa443c3d29bf91bb02ad931bfd797a2f7');
assert.equal(hash(fs.readFileSync('docs/procedencia/inventario.json')),'30dfbc3154494ae09eee32d1bcf005b627241051bb3531af3cb38e686dff1de7');
const entries=JSON.parse(zlib.gunzipSync(bytes,{maxOutputLength:128*1024*1024}).toString());
const literals=JSON.parse(fs.readFileSync(out+'literales.json','utf8'));
const wanted=new Set(literals.map(x=>x.file)),index=new Map();
const key=x=>JSON.stringify([x.file,x.start,x.end,x.sha256]);
for(const [name,content] of entries){if(!name.startsWith('inventario-pagina-'))continue;for(const x of JSON.parse(content)){if(wanted.has(x.source.file)&&x.layer==='syntactic')index.set(key(x.source),{occurrenceId:x.id,selector:x.path,kind:x.kind,layer:x.layer});}}
for(const x of literals){const match=index.get(key(x));x.inventory=match??null;x.inventoryStatus=match?'ocurrencia-sintactica-exacta':'token-no-inventariado-como-elemento';}
fs.writeFileSync(out+'literales.json',JSON.stringify(literals,null,2));
console.log({tokens:literals.length,indexed:literals.filter(x=>x.inventory).length,qualification:'Correspondencia exacta file/hash/rango; no arista causal por contención.'});
