import {test,expect} from 'vitest';
import {Effect} from 'effect';
import {composeRetencionesR34,verifyRetencionesR34} from '../../../../scripts/procedencia/flujo-retenciones-r34.mjs';
import {executeCausalRetenciones,verifyCausalRetenciones} from '../../../../scripts/procedencia/causal-retenciones-r57.ts';
import {executeFiniteCausal} from '../../../../scripts/procedencia/evidencia-causal-r57.ts';
import {calcularRetencionTrabajoAeat} from '../../../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat';
import type {CasoRetencionTrabajo} from '../../../../lib/dominio/irpf/retenciones/retencion-trabajo-aeat';
const g=composeRetencionesR34();
const ctx={modo:'canonico'} as const;
const base:CasoRetencionTrabajo={anio:2020,retribucionAnualCentimos:4732101,cotizacionesCentimos:32101,situacionFamiliar:'situacion3',situacionLaboral:'activo',contrato:'general',descendientes:[],ascendientes:[],discapacidad:'sin-discapacidad'};
const annual=(sub:CasoRetencionTrabajo|undefined)=>({anio:sub?.anio??2020,retencionTrabajoAeat:sub,pagosACuentaCentimos:12321,retencionesSoportadasCentimos:12321,rendimientos:{trabajo:[{importeIntegroCentimos:99999999}]},familia:{edad:99},cotizacionesSocialesCentimos:7654321});
// Racionales en céntimos: escala sobre 45000 EUR y mínimo indicado; truncado de porcentaje a centésimas y HALF_UP del anual.
const expected=(cuota:bigint, factorNumerator=10n)=>{const tipo=cuota*factorNumerator*1000n/4732101n;const anual=(4732101n*tipo+5000n)/10000n;return ['45000',String(Number(cuota)/100),String(Number(tipo)/100),String(Number(anual)/100),'123.21',String(Number(anual+12321n)/100)];};
const child={edad:4,computoPorEntero:false,discapacidad:'sin-discapacidad',movilidadReducida:false,adopcionOAcogimientoMenosTresAnios:false} as const;
const variants:[string,Partial<CasoRetencionTrabajo>,string[]][]=[
 ['racional',{},expected(1129700n)],
 ['alimentos',{anualidadesAlimentosHijosCentimos:765432},expected(954302n)],
 ['alimentos-no-desdobla',{anualidadesAlimentosHijosCentimos:4500000},expected(1129700n)],
 ['familia-flags',{descendientes:[child,{...child,computoPorEntero:true},{...child,edad:30}],residenciaCeutaMelilla:true,rendimientosCeutaMelilla:true},expected(1055600n,4n)],
 ['un-flag',{residenciaCeutaMelilla:true,rendimientosCeutaMelilla:false},expected(1129700n)],
 ['minimo',{retribucionAnualCentimos:12345,cotizacionesCentimos:0,contrato:'inferior-anio'},['0','0','2','2.47','123.21','125.68']],
 ['minimo-territorial',{retribucionAnualCentimos:12345,cotizacionesCentimos:0,contrato:'inferior-anio',residenciaCeutaMelilla:true,rendimientosCeutaMelilla:true},['0','0','0.8','0.99','123.21','124.2']],
 ['cero',{retribucionAnualCentimos:0,cotizacionesCentimos:0},['0','0','0','0','123.21','123.21']]
];
for(const [name,patch,wanted] of variants) test(name,()=>{
 const sub={...base,...patch},caso=annual(sub),r=executeCausalRetenciones(g,caso,ctx,name),real=Effect.runSync(calcularRetencionTrabajoAeat(sub,ctx));
 expect(r.evidence.outputs.map(o=>o.decimal)).toEqual(wanted);
 expect(r.evidence.outputs.slice(0,4).map(o=>Number(o.decimal))).toEqual([real.baseRetencionCentimos/100,real.cuotaRetencionCentimos/100,Number(real.tipoRetencionPorcentaje),real.importeRetencionAnualCentimos/100]);
 expect(verifyCausalRetenciones(g,r.evidence,caso,ctx,name)).toBe(true);
 expect(r.evidence.outputs.every(o=>r.evidence.events.filter(v=>o.slice.includes(v.id)).every(v=>v.property!=='caso/rendimientos/trabajo/0/importeIntegroCentimos'))).toBe(true);

});
test('ausencia y errores reales',()=>{
 const a=executeCausalRetenciones(g,annual(undefined),ctx,'ausente');expect(a.lines).toHaveLength(2);expect(a.evidence.outputs.map(o=>o.decimal)).toEqual(['123.21','123.21']);expect(a.evidence.events.some(v=>v.operation==='invoke')).toBe(true); // conversiones sí; estimador no
 expect(a.evidence.frames.some(f=>g.globalBindings.some(b=>b.name==='calcularRetencionTrabajoAeatImpl'&&b.node===f.function))).toBe(false);
 for(const patch of [{anio:2018 as const},{procedimiento:'regularizacion' as const},{anio:2026 as const,fechaPago:'2026-01-01'}]) {
 const sub={...base,...patch};expect(()=>executeCausalRetenciones(g,annual(sub),ctx)).toThrow();expect(()=>Effect.runSync(calcularRetencionTrabajoAeat(sub,ctx))).toThrow();
 }
});
test('cotizaciones ausentes',()=>{const sub={...base};delete sub.cotizacionesCentimos;expect(()=>executeCausalRetenciones(g,annual(sub),ctx)).toThrow();expect(()=>Effect.runSync(calcularRetencionTrabajoAeat(sub,ctx))).toThrow();});
test('julio inclusivo y modo/fecha conservados',()=>{
 for(const fechaPago of ['2018-07-04','2018-07-05']) {const sub={...base,anio:2018 as const,fechaPago},r=executeCausalRetenciones(g,annual(sub),ctx,fechaPago);const real=Effect.runSync(calcularRetencionTrabajoAeat(sub,ctx));expect(real.version).toBe(fechaPago==='2018-07-04'?'aeat-2018-01-01':'aeat-2018-07-05');for(const o of r.evidence.outputs.slice(0,4)){const inputs=r.evidence.events.filter(v=>o.slice.includes(v.id)&&v.operation==='input').map(v=>v.property);expect(inputs).toContain('contexto/modo');expect(inputs).toContain('caso/retencionTrabajoAeat/fechaPago');}}
});
test('fronteras públicas: pending representable, orden y campos adicionales',()=>{
 const p=structuredClone(g);p.obligations[0].status='pending';p.obligations[0].reason='revisión';for(const s of p.sites)if(s.siteId!=='anual.pagos.retenciones'){s.valueClosed=false;s.selectionClosed=false;}expect(verifyRetencionesR34(p)).toBe(true);
 const r=executeCausalRetenciones(g,annual(base),ctx,'frontera');for(const api of [()=>executeCausalRetenciones(p,annual(base),ctx),()=>verifyCausalRetenciones(p,r.evidence,annual(base),ctx,'frontera'),()=>executeFiniteCausal(p,annual(base),ctx,'frontera',{kind:'causal-retenciones-r57'})])expect(api).toThrow(/pendientes/);
 const reversed=structuredClone(g);reversed.outputBindings.reverse();expect(verifyRetencionesR34(reversed)).toBe(true);expect(()=>executeFiniteCausal(reversed,annual(base),ctx,'frontera',{kind:'causal-retenciones-r57'})).toThrow(/orden/);
 expect(()=>executeFiniteCausal({...g,functionUnits:[]},annual(base),ctx,'frontera',{kind:'causal-retenciones-r57'})).toThrow();
});
test('adversos de mismo importe: relaciones, software y schema',()=>{
 const caso=annual({...base,retribucionAnualCentimos:0,cotizacionesCentimos:0}),original=executeCausalRetenciones(g,caso,ctx,'mismo').evidence;

 for(const name of ['argumento','binding','transporte','unidad','rama','campo','indice','semilla','captura','orden','frame','ejecucion','software','extra','slice','intercambio-pagos']) {
 const e=structuredClone(original);const get=(operation:string)=>{const v=e.events.find(v=>v.operation===operation);if(v===undefined)throw Error('Falta objetivo '+operation);return v;};
 switch(name){case 'argumento': get('invoke').edges=[];break;case 'binding':e.annualBindings[1].producer=e.annualBindings[2].producer;break;case 'transporte':e.events.find(v=>v.id===e.outputs[0].root)!.edges=[];break;case 'unidad':get('transport').unit='ratio';break;case 'rama':get('branch').value=2;break;case 'campo':get('property').property='inventado';break;case 'indice':get('index').value=999;break;case 'semilla':get('array-selection').edges=get('array-selection').edges.filter(x=>x.role!=='argument:0');break;case 'captura':get('capture').edges=[];break;case 'orden':e.outputs.reverse();break;case 'frame':e.frames[1].parent=null;break;case 'ejecucion':e.execution='otra';break;case 'software':e.software[2].sha256='0'.repeat(64);break;case 'extra':Object.assign(e.events[0],{extra:undefined});break;case 'slice':e.outputs[0].slice=[];break;case 'intercambio-pagos':e.events.find(v=>v.id===e.outputs[4].root)!.edges=structuredClone(e.events.find(v=>v.id===e.outputs[5].root)!.edges);break;}
 expect(()=>verifyCausalRetenciones(g,e,caso,ctx,'mismo'),name).toThrow();
 }
},30000);
