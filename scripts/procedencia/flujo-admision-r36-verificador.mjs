import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
const require=createRequire(process.env.IROBOPF_DEPENDENCIES_PACKAGE??new URL('../../package.json',import.meta.url))
const Ajv=require('ajv')
const ts=require('typescript')
const siteIds=[...['base','exceso','empresarial-ordinaria','trabajador-ordinaria','mei-empresarial','mei-trabajador','solidaridad-empresarial','solidaridad-trabajador','empresarial-total','trabajador-total','coste-laboral'].map(s=>'anual.ss.'+s),...['base','cuota','tipo','anual'].map(s=>'anual.retencion.'+s),'anual.pagos.retenciones','anual.pagos.cuenta']
const builtins=new Set(["undefined","Infinity","NaN","Number","String","Object","Array","Math","Map","Set","Date","Decimal","Match","Option","Effect","DateTime","Error","LiquidacionIrpfAnual","CompatibilidadSalarioLegacy","Schema","EffectArray","medirAuditoriaSync","registrarTiempoAgregadoAuditoria","tiempoAuditoriaMs","validarDerechosMinimos","validarRentasAnualesDerechos","hayAlimentosPropiosSinMinimo"])
let schemaValidator
const allowedOps=new Set(['literal','json','builtin','local','global','boundary','regex','get','array','object','spread','binary','unary','choose','template','lambda','yield','call','new','run','pipe','bind','return','evaluate','if','for','continue','throw'])
/** Capa estructural y causal separada de los pines; no otorga aceptación. */
export function verifyCompleteAdmission(fragment, validateSchema) {
 if(!validateSchema){schemaValidator??=new Ajv({allErrors:true,strict:false}).compile(JSON.parse(readFileSync(new URL('../../schemas/procedencia/flujo/admision-r36.schema.json',import.meta.url))));validateSchema=schemaValidator}
 if(!validateSchema(fragment))throw Error('Schema R36 inválido')
 const documents=new Map()
 function exactAnchor(a,sources) {
  if(!sources.some(s=>s.path===a.path&&s.sha256===a.sha256)||a.path.startsWith('/')||a.path.split('/').includes('..'))throw Error('Ancla no vinculada a fuente')
  if(!documents.has(a.path)) {
   const text=readFileSync(new URL('../../'+a.path,import.meta.url),'utf8')
   const sha256=createHash('sha256').update(text).digest('hex'),spans=new Set()
   const sf=ts.createSourceFile(a.path,text,ts.ScriptTarget.Latest,true)
   function visit(n){spans.add(n.getStart(sf)+':'+n.end);ts.forEachChild(n,visit)}visit(sf)
   documents.set(a.path,{text,sha256,spans})
  }
  const doc=documents.get(a.path)
  if(doc.sha256!==a.sha256||a.start<0||a.end<=a.start||a.end>doc.text.length||!doc.spans.has(a.start+':'+a.end))throw Error('Ancla sin nodo exacto en fuente fijada')
 }
 const graph=fragment.graph,ids=new Map(),anchors=new Map(graph.anchors.map(a=>[a.id,a])),definitions=new Set(graph.definitions.map(d=>d.key)),contracts=new Map(fragment.boundaries.map(b=>[b.name,b]))
 if(anchors.size!==graph.anchors.length||definitions.size!==graph.definitions.length||contracts.size!==fragment.boundaries.length)throw Error('Identidad repetida')
 function walk(value){
  if(value===null||Object(value)!==value)return
  if(value.op){
   if(value.op==='builtin'&&!builtins.has(value.name))throw Error('Primitiva desconocida')
   if(value.op==='new'&&(value.callee.op!=='builtin'||!['Decimal','Map','Set','Date','Error'].includes(value.callee.name)))throw Error('Constructor fuera del contrato')
   if(!allowedOps.has(value.op))throw Error('Operador desconocido')
   if(ids.has(value.id)||!anchors.has(value.id))throw Error('ID duplicado o sin ancla: '+value.id)
   ids.set(value.id,value)
   const a=anchors.get(value.id)
   exactAnchor(a,graph.sources)
   if(a.start<0||a.end<=a.start||!graph.sources.some(s=>s.path===a.path&&s.sha256===a.sha256))throw Error('Ancla no vinculada')
   if(value.op==='global'&&!definitions.has(value.key))throw Error('Referencia global sin definición')
   if(value.op==='boundary'&&!contracts.has(value.name))throw Error('Frontera sin contrato')
   if(value.op==='json'||value.op==='literal')return
  }
  for(const x of Object.values(value))if(Array.isArray(x))x.forEach(walk);else if(x!==null&&Object(x)===x)walk(x)
 }
 graph.definitions.forEach(d=>walk(d.value));graph.roots.forEach(r=>walk(r.value))
 const boundNames=p=>p.name?[p.name]:p.fields?p.fields.flatMap(f=>boundNames(f.binding)):p.items.flatMap(boundNames)
 function patternFallbacks(p,scope){if(p.fields)for(const f of p.fields){if(f.fallback)expression(f.fallback,scope);patternFallbacks(f.binding,scope)}else if(p.items)p.items.forEach(p=>patternFallbacks(p,scope))}
 function expression(n,scope){
  if(n.op==='local'){if(!scope.has(n.name))throw Error('Local sin binding: '+n.name);return}
  if(['literal','json','builtin','global','boundary','regex'].includes(n.op))return
  if(n.op==='lambda'){const child=new Set(scope);for(const p of n.params){if(p.fallback)expression(p.fallback,child);patternFallbacks(p.binding,child);boundNames(p.binding).forEach(name=>child.add(name))}block(n.body,child,0);return}
  if(!['get','array','object','spread','binary','unary','choose','template','yield','call','new','run','pipe'].includes(n.op))throw Error('Sentencia en posición de expresión')
  for(const key of ['target','key','left','right','condition','yes','no','value','callee'])if(n[key]?.op)expression(n[key],scope)
  for(const key of ['items','args','steps'])if(n[key])n[key].forEach(x=>expression(x,scope))
  if(n.fields)n.fields.forEach(f=>expression(f.value??f.spread,scope))
  if(n.parts)n.parts.forEach(p=>expression(p.value,scope))
 }
 function block(body,parent,depth){const scope=new Set(parent);for(const n of body){
  if(n.op==='bind'){const names=boundNames(n.binding);expression(n.value,n.value.op==='lambda'?new Set([...scope,...names]):scope);patternFallbacks(n.binding,scope);names.forEach(name=>scope.add(name))}
  else if(['return','evaluate','throw'].includes(n.op))expression(n.value,scope)
  else if(n.op==='if'){expression(n.condition,scope);block(n.yes,scope,depth);block(n.no,scope,depth)}
  else if(n.op==='for'){expression(n.collection,scope);patternFallbacks(n.binding,scope);block(n.body,new Set([...scope,...boundNames(n.binding)]),depth+1)}
  else if(n.op!=='continue'||depth===0)throw Error('Sentencia fuera de bloque/recorrido')
 }}
 graph.definitions.forEach(d=>expression(d.value,new Set()));graph.roots.forEach(r=>expression(r.value,new Set()))
 if(ids.size!==anchors.size)throw Error('Anclas sobrantes')
 for(const b of fragment.boundaries){
  for(const o of b.outputs){const unit=o.kind==='Decimal'?'EUR':o.kind==='number'?'centimos':o.kind==='decimal-string'?'percent':'structural';if(o.unit!==unit)throw Error('Unidad de salida incompatible con propiedad '+b.name)}
  for(const input of b.inputs){const unit=input.kind==='Decimal'?'EUR':input.kind==='year'?'year':input.kind==='converter'?'EUR/centimos':input.path.at(-1)==='edadContribuyente'?'years':'structural';if(input.unit!==unit)throw Error('Unidad de entrada incompatible con propiedad '+b.name)}
  for(const i of b.instances){
  const ref=ids.get(i.node),call=ids.get(i.call)
  if((b.name==='LiquidacionIrpfAnual.liquidar'?ref?.op!=='call':ref?.op!=='boundary'||ref.name!==b.name)||call?.op!=='call'||JSON.stringify(i.operands)!==JSON.stringify(call.args.map(a=>a.id)))throw Error('Instancia sin operandos de llamada')
  if(JSON.stringify(i.transport)!==JSON.stringify(call.args))throw Error('Transporte por propiedad/instancia distinto')
  if(JSON.stringify(i.outputs)!==JSON.stringify(b.outputs.map(o=>({id:ref.id+'/'+o.path.join('.'),...o}))))throw Error('Propiedades de salida desvinculadas')
  }
 }
 for(const n of ids.values())if(n.op==='boundary'&&!contracts.get(n.name).instances.some(i=>i.node===n.id))throw Error('Uso de frontera sin instancia')
 const rightsIds=new Set(),rightsAnchors=new Map(fragment.rights.anchors.map(a=>[a.id,a])),rightsPrograms=new Set(fragment.rights.programs.map(p=>p.id))
 function checkRights(value){if(!value||Object(value)!==value)return;if(value.op){if(rightsIds.has(value.id)||!rightsAnchors.has(value.id))throw Error('ID de derechos repetido o sin ancla');rightsIds.add(value.id);const a=rightsAnchors.get(value.id);exactAnchor(a,fragment.rights.sources);if(value.op==='invoke'&&!rightsPrograms.has(value.name)&&!['Number','String','Math.min','rechazar'].includes(value.name))throw Error('Invocación de derechos sin contrato')}
  for(const x of Object.values(value))if(Array.isArray(x))x.forEach(checkRights);else if(x&&Object(x)===x)checkRights(x)}
 fragment.rights.programs.forEach(p=>p.body.forEach(checkRights))
 function rightsExpression(n,scope){if(n.op==='local'&&!scope.has(n.name)&&!rightsPrograms.has(n.name)&&n.name!=='Decimal')throw Error('Local sin binding en derechos');if(n.op==='lambda'){rightsExpression(n.body,new Set([...scope,...n.params]));return}for(const key of ['target','left','right','condition','value'])if(n[key]?.op)rightsExpression(n[key],scope);if(n.op==='choose'){rightsExpression(n.yes,scope);rightsExpression(n.no,scope)}for(const key of ['args','items'])if(n[key])n[key].forEach(x=>rightsExpression(x,scope));if(n.fields)n.fields.forEach(f=>rightsExpression(f.value,scope))}
 function rightsBlock(body,parent){const scope=new Set(parent);for(const n of body){if(n.op==='bind'){rightsExpression(n.value,scope);scope.add(n.name)}else if(n.op==='decode'){if(!scope.has(n.input)||!fragment.rights.schemas[n.schema])throw Error('Decode sin contrato');scope.add(n.name)}else if(n.op==='if'){rightsExpression(n.condition,scope);rightsBlock(n.yes,scope);rightsBlock(n.no,scope)}else if(n.op==='for'){rightsExpression(n.collection,scope);rightsBlock(n.body,new Set([...scope,n.name]))}else if(n.value)rightsExpression(n.value,scope)}}
 fragment.rights.programs.forEach(p=>rightsBlock(p.body,new Set(p.params)))
 if(rightsIds.size!==rightsAnchors.size)throw Error('Ancla de derechos sobrante')
 for(const c of fragment.conversions){if(!definitions.has(c.program))throw Error('Conversión sin programa');const expected=c.program.endsWith('#centimosAEuros')?{input:{index:0,kind:'finite-number',unit:'centimos'},output:{kind:'Decimal',unit:'EUR'}}:{input:{index:0,kind:'Decimal',unit:'EUR'},output:{kind:'number',unit:'centimos'}};if(JSON.stringify(c.input)!==JSON.stringify(expected.input)||JSON.stringify(c.output)!==JSON.stringify(expected.output))throw Error('Unidad de conversión incompatible')}
 const serviceIds=new Set(fragment.services.map(s=>s.id)),bindingIds=new Set()
 const checkAnchor=a=>exactAnchor(a,graph.sources)
 const expectedPrograms={
  'svc-tramos':'lib/dominio/normativa/datos/irpf-autonomico-2025.ts#TRAMOS_IRPF_ESTATAL_GENERAL_2025',
  'svc-parametros-puros':'lib/dominio/irpf/comunidades/comunidad-autonoma.ts#obtenerParametrosComunidadAutonoma',
  'svc-minimos':'lib/dominio/normativa/datos/minimos-autonomicos-2025.ts#MINIMOS_ESTATALES_2025',
  'svc-catalogo':'lib/dominio/normativa/datos/deducciones-autonomicas-2025/index.ts#obtenerDeduccionAutonomicaCatalogada',
  'svc-retencion-calcular':'lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts#calcularRetencionTrabajoAeatImpl'
 }
 function checkBinding(b){if(bindingIds.has(b.id))throw Error('Binding de servicio duplicado');bindingIds.add(b.id);checkAnchor(b.anchor);if(b.anchor.id!==b.id)throw Error('Identidad de binding distinta de su ancla');if(b.kind==='program'&&!definitions.has(b.key))throw Error('Programa de servicio ausente');if(b.kind==='program'&&expectedPrograms[b.id]!==b.key)throw Error('Binding de servicio distinto del proveedor concreto');if(b.kind==='service'&&!serviceIds.has(b.serviceId))throw Error('Dependencia de servicio ausente');if(b.kind==='object')b.fields.forEach(f=>checkBinding(f.value))}
 for(const service of fragment.services){checkAnchor(service.anchor);if(!definitions.has(service.factory))throw Error('Fábrica de servicio ausente');service.arguments.forEach(checkBinding);service.providers.forEach(p=>checkAnchor(p.anchor))}
 if(fragment.sites.length!==17||new Set(fragment.sites.map(s=>s.siteId)).size!==17||fragment.sites.some(s=>!siteIds.includes(s.siteId)||s.admissionClosed||s.siteClosed)||fragment.wiringAllowed||fragment.completeRuleAcceptance)throw Error('Cierre sin composición/revisión')
 return true
}
