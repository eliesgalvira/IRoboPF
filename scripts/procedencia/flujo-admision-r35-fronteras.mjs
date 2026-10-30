import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('../../',import.meta.url))

/** Contratos manuales finitos. Cada invocación ajena conserva argumentos separados. */
export function buildFrontiers() {
  const annual='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
  const rights='lib/dominio/irpf/minimos/derechos.ts'
  const territory='lib/dominio/irpf/comunidades/comunidad-autonoma.ts'
  const adapter='lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts'
  let path=annual
  const anchors=[],programs=[],boundaries=[]
  const node=(op,fields={})=>{
    const text=readFileSync(root+path,'utf8'),id='f'+anchors.length
    anchors.push({id,path,start:0,end:text.length,sha256:createHash('sha256').update(text).digest('hex'),coordinate:'UTF-16 half-open'})
    return {id,op,...fields}
  }
  const unit=k=>k.endsWith('Centimos')?'centimos':/edad|grado|length|size|indice/.test(k)?'count':/fecha|devengo/.test(k)?'civil-date':'structural'
  const c=value=>value===undefined?node('undefined'):node('literal',{value,unit:[true,false].includes(value)?'boolean':Number.isFinite(value)?'scalar':'structural'})
  const l=name=>node('local',{name})
  const p=(target,key)=>node('property',{target,key,unit:unit(key)})
  const prop=(name,...keys)=>keys.reduce(p,l(name))
  const b=(operator,left,right)=>node('binary',{operator,left,right})
  const call=(name,...args)=>node('invoke',{name,args})
  const method=(target,method,...args)=>node('method',{target,method,args})
  const bind=(name,value)=>node('bind',{name,value})
  const ret=value=>node('return',{value})
  const iff=(condition,yes,no=[])=>node('if',{condition,yes,no})
  const reject=reason=>ret(call('rechazar',c(reason)))
  const arr=items=>node('array',{items})
  const obj=fields=>node('object',{fields:Object.entries(fields).map(([key,value])=>({key,value}))})
  const choose=(condition,yes,no)=>node('choose',{condition,yes,no})
  const lambda=(params,body)=>node('lambda',{params,body})
  const each=(name,collection,body)=>node('for',{name,collection,body})
  const and=(...xs)=>xs.reduce((a,x)=>b('&&',a,x))
  const or=(...xs)=>xs.reduce((a,x)=>b('||',a,x))
  const program=(id,params,body)=>programs.push({id,params,body,scope:'complete-body'})
  const boundary=(id,inputs,output,source,errors)=>boundaries.push({id,inputs,output,source,errors,status:'pending-independent-parity'})
  program('ejercicio',['caso'],[
    iff(and(b('!==',prop('caso','retencionTrabajoAeat'),c()),b('!==',prop('caso','retencionTrabajoAeat','anio'),prop('caso','anio'))),[reject('La retención estimada y la liquidación deben pertenecer al mismo ejercicio')]),ret(c(true))])
  boundary('catalogo',[{property:'codigo',unit:'structural',domain:'string'}],{property:'_tag',unit:'structural',domain:'None|Some'},territory,['defect; no typed failure in supplied layer'])
  program('deducciones',['caso'],[
    iff(b('===',prop('caso','deducciones','length'),c(0)),[ret(c(true))]),
    bind('primera',p(prop('caso','deducciones'),'0')),
    iff(b('===',b('??',l('primera'),c()),c()),[ret(c(true))]),
    bind('catalogada',call('catalogo',prop('primera','codigo'))),
    iff(b('===',prop('catalogada','_tag'),c('None')),[reject('Deducción no catalogada')],[reject('Deducción reconocida sin implementación')])])
  program('agregado-manual',['caso'],[ret(b('??',prop('caso','deduccionAutonomicaAgregadaCentimos'),c(0)))])
  const f=(...keys)=>prop('caso','situacionFamiliar',...keys)
  program('compatibilidad',['caso','contexto','derechos'],[
    iff(call('hayAlimentosPropiosSinMinimo',l('derechos')),[reject('Alimentos propios sin mínimo pendientes')]),
    iff(or(b('!==',prop('contexto','modo'),c('canonico')),b('!==',prop('caso','anio'),prop('derechos','ejercicio')),b('!==',prop('caso','comunidadAutonoma'),prop('derechos','territorio')),b('!==',prop('caso','fechaFallecimiento'),c()),b('!==',f('tipo'),c('individual')),b('!==',f('edad'),prop('derechos','edadContribuyenteDevengo')),b('!==',f('descendientes','length'),c(0)),b('!==',f('ascendientes','length'),c(0)),b('!==',f('discapacidad','_tag'),prop('derechos','discapacidadContribuyente','_tag')),and(b('===',f('discapacidad','_tag'),c('Discapacidad33a64')),b('===',prop('derechos','discapacidadContribuyente','_tag'),c('Discapacidad33a64')),b('!==',f('discapacidad','necesitaAyudaOMovilidadReducida'),prop('derechos','discapacidadContribuyente','necesitaAyudaOMovilidadReducida')))),[reject('Derechos incompatibles con modo, ámbito o familia')]),ret(c(true))])
  path=rights
  // La suma conserva sus cuatro productores, sin reducirlos a una cifra de entrada anónima.
  program('renta-antes-reducciones',['trabajo','alquiler','ganancias'],[
    bind('otras',method(method(prop('alquiler','rendimientoNeto'),'plus',prop('ganancias','gananciaSujetaGeneral')),'plus',prop('ganancias','gananciaSujetaAhorro'))),
    ret(method(prop('trabajo','rendimientoNeto'),'plus',l('otras')))])
  path=annual
  boundary('ss-uniforme',[{property:'anio',unit:'year',domain:'2012..2026'},{property:'salarioBrutoAnual',unit:'EUR',domain:'Decimal finite'}],{property:'cotizacionTrabajador',unit:'EUR',domain:'Decimal'},'lib/dominio/laboral/cotizaciones-perfil-uniforme.ts',['defect'])
  boundary('ss-legacy',[{property:'anio',unit:'year',domain:'2012..2026'},{property:'salarioBrutoAnual',unit:'EUR',domain:'Decimal finite'}],{property:'cotizacionTrabajador',unit:'EUR',domain:'Decimal'},'lib/dominio/laboral/cotizaciones-sociales.ts',['defect'])
  boundary('neto-trabajo',[{property:'anio',unit:'year',domain:'2012..2026'},{property:'rendimientoIntegro',unit:'EUR',domain:'Decimal'},{property:'cotizacionTrabajador',unit:'EUR',domain:'Decimal'}],{property:'rendimientoNeto',unit:'EUR',domain:'Decimal'},'lib/dominio/irpf/rendimientos/rendimientos-trabajo.ts',['defect'])
  boundary('neto-alquiler',[{property:'rendimientoIntegro',unit:'EUR',domain:'Decimal'}],{property:'rendimientoNeto',unit:'EUR',domain:'Decimal'},'lib/dominio/irpf/rendimientos/rendimientos-capital-inmobiliario.ts',['defect'])
  boundary('ganancias',[{property:'anio',unit:'year',domain:'2012..2026'},{property:'edadContribuyente',unit:'years',domain:'number'},{property:'ganancias',unit:'structural',domain:'array'},{property:'convertirCentimos',unit:'EUR/centimos',domain:'centimosAEuros'}],{property:'gananciaSujetaGeneral,gananciaSujetaAhorro',unit:'EUR',domain:'Decimal pair'},'lib/dominio/irpf/rendimientos/ganancias-perdidas-patrimoniales.ts',['defect'])
  const euros=value=>call('centimosAEuros',value)
  boundary('centimosAEuros',[{property:'centimos',unit:'centimos',domain:'number'}],{property:'euros',unit:'EUR',domain:'Decimal'},'lib/dominio/dinero/importe-monetario.ts',['defect'])
  // Semillas 0 EUR e identidad de campo por callback.
  const sum=(items,key)=>method(items,'reduce',lambda(['acc','item'],method(l('acc'),'plus',euros(prop('item',key)))),call('decimal-zero'))
  program('puertos-netos',['caso','contexto'],[
    bind('integro',sum(prop('caso','rendimientos','trabajo'),'importeIntegroCentimos')),
    bind('ss',choose(b('===',prop('contexto','modo'),c('canonico')),call('ss-uniforme',prop('caso','anio'),l('integro')),call('ss-legacy',prop('caso','anio'),l('integro')))),
    bind('trabajo',call('neto-trabajo',prop('caso','anio'),l('integro'),prop('ss','cotizacionTrabajador'))),
    bind('alquiler',call('neto-alquiler',sum(b('??',prop('caso','rendimientos','capitalInmobiliario'),arr([])),'importeIntegroCentimos'))),
    bind('ganancias',call('ganancias',prop('caso','anio'),prop('caso','situacionFamiliar','edad'),b('??',prop('caso','rendimientos','gananciasPatrimoniales'),arr([])),c('centimosAEuros'))),
    ret(obj({trabajo:l('trabajo'),alquiler:l('alquiler'),ganancias:l('ganancias'),renta:call('renta-antes-reducciones',l('trabajo'),l('alquiler'),l('ganancias'))}))])
  path=territory
  const territoryBody=[]
  for(let year=2012;year<=2026;year++) {
    const args=[prop('entrada','comunidadAutonoma')]
    if([2014,2015].includes(year)) args.push(prop('entrada','baseLiquidableGeneral'))
    if([2015,2022,2023].includes(year)) args.push(prop('entrada','fechaFallecimiento'))
    const selector='selector-'+year
    boundary(selector,[{property:'comunidadAutonoma',unit:'structural',domain:'ComunidadAutonoma'},...([2014,2015].includes(year)?[{property:'baseLiquidableGeneral',unit:'EUR',domain:'Decimal|undefined'}]:[]),...([2015,2022,2023].includes(year)?[{property:'fechaFallecimiento',unit:'civil-date',domain:'Date|undefined'}]:[])],{property:'_tag,escalaAutonomica,minimosAutonomicos',unit:'structural',domain:'ParametrosComunidadAutonoma|ComunidadAutonomaNoSoportada'},territory,['defect from imported selector; propagated'])
    territoryBody.push(iff(b('===',prop('entrada','anio'),c(year)),[ret(call(selector,...args))]))
  }
  territoryBody.push(reject('Año territorial no soportado'))
  program('territorio',['entrada'],territoryBody)
  path=adapter
  program('adaptador-defaults',['entrada'],[ret(obj({modo:b('??',prop('entrada','modo'),c('compatible-legacy')),perfil:b('??',prop('entrada','perfilAuditoria'),c('soltero_sin_hijos')),comunidadAutonoma:b('??',prop('entrada','comunidadAutonoma'),c('simulada-estatal')),edad:c(40),retencionesSoportadasCentimos:c(0),pagosACuentaCentimos:c(0),crearSubcaso:or(b('!==',prop('entrada','perfilAuditoria'),c()),b('!==',prop('entrada','seleccionRetencion'),c()))}))])
  return {programs,anchors,boundaries}
}
