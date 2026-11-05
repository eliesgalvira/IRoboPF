import Decimal from "decimal.js"
import {Effect,Result,Schema} from "effect"
import {expect,it} from "vitest"
import fixture from "./fixtures/open-2018-etapas.json"
import oracle from "./fixtures/open-2018-oraculo-independiente.json"
import {CasoFiscalAnualExplicito} from "../lib/dominio/irpf/trabajo-anual/conexion-contrato"
import {liquidarIrpfAnualExplicito as direct} from "../lib/dominio/irpf/trabajo-anual/conexion"
import {liquidarIrpfAnualExplicito as api} from "../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {calcularReduccionTrabajoConOtrasRentas as art} from "../lib/dominio/irpf/reducciones/reduccion-rendimientos-trabajo"
import {admiteArgumentoOpen2018 as admits} from "../lib/dominio/irpf/trabajo-anual/politica-open-2018"
import {componerLiquidacionAnual as compose,type EntradaComposicionAnual} from "../lib/dominio/irpf/liquidacion/composicion-anual"
import {MINIMOS_ESTATALES_2025} from "../lib/dominio/normativa/datos/minimos-autonomicos-2025"
const D=Decimal.clone({precision:80})
const seed=fixture.cases[0]!.input
const make=(g:string,e:string)=>{
 const raw=structuredClone(seed);raw.retenciones=[]
 raw.trabajo.rendimientos[0]!.integro=g
 raw.trabajo.rendimientos[0]!.cotizaciones.seguridadSocial=e
 return Schema.decodeUnknownSync(CasoFiscalAnualExplicito)(raw)
}
for(const o of oracle) it(`independiente bruto=${o.g} gastos=${o.e}`,()=>{
 const input=make(o.g,o.e),before=JSON.stringify(input)
 const a=Effect.runSync(api(input));expect(Effect.runSync(direct(input))).toEqual(a)
 const got=[a.reduccionArt20,a.baseLiquidableGeneral,a.componentesCuota.gravamenEstatal,a.componentesCuota.gravamenAutonomico,a.componentesCuota.gravamenMinimoEstatal,a.componentesCuota.gravamenMinimoAutonomico,a.cuotaPosterior]
 const want=[o.red,o.base,o.state,o.aut,o.minState,o.minAut,o.quota]
 got.forEach((v,i)=>expect(new D(v).eq(want[i]!),`importe ${i}: ${v} != ${want[i]}`).toBe(true))
 expect(JSON.stringify(input)).toBe(before)
})
it('C300 sintético gastos cero, ambas APIs',()=>{
 const a=Effect.runSync(api(make('15876.02','0')))
 expect(a.reduccionArt20).toBe('711.74')
 expect(Effect.runSync(direct(make('15876.02','0')))).toEqual(a)
 expect(art({anio:2018,rendimientoPrevioNeto:new D('15876.02'),otrasRentasNoExentas:new D(0)}).toFixed()).toBe('711.735')
})
for(const [g,e] of [['1000000.01','1000'],['17000','1000.01'],['17000','1000001']] as const)it(`ambas rechazan transporte ${g}/${e}`,()=>{
 const input=make(g,e)
 for(const f of [api,direct])expect(Result.isFailure(Effect.runSync(Effect.result(f(input))))).toBe(true)
})
for(const [g,e,ok] of [['-0.01','0',false],['0','-1',false],['0','0',true],['1000000','1000000',true],['999999.99','999999',true],['17000','0.01',false],['NaN','0',false],['Infinity','0',false],['0.0000000000000000001','0',false]] as const)it(`admisibilidad ${g}/${e}`,()=>expect(admits(new D(g),new D(e))).toBe(ok))
const base:EntradaComposicionAnual={ambito:{anio:2018,comunidadAutonoma:'madrid',situacionFamiliar:{tipo:'individual',edad:40,discapacidad:{_tag:'SinDiscapacidad'},descendientes:[],ascendientes:[]}},cotizaciones:{naturaleza:'efectivas',trabajador:new D(1000)},rentasTrabajoAnuales:{integroTrabajo:new D(20000),restoRentas:new D(0)},origenBaseGeneralB:'solo-trabajo',precision:80,politica:'open-etapas-empleo-madrid-2018',baseGeneral:new D(10000),baseAhorro:new D(0),rentasAntesReducciones:new D(19000),minimosEstatales:MINIMOS_ESTATALES_2025,deduccionesAutonomicasCentimos:0}
for(const anio of [2017,2019,2024,2025] as const)it(`pin política rechaza año ${anio}`,()=>{
 expect(Result.isFailure(Effect.runSync(Effect.result(compose({...base,ambito:{...base.ambito,anio}}))))).toBe(true)
})
for(const edad of [17,65])it(`pin edad ${edad}`,()=>expect(Result.isFailure(Effect.runSync(Effect.result(compose({...base,ambito:{...base.ambito,situacionFamiliar:{...base.ambito.situacionFamiliar,edad}}}))))).toBe(true))
for(const edad of [18,64])it(`edad límite ${edad}`,()=>expect(Effect.runSync(compose({...base,ambito:{...base.ambito,situacionFamiliar:{...base.ambito.situacionFamiliar,edad}}})).cuotaPosterior.toFixed()).toBe('823.25'))
for(const b of ['0.001','1000000.01'])it(`composición no publica ${b}`,()=>expect(Result.isFailure(Effect.runSync(Effect.result(compose({...base,baseGeneral:new D(b)}))))).toBe(true))
it('canonical Decimal80 conserva subcéntimos y rechaza origen actividad en política nueva',()=>{
 const v=new D('10000.123456789012345678901234567890123456789')
 expect(Effect.runSync(compose({...base,politica:'decimal-hasta-salida',baseGeneral:v})).cuotaIntegraGeneralEstatal.eq(v.mul('.095'))).toBe(true)
 expect(Result.isFailure(Effect.runSync(Effect.result(compose({...base,origenBaseGeneralB:'solo-actividad'}))))).toBe(true)
})

it('schema rechaza subcéntimos y negativos antes de publicar',()=>{for(const g of ['17000.001','-0.01'])expect(()=>make(g,'0')).toThrow()})
