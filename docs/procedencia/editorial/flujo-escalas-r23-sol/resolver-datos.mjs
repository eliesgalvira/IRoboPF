import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import zlib from 'node:zlib'
import ts from '/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js'
const root=process.cwd(), out='docs/procedencia/editorial/flujo-escalas-r23-sol'
const cache=new Map()
function moduleAt(file){
 if(cache.has(file)) return cache.get(file)
 const text=fs.readFileSync(file,'utf8'), sf=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true)
 const bindings=new Map(),imports=new Map()
 for(const stmt of sf.statements){
  if(ts.isVariableStatement(stmt)) for(const decl of stmt.declarationList.declarations) if(ts.isIdentifier(decl.name)) bindings.set(decl.name.text,decl.initializer)
  if(ts.isFunctionDeclaration(stmt)&&stmt.name) bindings.set(stmt.name.text,stmt)
  if(ts.isImportDeclaration(stmt)&&ts.isStringLiteral(stmt.moduleSpecifier)&&stmt.importClause?.namedBindings&&ts.isNamedImports(stmt.importClause.namedBindings)) for(const e of stmt.importClause.namedBindings.elements) imports.set(e.name.text,{file:path.normalize(path.join(path.dirname(file),stmt.moduleSpecifier.text+'.ts')),symbol:(e.propertyName??e.name).text})
 }
 const mod={file,sf,text,bindings,imports,hash:crypto.createHash('sha256').update(text).digest('hex')}; cache.set(file,mod);return mod
}
function anchor(mod,node){return {file:mod.file,sha256:mod.hash,start:node.getStart(mod.sf),end:node.end,offsetEncoding:'utf16',expression:node.getText(mod.sf)}}
function resolve(mod,node,props=[],env=new Map(),depth=0){
 if(depth>80) throw Error('Ciclo o profundidad excesiva')
 const next=(m,n,p=props,e=env)=>resolve(m,n,p,e,depth+1)
 if(!node) throw Error('Inicializador ausente')
 if(ts.isAsExpression(node)||ts.isSatisfiesExpression(node)||ts.isParenthesizedExpression(node)) return next(mod,node.expression)
 if(ts.isIdentifier(node)){
  if(env.has(node.text)){const b=env.get(node.text);return next(b.mod,b.node,[...props],b.env)}
  if(node.text==='Infinity') return {terminal:'external-number-Infinity',source:anchor(mod,node)}
  const imp=mod.imports.get(node.text)
  if(imp){const target=moduleAt(imp.file);return {step:'import',source:anchor(mod,node),target:imp,property:props,next:next(target,target.bindings.get(imp.symbol))}}
  if(mod.bindings.has(node.text)) return {step:'assignment',source:anchor(mod,node),property:props,next:next(mod,mod.bindings.get(node.text))}
 }
 if(ts.isPropertyAccessExpression(node)) return next(mod,node.expression,[node.name.text,...props])
 if(ts.isElementAccessExpression(node)&&node.argumentExpression&&(ts.isStringLiteral(node.argumentExpression)||ts.isNumericLiteral(node.argumentExpression))) return next(mod,node.expression,[node.argumentExpression.text,...props])
 if(ts.isObjectLiteralExpression(node)){
  if(props.length===0) return {step:'object-properties-in-source-order-last-write-wins',source:anchor(mod,node),properties:node.properties.map(p=>ts.isSpreadAssignment(p)?{spread:true,next:next(mod,p.expression,[])}:{property:p.name.getText(mod.sf).replaceAll('"',''),next:next(mod,ts.isPropertyAssignment(p)?p.initializer:p.name,[])})}
  const [key,...rest]=props
  for(const p of [...node.properties].reverse()){
   if(ts.isSpreadAssignment(p)){
    try{return {step:'spread-in-order',source:anchor(mod,p),property:props,next:next(mod,p.expression)}}catch(error){if(error.message.startsWith('Propiedad ausente'))continue;throw error}
   }
   if((ts.isPropertyAssignment(p)||ts.isShorthandPropertyAssignment(p))&&p.name.getText(mod.sf).replaceAll('"','')===key) return {step:'property',source:anchor(mod,p),property:props,next:next(mod,ts.isPropertyAssignment(p)?p.initializer:p.name,rest)}
  }
  throw Error(`Propiedad ausente ${mod.file}:${props.join('.')}`)
 }
 if(ts.isArrayLiteralExpression(node)){
  if(props.length){const [key,...rest]=props;return next(mod,node.elements[Number(key)],rest)}
  return {step:'array',source:anchor(mod,node),elements:node.elements.map((e,i)=>({index:i,next:next(mod,e,[])}))}
 }
 if(ts.isSpreadElement(node)) return {step:'array-spread',source:anchor(mod,node),next:next(mod,node.expression)}
 if(ts.isNewExpression(node)&&node.expression.getText(mod.sf)==='Decimal') return {step:'Decimal-constructor',source:anchor(mod,node),next:next(mod,node.arguments[0],[])}
 if(ts.isCallExpression(node)){
  const name=node.expression.getText(mod.sf)
  if(name==='importe'||name==='crearImporteMonetario') return {step:'Decimal-constructor',source:anchor(mod,node),next:next(mod,node.arguments[0],[])}
  if(name==='tipo') return {step:'percent-to-fraction-div100',source:anchor(mod,node),next:next(mod,node.arguments[0],[])}
  if(name==='filas') return {step:'triples-to-row-properties',columns:['baseInferior','cuota','tipo'],source:anchor(mod,node),next:next(mod,node.arguments[0],[])}
  if(name==='parametroNormativo'||name==='minimos'||/^escala\d*$/.test(name)||name.startsWith('reutilizarEscala2025ConFuente')) return {step:'wrapper-property-preserving',source:anchor(mod,node),property:props,next:next(mod,node.arguments[0])}
  // Helpers numéricos de mínimos: sustitución posicional de parámetros, sin ejecutar código.
  const fn=mod.bindings.get(name)
  if(fn&&(ts.isArrowFunction(fn)||ts.isFunctionDeclaration(fn))){
   const local=new Map(env)
   fn.parameters.forEach((p,i)=>{if(!ts.isIdentifier(p.name))throw Error('Parámetro no identificador');local.set(p.name.text,{mod,node:node.arguments[i]??p.initializer,env})})
   if(ts.isBlock(fn.body)) for(const stmt of fn.body.statements) if(ts.isVariableStatement(stmt)) for(const d of stmt.declarationList.declarations) if(ts.isIdentifier(d.name)) local.set(d.name.text,{mod,node:d.initializer,env:new Map(local)})
   const body=ts.isBlock(fn.body)?fn.body.statements.find(ts.isReturnStatement)?.expression:fn.body
   return {step:'helper-argument-substitution',source:anchor(mod,node),property:props,next:next(mod,body,props,local)}
  }
 }
 if(ts.isStringLiteral(node)||ts.isNumericLiteral(node)||node.kind===ts.SyntaxKind.TrueKeyword||node.kind===ts.SyntaxKind.FalseKeyword) return {terminal:'literal',source:anchor(mod,node),value:node.getText(mod.sf)}
 throw Error(`Sin resolver: ${mod.file} ${node.getText(mod.sf).slice(0,100)} props=${props.join('.')}`)
}
const communities=['simulada-estatal','andalucia','aragon','asturias','illes-balears','canarias','cantabria','castilla-la-mancha','castilla-y-leon','catalunya','extremadura','galicia','madrid','murcia','la-rioja','comunitat-valenciana','ceuta','melilla']
const records=[],errors=[]
function record(file,symbol,props,context){
 const mod=moduleAt(file)
 try{records.push({...context,symbol,property:props,chain:resolve(mod,mod.bindings.get(symbol),props)})}catch(error){errors.push({...context,symbol,message:error.message})}
}
for(let year=2012;year<=2025;year++)for(const community of communities){
 for(const domain of ['escala','minimos']){
  const file=`lib/dominio/normativa/datos/${domain==='escala'?'irpf-autonomico':'minimos-autonomicos'}-${year}.ts`, mod=moduleAt(file)
  const symbol=domain==='escala'?`ESCALAS_AUTONOMICAS_IRPF_${year}`:`MINIMOS_AUTONOMICOS_IRPF_${year}`
  const props=domain==='escala'?[community,'tramos']:['valor',community]
  try{records.push({year,community,domain,symbol,property:props,chain:resolve(mod,mod.bindings.get(symbol),props)})}catch(error){errors.push({year,community,domain,message:error.message})}
 }
}
for(let year=2012;year<=2026;year++){
 const file='lib/dominio/normativa/datos/irpf-estatal-2012-2026.ts'
 record(file,`TRAMOS_IRPF_AHORRO_${year===2026?2025:year}`,[],{year,domain:'ahorro-conjunto'})
 record(file,year<=2014?'TRAMOS_IRPF_HASTA_2014':year===2015?'TRAMOS_IRPF_2015':year<=2020?'TRAMOS_IRPF_2016_A_2020':'TRAMOS_IRPF_DESDE_2021',[],{year,domain:'general-legacy'})
}
for(const symbol of ['ESTATAL_ORDINARIA_2012_2014','ESTATAL_COMPLEMENTARIA_2012_2014','ANDALUCIA_2012_2015','VALENCIA_2014_2016','CATALUNYA_2020_2021','CATALUNYA_2022_2024','MADRID_2022','MADRID_2025','MURCIA_2022','AHORRO_ORDINARIO_2012_2014','AHORRO_COMPLEMENTARIO_2012_2014','AHORRO_2016_2020','AHORRO_AUTONOMICO_2015','AHORRO_2021_2022','AHORRO_2023_2024','AHORRO_2025']){
 const file='lib/dominio/irpf/cuotas/escalas-publicadas.ts'
 // filas convierte cada tripleta posicionalmente en L,Q,t.
 record(file,symbol,[],{domain:'publicada',columns:['baseInferior','cuota','tipo']})
}
// Ramas que sustituyen la tabla ordinaria antes de la tarifa.
for(const [year,symbol,domain,property] of [
 [2014,'ESCALA_GALICIA_2014_BASE_SUPERIOR_17707_20','escala',['tramos']],
 [2015,'ESCALA_GALICIA_2015_BASE_SUPERIOR_17707_20','escala',['tramos']],
 [2015,'ESCALA_ILLES_BALEARS_2015_FALLECIDO_ANTES_31_DICIEMBRE','escala',['tramos']],
 [2022,'ESCALA_COMUNITAT_VALENCIANA_2022_FALLECIDO_ANTES_28_OCTUBRE','escala',['tramos']],
 [2023,'ESCALA_EXTREMADURA_2023_FALLECIDO_ANTES_15_SEPTIEMBRE','escala',['tramos']],
 [2023,'MINIMOS_ILLES_BALEARS_2023_FALLECIDO_ANTES_26_NOVIEMBRE','minimos',[]]]){
 record(`lib/dominio/normativa/datos/${domain==='escala'?'irpf-autonomico':'minimos-autonomicos'}-${year}.ts`,symbol,property,{year,domain,special:true})
}
fs.writeFileSync(`${out}/rutas-datos.json.gz`,zlib.gzipSync(JSON.stringify({contract:'Rutas de asignación/importación por propiedad. Selección temporal especial se aplica antes de elegir esta tabla. No igualar valores para inferir origen.',records,errors})))
console.log(`${records.length} rutas fuente hasta literales; ${errors.length} errores`,JSON.stringify(errors.slice(0,6)))
if(errors.length)process.exitCode=1
