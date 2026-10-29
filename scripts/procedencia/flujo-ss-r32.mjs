import fs from 'node:fs'
import { createRequire } from 'node:module'
import { Sources, ts, sha } from './flujo-ast.mjs'
const require = createRequire('/home/elies/Repos/IRoboPF/package.json')
const Decimal = require('decimal.js')
export const BASE = '846f25e183ba07414065d4e6bdf9e98311b98a17'
const legacy = 'lib/dominio/laboral/cotizaciones-sociales.ts'
const uniform = 'lib/dominio/laboral/cotizaciones-perfil-uniforme.ts'
const annual = 'lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const maxima = 'lib/dominio/normativa/datos/seguridad-social-2012-2026.ts'
const money = 'lib/dominio/dinero/importe-monetario.ts'
const work = 'lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts'
const pins = [
  [legacy,'7c5b5567d5d4222286e9f167e85954ceebf044fe8fcc826666daa7ad4f0323f1'],
  [uniform,'7b5e150d27f82301d07c9b8ca9a4e58747902f3475ca0e4a4769a1a713b2cf18'],
  [annual,'096215328f083d711fc1e61d70b41ae555ee115b4872a55f7df0c512d05a439f'],
  [maxima,'a7341c7b475ae1333c528205c34d403e403ec465328c2f5a2a9a9b1a1080af80'],
  [money,'c34f0bfb31dbef47799eb25743810e8e482703d2a2f445763f4f62747949bea5'],
  [work,'fd9f91710a717ffa2d115ca42f0a5c4e3baf383f563820df509432d8acf57e54'],
]
// Contrato finito: cada dependencia se representa por operaciones, nunca por
// la ejecución de un cuerpo financiero convertido en primitiva.
export function composeSS() {
  const sources = new Sources(), evidence = [], ports = [], edges = [], bindings = []
  for (const [file, pin] of pins) {
    if (sha(fs.readFileSync(file)) !== pin) throw Error('Revisar contrato de fuente: '+file)
    sources.load(file)
  }
  function register(n) {
    const r=sources.ref(n)
    const prior=evidence.find(e=>e.file===r.file&&e.start===r.start&&e.end===r.end)
    if(prior)return prior.id
    const id='s'+evidence.length
    evidence.push({id,...r});return id
  }
  function ref(file, text) {
    const matches=[]
    function visit(n) { if(n.getText()===text) matches.push(n); ts.forEachChild(n,visit) }
    visit(sources.load(file).ast)
    if (!matches.length) throw Error('Evidencia ausente: '+text)
    return register(matches[0])
  }
  function declaration(file,name) {
    let found
    function visit(n) {if((ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText()===name)found=n;ts.forEachChild(n,visit)}
    visit(sources.load(file).ast)
    if(!found)throw Error('Declaración ausente: '+name)
    return ref(file,found.getText())
  }
  const L=declaration(legacy,'calcularDesgloseCotizacionesSocialesLegacy')
  const U=declaration(uniform,'calcularDesgloseCotizacionesPerfilUniforme')
  const A=declaration(annual,'liquidarTrabajoIndividualSimple')
  const P=declaration(legacy,'obtenerParametrosCotizacionLegacy')
  const S=declaration(legacy,'calcularTotalSolidaridad')
  const Q=declaration(uniform,'cuotaSolidaridad')
  const M=declaration(legacy,'obtenerTiposMei')
  const T=declaration(legacy,'obtenerPoliticaSolidaridad')
  const R=declaration(legacy,'sumarTipoCotizacionLegacy')
  const W=declaration(work,'sumarRendimientosTrabajo')
  const C=declaration(money,'centimosAEuros')
  const choose=declaration(legacy,'tipoCotizacionPorLado')
  function node(op,args,unit,source,detail=null) {
    const id='p'+ports.length
    ports.push({id,op,args,unit,frequency:'anual',source,detail,property:detail?.property??'value',instance:'anual:ss:'+id,role:['boolean','ejercicio','modo','tag'].includes(unit)?'selection':'value'})
    for(let i=0;i<args.length;i++)edges.push({id:'e'+edges.length,from:args[i],to:id,argument:i,evidence:[source],role:op==='if'&&i===0||op==='eq'||op==='gte'||op==='lte'?'selection':'value',condition:op==='if'&&i>0?(i===1?'predicate=true':'predicate=false'):'true'})
    return id
  }
  const lit=(value,unit,source)=>node('literal',[],unit,source,{value:String(value)})
  const input=(path,unit)=>node('input',[],unit,A,{path})
  const op=(name,args,unit='EUR',source=L)=>node(name,args,unit,source)
  const zero=lit(0,'EUR',declaration(money,'IMPORTE_CERO'))
  const year=input('caso.anio','ejercicio'),mode=input('contexto.modo','modo')
  const salaryArray=input('caso.rendimientos.trabajo','array')
  const element=node('element',[],'centimos',W,{array:salaryArray,index:'i',property:'importeIntegroCentimos',binding:'rendimientos[i].importeIntegroCentimos'})
  const converted=op('div',[element,lit(100,'centimos/EUR',ref(money,'100'))],'EUR',C)
  const seed=op('div',[lit(0,'centimos',ref(work,'0')),lit(100,'centimos/EUR',ref(money,'100'))],'EUR',C)
  const acc=node('accumulator',[],'EUR',W,{binding:'total[i]',seed})
  const body=op('plus',[acc,converted],'EUR',W)
  const gross=node('reduce',[salaryArray,seed,body],'EUR',W,{element,accumulator:acc,order:'i=0..length-1',empty:'seed',cardinality:'una contribución por índice'})
  const eqYear=y=>op('eq',[year,lit(y,'ejercicio',ref(maxima,String(y)))],'boolean',P)
  const canon=op('eq',[mode,lit('canonico','modo',ref(annual,'"canonico"'))],'boolean',A)
  const select=(pred,a,b,unit='EUR',src=L)=>op('if',[pred,a,b],unit,src)
  const extractLiterals=(file,name)=>{
    let found
    function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText()===name)found=n.initializer;ts.forEachChild(n,visit)}
    visit(sources.load(file).ast);if(!found)throw Error(name)
    while(ts.isAsExpression(found)||ts.isSatisfiesExpression(found))found=found.expression
    return found
  }
  function cell(file,n,unit) {
    if(ts.isCallExpression(n))return cell(file,n.arguments[0],unit)
    if(!ts.isNumericLiteral(n)&&!ts.isStringLiteral(n)&&!ts.isIdentifier(n))throw Error('Celda no literal')
    if(n.getText()==='IMPORTE_CERO')return lit(0,unit,register(n))
    return lit(n.text,unit,register(n))
  }
  const maxTable=extractLiterals(maxima,'BASE_MAXIMA_COTIZACION_LEGACY')
  let max=null
  for(const field of [...maxTable.properties].reverse()) {
    const value=cell(maxima,field.initializer,'EUR')
    max=max===null?value:select(eqYear(Number(field.name.getText())),value,max,'EUR',P)
  }
  const baseLegacy=op('min',[gross,max])
  const base2018=op('div',[op('plus',[
    op('mul',[op('min',[gross,op('mul',[lit('3751.20','EUR/mes',ref(uniform,'"3751.20"')),lit(12,'meses',ref(uniform,'12'))],'EUR',U)],'EUR',U),lit(7,'meses',ref(uniform,'7'))],'EUR*meses',U),
    op('mul',[op('min',[gross,op('mul',[lit('3803.70','EUR/mes',ref(uniform,'"3803.70"')),lit(12,'meses',ref(uniform,'12'))],'EUR',U)],'EUR',U),lit(5,'meses',ref(uniform,'5'))],'EUR*meses',U)
  ],'EUR*meses',U),lit(12,'meses',ref(uniform,'12'))],'EUR',U)
  const baseCanonical=select(eqYear(2018),base2018,baseLegacy,'EUR',U)
  const base=select(canon,baseCanonical,baseLegacy,'EUR',A)
  const excessLegacy=op('max',[zero,op('minus',[gross,max])])
  const excessCanonical=op('max',[zero,op('minus',[gross,baseCanonical],'EUR',U)],'EUR',U)
  const excess=select(canon,excessCanonical,excessLegacy,'EUR',A)
  const types=extractLiterals(legacy,'TIPOS_SEGURIDAD_SOCIAL_LEGACY')
  const sideSums=[]
  for(const side of ['empresarial','trabajador']) {
    let sum=lit(0,'proporcion',declaration(money,'IMPORTE_CERO'))
    for(const field of types.properties) {
      const obj=field.initializer
      const rate=obj.properties.find(p=>p.name.getText()===side)
      sum=op('plus',[sum,cell(legacy,rate.initializer,'proporcion')],'proporcion',R)
      ports.at(-1).detail={side,property:'tiposSeguridadSocial.'+field.name.getText()+'.'+side,obtainedBy:P,selector:choose,order:'Object.values',seed:'0',binding:'parametros = obtenerParametrosCotizacionLegacy(caso.anio)'}
    }
    sideSums.push(sum)
  }
  const meiRates=[['0.005','0.0058','0.0067','0.0075'],['0.001','0.0012','0.0013','0.0015']]
  const after2026=op('gte',[year,lit(2026,'ejercicio',ref(legacy,'2026'))],'boolean',M)
  const mei=meiRates.map(rates=>{
    let v=select(after2026,lit(rates[3],'proporcion',ref(legacy,JSON.stringify(rates[3]))),lit(0,'proporcion',declaration(money,'IMPORTE_CERO')),'proporcion',M)
    for(let i=2;i>=0;i--)v=select(eqYear(2023+i),lit(rates[i],'proporcion',ref(legacy,JSON.stringify(rates[i]))),v,'proporcion',M)
    return op('mul',[base,v])
  })
  function bands(ex,src) {
    const first=op('mul',[max,lit('0.1','proporcion',ref(uniform,'"0.1"'))],'EUR',src)
    const last=op('mul',[max,lit('0.5','proporcion',ref(uniform,'"0.5"'))],'EUR',src)
    // Legacy resta los dos límites; uniforme multiplica directamente por 0.4.
    const width=src===S?op('minus',[last,first],'EUR',S):op('mul',[max,lit('0.4','proporcion',ref(uniform,'"0.4"'))],'EUR',Q)
    return [op('min',[ex,first],'EUR',src),op('min',[op('max',[zero,op('minus',[ex,first],'EUR',src)],'EUR',src),width],'EUR',src),op('max',[zero,op('minus',[ex,last],'EUR',src)],'EUR',src)]
  }
  const lb=bands(excessLegacy,S),ub=bands(excessCanonical,Q)
  function weighted(b, rates, file,src) {
    return op('plus',[op('plus',[op('mul',[b[0],lit(rates[0],'proporcion',ref(file,JSON.stringify(rates[0])))],'EUR',src),op('mul',[b[1],lit(rates[1],'proporcion',ref(file,JSON.stringify(rates[1])))],'EUR',src)],'EUR',src),op('mul',[b[2],lit(rates[2],'proporcion',ref(file,JSON.stringify(rates[2])))],'EUR',src)],'EUR',src)
  }
  const enabled=op('gte',[year,lit(2025,'ejercicio',ref(legacy,'2025'))],'boolean',T)
  const tag=select(enabled,lit('ConSolidaridad','tag',ref(legacy,'"ConSolidaridad"')),lit('SinSolidaridad','tag',ref(legacy,'"SinSolidaridad"')),'tag',T)
  const tagMatch=op('eq',[tag,lit('ConSolidaridad','tag',ref(legacy,'"ConSolidaridad"'))],'boolean',S)
  const total=select(tagMatch,select(op('lte',[excessLegacy,zero],'boolean',S),zero,select(eqYear(2025),weighted(lb,['0.0092','0.0100','0.0117'],legacy,S),weighted(lb,['0.0115','0.0125','0.0146'],legacy,S),'EUR',T),'EUR',S),zero,'EUR',S)
  const uniformTable=extractLiterals(uniform,'tiposSolidaridad')
  function uniformWeighted(b,year,side) {
    const row=uniformTable.properties.find(p=>p.name.getText()===String(year))
    const field=row.initializer.properties.find(p=>p.name.getText()===side)
    const array=field.initializer
    const products=array.elements.map((n,i)=>{
      const rate=cell(uniform,n,'proporcion')
      ports.at(-1).detail={...ports.at(-1).detail,table:'tiposSolidaridad',year,side,index:i,parameter:'cuotaSolidaridad.tipos['+i+']',indexSource:ref(uniform,'tipos['+i+']')}
      return op('mul',[b[i],rate],'EUR',Q)
    })
    return op('plus',[op('plus',[products[0],products[1]],'EUR',Q),products[2]],'EUR',Q)
  }
  const solid=['empresa','trabajador'].map((side,i)=>{
    const canonical=select(eqYear(2025),uniformWeighted(ub,2025,side),select(eqYear(2026),uniformWeighted(ub,2026,side),zero,'EUR',U),'EUR',U)
    const compatible=i===0?op('div',[op('mul',[total,lit(5,'reparto',ref(legacy,'5'))]),lit(6,'reparto',ref(legacy,'6'))]):op('div',[total,lit(6,'reparto',ref(legacy,'6'))])
    return select(canon,canonical,compatible,'EUR',A)
  })
  const ordinary=sideSums.map(rate=>op('mul',[base,rate]))
  const totals=ordinary.map((v,i)=>op('plus',[op('plus',[v,mei[i]]),solid[i]]))
  const outputs=[base,excess,ordinary[0],ordinary[1],mei[0],mei[1],solid[0],solid[1],totals[0],totals[1],op('plus',[gross,totals[0]],'EUR',A)]
  const suffixes=['base','exceso','empresarial-ordinaria','trabajador-ordinaria','mei-empresarial','mei-trabajador','solidaridad-empresarial','solidaridad-trabajador','empresarial-total','trabajador-total','coste-laboral']
  function siteEvidence(site) {
    let found
    function visit(n) {
      if(ts.isCallExpression(n)&&n.expression.getText()==='crearLineaCalculo'&&ts.isObjectLiteralExpression(n.arguments[0])) {
        const obj=n.arguments[0],id=obj.properties.find(p=>p.name?.getText()==='siteId')
        if(id&&ts.isPropertyAssignment(id)&&ts.isStringLiteral(id.initializer)&&id.initializer.text===site)found=n
      }
      ts.forEachChild(n,visit)
    }
    visit(sources.load(annual).ast)
    if(!found)throw Error('Sitio anual no encontrado: '+site)
    return register(found)
  }
  const sites=suffixes.map((s,i)=>({siteId:'anual.ss.'+s,output:outputs[i],source:siteEvidence('anual.ss.'+s),unit:'EUR',frequency:'anual',side:s.includes('empresarial')?'empresarial':s.includes('trabajador')?'trabajador':'ambos',valueClosed:false,selectionClosed:false,siteClosed:false,admissionRequirement:'anual-publico-r32'}))
  // Llamadas y argumentos exactos, normalizados. Incluye callbacks y variantes.
  for(const [file] of pins) {
    function visit(n) {
      if(ts.isCallExpression(n)) {
        const d=ts.isIdentifier(n.expression)?sources.declaration(n.expression):null
        let fn=d&&ts.isVariableDeclaration(d)?d.initializer:d
        if(fn&&!(ts.isArrowFunction(fn)||ts.isFunctionDeclaration(fn)||ts.isFunctionExpression(fn)))fn=null
        bindings.push({call:register(n),callee:n.expression.getText(),arguments:n.arguments.map(a=>register(a)),parameters:fn?fn.parameters.map((p,i)=>({parameter:register(p),argument:n.arguments[i]?register(n.arguments[i]):null,index:i})):[]})
      }
      ts.forEachChild(n,visit)
    }
    // Solo cuerpos SS y transporte monetario/anual: no catálogo ajeno.
    const ast=sources.load(file).ast
    if(file===annual) {
      for(const text of ['sumarRendimientosTrabajo(caso.rendimientos.trabajo, centimosAEuros)', '(contexto.modo === "canonico"\n        ? calcularDesgloseCotizacionesPerfilUniforme\n        : calcularDesgloseCotizacionesSocialesLegacy)({\n        anio: caso.anio,\n        salarioBrutoAnual: rendimientoIntegroTrabajo,\n      })']) {
        const scan=n=>{if(n.getText()===text)visit(n);else ts.forEachChild(n,scan)};scan(ast)
      }
    } else visit(ast)
  }
  const transport=[
    {from:'caso.anio',to:'entrada.anio',functions:['calcularDesgloseCotizacionesPerfilUniforme','calcularDesgloseCotizacionesSocialesLegacy'],source:A},
    {from:gross,to:'entrada.salarioBrutoAnual',functions:['calcularDesgloseCotizacionesPerfilUniforme','calcularDesgloseCotizacionesSocialesLegacy'],source:A},
    {from:'entrada.anio',to:'obtenerParametrosCotizacionLegacy(anio)',functions:['obtenerTiposMei','obtenerPoliticaSolidaridad','BASE_MAXIMA_COTIZACION_LEGACY[anio]'],source:P},
    {from:'obtenerParametrosCotizacionLegacy(anio)',to:'sumarTipoCotizacionLegacy(parametros,lado)',functions:['Object.values(parametros.tiposSeguridadSocial)','tipoCotizacionPorLado'],source:R},
    {from:'solidaridad.empresa[i] / solidaridad.trabajador[i]',to:'cuotaSolidaridad.tipos[i]',functions:['cuotaSolidaridad'],indices:[0,1,2],source:Q},
    {from:'parametros.solidaridad',to:'Match.valueTags: politica',functions:['calcularTotalSolidaridad'],variants:['SinSolidaridad','ConSolidaridad'],source:S}
  ]
  /** @type {Array<{siteId:string,root:string,ports:string[],terminals:string[],unresolved:string[],closed:boolean}>} */
  const closures=[]
  const graph={version:1,kind:'flujo-ss-r32',base:BASE,sources:evidence,ports,edges,bindings,transport,sites,closures,unresolved:[],completeRuleAcceptance:false,wiringAllowed:false}
  for(const site of sites) {
    const result=traceSSClosure(graph,site.output)
    graph.closures.push({siteId:site.siteId,...result})
    site.valueClosed=result.closed;site.selectionClosed=result.closed
    graph.unresolved.push(...result.unresolved.map(reason=>({siteId:site.siteId,reason})))
  }
  return graph
}
export function traceSSClosure(graph,root) {
  const ports=new Map(graph.ports.map(p=>[p.id,p])),sources=new Set(graph.sources.map(s=>s.id))
  const visited=new Set(),terminals=new Set(),unresolved=[]
  const arity=new Map([['literal',0],['input',0],['element',0],['accumulator',0],['reduce',3],['if',3],...['eq','gte','lte','plus','minus','mul','div','min','max'].map(op=>[op,2])])
  function visit(id,frame,stack) {
    const key=id+':'+(frame?.id??'public')
    if(stack.has(key)){unresolved.push('Ciclo: '+id);return}
    if(visited.has(key))return
    visited.add(key)
    const p=ports.get(id)
    if(!p){unresolved.push('Puerto ausente: '+id);return}
    if(!sources.has(p.source))unresolved.push('Fuente ausente: '+id)
    if(!arity.has(p.op)||p.args.length!==arity.get(p.op))unresolved.push('Operación o aridad abierta: '+id)
    const relations=graph.edges.filter(e=>e.to===id)
    if(relations.length!==p.args.length||p.args.some((a,i)=>!relations.some(e=>e.from===a&&e.argument===i)))unresolved.push('Transporte abierto: '+id)
    const next=new Set(stack);next.add(key)
    if(p.op==='literal'){terminals.add(id);return}
    if(p.op==='input') {
      if(!['caso.anio','contexto.modo','caso.rendimientos.trabajo'].includes(p.detail.path))unresolved.push('Entrada auxiliar sin enlace: '+id)
      else terminals.add(id)
      return
    }
    if(p.op==='element') {
      if(!frame||frame.detail.element!==id||p.detail.array!==frame.args[0]||p.detail.property!=='importeIntegroCentimos')unresolved.push('Elemento sin binding: '+id)
      return
    }
    if(p.op==='accumulator') {
      if(!frame||frame.detail.accumulator!==id||p.detail.seed!==frame.args[1])unresolved.push('Acumulador sin semilla: '+id)
      return
    }
    if(p.op==='reduce') {
      visit(p.args[0],frame,next);visit(p.args[1],frame,next);visit(p.args[2],p,next);return
    }
    for(const a of p.args)visit(a,frame,next)
  }
  visit(root,null,new Set())
  return {root,ports:[...new Set([...visited].map(k=>k.split(':')[0]))].sort(),terminals:[...terminals].sort(),unresolved,closed:unresolved.length===0}
}
export function validateSS(graph) {
  const rebuilt=composeSS()
  if(JSON.stringify(graph)!==JSON.stringify(rebuilt))throw Error('Fragmento distinto del contrato reconstruido')
  return true
}
// Intérprete del DAG técnico para contraste, no nuevo oracle normativo.
export function evaluateSS(graph,caso,contexto) {
  return createSSEvaluator(graph)(caso,contexto)
}
export function createSSEvaluator(candidate) {
  validateSS(candidate)
  const graph=structuredClone(candidate)
  return (caso,contexto)=>evaluateSnapshot(graph,caso,contexto)
}
function evaluateSnapshot(graph,caso,contexto) {
  const ports=new Map(graph.ports.map(p=>[p.id,p]))
  const memo=new Map()
  function run(id,frame=null) {
    const cache=frame?.memo??memo
    if(cache.has(id))return cache.get(id)
    const value=calculate(id,frame)
    cache.set(id,value)
    return value
  }
  function calculate(id,frame) {
    const p=ports.get(id)
    if(!p)throw Error('Puerto ausente')
    if(p.op==='literal')return ['modo','tag'].includes(p.unit)?p.detail.value:new Decimal(p.detail.value)
    if(p.op==='input')return p.detail.path==='caso.anio'?new Decimal(caso.anio):p.detail.path==='contexto.modo'?contexto.modo:caso.rendimientos.trabajo
    if(p.op==='element') {if(!frame)throw Error('Elemento fuera de reduce');return new Decimal(frame.item[p.detail.property])}
    if(p.op==='accumulator') {if(!frame)throw Error('Acumulador fuera de reduce');return frame.total}
    if(p.op==='reduce')return run(p.args[0]).reduce((total,item,index)=>run(p.args[2],{total,item,index,memo:new Map()}),run(p.args[1]))
    if(p.op==='if')return run(p.args[run(p.args[0],frame)?1:2],frame)
    const a=run(p.args[0],frame),b=run(p.args[1],frame)
    switch(p.op) {
      case 'eq': return Decimal.isDecimal(a)?a.eq(b):a===b
      case 'gte': return a.gte(b)
      case 'lte': return a.lte(b)
      case 'plus': return a.plus(b)
      case 'minus': return a.minus(b)
      case 'mul': return a.mul(b)
      case 'div': return a.div(b)
      case 'min': return Decimal.min(a,b)
      case 'max': return Decimal.max(a,b)
      default: throw Error('Operación sin contrato: '+p.op)
    }
  }
  return Object.fromEntries(graph.sites.map(s=>[s.siteId,run(s.output).toString()]))
}
