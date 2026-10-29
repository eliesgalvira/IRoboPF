import {ts,property} from './flujo-ast.mjs'
const missing={known:false}
/** Solo constantes sintácticas y sustituciones exactas. Nunca ejecuta TS. */
export function constant(sources,node,env=new Map(),prop='',depth=0){
 if(depth>30||!node)return missing
 const recur=(n,en=env,p=prop)=>constant(sources,n,en,p,depth+1)
 if(ts.isParenthesizedExpression(node)||ts.isAsExpression(node))return recur(node.expression)
 if(ts.isIdentifier(node)){
  if(node.text==='undefined')return {known:true,value:undefined}
  const d=sources.declaration(node);if(!d)return missing;const ref=sources.ref(d),b=env.get(ref.file+':'+ref.start)
  if(b)return recur(b.node,b.env,prop)
  if(ts.isBindingElement(d)){const owner=d.parent.parent,r=sources.ref(owner),bound=env.get(r.file+':'+r.start),field=(d.propertyName??d.name).getText();return bound?recur(bound.node,bound.env,[field,prop].filter(Boolean).join('.')):missing}
  if(ts.isVariableDeclaration(d)&&d.initializer&&(d.parent.flags&ts.NodeFlags.Const))return recur(d.initializer)
  return missing
 }
 if(ts.isPropertyAccessExpression(node))return recur(node.expression,env,[node.name.text,prop].filter(Boolean).join('.'))
 if(ts.isObjectLiteralExpression(node)&&prop){if(node.properties.some(ts.isSpreadAssignment))return missing;const [head,...tail]=prop.split('.'),field=property(node,head);if(field)return recur(ts.isPropertyAssignment(field)?field.initializer:field.name,env,tail.join('.'));if(node.properties.some(ts.isSpreadAssignment))return missing;return {known:true,value:undefined}}
 if(prop)return missing
 if(ts.isNumericLiteral(node))return {known:true,value:Number(node.text)}
 if(ts.isStringLiteral(node))return {known:true,value:node.text}
 if(node.kind===ts.SyntaxKind.TrueKeyword)return {known:true,value:true}
 if(node.kind===ts.SyntaxKind.FalseKeyword)return {known:true,value:false}
 if(ts.isPrefixUnaryExpression(node)&&node.operator===ts.SyntaxKind.ExclamationToken){const a=recur(node.operand);return a.known?{known:true,value:!a.value}:missing}
 if(ts.isBinaryExpression(node)){const a=recur(node.left),b=recur(node.right);if(!a.known||!b.known)return missing;const op=node.operatorToken.kind;switch(op){case ts.SyntaxKind.EqualsEqualsEqualsToken:return {known:true,value:a.value===b.value};case ts.SyntaxKind.ExclamationEqualsEqualsToken:return {known:true,value:a.value!==b.value};case ts.SyntaxKind.LessThanEqualsToken:return {known:true,value:a.value<=b.value};case ts.SyntaxKind.GreaterThanToken:return {known:true,value:a.value>b.value};default:return missing}}
 return missing
}
