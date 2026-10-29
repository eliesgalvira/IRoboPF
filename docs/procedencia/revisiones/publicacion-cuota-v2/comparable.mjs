import {Effect} from 'effect'
import {writeFileSync} from 'node:fs'
import {compararAjustadoPorIpc,compararPasadoAjustadoPorIpc} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/dominio/compatibilidad-legacy/progresividad-frio.ts'
import {seleccionarImportesComparables as select} from '/home/elies/.t3/worktrees/IRoboPF/t3-aa7336a1/lib/dominio/auditoria/importes-comparables.ts'
const results=[]
for(const fn of [compararAjustadoPorIpc,compararPasadoAjustadoPorIpc])for(const years of [[2025,2026],[2020,2021],[2021,2020]])for(const salary of [0,1,2199999,2200000,2200001,2270016,6000001]){
const r=Effect.runSync(fn({salarioBrutoAnualReferenciaCentimos:salary,anioComparado:years[0],anioReferencia:years[1]}))
for(const d of [r.referencia,r.comparado.ajustado]){const before=JSON.stringify(d),c=select(d);if(c.netoCentimos+c.irpfCentimos+d.cotizacionTrabajadorCentimos!==d.salarioBrutoAnualCentimos||c.costeLaboralCentimos-c.netoCentimos!==c.irpfCentimos+d.cotizacionTrabajadorCentimos+d.cotizacionEmpresarialCentimos||JSON.stringify(d)!==before)throw Error('Mezcla');results.push({years,salary,original:d,comparable:c})}}
for(const aux of [undefined,0,101]){const d={salarioBrutoAnualCentimos:10001,cotizacionTrabajadorCentimos:651,cotizacionEmpresarialCentimos:3061,irpfFinalCentimos:101,salarioNetoAnualCentimos:9248,costeLaboralCentimos:13061};if(aux!==undefined)d.irpfConObligacionDeclararCentimos=aux;if(select(d).irpfCentimos!==(aux??101))throw Error('Auxiliar');results.push({aux,resultado:select(d)})}
writeFileSync('.cache/publicacion-cuota-v2/comparable.json',JSON.stringify(results,null,2)+'\n')
