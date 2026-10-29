import fs from 'node:fs'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
const out='docs/procedencia/editorial/flujo-rentas-actividad-r23-sol/'
const g=JSON.parse(fs.readFileSync(out+'grafo.json','utf8')),o=JSON.parse(fs.readFileSync(out+'ocurrencias.json','utf8'))
let references=0
function visit(document){JSON.parse(JSON.stringify(document),(key,x)=>{if(x?.file&&x?.sha256&&Number.isInteger(x.start)&&Number.isInteger(x.end)){const bytes=fs.readFileSync(x.file),text=bytes.toString('utf8');assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),x.sha256);assert(x.start>=0&&x.end>x.start&&x.end<=text.length);if(x.text)assert.equal(text.slice(x.start,x.end),x.text);references++}return x})}
visit(g);visit(o)
assert.equal(new Set(g.nodes.map(n=>n.id)).size,g.nodes.length);assert.equal(g.sites.length,20);assert.equal(g.instances.length,19);assert.equal(o.length,325)
const ids=new Set(g.nodes.map(n=>n.id));for(const e of g.edges){assert(ids.has(e.from));assert(ids.has(e.to));assert(e.reason&&e.condition&&e.propertyPath)}
function reach(id,seen=new Set()){if(seen.has(id))return seen;assert(ids.has(id));seen.add(id);for(const e of g.edges.filter(e=>e.to===id))reach(e.from,seen);return seen}
const closure=g.sites.map(s=>({siteId:s.siteId,root:s.root,reachable:[...reach(s.root)],boundaries:[...reach(s.root)].filter(id=>g.nodes.find(n=>n.id===id)?.kind==='boundary')}))
// Causalidad adversa estructural: no puede aparecer colegio500 en cadena del íntegro.
assert(!reach('w.I').has('w.AE'));assert(reach('w.N').has('w.AE'));assert(!reach('h.total').has('h.age'));assert(!reach('a.income').has('a.reduction'));assert(!reach('a.expenses').has('a.saldo'))
fs.writeFileSync(out+'verificacion.json',JSON.stringify({references,closure,status:'estructura y referencias correctas; semántica candidata pendiente de revisión'},null,2));console.log(JSON.stringify({references,sites:closure.length}))
