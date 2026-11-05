import {expect,it} from 'vitest'
import {Effect, Result, Schema} from 'effect'
import Decimal from 'decimal.js'
import {componerLiquidacionAnual, type EntradaComposicionAnual} from '../lib/dominio/irpf/liquidacion/composicion-anual'
import {MINIMOS_ESTATALES_2025} from '../lib/dominio/normativa/datos/minimos-autonomicos-2025'
import {liquidarIrpfAnualExplicito as direct} from '../lib/dominio/irpf/trabajo-anual/conexion'
import {liquidarIrpfAnualExplicito as publicApi} from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import {CasoFiscalAnualExplicito} from '../lib/dominio/irpf/trabajo-anual/conexion-contrato'
import fixture from '../docs/procedencia/simuladores/historico/piloto-oficial.json'
const D=Decimal.clone({precision:80})
const input:EntradaComposicionAnual={ambito:{anio:2018,comunidadAutonoma:'madrid',situacionFamiliar:{tipo:'individual',edad:40,discapacidad:{_tag:'SinDiscapacidad'},descendientes:[],ascendientes:[]}},cotizaciones:{naturaleza:'efectivas',trabajador:new D(1000)},rentasTrabajoAnuales:{integroTrabajo:new D(20000),restoRentas:new D(0)},precision:80,politica:'open-cuotas-empleo-madrid-2018-2024',baseGeneral:new D(10000),baseAhorro:new D(0),rentasAntesReducciones:new D(19000),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0}
// Independent integer oracle: first 2018 brackets, 9.5% state and 9% Madrid.
const half=(c:bigint,n:bigint)=>(c*n+500n)/1000n
for(const cents of [0,1,554999,555000,555005,555006,999999,1244999,1245000])it(`oráculo entero base ${cents}`,()=>{
 const r=Effect.runSync(componerLiquidacionAnual({...input,baseGeneral:new D(cents).div(100)}))
 const b=BigInt(cents),m=b<555000n?b:555000n
 expect(r.cuotaEstatalDespuesMinimo.mul(100).toFixed()).toBe(String(half(b,95n)-half(m,95n)))
 expect(r.cuotaAutonomicaGeneralDespuesMinimo.mul(100).toFixed()).toBe(String(half(b,90n)-half(m,90n)))
 expect(r.cuotaPosterior.mul(100).toFixed()).toBe(String(half(b,95n)-half(m,95n)+half(b,90n)-half(m,90n)))
 expect(r.deduccionTrabajo.isZero()).toBe(true)
})
for(const age of [18,64])it(`admite extremo edad ${age}`,()=>{
 const r=Effect.runSync(componerLiquidacionAnual({...input,ambito:{...input.ambito,situacionFamiliar:{...input.ambito.situacionFamiliar,edad:age}}}))
 expect(r.cuotaPosterior.gte(0)).toBe(true)
})
it('conserva base subcéntimo y Decimal80; otras políticas siguen sin cuantizar',()=>{
 const base=new D('10000.123456789012345678901234567890123456789')
 const r=Effect.runSync(componerLiquidacionAnual({...input,baseGeneral:base}))
 expect(base.toFixed()).toBe('10000.123456789012345678901234567890123456789')
 const raw=Effect.runSync(componerLiquidacionAnual({...input,baseGeneral:base,politica:'decimal-hasta-salida'}))
 expect(raw.cuotaIntegraGeneralEstatal.eq(base.mul('0.095'))).toBe(true)
 expect(r.cuotaIntegraGeneralEstatal.toFixed()).toBe('950.01')
})
for(const c of fixture.cases)it(`ambas API, pagos una vez e inmutabilidad ${c.year}`,()=>{
 const i=Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(c.input);if(i.perfil!=="solo-trabajo")throw new Error("El piloto debe ser empleo");const before=JSON.stringify(i)
 const a=Effect.runSync(direct(i));const b=Effect.runSync(publicApi(i));const again=Effect.runSync(direct(i))
 expect(a).toEqual(b);expect(again).toEqual(a);expect(JSON.stringify(i)).toBe(before)
 expect(new D(a.cuotaPosterior).minus(a.retenciones).toFixed()).toBe(a.cuotaDiferencial)
 expect(a.deduccionTrabajo).toBe('0')
 const no=Effect.runSync(publicApi({...i,retenciones:[]}))
 expect(no.cuotaPosterior).toBe(a.cuotaPosterior);expect(new D(no.cuotaDiferencial).minus(a.cuotaDiferencial).eq(100)).toBe(true)
})
for(const field of ['edad17','edad65','pension','actividad','familia','ahorro','otraCA','2026'])it(`API rechaza ${field}`,()=>{
 const i=structuredClone(fixture.cases[0]!.input)
 const bad={...i}
 if(field==='edad17')bad.edad=17
 if(field==='edad65')bad.edad=65
 if(field==='pension')bad.trabajo={...i.trabajo,rendimientos:i.trabajo.rendimientos.map(r=>({...r,clase:'pension'}))}
 if(field==='actividad')bad.perfil='solo-actividad'
 if(field==='familia')bad.familiaresConDerechoMinimo='segun-derechos'
 if(field==='ahorro')bad.otrasRentas='ahorro'
 if(field==='otraCA')bad.comunidadAutonoma='andalucia'
 if(field==='2026')bad.ejercicio=2026
 // @ts-expect-error Deliberately malformed runtime input.
 expect(Result.isFailure(Effect.runSync(Effect.result(publicApi(bad))))).toBe(true)
})
it('art20 histórico y base mantienen fracción de céntimo',()=>{
 const raw=structuredClone(fixture.cases[0]!.input)
 raw.trabajo.rendimientos[0]!.integro='15876.01'
 const i=Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
 const a=Effect.runSync(publicApi(i))
 expect(a.reduccionArt20).toBe('1461.7425')
 expect(a.baseLiquidableGeneral).toBe('11414.2675')
 expect(a.deduccionTrabajo).toBe('0')
})
import {liquidarIrpfAnual} from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import {analitico} from '../docs/procedencia/reforma-motor/bloque-e/ejemplos'
it('API canonica mantiene ámbito estimado y consumo de pagos histórico',()=>{
 for(const anio of [2018,2019,2020,2021,2022,2023,2024] as const){
  const a=Effect.runSync(liquidarIrpfAnual({...analitico,anio},{modo:'canonico'}))
  const b=Effect.runSync(liquidarIrpfAnual({...analitico,anio,retencionesSoportadasCentimos:10000},{modo:'canonico'}))
  expect(a.cuotaLiquidaCentimos).toBe(b.cuotaLiquidaCentimos)
  expect(a.cuotaDiferencialCentimos-b.cuotaDiferencialCentimos).toBe(10000)
 }
})
