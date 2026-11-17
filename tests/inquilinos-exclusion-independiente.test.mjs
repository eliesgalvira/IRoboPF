import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { vincularExclusionInquilino } from '../tools/procedencia/simuladores/inquilinos-exclusion.mjs';

// Requiere la candidata documental integrada. No importa ni ejecuta el motor.
// El cierre por hash no demuestra equivalencia fiscal de una proyección futura.
const slots = JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/casos.json', import.meta.url))).casos;
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/inquilinos-factual-2025.json', import.meta.url)));
const ids = ['open2025-castilla-la-mancha-01', 'open2025-catalunya-10'];
const denied = r => {
  assert.equal(r.estado, 'no-verificado');
  for (const k of ['deduccionAlquilerDocumentalEUR', 'deduccionAlquilerOpenEUR', 'resultadoOpenEUR']) assert.equal(r[k], null);
  assert.equal(r.transportComplete, false);
  assert.equal(r.countedAsMatch, false);
};

for (const id of ids) {
  const source = slots.find(s => s.id === id);
  test(`${id}: autoridad completa conservada sin convertir binding en medida`, () => {
    assert.ok(source);
    assert.equal(slots.filter(s => s.id === id).length, 1);
    const before = structuredClone({ source, fixtures });
    const r = vincularExclusionInquilino(source, fixtures);
    assert.equal(r.estado, 'exclusion-documental-vinculada');
    assert.deepEqual(r.hechosHabitacion, source.preparacionVivienda.hechosHabitacion);
    assert.equal(r.hechosHabitacion.anualEUR, '7200.00');
    assert.equal(r.hechosHabitacion.desde, '2024-12-01');
    assert.equal(r.hechosHabitacion.inquilino, true);
    assert.equal(r.deduccionAlquilerOpenEUR, null);
    assert.equal(r.resultadoOpenEUR, null);
    assert.equal(r.countedAsMatch, false);
    r.entradaAPI.trabajo.rendimientos[0].integro = '1';
    r.hechosHabitacion.titulares.push('otro-sintetico');
    assert.deepEqual({ source, fixtures }, before);
  });

  test(`${id}: cambios coordinados slot y fixture no eluden cierre`, () => {
    const mutants = [
      s => { s.entradaAPI.edad = 35; s.preparacionVivienda.hechosHabitacion.nacimiento = '1990-01-01'; },
      s => { s.entradaAPI.trabajo.rendimientos[0].integro = '16000.00'; },
      s => { s.entradaAPI.retenciones[0].importe = '4199.99'; },
      s => { s.entradaAPI.modalidad = 'conjunta'; },
      s => { s.entradaAPI.ejercicio = 2024; },
      s => { s.entradaAPI.comunidadAutonoma = 'aragon'; },
      s => { s.preparacionVivienda.hechosHabitacion.territorio = 'aragon'; },
      s => { s.preparacionVivienda.hechosHabitacion.persona = 'otro-sintetico'; },
      s => { s.preparacionVivienda.hechosHabitacion.derechosOtrasViviendas = [{ vivienda: 'otra-sintetica' }]; },
      s => { s.preparacionVivienda.hechosHabitacion.derechoInversionVivienda = true; },
      s => { s.preparacionVivienda.hechosHabitacion.trasladoPorTrabajo = true; },
      s => { s.preparacionVivienda.hechosHabitacion.firma = '2014-12-01'; s.preparacionVivienda.hechosHabitacion.desde = '2014-12-01'; },
      s => { delete s.preparacionVivienda.hechosHabitacion; },
      s => { s.entradaAPI = s.entradaTrabajoIndividualReferencia; delete s.preparacionVivienda; },
    ];
    for (const field of ['familiaNumerosa', 'monoparental', 'viudedad', 'dacionEnPago', 'violenciaGenero']) {
      for (const value of [true, null, '', undefined, 0, 'false']) mutants.push(s => {
        if (value === undefined) delete s.preparacionVivienda.hechosHabitacion[field];
        else s.preparacionVivienda.hechosHabitacion[field] = value;
      });
    }
    for (const [field, values] of [
      ['discapacidadPorcentaje', [64, 65, null, '', undefined]],
      ['desempleoDias2025', [182, 183, null, '', undefined]],
    ]) for (const value of values) mutants.push(s => {
      if (value === undefined) delete s.preparacionVivienda.hechosHabitacion[field];
      else s.preparacionVivienda.hechosHabitacion[field] = value;
    });
    for (const mutate of mutants) {
      const s = structuredClone(source), fs = structuredClone(fixtures);
      mutate(s);
      fs.find(f => f.id === id).entrada = structuredClone(s.entradaAPI);
      denied(vincularExclusionInquilino(s, fs));
    }
  });

  test(`${id}: hechos que parecen habilitar una vía también se rechazan coordinados`, () => {
    const routes = id.includes('catalunya') ? [
      s => { s.entradaAPI.edad = 35; s.preparacionVivienda.hechosHabitacion.nacimiento = '1990-01-01'; },
      s => { s.preparacionVivienda.hechosHabitacion.desempleoDias2025 = 183; },
      s => { s.preparacionVivienda.hechosHabitacion.discapacidadPorcentaje = 65; },
      s => { s.entradaAPI.edad = 65; Object.assign(s.preparacionVivienda.hechosHabitacion, { nacimiento: '1960-01-01', viudedad: true }); },
      s => { s.preparacionVivienda.hechosHabitacion.familiaNumerosa = true; },
      s => { s.preparacionVivienda.hechosHabitacion.monoparental = true; },
    ] : [
      s => { s.entradaAPI.edad = 35; s.preparacionVivienda.hechosHabitacion.nacimiento = '1990-01-01'; },
      s => { s.preparacionVivienda.hechosHabitacion.dacionEnPago = true; },
      s => { s.preparacionVivienda.hechosHabitacion.familiaNumerosa = true; },
      s => { s.preparacionVivienda.hechosHabitacion.monoparental = true; },
      s => { s.preparacionVivienda.hechosHabitacion.discapacidadPorcentaje = 65; },
    ];
    // Esto prueba rechazo de variantes, NO admisión positiva a una deducción:
    // CLM aún exige renta admisible y cada vía sus restantes requisitos.
    for (const change of routes) {
      const s = structuredClone(source), fs = structuredClone(fixtures);
      change(s);
      fs.find(f => f.id === id).entrada = structuredClone(s.entradaAPI);
      denied(vincularExclusionInquilino(s, fs));
    }
  });
}

test('el binding documental no acepta resultado o autoridad de otro slot', () => {
  const [a, b] = ids.map(id => structuredClone(slots.find(s => s.id === id)));
  a.preparacionVivienda.hechosHabitacion = b.preparacionVivienda.hechosHabitacion;
  denied(vincularExclusionInquilino(a, fixtures));
  for (const total of ['726.00', '758.75', '0.00']) {
    const s = structuredClone(slots.find(s => s.id === ids[0]));
    s.resultadoOpenEUR = total;
    denied(vincularExclusionInquilino(s, fixtures));
  }
});
