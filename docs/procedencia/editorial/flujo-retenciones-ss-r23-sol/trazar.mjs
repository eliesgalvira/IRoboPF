import fs from 'node:fs';
import zlib from 'node:zlib';
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const graph=JSON.parse(fs.readFileSync(out+'grafo.json','utf8'));
const occurrences=JSON.parse(fs.readFileSync(out+'ocurrencias-r21.json','utf8'));
function paths(from,to,seen=new Set()){
 if(from===to)return [[from]];if(seen.has(from))return [];
 const next=new Set(seen);next.add(from);
 return graph.edges.filter(e=>e.from===from).flatMap(e=>paths(e.to,to,next).map(p=>[from,...p]));
}
const rows=[];
for(const occurrence of occurrences.filter(x=>x.target)){
 for(const site of graph.sites){
 if(!site.siteId.startsWith('anual.ss.'))continue;
 const company=/empresarial|coste-laboral/.test(site.siteId),worker=/trabajador/.test(site.siteId);
 if(occurrence.outputProperty==='empresarial'&&worker)continue;
 if(occurrence.outputProperty==='trabajador'&&company)continue;
 const candidatePaths=paths(occurrence.target,site.root);
 if(!candidatePaths.length)continue;
 rows.push({occurrenceId:occurrence.occurrenceId,source:occurrence.source,selector:occurrence.selector,siteId:site.siteId,paths:candidatePaths.map(p=>({nodes:p,conditions:p.map(id=>graph.nodes.find(n=>n.id===id).conditions)})),side:occurrence.outputProperty,mode:occurrence.target.startsWith('S.L')?'compatible-legacy':occurrence.target==='S.tiposSolid'||occurrence.target==='S.tramos'?'canonico':'Ambos modos según ramas de rutas-ss.json',year:occurrence.source.file.includes('seguridad-social-2012-2026')?occurrence.selector:'Selector temporal conservado en expresión/propiedad de ocurrencia',exclusions:occurrence.exclusions,qualification:'Ruta candidata de valor/control; cada guarda debe satisfacerse y el resultado puede quedar insensible por cero, min/max o redondeo. No prueba causalidad por número ni aceptación fiscal.'});
 }
}
fs.writeFileSync(out+'caminos-ocurrencias.json.gz',zlib.gzipSync(JSON.stringify(rows)));
const perSite=graph.sites.map(site=>{
 const visited=new Set(),terminal=[];
 function visit(id){if(visited.has(id))return;visited.add(id);const n=graph.nodes.find(x=>x.id===id);if(!n){terminal.push(id);return;}for(const dep of n.inputs)visit(dep);}
 visit(site.root);
 return {siteId:site.siteId,root:site.root,steps:graph.nodes.filter(n=>visited.has(n.id)).map(n=>({id:n.id,property:n.output,formula:n.formula,conditions:n.conditions,source:n.source,argumentBindings:n.argumentBindings})),terminals:terminal,formalPorts:terminal.filter(x=>x.startsWith('formal:')).map(id=>({id,resolution:'No es entrada pública; argumentos en steps.argumentBindings y llamadas.json. La fórmula del llamador fija el argumento material.'})),composition:'pendiente por fronteras.json',review:'pendiente'};
});
fs.writeFileSync(out+'cadenas-por-sitio.json.gz',zlib.gzipSync(JSON.stringify(perSite)));
console.log({paths:rows.length,sites:perSite.length,qualification:'Expansión de caminos declarados; no descubrimiento automático de causalidad.'});
