import Decimal from 'decimal.js';
import {buildCompleteAdmission} from '../../../../scripts/procedencia/flujo-admision-r36.mjs';
import {encodeAdmissionValue} from '../../../../scripts/procedencia/flujo-admision-r36-runtime.mjs';
const f=buildCompleteAdmission();
export function synthetic(overrides={}){
 const ports={}
 for(const b of f.boundaries){let value={};for(const x of b.outputs){if(x.kind==='schema')continue;let obj=value;for(const key of x.path.slice(0,-1))obj=obj[key]??={};const v=x.kind==='Decimal'?new Decimal(0):x.kind==='number'?0:x.kind==='array'?[]:x.kind==='retention-tag'?'RetencionTrabajoCalculada':'0';if(x.path.length)obj[x.path.at(-1)]=v;else value=v}
 if(b.resultKind==='array')value=[]
 if(b.resultKind==='option')value={_tag:'Some',value:{irpfFinalSimulador:new Decimal(0),irpfFinalSimuladorCentimos:0,cuotaTrasDeduccionSmi:new Decimal(0),cuotaTrasDeduccionSmiCentimos:0}}
 if(b.resultKind==='optional-object')value=undefined
 ports[b.name]=(args,call)=>({outcome:'success',value,arguments:encodeAdmissionValue(args),node:call.node})
 }
 return {...ports,...overrides}
}
