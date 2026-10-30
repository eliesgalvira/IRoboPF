import { buildFrontiers } from './flujo-admision-r35-fronteras.mjs'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { siteIds, verifySources } from './flujo-admision-r32.mjs'
const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(process.env.IROBOPF_DEPENDENCIES_PACKAGE ?? root + 'package.json')
const ts = require('typescript')
const Decimal = require('decimal.js')
const Ajv = require('ajv')
const sha = b => createHash('sha256').update(b).digest('hex')
const path = 'lib/dominio/irpf/minimos/derechos.ts'
const schemaPath = 'lib/dominio/irpf/minimos/derechos-contrato.ts'
const methods = ['slice','includes','filter','map','every','some','find','toSorted','localeCompare','get','set','has','times','toDecimalPlaces','eq','lte','isFinite','plus','reduce']
const binaries = ['===','!==','<','<=','>','>=','+','-','*','/','%','&&','||','??','in']
export const operators = ['literal','undefined','local','property','array','object','spread','binary','not','negative','choose','lambda','invoke','method','construct']
export const statements = ['bind','if','for','return','evaluate','continue','decode']
const units = name => name.endsWith('Centimos') ? 'centimos' : /edad|grado|length|size|indice/.test(name) ? 'count' : /fecha|devengo/.test(name) ? 'civil-date' : 'structural'

