import fs from 'node:fs'
import {createRequire} from 'node:module'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
const require=createRequire('/home/elies/Repos/IRoboPF/package.json')
const ts=require('typescript')
export const BASE='50f9e949544e20d3e4e0bffc79b926d396267319'
const annual='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const files=['lib/dominio/laboral/cotizaciones-sociales.ts','lib/dominio/laboral/cotizaciones-perfil-uniforme.ts',annual,'lib/dominio/normativa/datos/seguridad-social-2012-2026.ts','lib/dominio/dinero/importe-monetario.ts','lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts','lib/dominio/explicacion/linea-calculo.ts','lib/observabilidad/auditoria-rendimiento.ts']
const primitiveNames=['Decimal','Match','EffectArray','Object','medirAuditoriaSync']
const sha=b=>createHash('sha256').update(b).digest('hex')
const children = (n) => {
  const a = []
  ts.forEachChild(n, (c) => {
    a.push(c)
  })
  return a
}
function walk(n) {
  return [n, ...children(n).flatMap(walk)]
}


// Gramática finita heredada y acotada a los cuerpos SS; no ejecuta texto TS.
function build() {
 const sources=[],asts=new Map()
 for(const file of files){const b=fs.readFileSync(file),base=execFileSync('git',['cat-file','blob',BASE+':'+file],{maxBuffer:8e6});if(!b.equals(base))throw Error('Fuente alterada: '+file);sources.push({file,sha256:sha(b)});asts.set(file,ts.createSourceFile(file,b.toString(),ts.ScriptTarget.Latest,true))}
  const ref = (n) => ({
    file: n.getSourceFile().fileName,
    start: n.getStart(),
    end: n.end,
    sha256: sources.find((s) => s.file === n.getSourceFile().fileName).sha256,
    offsetEncoding: "utf16",
  })
  const declarations = new Map()
  for (const [file, ast] of asts)
    for (const n of ast.statements) {
      // El anual aporta once salidas y dos bindings locales, no sus helpers
      // homónimos ni el compositor compartido. Nunca resolver por homonimia.
      if (file === annual) continue
      for (const d of ts.isVariableStatement(n)
        ? n.declarationList.declarations
        : ts.isFunctionDeclaration(n)
          ? [n]
          : []) {
        if (declarations.has(d.name.getText())) throw Error("Global ambiguo")
        declarations.set(d.name.getText(), { file, node: d })
      }
    }
  const program = [],
    globalBindings = [],
    pending = new Set(),
    compiled = new Map()
  function emit(n, op, args = [], data = {}) {
    const source = ref(n),
      id = `${source.file}:${source.start}:${source.end}:${op}`
    if (!compiled.has(id)) {
      const x = { id, op, args, data, source }
      compiled.set(id, x)
      program.push(x)
    }
    return id
  }
  function pattern(n) {
    if (ts.isIdentifier(n)) return { name: n.text }
    if (ts.isObjectBindingPattern(n))
      return {
        fields: n.elements.map((e) => ({
          key: e.propertyName?.getText() ?? e.name.getText(),
          binding: pattern(e.name),
        })),
      }
    throw Error("Binding no soportado: " + n.getText())
  }
  function lower(n, scope = new Set()) {
    if (!n) throw Error("Nodo ausente")
    if (
      ts.isParenthesizedExpression(n) ||
      ts.isAsExpression(n) ||
      ts.isSatisfiesExpression(n) ||
      ts.isNonNullExpression(n)
    )
      return lower(n.expression, scope)
    if (ts.isIdentifier(n)) {
      const name = n.text
      if (!scope.has(name) && !primitiveNames.includes(name)) pending.add(name)
      return emit(n, scope.has(name) ? "local" : "global", [], { name })
    }
    if (
      ts.isNumericLiteral(n) ||
      ts.isStringLiteral(n) ||
      ts.isNoSubstitutionTemplateLiteral(n)
    )
      return emit(n, "literal", [], {
        value: ts.isNumericLiteral(n) ? Number(n.text) : n.text,
      })
    if (
      [
        ts.SyntaxKind.TrueKeyword,
        ts.SyntaxKind.FalseKeyword,
        ts.SyntaxKind.NullKeyword,
      ].includes(n.kind)
    )
      return emit(n, "literal", [], {
        value:
          n.kind === ts.SyntaxKind.NullKeyword
            ? null
            : n.kind === ts.SyntaxKind.TrueKeyword,
      })
    if (ts.isRegularExpressionLiteral(n)) {
      const i = n.text.lastIndexOf("/")
      return emit(n, "regex", [], {
        pattern: n.text.slice(1, i),
        flags: n.text.slice(i + 1),
      })
    }
    if (
      ts.isArrowFunction(n) ||
      ts.isFunctionExpression(n) ||
      ts.isFunctionDeclaration(n)
    ) {
      const inner = new Set(scope),
        params = n.parameters.map((p) => ({
          binding: pattern(p.name),
          rest: !!p.dotDotDotToken,
          default: p.initializer ? lower(p.initializer, scope) : null,
        }))
      for (const p of n.parameters)
        for (const i of walk(p.name).filter(ts.isIdentifier)) inner.add(i.text)
      return emit(n, "function", [lower(n.body, inner)], { parameters: params })
    }
    if (ts.isBlock(n)) {
      const inner = new Set(scope)
      for (const st of n.statements)
        if (ts.isVariableStatement(st))
          for (const d of st.declarationList.declarations)
            for (const i of walk(d.name).filter(ts.isIdentifier))
              inner.add(i.text)
      return emit(
        n,
        "block",
        n.statements.map((s) => lower(s, inner))
      )
    }
    if (ts.isVariableStatement(n))
      return emit(
        n,
        "declarations",
        n.declarationList.declarations.map((d) =>
          emit(d, "bind", [lower(d.initializer, scope)], {
            binding: pattern(d.name),
          })
        )
      )
    if (ts.isReturnStatement(n))
      return emit(n, "return", n.expression ? [lower(n.expression, scope)] : [])
    if (ts.isThrowStatement(n))
      return emit(n, "throw", [lower(n.expression, scope)])
    if (ts.isExpressionStatement(n) || ts.isYieldExpression(n))
      return emit(n, "pass", [lower(n.expression, scope)])
    if (ts.isIfStatement(n))
      return emit(n, "if", [
        lower(n.expression, scope),
        lower(n.thenStatement, scope),
        ...(n.elseStatement ? [lower(n.elseStatement, scope)] : []),
      ])
    if (ts.isSwitchStatement(n))
      return emit(n, "switch", [
        lower(n.expression, scope),
        ...n.caseBlock.clauses.map((c) =>
          emit(
            c,
            "case",
            [
              ...(c.expression ? [lower(c.expression, scope)] : []),
              ...c.statements.map((s) => lower(s, scope)),
            ],
            { fallback: !c.expression }
          )
        ),
      ])
    if (ts.isConditionalExpression(n))
      return emit(
        n,
        "conditional",
        [n.condition, n.whenTrue, n.whenFalse].map((x) => lower(x, scope))
      )
    if (ts.isBinaryExpression(n))
      return emit(n, "binary", [lower(n.left, scope), lower(n.right, scope)], {
        operator: n.operatorToken.getText(),
      })
    if (ts.isPrefixUnaryExpression(n))
      return emit(n, "unary", [lower(n.operand, scope)], {
        operator: ts.tokenToString(n.operator),
      })
    if (ts.isPropertyAccessExpression(n))
      return emit(n, "get", [lower(n.expression, scope)], {
        key: n.name.text,
        optional: !!n.questionDotToken,
      })
    if (ts.isElementAccessExpression(n))
      return emit(
        n,
        "index",
        [lower(n.expression, scope), lower(n.argumentExpression, scope)],
        { optional: !!n.questionDotToken }
      )
    if (ts.isCallExpression(n) || ts.isNewExpression(n))
      return emit(n, ts.isNewExpression(n) ? "new" : "call", [
        lower(n.expression, scope),
        ...(n.arguments ?? []).map((a) => lower(a, scope)),
      ])
    if (ts.isSpreadElement(n) || ts.isSpreadAssignment(n))
      return emit(n, "spread", [lower(n.expression, scope)])
    if (ts.isArrayLiteralExpression(n))
      return emit(
        n,
        "array",
        n.elements.map((e) => lower(e, scope))
      )
    if (ts.isObjectLiteralExpression(n))
      return emit(
        n,
        "object",
        n.properties.map((p) => {
          if (ts.isSpreadAssignment(p)) return lower(p, scope)
          return emit(
            p,
            "property",
            [
              lower(
                ts.isShorthandPropertyAssignment(p) ? p.name : p.initializer,
                scope
              ),
            ],
            { key: ts.isStringLiteral(p.name) ? p.name.text : p.name.getText() }
          )
        })
      )
    if (ts.isTemplateExpression(n))
      return emit(
        n,
        "template",
        n.templateSpans.map((s) => lower(s.expression, scope)),
        {
          strings: [n.head.text, ...n.templateSpans.map((s) => s.literal.text)],
        }
      )
    throw Error(
      "Gramática finita no cubre " +
        ts.SyntaxKind[n.kind] +
        ": " +
        n.getText().slice(0, 100)
    )
  }
  const annualBindings=[]
  for(const name of ['rendimientoIntegroTrabajo','cotizacionesSociales']) {
    const matches=walk(asts.get(annual)).filter(n=>ts.isVariableDeclaration(n)&&n.name.getText()===name&&n.initializer&&ts.isCallExpression(n.initializer)&&n.initializer.expression.getText()==='medirAuditoriaSync')
    if(matches.length!==1)throw Error('Instancia anual ambigua: '+name)
    const n=matches[0]
    annualBindings.push({name,node:lower(n.initializer,new Set(['caso','contexto','rendimientoIntegroTrabajo'])),source:ref(n)})
  }
  const outputBindings=[]
  for(const n of walk(asts.get(annual)).filter(ts.isCallExpression)) {
    if(n.expression.getText()!=='crearLineaCalculo'||!ts.isObjectLiteralExpression(n.arguments[0]))continue
    const obj=n.arguments[0],field=k=>obj.properties.find(p=>p.name?.getText()===k)?.initializer
    const site=field('siteId')
    if(!site||!ts.isStringLiteral(site)||!site.text.startsWith('anual.ss.'))continue
    outputBindings.push({siteId:site.text,node:lower(n,new Set(['caso','contexto','rendimientoIntegroTrabajo','cotizacionesSociales'])),amount:lower(field('importe'),new Set(['rendimientoIntegroTrabajo','cotizacionesSociales'])),instance:lower(field('instancia')),unit:'EUR',frequency:'anual',destination:'origen.decimal',source:ref(n)})
  }
  for(const name of ['crearLineaCalculo','calcularDesgloseCotizacionesPerfilUniforme','calcularDesgloseCotizacionesSocialesLegacy'])pending.add(name)
  while(pending.size) {
    const name=pending.values().next().value;pending.delete(name)
    if(globalBindings.some(b=>b.name===name))continue
    const d=declarations.get(name)
    if(!d)throw Error('Global sin frontera: '+name)
    globalBindings.push({name,node:lower(d.node.initializer??d.node),source:ref(d.node)})
  }
  const byId=new Map(program.map(n=>[n.id,n]))
  // Contexto AST: declaración, propiedad, celda y rama runtime concretas.
  const contexts=new Map()
  for(const [file,ast] of asts)for(const n of walk(ast)) {
    const ancestors=[]
    for(let child=n,a=n.parent;a;child=a,a=a.parent){
      if(ts.isVariableDeclaration(a)||ts.isPropertyAssignment(a))ancestors.unshift(a.name.getText())
      if(ts.isArrayLiteralExpression(a))ancestors.unshift('index:'+a.elements.indexOf(child))
      if(ts.isCallExpression(a)&&a.expression.getText()==='Match.when')ancestors.push('when:'+a.arguments[0].getText())
    }
    contexts.set(file+':'+n.getStart()+':'+n.end,ancestors)
  }
  const cells=program.filter(n=>(n.op==='literal'||n.op==='global'&&n.data.name==='IMPORTE_CERO')&&['BASE_MAXIMA_COTIZACION_LEGACY','TIPOS_SEGURIDAD_SOCIAL_LEGACY','obtenerTiposMei','obtenerPoliticaSolidaridad','tiposSolidaridad','SIN_SOLIDARIDAD'].some(name=>contexts.get(n.source.file+':'+n.source.start+':'+n.source.end)?.includes(name))).map(n=>({id:n.id,value:n.data.value??n.data.name,path:contexts.get(n.source.file+':'+n.source.start+':'+n.source.end),unit:contexts.get(n.source.file+':'+n.source.start+':'+n.source.end).includes('BASE_MAXIMA_COTIZACION_LEGACY')?'EUR':Number.isInteger(n.data.value)&&n.data.value>=2012&&n.data.value<=2026?'ejercicio':String(n.data.value).includes('Solidaridad')?'tag':'ratio',source:n.source}))
  const calls=program.filter(n=>n.op==='call').map(n=>{
    const target=byId.get(n.args[0]),key=target.data.key??target.data.name
    const callbackIds=n.args.slice(1).filter(id=>byId.get(id)?.op==='function')
    const isReduce=key==='reduce'
    return {id:n.id,target:n.args[0],arguments:n.args.slice(1),callbacks:callbackIds.map(id=>({node:id,parameters:byId.get(id).data.parameters,captures:'lexical-environment-per-invocation'})),receiver:target.op==='get'?target.args[0]:null,operation:key??'selected-function',seed:isReduce?n.args[2]:null,indices:isReduce?'0..length-1':key==='values'?'own-enumerable-insertion-order':null,cardinality:isReduce?'one-callback-per-index;empty=seed':null,source:n.source}
  })
  const unitContracts=[
    ['sumarRendimientosTrabajo',['array<importeIntegroCentimos:centimos>','centimos->EUR'],'EUR'],
    ['centimosAEuros',['centimos'],'EUR'],['crearImporteMonetario',['decimal-value'],'contextual'],
    ['obtenerParametrosCotizacionLegacy',['ejercicio'],'{baseMaxima:EUR,tiposSeguridadSocial:ratio,mei:ratio,solidaridad:policy}'],
    ['obtenerTiposMei',['ejercicio'],'{empresarial:ratio,trabajador:ratio}'],
    ['obtenerPoliticaSolidaridad',['ejercicio'],'tag+three-ratios'],
    ['sumarTipoCotizacionLegacy',['parameters','lado'],'ratio'],
    ['tipoCotizacionPorLado',['{empresarial:ratio,trabajador:ratio}','lado'],'ratio'],
    ['baseCotizacionPara',['EUR','parameters'],'{baseOrdinaria:EUR,excesoBase:EUR}'],
    ['minimo',['EUR','EUR'],'EUR'],['maximo',['EUR','EUR'],'EUR'],
    ['calcularTotalSolidaridad',['{baseOrdinaria:EUR,excesoBase:EUR}','parameters'],'EUR'],
    ['repartirCotizacionSolidaridad',['EUR'],'{cotizacionEmpresarial:EUR,cotizacionTrabajador:EUR}'],
    ['sumarCotizacionesSociales',['totals:EUR','totals:EUR'],'totals:EUR'],
    ['cuotaSolidaridad',['EUR','EUR','tuple3<ratio>'],'EUR'],
    ['calcularDesgloseCotizacionesSocialesLegacy',['{anio:ejercicio,salarioBrutoAnual:EUR}'],'breakdown:EUR'],
    ['calcularDesgloseCotizacionesPerfilUniforme',['{anio:ejercicio,salarioBrutoAnual:EUR}'],'breakdown:EUR'],
    ['crearLineaCalculo',['{importe:EUR,unidad:EUR,instancia:index}'],'origen.decimal:EUR-string']
  ].map(([name,parameters,result])=>({id:name,parameters,result,frequency:'anual',binding:globalBindings.find(b=>b.name===name)}))
  const fieldUnits=program.filter(n=>['get','property','index'].includes(n.op)).map(n=>({id:n.id,key:n.data.key??null,owner:n.args[0]??null,unit:n.data.key==='importeIntegroCentimos'?'centimos':n.data.key==='anio'?'ejercicio':n.data.key==='modo'?'modo':['empresarial','trabajador','tipoPrimerExceso','tipoSegundoExceso','tipoExcesoRestante'].includes(n.data.key)?'ratio':['baseMaxima','baseOrdinaria','excesoBase','salarioBrutoAnual'].includes(n.data.key)||String(n.data.key).startsWith('cotizacion')||String(n.data.key).startsWith('mei')||String(n.data.key).startsWith('solidaridadE')||String(n.data.key).startsWith('solidaridadT')?'EUR':'structural',source:n.source}))
  const literalUnits=program.filter(n=>n.op==='literal').map(n=>{
    const path=contexts.get(n.source.file+':'+n.source.start+':'+n.source.end),v=n.data.value,cell=cells.find(c=>c.id===n.id)
    const astNode=walk(asts.get(n.source.file)).find(a=>a.getStart()===n.source.start&&a.end===n.source.end)
    const index=ts.isElementAccessExpression(astNode.parent)&&astNode.parent.argumentExpression===astNode
    const unit=index?'index':cell?cell.unit:Number.isInteger(v)&&v>=2012&&v<=2026?'ejercicio':path.includes('sumarRendimientosTrabajo')&&v===0?'centimos':path.includes('centimosAEuros')&&v===100?'centimos/EUR':path.includes('IMPORTE_CERO')?'contextual-zero':path.includes('calcularDesgloseCotizacionesPerfilUniforme')&&[12,7,5].includes(v)?'meses':['3751.20','3803.70'].includes(v)?'EUR/mes':path.includes('repartirCotizacionSolidaridad')?'reparto':path.includes('cuotaSolidaridad')&&v===0?'EUR':['0.10','0.50','0.1','0.4','0.5','0'].includes(v)?'ratio':['empresarial','trabajador'].includes(v)?'lado':v==='canonico'?'modo':path.includes('instancia')?'index':'metadata'
    return {id:n.id,value:v,unit,source:n.source}
  })
  const boundaries=[{id:'medirAuditoriaSync',source:ref(declarations.get('medirAuditoriaSync').node),behavior:'calcular() exactly once; return unchanged; instrumentation outside financial value; instrumentation exceptions not simulated'},{id:'admission',contractId:'anual-publico-r32',status:'pending-external',years:[2012,2026],modes:['canonico','compatible-legacy'],siteClosed:false}]
  return {version:1,kind:'flujo-ss-r36',base:BASE,sources,program,globalBindings,annualBindings,outputBindings,cells,calls,unitContracts,fieldUnits,literalUnits,boundaries,completeRuleAcceptance:false,wiringAllowed:false}
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b)
// Cada obligación compara operación, operandos ordenados, fuente/instancia y binding
// con su bajada AST. No usa un digest de receta como criterio de cierre.
export function inspectSS(candidate,expected=build()) {
  const obligations=[]
  for(const collection of ['program','globalBindings','annualBindings','outputBindings','cells','calls','unitContracts','fieldUnits','literalUnits','boundaries']) {
    const key=['globalBindings','annualBindings'].includes(collection)?'name':collection==='outputBindings'?'siteId':'id'
    const rows=candidate[collection]??[],index=new Map(rows.map(r=>[r[key],r]))
    if(index.size!==rows.length||rows.length!==expected[collection].length)obligations.push({id:collection+':cardinality',status:'pending',reason:'omission-or-duplicate'})
    for(const row of expected[collection]) {
      const id=collection+':'+row[key],got=index.get(row[key])
      const explicit=candidate.pending?.includes(id)
      obligations.push({id,status:!explicit&&same(got,row)?'satisfied':'pending',reason:explicit?'explicit-pending':same(got,row)?'exact-source-operation-operands-binding-unit-instance':'missing-or-incompatible'})
    }
  }
  const closed=obligations.every(o=>o.status==='satisfied')
  return {obligations,sites:expected.outputBindings.map(b=>({siteId:b.siteId,unit:'EUR',frequency:'anual',valueClosed:closed,selectionClosed:closed,admissionClosed:false,siteClosed:false,admissionRequirement:'anual-publico-r32'}))}
}
export function composeSS(){const g=build();/** @type {string[]} */ const pending=[];return {...g,pending,...inspectSS(g,g)}}
export function validateSS(g){if(!Array.isArray(g.pending)||new Set(g.pending).size!==g.pending.length)throw Error('Pendientes inválidos');const expected=build(),actual=inspectSS(g,expected);if(!same(g.obligations,actual.obligations)||!same(g.sites,actual.sites))throw Error('Cierres no derivados');for(const k of ['version','kind','base','sources','completeRuleAcceptance','wiringAllowed'])if(!same(g[k],expected[k]))throw Error('Frontera incompatible: '+k);if(g.pending.some(id=>!actual.obligations.some(o=>o.id===id))||actual.obligations.some(o=>o.status==='pending'&&!g.pending.includes(o.id)))throw Error('Correspondencia incompatible');return true}
