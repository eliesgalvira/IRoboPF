import { Effect, Option } from 'effect';
import Decimal from 'decimal.js';
import { unzipSync, strFromU8 } from 'fflate';
const load = p => import(`${process.cwd()}/${p}`);
const {calcularRetencionTrabajoAeat:ret}=await load('lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts');
const {calcularSalarioLegacy:sal}=await load('lib/dominio/compatibilidad-legacy/calculo-salario-legacy.ts');
const {liquidarIrpfAnual:liq}=await load('lib/dominio/irpf/liquidacion/liquidar-irpf-anual.ts');
const {auditarProgresividadFrio:aud,construirPuntosAuditoriaAnioAjustado:serie}=await load('lib/dominio/auditoria/auditoria-progresividad-frio.ts');
const {calcularFactorIpcDiciembre:ipc,factorIpcPerfilLegacy:factor}=await load('lib/dominio/inflacion/factor-ipc.ts');
const {calcularDeduccionesConsignadas:cons}=await load('lib/dominio/irpf/deducciones-autonomicas-aplicadas.ts');
const {evaluarCeliaquiaRioja:rioja}=await load('lib/dominio/irpf/deducciones/contratos-2025.ts');
const {calcularConciliacionSimuladorLegacy:conc}=await load('lib/dominio/irpf/liquidacion/conciliacion-simulador-legacy.ts');
const rows=[];
const check=(id,ok,actual)=>{rows.push({id,ok,actual});};
const exit=(id,fx,expected)=>{const x=Effect.runSyncExit(fx); const state=x._tag==='Success'?'Success':x.cause.reasons.map(r=>r._tag).join(','); check(id,state===expected,x._tag==='Success'?{state,value:x.value}:{state,cause:x.cause}); return x._tag==='Success'?x.value:undefined;};
const base={anio:2020,edad:40,retribucionAnualCentimos:1800000,cotizacionesCentimos:114300,situacionFamiliar:'situacion3',situacionLaboral:'activo',contrato:'general',descendientes:[],ascendientes:[],discapacidad:'sin-discapacidad'};
const anual={anio:2025,comunidadAutonoma:'simulada-estatal',situacionFamiliar:{tipo:'individual',edad:40,descendientes:[],ascendientes:[],discapacidad:{_tag:'SinDiscapacidad'}},rendimientos:{trabajo:[{importeIntegroCentimos:1800000}]},reducciones:[],deducciones:[],retencionesSoportadasCentimos:0,pagosACuentaCentimos:0};
const rango={salarioBrutoAnualMinimoCentimos:6000000,salarioBrutoAnualMaximoCentimos:6000000,pasoCentimos:100};
for(const modo of ['canonico','compatible-legacy']){
 exit(`RTI01-${modo}`,liq({...anual,retencionTrabajoAeat:base},{modo}),'Fail');
 for(const edad of [-1,0.5,NaN,Infinity,-Infinity,'40',0,65,75])for(const quien of ['perceptor','descendiente','ascendiente']){
  const c={...base};
  if(quien==='perceptor')c.edad=edad;
  if(quien==='descendiente')c.descendientes=[{edad,computoPorEntero:true,discapacidad:'sin-discapacidad',movilidadReducida:false,adopcionOAcogimientoMenosTresAnios:false}];
  if(quien==='ascendiente')c.ascendientes=[{edad,convivencia:1,discapacidad:'sin-discapacidad',movilidadReducida:false}];
  exit(`edad-${modo}-${quien}-${edad}`,ret(c,{modo}),Number.isSafeInteger(edad)&&edad>=0?'Success':'Fail');
 }
 for(const seleccion of [{fechaPago:'2025-02-30'},{fechaPago:'2024-12-31'},{fechaPago:'2025-01-01',perfilTemporal:'cierre'}])exit(`selector-invalido-${modo}-${JSON.stringify(seleccion)}`,sal({anio:2025,salarioBrutoAnualCentimos:1800000,modo,seleccionRetencion:seleccion}),'Fail');
 exit(`regularizacion-${modo}`,ret({...base,procedimiento:'regularizacion'},{modo}),'Fail');
 const r=exit(`aud-identidad-${modo}`,aud({...rango,perfil:'legacy-progresividad-frio',anioComparado:2018,anioReferencia:2018},{modo}),'Success');
 const s=exit(`serie-identidad-${modo}`,serie({...rango,anio:2018,anioReferencia:2018,modo}),'Success');
 const ss=modo==='canonico'?287508:285841;
 check(`aud-ss-dos-ramas-${modo}`,r?.auditoria.puntos[0].comparacion.referencia.cotizacionTrabajadorCentimos===ss&&r?.auditoria.puntos[0].comparacion.comparado.ajustado.cotizacionTrabajadorCentimos===ss,ss);
 check(`serie-ss-${modo}`,s?.[0].comparacion.referencia.cotizacionTrabajadorCentimos===ss,ss);
 for(const perfil of ['soltero_sin_hijos','pareja_con_hijos']){
  exit(`perfil-${modo}-${perfil}`,sal({anio:2025,salarioBrutoAnualCentimos:1800000,modo,perfilAuditoria:perfil,seleccionRetencion:modo==='canonico'?{perfilTemporal:'cierre'}:undefined}),'Success');
 }
}
for(const [anio,seleccion,expected] of [[2025,undefined,'Fail'],[2025,{perfilTemporal:'cierre'},'Success'],[2026,{perfilTemporal:'cierre'},'Fail'],[2026,{fechaPago:'2026-09-10'},'Success'],[2026,{fechaPago:'2026-10-30'},'Fail'],[2016,{perfilTemporal:'cierre'},'Fail']])exit(`temporal-${anio}-${JSON.stringify(seleccion)}`,sal({anio,salarioBrutoAnualCentimos:1800000,modo:'canonico',perfilAuditoria:'soltero_sin_hijos',seleccionRetencion:seleccion}),expected);
for(const selecciones of [{2024:{fechaPago:'2024-02-08'},2025:{perfilTemporal:'cierre'}},{2024:{fechaPago:'2025-02-08'},2025:{perfilTemporal:'cierre'}},{2025:{perfilTemporal:'cierre'}}])exit(`aud-fechas-${JSON.stringify(selecciones)}`,aud({...rango,perfil:'soltero_sin_hijos',anioComparado:2024,anioReferencia:2025,seleccionRetencionPorAnio:selecciones},{modo:'canonico'}),selecciones[2024]?.fechaPago==='2024-02-08'?'Success':'Fail');
const codigo='andalucia_nacimiento_adopcion_acogimiento_menores';
for(const sufijo of [':extra:importe',':importe:extra',':importe\n',':IMPORTe',':importe ']){
 let rechazado=false;try{cons({[codigo+sufijo]:100,[codigo+':cumple']:true},{ejercicio:2025,territorio:'andalucia'});}catch(e){rechazado=e instanceof RangeError;}check(`clave-${JSON.stringify(sufijo)}`,rechazado,rechazado);
}
check('consignacion-canonica',cons({[codigo+':importe']:100,[codigo+':cumple']:true},{ejercicio:2025,territorio:'andalucia'})===100,100);
const persona={id:'H1',relacion:'descendiente',titularesDelMinimo:['A','B'],titularesDeduccion:['A','B'],certificado:{referencia:'cert',medico:'M',colegiado:'C',especialidad:'E',fechaEmision:'2026-01-03',fechaDiagnostico:'2025-12-01',diagnostico:'definitivo',ejercicioMedico:'activo'}};
for(const campo of ['fechaEmision','fechaDiagnostico'])for(const fecha of ['2025-02-29','2025-02-30','2025-04-31','2025-13-01','2025-00-01','2025-01-00','2025-01-01T00:00:00Z','2024-02-29']){const r=rioja({territorio:'la-rioja',ejercicio:2025,contribuyente:'A',modalidad:'individual'},[{...persona,certificado:{...persona.certificado,[campo]:fecha}}]);check(`fecha-${campo}-${fecha}`,fecha==='2024-02-29'?r.estado==='calculo_parcial':r.estado==='no_soportado',r);}
for(let a=2012;a<=2026;a++)for(let b=2012;b<=2026;b++){const x=factor(a,b),y=factor(b,a);check(`ipc-${a}-${b}`,x.factor.mul(y.factor).minus(1).abs().lt('1e-18')&&x.procedencia.estado===(a===b?'identidad':Math.max(a,b)===2026?'incluye-escenario':'observado'),{factor:x.factor.toString(),procedencia:x.procedencia});}
for(const [a,b] of [[2025,2026],[2026,2025],[2011,2025],[2025,2027],[NaN,2025]]){let rechazado=false;try{ipc({anioBase:a,anioReferencia:b});}catch(e){rechazado=e instanceof RangeError;}check(`ausencia-${a}-${b}`,rechazado,rechazado);}
const f=ipc({anioBase:2012,anioReferencia:2025}).factor;check('producto-no-cociente',f.toFixed(18)==='1.270974585050486217'&&!f.eq(new Decimal('119.942').div('94.394')),f.toString());
for(const anio of [2012,2014,2015,2018])for(const cuota of [1000,2000]){const c=Option.getOrThrow(conc({anio,modoCuotaOrigen:'canonico',rendimientoIntegroTrabajoCentimos:6000000,cuotaLiquida:new Decimal(cuota),cuotaLiquidaCentimos:cuota*100,cuotaDiferencialCentimos:cuota*100}));check(`conciliacion-${anio}-${cuota}`,c.naturaleza===(anio<=2014?'reconstruccion-legacy-hasta-2014':'ajuste-salarial-de-cuota-suministrada'),{naturaleza:c.naturaleza,final:c.irpfFinalSimulador.toString()});}
const exp=await load('lib/export/auditoria-excel.ts');
const libro=exp.construirLibroAuditoriaCompatible(undefined,{detalle:{salarioMaximoEuros:2}});
check('excel-libro-descripcion',libro.description?.includes('no una observación INE')&&libro.description?.includes('producto de tasas'),libro.description);
const blob=await Effect.runPromise(exp.construirBlobXlsxCompatibleConProgreso({detalle:{salarioMaximoEuros:2}},performance.now()));
const zip=unzipSync(new Uint8Array(await blob.arrayBuffer()));const xml=strFromU8(zip['docProps/core.xml']);check('excel-stream-descripcion',xml.includes('no una observación INE')&&xml.includes('producto de tasas'),xml);
console.log(JSON.stringify(rows,(_,v)=>(Number.isNaN(v)||v===Infinity||v===-Infinity)?String(v):v,2));
console.error(JSON.stringify({total:rows.length,fallos:rows.filter(r=>!r.ok).map(r=>r.id)}));
