/** Corte familiar sintético Open2025; no calcula mínimos ni resultados fiscales.
 * Evidencia: tests/fixtures/c300-variantes.json (familia 1, 2, 3 y 5),
 * binding.py, contract.py, c300.py y replay_functions.py. Los originales de
 * esas variantes repiten FNAC/NIF/VINCU en DP y en el diálogo por edad.
 * B/D y VNUMMDES=1/2 son correspondencias observadas, no definiciones legales.
 * GUARD, GUAROD y RENTASHMEN se conservan como observaciones sin semántica
 * inferida. La corrección de renta propia no cambió la proyección UI familiar.
 *
 * Integración: validateFamilyCase(caso) antes del transporte, y
 * familySesReadback(textoLatin1, caso) después de guardar el SES original.
 * Complementar con validación salarial, hashes, readbacks UI y resultado PDF.
 * No sustituye validateCase/sesReadback. El corte nuevo requiere recaptura.
 * Nunca convertir este informe parcial en acreditación fiscal completa.
 */
import { Schema } from 'effect';
import { createHash } from 'node:crypto';
const string = Schema.is(Schema.String), record = Schema.is(Schema.Record(Schema.String, Schema.Unknown));
const ensure = (ok, code) => { if (!ok) throw Error(code); };
const syntheticId = value => string(value) && /^s-[1-9]\d{0,5}$/.test(value);
const income = value => Number.isSafeInteger(value) && value >= 0;
const names = {
  andalucia: 'ANDALUCIA', catalunya: 'CATALUÑA', 'comunitat-valenciana': 'COMUNITAT VALENCIANA',
  galicia: 'GALICIA', canarias: 'CANARIAS', aragon: 'ARAGON', madrid: 'MADRID',
  asturias: 'PRINCIPADO DE ASTURIAS', 'illes-balears': 'ILLES BALEARS', cantabria: 'CANTABRIA',
  'castilla-la-mancha': 'CASTILLA-LA MANCHA', 'castilla-y-leon': 'CASTILLA Y LEON',
  extremadura: 'EXTREMADURA', murcia: 'REGION DE MURCIA', 'la-rioja': 'LA RIOJA',
};
const norm = s => s.replaceAll('\u00a0', ' ').normalize('NFD').replace(/\p{M}/gu, '').trim().toUpperCase();
const only = (o, keys) => record(o) && Object.keys(o).every(k => keys.includes(k));
const noDisability = o => only(o, ['_tag']) && o._tag === 'SinDiscapacidad';

/** Valida identidad referencial y el corte transportable, no la renta fiscal.
 * Acepta {entrada} del transporte o {entradaAPI} del manifiesto. Nunca usa
 * entradaTrabajoIndividualReferencia cuando entradaAPI es null (conjunta).
 */
export function validateFamilyCase(caso) {
  ensure(caso && caso.modalidadObjetivo !== 'conjunta', 'familia-modalidad-no-soportada');
  ensure(!(Object.hasOwn(caso, 'entradaAPI') && Object.hasOwn(caso, 'entrada')), 'familia-entrada-ambigua');
  const e = Object.hasOwn(caso, 'entradaAPI') ? caso.entradaAPI : caso.entrada;
  ensure(e && e.ejercicio === 2025 && e.modalidad === 'individual' && e.perfil === 'solo-trabajo'
    && e.edad === 40 && e.devengo === '2025-12-31' && Object.hasOwn(names, e.comunidadAutonoma)
    && e.familiaresConDerechoMinimo === 'segun-derechos', 'familia-perfil-no-soportado');
  const d = e.derechosMinimos;
  ensure(only(d, ['ascendientes', 'conciliacionRentasContribuyente', 'contribuyenteId', 'descendientes',
    'descendientesCompletos', 'devengo', 'discapacidadContribuyente', 'edadContribuyenteDevengo',
    'ejercicio', 'fallecimientosEnElEjercicio', 'modalidad', 'regimen', 'territorio'])
    && d.ejercicio === e.ejercicio && d.modalidad === e.modalidad && d.devengo === e.devengo
    && d.territorio === e.comunidadAutonoma && d.regimen === 'comun' && d.edadContribuyenteDevengo === e.edad
    && d.ascendientes === 'ninguno' && d.fallecimientosEnElEjercicio === 'ninguno'
    && d.descendientesCompletos === true && noDisability(d.discapacidadContribuyente)
    && Array.isArray(d.descendientes) && d.descendientes.length === 1, 'familia-derechos-no-soportados');
  ensure(syntheticId(d.contribuyenteId) && (e.contribuyenteId === undefined || e.contribuyenteId === d.contribuyenteId), 'familia-contribuyente-incoherente');
  const child = d.descendientes[0];
  ensure(only(child, ['declaracion', 'discapacidad', 'edadDevengo', 'fechaNacimiento', 'rentasNoExentasCentimos',
    'sujetoId', 'titulares', 'titularesCompletos', 'vivoAlDevengo'])
    && syntheticId(child.sujetoId) && child.sujetoId !== d.contribuyenteId, 'familia-sujeto-incoherente');
  ensure(string(child.fechaNacimiento) && /^(?:200\d|201\d|202[0-5])-01-01$/.test(child.fechaNacimiento)
    && child.edadDevengo === 2025 - Number(child.fechaNacimiento.slice(0, 4))
    && child.edadDevengo >= 0 && child.edadDevengo < 25, 'familia-fecha-no-soportada');
  ensure(child.vivoAlDevengo === true && child.titularesCompletos === true && noDisability(child.discapacidad)
    && only(child.declaracion, ['modalidad']) && child.declaracion.modalidad === 'no-presenta'
    && income(child.rentasNoExentasCentimos) && child.rentasNoExentasCentimos <= 800000,
  'familia-hechos-no-soportados');
  const ts = child.titulares, minor = child.edadDevengo < 18;
  ensure(Array.isArray(ts) && [1, 2].includes(ts.length), 'familia-titulares-no-soportados');
  const ids = ts.map(t => t?.titularId);
  ensure(ids.every(syntheticId) && new Set(ids).size === ids.length && !ids.includes(child.sujetoId)
    && ids.filter(id => id === d.contribuyenteId).length === 1, 'familia-titulares-incoherentes');
  // El fixture adulto conserva "exclusiva"; admitirlo no acredita custodia de adulto.
  ensure(ts.every(t => only(t, ['alimentosJudiciales', 'aplicaEspecialidadAlimentos', 'custodia', 'grado',
    'relacion', 'rentasNoExentasCentimos', 'residenteIrpf', 'titularId', 'vinculo'])
    && only(t.vinculo, ['clase']) && t.vinculo.clase === 'consanguinidad' && t.grado === 1
    && t.relacion === 'convivencia' && t.alimentosJudiciales === false && t.aplicaEspecialidadAlimentos === false
    && t.residenteIrpf === true && income(t.rentasNoExentasCentimos)
    && (minor ? t.custodia === (ts.length === 2 ? 'compartida' : 'exclusiva')
      : ts.length === 1 && ['exclusiva', 'no-procede'].includes(t.custodia))), 'familia-vinculo-no-soportado');
  return {
    contribuyenteId: d.contribuyenteId, sujetoId: child.sujetoId,
    otroTitularId: ids.find(id => id !== d.contribuyenteId) ?? null,
    fechaNacimientoSES: `01/01/${child.fechaNacimiento.slice(0, 4)}`,
    edad: child.edadDevengo, menor: minor, vinculoSES: ts.length === 2 ? 'D' : 'B',
    titulares: ts.length, territorio: e.comunidadAutonoma,
  };
}

export function validateSyntheticFamilyCase(caso) {
  ensure(caso && caso.modalidadObjetivo !== 'conjunta', 'familia-modalidad-no-soportada');
  ensure(!(Object.hasOwn(caso, 'entradaAPI') && Object.hasOwn(caso, 'entrada')), 'familia-entrada-ambigua');
  const e = Object.hasOwn(caso, 'entradaAPI') ? caso.entradaAPI : caso.entrada;
  ensure(e && e.ejercicio === 2025 && e.modalidad === 'individual' && e.perfil === 'solo-trabajo'
    && e.edad === 40 && e.devengo === '2025-12-31' && Object.hasOwn(names, e.comunidadAutonoma)
    && e.familiaresConDerechoMinimo === 'segun-derechos', 'familia-perfil-no-soportado');
  const d = e.derechosMinimos;
  ensure(only(d, ['ascendientes', 'conciliacionRentasContribuyente', 'contribuyenteId', 'descendientes',
    'descendientesCompletos', 'devengo', 'discapacidadContribuyente', 'edadContribuyenteDevengo',
    'ejercicio', 'fallecimientosEnElEjercicio', 'modalidad', 'regimen', 'territorio'])
    && d.ejercicio === e.ejercicio && d.modalidad === e.modalidad && d.devengo === e.devengo
    && d.territorio === e.comunidadAutonoma && d.regimen === 'comun' && d.edadContribuyenteDevengo === e.edad
    && d.ascendientes === 'ninguno' && d.fallecimientosEnElEjercicio === 'ninguno'
    && d.descendientesCompletos === true && noDisability(d.discapacidadContribuyente)
    && Array.isArray(d.descendientes) && d.descendientes.length === 1, 'familia-derechos-no-soportados');
  ensure(syntheticId(d.contribuyenteId) && (e.contribuyenteId === undefined || e.contribuyenteId === d.contribuyenteId), 'familia-contribuyente-incoherente');
  const child = d.descendientes[0];
  ensure(only(child, ['declaracion', 'discapacidad', 'edadDevengo', 'fechaNacimiento', 'rentasNoExentasCentimos',
    'sujetoId', 'titulares', 'titularesCompletos', 'vivoAlDevengo'])
    && syntheticId(child.sujetoId) && child.sujetoId !== d.contribuyenteId, 'familia-sujeto-incoherente');
  ensure(string(child.fechaNacimiento) && /^(?:200\d|201\d|202[0-5])-01-01$/.test(child.fechaNacimiento)
    && child.edadDevengo === 2025 - Number(child.fechaNacimiento.slice(0, 4))
    && [2, 3, 10, 16].includes(child.edadDevengo), 'familia-fecha-no-soportada');
  ensure(child.vivoAlDevengo === true && child.titularesCompletos === true && noDisability(child.discapacidad)
    && only(child.declaracion, ['modalidad']) && child.declaracion.modalidad === 'no-presenta'
    && income(child.rentasNoExentasCentimos) && child.rentasNoExentasCentimos === 0,
  'familia-hechos-no-soportados');
  const ts = child.titulares, minor = child.edadDevengo < 18;
  ensure(Array.isArray(ts) && [1, 2].includes(ts.length), 'familia-titulares-no-soportados');
  const ids = ts.map(t => t?.titularId);
  ensure(ids.every(syntheticId) && new Set(ids).size === ids.length && !ids.includes(child.sujetoId)
    && ids.filter(id => id === d.contribuyenteId).length === 1, 'familia-titulares-incoherentes');
  // Sólo menores del corte documentado; no se amplía a los fixtures adultos.
  ensure(ts.every(t => only(t, ['alimentosJudiciales', 'aplicaEspecialidadAlimentos', 'custodia', 'grado',
    'relacion', 'rentasNoExentasCentimos', 'residenteIrpf', 'titularId', 'vinculo'])
    && only(t.vinculo, ['clase']) && t.vinculo.clase === 'consanguinidad' && t.grado === 1
    && t.relacion === 'convivencia' && t.alimentosJudiciales === false && t.aplicaEspecialidadAlimentos === false
    && t.residenteIrpf === true && income(t.rentasNoExentasCentimos)
    && (minor ? t.custodia === (ts.length === 2 ? 'compartida' : 'exclusiva')
      : ts.length === 1 && ['exclusiva', 'no-procede'].includes(t.custodia))), 'familia-vinculo-no-soportado');
  return {
    contribuyenteId: d.contribuyenteId, sujetoId: child.sujetoId,
    otroTitularId: ids.find(id => id !== d.contribuyenteId) ?? null,
    fechaNacimientoSES: `01/01/${child.fechaNacimiento.slice(0, 4)}`,
    edad: child.edadDevengo, menor: minor, vinculoSES: ts.length === 2 ? 'D' : 'B',
    titulares: ts.length, territorio: e.comunidadAutonoma,
  };
}

