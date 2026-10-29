import fs from 'node:fs'
import zlib from 'node:zlib'
import {pathToFileURL} from 'node:url'
import {Sources,ts,sha,property} from './flujo-ast.mjs'
import {compose} from './flujo-componer.mjs'
import {guards} from './flujo-fronteras.mjs'
export const destinationR30='docs/procedencia/implementaciones/flujo-retenciones-ss-r30-sol/'
const annual='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const retention='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts'
const legacy='lib/dominio/laboral/cotizaciones-sociales.ts'
const uniform='lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'
export const targetSite=id=>/^anual\.(ss|retencion|pagos)\./.test(id)
function nodes(root,predicate){const result=[];function visit(n){if(predicate(n))result.push(n);ts.forEachChild(n,visit)}visit(root);return result}
function declaration(sources,file,name){const found=nodes(sources.load(file).ast,n=>(ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText()===name);if(found.length!==1)throw Error('Declaración no única: '+name);return found[0]}
function functionBody(d){let n=ts.isVariableDeclaration(d)?d.initializer:d;if(n&&ts.isCallExpression(n)&&n.arguments.length===1&&ts.isFunctionExpression(n.arguments[0]))n=n.arguments[0];return n&&ts.isFunctionLike(n)?n:null}
/** Inventario de contratos concretos: los callbacks y servicios conservan sus cuerpos;
 * ninguna llamada se convierte en terminal por tener contrato editorial. */
export function contractsR30(sources=new Sources()){
 const queue=[[annual,'pasoRetencionTrabajoAeat'],[annual,'liquidarTrabajoIndividualSimple'],[annual,'construirLiquidarIrpfAnual'],[retention,'calcularRetencionTrabajoAeatImpl'],[uniform,'calcularDesgloseCotizacionesPerfilUniforme'],[legacy,'calcularDesgloseCotizacionesSocialesLegacy']]
 const contracts=[],seen=new Set()
 while(queue.length){const [file,name]=queue.shift(),key=file+':'+name;if(seen.has(key))continue;seen.add(key)
  const d=declaration(sources,file,name),fn=functionBody(d);if(!fn?.body)throw Error('Sin cuerpo concreto: '+key)
  const body=fn.body
  const calls=nodes(body,ts.isCallExpression).map(call=>{
   const callee=ts.isIdentifier(call.expression)?sources.declaration(call.expression):null
   const concrete=callee&&functionBody(callee)
   if(concrete?.body&&/^lib\/dominio\/(irpf|laboral|dinero|normativa)\//.test(callee.getSourceFile().fileName))queue.push([callee.getSourceFile().fileName,callee.name.getText()])
   return {call:sources.ref(call),callee:callee?sources.ref(callee):null,arguments:call.arguments.map((arg,index)=>({index,argument:sources.ref(arg),formal:concrete?.parameters[index]?sources.ref(concrete.parameters[index]):null})),conditions:guards(call,sources),resolution:concrete?.body?'concrete-function':'requires-operation-or-callback-contract'}
  })
  const returns=nodes(body,ts.isReturnStatement).filter(n=>{let p=n.parent;while(p&&p!==fn){if(ts.isFunctionLike(p))return false;p=p.parent}return p===fn}).map(n=>({source:sources.ref(n),value:n.expression?sources.ref(n.expression):null,conditions:guards(n,sources),properties:n.expression&&ts.isObjectLiteralExpression(n.expression)?n.expression.properties.map(p=>({property:p.name?.getText()??null,producer:sources.ref(ts.isPropertyAssignment(p)?p.initializer:p)})):[]}))
  contracts.push({id:key,declaration:sources.ref(d),parameters:fn.parameters.map(p=>sources.ref(p)),calls,returns,branches:nodes(body,ts.isIfStatement).map(n=>({predicate:sources.ref(n.expression),then:sources.ref(n.thenStatement),else:n.elseStatement?sources.ref(n.elseStatement):null})),divisions:nodes(body,n=>ts.isCallExpression(n)&&ts.isPropertyAccessExpression(n.expression)&&['div','dividedBy'].includes(n.expression.name.text)).map(n=>({call:sources.ref(n),divisor:n.arguments[0]?sources.ref(n.arguments[0]):null,conditions:guards(n,sources)})),review:'pending-independent',closed:false})
 }
 return contracts
}
const outputProperties={base:'baseRetencionCentimos',cuota:'cuotaRetencionCentimos',tipo:'tipoRetencionPorcentaje',anual:'importeRetencionAnualCentimos'}
export function composeR30(){
 const graph=compose(),sources=new Sources(),contracts=contractsR30(sources)
 const retained=graph.sites.filter(s=>!targetSite(s.siteId))
 const result=graph.sites.filter(s=>targetSite(s.siteId)).map(site=>{
  const call=sources.exact(site.source),argument=property(call.arguments[0],'importe').initializer
  const retProperty=outputProperties[site.siteId.split('.').at(-1)]
  const producer=retProperty?contracts.find(c=>c.id===retention+':calcularRetencionTrabajo')?.returns.flatMap(r=>r.properties).find(p=>p.property===retProperty):null
  const blockers=site.closure.unresolved.map(u=>{const p=site.producerMap.find(p=>p.id===u.port);return {...u,source:p?.source,property:p?.property,nextAction:u.reason.includes('retencionTrabajoAeat.calcular')?'Instanciar el servicio anual desde RetencionTrabajoAeat.layer, sustituir los dos argumentos y componer únicamente los retornos de éxito; conservar fail.':u.reason.includes('reduce')?'Instanciar reduce: semilla, acumulador por elemento, callback y cardinalidad; enlazar cada importeIntegroCentimos mediante centimosAEuros.':u.reason.includes('Índice dinámico')?'Expandir tabla finita por ejercicio/lado y enlazar selector y celda exacta, rechazando clave ausente.':'Resolver esta forma AST con su contrato concreto y prueba discriminante antes de cerrar.'}})
  return {siteId:site.siteId,consumer:sources.ref(argument),unit:site.siteId.endsWith('.tipo')?'percent':'EUR',frequency:'annual',side:site.siteId.includes('empresarial')||site.siteId.endsWith('coste-laboral')?'empresa':site.siteId.includes('trabajador')?'trabajador':'no-aplica',producer:producer??null,value:site.closure,selection:site.branches,admission:{closed:false,contracts:[annual+':construirLiquidarIrpfAnual',annual+':liquidarTrabajoIndividualSimple',...(site.siteId.includes('retencion.')||site.siteId==='anual.pagos.cuenta'?[retention+':calcularRetencionTrabajoAeatImpl']:[])],nextAction:'Componer cada rechazo y validación de esos cuerpos hasta la entrada pública; las ramas AST extraídas no prueban por sí solas la suficiencia de admisión.'},closed:false,blockers,legalAcceptance:false,review:'pending-independent'}
 })
 return {version:1,base:'376fb100512ca6a2f975c3c9500a20ee375dd431',graph,contracts,sites:result,untouchedSites:retained.map(s=>({siteId:s.siteId,closed:s.closed,domain:s.domain})),completeRuleAcceptance:false,wiringAllowed:false,consumerHashes:[...new Set(result.map(s=>s.consumer.file))].map(file=>({file,sha256:sources.load(file).sha256})),limits:['Contratos de funciones y puertos extraídos; no son terminales opacos ni aceptación jurídica.','SS canónica analítica; sin exactitud TGSS mensual.','No se declara completo ningún sitio con admisión pendiente.']}
}
export function verifyR30(candidate){const expected=composeR30();if(sha(JSON.stringify(candidate))!==sha(JSON.stringify(expected)))throw Error('Contrato R30 alterado');return true}
export function generateR30(){const result=composeR30();fs.mkdirSync(destinationR30,{recursive:true});fs.writeFileSync(destinationR30+'composicion.json.gz',zlib.gzipSync(JSON.stringify(result,null,2)+'\n'));fs.writeFileSync(destinationR30+'sitios.json.gz',zlib.gzipSync(JSON.stringify(result.sites,null,2)+'\n'));return result}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const r=generateR30();console.log(JSON.stringify({sites:r.sites.length,contracts:r.contracts.length,closed:r.sites.filter(s=>s.closed).length}))}
