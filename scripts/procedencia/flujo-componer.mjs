import fs from 'node:fs'
import zlib from 'node:zlib'
import {pathToFileURL} from 'node:url'
import {Sources,ts,sha,property,siteCall,callArgument} from './flujo-ast.mjs'
import {closure,validate,identity} from './flujo-contrato.mjs'
import {adapt,stageContracts} from './flujo-adaptadores.mjs'
import {boundaries,guards} from './flujo-fronteras.mjs'
import {constant} from './flujo-constantes.mjs'
const input='docs/procedencia/correcciones/flujos-r28/'
export const destination='docs/procedencia/implementaciones/composicion-flujo-r28-sol/'
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'))
export function inputs(){const manifest=read(input+'rectificaciones.json');return manifest.artifacts.map(a=>{const bytes=fs.readFileSync(input+a.file);if(sha(bytes)!==a.sha256)throw Error('Input R28 alterado');const original=fs.readFileSync(a.from.path);if(sha(original)!==a.from.sha256)throw Error('Histórico alterado');return {id:a.file,sha256:a.sha256,historical:a.from,review:'pending-independent',body:JSON.parse(zlib.gunzipSync(bytes).toString('utf8'))}})}
export class Composer {
  sources=new Sources(); ports=[];edges=[];cache=new Map(); sequence=0
  port(node,prop,instance,unit,role){const source=this.sources.ref(node);return {id:'p:'+identity([source.file,source.start,source.end,prop,instance,unit,role]),source,symbol:node.getText().slice(0,160),property:prop||'value',instance,unit,role,terminal:null,unresolved:null}}
  link(from,to,node,role='value',condition='true',binding=null,conversion=null){const e={id:'e:'+this.sequence++,from:from.id,to:to.id,role,condition,evidence:[this.sources.ref(node)],binding,conversion,review:'pending-independent'};this.edges.push(e)}
  trace(node,prop='',env=new Map(),instance='public',unit='EUR',role='value',depth=0){
    const p=this.port(node,prop,instance,unit,role);if(this.cache.has(p.id))return this.cache.get(p.id);this.cache.set(p.id,p);this.ports.push(p)
    const connect=(n,pr=prop,r=role,cond='true',u=unit,en=env,inst=instance,binding=null,conversion=null)=>{const from=this.trace(n,pr,en,inst,u,r,depth+1);this.link(from,p,node,r,cond,binding,conversion);return from}
    if(depth>80||this.ports.length>18000){p.unresolved='Límite explícito de recorrido';return p}
    if(ts.isParenthesizedExpression(node)||ts.isAsExpression(node)||ts.isSatisfiesExpression(node)||ts.isNonNullExpression(node))connect(node.expression)
    else if(ts.isNumericLiteral(node)||ts.isStringLiteral(node)||[ts.SyntaxKind.TrueKeyword,ts.SyntaxKind.FalseKeyword,ts.SyntaxKind.NullKeyword].includes(node.kind)){p.terminal='literal'}
    else if(ts.isIdentifier(node)){
      if(node.text==='undefined'){p.terminal='literal';return p}
      const declaration=this.sources.declaration(node)
      if(!declaration){p.unresolved='Binding no resuelto: '+node.text;return p}
      const key=this.sources.ref(declaration);const bound=env.get(key.file+':'+key.start)
      if(bound){connect(bound.node,prop,role,'sustitución de argumento exacto',unit,bound.env,bound.instance);return p}
      if(ts.isBindingElement(declaration)){
        const owner=declaration.parent.parent,field=(declaration.propertyName??declaration.name).getText(),ref=this.sources.ref(owner),binding=env.get(ref.file+':'+ref.start)
        if(binding)connect(binding.node,[field,prop].filter(Boolean).join('.'),role,'sustitución por propiedad del argumento',unit,binding.env,binding.instance)
        else if(ts.isVariableDeclaration(owner)&&owner.initializer)connect(owner.initializer,[field,prop].filter(Boolean).join('.'))
        else p.unresolved='Parámetro destructurado sin instancia pública acreditada'
        return p
      }
      if(ts.isParameter(declaration)){
        const fn=declaration.parent;
        /** @type {import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').Node | undefined} */
        let owner=fn
        while(owner&&!ts.isVariableDeclaration(owner)&&!ts.isFunctionDeclaration(owner))owner=owner.parent
        const label=(owner&&(ts.isVariableDeclaration(owner)||ts.isFunctionDeclaration(owner)))?owner.name?.getText():null
        if(['liquidarTrabajoIndividualSimple','pasoRetencionTrabajoAeat'].includes(label)){
          const calls=[];const symbol=owner&&(ts.isVariableDeclaration(owner)||ts.isFunctionDeclaration(owner))?owner.name:null
          const walk=n=>{if(ts.isCallExpression(n)&&n.expression.getText()===symbol?.getText())calls.push(n);ts.forEachChild(n,walk)};walk(node.getSourceFile())
          const index=fn.parameters.indexOf(declaration)
          if(calls.length===1&&calls[0].arguments[index]){connect(calls[0].arguments[index],prop,role,'binding único desde servicio anual',unit,env,instance+':caller:'+calls[0].getStart(),{call:this.sources.ref(calls[0]),argument:this.sources.ref(calls[0].arguments[index]),index});return p}
        }
        if(label==='construirLiquidarIrpfAnual'&&ts.isFunctionExpression(fn)&&fn.asteriskToken&&['caso','contexto'].includes(node.text)){p.terminal='public-input';p.property=prop||node.text;return p}
        if((['liquidarIrpfAnual','liquidarIrpfAnualDesdeServicio'].includes(label)&&['caso','contexto'].includes(node.text))||(label==='calcularActividad2025'&&ts.isFunctionDeclaration(fn)&&node.text==='caso')||(label==='liquidarIrpfAnualExplicito'&&ts.isFunctionExpression(fn)&&fn.asteriskToken&&node.text==='entrada')){p.terminal='public-input';p.property=prop||declaration.name.getText()}
        else p.unresolved='Parámetro de auxiliar/callback sin binding: '+node.text
        return p
      }
      if(ts.isFunctionDeclaration(declaration)||(declaration.initializer&&(ts.isArrowFunction(declaration.initializer)||ts.isFunctionExpression(declaration.initializer)))){p.unresolved='Función sin instancia de llamada';return p}
      if(declaration.initializer){
        connect(declaration.initializer)
        let mutable=false;const scope=declaration.parent.parent.parent
        function scan(n){if(ts.isBinaryExpression(n)&&n.left.getText()===node.text&&[ts.SyntaxKind.EqualsToken,ts.SyntaxKind.PlusEqualsToken].includes(n.operatorToken.kind))mutable=true;ts.forEachChild(n,scan)}scan(scope)
        if(mutable)p.unresolved='Asignaciones y flujo imperativo pendientes: '+node.text
      }else p.unresolved='Declaración sin inicializador'
    }else if(ts.isPropertyAccessExpression(node))connect(node.expression,[node.name.text,prop].filter(Boolean).join('.'))
    else if(ts.isElementAccessExpression(node)&&(ts.isNumericLiteral(node.argumentExpression)||ts.isStringLiteral(node.argumentExpression)))connect(node.expression,[node.argumentExpression.text,prop].filter(Boolean).join('.'))
    else if(ts.isArrayLiteralExpression(node)){const [head,...tail]=prop.split('.');const index=Number(head);if(prop&&Number.isInteger(index)&&index>=0&&node.elements[index])connect(node.elements[index],tail.join('.'));else p.unresolved='Array completo requiere contrato por elemento'}
    else if(ts.isYieldExpression(node)){p.unresolved='Admisión Effect/servicio pendiente';if(node.expression)connect(node.expression)}
    else if(ts.isElementAccessExpression(node)){
      // Subconjunto cerrado: tabla anual literal de máximos. No convierte el objeto
      // ni la selección dinámica en terminal; conserva una arista por celda.
      const d=ts.isIdentifier(node.expression)?this.sources.declaration(node.expression):null
      let init=d&&ts.isVariableDeclaration(d)?d.initializer:null
      while(init&&(ts.isAsExpression(init)||ts.isSatisfiesExpression(init)))init=init.expression
      if(d?.getSourceFile().fileName==='lib/dominio/normativa/datos/seguridad-social-2012-2026.ts'&&node.expression.getText()==='BASE_MAXIMA_COTIZACION_LEGACY'&&init&&ts.isObjectLiteralExpression(init)){
        connect(node.argumentExpression,'','selection','ejercicio: solo claves de tabla; clave ausente no admitida','selector')
        for(const field of init.properties){if(!ts.isPropertyAssignment(field)){p.unresolved='Celda no literal';continue}connect(field.initializer,prop,role,node.argumentExpression.getText()+' === '+field.name.getText())}
      }else {p.unresolved='Índice dinámico/array: requiere contrato por elemento';connect(node.expression);if(node.argumentExpression)connect(node.argumentExpression,'','selection','selección de elemento','selector')}
    }
    else if(ts.isObjectLiteralExpression(node)){
      if(node.properties.some(ts.isSpreadAssignment))p.unresolved='Spread requiere contrato de precedencia por propiedad'
      if(!prop){p.unresolved='Objeto completo: se exige propiedad de salida';return p}
      const [head,...tail]=prop.split('.'),field=property(node,head)
      if(field&&ts.isPropertyAssignment(field))connect(field.initializer,tail.join('.'))
      else if(field&&ts.isShorthandPropertyAssignment(field))connect(field.name,tail.join('.'))
      else p.unresolved='Propiedad no resuelta (spread/alias): '+prop
    }else if(ts.isConditionalExpression(node)){
      const selected=constant(this.sources,node.condition,env)
      connect(node.condition,'','selection','selecciona rama','selector')
      if(!selected.known||selected.value)connect(node.whenTrue,prop,role,node.condition.getText())
      if(!selected.known||!selected.value)connect(node.whenFalse,prop,role,'!('+node.condition.getText()+')')
    }else if(ts.isBinaryExpression(node)){
      if(prop)p.unresolved='Propiedad de operación binaria no resuelta'
      connect(node.left,'');connect(node.right,'',role,ts.tokenToString(node.operatorToken.kind)??'operación')
    }else if(ts.isPrefixUnaryExpression(node))connect(node.operand,'')
    else if(ts.isNewExpression(node)&&['D','Decimal'].includes(node.expression.getText())){
      p.terminal=null;for(const arg of node.arguments??[])connect(arg,'',role,'constructor Decimal');if(!node.arguments?.length)p.unresolved='Constructor sin argumento'
    }else if(ts.isCallExpression(node))this.call(node,p,prop,env,instance,unit,role,depth,connect)
    else {p.unresolved='Forma AST no admitida: '+ts.SyntaxKind[node.kind]}
    return p
  }
  call(node,p,prop,env,instance,unit,role,depth,connect){
    const name=node.expression.getText(),parts=name.split('.'),method=parts.at(-1)
    const decimalMethods=['plus','minus','mul','times','div','dividedBy','abs','negated','toFixed','toString','toNumber','toDecimalPlaces','trunc','floor','ceil','min','max','eq','gt','gte','lt','lte','lessThan','greaterThan','isZero']
    if(ts.isPropertyAccessExpression(node.expression)&&decimalMethods.includes(method)){
      // A method is primitive only when its receiver is established as Decimal below.
      const receiver=node.expression.expression,isStatic=['D','Decimal'].includes(receiver.getText())
      if(!isStatic){const r=connect(receiver,'',role,'receptor de operación Decimal');if(r.unresolved)p.unresolved='Receptor Decimal no demostrado'}
      for(const a of node.arguments)connect(a,'',role,'argumento de '+method)
      if(isStatic&&!node.arguments.length)p.unresolved='Primitiva sin argumentos'
      return
    }
    if(['centimosAEuros','eurosACentimos'].includes(name)&&node.arguments.length===1){
      const expected=name==='centimosAEuros'?'EUR':'centimos',inputUnit=name==='centimosAEuros'?'centimos':'EUR'
      if(unit!==expected){p.unresolved='Unidad de salida no acreditada: '+name;return}
      connect(node.arguments[0],'',role,'conversión monetaria explícita',inputUnit,env,instance,{call:this.sources.ref(node),argument:this.sources.ref(node.arguments[0]),index:0},name==='centimosAEuros'?'centimos-a-EUR':'EUR-a-centimos')
      const declaration=this.sources.declaration(node.expression)
      if(!declaration)p.unresolved='Conversor no resuelto'
      else {const primitive=this.port(declaration,'signature:'+name,'primitive:'+name,expected,'value');primitive.terminal='primitive';primitive.contract=name==='centimosAEuros'?'new Decimal(centimos).div(100)':'redondearHalfUp(euros,2).mul(100).toNumber()';if(!this.cache.has(primitive.id)){this.cache.set(primitive.id,primitive);this.ports.push(primitive)}this.link(primitive,p,node,'value','aplicación de la primitiva monetaria del módulo dinero')}
      return
    }
    if(name==='medirAuditoriaSync'&&node.arguments.length===2&&ts.isArrowFunction(node.arguments[1])&&!ts.isBlock(node.arguments[1].body)){
      const d=this.sources.declaration(node.expression)
      if(!d||d.getSourceFile().fileName!=='lib/observabilidad/auditoria-rendimiento.ts'){p.unresolved='Wrapper homónimo sin contrato';return}
      connect(node.arguments[1].body,prop,role,'si calcular devuelve; instrumentación no transforma el valor')
      this.edges.at(-1).evidence.push(this.sources.ref(d));return
    }
    if(ts.isPropertyAccessExpression(node.expression)&&method==='pipe'){
      const receiver=node.expression.expression
      if(ts.isCallExpression(receiver)&&receiver.expression.getText()==='Match.value'&&receiver.arguments.length===1){
        const selector=receiver.arguments[0];connect(selector,'','selection','selecciona Match','selector')
        let prior=[]
        for(const branch of node.arguments){
          if(!ts.isCallExpression(branch)||!['Match.when','Match.orElse'].includes(branch.expression.getText())){p.unresolved='Matcher no admitido';continue}
          const otherwise=branch.expression.getText()==='Match.orElse',callback=branch.arguments[otherwise?0:1],matcher=otherwise?null:branch.arguments[0]
          const condition=(prior.length?'ningún matcher previo ('+prior.join(' | ')+') && ':'')+(otherwise?'else':selector.getText()+' matches '+matcher.getText())
          if(matcher)prior.push(matcher.getText())
          if(!callback||!ts.isArrowFunction(callback)||ts.isBlock(callback.body)){p.unresolved='Callback Match no admitido';continue}
          const next=new Map(env)
          if(callback.parameters[0]){const r=this.sources.ref(callback.parameters[0]);next.set(r.file+':'+r.start,{node:selector,env,instance})}
          if(matcher&&ts.isArrowFunction(matcher)&&!ts.isBlock(matcher.body)){
            const predicateEnv=new Map(env)
            if(matcher.parameters[0]){const ref=this.sources.ref(matcher.parameters[0]);predicateEnv.set(ref.file+':'+ref.start,{node:selector,env,instance})}
            connect(matcher.body,'','selection',condition,'selector',predicateEnv,instance+':predicate:'+matcher.getStart())
          }
          connect(callback.body,prop,role,condition,unit,next,instance+':match:'+branch.getStart())
        }
        return
      }
    }
    let callee=node.expression
    while(ts.isParenthesizedExpression(callee))callee=callee.expression
    if(ts.isConditionalExpression(callee)){
      connect(callee.condition,'','selection','selección de función','selector')
      for(const {expression,condition} of [{expression:callee.whenTrue,condition:callee.condition.getText()},{expression:callee.whenFalse,condition:'!('+callee.condition.getText()+')'}]){
        const branchUse=(n,pr=prop,r=role,cond='true',u=unit,en=env,inst=instance,binding=null,conversion=null)=>connect(n,pr,r,condition+' && ('+cond+')',u,en,inst,binding,conversion)
        this.invoke(node,expression,p,prop,env,instance+':callee:'+expression.getStart(),unit,role,branchUse)
      }
      return
    }
    this.invoke(node,callee,p,prop,env,instance,unit,role,connect)
  }
  invoke(node,callee,p,prop,env,instance,unit,role,connect){
    const name=callee.getText(),declaration=ts.isIdentifier(callee)?this.sources.declaration(callee):null
    if(declaration?.getSourceFile().fileName==='lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts'&&name==='sumarRendimientosTrabajo'){
      const converter=this.sources.declaration(node.arguments[1])
      if(converter?.getSourceFile().fileName!=='lib/dominio/dinero/importe-monetario.ts'||converter.name.getText()!=='centimosAEuros'){p.unresolved='Conversor de acumulación distinto del contrato céntimos/EUR';return}
      connect(node.arguments[0],'*.importeIntegroCentimos',role,'Σ i=0..length-1: acumulador inicial 0 EUR; añadir convertir(elemento[i].importeIntegroCentimos), una vez por elemento; vacío=0 EUR',unit==='EUR'?'centimos':unit,env,instance,{call:this.sources.ref(node),argument:this.sources.ref(node.arguments[0]),index:0},unit==='EUR'?'centimos-a-EUR':null)
      this.edges.at(-1).evidence.push(this.sources.ref(declaration),this.sources.ref(converter));return
    }
    if(declaration?.getSourceFile().fileName==='lib/dominio/laboral/cotizaciones-sociales.ts'&&name==='sumarTipoCotizacionLegacy'){
      const selected=constant(this.sources,node.arguments[1],env)
      connect(node.arguments[1],'','selection','selección de lado; empresarial o trabajador','selector')
      for(const side of ['empresarial','trabajador']){
        if(selected.known&&selected.value!==side)continue
        for(const field of ['comunes','desempleo','fogasa','fp','atep']){
          connect(node.arguments[0],'tiposSeguridadSocial.'+field+'.'+side,role,'suma con semilla 0; lado === '+side,unit,env,instance,{call:this.sources.ref(node),argument:this.sources.ref(node.arguments[0]),index:0})
          this.edges.at(-1).evidence.push(this.sources.ref(declaration))
        }
      }
      return
    }
    if(declaration&&ts.isParameter(declaration)){
      const ref=this.sources.ref(declaration),bound=env.get(ref.file+':'+ref.start)
      if(bound){this.invoke(node,bound.node,p,prop,bound.env,instance+':callback:'+ref.start,unit,role,connect);return}
    }
    /** @type {import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').Node | undefined} */ let fn=declaration
    if(declaration&&ts.isVariableDeclaration(declaration))fn=declaration.initializer
    if(!fn||!(ts.isArrowFunction(fn)||ts.isFunctionExpression(fn)||ts.isFunctionDeclaration(fn))||!fn.body){p.unresolved='Contrato de llamada pendiente: '+name;for(const a of node.arguments)connect(a,'',role,'argumento conservado sin afirmar cierre');return}
    const callRef=this.sources.ref(node),next=new Map(env),callInstance=instance+'/'+callRef.file+':'+callRef.start
    fn.parameters.forEach((param,i)=>{const actual=node.arguments[i]??param.initializer;if(actual){const r=this.sources.ref(param);next.set(r.file+':'+r.start,{node:actual,env,instance})}})
    const body=fn.body,returns=[]
    if(ts.isBlock(body))for(const statement of body.statements){if(!ts.isVariableStatement(statement)&&!ts.isReturnStatement(statement)){p.unresolved='Control imperativo/admisión pendiente: '+name;break}} 
    function walk(n,guards){if(n!==body&&ts.isFunctionLike(n))return;if(ts.isIfStatement(n)){walk(n.thenStatement,[...guards,{node:n.expression,truth:true}]);if(n.elseStatement)walk(n.elseStatement,[...guards,{node:n.expression,truth:false}]);return}if(ts.isReturnStatement(n)&&n.expression)returns.push({node:n.expression,guards});else ts.forEachChild(n,c=>walk(c,guards))}
    if(ts.isBlock(body))walk(body,[]);else returns.push({node:body,guards:[]})
    if(returns.length!==1)p.unresolved='Retornos/guardas imperativas requieren contrato: '+name
    for(const ret of returns){for(const g of ret.guards)connect(g.node,'','selection',String(g.truth),'selector',next,callInstance);connect(ret.node,prop,role,'retorno de '+name,unit,next,callInstance)}
  }
}
export function compose(){
  const batches=inputs(),composer=new Composer(),sites=[],historical=[]
  for(const batch of batches){if(Array.isArray(batch.body))continue;const graph=batch.body
    for(const old of graph.edges){historical.push({input:batch.id,identity:old.id??identity(old),direction:graph.direction??graph.edgeDirection??'producer-to-consumer',record:old,status:'pending-independent',usedForClosure:false})}
    for(const s of graph.sites){let refs=s.currentSource??s.source;if(!Array.isArray(refs))refs=[{...refs,text:s.expression}];const call=siteCall(composer.sources,refs[0]),object=call.arguments[0],value=property(object,'importe'),unit=property(object,'unidad').initializer.text
      const output=composer.trace(value.initializer,'',new Map(),'entry:'+call.getSourceFile().fileName,unit)
      sites.push({siteId:s.siteId,historical:{input:batch.id,subject:s.subject,snapshot:s.historicalSnapshot??s.snapshot,record:s},source:composer.sources.ref(call),formula:property(object,'formula').initializer.getText(),output:output.id,conditions:guards(call,composer.sources),domain:{status:'pending-exact-admission-contract',valueIsNotAdmission:true},closed:false,closure:null,producerMap:[],branches:[],review:'pending-independent',legalReservations:'Evidencia técnica candidata; integridad, autenticidad, valor, interpretación y aplicabilidad separados; ninguna aceptación jurídica.'})
    }
  }
  const stages=batches.find(b=>b.id==='instancias.candidato.json.gz').body.map((s,index)=>{const arg=callArgument(composer.sources,s.source,3,s.argument4),p=composer.trace(arg,'',new Map(),'activity-isolated','EUR');return {index,rule:s.regla,instance:s.instance,source:s.source,argument:s.argument4,condition:s.control,annualExclusions:s.annualExclusions,output:p.id,transport:{isolated:'etapas',annual:index<2?'unreachable-activos':'conditional',aporte:index===1?false:'separate-property'},closed:false}})
  const result={version:1,review:'pending-independent',completeRuleAcceptance:false,wiringAllowed:false,inputs:batches.map(({body,...b})=>b),ports:composer.ports,edges:composer.edges,sites,stages,historical,historicalNodes:batches.filter(b=>!Array.isArray(b.body)).map(b=>({input:b.id,nodes:b.body.nodes??[]})),boundaries:boundaries(composer.sources),adapted:batches.flatMap(adapt),stageContracts:stageContracts(batches.find(b=>b.id==='instancias.candidato.json.gz').body,composer.sources)}
  for(const s of sites){s.closure=closure(result,s.output);s.closed=s.closure.closed;s.producerMap=s.closure.ports.map(id=>{const p=composer.cache.get(id);return {id,source:p.source,symbol:p.symbol,property:p.property,instance:p.instance,unit:p.unit,role:p.role,terminal:p.terminal,unresolved:p.unresolved}});const reached=new Set(s.closure.relations);s.branches=result.edges.filter(e=>reached.has(e.id)&&e.condition!=='true').map(e=>({relation:e.id,condition:e.condition,role:e.role,evidence:e.evidence}))}
  for(const s of stages){s.closure=closure(result,s.output);s.closed=s.closure.closed}
  validate(result,composer.sources);return result
}
export function verifyCandidate(candidate){const expected=compose();validate(candidate);if(identity(candidate)!==identity(expected))throw Error('Derivación distinta de receta AST fijada; requiere revisión y versión nueva');return true}
export function generate(){const g=compose();fs.writeFileSync(destination+'composicion.json.gz',zlib.gzipSync(JSON.stringify(g,null,2)+'\n',{level:9}));fs.writeFileSync(destination+'omisiones.json.gz',zlib.gzipSync(JSON.stringify(g.sites.map(s=>({siteId:s.siteId,closed:s.closed,domain:s.domain,pending:s.closure.unresolved.map(u=>({...u,port:s.producerMap.find(p=>p.id===u.port)}))})),null,2)+'\n',{level:9}));fs.mkdirSync(destination+'sitios',{recursive:true});for(const s of g.sites){const ps=new Map(g.ports.map(p=>[p.id,p]));const lines=s.closure.ports.map(id=>{const p=ps.get(id);return `- ${p.symbol} / ${p.property} (${p.unit}, ${p.role}); ${p.terminal??p.unresolved??'productor'}; ${p.source.file}:${p.source.start}–${p.source.end}`});fs.writeFileSync(destination+'sitios/'+s.siteId+'.md',`# ${s.siteId}\n\nCandidato pendiente de revisión independiente. Cierre técnico: ${s.closed}. Publicación y aceptación jurídica: false.\n\nFórmula TS: ${s.formula}\n\n${s.legalReservations}\n\n${lines.join('\n')}\n\n## Condiciones por relación\n\n${s.branches.map(b=>'- ['+b.role+'] '+b.condition+'; '+b.relation).join('\n')}\n\nAdmisión del dominio: pendiente; un valor trazado no acredita admisión. Evidencia AST exacta por relación en composicion.json.gz.\n`)}
 fs.mkdirSync(destination+'etapas',{recursive:true})
 for(const stage of g.stages)fs.writeFileSync(destination+'etapas/'+String(stage.index).padStart(2,'0')+'.md', '# Etapa '+stage.index+' / '+stage.instance+'\n\nRegla: '+stage.rule+'\n\nValor TS: '+stage.argument.text+'\n\nCondición: '+stage.condition+'\n\nReserva anual: '+stage.annualExclusions+'\n\nTransporte aislado: etapas. Aporte es una propiedad separada.\n\nCierre técnico: '+stage.closed+'. Revisión independiente pendiente. Aceptación fiscal: false.\n\nPendientes: '+stage.closure.unresolved.map(u=>u.reason).join('; ')+'\n')
 return g}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(process.argv[2]==='check'){verifyCandidate(JSON.parse(zlib.gunzipSync(fs.readFileSync(destination+'composicion.json.gz')).toString('utf8')));console.log('Candidato idéntico a receta fijada; aceptación jurídica false')}
 else {const g=generate();console.log(JSON.stringify({sites:g.sites.length,ports:g.ports.length,edges:g.edges.length,closed:g.sites.filter(s=>s.closed).map(s=>s.siteId),unresolved:g.sites.map(s=>({siteId:s.siteId,pending:s.closure.unresolved}))},null,2))}
}