/** Traductor acotado, sin eval: solo los cuerpos enumerados abajo. */
export function buildEvaluableAdmission() {
  verifySources()
  const text = readFileSync(root + path, 'utf8')
  const sf = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
  const anchors = []
  function node(op, n, fields = {}) {
    const id = 'n' + anchors.length
    anchors.push({id,path,start:n.getStart(sf),end:n.end,sha256:sha(text),coordinate:'UTF-16 half-open'})
    return {id,op,...fields}
  }
  function expr(n) {
    if (!n) return {id:'undefined',op:'undefined'}
    if (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isSatisfiesExpression(n)) return expr(n.expression)
    if (ts.isNumericLiteral(n)) return node('literal',n,{value:Number(n.text),unit:'scalar'})
    if (ts.isStringLiteral(n)) return node('literal',n,{value:n.text,unit:'structural'})
    if (n.kind === ts.SyntaxKind.TrueKeyword || n.kind === ts.SyntaxKind.FalseKeyword) return node('literal',n,{value:n.kind===ts.SyntaxKind.TrueKeyword,unit:'boolean'})
    if (ts.isIdentifier(n)) return node(n.text==='undefined'?'undefined':'local',n,n.text==='undefined'?{}:{name:n.text})
    if (ts.isPropertyAccessExpression(n)) return node('property',n,{target:expr(n.expression),key:n.name.text,unit:units(n.name.text)})
    if (ts.isArrayLiteralExpression(n)) return node('array',n,{items:n.elements.map(expr)})
    if (ts.isSpreadElement(n)) return node('spread',n,{value:expr(n.expression)})
    if (ts.isObjectLiteralExpression(n)) return node('object',n,{fields:n.properties.map(p=>({key:p.name.getText(sf),value:expr(ts.isShorthandPropertyAssignment(p)?p.name:p.initializer)}))})
    if (ts.isBinaryExpression(n)) {
      const operator=n.operatorToken.getText(sf)
      if (!binaries.includes(operator)) throw Error('Operador no admitido: '+operator)
      return node('binary',n,{operator,left:expr(n.left),right:expr(n.right)})
    }
    if (ts.isPrefixUnaryExpression(n)) {
      if (![ts.SyntaxKind.ExclamationToken,ts.SyntaxKind.MinusToken].includes(n.operator)) throw Error('Unario no admitido')
      return node(n.operator===ts.SyntaxKind.ExclamationToken?'not':'negative',n,{value:expr(n.operand)})
    }
    if (ts.isConditionalExpression(n)) return node('choose',n,{condition:expr(n.condition),yes:expr(n.whenTrue),no:expr(n.whenFalse)})
    if (ts.isArrowFunction(n)) return node('lambda',n,{params:n.parameters.map(p=>p.name.text),body:expr(n.body)})
    if (ts.isNewExpression(n) && ['Map','Set'].includes(n.expression.getText(sf))) return node('construct',n,{name:n.expression.getText(sf),args:(n.arguments??[]).map(expr)})
    if (ts.isCallExpression(n)) {
      const callee=n.expression.getText(sf)
      if (ts.isPropertyAccessExpression(n.expression) && !['Math.min'].includes(callee)) {
        const method=n.expression.name.text
        if (!methods.includes(method)) throw Error('Método no admitido: '+method)
        return node('method',n,{target:expr(n.expression.expression),method,args:n.arguments.map(expr)})
      }
      return node('invoke',n,{name:callee,args:n.arguments.map(expr)})
    }
    if (ts.isYieldExpression(n)) return expr(n.expression)
    throw Error('Expresión no admitida: '+ts.SyntaxKind[n.kind])
  }
  function stmt(n) {
    if (ts.isBlock(n)) return n.statements.flatMap(stmt)
    if (ts.isVariableStatement(n)) return n.declarationList.declarations.map(d=>node('bind',d,{name:d.name.text,value:expr(d.initializer)}))
    if (ts.isIfStatement(n)) return [node('if',n,{condition:expr(n.expression),yes:stmt(n.thenStatement),no:n.elseStatement?stmt(n.elseStatement):[]})]
    if (ts.isForOfStatement(n)) return [node('for',n,{name:n.initializer.declarations[0].name.text,collection:expr(n.expression),body:stmt(n.statement)})]
    if (ts.isReturnStatement(n)) return [node('return',n,{value:expr(n.expression)})]
    if (ts.isExpressionStatement(n)) return [node('evaluate',n,{value:expr(n.expression)})]
    if (ts.isContinueStatement(n)) return [node('continue',n)]
    throw Error('Sentencia no admitida: '+ts.SyntaxKind[n.kind])
  }
  const names=['fechaValida','cumpleRentas','tieneRelacion','titularesConDerecho','hayAlimentosPropiosSinMinimo','validarDerechosMinimos','validarRentasAnualesDerechos','calcularDerechosMinimos']
  const programs=[]
  function visit(n) {
    if ((ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n)) && n.name && names.includes(n.name.text)) {
      const name=n.name.text
      let fn=ts.isFunctionDeclaration(n)?n:n.initializer
      if (ts.isCallExpression(fn)) fn=fn.arguments.find(ts.isFunctionExpression)
      if (!fn) throw Error('Función no localizada: '+name)
      let body
      if (ts.isBlock(fn.body)) {
        let list=Array.from(fn.body.statements)
        if (name==='validarDerechosMinimos') list=list.slice(1)
        if (name==='calcularDerechosMinimos') list=list.slice(1,list.findIndex(s=>ts.isVariableStatement(s)&&s.declarationList.declarations[0].name.getText(sf)==='descendientes'))
        body=list.flatMap(stmt)
        if (name==='validarDerechosMinimos') body.unshift(node('decode',fn,{name:'caso',input:'entrada',schema:'DerechosMinimos2025'}))
        if (name==='calcularDerechosMinimos') {
          body.unshift(node('bind',fn,{name:'caso',value:node('invoke',fn,{name:'validarDerechosMinimos',args:[node('local',fn,{name:'entrada'})]})}))
          body.push(node('return',fn,{value:node('local',fn,{name:'elegibles'})}))
        }
      } else body=[node('return',fn,{value:expr(fn.body)})]
      programs.push({id:name,params:fn.parameters.map(p=>p.name.text),body,scope:name==='calcularDerechosMinimos'?'selection-before-money':'complete-body'})
    }
    ts.forEachChild(n,visit)
  }
  visit(sf)
  const extra=buildFrontiers();programs.push(...extra.programs);anchors.push(...extra.anchors)
  const schemas=buildRightsSchema()
  const obligations=[
    ...names.map(id=>({id,status:'resolved',program:id})),
    {id:'schema-familiar',status:'resolved',program:'DerechosMinimos2025'},
    {id:'deducciones',status:'pending',program:null},
    {id:'wrapper-adaptador',status:'pending',program:null},
    {id:'puertos-renta',status:'pending',program:null},
    {id:'selector-territorial',status:'pending',program:null},
    {id:'subservicio-final',status:'pending',program:null},
  ]
  return {version:1,contractId:'anual-publico-r32',edition:'admision-r35',domain:'plain-data-rights-2025; Decimal renta; no getters/proxies/cycles',sources:[path,schemaPath].map(p=>({path:p,sha256:sha(readFileSync(root+p))})),anchors,programs,boundaries:extra.boundaries,schemas,obligations,sites:siteIds.map(siteId=>({siteId,obligations:obligations.map(o=>o.id),admissionClosed:obligations.every(o=>o.status==='resolved'),siteClosed:false})),wiringAllowed:false,completeRuleAcceptance:false}
}

