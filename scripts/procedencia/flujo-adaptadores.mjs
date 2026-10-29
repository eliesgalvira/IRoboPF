import {identity} from './flujo-contrato.mjs'
const roles=new Map([['value','value'],['valor','value'],['selection','selection'],['control-seleccion','selection'],['validation','admission'],['admission','admission'],['control-admision','admission']])
/** Adapta por identidad de registro y propiedad. No crea enlaces por parecido de nombres. */
export function adapt(batch){
 const g=batch.body,records=[]
 if(Array.isArray(g))return records
 const nodes=new Map((g.nodes??[]).map(n=>[n.id,n]))
 if(nodes.size!==(g.nodes??[]).length)throw Error('Nodos históricos duplicados')
 const seen=new Set()
 for(const e of g.edges){
  const id=e.id??identity(e);if(seen.has(id))throw Error('Relaciones históricas duplicadas');seen.add(id)
  const evidence=e.evidence?.source??e.evidence??e.source,role=roles.get(e.role??e.kind??e.relation)
  const output=e.output??nodes.get(e.to),inputs=e.inputs??[e.from]
  const consumers=e.output?{source:e.output.file,symbol:e.output.symbol,property:e.output.property}: {source:output?.file??output?.source?.file,symbol:output?.symbol??output?.id,property:e.propertyPath??e.property??output?.property??output?.output}
  records.push({id:batch.id+':'+id,historicalIdentity:{input:batch.id,sha256:batch.sha256,record:id},direction:'producer-to-consumer',consumer:consumers,producers:inputs.map(i=>{const n=nodes.get(i);return {historicalBinding:i,source:n?.file??n?.source?.file??null,symbol:n?.symbol??n?.id??null,property:n?.property??n?.output??null,instance:null,unit:n?.unit??null}}),role:role??null,condition:e.condition??e.conditions,formula:e.formula??e.reason,evidence,review:'pending-independent',resolution:'requires-exact-call-and-property-binding',unresolved:inputs.map(i=>({input:i,requirement:'Instanciar propiedad, argumento, unidad y condiciones en el llamador concreto; prohibido resolver por nombre o sufijo'})),usedForClosure:false})
 }
 return records
}
export function stageContracts(instances,sources){return instances.map((s,index)=>{
 const call=sources.exact(s.source),arg=sources.exact(s.argument4)
 if(call.arguments[3]!==arg)throw Error('Etapa ligada a otra llamada')
 return {index,rule:s.regla,instance:s.instance,source:s.source,argument:s.argument4,property:'etapas[].importe',isolatedOutput:'resultado.etapas',annualOutput:'actividad.etapas.map(e => new D(e.importe))',aporte:index===1?{included:false,reason:'Saldo de activo informativo; no suma al aporte'}:{included:null,reason:'La propiedad aporte requiere su propia derivación; no se infiere por emitir etapa'},condition:s.control,annualExclusions:s.annualExclusions,review:'pending-independent'}
})}
