import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {proyectarRioja,validarCensoRioja,cargarRioja,vincularRiojaProyeccion,excluirSieteViasRioja,replayRioja} from '../tools/procedencia/simuladores/rioja-proyeccion.mjs';
import {inflateSync,deflateSync} from 'node:zlib';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const base=resolve(import.meta.dirname,'../docs/procedencia/simuladores/medicion-2025');
const c=JSON.parse(readFileSync(resolve(base,'rioja-proyeccion/contrato.json')));
const H=JSON.parse(readFileSync(resolve(base,'rioja-proyeccion/H.json')));
const objetivo=JSON.parse(readFileSync(resolve(base,'observaciones.json'))).casos.find(x=>x.id==='open2025-la-rioja-01');
test('medidor: vínculo válido más cálculo real cuentan un único caso',()=>{
 const r=medirCasos({N:1,casos:[structuredClone(objetivo)]},{base});
 assert.equal(r.medicion.iguales,1);assert.equal(r.medicion.N,1);
 assert.equal(r.resultados[0].coincidenciaVerificada,true);
 assert.equal(r.resultados[0].vinculacion.countedAsMatch,false);
});
for(const [nombre,mutar] of [
 ['importe no oficial',x=>x.resultadoOpenEUR='-691.09'],
 ['hechos laborales cambiados',x=>x.entradaAPI.retenciones[0].importe='14000.01'],
 ['identidad alterada',x=>x.id='open2025-rioja-sintetico-otro'],
 ['peso alterado',x=>x.pesoExterno='1.00'],
])test('medidor no suma por banderas copiadas: '+nombre,()=>{
 const x=structuredClone(objetivo);mutar(x);x.proyeccionFiscalVerificada=true;x.coincidenciaVerificada=true;
 const r=medirCasos({N:1,casos:[x]},{base});assert.equal(r.medicion.iguales,0);assert.equal(r.medicion.N,1);
 assert.notEqual(r.resultados[0].coincidenciaVerificada,true);
});
test('H íntegro conserva vivienda y salario efectivo',()=>{const P=proyectarRioja(H,c);assert.deepEqual(P.trabajo,H.trabajo);assert.deepEqual(P.retenciones,H.retenciones);assert.equal(P.vivienda.pagos,'6000.00');assert.equal(P.vivienda.dias,365)});
for(const [name,change] of [
 ['edad35',h=>h.edad=35],['edad36',h=>h.edad=36],
 ['SS distinta',h=>h.trabajo.rendimientos[0].cotizaciones.seguridadSocial='3900.01'],
 ['retención distinta',h=>h.retenciones[0].importe='14000.01'],
 ['historia incompleta',h=>h.deduccionesTerritoriales2025.viviendaDT182025.historia.derechos=[]],
 ['adquisición2013',h=>h.deduccionesTerritoriales2025.viviendaDT182025.adquisicion.fecha='2013-01-01'],
 ['adquisición2017',h=>h.deduccionesTerritoriales2025.viviendaDT182025.adquisicion.fecha='2017-01-01'],
 ['discapacidad desconocida',h=>h.discapacidad=null]])test(name+' no hereda admisión',()=>{const h=structuredClone(H);change(h);assert.throws(()=>proyectarRioja(h,c),/rioja-H-distinto/)});
test('decisión revisada y replay acreditan proyección, no aceptación regional ni match',()=>{const loaded=cargarRioja(base);assert.equal(loaded.art.recibo.state,'discovery-needed');const v=vincularRiojaProyeccion({id:c.id,territorio:'la-rioja',pesoExterno:'193406.000000000000',entradaAPI:H,resultadoOpenEUR:'-691.10'},base);assert.equal(v.countedAsMatch,false);assert.equal(v.transportComplete,false);assert.equal(v.regionalAmountOpen,null);assert.equal(v.regionalControlsAccepted,false);assert.equal(v.proyeccionFiscalVerificada,true);assert.equal(v.estado,'proyeccion-rioja-ses-pdf-vinculada');assert.equal(v.diagnosticoAPIs.totalComparable,false);assert.equal(v.cuotaDiferencialPresentada,'-691.10');assert.equal(v.casillas['0548'],'450.00')});
test('relaciones del censo exigen antes y después correctos',()=>{const {art}=cargarRioja(base);validarCensoRioja(art);const a=structuredClone(art);[a.censoAntes,a.censoDespues]=[a.censoDespues,a.censoAntes];assert.throws(()=>validarCensoRioja(a));});
test('dirección incoherente no queda acreditada por un hash',()=>{const {art}=cargarRioja(base);art.expediente.address.candidate='OTRA DIRECCION SINTETICA';assert.throws(()=>validarCensoRioja(art));});

