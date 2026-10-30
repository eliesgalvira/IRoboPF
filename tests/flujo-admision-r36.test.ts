import { expect, it } from 'vitest'
import Decimal from 'decimal.js'
import { DateTime, Effect, Result } from 'effect'
import { buildCompleteAdmission, evaluateCompleteAdmission } from '../scripts/procedencia/flujo-admision-r36.mjs'
import { obtenerParametrosComunidadAutonoma } from '../lib/dominio/irpf/comunidades/comunidad-autonoma'
import type { EntradaParametrosComunidadAutonoma } from '../lib/dominio/irpf/comunidades/comunidad-autonoma'
import { liquidarIrpfAnual } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { sinDiscapacidad } from '../lib/dominio/irpf/caso-fiscal-anual'
const f=buildCompleteAdmission()
// SAFETY: ambos literales son el dominio anual y territorial enumerado por el contrato real.
const years=[2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026] as const
// SAFETY: claves explícitas del tipo ComunidadAutonoma, sin datos externos ni coerción.
const communities=['simulada-estatal','andalucia','aragon','asturias','illes-balears','canarias','cantabria','castilla-la-mancha','castilla-y-leon','catalunya','extremadura','galicia','madrid','murcia','la-rioja','comunitat-valenciana','ceuta','melilla'] as const
for(const anio of years)it(`quince resolvers y callbacks ${anio}`,()=>{
 for(const comunidadAutonoma of communities){
  const entrada={anio,comunidadAutonoma}
  const r=evaluateCompleteAdmission(f,'obtenerParametrosComunidadAutonoma',[entrada])
  expect(r.outcome,r.reason).toBe('success')
  expect(r.value).toEqual(obtenerParametrosComunidadAutonoma(entrada))
 }
})
for(const anio of [2014,2015])for(const amount of ['17707.19','17707.20','17707.21','NaN'])it(`Galicia ${anio}/${amount}`,()=>{
 if(anio!==2014&&anio!==2015)throw Error('año fuera del caso')
 const entrada: EntradaParametrosComunidadAutonoma={anio,comunidadAutonoma:'galicia',baseLiquidableGeneral:new Decimal(amount)}
 // SAFETY: el literal conserva la clave del contrato; el número se estrecha mediante guarda arriba.
 const native=obtenerParametrosComunidadAutonoma({...entrada,comunidadAutonoma:'galicia'})
 const r=evaluateCompleteAdmission(f,'obtenerParametrosComunidadAutonoma',[entrada]);expect(r.outcome,r.reason).toBe('success');expect(r.value).toEqual(native)
})
for(const fecha of ['2015-12-30T23:59:59Z','2015-12-31T00:00:00Z','2022-10-27T23:59:59Z','2022-10-28T00:00:00Z','2023-09-14T23:59:59Z','2023-09-15T00:00:00Z','2023-11-25T23:59:59Z','2023-11-26T00:00:00Z'])it(`cortes civiles y milisegundos ${fecha}`,()=>{
 for(const anio of [2015,2022,2023]){
  if(anio!==2015&&anio!==2022&&anio!==2023)throw Error('año fuera del caso')
  for(const comunidadAutonoma of communities){const entrada: EntradaParametrosComunidadAutonoma={anio,comunidadAutonoma,fechaFallecimiento:DateTime.toDateUtc(DateTime.makeUnsafe(fecha))};const r=evaluateCompleteAdmission(f,'obtenerParametrosComunidadAutonoma',[entrada]);expect(r.outcome,r.reason).toBe('success');expect(r.value).toEqual(obtenerParametrosComunidadAutonoma(entrada))}
 }
})
const caso={anio:2025,comunidadAutonoma:'madrid',situacionFamiliar:{tipo:'individual',edad:40,discapacidad:sinDiscapacidad,descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:3000000}]},reducciones:[],deducciones:[{codigo:'INEXISTENTE-R36'}],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}
it('motivo exacto, catálogo real y fracaso sin sitios',()=>{
 const model=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[caso,{modo:'canonico'}])
 const actual=Effect.runSync(Effect.result(liquidarIrpfAnual({...caso,anio:2025,comunidadAutonoma:'madrid',situacionFamiliar:{...caso.situacionFamiliar,tipo:'individual'},reducciones:[]},{modo:'canonico'})))
 expect(Result.isFailure(actual)).toBe(true)
 if(Result.isFailure(actual))expect(model.reason).toBe(actual.failure.motivo)
 expect(model.outcome).toBe('reject');expect(model.sites).toEqual([])
})
it('dinero conserva céntimos/EUR y HALF_UP sin puerto opaco',()=>{
 for(const amount of ['-0.005','0.005','8000.005']){const r=evaluateCompleteAdmission(f,'eurosACentimos',[new Decimal(amount)]);expect(r.outcome,r.reason).toBe('success');expect(r.value).toBe(new Decimal(amount).toDecimalPlaces(2,Decimal.ROUND_HALF_UP).mul(100).toNumber())}
})
it('dominio no ejecuta accessors ni acepta proxies',()=>{
 let called=false
 const value={get deducciones(){called=true;return []}}
 expect(evaluateCompleteAdmission(f,'liquidarIrpfAnual',[value,{modo:'canonico'}]).outcome).toBe('pending');expect(called).toBe(false)
 expect(evaluateCompleteAdmission(f,'liquidarIrpfAnual',[new Proxy({},{}),{}]).outcome).toBe('pending')
})
it('primera nullish no consulta las posteriores; agregado no la sustituye',()=>{
 for(const deducciones of [[],[null,{codigo:'x'}],[undefined,{codigo:'x'}]]){
  const r=evaluateCompleteAdmission(f,'liquidarIrpfAnual',[{...caso,deducciones,deduccionAutonomicaAgregadaCentimos:777},{modo:'canonico'}]);expect(r.outcome,r.reason).toBe('pending');expect(r.reason).toContain('calcularDesgloseCotizacionesPerfilUniforme')
 }
})
it('adaptador completo sin selección y dos proyecciones familiares',()=>{
 for(const perfilAuditoria of ['soltero_sin_hijos','pareja_con_hijos']){
  const r=evaluateCompleteAdmission(f,'casoFiscalLegacy',[{anio:2025,salarioBrutoAnualCentimos:3000000,perfilAuditoria}]);expect(r.outcome,r.reason).toBe('pending');expect(r.reason).toContain('calcularCotizacionesSocialesLegacy')
 }
 const r=evaluateCompleteAdmission(f,'casoFiscalLegacy',[{anio:2025,salarioBrutoAnualCentimos:777}]);expect(r.outcome,r.reason).toBe('success');expect(r.value.rendimientos.trabajo[0].importeIntegroCentimos).toBe(777);expect(r.value.retencionesSoportadasCentimos).toBe(0);expect(r.value.retencionTrabajoAeat).toBeUndefined()
})
