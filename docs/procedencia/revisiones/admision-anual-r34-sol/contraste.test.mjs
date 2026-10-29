import {expect,it} from 'vitest'
import {Effect,Result} from 'effect'
import {base,ret,hijo,derechos} from './fixtures.mjs'
import {liquidarIrpfAnual,liquidarIrpfAnualConDerechos,LiquidacionIrpfAnual} from '../../../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts'
import {calcularRetencionTrabajoAeat} from '../../../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts'
import {calcularSalarioLegacy} from '../../../../lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts'
import {buildAdmissionFragment,evaluateRetentionAdmission,verifyAdmissionFragment,siteIds} from '../../../../scripts/procedencia/flujo-admision-r32.mjs'
const run=e=>Effect.runSync(Effect.result(e))
const annual=(c=base,modo='canonico')=>run(liquidarIrpfAnual(c,{modo}))
const message=r=>Result.isFailure(r)?r.failure.motivo:'success'
const count=r=>r.rastro.pasos.flatMap(p=>p.lineasCalculo??[]).filter(l=>siteIds.includes(l.origen?.siteId)).length
it('R34-01 dos fallos: ejercicio precede schema; ConDerechos invierte',()=>{
 const c={...base,derechosMinimos:null,retencionTrabajoAeat:{...ret,anio:2024},deducciones:[{codigo:'x'}]}
 expect(message(annual(c))).toContain('mismo ejercicio')
 expect(message(run(liquidarIrpfAnualConDerechos(c)))).toContain('Hechos incompletos')
})
it('R34-02 null subcaso es defecto, undefined crea 13',()=>{
 expect(()=>annual({...base,retencionTrabajoAeat:null})).toThrow()
 const r=annual({...base,retencionTrabajoAeat:undefined}); expect(Result.isSuccess(r)).toBe(true);expect(count(r.success)).toBe(13)
})
it('R34-03 primera deduccion nullish omite lista posterior; objeto rechaza',()=>{
 expect(Result.isSuccess(annual({...base,deducciones:[null,{codigo:'x'}]}))).toBe(true)
 expect(message(annual({...base,deducciones:[{codigo:'x'},null]}))).toContain('Deducción')
})
it('R34-04 deduccion agregada no valida catalogo',()=>{
 expect(Result.isSuccess(annual({...base,deduccionAutonomicaAgregadaCentimos:100}))).toBe(true)
 expect(message(annual({...base,deduccionAutonomicaAgregadaCentimos:100,deducciones:[{codigo:'x'}]}))).toContain('Deducción')
})
it('R34-05 orden conciliacion antes de territorio/subservicio',()=>{
 expect(message(annual({...base,derechosMinimos:{...derechos,conciliacionRentasContribuyente:undefined},retencionTrabajoAeat:{...ret,procedimiento:'regularizacion'}}))).toContain('conciliación')
 expect(message(annual({...base,anio:2026,retencionTrabajoAeat:{...ret,anio:2026,procedimiento:'regularizacion'}}))).toContain('2026')
})
it('R34-06 empate sucede despues de renta',()=>{
 const t=hijo.titulares[0];const second={...hijo,sujetoId:'s-3',titulares:[{...t,custodia:'compartida'},{...t,titularId:'s-4',custodia:'compartida'}]}
 expect(message(annual({...base,derechosMinimos:{...derechos,descendientes:[hijo,second]}}))).toContain('Empate')
 expect(message(annual({...base,derechosMinimos:{...derechos,descendientes:[hijo,second],conciliacionRentasContribuyente:undefined}}))).toContain('conciliación')
})
it('R34-07 A32-P01 entrada numerica tipable negativa alcanza total',()=>{
 const r=annual({...base,retencionesSoportadasCentimos:-200,pagosACuentaCentimos:-100});expect(Result.isSuccess(r)).toBe(true);expect(r.success.retencionesYPagosACuentaCentimos).toBe(-300)
})
for(const field of ['contrato','situacionLaboral']) it(`R34-08 A32-P02 ${field} string externo alcanza anual`,()=>{
 const r=annual({...base,retencionTrabajoAeat:{...ret,[field]:'fuera-del-enum'}});expect(Result.isSuccess(r)).toBe(true);expect(count(r.success)).toBe(17)
})
it('R34-09 igualdad de cifras no identifica transportes',()=>{
 const a=annual({...base,retencionesSoportadasCentimos:777,pagosACuentaCentimos:777,retencionTrabajoAeat:ret}); const b=annual({...base,retencionesSoportadasCentimos:778,pagosACuentaCentimos:776,retencionTrabajoAeat:ret})
 expect(a.success.retencionesYPagosACuentaCentimos).toBe(b.success.retencionesYPagosACuentaCentimos)
 expect(a.success.rastro).not.toEqual(b.success.rastro)
})
it('R34-10 contexto heredado; wrapper suministra servicio propio',()=>{
 const context=Object.create({modo:'canonico'});expect(Result.isSuccess(run(liquidarIrpfAnual(base,context)))).toBe(true)
 const external={liquidar:()=>Effect.fail({motivo:'sentinela'})}
 expect(Result.isSuccess(run(liquidarIrpfAnual(base,context).pipe(Effect.provideService(LiquidacionIrpfAnual,external))))).toBe(true)
 expect(message(run(Effect.gen(function*(){return yield* (yield* LiquidacionIrpfAnual).liquidar(base,context)}).pipe(Effect.provideService(LiquidacionIrpfAnual,external))))).toBe('sentinela')
})
it('R34-11 subservicio falla sin rastro parcial SS',()=>{
 const r=annual({...base,retencionTrabajoAeat:{...ret,procedimiento:'regularizacion'}});expect(message(r)).toContain('Regularización');expect(count(r.failure)).toBe(0)
})
it('R34-12 adaptador no hereda cierre temporal implicito',()=>{
 expect(message(run(calcularSalarioLegacy({anio:2025,salarioBrutoAnualCentimos:3000000,modo:'canonico',perfilAuditoria:'soltero_sin_hijos'})))).toContain('versión')
 expect(Result.isSuccess(run(calcularSalarioLegacy({anio:2025,salarioBrutoAnualCentimos:3000000,seleccionRetencion:{perfilTemporal:'cierre'}})))).toBe(false)
})
for(const [value,ok] of [[1230000,true],[1230001,false],[0,true],[undefined,true],[null,false]]) it(`R34-13 irregular opcional ${value}`,()=>{
 const c={...ret,irregular1Centimos:value};expect(evaluateRetentionAdmission(c,{modo:'canonico'}).outcome==='success').toBe(ok);expect(Result.isSuccess(run(calcularRetencionTrabajoAeat(c,{modo:'canonico'})))).toBe(ok)
})
it('R34-14 calendario JS null: fuente rechaza; duplicado lanza',()=>{
 const c={...ret,perfilTemporal:undefined,fechaPago:null};expect(message(run(calcularRetencionTrabajoAeat(c,{modo:'canonico'})))).toContain('versión');expect(()=>evaluateRetentionAdmission(c,{modo:'canonico'})).toThrow()
})
it('R34-15 control integridad y estados sin bypass',()=>{
 const f=buildAdmissionFragment();expect(verifyAdmissionFragment(f)).toBe(true);f.sites[0].admissionClosed=false;expect(()=>verifyAdmissionFragment(f)).toThrow()
})
// Obligaciones de representación: rojos deliberados, sin cambiar el candidato ni sus esperados.
it('RA34-01 contrato ofrece programa anual evaluable por propiedad',()=>{
 const f=buildAdmissionFragment();expect(f.admissionProgram.every(s=>s.operation==='construct-result'||Array.isArray(s.propertyInputs))).toBe(true)
})
it('RA34-02 selector territorial ofrece condiciones finitas resueltas',()=>{
 const f=buildAdmissionFragment();expect(f.admissionProgram.find(s=>s.id==='territorio')).toHaveProperty('branches')
})
it('RA34-03 schema y callbacks familiares enlazados con operandos de instancia',()=>{
 const f=buildAdmissionFragment();expect(f.admissionProgram.find(s=>s.id==='derechos')).toHaveProperty('propertyContracts')
})
