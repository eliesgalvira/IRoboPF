import { describe, expect, it } from '@effect/vitest'
import { Effect, Schema } from 'effect'
import nuevos from './fixtures/trabajo-alquiler-suelo-desconocido-2025.json'
import originales from './fixtures/trabajo-alquiler-ordinario-2025.json'
import { CasoTrabajoAlquilerOrdinario2025 } from '../lib/dominio/irpf/trabajo-alquiler-ordinario-2025/contrato'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { oraculo, igual } from './trabajo-alquiler-suelo-desconocido-2025.oracle'
const canonica=(c:CasoTrabajoAlquilerOrdinario2025)=>liquidarIrpfAnual(c,{modo:'canonico'})
const apis=[canonica,liquidarIrpfAnualExplicito] as const
const decode=Schema.decodeUnknownSync(CasoTrabajoAlquilerOrdinario2025)
const parseOptions={onExcessProperty:'error'} as const
describe('Cuatro diagnósticos adicionales condicionados a historia declarada, sin peso',()=>{
 for(const [i,row] of nuevos.entries()){
  it.effect(row.id,()=>Effect.gen(function*(){
   const c=decode(row.entrada,parseOptions), v=c.inmuebles[0]!, a=v.adquisicion
   const o=oraculo(a.precio,a.gastosTributos,v.catastro2025.suelo,v.catastro2025.construccion)
   expect(igual(o.amortizacion,{n:2500n,d:1n})).toBe(true)
   for(const api of apis){
    const r=yield* api(c), x=r.inmuebles[0]!
    expect(igual(x.amortizacion,o.amortizacion)).toBe(true)
    expect(igual(x.neto,o.neto)).toBe(true)
    expect(igual(x.netoReducido,o.rnr)).toBe(true)
    expect(x.inmueble).toEqual(v)
    expect(r.aceptacionFiscal).toBe('pendiente')
    expect(r.baseImponibleGeneral.minus(r.rendimientoNetoTrabajo).toFixed(2)).toBe(r.composicion.politicaAlquilerOpen2025===undefined?'4250.00':'4250.05')
    const frontera=decode({...c,historia2024:{...c.historia2024,construccion:'83333.33'}},parseOptions)
    const rf=yield* api(frontera)
    expect(igual(rf.inmuebles[0]!.amortizacion,o.amortizacion)).toBe(true)
    // Vector derivado separado: gastos onerosos se reparten por la misma razón exacta.
    const conGastos=decode({...c,inmuebles:[{...v,adquisicion:{...a,gastosTributos:'1200'}}]},parseOptions)
    const rg=yield* api(conGastos)
    expect(igual(rg.inmuebles[0]!.amortizacion,oraculo(a.precio,'1200',v.catastro2025.suelo,v.catastro2025.construccion).amortizacion)).toBe(true)
    // El formato conocido anterior y el discriminado deben conservar2400 y el diferencial en el perfil ordinario.
    const antiguo=decode(originales[i]!.entrada,parseOptions), av=antiguo.inmuebles[0]!, aa=av.adquisicion
    const {sueloPrecio,sueloGastosTributos,...comunes}=aa
    const conocido=decode({...antiguo,inmuebles:[{...av,adquisicion:{...comunes,costeSuelo:{estado:'conocido',precio:sueloPrecio,gastosTributos:sueloGastosTributos}}}]},parseOptions)
    const r0=yield* api(antiguo), r1=yield* api(conocido)
    expect(igual(r0.inmuebles[0]!.amortizacion,{n:2400n,d:1n})).toBe(true)
    expect(r1.cuotaDiferencial.eq(r0.cuotaDiferencial)).toBe(true)
   }
  }))
  it.effect(row.id+' adversos en ambas API',()=>Effect.gen(function*(){
   const c=decode(row.entrada,parseOptions), v=c.inmuebles[0]!, a=v.adquisicion
   const malos:unknown[]=[
    {...c,inmuebles:[{...v,adquisicion:{...a,costeSuelo:undefined}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,costeSuelo:{estado:'otro'}}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,sueloPrecio:'20000',sueloGastosTributos:'0'}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,costeSuelo:{estado:'desconocido',precio:'20000'}}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,costeSuelo:{estado:'conocido',precio:'100000.01',gastosTributos:'0'}}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,amortizacion:'2499.90'}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,base:'83333.33'}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,porcentajeConstruccion:'83.33'}}]},
    {...c,inmuebles:[{...v,adquisicion:{...a,precio:'0',gastosTributos:'0'}}]},
    {...c,inmuebles:[{...v,catastro2025:{...v.catastro2025,suelo:'0',construccion:'0'}}]},
    {...c,inmuebles:[{...v,catastro2025:{...v.catastro2025,construccion:'0'}}]},
    {...c,inmuebles:[{...v,catastro2025:{...v.catastro2025,construccion:'100000.01'}}]},
    {...c,historia2024:{...c.historia2024,construccion:'83333.34'}},
    {...c,inmuebles:[{...v,derecho:'usufructo'}]},
    {...c,inmuebles:[{...v,personalJornadaCompleta:'si'}]},
    {...c,inmuebles:[{...v,gastos:v.gastos.map(g=>({...g,clase:'mejora'}))}]},
    {...c,inmuebles:[{...v,usosDesdeAdquisicion:v.usosDesdeAdquisicion.slice(1)}]},
    {...c,baseGeneral:'30300'}, {...c,amortizacion:'2500'},
   ]
   for(const raw of malos)for(const api of apis){
    // @ts-expect-error Entrada hostil sin decodificar para probar la frontera pública.
    const error=yield* Effect.flip(api(raw))
    expect(error._tag).toBe('RechazoP4a')
   }
  }))
 }
 it.effect('R1: no presume el suelo catastral histórico ni amortización anterior cero',()=>Effect.gen(function*(){
  const c=decode(nuevos[0]!.entrada,parseOptions),v=c.inmuebles[0]!
  const adverso=decode({...c,historia2024:{...c.historia2024,construccion:'100'},inmuebles:[{...v,catastro2025:{...v.catastro2025,suelo:'99900',construccion:'100'}}]},parseOptions)
  for(const api of apis){const error=yield* Effect.flip(api(adverso));expect(error._tag).toBe('RechazoP4a');expect(error.motivo).toContain('historia insuficiente')}
 }))
 it('Madrid13 conserva la revisión vigente del diseño, sin modificar su resultado ausente',()=>{
  const r=nuevos[3]!
  expect(r.id).toBe('open2025-madrid-13-v2-suelo-desconocido-v1')
  expect(r.entrada.trabajo.rendimientos[0]!.integro).toBe('32000.00')
  expect(r.entrada.trabajo.rendimientos[0]!.cotizaciones.seguridadSocial).toBe('2080.00')
  expect(r.entrada.retenciones[0]!.importe).toBe('4480.00')
 })
})