// Parser local del texto ya descomprimido: ámbitos por indentación, sin búsqueda
// global de NIF/fecha. No abre archivos, no descomprime y no ejecuta transporte.
function parse(text) {
  ensure(string(text) && Buffer.byteLength(text, 'latin1') <= 4 * 1024 * 1024
    && !text.includes('\r'), 'familia-ses-texto-invalido');
  const header = /^<\?xml\s+([^\n]+)\?><PERSISTENCIAV2>\s*\n/.exec(text);
  ensure(header && text.trimEnd().endsWith('</PERSISTENCIAV2>'), 'familia-ses-incompleto');
  const attrs = [...header[1].matchAll(/(\w+)="([^"<>]*)"/g)];
  ensure(new Set(attrs.map(m => m[1])).size === attrs.length
    && header[1].replace(/(\w+)="([^"<>]*)"/g, '').trim() === '', 'familia-ses-cabecera-ambigua');
  const meta = Object.fromEntries(attrs.map(m => [m[1], m[2]]));
  ensure(meta.CodModelo === '100' && meta.EjModelo === '2025' && /^N\d+$/.test(meta.VersionReglas)
    && /^\d+\.\d+$/.test(meta.VersionModelo), 'familia-ses-modelo-invalido');
  const stack = [], sections = [], records = [];
  for (const line of text.slice(header[0].length, text.lastIndexOf('</PERSISTENCIAV2>')).split('\n')) {
    if (!line.trim()) continue;
    ensure(!line.includes('\t'), 'familia-ses-indentacion-invalida');
    const indent = line.length - line.trimStart().length;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    const section = /^ *\[([A-Z0-9_]+)\]$/.exec(line);
    if (section) {
      const block = { indent, name: section[1], path: [...stack.map(s => s.name), section[1]].join('/'), records: [] };
      sections.push(block); stack.push(block); continue;
    }
    ensure(stack[0]?.name === 'DECLARACIONES', 'familia-ses-fuera-declaracion');
    if (['{', '}', '(', ')'].includes(line.trim())) continue;
    const record = /^ *(\w+)~([123])~([^~\r\n]*)(?:~(254|255))?$/.exec(line);
    ensure(record, 'familia-ses-registro-malformado');
    const row = { key: record[1], type: record[2], value: record[3], suffix: record[4], path: stack.map(s => s.name).join('/') };
    records.push(row); stack.at(-1).records.push(row);
  }
  for (const [name, path, indent] of [['DECLARACIONES', 'DECLARACIONES', 0], ['DP', 'DECLARACIONES/DP', 2], ['IRPF2025', 'DECLARACIONES/IRPF2025', 2]]) {
    const blocks = sections.filter(s => s.name === name);
    ensure(blocks.length === 1 && blocks[0].path === path && blocks[0].indent === indent, 'familia-ses-ambito-ambiguo');
  }
  ensure(!sections.some(s => /^IRPF/.test(s.name) && s.name !== 'IRPF2025'), 'familia-ses-otro-ejercicio');
  return { sections, records };
}

/** Comprueba correspondencias observadas; errores sin valores ni texto SES.
 * El resultado nunca certifica custodia, rentas, autenticidad o cálculo fiscal.
 * NIF exclusivamente sintéticos, iguales a los del transporte actual.
 */
export function familySesReadback(text, caso) {
  const p = validateFamilyCase(caso), { sections, records } = parse(text);
  const expected = new Map();
  const add = (path, key, value, type = '1', suffix) => {
    const list = expected.get(key) ?? [];
    list.push({ path: `DECLARACIONES${path}`, value, type, suffix }); expected.set(key, list);
  };
  add('', 'INDV', 'true'); add('/IRPF2025', 'TITULAR', 'DECLARANTE');
  add('/DP', 'DPNIF_D', '90000000B', '3', '254');
  add('/DP', 'DPFNAC_D', '01/01/1985'); add('/DP', 'EDADD', '40');
  add('/DP', 'CAD_D', names[p.territorio]); add('/IRPF2025', 'ZFNAC_D', '01/01/1985');
  const dp = '/DP/DESCENDIENTES';
  for (const key of ['NIFH', 'NIFDLG']) add(dp, key, '90000002J');
  for (const key of ['FNAC', 'FNACDLG']) add(dp, key, p.fechaNacimientoSES);
  for (const key of ['VINCU', 'VINCUDLG']) add(dp, key, p.vinculoSES);
  add(dp, 'EDADH', String(p.edad)); add(dp, 'VNUMMDES', String(p.titulares));
  const age = p.menor ? '/DP/RWHIJOSMENOR18' : '/DP/RWHIJOSMAYOR18';
  const tail = p.menor ? 'HMEN' : 'HMAY';
  for (const key of [`NIF${tail}`, `NIF${tail}DLG`]) add(age, key, '90000002J');
  for (const key of [`FNAC${tail}`, `FNAC${tail}DLG`]) add(age, key, p.fechaNacimientoSES);
  add(age, `VINCU${tail}DLG`, p.vinculoSES);
  add('/IRPF2025', 'VINCU1', p.vinculoSES);
  if (p.otroTitularId) {
    add('', 'NIFOPAUX', '90000001N'); add(dp, 'NIFOPDLG', '90000001N');
    add(age, 'NIFOPDLGHMEN', '90000001N'); add('/OTROSPROGENITORES', 'NIFOP', '90000001N');
    add('/IRPF2025', 'NIFOP01', '90000001N');
  }
  // No aceptar otra familia oculta en un bloque duplicado o de otra edad.
  for (const name of ['DESCENDIENTES', 'RWHIJOSMENOR18', 'RWHIJOSMAYOR18', 'ASCENDIENTES']) {
    const blocks = sections.filter(s => s.name === name);
    ensure(blocks.every(s => s.path === `DECLARACIONES/DP/${name}` && s.indent === 4), 'familia-ses-ambito-familiar');
    const active = name === 'DESCENDIENTES' || name === (p.menor ? 'RWHIJOSMENOR18' : 'RWHIJOSMAYOR18');
    ensure(active ? blocks.filter(s => s.records.length).length === 1 : blocks.every(s => !s.records.length), 'familia-ses-familia-ambigua');
  }
  for (const [key, wanted] of expected) {
    const found = records.filter(r => r.key === key);
    ensure(found.length === wanted.length && wanted.every(w => found.filter(r => r.path === w.path
      && r.type === w.type && r.suffix === w.suffix
      && (key === 'CAD_D' ? norm(r.value) === norm(w.value) : r.value === w.value)).length === 1), 'familia-ses-identidad-distinta');
  }
  const code = (key, path) => {
    const rows = records.filter(r => r.key === key);
    ensure(rows.length === 1 && rows[0].path === `DECLARACIONES${path}` && rows[0].type === '1'
      && !rows[0].suffix && /^\d{1,2}$/.test(rows[0].value), 'familia-ses-territorio-ambiguo');
    return rows[0].value;
  };
  const region = code('CAC_D', '/DP');
  ensure(region === code('ZCCAD', '/IRPF2025') && (p.territorio !== 'madrid' || region === '12'), 'familia-ses-territorio-distinto');
  if (p.menor) {
    ensure(code('CACHMEN', age) === region && code('CACHMENDLG', age) === region, 'familia-ses-territorio-hijo-distinto');
    const labels = records.filter(r => r.key === 'CADHMENDLG');
    ensure(labels.length === 1 && labels[0].path === `DECLARACIONES${age}` && labels[0].type === '1'
      && !labels[0].suffix && norm(labels[0].value) === norm(names[p.territorio]), 'familia-ses-territorio-hijo-distinto');
  }
  if (!p.otroTitularId) ensure(!records.some(r => /^(?:NIFOP|NIFOPAUX|NIFOPDLG|NIFOPDLGHMEN|NIFOP01)$/.test(r.key)), 'familia-ses-otro-titular');
  return {
    estado: 'identidad-familiar-ses-parcial', countedAsMatch: false,
    observado: { fechaNacimiento: p.fechaNacimientoSES, edad: p.edad, vinculo: p.vinculoSES,
      numeroTitularesObservado: p.titulares, territorio: p.territorio },
    noVerificable: ['custodia-juridica', 'convivencia-y-residencia-efectivas', 'rentas-exactas-hijo-y-titulares',
      'declaracion-hijo', 'ausencia-alimentos-adopcion-discapacidad', 'exhaustividad-hechos-y-registros',
      'autenticidad-aeat', ...(p.territorio === 'madrid' ? [] : ['corte-familiar-fuera-madrid-no-observado'])],
    // Sin interpretar GUARD/GUAROD/RENTASHMEN ni convertir ausencias en false/cero.
    camposSinSemantica: ['GUARD', 'GUAROD', 'RENTASHMEN'],
  };
}

