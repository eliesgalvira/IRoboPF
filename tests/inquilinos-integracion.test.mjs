import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {prepararPublicacion} from '../tools/procedencia/simuladores/publicar-inquilino.mjs';
import {vincularInquilinoOpen,observacionInquilino} from '../tools/procedencia/simuladores/vincular-inquilino-open.mjs';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';
const read=url=>JSON.parse(readFileSync(new URL(url,import.meta.url)));
const ref=read('../tools/procedencia/simuladores/inquilinos-public-reference.json');
const base=fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url));
const fixture=read('./fixtures/inquilinos-factual-2025.json');
const pre=()=>structuredClone(ref.casePre);
const post=()=>({...pre(),...observacionInquilino('264.55')});
const rejected=c=>expect(vincularInquilinoOpen(c,base)).toMatchObject({estado:'no-verificado',resultadoOpenEUR:null,countedAsMatch:false});
test('PRE, publicación, relectura y medidor síncrono sin contar flags',()=>{
 // Reconstrucción del PRE histórico dentro de los documentos actuales; no escribe.
 const casos=read('../docs/procedencia/simuladores/medicion-2025/casos.json');
 const observaciones=read('../docs/procedencia/simuladores/medicion-2025/observaciones.json');
 for(const d of [casos,observaciones]){
  const index=d.casos.findIndex(c=>c.id===ref.id);
  expect(index).toBeGreaterThanOrEqual(0);d.casos[index]=pre();
 }
 const before=structuredClone({casos,observaciones});
 const next=prepararPublicacion(casos,observaciones,{base,fixture});
 expect({casos,observaciones}).toEqual(before);
 for(const k of ['casos','observaciones']){
  const c=next[k].casos.find(c=>c.id===ref.id);
  expect(next[k].N).toBe(80);
  expect(next[k].casos.filter(c=>c.id!==ref.id)).toEqual(before[k].casos.filter(c=>c.id!==ref.id));
  expect(vincularInquilinoOpen(c,base)).toMatchObject({estado:'transporte-inquilino-ses-pdf-vinculado',resultadoOpenEUR:'264.55',countedAsMatch:false,transporteValidado:true});
  const r=medirCasos({N:1,casos:[c]},{base});
  expect(r).not.toBeInstanceOf(Promise);
  expect(r.medicion).toMatchObject({N:1,comparables:1,iguales:1});
  expect(r.resultados[0]).toMatchObject({resultadoOpenEUR:'264.55',resultadoMotorEUR:'264.55',coincidenciaVerificada:true});
 }
 expect(()=>prepararPublicacion(next.casos,next.observaciones,{base,fixture})).toThrow('inq-transaction-pre');
});
test('PRE íntegro y fixture adulterados no permiten publicación ni mutación',()=>{
 for(const mutate of [c=>c.pendientes.push('deriva'),c=>c.procedenciaEntrada.metodo='otra',c=>c.resultadoOpenEUR='264.55']){
  const casos={N:80,casos:[pre()]},observaciones=structuredClone(casos);mutate(casos.casos[0]);
  const before=structuredClone({casos,observaciones});
  expect(()=>prepararPublicacion(casos,observaciones,{base,fixture})).toThrow();
  expect({casos,observaciones}).toEqual(before);
 }
 rejected(pre());
 expect(vincularInquilinoOpen(post(),base,{fixture:[]})).toMatchObject({estado:'no-verificado'});
});
test.each([
 c=>c.entradaAPI.edad++,c=>c.pesoExterno='1',c=>c.pesoTerritorialProxy.N++,
 c=>c.hechosObjetivo.tipo='otro',c=>c.procedenciaEntrada.metodo='otro',
 c=>c.preparacionVivienda.hechosHabitacion.itpPresentado='2025-01-01',
 c=>c.entradaAPI.deduccionesTerritoriales2025.solicitudes[0].hechos.contratos.push({...c.entradaAPI.deduccionesTerritoriales2025.solicitudes[0].hechos.contratos[0],id:'C2'}),
 c=>{const p=c.entradaAPI.deduccionesTerritoriales2025.solicitudes[0].hechos.pagos;p[1]={...p[0]};},
 c=>c.preparacionVivienda.hechosHabitacion.ayudasEUR='1',
 c=>c.preparacionVivienda.hechosHabitacion.reembolsoEUR='1',
 c=>c.preparacionVivienda.hechosHabitacion.titulares.push('extra'),
 c=>c.preparacionVivienda.hechosHabitacion.familiaNumerosa=true,
 c=>c.resultadoOpenEUR='300.00',c=>c.componentesOpenEUR={cuotaDiferencial:'264.55'},
 c=>c.evidenciaOpen.inquilino.sha256='0'.repeat(64),c=>c.evidenciaOpen.inquilino.extra=true,
 c=>c.integridadReferencias.referencias=[],c=>c.pendientes=['pendiente'],c=>c.extra=true,
])('slot alterado rechaza y conserva el input (%#)',mutate=>{
 const c=post();mutate(c);const before=structuredClone(c);rejected(c);expect(c).toEqual(before);
});
test('el slot histórico y la proyección salarial no son transporte regional',()=>{
 const c=post();delete c.evidenciaOpen;
 rejected(c);
 const salarial={...c,entradaAPI:c.entradaTrabajoIndividualReferencia};
 expect(medirCasos({N:1,casos:[salarial]},{base}).medicion.iguales).toBe(0);
});
