import {Sources,ts,sha} from './flujo-ast.mjs'
export function validate(graph,sources=new Sources()){
  if(graph.completeRuleAcceptance!==false||graph.wiringAllowed!==false||graph.review!=='pending-independent')throw Error('Cambio de estado no autorizado')
  const ports=new Map(),edges=new Map()
  for(const p of graph.ports){if(ports.has(p.id))throw Error('Puerto duplicado');ports.set(p.id,p);if(!p.source||!p.symbol||!p.property||!p.instance||!p.unit||!['value','selection','admission'].includes(p.role))throw Error('Puerto incompleto');const node=sources.exact(p.source);if(p.terminal==='literal'&&!ts.isNumericLiteral(node)&&!ts.isStringLiteral(node)&&![ts.SyntaxKind.TrueKeyword,ts.SyntaxKind.FalseKeyword,ts.SyntaxKind.NullKeyword].includes(node.kind)&&node.getText()!=='undefined')throw Error('Literal no demostrado');if(p.terminal==='primitive'&&(!p.contract||p.source.file!=='lib/dominio/dinero/importe-monetario.ts'))throw Error('Primitiva no declarada');if(p.terminal==='public-input'&&!ts.isParameter(sources.declaration(node)))throw Error('Entrada pública no acreditada');if(!['literal','public-input','primitive',null].includes(p.terminal))throw Error('Terminal inválido')}
  for(const e of graph.edges){
    if(edges.has(e.id))throw Error('Relación duplicada');edges.set(e.id,e)
    const from=ports.get(e.from),to=ports.get(e.to);if(!from||!to)throw Error('Referencia inexistente')
    if(!['value','selection','admission'].includes(e.role)||!e.condition||!e.evidence?.length)throw Error('Relación sin evidencia/condición')
    if(e.review!=='pending-independent')throw Error('Relación promovida')
    for(const r of e.evidence)sources.exact(r)
    if(e.role==='value'&&from.unit!==to.unit&&!e.conversion)throw Error('Unidades incompatibles')
    if(e.conversion==='centimos-a-EUR'&&(from.unit!=='centimos'||to.unit!=='EUR'))throw Error('Conversión centimos/EUR incompatible');if(e.conversion==='EUR-a-centimos'&&(from.unit!=='EUR'||to.unit!=='centimos'))throw Error('Conversión EUR/centimos incompatible');
    if(e.conversion&&!['centimos-a-EUR','EUR-a-centimos','decimal-presentation','numeric-operation'].includes(e.conversion))throw Error('Conversión no admitida')
    if(e.binding){const call=sources.exact(e.binding.call),argument=sources.exact(e.binding.argument);if(!ts.isCallExpression(call)||call.arguments[e.binding.index]!==argument)throw Error('Binding de otra llamada')}
  }
  for(const s of graph.sites){if(!ports.has(s.output))throw Error('Salida inexistente');const c=closure(graph,s.output);if(s.closed&&c.unresolved.length)throw Error('Cierre declarado con unresolved')}
  return true
}
export function closure(graph,root){
  const ports=new Map(graph.ports.map(p=>[p.id,p])),incoming=new Map(),visited=new Set(),unresolved=[],terminals=[],relations=[]
  for(const e of graph.edges){const a=incoming.get(e.to)??[];a.push(e);incoming.set(e.to,a)}
  function walk(id,stack){if(stack.has(id)){unresolved.push({port:id,reason:'ciclo no resuelto'});return}if(visited.has(id))return;visited.add(id);const p=ports.get(id);if(!p){unresolved.push({port:id,reason:'referencia inexistente'});return}if(p.unresolved)unresolved.push({port:id,reason:p.unresolved});if(p.terminal){terminals.push(id);return}const es=incoming.get(id)??[];if(!es.length)unresolved.push({port:id,reason:'productor sin contrato'});const next=new Set(stack);next.add(id);for(const e of es){relations.push(e.id);walk(e.from,next)}}
  walk(root,new Set());return {ports:[...visited].sort(),relations:relations.sort(),terminals:terminals.sort(),unresolved,closed:unresolved.length===0}
}
export const identity=value=>sha(JSON.stringify(value))