function syntheticFamilySesReadback(text, caso) {
  const p = validateSyntheticFamilyCase(caso), { sections, records } = parse(text);
  const expected = new Map();
  const add = (path, key, value, type = '1', suffix) => {
    const list = expected.get(key) ?? [];
    list.push({ path: `DECLARACIONES${path}`, value, type, suffix }); expected.set(key, list);
  };
  add('', 'INDV', 'true'); add('/IRPF2025', 'TITULAR', 'DECLARANTE');
  add('/DP', 'DPNIF_D', '90000000B', '3', '254');
  add('/DP', 'DPFNAC_D', '01/01/1985'); add('/DP', 'EDADD', '40');
  add('/DP', 'CAD_D', names[p.territorio]); add('/IRPF2025', 'ZFNAC_D', '01/01/1985');
  const dp = '/DP/DESCENDIENTES';
  for (const key of ['NIFH', 'NIFDLG']) add(dp, key, '90000002J');
  for (const key of ['FNAC', 'FNACDLG']) add(dp, key, p.fechaNacimientoSES);
  for (const key of ['VINCU', 'VINCUDLG']) add(dp, key, p.vinculoSES);
  add(dp, 'EDADH', String(p.edad)); add(dp, 'VNUMMDES', String(p.titulares));
  const age = p.menor ? '/DP/RWHIJOSMENOR18' : '/DP/RWHIJOSMAYOR18';
  const tail = p.menor ? 'HMEN' : 'HMAY';
  for (const key of [`NIF${tail}`, `NIF${tail}DLG`]) add(age, key, '90000002J');
  for (const key of [`FNAC${tail}`, `FNAC${tail}DLG`]) add(age, key, p.fechaNacimientoSES);
  add(age, `VINCU${tail}DLG`, p.vinculoSES);
  add('/IRPF2025', 'VINCU1', p.vinculoSES);
  if (p.otroTitularId) {
    add('', 'NIFOPAUX', '90000001N'); add(dp, 'NIFOPDLG', '90000001N');
    add(age, 'NIFOPDLGHMEN', '90000001N'); add('/OTROSPROGENITORES', 'NIFOP', '90000001N');
    add('/IRPF2025', 'NIFOP01', '90000001N');
  }
  // No aceptar otra familia oculta en un bloque duplicado o de otra edad.
  for (const name of ['DESCENDIENTES', 'RWHIJOSMENOR18', 'RWHIJOSMAYOR18', 'ASCENDIENTES']) {
    const blocks = sections.filter(s => s.name === name);
    ensure(blocks.every(s => s.path === `DECLARACIONES/DP/${name}` && s.indent === 4), 'familia-ses-ambito-familiar');
    const active = name === 'DESCENDIENTES' || name === (p.menor ? 'RWHIJOSMENOR18' : 'RWHIJOSMAYOR18');
    ensure(active ? blocks.filter(s => s.records.length).length === 1 : blocks.every(s => !s.records.length), 'familia-ses-familia-ambigua');
    ensure(!sections.some(s => s.path.startsWith(`DECLARACIONES/DP/${name}/`)), 'familia-ses-subfamilia-no-soportada');
  }
  const others = sections.filter(s => s.name === 'OTROSPROGENITORES');
  ensure(others.length <= 1 && others.every(s => s.path === 'DECLARACIONES/OTROSPROGENITORES'
    && s.indent === 2), 'familia-ses-otros-progenitores-ambiguos');
  ensure(!records.some(r => /^(?:VINCU|NIFOP)\d+$/.test(r.key)
    && !['VINCU1', 'NIFOP01'].includes(r.key)), 'familia-ses-familia-adicional');
  for (const [key, wanted] of expected) {
    const found = records.filter(r => r.key === key);
    ensure(found.length === wanted.length && wanted.every(w => found.filter(r => r.path === w.path
      && r.type === w.type && r.suffix === w.suffix
      && (key === 'CAD_D' ? norm(r.value) === norm(w.value) : r.value === w.value)).length === 1), 'familia-ses-identidad-distinta');
  }
  const code = (key, path) => {
    const rows = records.filter(r => r.key === key);
    ensure(rows.length === 1 && rows[0].path === `DECLARACIONES${path}` && rows[0].type === '1'
      && !rows[0].suffix && /^\d{1,2}$/.test(rows[0].value), 'familia-ses-territorio-ambiguo');
    return rows[0].value;
  };
  const region = code('CAC_D', '/DP');
  ensure(region === code('ZCCAD', '/IRPF2025') && (p.territorio !== 'madrid' || region === '12'), 'familia-ses-territorio-distinto');
  if (p.menor) {
    ensure(code('CACHMEN', age) === region && code('CACHMENDLG', age) === region, 'familia-ses-territorio-hijo-distinto');
    const labels = records.filter(r => r.key === 'CADHMENDLG');
    ensure(labels.length === 1 && labels[0].path === `DECLARACIONES${age}` && labels[0].type === '1'
      && !labels[0].suffix && norm(labels[0].value) === norm(names[p.territorio]), 'familia-ses-territorio-hijo-distinto');
  }
  if (!p.otroTitularId) ensure(!records.some(r => /^(?:NIFOP|NIFOPAUX|NIFOPDLG|NIFOPDLGHMEN|NIFOP01)$/.test(r.key)), 'familia-ses-otro-titular');
  return {
    estado: 'identidad-familiar-ses-parcial', countedAsMatch: false,
    observado: { fechaNacimiento: p.fechaNacimientoSES, edad: p.edad, vinculo: p.vinculoSES,
      numeroTitularesObservado: p.titulares, territorio: p.territorio },
    noVerificable: ['custodia-juridica', 'convivencia-y-residencia-efectivas', 'rentas-exactas-hijo-y-titulares',
      'declaracion-hijo', 'ausencia-alimentos-adopcion-discapacidad', 'exhaustividad-hechos-y-registros',
      'autenticidad-aeat', ...(p.territorio === 'madrid' ? [] : ['corte-familiar-fuera-madrid-no-observado'])],
    // Sin interpretar GUARD/GUAROD/RENTASHMEN ni convertir ausencias en false/cero.
    camposSinSemantica: ['GUARD', 'GUAROD', 'RENTASHMEN'],
  };
}

/** Diagnóstico del piloto sintético, nunca una certificación de hechos reales.
 * No se atribuye semántica a controles anónimos ni a ausencias del SES/PDF.
 * Hasta disponer de readbacks identificados de los restantes predicados, este
 * informe no habilita coincidenciaVerificada. Los nombres en faltantes son
 * requisitos de recaptura, no claves que baste añadir manualmente al JSON.
 */
export function familyPredicateReadback(text, caso, evidence) {
  if (evidence?.familyControls !== undefined) return completeFamilyReadback(text, caso, evidence);
  const identity = familySesReadback(text, caso);
  const e = caso.entradaAPI ?? caso.entrada, d = e.derechosMinimos;
  const child = d.descendientes[0];
  ensure(e.comunidadAutonoma === 'madrid' && child.edadDevengo === 10
    && d.contribuyenteId === 's-1' && child.sujetoId === 's-3'
    && child.titulares.length === 2 && child.titulares.some(t => t.titularId === 's-2'),
  'familia-scope-fuera-piloto');
  ensure(child.rentasNoExentasCentimos === 0, 'familia-renta-fuera-piloto');
  ensure(Array.isArray(evidence?.readbacks), 'familia-readbacks-ausentes');
  const row = key => {
    const rows = evidence.readbacks.filter(r => r?.key === key);
    ensure(rows.length === 1, 'familia-readback-ausente-o-duplicado');
    return rows[0];
  };
  for (const [key, expected] of [['nif', '90000000B'], ['birth', '01/01/1985'],
    ['child-nif', '90000002J'], ['child-birth', '01/01/2015'], ['other-nif', '90000001N']]) {
    const r = row(key);
    ensure(r.requested === expected && r.observed === expected, 'familia-readback-identidad-distinta');
  }
  const region = row('region'), link = row('family-link');
  const label = 'DHijos del primer declarante si también conviven con el otro progenitor: hijos de parejas de hecho, hijos del declarante con guarda y custodia compartida, hijos del declarante cuando haya fallecido el otro progenitor en el año';
  ensure(region.selected === 'MADRID' && region.options?.filter(x => x === region.selected).length === 1
    && link.selected === label && link.options?.filter(x => x === label).length === 1,
  'familia-readback-scope-distinto');
  const rent = row('child-income-over-8000');
  ensure(rent.observed === false && rent.exactIncomeEntered === false, 'familia-readback-renta-distinta');
  return {
    estado: 'predicados-familiares-parciales', countedAsMatch: false, origen: 'sintetico',
    alcance: 'Piloto Madrid individual, hijo de 10 años, renta API cero y dos titulares; no prueba hechos reales',
    identidad: identity.observado,
    equivalencias: ['identidad-referencial', 'fecha-y-edad', 'vinculo-ui-D', 'dos-titulares-observados',
      'renta-api-cero-satisface-predicado-ui-no-superior-8000'],
    // renta0 es una restricción de la entrada sintética, no una observación UI.
    rentaExactaIntroducidaEnOpen: false,
    faltantes: ['declaracion-hijo-control-identificado', 'discapacidad-control-identificado',
      'otras-situaciones-y-alimentos-control-identificado', 'custodia-compartida-sin-convivencia-progenitores',
      'exhaustividad-familiar-y-ausencia-fallecimientos'],
    limite: 'D admite varios supuestos; checkbox8000 no demuestra renta exacta ni ausencia de declaración. No interpretar RENTASHMEN ni controles sin etiqueta',
  };
}

