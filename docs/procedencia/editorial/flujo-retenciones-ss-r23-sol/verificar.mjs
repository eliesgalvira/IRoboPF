import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const data=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const ids=new Set(data.nodes.map(x=>x.id));assert.equal(ids.size,data.nodes.length);
assert.equal(data.sites.length,17);assert.equal(new Set(data.sites.map(x=>x.siteId)).size,17);
let checked=0;
function location(s){const text=fs.readFileSync(s.file,'utf8');assert.equal(digest(text),s.sha256,s.file);assert.equal(s.offsetEncoding,'utf16');assert.ok(s.end>s.start);assert.equal(text.slice(s.start,s.end),s.text);checked++;}
for(const n of data.nodes){location(n.source);assert.ok(n.formula);for(const id of n.inputs)assert.ok(ids.has(id)||/^(entrada|literal|primitiva|frontera|formal):/.test(id),id);}
for(const site of data.sites){assert.ok(ids.has(site.root));for(const s of site.currentSource)location(s);assert.equal(site.review,'pendiente');assert.equal(site.legalAcceptance,false);}
for(const x of JSON.parse(fs.readFileSync(out+'ocurrencias-r21.json','utf8'))){location(x.source);if(x.status==='resuelta-candidata')assert.ok(ids.has(x.target));else assert.equal(x.target,null);}
for(const x of JSON.parse(fs.readFileSync(out+'llamadas.json','utf8'))){location(x.call);location(x.calleeSource);}
for(const x of JSON.parse(fs.readFileSync(out+'literales.json','utf8')))location(x);
for(const x of JSON.parse(fs.readFileSync(out+'fronteras.json','utf8')))assert.equal(digest(fs.readFileSync(x.file)),x.sourceSha256);
// Rechaza autorreferencias, ciclos y nodos internos sin entrada explícita.
function walk(id,ancestors=new Set()) {if(!ids.has(id))return;assert.ok(!ancestors.has(id),'ciclo '+id);const next=new Set(ancestors);next.add(id);const n=data.nodes.find(x=>x.id===id);assert.ok(n.inputs.length,'nodo terminal oculto '+id);for(const dep of n.inputs)walk(dep,next);}
for(const site of data.sites)walk(site.root);
fs.writeFileSync(out+'verificacion.json',JSON.stringify({locations:checked,head:data.head,status:'passed',limits:'Verifica localizaciones, referencias y ausencia de ciclos. No descubre omisiones semánticas ni sustituye revisión independiente.'},null,2));console.log({locations:checked,status:'passed'});
const {createRequire}=await import('node:module');
const require=createRequire('/home/elies/Repos/IRoboPF/package.json');
const Ajv=require('ajv');
const validate=new Ajv({allErrors:true}).compile(JSON.parse(fs.readFileSync(out+'grafo.schema.json','utf8')));
assert.ok(validate(data),JSON.stringify(validate.errors));
for(const altered of [{...data,head:'0'.repeat(40)},{...data,sites:data.sites.slice(1)},{...data,sites:data.sites.map((x,i)=>i?x:{...x,legalAcceptance:true})}])assert.equal(validate(altered),false);
console.log({schema:'passed',adversarialRejections:3});
for(const n of data.nodes){if(n.inputs.some(x=>x.startsWith('formal:')))assert.ok(n.argumentBindings.length,'Formal interno sin llamada: '+n.id);}
