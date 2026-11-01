import { readFileSync, writeFileSync } from 'node:fs'
import { Effect, Schema } from 'effect'
import { liquidarIrpfAnualExplicito } from './lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { CasoFiscalAnualExplicito } from './lib/dominio/irpf/trabajo-anual/conexion-contrato'
const oficial = JSON.parse(readFileSync('docs/procedencia/implementaciones/redondeo-salarial-open/oficial.json','utf8'))
const recorridos = JSON.parse(readFileSync('docs/procedencia/implementaciones/redondeo-salarial-open/recorridos.json','utf8'))
const extra = []
for (const bruto of ['17000.41','17000.42','17000.43','15852','15852.01','18673.51','18673.52','18673.53','20747.49','20747.50','20747.51']) {
 const entrada=structuredClone(oficial[0].entrada); entrada.trabajo.rendimientos[0].integro=bruto; extra.push({id:'propio-'+bruto,entrada})
}
for(const c of [oficial[0],oficial[3]]) {const entrada=structuredClone(c.entrada); entrada.trabajo.rendimientos[0].clase='pension'; extra.push({id:'pension-'+c.id,entrada})}
const out=[...oficial,...recorridos,...extra].map(c=> {
 const r=Effect.runSync(liquidarIrpfAnualExplicito(Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.entrada)))
 const {rastro,...monetario}=r
 return {id:c.id??c.nombre,entrada:c.entrada,monetario,lineas:rastro.pasos.flatMap(p=>p.lineasCalculo??[]).map(l=>({siteId:l.origen?.siteId,decimal:l.origen?.decimal,formula:l.formula}))}
})
writeFileSync(process.argv[2],JSON.stringify(out,null,2))
