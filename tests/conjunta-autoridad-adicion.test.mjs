import {test,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {validateAuthorityAddition,validateReconciledHousehold,hash} from '../tools/procedencia/simuladores/conjunta-estricta.mjs';
// Contratos sintéticos: la adición enlaza originales, no los sustituye.
function sample(){
  const entry={comunidadAutonoma:'aragon',ejercicio:2025,economia:{trabajo:{integro:'47000.00'},retenciones:['6580.00']}};
  const fixtureBytes=Buffer.from(JSON.stringify({id:'sintetico-v2',entradaCandidata:entry}));
  const expedienteBytes=Buffer.from(JSON.stringify({hogar:{integro:'45000.00'},entradaCandidata:entry}));
  const diseno={comunidadAutonoma:'aragon',ejercicio:2025,trabajo:entry.economia.trabajo,retenciones:entry.economia.retenciones};
  const source=Buffer.from(JSON.stringify({cambios:[{idNuevo:'sintetico-v2',nuevo:{entradaTrabajoIndividualReferencia:diseno}}]}));
  const addition={id:'sintetico-v2',naturaleza:'contrato-ficticio-sintetico',origen:'diseno-v2-anterior-a-captura',preservaHogarLegacy:true,expedienteOriginalSha256:hash(expedienteBytes),fixtureCapturadoSha256:hash(fixtureBytes),disenoSha256:hash(source),diseno,entradaCandidata:entry};
  return {fixtureBytes,expedienteBytes,source,addition};
}
function execute(s){const authorityBytes=Buffer.from(JSON.stringify(s.addition));return validateAuthorityAddition({...s,authorityBytes,authoritySha256:hash(authorityBytes),authoritySources:{[hash(s.source)]:s.source}})}
test('adición exacta conserva el original contradictorio',()=>{const s=sample(),before=hash(s.expedienteBytes);expect(execute(s).estado).toBe('adicion-documental-verificada');expect(hash(s.expedienteBytes)).toBe(before)});
for(const [name,mutate] of [
 ['expediente distinto',s=>s.expedienteBytes=Buffer.from('{}')],
 ['fixture distinto',s=>s.addition.fixtureCapturadoSha256='0'.repeat(64)],
 ['diseño no aportado',s=>s.addition.disenoSha256='0'.repeat(64)],
 ['diseño discordante rehuellado',s=>{s.source=Buffer.from(JSON.stringify({cambios:[{idNuevo:'sintetico-v2',nuevo:{entradaTrabajoIndividualReferencia:{}}}]}));s.addition.disenoSha256=hash(s.source)}],
 ['entrada discordante',s=>s.addition.entradaCandidata={}],
 ['sin preservación',s=>s.addition.preservaHogarLegacy=false],
 ['caso ajeno',s=>s.addition.id='otro'],
])test(name,()=>{const s=sample();mutate(s);expect(()=>execute(s)).toThrow()});

const load=name=>JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/'+name,import.meta.url)));
const original=load('conjuntas-preparacion/datos/open2025-aragon-02-v2.json');
const entry=original.entradaCandidata;
const cambio=load('revision-unicidad-pendientes.json').cambios.find(c=>c.idNuevo==='open2025-aragon-02-v2');
test('proyección temporal valida todo el hogar sin cambiar el original',()=>{
 const before=JSON.stringify(original);expect(validateReconciledHousehold(original,entry,cambio)).toBe(true);expect(JSON.stringify(original)).toBe(before);
});
for(const [name,mutate]of[
 ['otra unidad',h=>h.nadieEnOtraUnidad=false],
 ['residencia cónyuge',h=>h.personas[1].residenciaTodo2025='madrid'],
 ['renta cónyuge',h=>h.personas[1].economia.rentasNoExentasEUR='100.00'],
 ['miembro adicional',h=>h.miembros.push('s-extra')],
 ['opción individual',h=>h.personas[2].declaracionObjetivo.presentaIndividual=true],
 ['unidad previa ajena',h=>h.personas[0].declaracionObjetivo.unidadFamiliar='ajena'],
 ['base laboral no autorizada',h=>h.personas[0].economia.trabajo.rendimientos[0].cotizaciones.derechosPasivos='100.00'],
])test('proyección rechaza '+name,()=>{const e=structuredClone(original);mutate(e.hogar);expect(()=>validateReconciledHousehold(e,entry,cambio)).toThrow()});
