import {expect,it} from 'vitest'
import Decimal from 'decimal.js'
import {Effect,Result} from 'effect'
import {buildCompleteAdmission,evaluateCompleteAdmission,verifyCompleteAdmission} from '../../../../scripts/procedencia/flujo-admision-r36.mjs'
import {encodeAdmissionValue} from '../../../../scripts/procedencia/flujo-admision-r36-runtime.mjs'
import {liquidarIrpfAnual} from '../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import {base,ret,derechos} from '../../revisiones/admision-anual-r34-sol/fixtures.mjs'
const f=buildCompleteAdmission()
// Valores sintéticos para admisión y propagación. No son un oráculo de cuotas.
function synthetic(overrides={}){
 const ports={}
 for(const b of f.boundaries){let value={};for(const x of b.outputs){if(x.kind==='schema')continue;let obj=value;for(const key of x.path.slice(0,-1))obj=obj[key]??={};const v=x.kind==='Decimal'?new Decimal(0):x.kind==='number'?0:x.kind==='array'?[]:x.kind==='retention-tag'?'RetencionTrabajoCalculada':'0';if(x.path.length)obj[x.path.at(-1)]=v;else value=v}
 if(b.resultKind==='array')value=[]
 if(b.resultKind==='option')value={_tag:'Some',value:{irpfFinalSimulador:new Decimal(0),irpfFinalSimuladorCentimos:0,cuotaTrasDeduccionSmi:new Decimal(0),cuotaTrasDeduccionSmiCentimos:0}}
 if(b.resultKind==='optional-object')value=undefined
 ports[b.name]=(args,call)=>({outcome:'success',value,arguments:encodeAdmissionValue(args),node:call.node})
 }
 return {...ports,...overrides}
}
for(const modo of ['canonico','compatible-legacy'])for(let anio=2012;anio<=2026;anio++)it(`propagación completa ${anio}/${modo}`,()=>{
 const caso={...base,anio,comunidadAutonoma:'simulada-estatal'}
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo}],synthetic())
 expect(model.outcome,model.reason).toBe('success');expect(model.sites).toHaveLength(13)
 const actual=Effect.runSync(Effect.result(liquidarIrpfAnual(caso,{modo})));expect(Result.isSuccess(actual)).toBe(true)
 if(Result.isSuccess(actual)){const sites=new Set(actual.success.rastro.pasos.flatMap(p=>p.lineasCalculo??[]).map(l=>l.origen?.siteId));expect(model.sites.every(s=>sites.has(s))).toBe(true)}
})
it('retención seleccionada añade cuatro sitios solo tras resultado final',()=>{
 const caso={...base,retencionTrabajoAeat:ret}
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}],synthetic());expect(model.outcome,model.reason).toBe('success');expect(model.sites).toHaveLength(17)
 const actual=Effect.runSync(Effect.result(liquidarIrpfAnual(caso,{modo:'canonico'})));expect(Result.isSuccess(actual)).toBe(true)
})
for(const fault of ['pending','defect'])it(`fallo financiero ${fault} suprime todos los sitios`,()=>{
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[base,{modo:'canonico'}],synthetic({calcularBaseImponibleGeneral:(args,call)=>({outcome:fault,reason:'frontera concreta',node:call.node,arguments:encodeAdmissionValue(args)})}));expect(result.outcome).toBe(fault);expect(result.sites).toEqual([])
})
it('regularización real rechaza después de SS sin producir sitios parciales',()=>{
 const caso={...base,retencionTrabajoAeat:{...ret,procedimiento:'regularizacion'}}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}],synthetic());expect(result.outcome,result.reason).toBe('reject');expect(result.reason).toContain('Regularización');expect(result.sites).toEqual([])
})
it('None de conciliación es defecto en adaptador y no admisión de cero',()=>{
 const ports=synthetic({calcularConciliacionSimuladorLegacy:(args,call)=>({outcome:'success',value:{_tag:'None'},node:call.node,arguments:encodeAdmissionValue(args)})})
 const result=evaluateCompleteAdmission(f,'calcularSalarioLegacy',[{anio:2025,salarioBrutoAnualCentimos:0}],ports);expect(result.outcome,result.reason).toBe('defect');expect(result.sites).toEqual([])
})
for(const perfilAuditoria of ['soltero_sin_hijos','pareja_con_hijos'])for(const modo of ['canonico','compatible-legacy'])it(`adaptador spread/perfiles/defaults/servicio/API ${perfilAuditoria}/${modo}`,()=>{
 const result=evaluateCompleteAdmission(f,'casoFiscalLegacy',[{anio:2025,salarioBrutoAnualCentimos:777,perfilAuditoria,modo,seleccionRetencion:{anio:1900,edad:99,fechaPago:'2025-12-01'}}],synthetic());expect(result.outcome,result.reason).toBe('success')
 expect(result.value.retencionTrabajoAeat.anio).toBe(2025);expect(result.value.retencionTrabajoAeat.edad).toBe(40);expect(result.value.retencionTrabajoAeat.fechaPago).toBe('2025-12-01')
 expect(result.value.situacionFamiliar.descendientes).toHaveLength(perfilAuditoria==='soltero_sin_hijos'?0:2)
 expect(result.value.retencionTrabajoAeat.descendientes).toHaveLength(perfilAuditoria==='soltero_sin_hijos'?0:2)
 for(const d of result.value.retencionTrabajoAeat.descendientes){expect(d.discapacidad).toBe('sin-discapacidad');expect(d.computoPorEntero).toBe(true)}
 const api=evaluateCompleteAdmission(f,'calcularSalarioLegacy',[{anio:2025,salarioBrutoAnualCentimos:777,perfilAuditoria,modo,seleccionRetencion:modo==='canonico'?{perfilTemporal:'cierre'}:undefined}],synthetic());expect(api.outcome,api.reason).toBe('success');expect(api.value.salarioBrutoAnualCentimos).toBe(777);expect(api.value.rastro).toBeUndefined();expect(api.sites).toEqual([])
})
it('ConDerechos conserva primer rechazo antes del ejercicio',()=>{
 const caso={...base,derechosMinimos:null,retencionTrabajoAeat:{...ret,anio:2024}}
 expect(evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}]).reason).toContain('mismo ejercicio')
 expect(evaluateCompleteAdmission(f,'liquidarIrpfAnualConDerechos',[caso]).reason).toContain('Hechos incompletos')
})
it('conciliación propia no usa bruto ni admite sustituir por otra renta igual',()=>{
 const caso={...base,derechosMinimos:{...derechos,descendientes:[],conciliacionRentasContribuyente:undefined}}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}],synthetic());expect(result.outcome,result.reason).toBe('reject');expect(result.reason).toContain('conciliación');expect(result.sites).toEqual([])
})
it('recibo de otra instancia con cifras iguales queda pendiente',()=>{
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[base,{modo:'canonico'}],synthetic({calcularRendimientoNetoTrabajo:(args)=>({outcome:'success',node:'otra-instancia',arguments:encodeAdmissionValue(args),value:{rendimientoNeto:new Decimal(0)}})}));expect(result.outcome,result.reason).toBe('pending');expect(result.reason).toContain('otra instancia')
})
it('salida financial con propiedad ausente es defecto, no cero',()=>{
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[base,{modo:'canonico'}],synthetic({calcularRendimientoNetoTrabajo:(args,call)=>({outcome:'success',node:call.node,arguments:encodeAdmissionValue(args),value:{rendimientoNeto:new Decimal(0)}})}));expect(result.outcome).toBe('defect');expect(result.sites).toEqual([])
})
it('sentencias verificadas sin pin; duplicar identidad de sentencia se rechaza',()=>{
 expect(verifyCompleteAdmission(f)).toBe(true)
 const bad=structuredClone(f);const body=bad.graph.definitions.find(d=>d.value.op==='lambda'&&d.value.body.length>1).value.body;body[1].id=body[0].id;expect(()=>verifyCompleteAdmission(bad)).toThrow('ID duplicado')
})
it('servicio anual inyectado no hereda el éxito del default',()=>{
 const missing=evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[base,{modo:'canonico'}]);expect(missing.outcome).toBe('pending');expect(missing.sites).toEqual([])
 const reject=evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[base,{modo:'canonico'}],{'LiquidacionIrpfAnual.liquidar':(args,call)=>({outcome:'reject',node:call.node,arguments:encodeAdmissionValue(args),value:{_tag:'ResultadoNoSoportado',motivo:'implementación inyectada',fuenteReconocida:'fuente de prueba',rastro:{titulo:'rechazo',pasos:[]}}})});expect(reject.outcome,reject.reason).toBe('reject');expect(reject.reason).toBe('implementación inyectada')
 const wrapper=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[base,{modo:'canonico'}],{'LiquidacionIrpfAnual.liquidar':()=>{throw Error('no debe alcanzar el servicio externo')}});expect(wrapper.outcome).toBe('pending');expect(wrapper.reason).toContain('calcularDesgloseCotizacionesPerfilUniforme')
})
it('transporte mutado con cantidades iguales se rechaza sin reconstrucción ni pin',()=>{
 const bad=structuredClone(f),contract=bad.boundaries.find(b=>b.name==='calcularRendimientoNetoTrabajo'),nodeId=contract.instances[0].call
 let target
 function find(value){if(!value||Object(value)!==value)return;if(value.id===nodeId)target=value;for(const x of Object.values(value))if(Array.isArray(x))x.forEach(find);else if(x&&Object(x)===x)find(x)}bad.graph.definitions.forEach(d=>find(d.value))
 const field=target.args[0].fields.find(p=>p.key==='cotizacionTrabajador');field.value.key.value='cotizacionEmpresarial'
 expect(()=>verifyCompleteAdmission(bad)).toThrow('Transporte por propiedad')
})
import {CATALOGO_DEDUCCIONES_AUTONOMICAS_2025} from '../../../../lib/dominio/normativa/datos/deducciones-autonomicas-2025'
import {calcularRetencionTrabajoAeat} from '../../../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat'
it('Option interior Some conserva nombre y motivo reales; no usa importes agregados',()=>{
 const ficha=Object.values(CATALOGO_DEDUCCIONES_AUTONOMICAS_2025.valor).flatMap(c=>c.deducciones)[0]
 const caso={...base,deducciones:[{codigo:ficha.codigo},{codigo:'ignorado'}],deduccionAutonomicaAgregadaCentimos:777}
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}]);const actual=Effect.runSync(Effect.result(liquidarIrpfAnual(caso,{modo:'canonico'})))
 expect(model.outcome,model.reason).toBe('reject');expect(model.reason).toBe('Deducción autonómica reconocida no implementada: '+ficha.nombre);expect(Result.isFailure(actual)).toBe(true);if(Result.isFailure(actual))expect(model.reason).toBe(actual.failure.motivo)
})
for(let anio=2012;anio<=2026;anio++)for(const modo of ['canonico','compatible-legacy'])it(`retención guardas/calendario/selección ${anio}/${modo}`,()=>{
 for(const selection of [{},{perfilTemporal:'cierre'},{fechaPago:anio+'-01-01'},{fechaPago:anio+'-12-31'},{fechaPago:null},{fechaPago:anio+'-02-29'},{fechaPago:anio+'-12-31',perfilTemporal:'cierre'}]){
  const caso={...ret,anio,perfilTemporal:undefined,...selection}
  let actual
  try{const r=Effect.runSync(Effect.result(calcularRetencionTrabajoAeat(caso,{modo})));actual=Result.isSuccess(r)?{outcome:'success'}:{outcome:'reject',reason:r.failure.motivo}}catch{actual={outcome:'defect'}}
  const model=evaluateCompleteAdmission(f,'calcularRetencionTrabajoAeatImpl',[caso,{modo}],synthetic());expect(model.outcome,model.reason).toBe(actual.outcome);if(actual.reason)expect(model.reason).toBe(actual.reason)
 }
})
it('A32-P01/P02 siguen como conductas, sin decisión fiscal',()=>{
 const negative=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[{...base,retencionesSoportadasCentimos:-200,pagosACuentaCentimos:-100},{modo:'canonico'}],synthetic());expect(negative.outcome,negative.reason).toBe('success');expect(negative.value.retencionesYPagosACuentaCentimos).toBe(-300)
 const strings=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[{...base,retencionTrabajoAeat:{...ret,situacionLaboral:'valor-ajeno',contrato:'valor-ajeno'}},{modo:'canonico'}],synthetic());expect(strings.outcome,strings.reason).toBe('success');expect(strings.sites).toHaveLength(17)
})
import {calcularSalarioLegacy} from '../../../../lib/dominio/compatibilidad-legacy/calculo-salario-legacy'
it('hipótesis refutada: perfil canónico 2025 sin selección temporal no implica éxito',()=>{
 const entrada={anio:2025,salarioBrutoAnualCentimos:777,perfilAuditoria:'pareja_con_hijos',modo:'canonico'}
 const model=evaluateCompleteAdmission(f,'calcularSalarioLegacy',[entrada],synthetic());const actual=Effect.runSync(Effect.result(calcularSalarioLegacy(entrada)))
 expect(model.outcome,model.reason).toBe('reject');expect(Result.isFailure(actual)).toBe(true);if(Result.isFailure(actual))expect(model.reason).toBe(actual.failure.motivo)
})
it('ConDerechos fuerza modo canónico, valida, concilia y repite selección en dos mínimos',()=>{
 const caso={...base,derechosMinimos:{...derechos,descendientes:[]}}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnualConDerechos',[caso],synthetic());expect(result.outcome,result.reason).toBe('success');expect(result.sites).toHaveLength(13)
 expect(result.trace.filter(t=>t.op==='boundary-call'&&t.name==='calcularDerechosMinimos')).toHaveLength(2)
})
for(const name of ['calcularDesgloseCotizacionesPerfilUniforme','calcularRendimientoNetoTrabajo','calcularRendimientoNetoCapitalInmobiliarioSimplificado','calcularGananciasPatrimonialesPorTransmision'])for(const field of f.boundaries.find(b=>b.name===name).outputs)it(`salida financiera obligatoria ${name}/${field.path.join('.')}`,()=>{
 const ports=synthetic(),original=ports[name];ports[name]=(args,call)=>{const result=original(args,call);delete result.value[field.path[0]];return result}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[base,{modo:'canonico'}],ports);expect(result.outcome,result.reason).toBe('defect');expect(result.reason).toContain('Salida');expect(result.sites).toEqual([])
})
for(const edad of [64,65])for(const anio of [2014,2015,2025])for(const tratamiento of [{_tag:'SinExencionMayores65'},{_tag:'ViviendaHabitualMayores65'},{_tag:'ReinversionRentaVitaliciaMayores65',importeTransmisionCentimos:100000,importeReinvertidoRentaVitaliciaCentimos:100000,reinversionesPreviasRentaVitaliciaCentimos:0}])it(`dominio de transmisiones por edad/año/variante ${edad}/${anio}/${tratamiento._tag}`,()=>{
 const caso={...base,anio,comunidadAutonoma:'simulada-estatal',situacionFamiliar:{...base.situacionFamiliar,edad},rendimientos:{...base.rendimientos,gananciasPatrimoniales:[{importeGananciaCentimos:-777,tratamientoMayores65:tratamiento,fechaAdquisicion:'2012-05-12',fechaTransmision:'2013-05-12',exencionInmuebleUrbanoAdquirido2012:{inmuebleUrbano:true,tituloOneroso:true,fechaAdquisicion:'2012-05-12'}}]}}
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}],synthetic());const actual=Effect.runSync(Effect.result(liquidarIrpfAnual(caso,{modo:'canonico'})));expect(model.outcome,model.reason).toBe('success');expect(Result.isSuccess(actual)).toBe(true)
})
it('frontera de ganancias no acredita éxito de datos ajenos a su dominio',()=>{
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[{...base,rendimientos:{trabajo:[],gananciasPatrimoniales:[{}]}},{modo:'canonico'}],synthetic());expect(model.outcome).toBe('pending');expect(model.reason).toContain('calcularGananciasPatrimonialesPorTransmision');expect(model.sites).toEqual([])
})
it('defecto del enlazador tras la retención suprime los diecisiete sitios',()=>{
 const ports=synthetic(),original=ports.calcularRetencionTrabajo
 ports.calcularRetencionTrabajo=(args,call)=>{const r=original(args,call);r.value.rastro={pasos:[{lineasCalculo:[{procedencia:{estado:'enlazada'}}]}]};return r}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[{...base,retencionTrabajoAeat:ret},{modo:'canonico'}],ports);expect(result.outcome,result.reason).toBe('defect');expect(result.reason).toContain('ya versionado');expect(result.sites).toEqual([])
})
it('layers: bindings y orden propios, dos dependencias capturadas no gobiernan SS/conversión',()=>{
 const annual=f.services.find(s=>s.id==='LiquidacionIrpfAnual')
 expect(annual.providers.map(p=>p.provider)).toEqual(['CotizacionesSociales.layer','ParametrosNormativosIrpf.layer','PoliticaMonetaria.layer','RetencionTrabajoAeat.layer'])
 const fields=annual.arguments[0].fields;expect(fields.find(f=>f.name==='cotizacionesSociales').value.kind).toBe('captured');expect(fields.find(f=>f.name==='politicaMonetaria').value.kind).toBe('captured')
 expect(fields.find(f=>f.name==='retencionTrabajoAeat').value.fields[0].value.key).toContain('#calcularRetencionTrabajoAeatImpl')
 expect(verifyCompleteAdmission(f)).toBe(true)
 const bad=structuredClone(f);bad.services[0].arguments[0].fields[1].value.fields[0].value.key='ajeno#programa';expect(()=>verifyCompleteAdmission(bad)).toThrow('Programa de servicio ausente')
})
it('unidades y bindings: conversión monetaria cruzada con valor igual no se admite',()=>{
 const bad=structuredClone(f);bad.conversions[0].input.unit='EUR';expect(()=>verifyCompleteAdmission(bad)).toThrow('Unidad de conversión')
})
it('unidades y bindings: mínimo anual de otro programa con valores iguales no sustituye al proveedor',()=>{
 const bad=structuredClone(f),key='lib/dominio/normativa/datos/minimos-autonomicos-2024.ts#MINIMOS_ESTATALES_2024';expect(bad.graph.definitions.some(d=>d.key===key)).toBe(true)
 bad.services[0].arguments[0].fields.find(p=>p.name==='parametrosNormativos').value.fields.find(p=>p.name==='minimosEstatales2025').value.key=key
 expect(()=>verifyCompleteAdmission(bad)).toThrow('Binding de servicio distinto')
})
it('unidades y bindings: mismo número en céntimos no sustituye una salida EUR',()=>{
 const bad=structuredClone(f),b=bad.boundaries.find(b=>b.name==='calcularDesgloseCotizacionesPerfilUniforme');b.outputs[0].unit='centimos';b.instances.forEach(i=>i.outputs[0].unit='centimos');expect(()=>verifyCompleteAdmission(bad)).toThrow('Unidad de salida')
})
it('dominio y resultado: no ejecutar coerciones en símbolos propios',()=>{
 let called=false;const anio={[Symbol.toPrimitive](){called=true;return 2025}}
 const result=evaluateCompleteAdmission(f,'calcularSalarioLegacy',[{anio,salarioBrutoAnualCentimos:0}],synthetic());expect(result.outcome).toBe('pending');expect(called).toBe(false)
})
it('dominio y resultado: el servicio inyectado requiere DTO anual completo',()=>{
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[base,{modo:'canonico'}],{'LiquidacionIrpfAnual.liquidar':(args,call)=>({outcome:'success',arguments:encodeAdmissionValue(args),node:call.node,value:{_tag:'LiquidacionIrpfAnualCalculada',retencionesYPagosACuentaCentimos:0,cuotaDiferencialCentimos:0,cotizacionTrabajadorCentimos:0,rastro:{pasos:[]}}})})
 expect(result.outcome).toBe('defect');expect(result.sites).toEqual([])
})
it('servicio sustituido: recibo de una instancia real con DTO completo y Option serializado',()=>{
 const actual=Effect.runSync(Effect.result(liquidarIrpfAnual(base,{modo:'canonico'})));expect(Result.isSuccess(actual)).toBe(true);if(Result.isFailure(actual))return
 const option=actual.success.conciliacionSimuladorLegacy
 const dto={...actual.success,conciliacionSimuladorLegacy:option._tag==='None'?{_tag:'None'}:{_tag:'Some',value:option.value}}
 const receipt={outcome:'success',arguments:encodeAdmissionValue([base,{modo:'canonico'}]),node:f.boundaries.find(b=>b.name==='LiquidacionIrpfAnual.liquidar').instances[0].node,value:dto}
 const evidence={'LiquidacionIrpfAnual.liquidar':receipt}
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[base,{modo:'canonico'}],evidence);expect(result.outcome,result.reason).toBe('success');expect(result.sites).toHaveLength(13)
 expect(evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[{...base,anio:2024},{modo:'canonico'}],evidence).outcome).toBe('pending')
})
it('rechazo inyectado conserva contrato completo y no solo booleano/motivo',()=>{
 const result=evaluateCompleteAdmission(f,'liquidarIrpfAnualDesdeServicio',[base,{modo:'canonico'}],{'LiquidacionIrpfAnual.liquidar':(args,call)=>({outcome:'reject',arguments:encodeAdmissionValue(args),node:call.node,value:{_tag:'ResultadoNoSoportado',motivo:'incompleto'}})})
 expect(result.outcome).toBe('defect');expect(result.sites).toEqual([])
})
import {evaluateRightsProgram} from '../../../../scripts/procedencia/flujo-admision-r36-derechos.mjs'
it('codec y referencias: Infinity interno no se serializa como ausencia',()=>{
 const input={...derechos,descendientes:derechos.descendientes.map(d=>({...d,titulares:d.titulares.map(t=>({...t,relacion:'ninguna',custodia:'sin-custodia',alimentosJudiciales:false}))}))}
 const result=evaluateRightsProgram(f.rights,'calcularDerechosMinimos',[input]);expect(result.outcome,result.reason).toBe('success')
 const serialized=JSON.parse(JSON.stringify(result.trace));expect(serialized.some(t=>t.value?.kind==='number'&&t.value.value==='Infinity')).toBe(true)
})
it('codec y referencias: local de otra instancia/scope se rechaza antes del pin',()=>{
 const bad=structuredClone(f),program=bad.graph.definitions.find(d=>d.key.endsWith('#esCasoCalculable'));let changed=false
 function mutate(v){if(!v||Object(v)!==v||changed)return;if(v.op==='local'){v.name='local_sin_productor_r36';changed=true;return}for(const x of Object.values(v))if(Array.isArray(x))x.forEach(mutate);else if(x&&Object(x)===x)mutate(x)}mutate(program.value)
 expect(changed).toBe(true);expect(()=>verifyCompleteAdmission(bad)).toThrow('Local sin binding')
})
