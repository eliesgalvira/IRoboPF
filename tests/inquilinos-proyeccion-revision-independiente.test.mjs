import {test} from 'vitest';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {referenciaProyeccion,proyectarInquilino,admitirProyeccionMedida,reconstruirProyeccion} from '../tools/procedencia/simuladores/inquilinos-proyeccion.mjs';
import {medirCasos} from '../tools/procedencia/simuladores/medir-casos.mjs';

// Preparadas por revisión independiente. No ejecutadas durante la revisión.
const ref=referenciaProyeccion();
const base=new URL('../docs/procedencia/simuladores/medicion-2025/',import.meta.url).pathname;
const bytes=readFileSync(new URL('../'+ref.package.file,import.meta.url));
const fixtures=ref.casos.map(p=>p.fixture);
const observed=p=>({...structuredClone(p.casePre),resultadoOpenEUR:p.region==='07'?'726.00':'758.75',componentesOpenEUR:{},evidenciaOpen:{proyeccionInquilino:{packageSha256:ref.package.sha256}}});

for(const p of ref.casos){
 test(`${p.id}: fixture completo y autoridad no se sustituyen`,()=>{
  const H=structuredClone(p.casePre);
  const fs=structuredClone(fixtures);fs.find(f=>f.id===p.id).id='fixture-ajeno';
  assert.throws(()=>proyectarInquilino(H,fs));
  const meta=structuredClone(fixtures);meta.find(f=>f.id===p.id).marcaAjena=true;
  assert.throws(()=>proyectarInquilino(H,meta));
  for(const mutate of [
   h=>{h.preparacionVivienda.hechosHabitacion.pagos[0].importeEUR='599.99';},
   h=>{h.preparacionVivienda.hechosHabitacion.pagos[0].beneficiarioId='otra-persona-sintetica';},
   h=>{delete h.preparacionVivienda.hechosHabitacion.violenciaGenero;},
   h=>{h.preparacionVivienda.hechosHabitacion.rentasInmobiliariasPropias='existentes';},
   h=>{h.id=ref.casos.find(q=>q.id!==p.id).id;},
  ]){const h=structuredClone(H);mutate(h);assert.throws(()=>proyectarInquilino(h,fixtures));}
 });
 test(`${p.id}: las envolturas no conceden confianza`,()=>{
  const c=observed(p);
  for(const change of [
   x=>{x.evidenciaOpen.proyeccionInquilino.packageSha256='0'.repeat(64);},
   x=>{x.evidenciaOpen.proyeccionInquilino.transportComplete=true;},
   x=>{x.resultadoOpenEUR='-'+x.resultadoOpenEUR;},
   x=>{x.resultadoOpenEUR+='1';},
   x=>{x.componentesOpenEUR=null;},
   x=>{x.pesoExterno='1';},
   x=>{x.preparacionVivienda.hechosHabitacion.familiaNumerosa=true;},
  ]){const x=structuredClone(c);change(x);assert.equal(admitirProyeccionMedida(x,base).proyeccionFiscalVerificada,false);}
 });
}

test('un ID renombrado no debe degradar autoridad de vivienda a vínculo salarial',()=>{
 // Requiere autorización de integración y el lector PDF del entorno declarado.
 // El control salarial positivo impide confundir un fallo del lector con protección.
 assert.ok(process.env.C_PDFTOTEXT,'configurar lector PDF antes de ejecutar este adverso');
 const files=reconstruirProyeccion(bytes),dir=mkdtempSync(join(tmpdir(),'proyeccion-adverso-'));
 const p=ref.casos[0],refs=[];
 const persist=(name,b)=>{writeFileSync(join(dir,name),b);const r={archivo:name,sha256:createHash('sha256').update(b).digest('hex')};refs.push(r);return r;};
 const ses=persist('original.ses',files[p.id+'/parcial-trabajo.ses']);
 const pdf=persist('original.pdf',files[p.id+'/parcial-trabajo.pdf']);
 const renamed={...structuredClone(p.casePre),id:'revision-inquilino-renombrado',resultadoOpenEUR:'726.00',componentesOpenEUR:{},evidenciaOpen:{ses,pdf},integridadReferencias:{referencias:refs}};
 const salary={...renamed};delete salary.preparacionVivienda;delete salary.hechosObjetivo;
 assert.equal(medirCasos({N:1,casos:[salary]},{base:dir}).medicion.iguales,1,'control salarial debe vincular originales');
 renamed.preparacionVivienda.hechosHabitacion.familiaNumerosa=true;
 assert.equal(medirCasos({N:1,casos:[renamed]},{base:dir}).medicion.iguales,0,'vínculo salarial no prueba la vivienda alterada');
});
