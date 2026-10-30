import { createRequire } from 'node:module'
const require=createRequire(process.env.IROBOPF_DEPENDENCIES_PACKAGE??new URL('../../package.json',import.meta.url))
const Decimal=require('decimal.js'),Ajv=require('ajv')
const methods=['slice','includes','filter','map','every','some','find','toSorted','localeCompare','get','set','has','times','toDecimalPlaces','eq','lte','isFinite','plus','reduce']
export function evaluateRightsProgram(f, name, args, ports = {}) {
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
    if(value===Infinity||value===-Infinity||Number.isNaN(value))return {kind:'number',value:String(value)}
    if(Decimal.isDecimal(value)) return {kind:"Decimal",value:value.toString(),instance:identity(value)}
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
      record(n,frame,undefined,{phase:"statement-entry"})
      if(n.op==='bind') frame.locals.set(n.name,ev(n.value,frame))
      else if(n.op==='decode') {
        if(!validators.has(n.schema)) validators.set(n.schema,new Ajv({allErrors:true}).compile(f.schemas[n.schema]))
        const value=frame.locals.get(n.input)
        if(!validators.get(n.schema)(value)) throw new Rejection('Hechos incompletos o fuera del alcance Madrid 2025 individual sin fallecimientos ni ascendientes')
        frame.locals.set(n.name,value)
      } else if(n.op==='if') {const condition=ev(n.condition,frame);record(n,frame,condition);block(condition?n.yes:n.no,frame)}
      else if(n.op==='for') {let index=0;for(const value of ev(n.collection,frame)) {record(n,frame,index++);const iteration={...frame,id:++serial,locals:new Map([...frame.locals,[n.name,value]])};try {block(n.body,iteration)}catch(e){if(!(e instanceof Continue)) throw e}}}
      else if(n.op==='continue') throw new Continue()
      else if(n.op==='return') throw new Returned(ev(n.value,frame))
      else if(n.op==='evaluate') ev(n.value,frame)
      else throw Error('Sentencia desconocida')
    }
  }
  try {return {outcome:'success',value:invoke(name,args),trace,sites:[]}}catch(e){return {outcome:e instanceof Pending?'pending':e instanceof Rejection?'reject':'defect',reason:e.message,trace,sites:[]}}
}
