import {it,expect,describe} from "vitest"
import {Effect} from "effect"
import {liquidarIrpfAnual,liquidarIrpfAnualExplicito} from "../../lib/dominio/irpf/liquidacion/liquidar-irpf-anual"
import {casoCanonicoELA,casoEfectivoELA} from "../ela-ingreso-2025-fixtures"
import oraculos from './oraculos.json'
function censo(euros='60100.01') {return {ejercicio:2025,contribuyenteId:'A',ambito:'ayudas-publicas-no-transmision',exhaustividad:'completa',ayudas:[{
 ayudaId:'DEP',beneficiario:'A',programa:'galicia-deportistas-resultados-2025',administracion:'sector_publico_autonomico_galicia',
 convocatoria:{referencia:'CONV',emisor:'Xunta',fecha:'2025-01-02'},objeto:'ayuda_dineraria_desarrollo_deportivo',finalidad:'resultados_deportivos',relacionLaboral:'ninguna',contraprestacionServicios:'ninguna',ordenacionPorCuentaPropia:'ninguna',becaEstudios:'no',otrasExenciones:'ninguna',
 reconocimientoGallego:{titular:'A',condicion:'deportista_alto_nivel',referencia:'RECON',emisor:'Secretaría Xeral para o Deporte',fecha:'2025-01-01',vigenteHasta:'2025-12-31'},
 resolucion:{referencia:'RES',organismo:'Xunta',fecha:'2025-03-01',importeConcedido:euros},cobros:[{cobroId:'C1',beneficiario:'A',ordenante:'sector_publico_autonomico_galicia',fecha:'2025-12-31',euros,justificante:'J1'}]
}]}}
const sol={lote:'E38',nacimientoContribuyente:'1980-01-01',exhaustividad:'expediente_comun_completo_todos_pagadores',inversionesViviendaEjercicio:[],hechos:{codigo:'galicia_ayudas_deportistas_alto_nivel',ingresoId:'DEP'}}
function efecto(api,c=censo(),solicitudes=[sol]) {const extra={comunidadAutonoma:'galicia',ingresosIdentificados2025:c,deduccionesTerritoriales2025:{solicitudes}};return api==='canonica'?liquidarIrpfAnual({...casoCanonicoELA(),...extra},{modo:'canonico'}):liquidarIrpfAnualExplicito({...casoEfectivoELA(),...extra})}
function run(api,c=censo(),s=[sol]) {return Effect.runSync(efecto(api,c,s))}
function cents(r){return r._tag==='LiquidacionIrpfAnualCalculada'?r.cuotaLiquidaCentimos:Math.round(Number(r.cuotaLiquidaLegal)*100+1e-8)}
function fraction(s){const [e,f='']=s.split('.');return {n:BigInt(e+f),d:10n**BigInt(f.length)}}
function eq(s,r){const f=fraction(s);expect(f.n*BigInt(r.divisor)).toBe(BigInt(r.numeradorEuros)*f.d)}
describe.each(['canonica','efectiva'])('revisión normativa independiente %s',api=>{
 for(const o of oraculos)it('Fraction propio por resultados sin exención '+o.importe,()=>{
  const c=censo(o.importe),r=run(api,c),sin=run(api,c,[]),t=r.nodosFiscalesB2025.tiposMediosGenerales;
  eq(t.baseLiquidableGeneral,o.base);eq(t.cuotaGeneralEstatalArt63_1,o.qe);eq(t.cuotaGeneralAutonomicaArt74_1,o.qa);
  expect(t.estatal).toBe(o.te);expect(t.autonomico).toBe(o.ta);
  expect(r.deduccionesTerritoriales2025.aplicaciones[0]).toMatchObject({generado:o.generado,aplicado:o.aplicado,pendiente:o.pendiente});
  expect(cents(r)).toBe(o.con);expect(cents(sin)).toBe(o.sin);
  expect(r.libroIngresosIdentificados2025.ingresos).toHaveLength(1);expect(r.libroIngresosIdentificados2025).toEqual(sin.libroIngresosIdentificados2025);expect(t).toEqual(sin.nodosFiscalesB2025.tiposMediosGenerales);
  expect(r.libroIngresosIdentificados2025.ingresos[0].fiscalidadDeportiva.exento).toBe('0');
  expect(r.libroIngresosIdentificados2025.totalIntegradoGeneral).toEqual(o.base);
 });
 for(const k of ['formacion','trabajo','servicios','actividad','beca','exencion','titular','titularCobro','titularRecon','pagador','cobroAnterior','resolucionInvalida','cobroInvalido','futuro','parcial','exceso','cobroDuplicado','justificanteDuplicado','expedienteDuplicado','reconPosterior','reconCaducado','convocatoriaPosterior','baseExterna','clasificacionExterna','sinCobro','cero','negativo'])it('rechazo sin importe sustitutorio '+k,()=>{
 const c=censo(),a=c.ayudas[0],b=a.cobros[0];
 if(k==='formacion')a.finalidad='formacion_tecnificacion';if(k==='trabajo')a.relacionLaboral='existente';if(k==='servicios')a.contraprestacionServicios='existente';if(k==='actividad')a.ordenacionPorCuentaPropia='existente';if(k==='beca')a.becaEstudios='si';if(k==='exencion')a.otrasExenciones='requiere_estudio';if(k==='titular')a.beneficiario='B';if(k==='titularCobro')b.beneficiario='B';if(k==='titularRecon')a.reconocimientoGallego.titular='B';if(k==='pagador')b.ordenante='xunta_galicia';if(k==='cobroAnterior')b.fecha='2025-02-28';if(k==='resolucionInvalida')a.resolucion.fecha='2025-02-29';if(k==='cobroInvalido')b.fecha='2025-11-31';if(k==='futuro')b.fecha='2026-01-01';if(k==='parcial')b.euros='60100';if(k==='exceso')b.euros='60100.02';if(k==='cobroDuplicado')a.cobros.push({...b,justificante:'J2'});if(k==='justificanteDuplicado')a.cobros.push({...b,cobroId:'C2'});if(k==='expedienteDuplicado')c.ayudas.push({...a,ayudaId:'DEP2'});if(k==='reconPosterior')a.reconocimientoGallego.fecha='2025-04-01';if(k==='reconCaducado')a.reconocimientoGallego.vigenteHasta='2025-12-30';if(k==='convocatoriaPosterior')a.convocatoria.fecha='2025-04-01';if(k==='baseExterna')a.baseLiquidable='1';if(k==='clasificacionExterna')a.clasificacionFiscal='ganancia-patrimonial-no-transmision-no-exenta';if(k==='sinCobro')a.cobros=[];if(k==='cero')b.euros=a.resolucion.importeConcedido='0';if(k==='negativo')b.euros=a.resolucion.importeConcedido='-1';
 const r=Effect.runSync(Effect.flip(efecto(api,c)));expect(r._tag).toBe('ResultadoNoSoportado');expect(r.motivo.length).toBeGreaterThan(0);expect(r.cuotaLiquidaCentimos).toBeUndefined();
 });
 it('cobros separados desordenados conservan importe sin doble suma',()=>{const c=censo('10000.03'),a=c.ayudas[0];a.cobros=[{...a.cobros[0],euros:'6000.02'},{...a.cobros[0],cobroId:'C2',justificante:'J2',fecha:'2025-04-01',euros:'4000.01'}];expect(run(api,c).libroIngresosIdentificados2025.totalIntegradoGeneral).toEqual({numeradorEuros:'1000003',divisor:'100'});});
 it('selector ajeno, duplicado y cruce ELA rechazan',()=>{for(const s of [[{...sol,hechos:{...sol.hechos,ingresoId:'AJENO'}}],[sol,sol],[{...sol,hechos:{codigo:'galicia_ayudas_ela_fenotipos',ingresoId:'DEP',diagnostico:{referencia:'D',emisor:'Hospital',fecha:'2025-01-01'}}}]])expect(()=>run(api,censo(),s)).toThrow();});
});
