import { it, expect } from 'vitest'
import { Effect } from 'effect'
import Decimal from 'decimal.js'
import { liquidarIrpfAnual,liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import { casoCanonicoELA,casoEfectivoELA,censoELA } from './ela-ingreso-2025-fixtures'
import { prepararIngresosIdentificados2025 } from '../lib/dominio/irpf/ingresos-identificados-2025/productor'
import { racional } from '../lib/dominio/irpf/deducciones/anual-territorial-racional'
import cases from './fixtures/ela-regiones-revision-oraculos.json'
function datos(region,aid='2000') {
 const gal=region==='galicia', admin=gal?'xunta_galicia':'junta_extremadura';const c=structuredClone(censoELA(aid));const a=c.ayudas[0]
 Object.assign(a,{programa:gal?'galicia-bs215a-2025':'extremadura-ela-2025',administracion:admin,enfermedad:gal?'ELA_o_fenotipo':'ELA'})
 Object.assign(a.resolucion,{organismo:gal?'Dirección General de Mayores y Atención Sociosanitaria':'Secretaría General de la Consejería de Salud y Servicios Sociales',importeConcedido:gal?aid:'2000'})
 Object.assign(a.cobros[0],{ordenante:admin})
 const diagnostico={referencia:'declarado-no-autenticado',emisor:'hospital declarado',fecha:'2024-01-31'}
 const sol={solicitudes:[gal?{lote:'E38',nacimientoContribuyente:'1980-01-01',exhaustividad:'expediente_comun_completo_todos_pagadores',inversionesViviendaEjercicio:[],hechos:{codigo:'galicia_ayudas_ela_fenotipos',ingresoId:'ELA1',diagnostico}}:{lote:'D51',codigo:'extremadura_ayudas_subvenciones_ela',hechos:{ingresoId:'ELA1',diagnostico,exhaustividad:'completa'}}]}
 return {c,sol}
}
function run(api,region,c,sol,bruto='22000',extra={}) {
 const v=api==='canonica'?{...casoCanonicoELA(),comunidadAutonoma:region,ingresosIdentificados2025:c,deduccionesTerritoriales2025:sol,rendimientos:{trabajo:[{importeIntegroCentimos:Number(bruto)*100}]},...extra}:{...casoEfectivoELA(censoELA(),{solicitudes:[]},bruto),comunidadAutonoma:region,ingresosIdentificados2025:c,deduccionesTerritoriales2025:sol,deducciones:sol===undefined?'solo-da61-si-procede':'territoriales-por-hechos-y-da61',...extra}
 return Effect.runSync(api==='canonica'?liquidarIrpfAnual(v,{modo:'canonico'}):liquidarIrpfAnualExplicito(v))
}
for(const x of cases) it(JSON.stringify(x),()=>{
 const {c,sol}=datos(x.region,x.aid);if(x.region==='galicia' && Number(x.aid)>12000){expect(()=>run(x.api,x.region,c,sol,x.bruto)).toThrow();return};const precision=Decimal.precision
 try{Decimal.set({precision:80});const r=run(x.api,x.region,c,sol,x.bruto);const t=r.nodosFiscalesB2025.tiposMediosGenerales
 expect(t.baseLiquidableGeneral).toBe(x.base);expect(t.cuotaGeneralEstatalArt63_1).toBe(x.qe);expect(t.cuotaGeneralAutonomicaArt74_1).toBe(x.qa);expect(t.estatal).toBe(x.te);expect(t.autonomico).toBe(x.ta)
 expect(r.deduccionesTerritoriales2025.aplicaciones[0].generado).toEqual(racional(x.gen));expect(r.deduccionesTerritoriales2025.aplicaciones[0].aplicado).toEqual(racional(x.ap));expect(r.libroIngresosIdentificados2025.aceptacionFiscal).toBe('pendiente')
 if(x.api==='efectiva')expect(r.reduccionArt20).toBe(x.red)
 else expect(r.reduccionRendimientosTrabajoCentimos).toBe(Math.round(Number(x.red)*100))
 for(const selection of [undefined,{solicitudes:[]}]){const sin=run(x.api,x.region,c,selection,x.bruto);expect(sin.nodosFiscalesB2025).toEqual(r.nodosFiscalesB2025);expect(sin.libroIngresosIdentificados2025).toEqual(r.libroIngresosIdentificados2025)}
 expect(Decimal.precision).toBe(80)
 }finally{Decimal.set({precision})}
})
for(const region of ['galicia','extremadura'])for(const api of ['canonica','efectiva']){
 const mutations={
  titular:a=>a.beneficiario='B',ordenante:a=>a.cobros[0].ordenante='otro',administracion:a=>a.administracion='otro',programa:a=>a.programa='saad',diagnosticoEnfermedad:a=>a.enfermedad='otra',organismo:a=>a.resolucion.organismo='Ministerio',fuera2025:a=>a.cobros[0].fecha='2026-01-01',civil:a=>a.cobros[0].fecha='2025-02-30',anterior:a=>a.cobros[0].fecha='2025-08-31',sinCobro:a=>a.cobros=[],exceso:a=>a.cobros[0].euros='13000',duplicado:a=>a.cobros.push({...a.cobros[0]}),clasificacion:a=>a.clasificacionFiscal='exenta',refVacia:a=>a.resolucion.referencia=' ',importe2026:a=>a.resolucion.importeConcedido='24000'
 }
 for(const [name,mutate] of Object.entries(mutations))it(`${region}/${api}/adversa/${name}`,()=>{
 const {c,sol}=datos(region);mutate(c.ayudas[0]);expect(()=>run(api,region,c,sol)).toThrow()
 })
 for(const name of ['diagnosticoPosterior','diagnosticoInvalido','expedienteAjeno','ELA81'])it(`${region}/${api}/${name}`,()=>{
 const {c,sol}=datos(region);const h=sol.solicitudes[0].hechos
 if(name==='diagnosticoPosterior')h.diagnostico.fecha='2025-09-02'
 if(name==='diagnosticoInvalido')h.diagnostico.fecha='2025-02-29'
 if(name==='expedienteAjeno')h.ingresoId='OTRO'
 expect(()=>run(api,region,c,sol,'22000',name==='ELA81'?{maternidad2025:{}}:{})).toThrow()
 })
 it(`${region}/${api}/cobros-fraccionados-y-reserva`,()=>{
 const {c,sol}=datos(region);const a=c.ayudas[0];a.cobros=[{...a.cobros[0],euros:'750.13'},{...a.cobros[0],cobroId:'segundo',justificante:'segundo-doc',euros:'1249.87',fecha:'2025-12-31'}]
 const r=run(api,region,c,sol);expect(r.libroIngresosIdentificados2025.totalIntegradoGeneral).toEqual(racional('2000'));expect(r.libroIngresosIdentificados2025.reservas.join(' ')).toContain('no se certifica')
 })
}
it('Asturias productor conserva cobro parcial',()=>{const c=structuredClone(censoELA());c.ayudas[0].cobros[0].euros='999.99';const p=prepararIngresosIdentificados2025(c,{anio:2025,comunidadAutonoma:'asturias',contribuyenteId:'A',fallecimiento:false});expect(p.estado).toBe('preparado');expect(p.preparacion.totalGeneral.toFixed()).toBe('999.99')})

it('diagnostico precisión: medir mismo caso con6 y80, sin acomodar oráculo',()=>{
 const medidas=[];const original=Decimal.precision
 try{for(const precision of [6,80]){Decimal.set({precision});for(const region of ['galicia','extremadura'])for(const api of ['canonica','efectiva']){const {c,sol}=datos(region,region==='galicia'?'12000':'2000');const r=run(api,region,c,sol,'60000');medidas.push({precision,region,api,tipos:r.nodosFiscalesB2025.tiposMediosGenerales,aplicacion:r.deduccionesTerritoriales2025.aplicaciones[0],cuotaLiquidaCentimos:r.cuotaLiquidaCentimos,cuotaDiferencialCentimos:r.cuotaDiferencialCentimos,cuotaLiquida:r.cuotaLiquida})}}}finally{Decimal.set({precision:original})}
 for(const region of ['galicia','extremadura'])for(const api of ['canonica','efectiva']){const a=medidas.find(x=>x.precision===80&&x.region===region&&x.api===api);const b=medidas.find(x=>x.precision===6&&x.region===region&&x.api===api);expect({...b,precision:80}).toEqual(a)}
})

for(const region of ['galicia','extremadura'])it(`${region}: ROJO precisión global6 altera cuota canónica`,()=>{
 const original=Decimal.precision;const {c,sol}=datos(region,region==='galicia'?'12000':'2000')
 try{Decimal.set({precision:80});const a=run('canonica',region,c,sol,'60000');Decimal.set({precision:6});const b=run('canonica',region,c,sol,'60000');expect(b.cuotaLiquidaCentimos).toBe(a.cuotaLiquidaCentimos)}finally{Decimal.set({precision:original})}
})
