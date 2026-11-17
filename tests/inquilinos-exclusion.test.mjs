import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { vincularExclusionInquilino, resolverLanzadorAlquiler, titulosAlquiler } from '../tools/procedencia/simuladores/inquilinos-exclusion.mjs';

const slots = JSON.parse(readFileSync(new URL('../docs/procedencia/simuladores/medicion-2025/casos.json', import.meta.url))).casos;
const fixtures = JSON.parse(readFileSync(new URL('./fixtures/inquilinos-factual-2025.json', import.meta.url)));
const ids = ['open2025-castilla-la-mancha-01', 'open2025-catalunya-10'];
const pins = JSON.parse(readFileSync(new URL('../tools/procedencia/simuladores/inquilinos-exclusion-pins.json', import.meta.url)));
test('los pasajes normativos de la revisión siguen presentes en sus originales sellados', () => {
  for (const pin of pins.casos) for (const fuente of pin.fuentes) {
    const bytes = readFileSync(new URL('../' + fuente.path, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), fuente.sha256);
    const source = JSON.parse(bytes);
    const citas = source.citas ?? source.deducciones.find(d => d.codigo === 'cataluna_alquiler_vivienda_habitual').citas;
    for (const id of fuente.citas) assert.equal(citas.filter(c => c.id === id && c.textoLiteral).length, 1);
  }
});
const reject = r => {
  assert.equal(r.estado, 'no-verificado');
  assert.equal(r.deduccionAlquilerDocumentalEUR, null);
  assert.equal(r.deduccionAlquilerOpenEUR, null);
  assert.equal(r.resultadoOpenEUR, null);
  assert.equal(r.transportComplete, false);
  assert.equal(r.countedAsMatch, false);
};

for (const id of ids) {
  const original = slots.find(s => s.id === id);
  test(`${id}: vincula vivienda íntegra y cero documental sin acreditar Open`, () => {
    const before = structuredClone({ original, fixtures });
    const r = vincularExclusionInquilino(original, fixtures);
    assert.equal(r.estado, 'exclusion-documental-vinculada');
    assert.equal(r.deduccionAlquilerDocumentalEUR, '0.00');
    assert.deepEqual(r.hechosHabitacion, original.preparacionVivienda.hechosHabitacion);
    assert.equal(r.hechosHabitacion.pagos.length, 12);
    assert.equal(r.deduccionAlquilerOpenEUR, null);
    assert.equal(r.resultadoOpenEUR, null);
    assert.equal(r.transportComplete, false);
    assert.equal(r.countedAsMatch, false);
    r.hechosHabitacion.pagos.pop(); // La salida tampoco puede mutar el expediente.
    assert.deepEqual({ original, fixtures }, before);
  });
  test(`${id}: salario solo, blancos, alternativas y supuestos resultados no certifican exclusión`, () => {
    const mutations = [
      s => { delete s.preparacionVivienda; },
      s => { s.entradaAPI = s.entradaTrabajoIndividualReferencia; },
      s => { s.entradaAPI.edad = 35; },
      s => { s.preparacionVivienda.hechosHabitacion.pagos.pop(); },
      s => { s.preparacionVivienda.hechosHabitacion.firma = '2013-01-01'; },
      s => { s.resultadoOpenEUR = '0.00'; },
      s => { s.transportComplete = true; },
      s => { s.pesoExterno = '1'; },
    ];
    for (const field of ['familiaNumerosa', 'monoparental', 'viudedad', 'dacionEnPago', 'violenciaGenero']) {
      for (const value of [undefined, null, '', true]) mutations.push(s => {
        if (value === undefined) delete s.preparacionVivienda.hechosHabitacion[field];
        else s.preparacionVivienda.hechosHabitacion[field] = value;
      });
    }
    for (const [field, value] of [['discapacidadPorcentaje', 65], ['desempleoDias2025', 183], ['anualEUR', '0'], ['inquilino', false]])
      mutations.push(s => { s.preparacionVivienda.hechosHabitacion[field] = value; });
    for (const mutate of mutations) { const s = structuredClone(original); mutate(s); reject(vincularExclusionInquilino(s, fixtures)); }
    reject(vincularExclusionInquilino(original, []));
    reject(vincularExclusionInquilino(original, [...fixtures, fixtures.find(f => f.id === id)]));
    const changed = structuredClone(fixtures);
    changed.find(f => f.id === id).entrada.retenciones[0].importe = '0';
    reject(vincularExclusionInquilino(original, changed));
  });
}

test('DOM: título y ancestro observado; rechaza duplicados, ocultos, bloqueo y falta de relación', () => {
  // Dobles estructurales: prueban el rechazo del resolver, no son captura UI.
  const button = { getClientRects: () => [{}], disabled: false, getAttribute: () => null };
  let buttons = [button];
  const row = { querySelectorAll: () => buttons };
  const field = { getClientRects: () => [{}], disabled: false, readOnly: true,
    getAttribute: () => titulosAlquiler['castilla-la-mancha'], closest: () => row };
  let fields = [field];
  const doc = { querySelectorAll: () => fields };
  assert.equal(resolverLanzadorAlquiler(doc, 'castilla-la-mancha'), button);
  fields = [field, field]; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  fields = [field]; buttons = [button, button]; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  buttons = []; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  buttons = [button]; button.disabled = true; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  button.disabled = false; field.getClientRects = () => []; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  field.getClientRects = () => [{}]; field.closest = () => null; assert.throws(() => resolverLanzadorAlquiler(doc, 'castilla-la-mancha'));
  assert.throws(() => resolverLanzadorAlquiler(doc, 'murcia'));
});
