import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, posix } from 'node:path'
const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(process.env.IROBOPF_DEPENDENCIES_PACKAGE ?? root + 'package.json')
const ts = require('typescript')
const hash = b => createHash('sha256').update(b).digest('hex')

/** Traductor finito. Rechaza sintaxis desconocida; nunca transpila ni evalúa texto. */
export function compileAdmissionGraph(entries, boundaries = []) {
  const modules = new Map(), definitions = [], anchors = [], sources = []
  const known = new Set()
  const external = new Set(boundaries)
  function module(path) {
    if (!existsSync(root+path) && existsSync(root+path.slice(0,-3)+'/index.ts')) path=path.slice(0,-3)+'/index.ts'
    if (modules.has(path)) return modules.get(path)
    const text = readFileSync(root + path, 'utf8')
    const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
    const m = { path, text, sf, declarations: new Map(), imports: new Map(), exports: [] }
    modules.set(path, m)
    sources.push({ path, sha256: hash(text) })
    for (const s of sf.statements) {
      if(ts.isExportDeclaration(s)&&s.moduleSpecifier) m.exports.push(posix.normalize(dirname(path)+'/'+s.moduleSpecifier.text)+'.ts')
      if (ts.isVariableStatement(s)) for (const d of s.declarationList.declarations) m.declarations.set(d.name.getText(sf), d)
      if (ts.isFunctionDeclaration(s) && s.name) m.declarations.set(s.name.text, s)
      if (ts.isImportDeclaration(s) && s.importClause && !s.importClause.isTypeOnly) {
        const spec = s.moduleSpecifier.text
        const target = spec.startsWith('.') ? posix.normalize(dirname(path) + '/' + spec) + '.ts' : spec
        const clause = s.importClause
        if (clause.name) m.imports.set(clause.name.text, { path: target, name: 'default' })
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) for (const i of clause.namedBindings.elements)
          if (!i.isTypeOnly) m.imports.set(i.name.text, { path: target, name: i.propertyName?.text ?? i.name.text })
      }
    }
    return m
  }
  function node(m, n, op, fields = {}) {
    const id = 'r36-' + anchors.length
    anchors.push({ id, path: m.path, start: n.getStart(m.sf), end: n.end, sha256: hash(m.text), coordinate: 'UTF-16 half-open' })
    return { id, op, ...fields }
  }
  const builtins = new Set(['undefined','Infinity','NaN','Number','String','Object','Array','Math','Map','Set','Date','Decimal','Match','Option','Effect','DateTime','Error','LiquidacionIrpfAnual','CompatibilidadSalarioLegacy'])
  function reference(m, name, n) {
    if (builtins.has(name)) return node(m,n,'builtin',{name})
    const imp = m.imports.get(name)
    const path = imp?.path ?? m.path, original = imp?.name ?? name
    if (path === 'effect' || path === 'decimal.js') return node(m,n,'builtin',{name:original === 'default' ? 'Decimal' : original === 'Array' ? 'EffectArray' : original})
    if(path.endsWith('.json.ts')) {const jsonPath=path.slice(0,-3),bytes=readFileSync(root+jsonPath);if(!sources.some(s=>s.path===jsonPath))sources.push({path:jsonPath,sha256:hash(bytes)});return node(m,n,'json',{value:JSON.parse(bytes)})}
    const key = path + '#' + original
    if (['medirAuditoriaSync','registrarTiempoAgregadoAuditoria','tiempoAuditoriaMs','validarDerechosMinimos','validarRentasAnualesDerechos','hayAlimentosPropiosSinMinimo'].includes(original)) return node(m,n,'builtin',{name:original})
    if (external.has(original)) return node(m,n,'boundary',{name:original})
    if (!known.has(key)) {
      known.add(key)
      const target = module(path), d = target.declarations.get(original)
      if (!d) {
        for(const exported of target.exports) {const next=module(exported);if(next.declarations.has(original)||next.exports.length){const entry={key,value:reference(next,original,n)};definitions.push(entry);return node(m,n,'global',{key})}}
        throw Error('Declaración no resuelta: ' + key)
      }
      const entry = { key, value: null }
      definitions.push(entry)
      entry.value = ts.isFunctionDeclaration(d) ? expression(target,d,new Set()) : expression(target,d.initializer,new Set())
    }
    return node(m,n,'global',{key})
  }
  function pattern(m,n) {
    if (ts.isIdentifier(n)) return { name:n.text }
    if (ts.isObjectBindingPattern(n)) return { fields:n.elements.map(e=>({ key:e.propertyName?.text ?? e.name.getText(m.sf), binding:pattern(m,e.name), rest:Boolean(e.dotDotDotToken), fallback:e.initializer ? expression(m,e.initializer,new Set()) : null })) }
    if (ts.isArrayBindingPattern(n)) return { items:n.elements.map(e=>pattern(m,e.name)) }
    throw Error('Binding no soportado: '+n.getText(m.sf))
  }
  function names(p) { return p.name ? [p.name] : p.fields ? p.fields.flatMap(f=>names(f.binding)) : p.items.flatMap(names) }
  function expression(m,n,locals) {
    if (!n) throw Error('Expresión ausente')
    const make=(op,fields)=>node(m,n,op,fields), e=x=>expression(m,x,locals)
    if (ts.isParenthesizedExpression(n)||ts.isAsExpression(n)||ts.isSatisfiesExpression(n)||ts.isNonNullExpression(n)) return e(n.expression)
    if (ts.isIdentifier(n)) return locals.has(n.text) ? make('local',{name:n.text}) : reference(m,n.text,n)
    if (ts.isStringLiteral(n)||ts.isNumericLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)) return make('literal',{value:ts.isNumericLiteral(n)?Number(n.text):n.text})
    if ([ts.SyntaxKind.TrueKeyword,ts.SyntaxKind.FalseKeyword,ts.SyntaxKind.NullKeyword].includes(n.kind)) return make('literal',{value:n.kind===ts.SyntaxKind.NullKeyword?null:n.kind===ts.SyntaxKind.TrueKeyword})
    if (ts.isRegularExpressionLiteral(n)) { const end=n.text.lastIndexOf('/'); return make('regex',{pattern:n.text.slice(1,end),flags:n.text.slice(end+1)}) }
    if (ts.isPropertyAccessExpression(n)||ts.isElementAccessExpression(n)) return make('get',{target:e(n.expression),key:ts.isPropertyAccessExpression(n)?make('literal',{value:n.name.text}):e(n.argumentExpression),optional:Boolean(n.questionDotToken)})
    if (ts.isArrayLiteralExpression(n)) return make('array',{items:n.elements.map(e)})
    if (ts.isSpreadElement(n)||ts.isSpreadAssignment(n)) return make('spread',{value:e(n.expression)})
    if (ts.isObjectLiteralExpression(n)) return make('object',{fields:n.properties.map(p=>ts.isSpreadAssignment(p)?{spread:e(p.expression)}:{key:ts.isIdentifier(p.name)||ts.isStringLiteral(p.name)?p.name.text:p.name.getText(m.sf),value:e(ts.isShorthandPropertyAssignment(p)?p.name:p.initializer)})})
    if (ts.isBinaryExpression(n)) return make('binary',{operator:n.operatorToken.getText(m.sf),left:e(n.left),right:e(n.right)})
    if (ts.isPrefixUnaryExpression(n)) return make('unary',{operator:ts.tokenToString(n.operator),value:e(n.operand)})
    if (ts.isConditionalExpression(n)) return make('choose',{condition:e(n.condition),yes:e(n.whenTrue),no:e(n.whenFalse)})
    if (ts.isTemplateExpression(n)) return make('template',{head:n.head.text,parts:n.templateSpans.map(s=>({value:e(s.expression),tail:s.literal.text}))})
    if (ts.isArrowFunction(n)||ts.isFunctionExpression(n)||ts.isFunctionDeclaration(n)) {
      const params=n.parameters.map(p=>({binding:pattern(m,p.name),fallback:p.initializer?e(p.initializer):null,rest:Boolean(p.dotDotDotToken)}))
      const scope=new Set([...locals,...params.flatMap(p=>names(p.binding))])
      return make('lambda',{params,body:ts.isBlock(n.body)?block(m,n.body.statements,scope):[node(m,n.body,'return',{value:expression(m,n.body,scope)})]})
    }
    if (ts.isYieldExpression(n)) return make('yield',{value:e(n.expression)})
    if (ts.isCallExpression(n)) {
      if (ts.isCallExpression(n.expression)&&n.expression.expression.getText(m.sf)==='Effect.fn') return e(n.arguments[0])
      if (n.expression.getText(m.sf)==='Effect.gen') return make('run',{value:e(n.arguments[0])})
      if (ts.isPropertyAccessExpression(n.expression)&&n.expression.name.text==='pipe') return make('pipe',{value:e(n.expression.expression),steps:n.arguments.map(e)})
      return make('call',{callee:e(n.expression),args:n.arguments.map(e)})
    }
    if (ts.isNewExpression(n)) return make('new',{callee:e(n.expression),args:(n.arguments??[]).map(e)})
    throw Error('Sintaxis fuera del traductor: '+m.path+':'+ts.SyntaxKind[n.kind]+':'+n.getText(m.sf).slice(0,120))
  }
  function block(m,body,scope) {
    const locals=new Set(scope), result=[]
    for (const n of body) {
      const e=x=>expression(m,x,locals), make=(op,f)=>node(m,n,op,f)
      if (ts.isVariableStatement(n)) for (const d of n.declarationList.declarations) {
        const binding=pattern(m,d.name)
        result.push(node(m,d,'bind',{binding,value:e(d.initializer)}));names(binding).forEach(k=>locals.add(k))
      }
      else if (ts.isFunctionDeclaration(n)) {locals.add(n.name.text);result.push(make('bind',{binding:{name:n.name.text},value:e(n)}))}
      else if (ts.isReturnStatement(n)) result.push(make('return',{value:n.expression?e(n.expression):node(m,n,'builtin',{name:'undefined'})}))
      else if (ts.isExpressionStatement(n)) result.push(make('evaluate',{value:e(n.expression)}))
      else if (ts.isIfStatement(n)) result.push(make('if',{condition:e(n.expression),yes:block(m,ts.isBlock(n.thenStatement)?n.thenStatement.statements:[n.thenStatement],locals),no:n.elseStatement?block(m,ts.isBlock(n.elseStatement)?n.elseStatement.statements:[n.elseStatement],locals):[]}))
      else if (ts.isBlock(n)) result.push(...block(m,n.statements,locals))
      else if (ts.isForOfStatement(n)) {
        const binding=pattern(m,n.initializer.declarations[0].name)
        result.push(make('for',{binding,collection:e(n.expression),body:block(m,ts.isBlock(n.statement)?n.statement.statements:[n.statement],new Set([...locals,...names(binding)]))}))
      } else if (ts.isContinueStatement(n)) result.push(make('continue',{}))
      else if (ts.isThrowStatement(n)) result.push(make('throw',{value:e(n.expression)}))
      else throw Error('Sentencia fuera del traductor: '+ts.SyntaxKind[n.kind])
    }
    return result
  }
  const roots=entries.map(({path,name})=>({path,name,value:reference(module(path),name,module(path).declarations.get(name))}))
  return {roots,definitions,anchors,sources}
}

