import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {gunzipSync,gzipSync} from 'node:zlib'
const require=createRequire('/home/elies/Repos/IRoboPF/package.json'),ts=require('typescript')
const dir=path.dirname(new URL(import.meta.url).pathname)
const f=JSON.parse(gunzipSync(fs.readFileSync('docs/procedencia/implementaciones/flujo-escalas-r36-sol/fragmento.json.gz')).toString())
const program=ts.createProgram(f.sources.map(s=>s.file),{noResolve:true,noEmit:true,target:ts.ScriptTarget.Latest})
const checker=program.getTypeChecker()
function nodes(n){const a=[n];ts.forEachChild(n,x=>{a.push(...nodes(x))});return a}
const quote=n=>({file:n.getSourceFile().fileName,start:n.getStart(),end:n.end,text:n.getText()})
const reports=[]
for(const b of f.outputBindings){
 const sf=program.getSourceFile(b.source.file), ns=nodes(sf)
 const call=ns.find(n=>ts.isCallExpression(n)&&n.getStart()===b.source.start&&n.end===b.source.end)
 const amount=ns.find(n=>n.getStart()===b.amount.start&&n.end===b.amount.end)
 const visited=new Set(), producers=[],imports=[]
 function visit(n){for(const i of nodes(n).filter(ts.isIdentifier)){
 const s=checker.getSymbolAtLocation(i)
 for(const decl of s?.declarations??[]){
 if(visited.has(decl))continue;visited.add(decl)
 if(ts.isImportSpecifier(decl)){const st=decl.parent.parent.parent;imports.push({local:decl.name.text,symbol:(decl.propertyName??decl.name).text,module:st.moduleSpecifier.getText(),file:sf.fileName});continue}
 if(ts.isVariableDeclaration(decl)&&decl.initializer){producers.push(quote(decl));visit(decl.initializer)}
 }
 }}
 visit(amount)
 const ancestors=[];for(let p=call.parent;p;p=p.parent)if(ts.isArrowFunction(p)||ts.isIfStatement(p)||ts.isConditionalExpression(p))ancestors.push(quote(p))
 reports.push({siteId:b.siteId,source:quote(call),importe:quote(amount),producers,imports,ancestors,binding:b,scope:'Variables léxicas por símbolo TS; imports directos por identidad. No se interpreta esta lista estática como ejecución o cierre transitivo.'})
}
fs.writeFileSync(path.join(dir,'fuentes-por-sitio.json.gz'),gzipSync(JSON.stringify(reports,null,2)+'\n'))
const external=[]
for(const b of f.boundaryContracts){
 const sf=program.getSourceFile(b.id.split('#')[0]); const symbol=b.id.split('#')[1]
 const d=nodes(sf).find(n=>(ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText()===symbol)
 const fn=nodes(d).find(n=>ts.isFunctionExpression(n)||ts.isArrowFunction(n)||ts.isFunctionDeclaration(n))
 external.push({id:b.id,declared:b.parameters,actualParameters:fn?.parameters.map(quote)??[],outputs:b.outputs})
}
fs.writeFileSync(path.join(dir,'firmas-fronteras.json'),JSON.stringify(external,null,2)+'\n')
fs.writeFileSync(path.join(dir,'rojos-firmas.json'),JSON.stringify(external.filter(x=>x.declared.length!==x.actualParameters.length).map(x=>({id:x.id,expected:x.actualParameters,observed:x.declared,status:'red',meaning:'Firma editorial incompleta; los callBindings sí conservan operandos'})),null,2)+'\n')
process.stdout.write(JSON.stringify({sites:reports.length,boundaries:external.length})+'\n')
