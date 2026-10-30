import {expect,test} from 'vitest'
import {composeCausalRentas} from '../scripts/procedencia/causal-rentas-r59-contratos.mjs'
import {executeCausalRentas,verifyCausalRentas} from '../scripts/procedencia/causal-rentas-r59.mjs'
import {composeRentasR36,verifyRentasR36,sitesR36} from '../scripts/procedencia/flujo-rentas-r36.mjs'
import {executeFiniteCausal} from '../scripts/procedencia/evidencia-causal-r57.ts'
import {composeSS} from '../scripts/procedencia/flujo-ss-r36.mjs'
import {executeCausalSS,verifyCausalSS} from '../scripts/procedencia/causal-ss-r54.ts'
import {composeRetencionesR34} from '../scripts/procedencia/flujo-retenciones-r34.mjs'
import {executeCausalRetenciones,verifyCausalRetenciones} from '../scripts/procedencia/causal-retenciones-r57.ts'
import type {ExecutionEvidence} from '../scripts/procedencia/evidencia-ejecucion-r54.ts'
const caso={anio:2025,situacionFamiliar:{edad:40},rendimientos:{trabajo:[]}},ctx={modo:'canonico'}
function mutateAbsent(e:ExecutionEvidence):void {
 const marker=e.events.find(v=>v.value!==null&&Object.prototype.hasOwnProperty.call(v.value,'absent'))?.value
 expect(marker).toEqual({absent:true})
 Object.assign(Object(marker),{absent:false})
}
test('la evidencia pública no reconfigura ausencia ni replay de rentas',()=>{
 const g=composeCausalRentas(),e=executeCausalRentas(g,caso,ctx,'publico-rentas').evidence
 expect(verifyCausalRentas(g,e,caso,ctx,'publico-rentas')).toBe(true)
 mutateAbsent(e)
 expect(()=>verifyCausalRentas(g,e,caso,ctx,'publico-rentas')).toThrow()
 const fresh=executeCausalRentas(g,caso,ctx,'publico-rentas').evidence
 expect(fresh.events.some(v=>Object.prototype.hasOwnProperty.call(Object(v.value),'absent')&&JSON.stringify(v.value)==='{"absent":false}')).toBe(false)
 expect(verifyCausalRentas(g,fresh,caso,ctx,'publico-rentas')).toBe(true)
},30000)
test('mutar metadatos devueltos no altera el cierre de las tres API',()=>{
 const g=composeCausalRentas(),e=executeCausalRentas(g,caso,ctx,'publico-programa').evidence
 g.participants.rentas.terminals.primitives.push('terminal-publico-ajeno-r59')
 expect(()=>executeCausalRentas(g,caso,ctx)).toThrow(/Contrato técnico/)
 expect(()=>verifyCausalRentas(g,e,caso,ctx,'publico-programa')).toThrow(/Contrato técnico/)
 expect(()=>executeFiniteCausal(g,caso,ctx,'publico-programa',{kind:'causal-rentas-r59'})).toThrow(/Contrato técnico/)
 const descriptor=composeRentasR36();descriptor.terminals.primitives.push('otra-primitiva')
 expect(()=>verifyRentasR36(descriptor)).toThrow(/Correspondencia/)
},30000)
test('el catálogo publicado no modifica las veinte obligaciones históricas',()=>{
 const snapshot=[...sitesR36]
 try {sitesR36.pop();expect(composeRentasR36().outputs).toHaveLength(20)}
 finally {sitesR36.splice(0,sitesR36.length,...snapshot)}
})
test('SS y retenciones conservan ausencia tras mutar datos públicos',()=>{
 const ss=composeSS(),s=executeCausalSS(ss,caso,ctx,'publico-ss').evidence
 mutateAbsent(s);expect(()=>verifyCausalSS(ss,s,caso,ctx,'publico-ss')).toThrow()
 const ret=composeRetencionesR34(),input={anio:2025,pagosACuentaCentimos:0,retencionesSoportadasCentimos:0},r=executeCausalRetenciones(ret,input,ctx,'publico-ret').evidence
 mutateAbsent(r);expect(()=>verifyCausalRetenciones(ret,r,input,ctx,'publico-ret')).toThrow()
 expect(executeCausalSS(ss,caso,ctx,'publico-ss').lines).toHaveLength(11)
 expect(executeCausalRetenciones(ret,input,ctx,'publico-ret').lines).toHaveLength(2)
},30000)
