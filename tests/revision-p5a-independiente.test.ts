import { it, expect } from 'vitest'
import { Effect, Schema } from 'effect'
import Decimal from 'decimal.js'
import { SolicitudE38Anual2025 } from '../lib/dominio/irpf/deducciones/galicia-rioja-ampliacion-2025/anual-esquemas'
import { aplicarDeduccionesTerritoriales2025 } from '../lib/dominio/irpf/deducciones/anual-territorial'
import { racional } from '../lib/dominio/irpf/deducciones/anual-territorial-racional'
import { producirPatrimonioP5a } from '../lib/dominio/irpf/patrimonio-p5a/productor'
import { liquidarIrpfAnual, liquidarIrpfAnualExplicito } from '../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import type { CasoFiscalAnual } from '../lib/dominio/irpf/caso-fiscal-anual'
const codes=['rioja_vivienda_habitual_pequenos_municipios','rioja_inversion_vivienda_jovenes_menores_36'] as const
const doc=(referencia:string,fecha='2025-12-31')=>({referencia,fecha,emisor:'Banco o registro'})
const corte=(importe:string,fecha='2025-12-31')=>({importe,documento:doc('saldo-'+fecha,fecha)})
function caso():CasoFiscalAnual{return {anio:2025,comunidadAutonoma:'la-rioja',contribuyenteId:'A',situacionFamiliar:{tipo:'individual',edad:35,discapacidad:{_tag:'SinDiscapacidad'},descendientes:[],ascendientes:[]},rendimientos:{trabajo:[{importeIntegroCentimos:2000000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0}}
function fixture(codigo:typeof codes[number]){
 const movimientos=[['R','ingreso','entrada','30000','2025-01-02'],['D','disposicion','entrada','10000','2025-03-01'],['P','precio','salida','12000','2025-03-01'],['A','amortizacion','salida','500','2025-12-01'],['F','intereses','salida','40','2025-12-01'],['G','gastos_financiacion','salida','10','2025-12-01'],['C','consumo','salida','27450','2025-12-15']].map(([id,clase,sentido,importe,fecha])=>({id,clase,sentido,importe,fecha,cuenta:'CTA',documento:doc(id!,fecha)}))
 const pagos=movimientos.filter(m=>['precio','amortizacion','intereses','gastos_financiacion'].includes(m.clase!)).map(m=>({id:m.id,fecha:m.fecha,importe:m.importe,pagador:'A',receptor:m.id==='P'?'VEN':'BAN',factura:m.id,concepto:m.clase==='precio'?'adquisicion':m.clase==='gastos_financiacion'?'gastos':m.clase,medio:'transferencia',subvencion:'0',especieExenta:'0'}))
 const s=Schema.decodeUnknownSync(SolicitudE38Anual2025)({lote:'E38',nacimientoContribuyente:'1990-01-01',exhaustividad:'expediente_comun_completo_todos_pagadores',inversionesViviendaEjercicio:pagos.map(p=>({id:p.id,titular:'A',fecha:p.fecha,importe:p.importe,documento:p.factura})),patrimonioP5a:{ejercicio:2025,persona:'A',exhaustividad:'todos_activos_deudas_derechos_y_movimientos',censo:[['CTA','cuenta_euros','presente'],['V','vivienda','ausente'],['L','prestamo','ausente']].map(([id,tipo,inicio])=>({id,tipo,inicio,cierre:'presente',titular:'A',participacion:[1,1],documento:doc('censo')})),cuentas:[{id:'CTA',inicio:corte('2000','2025-01-01'),cierre:corte('2000')}],movimientos,adquisicion:{inmueble:'V',fecha:'2025-03-01',vendedor:'VEN',precio:'12000',escritura:doc('escritura','2025-03-01'),valorCierre:corte('12500')},prestamo:{id:'L',fecha:'2025-03-01',acreedor:'BAN',inmueble:'V',contrato:doc('contrato','2025-03-01'),principalCierre:corte('9500')},historia:{desde:'1990-01-01',hasta:'2025-12-31',documento:doc('historia'),derechos:[{inmueble:'V',titular:'A',adquisicion:'2025-03-01',transmision:null,titulo:doc('escritura','2025-03-01')}],anticipos:[],ejercicios:Array.from({length:35},(_,i)=>({anio:1990+i,documento:doc('ejercicio-'+i),eventos:[]}))}},hechos:{codigo,viviendas:[{inmueble:{id:'V',territorio:'la-rioja',titulares:[{titular:'A',numerador:1,denominador:1}],uso:'habitual',residencia:{desde:'2025-03-01',hasta:'2028-03-01'},adquisicion:'2025-03-01',precioAdquisicion:'12000',valorMercadoInicio:'0',valorSuelo:'0',catastralSuelo:'0',catastralConstruccion:'0'},municipio:'Alesanco',municipioHabitual:'Alesanco',operacion:'adquisicion',fechaInicioInversion:'2025-03-01',finConstruccion:'2025-03-01',primeraOcupacion:'2025-03-01',excepcionOcupacion:null,excepcionPermanencia:null,ampliacionPlazoConstruccion:null,obra:null,pagos,coberturaIntereses:'0',deduccionPre2013:null,ejercicioDeduccionAnterior:null,excepcion6812:null,primerPagoObra:'2025-03-01',informeDiscapacidad:null}]}},{onExcessProperty:'error'})
 if(s.patrimonioP5a===undefined||!('viviendas' in s.hechos)||s.hechos.codigo!==codigo||s.hechos.viviendas[0]===undefined)throw Error('Fixture inválida')
 // Adaptación del integrador al alcance público: 32.2 sólo precio12000 sin préstamo.
 // La prueba original financiada y los cuatro rojos de residencia permanecen conservados.
 if(codigo===codes[0]){
  const p=s.patrimonioP5a,v=s.hechos.viviendas[0]
  Object.assign(p,{prestamo:null,censo:p.censo.filter(x=>x.id!=="L"),movimientos:p.movimientos.filter(x=>!["D","A","F","G"].includes(x.id))})
  Object.assign(p.movimientos.find(x=>x.id==="C")!,{importe:"18000"})
  Object.assign(v,{pagos:v.pagos.filter(x=>x.id==="P")})
  Object.assign(s,{inversionesViviendaEjercicio:s.inversionesViviendaEjercicio.filter(x=>x.id==="P")})
 }
 return {s,p:s.patrimonioP5a,v:s.hechos.viviendas[0]}
}
function m(){return {caso:caso(),basesImponiblesE38:{general:new Decimal(14000),ahorro:new Decimal(0)},baseGeneral:new Decimal(14000),baseAhorro:new Decimal(0),minimoPersonalFamiliar:new Decimal(5550),cuotaAutonomica:new Decimal(10000),sujetosConMinimo:[],atribucionesMinimo:[]}}
function total(s:SolicitudE38Anual2025){return aplicarDeduccionesTerritoriales2025({solicitudes:[s]},m()).total}
function ambas(s:SolicitudE38Anual2025){
 const solicitud={solicitudes:[s]}
 const canon=Effect.runSync(liquidarIrpfAnual({...caso(),deduccionesTerritoriales2025:solicitud},{modo:'canonico'}))
 const explicito=Effect.runSync(liquidarIrpfAnualExplicito({ejercicio:2025,comunidadAutonoma:'la-rioja',contribuyenteId:'A',edad:35,modalidad:'individual',residenciaTodoElAnio:true,devengo:'2025-12-31',otrasRentas:'ninguna',familiaresConDerechoMinimo:'ninguno',discapacidad:'ninguna',reduccionesBase:'ninguna',saldosAnteriores:'ninguno',deducciones:'territoriales-por-hechos-y-da61',deduccionesTerritoriales2025:solicitud,rentasExtranjeras:'ninguna',especialidades:'ninguna',perfil:'solo-trabajo',conciliacion:{ejercicio:2025,estado:'totales-anuales-sin-duplicados',procedencia:['certificado']},trabajo:{ejercicio:2025,territorio:'comun',reduccionesArt18:'ninguna',movilidad:'ninguna',discapacidadActiva:'ninguna',rendimientos:[{id:'R',clase:'empleo-laboral',integro:'20000',cotizaciones:{clase:'efectivas',seguridadSocial:'0',derechosPasivos:'0',colegiosHuerfanos:'0'},sindicato:{importe:'0',satisfecho:'no'},colegio:{importe:'0',satisfecho:'no',obligatorio:'no',finesEsenciales:'no'},defensa:{importe:'0',satisfecho:'no',litigioDirectoPagador:'no'}}]},retenciones:[]}))
 return [canon.deduccionesTerritoriales2025?.total,explicito.deduccionesTerritoriales2025?.total]
}
for(const code of codes){
 const expected=code===codes[0]?'452':'382.5'
 it('libro: precio directo12000 o capital2500 base2550 '+code,()=>{const {s,p,v}=fixture(code);expect(total(s)).toEqual(racional(expected));expect(producirPatrimonioP5a(p,'A','1990-01-01',v).traza.incrementoComparable).toEqual({numeradorCentimos:code===codes[0]?'1200000':'250000',denominador:'1'})})
 it('umbral no prorrateable: falta un céntimo '+code,()=>{const {s,p}=fixture(code);Object.assign(p.cuentas[0]!.cierre,{importe:'1999.99'});Object.assign(p.movimientos.find(x=>x.id==='C')!,{importe:code===codes[0]?'18000.01':'27450.01'});expect(total(s)).toEqual(racional('0'))})
 it('herencia gastada excluida y no compensa ahorro '+code,()=>{const {s,p}=fixture(code);Object.assign(p.movimientos[0]!,{clase:'herencia'});expect(total(s)).toEqual(racional('0'))})
 it('valor de cierre cero no elimina capital propio '+code,()=>{const {s,p}=fixture(code);Object.assign(p.adquisicion.valorCierre,{importe:'0'});expect(total(s)).toEqual(racional(expected))})
 it('precio particionado en cuatro pagos '+code,()=>{const {s,p,v}=fixture(code);Object.assign(p,{movimientos:p.movimientos.flatMap(x=>x.id==='P'?['0.01','3999.99','4000','4000'].map((importe,i)=>({...x,id:'P'+i,importe,documento:doc('P'+i,x.fecha)})):[x])});Object.assign(v,{pagos:v.pagos.flatMap(x=>x.id==='P'?['0.01','3999.99','4000','4000'].map((importe,i)=>({...x,id:'P'+i,factura:'P'+i,importe})):[x])});Object.assign(s,{inversionesViviendaEjercicio:v.pagos.map(x=>({id:x.id,titular:'A',fecha:x.fecha,importe:x.importe,documento:x.factura}))});expect(total(s)).toEqual(racional(expected))})
 it('reserva duplicada rechazada '+code,()=>{const {s}=fixture(code);expect(()=>aplicarDeduccionesTerritoriales2025({solicitudes:[s,s]},m())).toThrow()})
 it('derecho anterior no representado '+code,()=>{const {s,p}=fixture(code);Object.assign(p.historia,{derechos:[...p.historia.derechos,{...p.historia.derechos[0]!,inmueble:'ANT'}]});expect(()=>total(s)).toThrow()})
 it('80 cifras de cuota '+code,()=>{const {s}=fixture(code);expect(aplicarDeduccionesTerritoriales2025({solicitudes:[s]},{...m(),cuotaAutonomica:new Decimal('0.'+'0'.repeat(78)+'1')}).total).toEqual(racional('1',String(10n**79n)))})
 it('REV-RESIDENCIA: abandono anterior a adquisición no da deducción '+code,()=>{const {s,v}=fixture(code);Object.assign(v,{primeraOcupacion:'2020-03-01'});Object.assign(v.inmueble,{residencia:{desde:'2020-03-01',hasta:'2023-03-01'}});expect(total(s)).toEqual(racional('0'))})
 it('REV-RESIDENCIA ambas API: habitualidad abandonada '+code,()=>{const {s,v}=fixture(code);Object.assign(v,{primeraOcupacion:'2020-03-01'});Object.assign(v.inmueble,{residencia:{desde:'2020-03-01',hasta:'2023-03-01'}});expect(ambas(s)).toEqual([racional('0'),racional('0')])})
}
for(const code of codes){
 for(const fallo of ['saldo','principal','receptor','cuenta','censo','fiscal','reinversion','importe','fecha','signo','omision','factura'])it('conciliación independiente '+code+' '+fallo,()=>{
  const {s,p,v}=fixture(code)
  if(fallo==='saldo')Object.assign(p.cuentas[0]!.cierre,{importe:'2000.01'})
  if(fallo==='principal'){if(p.prestamo!==null)Object.assign(p.prestamo.principalCierre,{importe:'9500.01'});else Object.assign(p,{censo:[...p.censo,{...p.censo[0],id:'L',tipo:'prestamo'}]})}
  if(fallo==='receptor')Object.assign(v.pagos[0]!,{receptor:'OTRO'})
  if(fallo==='cuenta')Object.assign(p.movimientos[0]!,{cuenta:'DESCONOCIDA'})
  if(fallo==='censo')Object.assign(p,{censo:[...p.censo,p.censo[0]]})
  if(fallo==='fiscal')Object.assign(p.historia,{ejercicios:p.historia.ejercicios.slice(1)})
  if(fallo==='reinversion')Object.assign(p.historia.ejercicios[0]!,{eventos:[{tipo:'reinversion',inmueble:'V',documento:doc('reinv')}]})
  if(fallo==='importe')Object.assign(v.pagos[0]!,{importe:'11999.99'})
  if(fallo==='fecha')Object.assign(p.movimientos[0]!,{fecha:'2025-02-30'})
  if(fallo==='signo')Object.assign(p.movimientos[0]!,{sentido:'salida'})
  if(fallo==='omision')Object.assign(v,{pagos:v.pagos.slice(1)})
  if(fallo==='factura')Object.assign(v.pagos[0]!,{factura:'OTRA'})
  expect(()=>total(s)).toThrow()
 })
 it('sin financiación: límite de base y cuota '+code,()=>{const {s,p,v}=fixture(code);Object.assign(p,{prestamo:null,censo:p.censo.filter(x=>x.id!=='L'),movimientos:p.movimientos.filter(x=>!['D','A','F','G'].includes(x.id))});Object.assign(p.movimientos.find(x=>x.id==='C')!,{importe:'18000'});Object.assign(v,{pagos:v.pagos.filter(x=>x.id==='P')});Object.assign(s,{inversionesViviendaEjercicio:s.inversionesViviendaEjercicio.filter(x=>x.id==='P')});expect(total(s)).toEqual(racional(code===codes[0]?'452':'1350'))})
 it('ocupación tardía fuera de doce meses '+code,()=>{const {s,v}=fixture(code);Object.assign(v,{primeraOcupacion:'2027-03-01'});Object.assign(v.inmueble,{residencia:{desde:'2027-03-01',hasta:'2030-03-01'}});expect(total(s)).toEqual(racional('0'))})
}