// Etiquetas de la UI del menor. No se deduce semántica de códigos SES.
// El DOM observado tiene etiquetas ARIA vacías: se conserva también la etiqueta
// completa de .contenedordlg y se exige una estructura única, sin índices.
export function familyControlPlan(caso) {
  validateSyntheticFamilyCase(caso);
  return [
    ['checkbox', 'Si el hijo, integrante de la unidad familiar, ha obtenido rentas en 2025 (cualquier importe), marque la casilla', false],
    ['checkbox', 'Marque la casilla si el hijo ha percibido rentas en cuantía superior a 8.000 euros', false],
    ['checkbox', 'Marque la casilla si el hijo presenta declaración individual con rentas superiores a 1.800 euros (*)', false],
    ['checkbox', 'Si hubiera fallecido el otro progenitor en 2025 (antes del 31-12), marque la casilla (sólo para hijos con rentas)', false],
    ['checkbox', 'Si el otro progenitor ha fallecido en 2025 y la discapacidad del hijo ha sido reconocida con posterioridad al fallecimiento, marque la casilla', false],
    ['combobox', 'Clave discapacidad', ''],
    ['combobox', 'Otras situaciones', ''],
    ['datebox', 'En caso de adopción indique la fecha en que se ha producido:', ''],
    ['datebox', 'Si el hijo es adoptado y con anterioridad a la adopción ha convivido con el contribuyente en régimen de acogimiento permanente o preadoptivo o (guarda con fines de adopción) indique, además, la fecha del mismo:', ''],
    ['datebox', 'Si el hijo hubiera fallecido en 2025 (antes del 31 de Diciembre), indique la fecha de fallecimiento:', ''],
  ].map(([kind, label, expected]) => ({ kind, label, expected }));
}

/** Se llama sólo por el transporte futuro; no hay acceso al navegador al importar.
 * Sólo lee predicados negativos: nunca cambia identidad, ingresos ni SES.
 * Un control deshabilitado se conserva como tal, sin forzar activación.
 */