/** R35 se conserva; solo se precisan las anclas sintéticas en el nuevo artefacto. */
export function narrowRightsAnchors(rights) {
 const path='lib/dominio/irpf/minimos/derechos.ts',text=readFileSync(root+path,'utf8'),sf=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true),functions=new Map()
 function visit(n){if(ts.isVariableDeclaration(n)&&['validarDerechosMinimos','calcularDerechosMinimos'].includes(n.name.getText(sf))){const fn=n.initializer.arguments[0];functions.set(n.name.getText(sf),fn)}ts.forEachChild(n,visit)}visit(sf)
 for(const program of rights.programs){const fn=functions.get(program.id);if(!fn)continue;const first=fn.body.statements[0].declarationList.declarations[0],eligible=fn.body.statements.find(n=>ts.isVariableStatement(n)&&n.declarationList.declarations[0].name.getText(sf)==='elegibles')?.declarationList.declarations[0]
  function narrow(n){if(!n||Object(n)!==n)return;if(n.id){const a=rights.anchors.find(a=>a.id===n.id);if(a&&a.start===fn.getStart(sf)&&a.end===fn.end){const source=n.name==='entrada'?fn.parameters[0].name:n.name==='elegibles'||n.op==='return'?eligible.name:n.op==='bind'?first:first.initializer;a.start=source.getStart(sf);a.end=source.end}}
   for(const x of Object.values(n))if(Array.isArray(x))x.forEach(narrow);else if(x&&Object(x)===x)narrow(x)}program.body.forEach(narrow)
 }
 return rights
}

