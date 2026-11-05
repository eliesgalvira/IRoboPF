import {it,expect} from 'vitest'
import {Effect} from 'effect'
import Decimal from 'decimal.js'
import {casoP4a,solicitudP4a} from './inmobiliario-p4a.fixtures'
import {producirInmueblesP4a} from '../lib/dominio/irpf/inmobiliario-2025/productor'
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
function caso(b=false,renta='14000',gasto='3200') {
 const c=structuredClone(casoP4a()),v=c.inmuebles[0];c.comunidadAutonoma=v.ubicacion=b?'illes-balears':'canarias'
 v.adquisicion={...v.adquisicion,fecha:'2025-04-01',precio:'160000',sueloPrecio:'40000',gastosTributos:'10000',sueloGastosTributos:'2500'}
 v.catastro2025={documento:'IBI25-R',suelo:'30000',construccion:'90000'}
 v.contrato={...v.contrato,firma:'2025-09-20',desde:'2025-10-01',hasta:'2028-09-30'}
 v.usosDesdeAdquisicion=[{desde:'2025-04-01',hasta:'2025-09-30',uso:'a-disposicion'},{desde:'2025-10-01',hasta:'2025-12-31',uso:'alquiler-vivienda'}]
 v.exigibilidades=[10,11,12].map(m=>({id:'R'+m,documento:'DOC-R'+m,fecha:'2025-'+m+'-01',importe:renta}))
 v.gastos=[{...v.gastos[0],importe:gasto,totalFactura:gasto,fechaOperacion:'2025-11-15',fechaFactura:'2025-11-16',fechaPago:'2025-12-01',periodoDevengo:{desde:'2025-11-01',hasta:'2025-11-30'}}]
 v.primerAlquiler2025={tituloOneroso:'ESC1',construccionTerminada:'2001-01-01',documentoConstruccion:'FIN-OBRA-R',historiaInmueble:[{desde:'2001-01-01',hasta:'2025-03-31',propietario:'vendedor-R',documento:'HIST-R1',uso:'sin-alquiler'},{desde:'2025-04-01',hasta:'2025-09-30',propietario:'s-1',documento:'HIST-R2',uso:'sin-alquiler'}],historiaPersonal:{persona:'s-1',nacimiento:'1985-05-20',hasta:'2025-12-31',documento:'HP-R',cobertura:'todos-los-inmuebles-y-medidas-desde-nacimiento',alquileresAnteriores:[],aplicacionesAnteriores:[]},censoDerechos:{documento:'CENSO-R',cobertura:'mundial-completo-a-devengo',inmuebles:['V1']},vinculo:{documento:'VINC-R',conyuge:false,parejaEquiparada:false,consanguinidad:0,afinidad:0},catastroImputacion:{municipio:'M-R',notificacion:'2019-01-01',entradaVigor:'2019-01-01',documento:'PON-R',procedimiento:'colectivo-general'},fianza:{ente:b?'IBAVI':'ICAVI',resguardo:'IBAVI1',fecha:'2025-10-01'},superficieUtil:'1000',documentoSuperficie:'CED-R',rentaMensual:[{concepto:'renta completa',importe:renta}],programa:'ordinario',observacion:{hasta:'2025-12-31',arrendatario:'inquilino',documento:'OBS-R',incidencias:'ninguna'}}
 const s=structuredClone(solicitudP4a(b)),w=s.hechos.viviendas[0];s.codigo=b?'balears_arrendador_vivienda_permanente_otros_gastos':'canarias_puesta_viviendas_mercado_arrendamiento'
 w.adquisicion=v.adquisicion.fecha;w.alquiler={...w.alquiler,desde:v.contrato.desde,hasta:v.contrato.hasta,rentaMensual:renta,superficieUtil:'1000'};w.historiaContratos=[{id:'C1',desde:v.contrato.desde,hasta:v.contrato.hasta}]
 w.gastos=b?[{...w.gastos[0],fecha:'2025-12-01',concepto:'reparacion',importe:gasto}]:[]
 c.deduccionesTerritoriales2025={solicitudes:[s]};return c
}
const apis=[(c)=>liquidarIrpfAnual(c,{modo:'canonico'}),(c)=>liquidarIrpfAnualExplicito(c)]
const eq=(a,n,d=1n)=>expect(a.n*d).toBe(n*a.d)
// Oráculos racionales propios: 183 días disposición; 92 alquiler; coste construcción127500.
for(const b of [false,true]) for(const [j,api] of apis.entries()) it('positivo independiente regional/API '+b+'/'+j,async()=>{
 const r=await Effect.runPromise(api(caso(b)));const v=r.inmuebles[0]
 eq(v.integro,42000n);eq(v.amortizacion,351900n,365n);eq(v.imputacion,241560n,365n)
 eq(v.neto,13810100n,365n);eq(v.netoReducido,6905050n,365n)
 const D=Decimal.clone({precision:80});expect(r.baseImponibleGeneral.toString()).toBe(new D(7146610).div(365).toString())
 expect(r.composicion.deduccionesAutonomicasAplicadas.toString()).toBe(b?'1500':'1000')
 expect(r.cuotaDiferencial.eq(r.composicion.cuotaPosterior)).toBe(true)
})
for(const [name,change] of [
 ['alquiler-vendedor-2001',(c)=>c.inmuebles[0].primerAlquiler2025.historiaInmueble[0].uso='alquiler'],
 ['otro-derecho-mundial',(c)=>c.inmuebles[0].primerAlquiler2025.censoDerechos.inmuebles.push('V2')],
 ['aplicacion-previa',(c)=>c.inmuebles[0].primerAlquiler2025.historiaPersonal.aplicacionesAnteriores.push({inmueble:'V2',ejercicio:2024,codigo:'regional',documento:'D24'})],
 ['pareja',(c)=>c.inmuebles[0].primerAlquiler2025.vinculo.parejaEquiparada=true],
 ['carencia-mes',(c)=>c.inmuebles[0].exigibilidades.pop()],
 ['factura-duplicada-linea',(c)=>{const g=c.inmuebles[0].gastos[0];c.inmuebles[0].gastos.push({...g,id:'P2'})}],
 ['gasto-anual-mixto',(c)=>c.inmuebles[0].gastos[0].periodoDevengo.desde='2025-04-01'],
 ['renta-exceso-balear',(c)=>{const v=c.inmuebles[0];v.primerAlquiler2025.superficieUtil='1';c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].alquiler.superficieUtil='1'}],
 ['fianza-ente-balear',(c)=>c.inmuebles[0].primerAlquiler2025.fianza.ente='ICAVI'],
 ['CAIB-excluido',(c)=>c.inmuebles[0].primerAlquiler2025.programa='CAIB1800'],
 ['seis-meses-excedido',(c)=>{const v=c.inmuebles[0];v.adquisicion.fecha='2025-03-31';v.usosDesdeAdquisicion[0].desde='2025-03-31';v.primerAlquiler2025.historiaInmueble[0].hasta='2025-03-30';v.primerAlquiler2025.historiaInmueble[1].desde='2025-03-31';c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].adquisicion='2025-03-31'}],
]) for(const [j,api] of apis.entries())it('rechazo '+name+'/'+j,async()=>{
 const c=caso(name.includes('balear')||name==='CAIB-excluido');change(c);await expect(Effect.runPromise(api(c))).rejects.toBeDefined()
})
it('imputacion2por100 y sin gasto regional no inventa base',async()=>{const c=caso(true,'14000','0');c.inmuebles[0].gastos=[];c.deduccionesTerritoriales2025.solicitudes[0].hechos.viviendas[0].gastos=[];c.inmuebles[0].primerAlquiler2025.catastroImputacion.procedimiento='otro';const r=await Effect.runPromise(apis[0](c));eq(r.imputacion,439200n,365n);expect(r.composicion.deduccionesAutonomicasAplicadas.isZero()).toBe(true)})
it('mejora posterior al alquiler amortiza desde servicio documentado',async()=>{const c=caso();delete c.deduccionesTerritoriales2025;const g=c.inmuebles[0].gastos[0];g.clase='mejora';g.puestaEnServicio='2025-12-01';const r=await Effect.runPromise(producirInmueblesP4a(c));eq(r.inmuebles[0].amortizacion,354876n,365n)})
for(const [j,api] of apis.entries())it('mejora anterior a terminación declarada rechazada/API '+j,async()=>{const c=caso();delete c.deduccionesTerritoriales2025;const g=c.inmuebles[0].gastos[0];g.clase='mejora';g.puestaEnServicio='2025-10-01';await expect(Effect.runPromise(api(c))).rejects.toBeDefined()})

