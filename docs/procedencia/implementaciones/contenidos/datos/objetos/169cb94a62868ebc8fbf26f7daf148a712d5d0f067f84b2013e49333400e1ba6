import fs from 'node:fs'
import path from 'node:path'
import {execFileSync} from 'node:child_process'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
const require=createRequire('/home/elies/Repos/IRoboPF/package.json')
/** @type {typeof import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js')} */
export const ts=require('typescript')
export const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex')
export class Sources {
  files=new Map()
  load(file){
    if(!this.files.has(file)){
      if(!file.startsWith('lib/')&&!file.startsWith('tests/'))throw Error('Fuente fuera del subconjunto: '+file)
      const bytes=fs.readFileSync(file),text=bytes.toString('utf8')
      const original=execFileSync('git',['cat-file','blob','5e69c68077ffd18be20457160595adb3f0ff52e4:'+file],{maxBuffer:8*1024*1024})
      if(!bytes.equals(original))throw Error('Código actual alterado respecto a base fijada: '+file)
      const ast=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true)
      const ranges=new Map();function index(n){ranges.set(n.getStart()+':'+n.end,n);ts.forEachChild(n,index)}index(ast)
      this.files.set(file,{bytes,text,ast,sha256:sha(bytes),ranges})
    }
    return this.files.get(file)
  }
  ref(node){const file=node.getSourceFile().fileName,s=this.load(file);return {file,sha256:s.sha256,start:node.getStart(),end:node.end,text:node.getText(),offsetEncoding:'utf16',syntax:ts.SyntaxKind[node.kind]}}
  exact(ref){const s=this.load(ref.file);if(s.sha256!==ref.sha256||ref.start<0||ref.end> s.text.length||ref.end<=ref.start||s.text.slice(ref.start,ref.end)!==ref.text)throw Error('Fuente/rango alterado: '+ref.file);const found=s.ranges.get(ref.start+':'+ref.end);if(!found)throw Error('Rango no AST');return found}
  imported(node){const file=node.getSourceFile().fileName;let result;const ast=node.getSourceFile();for(const statement of ast.statements){if(!ts.isImportDeclaration(statement))continue;const bindings=statement.importClause?.namedBindings;if(!bindings||!ts.isNamedImports(bindings))continue;for(const item of bindings.elements){if(item.name.text!==node.text)continue;if(!ts.isStringLiteral(statement.moduleSpecifier))continue;const spec=statement.moduleSpecifier.text;if(!spec.startsWith('.'))continue;let target=path.posix.normalize(path.posix.join(path.posix.dirname(file),spec));if(!target.endsWith('.ts'))target+='.ts';const symbol=(item.propertyName??item.name).text;result={file:target,symbol}}}return result}
  /** @returns {import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').VariableDeclaration | import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').FunctionDeclaration | import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').ParameterDeclaration | import('/home/elies/Repos/IRoboPF/node_modules/typescript/lib/typescript.js').BindingElement | undefined} */
  declaration(node){
    const name=node.text;let scope=node.parent
    while(scope){
      /** @type {ReturnType<Sources['declaration']>} */ let found
      function visit(n){
        if(n!==scope&&(ts.isFunctionLike(n)||ts.isBlock(n))){if(ts.isFunctionDeclaration(n)&&n.name?.text===name)found=n;return}
        if((ts.isVariableDeclaration(n)||ts.isParameter(n)||ts.isBindingElement(n)||ts.isFunctionDeclaration(n))&&n.name?.getText()===name)found=n
        ts.forEachChild(n,visit)
      }
      visit(scope);if(found)return found;scope=scope.parent
    }
    const imp=this.imported(node);if(imp){/** @type {ReturnType<Sources['declaration']>} */ let found;function visit(n){if((ts.isVariableDeclaration(n)||ts.isFunctionDeclaration(n))&&n.name?.getText()===imp.symbol)found=n;ts.forEachChild(n,visit)}visit(this.load(imp.file).ast);return found}
  }
}
export function property(object,name){return object.properties.find(p=>p.name?.getText().replaceAll('"','')===name)}
export function siteCall(sources,ref){const node=sources.exact(ref);if(!ts.isCallExpression(node)||node.expression.getText()!=='crearLineaCalculo'||!ts.isObjectLiteralExpression(node.arguments[0]))throw Error('Sitio no es llamada exacta');return node}
export function callArgument(sources,callRef,index,argRef){const call=sources.exact(callRef),arg=sources.exact(argRef);if(!ts.isCallExpression(call)||call.arguments[index]!==arg)throw Error('Binding de otra llamada');return arg}