export async function observeFamilyControls(dialog, plan) {
  const rows = [];
  for (const spec of plan) {
    let field;
    if (spec.kind === 'checkbox') {
      const label = dialog.locator('.divtxt .z-label').filter({ hasText: new RegExp(`^${spec.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) });
      ensure(await label.count() === 1, 'familia-etiqueta-no-unica');
      field = label.locator('xpath=ancestor::*[contains(concat(" ",normalize-space(@class)," ")," contenedordlg ")][1]').locator('input[type=checkbox]');
    } else {
      field = dialog.locator(`.z-${spec.kind}[title=${JSON.stringify(spec.label)}] input`);
    }
    ensure(await field.count() === 1, 'familia-control-no-unico');
    const dom = await field.evaluate(el => {
      const ids = (el.getAttribute('aria-labelledby') ?? '').split(/\s+/).filter(Boolean);
      return {
        id: el.id, type: el.type, value: el.value, checked: el.checked, disabled: el.disabled,
        containerTitle: el.parentElement?.title ?? '',
        aria: ids.map(id => { const node = el.ownerDocument.getElementById(id); return { id, for: node?.getAttribute('for'), text: node?.textContent }; }),
        rowLabel: el.closest('.contenedordlg')?.querySelector('.divtxt .z-label')?.textContent ?? '',
      };
    });
    rows.push({ kind: spec.kind, label: spec.label, unique: true, dom });
  }
  return rows;
}

const digest = text => createHash('sha256').update(text).digest('hex');
export function familyInputDigest(caso) { return digest(JSON.stringify(caso.entradaAPI ?? caso.entrada)); }

/** Un nombre de clave añadido a mano no satisface este contrato: se requiere
 * lectura DOM identificada, única, ligada a entrada completa y texto SES.
 * Los hashes detectan alteraciones accidentales; no autentican origen AEAT.
 */
function partialFamilyReadback(text, caso, evidence) {
  const identity = syntheticFamilySesReadback(text, caso), p = validateSyntheticFamilyCase(caso);
  const { records } = parse(text);
  for (const [path, key] of [['DECLARACIONES/DP/DESCENDIENTES', 'NOMH'],
    ['DECLARACIONES/DP/RWHIJOSMENOR18', 'NOMHMEN']]) {
    const rows = records.filter(r => r.key === key);
    ensure(rows.length === 1 && rows[0].path === path && rows[0].type === '1'
      && rows[0].suffix === undefined && rows[0].value === 'HIJO', 'familia-nombre-resumen-distinto');
  }
  const controls = evidence.familyControls;
  ensure(controls?.schema === 'open2025-family-controls-v1'
    && controls.entradaSha256 === familyInputDigest(caso)
    && controls.sesLatin1Sha256 === createHash('sha256').update(Buffer.from(text, 'latin1')).digest('hex'), 'familia-controles-integridad-distinta');
  ensure(Array.isArray(controls.rows), 'familia-controles-ausentes');
  const childNames = evidence.readbacks?.filter(r => r?.key === 'child-name');
  ensure(childNames?.length === 1 && childNames[0].requested === 'PRUEBA HIJO'
    && childNames[0].observed === 'PRUEBA HIJO', 'familia-nombre-dialogo-distinto');
  const missing = [];
  const inventory = controls.inventory;
  if (!Array.isArray(inventory)) missing.push('inventario-familiar-identificado');
  else {
    ensure(inventory.every(r => ['Nombre del hijo', 'Nombre del descendiente', 'Convivencia:'].includes(r?.title)
      && string(r.value)), 'familia-inventario-invalido');
    ensure(inventory.filter(r => r.title === 'Nombre del hijo' && r.value === 'HIJO').length === 1
      && inventory.every(r => r.value.trim() === '' || (r.title === 'Nombre del hijo' && r.value === 'HIJO')),
    'familia-inventario-distinto');
    for (const title of ['Nombre del descendiente', 'Convivencia:'])
      ensure(inventory.some(r => r.title === title), 'familia-inventario-incompleto');
  }
  for (const spec of familyControlPlan(caso)) {
    const rows = controls.rows.filter(r => r?.kind === spec.kind && r.label === spec.label);
    if (!rows.length) { missing.push(spec.label); continue; }
    ensure(rows.length === 1 && rows[0].unique === true, 'familia-control-duplicado');
    const dom = rows[0].dom;
    ensure(dom && string(dom.id) && dom.id.length > 0, 'familia-control-sin-dom');
    if (spec.kind === 'checkbox') {
      ensure(dom.type === 'checkbox' && dom.rowLabel === spec.label && Array.isArray(dom.aria)
        && dom.aria.length === 1 && dom.aria[0].id && dom.aria[0].for === dom.id
        && string(dom.aria[0].text)
        && (dom.aria[0].text === '' || dom.aria[0].text === spec.label)
        && dom.checked === spec.expected, 'familia-checkbox-distinto');
    } else ensure(dom.type === 'text' && dom.containerTitle === spec.label
      && string(dom.value) && dom.value.trim() === spec.expected, 'familia-control-distinto');
  }
  ensure(controls.rows.every(r => familyControlPlan(caso).some(s => s.kind === r?.kind && s.label === r.label)), 'familia-controles-desconocidos');
  const readback = key => {
    const rows = evidence.readbacks?.filter(r => r?.key === key);
    ensure(rows?.length === 1, 'familia-readback-ausente-o-duplicado'); return rows[0];
  };
  for (const [key, value] of [['nif', '90000000B'], ['birth', '01/01/1985'], ['child-nif', '90000002J'],
    ['child-birth', p.fechaNacimientoSES], ...(p.otroTitularId ? [['other-nif', '90000001N']] : [])]) {
    const r = readback(key); ensure(r.requested === value && r.observed === value, 'familia-readback-identidad-distinta');
  }
  for (const [key, expected] of [['region', names[p.territorio]], ['family-link', p.vinculoSES]]) {
    const r = readback(key);
    ensure(string(r.selected) && Array.isArray(r.options)
      && r.options.filter(s => s === r.selected).length === 1
      && (key === 'region' ? norm(r.selected) === norm(expected)
        : r.selected.startsWith(`${expected}Hijos del primer declarante`)), 'familia-readback-scope-distinto');
    if (r.observed === undefined) missing.push(`${key}-valor-releido`);
    else ensure(key === 'region' ? norm(r.observed) === norm(expected) : r.observed.trim() === expected, 'familia-seleccion-no-persistida');
  }
  const childRegion = evidence.readbacks?.filter(r => r?.key === 'child-region') ?? [];
  if (!childRegion.length) missing.push('territorio-hijo-releido');
  else ensure(childRegion.length === 1 && string(childRegion[0].observed)
    && norm(childRegion[0].observed) === norm(names[p.territorio]), 'familia-territorio-hijo-distinto');
  if (p.otroTitularId) {
    for (const stage of ['familia', 'personal']) {
      const warnings = evidence.confirmations?.filter(r => r?.stage === stage) ?? [];
      if (!warnings.length) missing.push(`aviso-${stage}-releido`);
      else ensure(warnings.length === 1 && warnings[0].message === 'Compruebe si tiene que cumplimentar la clave "otras situaciones" para el hijo'
        && warnings[0].evidence?.file && /^[a-f0-9]{64}$/.test(warnings[0].evidence.sha256 ?? ''), 'familia-aviso-distinto');
    }
  }
  // El inventario de controles debe cubrir también la ausencia de situaciones
  // especiales externas al diálogo observado. Hasta disponer de readbacks de
  // esos ámbitos no basta con completar las diez filas del hijo.
  const personal = controls.personal;
  if (!Array.isArray(personal)) missing.push('datos-personales-identificados');
  else {
    // Estos títulos pertenecen al bloque personal observado, no al hijo.
    for (const [parentTitle, type, value] of [
      ['Fecha de nacimiento:', 'text', '01/01/1985'],
      ['Fecha de fallecimiento:', 'text', ''],
      ['Estado Civil (a 31/12/2025)', 'text', 'SOLTERO/A'],
      ['Si desea que el programa solamente calcule la declaración individual del declarante, marque aquí', 'checkbox', true],
      ['Clave de discapacidad', 'text', ''],
    ]) {
      const rows = personal.filter(r => r?.title === '' && r.parentTitle === parentTitle);
      if (!rows.length) { missing.push(parentTitle); continue; }
      ensure(rows.length === 1 && rows[0].type === type && rows[0].disabled === false
        && (type === 'checkbox' ? rows[0].checked === value
          : string(rows[0].value) && rows[0].value.trim() === value), 'familia-personal-distinto');
    }
  }
  // Los 25 comboitems guardados son de vínculo/territorio, no de estos
  // dos controles. Ni Borrar ajeno ni popup sin items define el vacío.
  missing.push('ausencia-otros-familiares-inventario-completo',
    'opciones-vacias-discapacidad-y-situaciones-semantica-ui',
    'opcion-vacia-discapacidad-declarante-semantica-ui');
  return { estado: missing.length ? 'predicados-familiares-parciales' : 'predicados-sinteticos-observados',
    aptoParaBindingSintetico: missing.length === 0, countedAsMatch: false, origen: 'sintetico',
    identidad: identity.observado, faltantes: missing, rentaExactaIntroducidaEnOpen: false,
    limite: 'Predicados UI negativos sobre hechos sintéticos; sin autenticación AEAT ni acreditación jurídica. No interpreta códigos SES.' };
}

/** Captura futura: abrir sólo opciones, nunca seleccionar ni deducir vacío.
 * Se conservan ownership DOM, items y valores antes/después para revisión.
 * No habilita binding: la semántica se revisa tras la recaptura real.
 */
export async function observeFamilyOptionPopups(dialog, titles = ['Clave discapacidad', 'Otras situaciones']) {
  const result = [];
  for (const title of titles) {
    // Exact title sin nth: no mezcla items de vínculo o territorio.
    const field = dialog.locator('.z-combobox[title=' + JSON.stringify(title) + ']');
    ensure(await field.count() === 1, 'familia-popup-control-ambiguo');
    const before = await field.locator('input').inputValue();
    const id = await field.locator('input').getAttribute('aria-controls');
    ensure(id && /^[A-Za-z0-9_-]+$/.test(id), 'familia-popup-sin-owner');
    try {
      await field.locator('a[role=button]').click();
      const popup = dialog.locator('[id=' + JSON.stringify(id) + ']');
      await popup.locator('.z-comboitem').first().waitFor({ state: 'attached', timeout: 10000 });
      result.push(await field.evaluate(el => {
        const input = el.querySelector('input');
        const popupId = input.getAttribute('aria-controls');
        const popup = el.ownerDocument.getElementById(popupId);
        return { title: el.title, controlId: input.id, popupId, html: popup.outerHTML,
          items: [...popup.querySelectorAll('.z-comboitem')].map(item => ({ id: item.id, text: item.textContent })) };
      }));
    } finally {
      await field.locator('input').press('Escape');
      ensure(await field.locator('input').inputValue() === before, 'familia-popup-cambio-valor');
    }
  }
  return result;
}

const dialogTemplates = {
  "1": [
    {
      "title": "Apellidos y nombre:",
      "parentTitle": "",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "NIF:",
      "parentTitle": "",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Fecha de nacimiento:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Vinculación",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Clave discapacidad",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Otras situaciones",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Hombre",
      "type": "radio",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Mujer",
      "type": "radio",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Comunidad Autónoma",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "En caso de adopción indique la fecha en que se ha producido:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo es adoptado y con anterioridad a la adopción ha convivido con el contribuyente en régimen de acogimiento permanente o preadoptivo o (guarda con fines de adopción) indique, además, la fecha del mismo:",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo hubiera fallecido en 2025 (antes del 31 de Diciembre), indique la fecha de fallecimiento:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo, integrante de la unidad familiar, ha obtenido rentas en 2025 (cualquier importe), marque la casilla:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Marque la casilla si el hijo ha percibido rentas en cuantía superior a 8.000 euros:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Marque la casilla si el hijo presenta declaración individual con rentas superiores a 1.800 euros (*):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si hubiera fallecido el otro progenitor en 2025 (antes del 31-12), marque la casilla (sólo para hijos con rentas):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si hubiera fallecido el otro progenitor en 2025 (antes del 31-12), marque la casilla (sólo para hijos con rentas):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo ha sido en 2025 residente en países de la Unión Europea o del Espacio Económico Europeo (distintos de España) y no es contribuyente por el Impuesto sobre la Renta de las Personas Físicas, marque la casilla si el declarante (y/o algún otro miembro de la unidad familiar que sea contribuyente del IRPF) va a aplicar la deducción de la disposición adicional cuadragésima octava de la Ley de IRPF:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "Apellidos y nombre:",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "NIF:",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el otro progenitor no\ntiene NIF/NIE marque la casilla",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Hombre",
      "type": "radio",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Mujer",
      "type": "radio",
      "disabled": true,
      "value": "",
      "checked": false
    }
  ],
  "2": [
    {
      "title": "Apellidos y nombre:",
      "parentTitle": "",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "NIF:",
      "parentTitle": "",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Fecha de nacimiento:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Vinculación",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Clave discapacidad",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Otras situaciones",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Hombre",
      "type": "radio",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Mujer",
      "type": "radio",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Comunidad Autónoma",
      "type": "text",
      "disabled": false,
      "value": " ",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "En caso de adopción indique la fecha en que se ha producido:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo es adoptado y con anterioridad a la adopción ha convivido con el contribuyente en régimen de acogimiento permanente o preadoptivo o (guarda con fines de adopción) indique, además, la fecha del mismo:",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo hubiera fallecido en 2025 (antes del 31 de Diciembre), indique la fecha de fallecimiento:",
      "type": "text",
      "disabled": false,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo, integrante de la unidad familiar, ha obtenido rentas en 2025 (cualquier importe), marque la casilla:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Marque la casilla si el hijo ha percibido rentas en cuantía superior a 8.000 euros:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Marque la casilla si el hijo presenta declaración individual con rentas superiores a 1.800 euros (*):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si hubiera fallecido el otro progenitor en 2025 (antes del 31-12), marque la casilla (sólo para hijos con rentas):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si hubiera fallecido el otro progenitor en 2025 (antes del 31-12), marque la casilla (sólo para hijos con rentas):",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el hijo ha sido en 2025 residente en países de la Unión Europea o del Espacio Económico Europeo (distintos de España) y no es contribuyente por el Impuesto sobre la Renta de las Personas Físicas, marque la casilla si el declarante (y/o algún otro miembro de la unidad familiar que sea contribuyente del IRPF) va a aplicar la deducción de la disposición adicional cuadragésima octava de la Ley de IRPF:",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "Apellidos y nombre:",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "NIF:",
      "parentTitle": "",
      "type": "text",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Si el otro progenitor no\ntiene NIF/NIE marque la casilla",
      "type": "checkbox",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Hombre",
      "type": "radio",
      "disabled": true,
      "value": "",
      "checked": false
    },
    {
      "title": "",
      "parentTitle": "Mujer",
      "type": "radio",
      "disabled": true,
      "value": "",
      "checked": true
    }
  ]
};
const observedSesKeys = {
  "DECLARACIONES": [
    "DPACEPTADOS",
    "RGLP2",
    "NOMAPEOPAUX",
    "GAHLP2",
    "TODOLPUF",
    "COD_TRAMITE",
    "LEERTITULARCOMUN",
    "DF_NIF_D",
    "TIDI1APEDIF24",
    "TIDI1APEDIF22",
    "TIDI1APEDIF23",
    "TIDI1APEDIF21",
    "MODO_APLICACION_INFR",
    "NIFOPAUX",
    "DF_FIN_D",
    "CONYUGEUEFICHERO",
    "T0_NIFCERTIFICADO",
    "OBLMATERD",
    "LEERTITULARC",
    "LEERTITULARD",
    "ENABLED_CASILLAEXT_CAMBIO_POR_REGLAS",
    "RAHLP2",
    "GG2",
    "GAH2",
    "RAH2",
    "CON_REG",
    "INDV",
    "DFRTAOK",
    "OBLUFMATER",
    "RG2",
    "MODO_APLICACION",
    "MUJEROPAUX",
    "INDICE_GENERAL",
    "LEERTITULARHR",
    "TODOCYMUF",
    "GGLP2",
    "ENABLED_CASILLAEXT_CAPA001",
    "EJERCICIO",
    "FECHAINICIOCAMPANYA",
    "TBGD"
  ],
  "DECLARACIONES/DP": [
    "SOLTERO",
    "HOMBRE_D",
    "HOMBRE_C",
    "ISAUTORIZCONYU",
    "DPFNAC_D",
    "CAD_D",
    "MUJER_D",
    "MUJER_C",
    "CASADO",
    "DECFAL",
    "PH18",
    "ECIVIL",
    "VIUDO",
    "ECIVILC",
    "CAC_D",
    "DP_APENOM_D",
    "EDADD",
    "SEPARADO",
    "DPNIF_C",
    "DPNIF_D"
  ],
  "DECLARACIONES/DP/ASCENDIENTES": [],
  "DECLARACIONES/DP/DESCENDIENTES": [
    "NIFOPDLG",
    "APENOM_DAFAS_SR",
    "APENOMDLG_SR",
    "NOMH",
    "FNACDLG",
    "EDADH",
    "VINCU",
    "NIFH",
    "MUJEROPDLG",
    "FNAC",
    "NIFDLG",
    "VINCUDLG",
    "VNUMMDES",
    "NOMAPEOPDLG",
    "GUAROD",
    "GUARD",
    "MATD",
    "MATOD"
  ],
  "DECLARACIONES/DP/RWHIJOSMENOR18": [
    "UFHMENDLG",
    "MUJEROPDLGHMEN",
    "RENTASHMEN",
    "FNACHMENDLG",
    "FNACHMEN",
    "NOMHMEN",
    "NIFHMENDLG",
    "VINCUHMENDLG",
    "CACHMENDLG",
    "NOMAPEOPDLGHMEN",
    "CADHMENDLG",
    "APENOMDLG_HMEN",
    "NIFOPDLGHMEN",
    "CACHMEN",
    "NIFHMEN"
  ],
  "DECLARACIONES/DP/RWHIJOSMAYOR18": [],
  "DECLARACIONES/RESUMEN": [
    "R_SPNIF",
    "R_MPERFAAU",
    "R_SPNOM",
    "R_MPERFA",
    "R_TIT"
  ],
  "DECLARACIONES/ACTIVIDADES": [
    "ACT_TIT"
  ],
  "DECLARACIONES/INFO": [
    "MIRARDETER"
  ],
  "DECLARACIONES/IRPF2025": [
    "IRPFCCAA",
    "BLGRAL",
    "T1_IMPORTE_PF2",
    "T1_IMPORTE_PF1",
    "TPOGD",
    "DF_CAT1VA4",
    "DED98A",
    "T1_IMPORTE",
    "NIFOP01",
    "VINCU1",
    "IDICLDED2",
    "ZAPENOM_D",
    "CLAIN",
    "T1_FORMAPAGO",
    "RET1",
    "BLGGRAV",
    "MDESAU",
    "SOLONEGROS",
    "CINTEST",
    "SUMTPRNP",
    "TMA",
    "TME",
    "Y81",
    "OBLMATERSNTDF",
    "CLAINO",
    "MPER",
    "T1_FORMAPAGO_PF2",
    "T1_FORMAPAGO_PF1",
    "ZAPENU1",
    "GSSCLDED2",
    "RESULTADO",
    "BIGRALH",
    "CINTAUT",
    "BIGRALJ",
    "MDES",
    "DF_DATOS_SI",
    "ZFNAC_D",
    "CAUTLIQ",
    "DF_AVISOS",
    "CLIQEST",
    "SOLTERO_D",
    "MPERFAAU",
    "ZDNIU1",
    "TITULAR",
    "ZANOU1",
    "CLIQAUT",
    "ZQ1",
    "ZHOMBRE_D",
    "CIGAUT",
    "RESINGDEV",
    "PAGOS",
    "CEXGA2",
    "CEXGA1",
    "CLIQT",
    "CLEIN",
    "CDIF",
    "SUMARDTO",
    "MBGRALAU",
    "SEXOOP01",
    "CEXGE2",
    "CEXGE1",
    "MPERFA",
    "OROP1",
    "DF_CAT2VA4",
    "OBLMATERSN",
    "MPERAU",
    "MBGRAL",
    "ZCCAD",
    "SPNIF",
    "TPTOTAL",
    "TPRDTO",
    "NOMAPEOP01",
    "CIGEST",
    "SPNOM",
    "FPAGOC",
    "POS1MATER",
    "DEDB1MATER",
    "FORMADEVC"
  ],
  "DECLARACIONES/IRPF2025/ARAGON": [
    "TITAR19"
  ],
  "DECLARACIONES/IRPF2025/ATRABAJO": [
    "TPING",
    "TITA",
    "TPVA_CREGLAS_CASILLAEXT",
    "TPDIN_CREGLAS_CASILLAEXT",
    "TPDIN",
    "TPGSS",
    "TPICR_CREGLAS_CASILLAEXT",
    "TPGSS_CAPA001_CASILLAEXT",
    "TPICR_CAPA001_CASILLAEXT",
    "TPDIN_CAPA001_CASILLAEXT",
    "TPIC_CREGLAS_CASILLAEXT",
    "TPIC_CAPA001_CASILLAEXT",
    "TPRNP",
    "TPGSS_CREGLAS_CASILLAEXT",
    "TPVA_CAPA001_CASILLAEXT"
  ],
  "DECLARACIONES/IRPF2025/ATRABAJO/DLGTRABAJO": [
    "IDRE_CREGLAS_CASILLAEXT",
    "IEVA_CREGLAS_CASILLAEXT",
    "GSS_CAPA001_CASILLAEXT",
    "IEIR_CAPA001_CASILLAEXT",
    "IEIC_CREGLAS_CASILLAEXT",
    "IDII",
    "IEIC_CAPA001_CASILLAEXT",
    "IDRE_CAPA001_CASILLAEXT",
    "GSS",
    "GSS_CREGLAS_CASILLAEXT",
    "IDRE",
    "IEVA_CAPA001_CASILLAEXT",
    "IEIR_CREGLAS_CASILLAEXT",
    "IDII_CREGLAS_CASILLAEXT",
    "IDII_CAPA001_CASILLAEXT"
  ],
  "DECLARACIONES/IRPF2025/CASTILLA_LA_MANCHA": [
    "DIASCM"
  ],
  "DECLARACIONES/IRPF2025/TDAFAS5": [
    "TODODAFAS5"
  ],
  "DECLARACIONES/IRPF2025/TVEHELEC": [
    "INDVEHELEC"
  ],
  "DECLARACIONES/IRPF2025/CATALUNYA": [
    "DECCT6"
  ],
  "DECLARACIONES/RIOJA_COMUN": [
    "DIASCLR8",
    "C02LR8",
    "C01LR8"
  ],
  "DECLARACIONES/OTROSPROGENITORES": [
    "NIFOP",
    "NOMAPEOP",
    "MUJEROP"
  ],
  "DECLARACIONES/VALENCIA_COMUN": [
    "DIASOVA1"
  ],
  "DECLARACIONES/ANDALUCIA_COMUN": [
    "CAT1A16",
    "CAT2A16"
  ],
  "DECLARACIONES/CANTABRIA_COMUN": [
    "IMP3ACANT8",
    "IMP2ACANT8",
    "IMP1ACANT8",
    "IMP4ACANT8"
  ],
  "DECLARACIONES/MADRID_COMUN": [
    "NUMEROM8",
    "CAT1M21",
    "NUMM15",
    "CAT2M21"
  ],
  "DECLARACIONES/ARAGON_COMUN": [
    "COM2AR3",
    "COM1AR3",
    "COMAR19"
  ],
  "DECLARACIONES/CANARIAS_COMUN": [
    "IMPA2CAN18",
    "IMPA5CAN18",
    "COM1CAN23",
    "IMPA4CAN18",
    "IMPA1CAN18",
    "CON2CAN4",
    "COM2CAN23",
    "IMPA3CAN18",
    "IMPA6CAN18"
  ]
};
const personalTemplate = [
  {
    "title": "",
    "parentTitle": "Castellano",
    "value": "on",
    "checked": true,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Catalán",
    "value": "on",
    "checked": false,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Gallego",
    "value": "on",
    "checked": false,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Valenciano",
    "value": "on",
    "checked": false,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Si desea que el programa solamente calcule la declaración individual del declarante, marque aquí",
    "value": "on",
    "checked": true,
    "type": "checkbox",
    "disabled": false
  },
  {
    "title": "NIF:",
    "parentTitle": "",
    "value": "90000000B",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "Apellidos y nombre:",
    "parentTitle": "",
    "value": "PRUEBA C OPEN",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Estado Civil (a 31/12/2025)",
    "value": "SOLTERO/A",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Fecha de nacimiento:",
    "value": "01/01/1985",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Hombre",
    "value": "on",
    "checked": true,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Mujer",
    "value": "on",
    "checked": false,
    "type": "radio",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Clave de discapacidad",
    "value": " ",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Comunidad Autónoma",
    "value": "$region",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "",
    "parentTitle": "Fecha de fallecimiento:",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "Nombre del hijo",
    "parentTitle": "",
    "value": "HIJO",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "NIF:",
    "parentTitle": "",
    "value": "90000002J",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Fecha de   nacimiento:",
    "parentTitle": "",
    "value": "$birth",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Clave de  discapacidad:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "Fallecido\nen 2025",
    "value": "on",
    "checked": false,
    "type": "checkbox",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "",
    "value": "NO",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Nombre del hijo",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "NIF:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Fecha de   nacimiento:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Clave de  discapacidad:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "Fallecido\nen 2025",
    "value": "on",
    "checked": false,
    "type": "checkbox",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Nombre del descendiente",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "NIF:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Fecha de   nacimiento:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Clave de  discapacidad:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "",
    "parentTitle": "Fallecido\nen 2025",
    "value": "on",
    "checked": false,
    "type": "checkbox",
    "disabled": true
  },
  {
    "title": "Volumen de rentas:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "NIF:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": false
  },
  {
    "title": "Apellidos y nombre:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Fecha de   nacimiento:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Fallecido en 2025:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Vinculación:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Clave de  discapacidad:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  },
  {
    "title": "Convivencia:",
    "parentTitle": "",
    "value": "",
    "checked": false,
    "type": "text",
    "disabled": true
  }
];
const sesTemplates = {
  "2-10": {
    "DP": [
      "SOLTERO~3~true~254",
      "HOMBRE_D~3~true~254",
      "HOMBRE_C~2~254",
      "ISAUTORIZCONYU~2~254",
      "DPFNAC_D~1~01/01/1985",
      "CAD_D~1~$region",
      "MUJER_D~2~254",
      "MUJER_C~2~254",
      "CASADO~2~254",
      "DECFAL~2~254",
      "PH18~3~0~254",
      "ECIVIL~3~SOLTERO/A~254",
      "VIUDO~2~254",
      "ECIVILC~1~1",
      "CAC_D~1~$code",
      "DP_APENOM_D~1~PRUEBA C OPEN",
      "EDADD~1~40",
      "SEPARADO~2~254",
      "DPNIF_C~2~254",
      "DPNIF_D~3~90000000B~254"
    ],
    "DESCENDIENTES": [
      "NIFOPDLG~1~90000001N",
      "APENOM_DAFAS_SR~1~PRUEBA HIJO",
      "APENOMDLG_SR~1~PRUEBA HIJO",
      "NOMH~1~HIJO",
      "FNACDLG~1~$birth",
      "EDADH~1~$age",
      "VINCU~1~D",
      "NIFH~1~90000002J",
      "MUJEROPDLG~1~true",
      "FNAC~1~$birth",
      "NIFDLG~1~90000002J",
      "VINCUDLG~1~D",
      "VNUMMDES~1~2",
      "NOMAPEOPDLG~1~PRUEBA OTRO PROGENITOR"
    ],
    "RWHIJOSMENOR18": [
      "UFHMENDLG~2~254",
      "MUJEROPDLGHMEN~1~true",
      "RENTASHMEN~1~-1",
      "FNACHMENDLG~1~$birth",
      "FNACHMEN~1~$birth",
      "NOMHMEN~1~HIJO",
      "NIFHMENDLG~1~90000002J",
      "VINCUHMENDLG~1~D",
      "CACHMENDLG~1~$code",
      "NOMAPEOPDLGHMEN~1~PRUEBA OTRO PROGENITOR",
      "CADHMENDLG~1~$region",
      "APENOMDLG_HMEN~1~PRUEBA HIJO",
      "NIFOPDLGHMEN~1~90000001N",
      "CACHMEN~1~$code",
      "NIFHMEN~1~90000002J"
    ],
    "RWHIJOSMAYOR18": [],
    "ASCENDIENTES": [],
    "OTROSPROGENITORES": [
      "NIFOP~1~90000001N",
      "NOMAPEOP~1~PRUEBA OTRO PROGENITOR",
      "MUJEROP~1~true"
    ]
  },
  "1-3": {
    "DP": [
      "SOLTERO~3~true~254",
      "HOMBRE_D~3~true~254",
      "HOMBRE_C~2~254",
      "ISAUTORIZCONYU~2~254",
      "DPFNAC_D~1~01/01/1985",
      "CAD_D~1~$region",
      "MUJER_D~2~254",
      "MUJER_C~2~254",
      "CASADO~2~254",
      "DECFAL~2~254",
      "PH18~3~0~254",
      "ECIVIL~3~SOLTERO/A~254",
      "VIUDO~2~254",
      "ECIVILC~1~1",
      "CAC_D~1~$code",
      "DP_APENOM_D~1~PRUEBA C OPEN",
      "EDADD~1~40",
      "SEPARADO~2~254",
      "DPNIF_C~2~254",
      "DPNIF_D~3~90000000B~254"
    ],
    "DESCENDIENTES": [
      "APENOM_DAFAS_SR~1~PRUEBA HIJO",
      "APENOMDLG_SR~1~PRUEBA HIJO",
      "NOMH~1~HIJO",
      "GUAROD~1~true",
      "FNACDLG~1~$birth",
      "EDADH~1~$age",
      "VINCU~1~B",
      "GUARD~1~true",
      "NIFH~1~90000002J",
      "FNAC~1~$birth",
      "NIFDLG~1~90000002J",
      "VINCUDLG~1~B",
      "VNUMMDES~1~1"
    ],
    "RWHIJOSMENOR18": [
      "UFHMENDLG~2~254",
      "RENTASHMEN~1~-1",
      "FNACHMENDLG~1~$birth",
      "FNACHMEN~1~$birth",
      "NOMHMEN~1~HIJO",
      "NIFHMENDLG~1~90000002J",
      "VINCUHMENDLG~1~B",
      "CACHMENDLG~1~$code",
      "CADHMENDLG~1~$region",
      "APENOMDLG_HMEN~1~PRUEBA HIJO",
      "CACHMEN~1~$code",
      "NIFHMEN~1~90000002J"
    ],
    "RWHIJOSMAYOR18": [],
    "ASCENDIENTES": [],
    "OTROSPROGENITORES": []
  },
  "1-16": {
    "DP": [
      "SOLTERO~3~true~254",
      "HOMBRE_D~3~true~254",
      "HOMBRE_C~2~254",
      "ISAUTORIZCONYU~2~254",
      "DPFNAC_D~1~01/01/1985",
      "CAD_D~1~$region",
      "MUJER_D~2~254",
      "MUJER_C~2~254",
      "CASADO~2~254",
      "DECFAL~2~254",
      "PH18~3~0~254",
      "ECIVIL~3~SOLTERO/A~254",
      "VIUDO~2~254",
      "ECIVILC~1~1",
      "CAC_D~1~$code",
      "DP_APENOM_D~1~PRUEBA C OPEN",
      "EDADD~1~40",
      "SEPARADO~2~254",
      "DPNIF_C~2~254",
      "DPNIF_D~3~90000000B~254"
    ],
    "DESCENDIENTES": [
      "APENOM_DAFAS_SR~1~PRUEBA HIJO",
      "APENOMDLG_SR~1~PRUEBA HIJO",
      "NOMH~1~HIJO",
      "FNACDLG~1~$birth",
      "EDADH~1~$age",
      "VINCU~1~B",
      "NIFH~1~90000002J",
      "FNAC~1~$birth",
      "NIFDLG~1~90000002J",
      "VINCUDLG~1~B",
      "VNUMMDES~1~1"
    ],
    "RWHIJOSMENOR18": [
      "UFHMENDLG~2~254",
      "RENTASHMEN~1~-1",
      "FNACHMENDLG~1~$birth",
      "FNACHMEN~1~$birth",
      "NOMHMEN~1~HIJO",
      "NIFHMENDLG~1~90000002J",
      "VINCUHMENDLG~1~B",
      "CACHMENDLG~1~$code",
      "CADHMENDLG~1~$region",
      "APENOMDLG_HMEN~1~PRUEBA HIJO",
      "CACHMEN~1~$code",
      "NIFHMEN~1~90000002J"
    ],
    "RWHIJOSMAYOR18": [],
    "ASCENDIENTES": [],
    "OTROSPROGENITORES": []
  },
  "1-2": {
    "DP": [
      "SOLTERO~3~true~254",
      "HOMBRE_D~3~true~254",
      "HOMBRE_C~2~254",
      "ISAUTORIZCONYU~2~254",
      "DPFNAC_D~1~01/01/1985",
      "CAD_D~1~$region",
      "MUJER_D~2~254",
      "MUJER_C~2~254",
      "CASADO~2~254",
      "DECFAL~2~254",
      "PH18~3~0~254",
      "ECIVIL~3~SOLTERO/A~254",
      "VIUDO~2~254",
      "ECIVILC~1~1",
      "CAC_D~1~$code",
      "DP_APENOM_D~1~PRUEBA C OPEN",
      "EDADD~1~40",
      "SEPARADO~2~254",
      "DPNIF_C~2~254",
      "DPNIF_D~3~90000000B~254"
    ],
    "DESCENDIENTES": [
      "APENOM_DAFAS_SR~1~PRUEBA HIJO",
      "APENOMDLG_SR~1~PRUEBA HIJO",
      "MATD~1~true",
      "NOMH~1~HIJO",
      "GUAROD~1~true",
      "MATOD~1~true",
      "FNACDLG~1~$birth",
      "EDADH~1~$age",
      "VINCU~1~B",
      "GUARD~1~true",
      "NIFH~1~90000002J",
      "FNAC~1~$birth",
      "NIFDLG~1~90000002J",
      "VINCUDLG~1~B",
      "VNUMMDES~1~1"
    ],
    "RWHIJOSMENOR18": [
      "UFHMENDLG~2~254",
      "RENTASHMEN~1~-1",
      "FNACHMENDLG~1~$birth",
      "FNACHMEN~1~$birth",
      "NOMHMEN~1~HIJO",
      "NIFHMENDLG~1~90000002J",
      "VINCUHMENDLG~1~B",
      "CACHMENDLG~1~$code",
      "CADHMENDLG~1~$region",
      "APENOMDLG_HMEN~1~PRUEBA HIJO",
      "CACHMEN~1~$code",
      "NIFHMEN~1~90000002J"
    ],
    "RWHIJOSMAYOR18": [],
    "ASCENDIENTES": [],
    "OTROSPROGENITORES": []
  }
};
export const familyCatalogDigests = ["8215e720ea75af37ef0fe4933097cce6a6ae62c48cc1380ce9ac2132bf3cfdfe","3e9b8662b52cbee1927f269058fdb1df5884c66ee5aa5718b1582b60dcda3f54","be5520e50daa759faa8c4195a603ad33daeb389f2ac043b39963abef025130f4"];

import { isDeepStrictEqual as equal } from 'node:util';
const regionalCodes = { madrid: '12', catalunya: '09', andalucia: '01', galicia: '11', 'comunitat-valenciana': '17' };
const entities = s => s.replace(/&(?:quot|amp|lt|gt|nbsp|#\d+|#x[0-9a-f]+);/gi, x => {
  const named = { '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': '\u00a0' };
  return named[x] ?? String.fromCodePoint(x.startsWith('&#x') ? parseInt(x.slice(3), 16) : parseInt(x.slice(2), 10));
});
// Lector del subconjunto serializado observado, nunca ejecuta HTML. Los valores
// vivos proceden del readback; value="" del HTML no borra un valor vivo.
export function familyHtmlControls(html) {
  ensure(string(html) && html.length <= 8 * 1024 * 1024, 'familia-html-ausente');
  const clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const stack = [], inputs = [], ids = new Set();
  for (const token of clean.matchAll(/<\/?([a-z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
    const tag = token[1].toLowerCase();
    if (token[0].startsWith('</')) {
      const i = stack.findLastIndex(x => x.tag === tag);
      if (i >= 0) stack.length = i;
      continue;
    }
    const attrs = {};
    const body = token[0].slice(token[1].length + 1, -1);
    for (const a of body.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      const k = a[1].toLowerCase(); ensure(!Object.hasOwn(attrs, k), 'familia-html-atributo-duplicado');
      attrs[k] = entities(a[2] ?? a[3] ?? a[4] ?? '');
    }
    ensure(!['textarea', 'select'].includes(tag), 'familia-html-control-no-observado');
    if (tag === 'input') {
      ensure(attrs.id && !ids.has(attrs.id), 'familia-html-id-ambiguo'); ids.add(attrs.id);
      inputs.push({ id: attrs.id, title: attrs.title ?? '', parentTitle: stack.at(-1)?.attrs.title ?? '',
        type: attrs.type ?? 'text', disabled: Object.hasOwn(attrs, 'disabled'),
        value: attrs.value ?? '', checked: Object.hasOwn(attrs, 'checked') });
    }
    if (!['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'].includes(tag)
      && !token[0].endsWith('/>')) stack.push({tag, attrs});
  }
  return inputs;
}

export function familyCatalogReadback(text, catalogos) {
  ensure(/^<\?xml[^\n]*VersionReglas="N000088955"[^\n]*VersionModelo="0\.12"[^\n]*\?><PERSISTENCIAV2>/.test(text), 'familia-version-no-observada');
  ensure(Array.isArray(catalogos) && catalogos.length === 3, 'familia-catalogos-ausentes');
  const titles = ['Grado de discapacidad:', 'Clave discapacidad:', 'Otras situaciones (*):'];
  catalogos.forEach((raw, i) => {
    ensure(string(raw) && digest(raw) === familyCatalogDigests[i], 'familia-catalogo-distinto');
    const c = JSON.parse(raw);
    ensure(c.title === titles[i] && c.before === ' ' && c.after === ' '
      && c.items.length === 5 && c.items[0].text === '\u00a0Borrar'
      && c.html.includes(`id="${c.popupId}"`), 'familia-catalogo-no-corresponde');
  });
  return { version: '0.12', reglas: 'N000088955', sha256: [...familyCatalogDigests],
    alcance: 'Opciones globales; los valores de cada caso se comprueban en su propia captura' };
}

export function familyCensusReadback(text, caso, evidence) {
  const p = validateSyntheticFamilyCase(caso), { records, sections } = parse(text);
  ensure(sections.every(s => Object.hasOwn(observedSesKeys,s.path))
    && records.every(r => observedSesKeys[r.path]?.includes(r.key))
    && sections.every(s => new Set(s.records.map(r => r.key)).size === s.records.length), 'familia-ses-estructura-extra');
  const code = regionalCodes[p.territorio]; ensure(code, 'familia-territorio-no-observado');
  const personal = evidence.familyControls?.personal, html = familyHtmlControls(evidence.personalHtml);
  const expected = personalTemplate.map(r => ({...r, value: r.value === '$region' ? names[p.territorio] : r.value === '$birth' ? p.fechaNacimientoSES : r.value}));
  ensure(equal(personal, expected) && html.length === 41, 'familia-censo-personal-distinto');
  html.forEach((r, i) => {
    const e = expected[i];
    ensure(r.title === e.title && r.parentTitle === e.parentTitle && r.type === e.type
      && r.disabled === e.disabled && (!r.value.trim() || r.value === e.value)
      && (!r.checked || e.checked), 'familia-censo-html-contradictorio');
  });
  const dialog = familyHtmlControls(evidence.dialogoHtml);
  const dialogValues = dialog.map(r => Object.fromEntries(Object.entries(r).filter(([key]) => key !== 'id')));
  ensure(equal(dialogValues, dialogTemplates[p.titulares]), 'familia-dialogo-censo-distinto');
  for (const r of evidence.familyControls.rows) {
    const found = dialog.filter(x => x.id === r.dom.id);
    ensure(found.length === 1 && found[0].type === r.dom.type && found[0].disabled === r.dom.disabled
      && (r.kind === 'checkbox' || found[0].parentTitle === r.dom.containerTitle)
      && (!found[0].value.trim() || found[0].value === r.dom.value)
      && (!found[0].checked || r.dom.checked), 'familia-dialogo-contradictorio');
  }
  const template = sesTemplates[p.titulares + '-' + p.edad];
  ensure(template, 'familia-censo-no-observado');
  for (const [name, lines] of Object.entries(template)) {
    ensure(sections.filter(s => s.name === name).length === 1, 'familia-censo-bloque-duplicado');
    const path = name === 'DP' ? 'DECLARACIONES/DP' : name === 'OTROSPROGENITORES'
      ? 'DECLARACIONES/OTROSPROGENITORES' : `DECLARACIONES/DP/${name}`;
    const observed = records.filter(r => r.path === path).map(r => `${r.key}~${r.type}~${r.value}${r.suffix ? '~'+r.suffix : ''}`).sort();
    const wanted = lines.map(l => l.replaceAll('$birth', p.fechaNacimientoSES).replaceAll('$age', String(p.edad))
      .replaceAll('$region', names[p.territorio]).replaceAll('$code', code)).sort();
    ensure(equal(observed, wanted), 'familia-censo-ses-distinto');
  }
  ensure(sections.filter(s => /^(?:ASCENDIENTES|DESCENDIENTES|RWHIJOSMENOR18|RWHIJOSMAYOR18|OTROSPROGENITORES)$/.test(s.name))
    .every(s => s.records.length || ['ASCENDIENTES','RWHIJOSMAYOR18','OTROSPROGENITORES'].includes(s.name)), 'familia-censo-bloque-extra');
  const irpf = { ZDNIU1: '90000002J', ZANOU1: p.fechaNacimientoSES, ZAPENU1: 'PRUEBA HIJO', VINCU1: p.vinculoSES };
  if (p.otroTitularId) {
    Object.assign(irpf, { NIFOP01: '90000001N', NOMAPEOP01: 'PRUEBA OTRO PROGENITOR', SEXOOP01: 'M', OROP1: '1' });
  }
  for (const [key,value] of Object.entries(irpf)) {
    const rs = records.filter(r => r.key === key);
    ensure(rs.length === 1 && rs[0].path === 'DECLARACIONES/IRPF2025' && rs[0].type === '1'
      && rs[0].value === value && !rs[0].suffix, 'familia-censo-irpf-distinto');
  }
  ensure(!records.some(r => /^(?:ZDNIU|ZANOU|ZAPENU|VINCU|NIFOP|NOMAPEOP|SEXOOP|OROP)\d+$/.test(r.key)
    && !Object.hasOwn(irpf,r.key)), 'familia-censo-ordinal-extra');
  for (const [key,value] of Object.entries({ NIFOPAUX: '90000001N', NOMAPEOPAUX: 'PRUEBA OTRO PROGENITOR', MUJEROPAUX: 'true' })) {
    const rs = records.filter(r => r.key === key);
    ensure(p.otroTitularId ? rs.length === 1 && rs[0].path === 'DECLARACIONES' && rs[0].type === '1'
      && !rs[0].suffix && rs[0].value === value : rs.length === 0, 'familia-progenitor-ses-distinto');
  }
  return { controlesPersonales: 41, descendientesActivos: 1, ascendientesActivos: 0 };
}

export function familyMoneyReadback(caso, evidence) {
  const e = caso.entradaAPI ?? caso.entrada, work = e.trabajo?.rendimientos, ret = e.retenciones;
  ensure(work?.length === 1 && ret?.length === 1, 'familia-trabajo-fuera-corte');
  const w = work[0];
  ensure(w.cotizaciones.derechosPasivos === '0' && w.cotizaciones.colegiosHuerfanos === '0'
    && ['sindicato','colegio','defensa'].every(k => w[k]?.importe === '0'), 'familia-gastos-fuera-corte');
  const wanted = { IDII: w.integro, GSS: w.cotizaciones.seguridadSocial, IDRE: ret[0].importe,
    GCS: '0.00', GCC: '0.00', GDJ: '0.00', IDICLDED2: w.integro, GSSCLDED2: w.cotizaciones.seguridadSocial };
  for (const [key, value] of Object.entries(wanted)) {
    const rs = evidence.readbacks.filter(r => r.key === key);
    ensure(rs.length === 1, 'familia-moneda-ausente-o-duplicada');
    const r = rs[0], observed = r.observed === '' ? '0.00' : string(r.observed)
      && /^(?:\d{1,3}(?:\.\d{3})+|\d+),\d{2}$/.test(r.observed)
      ? r.observed.replaceAll('.','').replace(',','.') : null;
    ensure(r.requested === value && observed === value, 'familia-moneda-distinta');
  }
  return { controles: Object.keys(wanted), estado: 'ocho-readbacks-coincidentes' };
}

export function completeFamilyReadback(text, caso, evidence) {
  const partial = partialFamilyReadback(text, caso, evidence);
  // El legado sigue siendo parcial; sólo el contrato con artefactos completos
  // opta al nuevo binding. Ningún checkbox prueba un hecho vital externo.
  if (evidence.catalogos === undefined) return partial;
  const catalogo = familyCatalogReadback(text, evidence.catalogos);
  const censo = familyCensusReadback(text, caso, evidence);
  const monetarios = familyMoneyReadback(caso, evidence);
  const closed = ['ausencia-otros-familiares-inventario-completo',
    'opciones-vacias-discapacidad-y-situaciones-semantica-ui', 'opcion-vacia-discapacidad-declarante-semantica-ui'];
  const faltantes = partial.faltantes.filter(x => !closed.includes(x));
  return { ...partial, estado: 'proyeccion-sintetica-de-predicados', aptoParaBindingSintetico: faltantes.length === 0,
    faltantes, catalogo, censo, monetarios,
    hechosNoIntroducidosExactamente: ['renta-exacta-cero','no-presentacion-absoluta-declaracion',
      'custodia-juridica','convivencia-efectiva','situacion-vital-otro-progenitor','autenticidad-aeat'],
    limite: 'Proyección sintética al mínimo ordinario, sin otras deducciones. B/D y opciones vacías observados; no acredita hechos jurídicos o vitales. Controles deshabilitados conservan sólo su estado UI. GUARD/GUAROD/RENTASHMEN/MATD/MATOD sin semántica inferida.' };
}
