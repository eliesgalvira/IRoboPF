/** Cuatro originales sintéticos y adversas de su vinculación documental. */
import { test } from 'vitest';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { ascendantPredicateReadback, validateAscendantCase } from '../tools/procedencia/simuladores/ascendientes-open.mjs';
import { validateCase } from '../tools/procedencia/simuladores/capturar-casos.mjs';
import { conciliarMinimosAscendientes } from '../tools/procedencia/simuladores/vincular-open.mjs';
import { spawnSync } from 'node:child_process';
const ids = ['open2025-comunitat-valenciana-01', 'open2025-canarias-02', 'open2025-aragon-03', 'open2025-castilla-y-leon-04'];
const base = fileURLToPath(new URL('../docs/procedencia/simuladores/medicion-2025/', import.meta.url));
const manifest = JSON.parse(readFileSync(join(base, 'casos.json')));
for (const id of ids) test(`ascendiente sintetico ${id}`, () => {
  const dir = join(process.env.ASC_FIXTURES_DIR ?? join(base, 'oficiales'), id);
  const read = name => readFileSync(join(dir, name), 'utf8');
  const caso = manifest.casos.find(c => c.id === id);
  const ses = process.env.ASC_FIXTURES_DIR
    ? inflateSync(readFileSync(join(dir, 'captura.ses'))).toString('latin1') : read('persistencia.txt');
  const ev = { readbacks: JSON.parse(read('readbacks.json')), personal: JSON.parse(read('personal-antes-aceptar.json')),
    dialogo: read('asc-dialogo.html'), reglaConvivencia: readFileSync(process.env.ASC_RULE_HTML ?? join(base, 'oficiales/ascendientes-regla-100R304.html'), 'utf8') };
  const report = ascendantPredicateReadback(ses, caso, ev);
  assert.equal(report.countedAsMatch, false);
  assert.equal(report.aptoParaBindingSintetico, true);
  assert.ok(report.hechosNoIntroducidosExactamente.includes('convivencia-todo-el-anio'));
  assert.ok(report.hechosNoIntroducidosExactamente.includes('renta-exacta-cero'));
  assert.throws(() => validateCase(caso)); // Transporte general sigue cerrado.
  assert.equal(validateCase(caso, { allowAscendants: true }).asc, true);
  for (const key of ['IDII', 'GSS', 'IDRE', 'GCS', 'GCC', 'GDJ', 'IDICLDED2', 'GSSCLDED2']) {
    for (const field of ['requested', 'observed']) {
      const bad = structuredClone(ev);
      bad.readbacks.readbacks.find(r => r.key === key)[field] = field === 'requested' ? '1.00' : '1,00';
      assert.throws(() => ascendantPredicateReadback(ses, caso, bad), /asc-readback-moneda/);
    }
    const bad = structuredClone(ev);
    bad.readbacks.readbacks.push(structuredClone(bad.readbacks.readbacks.find(r => r.key === key)));
    assert.throws(() => ascendantPredicateReadback(ses, caso, bad), /asc-readback-ambiguo/);
  }
  assert.ok(process.env.C_PDFTOTEXT, 'El lector PDF debe estar configurado');
  const pdf = spawnSync('timeout', ['-k', '5s', '20s', process.env.C_PDFTOTEXT,
    '-layout', join(dir, 'captura.pdf'), '-'], { encoding: 'utf8', timeout: 26000 });
  assert.equal(pdf.status, 0);
  assert.equal(conciliarMinimosAscendientes(ses, pdf.stdout).estado, 'minimos-ses-pdf-coincidentes');
  for (const [key, box] of [['MASC', '0515'], ['MASCAU', '0516'], ['MPER', '0511'],
    ['MPERAU', '0512'], ['MPERFA', '0519'], ['MPERFAAU', '0520']]) {
    const line = new RegExp(`^   ${key}~1~[^\\n]+$`, 'm').exec(ses)?.[0];
    assert.ok(line);
    for (const bad of [ses.replace(line, `   ${key}~1~9999.0`),
      ses.replace(line, `${line}\n${line}`), ses.replace(line, `  [OTRO]\n${line}`), ses.replace(line, '')])
      assert.throws(() => conciliarMinimosAscendientes(bad, pdf.stdout));
    const pdfLine = pdf.stdout.split('\n').find(l => new RegExp(`\\s${box}\\s*$`).test(l));
    assert.ok(pdfLine);
    assert.throws(() => conciliarMinimosAscendientes(ses, pdf.stdout + '\n' + pdfLine));
    assert.throws(() => conciliarMinimosAscendientes(ses, pdf.stdout.replace(pdfLine, '')));
  }
  const badSes = [
    ses.replace('DNIAS~1~90000002J', 'DNIAS~1~90000000B'),
    ses.replace(/ANOAS~1~[^\n]+/, 'ANOAS~1~01/01/1954'),
    ses.replace('VINAS~1~D', 'VINAS~1~C'),
    ses.replace('     VINASDLG~1~D', '     VINASDLG~1~D\n     CONVIVENCIA~1~1'),
    ses.replace('    [RWHIJOSMAYOR18]', '    [RWHIJOSMAYOR18]\n     NIFHMAY~1~90000002J'),
    ses.replace('    [ASCENDIENTES]', '    [AJENO]'),
    ses.replace('     DNIAS~1~90000002J', '     DNIAS~1~90000002J\n     DNIAS~1~90000002J'),
    ses.replace('   ZDNIAS1~1~90000002J', '   ZDNIAS1~1~90000002J\n   ZDNIAS2~1~90000002J'),
    ses.replace('   DPNIF_C~2~254', '   DPNIF_C~1~90000002J'),
    ses.replace(/CAC_D~1~\d+/, 'CAC_D~1~99'),
    ses.replace('MESESDAFAS2~1~13', 'MESESDAFAS2~1~12'),
  ];
  for (const bad of badSes) assert.throws(() => ascendantPredicateReadback(bad, caso, ev));
  for (const mutate of [
    c => { c.id = 'otro'; },
    c => { c.entradaAPI.derechosMinimos.ascendientes.push(structuredClone(c.entradaAPI.derechosMinimos.ascendientes[0])); },
    c => { c.entradaAPI.derechosMinimos.ascendientes[0].titulares[0].convivencia[0].desde = '2025-07-01'; },
    c => { c.entradaAPI.derechosMinimos.ascendientes[0].declaracion = 'individual'; },
    c => { c.entradaAPI.derechosMinimos.ascendientes[0].gradoDiscapacidad = 33; },
    c => { c.entradaAPI.derechosMinimos.ascendientesCompletos = false; },
    c => { c.entradaAPI.derechosMinimos.ascendientes[0].titulares[0].economia.trabajo.rendimientos[0].integro = '1'; },
  ]) { const c = structuredClone(caso); mutate(c); assert.throws(() => validateAscendantCase(c)); }
  for (const mutate of [
    e => { e.readbacks.readbacks = e.readbacks.readbacks.filter(x => x.key !== 'asc-birth'); },
    e => { e.readbacks.readbacks.push(structuredClone(e.readbacks.readbacks.find(x => x.key === 'asc-birth'))); },
    e => { e.readbacks.readbacks.find(x => x.key === 'asc-number-right-holders').observed = '1'; },
    e => { e.readbacks.readbacks.find(x => x.key === 'asc-link').observed = 'C'; },
    e => { e.personal.find(x => x.title === 'Nombre del hijo').value = 'PRUEBA'; },
    e => { e.dialogo = '<div>sin predicados identificados</div>'; },
    e => { e.reglaConvivencia = '100R304'; },
  ]) { const e = structuredClone(ev); mutate(e); assert.throws(() => ascendantPredicateReadback(ses, caso, e)); }
});
