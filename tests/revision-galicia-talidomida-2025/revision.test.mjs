import {describe,it,expect} from 'vitest'
import {Effect} from 'effect'
import Decimal from 'decimal.js'
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from '../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual'
import {casoCanonicoELA,casoEfectivoELA} from '../ela-ingreso-2025-fixtures'
import casos from './oraculos-independientes.json'
import mixto from './oraculo-mixto.json'
function censo(euros='20000.33') {return {ejercicio:2025,contribuyenteId:'A',ambito:'ayudas-publicas-no-transmision',exhaustividad:'completa',ayudas:[{ayudaId:'T',beneficiario:'A',programa:'talidomida-rd574-2023-cobro2025',administracion:'imserso',clasificacionFiscal:'ganancia-patrimonial-no-transmision-no-exenta',expediente:{referencia:'X',titular:'A',objeto:'ayuda-publica-RD574_2023-talidomida-1950_1985',cobrosPrevios:'ninguno'},resolucion:{referencia:'R',organismo:'Dirección General del Imserso',fecha:'2023-07-06',importeConcedido:euros},cobros:[{cobroId:'C',beneficiario:'A',ordenante:'imserso',fecha:'2025-12-31',euros,justificante:'J'}]}]}}
const sol={lote:'E38',nacimientoContribuyente:'1980-01-01',exhaustividad:'expediente_comun_completo_todos_pagadores',inversionesViviendaEjercicio:[],hechos:{codigo:'galicia_ayudas_talidomida',ingresoId:'T'}}
function efecto(api,c=censo(),solicitudes=[sol]) {const extra={comunidadAutonoma:'galicia',ingresosIdentificados2025:c,deduccionesTerritoriales2025:{solicitudes}};return api==='canonica'?liquidarIrpfAnual({...casoCanonicoELA(),...extra},{modo:'canonico'}):liquidarIrpfAnualExplicito({...casoEfectivoELA(),...extra})}
function run(api,c=censo(),s=[sol]){return Effect.runSync(efecto(api,c,s))}
function cents(r){return r._tag==='LiquidacionIrpfAnualCalculada'?r.cuotaLiquidaCentimos:Math.round(Number(r.cuotaLiquidaLegal)*100+1e-8)}
describe.each(['canonica','efectiva'])('%s independiente',api=>{
 for(const o of casos) it('Fraction '+o.importe,()=>{
 const c=censo(o.importe),r=run(api,c),sin=run(api,c,[]),t=r.nodosFiscalesB2025.tiposMediosGenerales,a=r.deduccionesTerritoriales2025.aplicaciones[0];
 expect(t).toMatchObject({baseLiquidableGeneral:o.base,cuotaGeneralEstatalArt63_1:o.qe,cuotaGeneralAutonomicaArt74_1:o.qa,estatal:o.te,autonomico:o.ta});
 expect(a).toMatchObject({generado:o.generado,aplicado:o.aplicado,pendiente:o.pendiente});
 expect(cents(r)).toBeCloseTo(o.con,6);expect(cents(sin)).toBeCloseTo(o.sin,6);
 expect(r.libroIngresosIdentificados2025).toEqual(sin.libroIngresosIdentificados2025);
 expect(r.libroIngresosIdentificados2025.ingresos).toHaveLength(1);
 expect(r.deduccionesTerritoriales2025.saldosE38).toEqual([]);
 });
 it.each(['2023-07-06','2024-02-29','2025-01-01'])('resolución %s cobro2025',f=>{const c=censo();c.ayudas[0].resolucion.fecha=f;expect(cents(run(api,c))).toBeCloseTo(casos.find(o=>o.importe==='20000.33').con,6)});
 it('trabajo20000 y ayuda20000.33: base36704.33 y cuota única',()=>{
 const c=censo(),ef=casoEfectivoELA(undefined,undefined,'20000','empleo-laboral');(ef.trabajo.rendimientos[0].cotizaciones).seguridadSocial='1296';const extra={comunidadAutonoma:'galicia',ingresosIdentificados2025:c,deduccionesTerritoriales2025:{solicitudes:[sol]}};
 function calc(s){return Effect.runSync(api==='canonica'?liquidarIrpfAnual({...casoCanonicoELA(),...extra,rendimientos:{trabajo:[{importeIntegroCentimos:2000000}]},deduccionesTerritoriales2025:{solicitudes:s}},{modo:'canonico'}):liquidarIrpfAnualExplicito({...ef,...extra,deduccionesTerritoriales2025:{solicitudes:s}}))}
 const r=calc([sol]),sin=calc([]),o=mixto;
 expect(r.nodosFiscalesB2025.tiposMediosGenerales).toMatchObject({baseLiquidableGeneral:o.base,cuotaGeneralEstatalArt63_1:o.qe,cuotaGeneralAutonomicaArt74_1:o.qa,estatal:o.te,autonomico:o.ta});
 expect(r.deduccionesTerritoriales2025.aplicaciones[0]).toMatchObject({generado:o.generado,aplicado:o.aplicado,pendiente:o.pendiente});expect(cents(r)).toBe(o.con);expect(cents(sin)).toBe(o.sin);expect(r.libroIngresosIdentificados2025).toEqual(sin.libroIngresosIdentificados2025);
 });
 it('precision global6 conserva libro/nodos/importes',()=>{const before=run(api);const old=Decimal.precision;try{Decimal.set({precision:6});const after=run(api);expect(after.libroIngresosIdentificados2025).toEqual(before.libroIngresosIdentificados2025);expect(after.nodosFiscalesB2025).toEqual(before.nodosFiscalesB2025);expect(after.deduccionesTerritoriales2025).toEqual(before.deduccionesTerritoriales2025)}finally{Decimal.set({precision:old})}});
 it.each(['titular','administracion','ordenante','organismo','objeto','previos','fecha','parcial','doble','externo','ejercicio','titularCobro','resolucionCivil','antes','futuro','fracciones'])('rechazo explícito %s',k=>{
 const c=censo(),a=c.ayudas[0];
 if(k==='titular')a.expediente.titular='B';if(k==='administracion')a.administracion='xunta_galicia';if(k==='ordenante')a.cobros[0].ordenante='xunta_galicia';if(k==='organismo')a.resolucion.organismo='Xunta';if(k==='objeto')a.expediente.objeto='otro';if(k==='previos')a.expediente.cobrosPrevios='si';if(k==='fecha')a.cobros[0].fecha='2024-12-31';if(k==='parcial')a.cobros[0].euros='100';if(k==='doble')c.ayudas.push({...a,ayudaId:'OTRO'});if(k==='externo')a.baseLiquidable='123';if(k==='ejercicio')c.ejercicio=2026;if(k==='titularCobro')a.cobros[0].beneficiario='B';if(k==='resolucionCivil')a.resolucion.fecha='2024-02-30';if(k==='antes')a.resolucion.fecha='2023-07-05';if(k==='futuro')a.resolucion.fecha='2026-01-01';if(k==='fracciones')a.cobros[0].euros='20000.'+'1'.repeat(80);
 const r=Effect.runSync(Effect.flip(efecto(api,c)));expect(r.motivo).toMatch(/cerrado|Ingreso|Talidomida|duplicad|Resolución|Cobro|incompleta/i);
 });
 it('E38 referencia cruzada y duplicada rechazan sin falso cero',()=>{for(const s of [[{...sol,hechos:{...sol.hechos,ingresoId:'AJENO'}}],[sol,sol]]){const r=Effect.runSync(Effect.flip(efecto(api,censo(),s)));expect(r.motivo).toMatch(/ajeno|expediente|duplicad/);}});
 it('no publica como contrastada una cadena de incendios ajena a talidomida',()=>{expect(JSON.stringify(run(api))).not.toContain('La cadenaRDL10/2026 y convalidación está contrastada')});
});
it('ambas API mismos libros/nodos/aplicaciones exactos',()=>{const a=run('canonica'),b=run('efectiva');expect(a.libroIngresosIdentificados2025).toEqual(b.libroIngresosIdentificados2025);expect(a.nodosFiscalesB2025).toEqual(b.nodosFiscalesB2025);expect(a.deduccionesTerritoriales2025).toEqual(b.deduccionesTerritoriales2025)});
