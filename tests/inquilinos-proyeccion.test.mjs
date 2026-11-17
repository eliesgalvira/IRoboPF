import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {referenciaProyeccion,proyectarInquilino,vincularProyeccion,reconstruirProyeccion,admitirProyeccionMedida,centimosProyeccion} from '../tools/procedencia/simuladores/inquilinos-proyeccion.mjs';
const ref=referenciaProyeccion();
const base=new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url).pathname;
const bytes=readFileSync(new URL('../'+ref.package.file,import.meta.url));
const fixture=ref.casos.map(c=>c.fixture);
for(const p of ref.casos){
 test(`${p.id}: P preserva autoridad inmutable y pagos`,()=>{
  const H=structuredClone(p.casePre),before=structuredClone(H),P=proyectarInquilino(H,fixture);
  assert.deepEqual(H,before);assert.deepEqual(P.H,H);assert.deepEqual(P.entradaAPI,H.entradaAPI);
  assert.equal(Object.isFrozen(P.H.preparacionVivienda.hechosHabitacion.pagos[0]),true);
  assert.equal(P.H.preparacionVivienda.hechosHabitacion.pagos.length,12);
  assert.equal(P.viviendaTransportada,false);assert.equal(P.transportComplete,false);
  assert.deepEqual(P.omitidos,Object.keys(H.preparacionVivienda.hechosHabitacion).sort());
 });
 test(`${p.id}: variantes simultáneas en slot y fixture no autorizan P`,()=>{
  const mutators=[];
  for(const age of [35,36,64,65])mutators.push(h=>{h.entradaAPI.edad=age;});
  for(const [key,values]of Object.entries({familiaNumerosa:[true,null,'',undefined],monoparental:[true,null],discapacidadPorcentaje:[64,65],desempleoDias2025:[182,183],viudedad:[true],violenciaGenero:[true],dacionEnPago:[true],derechoInversionVivienda:[true],trasladoPorTrabajo:[true]}))
   for(const v of values)mutators.push(h=>{h.preparacionVivienda.hechosHabitacion[key]=v;});
  for(const renta of ['12500.00','12500.01','29999.99','30000.01','45000.00','45000.01'])mutators.push(h=>{h.entradaAPI.trabajo.rendimientos[0].integro=renta;});
  mutators.push(h=>{h.preparacionVivienda.hechosHabitacion.desde='2014-12-01';},h=>{h.preparacionVivienda.hechosHabitacion.derechosOtrasViviendas=[{id:'otra-sintetica'}];},h=>{delete h.preparacionVivienda;},h=>{h.entradaAPI.modalidad='conjunta';},h=>{h.entradaAPI.ejercicio=2024;},h=>{h.pesoExterno='1';});
  for(const mutate of mutators){const H=structuredClone(p.casePre),fs=structuredClone(fixture);mutate(H);fs.find(f=>f.id===p.id).entrada=structuredClone(H.entradaAPI);assert.throws(()=>proyectarInquilino(H,fs));}
  assert.throws(()=>proyectarInquilino(p.casePre,[]));assert.throws(()=>proyectarInquilino(p.casePre,[p.fixture,p.fixture]));
 });
 const incomplete=p.fuentes.some(f=>f.citas.some(id=>id==='CA-DOGC-L8-2025-alt-disp-31-6'))&&ref.missing.length>0;
 test.skipIf(incomplete)(`${p.id}: originales propios derivan total y cero explícito`,()=>{
  const r=vincularProyeccion(p.casePre,fixture,bytes);
  assert.equal(r.proyeccionFiscalVerificada,true);assert.equal(r.viviendaTransportada,false);
  assert.equal(r.deduccionAlquilerOpenEUR,null);assert.equal(r.sumaDeduccionesAutonomicasOpenEUR,'0.00');
  // Oráculos observados de los originales, nunca usados por el binding.
  assert.equal(r.resultadoOpenEUR,p.region==='07'?'726.00':'758.75');
  const c={...structuredClone(p.casePre),resultadoOpenEUR:r.resultadoOpenEUR,componentesOpenEUR:{},evidenciaOpen:{proyeccionInquilino:{packageSha256:ref.package.sha256}}};
  assert.equal(admitirProyeccionMedida(c,base).proyeccionFiscalVerificada,true);
  assert.equal(admitirProyeccionMedida({...c,componentesOpenEUR:{cuotaAutonomica:'0.00'}},base).estado,'no-verificado');
  c.resultadoOpenEUR='1.00';assert.equal(admitirProyeccionMedida(c,base).estado,'no-verificado');
 });
 test(`${p.id}: resultado aislado y bandera copiada no admiten`,()=>{
  for(const result of [null,'726.00','758.75'])assert.equal(admitirProyeccionMedida({...p.casePre,resultadoOpenEUR:result,proyeccionFiscalVerificada:true},base).estado,'no-verificado');
 });
 if(incomplete)test(`${p.id}: falta primaria concreta bloquea`,()=>assert.throws(()=>vincularProyeccion(p.casePre,fixture,bytes),/proyeccion-fuente-primaria-ausente/));
}
test('original truncado o sustituido no reconstruye',()=>{
 assert.throws(()=>reconstruirProyeccion(bytes.subarray(1)));
 const changed=Buffer.from(bytes);changed[500]^=1;assert.throws(()=>reconstruirProyeccion(changed));
});
test('signo explícito y sin redondear subcéntimos',()=>{
 assert.equal(centimosProyeccion('-758.75'),-75875n);assert.throws(()=>centimosProyeccion('726.001'));
});