for(const [j,api] of apis.entries())it('rechazo previo y servicio igual a operación con factura posterior/API '+j,async()=>{
 const c=caso();const g=c.inmuebles[0].gastos[0];g.clase='mejora';g.puestaEnServicio='2025-10-01'
 await expect(Effect.runPromise(api(c))).rejects.toBeDefined()
 g.puestaEnServicio='2025-11-15';const coherente=await Effect.runPromise(api(c))
 eq(coherente.inmuebles[0].amortizacion,356412n,365n)
})
for(const [j,api] of apis.entries())it('cuota insuficiente no arrastra ni duplica/API '+j,async()=>{const r=await Effect.runPromise(api(caso(false,'1800','0')));expect(r.composicion.deduccionesAutonomicasAplicadas.isZero()).toBe(true)})
for(const [gasto,deduccion] of [['1000','500'],['3000','1500'],['4000','1500']])it('Baleares base no minorada por gasto estatal '+gasto,async()=>{const r=await Effect.runPromise(apis[1](caso(true,'14000',gasto)));const D=Decimal.clone({precision:80});expect(r.composicion.deduccionesAutonomicasAplicadas.toString()).toBe(D.min(deduccion,r.composicion.cuotaAutonomicaGeneralDespuesMinimo).toString())})
it('base80 independiente con precision global7',async()=>{const anterior=Decimal.precision;try{Decimal.set({precision:7});const r=await Effect.runPromise(apis[0](caso()));const D=Decimal.clone({precision:80});expect(r.baseImponibleGeneral.toString()).toBe(new D(7146610).div(365).toString())}finally{Decimal.set({precision:anterior})}})
