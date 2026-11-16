import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe,it,expect} from 'vitest';
import {vincularDT18Open} from '../tools/procedencia/simuladores/vincular-dt18-open.mjs';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
const doc=JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/observaciones.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/casos.json',import.meta.url)));
// Oráculos de transcripción de los originales; no proceden de una fórmula ni del motor.
const oracles=[
 ['open2025-canarias-01','-67.37','5606.00','228.75'],
 ['open2025-extremadura-02','735.50','5550.00','228.75'],
 ['open2025-comunitat-valenciana-03','-114.95','6105.00','450.00'],
 ['open2025-madrid-04','-541.07','5956.65','228.75'],
 ['open2025-andalucia-07','-299.55','5790.00','450.00'],
 ['open2025-comunitat-valenciana-09','327.55','6105.00','228.75'],
 ['open2025-madrid-12','-983.57','5956.65','450.00'],
];
const original=id=>structuredClone(doc.casos.find(c=>c.id===id));
describe('revisión independiente de integración DT18',()=>{
 it('conserva las siete viviendas verificadas dentro del denominador de 80',()=>{
  const result=medirCasos(oracles.map(([id])=>original(id)),{base,manifiesto:manifest});
  expect(result.medicion).toMatchObject({iguales:7,N:80,comparables:7,duplicados:0});
  expect(result.resultados.filter(r=>oracles.some(([id])=>id===r.id)).every(r=>r.coincidenciaVerificada)).toBe(true);
 });
 it.each(oracles)('%s: contraste literal de resultado, mínimos y deducciones', (id,resultado,minimo,dt18)=>{
  const c=original(id),before=JSON.stringify(c);
  expect(vincularDT18Open(c,base)).toMatchObject({estado:'transporte-dt18-ses-pdf-vinculado',
   countedAsMatch:false,historiaVerificada:false,contratoHistorico:'externofactual',
   casillas:{'0670':resultado,'0511':'5550.00','0519':'5550.00','0512':minimo,'0520':minimo,'0547':dt18,'0548':dt18}});
  expect(JSON.stringify(c)).toBe(before);
 });
 it.each(oracles)('%s: ningún original puede omitirse',id=>{
  const good=original(id);
  expect(Object.keys(good.evidenciaOpen.dt18)).toHaveLength(13);
  for(const key of Object.keys(good.evidenciaOpen.dt18)){
   const c=structuredClone(good);delete c.evidenciaOpen.dt18[key];
   expect(vincularDT18Open(c,base)).toMatchObject({estado:'no-verificado',countedAsMatch:false});
  }
 });
 it.each(oracles)('%s: estado aportado y cero no sustituyen la casilla original',id=>{
  const c=original(id);c.resultadoOpenEUR='0.00';
  c.coincidenciaVerificada=true;c.vinculacion={estado:'transporte-dt18-ses-pdf-vinculado'};
  expect(vincularDT18Open(c,base).estado).toBe('no-verificado');
  expect(medirCasos([c],{base}).medicion.iguales).toBe(0);
 });
 it.each(oracles)('%s: no acepta el marcador optativo vacío ni recurre a otro binding',id=>{
  const c=original(id);c.evidenciaOpen.dt18={};
  expect(medirCasos([c],{base}).resultados[0]).toMatchObject({
   coincidenciaVerificada:false,vinculacion:{estado:'no-verificado',motivo:'dt18-referencia-invalida'}});
 });
 it('deduplica el mismo expediente y conserva el denominador del manifiesto',()=>{
  const c=original(oracles[0][0]);
  const result=medirCasos([c,structuredClone(c)],{base,manifiesto:manifest});
  expect(result.medicion).toMatchObject({N:80,duplicados:1});
  expect(result.resultados.filter(r=>r.id===c.id)).toHaveLength(1);
 });
 it('un extractor fallido no genera coincidencia',()=>{
  const before=process.env.C_PDFTOTEXT;
  try{
   process.env.C_PDFTOTEXT=fileURLToPath(new URL('./dt18-extractor-inexistente',import.meta.url));
   const c=original(oracles[0][0]);
   expect(vincularDT18Open(c,base).estado).toBe('no-verificado');
   expect(medirCasos([c],{base}).medicion.iguales).toBe(0);
  }finally{if(before===undefined)delete process.env.C_PDFTOTEXT;else process.env.C_PDFTOTEXT=before;}
 });
});
