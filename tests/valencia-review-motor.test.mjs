// Revisión independiente del conteo y de la admisión del caso completo.
import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const tx=JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/valencia-transaction.json',import.meta.url)));
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
test('sin evidencia documental el resultado correcto no cuenta; tampoco el salarial',()=>{
 for(const bad of [{...tx.post,evidenciaOpen:{}},{...tx.post,resultadoOpenEUR:'601.05'},
  {...tx.post,id:'sintetico:identidad-alterada'},{...tx.post,pesoExterno:'0'}]){
  const before=structuredClone(bad),m=medirCasos([bad],{base});
  assert.equal(m.medicion.N,1);assert.equal(m.medicion.iguales,0);assert.deepEqual(bad,before);
 }
});
test('entrada parcial conserva N y nunca se degrada al cálculo salarial',()=>{
 const entrada=structuredClone(tx.post.entradaAPI);delete entrada.deduccionesValencianas2025;
 const m=medirCasos([{...tx.post,entradaAPI:entrada}],{base}),r=m.resultados[0];
 assert.equal(m.medicion.N,1);assert.equal(m.medicion.iguales,0);
 // No se exige un resultado fiscal concreto: importa que el binder no lo certifique.
 assert.notEqual(r.coincidenciaVerificada,true);
});
