import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('/home/elies/Repos/IRoboPF/package.json');
const ts=require('typescript');
const {Effect}=require('effect');
const Decimal=require('decimal.js').Decimal;
const out='docs/procedencia/editorial/flujo-retenciones-ss-r23-sol/';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const sources=[],results=[];
function loader(mutationFile='',from='',to=''){
 const cache=new Map();
 function load(file){
  file=path.resolve(file);if(cache.has(file))return cache.get(file);
  const bytes=fs.readFileSync(file),original=bytes.toString();let text=original;
  if(file===path.resolve(mutationFile)){assert.equal(original.split(from).length,2);text=text.replace(from,to);}
  sources.push({file:path.relative(process.cwd(),file),sha256:hash(bytes),executedSha256:hash(text),mutation:text===original?null:{from,to}});
  const exports={};cache.set(file,exports);
  const js=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText;
  const localRequire=id=>{if(!id.startsWith('.'))return require(id);const p=path.resolve(path.dirname(file),id);if(p.endsWith('.json'))return JSON.parse(fs.readFileSync(p,'utf8'));return load(p.endsWith('.ts')?p:p+'.ts');};
  new Function('require','exports',js)(localRequire,exports);return exports;
 }
 return load;
}
const file='lib/dominio/irpf/retenciones/retencion-trabajo-aeat.ts';
const load=loader(),ret=load(file),leg=load('lib/dominio/laboral/cotizaciones-sociales.ts'),uni=load('lib/dominio/laboral/cotizaciones-perfil-uniforme.ts');
const base={anio:2025,fechaPago:'2025-01-02',edad:40,retribucionAnualCentimos:4000000,cotizacionesCentimos:250000,situacionFamiliar:'situacion3',situacionLaboral:'activo',contrato:'general',descendientes:[],ascendientes:[],discapacidad:'sin-discapacidad'};
const calc=(c,modo='canonico',engine=ret)=>Effect.runPromise(engine.calcularRetencionTrabajoAeat(c,{modo}));
const record=(id,before,after,conclusion)=>results.push({id,before,after,conclusion});
const first=await calc(base);
const child={edad:2,computoPorEntero:true,discapacidad:'sin-discapacidad',movilidadReducida:false,adopcionOAcogimientoMenosTresAnios:false};
const family=await calc({...base,descendientes:[child]});
assert.equal(first.baseRetencionCentimos,family.baseRetencionCentimos);assert.equal(family.minimoPersonalFamiliarCentimos-first.minimoPersonalFamiliarCentimos,520000);assert.notEqual(first.cuotaRetencionCentimos,family.cuotaRetencionCentimos);record('familia-no-base',first,family,'Hijo altera mínimo/cuota/tipo/importe; no la base con un hijo, sin cambio de reducción hijos>2.');
const old=await calc({...base,edad:75});assert.equal(old.baseRetencionCentimos,first.baseRetencionCentimos);assert.equal(old.minimoPersonalFamiliarCentimos-first.minimoPersonalFamiliarCentimos,255000);record('edad75',first,old,'Edad del perceptor solo mínimo; no gasto ni base.');
const noOrdinary=await calc({...base,descendientes:[{...child,edad:25}]});assert.equal(noOrdinary.minimoPersonalFamiliarCentimos,first.minimoPersonalFamiliarCentimos);record('hijo25-canonico',first,noOrdinary,'Canónico filtra hijo25 sin discapacidad antes de length/orden.');
const legacyCase={...base};delete legacyCase.fechaPago;
const legacyFamily=await calc({...legacyCase,descendientes:[{...child,edad:25}]},'compatible-legacy');assert.equal(legacyFamily.minimoPersonalFamiliarCentimos-first.minimoPersonalFamiliarCentimos,240000);record('hijo25-legacy',noOrdinary,legacyFamily,'Legacy no filtra hijo25. Comparación de modo; no aceptación de elegibilidad.');
const territory=await calc({...base,residenciaCeutaMelilla:true,rendimientosCeutaMelilla:true});assert.equal(first.cuotaRetencionCentimos,territory.cuotaRetencionCentimos);assert.notEqual(first.tipoRetencionPorcentaje,territory.tipoRetencionPorcentaje);record('territorio-tipo',first,territory,'Ceuta afecta diferencia/tipo/importe, no cuota o base.');
const territoryOnly=await calc({...base,residenciaCeutaMelilla:true});assert.equal(territoryOnly.tipoRetencionPorcentaje,first.tipoRetencionPorcentaje);record('dos-flags-ceuta',first,territoryOnly,'Un solo flag no activa factor territorial.');
const housing=await calc({...base,retribucionAnualCentimos:3000000,pagosViviendaHabitual:true});const housingOff=await calc({...base,retribucionAnualCentimos:3000000});assert.equal(housing.cuotaRetencionCentimos,housingOff.cuotaRetencionCentimos);assert.notEqual(housing.tipoRetencionPorcentaje,housingOff.tipoRetencionPorcentaje);record('vivienda-solo-tipo',housingOff,housing,'Vivienda minoración posterior a cuota, antes de cociente.');
const rent2018={...base,anio:2018,retribucionAnualCentimos:1600000,cotizacionesCentimos:100000,fechaPago:'2018-07-04'};const july4=await calc(rent2018),july5=await calc({...rent2018,fechaPago:'2018-07-05'});assert.notEqual(july4.version,july5.version);assert.notEqual(july4.baseRetencionCentimos,july5.baseRetencionCentimos);record('fecha-pago2018',july4,july5,'Fecha de pago selecciona reducción antigua/media2018; no fallecimiento anual.');
for(const c of [{...base,procedimiento:'regularizacion'},...[2012,2013,2014,2015,2016].map(anio=>({...base,anio,fechaPago:`${anio}-01-02`})),{...base,anio:2026,fechaPago:'2026-09-09'},{...base,anio:2026,fechaPago:'2026-10-30'}]){
 await assert.rejects(()=>calc(c));record('rechazo-'+('procedimiento' in c?c.procedimiento:c.fechaPago),c,'rechazado','No habilita algoritmos históricos, regularización o fechas fuera de ventana.');
}
// Mutación del campo resto: se preserva la regla matemática de selección por desde/cuota/tipo.
const mutant=loader(file,'resto: 12_450','resto: 1')(file);const unused=await calc(base,'canonico',mutant);assert.deepEqual(unused,first);record('resto-no-consumido',first,unused,'Mutar ancho de primer tramo no cambia resultado; no se usa para seleccionar ni calcular cuota.');
const minimumMutant=loader(file,'new Decimal(5550)','new Decimal(6550)')(file);const minimumChanged=await calc(base,'canonico',minimumMutant);assert.equal(minimumChanged.baseRetencionCentimos,first.baseRetencionCentimos);assert.notEqual(minimumChanged.cuotaRetencionCentimos,first.cuotaRetencionCentimos);record('mutacion-minimo',first,minimumChanged,'5550→6550 en memoria afecta cuota, no base.');
const meiMutant=loader('lib/dominio/laboral/cotizaciones-sociales.ts','empresarial: crearImporteMonetario("0.0067")','empresarial: crearImporteMonetario("0.0167")')('lib/dominio/laboral/cotizaciones-sociales.ts');
const entry={anio:2025,salarioBrutoAnual:new Decimal(60000)};const orig=leg.calcularDesgloseCotizacionesSocialesLegacy(entry),changed=meiMutant.calcularDesgloseCotizacionesSocialesLegacy(entry);assert.equal(orig.cotizacionTrabajador.toString(),changed.cotizacionTrabajador.toString());assert.notEqual(orig.cotizacionEmpresarial.toString(),changed.cotizacionEmpresarial.toString());record('mei-lado-legacy',orig,changed,'Mutación empresarial no transita al trabajador; base y ordinarias invariantes.');
for(const anio of [2018,2025,2026]){
 const e={anio,salarioBrutoAnual:new Decimal(100000)},l=leg.calcularDesgloseCotizacionesSocialesLegacy(e),u=uni.calcularDesgloseCotizacionesPerfilUniforme(e);
 assert.equal(u.redondeoTgss,'pendiente');if(anio===2018){assert.equal(l.baseOrdinaria.toString(),'45014.4');assert.equal(u.baseOrdinaria.toString(),'45276.9');assert.equal(u.solidaridadEmpresarial.toString(),'0');}else assert.notEqual(l.solidaridadEmpresarial.toString(),u.solidaridadEmpresarial.toString());
 record('ss-modo-'+anio,l,u,'2018 base7/5;2025/26 reparto independiente por lado, sin TGSS mensual cerrado.');
}
const children=[{...child,edad:10},{...child,edad:5,computoPorEntero:false}];
const ordered=await calc({...base,descendientes:children});
const reordered=await calc({...base,descendientes:[{...children[0],edad:5},{...children[1],edad:10}]});
assert.equal(reordered.minimoPersonalFamiliarCentimos-ordered.minimoPersonalFamiliarCentimos,15000);assert.equal(ordered.baseRetencionCentimos,reordered.baseRetencionCentimos);record('orden-y-reparto-hijos',ordered,reordered,'Edad cambia orden y cuantía asignada a cada reparto; no es mera validación de dominio.');
const asc={edad:75,convivencia:1,discapacidad:'sin-discapacidad',movilidadReducida:false};
const asc1=await calc({...base,ascendientes:[asc]}),asc2=await calc({...base,ascendientes:[{...asc,convivencia:2}]});
assert.equal(asc1.minimoPersonalFamiliarCentimos-asc2.minimoPersonalFamiliarCentimos,127500);record('convivencia-ascendiente',asc1,asc2,'Convivencia divide1150+1400; no se impone el reparto de descendientes.');
const low={...base,retribucionAnualCentimos:1000000,cotizacionesCentimos:65000};
const general=await calc(low),short=await calc({...low,contrato:'inferior-anio'});
assert.equal(short.cuotaRetencionCentimos,general.cuotaRetencionCentimos);assert.equal(general.tipoRetencionPorcentaje,'0.00');assert.equal(short.tipoRetencionPorcentaje,'2.00');record('contrato-tras-exencion',general,short,'El mínimo contractual puede producir importe aunque cuota inicial sea0 por exención.');
const table=load('lib/dominio/normativa/datos/irpf-retenciones-trabajo-2012-2026.ts');
const pensionArgs={anio:2018,fecha:'2018-07-05',situacionLaboral:'pensionista',situacionFamiliar:'situacion3',numeroDescendientes:0};
assert.equal(table.umbralRetencionTrabajoRequeridoEuros(pensionArgs),13000);
assert.equal(table.umbralRetencionTrabajoRequeridoEuros({...pensionArgs,fecha:undefined}),12643);
record('tabla-pension2018',13000,12643,'Fecha definida activa tabla pensiones; undefined usa cierre sin pasar situación laboral al selector.');
const pension=await calc({...base,pensionCompensatoriaConyugeCentimos:100000});
const annuity=await calc({...base,anualidadesAlimentosHijosCentimos:600000});
assert.equal(pension.rendimientoNetoTrabajoCentimos,first.rendimientoNetoTrabajoCentimos);assert.equal(pension.baseRetencionCentimos,first.baseRetencionCentimos-100000);
assert.equal(annuity.baseRetencionCentimos,first.baseRetencionCentimos);assert.notEqual(annuity.cuotaRetencionCentimos,first.cuotaRetencionCentimos);record('opcionales-por-propiedad',pension,annuity,'Pensión entra en base; anualidades en cuota. Compartir conversión opcional no mezcla argumentos.');
const familyLow={...base,retribucionAnualCentimos:2000000,cotizacionesCentimos:130000,descendientes:[{...child,edad:10},{...child,edad:8}]};
const twoChildren=await calc(familyLow),threeChildren=await calc({...familyLow,descendientes:[...familyLow.descendientes,{...child,edad:5}]});
assert.equal(threeChildren.baseRetencionCentimos,twoChildren.baseRetencionCentimos-60000);assert.equal(threeChildren.limite43Centimos,twoChildren.limite43Centimos);record('hijos600-no-umbral',twoChildren,threeChildren,'Cruce2/3 resta600 en base, pero columna dosOMas y límite43 se conservan; no entra hijos600 en umbral.');
fs.writeFileSync(out+'casos-resultados.json',JSON.stringify({sources,results,review:'pendiente; discriminantes técnicos, no prueba jurídica'},null,2));console.log({cases:results.length,status:'passed'});