/** Schema finito cerrado: null no sustituye un opcional. */
export function buildRightsSchema() {
  const lit=value=>({const:value})
  const str=values=>({enum:values})
  const obj=(properties,optional=[])=>({type:'object',properties,required:Object.keys(properties).filter(k=>!optional.includes(k)),additionalProperties:false})
  const int=(minimum,maximum)=>({type:'integer',minimum,maximum})
  const id={type:'string',pattern:'^s-[0-9]{1,6}$'}
  const date={type:'string',pattern:'^[0-9]{4}-[0-9]{2}-[0-9]{2}$'}
  const cents=int(-1e12,1e12), boolean={type:'boolean'}
  const disability={anyOf:[obj({_tag:lit('SinDiscapacidad')}),obj({_tag:lit('Discapacidad33a64'),necesitaAyudaOMovilidadReducida:boolean}),obj({_tag:lit('Discapacidad65OMas')})]}
  const vinculo={anyOf:[obj({clase:lit('consanguinidad')}),obj({clase:str(['adopcion','acogimiento-permanente','guarda-preadoptiva']),fechaInicioIncremento:date,fechaConstitucionVinculo:date,fundamento:str(['inscripcion-registro-civil','resolucion-sin-inscripcion-necesaria']),historialCompleto:lit(true)},['fechaConstitucionVinculo']),obj({clase:str(['acogimiento-temporal','acogimiento-urgencia','guarda-judicial'])})]}
  const titular=obj({titularId:id,grado:int(1,150),vinculo,relacion:str(['convivencia','dependencia-economica','ninguna']),custodia:str(['exclusiva','compartida','sin-custodia','no-procede']),alimentosJudiciales:boolean,aplicaEspecialidadAlimentos:boolean,residenteIrpf:boolean,rentasNoExentasCentimos:cents})
  const child=obj({sujetoId:id,fechaNacimiento:date,edadDevengo:int(0,150),vivoAlDevengo:lit(true),rentasNoExentasCentimos:cents,declaracion:{anyOf:[obj({modalidad:lit('no-presenta')}),obj({modalidad:lit('individual'),rentasCentimos:cents})]},discapacidad:disability,titulares:{type:'array',items:titular,minItems:1,maxItems:100},titularesCompletos:lit(true)})
  return {DerechosMinimos2025:obj({ejercicio:lit(2025),territorio:lit('madrid'),regimen:lit('comun'),modalidad:lit('individual'),devengo:lit('2025-12-31'),contribuyenteId:id,edadContribuyenteDevengo:int(18,150),discapacidadContribuyente:disability,ascendientes:lit('ninguno'),fallecimientosEnElEjercicio:lit('ninguno'),descendientesCompletos:lit(true),conciliacionRentasContribuyente:obj({perfil:lit('caso-anual-parcial'),otrasRentasOGastosNoRepresentados:lit('ninguno')}),descendientes:{type:'array',items:child,maxItems:100}},['conciliacionRentasContribuyente'])}
}