/** Bindings finitos de los dos layers, extraídos de sus llamadas de fábrica. */
export function buildServiceBindings() {
 const annual='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts',adapter='lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts',territory='lib/dominio/irpf/comunidades/comunidad-autonoma.ts',retention='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts'
 const documents=new Map()
 const document=path=>{if(!documents.has(path)){const text=readFileSync(root+path,'utf8');documents.set(path,{text,sf:ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true)})}return documents.get(path)}
 const anchor=(path,n,id)=>({id,path,start:n.getStart(document(path).sf),end:n.end,sha256:hash(document(path).text),coordinate:'UTF-16 half-open'})
 const layer=(path,name)=>{const c=document(path).sf.statements.find(n=>ts.isClassDeclaration(n)&&n.name.text===name);if(!c)throw Error('Clase de servicio ausente');return c.members.find(n=>n.name?.getText(document(path).sf)==='layer').initializer}
 const find=(node,predicate)=>{const found=[];function visit(n){if(predicate(n))found.push(n);ts.forEachChild(n,visit)}visit(node);if(found.length!==1)throw Error('Binding no único: '+found.length);return found[0]}
 const make=(kind,path,node,id,fields)=>({id,kind,anchor:anchor(path,node,id),...fields})
 const annualLayer=layer(annual,'LiquidacionIrpfAnual'),adapterLayer=layer(adapter,'CompatibilidadSalarioLegacy'),paramLayer=layer(territory,'ParametrosNormativosIrpf'),retLayer=layer(retention,'RetencionTrabajoAeat')
 const annualFactory=find(annualLayer,n=>ts.isCallExpression(n)&&n.expression.getText(document(annual).sf)==='construirLiquidarIrpfAnual')
 const adapterFactory=find(adapterLayer,n=>ts.isCallExpression(n)&&n.expression.getText(document(adapter).sf)==='construirCalcularSalarioLegacy')
 const field=name=>find(annualFactory.arguments[0],n=>ts.isShorthandPropertyAssignment(n)&&n.name.text===name)
 const paramField=name=>find(paramLayer,n=>ts.isPropertyAssignment(n)&&n.name.getText(document(territory).sf)===name)
 const paramSpec=make('object',annual,field('parametrosNormativos'),'svc-parametros',{fields:[
  {name:'tramosIrpfEstatalGeneral2025',value:make('program',territory,paramField('tramosIrpfEstatalGeneral2025'),'svc-tramos',{key:'lib/dominio/normativa/datos/irpf-autonomico-2025.ts#TRAMOS_IRPF_ESTATAL_GENERAL_2025'})},
  {name:'obtenerParametrosComunidadAutonoma',value:make('program',territory,paramField('obtenerParametrosComunidadAutonoma'),'svc-parametros-puros',{key:territory+'#obtenerParametrosComunidadAutonoma'})},
  {name:'minimosEstatales2025',value:make('program',territory,paramField('minimosEstatales2025'),'svc-minimos',{key:'lib/dominio/normativa/datos/minimos-autonomicos-2025.ts#MINIMOS_ESTATALES_2025'})},
  {name:'obtenerDeduccionAutonomicaCatalogada',value:make('program',territory,paramField('obtenerDeduccionAutonomicaCatalogada'),'svc-catalogo',{key:'lib/dominio/normativa/datos/deducciones-autonomicas-2025/index.ts#obtenerDeduccionAutonomicaCatalogada'})}
 ]})
 const retField=find(retLayer,n=>ts.isPropertyAssignment(n)&&n.name.getText(document(retention).sf)==='calcular')
 const retSpec=make('object',annual,field('retencionTrabajoAeat'),'svc-retencion',{fields:[{name:'calcular',value:make('program',retention,retField,'svc-retencion-calcular',{key:retention+'#calcularRetencionTrabajoAeatImpl'})}]})
 const dependency=make('object',annual,annualFactory.arguments[0],'svc-dependencias',{fields:[
 {name:'cotizacionesSociales',value:make('captured',annual,field('cotizacionesSociales'),'svc-cotizaciones',{provider:'CotizacionesSociales.layer'})},
 {name:'parametrosNormativos',value:paramSpec},
 {name:'politicaMonetaria',value:make('captured',annual,field('politicaMonetaria'),'svc-politica',{provider:'PoliticaMonetaria.layer'})},
 {name:'retencionTrabajoAeat',value:retSpec}
 ]})
 function providers(path,body){const out=[];function visit(n){if(ts.isCallExpression(n)&&n.expression.getText(document(path).sf)==='Layer.provideMerge')out.push({provider:n.arguments[0].getText(document(path).sf),anchor:anchor(path,n.arguments[0],'provider-'+path+'-'+out.length)});ts.forEachChild(n,visit)}visit(body);return out}
 return [
 {id:'LiquidacionIrpfAnual',method:'liquidar',factory:annual+'#construirLiquidarIrpfAnual',anchor:anchor(annual,annualFactory,'svc-anual-factory'),arguments:[dependency],providers:providers(annual,annualLayer),internalWrappers:['liquidarIrpfAnual','liquidarIrpfAnualConDerechos'],directEntry:'liquidarIrpfAnualDesdeServicio',injectedResult:'LiquidacionIrpfAnual.liquidar'},
 {id:'CompatibilidadSalarioLegacy',method:'calcular',factory:adapter+'#construirCalcularSalarioLegacy',anchor:anchor(adapter,adapterFactory,'svc-adaptador-factory'),arguments:[make('service',adapter,adapterFactory.arguments[0],'svc-adaptador-anual',{serviceId:'LiquidacionIrpfAnual'})],providers:providers(adapter,adapterLayer),internalWrappers:['calcularSalarioLegacy'],directEntry:null,injectedResult:null}
 ]
}

