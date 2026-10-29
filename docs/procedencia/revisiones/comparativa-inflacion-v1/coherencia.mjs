import { Effect } from 'effect'
import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
const [root, out] = process.argv.slice(2)
const { compararAjustadoPorIpc } = await import(pathToFileURL(`${root}/lib/dominio/compatibilidad-legacy/progresividad-frio.ts`).href)
const r = await Effect.runPromise(compararAjustadoPorIpc({salarioBrutoAnualReferenciaCentimos:2270016,anioComparado:2025,anioReferencia:2026}))
const branches = [r.referencia,r.comparado.ajustado].map(d=>({bruto:d.salarioBrutoAnualCentimos,ss:d.cotizacionTrabajadorCentimos,cuotaLegacy:d.irpfFinalCentimos,cuotaAnualExpuesta:d.irpfConObligacionDeclararCentimos,neto:d.salarioNetoAnualCentimos,residuoAnual:d.salarioBrutoAnualCentimos-d.cotizacionTrabajadorCentimos-d.irpfConObligacionDeclararCentimos-d.salarioNetoAnualCentimos}))
writeFileSync(`${out}/coherencia.json`,JSON.stringify({factor:r.factorIpc,nominal:r.comparado.salarioBrutoNominalAnualCentimos,branches,aceptacionFiscal:false},null,2)+'\n')
if(branches.some(d=>d.cuotaLegacy!==d.cuotaAnualExpuesta)) process.exitCode=1
