// Preparadas para ejecución del integrador; ninguna expectativa fuerza coincidencia.
import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
import {referenciaValencia} from '../tools/procedencia/simuladores/valencia-public-loader.mjs';
const ref=referenciaValencia();
const tx=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/valencia-transaction.json',import.meta.url)));
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
test('el medidor conserva el observado y calcula su propio residual y conteo',()=>{
 const before=structuredClone(tx.post),m=medirCasos([tx.post],{base}),r=m.resultados[0];
 assert.deepEqual(tx.post,before);
 assert.equal(m.medicion.N,1);assert.equal(r.resultadoOpenEUR,'-198.95');
 assert.equal(m.medicion.iguales,r.coincidenciaVerificada===true?1:0);
 if(r.coincidenciaVerificada===true){
  assert.equal(r.resultadoMotorEUR,'-198.95');
  assert.equal(r.vinculacion.estado,'transporte-valencia-ses-pdf-vinculado');
  assert.equal(r.vinculacion.countedAsMatch,false);
 }
});
test('semilla salarial, pesos alterados y entrada parcial no se convierten en coincidencia',()=>{
 for(const c of [{...tx.post,resultadoOpenEUR:'601.05'},
  {...tx.post,entradaAPI:{ejercicio:2025}},
  {...tx.post,pesoExterno:'123456.789'}]){
  const m=medirCasos([c],{base});assert.equal(m.medicion.N,1);assert.equal(m.medicion.iguales,0);
 }
 assert.equal(ref.casePre.resultadoOpenEUR,null);
});
