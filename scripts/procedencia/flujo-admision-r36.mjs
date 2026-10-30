import { compileAdmissionGraph, narrowRightsAnchors, buildServiceBindings, compileAnnualResultSchema, compilePublishedScaleSchema } from './flujo-admision-r36-compilador.mjs'
import { executeAdmissionGraph } from './flujo-admision-r36-runtime.mjs'
import { buildEvaluableAdmission } from './flujo-admision-r35.mjs'
import { siteIds } from './flujo-admision-r32.mjs'
const annual='lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
const adapter='lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts'
const territory='lib/dominio/irpf/comunidades/comunidad-autonoma.ts'
const retention='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts'
const money='lib/dominio/dinero/importe-monetario.ts'
const outputs=(fields,kind='Decimal')=>fields.map(p=>({path:p?p.split('.'):[],kind,unit:kind==='Decimal'?'EUR':'centimos'}))
const monetary=[
 ['calcularDesgloseCotizacionesPerfilUniforme','baseOrdinaria excesoBase cotizacionEmpresarialOrdinaria cotizacionTrabajadorOrdinaria meiEmpresarial meiTrabajador solidaridadEmpresarial solidaridadTrabajador cotizacionEmpresarial cotizacionTrabajador'],
 ['calcularDesgloseCotizacionesSocialesLegacy','baseOrdinaria excesoBase cotizacionEmpresarialOrdinaria cotizacionTrabajadorOrdinaria meiEmpresarial meiTrabajador solidaridadEmpresarial solidaridadTrabajador cotizacionEmpresarial cotizacionTrabajador'],
 ['calcularCotizacionesSocialesLegacy','cotizacionEmpresarial cotizacionTrabajador'],
 ['calcularRendimientoNetoTrabajo','rendimientoIntegro cotizacionTrabajador rendimientoPrevioNeto gastosDeducibles rendimientoNeto'],
 ['calcularRendimientoNetoCapitalInmobiliarioSimplificado','rendimientoIntegro rendimientoNeto'],
 ['calcularGananciasPatrimonialesPorTransmision','gananciaTotal gananciaExenta gananciaSujetaAhorro gananciaSujetaGeneral'],
 ['calcularDerechosMinimos','contribuyente descendientes ascendientes discapacidadContribuyente discapacidadFamiliares total'],
 ...['calcularReduccionTrabajoConOtrasRentas','calcularBaseImponibleGeneral','calcularBaseImponibleAhorro','calcularCuotaPorEscala','calcularCuotaPorEscalaGeneral','calcularCuotaPorEscalaAhorro','obtenerMinimoContribuyente','obtenerMinimoAscendientes','obtenerMinimoDescendientes','obtenerMinimoDiscapacidadContribuyente','obtenerMinimoDiscapacidadFamiliares','obtenerMinimoDiscapacidadAscendientes'].map(n=>[n,''])
]
const finiteNumber={type:'number',minimum:-Number.MAX_VALUE,maximum:Number.MAX_VALUE,'x-unit':'centimos'}
const tagged=(tag,properties={})=>({type:'object',properties:{_tag:{const:tag},...properties},required:['_tag',...Object.keys(properties)],additionalProperties:false})
const gainsDomain={type:'array',items:{type:'object',properties:{importeGananciaCentimos:finiteNumber,tratamientoMayores65:{anyOf:[tagged('SinExencionMayores65'),tagged('ViviendaHabitualMayores65'),tagged('ReinversionRentaVitaliciaMayores65',{importeTransmisionCentimos:finiteNumber,importeReinvertidoRentaVitaliciaCentimos:finiteNumber,reinversionesPreviasRentaVitaliciaCentimos:finiteNumber})]},fechaAdquisicion:{type:'string'},fechaTransmision:{type:'string'},exencionInmuebleUrbanoAdquirido2012:{type:'object',properties:{inmuebleUrbano:{type:'boolean'},tituloOneroso:{type:'boolean'},fechaAdquisicion:{type:'string'},operacionConPersonaOEntidadVinculada:{type:'boolean'}},required:['inmuebleUrbano','tituloOneroso','fechaAdquisicion'],additionalProperties:false}},required:['importeGananciaCentimos','tratamientoMayores65'],additionalProperties:false}}
const inputContracts={
 calcularDesgloseCotizacionesPerfilUniforme:[['anio','year'],['salarioBrutoAnual','Decimal']],
 calcularDesgloseCotizacionesSocialesLegacy:[['anio','year'],['salarioBrutoAnual','Decimal']],
 calcularCotizacionesSocialesLegacy:[['anio','year'],['salarioBrutoAnual','Decimal']],
 calcularRendimientoNetoTrabajo:[['anio','year'],['rendimientoIntegro','Decimal'],['cotizacionTrabajador','Decimal']],
 calcularRendimientoNetoCapitalInmobiliarioSimplificado:[['rendimientoIntegro','Decimal']],
 calcularGananciasPatrimonialesPorTransmision:[['anio','year'],['edadContribuyente','number'],['ganancias','gains'],['convertirCentimos','converter']]
}
const other=[
 ...['calcularDesgloseCuotaPorEscala','calcularDesgloseCuotaPorEscalaGeneral','calcularDesgloseCuotaPorEscalaAhorro'].map(name=>({name,outputs:[],resultKind:'array'})),
 {name:'calcularAhorroConMinimos',outputs:outputs(['estatal.minoracion','autonomico.minoracion','estatal.despuesMinimo','autonomico.despuesMinimo','estatal.remanente','autonomico.remanente'])},
 {name:'calcularRetencionTrabajo',outputs:[...outputs(['baseRetencionCentimos','cuotaRetencionCentimos','importeRetencionAnualCentimos','limite43Centimos'],'number'),{path:['tipoRetencionPorcentaje'],kind:'decimal-string',unit:'percent'},{path:['_tag'],kind:'retention-tag',unit:'structural'},{path:['rastro','pasos'],kind:'array',unit:'structural'}]},
 {name:'calcularConciliacionSimuladorLegacy',outputs:[],resultKind:'option'},
 {name:'obtenerEscalaAutonomicaPublicada',outputs:[],resultKind:'optional-object'},
]
export function buildCompleteAdmission() {
 const boundaries=[...monetary.map(([name,fields])=>({name,outputs:outputs(fields.split(' ')),resultKind:fields?'object':'Decimal'})),...other].map((b,i)=>({id:'value-'+i,...b,resultKind:b.resultKind??'object',reject:false,status:'requires-instance-evidence',inputs:(inputContracts[b.name]??[]).map(([property,kind])=>({path:[0,property],kind,unit:kind==='Decimal'?'EUR':kind==='year'?'year':property==='edadContribuyente'?'years':kind==='converter'?'EUR/centimos':'structural',schema:kind==='gains'?gainsDomain:null})),instances:[],defect:true}))
 const entries=[
 ...['construirLiquidarIrpfAnual','liquidarIrpfAnualDesdeServicio','liquidarIrpfAnual','liquidarIrpfAnualConDerechos'].map(name=>({path:annual,name})),
 ...['construirCalcularSalarioLegacy','calcularSalarioLegacy'].map(name=>({path:adapter,name})),
 {path:territory,name:'obtenerParametrosComunidadAutonoma'},
 {path:retention,name:'calcularRetencionTrabajoAeatImpl'},
 ...['centimosAEuros','eurosACentimos'].map(name=>({path:money,name})),
 {path:'lib/dominio/normativa/datos/minimos-autonomicos-2025.ts',name:'MINIMOS_ESTATALES_2025'},
 {path:'lib/dominio/normativa/datos/deducciones-autonomicas-2025/index.ts',name:'obtenerDeduccionAutonomicaCatalogada'},
 {path:adapter,name:'casoFiscalLegacy'}
 ,{path:'lib/dominio/irpf/minimos/derechos.ts',name:'seleccionarIncrementoDerechos'}
 ]
 for(const b of boundaries)if(b.name==='calcularDerechosMinimos')b.outputs.push({path:['atribuciones'],kind:'array',unit:'structural'})
 const graph=compileAdmissionGraph(entries,boundaries.map(b=>b.name))
 const scaleContract=compilePublishedScaleSchema()
 boundaries.find(b=>b.name==='obtenerEscalaAutonomicaPublicada').resultSchema=scaleContract.schema
 if(!graph.sources.some(s=>s.path===scaleContract.source.path))graph.sources.push(scaleContract.source)
 function findBoundaries(node){if(!node||Object(node)!==node)return [];if(node.op==='boundary')return [node];return Object.values(node).flatMap(x=>Array.isArray(x)?x.flatMap(findBoundaries):findBoundaries(x))}
 function instances(node){if(!node||Object(node)!==node)return;if(node.op==='call')for(const ref of findBoundaries(node.callee)){const b=boundaries.find(b=>b.name===ref.name);b.instances.push({node:ref.id,call:node.id,operands:node.args.map(a=>a.id),transport:structuredClone(node.args),outputs:b.outputs.map(o=>({id:ref.id+'/'+o.path.join('.'),...o}))})}for(const x of Object.values(node))if(Array.isArray(x))x.forEach(instances);else if(Object(x)===x&&x!==null)instances(x)}
 graph.definitions.forEach(d=>instances(d.value))
 const direct=graph.definitions.find(d=>d.key===annual+'#liquidarIrpfAnualDesdeServicio')
 const calls=[]
 function collect(value){if(value===null||Object(value)!==value)return;if(value.op==='call'&&value.callee.op==='get'&&value.callee.key.value==='liquidar')calls.push(value);for(const v of Object.values(value))if(Array.isArray(v))v.forEach(collect);else if(v!==null&&Object(v)===v)collect(v)}
 collect(direct.value)
 const call=calls[0]
 if(calls.length!==1)throw Error('Servicio anual directo no único')
 const resultContract=compileAnnualResultSchema()
 for(const source of resultContract.sources)if(!graph.sources.some(s=>s.path===source.path))graph.sources.push(source)
 const serviceOutputs=[{path:[],kind:'schema',unit:'structural',schema:resultContract.schema},...outputs(['retencionesYPagosACuentaCentimos','cuotaDiferencialCentimos','cotizacionTrabajadorCentimos'],'number'),{path:['_tag'],kind:'annual-tag',unit:'structural'},{path:['rastro','pasos'],kind:'array',unit:'structural'}]
 boundaries.push({id:'injected-annual',name:'LiquidacionIrpfAnual.liquidar',failureSchema:resultContract.failureSchema,outputs:serviceOutputs,resultKind:'object',reject:true,status:'requires-instance-evidence',inputs:[],defect:true,instances:[{node:call.id,call:call.id,operands:call.args.map(a=>a.id),transport:structuredClone(call.args),outputs:serviceOutputs.map(o=>({id:call.id+'/'+o.path.join('.'),...o}))}]})
 const services=buildServiceBindings()
 const received=buildEvaluableAdmission()
 const rights=narrowRightsAnchors({programs:received.programs.slice(0,8),anchors:received.anchors.filter(a=>a.id.startsWith('n')),schemas:received.schemas,sources:received.sources,boundaries:[]})
 const conversions=[{program:money+'#centimosAEuros',input:{index:0,kind:'finite-number',unit:'centimos'},output:{kind:'Decimal',unit:'EUR'}},{program:money+'#eurosACentimos',input:{index:0,kind:'Decimal',unit:'EUR'},output:{kind:'number',unit:'centimos'}}]
 return {edition:'admision-r36',graph,rights,boundaries,conversions,services,sites:siteIds.map(siteId=>({siteId,admissionClosed:false,siteClosed:false})),wiringAllowed:false,completeRuleAcceptance:false}
}
export function evaluateCompleteAdmission(fragment,entry,args,evidence={}) {
 const result=executeAdmissionGraph(fragment,entry,args,evidence)
 if(result.outcome==='success'&&result.value?._tag==='LiquidacionIrpfAnualCalculada') {
   const present=new Set(result.value.rastro.pasos.flatMap(p=>p.lineasCalculo??[]).map(l=>l.origen?.siteId))
   result.sites=siteIds.filter(id=>present.has(id))
 }
 return result
}

export { verifyCompleteAdmission } from './flujo-admision-r36-verificador.mjs'