/** Comprueba estructura y referencias ANTES de la comprobación adicional de integridad. */
export function verifyEvaluableAdmission(f) {
  const validate=new Ajv({allErrors:true}).compile(JSON.parse(readFileSync(root+'schemas/procedencia/flujo/admision-r35.schema.json','utf8')))
  if (!validate(f)) throw Error('Schema: '+JSON.stringify(validate.errors))
  const ids=new Set(), programs=new Set(f.programs.map(p=>p.id)), anchors=new Map(f.anchors.map(a=>[a.id,a]))
  function walk(n,locals) {
    if(n.id!=='undefined') {if(ids.has(n.id)) throw Error('ID duplicado');ids.add(n.id);if(!anchors.has(n.id)) throw Error('Ancla ausente')}
    if(n.op==='local'&&!locals.has(n.name)&&n.name!=='Decimal'&&!programs.has(n.name)) throw Error('Local no resuelto: '+n.name)
    if(n.op==='invoke'&&!programs.has(n.name)&&!f.boundaries.some(b=>b.id===n.name)&&!['Number','String','Math.min','rechazar','decimal-zero'].includes(n.name)) throw Error('Frontera sin contrato: '+n.name)
    if(n.op==='property'&&n.unit!==units(n.key)) throw Error('Unidad de propiedad')
    const visit=x=>walk(x,locals)
    for(const key of ['target','left','right','condition','value']) if(n[key] && Object.hasOwn(n[key], 'op')) visit(n[key])
    for(const key of ['args','items']) if(n[key]) n[key].forEach(visit)
    if(n.fields) n.fields.forEach(x=>visit(x.value))
    if(n.op==='lambda') walk(n.body,new Set([...locals,...n.params]))
    if(n.op==='choose') {visit(n.yes);visit(n.no)}
  }
  function block(body,outer) {
    const locals=new Set(outer)
    for(const n of body) {
      if(n.op==='bind') {walk(n.value,locals);locals.add(n.name)}
      else if(n.op==='decode') {if(!locals.has(n.input)||!f.schemas[n.schema]) throw Error('Decode sin entrada/schema');locals.add(n.name)}
      else if(n.op==='if') {walk(n.condition,locals);block(n.yes,locals);block(n.no,locals)}
      else if(n.op==='for') {walk(n.collection,locals);block(n.body,new Set([...locals,n.name]))}
      else if(n.value) walk(n.value,locals)
    }
  }
  f.programs.forEach(p=>block(p.body,new Set(p.params)))
  if(new Set(f.obligations.map(o=>o.id)).size!==f.obligations.length||programs.size!==f.programs.length) throw Error('Identidades repetidas')
  if(f.sites.length!==17||new Set(f.sites.map(s=>s.siteId)).size!==17) throw Error('Cobertura de sitios')
  for(const s of f.sites) {
    if(!siteIds.includes(s.siteId)||s.obligations.length!==f.obligations.length||new Set(s.obligations).size!==f.obligations.length) throw Error('Cobertura incompleta')
    const obs=s.obligations.map(id=>f.obligations.find(o=>o.id===id))
    if(obs.some(o=>!o)||s.admissionClosed!==obs.every(o=>o.status==='resolved')) throw Error('Cierre no derivado')
  }
  // Integridad es una capa adicional, nunca el único contrato.
  if(JSON.stringify(f)!==JSON.stringify(buildEvaluableAdmission())) throw Error('Receta/fuentes distintas')
  return true
}

