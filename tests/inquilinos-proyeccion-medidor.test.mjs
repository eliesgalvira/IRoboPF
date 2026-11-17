import {test} from 'vitest';
import assert from 'node:assert/strict';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
import {referenciaProyeccion} from '../tools/procedencia/simuladores/inquilinos-proyeccion.mjs';
const ref=referenciaProyeccion();
const base=new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url).pathname;
const casos=ref.casos.map(p=>({...structuredClone(p.casePre),
 resultadoOpenEUR:p.region==='07'?'726.00':'758.75',componentesOpenEUR:{},
 evidenciaOpen:{proyeccionInquilino:{packageSha256:ref.package.sha256}},
 integridadReferencias:{referencias:[{archivo:'proyeccion-inquilinos/originales.json',sha256:ref.package.sha256}]}}));
// Las observaciones están separadas de los hechos de vivienda conservados.
test('un importe suelto y banderas copiadas no suman numerador',()=>{
 const c=structuredClone(casos);for(const x of c){delete x.evidenciaOpen;x.proyeccionFiscalVerificada=true;}
 const r=medirCasos({N:2,casos:c},{base});assert.equal(r.medicion.iguales,0);assert.equal(r.medicion.N,2);
});
test('el cero autonómico no sustituye el total de liquidación',()=>{
 const c=structuredClone(casos);for(const x of c)x.resultadoOpenEUR='0.00';
 assert.equal(medirCasos({N:2,casos:c},{base}).medicion.iguales,0);
});
for(const c of casos){
 const missing=c.id.includes('catalunya')&&ref.missing.length>0;
 test.skipIf(missing)(`${c.id}: comparación API real tras vincular P`,()=>{
  const r=medirCasos({N:1,casos:[c]},{base});
  assert.equal(r.medicion.N,1);assert.equal(r.medicion.iguales,1);
  assert.equal(r.resultados[0].vinculacion.viviendaTransportada,false);
  assert.equal(r.resultados[0].vinculacion.transportComplete,false);
  const before=structuredClone(c),bad=structuredClone(c);bad.resultadoOpenEUR='1.00';
  assert.equal(medirCasos({N:1,casos:[bad]},{base}).medicion.iguales,0);assert.deepEqual(c,before);
  const renamed={...c,id:'open2025-sintetico-identidad-alterada'};
  assert.equal(medirCasos({N:1,casos:[renamed]},{base}).resultados[0].motivo,'proyeccion-inquilino-no-verificada');
 });
}