/** Schema finito del resultado anual sustituible, incluidos Option, rastro y conciliación. */
export function compileAnnualResultSchema() {
 const files={ResultadoNoSoportado:'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts',ResultadoNoSoportadoRetencion:'lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts',LiquidacionIrpfAnualCalculada:'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts',ConciliacionSimuladorLegacy:'lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy.ts',RastroCalculo:'lib/dominio/explicacion/rastro-calculo.ts',PasoExplicacion:'lib/dominio/explicacion/paso-explicacion.ts',LineaCalculo:'lib/dominio/explicacion/paso-explicacion.ts',FuenteExplicacion:'lib/dominio/explicacion/fuente-explicacion.ts'}
 const definitions={},sources=new Map(),years={enum:Array.from({length:15},(_,i)=>2012+i)},number={type:'number',minimum:-Number.MAX_VALUE,maximum:Number.MAX_VALUE}
 function object(members,sf,path,text){const properties={},required=[];for(const p of members){if(!ts.isPropertySignature(p)||!p.type)throw Error('Miembro DTO no representado');const key=p.name.getText(sf);properties[key]={...type(p.type,sf,path,text),'x-unit':key.endsWith('Centimos')?'centimos':key==='anio'?'year':key.endsWith('Porcentaje')?'percent':p.type.getText(sf)==='Decimal'?'EUR':'structural','x-source':{path,start:p.getStart(sf),end:p.end,sha256:hash(text)}};if(!p.questionToken)required.push(key)}return {type:'object',properties,required,additionalProperties:true}}
 function load(name){if(Object.hasOwn(definitions,name))return;const path=files[name];if(!path)throw Error('Tipo DTO no permitido: '+name);const text=readFileSync(root+path,'utf8'),sf=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true);sources.set(path,{path,sha256:hash(text)});const n=sf.statements.find(n=>ts.isInterfaceDeclaration(n)&&n.name.text===name);if(!n)throw Error('Interfaz DTO ausente');definitions[name]={};definitions[name]=object(n.members,sf,path,text)}
 function type(n,sf,path,text){
  if(n.kind===ts.SyntaxKind.NumberKeyword)return number
  if(n.kind===ts.SyntaxKind.StringKeyword)return {type:'string'}
  if(ts.isLiteralTypeNode(n)){const l=n.literal;if(ts.isStringLiteral(l))return {const:l.text};if(l.kind===ts.SyntaxKind.FalseKeyword)return {const:false};if(l.kind===ts.SyntaxKind.TrueKeyword)return {const:true};throw Error('Literal DTO no representado')}
  if(ts.isTypeLiteralNode(n))return object(n.members,sf,path,text)
  if(ts.isUnionTypeNode(n))return {anyOf:n.types.map(n=>type(n,sf,path,text))}
  if(ts.isIndexedAccessTypeNode(n)&&n.getText(sf)==='CasoFiscalAnual["anio"]')return years
  if(ts.isTypeReferenceNode(n)){const name=n.typeName.getText(sf);if(name==='Decimal')return {r36Decimal:true};if(name==='AnioFiscal')return years;if(name==='ReadonlyArray')return {type:'array',items:type(n.typeArguments[0],sf,path,text)};if(name==='Option.Option')return {anyOf:[{type:'object',properties:{_tag:{const:'None'}},required:['_tag'],additionalProperties:true},{type:'object',properties:{_tag:{const:'Some'},value:type(n.typeArguments[0],sf,path,text)},required:['_tag','value'],additionalProperties:true}]};load(name);return {$ref:'#/$defs/'+name}}
  throw Error('Tipo DTO no representado: '+n.getText(sf))
 }
 load('LiquidacionIrpfAnualCalculada');load('ResultadoNoSoportado');load('ResultadoNoSoportadoRetencion')
 return {failureSchema:{anyOf:[{$ref:'#/$defs/ResultadoNoSoportado'},{$ref:'#/$defs/ResultadoNoSoportadoRetencion'}],$defs:definitions},schema:{$ref:'#/$defs/LiquidacionIrpfAnualCalculada',$defs:definitions},sources:[...sources.values()]}
}