/** Evaluación de DATOS IR. Nunca lee TS ni invoca validarDerechosMinimos real. */
export function evaluateProgram(f, name, args, ports = {}) {
  const trace=[], validators=new Map()
  const programs=new Map(f.programs.map(p=>[p.id,p]))
  let serial=0
  class Rejection extends Error {}
  class Pending extends Error {}
  const instances=new WeakMap()
  let instance=0
  const identity=value=>{if(!instances.has(value)) instances.set(value,++instance);return instances.get(value)}
  function snapshot(value) {
    if(value===undefined) return {kind:"undefined"}
    if(value===null) return null
    if(value instanceof Decimal) return {kind:"Decimal",value:value.toString(),instance:identity(value)}
    if(Object(value)===value) return {kind:"reference",instance:identity(value),collection:Array.isArray(value)}
    if(!Number.isFinite(value) && ![true,false].includes(value) && Number.isNaN(Number(value))) return String(value)
    return value
  }
  class Returned {constructor(value){this.value=value}}
  class Continue {}
  function invoke(name,args) {
    if(name==='decimal-zero') return new Decimal(0)
    if(f.boundaries.some(b=>b.id===name)) {if(!Object.hasOwn(ports,name)) throw new Pending('Frontera pendiente: '+name);return ports[name](...args)}
    if(name==='Number') return Number(args[0])
    if(name==='String') return String(args[0])
    if(name==='Math.min') return Math.min(...args)
    if(name==='rechazar') throw new Rejection(args[0])
    const p=programs.get(name)
    if(!p) throw Error('Programa desconocido: '+name)
    const frame={id:++serial,name,locals:new Map(p.params.map((k,i)=>[k,args[i]]))}
    try {block(p.body,frame)} catch(e){if(e instanceof Returned) return e.value;throw e}
  }
  function record(n,frame,value,detail={}) {trace.push({node:n.id,op:n.op,frame:frame.id,program:frame.name,value:snapshot(value),...detail});return value}
  function ev(n,frame) {
    const e=x=>ev(x,frame)
    let v
    switch(n.op) {
      case 'literal': v=n.value;break
      case 'undefined': v=undefined;break
      case 'local': v=n.name==='Decimal'?{ROUND_HALF_UP:4}:programs.has(n.name)?(...args)=>invoke(n.name,args):frame.locals.get(n.name);break
      case 'property': {const target=e(n.target);v=target[n.key];return record(n,frame,v,{property:n.key,unit:n.unit,receiver:n.target.id,instance:identity(target)})}
      case 'array': v=[];for(const i of n.items) {if(i.op==='spread') v.push(...e(i.value));else v.push(e(i))}break
      case 'object': v=Object.fromEntries(n.fields.map(p=>[p.key,e(p.value)]));break
      case 'not': v=!e(n.value);break
      case 'negative': v=-e(n.value);break
      case 'choose': v=e(n.condition)?e(n.yes):e(n.no);break
      case 'binary': {
        const a=e(n.left)
        if(n.operator==='&&') {v=a&&e(n.right);break}
        if(n.operator==='||') {v=a||e(n.right);break}
        if(n.operator==='??') {v=a??e(n.right);break}
        const b=e(n.right)
        switch(n.operator) {
          case '===':v=a===b;break;case '!==':v=a!==b;break;case '<':v=a<b;break;case '<=':v=a<=b;break;case '>':v=a>b;break;case '>=':v=a>=b;break;case '+':v=a+b;break;case '-':v=a-b;break;case '*':v=a*b;break;case '/':v=a/b;break;case '%':v=a%b;break;case 'in':v=a in b;break;default:throw Error('Operador desconocido')
        }break
      }
      case 'lambda': v=(...args)=>ev(n.body,{...frame,id:++serial,locals:new Map([...frame.locals,...n.params.map((k,i)=>[k,args[i]])])});break
      case 'construct': {const a=n.args.map(e);v=n.name==='Map'?new Map(...a):new Set(...a);break}
      case 'invoke': {const a=[];for(const x of n.args) {if(x.op==='spread') a.push(...e(x.value));else a.push(e(x))}v=invoke(n.name,a);break}
      case 'method': {const target=e(n.target);const a=n.args.map(e);if(!methods.includes(n.method)) throw Error('Método desconocido');v=target[n.method](...a);break}
      default: throw Error('Operación desconocida: '+n.op)
    }
    return record(n,frame,v)
  }
  function block(body,frame) {
    for(const n of body) {
      if(n.op==='bind') frame.locals.set(n.name,ev(n.value,frame))
      else if(n.op==='decode') {
        if(!validators.has(n.schema)) validators.set(n.schema,new Ajv({allErrors:true}).compile(f.schemas[n.schema]))
        const value=frame.locals.get(n.input)
        if(!validators.get(n.schema)(value)) throw new Rejection('Hechos incompletos o fuera del alcance Madrid 2025 individual sin fallecimientos ni ascendientes')
        frame.locals.set(n.name,value)
      } else if(n.op==='if') {const condition=ev(n.condition,frame);record(n,frame,condition);block(condition?n.yes:n.no,frame)}
      else if(n.op==='for') {let index=0;for(const value of ev(n.collection,frame)) {record(n,frame,index++);frame.locals.set(n.name,value);try {block(n.body,frame)}catch(e){if(!(e instanceof Continue)) throw e}}}
      else if(n.op==='continue') throw new Continue()
      else if(n.op==='return') throw new Returned(ev(n.value,frame))
      else if(n.op==='evaluate') ev(n.value,frame)
      else throw Error('Sentencia desconocida')
    }
  }
  try {return {outcome:'success',value:invoke(name,args),trace,sites:[]}}catch(e){return {outcome:e instanceof Pending?'pending':e instanceof Rejection?'reject':'defect',reason:e.message,trace,sites:[]}}
}
