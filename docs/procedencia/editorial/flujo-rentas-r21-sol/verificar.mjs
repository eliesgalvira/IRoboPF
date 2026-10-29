import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
const p='docs/procedencia/editorial/flujo-rentas-r21-sol/'
const read=name=>JSON.parse(fs.readFileSync(p+name,'utf8'))
const hash=b=>crypto.createHash('sha256').update(b).digest('hex')
let references=0
function source(s){const b=fs.readFileSync(s.file),t=b.toString('utf8');assert.equal(hash(b),s.sha256);assert.ok(s.start>=0&&s.end>s.start&&s.end<=t.length);if(s.text!==undefined)assert.equal(t.slice(s.start,s.end),s.text);references++}
function recurse(d){if(d===null)return;if(Array.isArray(d)){d.forEach(recurse);return}if(Object.getPrototypeOf(d)!==Object.prototype)return;if(d.offsetEncoding==='utf16')source(d);Object.values(d).forEach(x=>{if(x!==null&&Object(x)===x)recurse(x)})}
const flow=read('flujo.json');assert.equal(flow.version,1);assert.equal(flow.sites.length,37);assert.equal(new Set(flow.sites.map(s=>s.siteId)).size,37)
recurse(flow);recurse(read('nodos.json'));const occ=read('ocurrencias-325.json');assert.equal(occ.length,325);assert.equal(new Set(occ.map(o=>o.occurrenceId)).size,325);recurse(occ)
const raw=JSON.parse(fs.readFileSync('docs/procedencia/correcciones/editorial-r21/rentas-fichas.json','utf8'));assert.deepEqual(new Set(raw.filter(f=>f.objetivo.siteId).map(f=>f.objetivo.siteId)),new Set(flow.sites.map(s=>s.siteId)))
const nodes=read('nodos.json'), ids=new Set(nodes.map(n=>n.id));for(const n of nodes)for(const d of n.dependsOn)assert.ok(ids.has(d))
for(const s of flow.sites)for(const e of [...s.valueDependencies.direct,...s.valueDependencies.transitive]){for(let i=1;i<e.chain.length;i++){const prev=nodes.find(n=>n.id===e.chain[i-1].nodeId);assert.ok(prev.dependsOn.includes(e.chain[i].nodeId))}}
const result={status:'passed',references,sites:37,occurrences:325,scope:'Integridad de referencias y coherencia del grafo declarado; no prueba exhaustividad semántica ni independencia.'}
fs.writeFileSync(p+'verificacion.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result))