test('frontera 35/36 excluye juventud sin usar hash ni cambiar otras vías',()=>{
 for(const edad of [35,36,40]){const x=structuredClone(H);x.edad=edad;const e=excluirSieteViasRioja(x);assert.equal(e['DT1.b'],edad>=36);assert.equal(e['art32.11'],edad>=36);assert.equal(e['DT1.a'],true);}
});
for(const operacion of ['rehabilitacion','adecuacion'])test(operacion+' no hereda exclusión a edad40',()=>{const x=structuredClone(H);x.deduccionesTerritoriales2025.viviendaDT182025.proyectos[0].operacion=operacion;const e=excluirSieteViasRioja(x);for(const k of ['DT1.a','DT1.d','art32.2','DA2'])assert.equal(e[k],false)});
for(const year of ['2013','2017'])test('operación nueva '+year+' se distingue sin hash',()=>{const x=structuredClone(H),v=x.deduccionesTerritoriales2025.viviendaDT182025,d=year+'-01-01';v.adquisicion.fecha=d;v.historia.derechos[0].adquisicion=d;v.proyectos[0].fechaInicio=d;v.proyectos[0].terminacion=d;const e=excluirSieteViasRioja(x);assert.equal(e.DA2,false);assert.equal(e['art32.2'],year==='2013')});
for(const mutate of [v=>v.historia.ejercicios.pop(),v=>v.historia.derechos.push({...v.historia.derechos[0],inmueble:'segunda'}),v=>v.exhaustividad='desconocida'])test('historia no exhaustiva no hereda proyección',()=>{const x=structuredClone(H);mutate(x.deduccionesTerritoriales2025.viviendaDT182025);assert.throws(()=>excluirSieteViasRioja(x),/rioja-exclusiones-historia/)});

const alterarSES=fn=>{const loaded=cargarRioja(base);loaded.art.ses=deflateSync(Buffer.from(fn(inflateSync(loaded.art.ses).toString('latin1')),'latin1'));return loaded;};
for(const key of ['IDII','GSS','IDRE','DED1E','DED1A','RESULTADO','MPER','MPERAU','MPERFA','MPERFAAU']) {
 test(key+' duplicado no acredita ámbito',()=>{const re=new RegExp('^([ \\t]*'+key+'~1~[^\\r\\n]+)$','m');const x=alterarSES(s=>{assert(re.test(s));return s.replace(re,m=>m+'\n'+m)});assert.throws(()=>replayRioja(x),/^Error: dt18-ses-invalido$/)});
 test(key+' alterado no coincide con readback o PDF',()=>{const re=new RegExp('^([ \\t]*'+key+'~1~)[^\\r\\n]+$','m');const x=alterarSES(s=>{assert(re.test(s));return s.replace(re,(_,p)=>p+'999999.99')});assert.throws(()=>replayRioja(x),/rioja-(salario-readback|ses-pdf)/)});
}

// Copias adversas en memoria: sólo los streams leídos; nunca originales exportados.
const alterarPDF=(bytes,fn)=>Buffer.from(bytes.toString('latin1').replace(/(?:^|\n)(\d+) 0 obj\n([\s\S]*?)\nendobj/g,(all,id,obj)=>{
 const st=/stream\r?\n/.exec(obj),len=/\/Length (\d+)\b/.exec(obj);
 if(!st||!len||!obj.includes('/FlateDecode'))return all;
 const start=st.index+st[0].length,old=Number(len[1]);
 const decoded=inflateSync(Buffer.from(obj.slice(start),'latin1').subarray(0,old)).toString('latin1');
 const changed=fn(decoded);if(changed===decoded)return all;
 const compressed=deflateSync(Buffer.from(changed,'latin1'));
 const head=obj.slice(0,start).replace(/\/Length \d+\b/,'/Length '+compressed.length);
 return '\n'+id+' 0 obj\n'+head+compressed.toString('latin1')+obj.slice(start+old)+'\nendobj';
}),'latin1');
for(const box of ['0547','0548','0670','0511','0512','0519','0520'])test('PDF casilla '+box+' ausente rechazada',()=>{const x=cargarRioja(base);x.art.pdf=alterarPDF(x.art.pdf,s=>s.replace('('+box+') Tj','(9999) Tj'));assert.throws(()=>replayRioja(x),/rioja-pdf-casilla/)});
test('PDF identidad no se acredita por subcadena incidental',()=>{const x=cargarRioja(base);x.art.pdf=alterarPDF(x.art.pdf,s=>s.replace('(90000000B) Tj','(X90000000BX) Tj'));assert.throws(()=>replayRioja(x),/rioja-pdf-identidad/)});
